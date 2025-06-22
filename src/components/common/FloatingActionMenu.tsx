import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FloatingCartButtonProps {
  itemCount?: number;
  className?: string;
  onClick?: () => void;
}

const FloatingCartButton = ({
  itemCount = 0,
  className = '',
  onClick,
}: FloatingCartButtonProps) => {
  const hasItems = itemCount > 0;
  const buttonSize = '3.5rem';
  const badgeSize = '1.5rem';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed right-6 bottom-6 z-50 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        to="/cart"
        onClick={onClick}
        className={`relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg 
          bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800
          text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2
          focus:ring-offset-white dark:focus:ring-offset-gray-900 ${className}`}
        style={{
          '--button-size': buttonSize,
          '--badge-size': badgeSize,
        } as React.CSSProperties}
        aria-label={`View cart${hasItems ? ` (${itemCount} items)` : ''}`}
      >
        <ShoppingCart size={24} aria-hidden="true" />
        
        <AnimatePresence>
          {hasItems && (
            <motion.span
              key="cart-badge"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold 
                rounded-full w-6 h-6 flex items-center justify-center border-2 border-white
                shadow-sm"
              aria-live="polite"
              aria-atomic="true"
            >
              {itemCount > 9 ? '9+' : itemCount}
            </motion.span>
          )}
        </AnimatePresence>
      </Link>
    </motion.div>
  );
};

export default FloatingCartButton;
