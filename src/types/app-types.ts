export interface HeroProfile {
  title: string;
  description: string;
  backgroundImage: string;
  button1: {
    text: string;
    action: string;
  };
  button2: {
    text: string;
    action: string;
  };
}

export interface HeroProfiles {
  profile1: HeroProfile;
  profile2: HeroProfile;
}

export interface NavigationItem {
  name: string;
  id: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
}

export interface Service {
  icon: "ShoppingBag" | "Wrench" | "Truck" | "Users";
  title: string;
  description: string;
}

export interface Services {
  title: string;
  description: string;
  services: Service[];
}

export interface ProductFeature {
  title: string;
  description: string;
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

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  gallery?: string[];
  rating: number;
  reviews: number;
  badge?: string;
  origin: string;
  brand?: string;
  category?: string;
  type?: string;
  flavorNotes?: string[];
  ingredients?: string[];
  weight?: number;
  packaging?: string;
  caffeineLevel?: "None" | "Low" | "Medium" | "High";
  certifications?: string[];
  healthBenefits?: string[];
  brewingTemperature?: string;
  brewingTime?: string;
  servingsPerPackage?: number;
  storageInstructions?: string;
  variants: ProductVariant[];
  features: ProductFeature[];
  isLimitedEdition?: boolean;
  isSubscriptionAvailable?: boolean;
  createdAt?: string;
  updatedAt?: string;
  price: number;
  stock: number;
  grade?: "Ceremonial" | "Premium" | "Culinary" | "Classic";
  harvestDate?: string;
  processingMethod?: string;
  shelfLife?: string;
  allergens?: string[];
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
    sweetness?: number;
    bitterness?: number;
    umami?: number;
    astringency?: number;
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
  relatedProducts?: number[];
  tags?: string[];
  videoUrl?: string;
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

export interface FeaturedProducts {
  title: string;
  description: string;
  products: Product[];
  displayType?: "grid" | "carousel" | "list";
  maxItems?: number;
  sortBy?: "price" | "rating" | "newest" | "popular";
  category?: string;
  tags?: string[];
}

// Constants type definitions
export interface AppConstants {
  APP_TITLE1: string;
  APP_TITLE2: string;
  APP_DESCRIPTION: string;
  APP_DESCRIPTION2: string;
  BACKGROUND_IMAGE1: string;
  BACKGROUND_IMAGE2: string;
  HERO_PROFILES: HeroProfiles;
  NAVIGATION_ITEMS: NavigationItem[];
  SOCIAL_LINKS: SocialLinks;
  FEATURED_PRODUCTS: FeaturedProducts;
  SERVICES: Services;
}
