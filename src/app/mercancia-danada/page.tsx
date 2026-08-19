"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Grid, Stack } from "@mui/material";
import { MainLayout } from "@/components/layout/MainLayout";
import { Title } from "@/components/Title/Title";
import { StatsCardGroup, StatsCardData } from "@/components/StatsCard/StatsCard";
import { TabFilters } from "@/components/TabFilters/TabFilters";
import { TableCrud } from "@/components/TableCrud/TableCrud";
import { FormDatePicker } from "@/components/Form/FormDatePicker";
import { MercanciaDanadaDrawer } from "@/components/MercanciaDanadaDrawer/MercanciaDanadaDrawer";
import { useApi } from "@/hooks/useApi";
import {
  damagedProductsService,
  type DamagedProductToCollect,
  type DamagedProductToRepair,
  type DamagedProductDetail,
  type DamagedProductStats,
} from "@/services/damaged-products.service";
import type { PaginatedResponse } from "@/types/pagination";
import { useDebouncedValue } from "./useDebouncedValue";
import type { TabOption } from "@/components/TabFilters/TabFilters";
import type { Column } from "@/components/TableCrud/TableCrud";

const TAB_TO_COLLECT = "to-collect";
const TAB_TO_REPAIR = "to-repair";

const SEARCH_DEBOUNCE_MS = 400;

const TABS: TabOption[] = [
  { label: "A recolectar", value: TAB_TO_COLLECT },
  { label: "A reparación", value: TAB_TO_REPAIR },
];

/** Row as the table renders it, shared by both tabs. */
type MercanciaRow = {
  id: number;
  folio: string;
  articulo: string;
  tipoDano: string;
  fechaReporte: string;
  tiempoEspera: number;
  costoReparacion?: number;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const mapToRow = (
  item: DamagedProductToCollect | DamagedProductToRepair
): MercanciaRow => ({
  id: item.id,
  folio: item.folio,
  articulo: item.productName,
  tipoDano: item.damageType,
  fechaReporte: formatDate(item.reportDate),
  tiempoEspera: item.waitingDays,
  costoReparacion: "repairCost" in item ? item.repairCost : undefined,
});

const BASE_COLUMNS: Column<MercanciaRow>[] = [
  { id: "folio", label: "Folio", size: "md" },
  { id: "articulo", label: "Artículo", size: "lg", truncate: true },
  { id: "tipoDano", label: "Tipo de daño", size: "md" },
  { id: "fechaReporte", label: "Fecha de reporte", size: "md" },
  {
    id: "tiempoEspera",
    label: "Tiempo en espera",
    size: "md",
    format: (value) => {
      const days = value as number;
      return days === 1 ? "1 día" : `${days} días`;
    },
  },
];

const REPAIR_COST_COLUMN: Column<MercanciaRow> = {
  id: "costoReparacion",
  label: "Costo de reparación",
  type: "currency",
  size: "md",
  align: "right",
};

export default function MercanciaDanadaPage() {
  const { execute, loading, data } =
    useApi<PaginatedResponse<DamagedProductToCollect | DamagedProductToRepair>>();
  const { execute: executeStats, data: stats } = useApi<DamagedProductStats>();
  const {
    execute: executeDetail,
    data: detail,
    loading: detailLoading,
    reset: resetDetail,
  } = useApi<DamagedProductDetail>();

  const [activeTab, setActiveTab] = useState(TAB_TO_COLLECT);
  const [detailOpen, setDetailOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const debouncedSearch = useDebouncedValue(searchValue, SEARCH_DEBOUNCE_MS);

  // The list is paginated, searched and filtered server-side: every change of
  // these inputs is a new request, never a slice of an already fetched array.
  // `sortDir` is left out on purpose so the API default applies (oldest first).
  const loadList = useCallback(async () => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      search: debouncedSearch.trim() || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    };

    await execute(
      () =>
        activeTab === TAB_TO_COLLECT
          ? damagedProductsService.getToCollect(params)
          : damagedProductsService.getToRepair(params),
      { showErrorNotification: true }
    );
  }, [execute, activeTab, page, rowsPerPage, debouncedSearch, dateFrom, dateTo]);

  // The stats describe each tab as a whole: they ignore the search and date
  // inputs, so a single request on mount is enough. The screen is read-only for
  // the supplier, nothing here can make the counters go stale.
  const loadStats = useCallback(async () => {
    await executeStats(() => damagedProductsService.getStats(), {
      showErrorNotification: true,
    });
  }, [executeStats]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const rows = useMemo(() => data?.rows?.map(mapToRow) ?? [], [data]);

  const totalRows = data?.total ?? 0;

  const statsCards = useMemo<StatsCardData[]>(
    () => [
      {
        id: "articulos-pendientes",
        label: "Artículos pendientes por recolectar",
        value: stats?.toCollectCount ?? 0,
        isCurrency: false,
      },
      {
        id: "costo-reparaciones",
        label: "Costo de reparaciones",
        value: stats?.toRepairTotalCost ?? 0,
        isCurrency: true,
      },
    ],
    [stats]
  );

  const columns = useMemo(
    () =>
      activeTab === TAB_TO_REPAIR
        ? [...BASE_COLUMNS, REPAIR_COST_COLUMN]
        : BASE_COLUMNS,
    [activeTab]
  );

  // Both counters come from the stats endpoint, so the inactive tab also shows
  // its total; while the request is in flight they stay undefined and the tab
  // renders without a counter instead of flashing a zero.
  const tabs = useMemo(
    () =>
      TABS.map((tab) => ({
        ...tab,
        count:
          tab.value === TAB_TO_COLLECT
            ? stats?.toCollectCount
            : stats?.toRepairCount,
      })),
    [stats]
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPage(0);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setPage(0);
  };

  const handleDateFromChange = (value: string) => {
    setDateFrom(value);
    setPage(0);
  };

  const handleDateToChange = (value: string) => {
    setDateTo(value);
    setPage(0);
  };

  // The detail lives behind its own endpoint (it carries fields the listing does
  // not return), so the drawer opens first and fills in when the request lands.
  const handleRowClick = (row: MercanciaRow) => {
    setDetailOpen(true);
    executeDetail(() => damagedProductsService.getDamagedProductById(row.id), {
      showErrorNotification: true,
    });
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    // Drop the previous item so reopening never flashes the old detail.
    resetDetail();
  };

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
          onSearchChange={handleSearchChange}
          searchPlaceholder="Buscar por folio o artículo"
        />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormDatePicker
              label="Reportado desde"
              value={dateFrom}
              onChange={handleDateFromChange}
              maxDate={dateTo || undefined}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormDatePicker
              label="Reportado hasta"
              value={dateTo}
              onChange={handleDateToChange}
              minDate={dateFrom || undefined}
            />
          </Grid>
        </Grid>

        <TableCrud
          columns={columns}
          rows={rows}
          loading={loading}
          rowKey="id"
          page={page}
          rowsPerPage={rowsPerPage}
          totalRows={totalRows}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          onRowClick={handleRowClick}
          emptyMessage={
            activeTab === TAB_TO_COLLECT
              ? "No hay artículos por recolectar"
              : "No hay artículos con costo de reparación asignado"
          }
        />
      </Stack>

      <MercanciaDanadaDrawer
        open={detailOpen}
        item={detail}
        loading={detailLoading}
        onClose={handleDetailClose}
      />
    </MainLayout>
  );
}
