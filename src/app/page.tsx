"use client";

import { Box, Typography, Paper, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ArrowRight } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatsCardGroup } from "@/components/StatsCard/StatsCard";
import { TableCrud } from "@/components/TableCrud/TableCrud";
import { ActivitySidebar } from "@/components/ActivitySidebar/ActivitySidebar";
import { proveedorData, statsData, facturasPendientes, pedidosPendientes } from "@/mocks/data";
import { colors } from "@/lib/theme";
import type { Column, RowAction } from "@/components/TableCrud/TableCrud";
import type { StatusChipVariant } from "@/components/StatusChip/StatusChip";

const DashboardContainer = styled(Box)({
  display: "flex",
  gap: "24px",
  flex: 1,
});

const MainSection = styled(Box)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "24px",
});

const SectionHeader = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  mb: 2,
});

const TableCard = styled(Paper)({
  backgroundColor: colors.background.sidebar,
  borderRadius: "16px",
  border: `1px solid ${colors.border}`,
  overflow: "hidden",
});

const SectionTitle = styled(Typography)({
  fontWeight: 600,
  fontSize: "16px",
});

const VerTodoButton = styled(Button)({
  color: colors.sidebar.textSelected,
  fontWeight: 600,
  textTransform: "none",
  padding: 0,
  minWidth: "auto",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  "&:hover": {
    backgroundColor: "transparent",
    textDecoration: "underline",
  },
});

type Factura = typeof facturasPendientes[0];
type Pedido = typeof pedidosPendientes[0];

const STATUS_VARIANTS: Record<string, StatusChipVariant> = {
  Pendiente: "pending",
  Surtido: "success",
  Pagado: "success",
};

const facturaColumns: Column<Factura>[] = [
  { id: "fecha", label: "Fecha", size: "md" },
  { id: "pedido", label: "Pedido", size: "sm" },
  { id: "estatus", label: "Estatus", type: "chip", size: "sm", chipVariantMap: STATUS_VARIANTS },
  { id: "total", label: "Total", type: "currency", size: "md", align: "right" },
];

const facturaActions: RowAction<Factura>[] = [
  { id: "ver", label: "Ver detalle", onClick: (row) => console.log("Ver factura", row.pedido) },
  { id: "descargar", label: "Descargar PDF", onClick: (row) => console.log("Descargar factura", row.pedido) },
];

const pedidoColumns: Column<Pedido>[] = [
  { id: "pedido", label: "Pedido", size: "sm" },
  { id: "fecha", label: "Fecha", size: "md" },
  { id: "articulosSolicitados", label: "Artículos solicitados", type: "number", size: "md" },
  { id: "estatus", label: "Estatus", type: "chip", size: "sm", chipVariantMap: STATUS_VARIANTS },
  { id: "pago", label: "Pago", type: "chip", size: "sm", chipVariantMap: STATUS_VARIANTS },
  { id: "total", label: "Total", type: "currency", size: "md", align: "right" },
];

const pedidoActions: RowAction<Pedido>[] = [
  { id: "ver", label: "Ver detalle", onClick: (row) => console.log("Ver pedido", row.pedido) },
  { id: "descargar", label: "Descargar PDF", onClick: (row) => console.log("Descargar pedido", row.pedido) },
];

export default function DashboardPage() {
  return (
    <MainLayout>
      <DashboardContainer>
        <MainSection>
          <Box>
            <Typography variant="overline" sx={{ color: colors.sidebar.textSelected, fontWeight: 600 }}>
              DASHBOARD
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
              {proveedorData.nombre}
            </Typography>
          </Box>

          <StatsCardGroup cards={statsData} />

          <TableCard>
            <Box sx={{ p: 3, pb: 2 }}>
              <SectionHeader>
                <SectionTitle>Facturas pendientes</SectionTitle>
                <VerTodoButton endIcon={<ArrowRight size={16} />}>
                  Ver todo
                </VerTodoButton>
              </SectionHeader>
            </Box>
            <TableCrud
              columns={facturaColumns}
              rows={facturasPendientes}
              actions={facturaActions}
              loading={false}
              rowKey="id"
              page={0}
              rowsPerPage={5}
              totalRows={facturasPendientes.length}
              emptyMessage="No hay facturas pendientes"
              hideRowsPerPageSelect
            />
          </TableCard>

          <TableCard>
            <Box sx={{ p: 3, pb: 2 }}>
              <SectionHeader>
                <SectionTitle>Pedidos pendientes</SectionTitle>
                <VerTodoButton endIcon={<ArrowRight size={16} />}>
                  Ver todo
                </VerTodoButton>
              </SectionHeader>
            </Box>
            <TableCrud
              columns={pedidoColumns}
              rows={pedidosPendientes}
              actions={pedidoActions}
              loading={false}
              rowKey="id"
              page={0}
              rowsPerPage={5}
              totalRows={pedidosPendientes.length}
              emptyMessage="No hay pedidos pendientes"
              hideRowsPerPageSelect
            />
          </TableCard>
        </MainSection>

        <ActivitySidebar />
      </DashboardContainer>
    </MainLayout>
  );
}
