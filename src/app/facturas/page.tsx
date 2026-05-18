"use client";

import { useState, useEffect, useCallback } from "react";
import { Box, Typography, Paper, Stack, IconButton, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ChevronLeft, ChevronRight, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Title } from "@/components/Title/Title";
import { colors } from "@/lib/theme";
import { useApi } from "@/hooks/useApi";
import { invoicesService, AccountStatementResponse } from "@/services/invoices.service";
import numeral from "numeral";

// Stats cards at top
const StatsCard = styled(Paper)({
  backgroundColor: colors.background.sidebar,
  borderRadius: "12px",
  border: `1px solid ${colors.border}`,
  padding: "20px",
  flex: 1,
});

const MonthSelector = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "16px",
});

const TableContainer = styled(Paper)({
  backgroundColor: colors.background.sidebar,
  borderRadius: "12px",
  border: `1px solid ${colors.border}`,
  overflow: "hidden",
});

const TableHeader = styled(Box)({
  display: "grid",
  gridTemplateColumns: "150px 1fr 120px 120px",
  gap: "16px",
  padding: "16px 24px",
  backgroundColor: colors.background.main,
  borderBottom: `1px solid ${colors.border}`,
});

const TableRow = styled(Box)({
  display: "grid",
  gridTemplateColumns: "150px 1fr 120px 120px",
  gap: "16px",
  padding: "16px 24px",
  borderBottom: `1px solid ${colors.border}`,
  alignItems: "center",
  "&:last-child": {
    borderBottom: "none",
  },
});

const TotalRow = styled(Box)({
  display: "grid",
  gridTemplateColumns: "150px 1fr 120px 120px",
  gap: "16px",
  padding: "16px 24px",
  backgroundColor: "#F1F5F9",
  borderRadius: "8px",
  margin: "16px 24px",
  alignItems: "center",
});

export default function FacturasPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1)); // November 2025

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthYear = currentDate.toLocaleDateString("es-MX", {
    month: "long",
    year: "numeric",
  });

  // Format month for API (YYYY-MM)
  const apiMonth = currentDate.toISOString().slice(0, 7);

  // Load account statement from API
  const { execute, loading, data: statementData } = useApi<AccountStatementResponse>();

  const loadStatement = useCallback(async () => {
    await execute(
      () => invoicesService.getAccountStatement({ month: apiMonth, page: 1, limit: 50 }),
      { showErrorNotification: true }
    );
  }, [execute, apiMonth]);

  // Load when month changes
  useEffect(() => {
    loadStatement();
  }, [loadStatement]);

  // Get data from API response
  const entries = statementData?.entries || [];
  const summary = statementData?.summary;
  const totalCargos = summary?.totalCargos || 0;
  const totalVentas = summary?.totalVentas || 0;
  const pendingAmount = summary?.pendingAmount || 0;

  return (
    <MainLayout>
      <Stack direction="column" spacing={3}>
        <Title title="Estados de cuenta" />

        {/* Stats Cards */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <StatsCard>
            <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
              Pendiente de cobro
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {numeral(pendingAmount).format("$0,0.00")}
            </Typography>
          </StatsCard>
          <StatsCard>
            <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
              Total Ventas
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {numeral(totalVentas).format("$0,0.00")}
            </Typography>
          </StatsCard>
        </Box>

        {/* Month Selector and Table */}
        <TableContainer>
          {/* Header with Month Selector */}
          <Box sx={{ p: 3, pb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <MonthSelector>
              <Typography variant="h6" sx={{ fontWeight: 600, textTransform: "capitalize" }}>
                {monthYear}
              </Typography>
              <Stack direction="row" spacing={0.5}>
                <IconButton onClick={handlePrevMonth} size="small">
                  <ChevronLeft size={20} />
                </IconButton>
                <IconButton onClick={handleNextMonth} size="small">
                  <ChevronRight size={20} />
                </IconButton>
              </Stack>
            </MonthSelector>
            <Chip
              label="Pendiente"
              size="small"
              sx={{
                backgroundColor: "#FEF3C7",
                color: "#D97706",
                fontWeight: 600,
                borderRadius: "16px",
              }}
            />
          </Box>

          {/* Table Header */}
          <TableHeader>
            <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 600 }}>
              Fecha
            </Typography>
            <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 600 }}>
              Concepto
            </Typography>
            <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 600, textAlign: "right" }}>
              Cargo
            </Typography>
            <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 600, textAlign: "right" }}>
              Venta
            </Typography>
          </TableHeader>

          {/* Table Rows */}
          {entries.map((item) => (
            <TableRow key={item.id}>
              <Typography variant="body2">
                {new Date(item.fecha).toLocaleDateString("es-MX", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {item.tipo === "venta" ? (
                  <ArrowDownRight size={16} color="#22C55E" />
                ) : (
                  <ArrowUpRight size={16} color="#DC2626" />
                )}
                <Typography variant="body2">{item.concepto}</Typography>
              </Box>
              <Typography variant="body2" sx={{ textAlign: "right" }}>
                {item.cargo > 0 ? numeral(item.cargo).format("$0,0.00") : "-"}
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "right" }}>
                {item.venta > 0 ? numeral(item.venta).format("$0,0.00") : "-"}
              </Typography>
            </TableRow>
          ))}

          {/* Subtotal Row */}
          <Box sx={{ px: 3, py: 2, borderTop: `1px solid ${colors.border}` }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 4 }}>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Subtotal
              </Typography>
              <Typography variant="body2" sx={{ width: 120, textAlign: "right" }}>
                {numeral(totalCargos).format("$0,0.00")}
              </Typography>
              <Typography variant="body2" sx={{ width: 120, textAlign: "right" }}>
                {numeral(totalVentas).format("$0,0.00")}
              </Typography>
            </Box>
          </Box>

          {/* Total Row */}
          <TotalRow>
            <Box />
            <Box />
            <Typography variant="body2" sx={{ fontWeight: 700, textAlign: "right" }}>
              Total
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, textAlign: "right" }}>
              {numeral(totalVentas - totalCargos).format("$0,0.00")}
            </Typography>
          </TotalRow>
        </TableContainer>
      </Stack>
    </MainLayout>
  );
}
