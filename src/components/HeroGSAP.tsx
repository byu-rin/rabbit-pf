import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { GalaxyBackground } from './GalaxyBackground';
import { RabbitCharacter } from './RabbitCharacter';
import { WaterBottle } from './WaterBottle';

export const HeroGSAP: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const rabbitRef = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable animations on mobile for performance
    const isMobile = window.innerWidth < 768;

    const tl = gsap.timeline();

    // Title animation
    tl.from(titleRef.current, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: 'power2.out',
    }, 0);

    // Subtitle animation
    tl.from(
      subtitleRef.current,
      {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
      },
      0.2
    );

    // Button animation
    tl.from(
      buttonRef.current,
      {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
      },
      0.4
    );

    // Rabbit animation (only on desktop)
    if (!isMobile && rabbitRef.current) {
      gsap.from(rabbitRef.current, {
        opacity: 0,
        x: 100,
        duration: 1,
        delay: 0.6,
        ease: 'power2.out',
      });

      // Subtle floating animation for rabbit
      gsap.to(rabbitRef.current, {
        y: 20,
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    }

    // Bottle animation (only on desktop)
    if (!isMobile && bottleRef.current) {
      gsap.from(bottleRef.current, {
        opacity: 0,
        x: -100,
        duration: 1,
        delay: 0.6,
        ease: 'power2.out',
      });

      // Subtle floating animation for bottle
      gsap.to(bottleRef.current, {
        y: 15,
        duration: 4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-milky-white">
      <GalaxyBackground variant="hero" fullHeight />

      {/* Floating water bottle - left side */}
      <div ref={bottleRef} className="absolute left-8 top-1/4 hidden lg:block opacity-30 hover:opacity-50 transition-opacity">
        <WaterBottle size="large" animated />
      </div>

      {/* Floating rabbit - right side */}
      <div ref={rabbitRef} className="absolute right-8 top-1/3 hidden lg:block">
        <RabbitCharacter size="large" pose="happy" animated />
      </div>

      {/* Main content */}
      <div className="container-content relative z-10 text-center py-20 lg:py-0">
        <div className="max-w-3xl mx-auto">
          {/* Main title */}
          <h1 ref={titleRef} className="text-hero font-display font-bold text-milky-white mb-lg leading-tight drop-shadow-lg">
            Web Developer &
            <br />
            Creative Thinker
          </h1>

          {/* Subtitle */}
          <p ref={subtitleRef} className="text-heading font-body text-milky-white mb-2xl max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            I craft thoughtful, artistic digital experiences that blend technical excellence with distinctive visual identity.
          </p>

          {/* CTA Button */}
          <a ref={buttonRef} href="#projects" className="btn-primary inline-block text-lg-heading">
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
