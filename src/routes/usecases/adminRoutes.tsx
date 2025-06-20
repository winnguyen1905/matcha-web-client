import DashboardPage from '../../pages/admin/DashboardPage';
import ProductsPage from '../../pages/admin/ProductsPage';
import UsersPage from '../../pages/admin/UsersPage';
import { Navigate } from 'react-router-dom';

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
  // Add more admin routes here as needed
];

export default adminRoutes; 