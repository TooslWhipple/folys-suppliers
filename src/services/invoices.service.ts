import { get } from "@/lib/api/client";

export type AccountStatementEntryTipo =
  | "pedido"
  | "cargo_discrecional"
  | "costo_reparacion";

export interface AccountStatementEntry {
  id: string;
  fecha: string;
  concepto: string;
  tipo: AccountStatementEntryTipo;
  monto: number;
}

export type AccountStatementPaymentStatus = "pending" | "paid";

export interface AccountStatementPayment {
  id: number;
  descripcion: string;
  monto: number;
  fechaPago: string;
  fechaProgramada: string | null;
  status: AccountStatementPaymentStatus;
  comprobanteUrl: string | null;
}

export interface AccountStatementSummary {
  totalVentas: number;
  totalCargos: number;
  totalPagos: number;
  balance: number;
  pendingAmount: number;
  pendienteFacturar: number;
}

export interface ApiPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AccountStatementResponse {
  entries: AccountStatementEntry[];
  payments: AccountStatementPayment[];
  summary: AccountStatementSummary;
  month: string;
  pagination: ApiPagination;
}

export interface GetAccountStatementParams {
  page?: number;
  limit?: number;
  month?: string; // Format: YYYY-MM
}

// ---------------------------------------------------------------------------
// Facturas del proveedor (GET /supplier-portal/invoices)
// ---------------------------------------------------------------------------

export type SupplierInvoiceEstatus = "pendiente" | "pagado";

export type SupplierInvoiceStatusFilter = "all" | "pending" | "paid";

export interface SupplierInvoiceOrderRef {
  id: number;
  folio: string;
}

export interface SupplierInvoiceListItem {
  id: number;
  folio: string;
  fechaEmision: string;
  fechaVencimiento: string;
  total: number;
  pagado: number;
  saldo: number;
  abonos: number;
  estatus: SupplierInvoiceEstatus;
  pedido: SupplierInvoiceOrderRef | null;
  recepcionId: number;
}

export interface SupplierInvoicesSummary {
  pendienteCobro: number;
  pendienteFacturar: number;
  totalFacturas: number;
}

export interface SupplierInvoicesResponse {
  summary: SupplierInvoicesSummary;
  items: SupplierInvoiceListItem[];
  pagination: ApiPagination;
}

export interface GetInvoicesParams {
  page?: number;
  limit?: number;
  status?: SupplierInvoiceStatusFilter;
}

export interface SupplierInvoicePayment {
  id: number;
  fecha: string;
  monto: number;
  referencia: string;
  descripcion: string;
}

export interface SupplierInvoiceDetail {
  id: number;
  folio: string;
  fechaEmision: string;
  fechaVencimiento: string;
  tipoPago: string;
  total: number;
  pagado: number;
  saldo: number;
  estatus: SupplierInvoiceEstatus;
  pedido: SupplierInvoiceOrderRef | null;
  recepcionId: number;
  abonos: SupplierInvoicePayment[];
}

// ---------------------------------------------------------------------------
// Solicitudes de documentos (GET /supplier-portal/document-requests)
// ---------------------------------------------------------------------------

export type DocumentRequestTipo = "nota_credito";

export type DocumentRequestEstatus = "abierta" | "cubierta" | "cancelada";

export type DocumentRequestStatusFilter = "open" | "all";

export interface DocumentRequestInvoiceRef {
  id: number;
  folio: string;
}

export interface DocumentRequestItem {
  id: number;
  tipo: DocumentRequestTipo;
  recepcionId: number;
  costeoId: number | null;
  pedidos: SupplierInvoiceOrderRef[];
  facturas: DocumentRequestInvoiceRef[];
  monto: number;
  cubierto: number;
  saldo: number;
  estatus: DocumentRequestEstatus;
  fechaSolicitud: string;
  fechaCierre: string | null;
}

export interface DocumentRequestsSummary {
  pendienteFacturar: number;
  abiertas: number;
}

export interface DocumentRequestsResponse {
  summary: DocumentRequestsSummary;
  items: DocumentRequestItem[];
  pagination: ApiPagination;
}

export interface GetDocumentRequestsParams {
  page?: number;
  limit?: number;
  status?: DocumentRequestStatusFilter;
}

export const invoicesService = {
  /**
   * Get account statement for the authenticated supplier
   * @param params - Query parameters for pagination and month filter
   */
  async getAccountStatement(
    params: GetAccountStatementParams
  ): Promise<AccountStatementResponse> {
    const { page = 1, limit = 50, month } = params;

    const queryParams: Record<string, string | number> = { page, limit };
    if (month) queryParams.month = month;

    const response = await get<{
      success: boolean;
      data: AccountStatementResponse;
      message?: string;
    }>(`/supplier-portal/account-statement`, { params: queryParams });

    return response.data;
  },

  /**
   * Get the paginated invoice list of the authenticated supplier
   * @param params - Pagination and status filter (all | pending | paid)
   */
  async getInvoices(
    params: GetInvoicesParams = {}
  ): Promise<SupplierInvoicesResponse> {
    const { page = 1, limit = 10, status } = params;

    const queryParams: Record<string, string | number> = { page, limit };
    if (status) queryParams.status = status;

    const response = await get<{
      success: boolean;
      data: SupplierInvoicesResponse;
      message?: string;
    }>(`/supplier-portal/invoices`, { params: queryParams });

    return response.data;
  },

  /**
   * Get one invoice of the authenticated supplier with its payments
   * @param id - Invoice id (the API answers 404 if it is not the supplier's)
   */
  async getInvoice(id: number): Promise<SupplierInvoiceDetail> {
    const response = await get<{
      success: boolean;
      data: SupplierInvoiceDetail;
      message?: string;
    }>(`/supplier-portal/invoices/${id}`);

    return response.data;
  },

  /**
   * Get the paginated document requests (credit notes) of the supplier
   * @param params - Pagination and status filter (open | all); API defaults to open
   */
  async getDocumentRequests(
    params: GetDocumentRequestsParams = {}
  ): Promise<DocumentRequestsResponse> {
    const { page = 1, limit = 10, status } = params;

    const queryParams: Record<string, string | number> = { page, limit };
    if (status) queryParams.status = status;

    const response = await get<{
      success: boolean;
      data: DocumentRequestsResponse;
      message?: string;
    }>(`/supplier-portal/document-requests`, { params: queryParams });

    return response.data;
  },
};

export default invoicesService;
