import React from 'react';
import { OrdersProvider } from '../../hooks/Order';
import { TaxProvider } from '../../hooks/Tax';
import { DiscountsProvider } from '../../hooks/Discount';

interface CheckoutProvidersProps {
  children: React.ReactNode;
}

export const CheckoutProviders: React.FC<CheckoutProvidersProps> = ({ children }) => {
  return (
    <OrdersProvider>
      <TaxProvider>
        <DiscountsProvider>
          {children}
        </DiscountsProvider>
      </TaxProvider>
    </OrdersProvider>
  );
};
