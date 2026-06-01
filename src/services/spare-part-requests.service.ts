import { get } from "@/lib/api/client";

export interface SparePartRequestItem {
  id: string;
  folio: string;
  productCode: string;
  productName: string;
  sparePartName: string;
  quantity: number;
  status: string;
  requestedAt: string;
  elapsedTime: string;
}

export interface SparePartRequestStats {
  itemsPending: number;
  totalQuantity: number;
}

export interface PaginatedResponse<T> {
  rows: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetSparePartRequestsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const sparePartRequestsService = {
  /**
   * Get spare part requests for the authenticated supplier
   * @param params - Query parameters for pagination and search
   */
  async getSparePartRequests(
    params: GetSparePartRequestsParams
  ): Promise<PaginatedResponse<SparePartRequestItem>> {
    const { page = 1, limit = 10, search } = params;

    const queryParams: Record<string, string | number> = { page, limit };
    if (search) queryParams.search = search;

    return get<PaginatedResponse<SparePartRequestItem>>(
      `/supplier-portal/spare-part-requests`,
      { params: queryParams }
    );
  },

  /**
   * Get statistics for spare part requests
   */
  async getStats(): Promise<SparePartRequestStats> {
    return get<SparePartRequestStats>(`/supplier-portal/spare-part-requests/stats`);
  },
};

export default sparePartRequestsService;
