import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const MessengerButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMessengerClick = () => {
    // Replace with actual Messenger URL
    window.open('https://m.me/emeryscorner', '_blank');
  };

  return (
    <>
      {/* Messenger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Chat Preview */}
          {isOpen && (
            <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-2xl p-4 w-80 mb-2 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-900">Chat with us!</h4>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Hi! How can we help you today?
              </p>
              <button
                onClick={handleMessengerClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 font-medium transition-colors duration-200"
              >
                Start Conversation
              </button>
            </div>
          )}

          {/* Main Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            aria-label="Contact us via Messenger"
          >
            <MessageCircle size={24} />
          </button>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default MessengerButton;