import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaCheck, FaSpinner, FaCreditCard, FaTruck } from 'react-icons/fa';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectCartItems, selectCartTotal, selectCartItemCount, clearCart } from '../../hooks/Cart';
import { useDiscounts } from '../../hooks/Discount';
import type { DiscountCalculationResult } from '../../hooks/Discount';
import { useOrders } from '../../hooks/Order';
import { useSalesTax } from '../../hooks/useSalesTax';
import { useAuth } from '../../hooks/useAuth';
import {
  ShippingAddress,
  BillingAddress,
  PaymentMethod,
  Currency,
  OrderStatus,
  PaymentStatus,
  CreateOrder,
  CreateOrderItem,
} from '../../lib/schema';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { createOrder, loading: orderLoading } = useOrders();
  const { applyDiscountToOrder } = useDiscounts();
  
  // Cart data
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartTotal);
  const itemCount = useAppSelector(selectCartItemCount);

  // Form states
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Shipping form
  const [shippingInfo, setShippingInfo] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'US',
    postalCode: '',
  });

  // Billing form
  const [billingInfo, setBillingInfo] = useState<BillingAddress>({
    sameAsShipping: true,
    fullName: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
  });

  // Payment info
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCalculationResult | null>(null);

  // Validation states
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Tax calculation
  const { tax, loading: taxLoading } = useSalesTax({
    zip: shippingInfo.postalCode,
    state: shippingInfo.state,
    amount: appliedDiscount?.finalAmount || subtotal,
  });

  // Calculate totals
  const discountedTotal = appliedDiscount?.isValid ? appliedDiscount.finalAmount : subtotal;
  const shippingAmount = 15; // Fixed shipping for now
  const totalTax = tax || 0;
  const finalTotal = discountedTotal + shippingAmount + totalTax;

  // Build discount context
  const discountContext = useMemo(() => {
    const productIds = items.map(i => i.product.$id);
    const categoryIds = Array.from(new Set(items.map(i => i.product.category)));
    return {
      userId: user?.$id || 'guest',
      subtotal,
      orderItems: [],
      productIds,
      categoryIds,
    };
  }, [items, subtotal, user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  // Validation functions
  const validateShipping = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!shippingInfo.fullName.trim()) errors.fullName = 'Full name is required';
    if (!shippingInfo.phone.trim()) errors.phone = 'Phone number is required';
    if (!shippingInfo.address.trim()) errors.address = 'Address is required';
    if (!shippingInfo.city.trim()) errors.city = 'City is required';
    if (!shippingInfo.state.trim()) errors.state = 'State is required';
    if (!shippingInfo.postalCode.trim()) errors.postalCode = 'ZIP code is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateBilling = (): boolean => {
    if (billingInfo.sameAsShipping) return true;
    
    const errors: Record<string, string> = {};
    
    if (!billingInfo.fullName?.trim()) errors.billingFullName = 'Full name is required';
    if (!billingInfo.address?.trim()) errors.billingAddress = 'Address is required';
    if (!billingInfo.city?.trim()) errors.billingCity = 'City is required';
    if (!billingInfo.country?.trim()) errors.billingCountry = 'Country is required';
    if (!billingInfo.postalCode?.trim()) errors.billingPostalCode = 'ZIP code is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handlers
  const handleShippingChange = (field: keyof ShippingAddress, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBillingChange = (field: keyof BillingAddress, value: string | boolean) => {
    setBillingInfo(prev => ({ ...prev, [field]: value }));
    if (typeof value === 'string' && validationErrors[`billing${field.charAt(0).toUpperCase() + field.slice(1)}`]) {
      setValidationErrors(prev => ({ 
        ...prev, 
        [`billing${field.charAt(0).toUpperCase() + field.slice(1)}`]: '' 
      }));
    }
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    
    try {
      const result = await applyDiscountToOrder(discountCode.trim(), discountContext);
      if (result.isValid) {
        setAppliedDiscount(result);
        setError(null);
      } else {
        setError(result.errorMessage || 'Invalid discount code');
        setAppliedDiscount(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to apply discount');
      setAppliedDiscount(null);
    }
  };

  const handleNextStep = () => {
    if (step === 1 && validateShipping()) {
      setStep(2);
    } else if (step === 2 && validateBilling()) {
      setStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      setError('Please log in to place an order');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare order data
      const orderData: CreateOrder = {
        userId: user.$id,
        status: 'PENDING' as OrderStatus,
        subtotal,
        taxAmount: totalTax,
        discountTotal: appliedDiscount?.discountAmount || 0,
        shippingAmount,
        finalPrice: finalTotal,
        currency: 'USD' as Currency,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING' as PaymentStatus,
        shippingAddress: shippingInfo,
        billingAddress: billingInfo.sameAsShipping ? undefined : billingInfo,
        discountCode: appliedDiscount?.appliedDiscount?.code,
        createdAt: new Date().toISOString(),
      };

      // Prepare order items
      const orderItems: CreateOrderItem[] = items.map(item => ({
        orderId: '', // Will be set by the order creation
        productId: item.product.$id,
        productVariantId: item.variation.$id,
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.price * item.quantity,
        discountAmount: 0, // TODO: Calculate item-level discounts if needed
      }));

      // Create the order
      const order = await createOrder(orderData, orderItems);
      
      // Clear the cart
      dispatch(clearCart());
      
      // Navigate to success page
      navigate(`/order/success/${order.$id}`);
      
    } catch (err: any) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return <div>Redirecting...</div>;
  }

  return (  
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Checkout
            </h1>
            
            {/* Progress indicator */}
            <div className="flex justify-center items-center space-x-4 mb-6">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= s 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step > s ? <FaCheck className="w-4 h-4" /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`w-12 h-1 mx-2 ${
                      step > s ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-center space-x-8 text-sm">
              <span className={step >= 1 ? 'text-green-600 font-medium' : 'text-gray-500'}>
                Shipping
              </span>
              <span className={step >= 2 ? 'text-green-600 font-medium' : 'text-gray-500'}>
                Billing
              </span>
              <span className={step >= 3 ? 'text-green-600 font-medium' : 'text-gray-500'}>
                Payment
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-2/3">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Step 1: Shipping Information */}
                {step === 1 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6 dark:text-white flex items-center">
                      <FaTruck className="mr-2" />
                      Shipping Information
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.fullName}
                          onChange={(e) => handleShippingChange('fullName', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            validationErrors.fullName ? 'border-red-500' : ''
                          }`}
                          placeholder="Enter your full name"
                        />
                        {validationErrors.fullName && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.fullName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={shippingInfo.phone}
                          onChange={(e) => handleShippingChange('phone', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            validationErrors.phone ? 'border-red-500' : ''
                          }`}
                          placeholder="Enter your phone number"
                        />
                        {validationErrors.phone && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                          Address *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.address}
                          onChange={(e) => handleShippingChange('address', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            validationErrors.address ? 'border-red-500' : ''
                          }`}
                          placeholder="Enter your street address"
                        />
                        {validationErrors.address && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.address}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                          City *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.city}
                          onChange={(e) => handleShippingChange('city', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            validationErrors.city ? 'border-red-500' : ''
                          }`}
                          placeholder="Enter your city"
                        />
                        {validationErrors.city && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.city}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                          State *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.state}
                          onChange={(e) => handleShippingChange('state', e.target.value.toUpperCase())}
                          maxLength={2}
                          className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            validationErrors.state ? 'border-red-500' : ''
                          }`}
                          placeholder="NY"
                        />
                        {validationErrors.state && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.state}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.postalCode}
                          onChange={(e) => handleShippingChange('postalCode', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            validationErrors.postalCode ? 'border-red-500' : ''
                          }`}
                          placeholder="10001"
                        />
                        {validationErrors.postalCode && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.postalCode}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                          Country *
                        </label>
                        <select
                          value={shippingInfo.country}
                          onChange={(e) => handleShippingChange('country', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="GB">United Kingdom</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={handleNextStep}
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Continue to Billing
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Billing Information */}
                {step === 2 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6 dark:text-white">
                      Billing Information
                    </h2>

                    <div className="mb-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={billingInfo.sameAsShipping}
                          onChange={(e) => handleBillingChange('sameAsShipping', e.target.checked)}
                          className="w-4 h-4 text-green-600"
                        />
                        <span className="text-sm dark:text-gray-200">
                          Billing address is the same as shipping address
                        </span>
                      </label>
                    </div>

                    {!billingInfo.sameAsShipping && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={billingInfo.fullName || ''}
                            onChange={(e) => handleBillingChange('fullName', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                              validationErrors.billingFullName ? 'border-red-500' : ''
                            }`}
                            placeholder="Enter full name"
                          />
                          {validationErrors.billingFullName && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.billingFullName}</p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                            Address *
                          </label>
                          <input
                            type="text"
                            value={billingInfo.address || ''}
                            onChange={(e) => handleBillingChange('address', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                              validationErrors.billingAddress ? 'border-red-500' : ''
                            }`}
                            placeholder="Enter street address"
                          />
                          {validationErrors.billingAddress && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.billingAddress}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                            City *
                          </label>
                          <input
                            type="text"
                            value={billingInfo.city || ''}
                            onChange={(e) => handleBillingChange('city', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                              validationErrors.billingCity ? 'border-red-500' : ''
                            }`}
                            placeholder="Enter city"
                          />
                          {validationErrors.billingCity && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.billingCity}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                            Country *
                          </label>
                          <select
                            value={billingInfo.country || ''}
                            onChange={(e) => handleBillingChange('country', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                              validationErrors.billingCountry ? 'border-red-500' : ''
                            }`}
                          >
                            <option value="">Select Country</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="GB">United Kingdom</option>
                          </select>
                          {validationErrors.billingCountry && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.billingCountry}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                            ZIP Code *
                          </label>
                          <input
                            type="text"
                            value={billingInfo.postalCode || ''}
                            onChange={(e) => handleBillingChange('postalCode', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                              validationErrors.billingPostalCode ? 'border-red-500' : ''
                            }`}
                            placeholder="10001"
                          />
                          {validationErrors.billingPostalCode && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.billingPostalCode}</p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-6 flex justify-between">
                      <button
                        onClick={() => setStep(1)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Back to Shipping
                      </button>
                      <button
                        onClick={handleNextStep}
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment Method */}
                {step === 3 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6 dark:text-white flex items-center">
                      <FaCreditCard className="mr-2" />
                      Payment Method
                    </h2>

                    <div className="space-y-4 mb-6">
                      <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="COD"
                          checked={paymentMethod === 'COD'}
                          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                          className="w-4 h-4 text-green-600"
                        />
                        <div className="ml-3">
                          <div className="font-medium dark:text-white">Cash on Delivery</div>
                          <div className="text-sm text-gray-500">Pay when you receive your order</div>
                        </div>
                      </label>

                      <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 opacity-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="ONLINE"
                          disabled
                          className="w-4 h-4 text-green-600"
                        />
                        <div className="ml-3">
                          <div className="font-medium dark:text-white">Online Payment</div>
                          <div className="text-sm text-gray-500">Coming soon - Credit/Debit card, PayPal</div>
                        </div>
                      </label>
                    </div>

                    <div className="mt-6 flex justify-between">
                      <button
                        onClick={() => setStep(2)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Back to Billing
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={loading || orderLoading}
                        className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                      >
                        {(loading || orderLoading) ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            <span>Placing Order...</span>
                          </>
                        ) : (
                          <>
                            <FaLock />
                            <span>Place Order</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:w-1/3">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-24">
                <h3 className="text-lg font-semibold mb-4 dark:text-white">Order Summary</h3>
                
                {/* Items */}
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={`${item.product.$id}_${item.variation.$id}`} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <div className="font-medium dark:text-white">{item.product.name}</div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {item.variation.name} • {item.variation.weight}g × {item.quantity}
                        </div>
                      </div>
                      <div className="font-medium dark:text-white">
                        ${(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Discount input */}
                <div className="mb-4 pb-4 border-b dark:border-gray-700">
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                    Discount Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <button
                      onClick={handleApplyDiscount}
                      className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedDiscount && (
                    <div className="mt-2 text-sm text-green-600">
                      Discount applied: -{appliedDiscount.appliedDiscount?.code}
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="dark:text-gray-300">Subtotal ({itemCount} items)</span>
                    <span className="dark:text-white">${subtotal.toLocaleString()}</span>
                  </div>
                  
                  {appliedDiscount?.isValid && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${appliedDiscount.discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="dark:text-gray-300">Shipping</span>
                    <span className="dark:text-white">${shippingAmount}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="dark:text-gray-300">
                      {taxLoading ? 'Tax (calculating...)' : 'Tax'}
                    </span>
                    <span className="dark:text-white">
                      {taxLoading ? '—' : `$${totalTax.toLocaleString()}`}
                    </span>
                  </div>
                  
                  <div className="border-t dark:border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span className="dark:text-white">Total</span>
                      <span className="dark:text-white">${finalTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
