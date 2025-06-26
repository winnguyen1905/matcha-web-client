import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  variant?: 'admin' | 'customer';
  className?: string;
  showHome?: boolean;
  separator?: React.ReactNode;
}



const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  variant = 'customer',
  className = '',
  showHome = true,
  separator = <ChevronRight size={16} className="text-gray-400" />
}) => {
  const { breadcrumbItems: generatedItems, shouldShow } = useBreadcrumb(items);
  
  // Use provided items or generated items
  const breadcrumbItems = items || generatedItems;
  
  if (!shouldShow || breadcrumbItems.length <= 1) {
    return null; // Don't show breadcrumbs if only one item
  }

  const baseClasses = variant === 'admin' 
    ? 'flex items-center space-x-2 text-sm text-gray-600 bg-white/50 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border border-gray-200/50'
    : 'flex items-center space-x-2 text-sm text-emerald-700 bg-emerald-50/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border border-emerald-200/50';

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`${baseClasses} ${className}`}
    >
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const isClickable = item.path && !isLast;
          
          return (
            <li key={index} className="flex items-center space-x-2">
              {index > 0 && (
                <span className="flex-shrink-0" aria-hidden="true">
                  {separator}
                </span>
              )}
              
              <div className="flex items-center space-x-1">
                {item.icon && (
                  <span className={`flex-shrink-0 ${
                    variant === 'admin' 
                      ? 'text-blue-600' 
                      : 'text-emerald-600'
                  }`}>
                    {item.icon}
                  </span>
                )}
                
                {isClickable ? (
                  <Link
                    to={item.path!}
                    className={`font-medium transition-colors duration-200 hover:underline ${
                      variant === 'admin'
                        ? 'text-gray-700 hover:text-blue-600'
                        : 'text-emerald-700 hover:text-emerald-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={`font-medium ${
                    isLast 
                      ? variant === 'admin'
                        ? 'text-gray-900'
                        : 'text-emerald-900'
                      : variant === 'admin'
                        ? 'text-gray-700'
                        : 'text-emerald-700'
                  }`}>
                    {item.label}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb; 
