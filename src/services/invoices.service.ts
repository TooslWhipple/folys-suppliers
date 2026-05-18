import { api } from "@/lib/api/client";

export interface AccountStatementEntry {
  id: string;
  fecha: string;
  concepto: string;
  tipo: "venta" | "cargo";
  cargo: number;
  venta: number;
}

export interface AccountStatementSummary {
  totalCargos: number;
  totalVentas: number;
  balance: number;
  pendingAmount: number;
}

export interface AccountStatementResponse {
  entries: AccountStatementEntry[];
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

    return api.get<AccountStatementResponse>(
      `/supplier-portal/account-statement`,
      queryParams
    );
  },
};

export default invoicesService;
