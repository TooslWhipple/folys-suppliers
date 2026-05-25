"use client";

import { useState, useMemo } from "react";
import { Stack } from "@mui/material";
import { MainLayout } from "@/components/layout/MainLayout";
import { Title } from "@/components/Title/Title";
import { StatsCardGroup, StatsCardData } from "@/components/StatsCard/StatsCard";
import { TabFilters } from "@/components/TabFilters/TabFilters";
import { TableCrud } from "@/components/TableCrud/TableCrud";
import { SolicitudRefaccionDetailModal } from "@/components/MercanciaDanadaDetailModal/MercanciaDanadaDetailModal";
import { AlertTriangle } from "lucide-react";
import { solicitudesRefaccionDetalle, type SolicitudRefaccionDetail } from "@/mocks/data";
import type { TabOption } from "@/components/TabFilters/TabFilters";
import type { Column, RowAction } from "@/components/TableCrud/TableCrud";
import type { StatusChipVariant } from "@/components/StatusChip/StatusChip";

type Solicitud = SolicitudRefaccionDetail;

const STATUS_VARIANTS: Record<string, StatusChipVariant> = {
  "Por entregar": "warning",
  "Entregado": "success",
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
      const showAlert = row.estatus === "Por entregar";
      return (
        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
          {showAlert && <AlertTriangle size={14} color="#DC2626" />}
          <span>{tiempo}</span>
        </Stack>
      );
    },
  },
];

const MOCK_STATS: StatsCardData[] = [
  {
    id: "solicitudes-pendientes",
    label: "Solicitudes pendientes",
    value: solicitudesRefaccionDetalle.filter((i) => i.estatus === "Por entregar").length,
    isCurrency: false,
  },
  {
    id: "cantidad-total",
    label: "Cantidad total pendiente",
    value: solicitudesRefaccionDetalle.filter((i) => i.estatus === "Por entregar").reduce((acc, i) => acc + i.cantidad, 0),
    isCurrency: false,
  },
];

export default function SolicitudesRelacionesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [selectedItem, setSelectedItem] = useState<SolicitudRefaccionDetail | null>(null);

  const filteredData = useMemo(() => {
    let data = solicitudesRefaccionDetalle;

    if (activeTab !== "all") {
      data = data.filter((item) => item.estatus === activeTab);
    }

    if (searchValue.trim()) {
      const q = searchValue.trim().toLowerCase();
      data = data.filter(
        (item) =>
          item.articulo.toLowerCase().includes(q) ||
          item.refaccion.toLowerCase().includes(q) ||
          item.generada.toLowerCase().includes(q)
      );
    }

    return data;
  }, [activeTab, searchValue]);

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const tabs = STATUS_TABS.map((t) => ({
    ...t,
    count: t.value === activeTab ? filteredData.length : undefined,
  }));

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPage(0);
  };

  const actions: RowAction<Solicitud>[] = [
    {
      id: "ver",
      label: "Ver detalle",
      onClick: (row) => setSelectedItem(row),
    },
  ];

  return (
    <MainLayout>
      <Stack direction="column" spacing={3}>
        <Title title="Solicitudes de refacciones" />

        <StatsCardGroup cards={MOCK_STATS} />

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
          rows={paginatedData}
          actions={actions}
          rowKey="id"
          page={page}
          rowsPerPage={rowsPerPage}
          totalRows={filteredData.length}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          onRowClick={(row) => setSelectedItem(row)}
          emptyMessage="No hay solicitudes de refacciones"
        />
      </Stack>

      <SolicitudRefaccionDetailModal
        open={Boolean(selectedItem)}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </MainLayout>
  );
}
