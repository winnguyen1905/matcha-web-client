import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import HomePage from '../pages/home/HomePage';
import ProductPage from '../pages/product/ProductPage';
import ProductDetailPage from '../pages/product-detail/ProductDetailPage';
import ErrorPage from '../pages/error/ErrorPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import Layout from '../components/layout/Layout';

// A wrapper for protected routes
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return isAuthenticated ? element : <Navigate to="/auth/login" replace />;
};

// A wrapper for public-only routes (like login/register)
const PublicRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
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
