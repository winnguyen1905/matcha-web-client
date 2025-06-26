import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Home, ShoppingCart, User, Package, Settings, Users, Tag } from 'lucide-react';
import { BreadcrumbItem } from '../components/common/Breadcrumb';

// Type for dynamic breadcrumb generators
type BreadcrumbGenerator = (params: Record<string, string | undefined>) => BreadcrumbItem[];

// Dynamic route configurations
const dynamicRouteConfigs: Record<string, BreadcrumbGenerator> = {
  // Product detail page
  '/products/:id': () => [
    { label: 'Home', path: '/', icon: <Home size={16} /> },
    { label: 'Products', path: '/products' },
    { label: 'Product Detail' }
  ],
  
  // Order detail page
  '/orders/:orderId': (params) => [                                                                                               
    { label: 'Home', path: '/', icon: <Home size={16} /> },
    { label: 'My Orders', path: '/orders' },
    { label: params.orderId ? `Order #${params.orderId}` : 'Order Detail' }
  ],
  
  // Order success page
  '/order/success/:orderId': (params) => [
    { label: 'Home', path: '/', icon: <Home size={16} /> },
    { label: 'Checkout', path: '/checkout' },
    { label: 'Order Success' }
  ],
  
  // Admin product detail (if you add it)
  '/admin/products/:id': () => [
    { label: 'Dashboard', path: '/admin', icon: <Home size={16} /> },
    { label: 'Products', path: '/admin/products' },
    { label: 'Product Detail' }
  ],
  
  // Admin order detail
  '/admin/orders/:orderId': (params) => [
    { label: 'Dashboard', path: '/admin', icon: <Home size={16} /> },
    { label: 'Orders', path: '/admin/orders' },
    { label: params.orderId ? `Order #${params.orderId}` : 'Order Detail' }
  ],
  
  // Admin user detail
  '/admin/users/:userId': (params) => [
    { label: 'Dashboard', path: '/admin', icon: <Home size={16} /> },
    { label: 'Users', path: '/admin/users' },
    { label: params.userId ? `User ${params.userId}` : 'User Detail' }
  ],
};

// Static route configurations with icons
const staticRouteConfigs: Record<string, BreadcrumbItem> = {
  // Admin routes
  '/admin': { label: 'Dashboard', icon: <Home size={16} /> },
  '/admin/dashboard': { label: 'Dashboard', icon: <Home size={16} /> },
  '/admin/products': { label: 'Products', icon: <Package size={16} /> },
  '/admin/users': { label: 'Users', icon: <Users size={16} /> },
  '/admin/orders': { label: 'Orders', icon: <ShoppingCart size={16} /> },
  '/admin/discounts': { label: 'Discounts', icon: <Tag size={16} /> },
  '/admin/notifications': { label: 'Notifications' },
  '/admin/settings': { label: 'Settings', icon: <Settings size={16} /> },
  
  // Customer routes
  '/': { label: 'Home', icon: <Home size={16} /> },
  '/products': { label: 'Products', icon: <Package size={16} /> },
  '/about': { label: 'About' },
  '/contact': { label: 'Contact' },
  '/services': { label: 'Services' },
  '/cart': { label: 'Shopping Cart', icon: <ShoppingCart size={16} /> },
  '/checkout': { label: 'Checkout' },
  '/profile': { label: 'Profile', icon: <User size={16} /> },
  '/orders': { label: 'My Orders', icon: <Package size={16} /> },
};

export const useBreadcrumb = (customItems?: BreadcrumbItem[]) => {
  const location = useLocation();
  const params = useParams();
  
  const breadcrumbItems = useMemo(() => {
    // Return custom items if provided
    if (customItems) {
      return customItems;
    }
    
    // Check for dynamic routes first
    const matchedDynamicRoute = Object.keys(dynamicRouteConfigs).find(pattern => {
      const regex = new RegExp('^' + pattern.replace(/:\w+/g, '[^/]+') + '$');
      return regex.test(location.pathname);
    });
    
    if (matchedDynamicRoute) {
      const generator = dynamicRouteConfigs[matchedDynamicRoute];
      return generator(params);
    }
    
    // Fall back to static generation
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Determine if this is an admin route
    const isAdmin = location.pathname.startsWith('/admin');
    
    // Add home/dashboard
    if (isAdmin) {
      breadcrumbs.push(staticRouteConfigs['/admin'] || { label: 'Dashboard', icon: <Home size={16} /> });
    } else {
      breadcrumbs.push(staticRouteConfigs['/'] || { label: 'Home', icon: <Home size={16} /> });
    }
    
    // Build path progressively
    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      
      // Skip if it's the home path we already added
      if ((isAdmin && currentPath === '/admin') || (!isAdmin && currentPath === '/')) {
        return;
      }
      
      const config = staticRouteConfigs[currentPath];
      if (config) {
        breadcrumbs.push({
          ...config,
          path: currentPath
        });
      } else {
        // Fallback: capitalize segment
        breadcrumbs.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
          path: currentPath
        });
      }
    });
    
    return breadcrumbs;
  }, [location.pathname, params, customItems]);
  
  return {
    breadcrumbItems,
    shouldShow: breadcrumbItems.length > 1
  };
};

export default useBreadcrumb; 
