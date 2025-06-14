import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, MapPin, ShoppingCart } from 'lucide-react';
import { FEATURED_PRODUCTS } from '../../constants';

const FeaturedProducts = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { title, description, products } = FEATURED_PRODUCTS;

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
                      .map((product) => (
                        <div 
                          key={product.id}
                          className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
                        >
                          {/* Product Image */}
                          <div className="relative overflow-hidden h-64">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            {/* Badge */}
                            <div className={`absolute top-4 left-4 ${getBadgeColor(product.badge)} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
                              {product.badge}
                            </div>
                            {/* Origin */}
                            <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs flex items-center">
                              <MapPin size={12} className="mr-1" />
                              {product.origin}
                            </div>
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                              <div className="w-full p-4 text-center">
                                <button className="bg-white text-green-800 px-6 py-2 font-medium rounded-full hover:bg-green-50 transition-colors duration-200 flex items-center mx-auto">
                                  <ShoppingCart size={16} className="mr-2" />
                                  ADD TO CART
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="p-5">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                            <div className="flex items-center text-sm text-gray-500 mb-3">
                              <span className="text-green-700 font-medium">{product.origin}</span>
                            </div>
                            
                            {/* Rating */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <div className="flex mr-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={16}
                                      fill={i < Math.floor(product.rating) ? '#f59e0b' : '#d1d5db'}
                                      className={`${
                                        i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                  ({product.reviews} reviews)
                                </span>
                              </div>
                              <button 
                                className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-3 py-1.5 rounded-full transition-colors duration-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Add your inquiry logic here
                                  alert(`Inquiry about ${product.name}`);
                                }}
                              >
                                Inquire Now
                              </button>
                            </div>
                          </div>
                        </div>
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
        <div className="text-center mt-12">
          <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 font-medium transition-colors duration-200">
            VIEW ALL PRODUCTS
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;