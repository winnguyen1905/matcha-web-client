import React from 'react';
import Header from './Header';
import Footer from './Footer';
import FloatingActionMenu from '../common/FloatingActionMenu';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>{children}</main>
      <Footer />
      <FloatingActionMenu />
    </div>
  );
};

export default Layout;