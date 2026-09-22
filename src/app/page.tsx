"use client";

import { useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import { Box, Typography, Paper, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ArrowRight, Banknote, FileText, Package, Wrench, DollarSign } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatsCardGroup, type StatsCardData } from "@/components/StatsCard/StatsCard";
import { TableCrud } from "@/components/TableCrud/TableCrud";
import { ActivitySidebar } from "@/components/ActivitySidebar/ActivitySidebar";
import { useApi } from "@/hooks/useApi";
import {
  dashboardService,
  type SupplierDashboardPagoEstatus,
  type SupplierDashboardResponse,
  type SupplierOrderStatus,
} from "@/services/dashboard.service";
import type { SupplierInvoiceEstatus } from "@/services/invoices.service";
import {
  INVOICE_STATUS_CHIP_VARIANTS,
  INVOICE_STATUS_LABELS,
  ORDER_STATUS_CHIP_VARIANTS,
  ORDER_STATUS_LABELS,
  PAGO_CHIP_VARIANTS,
  PAGO_LABELS,
} from "@/lib/statusChips";
import { formatLongDate } from "@/lib/dates";
import { useAuthStore, type AuthState } from "@/store/useAuthStore";
import { colors } from "@/lib/theme";
import type { Column } from "@/components/TableCrud/TableCrud";

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

// Se enlaza con `LinkComponent={Link}` + `href`: MUI cambia la raíz del botón
// al `Link` de Next, así que navega en cliente sin anidar un <button> dentro
// de un <a> (Next 16 ya no tiene `legacyBehavior`/`passHref`).
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

type FacturaRow = {
  id: number;
  fecha: string;
  pedido: string;
  estatus: SupplierInvoiceEstatus;
  total: number;
};

type PedidoRow = {
  id: number;
  pedido: string;
  fecha: string;
  articulosSolicitados: number;
  estatus: SupplierOrderStatus;
  pago: SupplierDashboardPagoEstatus;
  total: number;
};

const facturaColumns: Column<FacturaRow>[] = [
  { id: "fecha", label: "Fecha", size: "md" },
  { id: "pedido", label: "Pedido", size: "md" },
  {
    id: "estatus",
    label: "Estatus",
    type: "chip",
    size: "sm",
    chipLabelMap: INVOICE_STATUS_LABELS,
    chipVariantMap: INVOICE_STATUS_CHIP_VARIANTS,
  },
  { id: "total", label: "Total", type: "currency", size: "md", align: "right" },
];

const pedidoColumns: Column<PedidoRow>[] = [
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
  {
    id: "estatus",
    label: "Estatus",
    type: "chip",
    size: "sm",
    chipLabelMap: ORDER_STATUS_LABELS,
    chipVariantMap: ORDER_STATUS_CHIP_VARIANTS,
  },
  {
    id: "pago",
    label: "Pago",
    type: "chip",
    size: "sm",
    chipLabelMap: PAGO_LABELS,
    chipVariantMap: PAGO_CHIP_VARIANTS,
  },
  { id: "total", label: "Total", type: "currency", size: "md", align: "right" },
];

export default function DashboardPage() {
  const { execute, loading, error, data } = useApi<SupplierDashboardResponse>();
  const user = useAuthStore((state: AuthState) => state.user);

  const loadDashboard = useCallback(async () => {
    await execute(() => dashboardService.getDashboard());
  }, [execute]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const summary = data?.summary;

  const statsCards: StatsCardData[] = [
    {
      id: "cobros-pendientes",
      label: "Total de cobros pendientes",
      value: summary?.cobrosPendientes ?? 0,
      isCurrency: true,
      icon: <FileText size={20} color="#1570EF" strokeWidth={1.5} />,
    },
    {
      id: "cargos-proveedor",
      label: "Cargos a proveedor",
      value: summary?.cargosProveedor ?? 0,
      isCurrency: true,
      icon: <Wrench size={20} color="#1570EF" strokeWidth={1.5} />,
    },
    {
      id: "total-a-cobrar",
      label: "Total a cobrar",
      value: summary?.totalACobrar ?? 0,
      isCurrency: true,
      icon: <DollarSign size={20} color="#1570EF" strokeWidth={1.5} />,
    },
    {
      id: "articulos-pendientes",
      label: "Artículos pendiente de entrega",
      value: summary?.articulosPendientesEntrega ?? 0,
      icon: <Package size={20} color="#1570EF" strokeWidth={1.5} />,
    },
    {
      id: "valor-articulos",
      label: "Valor de artículos pendientes",
      value: summary?.valorArticulosPendientes ?? 0,
      isCurrency: true,
      icon: <Banknote size={20} color="#1570EF" strokeWidth={1.5} />,
    },
  ];

  const facturaRows: FacturaRow[] = useMemo(
    () =>
      (data?.facturasPendientes ?? []).map((factura) => ({
        id: factura.id,
        fecha: formatLongDate(factura.fechaEmision),
        pedido: factura.pedido?.folio ?? "—",
        estatus: factura.estatus,
        total: factura.total,
      })),
    [data]
  );

  const pedidoRows: PedidoRow[] = useMemo(
    () =>
      (data?.pedidosPendientes ?? []).map((pedido) => ({
        id: pedido.id,
        pedido: pedido.folio,
        fecha: formatLongDate(pedido.fechaPedido),
        articulosSolicitados: pedido.articulosSolicitados,
        estatus: pedido.estatus,
        pago: pedido.pago,
        total: pedido.total,
      })),
    [data]
  );

  return (
    <MainLayout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="overline" sx={{ color: colors.sidebar.textSelected, fontWeight: 600 }}>
          DASHBOARD
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
          {user?.name}
        </Typography>
      </Box>

      <DashboardContainer>
        <MainSection>
          <StatsCardGroup cards={statsCards} />

          <TableCard>
            <Box sx={{ p: 3, pb: 2 }}>
              <SectionHeader>
                <SectionTitle>Facturas pendientes</SectionTitle>
                <VerTodoButton
                  LinkComponent={Link}
                  href="/facturas"
                  endIcon={<ArrowRight size={16} />}
                >
                  Ver todo
                </VerTodoButton>
              </SectionHeader>
            </Box>
            <TableCrud
              columns={facturaColumns}
              rows={facturaRows}
              loading={loading}
              rowKey="id"
              hidePagination
              noBorder
              emptyMessage={
                error ? "No se pudieron cargar las facturas" : "No hay facturas pendientes"
              }
            />
          </TableCard>

          <TableCard>
            <Box sx={{ p: 3, pb: 2 }}>
              <SectionHeader>
                <SectionTitle>Pedidos pendientes</SectionTitle>
                <VerTodoButton
                  LinkComponent={Link}
                  href="/pedidos"
                  endIcon={<ArrowRight size={16} />}
                >
                  Ver todo
                </VerTodoButton>
              </SectionHeader>
            </Box>
            <TableCrud
              columns={pedidoColumns}
              rows={pedidoRows}
              loading={loading}
              rowKey="id"
              hidePagination
              noBorder
              emptyMessage={
                error ? "No se pudieron cargar los pedidos" : "No hay pedidos pendientes"
              }
            />
          </TableCard>
        </MainSection>

        <ActivitySidebar
          entregas={data?.entregasProgramadas ?? []}
          cobros={data?.historialCobros ?? []}
        />
      </DashboardContainer>
    </MainLayout>
  );
}
