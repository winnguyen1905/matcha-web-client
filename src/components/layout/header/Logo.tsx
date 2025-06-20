import React from 'react';

const Logo = ({ isScrolled, navigate }: { isScrolled: boolean, navigate: (path: string) => void }) => (
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
);

export default Logo; 
