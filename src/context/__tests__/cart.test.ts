// import { configureStore } from '@reduxjs/toolkit';
// import cartReducer, { 
//   addItem, 
//   removeItem, 
//   updateQuantity, 
//   clearCart, 
//   prepareProductForCart
// } from '../Cart';
// import { Product, ProductFeatures } from '../Product';

// describe('cart slice', () => {
//   const mockProduct: Product = {
//     $id: 'product-1',
//     name: 'Matcha Tea',
//     description: 'High quality matcha',
//     oldPrice: 20,
//     newPrice: 15,
//     category: 'MATCHA',
//     stock: 100,
//     isFeatured: true,
//     isPublished: true,
//     imageUrls: ['image1.jpg'],
//     attributes: { origin: 'Japan' }
//   };

//   const mockVariation: ProductFeatures = {
//     id: 'var-1',
//     name: '100g Pack',
//     weight: 100,
//     dimensions: '10x10x5cm',
//     material: ['matcha'],
//     origin: 'Japan',
//     inStock: true,
//     price: 15,
//     attributes: { grade: 'ceremonial' }
//   };

//   let store: ReturnType<typeof configureStore>;

//   beforeEach(() => {
//     // Clear localStorage before each test
//     localStorage.clear();
    
//     store = configureStore({
//       reducer: {
//         cart: cartReducer
//       }
//     });
//   });

//   it('should handle initial state', () => {
//     expect(store.getState().cart).toEqual({
//       items: [],
//       total: 0,
//       itemCount: 0
//     });
//   });

//   it('should handle adding an item to cart', () => {
//     const { product, variation, quantity } = prepareProductForCart(mockProduct, mockVariation, 2);
//     store.dispatch(addItem({ product, variation, quantity }));

//     const state = store.getState().cart;
//     expect(state.items.length).toBe(1);
//     expect(state.items[0].product.id).toBe('product-1');
//     expect(state.items[0].variation.id).toBe('var-1');
//     expect(state.items[0].quantity).toBe(2);
//     expect(state.total).toBe(30);
//     expect(state.itemCount).toBe(2);
//   });

//   it('should update quantity when adding same item', () => {
//     const { product, variation } = prepareProductForCart(mockProduct, mockVariation);
//     store.dispatch(addItem({ product, variation, quantity: 1 }));
//     store.dispatch(addItem({ product, variation, quantity: 2 }));

//     const state = store.getState().cart;
//     expect(state.items.length).toBe(1);
//     expect(state.items[0].quantity).toBe(3);
//     expect(state.total).toBe(45);
//     expect(state.itemCount).toBe(3);
//   });

//   it('should handle removing an item', () => {
//     const { product, variation } = prepareProductForCart(mockProduct, mockVariation);
//     store.dispatch(addItem({ product, variation, quantity: 1 }));
    
//     // Add a second item
//     const product2: Product = { 
//       ...mockProduct, 
//       $id: 'product-2',
//       name: 'Matcha Tea 2',
//       imageUrls: ['image2.jpg']
//     };
//     const variation2: ProductFeatures = { 
//       ...mockVariation, 
//       id: 'var-2',
//       name: '200g Pack',
//       price: 25
//     };
//     const { product: cartProduct2, variation: cartVariation2 } = prepareProductForCart(product2, variation2);
    
//     store.dispatch(addItem({ 
//       product: cartProduct2,
//       variation: cartVariation2,
//       quantity: 1 
//     }));

//     // Remove the first item
//     store.dispatch(removeItem({ productId: 'product-1', variationId: 'var-1' }));
    
//     const state = store.getState().cart;
//     expect(state.items.length).toBe(1);
//     expect(state.items[0].product.id).toBe('product-2');
//     expect(state.total).toBe(25); // 1 * 25
//     expect(state.itemCount).toBe(1);
//   });

//   it('should handle updating item quantity', () => {
//     const { product, variation } = prepareProductForCart(mockProduct, mockVariation);
//     store.dispatch(addItem({ product, variation, quantity: 1 }));
    
//     store.dispatch(updateQuantity({ 
//       productId: 'product-1', 
//       variationId: 'var-1', 
//       quantity: 5 
//     }));
    
//     const state = store.getState().cart;
//     expect(state.items[0].quantity).toBe(5);
//     expect(state.total).toBe(75);
//     expect(state.itemCount).toBe(5);
//   });

//   it('should handle clearing the cart', () => {
//     const { product, variation } = prepareProductForCart(mockProduct, mockVariation);
//     store.dispatch(addItem({ product, variation, quantity: 2 }));
//     store.dispatch(clearCart());
    
//     const state = store.getState().cart;
//     expect(state.items.length).toBe(0);
//     expect(state.total).toBe(0);
//     expect(state.itemCount).toBe(0);
//   });

//   it('should persist cart in localStorage', () => {
//     const { product, variation } = prepareProductForCart(mockProduct, mockVariation);
//     store.dispatch(addItem({ product, variation, quantity: 1 }));
    
//     // Create a new store to simulate page reload
//     const newStore = configureStore({
//       reducer: {
//         cart: cartReducer
//       }
//     });
    
//     const state = newStore.getState().cart;
//     expect(state.items.length).toBe(1);
//     expect(state.items[0].product.id).toBe('product-1');
//     expect(state.total).toBe(15);
//     expect(state.itemCount).toBe(1);
//   });
// });
