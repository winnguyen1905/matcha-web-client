import { Models } from 'appwrite';

// Base interface for all documents
interface BaseDocument extends Partial<Models.Document> {
  $id: string;
  $createdAt?: string;
  $updatedAt?: string;
  $permissions?: string[];
  $databaseId?: string;
  $collectionId?: string;
}

// Address Interface (embedded in other objects)
export interface Address {
  type?: 'shipping' | 'billing' | 'both';
  label?: string; // e.g., "Home", "Work", "Default"
  fullName: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault?: boolean;
}

// User Information Interface (separate from authentication)
export interface UserInformation extends BaseDocument {
  userId: string; // Links to Appwrite Auth User ID
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  addresses: Address[]; // Array of saved addresses
  preferences: {
    theme?: 'light' | 'dark' | 'system';
    language?: 'en' | 'vi' | 'cn';
    notifications?: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Simplified Shipping Address (for orders)
export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

// Simplified Billing Address (for orders)
export interface BillingAddress {
  sameAsShipping: boolean;
  fullName?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

// Tax Rate Interface
export interface TaxRate extends BaseDocument {
  name: string;
  rate: number; // Stored as decimal (e.g., 0.1 for 10%)
  country?: string;
  state?: string;
  zipCode?: string;
  isActive: boolean;
  appliesToShipping: boolean;
  priority: number; // For cases where multiple tax rates might apply (0-100)
  description?: string;
}

// Order Item Interface
export interface OrderItem extends BaseDocument {
  orderId: string;
  productId: string;
  productVariantId: string;
  quantity: number; // 1-1000
  unitPrice: number;
  total: number;
  discountAmount: number;
}

// Order Status Enum
export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

// Currency Enum
export type Currency =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'JPY'
  | 'KRW'
  | 'RMB'
  | 'THB'
  | 'VND';

// Payment Method Enum
export type PaymentMethod = 'COD' | 'ONLINE';

// Payment Status Enum
export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

// Order Interface
export interface Order extends BaseDocument {
  orderCode: string; // HASH order.$id to unique code
  userId: string;
  status: OrderStatus;
  subtotal: number; // before apply discount and tax
  taxAmount: number;
  discountTotal: number;
  shippingAmount: number;
  finalPrice: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddress: ShippingAddress; // Stored as JSON in database
  billingAddress?: BillingAddress; // Stored as JSON in database
  discountCode?: string;
  notes?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string; // ISO string format
}

// User Discount Interface
export interface UserDiscount extends BaseDocument {
  userId: string;
  discountId: string;
  createdAt: string; // ISO string format
}

// Discount Type Enum
export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED'
}

// Applies To Interface
export interface AppliesTo {
  allProducts: boolean;
  productIds?: string[];
  categoryIds?: string[];
}

// Discount Interface
export interface Discount extends BaseDocument {
  code: string; // Unique discount code
  description?: string;
  discountType: DiscountType;
  value: number; // Percentage (0-100) or fixed amount
  minOrderAmount?: number; // Minimum order amount to apply discount
  maxDiscountAmount?: number; // Maximum discount amount (for percentage discounts)
  startDate: string; // ISO string format
  endDate: string; // ISO string format
  isActive: boolean;
  usageLimit?: number; // Maximum number of times this discount can be used (1-1000000)
  usageCount: number; // Current usage count (0-1000000)
  appliesTo: AppliesTo; // Stored as JSON in database
  createdBy: string; // User ID who created this discount
}

// Discount Usage Status Enum
export type DiscountUsageStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

// Discount Usage Interface
export interface DiscountUsage extends BaseDocument {
  discountId: string;
  userId: string;
  orderId: string;
  orderTotal: number;
  discountAmount: number;
  usedAt: string; // ISO string format
  usageStatus: DiscountUsageStatus;
}

// Collection IDs
export const COLLECTIONS = {
  ACCOUNTS: import.meta.env.VITE_APPWRITE_ACCOUNTS_COLLECTION_ID || 'accounts',
  USER_INFORMATION: import.meta.env.VITE_APPWRITE_USER_INFORMATION_COLLECTION_ID || 'user_information',
  TAX_RATES: import.meta.env.VITE_APPWRITE_TAX_RATES_COLLECTION_ID || 'tax_rates',
  ORDERS: import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID || 'orders',
  ORDER_ITEMS: import.meta.env.VITE_APPWRITE_ORDER_ITEMS_COLLECTION_ID || 'order_items',
  DISCOUNTS: import.meta.env.VITE_APPWRITE_DISCOUNTS_COLLECTION_ID || 'discounts',
  DISCOUNT_USAGE: import.meta.env.VITE_APPWRITE_DISCOUNT_USAGE_COLLECTION_ID || 'discount_usage',
  USER_DISCOUNTS: import.meta.env.VITE_APPWRITE_USER_DISCOUNTS_COLLECTION_ID || 'user_discounts',
  PRODUCTS: import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID || 'products',
} as const;

// Index types for better type safety
export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];

// Type guards for runtime type checking
export const isValidOrderStatus = (status: string): status is OrderStatus => {
  return ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'].includes(status);
};

export const isValidCurrency = (currency: string): currency is Currency => {
  return ['USD', 'EUR', 'GBP', 'JPY', 'KRW', 'RMB', 'THB', 'VND'].includes(currency);
};

export const isValidPaymentMethod = (method: string): method is PaymentMethod => {
  return ['COD', 'ONLINE'].includes(method);
};

export const isValidPaymentStatus = (status: string): status is PaymentStatus => {
  return ['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED'].includes(status);
};

export const isValidDiscountType = (type: string): type is DiscountType => {
  return ['PERCENTAGE', 'FIXED'].includes(type);
};

export const isValidDiscountUsageStatus = (status: string): status is DiscountUsageStatus => {
  return ['PENDING', 'COMPLETED', 'FAILED'].includes(status);
};

// Utility functions for Address handling
export const getDefaultAddress = (addresses: Address[]): Address | null => {
  return addresses.find(addr => addr.isDefault) || addresses[0] || null;
};

export const getAddressesByType = (addresses: Address[], type: 'shipping' | 'billing'): Address[] => {
  return addresses.filter(addr => addr.type === type || addr.type === 'both');
};

export const addressToShippingAddress = (address: Address): ShippingAddress => ({
  fullName: address.fullName,
  phone: address.phone || '',
  address: address.address,
  city: address.city,
  state: address.state,
  country: address.country,
  postalCode: address.postalCode,
});

// Utility types for creating/updating documents
export type CreateUserInformation = Omit<UserInformation, '$id' | '$createdAt' | '$updatedAt' | '$permissions' | '$databaseId' | '$collectionId'>;
export type UpdateUserInformation = Partial<CreateUserInformation>;

export type CreateTaxRate = Omit<TaxRate, '$id' | '$createdAt' | '$updatedAt' | '$permissions' | '$databaseId' | '$collectionId'>;
export type UpdateTaxRate = Partial<CreateTaxRate>;

export type CreateOrder = Omit<Order, '$id' | '$createdAt' | '$updatedAt' | '$permissions' | '$databaseId' | '$collectionId'>;
export type UpdateOrder = Partial<CreateOrder>;

export type CreateOrderItem = Omit<OrderItem, '$id' | '$createdAt' | '$updatedAt' | '$permissions' | '$databaseId' | '$collectionId'>;
export type UpdateOrderItem = Partial<CreateOrderItem>;

export type CreateDiscount = Omit<Discount, '$id' | '$createdAt' | '$updatedAt' | '$permissions' | '$databaseId' | '$collectionId'>;
export type UpdateDiscount = Omit<Discount, '$createdAt' | '$updatedAt' | '$permissions' | '$databaseId' | '$collectionId'>;

export type CreateDiscountUsage = Omit<DiscountUsage, keyof BaseDocument>;
export type UpdateDiscountUsage = Partial<CreateDiscountUsage>;

export type CreateUserDiscount = Omit<UserDiscount, keyof BaseDocument>;

// Query builder types for better type safety
export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string[];
  select?: string[];
}

export interface UserInformationQuery extends QueryOptions {
  userId?: string;
  isActive?: boolean;
}

export interface TaxRateQuery extends QueryOptions {
  country?: string;
  state?: string;
  isActive?: boolean;
}

export interface OrderQuery extends QueryOptions {
  userId?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  dateFrom?: string;
  dateTo?: string;
}

export interface DiscountQuery extends QueryOptions {
  code?: string;
  isActive?: boolean;
  discountType?: DiscountType;
  createdBy?: string;
}

// Database response types
export interface DatabaseResponse<T> {
  total: number;
  documents: T[];
}

// Error types
export interface DatabaseError {
  code: number;
  message: string;
  type?: string;
}

// Constants for validation
export const VALIDATION_LIMITS = {
  USER_INFORMATION: {
    FULL_NAME_MIN: 2,
    FULL_NAME_MAX: 100,
    PHONE_MIN: 10,
    PHONE_MAX: 20,
    ADDRESS_MIN: 5,
    ADDRESS_MAX: 500,
    MAX_ADDRESSES: 10,
  },
  TAX_RATE: {
    RATE_MIN: 0,
    RATE_MAX: 100,
    PRIORITY_MIN: 0,
    PRIORITY_MAX: 100,
  },
  ORDER: {
    AMOUNT_MIN: 0,
    AMOUNT_MAX: 1000000,
  },
  ORDER_ITEM: {
    QUANTITY_MIN: 1,
    QUANTITY_MAX: 1000,
    PRICE_MIN: 0,
    PRICE_MAX: 1000000,
  },
  DISCOUNT: {
    VALUE_MIN: 0,
    VALUE_MAX: 1000000,
    Usage_LIMIT_MIN: 1,
    Usage_LIMIT_MAX: 1000000,
    Usage_COUNT_MIN: 0,
    Usage_COUNT_MAX: 1000000,
  },
} as const;
