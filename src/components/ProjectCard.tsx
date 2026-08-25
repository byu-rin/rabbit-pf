import React from 'react';

interface ProjectCardProps {
  title: string;
  description: string;
  techStack: string[];
  role: string;
  image: string;
  size?: 'small' | 'medium' | 'large';
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  techStack,
  role,
  image,
  size = 'medium',
}) => {
  const sizeClasses = {
    small: 'col-span-3',
    medium: 'col-span-4',
    large: 'col-span-6',
  };

  return (
    <div
      className={`${sizeClasses[size]} bg-white rounded-md shadow-subtle hover:shadow-medium transition-all duration-300 hover:scale-105 overflow-hidden cursor-pointer group`}
    >
      {/* Image container */}
      <div className="relative w-full h-56 overflow-hidden bg-twilight-gray">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-lg">
        <h3 className="text-lg-heading font-heading font-semibold text-deep-space mb-sm group-hover:text-cosmic-lavender transition-colors">
          {title}
        </h3>

        <p className="text-body text-dusky-blue mb-md line-clamp-2">
          {description}
        </p>

        <div className="mb-md">
          <p className="text-small font-heading text-cosmic-lavender font-semibold mb-sm">
            {role}
          </p>
          <div className="flex flex-wrap gap-sm">
            {techStack.map((tech, i) => (
              <span
                key={i}
                className="text-tiny bg-twilight-gray text-deep-space px-sm py-xs rounded-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <button className="btn-primary text-sm w-full">
          View Project
        </button>
      </div>
    </div>
  );
};
