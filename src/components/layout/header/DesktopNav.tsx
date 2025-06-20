import React from 'react';

type DesktopNavProps = {
  isScrolled: boolean;
  handleNavigation: (id: string) => void;
};

const DesktopNav: React.FC<DesktopNavProps> = ({ isScrolled, handleNavigation }) => (
  <nav className="hidden md:flex space-x-6 lg:space-x-10">
    {[
      { name: 'HOME', id: 'home' },
      { name: 'ABOUT', id: 'about' },
      { name: 'PRODUCTS', id: 'products' },
      // { name: 'SERVICES', id: 'services' },
      { name: 'CONTACT', id: 'contact' }
    ].map((item) => (
      <button
        key={item.name}
        onClick={() => handleNavigation(item.id)}
        className={`relative nav-item transition-colors duration-200 font-semibold text-sm md:text-base tracking-wider group px-3 py-2 rounded-lg overflow-hidden ${
          isScrolled 
            ? 'text-emerald-800 hover:text-emerald-600' 
            : 'text-emerald-200 hover:text-emerald-100'
        }`}
        tabIndex={0}
      >
        {/* Glow effect for GSAP animation */}
        <span className={`nav-glow absolute inset-0 rounded-lg opacity-0 ${
          isScrolled
            ? 'bg-gradient-to-r from-emerald-100/40 via-teal-100/40 to-green-100/40'
            : 'bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-green-400/20'
        }`}></span>
        <span className="nav-text relative z-10">{item.name}</span>
        <span className={`absolute left-0 bottom-0 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-full group-focus:w-full ${
          isScrolled
            ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600'
            : 'bg-gradient-to-r from-emerald-300 via-teal-300 to-green-300'
        }`}></span>
      </button>
    ))}
  </nav>
);

export default DesktopNav; 
