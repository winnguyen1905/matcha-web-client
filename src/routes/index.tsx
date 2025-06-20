import React from 'react';
import { Navigate, useRoutes, Outlet } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from '../components/layout/AdminLayout';
import CustomerLayout from '../components/layout/CustomerLayout';
import ErrorPage from '../pages/error/ErrorPage';
import adminRoutes from './usecases/adminRoutes';
import customerRoutes from './usecases/customerRoutes';
import publicRoutes from './usecases/publicRoutes';
import HomePage from '../pages/home/HomePage';
import ProductPage from '../pages/product/ProductPage';
import ProductDetailPage from '../pages/product-detail/ProductDetailPage';

// Main routes configuration
const routes = [
  // Admin routes with layout
  {
    path: '/admin',
    element: (
      <ProtectedRoute element={<AdminLayout />} />
    ),
    children: [
      ...adminRoutes,
      {
        path: '*',
        element: <Navigate to="dashboard" replace />
      }
    ]
  },

  // Public routes
  ...publicRoutes,
  // Main layout wrapper for all customer-facing routes
  {
    path: '/',
    element: (
      <CustomerLayout>
        <Outlet />
      </CustomerLayout>
    ),
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'products',
        element: <ProductPage />
      },
      {
        path: 'products/:id',
        element: <ProductDetailPage />
      },
      // Protected routes
      ...customerRoutes,

      // 404 route - only for / paths
      {
        path: '*',
        element: <ErrorPage />
      }
    ]
  },

  // Catch-all 404 route for non-/ paths
  {
    path: '*',
    element: <ErrorPage />
  }
];

const AppRoutes: React.FC = () => {
  return useRoutes(routes);
};

export default AppRoutes;
