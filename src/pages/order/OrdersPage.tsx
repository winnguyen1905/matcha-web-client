// src/pages/OrdersPage.tsx
import React, { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { useOrders } from "../../hooks/Order";
import { Order } from "../../lib/schema";

import FilterBar from "./FilterBar"; // ➜ đường dẫn tuỳ cấu trúc dự án

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */
type StatusFilter =
  | "ALL"
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

type PaymentFilter = "ALL" | "COD" | "ONLINE";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const statusColorMap: Record<StatusFilter, string> = {
  ALL: "bg-gray-100 text-gray-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-teal-100 text-teal-800",
};

/* -------------------------------------------------------------------------- */
/*                                Main Page                                   */
/* -------------------------------------------------------------------------- */
const OrdersPage: React.FC = () => {
  /* ----------------------------- Auth / API ----------------------------- */
  const { user, isAuthenticated } = useAuth();
  const { getOrdersByUser, cancelOrder, loading: ordersLoading } = useOrders();

  /* ----------------------------- Local state ---------------------------- */
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);

  /* ------------------------------ Filters ------------------------------- */
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [discountSearch, setDiscountSearch] = useState("");

  /* ---------------------------------------------------------------------- */
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
    if (isAuthenticated) loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  /* ---------------------------------------------------------------------- */
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

  /* ----------------------------- Filtering ------------------------------ */
  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== "ALL" && o.status !== statusFilter) return false;
    if (paymentFilter !== "ALL" && o.paymentMethod !== paymentFilter) return false;
    if (startDate && new Date(o.createdAt) < new Date(startDate)) return false;
    if (endDate && new Date(o.createdAt) > new Date(endDate)) return false;
    if (
      discountSearch &&
      !(o.discountCode || "").toLowerCase().includes(discountSearch.toLowerCase())
    )
      return false;
    return true;
  });

  /* ------------------------------ Context ------------------------------- */
  useMemo(
    () => ({ orders, loading: ordersLoading, addOrder: () => {}, cancelOrder }),
    [orders, ordersLoading, cancelOrder]
  );

  /* ====================================================================== */
  /*                                 Render                                 */
  /* ====================================================================== */
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <section className="mx-auto max-w-7xl px-4 py-10">
        {/* Title */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-emerald-700 drop-shadow-sm mb-2">
            Your Orders
          </h1>
          <p className="text-lg text-gray-600">
            Track and manage all your orders in one place
          </p>
        </div>

        {/* Filter bar */}
        <FilterBar
          statusFilter={statusFilter}
          setStatusFilter={(v) => setStatusFilter(v as StatusFilter)}
          paymentFilter={paymentFilter}
          setPaymentFilter={(v) => setPaymentFilter(v as PaymentFilter)}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          discountSearch={discountSearch}
          setDiscountSearch={setDiscountSearch}
          onReset={() => {
            setStatusFilter("ALL");
            setPaymentFilter("ALL");
            setStartDate("");
            setEndDate("");
            setDiscountSearch("");
          }}
        />

        {/* ----------------------- Loading / empty state --------------------- */}
        {ordersLoading && (
          <div className="mt-12 flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
            <p className="text-lg font-medium text-gray-600">Loading orders...</p>
          </div>
        )}
        {!ordersLoading && orders.length === 0 && (
          <div className="mt-12 flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-gray-100 p-6 mb-4">
              <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders yet</h3>
            <p className="text-gray-600 max-w-md">
              You haven&apos;t placed any orders yet. Start shopping to see your orders here.
            </p>
          </div>
        )}

        {/* Show filtered results count when filters are active */}
        {!ordersLoading && orders.length > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {filteredOrders.length === orders.length 
                ? `Showing all ${orders.length} orders`
                : `Showing ${filteredOrders.length} of ${orders.length} orders`
              }
            </p>
          </div>
        )}

        {/* ---------------------------- Table ------------------------------- */}
        {!ordersLoading && filteredOrders.length > 0 && (
          <div className="mt-10 overflow-x-auto rounded-2xl shadow-2xl ring-1 ring-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-emerald-600/95 text-white">
                <tr>
                  <Th>Order</Th>
                  <Th className="hidden sm:table-cell">Date</Th>
                  <Th>Status</Th>
                  <Th alignRight>Subtotal</Th>
                  <Th alignRight className="hidden md:table-cell">
                    Tax
                  </Th>
                  <Th alignRight className="hidden md:table-cell">
                    Shipping
                  </Th>
                  <Th alignRight className="hidden lg:table-cell">
                    Discount
                  </Th>
                  <Th alignRight>Total</Th>
                  <Th className="text-center">Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredOrders.map((order, idx) => (
                  <tr
                    key={order.$id}
                    className={`${idx % 2 ? "bg-gray-50" : "bg-white"} hover:bg-emerald-50/50 transition-colors`}
                  >
                    {/* Order code */}
                    <Td>
                      <Link
                        to={`/orders/${order.$id}`}
                        className="font-medium text-emerald-700 hover:text-emerald-800 hover:underline transition-colors"
                      >
                        {order.orderCode}
                      </Link>
                    </Td>

                    {/* Date */}
                    <Td className="hidden sm:table-cell">
                      {format(new Date(order.createdAt), "PPpp")}
                    </Td>

                    {/* Status */}
                    <Td>
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${statusColorMap[
                          order.status as StatusFilter
                        ]}`}
                      >
                        {order.status}
                      </span>
                    </Td>

                    {/* Subtotal */}
                    <Td alignRight>
                      {currencyFormatter.format(order.subtotal)}
                    </Td>

                    {/* Tax */}
                    <Td alignRight className="hidden md:table-cell">
                      {currencyFormatter.format(order.taxAmount)}
                    </Td>

                    {/* Shipping */}
                    <Td alignRight className="hidden md:table-cell">
                      {currencyFormatter.format(order.shippingAmount)}
                    </Td>

                    {/* Discount */}
                    <Td alignRight className="hidden lg:table-cell">
                      {order.discountTotal
                        ? `- ${currencyFormatter.format(order.discountTotal)}`
                        : "-"}
                      {order.discountCode && (
                        <span className="ml-1 text-xs text-gray-500">
                          ({order.discountCode})
                        </span>
                      )}
                    </Td>

                    {/* Total */}
                    <Td alignRight>
                      <span className="font-semibold text-emerald-700">
                        {currencyFormatter.format(order.finalPrice)}
                      </span>
                    </Td>

                    {/* Actions */}
                    <Td className="text-center">
                      {["PENDING", "PROCESSING"].includes(order.status) ? (
                        <button
                          onClick={() => handleCancelOrder(order.$id)}
                          disabled={loadingOrderId === order.$id}
                          className="rounded-lg px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                        >
                          {loadingOrderId === order.$id
                            ? "Cancelling..."
                            : "Cancel"}
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* No results after filtering */}
        {!ordersLoading && orders.length > 0 && filteredOrders.length === 0 && (
          <div className="mt-12 flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-gray-100 p-6 mb-4">
              <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No matching orders</h3>
            <p className="text-gray-600 mb-4">
              No orders match your current filter criteria. Try adjusting your filters.
            </p>
          </div>
        )}
      </section>
    </main>
  );
};

/* -------------------------------------------------------------------------- */
/*                    Tiny helper table header / cell comps                   */
/* -------------------------------------------------------------------------- */
interface ThProps
  extends React.HTMLAttributes<HTMLTableCellElement> {
  alignRight?: boolean;
}
const Th: React.FC<ThProps> = ({
  children,
  className = "",
  alignRight,
}) => (
  <th
    className={`px-4 py-3 text-xs font-bold uppercase tracking-wider ${
      alignRight ? "text-right" : "text-left"
    } ${className}`}
  >
    {children}
  </th>
);

interface TdProps
  extends React.HTMLAttributes<HTMLTableCellElement> {
  alignRight?: boolean;
}
const Td: React.FC<TdProps> = ({
  children,
  className = "",
  alignRight,
}) => (
  <td
    className={`px-4 py-3 text-sm ${
      alignRight ? "text-right" : "text-left"
    } ${className}`}
  >
    {children}
  </td>
);

export default OrdersPage;
