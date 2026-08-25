import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  children,
  subtitle,
  className = '',
}) => {
  return (
    <div className={`mb-2xl ${className}`}>
      <h2 className="section-title mb-md">{children}</h2>
      {subtitle && (
        <p className="text-body text-dusky-blue">{subtitle}</p>
      )}
    </div>
  );
};
