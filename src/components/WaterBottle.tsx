import React from 'react';

interface WaterBottleProps {
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const WaterBottle: React.FC<WaterBottleProps> = ({
  size = 'medium',
  animated = true,
  className = '',
  style = {},
}) => {
  const sizes = {
    small: 60,
    medium: 100,
    large: 150,
  };

  const dimension = sizes[size];

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 100 140"
      className={`${animated ? 'animate-float' : ''} ${className}`}
      style={{
        filter: 'drop-shadow(0 4px 12px rgba(26, 22, 41, 0.1))',
        ...style,
      }}
    >
      {/* Bottle cap */}
      <rect x="38" y="8" width="24" height="12" rx="2" fill="#F4D46F" />

      {/* Bottle neck */}
      <path
        d="M 40 20 L 35 30 L 65 30 L 60 20 Z"
        fill="#C5E8E8"
        stroke="#7BA3A8"
        strokeWidth="1.5"
      />

      {/* Main bottle body */}
      <ellipse cx="50" cy="40" rx="20" ry="8" fill="#C5E8E8" stroke="#7BA3A8" strokeWidth="1.5" />
      <path
        d="M 30 40 Q 28 60, 30 85 Q 30 105, 50 115 Q 70 105, 70 85 Q 72 60, 70 40"
        fill="#C5E8E8"
        stroke="#7BA3A8"
        strokeWidth="1.5"
      />

      {/* Water inside bottle */}
      <path
        d="M 32 80 Q 32 100, 50 110 Q 68 100, 68 80 L 32 80"
        fill="#5DADE2"
        opacity="0.6"
      />

      {/* Water wave */}
      <path
        d="M 32 80 Q 40 76, 50 78 Q 60 80, 68 80"
        fill="none"
        stroke="#5DADE2"
        strokeWidth="1"
        opacity="0.8"
      />

      {/* Highlight / shine */}
      <ellipse cx="38" cy="50" rx="8" ry="15" fill="#FFFFFF" opacity="0.3" />
    </svg>
  );
};
