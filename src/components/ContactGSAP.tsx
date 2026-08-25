import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WaterBottle } from './WaterBottle';

gsap.registerPlugin(ScrollTrigger);

export const ContactGSAP: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      // Animate title
      if (titleRef.current) {
        gsap.from(titleRef.current, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Animate subtitle
      if (subtitleRef.current) {
        gsap.from(subtitleRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          delay: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: subtitleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Animate email section
      if (emailRef.current) {
        gsap.from(emailRef.current, {
          opacity: 0,
          scale: 0.95,
          duration: 0.6,
          delay: 0.2,
          ease: 'back.out',
          scrollTrigger: {
            trigger: emailRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Animate social links
      if (socialRef.current) {
        gsap.from(socialRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          delay: 0.3,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: socialRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Animate button
      if (buttonRef.current) {
        gsap.from(buttonRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          delay: 0.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: buttonRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Animate bottle (desktop only)
      if (!isMobile && bottleRef.current) {
        gsap.from(bottleRef.current, {
          opacity: 0,
          x: -50,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: bottleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" className="py-3xl bg-milky-white relative overflow-hidden">
      {/* Floating water bottle */}
      <div ref={bottleRef} className="absolute top-1/4 left-8 hidden lg:block opacity-30">
        <WaterBottle size="large" animated />
      </div>

      <div className="container-content relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 ref={titleRef} className="text-page-title font-display font-bold text-deep-space mb-lg">
            Let's Work Together
          </h2>

          <p ref={subtitleRef} className="text-lg-heading text-dusky-blue mb-2xl">
            I'm always interested in creative challenges and collaborations.
          </p>

          {/* Contact methods */}
          <div className="space-y-xl mb-2xl">
            <div ref={emailRef}>
              <p className="text-small text-soft-gray uppercase tracking-wide font-heading font-semibold mb-md">Email</p>
              <a href="mailto:hello@example.com" className="text-lg-heading font-heading font-semibold text-cosmic-lavender hover:text-active-cosmic transition-colors">
                hello@example.com
              </a>
            </div>

            <div className="w-12 h-px bg-silver-mist mx-auto" />

            <div ref={socialRef}>
              <p className="text-small text-soft-gray uppercase tracking-wide font-heading font-semibold mb-md">Connect</p>
              <div className="flex justify-center gap-lg">
                <a href="#" className="text-cosmic-lavender hover:text-active-cosmic transition-colors font-heading font-semibold">
                  GitHub
                </a>
                <span className="text-silver-mist">•</span>
                <a href="#" className="text-cosmic-lavender hover:text-active-cosmic transition-colors font-heading font-semibold">
                  LinkedIn
                </a>
                <span className="text-silver-mist">•</span>
                <a href="#" className="text-cosmic-lavender hover:text-active-cosmic transition-colors font-heading font-semibold">
                  Twitter
                </a>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button ref={buttonRef} className="btn-primary text-lg-heading">
            Send Me an Email
          </button>
        </div>
      </div>
    </section>
  );
};
