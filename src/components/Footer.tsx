import React from 'react';
import { WaterBottle } from './WaterBottle';

export const Footer: React.FC = () => {
  return (
    <footer className="py-2xl bg-deep-space text-milky-white relative overflow-hidden">
      {/* Decorative water bottles pattern */}
      <div className="absolute inset-0 opacity-10 flex justify-around pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="transform -scale-50">
            <WaterBottle size="medium" animated={false} />
          </div>
        ))}
      </div>

      <div className="container-content relative z-10">
        <div className="text-center space-y-lg">
          <div>
            <p className="text-tiny uppercase tracking-widest text-silver-mist font-heading font-semibold mb-md">
              © 2024 Web Developer & Creative Thinker
            </p>
            <p className="text-small text-soft-gray">
              Crafted with intention and artistic vision
            </p>
          </div>

          <div className="flex justify-center gap-xl pt-lg border-t border-nebula-purple/20">
            <a href="#home" className="text-small text-cosmic-lavender hover:text-peach-dream transition-colors font-heading font-medium">
              Home
            </a>
            <span className="text-soft-gray">•</span>
            <a href="#projects" className="text-small text-cosmic-lavender hover:text-peach-dream transition-colors font-heading font-medium">
              Projects
            </a>
            <span className="text-soft-gray">•</span>
            <a href="#about" className="text-small text-cosmic-lavender hover:text-peach-dream transition-colors font-heading font-medium">
              About
            </a>
            <span className="text-soft-gray">•</span>
            <a href="#contact" className="text-small text-cosmic-lavender hover:text-peach-dream transition-colors font-heading font-medium">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
