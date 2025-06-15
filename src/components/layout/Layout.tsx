import React from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import FloatingActionMenu from '../common/FloatingActionMenu';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children ?? <Outlet />}</main>
      <Footer />
      <FloatingActionMenu />
    </div>
  );
};

export default Layout;
