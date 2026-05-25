"use client";

import { useState } from "react";
import { Box, Typography, Paper, Stack, Divider, Drawer, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  ChevronLeft,
  ChevronRight,
  ArrowDownRight,
  ArrowUpRight,
  ArrowUpDown,
  FileText,
  X,
} from "lucide-react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Title } from "@/components/Title/Title";
import { TabFilters } from "@/components/TabFilters/TabFilters";
import { StatusChip } from "@/components/StatusChip/StatusChip";
import { colors } from "@/lib/theme";
import {
  estadoCuentaDetalles,
  estadoCuentaPagos,
  type EstadoCuentaDetalleItem,
  type EstadoCuentaPagoItem,
} from "@/mocks/data";
import numeral from "numeral";
import type { TabOption } from "@/components/TabFilters/TabFilters";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const TABS: TabOption[] = [
  { label: "Detalles", value: "detalles" },
  { label: "Pagos", value: "pagos" },
];

const STATUS_VARIANTS: Record<string, "warning" | "success"> = {
  pendiente: "warning",
  pagado: "success",
};

const DCOL = "180px 1fr 140px 140px";
const PCOL = "1fr 160px 140px";

const StatsCard = styled(Paper)({
  backgroundColor: colors.background.sidebar,
  borderRadius: "12px",
  border: `1px solid ${colors.border}`,
  boxShadow: "none",
  padding: "20px 24px",
  flex: 1,
});

const MainCard = styled(Paper)({
  backgroundColor: colors.background.sidebar,
  borderRadius: "12px",
  border: `1px solid ${colors.border}`,
  boxShadow: "none",
  overflow: "hidden",
});

const THeaderRow = styled(Box, { shouldForwardProp: (prop) => prop !== "col" })<{ col?: string }>(({ col = DCOL }) => ({
  display: "grid",
  gridTemplateColumns: col,
  gap: "16px",
  padding: "12px 24px",
  borderBottom: `1px solid ${colors.border}`,
}));

const TDataRow = styled(Box, { shouldForwardProp: (prop) => prop !== "clickable" && prop !== "col" })<{ col?: string; clickable?: boolean }>(({ col = DCOL, clickable }) => ({
  display: "grid",
  gridTemplateColumns: col,
  gap: "16px",
  padding: "14px 24px",
  borderBottom: `1px solid ${colors.border}`,
  alignItems: "center",
  "&:last-child": { borderBottom: "none" },
  ...(clickable && { cursor: "pointer", "&:hover": { backgroundColor: colors.background.main } }),
}));

const totalCargo = estadoCuentaDetalles.reduce((s, i) => s + (i.cargo ?? 0), 0);
const totalVenta = estadoCuentaDetalles.reduce((s, i) => s + (i.venta ?? 0), 0);
const grandTotal = totalVenta - totalCargo;

export default function EstadosCuentaPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1));
  const [activeTab, setActiveTab] = useState("detalles");
  const [selectedPago, setSelectedPago] = useState<EstadoCuentaPagoItem | null>(null);

  const monthLabel = `${MESES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const prevMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  return (
    <MainLayout>
      <Stack direction="column" spacing={3}>
        <Title title="Estados de cuenta" />

        {/* Stats row */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <StatsCard>
            <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
              Pendiente de cobro
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {numeral(grandTotal).format("$0,0.00")}
            </Typography>
          </StatsCard>
          <StatsCard>
            <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
              Pendiente por facturar
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {numeral(290123.14).format("$0,0.00")}
            </Typography>
          </StatsCard>
        </Box>

        {/* Main card */}
        <MainCard>
          {/* Month selector + status badge */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 3,
              pt: 3,
              pb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mr: 0.5 }}>
                {monthLabel}
              </Typography>
              <IconButton onClick={prevMonth} size="small">
                <ChevronLeft size={18} />
              </IconButton>
              <IconButton onClick={nextMonth} size="small">
                <ChevronRight size={18} />
              </IconButton>
            </Box>
            <Box
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: "20px",
                border: "1.5px solid #F97316",
                color: "#F97316",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              Pendiente
            </Box>
          </Box>

          {/* Tabs */}
          <Box sx={{ px: 3, pb: 2 }}>
            <TabFilters tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
          </Box>

          {/* ── Detalles tab ── */}
          {activeTab === "detalles" && (
            <>
              <THeaderRow>
                <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500 }}>
                  Fecha
                </Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500 }}>
                  Concepto
                </Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500, textAlign: "right" }}>
                  Cargo
                </Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500, textAlign: "right" }}>
                  Venta
                </Typography>
              </THeaderRow>

              {estadoCuentaDetalles.map((item: EstadoCuentaDetalleItem) => (
                <TDataRow key={item.id}>
                  <Typography variant="body2">{item.fecha}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {item.tipo === "pedido" ? (
                      <ArrowDownRight size={16} color="#22C55E" />
                    ) : (
                      <ArrowUpRight size={16} color="#DC2626" />
                    )}
                    <Typography variant="body2">
                      {item.tipo === "pedido" ? (
                        <>
                          Pedido{" "}
                          <Link href={`/facturas/${item.pedidoId}`} style={{ textDecoration: "none" }}>
                            <Box component="span" sx={{ color: "#1570EF", "&:hover": { textDecoration: "underline" } }}>
                              {item.pedidoId}
                            </Box>
                          </Link>{" "}
                          {item.concepto}
                        </>
                      ) : (
                        item.concepto
                      )}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ textAlign: "right" }}>
                    {item.cargo ? numeral(item.cargo).format("$0,0.00") : ""}
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: "right" }}>
                    {item.venta ? numeral(item.venta).format("$0,0.00") : ""}
                  </Typography>
                </TDataRow>
              ))}

              {/* Subtotal */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: DCOL,
                  gap: "16px",
                  px: 3,
                  py: 1.5,
                  borderTop: `1px solid ${colors.border}`,
                }}
              >
                <Box />
                <Typography variant="body2" sx={{ color: colors.text.secondary, textAlign: "right" }}>
                  Subtotal
                </Typography>
                <Typography variant="body2" sx={{ textAlign: "right" }}>
                  {numeral(totalCargo).format("$0,0.00")}
                </Typography>
                <Typography variant="body2" sx={{ textAlign: "right" }}>
                  {numeral(totalVenta).format("$0,0.00")}
                </Typography>
              </Box>

              {/* Total */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: DCOL,
                  gap: "16px",
                  px: 3,
                  py: 2,
                  bgcolor: colors.background.main,
                }}
              >
                <Box />
                <Typography variant="body2" sx={{ fontWeight: 700, textAlign: "right" }}>
                  Total
                </Typography>
                <Box />
                <Typography variant="body2" sx={{ fontWeight: 700, textAlign: "right" }}>
                  {numeral(grandTotal).format("$0,0.00")}
                </Typography>
              </Box>
            </>
          )}

          {/* ── Pagos tab ── */}
          {activeTab === "pagos" && (
            <>
              <THeaderRow col={PCOL}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500 }}>
                    Fecha del pago
                  </Typography>
                  <ArrowUpDown size={14} color={colors.text.secondary} />
                </Box>
                <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500 }}>
                  Estatus
                </Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500, textAlign: "right" }}>
                  Monto
                </Typography>
              </THeaderRow>

              {estadoCuentaPagos.map((pago: EstadoCuentaPagoItem) => (
                <TDataRow
                  key={pago.id}
                  col={PCOL}
                  clickable
                  onClick={() => setSelectedPago(pago)}
                >
                  <Typography variant="body2">{pago.fechaPago}</Typography>
                  <Box>
                    <StatusChip
                      label={pago.estatus === "pendiente" ? "Pendiente" : "Pagado"}
                      variant={STATUS_VARIANTS[pago.estatus]}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ textAlign: "right" }}>
                    {numeral(pago.monto).format("$0,0.00")}
                  </Typography>
                </TDataRow>
              ))}
            </>
          )}
        </MainCard>
      </Stack>

      {/* ── Pago detail drawer ── */}
      <Drawer
        anchor="right"
        open={!!selectedPago}
        onClose={() => setSelectedPago(null)}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "16px",
              m: "16px",
              height: "calc(100% - 32px)",
              width: { xs: "calc(100vw - 32px)", sm: 480 },
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            },
          },
        }}
      >
        {selectedPago && (
          <Box sx={{ p: 3, overflowY: "auto", height: "100%" }}>
            {/* Close button */}
            <IconButton
              onClick={() => setSelectedPago(null)}
              size="small"
              sx={{ border: `1px solid ${colors.border}`, borderRadius: "8px", p: "4px", mb: 2 }}
            >
              <X size={18} />
            </IconButton>

            {/* Title */}
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              Pago a proveedor
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 2.5 }}>
              Consulta los detalles del pago realizado
            </Typography>

            {/* Info box: Proveedor | Estado de cuenta */}
            <Box
              sx={{
                display: "flex",
                bgcolor: "#F8FAFC",
                border: `1px solid ${colors.border}`,
                borderRadius: "10px",
                overflow: "hidden",
                mb: 2.5,
              }}
            >
              <Box sx={{ flex: 1, p: 2 }}>
                <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
                  Proveedor
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {selectedPago.proveedor}
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ borderColor: colors.border }} />
              <Box sx={{ flex: 1, p: 2 }}>
                <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
                  Estado de cuenta
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {selectedPago.estadoCuenta}
                </Typography>
              </Box>
            </Box>

            {/* Monto */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
                Monto
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {numeral(selectedPago.monto).format("$0,0.00")}
              </Typography>
            </Box>

            {/* Notas */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
                Notas
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                {selectedPago.notas}
              </Typography>
            </Box>

            {/* Fecha del pago */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
                Fecha del pago
              </Typography>
              <Typography variant="body2">
                {selectedPago.fechaPago}
              </Typography>
            </Box>

            {/* Comprobante */}
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
              Comprobante
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                border: `1px solid ${colors.border}`,
                borderRadius: "10px",
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "#EFF6FF",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <FileText size={20} color="#3B82F6" />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {selectedPago.comprobante}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                  Archivo PDF
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{ color: "#1570EF", fontWeight: 600, cursor: "pointer", flexShrink: 0 }}
              >
                Descargar
              </Typography>
            </Box>
          </Box>
        )}
      </Drawer>
    </MainLayout>
  );
}
