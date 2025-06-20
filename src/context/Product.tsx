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
  imageUrl?: string;
  stock: number;
  isFeatured?: boolean;
  features?: ProductFeatures;
}

// Helper function to parse features from Appwrite response
const parseProductFromResponse = (response: any): Product => {
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
      : undefined
  };
};

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, '$id'>, imageFile?: File) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>, imageFile?: File) => Promise<void>;
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

  // Upload image to storage bucket
  const uploadImage = async (file: File): Promise<string> => {
    try {
      const response = await storage.createFile(
        PRODUCT_IMAGES_BUCKET_ID,
        ID.unique(),
        file
      );
      
      // Get the file URL
      const fileUrl = storage.getFilePreview(
        PRODUCT_IMAGES_BUCKET_ID,
        response.$id
      );
      
      return fileUrl.toString();
    } catch (err) {
      console.error("Error uploading image:", err);
      throw new Error("Failed to upload image");
    }
  };

  // Add a new product
  const addProduct = async (product: Omit<Product, '$id'>, imageFile?: File) => {
    try {
      setLoading(true);
      setError(null);
      
      let imageUrl = product.imageUrl;
      
      // Upload new image if provided
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      
      const newProduct = {
        ...product,
        imageUrl,
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
  const updateProduct = async (id: string, updates: Partial<Product>, imageFile?: File) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentProduct = products.find(p => p.$id === id);
      if (!currentProduct) {
        throw new Error("Product not found");
      }
      
      let imageUrl = updates.imageUrl || currentProduct.imageUrl;
      
      // Upload new image if provided
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      
      const updatedProduct = {
        ...updates,
        imageUrl,
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
