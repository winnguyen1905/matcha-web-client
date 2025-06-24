import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import {
  selectCartItems,
  selectCartItemCount,
  selectCartTotal,
  updateQuantity,
  removeItem,
} from '../../hooks/Cart';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

import { useDiscounts } from '@/hooks/Discount';
import type { DiscountCalculationResult } from '@/hooks/Discount';
import { Discount } from '@/lib/schema';
import DiscountInfo from './DiscountInfo';




const CartPage: React.FC = () => {
  /* ------------------------------------------------------------------ */
  /*  Redux cart                                                        */
  /* ------------------------------------------------------------------ */
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartTotal); // before discount
  const itemCount = useAppSelector(selectCartItemCount);

  /* ------------------------------------------------------------------ */
  /*  Discount services                                                 */
  /* ------------------------------------------------------------------ */
  const {
    applyDiscountToOrder,
    userDiscounts,         // list of Discount docs assigned to user
    loading: discountLoading,
  } = useDiscounts();

  /* ------------------------------------------------------------------ */
  /*  Local state                                                       */
  /* ------------------------------------------------------------------ */
  const [discountInput, setDiscountInput] = useState('');
  const [applied, setApplied] = useState<DiscountCalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* ------------------------------------------------------------------ */
  /*  Helpers                                                           */
  /* ------------------------------------------------------------------ */
  const context = useMemo(() => {
    const productIds = items.map((i) => i.product.$id);
    const categoryIds = Array.from(new Set(items.map((i) => i.product.category)));
    return {
      userId: 'currentUserId',        // TODO: replace with auth user id
      subtotal,
      orderItems: [],                // not needed for calc right now
      productIds,
      categoryIds,
    };
  }, [items, subtotal]);

  const effectiveTotal = applied?.isValid ? applied.finalAmount : subtotal;

  /* ------------------------------------------------------------------ */
  /*  Discount actions                                                  */
  /* ------------------------------------------------------------------ */
  const handleApply = async () => {
    if (!discountInput.trim()) return;
    setError(null);

    try {
      const res = await applyDiscountToOrder(discountInput.trim(), context);
      if (!res.isValid) {
        setApplied(null);
        setError(res.errorMessage || 'Invalid discount');
      } else {
        setApplied(res);
      }
    } catch (e: any) {
      setApplied(null);
      setError(e.message || 'Failed to apply discount');
    }
  };

  const clearDiscount = () => {
    setApplied(null);
    setDiscountInput('');
    setError(null);
  };

  /* Re-validate if cart changes after a discount was applied ---------- */
  useEffect(() => {
    if (applied) {
      // silently re-run; if invalid now, clear
      (async () => {
        const res = await applyDiscountToOrder(applied.appliedDiscount!.code, context);
        if (!res.isValid) setApplied(null);
        else setApplied(res);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  /* ------------------------------------------------------------------ */
  /*  Cart empty view                                                   */
  /* ------------------------------------------------------------------ */
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-8 py-8 pt-24 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold mb-2 dark:text-white">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Looks like you haven't added any products yet.
          </p>
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

  /* ------------------------------------------------------------------ */
  /*  Main cart view                                                    */
  /* ------------------------------------------------------------------ */
  return (
    <div className="container mx-auto px-4 py-8 pt-32 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-600 dark:text-green-400">Your Cart</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* --------------------- Cart Items --------------------- */}
        <div className="lg:w-2/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            {items.map((item) => (
              <div
                key={`${item.product.$id}_${item.variation.$id}`}
                className="border-b border-gray-200 dark:border-gray-700 last:border-0"
              >
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
                          <h3 className="text-lg font-semibold dark:text-white">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {item.variation.name} • {item.variation.weight}g
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            dispatch(
                              removeItem({
                                productId: item.product.$id,
                                variationId: item.variation.$id,
                              }),
                            )
                          }
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
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  productId: item.product.$id,
                                  variationId: item.variation.$id,
                                  quantity: item.quantity - 1,
                                }),
                              )
                            }
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <FaMinus className="w-3 h-3" />
                          </button>
                          <span className="px-4 py-1 w-12 text-center dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  productId: item.product.$id,
                                  variationId: item.variation.$id,
                                  quantity: item.quantity + 1,
                                }),
                              )
                            }
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

        {/* ------------------- Order Summary ------------------- */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-24 space-y-6">
            <h2 className="text-xl font-semibold dark:text-white">Order Summary</h2>

            {/* ---------------- Apply Discount ---------------- */}
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                Discount code
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button
                  onClick={handleApply}
                  disabled={discountLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Apply
                </button>
              </div>

              {/* User’s own discounts  */}
              {userDiscounts.length > 0 && (
                <select
                  value=""
                  onChange={(e) => setDiscountInput(e.target.value)}
                  className="mt-2 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">— Choose your discount —</option>
                  {userDiscounts.map((d) => (
                    <option key={d.$id} value={d.code}>
                      {d.code} • {d.description || d.code}
                    </option>
                  ))}
                </select>
              )}

              {/* Error & clear */}
              {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
              {applied && (
                <button
                  onClick={clearDiscount}
                  className="mt-2 text-xs text-gray-500 hover:text-red-500 transition-colors underline"
                >
                  Remove "{applied.appliedDiscount?.code}"
                </button>
              )}
            </div>

            {/* ---------------- Price breakdown --------------- */}
            <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
              <Row label={`Subtotal (${itemCount} ${itemCount === 1 ? 'item' : 'items'})`}>
                ${subtotal.toLocaleString()}
              </Row>

              {applied?.isValid && (
                <DiscountInfo
                  discount={applied.appliedDiscount!}
                  saved={applied.discountAmount}
                  onRemove={clearDiscount}
                />
              )}



              {/* Shipping placeholder */}
              <Row label="Shipping">Calculated at checkout</Row>

              <div className="border-t border-gray-200 dark:border-gray-700" />

              <Row label="Total" bold>
                ${effectiveTotal.toLocaleString()}
              </Row>
            </div>

            {/* ---------------- Checkout button -------------- */}
            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-60"
              disabled={items.length === 0}
              onClick={() => { }}
            >
              Proceed to Checkout
            </button>

            <div className="text-center">
              <Link
                to="/products"
                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Small helper component for rows in the summary table */
const Row: React.FC<{
  label: string;
  children: React.ReactNode;
  bold?: boolean;
  negative?: boolean;
}> = ({ label, children, bold = false, negative = false }) => (
  <div className="flex justify-between">
    <span className={`text-gray-600 dark:text-gray-300 ${bold && 'font-semibold dark:text-white'}`}>
      {label}
    </span>
    <span
      className={`font-medium ${bold ? 'text-lg dark:text-white' : 'dark:text-white'
        } ${negative && 'text-red-600'}`}
    >
      {children}
    </span>
  </div>
);

export default CartPage;
