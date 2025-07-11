import LoginPage from '../../pages/auth/LoginPage';
import RegisterPage from '../../pages/auth/RegisterPage';
import UnauthorizedPage from '../../pages/error/UnauthorizedPage';
import PublicRoute from '../components/PublicRoute';

const publicRoutes = [
  
  {
    path: '/login',
    element: <PublicRoute element={<LoginPage />} />
  },
  {
    path: '/register',
    element: <PublicRoute element={<RegisterPage />} />
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />
  }
];

export default publicRoutes; 
