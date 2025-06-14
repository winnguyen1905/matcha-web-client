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
      image: '/sounds/picture/review/Aoi no Homare.jpg',
      rating: 4.9,
      reviews: 156,
      badge: 'BESTSELLER',
      origin: 'Uji, Japan'
    },
    {
      id: 2,
      name: 'Hoshino Seichaen',
      image: '/sounds/picture/review/Hoshino Seichaen.jpg',
      rating: 4.8,
      reviews: 124,
      badge: 'POPULAR',
      origin: 'Yame, Japan'
    },
    {
      id: 3,
      name: 'Itoen Hana no En',
      image: '/sounds/picture/review/Itoen Hana no En.jpg',
      rating: 4.7,
      reviews: 98,
      badge: 'NEW',
      origin: 'Shizuoka, Japan'
    },
    {
      id: 4,
      name: 'Marykyu Koyamaen - Kinrin',
      image: '/sounds/picture/review/Marykyu Koyamaen - Kinrin.jpg',
      rating: 4.9,
      reviews: 187,
      badge: 'PREMIUM',
      origin: 'Uji, Japan'
    },
    {
      id: 5,
      name: 'Mugenzou',
      image: '/sounds/picture/review/Mugenzou.jpg',
      rating: 4.8,
      reviews: 112,
      badge: 'LIMITED',
      origin: 'Kyoto, Japan'
    },
    {
      id: 6,
      name: 'Shoji No Shiro',
      image: '/sounds/picture/review/Shoji No Shiro.jpg',
      rating: 4.7,
      reviews: 94,
      badge: 'FEATURED',
      origin: 'Nishio, Japan'
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