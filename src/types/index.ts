export interface NavigationItem {
  name: string;
  id: string;
}

export interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  rating: number;
  reviews: number;
  badge: string;
}

export interface SocialLink {
  facebook: string;
  instagram: string;
  twitter: string;
} 