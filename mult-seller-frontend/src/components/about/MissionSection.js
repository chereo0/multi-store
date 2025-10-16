import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MissionSection = () => {
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(leftRef.current, {
        x: -80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: leftRef.current, start: 'top 80%' }
      });

      gsap.from(rightRef.current, {
        x: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: rightRef.current, start: 'top 80%' }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div ref={leftRef} className="p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:bg-none">
          <div className="text-cyan-500 font-semibold mb-2">Our Mission</div>
          <h3 className="text-3xl font-bold mb-4">Our Mission: Empowering Creators</h3>
          <p className="text-gray-700 dark:text-gray-300">We provide tools, exposure, and infrastructure so creators can reach audiences across galaxies. We believe in fairness, open networks, and composable commerce.</p>
        </div>

        <div ref={rightRef} className="p-8 rounded-2xl bg-white/60 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700">
          <div className="text-cyan-500 font-semibold mb-2">Our Mission</div>
          <h3 className="text-3xl font-bold mb-4">Our Mission: Enriching Experiences</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6">We build delightful experiences that adapt to each user's context, making discovery simple and delightful, even across realities.</p>

          {/* Tech illustration placeholder */}
          <div className="w-full h-48 rounded-lg bg-gradient-to-br from-cyan-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
            {/* Simple SVG representing connected hex nodes */}
            <svg width="220" height="120" viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="g" x1="0" x2="1">
                  <stop offset="0" stopColor="#00d4ff" />
                  <stop offset="1" stopColor="#b030ff" />
                </linearGradient>
              </defs>
              <g stroke="url(#g)" strokeWidth="2" strokeLinecap="round">
                <circle cx="40" cy="60" r="10" fill="#0ea5b3" />
                <circle cx="110" cy="30" r="10" fill="#b030ff" />
                <circle cx="180" cy="60" r="10" fill="#00d4ff" />
                <path d="M50 60 L100 40 L170 60" strokeOpacity="0.7" />
                <path d="M110 40 L110 90" strokeOpacity="0.5" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
