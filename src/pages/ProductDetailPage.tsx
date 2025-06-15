import React, { useState, useEffect, useRef } from 'react';
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
  RefreshCw
} from 'lucide-react';
import { Product, ProductVariant } from '../types/product-type';
import { FEATURED_PRODUCTS } from '../constants';

const ProductDetailPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const leafRefs = useRef<Array<SVGSVGElement | null>>([]);
  const detailsRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLDivElement>(null);

  // Get product data from constants
  const productData = FEATURED_PRODUCTS.products[0];
  // Create a product object with all required properties
  const product: Product = {
    ...productData,
    price: productData.variants?.[0]?.price || 0,
    caffeineLevel: (productData.caffeineLevel as 'None' | 'Low' | 'Medium' | 'High' | undefined) || 'Medium',
    // Use an empty array for features to avoid circular references
    features: [],
    stock: productData.variants?.[0]?.stock || 0
  };

  const productImages: string[] = product.gallery || [product.image];
  const relatedProducts = FEATURED_PRODUCTS.products.slice(1, 5).map(({ id, name, image, variants }: { id: number; name: string; image: string; variants: ProductVariant[] }) => ({
    id,
    name,
    image,
    price: variants?.[0]?.price || 0
  }));

  useEffect(() => {
    // Simulating GSAP animations with CSS transitions and transforms
    const animateOnLoad = () => {
      // Animate hero section
      const hero = heroRef.current;
      if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(50px)';
        setTimeout(() => {
          hero.style.transition = 'all 1s ease-out';
          hero.style.opacity = '1';
          hero.style.transform = 'translateY(0)';
        }, 100);
      }

      // Animate product image
      const image = imageRef.current;
      if (image) {
        image.style.opacity = '0';
        image.style.transform = 'scale(0.8)';
        setTimeout(() => {
          image.style.transition = 'all 0.8s ease-out';
          image.style.opacity = '1';
          image.style.transform = 'scale(1)';
        }, 300);
      }

      // Animate product info
      const info = infoRef.current;
      if (info) {
        info.style.opacity = '0';
        info.style.transform = 'translateX(50px)';
        setTimeout(() => {
          info.style.transition = 'all 0.8s ease-out';
          info.style.opacity = '1';
          info.style.transform = 'translateX(0)';
        }, 500);
      }

      // Animate floating leaves
      leafRefs.current.forEach((leaf, index) => {
        if (leaf) {
          leaf.style.animation = `floatLeaf${index} ${6 + index * 2}s ease-in-out infinite`;
        }
      });

      // Animate details section
      const details = detailsRef.current;
      if (details) {
        details.style.opacity = '0';
        details.style.transform = 'translateY(30px)';
        setTimeout(() => {
          details.style.transition = 'all 0.6s ease-out';
          details.style.opacity = '1';
          details.style.transform = 'translateY(0)';
        }, 800);
      }

      // Animate related products
      const related = relatedRef.current;
      if (related) {
        const items = related.children;
        Array.from(items).forEach((item, index: number) => {
          if (item instanceof HTMLElement) {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            setTimeout(() => {
              item.style.transition = 'all 0.5s ease-out';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 1000 + index * 150);
          }
        });
      }
    };

    animateOnLoad();
  }, []);

  const handleQuantityChange = (value: number): void => {
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

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

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 leaf-pattern relative overflow-hidden">
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
              <span className="font-medium">Back to Tea Garden</span>
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
                      alt={product.name}
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
                          alt={`${product.name} ${idx + 1}`}
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
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={20} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} className="drop-shadow-sm" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">({product.reviews} reviews)</span>
                      {product.badge && (
                        <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-medium">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text leading-tight">
                      {product.name}
                    </h1>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>

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
                          <p className="opacity-90">• Origin: {product.origin}</p>
                          <p className="opacity-90">• Harvest: First flush spring leaves</p>
                          <p className="opacity-90">• Processing: Traditional stone mill</p>
                        </div>
                        <div>
                          <p className="opacity-90">• Net Weight: {product.weight}g</p>
                          <p className="opacity-90">• Best by: 18 months</p>
                          <p className="opacity-90">• Storage: {product.storageInstructions}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price and Quantity */}
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Premium Quality</p>
                      <span className="text-3xl font-bold text-emerald-600">
                        Liên hệ
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
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 px-8 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                      <ShoppingCart size={22} />
                      Thêm vào giỏ hàng
                    </button>
                    <button className="p-4 border-2 border-emerald-200 rounded-2xl hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-300 hover:scale-105 group">
                      <Heart size={22} className="text-emerald-600 group-hover:fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details Tabs */}
            <div className="mt-12" ref={detailsRef}>
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button className="tab-active py-4 px-1 border-b-2 font-medium text-sm">
                    Product Details
                  </button>
                </nav>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Flavor Profile */}
                  {product.flavorNotes && product.flavorNotes.length > 0 && renderDetailSection(
                    'Flavor Profile',
                    <Coffee className="h-5 w-5" />,
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {product.flavorNotes.map((note, index) => (
                          <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ingredients */}
                  {renderDetailSection(
                    'Ingredients',
                    <LeafyGreen className="h-5 w-5" />,
                    renderListWithIcons(product.ingredients, <CheckCircle2 className="h-4 w-4" />)
                  )}

                  {/* Health Benefits */}
                  {renderDetailSection(
                    'Health Benefits',
                    <Shield className="h-5 w-5" />,
                    renderListWithIcons(product.healthBenefits, <CheckCircle2 className="h-4 w-4" />, 'green')
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Brewing Instructions */}
                  {(product.brewingTemperature || product.brewingTime) && renderDetailSection(
                    'Brewing Instructions',
                    <TeaLeaf className="h-5 w-5" />,
                    <div className="space-y-4">
                      {product.brewingTemperature && (
                        <div className="flex items-center">
                          <Thermometer className="h-5 w-5 text-emerald-500 mr-2" />
                          <span className="text-gray-700">Temperature: {product.brewingTemperature}</span>
                        </div>
                      )}
                      {product.brewingTime && (
                        <div className="flex items-center">
                          <Clock3 className="h-5 w-5 text-emerald-500 mr-2" />
                          <span className="text-gray-700">Brewing Time: {product.brewingTime}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Packaging & Storage */}
                  {(product.packaging || product.storageInstructions) && renderDetailSection(
                    'Packaging & Storage',
                    <PackageOpen className="h-5 w-5" />,
                    <div className="space-y-3">
                      {product.packaging && (
                        <div className="flex items-start">
                          <Package className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Packaging: {product.packaging}</span>
                        </div>
                      )}
                      {product.storageInstructions && (
                        <div className="flex items-start">
                          <RefreshCw className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Storage: {product.storageInstructions}</span>
                        </div>
                      )}
                      {product.servingsPerPackage && (
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-emerald-500 mr-2" />
                          <span className="text-gray-700">Servings: {product.servingsPerPackage} per package</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Certifications */}
                  {product.certifications && product.certifications.length > 0 && renderDetailSection(
                    'Certifications',
                    <Award className="h-5 w-5" />,
                    <div className="flex flex-wrap gap-2">
                      {product.certifications.map((cert, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          {cert}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Variants */}


                {/* Product Features */}
                {product.features && product.features.length > 0 && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Featured Collections</h3>
                    <div className="space-y-4">
                      {product.features.map((feature, index) => (
                        <div key={index} className="border-l-4 border-emerald-500 pl-4 py-1">
                          <h4 className="font-medium text-gray-900">{feature.title}</h4>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Metadata */}
              <div className="mt-6 text-xs text-gray-500 flex flex-wrap gap-4">
                {product.createdAt && (
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Added on: {new Date(product.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
                {product.updatedAt && product.updatedAt !== product.createdAt && (
                  <div className="flex items-center">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    <span>Updated: {new Date(product.updatedAt).toLocaleDateString()}</span>
                  </div>
                )}
                {product.isLimitedEdition && (
                  <div className="flex items-center">
                    <Award className="h-3 w-3 mr-1" />
                    <span>Limited Edition</span>
                  </div>
                )}
                {product.isSubscriptionAvailable && (
                  <div className="flex items-center">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    <span>Subscription Available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Main Product Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl nature-shadow overflow-hidden border border-green-100">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                {/* Product Images */}
                <div ref={imageRef} className="md:w-1/2 flex-shrink-0">
                  <div className="relative h-96 lg:h-[500px] bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl overflow-hidden mb-6 group border-2 border-emerald-200/50 shadow-lg hover:border-emerald-300/70 transition-all duration-300">
                    <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={productImages[selectedImage]}
                        alt={product.name}
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
                            alt={`${product.name} ${idx + 1}`}
                            className="w-full h-full object-contain"
                            style={{ maxHeight: '100%', maxWidth: '100%' }}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Info */}
                <div ref={infoRef} className="py-4">
                  <div className="flex items-center mb-4">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={20} fill={i < 4 ? 'currentColor' : 'none'} className="drop-shadow-sm" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-3 font-medium">(47 reviews)</span>
                    <Award className="ml-3 text-emerald-600" size={20} />
                  </div>

                  <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text mb-4 leading-tight">
                    {product.name}
                  </h1>
                  <p className="text-gray-700 mb-8 text-lg leading-relaxed">{product.description}</p>

                  {/* Benefits Section */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
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

                  <div
                    ref={detailsRef}
                    className="matcha-gradient p-6 rounded-2xl mb-8 text-white relative overflow-hidden"
                  >
                    <div className="relative z-10">
                      <h3 className="font-bold text-white mb-4 text-lg flex items-center">
                        <Leaf className="mr-2" size={20} />
                        From Nature to Cup
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="opacity-90">• Origin: Uji, Kyoto Prefecture</p>
                          <p className="opacity-90">• Harvest: First flush spring leaves</p>
                          <p className="opacity-90">• Processing: Traditional stone mill</p>
                        </div>
                        <div>
                          <p className="opacity-90">• Net Weight: 30g tin</p>
                          <p className="opacity-90">• Best by: 18 months</p>
                          <p className="opacity-90">• Storage: Cool, dark place</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-8">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Premium Quality</p>
                      <span className="text-3xl font-bold text-emerald-600">
                        Liên hệ
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

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 px-8 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                      <ShoppingCart size={22} />
                      Thêm vào giỏ hàng
                    </button>
                    <button className="p-4 border-2 border-emerald-200 rounded-2xl hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-300 hover:scale-105 group">
                      <Heart size={22} className="text-emerald-600 group-hover:fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Products */}
            <div className="mt-20">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-12 text-center">
                Complete Your Tea Journey
              </h2>
              <div ref={relatedRef} className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((item) => (
                  <div
                    key={item.id}
                    className="group hover-grow cursor-pointer"
                  >
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden nature-shadow border border-green-100">
                      <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-100 overflow-hidden relative">
                        <img
                          src={item.image}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;