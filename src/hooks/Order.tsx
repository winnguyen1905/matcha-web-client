import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { ID, Query, type Models } from "appwrite";
import { databases } from "../lib/appwrite";
import {
  Order,
  OrderItem,
  CreateOrder,
  UpdateOrder,
  CreateOrderItem,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  Currency,
  ShippingAddress,
  BillingAddress,
  COLLECTIONS,
  VALIDATION_LIMITS,
  isValidOrderStatus,
  isValidPaymentStatus,
  isValidPaymentMethod,
  isValidCurrency,
} from "../lib/schema";

// Environment variables
export const ORDERS_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || "";

// Helper functions for validation and parsing
const toNumber = (val: unknown): number => {
  if (val === null || val === undefined || val === "") return 0;
  const n = typeof val === "string" ? Number(val.replace(/[^0-9.+-]/g, "")) : Number(val);
  return Number.isNaN(n) ? 0 : n;
};

const generateOrderCode = (orderId: string): string => {
  // Generate a unique order code based on the order ID
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `ORD-${timestamp}-${randomStr}`.toUpperCase();
};

// Types for order statistics and analytics
export interface OrderStatistics {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    totalQuantity: number;
    totalRevenue: number;
  }>;
}

export interface OrderSummary {
  orderId: string;
  orderCode: string;
  status: OrderStatus;
  finalPrice: number;
  itemCount: number;
  createdAt: string;
}

interface OrderContextType {
  orders: Order[];
  orderItems: OrderItem[];
  loading: boolean;
  error: string | null;

  // CRUD Operations
  createOrder: (order: CreateOrder, items: CreateOrderItem[]) => Promise<Order>;
  updateOrder: (id: string, updates: UpdateOrder) => Promise<Order>;
  deleteOrder: (id: string) => Promise<void>;
  getOrderById: (id: string) => Promise<Order | null>;
  getOrderByCode: (orderCode: string) => Promise<Order | null>;
  
  // Order Items
  addOrderItem: (item: CreateOrderItem) => Promise<OrderItem>;
  updateOrderItem: (id: string, updates: Partial<CreateOrderItem>) => Promise<OrderItem>;
  deleteOrderItem: (id: string) => Promise<void>;
  getOrderItems: (orderId: string) => Promise<OrderItem[]>;

  // Order Management
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<Order>;
  updatePaymentStatus: (id: string, paymentStatus: PaymentStatus) => Promise<Order>;
  cancelOrder: (id: string, reason?: string) => Promise<Order>;
  refundOrder: (id: string, amount?: number, reason?: string) => Promise<Order>;

  // Queries
  getOrdersByUser: (userId: string) => Promise<Order[]>;
  getOrdersByStatus: (status: OrderStatus) => Promise<Order[]>;
  getOrdersByDateRange: (startDate: string, endDate: string) => Promise<Order[]>;
  getOrdersByPaymentMethod: (paymentMethod: PaymentMethod) => Promise<Order[]>;
  getPendingOrders: () => Promise<Order[]>;
  getRecentOrders: (limit?: number) => Promise<Order[]>;

  // Analytics
  getOrderStatistics: () => Promise<OrderStatistics>;
  getUserOrderHistory: (userId: string) => Promise<OrderSummary[]>;
  getRevenueBetweenDates: (startDate: string, endDate: string) => Promise<number>;
  getTopProducts: (limit?: number) => Promise<Array<{ productId: string; totalSold: number; revenue: number }>>;

  // Bulk Operations
  bulkUpdateOrderStatus: (orderIds: string[], status: OrderStatus) => Promise<void>;
  bulkDeleteOrders: (orderIds: string[]) => Promise<void>;

  // Validation
  validateOrderData: (order: CreateOrder) => boolean;
  validateShippingAddress: (address: ShippingAddress) => boolean;
  validateBillingAddress: (address: BillingAddress) => boolean;

  // Utilities
  calculateOrderTotal: (items: CreateOrderItem[]) => number;
  formatOrderCode: (orderId: string) => string;

  // Init
  init: () => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
};

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validation functions
  const validateShippingAddress = (address: ShippingAddress): boolean => {
    return !!(
      address.fullName?.trim() &&
      address.phone?.trim() &&
      address.address?.trim() &&
      address.city?.trim() &&
      address.country?.trim() &&
      address.postalCode?.trim()
    );
  };

  const validateBillingAddress = (address: BillingAddress): boolean => {
    if (address.sameAsShipping) return true;
    return !!(
      address.fullName?.trim() &&
      address.address?.trim() &&
      address.city?.trim() &&
      address.country?.trim() &&
      address.postalCode?.trim()
    );
  };

  const validateOrderData = (order: CreateOrder): boolean => {
    if (!order.userId?.trim()) return false;
    if (!isValidOrderStatus(order.status)) return false;
    if (!isValidPaymentMethod(order.paymentMethod)) return false;
    if (!isValidPaymentStatus(order.paymentStatus)) return false;
    if (!isValidCurrency(order.currency)) return false;
    if (!validateShippingAddress(order.shippingAddress)) return false;
    if (order.billingAddress && !validateBillingAddress(order.billingAddress)) return false;

    const { AMOUNT_MIN, AMOUNT_MAX } = VALIDATION_LIMITS.ORDER;
    if (order.subtotal < AMOUNT_MIN || order.subtotal > AMOUNT_MAX) return false;
    if (order.finalPrice < AMOUNT_MIN || order.finalPrice > AMOUNT_MAX) return false;

    return true;
  };

  const calculateOrderTotal = (items: CreateOrderItem[]): number => {
    return items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  };

  const formatOrderCode = generateOrderCode;

  // Initialize
  const init = async () => {
    try {
      setLoading(true);
      const [ordersRes, itemsRes] = await Promise.all([
        databases.listDocuments(ORDERS_DATABASE_ID, COLLECTIONS.ORDERS, [
          Query.orderDesc("$createdAt")
        ]),
        databases.listDocuments(ORDERS_DATABASE_ID, COLLECTIONS.ORDER_ITEMS, [
          Query.orderDesc("$createdAt")
        ])
      ]);
      setOrders(ordersRes.documents as Order[]);
      setOrderItems(itemsRes.documents as OrderItem[]);
    } catch (err) {
      console.error("Error initializing orders:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = init;

  // CRUD Operations
  const createOrder = async (orderData: CreateOrder, items: CreateOrderItem[]): Promise<Order> => {
    try {
      setLoading(true);
      setError(null);

      if (!validateOrderData(orderData)) {
        throw new Error("Invalid order data");
      }

      const orderId = ID.unique();
      const orderCode = generateOrderCode(orderId);

      const order = {
        ...orderData,
        $id: orderId,
        orderCode,
        createdAt: new Date().toISOString(),
      } as Order;

      // Create order document
      const createdOrder = await databases.createDocument(
        ORDERS_DATABASE_ID,
        COLLECTIONS.ORDERS,
        orderId,
        {
          ...order,
          shippingAddress: JSON.stringify(order.shippingAddress),
          billingAddress: order.billingAddress ? JSON.stringify(order.billingAddress) : undefined,
        }
      ) as Order;

      // Create order items
      const createdItems: OrderItem[] = [];
      for (const item of items) {
        const itemId = ID.unique();
        const orderItem = {
          ...item,
          $id: itemId,
          orderId,
        } as OrderItem;

        const createdItem = await databases.createDocument(
          ORDERS_DATABASE_ID,
          COLLECTIONS.ORDER_ITEMS,
          itemId,
          orderItem
        ) as OrderItem;

        createdItems.push(createdItem);
      }

      // Update state
      setOrders(prev => [createdOrder, ...prev]);
      setOrderItems(prev => [...createdItems, ...prev]);

      return createdOrder;
    } catch (err) {
      console.error("Error creating order:", err);
      setError("Failed to create order");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (id: string, updates: UpdateOrder): Promise<Order> => {
    try {
      setLoading(true);
      
      const updateData = {
        ...updates,
        shippingAddress: updates.shippingAddress ? JSON.stringify(updates.shippingAddress) : undefined,
        billingAddress: updates.billingAddress ? JSON.stringify(updates.billingAddress) : undefined,
      };

      const updatedOrder = await databases.updateDocument(
        ORDERS_DATABASE_ID,
        COLLECTIONS.ORDERS,
        id,
        updateData
      ) as Order;

      setOrders(prev => prev.map(order => order.$id === id ? updatedOrder : order));
      return updatedOrder;
    } catch (err) {
      console.error("Error updating order:", err);
      setError("Failed to update order");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      
      // Delete associated order items first
      const items = await getOrderItems(id);
      await Promise.all(items.map(item => 
        databases.deleteDocument(ORDERS_DATABASE_ID, COLLECTIONS.ORDER_ITEMS, item.$id)
      ));

      // Delete the order
      await databases.deleteDocument(ORDERS_DATABASE_ID, COLLECTIONS.ORDERS, id);
      
      setOrders(prev => prev.filter(order => order.$id !== id));
      setOrderItems(prev => prev.filter(item => item.orderId !== id));
    } catch (err) {
      console.error("Error deleting order:", err);
      setError("Failed to delete order");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = async (id: string): Promise<Order | null> => {
    try {
      const order = await databases.getDocument(ORDERS_DATABASE_ID, COLLECTIONS.ORDERS, id) as Order;
      return order;
    } catch (err) {
      console.error("Error fetching order:", err);
      return null;
    }
  };

  const getOrderByCode = async (orderCode: string): Promise<Order | null> => {
    try {
      const result = await databases.listDocuments(
        ORDERS_DATABASE_ID,
        COLLECTIONS.ORDERS,
        [Query.equal("orderCode", [orderCode])]
      );
      return result.documents.length > 0 ? result.documents[0] as Order : null;
    } catch (err) {
      console.error("Error fetching order by code:", err);
      return null;
    }
  };

  // Order Items Management
  const addOrderItem = async (item: CreateOrderItem): Promise<OrderItem> => {
    try {
      const itemId = ID.unique();
      const orderItem = { ...item, $id: itemId } as OrderItem;
      
      const createdItem = await databases.createDocument(
        ORDERS_DATABASE_ID,
        COLLECTIONS.ORDER_ITEMS,
        itemId,
        orderItem
      ) as OrderItem;

      setOrderItems(prev => [createdItem, ...prev]);
      return createdItem;
    } catch (err) {
      console.error("Error adding order item:", err);
      throw err;
    }
  };

  const updateOrderItem = async (id: string, updates: Partial<CreateOrderItem>): Promise<OrderItem> => {
    try {
      const updatedItem = await databases.updateDocument(
        ORDERS_DATABASE_ID,
        COLLECTIONS.ORDER_ITEMS,
        id,
        updates
      ) as OrderItem;

      setOrderItems(prev => prev.map(item => item.$id === id ? updatedItem : item));
      return updatedItem;
    } catch (err) {
      console.error("Error updating order item:", err);
      throw err;
    }
  };

  const deleteOrderItem = async (id: string): Promise<void> => {
    try {
      await databases.deleteDocument(ORDERS_DATABASE_ID, COLLECTIONS.ORDER_ITEMS, id);
      setOrderItems(prev => prev.filter(item => item.$id !== id));
    } catch (err) {
      console.error("Error deleting order item:", err);
      throw err;
    }
  };

  const getOrderItems = async (orderId: string): Promise<OrderItem[]> => {
    try {
      const result = await databases.listDocuments(
        ORDERS_DATABASE_ID,
        COLLECTIONS.ORDER_ITEMS,
        [Query.equal("orderId", [orderId])]
      );
      return result.documents as OrderItem[];
    } catch (err) {
      console.error("Error fetching order items:", err);
      return [];
    }
  };

  // Order Status Management
  const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order> => {
    return updateOrder(id, { status });
  };

  const updatePaymentStatus = async (id: string, paymentStatus: PaymentStatus): Promise<Order> => {
    return updateOrder(id, { paymentStatus });
  };

  const cancelOrder = async (id: string, _reason?: string): Promise<Order> => {
    // Remove notes field to match collection schema
    return updateOrder(id, { status: 'CANCELLED' });
  };

  const refundOrder = async (id: string, amount?: number, _reason?: string): Promise<Order> => {
    // Only adjust payment status; omit unknown fields
    const updates: UpdateOrder = {
      paymentStatus: amount ? 'PARTIALLY_REFUNDED' : 'REFUNDED'
    };
    return updateOrder(id, updates);
  };

  // Query functions
  const getOrdersByUser = async (userId: string): Promise<Order[]> => {
    try {
      const result = await databases.listDocuments(
        ORDERS_DATABASE_ID,
        COLLECTIONS.ORDERS,
        [Query.equal("userId", [userId]), Query.orderDesc("$createdAt")]
      );
      return result.documents as Order[];
    } catch (err) {
      console.error("Error fetching user orders:", err);
      return [];
    }
  };

  const getOrdersByStatus = async (status: OrderStatus): Promise<Order[]> => {
    try {
      const result = await databases.listDocuments(
        ORDERS_DATABASE_ID,
        COLLECTIONS.ORDERS,
        [Query.equal("status", [status]), Query.orderDesc("$createdAt")]
      );
      return result.documents as Order[];
    } catch (err) {
      console.error("Error fetching orders by status:", err);
      return [];
    }
  };

  const getOrdersByDateRange = async (startDate: string, endDate: string): Promise<Order[]> => {
    try {
      const result = await databases.listDocuments(
        ORDERS_DATABASE_ID,
        COLLECTIONS.ORDERS,
        [
          Query.greaterThanEqual("createdAt", startDate),
          Query.lessThanEqual("createdAt", endDate),
          Query.orderDesc("$createdAt")
        ]
      );
      return result.documents as Order[];
    } catch (err) {
      console.error("Error fetching orders by date range:", err);
      return [];
    }
  };

  const getOrdersByPaymentMethod = async (paymentMethod: PaymentMethod): Promise<Order[]> => {
    try {
      const result = await databases.listDocuments(
        ORDERS_DATABASE_ID,
        COLLECTIONS.ORDERS,
        [Query.equal("paymentMethod", [paymentMethod]), Query.orderDesc("$createdAt")]
      );
      return result.documents as Order[];
    } catch (err) {
      console.error("Error fetching orders by payment method:", err);
      return [];
    }
  };

  const getPendingOrders = async (): Promise<Order[]> => {
    return getOrdersByStatus('PENDING');
  };

  const getRecentOrders = async (limit: number = 10): Promise<Order[]> => {
    try {
      const result = await databases.listDocuments(
        ORDERS_DATABASE_ID,
        COLLECTIONS.ORDERS,
        [Query.orderDesc("$createdAt"), Query.limit(limit)]
      );
      return result.documents as Order[];
    } catch (err) {
      console.error("Error fetching recent orders:", err);
      return [];
    }
  };

  // Analytics functions
  const getOrderStatistics = async (): Promise<OrderStatistics> => {
    try {
      const allOrders = await databases.listDocuments(ORDERS_DATABASE_ID, COLLECTIONS.ORDERS);
      const orders = allOrders.documents as Order[];

      const stats: OrderStatistics = {
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'PENDING').length,
        completedOrders: orders.filter(o => o.status === 'DELIVERED').length,
        cancelledOrders: orders.filter(o => o.status === 'CANCELLED').length,
        totalRevenue: orders.reduce((sum, o) => sum + toNumber(o.finalPrice), 0),
        averageOrderValue: 0,
        topProducts: []
      };

      stats.averageOrderValue = stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0;

      return stats;
    } catch (err) {
      console.error("Error calculating order statistics:", err);
      return {
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        topProducts: []
      };
    }
  };

  const getUserOrderHistory = async (userId: string): Promise<OrderSummary[]> => {
    try {
      const userOrders = await getOrdersByUser(userId);
      return userOrders.map(order => ({
        orderId: order.$id,
        orderCode: order.orderCode,
        status: order.status,
        finalPrice: toNumber(order.finalPrice),
        itemCount: 0, // Would need to fetch items to get accurate count
        createdAt: order.createdAt
      }));
    } catch (err) {
      console.error("Error fetching user order history:", err);
      return [];
    }
  };

  const getRevenueBetweenDates = async (startDate: string, endDate: string): Promise<number> => {
    try {
      const orders = await getOrdersByDateRange(startDate, endDate);
      return orders.reduce((sum, order) => sum + toNumber(order.finalPrice), 0);
    } catch (err) {
      console.error("Error calculating revenue:", err);
      return 0;
    }
  };

  const getTopProducts = async (limit: number = 10) => {
    // This would require more complex aggregation, simplified for now
    return [];
  };

  // Bulk operations
  const bulkUpdateOrderStatus = async (orderIds: string[], status: OrderStatus): Promise<void> => {
    try {
      await Promise.all(orderIds.map(id => updateOrderStatus(id, status)));
    } catch (err) {
      console.error("Error bulk updating order status:", err);
      throw err;
    }
  };

  const bulkDeleteOrders = async (orderIds: string[]): Promise<void> => {
    try {
      await Promise.all(orderIds.map(id => deleteOrder(id)));
    } catch (err) {
      console.error("Error bulk deleting orders:", err);
      throw err;
    }
  };

  useEffect(() => {
    init();
  }, []);

  const value: OrderContextType = useMemo(() => ({
    orders,
    orderItems,
    loading,
    error,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrderById,
    getOrderByCode,
    addOrderItem,
    updateOrderItem,
    deleteOrderItem,
    getOrderItems,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder,
    refundOrder,
    getOrdersByUser,
    getOrdersByStatus,
    getOrdersByDateRange,
    getOrdersByPaymentMethod,
    getPendingOrders,
    getRecentOrders,
    getOrderStatistics,
    getUserOrderHistory,
    getRevenueBetweenDates,
    getTopProducts,
    bulkUpdateOrderStatus,
    bulkDeleteOrders,
    validateOrderData,
    validateShippingAddress,
    validateBillingAddress,
    calculateOrderTotal,
    formatOrderCode,
    init,
    refreshOrders,
  }), [orders, orderItems, loading, error]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export default OrdersProvider;
