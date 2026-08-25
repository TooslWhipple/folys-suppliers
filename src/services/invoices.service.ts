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

export interface AccountStatementResponse {
  entries: AccountStatementEntry[];
  payments: AccountStatementPayment[];
  summary: AccountStatementSummary;
  month: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetAccountStatementParams {
  page?: number;
  limit?: number;
  month?: string; // Format: YYYY-MM
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
};

export default invoicesService;
