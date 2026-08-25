import React, { useState } from 'react';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-milky-white/95 backdrop-blur-sm border-b border-silver-mist shadow-subtle">
      <div className="container-content">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#home" className="text-2xl font-display font-bold text-cosmic-lavender">
            ◎
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2xl">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-body font-heading font-medium text-deep-space hover:text-cosmic-lavender transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-md hover:bg-twilight-gray rounded-sm transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-6 h-6 text-deep-space"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-lg border-t border-silver-mist">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block py-md text-body text-deep-space hover:text-cosmic-lavender transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
