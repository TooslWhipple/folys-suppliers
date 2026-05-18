"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Stack } from "@mui/material";
import { MainLayout } from "@/components/layout/MainLayout";
import { Title } from "@/components/Title/Title";
import { StatsCardGroup, StatsCardData } from "@/components/StatsCard/StatsCard";
import { TabFilters } from "@/components/TabFilters/TabFilters";
import { TableCrud } from "@/components/TableCrud/TableCrud";
import { AlertTriangle } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import {
  damagedProductsService,
  DamagedProductItem,
  DamagedProductStats,
  PaginatedResponse,
} from "@/services/damaged-products.service";
import { useNotification } from "@/contexts/NotificationContext";
import type { TabOption } from "@/components/TabFilters/TabFilters";
import type { Column, RowAction } from "@/components/TableCrud/TableCrud";
import type { StatusChipVariant } from "@/components/StatusChip/StatusChip";

// Frontend type matching the table columns
type Mercancia = {
  id: string;
  reportado: string;
  articulo: string;
  generada: string;
  dano: string;
  estatus: string;
  tiempo: string;
};

const STATUS_VARIANTS: Record<string, StatusChipVariant> = {
  "Por recolectar": "warning",
  "Recolectado": "success",
};

// Map backend status to frontend status
const mapStatusToFrontend = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: "Por recolectar",
    in_progress: "Por recolectar",
    completed: "Recolectado",
    cancelled: "Cancelado",
  };
  return statusMap[status] || "Por recolectar";
};

// Map backend data to frontend format
const mapToFrontend = (item: DamagedProductItem, index: number): Mercancia => {
  const date = new Date(item.registrationDate);
  const formattedDate = date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return {
    id: `${item.productCode}-${index}`,
    reportado: formattedDate,
    articulo: item.productName,
    generada: item.branch.name,
    dano: item.damageType,
    estatus: mapStatusToFrontend(item.status),
    tiempo: item.elapsedSinceRegistration,
  };
};

const STATUS_TABS: TabOption[] = [
  { label: "Todos", value: "all" },
  { label: "Por recolectar", value: "Por recolectar" },
  { label: "Recolectado", value: "Recolectado" },
];

const columns: Column<Mercancia>[] = [
  { id: "reportado", label: "Reportado", size: "md" },
  { id: "articulo", label: "Artículo", size: "lg" },
  { id: "generada", label: "Generada", size: "sm" },
  { id: "dano", label: "Daño", size: "md" },
  { id: "estatus", label: "Estatus", type: "chip", size: "sm", chipVariantMap: STATUS_VARIANTS },
  {
    id: "tiempo",
    label: "Tiempo",
    size: "sm",
    format: (value) => (
      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
        <AlertTriangle size={14} color="#DC2626" />
        <span>{value as string}</span>
      </Stack>
    ),
  },
];

const actions: RowAction<Mercancia>[] = [
  { id: "ver", label: "Ver detalle", onClick: (row) => console.log("Ver", row.id) },
  { id: "editar", label: "Editar", onClick: (row) => console.log("Editar", row.id) },
];

export default function MercanciaDanadaPage() {
  useNotification();
  const { execute, loading, data: productsData } = useApi<PaginatedResponse<DamagedProductItem>>();
  const { execute: executeStats, data: statsData } = useApi<DamagedProductStats>();

  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  // Load damaged products from API
  const loadProducts = useCallback(async () => {
    await execute(
      () =>
        damagedProductsService.getDamagedProducts({
          page: page + 1,
          limit: rowsPerPage,
          search: searchValue.trim() || undefined,
        }),
      { showErrorNotification: true }
    );
  }, [execute, page, rowsPerPage, searchValue]);

  // Load stats from API
  const loadStats = useCallback(async () => {
    await executeStats(() => damagedProductsService.getStats(), {
      showErrorNotification: false,
    });
  }, [executeStats]);

  // Initial load and pagination changes
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Load stats once on mount
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Map API data to frontend format
  const sourceData = useMemo(() => {
    return productsData?.rows?.map(mapToFrontend) || [];
  }, [productsData]);

  // Filter by tab (client-side since API doesn't filter by status)
  const filteredData = useMemo(() => {
    let data = sourceData;

    if (activeTab !== "all") {
      data = data.filter((item) => item.estatus === activeTab);
    }

    return data;
  }, [activeTab, sourceData]);

  const tabs = STATUS_TABS.map((t) => ({
    ...t,
    count: t.value === activeTab ? filteredData.length : undefined,
  }));

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPage(0);
  };

  // Stats cards with real data
  const statsCards: StatsCardData[] = [
    {
      id: "articulos-pendientes",
      label: "Artículos pendientes por recolectar",
      value: statsData?.pendingItems || 0,
      isCurrency: false,
    },
    {
      id: "costo-reparaciones",
      label: "Costo de reparaciones",
      value: Number(statsData?.totalValue || 0),
      isCurrency: true,
    },
  ];

  return (
    <MainLayout>
      <Stack direction="column" spacing={3}>
        <Title title="Mercancía dañada" />

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
          rows={filteredData}
          actions={actions}
          loading={loading}
          rowKey="id"
          page={page}
          rowsPerPage={rowsPerPage}
          totalRows={productsData?.total || 0}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          emptyMessage="No hay registros de mercancía dañada"
        />
      </Stack>
    </MainLayout>
  );
}
