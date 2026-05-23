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

// ERP full order response types
export interface OrderItemFull {
  id: number;
  order_id: number;
  product_id: number;
  requested_quantity: number;
  delivered_quantity: number;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  product: {
    id: number;
    code: string;
    short_name: string;
    list_cost: string;
    product_images: string[];
    product_suppliers: { supplier_id: number }[];
  };
}

export interface OrderFull {
  id: number;
  branch_id: number;
  folio: string;
  status: string;
  requested_by: number | null;
  order_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  created_by: number;
  updated_by: number | null;
  deleted_by: number | null;
  client_id: number | null;
  branch: {
    id: number;
    name: string;
  };
  client: null;
  requested_by_user: null;
  order_items: OrderItemFull[];
  order_deliveries: unknown[];
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

    const queryParams: Record<string, string | number> = { page, limit, supplierId: 2 };
    if (status) queryParams.status = status;

    const response = await api.get<{
      success: boolean;
      data: PaginatedResponse<Order>;
      message?: string;
    }>("/supplier-portal/orders", queryParams);

    return response.data;
  },

  /**
   * Get statistics for the authenticated supplier's orders
   */
  async getStats(): Promise<OrderStats> {
    const response = await api.get<{
      success: boolean;
      data: OrderStats;
      message?: string;
    }>("/supplier-portal/orders/stats");

    return response.data;
  },

  /**
   * Get a single order by ID
   * @param id - Order ID
   */
  async getOrderById(id: number): Promise<Order> {
    const response = await api.get<{
      success: boolean;
      data: Order;
      message?: string;
    }>(`/supplier-portal/orders/${id}`);

    return response.data;
  },

  /**
   * Get full order details from ERP API
   * @param id - Order ID
   */
  async getOrderFull(id: number): Promise<OrderFull> {
    const response = await api.get<{
      success: boolean;
      data: OrderFull;
      message?: string;
      errorCode: string | null;
    }>(`/orders/${id}/full`);

    return response.data;
  },
};

export default ordersService;
