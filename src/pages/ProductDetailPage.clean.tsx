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
  const product: Product = {
    ...productData,
    price: productData.variants?.[0]?.price || 0,
    caffeineLevel: (productData.caffeineLevel as 'None' | 'Low' | 'Medium' | 'High' | undefined) || 'Medium',
    features: [],
    stock: productData.variants?.[0]?.stock || 0
  };

  const productImages = [
    product.image,
    ...(product.additionalImages || [])
  ].filter(Boolean) as string[];

  useEffect(() => {
    // Animation logic here
    const animateOnLoad = () => {
      // Existing animation code
    };
    animateOnLoad();
  }, []);

  const handleQuantityChange = (value: number) => {
    setQuantity(prev => Math.max(1, Math.min(10, prev + value)));
  };

  // Rest of your component code...

  return (
    <div className="min-h-screen bg-white">
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
            <div className="md:w-1/2" ref={imageRef}>
              <div className="relative h-96 lg:h-[500px] bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl overflow-hidden mb-6 group">
                <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                <button
                  onClick={() => setSelectedImage(prev => (prev - 1 + productImages.length) % productImages.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
                >
                  <ChevronLeft size={20} className="text-emerald-600" />
                </button>
                <button
                  onClick={() => setSelectedImage(prev => (prev + 1) % productImages.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
                >
                  <ChevronRight size={20} className="text-emerald-600" />
                </button>

                {/* Image indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {productImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        selectedImage === idx
                          ? 'bg-emerald-500 scale-125'
                          : 'bg-emerald-200 hover:bg-emerald-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {productImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-3 transition-all duration-300 hover:scale-105 ${
                        selectedImage === idx
                          ? 'border-emerald-500 shadow-lg'
                          : 'border-transparent hover:border-emerald-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="md:w-1/2" ref={infoRef}>
              {/* Rest of your product info content */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
