import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Star, Award } from 'lucide-react';
import { Product } from '../../types/product-type';
import { FEATURED_PRODUCTS } from '../../constants';
import TeaLeafCursor from './TeaLeafCursor';

// Mock data for demo purposes
// const FEATURED_PRODUCTS = {
//   title: "Premium Tea Collection",
//   description: "Discover our carefully curated selection of premium teas from around the world, each blend crafted for the perfect cup.",
//   products: [
//     {
//       id: 1,
//       name: "Earl Grey Supreme",
//       description: "A classic Earl Grey with cornflower petals and lavender",
//       category: "black",
//       price: 24.99,
//       rating: 4.8,
//       reviews: 127,
//       image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop",
//       badge: "Premium"
//     },
//     {
//       id: 2,
//       name: "Dragon Well Green",
//       description: "Delicate Chinese green tea with sweet, nutty flavor",
//       category: "green",
//       price: 32.99,
//       rating: 4.9,
//       reviews: 89,
//       image: "https://images.unsplash.com/photo-1563822249366-2c8c6b2b4b6d?w=400&h=400&fit=crop",
//       badge: "Organic"
//     },
//     {
//       id: 3,
//       name: "Himalayan Gold",
//       description: "High-altitude black tea with honey notes",
//       category: "black",
//       price: 45.99,
//       rating: 4.7,
//       reviews: 156,
//       image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"
//     },
//     {
//       id: 4,
//       name: "Jasmine Phoenix Pearls",
//       description: "Hand-rolled green tea scented with jasmine flowers",
//       category: "green",
//       price: 38.99,
//       rating: 4.9,
//       reviews: 203,
//       image: "https://images.unsplash.com/photo-1597318571337-bd5dfb02a6f5?w=400&h=400&fit=crop",
//       badge: "Artisan"
//     },
//     {
//       id: 5,
//       name: "Chamomile Dreams",
//       description: "Soothing herbal blend perfect for evening relaxation",
//       category: "herbal",
//       price: 18.99,
//       rating: 4.6,
//       reviews: 95,
//       image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=400&fit=crop"
//     },
//     {
//       id: 6,
//       name: "Royal Pu-erh",
//       description: "Aged dark tea with rich, earthy complexity",
//       category: "pu-erh",
//       price: 52.99,
//       rating: 4.8,
//       reviews: 78,
//       image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
//       badge: "Rare"
//     }
//   ]
// };



const ITEMS_PER_PAGE = 8;


const ProductPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sortBy, setSortBy] = useState<string>('rating');
  const [products, setProducts] = useState<Product[]>([]);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange([0, 200]);
    setSortBy('rating');
    setCurrentPage(1);
  }, []);

  const fetchProducts = useCallback(() => {
    try {
      const fetchedProducts = FEATURED_PRODUCTS.products;
      setProducts(fetchedProducts as Product[]);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map(product => product.category));
    return ['all', ...Array.from(uniqueCategories)];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          default:
            return 0;
        }
      });
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-24 relative">
      {/* Tea Leaf Cursor Animation */}
      <TeaLeafCursor />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text mb-4">
            {FEATURED_PRODUCTS.title}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {FEATURED_PRODUCTS.description}
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 mb-8 border border-emerald-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/90"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/90"
            >
              {categories
                .filter((category) => category !== undefined)
                .map((category) => (
                  <option key={category} value={category}>
                    {category!.charAt(0).toUpperCase() + category!.slice(1)}
                  </option>
                ))}
            </select>

            {/* Price Range */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-24 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/90"
                placeholder="Min"
              />
              <span>-</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-24 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/90"
                placeholder="Max"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/90"
            >
              <option value="rating">Sort by Rating</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-emerald-100 hover:border-emerald-200 cursor-pointer"
            >
              <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-100 relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.badge && (
                  <span className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-medium">
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({product.reviews})</span>
                </div>
                <p className="text-emerald-600 font-semibold">${Number(product.price).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-50 bg-white/80 backdrop-blur-sm"
            >
              <ChevronLeft size={20} />
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-10 h-10 rounded-lg backdrop-blur-sm transition-all duration-200 ${
                  currentPage === index + 1
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'border border-gray-200 hover:bg-emerald-50 bg-white/80'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-50 bg-white/80 backdrop-blur-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
