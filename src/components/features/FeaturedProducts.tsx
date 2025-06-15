import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, MapPin, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { FEATURED_PRODUCTS } from '../../constants';

const FeaturedProducts = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { title, description, products } = FEATURED_PRODUCTS;
  const navigate = useNavigate();

  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(products.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'BESTSELLER': return 'bg-green-600';
      case 'NEW': return 'bg-blue-600';
      case 'POPULAR': return 'bg-purple-600';
      case 'PREMIUM': return 'bg-amber-600';
      case 'FEATURED': return 'bg-orange-600';
      case 'LIMITED': return 'bg-red-600';
      default: return 'bg-blue-600';
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
            {title}
          </h2>
          <div className="w-20 h-1 bg-green-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid md:grid-cols-3 gap-8 px-2">
                    {products
                      .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                      .map((product, index) => (
                        <Link 
                          to={`/products/${product.id}`}
                          key={product.id}
                          className={`group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full ${
                            index === 1 ? 'scale-105 z-10' : ''
                          }`}
                        >
                          {/* Badge */}
                          {product.badge && (
                            <div className={`absolute top-4 right-4 ${getBadgeColor(product.badge)} text-white text-xs font-bold px-3 py-1 rounded-full z-10`}>
                              {product.badge}
                            </div>
                          )}
                          
                          {/* Product Image */}
                          <div className="relative h-64 overflow-hidden">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                              <div className="w-full p-4 text-center">
                                <button 
                                  className="bg-white text-emerald-800 px-6 py-2 font-medium rounded-full hover:bg-emerald-50 transition-colors duration-200 flex items-center mx-auto"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    // Add to cart logic here
                                  }}
                                >
                                  <ShoppingCart size={16} className="mr-2" />
                                  ADD TO CART
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                            <div className="flex items-center text-sm text-gray-500 mb-3">
                              <MapPin size={14} className="mr-1" />
                              {product.origin}
                            </div>
                            
                            {/* Rating */}
                            <div className="mt-auto flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="flex text-amber-400 mr-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={16}
                                      fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                  ({product.reviews})
                                </span>
                              </div>
                              <span className="text-emerald-600 font-medium">
                                Contact Us
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-50 text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-10"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-50 text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-10"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* View All Products Button */}
        <div className="w-full flex justify-center mt-12">
          <div className="relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-green-500 to-blue-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <button
              onClick={() => navigate('/products')}
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <span>VIEW ALL PRODUCTS</span>
              <svg
                className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;