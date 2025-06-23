import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { removeItem, updateQuantity, selectCartItems, selectCartTotal, selectCartItemCount } from '../../context/Cart';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

const CartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const itemCount = useAppSelector(selectCartItemCount);

  const handleQuantityChange = (productId: string, variationId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ productId, variationId, quantity: newQuantity }));
  };

  const handleRemoveItem = (productId: string, variationId: string) => {
    dispatch(removeItem({ productId, variationId }));
  };

  if (items.length === 0) {
    return (  
      <div className="container mx-auto px-8 py-8 pt-24 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold mb-2 dark:text-white">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Looks like you haven't added any products yet.</p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-32 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-600 dark:text-green-400">Your Cart</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            {items.map((item) => (
              <div key={`${item.product.$id}_${item.variation.$id}`} 
                   className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Product Image */}
                    <div className="w-full md:w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.imageUrls?.[0] ? (
                        <img
                          src={item.product.imageUrls[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold dark:text-white">{item.product.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {item.variation.name} • {item.variation.weight}g
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.product.$id, item.variation.$id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 -m-1"
                          aria-label="Remove item"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                          <button
                            onClick={() => handleQuantityChange(item.product.$id, item.variation.$id, item.quantity - 1)}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <FaMinus className="w-3 h-3" />
                          </button>
                          <span className="px-4 py-1 w-12 text-center dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.product.$id, item.variation.$id, item.quantity + 1)}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <FaPlus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        {/* Price */}
                        <div className="text-right">
                          <p className="text-lg font-semibold dark:text-white">
                            ${(item.price * item.quantity).toLocaleString()}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              ${item.price.toLocaleString()} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                <span className="font-medium dark:text-white">${total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Shipping</span>
                <span className="font-medium dark:text-white">Calculated at checkout</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              <div className="flex justify-between text-lg font-bold">
                <span className="dark:text-white">Total</span>
                <span className="dark:text-white">${total.toLocaleString()}</span>
              </div>
            </div>
            
            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              onClick={() => {}}
            >
              Proceed to Checkout
            </button>
            
            <div className="mt-4 text-center">
              <Link to="/products" className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
