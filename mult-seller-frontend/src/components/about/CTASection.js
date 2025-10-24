import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const CTASection = () => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll(".cta-item"), {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.to(el.querySelector(".wave"), {
        xPercent: -20,
        duration: 8,
        ease: "none",
        repeat: -1,
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative py-24">
      <div
        className="absolute inset-0 wave opacity-30 bg-gradient-to-r from-cyan-500 to-purple-500 blur-3xl"
        style={{ filter: "blur(60px)" }}
      />
      <div className="relative max-w-4xl mx-auto text-center z-10">
        <h2 className="text-4xl font-extrabold cta-item">Ready to Explore?</h2>
        <p className="mt-4 text-lg text-gray-200 cta-item">
          Your Adventure Begins Here
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button className="cta-item bg-cyan-400 hover:scale-105 px-6 py-3 rounded-full text-white font-semibold shadow-lg">
            Enquire a consultant
          </button>
          <button className="cta-item border border-white/30 hover:scale-105 px-6 py-3 rounded-full text-white font-semibold bg-transparent">
            Start Shopping Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
