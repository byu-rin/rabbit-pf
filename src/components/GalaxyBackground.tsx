import React, { useEffect, useState } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
}

interface GalaxyBackgroundProps {
  variant?: 'hero' | 'subtle' | 'section';
  fullHeight?: boolean;
}

export const GalaxyBackground: React.FC<GalaxyBackgroundProps> = ({
  variant = 'subtle',
  fullHeight = false
}) => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const starCount = variant === 'hero' ? 100 : 50;
    const newStars = Array.from({ length: starCount }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      opacity: Math.random() * 0.6 + 0.2,
      delay: Math.random() * 4,
    }));
    setStars(newStars);
  }, [variant]);

  const gradients = {
    hero: 'linear-gradient(135deg, #8B5A8E 0%, #2D1B3D 50%, #4A9BA8 100%)',
    subtle: 'linear-gradient(135deg, #B5A7D6 0%, #6B7AA1 50%, #8B5A8E 100%)',
    section: 'linear-gradient(135deg, #D9D7E3 0%, #B5A7D6 50%, #A8C5A6 100%)',
  };

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${fullHeight ? 'h-screen' : 'h-full'}`}
      style={{
        background: gradients[variant],
        opacity: variant === 'subtle' ? 0.3 : 1,
      }}
    >
      {/* Nebula clouds effect */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(circle at 30% 40%, #8B5A8E 0%, transparent 50%), radial-gradient(circle at 70% 60%, #4A9BA8 0%, transparent 50%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Stars */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <style>
            {`
              @keyframes twinkle {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 0.8; }
              }
              .star {
                animation: twinkle var(--duration, 3s) ease-in-out var(--delay, 0s) infinite;
              }
            `}
          </style>
        </defs>
        {stars.map((star, i) => (
          <circle
            key={i}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.size / 2}
            fill="#F4D46F"
            opacity={star.opacity}
            className="star"
            style={{
              '--duration': `${2 + Math.random() * 2}s`,
              '--delay': `${star.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </svg>
    </div>
  );
};
