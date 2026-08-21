"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Stack, TextField } from "@mui/material";
import { MainLayout } from "@/components/layout/MainLayout";
import { Title } from "@/components/Title/Title";
import { TableCrud } from "@/components/TableCrud/TableCrud";
import type { Column } from "@/components/TableCrud/TableCrud";
import { useApi } from "@/hooks/useApi";
import { catalogService, type CatalogItem } from "@/services/catalog.service";
import type { PaginatedResponse } from "@/types/pagination";
import { useDebouncedValue } from "./useDebouncedValue";

const SEARCH_DEBOUNCE_MS = 400;

const COLUMNS: Column<CatalogItem>[] = [
  { id: "sku", label: "Código", size: "md" },
  { id: "nombre", label: "Nombre", size: "xl", truncate: true },
  { id: "enviadosUltAno", label: "Enviados últ. año", type: "number", size: "md" },
  { id: "enviadosUltMes", label: "Enviados últ. mes", type: "number", size: "md" },
  { id: "enviadosMesActual", label: "Enviados mes actual", type: "number", size: "md" },
  { id: "unidades", label: "Stock", type: "number", size: "sm" },
];

export default function CatalogoPage() {
  const { execute, loading, data } = useApi<PaginatedResponse<CatalogItem>>();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  const debouncedSearch = useDebouncedValue(searchValue, SEARCH_DEBOUNCE_MS);

  // Búsqueda y paginación son server-side: cada cambio dispara una petición
  // nueva, nunca un recorte de un arreglo ya cargado.
  const loadCatalog = useCallback(async () => {
    await execute(
      () =>
        catalogService.getCatalog({
          page: page + 1,
          limit: rowsPerPage,
          search: debouncedSearch.trim() || undefined,
        }),
      { showErrorNotification: true }
    );
  }, [execute, page, rowsPerPage, debouncedSearch]);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  const rows = useMemo(() => data?.rows ?? [], [data]);
  const totalRows = data?.total ?? 0;

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setPage(0);
  };

  return (
    <MainLayout>
      <Stack direction="column" spacing={3}>
        <Title title="Catálogo de artículos" />

        <TextField
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Buscar por código o nombre"
          size="small"
          sx={{ maxWidth: 360 }}
        />

        <TableCrud
          columns={COLUMNS}
          rows={rows}
          loading={loading}
          rowKey="id"
          page={page}
          rowsPerPage={rowsPerPage}
          totalRows={totalRows}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          emptyMessage="No hay artículos en el catálogo"
        />
      </Stack>
    </MainLayout>
  );
}
