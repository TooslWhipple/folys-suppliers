"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Title } from "@/components/Title/Title";
import { TabFilters } from "@/components/TabFilters/TabFilters";
import { TableCrud } from "@/components/TableCrud/TableCrud";
import type { TabOption } from "@/components/TabFilters/TabFilters";
import type { Column } from "@/components/TableCrud/TableCrud";
import type { StatusChipVariant } from "@/components/StatusChip/StatusChip";
import { Stack } from "@mui/material";
import { StatsCardGroup, StatsCardData } from "@/components/StatsCard/StatsCard";
import { useApi } from "@/hooks/useApi";
import { ordersService, Order, OrderStats } from "@/services/orders.service";
import type { PaginatedResponse } from "@/types/pagination";
import { useNotification } from "@/contexts/NotificationContext";
import { ORDER_STATUS_LABELS, ORDER_STATUS_CHIP_VARIANTS } from "@/lib/statusChips";
import type { SupplierOrderStatus } from "@/services/dashboard.service";
import { useRouter } from "next/navigation";
import { useDebouncedValue } from "../catalogo/useDebouncedValue";

type Pedido = {
  id: string;
  pedido: string;
  fecha: string;
  articulosSolicitados: number;
  /** Valor crudo de `OrderStatus` que emite el back. */
  status: SupplierOrderStatus;
  estatus: string;
  pago: string;
  total: number;
};

const STATUS_TABS: TabOption[] = [
  { label: "Todos", value: "all" },
  { label: "Pendientes", value: "pending" },
  { label: "Parcialmente entregados", value: "partially_delivered" },
  { label: "Entregados", value: "delivered" },
  { label: "Cerrados", value: "closed" },
];

const SEARCH_DEBOUNCE_MS = 400;

/**
 * Valor de `status` que se manda al back según la pestaña. "Todos" no filtra;
 * "pending" es el valor especial del back (todo pedido abierto: ni entregado, cancelado ni cerrado).
 */
const tabToStatus = (tab: string): string | undefined => (tab === "all" ? undefined : tab);

// La columna guarda la etiqueta ya traducida; el mapa de variantes se deriva de
// los mapas compartidos para que listado y detalle no puedan divergir.
const STATUS_CHIP_VARIANTS: Record<string, StatusChipVariant> = Object.fromEntries(
  (Object.keys(ORDER_STATUS_LABELS) as SupplierOrderStatus[]).map((status) => [
    ORDER_STATUS_LABELS[status],
    ORDER_STATUS_CHIP_VARIANTS[status],
  ]),
);

const PAGO_CHIP_VARIANTS: Record<string, StatusChipVariant> = {
  Pendiente: "pending",
  Pagado: "success",
};

// Helper to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// Map Order to Pedido format
const mapOrderToPedido = (order: Order): Pedido => {
  const itemCount = order.items?.length || 0;

  return {
    id: order.id.toString(),
    pedido: order.folio,
    fecha: formatDate(order.orderDate),
    articulosSolicitados: itemCount,
    status: order.status as SupplierOrderStatus,
    estatus: ORDER_STATUS_LABELS[order.status as SupplierOrderStatus] ?? order.status,
    pago: "Pendiente", // This would come from a different API
    total: order.subtotalMxn,
  };
};

export default function PedidosPage() {
  const { showInfo } = useNotification();
  const router = useRouter();
  const { execute, loading: apiLoading, data: ordersData } = useApi<PaginatedResponse<Order>>();
  const { execute: executeStats, data: statsData } = useApi<OrderStats>();

  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  const debouncedSearch = useDebouncedValue(searchValue, SEARCH_DEBOUNCE_MS);

  // Búsqueda, pestaña y paginación son server-side: cada cambio dispara una
  // petición nueva, nunca un recorte de la página ya cargada.
  const loadOrders = useCallback(async () => {
    await execute(
      () =>
        ordersService.getOrders({
          page: page + 1,
          limit: rowsPerPage,
          status: tabToStatus(activeTab),
          search: debouncedSearch.trim() || undefined,
        }),
      {
        showErrorNotification: true,
      }
    );
  }, [execute, page, rowsPerPage, activeTab, debouncedSearch]);

  // Load stats from API
  const loadStats = useCallback(async () => {
    await executeStats(
      () => ordersService.getStats(),
      { showErrorNotification: false }
    );
  }, [executeStats]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const pedidos = useMemo(() => {
    return ordersData?.rows?.map(mapOrderToPedido) || [];
  }, [ordersData]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setPage(0);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPage(0);
  };


  const columns: Column<Pedido>[] = [
    {
      id: "pedido",
      label: "Pedido",
      size: "sm",
    },
    {
      id: "fecha",
      label: "Fecha",
      size: "md",
    },
    {
      id: "articulosSolicitados",
      label: "Artículos solicitados",
      type: "number",
      size: "md",
    },
    {
      id: "estatus",
      label: "Estatus",
      type: "chip",
      size: "sm",
      chipVariantMap: STATUS_CHIP_VARIANTS,
    },
    {
      id: "pago",
      label: "Pago",
      type: "chip",
      size: "sm",
      chipVariantMap: PAGO_CHIP_VARIANTS,
    },
    {
      id: "total",
      label: "Total",
      type: "currency",
      size: "md",
      align: "right",
    },
  ];

  const handleRowClick = (row: Pedido) => {
    router.push(`/pedidos/${row.id}`);
  };

  const tabs = STATUS_TABS.map((t) => ({
    ...t,
    count: t.value === activeTab ? ordersData?.total : undefined,
  }));

  const statsCards: StatsCardData[] = [
    {
      id: "articulos-pendientes",
      label: "Artículos pendiente de entrega",
      value: statsData?.itemsPendingDelivery || 0,
      isCurrency: false,
    },
    {
      id: "valor-articulos",
      label: "Valor de artículos pendientes",
      value: statsData?.valuePendingDelivery || 0,
      isCurrency: true,
    },
    {
      id: "ordenes-pendientes",
      label: "Órdenes pendientes",
      value: statsData?.ordersPendingCount || 0,
      isCurrency: false,
    },
  ];

  return (
    <MainLayout>
      <Stack direction="column" spacing={3}>
        <Title title="Pedidos" />
        <StatsCardGroup cards={statsCards} />

        <TabFilters
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          showSearch
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Buscar"
        />

        <TableCrud
          columns={columns}
          rows={pedidos}
          loading={apiLoading}
          rowKey="id"
          page={page}
          rowsPerPage={rowsPerPage}
          totalRows={ordersData?.total || 0}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          onRowClick={handleRowClick}
          emptyMessage="No hay pedidos"
        />
      </Stack>
    </MainLayout>
  );
}
