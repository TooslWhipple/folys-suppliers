import { get } from "@/lib/api/client";
import type { SupplierInvoiceListItem } from "./invoices.service";

// ---------------------------------------------------------------------------
// Dashboard del proveedor (GET /supplier-portal/dashboard)
//
// Forma literal de `SupplierDashboardDto` del back
// (`Apifoly/src/modules/supplier-portal/dtos/dashboard/supplier-dashboard.dto.ts`).
// Las fechas viajan serializadas: `YYYY-MM-DD` en facturas y en el día de las
// entregas programadas, e ISO 8601 date-time completo en el resto.
// ---------------------------------------------------------------------------

/** Valores del enum `OrderStatus` de Prisma, tal cual los emite el back. */
export type SupplierOrderStatus =
  | "pending"
  | "scheduled"
  | "in_progress"
  | "shipped"
  | "partially_delivered"
  | "delivered"
  | "cancelled";

/** Estado de pago del pedido, derivado de sus facturas asociadas. */
export type SupplierDashboardPagoEstatus =
  | "pagado"
  | "pendiente"
  | "sin_factura";

export interface SupplierDashboardSummary {
  /** Σ saldo (`total − pagado`) de las facturas pendientes del proveedor. */
  cobrosPendientes: number;
  /** Σ monto de los cargos `pending`, de cualquier categoría y mes. */
  cargosProveedor: number;
  /** `max(0, cobrosPendientes − cargosProveedor)`. */
  totalACobrar: number;
  articulosPendientesEntrega: number;
  valorArticulosPendientes: number;
}

/** Fila de la card de pedidos pendientes. */
export interface SupplierDashboardPedido {
  id: number;
  folio: string;
  /** ISO 8601 date-time. */
  fechaPedido: string;
  articulosSolicitados: number;
  estatus: SupplierOrderStatus;
  pago: SupplierDashboardPagoEstatus;
  total: number;
  /** ISO 8601 date-time, o `null` si ningún artículo pendiente tiene fecha. */
  proximaEntrega: string | null;
}

export interface SupplierDashboardEntregaArticulo {
  orderItemId: number;
  producto: string;
  /** Pendiente por entregar del artículo. */
  cantidad: number;
}

/** Día de entregas programadas del sidebar. */
export interface SupplierDashboardEntregaGrupo {
  /** `YYYY-MM-DD`. */
  fecha: string;
  totalArticulos: number;
  articulos: SupplierDashboardEntregaArticulo[];
}

/** Cobro ya aplicado, para el historial del sidebar. */
export interface SupplierDashboardCobro {
  id: number;
  /** ISO 8601 date-time. */
  fecha: string;
  monto: number;
  comprobanteUrl: string | null;
}

export interface SupplierDashboardResponse {
  summary: SupplierDashboardSummary;
  /** Las 3 facturas pendientes más antiguas. */
  facturasPendientes: SupplierInvoiceListItem[];
  /** Los 3 pedidos pendientes con entrega más próxima. */
  pedidosPendientes: SupplierDashboardPedido[];
  /** Hasta 5 días con entregas programadas, de hoy en adelante. */
  entregasProgramadas: SupplierDashboardEntregaGrupo[];
  /** Hasta 10 cobros pagados, del más reciente al más antiguo. */
  historialCobros: SupplierDashboardCobro[];
}

export const dashboardService = {
  /**
   * Get everything the portal home page renders, in a single call.
   * A supplier without data answers 200 with zeros and empty arrays.
   */
  async getDashboard(): Promise<SupplierDashboardResponse> {
    const response = await get<{
      success: boolean;
      data: SupplierDashboardResponse;
      message?: string;
    }>("/supplier-portal/dashboard");

    return response.data;
  },
};

export default dashboardService;
