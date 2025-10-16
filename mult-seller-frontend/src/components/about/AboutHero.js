import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParticleField from './ParticleField';

gsap.registerPlugin(ScrollTrigger);

const AboutHero = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elems = gsap.utils.toArray('.hero-animate');
      gsap.from(elems, {
        y: 20,
        opacity: 0,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power3.out'
      });
    }, containerRef);

    // Theme is provided by ThemeContext; no need for MutationObserver

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url('${useTheme().isDarkMode ? '/About Dark.png' : '/About.png'}')` }}
    >
      <ParticleField />
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-28 text-center">
        <div className="hero-animate inline-flex items-center justify-center mb-6">
          {/* Cyan/Purple hexagon logo */}
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-2xl">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L20 7v10l-8 5-8-5V7l8-5z" fill="white" opacity="0.9" />
            </svg>
          </div>
        </div>

        <h1 className="hero-animate text-5xl md:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">
          Our Multiverse Story
        </h1>
        <p className="hero-animate max-w-2xl mx-auto text-lg md:text-xl text-gray-200/90">
          Connecting strange lifetimes. Our Apostles traverse stargates across the digital cosmos.
        </p>
      </div>
    </section>
  );
};

export default AboutHero;
