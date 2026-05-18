"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Box, Typography, Grid, Paper, Stack, Menu, MenuItem, Drawer, IconButton, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ComposedChart, Bar, Line, XAxis, ResponsiveContainer } from "recharts";
import { ChevronDown, X } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Title } from "@/components/Title/Title";
import { TabFilters } from "@/components/TabFilters/TabFilters";
import { colors } from "@/lib/theme";
import { useApi } from "@/hooks/useApi";
import { catalogService, CatalogItem, PaginatedResponse } from "@/services/catalog.service";
import { useNotification } from "@/contexts/NotificationContext";
import type { TabOption } from "@/components/TabFilters/TabFilters";

type Articulo = CatalogItem;

type FilterType = "mas-vendidos" | "menos-vendidos";
type PeriodType = "ultimo-mes" | "ultimo-ano" | "mes-actual";

const STATUS_TABS: TabOption[] = [
  { label: "Todos", value: "all" },
  { label: "Activos", value: "activo" },
  { label: "Archivados", value: "archivado" },
];

const ProductCard = styled(Paper)({
  backgroundColor: colors.background.sidebar,
  borderRadius: "12px",
  border: `1px solid ${colors.border}`,
  padding: "16px",
  display: "flex",
  gap: "16px",
  alignItems: "center",
});

const ProductImage = styled(Box)({
  width: 80,
  height: 80,
  borderRadius: "8px",
  backgroundColor: colors.background.main,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  overflow: "hidden",
});

const StockIndicator = styled(Box)(({ status }: { status: "critical" | "warning" | "good" }) => {
  const colorMap = {
    critical: "#DC2626",
    warning: "#F97316",
    good: "#22C55E",
  };
  return {
    display: "flex",
    gap: "2px",
    alignItems: "center",
    "& > div": {
      width: "3px",
      height: "12px",
      borderRadius: "1px",
      backgroundColor: colorMap[status],
    },
  };
});

interface MiniChartProps {
  data: { mes: string; enviados: number }[];
}

function MiniChart({ data }: MiniChartProps) {
  return (
    <Box sx={{ width: 280, height: 100 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <Bar dataKey="enviados" fill="#DBEAFE" radius={[3, 3, 0, 0]} barSize={30} />
          <Line
            type="monotone"
            dataKey="enviados"
            stroke="#F97316"
            strokeWidth={2}
            dot={false}
          />
          <XAxis
            dataKey="mes"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: colors.text.secondary }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
}

interface ProductItemProps {
  articulo: Articulo;
  onClick: () => void;
}

function ProductItem({ articulo, onClick }: ProductItemProps) {
  return (
    <ProductCard onClick={onClick} sx={{ cursor: "pointer", "&:hover": { backgroundColor: colors.background.main } }}>
      {/* Left: Product Image */}
      <ProductImage>
        <Box
          component="img"
          src={articulo.imagen}
          alt={articulo.nombre}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#F3F4F6",
          }}
        >
          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
            IMG
          </Typography>
        </Box>
      </ProductImage>

      {/* Middle: Product Name, SKU, Units, Stock, Stats */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1, minWidth: 0 }}>
        {/* Product Name */}
        <Typography variant="body1" sx={{ fontWeight: 700, color: colors.text.primary, lineHeight: 1.3, textAlign: "center" }}>
          {articulo.nombre}
        </Typography>

        {/* SKU */}
        <Typography variant="caption" sx={{ color: colors.text.secondary }}>
          {articulo.sku}
        </Typography>

        {/* Units + Stock Indicator */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text.primary }}>
            {articulo.unidades} unidades
          </Typography>
          <StockIndicator status={articulo.unidadesStatus}>
            <div style={{ opacity: 1 }} />
            <div style={{ opacity: articulo.unidadesStatus === "critical" ? 0.3 : 1 }} />
            <div style={{ opacity: articulo.unidadesStatus === "good" ? 1 : 0.3 }} />
          </StockIndicator>
        </Box>

        {/* Stats Row */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1.5 }}>
          <Box sx={{ textAlign: "center", flex: 1 }}>
            <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
              Enviados Ult. año
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {articulo.enviadosUltAno}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center", flex: 1 }}>
            <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
              Enviados Ult. mes
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {articulo.enviadosUltMes}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center", flex: 1 }}>
            <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
              Enviados mes actual
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {articulo.enviadosMesActual}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right: Chart */}
      <MiniChart data={articulo.ventasMensuales} />
    </ProductCard>
  );
}

export default function CatalogoPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("mas-vendidos");
  const [periodType, setPeriodType] = useState<PeriodType>("ultimo-mes");
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [periodAnchor, setPeriodAnchor] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Articulo | null>(null);

  const { execute, loading, data: catalogData } = useApi<PaginatedResponse<CatalogItem>>();

  // Load catalog data from API
  const loadCatalog = useCallback(async () => {
    await execute(
      () =>
        catalogService.getCatalog({
          page: 1,
          limit: 50,
          search: searchValue.trim() || undefined,
          status: activeTab,
        }),
      { showErrorNotification: true }
    );
  }, [execute, searchValue, activeTab]);

  // Initial load and when filters change
  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  const handleProductClick = (articulo: Articulo) => {
    setSelectedProduct(articulo);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedProduct(null);
  };

  const filteredData = useMemo(() => {
    let data = catalogData?.rows || [];

    // Sort by filter type
    if (filterType === "mas-vendidos") {
      data = [...data].sort((a, b) => b.enviadosMesActual - a.enviadosMesActual);
    } else {
      data = [...data].sort((a, b) => a.enviadosMesActual - b.enviadosMesActual);
    }

    return data;
  }, [catalogData, filterType]);

  const tabs = STATUS_TABS.map((t) => ({
    ...t,
    count: t.value === activeTab ? filteredData.length : undefined,
  }));

  return (
    <MainLayout>
      <Stack direction="column" spacing={3}>
        <Title title="Catálogo de artículos" />

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <TabFilters
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              showSearch
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              searchPlaceholder="Buscar"
            />
          </Box>
          <Stack direction="row" spacing={1}>
            <Box
              component="button"
              id="filter-button"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => setFilterAnchor(e.currentTarget)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                px: 2,
                py: 1,
                borderRadius: 1,
                border: `1px solid ${colors.border}`,
                backgroundColor: "transparent",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
                color: colors.text.primary,
                "&:hover": { backgroundColor: colors.background.main },
              }}
            >
              {filterType === "mas-vendidos" ? "Más vendidos" : "Menos vendidos"}
              <ChevronDown size={16} />
            </Box>
            <Box
              component="button"
              id="period-button"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => setPeriodAnchor(e.currentTarget)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                px: 2,
                py: 1,
                borderRadius: 1,
                border: `1px solid ${colors.border}`,
                backgroundColor: "transparent",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
                color: colors.text.primary,
                "&:hover": { backgroundColor: colors.background.main },
              }}
            >
              {periodType === "ultimo-mes" ? "Último mes" : periodType === "ultimo-ano" ? "Último año" : "Mes actual"}
              <ChevronDown size={16} />
            </Box>
          </Stack>
        </Box>

        <Menu
          anchorEl={filterAnchor}
          open={Boolean(filterAnchor)}
          onClose={() => setFilterAnchor(null)}
        >
          <MenuItem onClick={() => { setFilterType("mas-vendidos"); setFilterAnchor(null); }}>
            Más vendidos
          </MenuItem>
          <MenuItem onClick={() => { setFilterType("menos-vendidos"); setFilterAnchor(null); }}>
            Menos vendidos
          </MenuItem>
        </Menu>

        <Menu
          anchorEl={periodAnchor}
          open={Boolean(periodAnchor)}
          onClose={() => setPeriodAnchor(null)}
        >
          <MenuItem onClick={() => { setPeriodType("ultimo-mes"); setPeriodAnchor(null); }}>
            Último mes
          </MenuItem>
          <MenuItem onClick={() => { setPeriodType("ultimo-ano"); setPeriodAnchor(null); }}>
            Último año
          </MenuItem>
          <MenuItem onClick={() => { setPeriodType("mes-actual"); setPeriodAnchor(null); }}>
            Mes actual
          </MenuItem>
        </Menu>

        <Grid container spacing={2}>
          {filteredData.map((articulo) => (
            <Grid key={articulo.id} size={{ xs: 12 }}>
              <ProductItem articulo={articulo} onClick={() => handleProductClick(articulo)} />
            </Grid>
          ))}
        </Grid>

        <ProductDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          articulo={selectedProduct}
        />
      </Stack>
    </MainLayout>
  );
}

interface ProductDrawerProps {
  open: boolean;
  onClose: () => void;
  articulo: Articulo | null;
}

const InfoCard = styled(Box)({
  backgroundColor: colors.background.sidebar,
  borderRadius: "12px",
  border: `1px solid ${colors.border}`,
  padding: "16px",
  textAlign: "center",
});

function ProductDrawer({ open, onClose, articulo }: ProductDrawerProps) {
  if (!articulo) return null;

  const hasGoodMovement = articulo.enviadosMesActual > 30;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: 500, md: 600 },
          backgroundColor: colors.background.sidebar,
          height: "100%",
          borderRadius: "16px 0 0 16px",
        }}
        role="presentation"
        onClick={onClose}
        onKeyDown={onClose}
      >
        {/* Header */}
        <Box sx={{ p: 3, pb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: hasGoodMovement ? "#22C55E" : "#F97316",
              }}
            />
            <Typography variant="body2" sx={{ color: hasGoodMovement ? "#22C55E" : "#F97316", fontWeight: 600 }}>
              {hasGoodMovement ? "Buen movimiento" : "Bajo movimiento"}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <X size={20} />
          </IconButton>
        </Box>

        {/* Product Image */}
        <Box
          component="img"
          src={articulo.imagen}
          alt={articulo.nombre}
          sx={{
            width: 80,
            height: 80,
            borderRadius: "8px",
            objectFit: "cover",
            backgroundColor: colors.background.main,
            mb: 2,
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />

        {/* Product Name */}
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          {articulo.nombre}
        </Typography>

        {/* SKU */}
        <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 0.5 }}>
          {articulo.sku}
        </Typography>

        {/* Units + Stock */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {articulo.unidades} unidades
          </Typography>
          <StockIndicator status={articulo.unidadesStatus}>
            <div style={{ opacity: 1 }} />
            <div style={{ opacity: articulo.unidadesStatus === "critical" ? 0.3 : 1 }} />
            <div style={{ opacity: articulo.unidadesStatus === "good" ? 1 : 0.3 }} />
          </StockIndicator>
        </Box>

        {/* Last Purchase */}
        <Typography variant="caption" sx={{ color: colors.text.secondary }}>
          Última compra: 25 de Octubre, 2025
        </Typography>
      </Box>

      <Divider sx={{ borderColor: colors.border }} />

      {/* Chart Section */}
      <Box sx={{ p: 3 }}>
        {/* Legend */}
        <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: "2px", backgroundColor: "#F97316" }} />
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
              Existencias
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ width: 12, height: 4, borderRadius: "1px", backgroundColor: "#3B82F6" }} />
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
              Ventas
            </Typography>
          </Box>
        </Box>

        {/* Large Chart */}
        <Box sx={{ width: "100%", height: 200, mb: 3 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={articulo.ventasMensuales} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <Bar dataKey="enviados" fill="#93C5FD" radius={[4, 4, 0, 0]} barSize={40} />
              <Line
                type="monotone"
                dataKey="enviados"
                stroke="#F97316"
                strokeWidth={3}
                dot={{ r: 4, fill: "#F97316" }}
              />
              <XAxis
                dataKey="mes"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: colors.text.secondary }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>

        {/* Existencias Section */}
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Existencias
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6 }}>
            <InfoCard>
              <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
                Exis. inicio de año
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                12
              </Typography>
            </InfoCard>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <InfoCard>
              <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
                Exis. inicio de mes
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                32
              </Typography>
            </InfoCard>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <InfoCard>
              <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
                Exis. a disponible
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                21
              </Typography>
            </InfoCard>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <InfoCard>
              <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
                Exis. por recibir
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                12
              </Typography>
            </InfoCard>
          </Grid>
        </Grid>

        {/* Ventas Section */}
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Ventas
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <InfoCard>
              <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
                Ventas en el año
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                210
              </Typography>
            </InfoCard>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <InfoCard>
              <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
                Ventas en el mes ant.
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                31
              </Typography>
            </InfoCard>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <InfoCard>
              <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
                Ventas en el mes
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                14
              </Typography>
            </InfoCard>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <InfoCard>
              <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
                Exis. por recibir
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                12
              </Typography>
            </InfoCard>
          </Grid>
        </Grid>
        </Box>
      </Box>
    </Drawer>
  );
}
