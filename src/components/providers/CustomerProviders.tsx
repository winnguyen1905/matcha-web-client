import React from 'react';
import { ProductsProvider } from '../../hooks/Product';

interface CustomerProvidersProps {
  children: React.ReactNode;
}

export const CustomerProviders: React.FC<CustomerProvidersProps> = ({ children }) => {
  return (
    <ProductsProvider>
      {children}
    </ProductsProvider>
  );
};
