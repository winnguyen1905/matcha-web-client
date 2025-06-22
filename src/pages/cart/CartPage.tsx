import React from 'react';

const CartPage: React.FC = () => {
  return (
    <div className="container mx-auto px-8 py-8 pt-24 relative">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Your cart is currently empty.</p>
      </div>
    </div>
  );
};

export default CartPage;
