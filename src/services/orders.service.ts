import { get, put, post } from "./api";

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
  order_deliveries: OrderDelivery[];
}

export interface OrderDelivery {
  id: number;
  order_id: number;
  delivery_date: string;
  delivery_method_id: number | null;
  delivery_method?: DeliveryMethod | null;
  received_by: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  order_delivery_items: OrderDeliveryItem[];
}

export interface OrderDeliveryItem {
  id: number;
  order_delivery_id: number;
  order_item_id: number;
  delivered_quantity: number;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
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

export interface UpdateOrderItemData {
  itemId: number;
  requestedQuantity: number;
  deliveryDate?: string;
  deliveryMethodId?: number;
}

export interface UpdateOrderData {
  items: UpdateOrderItemData[];
}

export interface Invoice {
  id: number;
  orderId: number;
  subtotal: string;
  iva: string;
  total: string;
  pdfUrl: string | null;
  xmlUrl: string | null;
  status: string;
  createdAt: string;
}

export interface CreateInvoiceData {
  subtotal: string;
  iva: string;
  total: string;
  pdfFile?: File | null;
  xmlFile?: File | null;
}

export interface DeliveryMethod {
  id: number;
  code: string;
  name: string;
  description: string | null;
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

    const response = await get<{
      success: boolean;
      data: PaginatedResponse<Order>;
      message?: string;
    }>("/supplier-portal/orders", { params: queryParams });

    return response.data;
  },

  /**
   * Get statistics for the authenticated supplier's orders
   */
  async getStats(): Promise<OrderStats> {
    const response = await get<{
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
    const response = await get<{
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
    const response = await get<{
      success: boolean;
      data: OrderFull;
      message?: string;
      errorCode: string | null;
    }>(`/orders/${id}/full`);

    return response.data;
  },

  /**
   * Update order items (quantities and delivery dates)
   * @param orderId - Order ID
   * @param data - Order update data
   */
  async updateOrder(orderId: number, data: UpdateOrderData): Promise<{ success: boolean; message: string }> {
    const response = await put<{
      success: boolean;
      data: { success: boolean; message: string };
      message?: string;
    }>(`/supplier-portal/orders/${orderId}`, data);
    return response.data;
  },

  /**
   * Get invoices for an order
   * @param orderId - Order ID
   */
  async getOrderInvoices(orderId: number): Promise<Invoice[]> {
    const response = await get<{
      success: boolean;
      data: Invoice[];
      message?: string;
    }>(`/supplier-portal/orders/${orderId}/invoices`);
    return response.data;
  },

  /**
   * Create a new invoice for an order
   * @param orderId - Order ID
   * @param data - Invoice data
   */
  async createInvoice(orderId: number, data: CreateInvoiceData): Promise<Invoice> {
    const formData = new FormData();
    formData.append('subtotal', data.subtotal);
    formData.append('iva', data.iva);
    formData.append('total', data.total);

    if (data.pdfFile) {
      formData.append('pdf', data.pdfFile);
    }
    if (data.xmlFile) {
      formData.append('xml', data.xmlFile);
    }

    const response = await post<{
      success: boolean;
      data: Invoice;
      message?: string;
    }>(`/supplier-portal/orders/${orderId}/invoices`, formData);
    return response.data;
  },

  async getDeliveryMethods(): Promise<DeliveryMethod[]> {
    const response = await get<{
      success: boolean;
      data: DeliveryMethod[];
      message?: string;
    }>('/supplier-portal/delivery-methods');
    return response.data;
  },
};

export default ordersService;
