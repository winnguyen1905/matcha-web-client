import React, { useEffect, useRef } from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';

// A safe wrapper around useRouteError that returns null if used outside a data router
const safeUseRouteError = () => {
  try {
    return useRouteError();
  } catch (err) {
    return null;
  }
};
import { gsap } from 'gsap';

// Type definitions for better TypeScript support
interface RouteError {
  status?: number;
  statusText?: string;
  message?: string;
  data?: any;
}

interface ErrorPageProps {
  className?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ className = '' }) => {
  const error = safeUseRouteError() as RouteError | null;
  
  // Refs for GSAP animations
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  // Error message logic with proper typing
  const getErrorMessage = (): string => {
    // 1) Handle standard router errors
    if (error && isRouteErrorResponse(error)) {
      // `statusText` is `string | undefined`, so use `??` to safely fall back
      return error.statusText ?? `Error ${error.status ?? 'Unknown'}`;
    }

    // 2) Handle custom `RouteError` objects
    const routeError = error as RouteError | null;
    if (routeError?.message) {
      // At this point `message` is guaranteed to be a string
      return routeError.message;
    }

    // 3) Fallback for everything else
    return 'An unexpected error occurred';
  };

  const getErrorCode = (): string => {
    if (error && isRouteErrorResponse(error) && error.status) {
      return error.status.toString();
    }
    return '500';
  };

  useEffect(() => {
    const tl = gsap.timeline();
    
    // Set initial states
    gsap.set([titleRef.current, subtitleRef.current, buttonRef.current], {
      opacity: 0,
      y: 30
    });
    
    gsap.set(iconRef.current, {
      opacity: 0,
      scale: 0,
      rotation: -180
    });

    gsap.set(containerRef.current, {
      opacity: 0,
      scale: 0.8
    });

    // Create floating particles
    if (particlesRef.current) {
      const particles = Array.from({ length: 20 }, (_, i) => {
        const particle = document.createElement('div');
        particle.className = 'absolute w-2 h-2 bg-red-300 rounded-full opacity-30';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particlesRef.current?.appendChild(particle);
        return particle;
      });

      // Animate particles
      particles.forEach((particle, i) => {
        gsap.to(particle, {
          y: `random(-50, 50)`,
          x: `random(-50, 50)`,
          duration: `random(2, 4)`,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.1
        });
      });
    }

    // Main animation sequence
    tl.to(containerRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: "back.out(1.7)"
    })
    .to(iconRef.current, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.3)"
    }, "-=0.3")
    .to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4")
    .to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.3")
    .to(buttonRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.2");

    // Continuous icon animation
    gsap.to(iconRef.current, {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1
    });

    // Cleanup function
    return () => {
      tl.kill();
      if (particlesRef.current) {
        particlesRef.current.innerHTML = '';
      }
    };
  }, []);

  const handleButtonHover = (isHovering: boolean) => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: isHovering ? 1.05 : 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 relative overflow-hidden ${className}`}>
      {/* Animated background particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />
      
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent animate-pulse" />
      
      <div 
        ref={containerRef}
        className="text-center p-12 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 max-w-md mx-4"
      >
        {/* Animated error icon */}
        <div ref={iconRef} className="mb-6">
          <div className="w-24 h-24 mx-auto bg-red-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-4xl text-white font-bold">!</span>
          </div>
        </div>

        {/* Error code */}
        <div className="text-6xl font-extrabold text-red-400 mb-2 opacity-50">
          {getErrorCode()}
        </div>

        {/* Main title */}
        <h1 
          ref={titleRef}
          className="text-4xl font-bold text-white mb-4 drop-shadow-lg"
        >
          Oops!
        </h1>

        {/* Error message */}
        <p 
          ref={subtitleRef}
          className="text-lg text-gray-200 mb-8 leading-relaxed"
        >
          {getErrorMessage()}
        </p>

        {/* Action button */}
        <Link
          ref={buttonRef}
          to="/"
          className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105"
          onMouseEnter={() => handleButtonHover(true)}
          onMouseLeave={() => handleButtonHover(false)}
        >
          Take Me Home
        </Link>

        {/* Additional help text */}
        <p className="text-sm text-gray-400 mt-6">
          If this error persists, please contact support
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
