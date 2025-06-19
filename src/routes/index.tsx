import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { useUser } from '../hooks/AcccountContext';
import HomePage from '../pages/home/HomePage';
import ProductPage from '../pages/product/ProductPage';
import ProductDetailPage from '../pages/product-detail/ProductDetailPage';
import ErrorPage from '../pages/error/ErrorPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ProfilePage from '../pages/profile/ProfilePage';
import Layout from '../components/layout/Layout';

// A wrapper for protected routes that require authentication
const ProtectedRoute: React.FC<{ element: React.ReactElement; roles?: string[] }> = ({ 
  element, 
  roles = [] 
}) => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { current: user, isLoading: isUserLoading } = useUser();

  if (isAuthLoading || isUserLoading) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: window.location.pathname }} replace />;
  }

  // Check if user has required roles if any are specified
  if (roles.length > 0 && !roles.some(role => user?.labels?.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
};

// A wrapper for public-only routes (like login/register)
const PublicRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { isLoading: isUserLoading } = useUser();

  if (isAuthLoading || isUserLoading) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  return isAuthenticated ? <Navigate to="/" replace /> : element;
};

const AppRoutes: React.FC = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <ProtectedRoute element={<HomePage />} />,
        },
        {
          path: 'products',
          element: <ProtectedRoute element={<ProductPage />} />,
        },
        {
          path: 'products/:id',
          element: <ProtectedRoute element={<ProductDetailPage />} />,
        },
        // Admin only route example
        // {
        //   path: 'admin',
        //   element: <ProtectedRoute element={<AdminPage />} roles={['admin']} />,
        // },
        {
          path: 'profile',
          element: <ProtectedRoute element={<ProfilePage />} />,
        },
        {
          path: 'auth',
          children: [
            {
              path: 'login',
              element: <PublicRoute element={<LoginPage />} />,
            },
            {
              path: 'register',
              element: <PublicRoute element={<RegisterPage />} />,
            },
          ],
        },
        {
          path: 'products',
          children: [
            {
              index: true,
              element: <ProtectedRoute element={<ProductPage />} />,
            },
            {
              path: ':id',
              element: <ProtectedRoute element={<ProductDetailPage />} />,
            },
          ],
        },
      ],
    },
    {
      path: '/auth',
      element: <Layout />,
      children: [
        {
          path: 'login',
          element: <LoginPage />,
        },
      ],
    },
    {
      path: '*',
      element: <ErrorPage />,
    },
  ]);

  return routes;
};

export default AppRoutes;
