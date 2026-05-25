"use client";

import { Box, Typography, Paper, Stack, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Bell } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Title } from "@/components/Title/Title";
import { StatusChip } from "@/components/StatusChip/StatusChip";
import { colors } from "@/lib/theme";
import { facturasItems, solicitudesDocumentos, type FacturaItem, type SolicitudDocItem } from "@/mocks/data";
import numeral from "numeral";

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

const STATUS_VARIANTS: Record<string, "warning" | "success"> = {
  pendiente: "warning",
  pagado: "success",
};

export default function FacturasPage() {
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
                  {numeral(290123.14).format("$0,0.00")}
                </Typography>
              </StatsCard>
              <StatsCard>
                <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
                  Pendiente por facturar
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {numeral(290123.14).format("$0,0.00")}
                </Typography>
              </StatsCard>
            </Box>

            {/* Table */}
            <TableContainer>
              {/* Column headers */}
              <TableHeaderRow>
                <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500 }}>Fecha</Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500 }}>Pedido</Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500 }}>Estatus</Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500 }}>Total</Typography>
              </TableHeaderRow>

              {/* Rows */}
              {facturasItems.map((item: FacturaItem) => (
                <TableDataRow key={item.id}>
                  <Typography variant="body2">{item.fecha}</Typography>
                  <Typography variant="body2">{item.pedido}</Typography>
                  <Box>
                    <StatusChip
                      label={item.estatus === "pendiente" ? "Pendiente" : "Pagado"}
                      variant={STATUS_VARIANTS[item.estatus]}
                    />
                  </Box>
                  <Typography variant="body2">{numeral(item.total).format("$0,0.00")}</Typography>
                </TableDataRow>
              ))}
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

            <Stack direction="column" spacing={0} divider={<Divider sx={{ borderColor: colors.border }} />}>
              {solicitudesDocumentos.map((item: SolicitudDocItem) => (
                <Box key={item.id} sx={{ py: 1.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {item.tipo}
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", lineHeight: 1.4 }}>
                        {item.descripcion}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#1570EF", display: "block", mt: 0.25, lineHeight: 1.4 }}
                      >
                        {item.facturas}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, flexShrink: 0 }}>
                      {numeral(item.monto).format("$0,0.00")}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </SolicitudCard>
        </Box>
      </Stack>
    </MainLayout>
  );
}
