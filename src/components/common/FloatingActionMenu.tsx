import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import BackgroundMusic from './BackgroundMusic';

const FloatingActionMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end space-y-3">
      {isOpen && (
        <div className="flex flex-col items-center space-y-3">
          <div className="relative group">
            <BackgroundMusic />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
          </div>
          <a 
            href="https://m.me/your-page" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-14 h-14 flex items-center justify-center bg-blue-500 rounded-full shadow-md text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
            aria-label="Message us on Messenger"
          >
            <MessageSquare size={24} />
          </a>
        </div>
      )}
      
      <button
        onClick={toggleMenu}
        className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-emerald-700 to-teal-800 rounded-full shadow-lg text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-opacity-50"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X size={28} /> : <span className="text-2xl font-bold">!</span>}
      </button>
    </div>
  );
};

export default FloatingActionMenu;
