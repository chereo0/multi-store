import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const milestones = [
  { id: "start", label: "Start", year: "Origin", icon: "✨" },
  { id: "y1", label: "20YY", year: "20YY", icon: "🚀" },
  { id: "y2", label: "20YZ", year: "20YZ", icon: "🛠️" },
  { id: "expand", label: "Expansion", year: "Expansion", icon: "🌐" },
];

const JourneyTimeline = () => {
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // draw the connecting line
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 0.8,
        },
      });

      tl.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          duration: 1.6,
          ease: "power2.out",
        }
      );

      // animate circles
      gsap.utils.toArray(".timeline-circle").forEach((el, i) => {
        gsap.fromTo(
          el,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            delay: i * 0.15,
            ease: "back.out(1.4)",
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const goTo = (index) => {
    setActive(index);
    // simple scroll into view of the circle
    const el = document.querySelectorAll(".timeline-circle")[index];
    if (el)
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
  };

  return (
    <section ref={containerRef} className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl font-bold mb-8 text-center">Our Journey</h2>

      <div className="relative overflow-x-auto">
        <div className="w-[1200px] mx-auto relative py-12">
          {/* horizontal connecting line */}
          <div className="absolute inset-0 flex items-center">
            <div
              ref={lineRef}
              className="h-1 bg-gradient-to-r from-cyan-400 to-purple-500 origin-left"
              style={{ transform: "scaleX(0)" }}
            ></div>
          </div>

          <div className="relative flex items-center justify-between space-x-8">
            {milestones.map((m, i) => (
              <div key={m.id} className="flex-1 text-center">
                <div
                  className={`mx-auto w-20 h-20 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center timeline-circle ${
                    i === active ? "ring-4 ring-cyan-400" : ""
                  }`}
                  style={{ transform: "scale(0)" }}
                >
                  <div className="text-2xl">{m.icon}</div>
                </div>
                <div className="mt-4 font-semibold">{m.label}</div>
                <div className="text-sm text-gray-500">{m.year}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* navigation dots */}
      <div className="flex items-center justify-center mt-8 space-x-3">
        {milestones.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-3 h-3 rounded-full ${
              i === active ? "bg-cyan-400" : "bg-gray-300"
            }`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default JourneyTimeline;
