import { get } from "@/lib/api/client";

export interface CatalogItem {
  id: string;
  sku: string;
  nombre: string;
  imagen: string;
  unidades: number;
  unidadesStatus: "critical" | "warning" | "good";
  enviadosUltAno: number;
  enviadosUltMes: number;
  enviadosMesActual: number;
  ventasMensuales: { mes: string; enviados: number }[];
  estatus: "activo" | "archivado";
  cost?: number;
  currency?: string;
}

export interface PaginatedResponse<T> {
  rows: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetCatalogParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const catalogService = {
  /**
   * Get catalog products for the authenticated supplier
   * @param params - Query parameters for pagination, search and status filter
   */
  async getCatalog(params: GetCatalogParams): Promise<PaginatedResponse<CatalogItem>> {
    const { page = 1, limit = 10, search, status } = params;

    const queryParams: Record<string, string | number> = { page, limit };
    if (search) queryParams.search = search;
    if (status && status !== "all") queryParams.status = status;

    return get<PaginatedResponse<CatalogItem>>(`/supplier-portal/catalog`, {
      params: queryParams,
    });
  },
};

export default catalogService;
