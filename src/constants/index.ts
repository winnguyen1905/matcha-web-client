import type { 
  AppConstants, 
  HeroProfiles, 
  NavigationItem, 
  SocialLinks, 
  FeaturedProducts, 
  Services 
} from '../types/app-types';

export const APP_TITLE1: string = "Quality Matcha, Better Everyday Moments";
export const APP_TITLE2: string = "Upgrade Your At-Home Matcha";
export const APP_DESCRIPTION: string = "The difference is in the details—vibrant color, smooth flavor, and clean energy. Start your day with matcha that makes every sip feel special.";
export const APP_DESCRIPTION2: string = "Better matcha means better flavor, better energy, and a better start to your day";
export const BACKGROUND_IMAGE1: string = "https://fra.cloud.appwrite.io/v1/storage/buckets/685447fd0000f28d4ad2/files/6870de53002c10fc73c0/view?project=6853e4280039022d2b30&mode=admin";
export const BACKGROUND_IMAGE2: string = "https://fra.cloud.appwrite.io/v1/storage/buckets/685447fd0000f28d4ad2/files/6870df2c0011d102be14/view?project=6853e4280039022d2b30&mode=admin";

export const HERO_PROFILES: HeroProfiles = {
  profile1: {
    title: APP_TITLE1,
    description: APP_DESCRIPTION,
    backgroundImage: BACKGROUND_IMAGE1,
    button1: {
      text: "LEARN MORE",
      action: "about"
    },
    button2: {
      text: "CONTACT US",
      action: "contact"
    }
  },
  profile2: {
    title: APP_TITLE2,
    description: APP_DESCRIPTION2,
    backgroundImage: BACKGROUND_IMAGE2,
    button1: {
      text: "SHOP NOW",
      action: "products",
    },
    button2: {
      text: "LEARN MORE",
      action: "about"
    }
  }
};

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { name: 'HOME', id: 'home' },
  { name: 'ABOUT', id: 'about' },
  { name: 'SERVICES', id: 'services' },
  { name: 'CONTACT', id: 'contact' }
];

export const SOCIAL_LINKS: SocialLinks = {
  facebook: '#',
  instagram: '#',
  twitter: '#'
};

export const FEATURED_PRODUCTS: FeaturedProducts = {
  title: "PREMIUM MATCHA COLLECTION",
  description: "Experience the finest Japanese matcha teas, carefully selected for their exceptional quality and authentic flavor profiles.",
  products: [
    {
      id: 1,
      name: 'Aoi no Homare',
      description: 'Premium ceremonial grade matcha with a rich umami flavor and vibrant green color. Perfect for traditional tea ceremonies.',
      image: '/sounds/picture/product/Aoi no Homare.jpg',
      gallery: [
        '/sounds/picture/product/Aoi no Homare.jpg',
        '/sounds/picture/product/Marukyu Koyamaen - Aoarashi.jpg',
        '/sounds/picture/product/Marukyu Koyamaen - Isuzu.jpg'
      ],
      rating: 4.9,
      reviews: 156,
      badge: 'BESTSELLER',
      origin: 'Uji, Japan',
      brand: 'Marukyu Koyamaen',
      category: 'Matcha',
      type: 'Powder',
      flavorNotes: ['Umami', 'Sweet', 'Creamy'],
      ingredients: ['Shade-grown green tea leaves'],
      weight: 30,
      packaging: 'Sealed tin',
      caffeineLevel: 'Medium',
      certifications: ['JAS Organic', 'JONA'],
      healthBenefits: ['Rich in antioxidants', 'Boosts metabolism', 'Enhances focus'],
      brewingTemperature: '70-80°C',
      brewingTime: '1-2 minutes',
      servingsPerPackage: 15,
      storageInstructions: 'Store in a cool, dark place away from moisture and strong odors',
      isLimitedEdition: false,
      isSubscriptionAvailable: true,
      price: 45.99,
      stock: 50,
      variants: [
        {
          id: 101,
          name: '30g Tin',
          image: '/sounds/picture/product/Aoi no Homare.jpg',
          price: 45.99,
          stock: 50,
          sku: 'MCH-001-30',
          weight: 30,
          isAvailable: true,
          dimensions: {
            length: 8,
            width: 8,
            height: 12
          },
          shippingWeight: 0.4,
          isBestSeller: true,
          discountPercentage: 0,
          bulkPricing: [
            { minQuantity: 3, price: 42.99 },
            { minQuantity: 5, price: 39.99 }
          ]
        },
        {
          id: 102,
          name: '60g Refill Pack',
          image: '/sounds/picture/product/Marukyu Koyamaen - Aoarashi.jpg',
          price: 79.99,
          stock: 30,
          sku: 'MCH-001-60',
          weight: 60,
          isAvailable: true,
          dimensions: {
            length: 10,
            width: 10,
            height: 15
          },
          shippingWeight: 0.7,
          discountPercentage: 10,
          bulkPricing: [
            { minQuantity: 3, price: 74.99 },
            { minQuantity: 5, price: 69.99 }
          ]
        }
      ],
      features: [
        {
          title: 'Ceremonial Grade',
          description: 'Highest quality matcha for traditional tea ceremonies'
        },
        {
          title: 'Stone Ground',
          description: 'Slowly ground on granite stone mills for perfect texture'
        }
      ],
      grade: 'Ceremonial',
      harvestDate: 'Spring 2024',
      processingMethod: 'Traditional stone grinding',
      shelfLife: '12 months',
      allergens: ['None'],
      nutritionalInfo: {
        calories: 5,
        protein: 1,
        carbohydrates: 1,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0,
        caffeine: 35
      },
      brewingInstructions: {
        traditional: 'Use 2g matcha, 70ml water at 80°C. Whisk in "W" motion until frothy.',
        modern: 'Mix 1g matcha with 30ml water, then add 150ml milk or water.',
        iced: 'Dissolve 2g matcha in 30ml hot water, add ice and cold water.'
      },
      tasteProfile: {
        sweetness: 4,
        bitterness: 2,
        umami: 5,
        astringency: 1
      },
      sustainability: {
        isEcoFriendly: true,
        packagingRecyclable: true,
        carbonNeutral: true,
        fairTrade: true
      },
      awards: [
        {
          name: 'Best Matcha 2024',
          year: 2024,
          organization: 'Japan Tea Association'
        },
        {
          name: 'Gold Medal',
          year: 2023,
          organization: 'World Tea Awards'
        }
      ],
      tags: ['ceremonial', 'premium', 'organic', 'japanese'],
      videoUrl: 'https://example.com/matcha-preparation',
      faq: [
        {
          question: 'How should I store my matcha?',
          answer: 'Store in a cool, dark place away from moisture and strong odors. Refrigeration is recommended after opening.'
        },
        {
          question: 'What is the difference between ceremonial and culinary grade?',
          answer: 'Ceremonial grade is the highest quality, meant for drinking as tea. Culinary grade is for cooking and baking.'
        }
      ],
      shippingInfo: {
        weight: 0.4,
        dimensions: {
          length: 8,
          width: 8,
          height: 12
        },
        freeShippingThreshold: 100,
        estimatedDeliveryTime: '2-3 business days'
      }
    },
    {
      id: 2,
      name: 'Yamamasa Kaguraden',
      description: 'A luxurious ceremonial matcha with a smooth, sweet flavor and vibrant emerald color. Ideal for special occasions.',
      image: '/sounds/picture/product/Yamamasa - Kaguraden.jpg',
      gallery: [
        '/sounds/picture/product/Yamamasa - Kaguraden.jpg',
        '/sounds/picture/product/Yamamasa - Tennouzan.jpg',
        '/sounds/picture/product/Yamamasa Matsukaze.jpg'
      ],
      rating: 4.9,
      reviews: 89,
      badge: 'PREMIUM',
      origin: 'Nishio, Japan',
      brand: 'Yamamasa',
      category: 'Matcha',
      type: 'Powder',
      flavorNotes: ['Sweet', 'Mellow', 'Nutty'],
      ingredients: ['First harvest tea leaves'],
      weight: 40,
      packaging: 'Gold-sealed tin',
      caffeineLevel: 'Medium',
      certifications: ['JAS Organic'],
      healthBenefits: ['High in L-Theanine', 'Calming effect', 'Rich in chlorophyll'],
      brewingTemperature: '75-85°C',
      brewingTime: '1.5-2 minutes',
      servingsPerPackage: 20,
      storageInstructions: 'Keep refrigerated after opening for maximum freshness',
      isLimitedEdition: true,
      isSubscriptionAvailable: false,
      price: 89.99,
      stock: 25,
      variants: [
        {
          id: 201,
          name: '40g Gold Tin',
          image: '/sounds/picture/product/Yamamasa - Kaguraden.jpg',
          price: 89.99,
          stock: 25,
          sku: 'YMK-001-40',
          weight: 40,
          isAvailable: true
        },
        {
          id: 202,
          name: '80g Limited Edition',
          image: '/sounds/picture/product/Yamamasa - Tennouzan.jpg',
          price: 159.99,
          stock: 15,
          sku: 'YMK-001-80',
          weight: 80,
          isAvailable: true
        }
      ],
      features: [
        {
          title: 'First Harvest',
          description: 'Made from the first flush of spring leaves for superior flavor'
        },
        {
          title: 'Hand-picked',
          description: 'Leaves are carefully selected by experienced tea masters'
        }
      ]
    },
    {
      id: 3,
      name: 'Shohokuen Matsu',
      description: 'A premium ceremonial matcha with a well-balanced flavor profile, perfect for both traditional preparation and modern matcha drinks.',
      image: '/sounds/picture/product/Shohokuen - Matsu 30g.jpg',
      gallery: [
        '/sounds/picture/product/Shohokuen - Matsu 30g.jpg',
        '/sounds/picture/product/Shohokuen - Kumo 30g.jpg',
        '/sounds/picture/product/Shohokuen - Iwai 30g.jpg'
      ],
      rating: 4.8,
      reviews: 124,
      badge: 'POPULAR',
      origin: 'Kyoto, Japan',
      brand: 'Shohokuen',
      category: 'Matcha',
      type: 'Powder',
      flavorNotes: ['Elegant', 'Smooth', 'Floral'],
      ingredients: ['Shade-grown green tea leaves'],
      weight: 30,
      packaging: 'Airtight tin',
      caffeineLevel: 'Medium',
      certifications: ['JAS Organic'],
      healthBenefits: ['Rich in antioxidants', 'Boosts metabolism', 'Enhances focus'],
      brewingTemperature: '75-80°C',
      brewingTime: '1-1.5 minutes',
      servingsPerPackage: 15,
      storageInstructions: 'Store in a cool, dark place away from moisture',
      isLimitedEdition: false,
      isSubscriptionAvailable: true,
      price: 49.99,
      stock: 40,
      variants: [
        {
          id: 301,
          name: '30g Tin',
          image: '/sounds/picture/product/Shohokuen - Matsu 30g.jpg',
          price: 49.99,
          stock: 40,
          sku: 'SHM-001-30',
          weight: 30,
          isAvailable: true
        },
        {
          id: 302,
          name: '60g Refill',
          image: '/sounds/picture/product/Shohokuen - Kumo 30g.jpg',
          price: 89.99,
          stock: 25,
          sku: 'SHM-001-60',
          weight: 60,
          isAvailable: true
        }
      ],
      features: [
        {
          title: 'Ceremonial Grade',
          description: 'Premium quality for traditional tea preparation'
        },
        {
          title: 'Versatile',
          description: 'Perfect for both hot and iced matcha drinks'
        }
      ]
    },
    {
      id: 4,
      name: 'Marukyu Koyamaen Kinrin',
      description: 'A premium ceremonial matcha with a rich, full-bodied flavor and vibrant emerald color. Perfect for special occasions.',
      image: '/sounds/picture/product/Marykyu Koyamaen - Kinrin.jpg',
      gallery: [
        '/sounds/picture/product/Marykyu Koyamaen - Kinrin.jpg',
        '/sounds/picture/product/Marukyu Koyamaen - Unkaku.jpg',
        '/sounds/picture/product/Marukyu Koyamaen - Yugen.jpg'
      ],
      rating: 4.9,
      reviews: 187,
      badge: 'PREMIUM',
      origin: 'Uji, Japan',
      brand: 'Marukyu Koyamaen',
      category: 'Matcha',
      type: 'Powder',
      flavorNotes: ['Rich', 'Creamy', 'Sweet'],
      ingredients: ['Shade-grown green tea leaves'],
      weight: 40,
      packaging: 'Gold-sealed tin',
      caffeineLevel: 'Medium',
      certifications: ['JAS Organic', 'JONA'],
      healthBenefits: ['High in antioxidants', 'Calming effect', 'Boosts focus'],
      brewingTemperature: '70-75°C',
      brewingTime: '1.5-2 minutes',
      servingsPerPackage: 20,
      storageInstructions: 'Refrigerate after opening for maximum freshness',
      isLimitedEdition: true,
      isSubscriptionAvailable: false,
      price: 99.99,
      stock: 20,
      variants: [
        {
          id: 401,
          name: '40g Gold Tin',
          image: '/sounds/picture/product/Marykyu Koyamaen - Kinrin.jpg',
          price: 99.99,
          stock: 20,
          sku: 'MKK-001-40',
          weight: 40,
          isAvailable: true
        },
        {
          id: 402,
          name: '80g Limited Edition',
          image: '/sounds/picture/product/Marukyu Koyamaen - Unkaku.jpg',
          price: 179.99,
          stock: 10,
          sku: 'MKK-001-80',
          weight: 80,
          isAvailable: true
        }
      ],
      features: [
        {
          title: 'Premium Grade',
          description: 'Exceptional quality for the most discerning matcha lovers'
        },
        {
          title: 'Artisanal',
          description: 'Handcrafted in small batches by master tea blenders'
        }
      ]
    },
    {
      id: 5,
      name: 'Itoen Hana no En',
      description: 'A delicate and aromatic matcha with a smooth, sweet flavor profile. Perfect for daily enjoyment and special moments alike.',
      image: '/sounds/picture/product/Itoen Hana no En.jpg',
      gallery: [
        '/sounds/picture/product/Itoen Hana no En.jpg',
        '/sounds/picture/product/Itoen - Koto no Tsuki.jpg',
        '/sounds/picture/product/Shoji No Shiro.jpg'
      ],
      rating: 4.7,
      reviews: 98,
      badge: 'NEW',
      origin: 'Shizuoka, Japan',
      brand: 'Itoen',
      category: 'Matcha',
      type: 'Powder',
      flavorNotes: ['Delicate', 'Floral', 'Sweet'],
      ingredients: ['Shade-grown green tea leaves'],
      weight: 30,
      packaging: 'Resealable pouch',
      caffeineLevel: 'Medium',
      certifications: ['JAS Organic'],
      healthBenefits: ['Rich in antioxidants', 'Calming effect', 'Supports focus'],
      brewingTemperature: '75-80°C',
      brewingTime: '1-1.5 minutes',
      servingsPerPackage: 15,
      storageInstructions: 'Store in a cool, dry place away from light',
      isLimitedEdition: false,
      isSubscriptionAvailable: true,
      price: 39.99,
      stock: 45,
      variants: [
        {
          id: 501,
          name: '30g Pouch',
          image: '/sounds/picture/product/Itoen Hana no En.jpg',
          price: 39.99,
          stock: 45,
          sku: 'IHE-001-30',
          weight: 30,
          isAvailable: true
        },
        {
          id: 502,
          name: '60g Refill',
          image: '/sounds/picture/product/Itoen - Koto no Tsuki.jpg',
          price: 69.99,
          stock: 30,
          sku: 'IHE-001-60',
          weight: 60,
          isAvailable: true
        }
      ],
      features: [
        {
          title: 'Daily Ceremonial Grade',
          description: 'High-quality matcha perfect for daily consumption'
        },
        {
          title: 'Versatile',
          description: 'Great for both traditional preparation and modern drinks'
        }
      ]
    },
    {
      id: 6,
      name: 'Hoshino Seichaen',
      description: 'An exceptional ceremonial matcha from a family-owned tea garden with over 800 years of history. Known for its intense umami and sophisticated balance.',
      image: '/sounds/picture/product/Hoshino Seichaen.jpg',
      gallery: [
        '/sounds/picture/product/Hoshino Seichaen.jpg',
        '/sounds/picture/product/Marukyu Koyamaen - Aoarashi.jpg',
        '/sounds/picture/product/Marukyu Koyamaen - Isuzu.jpg'
      ],
      rating: 4.9,
      reviews: 203,
      badge: 'FEATURED',
      origin: 'Yame, Japan',
      brand: 'Hoshino Seichaen',
      category: 'Matcha',
      type: 'Powder',
      flavorNotes: ['Intense Umami', 'Deep', 'Complex'],
      ingredients: ['Hand-selected first flush leaves'],
      weight: 40,
      packaging: 'Traditional wooden box',
      caffeineLevel: 'High',
      certifications: ['JAS Organic', 'Premium Grade'],
      healthBenefits: ['Maximum antioxidants', 'Enhanced mental clarity', 'Sustained energy'],
      brewingTemperature: '70-75°C',
      brewingTime: '2-3 minutes',
      servingsPerPackage: 20,
      storageInstructions: 'Store in wooden box, refrigerate after opening',
      isLimitedEdition: true,
      isSubscriptionAvailable: false,
      price: 129.99,
      stock: 15,
      variants: [
        {
          id: 601,
          name: '40g Wooden Box',
          image: '/sounds/picture/product/Hoshino Seichaen.jpg',
          price: 129.99,
          stock: 15,
          sku: 'HSC-001-40',
          weight: 40,
          isAvailable: true,
          dimensions: {
            length: 12,
            width: 12,
            height: 8
          },
          shippingWeight: 0.8,
          discountPercentage: 0
        }
      ],
      features: [
        {
          title: '800-Year Heritage',
          description: 'From one of Japans oldest tea-producing families'
        },
        {
          title: 'Limited Production',
          description: 'Only 500 boxes produced annually'
        }
      ],
      grade: 'Premium',
      harvestDate: 'Spring 2024',
      processingMethod: 'Traditional hand-sorting and stone grinding',
      shelfLife: '18 months',
      allergens: ['None'],
      nutritionalInfo: {
        calories: 6,
        protein: 1.2,
        carbohydrates: 1.1,
        fat: 0,
        fiber: 0.5,
        sugar: 0,
        sodium: 0,
        caffeine: 42
      },
      brewingInstructions: {
        traditional: 'Use 2.5g matcha, 60ml water at 75°C. Whisk slowly in circular motions.',
        modern: 'Dissolve 1.5g in 40ml water, add 120ml warm milk.',
        iced: 'Mix 3g with 40ml hot water, pour over ice with cold water.'
      },
      tasteProfile: {
        sweetness: 3,
        bitterness: 1,
        umami: 5,
        astringency: 2
      },
      sustainability: {
        isEcoFriendly: true,
        packagingRecyclable: true,
        carbonNeutral: true,
        fairTrade: true
      },
      awards: [
        {
          name: 'Master Tea Award',
          year: 2024,
          organization: 'International Tea Masters'
        }
      ],
      tags: ['heritage', 'ultra-premium', 'limited', 'traditional'],
      videoUrl: 'https://example.com/hoshino-preparation',
      faq: [
        {
          question: 'What makes this matcha special?',
          answer: 'This matcha comes from an 800-year-old family tea garden with traditional cultivation methods passed down through generations.'
        }
      ],
      shippingInfo: {
        weight: 0.8,
        dimensions: {
          length: 12,
          width: 12,
          height: 8
        },
        freeShippingThreshold: 100,
        estimatedDeliveryTime: '3-5 business days'
      }
    },
    {
      id: 7,
      name: 'Marukyu Koyamaen Aoarashi',
      description: 'A mid-grade ceremonial matcha with bright green color and refreshing taste. Perfect introduction to premium matcha for newcomers.',
      image: '/sounds/picture/product/Marukyu Koyamaen - Aoarashi.jpg',
      gallery: [
        '/sounds/picture/product/Marukyu Koyamaen - Aoarashi.jpg',
        '/sounds/picture/product/Marukyu Koyamaen - Isuzu.jpg',
        '/sounds/picture/product/Marukyu Koyamaen Wako.jpg'
      ],
      rating: 4.6,
      reviews: 142,
      badge: 'BEGINNER',
      origin: 'Uji, Japan',
      brand: 'Marukyu Koyamaen',
      category: 'Matcha',
      type: 'Powder',
      flavorNotes: ['Fresh', 'Bright', 'Clean'],
      ingredients: ['Second flush tea leaves'],
      weight: 30,
      packaging: 'Aluminum tin',
      caffeineLevel: 'Medium',
      certifications: ['JAS Organic'],
      healthBenefits: ['Antioxidants', 'Energy boost', 'Mental alertness'],
      brewingTemperature: '80-85°C',
      brewingTime: '1-2 minutes',
      servingsPerPackage: 15,
      storageInstructions: 'Store in tin, keep away from heat and light',
      isLimitedEdition: false,
      isSubscriptionAvailable: true,
      price: 35.99,
      stock: 60,
      variants: [
        {
          id: 701,
          name: '30g Tin',
          image: '/sounds/picture/product/Marukyu Koyamaen - Aoarashi.jpg',
          price: 35.99,
          stock: 60,
          sku: 'MKA-001-30',
          weight: 30,
          isAvailable: true,
          dimensions: {
            length: 7,
            width: 7,
            height: 10
          },
          shippingWeight: 0.3,
          isBestSeller: false,
          discountPercentage: 5,
          bulkPricing: [
            { minQuantity: 3, price: 32.99 },
            { minQuantity: 5, price: 29.99 }
          ]
        }
      ],
      features: [
        {
          title: 'Beginner Friendly',
          description: 'Mild flavor perfect for those new to matcha'
        },
        {
          title: 'Versatile Use',
          description: 'Great for both drinking and cooking applications'
        }
      ],
      grade: 'Premium',
      harvestDate: 'Spring 2024',
      processingMethod: 'Stone grinding',
      shelfLife: '12 months',
      allergens: ['None'],
      nutritionalInfo: {
        calories: 4,
        protein: 0.9,
        carbohydrates: 0.8,
        fat: 0,
        fiber: 0.3,
        sugar: 0,
        sodium: 0,
        caffeine: 28
      },
      brewingInstructions: {
        traditional: 'Use 1.5g matcha, 80ml water at 80°C. Whisk vigorously.',
        modern: 'Mix 1g with 200ml water or milk.',
        iced: 'Dissolve 2g in hot water, add ice.'
      },
      tasteProfile: {
        sweetness: 3,
        bitterness: 3,
        umami: 3,
        astringency: 2
      },
      sustainability: {
        isEcoFriendly: true,
        packagingRecyclable: true,
        carbonNeutral: false,
        fairTrade: true
      },
      tags: ['beginner', 'versatile', 'affordable', 'daily'],
      shippingInfo: {
        weight: 0.3,
        dimensions: {
          length: 7,
          width: 7,
          height: 10
        },
        freeShippingThreshold: 100,
        estimatedDeliveryTime: '2-3 business days'
      }
    },
    {
      id: 8,
      name: 'Mugenzou',
      description: 'A rare and exquisite matcha with an extraordinarily smooth texture and deep, complex flavor profile. Limited seasonal availability.',
      image: '/sounds/picture/product/Mugenzou.jpg',
      gallery: [
        '/sounds/picture/product/Mugenzou.jpg',
        '/sounds/picture/product/Shoji No Shiro.jpg',
        '/sounds/picture/product/Marukyu Koyamaen - Yugen.jpg'
      ],
      rating: 4.9,
      reviews: 67,
      badge: 'LIMITED',
      origin: 'Uji, Japan',
      brand: 'Artisanal Collective',
      category: 'Matcha',
      type: 'Powder',
      flavorNotes: ['Silky', 'Profound', 'Ethereal'],
      ingredients: ['Ultra-premium shade-grown leaves'],
      weight: 20,
      packaging: 'Handcrafted ceramic jar',
      caffeineLevel: 'Medium',
      certifications: ['Master Craftsman Seal', 'JAS Organic'],
      healthBenefits: ['Peak antioxidant content', 'Meditation enhancement', 'Pure energy'],
      brewingTemperature: '65-70°C',
      brewingTime: '2-3 minutes',
      servingsPerPackage: 10,
      storageInstructions: 'Store in ceramic jar, handle with silk cloth provided',
      isLimitedEdition: true,
      isSubscriptionAvailable: false,
      price: 199.99,
      stock: 8,
      variants: [
        {
          id: 801,
          name: '20g Ceramic Jar',
          image: '/sounds/picture/product/Mugenzou.jpg',
          price: 199.99,
          stock: 8,
          sku: 'MUG-001-20',
          weight: 20,
          isAvailable: true,
          dimensions: {
            length: 10,
            width: 10,
            height: 15
          },
          shippingWeight: 1.2,
          discountPercentage: 0
        }
      ],
      features: [
        {
          title: 'Artisanal Craft',
          description: 'Handcrafted by master tea artisans using secret techniques'
        },
        {
          title: 'Collectors Item',
          description: 'Comes with certificate of authenticity and ceramic jar'
        }
      ],
      grade: 'Premium',
      harvestDate: 'First Spring Picking 2024',
      processingMethod: 'Secret traditional method',
      shelfLife: '24 months',
      allergens: ['None'],
      nutritionalInfo: {
        calories: 7,
        protein: 1.5,
        carbohydrates: 1.3,
        fat: 0.1,
        fiber: 0.8,
        sugar: 0,
        sodium: 0,
        caffeine: 38
      },
      brewingInstructions: {
        traditional: 'Use 2g matcha, 50ml water at 65°C. Whisk with meditation mindfulness.',
        modern: 'Reserved for traditional preparation only.',
        iced: 'Not recommended for iced preparation.'
      },
      tasteProfile: {
        sweetness: 5,
        bitterness: 1,
        umami: 5,
        astringency: 1
      },
      sustainability: {
        isEcoFriendly: true,
        packagingRecyclable: true,
        carbonNeutral: true,
        fairTrade: true
      },
      awards: [
        {
          name: 'Pinnacle Excellence Award',
          year: 2024,
          organization: 'World Matcha Council'
        }
      ],
      tags: ['artisanal', 'limited', 'collectors', 'masterpiece'],
      shippingInfo: {
        weight: 1.2,
        dimensions: {
          length: 10,
          width: 10,
          height: 15
        },
        freeShippingThreshold: 100,
        estimatedDeliveryTime: '5-7 business days'
      }
    },
    {
      id: 9,
      name: 'Shohokuen Kumo',
      description: 'A classic ceremonial matcha with well-rounded flavor and beautiful emerald color. Represents the perfect balance of tradition and quality.',
      image: '/sounds/picture/product/Shohokuen - Kumo 30g.jpg',
      gallery: [
        '/sounds/picture/product/Shohokuen - Kumo 30g.jpg',
        '/sounds/picture/product/Shohokuen - Iwai 30g.jpg',
        '/sounds/picture/product/Shohokuen - Matsu 30g.jpg'
      ],
      rating: 4.7,
      reviews: 156,
      badge: 'CLASSIC',
      origin: 'Kyoto, Japan',
      brand: 'Shohokuen',
      category: 'Matcha',
      type: 'Powder',
      flavorNotes: ['Balanced', 'Traditional', 'Pure'],
      ingredients: ['Premium shade-grown tea leaves'],
      weight: 30,
      packaging: 'Traditional tin',
      caffeineLevel: 'Medium',
      certifications: ['Traditional Craft Mark', 'JAS Organic'],
      healthBenefits: ['Balanced energy', 'Focus enhancement', 'Antioxidant rich'],
      brewingTemperature: '75-80°C',
      brewingTime: '1.5-2 minutes',
      servingsPerPackage: 15,
      storageInstructions: 'Store in original tin in cool, dry place',
      isLimitedEdition: false,
      isSubscriptionAvailable: true,
      price: 54.99,
      stock: 35,
      variants: [
        {
          id: 901,
          name: '30g Traditional Tin',
          image: '/sounds/picture/product/Shohokuen - Kumo 30g.jpg',
          price: 54.99,
          stock: 35,
          sku: 'SHK-001-30',
          weight: 30,
          isAvailable: true,
          dimensions: {
            length: 8,
            width: 8,
            height: 11
          },
          shippingWeight: 0.4,
          discountPercentage: 0,
          bulkPricing: [
            { minQuantity: 2, price: 51.99 },
            { minQuantity: 4, price: 48.99 }
          ]
        }
      ],
      features: [
        {
          title: 'Traditional Craft',
          description: 'Made using time-honored Kyoto tea-making traditions'
        },
        {
          title: 'Everyday Premium',
          description: 'High quality suitable for daily ceremonial use'
        }
      ],
      grade: 'Ceremonial',
      harvestDate: 'Spring 2024',
      processingMethod: 'Traditional Kyoto method',
      shelfLife: '12 months',
      allergens: ['None'],
      nutritionalInfo: {
        calories: 5,
        protein: 1,
        carbohydrates: 1,
        fat: 0,
        fiber: 0.4,
        sugar: 0,
        sodium: 0,
        caffeine: 32
      },
      brewingInstructions: {
        traditional: 'Use 2g matcha, 70ml water at 75°C. Whisk in "M" pattern.',
        modern: 'Mix 1g with 150ml warm milk for matcha latte.',
        iced: 'Dissolve 2g in warm water, add ice and cold milk.'
      },
      tasteProfile: {
        sweetness: 4,
        bitterness: 2,
        umami: 4,
        astringency: 2
      },
      sustainability: {
        isEcoFriendly: true,
        packagingRecyclable: true,
        carbonNeutral: false,
        fairTrade: true
      },
      tags: ['traditional', 'balanced', 'daily', 'kyoto'],
      shippingInfo: {
        weight: 0.4,
        dimensions: {
          length: 8,
          width: 8,
          height: 11
        },
        freeShippingThreshold: 100,
        estimatedDeliveryTime: '2-3 business days'
      }
    },
    {
      id: 10,
      name: 'Yamamasa Tennouzan',
      description: 'A sophisticated matcha from the legendary Tennouzan region, known for its mineral-rich soil and exceptional tea cultivation conditions.',
      image: '/sounds/picture/product/Yamamasa - Tennouzan.jpg',
      gallery: [
        '/sounds/picture/product/Yamamasa - Tennouzan.jpg',
        '/sounds/picture/product/Yamamasa Matsukaze.jpg',
        '/sounds/picture/product/Yamamasa Ogurayama 30g.jpg'
      ],
      rating: 4.8,
      reviews: 178,
      badge: 'TERROIR',
      origin: 'Tennouzan, Japan',
      brand: 'Yamamasa',
      category: 'Matcha',
      type: 'Powder',
      flavorNotes: ['Mineral', 'Complex', 'Earthy'],
      ingredients: ['Tennouzan terroir tea leaves'],
      weight: 40,
      packaging: 'Premium sealed tin',
      caffeineLevel: 'High',
      certifications: ['Regional Origin Protected', 'JAS Organic'],
      healthBenefits: ['Rich in minerals', 'Sustained energy', 'Enhanced focus'],
      brewingTemperature: '70-75°C',
      brewingTime: '2-2.5 minutes',
      servingsPerPackage: 20,
      storageInstructions: 'Store in cool place, preserve terroir characteristics',
      isLimitedEdition: false,
      isSubscriptionAvailable: true,
      price: 79.99,
      stock: 28,
      variants: [
        {
          id: 1001,
          name: '40g Premium Tin',
          image: '/sounds/picture/product/Yamamasa - Tennouzan.jpg',
          price: 79.99,
          stock: 28,
          sku: 'YMT-001-40',
          weight: 40,
          isAvailable: true,
          dimensions: {
            length: 9,
            width: 9,
            height: 12
          },
          shippingWeight: 0.5,
          discountPercentage: 0,
          bulkPricing: [
            { minQuantity: 2, price: 75.99 },
            { minQuantity: 3, price: 71.99 }
          ]
        }
      ],
      features: [
        {
          title: 'Unique Terroir',
          description: 'From the mineral-rich soils of the sacred Tennouzan region'
        },
        {
          title: 'Complex Profile',
          description: 'Multi-layered flavor reflecting the unique growing environment'
        }
      ],
      grade: 'Premium',
      harvestDate: 'Spring 2024',
      processingMethod: 'Regional traditional method',
      shelfLife: '15 months',
      allergens: ['None'],
      nutritionalInfo: {
        calories: 6,
        protein: 1.1,
        carbohydrates: 1.2,
        fat: 0,
        fiber: 0.5,
        sugar: 0,
        sodium: 0,
        caffeine: 36
      },
      brewingInstructions: {
        traditional: 'Use 2g matcha, 65ml water at 70°C. Whisk to appreciate terroir.',
        modern: 'Mix 1.2g with 180ml warm water for mineral complexity.',
        iced: 'Cold brew method recommended to preserve mineral notes.'
      },
      tasteProfile: {
        sweetness: 3,
        bitterness: 2,
        umami: 4,
        astringency: 3
      },
      sustainability: {
        isEcoFriendly: true,
        packagingRecyclable: true,
        carbonNeutral: true,
        fairTrade: true
      },
      awards: [
        {
          name: 'Regional Excellence Award',
          year: 2024,
          organization: 'Japan Regional Tea Council'
        }
      ],
      tags: ['terroir', 'mineral', 'regional', 'sophisticated'],
      shippingInfo: {
        weight: 0.5,
        dimensions: {
          length: 9,
          width: 9,
          height: 12
        },
        freeShippingThreshold: 100,
        estimatedDeliveryTime: '2-4 business days'
      }
    }
  ],
  displayType: 'grid',
  maxItems: 10,
  sortBy: 'rating',
  category: 'Matcha',
  tags: ['premium', 'ceremonial', 'japanese']
};

export const SERVICES: Services = {
  title: "OUR SERVICES",
  description: "We offer a comprehensive range of services designed to meet all your needs with professionalism and care.",
  services: [
    {
      icon: 'ShoppingBag',
      title: 'RETAIL SALES',
      description: 'Wide selection of quality matcha products for all your needs'
    },
    {
      icon: 'Wrench',
      title: 'REPAIR SERVICES',
      description: 'Professional repair and maintenance services for your matcha equipment'
    },
    {
      icon: 'Truck',
      title: 'DELIVERY',
      description: 'Convenient delivery options for your matcha purchases'
    },
    {
      icon: 'Users',
      title: 'CONSULTATION',
      description: 'Expert advice and personalized recommendations for your matcha journey'
    }
  ]
};

// Export all constants as a single object
export const APP_CONSTANTS: AppConstants = {
  APP_TITLE1,
  APP_TITLE2,
  APP_DESCRIPTION,
  APP_DESCRIPTION2,
  BACKGROUND_IMAGE1,
  BACKGROUND_IMAGE2,
  HERO_PROFILES,
  NAVIGATION_ITEMS,
  SOCIAL_LINKS,
  FEATURED_PRODUCTS,
  SERVICES
}; 
