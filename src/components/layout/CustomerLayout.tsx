import React from 'react';
import Header from './header/Header';
import { Outlet } from 'react-router-dom';
import Footer from './footer/Footer';
import FloatingActionMenu from '../common/FloatingActionMenu';

interface LayoutProps {
  children?: React.ReactNode;
}

const CustomerLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children ?? <Outlet />}</main>
      <Footer />
      <FloatingActionMenu />
    </div>
  );
};

export default CustomerLayout;
