import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { ID, Query } from "appwrite";
import { databases } from "../lib/appwrite";
import {
  TaxRate,
  CreateTaxRate,
  UpdateTaxRate,
  COLLECTIONS,
  VALIDATION_LIMITS,
} from "../lib/schema";

// Environment variables
export const TAX_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || "";

// Helper functions
const toNumber = (val: unknown): number => {
  if (val === null || val === undefined || val === "") return 0;
  const n = typeof val === "string" ? Number(val.replace(/[^0-9.+-]/g, "")) : Number(val);
  return Number.isNaN(n) ? 0 : n;
};

// Tax calculation context
export interface TaxCalculationContext {
  amount: number;
  shipping?: number;
  country: string;
  state?: string;
  zipCode?: string;
}

export interface TaxCalculationResult {
  taxAmount: number;
  applicableTaxes: TaxRate[];
  totalRate: number;
  breakdown: Array<{
    taxRate: TaxRate;
    amount: number;
  }>;
}

interface TaxContextType {
  taxRates: TaxRate[];
  loading: boolean;
  error: string | null;

  // CRUD Operations
  createTaxRate: (taxRate: CreateTaxRate) => Promise<TaxRate>;
  updateTaxRate: (id: string, updates: UpdateTaxRate) => Promise<TaxRate>;
  deleteTaxRate: (id: string) => Promise<void>;
  getTaxRateById: (id: string) => Promise<TaxRate | null>;

  // Tax Calculations
  calculateTax: (context: TaxCalculationContext) => Promise<TaxCalculationResult>;
  getApplicableTaxRates: (context: TaxCalculationContext) => Promise<TaxRate[]>;
  getTotalTaxRate: (context: TaxCalculationContext) => Promise<number>;

  // Queries
  getTaxRatesByCountry: (country: string) => Promise<TaxRate[]>;
  getTaxRatesByState: (country: string, state: string) => Promise<TaxRate[]>;
  getTaxRatesByZipCode: (zipCode: string) => Promise<TaxRate[]>;
  getActiveTaxRates: () => Promise<TaxRate[]>;
  getInactiveTaxRates: () => Promise<TaxRate[]>;

  // Management
  activateTaxRate: (id: string) => Promise<TaxRate>;
  deactivateTaxRate: (id: string) => Promise<TaxRate>;
  bulkActivateTaxRates: (ids: string[]) => Promise<void>;
  bulkDeactivateTaxRates: (ids: string[]) => Promise<void>;
  bulkDeleteTaxRates: (ids: string[]) => Promise<void>;

  // Validation
  validateTaxRateData: (taxRate: CreateTaxRate) => boolean;

  // Init
  init: () => Promise<void>;
  refreshTaxRates: () => Promise<void>;
}

const TaxContext = createContext<TaxContextType | undefined>(undefined);

export const useTax = () => {
  const context = useContext(TaxContext);
  if (!context) {
    throw new Error("useTax must be used within a TaxProvider");
  }
  return context;
};

export function TaxProvider({ children }: { children: React.ReactNode }) {
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validation function
  const validateTaxRateData = (taxRate: any): boolean => {
    if (!taxRate.name?.trim()) return false;
    
    const { RATE_MIN, RATE_MAX, PRIORITY_MIN, PRIORITY_MAX } = VALIDATION_LIMITS.TAX_RATE;
    
    const rate = toNumber(taxRate.rate);
    if (rate < RATE_MIN || rate > RATE_MAX) return false;
    
    const priority = toNumber(taxRate.priority);
    if (priority < PRIORITY_MIN || priority > PRIORITY_MAX) return false;

    return true;
  };

  // Initialize
  const init = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        TAX_DATABASE_ID,
        COLLECTIONS.TAX_RATES,
        [Query.orderDesc("priority"), Query.orderDesc("$createdAt")]
      );
      setTaxRates(response.documents as TaxRate[]);
    } catch (err) {
      console.error("Error initializing tax rates:", err);
      setError("Failed to load tax rates");
    } finally {
      setLoading(false);
    }
  };

  const refreshTaxRates = init;

  // CRUD Operations
  const createTaxRate = async (taxRateData: CreateTaxRate): Promise<TaxRate> => {
    try {
      setLoading(true);
      setError(null);

      if (!validateTaxRateData(taxRateData)) {
        throw new Error("Invalid tax rate data");
      }

      const taxRateId = ID.unique();
      const taxRate = {
        ...taxRateData,
        $id: taxRateId,
        rate: toNumber((taxRateData as any).rate),
        priority: toNumber((taxRateData as any).priority),
      };

      const createdTaxRate = await databases.createDocument(
        TAX_DATABASE_ID,
        COLLECTIONS.TAX_RATES,
        taxRateId,
        taxRate
      ) as TaxRate;

      setTaxRates(prev => [createdTaxRate, ...prev]);
      return createdTaxRate;
    } catch (err) {
      console.error("Error creating tax rate:", err);
      setError("Failed to create tax rate");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTaxRate = async (id: string, updates: UpdateTaxRate): Promise<TaxRate> => {
    try {
      setLoading(true);
      
      const updateData = {
        ...updates,
        rate: (updates as any).rate !== undefined ? toNumber((updates as any).rate) : undefined,
        priority: (updates as any).priority !== undefined ? toNumber((updates as any).priority) : undefined,
      };

      const updatedTaxRate = await databases.updateDocument(
        TAX_DATABASE_ID,
        COLLECTIONS.TAX_RATES,
        id,
        updateData
      ) as TaxRate;

      setTaxRates(prev => prev.map(rate => rate.$id === id ? updatedTaxRate : rate));
      return updatedTaxRate;
    } catch (err) {
      console.error("Error updating tax rate:", err);
      setError("Failed to update tax rate");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTaxRate = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      await databases.deleteDocument(TAX_DATABASE_ID, COLLECTIONS.TAX_RATES, id);
      setTaxRates(prev => prev.filter(rate => rate.$id !== id));
    } catch (err) {
      console.error("Error deleting tax rate:", err);
      setError("Failed to delete tax rate");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTaxRateById = async (id: string): Promise<TaxRate | null> => {
    try {
      const taxRate = await databases.getDocument(TAX_DATABASE_ID, COLLECTIONS.TAX_RATES, id) as TaxRate;
      return taxRate;
    } catch (err) {
      console.error("Error fetching tax rate:", err);
      return null;
    }
  };

  // Tax Calculations
  const getApplicableTaxRates = async (context: TaxCalculationContext): Promise<TaxRate[]> => {
    try {
      const queries = [Query.equal("isActive", [true])];
      
      // Add location-based filters
      if (context.country) {
        queries.push(Query.equal("country", [context.country]));
      }
      
      if (context.state) {
        queries.push(Query.equal("state", [context.state]));
      }
      
      if (context.zipCode) {
        queries.push(Query.equal("zipCode", [context.zipCode]));
      }

      const response = await databases.listDocuments(
        TAX_DATABASE_ID,
        COLLECTIONS.TAX_RATES,
        [...queries, Query.orderDesc("priority")]
      );

      return response.documents as TaxRate[];
    } catch (err) {
      console.error("Error fetching applicable tax rates:", err);
      return [];
    }
  };

  const calculateTax = async (context: TaxCalculationContext): Promise<TaxCalculationResult> => {
    try {
      const applicableTaxes = await getApplicableTaxRates(context);
      const breakdown: Array<{ taxRate: TaxRate; amount: number }> = [];
      let totalTaxAmount = 0;
      let totalRate = 0;

      const baseAmount = context.amount + (context.shipping || 0);

      for (const taxRate of applicableTaxes) {
        const taxableAmount = taxRate.appliesToShipping ? baseAmount : context.amount;
        const taxAmount = taxableAmount * (taxRate.rate / 100);
        
        breakdown.push({
          taxRate,
          amount: taxAmount
        });
        
        totalTaxAmount += taxAmount;
        totalRate += taxRate.rate;
      }

      return {
        taxAmount: totalTaxAmount,
        applicableTaxes,
        totalRate,
        breakdown
      };
    } catch (err) {
      console.error("Error calculating tax:", err);
      return {
        taxAmount: 0,
        applicableTaxes: [],
        totalRate: 0,
        breakdown: []
      };
    }
  };

  const getTotalTaxRate = async (context: TaxCalculationContext): Promise<number> => {
    const result = await calculateTax(context);
    return result.totalRate;
  };

  // Query functions
  const getTaxRatesByCountry = async (country: string): Promise<TaxRate[]> => {
    try {
      const response = await databases.listDocuments(
        TAX_DATABASE_ID,
        COLLECTIONS.TAX_RATES,
        [Query.equal("country", [country]), Query.orderDesc("priority")]
      );
      return response.documents as TaxRate[];
    } catch (err) {
      console.error("Error fetching tax rates by country:", err);
      return [];
    }
  };

  const getTaxRatesByState = async (country: string, state: string): Promise<TaxRate[]> => {
    try {
      const response = await databases.listDocuments(
        TAX_DATABASE_ID,
        COLLECTIONS.TAX_RATES,
        [
          Query.equal("country", [country]),
          Query.equal("state", [state]),
          Query.orderDesc("priority")
        ]
      );
      return response.documents as TaxRate[];
    } catch (err) {
      console.error("Error fetching tax rates by state:", err);
      return [];
    }
  };

  const getTaxRatesByZipCode = async (zipCode: string): Promise<TaxRate[]> => {
    try {
      const response = await databases.listDocuments(
        TAX_DATABASE_ID,
        COLLECTIONS.TAX_RATES,
        [Query.equal("zipCode", [zipCode]), Query.orderDesc("priority")]
      );
      return response.documents as TaxRate[];
    } catch (err) {
      console.error("Error fetching tax rates by zip code:", err);
      return [];
    }
  };

  const getActiveTaxRates = async (): Promise<TaxRate[]> => {
    try {
      const response = await databases.listDocuments(
        TAX_DATABASE_ID,
        COLLECTIONS.TAX_RATES,
        [Query.equal("isActive", [true]), Query.orderDesc("priority")]
      );
      return response.documents as TaxRate[];
    } catch (err) {
      console.error("Error fetching active tax rates:", err);
      return [];
    }
  };

  const getInactiveTaxRates = async (): Promise<TaxRate[]> => {
    try {
      const response = await databases.listDocuments(
        TAX_DATABASE_ID,
        COLLECTIONS.TAX_RATES,
        [Query.equal("isActive", [false]), Query.orderDesc("priority")]
      );
      return response.documents as TaxRate[];
    } catch (err) {
      console.error("Error fetching inactive tax rates:", err);
      return [];
    }
  };

  // Management functions
  const activateTaxRate = async (id: string): Promise<TaxRate> => {
    return updateTaxRate(id, { isActive: true });
  };

  const deactivateTaxRate = async (id: string): Promise<TaxRate> => {
    return updateTaxRate(id, { isActive: false });
  };

  const bulkActivateTaxRates = async (ids: string[]): Promise<void> => {
    try {
      await Promise.all(ids.map(id => activateTaxRate(id)));
    } catch (err) {
      console.error("Error bulk activating tax rates:", err);
      throw err;
    }
  };

  const bulkDeactivateTaxRates = async (ids: string[]): Promise<void> => {
    try {
      await Promise.all(ids.map(id => deactivateTaxRate(id)));
    } catch (err) {
      console.error("Error bulk deactivating tax rates:", err);
      throw err;
    }
  };

  const bulkDeleteTaxRates = async (ids: string[]): Promise<void> => {
    try {
      await Promise.all(ids.map(id => deleteTaxRate(id)));
    } catch (err) {
      console.error("Error bulk deleting tax rates:", err);
      throw err;
    }
  };

  useEffect(() => {
    init();
  }, []);

  const value: TaxContextType = useMemo(() => ({
    taxRates,
    loading,
    error,
    createTaxRate,
    updateTaxRate,
    deleteTaxRate,
    getTaxRateById,
    calculateTax,
    getApplicableTaxRates,
    getTotalTaxRate,
    getTaxRatesByCountry,
    getTaxRatesByState,
    getTaxRatesByZipCode,
    getActiveTaxRates,
    getInactiveTaxRates,
    activateTaxRate,
    deactivateTaxRate,
    bulkActivateTaxRates,
    bulkDeactivateTaxRates,
    bulkDeleteTaxRates,
    validateTaxRateData,
    init,
    refreshTaxRates,
  }), [taxRates, loading, error]);

  return <TaxContext.Provider value={value}>{children}</TaxContext.Provider>;
}

export default TaxProvider;
