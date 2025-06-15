export const APP_TITLE1 = "Quality Matcha, Better Everyday Moments";
export const APP_TITLE2 = "Upgrade Your At-Home Matcha";
export const APP_DESCRIPTION = "The difference is in the details—vibrant color, smooth flavor, and clean energy. Start your day with matcha that makes every sip feel special.";
export const APP_DESCRIPTION2 = "Better matcha means better flavor, better energy, and a better start to your day";
export const BACKGROUND_IMAGE1 = "https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/506458211_122132615270725253_1651286809710190997_n.jpg?stp=dst-jpg_s640x640_tt6&_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=SrzhSauFgLkQ7kNvwFwfO1s&_nc_oc=Adm31Bt5m_6KMZd4ZbR8ept9_EOIRIvt7eygwzrUaZjnX90AjNHO6i2a-duR3DOBERM&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=d-kLeZ9P8FCJuivirry6Ng&oh=00_AfM19nswpzJQ3vGM5JgMYRkAUTtKSZNi0YGqkqX0ejbKSA&oe=68523867";
export const BACKGROUND_IMAGE2 = "https://scontent.fsgn2-10.fna.fbcdn.net/v/t39.30808-6/506468230_122132615432725253_2278882615411259411_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=ORITep6omwkQ7kNvwHbMZnF&_nc_oc=AdnJtMA_Fsu2TwCh8n6E8abCz4qcrnjWIDDN7r408XU8d__CHKE2-ggPNXcZ1DRuvHM&_nc_zt=23&_nc_ht=scontent.fsgn2-10.fna&_nc_gid=SESvmBwtbW1PeH9sfaXxlQ&oh=00_AfNFhbBpe4ZdauZ2-vZWk97Tgv6jGlxwIMVeZiNLlcbs3w&oe=68521DF8";

export const HERO_PROFILES = {
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
      action: "products"
    },
    button2: {
      text: "LEARN MORE",
      action: "about"
    }
  }
};

export const NAVIGATION_ITEMS = [
  { name: 'HOME', id: 'home' },
  { name: 'ABOUT', id: 'about' },
  { name: 'SERVICES', id: 'services' },
  { name: 'CONTACT', id: 'contact' }
];

export const SOCIAL_LINKS = {
  facebook: '#',
  instagram: '#',
  twitter: '#'
};

export const FEATURED_PRODUCTS = {
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
      variants: [
        {
          id: 101,
          name: '30g Tin',
          image: '/sounds/picture/product/Aoi no Homare.jpg',
          price: 45.99,
          stock: 50,
          sku: 'MCH-001-30',
          weight: 30,
          isAvailable: true
        },
        {
          id: 102,
          name: '60g Refill Pack',
          image: '/sounds/picture/product/Marukyu Koyamaen - Aoarashi.jpg',
          price: 79.99,
          stock: 30,
          sku: 'MCH-001-60',
          weight: 60,
          isAvailable: true
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
      ]
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
    }
  ]
};

export const SERVICES = {
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