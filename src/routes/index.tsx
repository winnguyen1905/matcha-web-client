import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/home/HomePage';
import ProductPage from '../pages/product/ProductPage';
import ProductDetailPage from '../pages/product-detail/ProductDetailPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      {/* Add more routes here as needed */}
    </Routes>
  );
};

export default AppRoutes;