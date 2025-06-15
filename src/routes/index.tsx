import React from 'react';
import { useRoutes } from 'react-router-dom';
import HomePage from '../pages/home/HomePage';
import ProductPage from '../pages/product/ProductPage';
import ProductDetailPage from '../pages/product-detail/ProductDetailPage';
import ErrorPage from '../pages/error/ErrorPage';
import LoginPage from '../pages/auth/LoginPage';
import Layout from '../components/layout/Layout';

const AppRoutes: React.FC = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'products',
          children: [
            {
              index: true,
              element: <ProductPage />,
            },
            {
              path: ':id',
              element: <ProductDetailPage />,
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
