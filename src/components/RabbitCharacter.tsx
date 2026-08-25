import React from 'react';

interface RabbitCharacterProps {
  size?: 'small' | 'medium' | 'large';
  pose?: 'neutral' | 'thinking' | 'happy' | 'surprised';
  animated?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const RabbitCharacter: React.FC<RabbitCharacterProps> = ({
  size = 'medium',
  pose = 'neutral',
  animated = true,
  className = '',
  style = {},
}) => {
  const sizes = {
    small: 80,
    medium: 130,
    large: 180,
  };

  const dimension = sizes[size];

  const getPoseTransform = () => {
    switch (pose) {
      case 'thinking':
        return 'rotate(-5deg)';
      case 'happy':
        return 'scaleY(1.05)';
      case 'surprised':
        return 'scaleX(0.95)';
      default:
        return 'none';
    }
  };

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 120 150"
      className={className}
      style={{
        filter: 'drop-shadow(0 4px 16px rgba(26, 22, 41, 0.12))',
        transform: getPoseTransform(),
        transition: 'transform 0.3s ease-out',
        ...(animated && { animation: 'float 3s ease-in-out infinite' }),
        ...style,
      }}
    >
      {/* Body */}
      <ellipse cx="60" cy="85" rx="28" ry="35" fill="#F5E6D3" stroke="#8B6F47" strokeWidth="1" />

      {/* Head */}
      <circle cx="60" cy="45" r="25" fill="#F5E6D3" stroke="#8B6F47" strokeWidth="1" />

      {/* Left ear */}
      <ellipse
        cx="40"
        cy="15"
        rx="10"
        ry="22"
        fill="#F5E6D3"
        stroke="#8B6F47"
        strokeWidth="1"
        transform="rotate(-20 40 15)"
      />
      <ellipse
        cx="41"
        cy="18"
        rx="5"
        ry="16"
        fill="#D9A4A4"
        transform="rotate(-20 41 18)"
      />

      {/* Right ear */}
      <ellipse
        cx="80"
        cy="15"
        rx="10"
        ry="22"
        fill="#F5E6D3"
        stroke="#8B6F47"
        strokeWidth="1"
        transform="rotate(20 80 15)"
      />
      <ellipse
        cx="79"
        cy="18"
        rx="5"
        ry="16"
        fill="#D9A4A4"
        transform="rotate(20 79 18)"
      />

      {/* Eyes */}
      <circle cx="50" cy="40" r="3" fill="#2D1B1B" />
      <circle cx="70" cy="40" r="3" fill="#2D1B1B" />

      {/* Eye highlights */}
      <circle cx="50.8" cy="39" r="1.2" fill="#FFFFFF" opacity="0.7" />
      <circle cx="70.8" cy="39" r="1.2" fill="#FFFFFF" opacity="0.7" />

      {/* Nose */}
      <path
        d="M 60 48 L 57 52 L 63 52 Z"
        fill="#D9A4A4"
      />

      {/* Mouth - varies by pose */}
      {pose === 'happy' ? (
        <path
          d="M 60 52 Q 55 55, 50 53"
          fill="none"
          stroke="#8B6F47"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ) : pose === 'surprised' ? (
        <circle cx="60" cy="54" r="3" fill="none" stroke="#8B6F47" strokeWidth="1.5" />
      ) : (
        <path
          d="M 60 52 Q 55 54, 50 52"
          fill="none"
          stroke="#8B6F47"
          strokeWidth="1"
          strokeLinecap="round"
        />
      )}

      {/* Thinking hand - shows on thinking pose */}
      {pose === 'thinking' && (
        <circle cx="30" cy="50" r="6" fill="#F5E6D3" stroke="#8B6F47" strokeWidth="1" />
      )}

      {/* Front left paw */}
      <ellipse
        cx="45"
        cy="120"
        rx="8"
        ry="12"
        fill="#F5E6D3"
        stroke="#8B6F47"
        strokeWidth="1"
      />

      {/* Front right paw */}
      <ellipse
        cx="75"
        cy="120"
        rx="8"
        ry="12"
        fill="#F5E6D3"
        stroke="#8B6F47"
        strokeWidth="1"
      />

      {/* Belly accent */}
      <ellipse
        cx="60"
        cy="90"
        rx="16"
        ry="20"
        fill="#FFFFFF"
        opacity="0.3"
      />
    </svg>
  );
};
