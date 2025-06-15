import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types/product-type';
import { FEATURED_PRODUCTS } from '../../constants';
import TeaLeafCursor from './TeaLeafCursor';
import MatchaSearchFilter from '../../components/MatchaSearchFilter';

const ITEMS_PER_PAGE = 8;

const ProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sortBy, setSortBy] = useState<string>('rating');
  const [products, setProducts] = useState<Product[]>([]);

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

  const handleProductClick = useCallback((productId: number) => {
    navigate(`/products/${productId}`);
  }, [navigate]);

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
        <MatchaSearchFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {paginatedProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product.id)}
              className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-emerald-100 hover:border-emerald-200 cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleProductClick(product.id);
                }
              }}
            >
              <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-100 relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.badge && (
                  <span className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-emerald-100 text-emerald-800 text-xs px-2 sm:px-3 py-1 rounded-full font-medium">
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className="sm:w-4 sm:h-4"
                        fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">({product.reviews})</span>
                </div>
                <p className="text-emerald-600 font-semibold text-sm sm:text-base">${Number(product.price).toFixed(2)}</p>
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
