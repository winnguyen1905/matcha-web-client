import React from 'react';

const OrdersPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">You haven't placed any orders yet.</p>
      </div>
    </div>
  );
};

export default OrdersPage;
