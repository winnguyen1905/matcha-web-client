import React, { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { useOrders } from "../../hooks/Order";
import { Order } from "../../lib/schema";

type StatusFilter = "ALL" | "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
type PaymentFilter = "ALL" | "COD" | "ONLINE";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const OrdersPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const {
    getOrdersByUser,
    cancelOrder,
    loading: ordersLoading,
  } = useOrders();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);

  // filter states
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("ALL");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [discountSearch, setDiscountSearch] = useState<string>("");

  const loadOrders = async () => {
    if (!user) return;
    try {
      const res = await getOrdersByUser(user.$id);
      setOrders(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      setLoadingOrderId(orderId);
      await cancelOrder(orderId, "Cancelled by customer");
      await loadOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel order. Please try again later.");
    } finally {
      setLoadingOrderId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== "ALL" && o.status !== statusFilter) return false;
    if (paymentFilter !== "ALL" && o.paymentMethod !== paymentFilter) return false;
    if (startDate && new Date(o.createdAt) < new Date(startDate)) return false;
    if (endDate && new Date(o.createdAt) > new Date(endDate)) return false;
    if (discountSearch && !(o.discountCode || "").toLowerCase().includes(discountSearch.toLowerCase())) return false;
    return true;
  });

  const value = useMemo(
    () => ({ orders, loading: ordersLoading, addOrder: () => {}, cancelOrder }),
    [orders, ordersLoading, cancelOrder]
  );

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

      {ordersLoading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>You haven\'t placed any orders yet.</p>
      ) : (
        <>
          {/* Filters */}
          <div className="bg-gradient-to-r from-green-50 via-white to-green-50 shadow rounded-xl p-5 mb-8 grid gap-4 md:grid-cols-4 sm:grid-cols-2 ring-1 ring-green-100 hover:shadow-xl transition-shadow duration-300">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              >
                <option value="ALL">All</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment</label>
              <select
                className="w-full border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value as PaymentFilter)}
              >
                <option value="ALL">All</option>
                <option value="COD">COD</option>
                <option value="ONLINE">Online</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input
                type="date"
                className="w-full border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input
                type="date"
                className="w-full border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Code</label>
              <input
                type="text"
                placeholder="Search code..."
                className="w-full border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                value={discountSearch}
                onChange={(e) => setDiscountSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto bg-white shadow rounded-xl ring-1 ring-gray-100">
            <table className="min-w-full table-auto divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 whitespace-nowrap">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 whitespace-nowrap hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 whitespace-nowrap">Subtotal</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 whitespace-nowrap hidden md:table-cell">Tax</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 whitespace-nowrap hidden md:table-cell">Shipping</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 whitespace-nowrap hidden lg:table-cell">Discount</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 whitespace-nowrap">Total</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order: Order, idx) => (
                  <tr key={order.$id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100 transition-colors"}>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-blue-700 hover:text-blue-900">
                      <Link
                        to={`/orders/${order.$id}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {order.orderCode}
                      </Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                      {format(new Date(order.createdAt), "PPpp")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          order.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "PROCESSING"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "DELIVERED"
                            ? "bg-green-100 text-green-800"
                            : order.status === "CANCELLED"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {currencyFormatter.format(order.subtotal)}
                    </td>
                    <td className="px-2 py-3 text-right text-xs font-semibold tracking-wide text-gray-600 whitespace-nowrap hidden md:table-cell">
                      {currencyFormatter.format(order.taxAmount)}
                    </td>
                    <td className="px-2 py-3 text-right text-xs font-semibold tracking-wide text-gray-600 whitespace-nowrap hidden md:table-cell">
                      {currencyFormatter.format(order.shippingAmount)}
                    </td>
                    <td className="px-2 py-3 text-right text-xs font-semibold tracking-wide text-gray-600 whitespace-nowrap hidden lg:table-cell">
                      -{currencyFormatter.format(order.discountTotal || 0)}
                      {order.discountCode ? (
                        <span className="ml-1 text-xs text-gray-500">({order.discountCode})</span>
                      ) : null}
                    </td>
                    <td className="px-2 py-3 text-right text-xs font-semibold tracking-wide text-gray-600 whitespace-nowrap">
                      {currencyFormatter.format(order.finalPrice)}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      {order.status === "PENDING" || order.status === "PROCESSING" ? (
                        <button
                          onClick={() => handleCancelOrder(order.$id)}
                          disabled={loadingOrderId === order.$id}
                          className="text-red-600 hover:underline disabled:opacity-50 text-sm"
                        >
                          {loadingOrderId === order.$id ? "Cancelling..." : "Cancel"}
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersPage;
