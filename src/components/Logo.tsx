import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', showSubtitle = false }) => {
  const textSizes = {
    sm: 'text-xl tracking-tight',
    md: 'text-2xl md:text-[28px] tracking-tight',
    lg: 'text-3xl md:text-4xl tracking-tight',
  };

  const svgDimensions = {
    sm: { width: 88, height: 16, viewBox: '0 0 100 20' },
    md: { width: 110, height: 20, viewBox: '0 0 100 20' },
    lg: { width: 145, height: 26, viewBox: '0 0 100 20' },
  };

  const dims = svgDimensions[size];

  return (
    <div className={`inline-flex flex-col items-start select-none cursor-pointer group ${className}`}>
      <div className="flex items-baseline">
        <span
          className={`font-black font-sans lowercase text-[#0f1111] transition-colors ${textSizes[size]}`}
          style={{ letterSpacing: '-0.04em', lineHeight: 1 }}
        >
          kaadugal
        </span>
      </div>

      {/* Iconic Amazon-style upward curved smile arrow in warm orange (#ff9900) */}
      <div className="-mt-0.5 relative" style={{ width: dims.width, height: dims.height }}>
        <svg
          viewBox={dims.viewBox}
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Smooth bezier smile curve */}
          <path
            d="M 6,5 C 28,17 72,17 92,7"
            fill="none"
            stroke="#ff9900"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Arrowhead with the characteristic dimple curve */}
          <path
            d="M 87,4 C 91,5.5 94,7 96,8.5 C 93.5,10.5 89,12 85.5,14 C 88,10.5 88.5,8 87,4 Z"
            fill="#ff9900"
          />
        </svg>
      </div>

      {showSubtitle && (
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">
          Supermarket
        </span>
      )}
    </div>
  );
};
