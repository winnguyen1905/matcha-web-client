import React, { Suspense, lazy } from 'react';
import { Navigate, useRoutes, Outlet } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from '../components/layout/AdminLayout';
import CustomerLayout from '../components/layout/CustomerLayout';
import ErrorPage from '../pages/error/ErrorPage';
import adminRoutes from './usecases/adminRoutes';
import customerRoutes from './usecases/customerRoutes';
import publicRoutes from './usecases/publicRoutes';
import HomePage from '../pages/home/HomePage';
import { CustomerProviders } from '../components/providers/CustomerProviders';
import { CheckoutProviders } from '../components/providers/CheckoutProviders';

// Lazy load heavy components
const ProductPage = lazy(() => import('../pages/product/ProductPage'));
const ProductDetailPage = lazy(() => import('../pages/product-detail/ProductDetailPage'));
const CartPage = lazy(() => import('../pages/cart/CartPage'));
const CheckoutPage = lazy(() => import('../pages/checkout/CheckoutPage'));

// Loading component
const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
    <CircularProgress />
  </Box>
);

// Customer routes that need products
const CustomerProductRoutes = () => (
  <CustomerProviders>
    <Outlet />
  </CustomerProviders>
);

// Checkout routes that need order/tax/discount providers
const CheckoutRoutes = () => (
  <CheckoutProviders>
    <Outlet />
  </CheckoutProviders>
);

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
      
      // Product routes with providers
      {
        path: 'products',
        element: <CustomerProductRoutes />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <ProductPage />
              </Suspense>
            )
          },
          {
            path: ':id',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <ProductDetailPage />
              </Suspense>
            )
          }
        ]
      },

      // Cart route (needs basic providers)
      {
        path: 'cart',
        element: (
          <CustomerProviders>
            <Suspense fallback={<LoadingFallback />}>
              <CartPage />
            </Suspense>
          </CustomerProviders>
        )
      },

      // Checkout routes (needs all commerce providers)
      {
        path: 'checkout',
        element: <CheckoutRoutes />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <CheckoutPage />
              </Suspense>
            )
          }
        ]
      },

      // Other protected routes
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
