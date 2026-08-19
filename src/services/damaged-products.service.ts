import { get } from "@/lib/api/client";
import type { PaginatedResponse } from "@/types/pagination";

/**
 * Row of the "a recolectar" tab: items marked to be returned to the supplier
 * that already have their acceptance letter (CAR) issued.
 */
export interface DamagedProductToCollect {
  id: number;
  folio: string;
  productCode: string;
  productName: string;
  quantity: number;
  serialNumber: string | null;
  damageType: string;
  branch: { id: number; name: string };
  reportDate: string;
  waitingDays: number;
}

/**
 * Row of the "a reparación" tab: same fields as "a recolectar" plus the repair
 * cost that was assigned to the supplier.
 */
export interface DamagedProductToRepair extends DamagedProductToCollect {
  repairCost: number;
}

/**
 * Detail of a damaged item, shared by the drawer of both tabs.
 * `repairCost` is null for items of the "a recolectar" tab.
 */
export interface DamagedProductDetail {
  id: number;
  folio: string;
  productCode: string;
  productName: string;
  quantity: number;
  serialNumber: string | null;
  branch: { id: number; name: string };
  damageOrigin: string;
  damageType: string;
  damageDescription: string;
  observations: string | null;
  reportDate: string;
  waitingDays: number;
  repairCost: number | null;
}

export interface DamagedProductStats {
  toCollectCount: number;
  toRepairCount: number;
  toRepairTotalCost: number;
}

export interface GetDamagedProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortDir?: "asc" | "desc";
}

function buildListQueryParams(
  params: GetDamagedProductsParams
): Record<string, string | number> {
  const { page = 1, limit = 10, search, dateFrom, dateTo, sortDir } = params;

  const queryParams: Record<string, string | number> = { page, limit };
  if (search) queryParams.search = search;
  if (dateFrom) queryParams.dateFrom = dateFrom;
  if (dateTo) queryParams.dateTo = dateTo;
  if (sortDir) queryParams.sortDir = sortDir;

  return queryParams;
}

export const damagedProductsService = {
  /**
   * Get the damaged items awaiting collection by the authenticated supplier
   * @param params - Query parameters for pagination, search and date range
   */
  async getToCollect(
    params: GetDamagedProductsParams
  ): Promise<PaginatedResponse<DamagedProductToCollect>> {
    const response = await get<{
      success: boolean;
      data: PaginatedResponse<DamagedProductToCollect>;
      message?: string;
    }>("/supplier-portal/damaged-products/to-collect", {
      params: buildListQueryParams(params),
    });

    return response.data;
  },

  /**
   * Get the damaged items whose repair cost is charged to the authenticated supplier
   * @param params - Query parameters for pagination, search and date range
   */
  async getToRepair(
    params: GetDamagedProductsParams
  ): Promise<PaginatedResponse<DamagedProductToRepair>> {
    const response = await get<{
      success: boolean;
      data: PaginatedResponse<DamagedProductToRepair>;
      message?: string;
    }>("/supplier-portal/damaged-products/to-repair", {
      params: buildListQueryParams(params),
    });

    return response.data;
  },

  /**
   * Get the detail of a single damaged item
   * @param id - Damaged product ID
   */
  async getDamagedProductById(id: number): Promise<DamagedProductDetail> {
    const response = await get<{
      success: boolean;
      data: DamagedProductDetail;
      message?: string;
    }>(`/supplier-portal/damaged-products/${id}`);

    return response.data;
  },

  /**
   * Get the counters of both damaged goods tabs
   */
  async getStats(): Promise<DamagedProductStats> {
    const response = await get<{
      success: boolean;
      data: DamagedProductStats;
      message?: string;
    }>("/supplier-portal/damaged-products/stats");

    return response.data;
  },
};

export default damagedProductsService;
