import React from 'react';

export const Logo = ({ size = 40, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Dumbbell */}
      <g>
        {/* Left weight */}
        <rect x="8" y="35" width="16" height="30" rx="2" fill="#FFD700" />
        
        {/* Center bar */}
        <rect x="32" y="38" width="36" height="24" rx="3" fill="#333333" />
        
        {/* Right weight */}
        <rect x="76" y="35" width="16" height="30" rx="2" fill="#FFD700" />
        
        {/* Decorative line on weights */}
        <line x1="12" y1="42" x2="12" y2="63" stroke="#FFA500" strokeWidth="2" />
        <line x1="24" y1="42" x2="24" y2="63" stroke="#FFA500" strokeWidth="2" />
        <line x1="80" y1="42" x2="80" y2="63" stroke="#FFA500" strokeWidth="2" />
        <line x1="88" y1="42" x2="88" y2="63" stroke="#FFA500" strokeWidth="2" />
      </g>

      {/* Pulse/energy lines */}
      <g opacity="0.6">
        <circle cx="50" cy="50" r="60" fill="none" stroke="#28a745" strokeWidth="1" />
        <circle cx="50" cy="50" r="45" fill="none" stroke="#20c997" strokeWidth="1" />
      </g>
    </svg>
  );
};

export default Logo;
