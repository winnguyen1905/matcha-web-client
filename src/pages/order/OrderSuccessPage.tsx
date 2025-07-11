import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCheck, FaDownload, FaPrint, FaSpinner, FaTruck } from 'react-icons/fa';
import { useOrders } from '../../hooks/Order';
import { Order, OrderItem } from '../../lib/schema';

const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById, getOrderItems, loading } = useOrders();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('Order ID not found');
        setLoadingOrder(false);
        return;
      }

      try {
        setLoadingOrder(true);
        const [orderData, items] = await Promise.all([
          getOrderById(orderId),
          getOrderItems(orderId)
        ]);

        if (orderData) {
          setOrder(orderData);
          setOrderItems(items);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoadingOrder(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, getOrderById, getOrderItems]);

  if (loadingOrder || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error || 'Order Not Found'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn't find the order you're looking for.
          </p>
          <Link
            to="/orders"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 dark:bg-green-900 rounded-3xl mb-6 shadow-2xl ring-4 ring-green-200/50 backdrop-blur-sm hover:scale-110 transition-all duration-300">
              <FaCheck className="text-4xl text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Order Confirmed!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 font-medium">
              Thank you for your order. Order #{order.orderCode}
            </p>
          </div>

          <div className="bg-gradient-to-br from-white via-emerald-50/20 to-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 ring-2 ring-emerald-200/50 backdrop-blur-sm hover:shadow-3xl transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Order Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-white">${order.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                    <span className="text-gray-900 dark:text-white">${order.taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="text-gray-900 dark:text-white">${order.shippingAmount.toLocaleString()}</span>
                  </div>
                  <div className="border-t dark:border-gray-600 pt-2 mt-2">
                    <div className="flex justify-between font-medium">
                      <span className="text-gray-900 dark:text-white">Total</span>
                      <span className="text-gray-900 dark:text-white">${order.finalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Payment & Delivery
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
                    <span className="text-gray-900 dark:text-white">
                      {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Status</span>
                    <span className="text-yellow-600">{order.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 space-x-6">
            <Link
              to="/orders"
              className="inline-flex items-center px-8 py-4 border-2 border-emerald-300 text-emerald-700 font-bold rounded-2xl hover:bg-emerald-50 hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm ring-1 ring-emerald-200/50"
            >
              View All Orders
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-700 hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
