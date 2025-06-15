import { Product, ProductVariant, FeaturedProducts, ProductReview } from '../types/product-type';
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

/**
 * Transforms raw review data into ProductReview type
 * @param rawReview - Raw review data from API
 * @returns Transformed ProductReview object
 */
export const transformProductReview = (rawReview: any): ProductReview => {
  return {
    id: rawReview.id,
    productId: rawReview.productId,
    image: rawReview.image,
    rating: rawReview.rating,
    comment: rawReview.comment,
    createdAt: rawReview.createdAt,
    stock: rawReview.stock,
    price: rawReview.price,
    sold: rawReview.sold,
    isAvailable: rawReview.isAvailable,
    badge: rawReview.badge,
    origin: rawReview.origin,
    brand: rawReview.brand,
    category: rawReview.category,
    type: rawReview.type
  };
};

/**
 * Gets reviews for a specific product
 * @param productId - ID of the product to get reviews for
 * @returns Array of ProductReview objects
 */
export const getProductReviews = (productId: number): ProductReview[] => {
  // This is a mock implementation since we don't have actual review data in constants
  // In a real application, this would fetch from an API
  const product = FEATURED_PRODUCTS.products.find(p => p.id === productId);
  
  if (!product) return [];

  // Create mock reviews based on product data
  return [
    {
      id: 1,
      productId: product.id,
      image: product.image,
      rating: product.rating,
      comment: `Great ${product.name}! The quality is exceptional.`,
      createdAt: new Date().toISOString(),
      stock: product.stock,
      price: product.price,
      sold: Math.floor(Math.random() * 100),
      isAvailable: product.stock > 0,
      badge: product.badge,
      origin: product.origin,
      brand: product.brand,
      category: product.category,
      type: product.type
    },
    {
      id: 2,
      productId: product.id,
      image: product.image,
      rating: product.rating - 0.5,
      comment: `Good ${product.name}, but could be better.`,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      stock: product.stock,
      price: product.price,
      sold: Math.floor(Math.random() * 100),
      isAvailable: product.stock > 0,
      badge: product.badge,
      origin: product.origin,
      brand: product.brand,
      category: product.category,
      type: product.type
    }
  ];
};

/**
 * Gets average rating for a product
 * @param productId - ID of the product to get average rating for
 * @returns Average rating or null if no reviews
 */
export const getProductAverageRating = (productId: number): number | null => {
  const reviews = getProductReviews(productId);
  if (reviews.length === 0) return null;
  
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
};

/**
 * Gets reviews sorted by different criteria
 * @param productId - ID of the product to get reviews for
 * @param sortBy - Sorting criteria ('newest' | 'rating' | 'helpful')
 * @returns Sorted array of ProductReview objects
 */
export const getSortedProductReviews = (
  productId: number,
  sortBy: 'newest' | 'rating' | 'helpful' = 'newest'
): ProductReview[] => {
  const reviews = getProductReviews(productId);
  
  switch (sortBy) {
    case 'newest':
      return reviews.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case 'rating':
      return reviews.sort((a, b) => b.rating - a.rating);
    case 'helpful':
      // Mock implementation - in real app would use actual helpful votes
      return reviews.sort((a, b) => b.sold - a.sold);
    default:
      return reviews;
  }
};

/**
 * Gets reviews filtered by rating
 * @param productId - ID of the product to get reviews for
 * @param minRating - Minimum rating to include
 * @returns Filtered array of ProductReview objects
 */
export const getProductReviewsByRating = (
  productId: number,
  minRating: number
): ProductReview[] => {
  return getProductReviews(productId).filter(review => review.rating >= minRating);
}; 
