import React from 'react';
import { WaterBottle } from './WaterBottle';

export const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-3xl bg-milky-white relative overflow-hidden">
      {/* Floating water bottle */}
      <div className="absolute top-1/4 left-8 hidden lg:block opacity-30">
        <WaterBottle size="large" animated />
      </div>

      <div className="container-content relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-page-title font-display font-bold text-deep-space mb-lg">
            Let's Work Together
          </h2>

          <p className="text-lg-heading text-dusky-blue mb-2xl">
            I'm always interested in creative challenges and collaborations.
          </p>

          {/* Contact methods */}
          <div className="space-y-xl mb-2xl">
            <div>
              <p className="text-small text-soft-gray uppercase tracking-wide font-heading font-semibold mb-md">Email</p>
              <a href="mailto:hello@example.com" className="text-lg-heading font-heading font-semibold text-cosmic-lavender hover:text-active-cosmic transition-colors">
                hello@example.com
              </a>
            </div>

            <div className="w-12 h-px bg-silver-mist mx-auto" />

            <div>
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
          <button className="btn-primary text-lg-heading">
            Send Me an Email
          </button>
        </div>
      </div>
    </section>
  );
};
