export interface TeaLeaf {
  element: HTMLDivElement;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    image: string;
    gallery?: string[]; // multiple images
    rating: number;
    reviews: number;
    badge?: string; // e.g., "Best Seller", "New", "Organic"
    origin: string; // e.g., "Japan", "Vietnam"
    brand?: string;
    category?: string; // e.g., "Matcha", "Sencha", "Oolong"
    type?: string; // e.g., "Loose Leaf", "Tea Bag", "Powder"
    flavorNotes?: string[]; // e.g., ["Grassy", "Sweet", "Umami"]
    ingredients?: string[]; // e.g., ["Green tea", "Jasmine flower"]
    weight?: number; // in grams
    packaging?: string; // e.g., "Resealable Bag", "Tin"
    caffeineLevel?: 'None' | 'Low' | 'Medium' | 'High';
    certifications?: string[]; // e.g., ["Organic", "Fair Trade"]
    healthBenefits?: string[]; // e.g., ["Boosts metabolism", "Rich in antioxidants"]
    brewingTemperature?: string; // e.g., "70-80°C"
    brewingTime?: string; // e.g., "1-2 minutes"
    servingsPerPackage?: number;
    storageInstructions?: string;
    variants: ProductVariant[]; // e.g., different weights or packaging
    features: FeaturedProducts[];
    isLimitedEdition?: boolean;
    isSubscriptionAvailable?: boolean;
    createdAt?: string;
    updatedAt?: string;
    price: number;
    stock: number;
    // New attributes
    grade?: 'Ceremonial' | 'Premium' | 'Culinary' | 'Classic'; // Matcha grade
    harvestDate?: string; // When the tea was harvested
    processingMethod?: string; // How the tea was processed
    shelfLife?: string; // How long the product stays fresh
    allergens?: string[]; // List of potential allergens
    nutritionalInfo?: {
        calories?: number;
        protein?: number;
        carbohydrates?: number;
        fat?: number;
        fiber?: number;
        sugar?: number;
        sodium?: number;
        caffeine?: number;
    };
    
    brewingInstructions?: {
        traditional?: string;
        modern?: string;
        iced?: string;
    };
    tasteProfile?: {
        sweetness?: number; // 1-5 scale
        bitterness?: number; // 1-5 scale
        umami?: number; // 1-5 scale
        astringency?: number; // 1-5 scale
    };
    sustainability?: {
        isEcoFriendly?: boolean;
        packagingRecyclable?: boolean;
        carbonNeutral?: boolean;
        fairTrade?: boolean;
    };
    awards?: {
        name: string;
        year: number;
        organization: string;
    }[];
    relatedProducts?: number[]; // IDs of related products
    tags?: string[]; // For search and filtering
    videoUrl?: string; // Product demonstration video
    faq?: {
        question: string;
        answer: string;
    }[];
    shippingInfo?: {
        weight: number;
        dimensions: {
            length: number;
            width: number;
            height: number;
        };
        freeShippingThreshold?: number;
        estimatedDeliveryTime?: string;
    };
}

// Product review interface (partial fields)
export interface ProductReview {
    id: number;
    productId: number;
    image: string;
    rating: number; // 1-5
    comment: string;
    createdAt: string; // ISO date string
    stock: number;
    price: number;
    sold: number;
    isAvailable: boolean;
    badge?: string; // e.g., "Best Seller", "New", "Organic"
    origin: string; // e.g., "Japan", "Vietnam"
    brand?: string;
    category?: string; // e.g., "Matcha", "Sencha", "Oolong"
    type?: string; // e.g., "Loose Leaf", "Tea Bag", "Powder"
}

export interface ProductVariant {
    id: number;
    name: string;
    image: string;
    price: number;
    stock: number;
    sku?: string;
    barcode?: string;
    weight?: number;
    packaging?: string;
    salePrice?: number;
    isAvailable?: boolean;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    shippingWeight?: number;
    isBestSeller?: boolean;
    isNewArrival?: boolean;
    discountPercentage?: number;
    bulkPricing?: {
        minQuantity: number;
        price: number;
    }[];
    customFields?: {
        [key: string]: string | number | boolean;
    };
}

export interface FeaturedProducts {
    title: string;
    description: string;
    products: Product[];
    // New attributes
    displayType?: 'grid' | 'carousel' | 'list';
    maxItems?: number;
    sortBy?: 'price' | 'rating' | 'newest' | 'popular';
    category?: string;
    tags?: string[];
}
