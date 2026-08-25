import React from 'react';
import { SectionTitle } from './SectionTitle';
import { ProjectCard } from './ProjectCard';

const projects = [
  {
    id: 1,
    title: 'Interactive Experience Platform',
    description: 'A real-time collaborative platform for creative professionals with live editing and social features.',
    techStack: ['React', 'TypeScript', 'Node.js', 'WebSocket'],
    role: 'Full-stack Developer',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
    size: 'large' as const,
  },
  {
    id: 2,
    title: 'Design System Component Library',
    description: 'Comprehensive component library with 60+ reusable components and thorough documentation.',
    techStack: ['React', 'Storybook', 'Tailwind'],
    role: 'Frontend Lead',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop',
    size: 'medium' as const,
  },
  {
    id: 3,
    title: 'Analytics Dashboard',
    description: 'Real-time analytics dashboard with advanced data visualization and custom metrics.',
    techStack: ['React', 'D3.js', 'Python', 'PostgreSQL'],
    role: 'Frontend Developer',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop',
    size: 'medium' as const,
  },
  {
    id: 4,
    title: 'E-commerce Platform Redesign',
    description: 'Complete redesign improving conversion rates and user experience for a major retailer.',
    techStack: ['Next.js', 'TypeScript', 'Shopify API'],
    role: 'Design & Frontend',
    image: 'https://images.unsplash.com/photo-1460925895917-adf4e565c140?w=600&h=400&fit=crop',
    size: 'large' as const,
  },
  {
    id: 5,
    title: 'Mobile App - Fitness Tracker',
    description: 'Native mobile app with real-time health metrics and social challenges.',
    techStack: ['React Native', 'Firebase', 'TypeScript'],
    role: 'Full-stack Developer',
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=400&fit=crop',
    size: 'medium' as const,
  },
  {
    id: 6,
    title: 'Generative Art Platform',
    description: 'Web-based platform for creating and exploring AI-generated artwork with community features.',
    techStack: ['WebGL', 'Python API', 'React', 'PostgreSQL'],
    role: 'Full-stack Developer',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop',
    size: 'small' as const,
  },
];

export const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-3xl bg-milky-white">
      <div className="container-content">
        <SectionTitle subtitle="A curated collection of work">
          Featured Projects
        </SectionTitle>

        {/* Projects Grid */}
        <div className="grid grid-cols-12 gap-lg mb-2xl">
          {projects.map((project) => (
            <div key={project.id} className={project.size === 'large' ? 'col-span-12 lg:col-span-6' : project.size === 'medium' ? 'col-span-12 md:col-span-6 lg:col-span-4' : 'col-span-12 md:col-span-6 lg:col-span-3'}>
              <ProjectCard {...project} size={project.size} />
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center pt-xl border-t border-twilight-gray">
          <a href="#" className="link-hover font-heading font-semibold text-lg-heading inline-flex items-center gap-md hover:gap-lg transition-all">
            View All Projects
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
