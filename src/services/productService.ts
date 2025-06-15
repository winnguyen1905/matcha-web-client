import { Product, ProductVariant, FeaturedProducts } from '../types/product-type';
import { FEATURED_PRODUCTS } from '../constants';

/**
 * Transforms raw product data into a Product type
 * @param rawProduct - Raw product data from API
 * @returns Transformed Product object
 */
export const transformProductData = (rawProduct: any): Product => {
  return {
    id: rawProduct.id,
    name: rawProduct.name,
    description: rawProduct.description,
    image: rawProduct.image,
    gallery: rawProduct.gallery || [],
    rating: rawProduct.rating,
    reviews: rawProduct.reviews,
    badge: rawProduct.badge,
    origin: rawProduct.origin,
    brand: rawProduct.brand,
    category: rawProduct.category,
    type: rawProduct.type,
    flavorNotes: rawProduct.flavorNotes || [],
    ingredients: rawProduct.ingredients || [],
    weight: rawProduct.weight,
    packaging: rawProduct.packaging,
    caffeineLevel: rawProduct.caffeineLevel,
    certifications: rawProduct.certifications || [],
    healthBenefits: rawProduct.healthBenefits || [],
    brewingTemperature: rawProduct.brewingTemperature,
    brewingTime: rawProduct.brewingTime,
    servingsPerPackage: rawProduct.servingsPerPackage,
    storageInstructions: rawProduct.storageInstructions,
    variants: transformProductVariants(rawProduct.variants || []),
    features: rawProduct.features || [],
    isLimitedEdition: rawProduct.isLimitedEdition,
    isSubscriptionAvailable: rawProduct.isSubscriptionAvailable,
    price: rawProduct.price,
    stock: rawProduct.stock,
    grade: rawProduct.grade,
    harvestDate: rawProduct.harvestDate,
    processingMethod: rawProduct.processingMethod,
    shelfLife: rawProduct.shelfLife,
    allergens: rawProduct.allergens || [],
    nutritionalInfo: rawProduct.nutritionalInfo,
    brewingInstructions: rawProduct.brewingInstructions,
    tasteProfile: rawProduct.tasteProfile,
    sustainability: rawProduct.sustainability,
    awards: rawProduct.awards || [],
    tags: rawProduct.tags || [],
    videoUrl: rawProduct.videoUrl,
    faq: rawProduct.faq || [],
    shippingInfo: rawProduct.shippingInfo
  };
};

/**
 * Transforms raw variant data into ProductVariant type
 * @param rawVariants - Raw variant data from API
 * @returns Array of transformed ProductVariant objects
 */
export const transformProductVariants = (rawVariants: any[]): ProductVariant[] => {
  return rawVariants.map(variant => ({
    id: variant.id,
    name: variant.name,
    image: variant.image,
    price: variant.price,
    stock: variant.stock,
    sku: variant.sku,
    barcode: variant.barcode,
    weight: variant.weight,
    packaging: variant.packaging,
    salePrice: variant.salePrice,
    isAvailable: variant.isAvailable,
    dimensions: variant.dimensions,
    shippingWeight: variant.shippingWeight,
    isBestSeller: variant.isBestSeller,
    isNewArrival: variant.isNewArrival,
    discountPercentage: variant.discountPercentage,
    bulkPricing: variant.bulkPricing || [],
    customFields: variant.customFields || {}
  }));
};

/**
 * Gets featured products from constants and transforms them
 * @returns Transformed FeaturedProducts object
 */
export const getFeaturedProducts = (): FeaturedProducts => {
  return {
    title: FEATURED_PRODUCTS.title,
    description: FEATURED_PRODUCTS.description,
    products: FEATURED_PRODUCTS.products.map(transformProductData),
    displayType: FEATURED_PRODUCTS.displayType,
    maxItems: FEATURED_PRODUCTS.maxItems,
    sortBy: FEATURED_PRODUCTS.sortBy,
    category: FEATURED_PRODUCTS.category,
    tags: FEATURED_PRODUCTS.tags
  };
};

/**
 * Gets a single product by ID
 * @param productId - ID of the product to fetch
 * @returns Product object or null if not found
 */
export const getProductById = (productId: number): Product | null => {
  const product = FEATURED_PRODUCTS.products.find(p => p.id === productId);
  return product ? transformProductData(product) : null;
};

/**
 * Gets products by category
 * @param category - Category to filter by
 * @returns Array of Product objects
 */
export const getProductsByCategory = (category: string): Product[] => {
  return FEATURED_PRODUCTS.products
    .filter(p => p.category === category)
    .map(transformProductData);
};

/**
 * Gets products by tags
 * @param tags - Array of tags to filter by
 * @returns Array of Product objects
 */
export const getProductsByTags = (tags: string[]): Product[] => {
  return FEATURED_PRODUCTS.products
    .filter(p => p.tags?.some(tag => tags.includes(tag)))
    .map(transformProductData);
};

/**
 * Gets products sorted by a specific criteria
 * @param sortBy - Sorting criteria ('price' | 'rating' | 'newest' | 'popular')
 * @returns Array of sorted Product objects
 */
export const getSortedProducts = (sortBy: 'price' | 'rating' | 'newest' | 'popular'): Product[] => {
  const products = [...FEATURED_PRODUCTS.products].map(transformProductData);
  
  switch (sortBy) {
    case 'price':
      return products.sort((a, b) => a.price - b.price);
    case 'rating':
      return products.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return products.sort((a, b) => 
        new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
      );
    case 'popular':
      return products.sort((a, b) => b.reviews - a.reviews);
    default:
      return products;
  }
}; 
