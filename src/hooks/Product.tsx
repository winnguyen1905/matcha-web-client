import { createContext, useContext, useEffect, useState } from "react";
import { ID, Query } from "appwrite";
import { Client } from 'appwrite';
import { databases, storage } from "../lib/appwrite";

export const PRODUCTS_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || "";
export const PRODUCTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID || "products";
export const PRODUCT_IMAGES_BUCKET_ID = import.meta.env.VITE_APPWRITE_PRODUCT_BUCKET_ID || "product_images";
export const PRODUCT_API_KEY = import.meta.env.VITE_APPWRITE_API_KEY || "";

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '');

if (PRODUCT_API_KEY) {
  client.headers['X-Appwrite-Key'] = PRODUCT_API_KEY;
}

// This function should be called when your app starts to ensure the collection is set up
export const initializeProductsCollection = async () => {
  try {
    // In Appwrite, databases and collections are typically created through the Appwrite Console
    // or CLI. Here we'll just verify the collection exists and log its structure.
    console.log('Verifying products collection...');

    // Try to list documents to verify the collection exists
    try {
      await databases.listDocuments(PRODUCTS_DATABASE_ID, PRODUCTS_COLLECTION_ID);
      console.log('Products collection is accessible');
      return true;
    } catch (error) {
      console.error('Error accessing products collection. Please ensure it exists in your Appwrite project.');
      console.log('Required collection structure:');
      console.log(JSON.stringify({
        databaseId: PRODUCTS_DATABASE_ID,
        collectionId: PRODUCTS_COLLECTION_ID,
        name: 'Products',
        documentSecurity: true,
        attributes: [
          { key: 'name', type: 'string', size: 255, required: true },
          { key: 'description', type: 'string', size: 1000, required: true },
          { key: 'price', type: 'double', required: false },
          { key: 'category', type: 'string', size: 100, required: true },
          { key: 'imageUrls', type: 'string', required: false, array: true },
          { key: 'stock', type: 'integer', required: true },
          { key: 'isFeatured', type: 'boolean', required: false, default: false },
          { key: 'features', type: 'json', required: false }
        ]
      }, null, 2));

      throw new Error('Products collection is not properly set up. Please create it in the Appwrite Console with the above structure.');
    }
  } catch (error) {
    console.error('Error initializing products collection:', error);
    throw error;
  }
};

export type ProductCategory = 'MATCHA' | 'SWEET' | 'TOOL'

export interface ProductFeatures extends AppwriteDocument {
  id?: string;
  name: string;
  weight: number;
  dimensions: string;
  material: string[];
  origin: string;
  price: number;
  inStock: boolean;
  attributes?: Record<string, string>;
}

export interface Product extends Omit<AppwriteDocument, 'features'> {
  $id: string;
  name: string;
  description: string;
  oldPrice: number;
  newPrice: number;
  category: ProductCategory;
  imageUrls?: string[];
  stock: number;
  isFeatured?: boolean;
  isPublished?: boolean;
  features?: ProductFeatures[];
  attributes?: Record<string, string>;
}

// Base Appwrite document interface
export interface AppwriteDocument {
  $id?: string;
  $collectionId?: string;
  $databaseId?: string;
  $createdAt?: string;
  $updatedAt?: string;
  $permissions?: string[];
}

const parseProductFromResponse = (response: any): Product => {
  let imageUrls: string[] | undefined = response.imageUrls;
  if (!imageUrls && response.imageUrl) {
    imageUrls = [response.imageUrl];
  }

  // Helper to parse attributes to Record<string, string>
  function parseAttributes(attr: any): Record<string, string> {
    if (!attr) return {};
    if (typeof attr === 'string') {
      try {
        return JSON.parse(attr);
      } catch {
        return {};
      }
    }
    if (typeof attr === 'object') {
      return attr;
    }
    return {};
  }

  // Parse features and their attributes
  let features: ProductFeatures[] | undefined = undefined;
  if (response.features) {
    const rawFeatures = typeof response.features === 'string' ? JSON.parse(response.features) : response.features;
    if (Array.isArray(rawFeatures)) {
      features = rawFeatures.map((f: any) => ({
        ...f,
        attributes: parseAttributes(f.attributes)
      }));
    } else if (typeof rawFeatures === 'object') {
      features = [{
        ...rawFeatures,
        attributes: parseAttributes(rawFeatures.attributes)
      }];
    }
  }

  return {
    ...response,
    name: response.name || '',
    description: response.description || '',
    price: Number(response.price) || 0,
    category: response.category || '',
    stock: Number(response.stock) || 0,
    isFeatured: Boolean(response.isFeatured),
    features,
    attributes: parseAttributes(response.attributes),
    imageUrls,
  };
};

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, '$id'>, imageFiles?: File[]) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>, imageFiles?: File[]) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Promise<Product | null>;
  getProductsByCategory: (category: string) => Promise<Product[]>;
  getFeaturedProducts: () => Promise<Product[]>;
  init: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const init = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        PRODUCTS_DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        [Query.orderDesc("$createdAt")]
      );
      setProducts(response.documents.map(doc => parseProductFromResponse(doc)));
    } catch (err) {
      console.error("Error initializing products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    try {
      const urls: string[] = [];
      for (const file of files) {
        const response = await storage.createFile(
          PRODUCT_IMAGES_BUCKET_ID,
          ID.unique(),
          file
        );
        urls.push(`https://cloud.appwrite.io/v1/storage/buckets/${PRODUCT_IMAGES_BUCKET_ID}/files/${response.$id}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`);
      }
      return urls;
    } catch (err) {
      console.error("Error uploading images:", err);
      throw err;
    }
  };

  const validateProductData = (productData: Omit<Product, '$id'>): Omit<Product, '$id'> => {
    // Validate category
    const validCategories = ["SWEET", "MATCHA", "TOOL"];
    if (!validCategories.includes(productData.category)) {
      throw new Error('Invalid category. Must be one of: ' + validCategories.join(', '));
    }

    // Validate price
    const oldPrice = Number(productData.oldPrice);
    if (isNaN(oldPrice) || oldPrice < 0) {
      throw new Error('Old price must be a non-negative number');
    }

    const newPrice = Number(productData.newPrice);
    if (isNaN(newPrice) || newPrice < 0) {
      throw new Error('New price must be a non-negative number');
    }

    if (newPrice == oldPrice) {
      throw new Error('New price must be different from old price');
    }

    // Validate stock
    const stock = Number(productData.stock);
    if (isNaN(stock) || !Number.isInteger(stock) || stock < 0) {
      throw new Error('Stock must be a non-negative integer');
    }



    productData.features?.forEach((feature: ProductFeatures) => {
      // Validate features.price if it exists
      if (feature.price !== undefined) {
        const featuresPrice = Number(feature.price);
        if (isNaN(featuresPrice) || featuresPrice < 0) {
          throw new Error('Features price must be a non-negative number');
        }
        // Update the features object with the validated number
        feature.price = featuresPrice;
      }

      if (feature.weight !== undefined) {
        const featuresWeight = Number(feature.weight);
        if (isNaN(featuresWeight) || featuresWeight < 0) {
          throw new Error('Features weight must be a non-negative number');
        }
        // Update the features object with the validated number
        feature.weight = featuresWeight;
      }

    });

    return {
      ...productData,
      oldPrice,
      newPrice,
      stock
    };
  };

  const addProduct = async (product: Omit<Product, '$id'>, imageFiles: File[] = []) => {
    try {
      setLoading(true);

      // Validate product data
      const validatedData: Omit<Product, '$id'> = validateProductData(product);

      // Upload images if any
      const imageUrls = imageFiles.length > 0 ? await uploadImages(imageFiles) : [];

      // Process features to stringify any attributes
      const processedFeatures = validatedData.features?.map(feature => ({
        ...feature,
        attributes: feature.attributes ? JSON.stringify(feature.attributes) : undefined
      }));

      const productData = {
        ...validatedData,
        imageUrls,
        $id: ID.unique(),
        features: processedFeatures,
        attributes: validatedData.attributes ? JSON.stringify(validatedData.attributes) : undefined,
      };


      const response = await databases.createDocument(
        PRODUCTS_DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        productData.$id,
        productData
      );
      setProducts(prev => [parseProductFromResponse(response), ...prev]);
    } catch (err: any) {
      if (err.code !== 409) {
        console.error("Error adding product:", err);
        setError("Failed to add product");
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>, imageFiles: File[] = []) => {
    try {
      setLoading(true);

      // Create a copy of updates to avoid mutating the original
      const updatesToSend = { ...updates };

      // Validate number fields if they exist in updates
      if ('price' in updatesToSend) {
        const price = Number(updatesToSend.price);
        if (isNaN(price) || price < 0) {
          throw new Error('Price must be a non-negative number');
        }
        updatesToSend.price = price;
      }

      if ('stock' in updatesToSend) {
        const stock = Number(updatesToSend.stock);
        if (isNaN(stock) || !Number.isInteger(stock) || stock < 0) {
          throw new Error('Stock must be a non-negative integer');
        }
        updatesToSend.stock = stock;
      }

      // Validate category if it's being updated
      if ('category' in updatesToSend) {
        const validCategories = ["SWEET", "MATCHA", "TOOL"];
        if (!validCategories.includes(updatesToSend.category as string)) {
          throw new Error('Invalid category. Must be one of: ' + validCategories.join(', '));
        }
      }

      // Upload new images if any
      if (imageFiles.length > 0) {
        const imageUrls = await uploadImages(imageFiles);
        updatesToSend.imageUrls = [...(updates.imageUrls || []), ...imageUrls];
      }

      // if (updates.features) {
      //   updatesToSend.features = JSON.stringify(updates.features);
      // }

      const processedFeatures = updatesToSend.features?.map(updateToSend => ({
        ...updateToSend,
        attributes: updateToSend.attributes ? JSON.stringify(updateToSend.attributes) : undefined
      }));


      const response = await databases.updateDocument(
        PRODUCTS_DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        id,
        {
          ...updatesToSend,
          attributes: updatesToSend.attributes ? JSON.stringify(updatesToSend.attributes) : undefined,
          features: processedFeatures
        }
      );

      setProducts(prev =>
        prev.map(p => (p.$id === id ? parseProductFromResponse(response) : p))
      );
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to update product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setLoading(true);
      await databases.deleteDocument(
        PRODUCTS_DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        id
      );
      setProducts(prev => prev.filter(p => p.$id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id: string): Promise<Product | null> => {
    try {
      setLoading(true);
      const response = await databases.getDocument(
        PRODUCTS_DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        id
      );
      return parseProductFromResponse(response);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to fetch product");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCategory = async (category: string): Promise<Product[]> => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        PRODUCTS_DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        [Query.equal("category", [category])]
      );
      return response.documents.map(parseProductFromResponse);
    } catch (err) {
      console.error("Error fetching products by category:", err);
      setError("Failed to fetch products by category");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getFeaturedProducts = async (): Promise<Product[]> => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        PRODUCTS_DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        [Query.equal("isFeatured", [true])]
      );
      return response.documents.map(parseProductFromResponse);
    } catch (err) {
      console.error("Error fetching featured products:", err);
      setError("Failed to fetch featured products");
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const value = {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductsByCategory,
    getFeaturedProducts,
    init,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}
