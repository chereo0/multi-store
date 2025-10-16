import React from 'react';
// Use the global Navbar (same as Home) for consistent navigation across pages
import AboutHero from '../components/about/AboutHero';
import MissionSection from '../components/about/MissionSection';
import JourneyTimeline from '../components/about/JourneyTimeline';
import FeatureCards from '../components/about/FeatureCards';
import CTASection from '../components/about/CTASection';

// Simple About page container - theme is controlled via ModernHeader (prop drilling)
const AboutPage = () => {
  return (
    <div className="about-page">
      <main>
        <AboutHero />
        <MissionSection />
        <JourneyTimeline />
        <FeatureCards />
        <CTASection />
      </main>
    </div>
  );
};

export default AboutPage;



