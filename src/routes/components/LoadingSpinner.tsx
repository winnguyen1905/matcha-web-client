import React from 'react';
import { Leaf } from 'lucide-react';

interface LoadingSpinnerProps {
  variant?: 'default' | 'matcha' | 'minimal' | 'dots';
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  variant = 'matcha', 
  size = 'md', 
  message,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const containerClasses = `flex flex-col items-center justify-center ${className}`;

  if (variant === 'matcha') {
    return (
      <div className={containerClasses}>
        <style>{`
          @keyframes matcha-spin {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.1); }
            100% { transform: rotate(360deg) scale(1); }
          }
          @keyframes leaf-float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-5px) rotate(5deg); }
            75% { transform: translateY(5px) rotate(-5deg); }
          }
          @keyframes fade-pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          .matcha-spinner {
            animation: matcha-spin 2s ease-in-out infinite;
          }
          .leaf-float {
            animation: leaf-float 3s ease-in-out infinite;
          }
          .fade-pulse {
            animation: fade-pulse 1.5s ease-in-out infinite;
          }
        `}</style>
        
        <div className="relative">
          {/* Outer ring */}
          <div className={`${sizeClasses[size]} border-4 border-emerald-100 rounded-full`}></div>
          
          {/* Spinning matcha ring */}
          <div className={`${sizeClasses[size]} absolute top-0 left-0 border-4 border-transparent border-t-emerald-500 border-r-emerald-400 rounded-full matcha-spinner`}></div>
          
          {/* Center leaf icon */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Leaf className="w-4 h-4 text-emerald-600 leaf-float" />
          </div>
          
          {/* Floating particles */}
          <div className="absolute -top-2 -left-2 w-2 h-2 bg-emerald-300 rounded-full fade-pulse" style={{ animationDelay: '0s' }}></div>
          <div className="absolute -top-2 -right-2 w-1.5 h-1.5 bg-green-300 rounded-full fade-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-teal-300 rounded-full fade-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -bottom-2 -right-2 w-2 h-2 bg-emerald-400 rounded-full fade-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>
        
        {message && (
          <p className="mt-4 text-emerald-700 font-medium text-sm fade-pulse">
            {message}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={containerClasses}>
        <style>{`
          @keyframes dot-bounce {
            0%, 80%, 100% { transform: translateY(0) scale(1); opacity: 0.7; }
            40% { transform: translateY(-8px) scale(1.1); opacity: 1; }
          }
        `}</style>
        
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full" style={{ animation: 'dot-bounce 1.4s infinite ease-in-out', animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-emerald-400 rounded-full" style={{ animation: 'dot-bounce 1.4s infinite ease-in-out', animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-emerald-300 rounded-full" style={{ animation: 'dot-bounce 1.4s infinite ease-in-out', animationDelay: '0.4s' }}></div>
        </div>
        
        {message && (
          <p className="mt-3 text-gray-600 text-sm">
            {message}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={containerClasses}>
        <div className={`${sizeClasses[size]} border-2 border-gray-200 border-t-emerald-500 rounded-full animate-spin`}></div>
        {message && (
          <p className="mt-3 text-gray-600 text-sm">
            {message}
          </p>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={containerClasses}>
      <div className={`${sizeClasses[size]} border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin`}></div>
      {message && (
        <p className="mt-3 text-emerald-700 text-sm font-medium">
          {message}
        </p>
      )}
    </div>
  );
};

// Full-screen loading component
export const FullScreenLoader: React.FC<{
  variant?: LoadingSpinnerProps['variant'];
  message?: string;
}> = ({ variant = 'matcha', message = 'Loading...' }) => (
  <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center z-50">
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-emerald-100">
      <LoadingSpinner variant={variant} size="lg" message={message} />
    </div>
  </div>
);

// Inline loading component
export const InlineLoader: React.FC<{
  variant?: LoadingSpinnerProps['variant'];
  message?: string;
}> = ({ variant = 'dots', message }) => (
  <div className="flex items-center justify-center py-8">
    <LoadingSpinner variant={variant} size="md" message={message} />
  </div>
);

export default LoadingSpinner; 
