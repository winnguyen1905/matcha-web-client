import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24 px-4 md:px-6 lg:px-8">
          {/* Logo */}
          <div
            className="flex-shrink-0 cursor-pointer group flex items-center space-x-3"
            onClick={() => scrollToSection('home')}
          >
            <div className="relative">
              {/* Glow effect */}
              <span className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur opacity-20 group-hover:opacity-30 transition-all duration-300 group-hover:duration-200"></span>
              {/* Logo with white background */}
              <div className="relative bg-white/80 rounded-full p-1.5 group-hover:bg-white/90 transition-all duration-300">
                <img
                  src="/sounds/picture/logo/logo.png"
                  alt="Sencha Logo"
                  className="h-12 w-12 md:h-14 md:w-14 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
            <span className="relative text-lg md:text-xl font-bold tracking-wider font-serif italic">
              <span className="absolute inset-0 bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent filter drop-shadow-[0_0_8px_rgba(110,231,183,0.6)]">
                SENCHA
              </span>
              <span className="text-white/90 hover:text-white transition-colors duration-300">
                SENCHA
              </span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 lg:space-x-10">
            {[
              { name: 'HOME', id: 'home' },
              { name: 'ABOUT', id: 'about' },
              { name: 'PRODUCTS', id: 'products' },
              { name: 'SERVICES', id: 'services' },
              { name: 'CONTACT', id: 'contact' }
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className="relative text-white hover:text-blue-400 transition-colors duration-200 font-medium text-sm md:text-base tracking-wider group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-blue-400 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg shadow-lg rounded-b-xl mx-2 overflow-hidden">
            <div className="px-4 py-2 space-y-1">
              {[
                { name: 'HOME', id: 'home', icon: '🏠' },
                { name: 'ABOUT', id: 'about', icon: 'ℹ️' },
                { name: 'PRODUCTS', id: 'products', icon: '🍵' },
                { name: 'SERVICES', id: 'services', icon: '✨' },
                { name: 'CONTACT', id: 'contact', icon: '✉️' }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.id)}
                  className="group flex items-center w-full px-4 py-3 text-gray-800 hover:text-emerald-600 hover:bg-emerald-50/80 rounded-lg transition-all duration-200 ease-out font-medium text-base"
                >
                  <span className="mr-3 text-lg opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="relative">
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </button>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
              <p className="text-xs text-gray-500 text-center">Sencha - Pure Japanese Matcha</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;