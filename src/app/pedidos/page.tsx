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
import { ordersService, Order, PaginatedResponse, OrderStats } from "@/services/orders.service";
import { useNotification } from "@/contexts/NotificationContext";
import { useRouter } from "next/navigation";

type Pedido = {
  id: string;
  pedido: string;
  fecha: string;
  articulosSolicitados: number;
  estatus: string;
  pago: string;
  total: number;
};

const STATUS_TABS: TabOption[] = [
  { label: "Todos", value: "all" },
  { label: "Pendientes", value: "Pendiente" },
  { label: "Surtidos", value: "Surtido" },
];

const STATUS_CHIP_VARIANTS: Record<string, StatusChipVariant> = {
  Pendiente: "pending",
  Surtido: "success",
  Pagado: "success",
};

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
  const total = order.items?.reduce(
    (sum, item) => sum + (item.quantity * (item.cost || 0)),
    0
  ) || 0;

  // Map status from API to UI format
  const statusMap: Record<string, string> = {
    pending: "Pendiente",
    approved: "Pendiente",
    in_process: "Pendiente",
    partially_received: "Pendiente",
    received: "Surtido",
    cancelled: "Pendiente",
  };

  return {
    id: order.id.toString(),
    pedido: `PO-${order.id.toString().padStart(5, "0")}`,
    fecha: formatDate(order.orderDate),
    articulosSolicitados: itemCount,
    estatus: statusMap[order.status] || "Pendiente",
    pago: "Pendiente", // This would come from a different API
    total: total,
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

  // Load orders from API
  const loadOrders = useCallback(async () => {
    await execute(
      () => ordersService.getOrders({ page: page + 1, limit: rowsPerPage }),
      {
        showErrorNotification: true,
      }
    );
  }, [execute, page, rowsPerPage]);

  // Load stats from API
  const loadStats = useCallback(async () => {
    await executeStats(
      () => ordersService.getStats(),
      { showErrorNotification: false }
    );
  }, [executeStats]);

  // Initial load
  useEffect(() => {
    loadOrders();
    loadStats();
  }, [loadOrders, loadStats]);

  // Get data source from API
  const sourceData = useMemo(() => {
    return ordersData?.rows?.map(mapOrderToPedido) || [];
  }, [ordersData]);
  console.log("🚀 ~ PedidosPage ~ sourceData:", sourceData)

  const filteredPedidos = useMemo(() => {
    let filtered: Pedido[] = sourceData;

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter((p: Pedido) => p.estatus === activeTab);
    }

    // Filter by search
    if (searchValue) {
      const search = searchValue.toLowerCase();
      filtered = filtered.filter((p: Pedido) =>
        p.pedido.toLowerCase().includes(search) ||
        p.fecha.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [activeTab, searchValue, sourceData]);
  console.log("🚀 ~ PedidosPage ~ filteredPedidos:", filteredPedidos)

  const paginatedPedidos = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredPedidos.slice(start, start + rowsPerPage);
  }, [filteredPedidos, page, rowsPerPage]);

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
    count: t.value === activeTab ? filteredPedidos.length : undefined,
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
          onSearchChange={setSearchValue}
          searchPlaceholder="Buscar"
        />

        <TableCrud
          columns={columns}
          rows={paginatedPedidos}
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
