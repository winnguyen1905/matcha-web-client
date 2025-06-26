import ProfilePage from '../../pages/profile/ProfilePage';
import CartPage from '../../pages/cart/CartPage';
import OrdersPage from '../../pages/order/OrdersPage';
import CheckoutPage from '../../pages/checkout/CheckoutPage';
import OrderSuccessPage from '../../pages/order/OrderSuccessPage';
import ProtectedRoute from '../components/ProtectedRoute';
import OrderDetailPage from '../../pages/order/OrderDetailPage';

const customerRoutes = [
  {
    path: 'profile',
    element: <ProtectedRoute element={<ProfilePage />} />
  },
  {
    path: 'cart',
    element: <ProtectedRoute element={<CartPage />} />
  },
  {
    path: 'checkout',
    element: <ProtectedRoute element={<CheckoutPage />} />
  },
  {
    path: 'orders',
    element: <ProtectedRoute element={<OrdersPage />} />
  },
  {
    path: 'orders/:orderId',
    element: <ProtectedRoute element={<OrderDetailPage />} />
  },
  {
    path: 'order/success/:orderId',
    element: <ProtectedRoute element={<OrderSuccessPage />} />
  },
];

export default customerRoutes; 
