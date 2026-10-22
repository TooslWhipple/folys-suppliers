import { get, post, put } from "./api";
import type { PaginatedResponse } from "@/types/pagination";

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  receivedQuantity: number;
  /** Cantidad aún por recibir: max(0, solicitada − recibida). */
  pendingQuantity: number;
  /** Fecha prometida de la línea (`YYYY-MM-DD`), null si aún no se fija. */
  scheduledDeliveryDate: string | null;
  /** unit_price del renglón, en la moneda del renglón. */
  cost: number | null;
  currency: string | null;
  exchangeRate: number | null;
}

// ERP full order response types
export interface OrderItemFull {
  id: number;
  order_id: number;
  product_id: number;
  requested_quantity: number;
  delivered_quantity: number;
  /** Lo que pidió Foly originalmente (el proveedor puede bajar `requested_quantity` al aceptar). */
  original_requested_quantity: number;
  pending_quantity: number;
  /** Fecha prometida de la línea (`YYYY-MM-DD`). */
  scheduled_delivery_date: string | null;
  delivery_method_id: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  // Decimal de Prisma serializado como string
  unit_price: string;
  currency: "MXN" | "USD" | null;
  exchange_rate: string | null;
  product: {
    id: number;
    code: string;
    short_name: string;
    product_images: string[];
    product_suppliers: { supplier_id: number }[];
    currency: "MXN" | "USD" | null;
    // Decimal de Prisma serializado como string
    exchange_rate: string | null;
  };
}

export interface OrderFullTotals {
  currency: string;
  subtotal: number;
  iva: number;
  total: number;
}

export interface OrderAllowedActions {
  accept: boolean;
  editQuantities: boolean;
  editDeliveryDates: boolean;
}

export interface OrderFull {
  id: number;
  branch_id: number;
  folio: string;
  status: string;
  accepted_at: string | null;
  closed_at: string | null;
  allowed_actions: OrderAllowedActions;
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
  totals: OrderFullTotals;
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
  /** Folio oficial del ERP (`Orders.folio`). */
  folio: string;
  supplierId: number;
  branchId: number;
  orderDate: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  items: OrderItem[];
  /** Subtotal del pedido convertido a MXN, sin IVA. */
  subtotalMxn: number;
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
  /** Búsqueda por folio (server-side). */
  search?: string;
}

export interface UpdateOrderItemData {
  itemId: number;
  /** Solo se acepta con el pedido en `pending`; fuera de ahí el back responde 409. */
  requestedQuantity?: number;
  deliveryDate?: string;
  deliveryMethodId?: number;
}

export interface UpdateOrderData {
  items: UpdateOrderItemData[];
}

export interface AcceptOrderItemData {
  itemId: number;
  confirmedQuantity: number;
  /** `YYYY-MM-DD`; obligatoria si la cantidad confirmada es mayor que 0. */
  deliveryDate?: string;
  deliveryMethodId?: number;
}

export interface AcceptOrderData {
  items: AcceptOrderItemData[];
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
    const { page = 1, limit = 10, status, search } = params;

    const queryParams: Record<string, string | number> = { page, limit };
    if (status) queryParams.status = status;
    if (search) queryParams.search = search;

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
   * Get full order details for the authenticated supplier
   * @param id - Order ID
   */
  async getOrderFull(id: number): Promise<OrderFull> {
    const response = await get<{
      success: boolean;
      data: OrderFull;
      message?: string;
      errorCode: string | null;
    }>(`/supplier-portal/orders/${id}/full`);

    return response.data;
  },

  /**
   * Update order items (quantities and delivery dates)
   * @param orderId - Order ID
   * @param data - Order update data
   */
  async updateOrder(orderId: number, data: UpdateOrderData): Promise<OrderFull> {
    const response = await put<{
      success: boolean;
      data: OrderFull;
      message?: string;
    }>(`/supplier-portal/orders/${orderId}`, data);
    return response.data;
  },

  /**
   * Accept a pending order: fixes confirmed quantities and promise dates per line.
   * Afterwards quantities are locked.
   */
  async acceptOrder(orderId: number, data: AcceptOrderData): Promise<OrderFull> {
    const response = await post<{
      success: boolean;
      data: OrderFull;
      message?: string;
    }>(`/supplier-portal/orders/${orderId}/accept`, data);
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
