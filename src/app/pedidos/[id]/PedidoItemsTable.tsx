"use client";

import { useMemo, type ReactNode } from "react";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  type TableCellProps,
} from "@mui/material";
import { CalendarToday, Inventory } from "@mui/icons-material";
import { ResizableHeaderCell } from "@/components/ResizableTable";
import {
  useResizableColumns,
  type ResizableColumn,
} from "@/hooks/useResizableColumns";
import { formatShortDate } from "@/components/DeliveryDatePicker/DeliveryDatePicker";
import { formatCurrency } from "@/lib/money";
import { useAuthStore } from "@/store/useAuthStore";
import type { DeliveryMethod, OrderItemFull } from "@/services/orders.service";

type ColumnKey =
  | "name"
  | "deliveryDate"
  | "received"
  | "pending"
  | "unitCost"
  | "requested";

interface ItemsColumn extends ResizableColumn {
  key: ColumnKey;
  /** Full name: header `title` and handle `aria-label`. */
  label: string;
  /** Abbreviated text shown in the header when the default width is too narrow. */
  shortLabel?: string;
  align: NonNullable<TableCellProps["align"]>;
}

// Single column definition: feeds the <colgroup>, the header and the cells.
// Module constant so the hook gets a stable reference.
const COLUMNS: ItemsColumn[] = [
  { key: "name", label: "Nombre", defaultWidth: 150, minWidth: 120, align: "left" },
  { key: "deliveryDate", label: "Fecha de entrega", shortLabel: "F. entrega", defaultWidth: 150, minWidth: 140, align: "left" },
  { key: "received", label: "Recibido", shortLabel: "Recib.", defaultWidth: 80, minWidth: 80, align: "center" },
  { key: "pending", label: "Pendiente", shortLabel: "Pend.", defaultWidth: 80, minWidth: 80, align: "center" },
  { key: "unitCost", label: "Costo unitario", shortLabel: "C. unit.", defaultWidth: 105, minWidth: 100, align: "right" },
  { key: "requested", label: "Solicitado", defaultWidth: 120, minWidth: 120, align: "center" },
];

const STORAGE_KEY_PREFIX = "proveedores:pedido-detalle:columnas:";

/** State of the resizable columns; its single owner is the parent screen. */
export type PedidoItemsColumnsState = ReturnType<typeof useResizableColumns>;

/**
 * Column widths of the order items table, persisted per user (email). The
 * parent calls it once and passes the result to `PedidoItemsTable`, so it can
 * also drive the "Restablecer columnas" button.
 */
export function usePedidoItemsColumns(): PedidoItemsColumnsState {
  const email = useAuthStore((s) => s.user?.email);
  const storageKey = email ? `${STORAGE_KEY_PREFIX}${email.toLowerCase()}` : null;
  return useResizableColumns(storageKey, COLUMNS);
}

interface PedidoItemsTableProps {
  items: OrderItemFull[];
  deliveryDates: Record<number, Date>;
  deliveryMethodIds: Record<number, number>;
  deliveryMethods: DeliveryMethod[];
  canEditDates: boolean;
  canEditQuantities: boolean;
  columns: PedidoItemsColumnsState;
  onOpenPicker: (itemId: number) => void;
  onChangeQuantity: (itemId: number, delta: number) => void;
}

const bodyCellSx = {
  px: 1.5,
  py: 1.75,
  borderBottom: "1px solid #f2f4f7",
  bgcolor: "white",
  fontSize: "0.875rem",
  color: "#101828",
  verticalAlign: "middle",
} as const;

const ellipsisSx = {
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
} as const;

const stepButtonSx = {
  width: 24,
  height: 24,
  p: 0,
  color: "#344054",
  "&:hover": { bgcolor: "transparent" },
  "&.Mui-disabled": { color: "#d0d5dd" },
} as const;

export function PedidoItemsTable({
  items,
  deliveryDates,
  deliveryMethodIds,
  deliveryMethods,
  canEditDates,
  canEditQuantities,
  columns,
  onOpenPicker,
  onChangeQuantity,
}: PedidoItemsTableProps) {
  const { widths, totalWidth, getResizeHandleProps } = columns;

  const methodNameById = useMemo(
    () => new Map(deliveryMethods.map((m) => [m.id, m.name])),
    [deliveryMethods],
  );

  const renderDate = (itemId: number): ReactNode => {
    const date = deliveryDates[itemId];
    const dateText = date ? formatShortDate(date) : canEditDates ? "Seleccionar" : "Sin fecha";
    const methodId = deliveryMethodIds[itemId];
    const methodText = date && methodId ? methodNameById.get(methodId) || "sin método" : null;
    const fullText = methodText ? `${dateText} (${methodText})` : dateText;
    const hasDate = Boolean(date);

    const text = (
      <Box sx={{ flex: 1, minWidth: 0 }} title={fullText}>
        <Typography
          variant="body2"
          sx={{ ...ellipsisSx, fontSize: "0.875rem", color: canEditDates ? (hasDate ? "#1570EF" : "#98a2b3") : "#101828" }}
        >
          {dateText}
        </Typography>
        {methodText && (
          <Typography variant="caption" color="text.secondary" sx={{ ...ellipsisSx, display: "block", fontSize: "0.75rem" }}>
            {methodText}
          </Typography>
        )}
      </Box>
    );

    if (!canEditDates) return text;
    return (
      <Box
        onClick={() => onOpenPicker(itemId)}
        sx={{
          display: "flex", alignItems: "center", gap: 1,
          px: 1.5, py: 0.75,
          border: `1px solid ${hasDate ? "#1570EF" : "#d0d5dd"}`,
          borderRadius: 1.5, bgcolor: "#ffffff", cursor: "pointer",
          "&:hover": { borderColor: "#98a2b3" },
        }}
      >
        {text}
        <CalendarToday sx={{ fontSize: 16, color: hasDate ? "#1570EF" : "#667085", flexShrink: 0 }} />
      </Box>
    );
  };

  return (
    <Paper elevation={0} sx={{ overflow: "hidden", border: "1px solid #e4e7ec", borderRadius: 2 }}>
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table sx={{ tableLayout: "fixed", width: "100%", minWidth: totalWidth }}>
          <colgroup>
            {COLUMNS.map((column) => (
              <col key={column.key} style={{ width: widths[column.key] }} />
            ))}
            {/* Filler: absorbs the leftover space so resizing never moves other columns. */}
            <col />
          </colgroup>
          <TableHead>
            <TableRow>
              {COLUMNS.map((column) => (
                <ResizableHeaderCell
                  key={column.key}
                  label={column.shortLabel ?? column.label}
                  labelText={column.label}
                  align={column.align}
                  handleProps={getResizeHandleProps(column.key)}
                />
              ))}
              <TableCell sx={{ p: 0, bgcolor: "#ffffff", borderBottom: "1px solid #e4e7ec" }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => {
              const pending = Math.max(0, item.requested_quantity - item.delivered_quantity);
              const foliPidio = item.original_requested_quantity;
              return (
                <TableRow key={item.id} sx={{ "&:last-child td": { borderBottom: "none" } }}>
                  <TableCell align="left" sx={bodyCellSx}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                      <Box sx={{ width: 36, height: 36, bgcolor: "#f2f4f7", borderRadius: 1.5, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Inventory sx={{ fontSize: 18, color: "#98a2b3" }} />
                      </Box>
                      <Typography variant="body2" title={item.product.short_name} sx={{ ...ellipsisSx, fontSize: "0.875rem", color: "#101828" }}>
                        {item.product.short_name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="left" sx={bodyCellSx}>
                    {renderDate(item.id)}
                  </TableCell>
                  <TableCell align="center" sx={bodyCellSx}>
                    {item.delivered_quantity}
                  </TableCell>
                  <TableCell align="center" sx={bodyCellSx}>
                    {pending}
                  </TableCell>
                  <TableCell align="right" sx={{ ...bodyCellSx, fontWeight: 500 }}>
                    {formatCurrency(item.unit_price, item.currency)}
                  </TableCell>
                  <TableCell align="center" sx={bodyCellSx}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.25 }}>
                      {canEditQuantities ? (
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                          <IconButton size="small" onClick={() => onChangeQuantity(item.id, -1)} disabled={item.requested_quantity <= item.delivered_quantity} sx={stepButtonSx}>
                            <Typography sx={{ fontSize: "1.1rem", fontWeight: 400, lineHeight: 1 }}>—</Typography>
                          </IconButton>
                          <Typography variant="body2" sx={{ minWidth: 24, textAlign: "center", fontWeight: 700, fontSize: "0.875rem", color: "#101828" }}>
                            {item.requested_quantity}
                          </Typography>
                          <IconButton size="small" onClick={() => onChangeQuantity(item.id, 1)} disabled={item.requested_quantity >= foliPidio} sx={stepButtonSx}>
                            <Typography sx={{ fontSize: "1.1rem", fontWeight: 400, lineHeight: 1 }}>+</Typography>
                          </IconButton>
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ textAlign: "center", fontWeight: 700, fontSize: "0.875rem", color: "#101828" }}>
                          {item.requested_quantity}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                        Foly pidió {foliPidio}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ p: 0, bgcolor: "white", borderBottom: "1px solid #f2f4f7" }} />
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
