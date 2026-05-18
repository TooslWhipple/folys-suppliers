import { api } from "@/lib/api/client";

export interface DamagedProductItem {
  productCode: string;
  branch: { id: number; name: string };
  registrationDate: string;
  productName: string;
  registeredByUser: string;
  damageType: string;
  status: string;
  elapsedSinceRegistration: string;
}

export interface DamagedProductStats {
  totalItems: number;
  pendingItems: number;
  completedItems: number;
  totalValue: number;
}

export interface PaginatedResponse<T> {
  rows: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetDamagedProductsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const damagedProductsService = {
  /**
   * Get damaged products for the authenticated supplier
   * @param params - Query parameters for pagination and search
   */
  async getDamagedProducts(
    params: GetDamagedProductsParams
  ): Promise<PaginatedResponse<DamagedProductItem>> {
    const { page = 1, limit = 10, search } = params;

    const queryParams: Record<string, string | number> = { page, limit };
    if (search) queryParams.search = search;

    return api.get<PaginatedResponse<DamagedProductItem>>(
      `/supplier-portal/damaged-products`,
      queryParams
    );
  },

  /**
   * Get statistics for damaged products
   */
  async getStats(): Promise<DamagedProductStats> {
    return api.get<DamagedProductStats>(`/supplier-portal/damaged-products/stats`);
  },
};

export default damagedProductsService;
