import ProfilePage from '../../pages/profile/ProfilePage';
import CartPage from '../../pages/cart/CartPage';
import OrdersPage from '../../pages/orders/OrdersPage';
import ProtectedRoute from '../components/ProtectedRoute';

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
    path: 'orders',
    element: <ProtectedRoute element={<OrdersPage />} />
  },
];

export default customerRoutes; 
