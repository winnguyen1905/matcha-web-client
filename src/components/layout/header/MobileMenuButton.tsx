import React from 'react';
import { Menu, X } from 'lucide-react';

type MobileMenuButtonProps = {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
};

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => (
  <div className="md:hidden">
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="text-emerald-800 hover:text-emerald-600 transition-colors duration-200"
    >
      {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  </div>
);

export default MobileMenuButton; 
