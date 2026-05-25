"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Box, Typography, Paper, Stack, Divider, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ArrowLeft } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { TabFilters } from "@/components/TabFilters/TabFilters";
import { StatusChip } from "@/components/StatusChip/StatusChip";
import { colors } from "@/lib/theme";
import { type FacturaDetalleData, type FacturaPedidoRow } from "@/mocks/data";
import numeral from "numeral";
import type { TabOption } from "@/components/TabFilters/TabFilters";

const TABS: TabOption[] = [
  { label: "Pedidos", value: "pedidos" },
  { label: "Archivos", value: "archivos" },
];

const ESTATUS_VARIANTS: Record<string, "warning" | "success" | "error"> = {
  pendiente: "warning",
  surtido: "success",
  cancelado: "error",
};

const PAGO_VARIANTS: Record<string, "warning" | "success"> = {
  pendiente: "warning",
  pagado: "success",
};

const COL = "80px 150px 150px 130px 140px 120px 120px 120px";

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

interface FacturaDetalleClientProps {
  factura: FacturaDetalleData | null;
  id: string;
}

export function FacturaDetalleClient({ factura, id }: FacturaDetalleClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("pedidos");

  const grandTotal = factura
    ? factura.pedidos.reduce((sum, row) => sum + row.total, 0)
    : 0;

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
          <Typography variant="body2">{id}</Typography>
        </Box>

        {/* Header */}
        {factura && (
          <Box>
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
              Factura
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Factura {factura.numero}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1.5 }}>
              Generada el {factura.fechaGenerada}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Pago:
              </Typography>
              <Typography variant="body2" sx={{ color: "#F97316", fontWeight: 600 }}>
                {factura.pago === "pendiente" ? "Pendiente" : "Pagado"}
              </Typography>
            </Box>
          </Box>
        )}

        <Divider sx={{ borderColor: colors.border }} />

        {/* Tabs */}
        <Box>
          <TabFilters tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        </Box>

        {/* Pedidos tab */}
        {activeTab === "pedidos" && factura && (
          <TableCard>
            <Box sx={{ overflowX: "auto" }}>
              <Box sx={{ minWidth: 900 }}>
                <THeaderRow>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500 }}>
                    Pedido
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500 }}>
                    Fecha
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500 }}>
                    Almacén de entrega
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500 }}>
                    Artículos solicitados
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500 }}>
                    Artículos entregados
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500 }}>
                    Estatus
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500 }}>
                    Pago
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500, textAlign: "right" }}>
                    Total
                  </Typography>
                </THeaderRow>

                {factura.pedidos.map((row: FacturaPedidoRow) => (
                  <TDataRow key={row.id}>
                    <Typography variant="body2">{row.pedido}</Typography>
                    <Typography variant="body2">{row.fecha}</Typography>
                    <Typography variant="body2">{row.almacen}</Typography>
                    <Typography variant="body2">{row.articulosSolicitados}</Typography>
                    <Typography variant="body2">
                      {row.articulosEntregados !== null ? row.articulosEntregados : "-"}
                    </Typography>
                    <Box>
                      <StatusChip
                        label={row.estatus === "pendiente" ? "Pendiente" : row.estatus === "surtido" ? "Surtido" : "Cancelado"}
                        variant={ESTATUS_VARIANTS[row.estatus]}
                      />
                    </Box>
                    <Box>
                      <StatusChip
                        label={row.pago === "pendiente" ? "Pendiente" : "Pagado"}
                        variant={PAGO_VARIANTS[row.pago]}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ textAlign: "right" }}>
                      {numeral(row.total).format("$0,0.00")}
                    </Typography>
                  </TDataRow>
                ))}

                {/* Total row */}
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
                    Total
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 120, textAlign: "right" }}>
                    {numeral(grandTotal).format("$0,0.00")}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </TableCard>
        )}

        {/* Archivos tab */}
        {activeTab === "archivos" && (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              No hay archivos adjuntos
            </Typography>
          </Box>
        )}

        {!factura && (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              Factura no encontrada
            </Typography>
          </Box>
        )}
      </Stack>
    </MainLayout>
  );
}
