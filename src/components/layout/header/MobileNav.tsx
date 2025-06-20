import React from 'react';
import { useUser } from '../../../hooks/useUser';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

type MobileNavProps = {
  handleNavigation: (id: string) => void;
};

const MobileNav: React.FC<MobileNavProps> = ({ handleNavigation }) => {
  const { current: user } = useUser();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="md:hidden bg-white/95 backdrop-blur-lg shadow-lg rounded-b-xl mx-2 overflow-hidden">
      <div className="px-4 py-2 space-y-1">
        {['home', 'about', 'products', 'contact'].map((item) => (
          <button
            key={item}
            onClick={() => handleNavigation(item)}
            className="w-full px-4 py-3 text-left text-emerald-700 hover:text-white hover:bg-emerald-600/10 rounded-lg transition-all duration-300 font-medium text-base group mobile-nav-item"
          >
            <span className="relative">
              <span className="absolute inset-0 bg-emerald-100/30 rounded-lg scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"></span>
              <span className="relative z-10">{item.toUpperCase()}</span>
            </span>
          </button>
        ))}
      </div>
      {/* User Info for Mobile */}
      <div className="border-t border-gray-100">
        {isAuthenticated && user ? (
          <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50/70">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0v.75a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75v-.75z" />
              </svg>
            </span>
            <span className="text-emerald-900 font-medium text-sm max-w-[120px] truncate" title={user.name || user.email}>{user.name || user.email}</span>
            <button
              onClick={logout}
              className="ml-auto px-4 py-1.5 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="px-4 py-3 bg-gray-50/70">
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2.5 px-4 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition flex items-center justify-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Login / Register</span>
            </button>
          </div>
        )}
      </div>
      
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
        <p className="text-xs text-gray-500 text-center">Sencha - Pure Japanese Matcha</p>
      </div>
    </div>
  );
};

export default MobileNav; 
