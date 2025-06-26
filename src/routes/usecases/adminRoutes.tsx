import React, { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import DashboardPage from '../../pages/admin/dashboard/DashboardPage';
import ProductsPage from '../../pages/admin/product/ProductsPage';
import UsersPage from '../../pages/admin/account/UsersPage';
import DiscountAdminPage from '../../pages/admin/discount/DiscountAdminPage';

// Lazy load the heavy AdminOrder page
const AdminOrderPage = lazy(() => import('../../pages/admin/order/AdminOrder'));

// Loading component for admin pages
const AdminLoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
    <CircularProgress />
  </Box>
);

const adminRoutes = [
  {
    path: '',
    element: <Navigate to="dashboard" replace />
  },
  {
    path: 'dashboard',
    element: <DashboardPage />,
    title: 'Tổng quan'
  },
  {
    path: 'products',
    element: <ProductsPage />,
    title: 'Sản phẩm'
  },
  {
    path: 'users',
    element: <UsersPage />,
    title: 'Người dùng'
  },
  {
    path: 'orders',
    element: (
      <Suspense fallback={<AdminLoadingFallback />}>
        <AdminOrderPage />
      </Suspense>
    ),
    title: 'Đơn hàng'
  },
  {
    path: 'discounts',
    element: <DiscountAdminPage />,
    title: 'Khuyến mãi'
  },
  // Add more admin routes here as needed
];

export default adminRoutes; 
