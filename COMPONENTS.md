# Componentes Reutilizables - Proveedores Foly

Documentación de los componentes UI reutilizables disponibles en el proyecto.

## Stack Tecnológico

Todos los componentes de este proyecto están construidos sobre **Material UI v7** (MUI) con las siguientes dependencias:

- **@mui/material** - Componentes base de Material UI
- **@mui/material/styles** - Sistema de estilos con `styled()` y temas
- **@mui/icons-material** - Iconos de Material Design
- **Emotion** - Motor de estilos CSS-in-JS (via `@emotion/react` y `@emotion/styled`)

Los componentes utilizan el theme personalizado de Foly ubicado en `src/lib/theme.ts` que extiende el theme de MUI con colores, tipografía y breakpoints específicos del proyecto.

---

## Title

Título de página con descripción opcional y botones de acción. Utiliza componentes de MUI: `Typography`, `Button`, `Box`.

**Archivo:** `src/components/Title/Title.tsx`

### Props

```typescript
interface TitleAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  disabled?: boolean;
}

interface TitleProps {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  actions?: TitleAction[];
}
```

### Uso

```tsx
import { Title } from "@/components/Title/Title";

<Title 
  title="Pedidos" 
  description="Gestiona los pedidos del proveedor"
  actions={[
    {
      id: "nuevo",
      label: "Nuevo Pedido",
      href: "/pedidos/nuevo",
      variant: "contained",
    }
  ]}
/>
```

---

## StatsCard & StatsCardGroup

Tarjetas de estadísticas con valores y comparaciones opcionales. Utiliza componentes de MUI: `Grid`, `Stack`, `Typography` y `styled` de `@mui/material/styles`.

**Archivo:** `src/components/StatsCard/StatsCard.tsx`

### Props - StatsCardData

```typescript
interface StatsCardData {
  id: string;
  label: string;
  value: number;
  comparison?: {
    value: number;
    type: "increase" | "decrease";
    period: string;
  };
  icon?: React.ReactNode;
  valueColor?: string;
  isCurrency?: boolean;
}
```

### Uso

```tsx
import { StatsCardGroup, StatsCardData } from "@/components/StatsCard/StatsCard";

const cards: StatsCardData[] = [
  {
    id: "articulos",
    label: "Artículos pendiente de entrega",
    value: 37,
    isCurrency: false,
  },
  {
    id: "valor",
    label: "Valor de artículos pendientes",
    value: 421093.90,
    isCurrency: true,
  },
  {
    id: "cobro",
    label: "Pendiente de cobro",
    value: 870369.42,
    isCurrency: true,
  },
];

<StatsCardGroup cards={cards} />
```

---

## TabFilters

Tabs de filtro con búsqueda y botones de acción. Utiliza componentes de MUI: `Grid`, `Button`, `TextField`, `InputAdornment`, `Tabs`, `Tab` y `styled` de `@mui/material/styles`.

**Archivo:** `src/components/TabFilters/TabFilters.tsx`

### Props

```typescript
interface TabOption {
  label: React.ReactNode;
  value: string;
  count?: number;
  textColor?: string;
}

interface ActionButtonConfig {
  label: string;
  onClick: () => void;
  variant?: "text" | "outlined" | "contained";
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  showIcon?: boolean;
  disabled?: boolean;
}

interface TabFiltersProps {
  tabs: TabOption[];
  activeTab: string;
  onTabChange: (value: string) => void;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  actions?: ActionButtonConfig[];
}
```

### Uso

```tsx
import { TabFilters } from "@/components/TabFilters/TabFilters";
import type { TabOption } from "@/components/TabFilters/TabFilters";

const [activeTab, setActiveTab] = useState("all");
const [search, setSearch] = useState("");

const tabs: TabOption[] = [
  { label: "Todos", value: "all" },
  { label: "Pendientes", value: "Pendiente", count: 5 },
  { label: "Surtidos", value: "Surtido", count: 12 },
];

<TabFilters
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  showSearch
  searchValue={search}
  onSearchChange={setSearch}
  searchPlaceholder="Buscar por pedido o fecha"
  actions={[
    {
      label: "Exportar",
      onClick: () => console.log("Exportar"),
      variant: "outlined",
    }
  ]}
/>
```

---

## TableCrud

Tabla completa con paginación, ordenamiento, acciones y chips. Utiliza componentes de MUI: `Table`, `TableBody`, `TableContainer`, `TableHead`, `TableRow`, `TableCell`, `TablePagination`, `IconButton`, `Menu`, `MenuItem`, `Button`, `Typography`, `Skeleton` y `styled` de `@mui/material/styles`. Iconos de `@mui/icons-material`.

**Archivo:** `src/components/TableCrud/TableCrud.tsx`

### Types

```typescript
type ColumnType = "text" | "number" | "currency" | "percentage" | "date" | "boolean" | "chip" | "chipGroup" | "button" | "id";
type ColumnSize = "xs" | "sm" | "md" | "lg" | "xl";

type StatusChipVariant = "default" | "success" | "pending" | "error" | "warning" | "info" | "infoAlt" | "disabled";

interface Column<T> {
  id: keyof T | string;
  label: string;
  type?: ColumnType;
  size?: ColumnSize;
  align?: "left" | "center" | "right";
  truncate?: boolean;
  format?: (value: T[keyof T], row: T) => React.ReactNode;
  chipVariantMap?: Record<string, StatusChipVariant>;
  chipLabelMap?: Record<string, string>;
  currencySymbol?: string;
}

interface RowAction<T> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  color?: "inherit" | "error" | "primary" | "secondary";
  disabled?: boolean | ((row: T) => boolean);
}
```

### Uso

```tsx
import { TableCrud } from "@/components/TableCrud/TableCrud";
import type { Column, RowAction } from "@/components/TableCrud/TableCrud";
import type { StatusChipVariant } from "@/components/StatusChip/StatusChip";

// Definir tipo de datos
type Pedido = {
  id: string;
  pedido: string;
  fecha: string;
  total: number;
  estatus: string;
};

// Mapeo de estatus a variantes de chip
const STATUS_VARIANTS: Record<string, StatusChipVariant> = {
  Pendiente: "pending",
  Surtido: "success",
  Pagado: "success",
};

// Definir columnas
const columns: Column<Pedido>[] = [
  { id: "pedido", label: "Pedido", size: "sm" },
  { id: "fecha", label: "Fecha", size: "md" },
  { id: "total", label: "Total", type: "currency", size: "md", align: "right" },
  { 
    id: "estatus", 
    label: "Estatus", 
    type: "chip", 
    size: "sm",
    chipVariantMap: STATUS_VARIANTS 
  },
];

// Definir acciones
const actions: RowAction<Pedido>[] = [
  {
    id: "ver",
    label: "Ver detalle",
    onClick: (row) => console.log("Ver", row.pedido),
  },
  {
    id: "descargar",
    label: "Descargar PDF",
    onClick: (row) => console.log("Descargar", row.pedido),
  },
];

// Uso del componente
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(10);

<TableCrud
  columns={columns}
  rows={pedidos}
  actions={actions}
  loading={false}
  rowKey="id"
  page={page}
  rowsPerPage={rowsPerPage}
  totalRows={pedidos.length}
  onPageChange={setPage}
  onRowsPerPageChange={setRowsPerPage}
  emptyMessage="No hay pedidos"
/>
```

---

## StatusChip

Chip de estado con variantes de color predefinidas. Utiliza `Box` de MUI con `styled` de `@mui/material/styles`.

**Archivo:** `src/components/StatusChip/StatusChip.tsx`

### Props

```typescript
type StatusChipVariant = "default" | "success" | "pending" | "error" | "warning" | "info" | "infoAlt" | "disabled";
type StatusChipSize = "default" | "small";

interface StatusChipProps {
  label: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: StatusChipVariant;
  size?: StatusChipSize;
  backgroundColor?: string;
  color?: string;
}
```

### Uso Directo

```tsx
import { StatusChip } from "@/components/StatusChip/StatusChip";

<StatusChip label="Pendiente" variant="pending" size="small" />
<StatusChip label="Pagado" variant="success" size="small" />
<StatusChip label="Cancelado" variant="error" size="small" />
<StatusChip label="En proceso" variant="info" />
```

### Uso en TableCrud

El StatusChip se usa automáticamente en TableCrud cuando `type: "chip"`:

```tsx
const columns: Column<Pedido>[] = [
  {
    id: "estatus",
    label: "Estatus",
    type: "chip",
    chipVariantMap: {
      Pendiente: "pending",
      Surtido: "success",
      Cancelado: "error",
    },
  },
];
```

---

## ChipGroup

Grupo de chips con límite de visualización y tooltip. Utiliza componentes de MUI: `Tooltip`, `Box`, `Chip` y `styled` de `@mui/material/styles`.

**Archivo:** `src/components/ChipGroup/ChipGroup.tsx`

### Props

```typescript
interface ChipGroupProps {
  items: string[];
  maxVisible?: number;
  onClick?: (item: string) => void;
}
```

### Uso

```tsx
import { ChipGroup } from "@/components/ChipGroup";

<ChipGroup 
  items={["Motor", "Filtro", "Aceite", "Bujía", "Freno"]} 
  maxVisible={3}
  onClick={(item) => console.log("Clicked:", item)}
/>
```

### Uso en TableCrud

```tsx
const columns: Column<Producto>[] = [
  {
    id: "categorias",
    label: "Categorías",
    type: "chipGroup",
    chipGroupKey: "name",
    chipGroupMaxVisible: 4,
  },
];
```

---

## MainLayout & Sidebar

Layout principal con sidebar de navegación. Utiliza componentes de MUI: `Box`, `Drawer`, `IconButton`, `Typography`, `Avatar`, `List`, `ListItem`, `ListItemButton`, `ListItemIcon`, `ListItemText`, `Divider`, `Stack` y `styled` de `@mui/material/styles`. Iconos de `lucide-react` y `@mui/icons-material`.

**Archivo:** `src/components/layout/MainLayout.tsx`

### Uso

```tsx
import { MainLayout } from "@/components/layout/MainLayout";

export default function MiPagina() {
  return (
    <MainLayout>
      <Stack direction="column" spacing={3}>
        <Title title="Mi Página" />
        {/* Contenido */}
      </Stack>
    </MainLayout>
  );
}
```

---

## Ejemplo Completo: Página de Pedidos

```tsx
"use client";

import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Title } from "@/components/Title/Title";
import { TabFilters } from "@/components/TabFilters/TabFilters";
import { TableCrud } from "@/components/TableCrud/TableCrud";
import { StatsCardGroup, StatsCardData } from "@/components/StatsCard/StatsCard";
import type { TabOption } from "@/components/TabFilters/TabFilters";
import type { Column, RowAction } from "@/components/TableCrud/TableCrud";
import type { StatusChipVariant } from "@/components/StatusChip/StatusChip";
import { Stack } from "@mui/material";

type Pedido = {
  id: string;
  pedido: string;
  fecha: string;
  total: number;
  estatus: string;
};

const STATUS_VARIANTS: Record<string, StatusChipVariant> = {
  Pendiente: "pending",
  Surtido: "success",
  Pagado: "success",
};

export default function PedidosPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  const stats: StatsCardData[] = [
    { id: "1", label: "Artículos pendientes", value: 37, isCurrency: false },
    { id: "2", label: "Valor pendiente", value: 421093.90, isCurrency: true },
  ];

  const tabs: TabOption[] = [
    { label: "Todos", value: "all" },
    { label: "Pendientes", value: "Pendiente", count: 5 },
    { label: "Surtidos", value: "Surtido", count: 12 },
  ];

  const columns: Column<Pedido>[] = [
    { id: "pedido", label: "Pedido", size: "sm" },
    { id: "fecha", label: "Fecha", size: "md" },
    { id: "total", label: "Total", type: "currency", align: "right" },
    { id: "estatus", label: "Estatus", type: "chip", chipVariantMap: STATUS_VARIANTS },
  ];

  const actions: RowAction<Pedido>[] = [
    { id: "ver", label: "Ver detalle", onClick: (row) => console.log(row) },
  ];

  return (
    <MainLayout>
      <Stack direction="column" spacing={3}>
        <Title title="Pedidos" />
        <StatsCardGroup cards={stats} />
        <TabFilters
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showSearch
          searchValue={search}
          onSearchChange={setSearch}
        />
        <TableCrud
          columns={columns}
          rows={pedidos}
          actions={actions}
          rowKey="id"
          page={page}
          onPageChange={setPage}
        />
      </Stack>
    </MainLayout>
  );
}
```
