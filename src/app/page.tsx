"use client";

import { Box, Typography, Paper, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ArrowRight, FileText, Wrench, DollarSign } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatsCardGroup, type StatsCardData } from "@/components/StatsCard/StatsCard";
import { TableCrud } from "@/components/TableCrud/TableCrud";
import { ActivitySidebar } from "@/components/ActivitySidebar/ActivitySidebar";
import { proveedorData, facturasPendientes, pedidosPendientes } from "@/mocks/data";
import { colors } from "@/lib/theme";
import type { Column } from "@/components/TableCrud/TableCrud";
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
  boxShadow: "none",
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

const statsCards: StatsCardData[] = [
  {
    id: "1",
    label: "Total de cobros pendientes",
    value: 870369.42,
    isCurrency: true,
    icon: <FileText size={20} color="#1570EF" strokeWidth={1.5} />,
  },
  {
    id: "2",
    label: "Cargos a proveedor",
    value: 25980.0,
    isCurrency: true,
    icon: <Wrench size={20} color="#1570EF" strokeWidth={1.5} />,
  },
  {
    id: "3",
    label: "Total a cobrar",
    value: 844389.42,
    isCurrency: true,
    icon: <DollarSign size={20} color="#1570EF" strokeWidth={1.5} />,
  },
];

const facturaColumns: Column<Factura>[] = [
  { id: "fecha", label: "Fecha", size: "md" },
  { id: "descripcion", label: "Descripción", size: "lg" },
  { id: "estatus", label: "Estatus", type: "chip", size: "sm", chipVariantMap: STATUS_VARIANTS },
  { id: "total", label: "Total", type: "currency", size: "md", align: "right" },
];

const pedidoColumns: Column<Pedido>[] = [
  {
    id: "pedido",
    label: "Pedido",
    size: "sm",
    format: (value) => (
      <Box component="span" sx={{ color: "#98A2B3", fontSize: "0.875rem" }}>
        {String(value)}
      </Box>
    ),
  },
  { id: "fecha", label: "Fecha", size: "md" },
  { id: "articulosSolicitados", label: "Artículos solicitados", type: "number", size: "md" },
  { id: "estatus", label: "Estatus", type: "chip", size: "sm", chipVariantMap: STATUS_VARIANTS },
  { id: "pago", label: "Pago", type: "chip", size: "sm", chipVariantMap: STATUS_VARIANTS },
  { id: "total", label: "Total", type: "currency", size: "md", align: "right" },
];

export default function DashboardPage() {
  return (
    <MainLayout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="overline" sx={{ color: colors.sidebar.textSelected, fontWeight: 600 }}>
          DASHBOARD
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
          {proveedorData.nombre}
        </Typography>
      </Box>

      <DashboardContainer>
        <MainSection>
          <StatsCardGroup cards={statsCards} />

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
              loading={false}
              rowKey="id"
              hidePagination
              noBorder
              emptyMessage="No hay facturas pendientes"
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
              loading={false}
              rowKey="id"
              hidePagination
              noBorder
              emptyMessage="No hay pedidos pendientes"
            />
          </TableCard>
        </MainSection>

        <ActivitySidebar />
      </DashboardContainer>
    </MainLayout>
  );
}
