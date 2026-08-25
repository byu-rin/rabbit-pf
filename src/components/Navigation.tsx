import React, { useState } from "react";

const navItems = [
  { label: "project", href: "/projects", target: "_blank" },
  { label: "structure", href: "#structure" },
  { label: "objects", href: "#objects" },
  { label: "interface", href: "#interface" },
];

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-lab-ink/70 backdrop-blur-md border-b border-lab-ash">
      <div className="container-content">
        <div className="flex items-center justify-between h-16">
          {/* Logo — a generative glyph */}
          <a href="#top" className="flex items-center gap-3 group">
            <span className="text-lg text-lab-glow font-display font-bold tracking-tight transition-colors group-hover:text-lab-chalk">
              ⬡
            </span>
            <span className="hidden sm:inline lab-label text-lab-mist group-hover:text-lab-chalk">
              doyeon.lab
            </span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2xl">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.target}
                className="lab-label text-lab-fog hover:text-lab-glow transition-colors"
              >
                {item.label}
              </a>
            ))}
            <span className="lab-readout hidden lg:inline text-lab-steel">
              // v4.0.1
            </span>
          </div>

          {/* Mobile Menu Button */}
          <button
            aria-label="menu"
            className="md:hidden p-md text-lab-mist hover:text-lab-glow transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-lg border-t border-lab-ash">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.target}
                className="block py-md lab-label text-lab-fog hover:text-lab-glow transition-colors"
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
