import React from 'react';
import { GalaxyBackground } from './GalaxyBackground';
import { RabbitCharacter } from './RabbitCharacter';
import { WaterBottle } from './WaterBottle';

export const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-milky-white">
      <GalaxyBackground variant="hero" fullHeight />

      {/* Floating water bottle - left side */}
      <div className="absolute left-8 top-1/4 hidden lg:block opacity-30 hover:opacity-50 transition-opacity">
        <WaterBottle size="large" animated />
      </div>

      {/* Floating rabbit - right side */}
      <div className="absolute right-8 top-1/3 hidden lg:block">
        <RabbitCharacter size="large" pose="happy" animated />
      </div>

      {/* Main content */}
      <div className="container-content relative z-10 text-center py-20 lg:py-0">
        <div className="max-w-3xl mx-auto">
          {/* Main title */}
          <h1 className="text-hero font-display font-bold text-deep-space mb-lg leading-tight">
            Web Developer &
            <br />
            Creative Thinker
          </h1>

          {/* Subtitle */}
          <p className="text-heading font-body text-dusky-blue mb-2xl max-w-2xl mx-auto leading-relaxed">
            I craft thoughtful, artistic digital experiences that blend technical excellence with distinctive visual identity.
          </p>

          {/* CTA Button */}
          <a href="#projects" className="btn-primary inline-block text-lg-heading">
            Explore My Work
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-cosmic-lavender"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
};
