import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCube, Autoplay, Pagination, Navigation } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import "swiper/css/navigation";

/**
 * HeroSlideshow - 3D cube slideshow for hero section
 * props:
 *  - images: string[] of image URLs
 *  - height: css height (e.g., '70vh')
 */
export default function HeroSlideshow({ images = [], height = "70vh" }) {
  const usableImages = (images || []).filter(Boolean);

  if (!usableImages.length) return null;

  return (
    <div className="w-full" style={{ height }}>
      {/* Tweak swiper controls to be visible over images */}
      <style>{`
        .swiper-button-prev, .swiper-button-next { color: #ffffff; }
        .swiper-pagination-bullet { background: rgba(255,255,255,0.7); }
        .swiper-pagination-bullet-active { background: #ffffff; }
        .swiper-slide { display:flex; align-items:center; justify-content:center; background: transparent; }
      `}</style>

      <Swiper
          modules={[EffectCube, Autoplay, Pagination, Navigation]}
          effect="cube"
          grabCursor={true}
          cubeEffect={{
            shadow: true,
            slideShadows: true,
            shadowOffset: 30,
            shadowScale: 0.8,
          }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          pagination={{ clickable: true }}
          navigation
          style={{ height: "100%" }}
        >
        {usableImages.map((src, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={src}
              alt="hero slide"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover", /* fill area, no letterboxing */
              }}
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
