import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  { title: 'Why Choose Us?: Seamless Transactions', icon: '🎯', accent: 'from-cyan-400 to-purple-600' },
  { title: 'Vendor Empowerment: Global Reach', icon: '🌍', accent: 'from-blue-400 to-cyan-500' },
  { title: 'Vendor Empowerment: Growth', icon: '📈', accent: 'from-green-400 to-cyan-500' },
  { title: 'Curated Discovery: Curated Discovery', icon: '🔎', accent: 'from-purple-400 to-pink-500' }
];

const FeatureCards = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feature-card', {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 85%' }
      });

      // hover effects
      document.querySelectorAll('.feature-card').forEach((el) => {
        el.addEventListener('mouseenter', () => gsap.to(el, { y: -10, boxShadow: '0 30px 50px rgba(0,0,0,0.25)', duration: 0.35 }));
        el.addEventListener('mouseleave', () => gsap.to(el, { y: 0, boxShadow: '0 10px 20px rgba(0,0,0,0.08)', duration: 0.35 }));
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl font-bold mb-8 text-center">Platform Highlights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c, i) => (
          <div key={i} className="feature-card rounded-2xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-shadow duration-300" style={{ willChange: 'transform' }}>
            <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center" style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}>
              <div className="text-2xl">{c.icon}</div>
            </div>
            <h3 className="font-semibold mb-2">{c.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Trusted by sellers and buyers across galaxies. Fast payouts, transparent fees, and global reach.</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureCards;
