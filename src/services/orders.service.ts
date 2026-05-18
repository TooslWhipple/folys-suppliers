import { api } from "./api";

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  receivedQuantity: number;
  cost: number | null;
  currency: string | null;
}

export interface Order {
  id: number;
  supplierId: number;
  branchId: number;
  orderDate: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  items: OrderItem[];
}

export interface PaginatedResponse<T> {
  rows: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderStats {
  itemsPendingDelivery: number;
  valuePendingDelivery: number;
  ordersPendingCount: number;
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
}

export const ordersService = {
  /**
   * Get orders for the authenticated supplier
   * @param params - Query parameters for pagination and filtering
   */
  async getOrders(params: GetOrdersParams): Promise<PaginatedResponse<Order>> {
    const { page = 1, limit = 10, status } = params;

    const queryParams: Record<string, string | number> = { page, limit };
    if (status) queryParams.status = status;

    return api.get<PaginatedResponse<Order>>("/supplier-portal/orders", queryParams);
  },

  /**
   * Get statistics for the authenticated supplier's orders
   */
  async getStats(): Promise<OrderStats> {
    return api.get<OrderStats>("/supplier-portal/orders/stats");
  },
};

export default ordersService;
