"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { useNotification } from "@/contexts/NotificationContext";
import { getErrorMessage } from "@/lib/api/client";
import { ordersService, OrderFull, OrderItemFull, DeliveryMethod } from "@/services/orders.service";
import { formatCurrency, calculateOrderTotals, resolveExchangeRate } from "@/lib/money";
import { DeliveryDatePicker } from "@/components/DeliveryDatePicker/DeliveryDatePicker";
import { PedidoItemsTable, usePedidoItemsColumns } from "./PedidoItemsTable";
import { ORDER_STATUS_LABELS } from "@/lib/statusChips";
import type { SupplierOrderStatus } from "@/services/dashboard.service";
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Grid,
  Divider,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";

// Formats using local calendar fields (not toISOString, which converts to
// UTC and can shift the date backward/forward depending on the timezone
// offset sign — this field only ever needs the calendar day, not a time).
function toDateOnlyString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Parses a `YYYY-MM-DD` calendar day as a local date (new Date("YYYY-MM-DD")
// would be read as UTC and could show the previous day).
function parseDateOnly(value: string): Date {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
}

interface PedidoDetailClientProps {
  orderId: number;
}

export default function PedidoDetailClient({ orderId }: PedidoDetailClientProps) {
  const router = useRouter();
  const { showError } = useNotification();
  const columns = usePedidoItemsColumns();
  const [order, setOrder] = useState<OrderFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<OrderItemFull[]>([]);
  const [originalQuantities, setOriginalQuantities] = useState<Record<number, number>>({});
  const [pickerItemId, setPickerItemId] = useState<number | null>(null);
  const [deliveryDates, setDeliveryDates] = useState<Record<number, Date>>({});
  const [deliveryMethodIds, setDeliveryMethodIds] = useState<Record<number, number>>({});
  const [availableDeliveryMethods, setAvailableDeliveryMethods] = useState<DeliveryMethod[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const allowed = order?.allowed_actions;
  const canEditQuantities = allowed?.editQuantities ?? false;
  const canEditDates = allowed?.editDeliveryDates ?? false;
  const canAccept = allowed?.accept ?? false;

  // `silent` refreshes in the background (focus) without replacing the screen
  // by the loading state.
  const loadOrder = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        setOrder(await ordersService.getOrderFull(orderId));
        setError(null);
      } catch (err) {
        if (!silent) setError(getErrorMessage(err) || "No se pudo cargar el pedido");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [orderId]
  );

  // Load order on mount
  useEffect(() => {
    if (!isNaN(orderId)) {
      // eslint-disable-next-line
      loadOrder();
    }
  }, [orderId, loadOrder]);

  // Load delivery methods on mount
  useEffect(() => {
    ordersService.getDeliveryMethods()
      .then(methods => setAvailableDeliveryMethods(methods))
      .catch(() => {
        // Fall back to empty array - component will use defaults
        setAvailableDeliveryMethods([]);
      });
  }, []);

  // Fechas y métodos de entrega guardados en cada línea del pedido cargado
  const originalDeliveries = useMemo(() => {
    const dates: Record<number, Date> = {};
    const methods: Record<number, number> = {};
    order?.order_items?.forEach((item) => {
      if (item.scheduled_delivery_date) dates[item.id] = parseDateOnly(item.scheduled_delivery_date);
      if (item.delivery_method_id) methods[item.id] = item.delivery_method_id;
    });
    return { dates, methods };
  }, [order?.order_items]);

  // Sync items and delivery data when order data changes
  useEffect(() => {
    if (order?.order_items) {
      // eslint-disable-next-line
      setItems(order.order_items);
      const orig: Record<number, number> = {};
      order.order_items.forEach((i) => { orig[i.id] = i.requested_quantity; });
      setOriginalQuantities(orig);
    }
    // Restore saved delivery dates and methods from the order lines
    if (order) {
      setDeliveryDates(originalDeliveries.dates);
      setDeliveryMethodIds(originalDeliveries.methods);
    }
    // eslint-disable-next-line
  }, [order?.order_items, originalDeliveries]);

  // Totales: los del back mientras no haya cantidades sin guardar; si el
  // proveedor las cambió, se recalculan en vivo con la misma fórmula.
  const totals = useMemo(() => {
    if (!order?.totals) return null;
    const quantitiesChanged = items.some(
      (item) => item.requested_quantity !== originalQuantities[item.id]
    );
    if (!quantitiesChanged) return order.totals;
    return calculateOrderTotals(
      items.map((item) => ({
        unitPrice: Number(item.unit_price),
        quantity: item.requested_quantity,
        currency: item.currency,
        exchangeRate: resolveExchangeRate(
          {
            currency: item.currency,
            exchangeRate: item.exchange_rate === null ? null : Number(item.exchange_rate),
          },
          {
            currency: item.product.currency,
            exchangeRate:
              item.product.exchange_rate === null ? null : Number(item.product.exchange_rate),
          },
        ),
      }))
    );
  }, [order?.totals, items, originalQuantities]);

  // Hay cambios sin guardar: cantidades, fechas o métodos de entrega distintos
  // a los del pedido cargado.
  const hasChanges = useMemo(() => {
    const { dates, methods } = originalDeliveries;
    return items.some((item) => {
      if (item.requested_quantity !== originalQuantities[item.id]) return true;
      if (deliveryMethodIds[item.id] !== methods[item.id]) return true;
      const current = deliveryDates[item.id];
      const original = dates[item.id];
      if (!current || !original) return current !== original;
      return toDateOnlyString(current) !== toDateOnlyString(original);
    });
  }, [items, originalQuantities, deliveryDates, deliveryMethodIds, originalDeliveries]);

  const handleBack = () => {
    router.push("/pedidos");
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const updateItemQuantity = (itemId: number, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const max = item.original_requested_quantity;
        const min = item.delivered_quantity;
        return {
          ...item,
          requested_quantity: Math.min(max, Math.max(min, item.requested_quantity + delta)),
        };
      })
    );
  };

  const hasItemDeliveryChange = (itemId: number): boolean => {
    const current = deliveryDates[itemId];
    const original = originalDeliveries.dates[itemId];
    if (deliveryMethodIds[itemId] !== originalDeliveries.methods[itemId]) return true;
    if (!current || !original) return current !== original;
    return toDateOnlyString(current) !== toDateOnlyString(original);
  };

  const handleUpdateData = async () => {
    setSaving(true);
    try {
      // Solo viajan las líneas con cambios; la cantidad solo si el back aún la deja editar.
      const updatedItems = items
        .filter(
          (item) =>
            (canEditQuantities && item.requested_quantity !== originalQuantities[item.id]) ||
            (canEditDates && hasItemDeliveryChange(item.id))
        )
        .map((item) => ({
          itemId: item.id,
          ...(canEditQuantities ? { requestedQuantity: item.requested_quantity } : {}),
          ...(canEditDates && deliveryDates[item.id]
            ? {
                deliveryDate: toDateOnlyString(deliveryDates[item.id]),
                deliveryMethodId: deliveryMethodIds[item.id],
              }
            : {}),
        }));

      setOrder(await ordersService.updateOrder(orderId, { items: updatedItems }));
      setSnackbar({ open: true, message: "Datos actualizados exitosamente", severity: "success" });
    } catch (err) {
      setSnackbar({
        open: true,
        message: getErrorMessage(err) || "Error al actualizar los datos",
        severity: "error",
      });
      // Un 409 significa que el pedido cambió en Foly: se vuelve a leer su estado.
      await loadOrder(true);
    } finally {
      setSaving(false);
    }
  };

  // Aceptar exige al menos una línea con cantidad y fecha en cada línea con cantidad.
  const acceptValidationError = useMemo((): string | null => {
    if (items.every((item) => item.requested_quantity === 0)) {
      return "Confirma al menos un artículo con cantidad mayor a 0.";
    }
    const missingDate = items.some(
      (item) => item.requested_quantity > 0 && !deliveryDates[item.id]
    );
    return missingDate ? "Define la fecha de entrega de cada artículo con cantidad." : null;
  }, [items, deliveryDates]);

  const handleAcceptClick = () => {
    if (acceptValidationError) {
      showError(acceptValidationError);
      return;
    }
    setAcceptDialogOpen(true);
  };

  const handleConfirmAccept = async () => {
    setSaving(true);
    try {
      const updated = await ordersService.acceptOrder(orderId, {
        items: items.map((item) => ({
          itemId: item.id,
          confirmedQuantity: item.requested_quantity,
          ...(item.requested_quantity > 0 && deliveryDates[item.id]
            ? {
                deliveryDate: toDateOnlyString(deliveryDates[item.id]),
                deliveryMethodId: deliveryMethodIds[item.id],
              }
            : {}),
        })),
      });
      setOrder(updated);
      setAcceptDialogOpen(false);
      setSnackbar({ open: true, message: "Pedido aceptado", severity: "success" });
    } catch (err) {
      setAcceptDialogOpen(false);
      setSnackbar({
        open: true,
        message: getErrorMessage(err) || "No se pudo aceptar el pedido",
        severity: "error",
      });
      await loadOrder(true);
    } finally {
      setSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    if (order?.order_items) {
      setItems(order.order_items);
      setDeliveryDates(originalDeliveries.dates);
      setDeliveryMethodIds(originalDeliveries.methods);
    }
  };

  // Volver a pedir los datos al recuperar el foco, salvo que haya cambios sin
  // guardar que se perderían.
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible" && !hasChanges && !saving && !acceptDialogOpen) {
        loadOrder(true);
      }
    };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [hasChanges, saving, acceptDialogOpen, loadOrder]);

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary">Cargando detalles del pedido...</Typography>
        </Box>
      </MainLayout>
    );
  }

  if (error || !order) {
    return (
      <MainLayout>
        <Box sx={{ p: 3 }}>
          <Typography color="error">{error || "Pedido no encontrado"}</Typography>
          <Button variant="contained" onClick={handleBack} sx={{ mt: 2 }}>
            Volver a pedidos
          </Button>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        {/* Header with breadcrumb */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={handleBack} size="small" sx={{ p: 0.5 }}>
              <ArrowBack sx={{ fontSize: 18, color: "text.secondary" }} />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              Pedidos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              &gt;
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {order.folio}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5 }}>
            {(canEditQuantities || canEditDates) && (
            <Button
              variant="outlined"
              onClick={handleDiscardChanges}
              disabled={!hasChanges || saving}
              sx={{
                borderColor: "#d0d5dd",
                color: "#344054",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.875rem",
                px: 2,
                py: 0.75,
                borderRadius: 1.5,
                "&:hover": { borderColor: "#b0b7c3", bgcolor: "transparent" },
              }}
            >
              Descartar cambios
            </Button>
            )}
            {(canEditQuantities || canEditDates) && (
              <Button
                variant="contained"
                onClick={handleUpdateData}
                disabled={!hasChanges || saving}
                sx={{
                  bgcolor: "#1570EF",
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  px: 2,
                  py: 0.75,
                  borderRadius: 1.5,
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#1462d4", boxShadow: "none" },
                }}
              >
                Actualizar datos
              </Button>
            )}
            {canAccept && (
              <Button
                variant="contained"
                onClick={handleAcceptClick}
                disabled={saving}
                sx={{
                  bgcolor: "#039855",
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  px: 2,
                  py: 0.75,
                  borderRadius: 1.5,
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#027a48", boxShadow: "none" },
                }}
              >
                Aceptar pedido
              </Button>
            )}
          </Box>
        </Box>

        {/* Invoice section */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: "0.75rem" }}
          >
            Factura
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.25, fontSize: "1.75rem", lineHeight: 1.2 }}>
            Pedido {order.folio}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: "0.875rem" }}>
            Creado el {formatDate(order.order_date)}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mt: 1.5, alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Typography variant="body2" sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Pedido:</Typography>
              <Typography variant="body2" sx={{ fontSize: "0.875rem", color: "#F04438", fontWeight: 500 }}>
                {ORDER_STATUS_LABELS[order.status as SupplierOrderStatus] ?? order.status}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Typography variant="body2" sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Pago:</Typography>
              <Typography variant="body2" sx={{ fontSize: "0.875rem", color: "#F04438", fontWeight: 500 }}>
                Pendiente
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* Main content */}
          <Grid size={{ xs: 12, lg: 8 }}>
            {/* Supplier & Warehouse Card */}
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                px: 3,
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 3,
                border: "1px solid #e4e7ec",
                borderRadius: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: "1rem", color: "#101828" }}>
                  {order.branch?.name || "Mabe S.A. de C.V"}
                </Typography>
              </Box>
              <ArrowForward sx={{ color: "#98a2b3", fontSize: 20, flexShrink: 0 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: "1rem", color: "#101828" }}>
                  Bodega
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem", mt: 0.25 }}>
                  Por recibir
                </Typography>
              </Box>
            </Paper>

            <Typography variant="body2" sx={{ mb: 2, color: "text.secondary", fontSize: "0.875rem" }}>
              {canAccept
                ? "Confirma la cantidad y define una fecha de entrega para cada artículo antes de aceptar el pedido"
                : canEditDates
                  ? "Puedes actualizar la fecha de entrega de los artículos pendientes. Las cantidades ya no se pueden cambiar; para ajustes, contacta a Compras de Foly."
                  : "Este pedido ya no admite cambios."}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
              <Button
                size="small"
                onClick={columns.resetAll}
                disabled={columns.isDefault}
                sx={{ textTransform: "none", fontSize: "0.8125rem" }}
              >
                Restablecer columnas
              </Button>
            </Box>
            <PedidoItemsTable
              items={items}
              deliveryDates={deliveryDates}
              deliveryMethodIds={deliveryMethodIds}
              deliveryMethods={availableDeliveryMethods}
              canEditDates={canEditDates}
              canEditQuantities={canEditQuantities}
              columns={columns}
              onOpenPicker={setPickerItemId}
              onChangeQuantity={updateItemQuantity}
            />
          </Grid>

          {/* Delivery Date Picker Modal */}
          <DeliveryDatePicker
            open={pickerItemId !== null}
            onClose={() => setPickerItemId(null)}
            selectedDate={pickerItemId !== null ? (deliveryDates[pickerItemId] ?? null) : null}
            deliveryMethods={availableDeliveryMethods}
            selectedMethodId={pickerItemId !== null ? (deliveryMethodIds[pickerItemId] ?? null) : null}
            onSelect={(date, methodId) => {
              if (pickerItemId !== null) {
                setDeliveryDates(prev => ({ ...prev, [pickerItemId]: date }));
                setDeliveryMethodIds(prev => ({ ...prev, [pickerItemId]: methodId }));
                setPickerItemId(null);
              }
            }}
          />

          {/* Summary */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: "#f9fafb",
                border: "1px solid #e4e7ec",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, fontSize: "1rem", color: "#101828" }}>
                Resumen
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography variant="body2" sx={{ color: "#667085", fontSize: "0.875rem" }}>
                  Subtotal
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.875rem", color: "#101828" }}>
                  {formatCurrency(totals?.subtotal, totals?.currency)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography variant="body2" sx={{ color: "#667085", fontSize: "0.875rem" }}>
                  IVA
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.875rem", color: "#101828" }}>
                  {formatCurrency(totals?.iva, totals?.currency)}
                </Typography>
              </Box>

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 1.5,
                  px: 2,
                  bgcolor: "#f2f4f7",
                  borderRadius: 1.5,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.875rem", color: "#101828" }}>
                  Total
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, fontSize: "0.875rem", color: "#101828" }}>
                  {formatCurrency(totals?.total, totals?.currency)}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Dialog open={acceptDialogOpen} onClose={() => !saving && setAcceptDialogOpen(false)}>
        <DialogTitle>Aceptar pedido {order.folio}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Al aceptar el pedido se confirman las cantidades y las fechas de entrega. Después de
            aceptarlo ya no podrás cambiar las cantidades ni el costo; solo podrás actualizar las
            fechas de entrega. Cualquier ajuste posterior lo realiza Compras de Foly.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAcceptDialogOpen(false)} disabled={saving} sx={{ textTransform: "none" }}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmAccept} variant="contained" disabled={saving} sx={{ textTransform: "none" }}>
            Aceptar pedido
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
}
