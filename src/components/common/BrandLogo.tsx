import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'dark' | 'light' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'dark',
  size = 'md',
  showTagline = true,
}) => {
  const isLight = variant === 'light';

  const logoSizes = {
    sm: 'w-9 h-9 sm:w-10 sm:h-10',
    md: 'w-11 h-11 sm:w-13 sm:h-13',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
  };

  const titleSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* Official Brand Logo from Uploaded Image */}
      <div className={`relative ${logoSizes[size]} rounded-full overflow-hidden shrink-0 border-2 border-[#D4AF37] shadow-gold-sm group-hover:scale-105 transition-transform duration-300 bg-[#FFFDF9]`}>
        <img
          src="/brand-logo.jpg"
          alt="Vasavi Gadwal Saree House Official Emblem"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          <span
            className={`font-cinzel font-bold leading-none tracking-wide ${titleSizes[size]} ${
              isLight ? 'text-white drop-shadow-sm' : 'text-[#420B16]'
            }`}
          >
            <span className="text-[#C5A059] font-extrabold mr-1">VASAVI</span>
            GADWAL
          </span>
        </div>
        <span
          className={`font-cinzel tracking-[0.25em] font-semibold text-[11px] sm:text-xs mt-0.5 ${
            isLight ? 'text-amber-200' : 'text-[#801A2D]'
          }`}
        >
          SAREE HOUSE
        </span>
        {showTagline && (
          <span
            className={`font-serif italic text-[11px] sm:text-xs ${
              isLight ? 'text-amber-100/70' : 'text-[#8E6B2C]'
            }`}
          >
            Weaving Tradition, Crafting Dreams
          </span>
        )}
      </div>
    </div>
  );
};
