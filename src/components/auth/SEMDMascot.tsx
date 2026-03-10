'use client';

import React from 'react';

interface SEMDMascotProps {
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  className?: string;
}

export const SEMDMascot: React.FC<SEMDMascotProps> = ({
  size = 'md',
  showBadge = true,
  className = '',
}) => {
  const sizeMap = {
    sm: 76,
    md: 130,
    lg: 160,
  };

  const svgSize = sizeMap[size];

  return (
    <div className={`relative inline-block ${className}`}>
      <svg
        className="drop-shadow-lg animate-float"
        width={svgSize}
        height={svgSize}
        viewBox="0 0 140 140"
        fill="none"
      >
        <ellipse cx="70" cy="48" rx="38" ry="8" fill="#6B4226" />
        <rect x="44" y="18" width="52" height="34" rx="12" fill="#8B5E3C" />
        <rect x="44" y="40" width="52" height="8" fill="#F5B942" />
        <text x="51" y="48" fontFamily="Outfit" fontSize="9" fontWeight="800" fill="#3D2B1F">
          SEMD
        </text>
        <ellipse cx="70" cy="80" rx="30" ry="27" fill="#FDD07A" />
        <polygon points="44,58 36,40 56,58" fill="#FDD07A" />
        <polygon points="96,58 104,40 84,58" fill="#FDD07A" />
        <polygon points="46,56 41,44 55,56" fill="#F5A0A0" />
        <polygon points="94,56 99,44 85,56" fill="#F5A0A0" />
        <ellipse cx="58" cy="78" rx="7" ry="7.5" fill="white" />
        <ellipse cx="82" cy="78" rx="7" ry="7.5" fill="white" />
        <ellipse cx="59" cy="79" rx="4" ry="4.5" fill="#3D2B1F" />
        <ellipse cx="83" cy="79" rx="4" ry="4.5" fill="#3D2B1F" />
        <ellipse cx="60" cy="77" rx="1.5" ry="1.5" fill="white" />
        <ellipse cx="84" cy="77" rx="1.5" ry="1.5" fill="white" />
        <ellipse cx="70" cy="87" rx="3" ry="2" fill="#E07B8A" />
        <path
          d="M67 89 Q70 93 73 89"
          stroke="#C05060"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <line x1="40" y1="86" x2="62" y2="88" stroke="#9C7B6A" strokeWidth="1.2" />
        <line x1="40" y1="90" x2="62" y2="90" stroke="#9C7B6A" strokeWidth="1.2" />
        <line x1="100" y1="86" x2="78" y2="88" stroke="#9C7B6A" strokeWidth="1.2" />
        <line x1="100" y1="90" x2="78" y2="90" stroke="#9C7B6A" strokeWidth="1.2" />
        <ellipse cx="70" cy="116" rx="28" ry="22" fill="#A8D8A8" />
        <rect x="52" y="103" width="36" height="6" rx="3" fill="#F5B942" />
        <circle cx="100" cy="108" r="14" fill="white" stroke="#6B4226" strokeWidth="3" />
        <circle
          cx="100"
          cy="108"
          r="9"
          fill="rgba(120,220,240,0.4)"
          stroke="#6B4226"
          strokeWidth="1.5"
        />
        <line
          x1="110"
          y1="118"
          x2="122"
          y2="130"
          stroke="#6B4226"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      {showBadge && (
        <span className="absolute bottom-2 right-[-4px] bg-brown text-amber font-display text-[11px] font-extrabold px-2 py-0.5 rounded-full border-2 border-amber-pale">
          🔍 SEMD
        </span>
      )}
    </div>
  );
};

export default SEMDMascot;
