import { createContext, useContext, useEffect, useState } from "react";
import { databases, storage } from "../lib/appwrite";
import { ID, Query } from "appwrite";

export const PRODUCTS_DATABASE_ID = "<YOUR_DATABASE_ID>"; // Replace with your database ID
export const PRODUCTS_COLLECTION_ID = "<YOUR_COLLECTION_ID>"; // Replace with your collection ID
export const PRODUCT_IMAGES_BUCKET_ID = "<YOUR_BUCKET_ID>"; // Replace with your bucket ID for product images

interface ProductFeatures {
  // Common product specifications
  weight?: string;
  dimensions?: string;
  material?: string[];
  origin?: string;
  // Add more specific features as needed
  [key: string]: any;
}

interface AppwriteDocument {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  [key: string]: any;
}

interface Product extends Omit<AppwriteDocument, 'features'> {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrls?: string[];
  stock: number;
  isFeatured?: boolean;
  features?: ProductFeatures;
}

// Helper function to parse features from Appwrite response
const parseProductFromResponse = (response: any): Product => {
  // Support both imageUrl (legacy) and imageUrls (new)
  let imageUrls: string[] | undefined = response.imageUrls;
  if (!imageUrls && response.imageUrl) {
    imageUrls = [response.imageUrl];
  }
  return {
    ...response,
    name: response.name || '',
    description: response.description || '',
    price: Number(response.price) || 0,
    category: response.category || '',
    stock: Number(response.stock) || 0,
    isFeatured: Boolean(response.isFeatured),
    features: response.features 
      ? (typeof response.features === 'string' 
          ? JSON.parse(response.features) 
          : response.features)
      : undefined,
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

  // Upload images to storage bucket
  const uploadImages = async (files: File[]): Promise<string[]> => {
    try {
      const urls: string[] = [];
      for (const file of files) {
        const response = await storage.createFile(
          PRODUCT_IMAGES_BUCKET_ID,
          ID.unique(),
          file
        );
        const fileUrl = storage.getFilePreview(
          PRODUCT_IMAGES_BUCKET_ID,
          response.$id
        );
        urls.push(fileUrl.toString());
      }
      return urls;
    } catch (err) {
      console.error("Error uploading images:", err);
      throw new Error("Failed to upload images");
    }
  };

  // Add a new product
  const addProduct = async (product: Omit<Product, '$id'>, imageFiles?: File[]) => {
    try {
      setLoading(true);
      setError(null);
      let imageUrls = product.imageUrls || [];
      // Upload new images if provided
      if (imageFiles && imageFiles.length > 0) {
        imageUrls = await uploadImages(imageFiles);
      }
      const newProduct = {
        ...product,
        imageUrls,
        price: Number(product.price), // Ensure price is a number
        stock: Number(product.stock)  // Ensure stock is a number
      };
      const response = await databases.createDocument(
        PRODUCTS_DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        ID.unique(),
        newProduct
      );
      const parsedProduct = parseProductFromResponse(response);
      setProducts(prevProducts => [parsedProduct, ...prevProducts]);
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Failed to add product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing product
  const updateProduct = async (id: string, updates: Partial<Product>, imageFiles?: File[]) => {
    try {
      setLoading(true);
      setError(null);
      const currentProduct = products.find(p => p.$id === id);
      if (!currentProduct) {
        throw new Error("Product not found");
      }
      let imageUrls = updates.imageUrls || currentProduct.imageUrls || [];
      // Upload new images if provided
      if (imageFiles && imageFiles.length > 0) {
        imageUrls = await uploadImages(imageFiles);
      }
      const updatedProduct = {
        ...updates,
        imageUrls,
        price: updates.price ? Number(updates.price) : currentProduct.price,
        stock: updates.stock ? Number(updates.stock) : currentProduct.stock
      };
      const response = await databases.updateDocument(
        PRODUCTS_DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        id,
        updatedProduct
      );
      const parsedProduct = parseProductFromResponse(response);
      setProducts(prevProducts => 
        prevProducts.map(p => p.$id === id ? parsedProduct : p)
      );
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to update product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a product
  const deleteProduct = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await databases.deleteDocument(
        PRODUCTS_DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        id
      );
      
      setProducts(prevProducts => prevProducts.filter(p => p.$id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get a single product by ID
  const getProductById = async (id: string): Promise<Product | null> => {
    try {
      const response = await databases.getDocument(
        PRODUCTS_DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        id
      );
      return parseProductFromResponse(response);
    } catch (err) {
      console.error("Error fetching product:", err);
      return null;
    }
  };

  // Get products by category
  const getProductsByCategory = async (category: string): Promise<Product[]> => {
    try {
      const response = await databases.listDocuments(
        PRODUCTS_DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        [Query.equal("category", [category])]
      );
      return response.documents.map(parseProductFromResponse);
    } catch (err) {
      console.error("Error fetching products by category:", err);
      return [];
    }
  };

  // Get featured products
  const getFeaturedProducts = async (): Promise<Product[]> => {
    try {
      const response = await databases.listDocuments(
        PRODUCTS_DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        [
          Query.equal("isFeatured", [true]),
          Query.limit(8) // Limit to 8 featured products
        ]
      );
      return response.documents.map(parseProductFromResponse);
    } catch (err) {
      console.error("Error fetching featured products:", err);
      return [];
    }
  };

  // Load all products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await databases.listDocuments(
          PRODUCTS_DATABASE_ID,
          PRODUCTS_COLLECTION_ID,
          [Query.orderDesc("$createdAt")]
        );
        setProducts(response.documents.map(parseProductFromResponse));
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
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
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}
