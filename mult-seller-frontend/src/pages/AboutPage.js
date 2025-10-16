import React from 'react';
import ModernHeader from '../components/ModernHeader';
import AboutHero from '../components/about/AboutHero';
import MissionSection from '../components/about/MissionSection';
import JourneyTimeline from '../components/about/JourneyTimeline';
import FeatureCards from '../components/about/FeatureCards';
import CTASection from '../components/about/CTASection';

// Simple About page container - theme is controlled via ModernHeader (prop drilling)
const AboutPage = () => {
  return (
    <div className="about-page">
      <ModernHeader />
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



