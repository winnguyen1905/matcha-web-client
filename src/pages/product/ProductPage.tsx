import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/Product';
import { FEATURED_PRODUCTS } from '../../constants';
import TeaLeafCursor from './TeaLeafCursor';
import MatchaSearchFilter from '../../components/MatchaSearchFilter';
import type { ProductCategory } from '../../hooks/Product';

const ITEMS_PER_PAGE = 12;

const ProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | undefined>(undefined);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 9999]);
  const [sortBy, setSortBy] = useState<string>('rating');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);
  const observer = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { products, loading, error, getFeaturedProducts } = useProducts();


  const handleProductClick = useCallback((productId: string) => {
    navigate(`/products/${productId}`);
  }, [navigate]);

  // Initial load
  useEffect(() => {
    const loadInitialProducts = async () => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      try {
        await getFeaturedProducts();
        setPage(1);
        setHasMore(true);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        loadingRef.current = false;
      }
    };

    loadInitialProducts();
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    const validCategories: ProductCategory[] = ['MATCHA', 'SWEET', 'TOOL'];
    const isValidCategory = validCategories.includes(selectedCategory as ProductCategory);

    return products
      .filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === undefined ||
          (isValidCategory && product.category === selectedCategory);
        const productPrice = product.newPrice || 0;
        const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1];
        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        const priceA = a.newPrice || 0;
        const priceB = b.newPrice || 0;
        switch (sortBy) {
          case 'price-asc':
            return priceA - priceB;
          case 'price-desc':
            return priceB - priceA;
          default:
            return 0;
        }
      });
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  // Infinite scroll setup
  useEffect(() => {
    if (!hasMore || loading) return;

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting) {
        setPage(prevPage => prevPage + 1);
      }
    };

    observer.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 0.1,
    });

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.current.observe(currentRef);
    }

    return () => {
      if (observer.current && currentRef) {
        observer.current.unobserve(currentRef);
      }
    };
  }, [hasMore, loading]);

  // Check if there are more products to load
  useEffect(() => {
    if (filteredProducts.length > 0 && page * ITEMS_PER_PAGE >= filteredProducts.length) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [filteredProducts, page]);



  // Get current products to display
  const paginatedProducts = useMemo(() => {
    const end = page * ITEMS_PER_PAGE;
    return filteredProducts.slice(0, end);
  }, [filteredProducts, page]);

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

        {/* Loading and Error States */}
        {loading && (
          <div className="col-span-full text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
            <p className="mt-2 text-emerald-700">Loading products...</p>
          </div>
        )}

        {error && (
          <div className="col-span-full text-center py-12">
            <p className="text-red-600">Error loading products. Please try again later.</p>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {paginatedProducts.map((product) => {
            const price = product.newPrice || 0;
            const oldPrice = product.oldPrice || null;
            const mainImage = product.imageUrls?.[0] || '/placeholder-product.jpg';

            return (
              <div
                key={product.$id}
                onClick={() => handleProductClick(product.$id)}
                className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-emerald-100 hover:border-emerald-200 cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleProductClick(product.$id);
                  }
                }}
              >
                <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-100 relative overflow-hidden">
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== window.location.origin + '/placeholder-product.jpg') {
                        target.src = '/placeholder-product.jpg';
                      }
                    }}
                  />
                  {oldPrice && oldPrice > price && (
                    <span className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-red-100 text-red-800 text-xs px-2 sm:px-3 py-1 rounded-full font-medium">
                      Sale
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
                          fill="none"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-emerald-600 font-semibold text-sm sm:text-base">
                      ${price.toFixed(2)}
                    </p>
                    {oldPrice && oldPrice > price && (
                      <p className="text-gray-400 text-xs line-through">
                        ${oldPrice.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load more indicator */}
        <div ref={loadMoreRef} className="w-full flex justify-center py-8">
          {loading && (
            <div className="flex items-center gap-2 text-emerald-600">
              <Loader2 className="animate-spin h-5 w-5" />
              <span>Loading more products...</span>
            </div>
          )}
          {!hasMore && paginatedProducts.length > 0 && (
            <p className="text-gray-500 text-sm">No more products to load</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
