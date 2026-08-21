import { get } from "@/lib/api/client";
import type { PaginatedResponse } from "@/types/pagination";

export interface CatalogItem {
  id: string;
  sku: string;
  nombre: string;
  unidades: number;
  enviadosUltAno: number;
  enviadosUltMes: number;
  enviadosMesActual: number;
}

export interface GetCatalogParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const catalogService = {
  /**
   * Get catalog products for the authenticated supplier
   * @param params - Query parameters for pagination and search
   */
  async getCatalog(params: GetCatalogParams): Promise<PaginatedResponse<CatalogItem>> {
    const { page = 1, limit = 10, search } = params;

    const queryParams: Record<string, string | number> = { page, limit };
    if (search) queryParams.search = search;

    const response = await get<{
      success: boolean;
      data: PaginatedResponse<CatalogItem>;
      message?: string;
    }>(`/supplier-portal/catalog`, { params: queryParams });

    return response.data;
  },
};

export default catalogService;
