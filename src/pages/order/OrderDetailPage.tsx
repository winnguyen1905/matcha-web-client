import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaSpinner, FaRegCopy } from 'react-icons/fa';
import { format } from 'date-fns';
import { useOrders } from '../../hooks/Order';
import { useProducts, type ProductFeatures } from '../../hooks/Product';
import { useDiscounts } from '../../hooks/Discount';
import { Discount, Order, OrderItem } from '../../lib/schema';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById, getOrderItems } = useOrders();
  const { getProductById, getVariantInfo } = useProducts();
  const { getDiscountByCode } = useDiscounts();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<
    (OrderItem & { productName?: string; variantName?: string; variantInfo?: ProductFeatures | null })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [discountInfo, setDiscountInfo] = useState<Discount | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!orderId) {
        setError('Order ID not provided');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [o, its] = await Promise.all([
          getOrderById(orderId),
          getOrderItems(orderId),
        ]);
        if (!o) {
          setError('Order not found');
        } else {
          setOrder(o);
          if (o.discountCode) {
            const disc = await getDiscountByCode(o.discountCode);
            setDiscountInfo(disc);
          }
          // enrich items with product name
          const enriched = await Promise.all(
            its.map(async (it) => {
              const p = await getProductById(it.productId);
              let variantName: string | undefined = undefined;
              let variantInfo: ProductFeatures | null | undefined = undefined;
              if (it.productVariantId) {
                variantInfo = await getVariantInfo(it.productId, it.productVariantId);
                variantName = variantInfo?.name;
              }
              return { ...it, productName: p?.name, variantName, variantInfo };
            })
          );
          setItems(enriched);
        }
      } catch (e) {
        console.error(e);
        setError('Failed to load order');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [orderId]);

  const copyOrderCode = () => {
    navigator.clipboard.writeText(order?.orderCode ?? '').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  // helpers
  const parseAddress = (addr?: any) => {
    if (!addr) return null;
    if (typeof addr === 'string') {
      try {
        return JSON.parse(addr);
      } catch {
        return null;
      }
    }
    return addr;
  };

  const shippingAddress = parseAddress(order?.shippingAddress);
  const billingAddress = order?.billingAddress?.sameAsShipping ? shippingAddress : parseAddress(order?.billingAddress);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-green-600" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">{error ?? 'Order not found'}</h2>
          <Link to="/orders" className="text-green-600 underline">
            Back to orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 container mx-auto px-4">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight whitespace-normal break-all">
          Order <span className="text-green-700">#{order.orderCode}</span>
        </h1>
        <span className="text-xs sm:text-sm text-gray-500 select-all break-all">ID: {order.$id}</span>
        <button
          onClick={copyOrderCode}
          title="Copy order code"
          className="text-gray-500 hover:text-green-600 transition-colors"
        >
          <FaRegCopy />
        </button>
        {copied && <span className="text-sm text-green-600 animate-pulse">Copied!</span>}
      </div>

      <div className="bg-gradient-to-br from-white via-emerald-50/20 to-white rounded-3xl shadow-2xl p-8 mb-10 overflow-hidden ring-2 ring-emerald-200/50 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Items</h2>
        <div className="overflow-x-auto rounded-2xl">
          <table className="min-w-full table-auto">
            <thead className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left whitespace-nowrap font-bold">Product</th>
                <th className="px-6 py-4 text-left whitespace-nowrap font-bold">Variant</th>
                <th className="px-6 py-4 text-right whitespace-nowrap font-bold">Qty</th>
                <th className="px-6 py-4 text-right whitespace-nowrap font-bold">Unit Price</th>
                <th className="px-6 py-4 text-right whitespace-nowrap font-bold">Discount</th>
                <th className="px-6 py-4 text-right whitespace-nowrap font-bold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100/60 bg-white/60 backdrop-blur-sm">
              {items.map((item) => (
                <tr key={item.$id} className="hover:bg-emerald-50/50 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg border-l-4 border-l-transparent hover:border-l-emerald-400">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/products/${item.productId}`}
                      className="text-emerald-700 hover:text-emerald-900 hover:underline font-bold text-base transition-colors"
                    >
                      {item.productName || item.productId}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700">{item.variantName || '-'}</td>
                  <td className="px-6 py-4 text-right whitespace-nowrap font-bold text-gray-800">{item.quantity}</td>
                  <td className="px-6 py-4 text-right whitespace-nowrap font-semibold text-gray-700">{currency.format(item.unitPrice)}</td>
                  <td className="px-6 py-4 text-right whitespace-nowrap font-semibold text-red-600">{currency.format(item.discountAmount)}</td>
                  <td className="px-6 py-4 text-right whitespace-nowrap font-bold text-emerald-700 text-lg">{currency.format(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary card */}
      <div className="bg-gradient-to-br from-white via-emerald-50/30 to-white rounded-3xl shadow-2xl p-8 space-y-4 max-w-lg ring-2 ring-emerald-200/50 backdrop-blur-sm hover:shadow-3xl transition-all duration-300">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
        <div className="flex justify-between py-2">
          <span className="text-gray-600 font-medium">Subtotal</span>
          <span className="font-semibold text-gray-800">{currency.format(order.subtotal)}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-gray-600 font-medium">Tax</span>
          <span className="font-semibold text-gray-800">{currency.format(order.taxAmount)}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-gray-600 font-medium">Shipping</span>
          <span className="font-semibold text-gray-800">{currency.format(order.shippingAmount)}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-gray-600 font-medium">Discount</span>
          <span className="font-semibold text-red-600">-{currency.format(order.discountTotal)} {order.discountCode ? (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full ml-1">
              {order.discountCode}
            </span>
          ) : ''}</span>
        </div>
        <div className="flex justify-between font-bold pt-4 border-t-2 border-emerald-200/50 text-lg">
          <span className="text-gray-800">Total</span>
          <span className="text-emerald-700">{currency.format(order.finalPrice)}</span>
        </div>
      </div>

      {/* Order details & addresses */}
      <div className="grid lg:grid-cols-3 gap-8 mt-12">
        {/* Order meta */}
        <div className="bg-gradient-to-br from-white via-blue-50/20 to-white rounded-3xl shadow-2xl ring-2 ring-blue-200/50 backdrop-blur-sm p-8 space-y-4 hover:shadow-3xl transition-all duration-300">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Order Details</h3>
          <div className="text-sm flex justify-between"><span>Status</span><span className="font-medium">{order.status}</span></div>
          <div className="text-sm flex justify-between"><span>Payment</span><span className="font-medium capitalize">{order.paymentMethod.toLowerCase()}</span></div>
          <div className="text-sm flex justify-between"><span>Payment Status</span><span className="font-medium">{order.paymentStatus}</span></div>
          <div className="text-sm flex justify-between"><span>Created</span><span className="font-medium">{format(new Date(order.createdAt), 'PPpp')}</span></div>
          {discountInfo && (
            <div className="text-xs text-gray-600 mt-3">
              Discount: <span className="font-mono">{discountInfo.code}</span> — {discountInfo.description || discountInfo.discountType}
            </div>
          )}
          {order.notes && <div className="text-xs text-gray-600">Notes: {order.notes}</div>}
        </div>

        {/* Shipping address */}
        {shippingAddress && (
          <div className="bg-gradient-to-br from-white via-green-50/20 to-white rounded-3xl shadow-2xl ring-2 ring-green-200/50 backdrop-blur-sm p-8 space-y-2 hover:shadow-3xl transition-all duration-300">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Shipping Address</h3>
            <div className="text-sm">{shippingAddress.fullName}</div>
            <div className="text-sm">{shippingAddress.phone}</div>
            <div className="text-sm">{shippingAddress.address}</div>
            <div className="text-sm">{shippingAddress.city}, {shippingAddress.state}</div>
            <div className="text-sm">{shippingAddress.country} {shippingAddress.postalCode}</div>
          </div>
        )}

        {/* Billing address */}
        {billingAddress && (
          <div className="bg-gradient-to-br from-white via-purple-50/20 to-white rounded-3xl shadow-2xl ring-2 ring-purple-200/50 backdrop-blur-sm p-8 space-y-2 hover:shadow-3xl transition-all duration-300">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Billing Address</h3>
            {order.billingAddress?.sameAsShipping ? (
              <div className="text-sm text-gray-500">Same as shipping</div>
            ) : (
              <>
                <div className="text-sm">{billingAddress.fullName}</div>
                <div className="text-sm">{billingAddress.address}</div>
                <div className="text-sm">{billingAddress.city}, {billingAddress.state}</div>
                <div className="text-sm">{billingAddress.country} {billingAddress.postalCode}</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;
