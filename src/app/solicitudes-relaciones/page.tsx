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
  sparePartRequestsService,
  SparePartRequestItem,
  SparePartRequestStats,
  PaginatedResponse,
} from "@/services/spare-part-requests.service";
import type { TabOption } from "@/components/TabFilters/TabFilters";
import type { Column, RowAction } from "@/components/TableCrud/TableCrud";
import type { StatusChipVariant } from "@/components/StatusChip/StatusChip";

// Frontend type matching the table columns
type Solicitud = {
  id: string;
  solicitado: string;
  articulo: string;
  generada: string;
  refaccion: string;
  estatus: string;
  tiempo: string;
};

const STATUS_VARIANTS: Record<string, StatusChipVariant> = {
  "Por entregar": "warning",
  "Entregado": "success",
};

// Map backend status to frontend status
const mapStatusToFrontend = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: "Por entregar",
    delivered: "Entregado",
    cancelled: "Entregado",
  };
  return statusMap[status] || "Por entregar";
};

// Map backend data to frontend format
const mapToFrontend = (item: SparePartRequestItem): Solicitud => {
  const date = new Date(item.requestedAt);
  const formattedDate = date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return {
    id: item.id,
    solicitado: formattedDate,
    articulo: item.productName,
    generada: item.productCode,
    refaccion: item.sparePartName,
    estatus: mapStatusToFrontend(item.status),
    tiempo: item.elapsedTime,
  };
};

const STATUS_TABS: TabOption[] = [
  { label: "Todos", value: "all" },
  { label: "Por entregar", value: "Por entregar" },
  { label: "Entregados", value: "Entregado" },
];

const columns: Column<Solicitud>[] = [
  { id: "solicitado", label: "Solicitado", size: "md" },
  { id: "articulo", label: "Artículo", size: "lg" },
  { id: "generada", label: "Generada", size: "sm" },
  { id: "refaccion", label: "Refacción", size: "md" },
  { id: "estatus", label: "Estatus", type: "chip", size: "sm", chipVariantMap: STATUS_VARIANTS },
  {
    id: "tiempo",
    label: "Tiempo",
    size: "sm",
    format: (value, row) => {
      const tiempo = value as string;
      const showAlert = row.estatus === "Por entregar" && (tiempo.includes("día") || tiempo.includes("días") || tiempo.includes("mes") || tiempo.includes("meses"));
      return (
        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
          {showAlert && <AlertTriangle size={14} color="#DC2626" />}
          <span>{tiempo}</span>
        </Stack>
      );
    },
  },
];

const actions: RowAction<Solicitud>[] = [
  { id: "ver", label: "Ver detalle", onClick: (row) => console.log("Ver", row.id) },
  { id: "editar", label: "Editar", onClick: (row) => console.log("Editar", row.id) },
];

export default function SolicitudesRelacionesPage() {
  const { execute, loading, data: requestsData } = useApi<PaginatedResponse<SparePartRequestItem>>();
  const { execute: executeStats, data: statsData } = useApi<SparePartRequestStats>();

  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  // Load requests from API
  const loadRequests = useCallback(async () => {
    await execute(
      () =>
        sparePartRequestsService.getSparePartRequests({
          page: page + 1,
          limit: rowsPerPage,
          search: searchValue.trim() || undefined,
        }),
      { showErrorNotification: true }
    );
  }, [execute, page, rowsPerPage, searchValue]);

  // Load stats from API
  const loadStats = useCallback(async () => {
    await executeStats(() => sparePartRequestsService.getStats(), {
      showErrorNotification: false,
    });
  }, [executeStats]);

  // Initial load and pagination changes
  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  // Load stats once on mount
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Map API data to frontend format
  const sourceData = useMemo(() => {
    return requestsData?.rows?.map(mapToFrontend) || [];
  }, [requestsData]);

  // Filter by tab (client-side)
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
      id: "solicitudes-pendientes",
      label: "Solicitudes pendientes",
      value: statsData?.itemsPending || 0,
      isCurrency: false,
    },
    {
      id: "cantidad-total",
      label: "Cantidad total pendiente",
      value: statsData?.totalQuantity || 0,
      isCurrency: false,
    },
  ];

  return (
    <MainLayout>
      <Stack direction="column" spacing={3}>
        <Title title="Solicitudes de refacciones" />

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
          totalRows={requestsData?.total || 0}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          emptyMessage="No hay solicitudes de refacciones"
        />
      </Stack>
    </MainLayout>
  );
}
