import React from 'react';
import { OrdersProvider } from '../../hooks/Order';
import { ProductsProvider } from '../../hooks/Product';
import { DiscountsProvider } from '../../hooks/Discount';
import { TaxProvider } from '../../hooks/Tax';

interface AdminProvidersProps {
  children: React.ReactNode;
}

export const AdminProviders: React.FC<AdminProvidersProps> = ({ children }) => {
  return (
    <OrdersProvider>
      <ProductsProvider>
        <DiscountsProvider>
          <TaxProvider>
            {children}
          </TaxProvider>
        </DiscountsProvider>
      </ProductsProvider>
    </OrdersProvider>
  );
};
