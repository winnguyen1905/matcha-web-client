import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductFeatures } from './Product';

// Define a simplified product type for cart items
export type CartProduct = {
  $id: string;
  name: string;
  description: string;
  oldPrice: number;
  newPrice: number;
  category: string;
  imageUrls?: string[];
  stock: number;
  isFeatured?: boolean;
  isPublished?: boolean;
  attributes?: Record<string, string>;
};

// Define a simplified variation type for cart items
export type CartVariation = {
  $id: string;
  name: string;
  weight: number;
  dimensions: string;
  material: string[];
  origin: string;
  inStock: boolean;
  attributes?: Record<string, string>;
  price: number;
};

// Define types for our cart state
type RootState = {
  cart: CartState;
};

export interface CartItem {
  product: CartProduct;
  variation: CartVariation;
  quantity: number;
  price: number;
  // Computed property for unique identification
  key: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

const CART_STORAGE_KEY = 'matcha_cart';

const loadCartFromStorage = (): CartState => {
  if (typeof window === 'undefined') {
    return { items: [], total: 0, itemCount: 0 };
  }
  
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : { items: [], total: 0, itemCount: 0 };
  } catch (error) {
    console.error('Failed to load cart from localStorage', error);
    return { items: [], total: 0, itemCount: 0 };
  }
};

const saveCartToStorage = (state: CartState) => {
  try {
    if (typeof window !== 'undefined') {
      const { items } = state;
      const serializableState = {
        ...state,
        items: items.map(item => ({
          ...item,
          product: {
            ...item.product,
            $createdAt: undefined,
            $updatedAt: undefined,
            $permissions: undefined
          },
          variation: {
            ...item.variation,
            $createdAt: undefined,
            $updatedAt: undefined,
            $permissions: undefined
          }
        }))
      };
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(serializableState));
    }
  } catch (error) {
    console.error('Failed to save cart to localStorage', error);
  }
};

const calculateTotals = (items: CartItem[]) => {
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return { itemCount, total };
};

const initialState: CartState = (() => {
  const savedState = loadCartFromStorage();
  return {
    ...savedState,
    ...calculateTotals(savedState.items)
  };
})();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<{
      product: CartProduct;
      variation: CartVariation;
      quantity: number;
    }>) => {
      const { product, variation, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.product.$id === product.$id && 
               item.variation.$id === variation.$id
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item with computed key
        const key = getCartItemKey(product.$id, variation.$id);
        state.items.push({
          product,
          variation,
          quantity,
          price: variation.price,
          key
        });
      }

      // Update totals
      const { itemCount, total } = calculateTotals(state.items);
      state.itemCount = itemCount;
      state.total = total;

      saveCartToStorage(state);
    },
    
    removeItem: (state, action: PayloadAction<{ productId: string; variationId: string }>) => {
      const { productId, variationId } = action.payload;
      state.items = state.items.filter(
        item => !(item.product.$id === productId && item.variation.$id === variationId)
      );
      
      // Update totals
      const { itemCount, total } = calculateTotals(state.items);
      state.itemCount = itemCount;
      state.total = total;

      saveCartToStorage(state);
    },
    
    updateQuantity: (state, action: PayloadAction<{
      productId: string;
      variationId: string;
      quantity: number;
    }>) => {
      const { productId, variationId, quantity } = action.payload;
      const item = state.items.find(
        item => item.product.$id === productId && item.variation.$id === variationId
      );

      if (item && quantity > 0) {
        item.quantity = quantity;
        
        // Update totals
        const { itemCount, total } = calculateTotals(state.items);
        state.itemCount = itemCount;
        state.total = total;

        saveCartToStorage(state);
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.total = 0;
      saveCartToStorage(state);
    }
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) => state.cart.total;
export const selectCartItemCount = (state: RootState) => state.cart.itemCount;

// Utility function to safely convert product for cart
export const prepareProductForCart = (
  product: Product,
  variation: ProductFeatures,
  quantity: number = 1
): { product: CartProduct; variation: CartVariation; quantity: number } => {
  if (!product.$id) throw new Error('Product must have an id');
  if (!variation.$id) throw new Error('Variation must have an id');
  if (typeof variation.price !== 'number') throw new Error('Variation must have a price');
  
  // Create cart product with only the necessary fields
  const cartProduct: CartProduct = {
    $id: product.$id,
    name: product.name,
    description: product.description,
    oldPrice: product.oldPrice,
    newPrice: product.newPrice,
    category: product.category,
    imageUrls: product.imageUrls ? [...product.imageUrls] : undefined,
    stock: product.stock,
    isFeatured: product.isFeatured,
    isPublished: product.isPublished,
    attributes: product.attributes ? { ...product.attributes } : undefined
  };
  
  // Create cart variation with only the necessary fields
  const cartVariation: CartVariation = {
    $id: variation.$id,
    name: variation.name,
    weight: variation.weight,
    dimensions: variation.dimensions,
    material: [...variation.material],
    origin: variation.origin,
    inStock: variation.inStock,
    attributes: variation.attributes ? { ...variation.attributes } : undefined,
    price: variation.price
  };
  
  return {
    product: cartProduct,
    variation: cartVariation,
    quantity
  };
};

// Utility function to get cart item key for unique identification
export const getCartItemKey = (productId: string, variationId: string) => {
  return `${productId}_${variationId}`;
};
