import DashboardPage from '../../pages/admin/dashboard/DashboardPage';
import ProductsPage from '../../pages/admin/product/ProductsPage';
import UsersPage from '../../pages/admin/account/UsersPage';
import { Navigate } from 'react-router-dom';
import DiscountAdminPage from '../../pages/admin/discount/DiscountAdminPage';

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
    path: 'discounts',
    element: <DiscountAdminPage />,
    title: 'Khuyến mãi'
  },
  // Add more admin routes here as needed
];

export default adminRoutes; 
