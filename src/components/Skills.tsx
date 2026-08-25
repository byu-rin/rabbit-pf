import React from 'react';
import { SectionTitle } from './SectionTitle';

const skillCategories = [
  {
    title: 'Frontend',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Vue.js', 'Web Design'],
    color: 'cosmic-lavender',
  },
  {
    title: 'Backend',
    skills: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'REST APIs', 'GraphQL'],
    color: 'stellar-blue',
  },
  {
    title: 'Design',
    skills: ['UI/UX Design', 'Design Systems', 'Figma', 'Prototyping', 'Visual Hierarchy', 'Accessibility'],
    color: 'peach-dream',
  },
  {
    title: 'Tools & Other',
    skills: ['Git', 'Docker', 'CI/CD', 'AWS', 'Testing', 'Performance Optimization'],
    color: 'sage-green',
  },
];

export const Skills: React.FC = () => {
  return (
    <section className="py-3xl bg-milky-white">
      <div className="container-content">
        <SectionTitle subtitle="Technologies and skills I work with">
          Technical Stack
        </SectionTitle>

        <div className="grid grid-cols-12 gap-lg">
          {skillCategories.map((category, index) => {
            const colors = {
              'cosmic-lavender': 'border-cosmic-lavender bg-cosmic-lavender/5',
              'stellar-blue': 'border-stellar-blue bg-stellar-blue/5',
              'peach-dream': 'border-peach-dream bg-peach-dream/5',
              'sage-green': 'border-sage-green bg-sage-green/5',
            };

            const colorClass = colors[category.color as keyof typeof colors];

            return (
              <div key={category.title} className="col-span-12 md:col-span-6 lg:col-span-3">
                <div className={`rounded-md border-2 ${colorClass} p-lg h-full`}>
                  <h3 className="text-lg-heading font-heading font-semibold text-deep-space mb-lg">
                    {category.title}
                  </h3>
                  <ul className="space-y-sm">
                    {category.skills.map((skill, i) => (
                      <li key={i} className="text-body text-dusky-blue flex items-start gap-md">
                        <span className="text-cosmic-lavender font-bold mt-0.5">◆</span>
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
