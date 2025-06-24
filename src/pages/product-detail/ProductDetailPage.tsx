import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Coffee,
  Award,
  Shield,
  Package,
  Scale,
  Globe,
  Users,
  LeafyGreen,
  CheckCircle2,
  LeafyGreen as TeaLeaf,
  Thermometer,
  Clock3,
  PackageOpen,
  Calendar,
  RefreshCw,
  X,
  Info
} from 'lucide-react';
import { FEATURED_PRODUCTS } from '../../constants';
import ProductInfoPanel from './ProductInfoPanel';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, ProductFeatures, useProducts } from '../../hooks/Product';
import { addItem, prepareProductForCart } from '../../hooks/Cart';
import { useAppDispatch } from '../../app/hooks';
import { useNotification } from '../../context/NotificationContext';

const ProductDetailPage: React.FC = () => {
  // Get the optional `id` route param as a string
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const leafRefs = useRef<Array<SVGSVGElement | null>>([]);
  const detailsRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLDivElement>(null);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [showInfoPanel, setShowInfoPanel] = useState<boolean>(false);
  const { getProductById, loading, products: allProducts } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<ProductFeatures | null>(null);
  const [showVariantPanel, setShowVariantPanel] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const dispatch = useAppDispatch();

  const { showNotification } = useNotification();

  const handleAddToCart = (): void => {
    if (!selectedVariation || !product) {
      showNotification('Vui lòng chọn loại sản phẩm trước khi thêm vào giỏ hàng', 'warning');
      return;
    }

    try {
      // Prepare cart item using the utility function
      const cartItem = prepareProductForCart(product, selectedVariation, quantity);

      // Dispatch add to cart action
      dispatch(addItem({
        product: cartItem.product,
        variation: cartItem.variation,
        quantity: cartItem.quantity
      }));

      // Show success message
      showNotification(`Đã thêm ${quantity} [${selectedVariation.name}] vào giỏ hàng!`, 'success');

      // Reset quantity
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Có lỗi xảy ra khi thêm vào giỏ hàng. Vui lòng thử lại.', 'error');
    }
  };

  useEffect(() => {
    if (id) {
      getProductById(id).then(product => {
        if (product) {
          setProduct(product);
          // Set the first variation as selected by default if available
          if (product.features && product.features.length > 0) {
            setSelectedVariation(product.features[0]);
          }
        }
      });
    }
  }, [id]);

  useEffect(() => {
    if (product && allProducts && allProducts.length > 0) {
      // Exclude current product and pick up to 4 others
      const filtered = allProducts.filter(p => p.name !== product.name);
      setRelatedProducts(filtered.slice(0, 4));
    }
  }, [product, allProducts]);

  // Move conditional render below all hooks
  const getProductData = (): Product => ({
    ...product,
    $id: product?.$id || '', // Ensure $id is always a string
    name: product?.name || '',
    description: product?.description || '',
    oldPrice: product?.oldPrice ?? 0,
    newPrice: product?.newPrice ?? 0,
    category: product?.category || 'MATCHA',
    stock: product?.stock ?? 0,
    imageUrls: Array.isArray(product?.imageUrls) ? product.imageUrls : [],
    features: Array.isArray(product?.features) ? product.features : [],
    attributes: product?.attributes || {},
  });

  // Helper function to safely format dates
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString();
  };

  // Helper function to safely access feature properties
  const getFeatureProps = (feature: { title?: string; description?: string }) => ({
    title: feature?.title || '',
    description: feature?.description || ''
  });

  // Helper function to safely access array properties
  const safeArray = function <T>(arr: T[] | undefined): T[] {
    return arr || [];
  };

  // Get product data once to avoid multiple calls
  const productData = getProductData();

  // Create a product object with all required properties
  const productImages: string[] = Array.isArray(productData.imageUrls) ? productData.imageUrls ?? [] : [];

  // Use useMemo for variations with stable references
  const productVariation: ProductFeatures[] = useMemo(() => {
    return (productData.features || []).map(variant => ({
      ...variant,
      $id: variant.$id || `variant-${Math.random().toString(36).substr(2, 9)}`
    }));
  }, [productData.features]);

  // Fake certifications and description for demo/professional look
  const fakeCertifications = [
    'JAS Organic',
    'USDA Organic',
    'Non-GMO',
    'Rainforest Alliance',
    'ISO 22000'
  ];
  const fakeDescription =
    'Experience the finest ceremonial matcha, stone-ground from first flush spring leaves. Our matcha is certified organic, non-GMO, and produced using traditional methods to preserve its vibrant color, rich umami, and health benefits. Perfect for both traditional tea ceremonies and modern recipes.';

  // Only now, after all hooks, do the conditional render:
  if (loading || !product) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // Helper function to render list items with icons
  const renderListWithIcons = (items: string[] | undefined, icon: React.ReactNode, color: string = 'emerald') => {
    if (!items || items.length === 0) return null;

    return (
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-start">
            <span className={`text-${color}-500 mr-2 mt-0.5`}>
              {icon}
            </span>
            <span className="text-gray-700">{item}</span>
          </div>
        ))}
      </div>
    );
  };

  // Render product details sections
  const renderDetailSection = (title: string, icon: React.ReactNode, children: React.ReactNode) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center mb-4">
        <span className="text-emerald-600 mr-2">{icon}</span>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="text-gray-600">
        {children}
      </div>
    </div>
  );

  const handleQuantityChange = (value: number): void => {
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  return (
    <>
      <style>{`
        @keyframes floatLeaf0 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes floatLeaf1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        @keyframes floatLeaf2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(8deg); }
        }
        @keyframes matcha-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .matcha-gradient {
          background: linear-gradient(-45deg, #10b981, #34d399, #6ee7b7, #a7f3d0);
          background-size: 400% 400%;
          animation: matcha-gradient 8s ease infinite;
        }
        .nature-shadow {
          box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.25), 0 0 0 1px rgba(16, 185, 129, 0.05);
        }
        .leaf-pattern {
          background-image: radial-gradient(circle at 1px 1px, rgba(16, 185, 129, 0.1) 1px, transparent 0);
          background-size: 20px 20px;
        }
        .shimmer-effect {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        .hover-grow {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hover-grow:hover {
          transform: scale(1.05) translateY(-5px);
        }
        .tab-active {
          @apply text-emerald-600 border-b-2 border-emerald-500;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 leaf-pattern relative overflow-hidden pt-24">
        {/* Floating Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <Leaf
            ref={el => { if (el) leafRefs.current[0] = el; }}
            className="absolute top-20 left-10 text-green-300 opacity-30"
            size={40}
          />
          <Leaf
            ref={el => { if (el) leafRefs.current[1] = el; }}
            className="absolute top-40 right-20 text-emerald-300 opacity-20"
            size={60}
          />
          <Leaf
            ref={el => { if (el) leafRefs.current[2] = el; }}
            className="absolute bottom-40 left-20 text-teal-300 opacity-25"
            size={35}
          />
        </div>

        <div className="relative z-10 pt-12 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <div
              ref={heroRef}
              className="inline-flex items-center text-emerald-700 hover:text-emerald-900 mb-6 transition-all duration-300 hover:translate-x-1"
            >
              <ArrowLeft size={18} className="mr-2" />
              <span className="font-medium"><button onClick={() => navigate('/products')}>Back to Tea Garden</button></span>
            </div>

            {/* Product Header */}
            <div className="flex flex-col md:flex-row gap-8 mb-12">
              {/* Product Images */}
              <div ref={imageRef} className="md:w-1/2 flex-shrink-0 flex flex-col">
                <div className="relative h-96 lg:h-[500px] bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl overflow-hidden mb-6 group border-2 border-emerald-200/50 shadow-lg hover:border-emerald-300/70 transition-all duration-300">
                  <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={productImages[selectedImage]}
                      alt={getProductData().name}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                      style={{ maxHeight: '100%', maxWidth: '100%' }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                  <button
                    onClick={() => setSelectedImage(prev => (prev - 1 + productImages.length) % productImages.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 border border-emerald-100"
                  >
                    <ChevronLeft size={20} className="text-emerald-600" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => (prev + 1) % productImages.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 border border-emerald-100"
                  >
                    <ChevronRight size={20} className="text-emerald-600" />
                  </button>

                  {/* Image indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {productImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${selectedImage === idx
                          ? 'bg-white scale-125 ring-2 ring-emerald-300'
                          : 'bg-white/50 hover:bg-white/75'
                          }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${selectedImage === idx
                        ? 'border-emerald-500 shadow-lg ring-2 ring-emerald-200'
                        : 'border-emerald-100 hover:border-emerald-300'
                        }`}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <img
                          src={img}
                          alt={`${getProductData().name} ${idx + 1}`}
                          className="w-full h-full object-contain"
                          style={{ maxHeight: '100%', maxWidth: '100%' }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div ref={infoRef} className="md:w-1/2 flex-shrink-0 flex flex-col">
                <div className="sticky top-24 flex flex-col gap-8">
                  {/* Rating and Title */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text leading-tight">
                        {getProductData().name}
                      </h1>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-lg leading-relaxed">{getProductData().description || fakeDescription}</p>

                  {/* After the product title/description, add a Product Highlights section */}
                  {(Object.keys(getProductData().attributes ?? {}).length > 0) && (
                    <div className="my-6">
                      <h3 className="text-md font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                        <Star className="text-amber-400" size={18} />
                        Product Highlights
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(getProductData().attributes ?? {}).map(([key, value]) => (
                          <span
                            key={key}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm hover:bg-emerald-200 transition-colors duration-200"
                          >
                            <Star className="h-3 w-3 mr-1 text-amber-400" />
                            <span className="capitalize mr-1">{key.replace(/([A-Z])/g, ' $1')}</span>:
                            <span className="ml-1 font-medium">{value}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Benefits Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center p-3 bg-green-50 rounded-xl border border-green-100">
                      <Leaf className="text-green-600 mr-3" size={20} />
                      <span className="text-sm font-medium text-green-800">100% Organic</span>
                    </div>
                    <div className="flex items-center p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <Coffee className="text-emerald-600 mr-3" size={20} />
                      <span className="text-sm font-medium text-emerald-800">Stone Ground</span>
                    </div>
                    <div className="flex items-center p-3 bg-teal-50 rounded-xl border border-teal-100">
                      <Shield className="text-teal-600 mr-3" size={20} />
                      <span className="text-sm font-medium text-teal-800">Premium Grade</span>
                    </div>
                    <div className="flex items-center p-3 bg-green-50 rounded-xl border border-green-100">
                      <Award className="text-green-600 mr-3" size={20} />
                      <span className="text-sm font-medium text-green-800">Ceremonial</span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="matcha-gradient p-6 rounded-2xl text-white relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="font-bold text-white mb-4 text-lg flex items-center">
                        <Leaf className="mr-2" size={20} />
                        From Nature to Cup
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="opacity-90">• Origin: {getProductData().attributes?.['origin']}</p>
                          <p className="opacity-90">• Harvest: First flush spring leaves</p>
                          <p className="opacity-90">• Processing: Traditional stone mill</p>
                        </div>
                        <div>
                          <p className="opacity-90">• Net Weight: {getProductData().attributes?.['weight']}g</p>
                          <p className="opacity-90">• Best by: 18 months</p>
                          <p className="opacity-90">• Storage: {getProductData().attributes?.['storageInstructions']}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product variations */}
                  {productVariation.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-emerald-700 mb-1">Choose a Variation:</label>
                      <button
                        type="button"
                        className="w-full border-2 border-emerald-200 rounded-xl p-3 bg-white text-emerald-700 font-semibold shadow-sm hover:bg-emerald-50 transition-all duration-200 flex items-center justify-between"
                        onClick={() => setShowVariantPanel(true)}
                      >
                        {selectedVariation ? (
                          <span>{selectedVariation.name} {selectedVariation.weight ? `- ${selectedVariation.weight}g` : ''} {selectedVariation.price ? `- $${selectedVariation.price}` : ''}</span>
                        ) : (
                          <span>Select a variation</span>
                        )}
                        <svg className="h-5 w-5 text-emerald-400 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      {/* Floating Panel/Modal */}
                      {showVariantPanel && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 relative animate-fadeIn">
                            <button
                              className="absolute top-3 right-3 text-gray-400 hover:text-emerald-600"
                              onClick={() => setShowVariantPanel(false)}
                              aria-label="Close"
                            >
                              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                            <h3 className="text-lg font-bold text-emerald-700 mb-4">Select a Variation</h3>
                            <div className="space-y-3 max-h-80 overflow-y-auto">
                              {productVariation.map(variation => (
                                <button
                                  key={variation.name}
                                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex flex-col gap-1 ${selectedVariation?.name === variation.name ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-white hover:border-emerald-300'}`}
                                  onClick={() => {
                                    setSelectedVariation(variation);
                                    setShowVariantPanel(false);
                                  }}
                                >
                                  <span className="font-semibold text-gray-900">{variation.name}</span>
                                  <span className="text-sm text-gray-600">{variation.weight ? `${variation.weight}g` : ''} {variation.price ? `- $${variation.price}` : ''}</span>
                                  {variation.attributes?.description && (
                                    <span className="text-xs text-gray-500 mt-1">{variation.attributes.description}</span>
                                  )}
                                  {variation.inStock === false && (
                                    <span className="text-xs text-rose-500 font-medium mt-1">Out of stock</span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Price and Quantity */}
                  <div className="flex items-left justify-between">
                    <div className="text-left">
                      <p className="text-sm text-gray-600 mb-1">Premium Quality</p>
                      <span className="text-3xl font-bold text-emerald-600">
                        Contact Us
                      </span>
                    </div>

                    <div className="flex items-center bg-white border-2 border-emerald-200 rounded-full overflow-hidden shadow-md">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 transition-colors text-emerald-700 font-bold"
                      >
                        −
                      </button>
                      <span className="w-12 text-center font-semibold text-gray-800">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 transition-colors text-emerald-700 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end w-full">

                    <div className="flex-1 flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
                      <button
                        onClick={handleAddToCart}
                        disabled={!selectedVariation}
                        className={`flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 px-8 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-xl ${!selectedVariation ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <ShoppingCart size={22} />
                        {selectedVariation ? 'Thêm vào giỏ hàng' : 'Chọn loại sản phẩm'}
                      </button>
                      <button className="p-4 border-2 border-pink-200 rounded-2xl hover:border-pink-400 hover:bg-pink-50 transition-all duration-300 hover:scale-105 group flex items-center gap-2">
                        <Heart size={22} className="text-pink-600 group-hover:fill-current" />
                        <span className="font-semibold text-pink-700 group-hover:text-pink-900 transition-colors">Love</span>
                      </button>
                      <button
                        onClick={() => setShowInfoPanel(true)}
                        className="p-4 border-2 border-emerald-200 rounded-2xl hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-300 hover:scale-105 group flex items-center gap-2"
                      >
                        <Info size={22} className="text-emerald-600" />
                        <span className="font-semibold text-emerald-700 group-hover:text-emerald-900 transition-colors">View Detail</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details Tabs */}
            <div className="mt-12" ref={detailsRef}>
              <div className="border-b border-gray-200">
                {/* <nav className="-mb-px flex space-x-8">{product.variants && product.variants.length > 0 && (
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mt-10 mb-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-6">Available Variants</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {product.variants.map((variant) => (
                          <div key={variant.id} className="border rounded-lg p-5 hover:border-emerald-300 transition-all duration-200 hover:shadow-sm">
                            <div className="font-medium text-gray-900">{variant.name}</div>
                            <div className="mt-1 flex items-baseline">
                              <span className="text-emerald-600 font-semibold">${variant.price.toFixed(2)}</span>
                              {variant.salePrice && (
                                <span className="ml-2 text-sm text-gray-500 line-through">${variant.salePrice.toFixed(2)}</span>
                              )}
                            </div>
                            <div className="mt-3 space-y-2 text-sm text-gray-500">
                              {variant.weight && <div className="flex items-center">
                                <Scale className="h-4 w-4 mr-2 text-gray-400" />
                                <span>Weight: {variant.weight}g</span>
                              </div>}
                              {variant.packaging && <div className="flex items-center">
                                <Package className="h-4 w-4 mr-2 text-gray-400" />
                                <span>Packaging: {variant.packaging}</span>
                              </div>}
                              <div className={`flex items-center mt-3 text-sm ${variant.isAvailable ? 'text-emerald-600' : 'text-rose-600'}`}>
                                <div className={`h-2 w-2 rounded-full mr-2 ${variant.isAvailable ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                {variant.isAvailable ? 'In Stock' : 'Out of Stock'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <button className="tab-active py-4 px-1 border-b-2 font-medium text-sm">
                    Product Details
                  </button>
                </nav> */}
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Flavor Profile */}
                  {productVariation && productVariation.length > 0 && renderDetailSection(
                    'Flavor Profile',
                    <Coffee className="h-5 w-5" />,
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {productVariation.map((variation) => (
                          <span key={variation.name} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                            {variation.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ingredients */}
                  {/* renderDetailSection(
                    'Ingredients',
                    <LeafyGreen className="h-5 w-5" />,
                    renderListWithIcons(getProductData().ingredients, <CheckCircle2 className="h-4 w-4" />)
                  )} */}

                  {/* Health Benefits */}
                  {/* renderDetailSection(
                    'Health Benefits',
                    <Shield className="h-5 w-5" />,
                    renderListWithIcons(getProductData().healthBenefits, <CheckCircle2 className="h-4 w-4" />, 'green')
                  )} */}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Brewing Instructions */}
                  {/* ((getProductData().brewingInstructions?.traditional || getProductData().brewingInstructions?.modern || getProductData().brewingInstructions?.iced) && renderDetailSection(
                    'Brewing Instructions',
                    <TeaLeaf className="h-5 w-5" />,
                    <div className="space-y-4">
                      {getProductData().brewingInstructions?.traditional && (
                        <div className="flex items-center">
                          <p className="text-gray-700">Traditional Method</p>
                          <p className="text-gray-600">{getProductData().brewingInstructions.traditional}</p>
                        </div>
                      )}
                      {getProductData().brewingInstructions.modern && (
                        <div className="flex items-center">
                          <p className="text-gray-700">Modern Method</p>
                          <p className="text-gray-600">{getProductData().brewingInstructions.modern}</p>
                        </div>
                      )}
                      {getProductData().brewingInstructions.iced && (
                        <div className="flex items-center">
                          <p className="text-gray-700">Iced Method</p>
                          <p className="text-gray-600">{getProductData().brewingInstructions.iced}</p>
                        </div>
                      )}
                    </div>
                  ))} */}

                  {/* Packaging & Storage */}
                  {((getProductData().attributes?.['storageInstructions']) && renderDetailSection(
                    'Packaging & Storage',
                    <PackageOpen className="h-5 w-5" />,
                    <div className="space-y-3">
                      {getProductData().attributes?.['storageInstructions'] && (
                        <div className="flex items-start">
                          <RefreshCw className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Storage: {getProductData().attributes?.['storageInstructions']}</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Certifications */}
                  {fakeCertifications.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {fakeCertifications.map(cert => (
                        <span key={cert} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 shadow-sm">
                          <Award className="h-4 w-4 mr-1 text-amber-500" />
                          {cert}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Features */}
                {productVariation?.length > 0 && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Variations</h3>
                    <div className="space-y-4">
                      {productVariation.map((variation) => (
                        <div key={variation.name} className="border-l-4 border-emerald-500 pl-4 py-1">
                          <h4 className="font-medium text-gray-900">{variation.name}</h4>
                          <p className="text-sm text-gray-600">{variation.attributes?.description ?? ''}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Metadata */}
              <div className="mt-6 text-xs text-gray-500 flex flex-wrap gap-4">
                {getProductData().$createdAt && (
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Added on: {formatDate(getProductData().$createdAt)}</span>
                  </div>
                )}
                {getProductData().$updatedAt && getProductData().$updatedAt !== getProductData().$createdAt && (
                  <div className="flex items-center">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    <span>Updated: {formatDate(getProductData().$updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="mt-20">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-12 text-center">
                  You May Also Like
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {relatedProducts.map((item) => (
                    <div
                      key={item.name}
                      className="group hover-grow cursor-pointer"
                      onClick={() => navigate(`/product/${item.name}`)}
                    >
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden nature-shadow border border-green-100">
                        <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-100 overflow-hidden relative">
                          <img
                            src={item.imageUrls?.[0] || '/public/sounds/picture/placeholder-product.jpg'}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="p-5">
                          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors text-center">
                            {item.name}
                          </h3>
                          <p className="text-emerald-600 font-semibold text-center">Liên hệ</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Information Panel */}
      <ProductInfoPanel
        show={showInfoPanel}
        onClose={() => setShowInfoPanel(false)}
        getProductData={getProductData}
        flavorNotes={productVariation.map(v => v.name)}
      />
    </>
  );
};

export default ProductDetailPage;
