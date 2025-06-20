import LoginPage from '../../pages/auth/LoginPage';
import RegisterPage from '../../pages/auth/RegisterPage';
import HomePage from '../../pages/home/HomePage';
import ProductPage from '../../pages/product/ProductPage';
import ProductDetailPage from '../../pages/product-detail/ProductDetailPage';
import PublicRoute from '../components/PublicRoute';

const publicRoutes = [
  
  {
    path: '/login',
    element: <PublicRoute element={<LoginPage />} />
  },
  {
    path: '/register',
    element: <PublicRoute element={<RegisterPage />} />
  }
];

export default publicRoutes; 
