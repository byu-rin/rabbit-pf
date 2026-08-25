import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationOptions {
  trigger?: string | React.RefObject<HTMLElement>;
  start?: string;
  end?: string;
  markers?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
}

export const useScrollAnimation = (
  callback: (context: any) => void,
  options: ScrollAnimationOptions = {}
) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(elementRef.current, {
        scrollTrigger: {
          trigger: options.trigger || elementRef.current,
          start: options.start || 'top center',
          end: options.end || 'center center',
          markers: options.markers || false,
          onEnter: options.onEnter,
          onLeave: options.onLeave,
        },
      });
    });

    return () => ctx.revert();
  }, [options]);

  return elementRef;
};

export const useFadeInUp = (ref: React.RefObject<HTMLElement>, delay = 0) => {
  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    });

    return () => ctx.revert();
  }, [delay]);
};

export const useParallax = (ref: React.RefObject<HTMLElement>, intensity = 0.5) => {
  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        yPercent: intensity * 50,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          scrub: 1,
          markers: false,
        },
      });
    });

    return () => ctx.revert();
  }, [intensity]);
};

export const useStaggerChildren = (
  containerRef: React.RefObject<HTMLElement>,
  delay = 0.1
) => {
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const children = containerRef.current?.querySelectorAll('[data-stagger]');
      if (!children || children.length === 0) return;

      gsap.from(children, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    });

    return () => ctx.revert();
  }, [delay]);
};

export const useHoverScale = (ref: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const handleMouseEnter = () => {
      gsap.to(element, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
};
