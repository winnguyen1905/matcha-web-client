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
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
              <FaCheck className="text-2xl text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Thank you for your order. Order #{order.orderCode}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
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
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
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

          <div className="text-center mt-8 space-x-4">
            <Link
              to="/orders"
              className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              View All Orders
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
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
