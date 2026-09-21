"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Box, Typography, Paper, Stack, Divider, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ArrowLeft } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatusChip } from "@/components/StatusChip/StatusChip";
import { colors } from "@/lib/theme";
import { useApi } from "@/hooks/useApi";
import { useNotification } from "@/contexts/NotificationContext";
import {
  invoicesService,
  type SupplierInvoiceDetail,
  type SupplierInvoiceEstatus,
} from "@/services/invoices.service";
import numeral from "numeral";

const STATUS_VARIANTS: Record<SupplierInvoiceEstatus, "warning" | "success"> = {
  pendiente: "warning",
  pagado: "success",
};

const STATUS_LABELS: Record<SupplierInvoiceEstatus, string> = {
  pendiente: "Pendiente",
  pagado: "Pagado",
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const COL = "160px 180px 1fr 140px";

const StatsCard = styled(Paper)({
  backgroundColor: colors.background.sidebar,
  borderRadius: "12px",
  border: `1px solid ${colors.border}`,
  boxShadow: "none",
  padding: "20px 24px",
  flex: 1,
});

const TableCard = styled(Paper)({
  backgroundColor: colors.background.sidebar,
  borderRadius: "12px",
  border: `1px solid ${colors.border}`,
  boxShadow: "none",
  overflow: "hidden",
});

const THeaderRow = styled(Box)({
  display: "grid",
  gridTemplateColumns: COL,
  gap: "12px",
  padding: "12px 24px",
  borderBottom: `1px solid ${colors.border}`,
});

const TDataRow = styled(Box)({
  display: "grid",
  gridTemplateColumns: COL,
  gap: "12px",
  padding: "14px 24px",
  borderBottom: `1px solid ${colors.border}`,
  alignItems: "center",
  "&:last-child": { borderBottom: "none" },
});

const EmptyState = ({ children }: { children: string }) => (
  <Box sx={{ py: 6, textAlign: "center" }}>
    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
      {children}
    </Typography>
  </Box>
);

const HeaderField = ({ label, value }: { label: string; value: string }) => (
  <Box>
    <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block" }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 500 }}>
      {value}
    </Typography>
  </Box>
);

interface FacturaDetalleClientProps {
  invoiceId: number;
}

export function FacturaDetalleClient({ invoiceId }: FacturaDetalleClientProps) {
  const router = useRouter();
  const { showError } = useNotification();
  const { execute, loading, error, data: factura } = useApi<SupplierInvoiceDetail>();

  const isValidId = Number.isInteger(invoiceId) && invoiceId > 0;

  // The API answers 404 when the invoice does not belong to the supplier;
  // that case is rendered inline as "no encontrada" instead of a toast.
  const loadInvoice = useCallback(async () => {
    await execute(() => invoicesService.getInvoice(invoiceId), {
      showErrorNotification: false,
      onError: (apiError) => {
        if (apiError.status !== 404) {
          showError(apiError.message);
        }
      },
    });
  }, [execute, invoiceId, showError]);

  useEffect(() => {
    if (isValidId) {
      loadInvoice();
    }
  }, [isValidId, loadInvoice]);

  const showNotFound = !isValidId || error?.status === 404;
  const showLoadError = !showNotFound && !loading && error !== null;
  const totalAbonos = factura?.abonos.reduce((sum, abono) => sum + abono.monto, 0) ?? 0;

  return (
    <MainLayout>
      <Stack direction="column" spacing={3}>
        {/* Breadcrumb */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={() => router.back()}
            size="small"
            sx={{ border: `1px solid ${colors.border}`, borderRadius: "8px", p: "4px" }}
          >
            <ArrowLeft size={16} />
          </IconButton>
          <Link href="/facturas" style={{ textDecoration: "none" }}>
            <Typography variant="body2" sx={{ color: colors.text.secondary, cursor: "pointer" }}>
              Facturas
            </Typography>
          </Link>
          <Typography variant="body2" sx={{ color: colors.text.secondary }}>›</Typography>
          <Typography variant="body2">{factura?.folio ?? (isValidId ? invoiceId : "—")}</Typography>
        </Box>

        {loading && <EmptyState>Cargando factura…</EmptyState>}

        {showNotFound && <EmptyState>Factura no encontrada</EmptyState>}

        {showLoadError && <EmptyState>No se pudo cargar la factura</EmptyState>}

        {!loading && factura && (
          <>
            {/* Header */}
            <Box>
              <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                Factura
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                Factura {factura.folio}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1.5 }}>
                Emitida el {formatDate(factura.fechaEmision)}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Pago:
                </Typography>
                <StatusChip
                  label={STATUS_LABELS[factura.estatus]}
                  variant={STATUS_VARIANTS[factura.estatus]}
                />
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                <HeaderField label="Vencimiento" value={formatDate(factura.fechaVencimiento)} />
                <HeaderField label="Tipo de pago" value={factura.tipoPago || "—"} />
                <HeaderField label="Pedido" value={factura.pedido?.folio ?? "—"} />
              </Box>
            </Box>

            <Divider sx={{ borderColor: colors.border }} />

            {/* Montos */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <StatsCard>
                <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
                  Total
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {numeral(factura.total).format("$0,0.00")}
                </Typography>
              </StatsCard>
              <StatsCard>
                <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
                  Pagado
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {numeral(factura.pagado).format("$0,0.00")}
                </Typography>
              </StatsCard>
              <StatsCard>
                <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
                  Saldo
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {numeral(factura.saldo).format("$0,0.00")}
                </Typography>
              </StatsCard>
            </Box>

            {/* Abonos */}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
                Abonos
              </Typography>
              <TableCard>
                <Box sx={{ overflowX: "auto" }}>
                  <Box sx={{ minWidth: 700 }}>
                    <THeaderRow>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500 }}>
                        Fecha
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500 }}>
                        Referencia
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500 }}>
                        Descripción
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500, textAlign: "right" }}>
                        Monto
                      </Typography>
                    </THeaderRow>

                    {factura.abonos.length === 0 && <EmptyState>Sin abonos registrados</EmptyState>}

                    {factura.abonos.map((abono) => (
                      <TDataRow key={abono.id}>
                        <Typography variant="body2">{formatDate(abono.fecha)}</Typography>
                        <Typography variant="body2">{abono.referencia || "—"}</Typography>
                        <Typography variant="body2">{abono.descripcion || "—"}</Typography>
                        <Typography variant="body2" sx={{ textAlign: "right" }}>
                          {numeral(abono.monto).format("$0,0.00")}
                        </Typography>
                      </TDataRow>
                    ))}

                    {factura.abonos.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          gap: 3,
                          px: 3,
                          py: 2,
                          bgcolor: colors.background.main,
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          Total abonado
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 120, textAlign: "right" }}>
                          {numeral(totalAbonos).format("$0,0.00")}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </TableCard>
            </Box>
          </>
        )}
      </Stack>
    </MainLayout>
  );
}
