import type { StatusChipVariant } from "@/components/StatusChip/StatusChip";
import type { SupplierInvoiceEstatus } from "@/services/invoices.service";
import type {
  SupplierDashboardPagoEstatus,
  SupplierOrderStatus,
} from "@/services/dashboard.service";

// ---------------------------------------------------------------------------
// Etiquetas y variantes de `StatusChip` compartidas por las pantallas del
// portal. Las claves son los valores literales que emite el back, no el texto
// que ve el proveedor: así una pantalla nueva no puede inventarse un estatus
// que el API no manda, ni quedarse corta cuando el enum crece.
// ---------------------------------------------------------------------------

/** Los 7 valores de `OrderStatus` (`schema.prisma`), sin huecos. */
export const ORDER_STATUS_LABELS: Record<SupplierOrderStatus, string> = {
  pending: "Pendiente",
  scheduled: "Programado",
  in_progress: "En proceso",
  shipped: "Enviado",
  partially_delivered: "Entrega parcial",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export const ORDER_STATUS_CHIP_VARIANTS: Record<SupplierOrderStatus, StatusChipVariant> = {
  pending: "pending",
  scheduled: "info",
  in_progress: "info",
  shipped: "infoAlt",
  partially_delivered: "warning",
  delivered: "success",
  cancelled: "error",
};

/** Estado de pago del pedido, derivado de sus facturas asociadas. */
export const PAGO_LABELS: Record<SupplierDashboardPagoEstatus, string> = {
  pagado: "Pagado",
  pendiente: "Pendiente",
  sin_factura: "Sin factura",
};

export const PAGO_CHIP_VARIANTS: Record<SupplierDashboardPagoEstatus, StatusChipVariant> = {
  pagado: "success",
  pendiente: "pending",
  sin_factura: "disabled",
};

export const INVOICE_STATUS_LABELS: Record<SupplierInvoiceEstatus, string> = {
  pendiente: "Pendiente",
  pagado: "Pagado",
};

export const INVOICE_STATUS_CHIP_VARIANTS: Record<SupplierInvoiceEstatus, StatusChipVariant> = {
  pendiente: "warning",
  pagado: "success",
};
