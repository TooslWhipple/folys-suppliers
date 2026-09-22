"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Typography, Paper, Stack, Divider, TablePagination } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Title } from "@/components/Title/Title";
import { TabFilters } from "@/components/TabFilters/TabFilters";
import { StatusChip } from "@/components/StatusChip/StatusChip";
import { colors } from "@/lib/theme";
import {
  INVOICE_STATUS_CHIP_VARIANTS,
  INVOICE_STATUS_LABELS,
} from "@/lib/statusChips";
import { useApi } from "@/hooks/useApi";
import {
  invoicesService,
  type DocumentRequestItem,
  type DocumentRequestTipo,
  type DocumentRequestsResponse,
  type SupplierInvoiceStatusFilter,
  type SupplierInvoicesResponse,
} from "@/services/invoices.service";
import numeral from "numeral";
import type { TabOption } from "@/components/TabFilters/TabFilters";

const STATUS_TABS: TabOption[] = [
  { label: "Todas", value: "all" },
  { label: "Pendientes", value: "pending" },
  { label: "Pagadas", value: "paid" },
];

const DOCUMENT_REQUEST_LABELS: Record<DocumentRequestTipo, { tipo: string; descripcion: string }> = {
  nota_credito: {
    tipo: "Nota de crédito",
    descripcion: "Ajuste de costo de artículos relacionada a las facturas",
  },
};

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const StatsCard = styled(Paper)({
  backgroundColor: colors.background.sidebar,
  borderRadius: "12px",
  border: `1px solid ${colors.border}`,
  boxShadow: "none",
  padding: "20px 24px",
  flex: 1,
});

const TableContainer = styled(Paper)({
  backgroundColor: colors.background.sidebar,
  borderRadius: "12px",
  border: `1px solid ${colors.border}`,
  boxShadow: "none",
  overflow: "hidden",
  flex: 1,
});

const COL = "1fr 110px 140px 130px";

const TableHeaderRow = styled(Box)({
  display: "grid",
  gridTemplateColumns: COL,
  gap: "16px",
  padding: "14px 24px",
  borderBottom: `1px solid ${colors.border}`,
});

const TableDataRow = styled(Box)({
  display: "grid",
  gridTemplateColumns: COL,
  gap: "16px",
  padding: "14px 24px",
  borderBottom: `1px solid ${colors.border}`,
  alignItems: "center",
  cursor: "pointer",
  "&:hover": { backgroundColor: colors.background.main },
  "&:last-child": { borderBottom: "none" },
});

const SolicitudCard = styled(Paper)({
  backgroundColor: colors.background.sidebar,
  borderRadius: "12px",
  border: `1px solid ${colors.border}`,
  boxShadow: "none",
  padding: "20px",
  width: 300,
  flexShrink: 0,
  alignSelf: "flex-start",
});

const EmptyState = ({ children }: { children: string }) => (
  <Box sx={{ px: 3, py: 4, textAlign: "center" }}>
    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
      {children}
    </Typography>
  </Box>
);

const facturasRelacionadas = (item: DocumentRequestItem): string =>
  item.facturas.length > 0
    ? item.facturas.map((factura) => factura.folio).join(", ")
    : "Sin facturas relacionadas";

export default function FacturasPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<SupplierInvoiceStatusFilter>("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

  const {
    execute: executeInvoices,
    loading: loadingInvoices,
    error: invoicesError,
    data: invoicesData,
  } = useApi<SupplierInvoicesResponse>();

  const {
    execute: executeRequests,
    loading: loadingRequests,
    error: requestsError,
    data: requestsData,
  } = useApi<DocumentRequestsResponse>();

  const loadInvoices = useCallback(async () => {
    await executeInvoices(() =>
      invoicesService.getInvoices({ page: page + 1, limit: rowsPerPage, status: activeTab })
    );
  }, [executeInvoices, page, rowsPerPage, activeTab]);

  const loadDocumentRequests = useCallback(async () => {
    await executeRequests(() => invoicesService.getDocumentRequests({ status: "open" }));
  }, [executeRequests]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  useEffect(() => {
    loadDocumentRequests();
  }, [loadDocumentRequests]);

  const invoices = useMemo(() => invoicesData?.items ?? [], [invoicesData]);
  const requests = useMemo(() => requestsData?.items ?? [], [requestsData]);
  const summary = invoicesData?.summary;
  const totalInvoices = invoicesData?.pagination.total ?? 0;
  const totalOpenRequests = requestsData?.pagination.total ?? 0;

  const handleTabChange = (value: string) => {
    setActiveTab(value as SupplierInvoiceStatusFilter);
    setPage(0);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <MainLayout>
      <Stack direction="column" spacing={3}>
        <Title title="Facturas" />

        {/* Two-column layout */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>

          {/* Left column: stats + table */}
          <Stack direction="column" spacing={2} sx={{ flex: 1, minWidth: 0 }}>

            {/* Stats row */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <StatsCard>
                <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
                  Pendiente de cobro
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {numeral(summary?.pendienteCobro ?? 0).format("$0,0.00")}
                </Typography>
              </StatsCard>
              <StatsCard>
                <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
                  Pendiente por facturar
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {numeral(summary?.pendienteFacturar ?? 0).format("$0,0.00")}
                </Typography>
              </StatsCard>
            </Box>

            <TabFilters tabs={STATUS_TABS} activeTab={activeTab} onTabChange={handleTabChange} />

            {/* Table */}
            <TableContainer>
              {/* Column headers */}
              <TableHeaderRow>
                <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500 }}>Fecha</Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500 }}>Pedido</Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500 }}>Estatus</Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500 }}>Total</Typography>
              </TableHeaderRow>

              {loadingInvoices && <EmptyState>Cargando facturas…</EmptyState>}

              {!loadingInvoices && invoicesError && (
                <EmptyState>No se pudieron cargar las facturas</EmptyState>
              )}

              {!loadingInvoices && !invoicesError && invoices.length === 0 && (
                <EmptyState>No hay facturas</EmptyState>
              )}

              {/* Rows */}
              {!loadingInvoices && invoices.map((item) => (
                <TableDataRow key={item.id} onClick={() => router.push(`/facturas/${item.id}`)}>
                  <Typography variant="body2">{formatDate(item.fechaEmision)}</Typography>
                  <Typography variant="body2">{item.pedido?.folio ?? "—"}</Typography>
                  <Box>
                    <StatusChip
                      label={INVOICE_STATUS_LABELS[item.estatus]}
                      variant={INVOICE_STATUS_CHIP_VARIANTS[item.estatus]}
                    />
                  </Box>
                  <Typography variant="body2">{numeral(item.total).format("$0,0.00")}</Typography>
                </TableDataRow>
              ))}

              {totalInvoices > 0 && (
                <TablePagination
                  component="div"
                  rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                  count={totalInvoices}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={(_, newPage) => setPage(newPage)}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  labelRowsPerPage="Filas por página:"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                  }
                  sx={{
                    borderTop: `1px solid ${colors.border}`,
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "flex-end",
                    "& .MuiTablePagination-toolbar": {
                      minHeight: 52,
                      flexWrap: "wrap",
                      justifyContent: "flex-end",
                      padding: "0 16px",
                    },
                    "& .MuiTablePagination-spacer": {
                      display: "none",
                    },
                  }}
                />
              )}
            </TableContainer>
          </Stack>

          {/* Right column: Solicitud de documentos */}
          <SolicitudCard>
            {/* Bell icon */}
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: "#EFF6FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              <Bell size={20} color="#3B82F6" strokeWidth={1.5} />
            </Box>
            <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 2 }}>
              Solicitud de documentos
            </Typography>

            {loadingRequests && (
              <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", py: 1.5 }}>
                Cargando solicitudes…
              </Typography>
            )}

            {!loadingRequests && requestsError && (
              <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", py: 1.5 }}>
                No se pudieron cargar las solicitudes
              </Typography>
            )}

            {!loadingRequests && !requestsError && requests.length === 0 && (
              <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", py: 1.5 }}>
                No hay solicitudes abiertas
              </Typography>
            )}

            {!loadingRequests && requests.length > 0 && (
              <Stack direction="column" spacing={0} divider={<Divider sx={{ borderColor: colors.border }} />}>
                {requests.map((item) => (
                  <Box key={item.id} sx={{ py: 1.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                          {DOCUMENT_REQUEST_LABELS[item.tipo].tipo}
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", lineHeight: 1.4 }}>
                          {DOCUMENT_REQUEST_LABELS[item.tipo].descripcion}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "#1570EF", display: "block", mt: 0.25, lineHeight: 1.4 }}
                        >
                          {facturasRelacionadas(item)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, flexShrink: 0 }}>
                        {numeral(item.monto).format("$0,0.00")}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            )}

            {!loadingRequests && totalOpenRequests > requests.length && (
              <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", pt: 1.5 }}>
                Mostrando {requests.length} de {totalOpenRequests} solicitudes abiertas
              </Typography>
            )}
          </SolicitudCard>
        </Box>
      </Stack>
    </MainLayout>
  );
}
