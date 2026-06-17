"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { useApi } from "@/hooks/useApi";
import { ordersService, OrderFull, OrderItemFull, DeliveryMethod } from "@/services/orders.service";
import { DeliveryDatePicker, formatShortDate } from "@/components/DeliveryDatePicker/DeliveryDatePicker";
import { AddFacturaDrawer, FacturaFormData } from "@/components/AddFacturaDrawer/AddFacturaDrawer";
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Grid,
  Divider,
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  CalendarToday,
  Inventory,
} from "@mui/icons-material";

const STATUS_MAP: Record<string, string> = {
  pending: "Pendiente",
  approved: "Aprobado",
  in_process: "En proceso",
  partially_received: "Parcialmente surtido",
  received: "Surtido",
  cancelled: "Cancelado",
};

interface PedidoDetailClientProps {
  orderId: number;
}

export default function PedidoDetailClient({ orderId }: PedidoDetailClientProps) {
  const router = useRouter();
  const { execute, loading, data: order } = useApi<OrderFull>();
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<OrderItemFull[]>([]);
  const [originalQuantities, setOriginalQuantities] = useState<Record<number, number>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [pickerItemId, setPickerItemId] = useState<number | null>(null);
  const [deliveryDates, setDeliveryDates] = useState<Record<number, Date>>({});
  const [deliveryMethodIds, setDeliveryMethodIds] = useState<Record<number, number>>({});
  const [activeTab, setActiveTab] = useState<"articulos" | "facturas">("articulos");
  const [addFacturaOpen, setAddFacturaOpen] = useState(false);
  const [facturas, setFacturas] = useState<FacturaFormData[]>([]);
  const [availableDeliveryMethods, setAvailableDeliveryMethods] = useState<DeliveryMethod[]>([]);

  const loadOrder = async () => {
    try {
      await execute(() => ordersService.getOrderFull(orderId), {
        showErrorNotification: true,
      });
    } catch {
      setError("No se pudo cargar el pedido");
    }
  };

  // Load order on mount
  useEffect(() => {
    if (!isNaN(orderId)) {
      // eslint-disable-next-line
      loadOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // Load delivery methods on mount
  useEffect(() => {
    ordersService.getDeliveryMethods()
      .then(methods => setAvailableDeliveryMethods(methods))
      .catch(() => {
        // Fall back to empty array - component will use defaults
        setAvailableDeliveryMethods([]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync items and delivery data when order data changes
  useEffect(() => {
    if (order?.order_items) {
      // eslint-disable-next-line
      setItems(order.order_items);
      const orig: Record<number, number> = {};
      order.order_items.forEach((i) => { orig[i.id] = i.requested_quantity; });
      setOriginalQuantities(orig);
    }
    // Load saved delivery dates and methods from order_deliveries
    if (order?.order_deliveries && order.order_deliveries.length > 0) {
      const dates: Record<number, Date> = {};
      const methods: Record<number, number> = {};
      order.order_deliveries.forEach(delivery => {
        // Find the order_item_id from order_delivery_items
        if (delivery.order_delivery_items && delivery.order_delivery_items.length > 0) {
          delivery.order_delivery_items.forEach(item => {
            dates[item.order_item_id] = new Date(delivery.delivery_date);
            if (delivery.delivery_method_id) {
              methods[item.order_item_id] = delivery.delivery_method_id;
            }
          });
        }
      });
      setDeliveryDates(dates);
      setDeliveryMethodIds(methods);
    }
    // eslint-disable-next-line
  }, [order?.order_items, order?.order_deliveries]);

  // Load invoices when switching to facturas tab
  useEffect(() => {
    if (activeTab === "facturas" && order) {
      ordersService.getOrderInvoices(orderId).then((data) => {
        setFacturas(data.map((inv) => ({
          subtotal: inv.subtotal,
          iva: inv.iva,
          total: inv.total,
          pdfFile: null,
          xmlFile: null,
        })));
      }).catch(() => {
        // Silently fail - will show empty state
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, order, orderId]);

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

  const formatCurrency = (value: number | string | null): string => {
    if (value === null || value === undefined) return "$0.00";
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return `$${numValue.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
  };

  const calculateSubtotal = (): number => {
    return items.reduce((sum, item) => {
      const cost = parseFloat(item.product.list_cost || "0");
      return sum + cost * item.requested_quantity;
    }, 0);
  };

  const calculateIVA = (): number => {
    return calculateSubtotal() * 0.16;
  };

  const calculateTotal = (): number => {
    return calculateSubtotal() + calculateIVA();
  };

  const updateItemQuantity = (itemId: number, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const newQty = item.requested_quantity + delta;
        if (delta > 0 && newQty > (originalQuantities[itemId] ?? item.requested_quantity)) {
          return item;
        }
        return { ...item, requested_quantity: Math.max(0, newQty) };
      })
    );
    setHasChanges(true);
  };

  const handleUpdateData = async () => {
    try {
      // Prepare items with delivery dates and methods
      const updatedItems = items.map((item) => ({
        itemId: item.id,
        requestedQuantity: item.requested_quantity,
        deliveryDate: deliveryDates[item.id]?.toISOString(),
        deliveryMethodId: deliveryMethodIds[item.id],
      }));

      await ordersService.updateOrder(orderId, { items: updatedItems });

      // Reload order to get fresh data
      await loadOrder();
      setHasChanges(false);
      setDeliveryDates({}); // Clear local delivery dates after save
      setDeliveryMethodIds({}); // Clear local delivery method IDs after save

      // Show success notification
      alert("Datos actualizados exitosamente");
    } catch {
      alert("Error al actualizar los datos");
    }
  };

  const handleDiscardChanges = () => {
    if (order?.order_items) {
      setItems(order.order_items);
      setDeliveryDates({});
      setDeliveryMethodIds({});
      setHasChanges(false);
    }
    // Navigate back to orders list
    router.push("/pedidos");
  };

  const handleAddFactura = async (data: FacturaFormData) => {
    try {
      await ordersService.createInvoice(orderId, {
        subtotal: data.subtotal,
        iva: data.iva,
        total: data.total,
        pdfFile: data.pdfFile,
        xmlFile: data.xmlFile,
      });

      // Refresh invoices
      const updatedInvoices = await ordersService.getOrderInvoices(orderId);
      setFacturas(
        updatedInvoices.map((inv) => ({
          subtotal: inv.subtotal,
          iva: inv.iva,
          total: inv.total,
          pdfUrl: inv.pdfUrl,
          xmlUrl: inv.xmlUrl,
          pdfFile: null,
          xmlFile: null,
        }))
      );

      setAddFacturaOpen(false);
    } catch {
      alert("Error al agregar factura");
    }
  };

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
              {order.id}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
              variant="outlined"
              onClick={handleDiscardChanges}
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
            <Button
              variant="contained"
              onClick={handleUpdateData}
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
            Pedido {order.id}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: "0.875rem" }}>
            Creado el {formatDate(order.order_date)}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mt: 1.5, alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Typography variant="body2" sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Pedido:</Typography>
              <Typography variant="body2" sx={{ fontSize: "0.875rem", color: "#F04438", fontWeight: 500 }}>
                {STATUS_MAP[order.status] || order.status}
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
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem", mt: 0.25 }}>
                  {order.created_by || "123456789"}
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

            {/* Tabs */}
            <Box sx={{ display: "flex", gap: 0.5, mb: 2 }}>
              {(["articulos", "facturas"] as const).map((tab) => {
                const isActive = activeTab === tab;
                const label = tab === "articulos" ? "Artículos" : "Facturas";
                return (
                  <Box
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    sx={{
                      px: 2,
                      py: 0.875,
                      borderRadius: 1.5,
                      cursor: "pointer",
                      bgcolor: isActive ? "#ffffff" : "transparent",
                      border: isActive ? "1px solid #e4e7ec" : "1px solid transparent",
                      boxShadow: isActive ? "0px 1px 3px rgba(16,24,40,0.08)" : "none",
                      transition: "all 0.15s",
                      "&:hover": { bgcolor: isActive ? "#ffffff" : "#f9fafb" },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? "#101828" : "#667085",
                      }}
                    >
                      {label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            {/* Tab: Artículos */}
            {activeTab === "articulos" && (
              <>
                <Typography variant="body2" sx={{ mb: 2, color: "text.secondary", fontSize: "0.875rem" }}>
                  Define una fecha de entrega para los artículos solicitados
                </Typography>
                <Paper elevation={0} sx={{ overflow: "hidden", border: "1px solid #e4e7ec", borderRadius: 2 }}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1.5fr 1fr 120px",
                      gap: 2,
                      px: 3,
                      py: 1.5,
                      bgcolor: "#ffffff",
                      borderBottom: "1px solid #e4e7ec",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8125rem" }}>Nombre</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8125rem" }}>Fecha de entrega</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: "right", fontSize: "0.8125rem" }}>Costo unitario</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", fontSize: "0.8125rem" }}>Pedido</Typography>
                  </Box>
                  {items.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1.5fr 1fr 120px",
                        gap: 2,
                        px: 3,
                        py: 1.75,
                        alignItems: "center",
                        borderBottom: "1px solid #f2f4f7",
                        bgcolor: "white",
                        "&:last-child": { borderBottom: "none" },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{ width: 36, height: 36, bgcolor: "#f2f4f7", borderRadius: 1.5, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Inventory sx={{ fontSize: 18, color: "#98a2b3" }} />
                        </Box>
                        <Typography variant="body2" noWrap title={item.product.short_name} sx={{ fontSize: "0.875rem", color: "#101828" }}>
                          {item.product.short_name}
                        </Typography>
                      </Box>
                      <Box
                        onClick={() => setPickerItemId(item.id)}
                        sx={{
                          display: "flex", alignItems: "center", gap: 1,
                          px: 1.5, py: 0.75,
                          border: `1px solid ${deliveryDates[item.id] ? "#1570EF" : "#d0d5dd"}`,
                          borderRadius: 1.5, bgcolor: "#ffffff", cursor: "pointer",
                          "&:hover": { borderColor: "#98a2b3" },
                        }}
                      >
                        <Typography variant="body2" sx={{ fontSize: "0.875rem", color: deliveryDates[item.id] ? "#1570EF" : "#98a2b3", flex: 1 }}>
                          {deliveryDates[item.id] ? `${formatShortDate(deliveryDates[item.id])} (${availableDeliveryMethods.find(m => m.id === deliveryMethodIds[item.id])?.name || "sin método"})` : "Seleccionar"}
                        </Typography>
                        <CalendarToday sx={{ fontSize: 16, color: deliveryDates[item.id] ? "#1570EF" : "#667085", flexShrink: 0 }} />
                      </Box>
                      <Typography variant="body2" sx={{ textAlign: "right", fontWeight: 500, fontSize: "0.875rem", color: "#101828" }}>
                        {formatCurrency(item.product.list_cost)}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                        <IconButton size="small" onClick={() => updateItemQuantity(item.id, -1)} disabled={item.requested_quantity <= 0}
                          sx={{ width: 24, height: 24, p: 0, color: "#344054", "&:hover": { bgcolor: "transparent" }, "&.Mui-disabled": { color: "#d0d5dd" } }}>
                          <Typography sx={{ fontSize: "1.1rem", fontWeight: 400, lineHeight: 1 }}>—</Typography>
                        </IconButton>
                        <Typography variant="body2" sx={{ minWidth: 24, textAlign: "center", fontWeight: 700, fontSize: "0.875rem", color: "#101828" }}>
                          {item.requested_quantity}
                        </Typography>
                        <IconButton size="small" onClick={() => updateItemQuantity(item.id, 1)} disabled={item.requested_quantity >= (originalQuantities[item.id] ?? item.requested_quantity)}
                          sx={{ width: 24, height: 24, p: 0, color: "#344054", "&:hover": { bgcolor: "transparent" }, "&.Mui-disabled": { color: "#d0d5dd" } }}>
                          <Typography sx={{ fontSize: "1.1rem", fontWeight: 400, lineHeight: 1 }}>+</Typography>
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Paper>
              </>
            )}

            {/* Tab: Facturas */}
            {activeTab === "facturas" && (
              <>
                <Paper elevation={0} sx={{ overflow: "hidden", border: "1px solid #e4e7ec", borderRadius: 2 }}>
                  {/* Table header */}
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 2, px: 3, py: 1.5, borderBottom: "1px solid #e4e7ec" }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8125rem" }}>Fecha</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8125rem" }}>Pedido</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8125rem" }}>Estatus</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8125rem" }}>Archivos</Typography>
                  </Box>
                  {/* Table rows */}
                  {facturas.length === 0 ? (
                    <Box sx={{ px: 3, py: 4, textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                        No hay facturas agregadas
                      </Typography>
                    </Box>
                  ) : (
                    facturas.map((f, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
                          gap: 2, px: 3, py: 1.75, alignItems: "center",
                          borderBottom: "1px solid #f2f4f7", bgcolor: "white",
                          "&:last-child": { borderBottom: "none" },
                        }}
                      >
                        <Typography variant="body2" sx={{ fontSize: "0.875rem", color: "#101828" }}>
                          {new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: "0.875rem", color: "#101828" }}>
                          {order.id}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: "0.875rem", color: "#17B26A", fontWeight: 500 }}>
                          Pagado
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          {f.pdfUrl && (
                            <a href={f.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#1570EF", fontSize: "0.75rem" }}>
                              PDF
                            </a>
                          )}
                          {f.xmlUrl && (
                            <a href={f.xmlUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#1570EF", fontSize: "0.75rem" }}>
                              XML
                            </a>
                          )}
                          {!f.pdfUrl && !f.xmlUrl && (
                            <Typography variant="body2" sx={{ fontSize: "0.75rem", color: "#98a2b3" }}>
                              Sin archivos
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    ))
                  )}
                </Paper>

                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setAddFacturaOpen(true)}
                    sx={{
                      borderColor: "#d0d5dd",
                      color: "#344054",
                      textTransform: "none",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      borderRadius: 1.5,
                      "&:hover": { borderColor: "#98a2b3", bgcolor: "transparent" },
                    }}
                  >
                    + Agregar factura
                  </Button>
                </Box>
              </>
            )}
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
                setHasChanges(true);
                setPickerItemId(null);
              }
            }}
          />

          {/* Add Factura Drawer */}
          <AddFacturaDrawer
            open={addFacturaOpen}
            onClose={() => setAddFacturaOpen(false)}
            onSubmit={handleAddFactura}
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
                  {formatCurrency(calculateSubtotal())}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography variant="body2" sx={{ color: "#667085", fontSize: "0.875rem" }}>
                  IVA
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.875rem", color: "#101828" }}>
                  {formatCurrency(calculateIVA())}
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
                  {formatCurrency(calculateTotal())}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
}
