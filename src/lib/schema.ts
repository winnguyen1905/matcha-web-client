import { Models } from 'appwrite';

export interface TaxRate extends Partial<Models.Document> {
  name: string;
  rate: number; // Stored as decimal (e.g., 0.1 for 10%)
  country?: string;
  state?: string;
  zipCode?: string;
  isActive: boolean;
  appliesToShipping: boolean;
  priority: number; // For cases where multiple tax rates might apply
  description?: string;
}

export interface OrderItem extends Partial<Models.Document> {
  orderId: string;
  productId: string;
  productVariantId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  discountAmount: number;
}

export interface Order extends Partial<Models.Document> {
  orderCode: string; // HASH order.$id to unique code
  userId: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  subtotal: number; // before apply discount and tax
  taxAmount: number;
  discountTotal: number;
  shippingAmount: number;
  finalPrice: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'KRW' | 'RMB' | 'THB' | 'VND';
  paymentMethod: 'COD' | 'ONLINE';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state?: string;
    country: string;
    postalCode: string;
  };
  billingAddress?: {
    sameAsShipping: boolean;
    fullName?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  discountCode?: string;
  discountId?: string;
  notes?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface UserDiscount extends Partial<Models.Document> {
  userId: string;
  discountId: string;
}

export interface Discount extends Partial<Models.Document> {
  code: string; //
  description?: string; //
  discountType: 'PERCENTAGE' | 'FIXED'; //
  value: number; //
  minOrderAmount?: number;//
  maxDiscountAmount?: number;//
  startDate: string;////
  endDate: string;//
  isActive: boolean;//
  usageLimit?: number;//
  usageCount: number; //
  appliesTo: {
    allProducts: boolean; //
    productIds?: string[]; //
    categoryIds?: string[]; //
  };
  createdBy: string; //
} 

export interface DiscountUsage extends Partial<Models.Document> {
  discountId: string;
  userId: string; 
  orderId: string;
  orderTotal: number;
  discountAmount: number;
  usedAt: string;
  usageStatus: 'PENDING' | 'COMPLETED' | 'FAILED';
}

// Collection IDs
export const COLLECTIONS = {
  TAX_RATES: 'tax_rates',
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
  USER_DISCOUNTS: 'user_discounts',
  DISCOUNTS: 'discounts',
  DISCOUNT_USAGE: 'discount_usage',
} as const;

// Index types for better type safety
export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];
