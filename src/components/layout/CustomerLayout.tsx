import React from 'react';
import Header from './header/Header';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './footer/Footer';
import FloatingActionMenu from '../common/FloatingActionMenu';
import Breadcrumb from '../common/Breadcrumb';

interface LayoutProps {
  children?: React.ReactNode;
}

const CustomerLayout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const showBreadcrumb = location.pathname !== '/'; // Don't show on homepage

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Add top spacing for non-home pages to account for fixed header */}
        <div className={showBreadcrumb ? "pt-20 md:pt-24" : ""}>
          {showBreadcrumb && (
            <div className="bg-gradient-to-r from-emerald-50/80 via-green-50/80 to-teal-50/80 border-b border-emerald-200/30">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                <Breadcrumb variant="customer" />
              </div>
            </div>
          )}
          <div>
            {children ?? <Outlet />}
          </div>
        </div>
      </main>
      <Footer />
      <FloatingActionMenu />
    </div>
  );
};

export default CustomerLayout;
