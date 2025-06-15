import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Enhanced GSAP hover animations for desktop nav items
  useLayoutEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('.nav-item');

    const enter = (el: HTMLElement): void => {
      // Enhanced hover effect with multiple animations
      const tl = gsap.timeline();
      tl.to(el, { 
        y: -4, 
        scale: 1.08, 
        duration: 0.3, 
        ease: 'power3.out' 
      })
      .to(el.querySelector('.nav-glow'), {
        opacity: 0.6,
        scale: 1.2,
        duration: 0.3,
        ease: 'power2.out'
      }, 0)
      .to(el.querySelector('.nav-text'), {
        textShadow: '0 0 8px rgba(16, 185, 129, 0.4)',
        color: '#065F46',
        duration: 0.3,
        ease: 'power2.out'
      }, 0);

      // Tea leaf drop effect
      if (getComputedStyle(el).position === 'static') {
        (el as HTMLElement).style.position = 'relative';
      }
      const leaf = document.createElement('span');
      leaf.className = 'leaf-drop';
      el.appendChild(leaf);
      gsap.set(leaf, { position: 'absolute', top: '-8px', left: '50%', xPercent: -50, width: 6, height: 3, borderRadius: '9999px', background: 'linear-gradient(to right, #059669, #065f46)', rotate: -30, opacity: 1 });
      gsap.to(leaf, { y: 20, rotation: 30, opacity: 0, duration: 0.9, ease: 'power1.in', onComplete: () => leaf.remove() });
    };

    const leave = (el: HTMLElement): void => {
      const tl = gsap.timeline();
      tl.to(el, { 
        y: 0, 
        scale: 1, 
        duration: 0.4, 
        ease: 'power3.inOut' 
      })
      .to(el.querySelector('.nav-glow'), {
        opacity: 0,
        scale: 1,
        duration: 0.4,
        ease: 'power2.inOut'
      }, 0)
      .to(el.querySelector('.nav-text'), {
        textShadow: '0 0 0px rgba(16, 185, 129, 0)',
        color: '#059669',
        duration: 0.4,
        ease: 'power2.inOut'
      }, 0);

      // Tea leaf drop effect
      if (getComputedStyle(el).position === 'static') {
        (el as HTMLElement).style.position = 'relative';
      }
      const leaf = document.createElement('span');
      leaf.className = 'leaf-drop';
      el.appendChild(leaf);
      gsap.set(leaf, { position: 'absolute', top: '-8px', left: '50%', xPercent: -50, width: 6, height: 3, borderRadius: '9999px', background: 'linear-gradient(to right, #059669, #065f46)', rotate: -30, opacity: 1 });
      gsap.to(leaf, { y: 20, rotation: 30, opacity: 0, duration: 0.9, ease: 'power1.in', onComplete: () => leaf.remove() });
    };

    items.forEach((el: HTMLElement) => {
      const onEnter = () => enter(el);
      const onLeave = () => leave(el);
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
      const onClick = () => enter(el);
      el.addEventListener('click', onClick);

      // Store cleanup on element for later removal
      (el as any)._enter = onEnter;
      (el as any)._leave = onLeave;
      (el as any)._click = onClick;
    });

    return () => {
      items.forEach((el: HTMLElement) => {
        if ((el as any)._enter) el.removeEventListener('mouseenter', (el as any)._enter);
        if ((el as any)._leave) el.removeEventListener('mouseleave', (el as any)._leave);
        if ((el as any)._click) el.removeEventListener('click', (el as any)._click);
      });
    };
  }, []);

  // GSAP animations for mobile menu items
  useLayoutEffect(() => {
    if (isMobileMenuOpen) {
      const mobileItems = document.querySelectorAll<HTMLElement>('.mobile-nav-item');
      
      // Animate mobile menu items in
      gsap.fromTo(mobileItems, 
        {
          x: -50,
          opacity: 0,
          rotationY: -15
        },
        {
          x: 0,
          opacity: 1,
          rotationY: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out'
        }
      );

      // Setup hover animations for mobile items
      mobileItems.forEach((el: HTMLElement) => {
        const enterMobile = () => {
          const tl = gsap.timeline();
          tl.to(el, {
            x: 8,
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out'
          })
          .to(el.querySelector('.mobile-icon'), {
            scale: 1.2,
            rotation: 5,
            duration: 0.3,
            ease: 'back.out(1.2)'
          }, 0)
          .to(el.querySelector('.mobile-text'), {
            x: 4,
             color: '#065F46',
            duration: 0.3,
            ease: 'power2.out'
          }, 0);

      // Tea leaf drop effect
      if (getComputedStyle(el).position === 'static') {
        (el as HTMLElement).style.position = 'relative';
      }
      const leaf = document.createElement('span');
      leaf.className = 'leaf-drop';
      el.appendChild(leaf);
      gsap.set(leaf, { position: 'absolute', top: '-8px', left: '50%', xPercent: -50, width: 6, height: 3, borderRadius: '9999px', background: 'linear-gradient(to right, #059669, #065f46)', rotate: -30, opacity: 1 });
      gsap.to(leaf, { y: 20, rotation: 30, opacity: 0, duration: 0.9, ease: 'power1.in', onComplete: () => leaf.remove() });
        };

        const leaveMobile = () => {
          const tl = gsap.timeline();
          tl.to(el, {
            x: 0,
            scale: 1,
            duration: 0.4,
            ease: 'power2.inOut'
          })
          .to(el.querySelector('.mobile-icon'), {
            scale: 1,
            rotation: 0,
            duration: 0.4,
            ease: 'power2.inOut'
          }, 0)
          .to(el.querySelector('.mobile-text'), {
            x: 0,
            duration: 0.4,
            ease: 'power2.inOut'
          }, 0);

      // Tea leaf drop effect
      if (getComputedStyle(el).position === 'static') {
        (el as HTMLElement).style.position = 'relative';
      }
      const leaf = document.createElement('span');
      leaf.className = 'leaf-drop';
      el.appendChild(leaf);
      gsap.set(leaf, { position: 'absolute', top: '-8px', left: '50%', xPercent: -50, width: 6, height: 3, borderRadius: '9999px', background: 'linear-gradient(to right, #059669, #065f46)', rotate: -30, opacity: 1 });
      gsap.to(leaf, { y: 20, rotation: 30, opacity: 0, duration: 0.9, ease: 'power1.in', onComplete: () => leaf.remove() });
        };

        el.addEventListener('mouseenter', enterMobile);
        el.addEventListener('mouseleave', leaveMobile);
        
        // Store for cleanup
        (el as any)._enterMobile = enterMobile;
        (el as any)._leaveMobile = leaveMobile;
      });
    }

    return () => {
      const mobileItems = document.querySelectorAll<HTMLElement>('.mobile-nav-item');
      mobileItems.forEach((el: HTMLElement) => {
        if ((el as any)._enterMobile && (el as any)._leaveMobile) {
          el.removeEventListener('mouseenter', (el as any)._enterMobile);
          el.removeEventListener('mouseleave', (el as any)._leaveMobile);
        }
      });
    };
  }, [isMobileMenuOpen]);

  const handleNavigation = (id: string): void => {
    setIsMobileMenuOpen(false);
    switch (id) {
      case 'home':
        navigate('/');
        break;
      case 'about':
        navigate('/about');
        break;
      case 'products':
        navigate('/products');
        break;
      case 'services':
        navigate('/services');
        break;
      case 'contact':
        navigate('/contact');
        break;
      default:
        scrollToSection(id);
    }
  };

  const scrollToSection = (sectionId: string): void => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-gradient-to-r from-emerald-50/90 via-green-50/90 to-teal-100/90 backdrop-blur-md shadow-lg shadow-emerald-200/40' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">

            {/* Enhanced Logo Container - Refactored for Header */}
            <div
              className="flex-shrink-0 cursor-pointer group flex items-center space-x-3 relative"
              onClick={() => navigate('/')}
            >
              {/* Floating Tea Leaves - Scaled for Header */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Tea Leaf 1 */}
                <div className="absolute -top-6 -left-4 w-4 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transform rotate-12 opacity-60 group-hover:opacity-80 transition-all duration-500 group-hover:translate-y-1 group-hover:rotate-45">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-emerald-400 rounded-full transform scale-75 opacity-80"></div>
                  <div className="absolute top-1/2 left-1/2 w-px h-1.5 bg-emerald-600 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>

                {/* Tea Leaf 2 */}
                <div className="absolute -top-3 right-1 w-3 h-1.5 bg-gradient-to-r from-teal-400 to-green-500 rounded-full transform -rotate-45 opacity-50 group-hover:opacity-70 transition-all duration-700 group-hover:translate-x-1 group-hover:-rotate-12">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-300 to-green-400 rounded-full transform scale-75 opacity-80"></div>
                  <div className="absolute top-1/2 left-1/2 w-px h-1 bg-teal-600 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>

                {/* Tea Leaf 3 */}
                <div className="absolute bottom-1 -left-5 w-3 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transform rotate-75 opacity-40 group-hover:opacity-60 transition-all duration-600 group-hover:-translate-y-1 group-hover:rotate-90">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-300 to-teal-400 rounded-full transform scale-75 opacity-80"></div>
                  <div className="absolute top-1/2 left-1/2 w-px h-1 bg-emerald-600 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>

                {/* Tea Leaf 4 */}
                <div className="absolute -bottom-4 right-6 w-4 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transform -rotate-30 opacity-45 group-hover:opacity-65 transition-all duration-800 group-hover:translate-y-1 group-hover:-rotate-60">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-emerald-400 rounded-full transform scale-75 opacity-80"></div>
                  <div className="absolute top-1/2 left-1/2 w-px h-1.5 bg-green-600 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>

                {/* Tea Leaf 5 */}
                <div className="absolute top-6 left-8 w-3 h-1.5 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full transform rotate-105 opacity-35 group-hover:opacity-55 transition-all duration-900 group-hover:translate-x-1 group-hover:rotate-135">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-300 to-emerald-400 rounded-full transform scale-75 opacity-80"></div>
                  <div className="absolute top-1/2 left-1/2 w-px h-1 bg-teal-600 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
              </div>

              <div className="relative">
                {/* Enhanced Glow effect - Scaled for Header */}
                <span className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-all duration-300 group-hover:duration-200 animate-pulse"></span>

                {/* Secondary glow for depth */}
                <span className="absolute -inset-0.5 bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 rounded-xl blur-md opacity-15 group-hover:opacity-30 transition-all duration-300"></span>

                {/* Logo with curved edges and enhanced styling */}
                <div className="relative bg-gradient-to-br from-white/85 via-white/80 to-white/75 rounded-2xl p-1.5 group-hover:bg-gradient-to-br group-hover:from-white/90 group-hover:via-white/85 group-hover:to-white/80 transition-all duration-300 shadow-xl group-hover:shadow-emerald-500/20 border border-white/30">
                  {/* Inner curved container */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-0.5 group-hover:from-emerald-100 group-hover:to-teal-100 transition-all duration-300">
                    <img
                      src="/sounds/picture/logo/logo.png"
                      alt="Sencha Logo"
                      className="h-12 w-12 md:h-14 md:w-14 transition-transform duration-300 group-hover:scale-105 rounded-lg object-cover"
                      style={{
                        filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.15)) brightness(1.05) contrast(1.1)',
                      }}
                    />
                  </div>
                </div>

                {/* Floating particles around logo - Scaled for Header */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-emerald-400 rounded-full opacity-60 animate-ping"></div>
                  <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-teal-400 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute top-2 left-0.5 w-px h-px bg-green-400 rounded-full opacity-70 animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>

              {/* Enhanced Text with improved effects */}
              <span className="relative text-lg md:text-xl font-bold tracking-wider font-serif italic select-none">
                {/* Animated gradient text background - lighter */}
                <span className="absolute inset-0 animate-gradient-x bg-gradient-to-r from-green-200 via-emerald-200 to-teal-200 bg-[length:200%_200%] bg-clip-text text-transparent filter drop-shadow-[0_0_6px_rgba(110,231,183,0.25)] pointer-events-none">
                  SENCHA
                </span>
                {/* Main text with lighter color */}
                <span className="text-emerald-400 group-hover:text-emerald-500 transition-colors duration-300 relative drop-shadow-[0_1px_2px_rgba(110,231,183,0.12)] group-hover:drop-shadow-[0_2px_4px_rgba(110,231,183,0.18)]">
                  SENCHA
                </span>
                {/* Subtle underline effect - lighter */}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-200/70 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full"></span>
              </span>

              {/* Steam effect - Scaled for Header */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-50 transition-opacity duration-500">
                <div className="relative">
                  <div className="w-0.5 h-4 bg-gradient-to-t from-transparent via-white/20 to-transparent rounded-full animate-pulse transform rotate-3"></div>
                  <div className="absolute -left-0.5 w-0.5 h-3 bg-gradient-to-t from-transparent via-white/15 to-transparent rounded-full animate-pulse transform -rotate-2" style={{ animationDelay: '0.3s' }}></div>
                  <div className="absolute left-0.5 w-0.5 h-3.5 bg-gradient-to-t from-transparent via-white/18 to-transparent rounded-full animate-pulse transform rotate-1" style={{ animationDelay: '0.6s' }}></div>
                </div>
              </div>
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

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-emerald-800 hover:text-emerald-600 transition-colors duration-200"
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
                    onClick={() => handleNavigation(item.id)}
                    className="mobile-nav-item group flex items-center w-full px-4 py-3 text-gray-800 hover:text-emerald-600 hover:bg-emerald-50/80 rounded-lg transition-all duration-200 ease-out font-medium text-base overflow-hidden relative"
                  >
                    <span className="mobile-icon mr-3 text-lg opacity-70 group-hover:opacity-100 transition-opacity relative z-10">
                      {item.icon}
                    </span>
                    <span className="mobile-text relative z-10">
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

      {/* Custom CSS for gradient animation */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </>
  );
};

export default Header;
