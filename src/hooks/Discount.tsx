import { createContext, useContext, useEffect, useState } from "react";
import { ID, Query, type Models } from "appwrite";
import { databases } from "../lib/appwrite";
import {
  Discount,
  DiscountUsage,
  UserDiscount,
  Order,
  OrderItem,
  CreateDiscount,
  UpdateDiscount,
  CreateDiscountUsage,
  CreateUserDiscount,
  DiscountType,
  DiscountUsageStatus,
  COLLECTIONS,
  VALIDATION_LIMITS,
  isValidDiscountType,
  isValidDiscountUsageStatus,
  AppliesTo
} from "../lib/schema";

// Environment variables
export const DISCOUNTS_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || "";

// Discount calculation result interface
export interface DiscountCalculationResult {
  isValid: boolean;
  discountAmount: number;
  finalAmount: number;
  errorMessage?: string;
  appliedDiscount?: Discount;
}

// Discount validation result interface
export interface DiscountValidationResult {
  isValid: boolean;
  errorMessage?: string;
  discount?: Discount;
}

// Discount application context
export interface DiscountApplicationContext {
  userId: string;
  orderItems: OrderItem[];
  subtotal: number;
  productIds: string[];
  categoryIds?: string[];
}

// Discount statistics interface
export interface DiscountStatistics {
  totalDiscounts: number;
  activeDiscounts: number;
  expiredDiscounts: number;
  totalUsage: number;
  totalDiscountAmount: number;
  mostUsedDiscount?: Discount;
  topDiscountsByUsage: Array<{
    discount: Discount;
    usageCount: number;
    totalAmount: number;
  }>;
}

interface DiscountContextType {
  discounts: Discount[];
  discountUsages: DiscountUsage[];
  userDiscounts: UserDiscount[];
  loading: boolean;
  error: string | null;
  
  // Discount CRUD operations
  createDiscount: (discount: CreateDiscount) => Promise<Discount>;
  updateDiscount: (id: string, updates: UpdateDiscount) => Promise<Discount>;
  deleteDiscount: (id: string) => Promise<void>;
  getDiscountById: (id: string) => Promise<Discount | null>;
  getDiscountByCode: (code: string) => Promise<Discount | null>;
  
  // Discount validation and calculation
  validateDiscountCode: (code: string, context: DiscountApplicationContext) => Promise<DiscountValidationResult>;
  calculateDiscountAmount: (discount: Discount, subtotal: number, context: DiscountApplicationContext) => Promise<DiscountCalculationResult>;
  
  // Discount application
  applyDiscountToOrder: (discountCode: string, context: DiscountApplicationContext) => Promise<DiscountCalculationResult>;
  recordDiscountUsage: (discountId: string, userId: string, orderId: string, discountAmount: number, orderTotal: number) => Promise<DiscountUsage>;
  
  // User discount management
  assignDiscountToUser: (userId: string, discountId: string) => Promise<UserDiscount>;
  getUserDiscounts: (userId: string) => Promise<Discount[]>;
  removeUserDiscount: (userId: string, discountId: string) => Promise<void>;
  
  // Discount queries
  getActiveDiscounts: () => Promise<Discount[]>;
  getExpiredDiscounts: () => Promise<Discount[]>;
  getDiscountsByType: (type: DiscountType) => Promise<Discount[]>;
  getDiscountsByDateRange: (startDate: string, endDate: string) => Promise<Discount[]>;
  
  // Usage tracking
  getDiscountUsage: (discountId: string) => Promise<DiscountUsage[]>;
  getUserDiscountUsage: (userId: string) => Promise<DiscountUsage[]>;
  getDiscountUsageByOrder: (orderId: string) => Promise<DiscountUsage[]>;
  
  // Analytics and reporting
  getDiscountStatistics: () => Promise<DiscountStatistics>;
  getTopDiscountsByUsage: (limit?: number) => Promise<Array<{discount: Discount, usageCount: number}>>;
  getDiscountRevenueImpact: (discountId: string) => Promise<{totalRevenueLoss: number, orderCount: number}>;
  
  // Bulk operations
  bulkCreateDiscounts: (discounts: CreateDiscount[]) => Promise<Discount[]>;
  bulkUpdateDiscounts: (updates: Array<{id: string, data: UpdateDiscount}>) => Promise<Discount[]>;
  bulkDeactivateDiscounts: (discountIds: string[]) => Promise<void>;
  
  // Cleanup operations
  cleanupExpiredDiscounts: () => Promise<number>;
  cleanupFailedUsages: () => Promise<number>;
  
  // Initialization
  init: () => Promise<void>;
}

const DiscountContext = createContext<DiscountContextType | undefined>(undefined);

export function useDiscounts() {
  const context = useContext(DiscountContext);
  if (context === undefined) {
    throw new Error("useDiscounts must be used within a DiscountsProvider");
  }
  return context;
}

export function DiscountsProvider({ children }: { children: React.ReactNode }) {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [discountUsages, setDiscountUsages] = useState<DiscountUsage[]>([]);
  const [userDiscounts, setUserDiscounts] = useState<UserDiscount[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Validation helper functions
  const validateDiscountData = (discountData: CreateDiscount): void => {
    if (!discountData.code || discountData.code.trim() === '') {
      throw new Error('Discount code is required');
    }

    if (!isValidDiscountType(discountData.discountType)) {
      throw new Error('Invalid discount type');
    }

    if (discountData.value < VALIDATION_LIMITS.DISCOUNT.VALUE_MIN || 
        discountData.value > VALIDATION_LIMITS.DISCOUNT.VALUE_MAX) {
      throw new Error(`Discount value must be between ${VALIDATION_LIMITS.DISCOUNT.VALUE_MIN} and ${VALIDATION_LIMITS.DISCOUNT.VALUE_MAX}`);
    }

    if (discountData.discountType === 'PERCENTAGE' && discountData.value > 100) {
      throw new Error('Percentage discount cannot exceed 100%');
    }

    if (discountData.usageLimit && (
        discountData.usageLimit < VALIDATION_LIMITS.DISCOUNT.Usage_LIMIT_MIN ||
        discountData.usageLimit > VALIDATION_LIMITS.DISCOUNT.Usage_LIMIT_MAX
    )) {
      throw new Error(`Usage limit must be between ${VALIDATION_LIMITS.DISCOUNT.Usage_LIMIT_MIN} and ${VALIDATION_LIMITS.DISCOUNT.Usage_LIMIT_MAX}`);
    }

    const startDate = new Date(discountData.startDate);
    const endDate = new Date(discountData.endDate);
    
    if (startDate >= endDate) {
      throw new Error('End date must be after start date');
    }
  };

  // Initialize data
  const init = async () => {
    try {
      setLoading(true);
      
      // Load discounts
      const discountsResponse = await databases.listDocuments(
        DISCOUNTS_DATABASE_ID,
        COLLECTIONS.DISCOUNTS,
        [Query.orderDesc("$createdAt")]
      );
      setDiscounts(discountsResponse.documents as Discount[]);

      // Load discount usages
      const usagesResponse = await databases.listDocuments(
        DISCOUNTS_DATABASE_ID,
        COLLECTIONS.DISCOUNT_USAGE,
        [Query.orderDesc("$createdAt")]
      );
      setDiscountUsages(usagesResponse.documents as DiscountUsage[]);

      // Load user discounts
      const userDiscountsResponse = await databases.listDocuments(
        DISCOUNTS_DATABASE_ID,
        COLLECTIONS.USER_DISCOUNTS,
        [Query.orderDesc("$createdAt")]
      );
      setUserDiscounts(userDiscountsResponse.documents as UserDiscount[]);

    } catch (err) {
      console.error("Error initializing discounts:", err);
      setError("Failed to load discount data");
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations
  const createDiscount = async (discountData: CreateDiscount): Promise<Discount> => {
    try {
      setLoading(true);
      validateDiscountData(discountData);

      // Check if discount code already exists
      const existingDiscount = await getDiscountByCode(discountData.code);
      if (existingDiscount) {
        throw new Error('Discount code already exists');
      }

      const discount = {
        ...discountData,
        $id: ID.unique(),
        usageCount: 0,
        appliesTo: typeof discountData.appliesTo === 'string' 
          ? discountData.appliesTo 
          : JSON.stringify(discountData.appliesTo)
      };

      const response = await databases.createDocument(
        DISCOUNTS_DATABASE_ID,
        COLLECTIONS.DISCOUNTS,
        discount.$id,
        discount
      );

      const newDiscount = response as Discount;
      setDiscounts(prev => [newDiscount, ...prev]);
      return newDiscount;
    } catch (err: any) {
      console.error("Error creating discount:", err);
      setError("Failed to create discount");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDiscount = async (id: string, updates: UpdateDiscount): Promise<Discount> => {
    try {
      setLoading(true);

      const updateData = {
        ...updates,
        appliesTo: updates.appliesTo 
          ? (typeof updates.appliesTo === 'string' ? updates.appliesTo : JSON.stringify(updates.appliesTo))
          : undefined
      };

      const response = await databases.updateDocument(
        DISCOUNTS_DATABASE_ID,
        COLLECTIONS.DISCOUNTS,
        id,
        updateData
      );

      const updatedDiscount = response as Discount;
      setDiscounts(prev => prev.map(d => d.$id === id ? updatedDiscount : d));
      return updatedDiscount;
    } catch (err: any) {
      console.error("Error updating discount:", err);
      setError("Failed to update discount");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDiscount = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      await databases.deleteDocument(
        DISCOUNTS_DATABASE_ID,
        COLLECTIONS.DISCOUNTS,
        id
      );
      setDiscounts(prev => prev.filter(d => d.$id !== id));
    } catch (err: any) {
      console.error("Error deleting discount:", err);
      setError("Failed to delete discount");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getDiscountById = async (id: string): Promise<Discount | null> => {
    try {
      const response = await databases.getDocument(
        DISCOUNTS_DATABASE_ID,
        COLLECTIONS.DISCOUNTS,
        id
      );
      return response as Discount;
    } catch (err) {
      console.error("Error fetching discount:", err);
      return null;
    }
  };

  const getDiscountByCode = async (code: string): Promise<Discount | null> => {
    try {
      const response = await databases.listDocuments(
        DISCOUNTS_DATABASE_ID,
        COLLECTIONS.DISCOUNTS,
        [Query.equal("code", [code])]
      );
      return response.documents.length > 0 ? response.documents[0] as Discount : null;
    } catch (err) {
      console.error("Error fetching discount by code:", err);
      return null;
    }
  };

  // Discount validation and calculation
  const validateDiscountCode = async (
    code: string, 
    context: DiscountApplicationContext
  ): Promise<DiscountValidationResult> => {
    try {
      const discount = await getDiscountByCode(code);
      
      if (!discount) {
        return { isValid: false, errorMessage: "Discount code not found" };
      }

      if (!discount.isActive) {
        return { isValid: false, errorMessage: "Discount code is not active" };
      }

      const now = new Date();
      const startDate = new Date(discount.startDate);
      const endDate = new Date(discount.endDate);

      if (now < startDate) {
        return { isValid: false, errorMessage: "Discount code is not yet active" };
      }

      if (now > endDate) {
        return { isValid: false, errorMessage: "Discount code has expired" };
      }

      if (discount.usageLimit && discount.usageCount >= discount.usageLimit) {
        return { isValid: false, errorMessage: "Discount code usage limit reached" };
      }

      if (discount.minOrderAmount && context.subtotal < discount.minOrderAmount) {
        return { 
          isValid: false, 
          errorMessage: `Minimum order amount of $${discount.minOrderAmount} required` 
        };
      }

      // Check if discount applies to the products in the order
      const appliesTo: AppliesTo = typeof discount.appliesTo === 'string' 
        ? JSON.parse(discount.appliesTo) 
        : discount.appliesTo;

      if (!appliesTo.allProducts) {
        const hasApplicableProducts = appliesTo.productIds?.some(pid => 
          context.productIds.includes(pid)
        ) || appliesTo.categoryIds?.some(cid => 
          context.categoryIds?.includes(cid)
        );

        if (!hasApplicableProducts) {
          return { 
            isValid: false, 
            errorMessage: "Discount code does not apply to any products in your order" 
          };
        }
      }

      return { isValid: true, discount };
    } catch (err) {
      console.error("Error validating discount code:", err);
      return { isValid: false, errorMessage: "Error validating discount code" };
    }
  };

  const calculateDiscountAmount = async (
    discount: Discount,
    subtotal: number,
    context: DiscountApplicationContext
  ): Promise<DiscountCalculationResult> => {
    try {
      let discountAmount = 0;

      if (discount.discountType === 'PERCENTAGE') {
        discountAmount = (subtotal * discount.value) / 100;
        
        // Apply maximum discount amount limit if set
        if (discount.maxDiscountAmount && discountAmount > discount.maxDiscountAmount) {
          discountAmount = discount.maxDiscountAmount;
        }
      } else if (discount.discountType === 'FIXED') {
        discountAmount = Math.min(discount.value, subtotal);
      }

      const finalAmount = Math.max(0, subtotal - discountAmount);

      return {
        isValid: true,
        discountAmount,
        finalAmount,
        appliedDiscount: discount
      };
    } catch (err) {
      console.error("Error calculating discount amount:", err);
      return {
        isValid: false,
        discountAmount: 0,
        finalAmount: subtotal,
        errorMessage: "Error calculating discount amount"
      };
    }
  };

  const applyDiscountToOrder = async (
    discountCode: string,
    context: DiscountApplicationContext
  ): Promise<DiscountCalculationResult> => {
    try {
      const validation = await validateDiscountCode(discountCode, context);
      
      if (!validation.isValid || !validation.discount) {
        return {
          isValid: false,
          discountAmount: 0,
          finalAmount: context.subtotal,
          errorMessage: validation.errorMessage
        };
      }

      return await calculateDiscountAmount(validation.discount, context.subtotal, context);
    } catch (err) {
      console.error("Error applying discount to order:", err);
      return {
        isValid: false,
        discountAmount: 0,
        finalAmount: context.subtotal,
        errorMessage: "Error applying discount to order"
      };
    }
  };

  // Usage tracking
  const recordDiscountUsage = async (
    discountId: string,
    userId: string,
    orderId: string,
    discountAmount: number,
    orderTotal: number
  ): Promise<DiscountUsage> => {
    try {
      const usageData: CreateDiscountUsage = {
        discountId,
        userId,
        orderId,
        orderTotal,
        discountAmount,
        usedAt: new Date().toISOString(),
        usageStatus: 'COMPLETED'
      };

      const usage = {
        ...usageData,
        $id: ID.unique()
      };

      const response = await databases.createDocument(
        DISCOUNTS_DATABASE_ID,
        COLLECTIONS.DISCOUNT_USAGE,
        usage.$id,
        usage
      );

      // Update discount usage count
      const discount = await getDiscountById(discountId);
      if (discount) {
        await updateDiscount(discountId, {
          usageCount: discount.usageCount + 1
        });
      }

      const newUsage = response as DiscountUsage;
      setDiscountUsages(prev => [newUsage, ...prev]);
      return newUsage;
    } catch (err: any) {
      console.error("Error recording discount usage:", err);
      throw err;
    }
  };

  // User discount management
  const assignDiscountToUser = async (userId: string, discountId: string): Promise<UserDiscount> => {
    try {
      const userDiscountData: CreateUserDiscount = {
        userId,
        discountId,
        createdAt: new Date().toISOString()
      };

      const userDiscount = {
        ...userDiscountData,
        $id: ID.unique()
      };

      const response = await databases.createDocument(
        DISCOUNTS_DATABASE_ID,
        COLLECTIONS.USER_DISCOUNTS,
        userDiscount.$id,
        userDiscount
      );

      const newUserDiscount = response as UserDiscount;
      setUserDiscounts(prev => [newUserDiscount, ...prev]);
      return newUserDiscount;
    } catch (err: any) {
      console.error("Error assigning discount to user:", err);
      throw err;
    }
  };

  const getUserDiscounts = async (userId: string): Promise<Discount[]> => {
    try {
      type UserDiscountDoc = UserDiscount & Models.Document;
      const userDiscountsResponse = await databases.listDocuments<UserDiscountDoc>(
        DISCOUNTS_DATABASE_ID,
        COLLECTIONS.USER_DISCOUNTS,
        [Query.equal("userId", userId)]
      );

      const discountIds = userDiscountsResponse.documents.map(
        (ud) => ud.discountId
      );

      if (discountIds.length === 0) return [];

      const discountsResponse = await databases.listDocuments(
        DISCOUNTS_DATABASE_ID,
        COLLECTIONS.DISCOUNTS,
        [Query.equal("$id", discountIds)]
      );

      return discountsResponse.documents as Discount[];
    } catch (err) {
      console.error("Error fetching user discounts:", err);
      return [];
    }
  };

  const removeUserDiscount = async (userId: string, discountId: string): Promise<void> => {
    try {
      const userDiscountsResponse = await databases.listDocuments(
        DISCOUNTS_DATABASE_ID,
        COLLECTIONS.USER_DISCOUNTS,
        [
          Query.equal("userId", [userId]),
          Query.equal("discountId", [discountId])
        ]
      );

      for (const userDiscount of userDiscountsResponse.documents) {
        await databases.deleteDocument(
          DISCOUNTS_DATABASE_ID,
          COLLECTIONS.USER_DISCOUNTS,
          userDiscount.$id
        );
      }

      setUserDiscounts(prev => 
        prev.filter(ud => !(ud.userId === userId && ud.discountId === discountId))
      );
    } catch (err) {
      console.error("Error removing user discount:", err);
      throw err;
    }
  };

  // Query functions
  const getActiveDiscounts = async (): Promise<Discount[]> => {
    try {
      const now = new Date().toISOString();
      const response = await databases.listDocuments(
        DISCOUNTS_DATABASE_ID,
        COLLECTIONS.DISCOUNTS,
        [
          Query.equal("isActive", [true]),
          Query.lessThanEqual("startDate", [now]),
          Query.greaterThanEqual("endDate", [now])
        ]
      );
      return response.documents as Discount[];
    } catch (err) {
      console.error("Error fetching active discounts:", err);
      return [];
    }
  };

  const getExpiredDiscounts = async (): Promise<Discount[]> => {
    try {
      const now = new Date().toISOString();
      const response = await databases.listDocuments(
        DISCOUNTS_DATABASE_ID,
        COLLECTIONS.DISCOUNTS,
        [Query.lessThan("endDate", [now])]
      );
      return response.documents as Discount[];
    } catch (err) {
      console.error("Error fetching expired discounts:", err);
      return [];
    }
  };

  const getDiscountsByType = async (type: DiscountType): Promise<Discount[]> => {
    try {
      const response = await databases.listDocuments(
        DISCOUNTS_DATABASE_ID,
        COLLECTIONS.DISCOUNTS,
        [Query.equal("discountType", [type])]
      );
      return response.documents as Discount[];
    } catch (err) {
      console.error("Error fetching discounts by type:", err);
      return [];
    }
  };

  const getDiscountsByDateRange = async (startDate: string, endDate: string): Promise<Discount[]> => {
    try {
      const response = await databases.listDocuments(
        DISCOUNTS_DATABASE_ID,
        COLLECTIONS.DISCOUNTS,
        [
          Query.greaterThanEqual("startDate", [startDate]),
          Query.lessThanEqual("endDate", [endDate])
        ]
      );
      return response.documents as Discount[];
    } catch (err) {
      console.error("Error fetching discounts by date range:", err);
      return [];
    }
  };

  const getDiscountUsage = async (discountId: string): Promise<DiscountUsage[]> => {
    try {
      const response = await databases.listDocuments(
        DISCOUNTS_DATABASE_ID,
        COLLECTIONS.DISCOUNT_USAGE,
        [Query.equal("discountId", [discountId])]
      );
      return response.documents as DiscountUsage[];
    } catch (err) {
      console.error("Error fetching discount usage:", err);
      return [];
    }
  };

  const getUserDiscountUsage = async (userId: string): Promise<DiscountUsage[]> => {
    try {
      const response = await databases.listDocuments(
        DISCOUNTS_DATABASE_ID,
        COLLECTIONS.DISCOUNT_USAGE,
        [Query.equal("userId", [userId])]
      );
      return response.documents as DiscountUsage[];
    } catch (err) {
      console.error("Error fetching user discount usage:", err);
      return [];
    }
  };

  const getDiscountUsageByOrder = async (orderId: string): Promise<DiscountUsage[]> => {
    try {
      const response = await databases.listDocuments(
        DISCOUNTS_DATABASE_ID,
        COLLECTIONS.DISCOUNT_USAGE,
        [Query.equal("orderId", [orderId])]
      );
      return response.documents as DiscountUsage[];
    } catch (err) {
      console.error("Error fetching discount usage by order:", err);
      return [];
    }
  };

  // Analytics and reporting
  const getDiscountStatistics = async (): Promise<DiscountStatistics> => {
    try {
      const allDiscounts = await databases.listDocuments(
        DISCOUNTS_DATABASE_ID,
        COLLECTIONS.DISCOUNTS
      );
      
      const allUsages = await databases.listDocuments(
        DISCOUNTS_DATABASE_ID,
        COLLECTIONS.DISCOUNT_USAGE
      );

      const now = new Date();
      const activeDiscounts = allDiscounts.documents.filter(d => {
        const discount = d as Discount;
        return discount.isActive && 
               new Date(discount.startDate) <= now && 
               new Date(discount.endDate) >= now;
      });

      const expiredDiscounts = allDiscounts.documents.filter(d => {
        const discount = d as Discount;
        return new Date(discount.endDate) < now;
      });

      const totalDiscountAmount = allUsages.documents.reduce(
        (sum, usage) => sum + (usage as DiscountUsage).discountAmount, 0
      );

      // Find most used discount
      const usageByDiscount = allUsages.documents.reduce((acc, usage) => {
        const u = usage as DiscountUsage;
        acc[u.discountId] = (acc[u.discountId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const mostUsedDiscountId = Object.keys(usageByDiscount).reduce((a, b) => 
        usageByDiscount[a] > usageByDiscount[b] ? a : b, ''
      );

      const mostUsedDiscount = mostUsedDiscountId 
        ? allDiscounts.documents.find(d => d.$id === mostUsedDiscountId) as Discount
        : undefined;

      // Top discounts by usage
      const topDiscountsByUsage = Object.entries(usageByDiscount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([discountId, usageCount]) => {
          const discount = allDiscounts.documents.find(d => d.$id === discountId) as Discount;
          const totalAmount = allUsages.documents
            .filter(u => (u as DiscountUsage).discountId === discountId)
            .reduce((sum, u) => sum + (u as DiscountUsage).discountAmount, 0);
          
          return { discount, usageCount, totalAmount };
        });

      return {
        totalDiscounts: allDiscounts.documents.length,
        activeDiscounts: activeDiscounts.length,
        expiredDiscounts: expiredDiscounts.length,
        totalUsage: allUsages.documents.length,
        totalDiscountAmount,
        mostUsedDiscount,
        topDiscountsByUsage
      };
    } catch (err) {
      console.error("Error fetching discount statistics:", err);
      throw err;
    }
  };

  const getTopDiscountsByUsage = async (limit: number = 10): Promise<Array<{discount: Discount, usageCount: number}>> => {
    try {
      const usages = await databases.listDocuments(
        DISCOUNTS_DATABASE_ID,
        COLLECTIONS.DISCOUNT_USAGE
      );

      const usageByDiscount = usages.documents.reduce((acc, usage) => {
        const u = usage as DiscountUsage;
        acc[u.discountId] = (acc[u.discountId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const sortedDiscounts = Object.entries(usageByDiscount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, limit);

      const result = [];
      for (const [discountId, usageCount] of sortedDiscounts) {
        const discount = await getDiscountById(discountId);
        if (discount) {
          result.push({ discount, usageCount });
        }
      }

      return result;
    } catch (err) {
      console.error("Error fetching top discounts by usage:", err);
      return [];
    }
  };

  const getDiscountRevenueImpact = async (discountId: string): Promise<{totalRevenueLoss: number, orderCount: number}> => {
    try {
      const usages = await getDiscountUsage(discountId);
      const totalRevenueLoss = usages.reduce((sum, usage) => sum + usage.discountAmount, 0);
      const orderCount = usages.length;

      return { totalRevenueLoss, orderCount };
    } catch (err) {
      console.error("Error calculating discount revenue impact:", err);
      return { totalRevenueLoss: 0, orderCount: 0 };
    }
  };

  // Bulk operations
  const bulkCreateDiscounts = async (discounts: CreateDiscount[]): Promise<Discount[]> => {
    const results: Discount[] = [];
    
    for (const discountData of discounts) {
      try {
        const discount = await createDiscount(discountData);
        results.push(discount);
      } catch (err) {
        console.error(`Error creating discount ${discountData.code}:`, err);
      }
    }
    
    return results;
  };

  const bulkUpdateDiscounts = async (updates: Array<{id: string, data: UpdateDiscount}>): Promise<Discount[]> => {
    const results: Discount[] = [];
    
    for (const update of updates) {
      try {
        const discount = await updateDiscount(update.id, update.data);
        results.push(discount);
      } catch (err) {
        console.error(`Error updating discount ${update.id}:`, err);
      }
    }
    
    return results;
  };

  const bulkDeactivateDiscounts = async (discountIds: string[]): Promise<void> => {
    for (const id of discountIds) {
      try {
        await updateDiscount(id, { isActive: false });
      } catch (err) {
        console.error(`Error deactivating discount ${id}:`, err);
      }
    }
  };

  // Cleanup operations
  const cleanupExpiredDiscounts = async (): Promise<number> => {
    try {
      const expiredDiscounts = await getExpiredDiscounts();
      let cleanedCount = 0;

      for (const discount of expiredDiscounts) {
        if (discount.isActive) {
          await updateDiscount(discount.$id!, { isActive: false });
          cleanedCount++;
        }
      }

      return cleanedCount;
    } catch (err) {
      console.error("Error cleaning up expired discounts:", err);
      return 0;
    }
  };

  const cleanupFailedUsages = async (): Promise<number> => {
    try {
      const failedUsages = await databases.listDocuments(
        DISCOUNTS_DATABASE_ID,
        COLLECTIONS.DISCOUNT_USAGE, // Fixed collection name
        [
          Query.equal('usageStatus', 'FAILED'), // Using string literal instead of enum value
          Query.lessThan('$createdAt', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Older than 30 days
        ]
      );

      const deletePromises = failedUsages.documents.map(doc => 
        databases.deleteDocument(DISCOUNTS_DATABASE_ID, COLLECTIONS.DISCOUNT_USAGE, doc.$id)
      );

      await Promise.all(deletePromises);
      return failedUsages.total;
    } catch (error) {
      console.error('Error cleaning up failed discount usages:', error);
      throw error;
    }
  };

  // Return the context provider
  const value: DiscountContextType = {
    discounts,
    discountUsages,
    userDiscounts,
    loading,
    error,
    createDiscount,
    updateDiscount,
    deleteDiscount,
    getDiscountById,
    getDiscountByCode,
    validateDiscountCode,
    calculateDiscountAmount,
    applyDiscountToOrder,
    recordDiscountUsage,
    assignDiscountToUser,
    getUserDiscounts,
    removeUserDiscount,
    getActiveDiscounts,
    getExpiredDiscounts,
    getDiscountsByType,
    getDiscountsByDateRange,
    getDiscountUsage,
    getUserDiscountUsage,
    getDiscountUsageByOrder,
    getDiscountStatistics,
    getTopDiscountsByUsage,
    getDiscountRevenueImpact,
    bulkCreateDiscounts,
    bulkUpdateDiscounts,
    bulkDeactivateDiscounts,
    cleanupExpiredDiscounts,
    cleanupFailedUsages,
    init,
  };

  return (
    <DiscountContext.Provider value={value}>
      {children}
    </DiscountContext.Provider>
  );
}

export default DiscountsProvider;
