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
}

export interface ProductVariant {
    id: number;
    name: string; // e.g., "100g", "200g", "Tea Bag Pack"
    image: string;
    price: number;
    stock: number;
    sku?: string;
    barcode?: string;
    weight?: number; // in grams
    packaging?: string;
    salePrice?: number;
    isAvailable?: boolean;
}

export interface FeaturedProducts {
    title: string;
    description: string;
    products: Product[];
}