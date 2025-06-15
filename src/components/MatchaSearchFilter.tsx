import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, ChevronDown, X, Leaf } from 'lucide-react';

interface MatchaSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

type CategoryType = 'all' | 'ceremonial-grade' | 'premium-grade' | 'culinary-grade' | 'matcha-tools' | 'tea-sets' | 'accessories' | 'gift-sets';

const MatchaSearchFilter: React.FC<MatchaSearchFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const leafRef = useRef<HTMLDivElement>(null);

  // Matcha tea categories
  const categories: CategoryType[] = [
    'all', 
    'ceremonial-grade', 
    'premium-grade', 
    'culinary-grade',
    'matcha-tools',
    'tea-sets',
    'accessories',
    'gift-sets'
  ];

  const categoryLabels: Record<CategoryType, string> = {
    'all': '🍃 All Products',
    'ceremonial-grade': '🏆 Ceremonial Grade',
    'premium-grade': '⭐ Premium Grade',
    'culinary-grade': '🍰 Culinary Grade',
    'matcha-tools': '🥄 Matcha Tools',
    'tea-sets': '🫖 Tea Sets',
    'accessories': '✨ Accessories',
    'gift-sets': '🎁 Gift Sets'
  };

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // GSAP animations
  useEffect(() => {
    // Import GSAP from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    script.onload = () => {
      const { gsap } = window;
      
      // Initial animation on mount with zen-like entrance
      gsap.fromTo(containerRef.current, 
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" }
      );

      // Floating leaf animation
      if (leafRef.current) {
        gsap.to(leafRef.current, {
          y: -5,
          rotation: 5,
          duration: 2,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1
        });
      }

      // Search input focus animation with matcha green glow
      const searchInput = searchRef.current?.querySelector('input');
      if (searchInput) {
        searchInput.addEventListener('focus', () => {
          gsap.to(searchRef.current, {
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out"
          });
          gsap.to(searchInput, {
            boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)",
            duration: 0.3
          });
        });

        searchInput.addEventListener('blur', () => {
          gsap.to(searchRef.current, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
          gsap.to(searchInput, {
            boxShadow: "0 0 0px rgba(34, 197, 94, 0)",
            duration: 0.3
          });
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Filter toggle animation
  useEffect(() => {
    if (window.gsap && filtersRef.current) {
      if (isFiltersOpen) {
        window.gsap.fromTo(filtersRef.current,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.3, ease: "power2.out" }
        );
      } else {
        window.gsap.to(filtersRef.current,
          { height: 0, opacity: 0, duration: 0.3, ease: "power2.in" }
        );
      }
    }
  }, [isFiltersOpen]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange([0, 200]);
    setSortBy('rating');
    
    if (window.gsap && containerRef.current) {
      window.gsap.fromTo(containerRef.current,
        { scale: 0.98 },
        { scale: 1, duration: 0.3, ease: "back.out(1.7)" }
      );
    }
  };

  return (
    <div 
      ref={containerRef}
      className="bg-gradient-to-br from-green-50/90 via-white/90 to-emerald-50/90 backdrop-blur-md rounded-2xl shadow-xl border border-green-200/50 overflow-hidden mb-8 relative"
    >
      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 opacity-10">
        <div ref={leafRef} className="text-green-600">
          <Leaf size={24} />
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600"></div>
      
      {/* Header */}
      <div className="p-4 sm:p-6 relative">
        <div className="text-center mb-4">
          <h2 className="text-lg font-medium text-green-800 flex items-center justify-center gap-2">
            <Leaf className="text-green-600" size={20} />
            Find Your Perfect Matcha
            <Leaf className="text-green-600 scale-x-[-1]" size={20} />
          </h2>
        </div>
        
        {/* Desktop Layout: Search + Filters Side by Side */}
        <div className="hidden md:flex md:items-center md:gap-4">
          {/* Search Bar */}
          <div ref={searchRef} className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 z-10" size={20} />
            <input
              type="text"
              placeholder="Search matcha, tools, tea sets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/95 transition-all duration-300 text-gray-700 placeholder-green-400/70"
            />
          </div>

          {/* Desktop Filters - Inline */}
          <div className="flex items-center gap-3">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-green-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/95 text-gray-700 transition-all duration-300 text-sm min-w-[140px]"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {categoryLabels[category]?.replace(/^[^\s]+ /, '') || category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            {/* Price Range - Compact */}
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-20 border border-green-200 rounded-lg px-2 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/95 text-gray-700 transition-all duration-300 text-sm"
                placeholder="$0"
                min="0"
              />
              <span className="text-green-600 text-xs">~</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-20 border border-green-200 rounded-lg px-2 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/95 text-gray-700 transition-all duration-300 text-sm"
                placeholder="$200"
                min="0"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-green-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/95 text-gray-700 transition-all duration-300 text-sm min-w-[120px]"
            >
              <option value="rating">⭐ Rating</option>
              <option value="price-asc">💰 Low-High</option>
              <option value="price-desc">💎 High-Low</option>
              <option value="newest">✨ Newest</option>
              <option value="popular">🔥 Popular</option>
              <option value="grade">🏆 Grade</option>
            </select>

            {/* Clear Button */}
            <button
              onClick={handleClearFilters}
              className="flex items-center justify-center gap-1 px-3 py-3 bg-green-100/80 hover:bg-green-200/80 rounded-xl transition-colors duration-300 text-green-700 font-medium border border-green-200/50 text-sm"
            >
              <X size={14} />
              <span className="hidden lg:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Mobile Layout: Search Bar */}
        <div className="md:hidden">
          <div ref={searchRef} className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 z-10" size={20} />
            <input
              type="text"
              placeholder="Search matcha, tools, tea sets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/95 transition-all duration-300 text-gray-700 placeholder-green-400/70"
            />
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-green-100/80 hover:bg-green-200/80 rounded-xl transition-colors duration-300 text-green-700 font-medium border border-green-200/50"
          >
            <Filter size={18} />
            <span>Filter Matcha Selection</span>
            <ChevronDown 
              className={`transform transition-transform duration-300 ${isFiltersOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Filters Section - Only shown on mobile when toggled */}
      <div 
        ref={filtersRef}
        className={`md:hidden ${isFiltersOpen ? 'block' : 'hidden'} border-t border-green-100/50 bg-gradient-to-r from-green-25/30 to-emerald-25/30`}
        style={{ overflow: 'hidden' }}
      >
        <div className="p-4 sm:p-6 space-y-4">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-green-800 flex items-center gap-1">
              <Leaf size={14} className="text-green-600" />
              Tea Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-green-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/95 text-gray-700 transition-all duration-300"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-green-800">Price Range (USD)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-full border border-green-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/95 text-gray-700 transition-all duration-300"
                placeholder="$0"
                min="0"
              />
              <span className="text-green-600 font-medium">~</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full border border-green-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/95 text-gray-700 transition-all duration-300"
                placeholder="$200"
                min="0"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-green-800">Sort Selection</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border border-green-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/95 text-gray-700 transition-all duration-300"
            >
              <option value="rating">🌟 Best Rating</option>
              <option value="price-asc">💰 Price: Low to High</option>
              <option value="price-desc">💎 Price: High to Low</option>
              <option value="newest">✨ Newest Arrivals</option>
              <option value="popular">🔥 Most Popular</option>
              <option value="grade">🏆 By Grade Quality</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="pt-2">
            <button
              onClick={handleClearFilters}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-100/80 hover:bg-green-200/80 rounded-lg transition-colors duration-300 text-green-700 font-medium border border-green-200/50"
            >
              <X size={16} />
              <span>Reset All Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Filter Toggle */}
      {/* <div className="md:hidden">
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-green-100/80 hover:bg-green-200/80 rounded-xl transition-colors duration-300 text-green-700 font-medium border border-green-200/50"
        >
          <Filter size={18} />
          <span>Filter Matcha Selection</span>
          <ChevronDown 
            className={`transform transition-transform duration-300 ${isFiltersOpen ? 'rotate-180' : ''}`} 
            size={18} 
          />
        </button>
      </div> */}
    </div>
  );
};

export default MatchaSearchFilter;