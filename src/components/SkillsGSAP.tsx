import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionTitle } from './SectionTitle';

gsap.registerPlugin(ScrollTrigger);

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

export const SkillsGSAP: React.FC = () => {
  const titleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title
      if (titleRef.current) {
        gsap.from(titleRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Stagger animate skill boxes
      if (containerRef.current) {
        const boxes = containerRef.current.querySelectorAll('[data-skill-box]');
        gsap.from(boxes, {
          opacity: 0,
          y: 40,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-3xl bg-milky-white">
      <div className="container-content">
        <div ref={titleRef}>
          <SectionTitle subtitle="Technologies and skills I work with">
            Technical Stack
          </SectionTitle>
        </div>

        <div ref={containerRef} className="grid grid-cols-12 gap-lg">
          {skillCategories.map((category, index) => {
            const colors = {
              'cosmic-lavender': 'border-cosmic-lavender bg-cosmic-lavender/5',
              'stellar-blue': 'border-stellar-blue bg-stellar-blue/5',
              'peach-dream': 'border-peach-dream bg-peach-dream/5',
              'sage-green': 'border-sage-green bg-sage-green/5',
            };

            const colorClass = colors[category.color as keyof typeof colors];

            return (
              <div key={category.title} className="col-span-12 md:col-span-6 lg:col-span-3" data-skill-box>
                <div
                  className={`rounded-md border-2 ${colorClass} p-lg h-full transition-all duration-300 hover:shadow-medium hover:scale-105`}
                  style={{
                    cursor: 'pointer',
                  }}
                >
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
