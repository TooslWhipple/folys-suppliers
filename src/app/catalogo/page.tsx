"use client";

import { useState, useMemo } from "react";
import { Box, Typography, Grid, Paper, Stack, Menu, MenuItem, Drawer, IconButton, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ComposedChart, Bar, Line, XAxis, ResponsiveContainer } from "recharts";
import { ChevronDown, X } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Title } from "@/components/Title/Title";
import { TabFilters } from "@/components/TabFilters/TabFilters";
import { colors } from "@/lib/theme";
import { catalogoArticulos, type ArticuloCatalogo } from "@/mocks/data";
import type { TabOption } from "@/components/TabFilters/TabFilters";

type Articulo = ArticuloCatalogo;

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
  boxShadow: "none",
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
          <Bar dataKey="enviados" fill="#BFDBFE" radius={[3, 3, 0, 0]} barSize={30} />
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
        {articulo.imagen ? (
          <Box
            component="img"
            src={articulo.imagen}
            alt={articulo.nombre}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
            IMG
          </Typography>
        )}
      </ProductImage>

      {/* Middle: Product Name, SKU, Units, Stock, Stats */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1, minWidth: 0 }}>
        {/* Product Name */}
        <Typography variant="body1" sx={{ fontWeight: 700, color: colors.text.primary, lineHeight: 1.3 }}>
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
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
              Enviados Ult. año
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {articulo.enviadosUltAno}
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
              Enviados Ult. mes
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {articulo.enviadosUltMes}
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
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

  const handleProductClick = (articulo: Articulo) => {
    setSelectedProduct(articulo);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedProduct(null);
  };

  const filteredData = useMemo(() => {
    let data = catalogoArticulos.filter((a) => {
      const matchesTab = activeTab === "all" || a.estatus === activeTab;
      const matchesSearch =
        !searchValue.trim() ||
        a.nombre.toLowerCase().includes(searchValue.toLowerCase()) ||
        a.sku.toLowerCase().includes(searchValue.toLowerCase());
      return matchesTab && matchesSearch;
    });

    if (filterType === "mas-vendidos") {
      data = [...data].sort((a, b) => b.enviadosMesActual - a.enviadosMesActual);
    } else {
      data = [...data].sort((a, b) => a.enviadosMesActual - b.enviadosMesActual);
    }

    return data;
  }, [activeTab, searchValue, filterType]);

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
  padding: "12px 16px",
});

function ProductDrawer({ open, onClose, articulo }: ProductDrawerProps) {
  if (!articulo) return null;

  const hasGoodMovement = articulo.enviadosMesActual > 30;

  const existenciasItems = [
    { label: "Exis. inicio de año", value: "12" },
    { label: "Exis. inicio de mes", value: "32" },
    { label: "Exis. a disponible", value: "21" },
    { label: "Exis. por recibir", value: "12" },
  ];

  const ventasItems = [
    { label: "Ventas en el año", value: "210" },
    { label: "Ventas en el mes ant.", value: "31" },
    { label: "Ventas en el mes", value: "14" },
    { label: "Exis. por recibir", value: "12" },
  ];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "16px",
            m: "16px",
            height: "calc(100% - 32px)",
            width: { xs: "calc(100vw - 32px)", sm: 520 },
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          },
        },
      }}
    >
      <Box
        sx={{
          backgroundColor: colors.background.sidebar,
          height: "100%",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
        role="presentation"
      >
        {/* Top bar: X left, badge right */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2.5, pt: 2.5, pb: 1 }}>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ border: `1px solid ${colors.border}`, borderRadius: "8px", p: "4px" }}
          >
            <X size={18} />
          </IconButton>
          <Box
            sx={{
              px: 2,
              py: 0.5,
              borderRadius: "20px",
              bgcolor: hasGoodMovement ? "#DCFCE7" : "#FFF7ED",
              color: hasGoodMovement ? "#16A34A" : "#EA580C",
              fontSize: "0.8125rem",
              fontWeight: 600,
            }}
          >
            {hasGoodMovement ? "Buen movimiento" : "Bajo movimiento"}
          </Box>
        </Box>

        {/* Product info left + image right */}
        <Box sx={{ px: 2.5, pt: 1, pb: 2.5, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, lineHeight: 1.3 }}>
              {articulo.nombre}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>
              {articulo.sku}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {articulo.unidades} unidades
              </Typography>
              <StockIndicator status={articulo.unidadesStatus}>
                <div style={{ opacity: 1 }} />
                <div style={{ opacity: articulo.unidadesStatus === "critical" ? 0.3 : 1 }} />
                <div style={{ opacity: articulo.unidadesStatus === "good" ? 1 : 0.3 }} />
              </StockIndicator>
            </Box>
            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
              Última compra: 12 de Julio, 2025
            </Typography>
          </Box>

          {/* Product image — top right */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "8px",
              bgcolor: "#F3F4F6",
              border: `1px solid ${colors.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            {articulo.imagen ? (
              <Box
                component="img"
                src={articulo.imagen}
                alt={articulo.nombre}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Typography variant="caption" sx={{ color: colors.text.secondary }}>IMG</Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ borderColor: colors.border }} />

        {/* Chart + stats */}
        <Box sx={{ px: 2.5, py: 2.5, flex: 1 }}>
          {/* Legend */}
          <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box sx={{ width: 20, height: 3, borderRadius: "2px", bgcolor: "#F97316" }} />
              <Typography variant="caption" sx={{ color: colors.text.secondary }}>Existencias</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: "3px", bgcolor: "#BFDBFE" }} />
              <Typography variant="caption" sx={{ color: colors.text.secondary }}>Ventas</Typography>
            </Box>
          </Box>

          {/* Chart */}
          <Box sx={{ width: "100%", height: 220, mb: 3 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={articulo.ventasMensuales} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <Bar dataKey="enviados" fill="#BFDBFE" radius={[4, 4, 0, 0]} barSize={40} />
                <Line
                  type="monotone"
                  dataKey="enviados"
                  stroke="#F97316"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#F97316", strokeWidth: 0 }}
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

          {/* Existencias */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>Existencias</Typography>
          <Grid container spacing={1.5} sx={{ mb: 3 }}>
            {existenciasItems.map((item) => (
              <Grid key={item.label} size={{ xs: 3 }}>
                <InfoCard>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
                    {item.label}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{item.value}</Typography>
                </InfoCard>
              </Grid>
            ))}
          </Grid>

          {/* Ventas */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>Ventas</Typography>
          <Grid container spacing={1.5}>
            {ventasItems.map((item) => (
              <Grid key={item.label} size={{ xs: 3 }}>
                <InfoCard>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, display: "block", mb: 0.5 }}>
                    {item.label}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{item.value}</Typography>
                </InfoCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Drawer>
  );
}
