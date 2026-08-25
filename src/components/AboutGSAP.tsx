import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionTitle } from './SectionTitle';
import { RabbitCharacter } from './RabbitCharacter';

gsap.registerPlugin(ScrollTrigger);

export const AboutGSAP: React.FC = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const rabbitRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate text content
      if (textRef.current) {
        gsap.from(textRef.current, {
          opacity: 0,
          x: -50,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Animate photo with parallax
      if (photoRef.current) {
        gsap.from(photoRef.current, {
          opacity: 0,
          x: 50,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: photoRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });

        // Subtle parallax on photo
        gsap.to(photoRef.current, {
          y: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: photoRef.current,
            scrub: 1,
            start: 'top bottom',
            end: 'bottom top',
          },
        });
      }

      // Animate rabbit
      if (rabbitRef.current) {
        gsap.from(rabbitRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.6,
          delay: 0.3,
          ease: 'back.out',
          scrollTrigger: {
            trigger: rabbitRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Animate stats
      if (statsRef.current) {
        const stats = statsRef.current.querySelectorAll('[data-stat]');
        gsap.from(stats, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="py-3xl bg-cloud-pearl relative overflow-hidden">
      <div className="container-content">
        <SectionTitle>About Me</SectionTitle>

        <div className="grid grid-cols-12 gap-xl items-center">
          {/* Text content */}
          <div ref={textRef} className="col-span-12 lg:col-span-7">
            <p className="text-body text-dusky-blue mb-lg leading-relaxed">
              I'm a developer who believes that code is art. With over 5 years of experience building web experiences, I've learned that the best solutions come from combining technical depth with creative thinking.
            </p>

            <p className="text-body text-dusky-blue mb-lg leading-relaxed">
              My background spans full-stack development, design systems, and product strategy. I'm passionate about building interfaces that are not just functional, but genuinely delightful to use. Every project is an opportunity to push boundaries and create something memorable.
            </p>

            <div ref={statsRef} className="grid grid-cols-2 gap-lg mt-2xl">
              <div data-stat>
                <p className="text-2xl font-display font-bold text-cosmic-lavender mb-sm">5+</p>
                <p className="text-small text-soft-gray">Years of Experience</p>
              </div>
              <div data-stat>
                <p className="text-2xl font-display font-bold text-cosmic-lavender mb-sm">20+</p>
                <p className="text-small text-soft-gray">Projects Completed</p>
              </div>
            </div>
          </div>

          {/* Image + Rabbit */}
          <div className="col-span-12 lg:col-span-5 relative h-80 flex items-end justify-center">
            {/* Photo placeholder with border */}
            <div ref={photoRef} className="relative w-56 h-72 rounded-lg border-4 border-cosmic-lavender shadow-medium bg-twilight-gray overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop"
                alt="Developer portrait"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Rabbit character beside photo */}
            <div ref={rabbitRef} className="absolute bottom-0 right-0 transform translate-x-12 translate-y-8">
              <RabbitCharacter size="small" pose="thinking" animated />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
