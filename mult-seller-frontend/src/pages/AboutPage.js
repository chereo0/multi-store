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
import React from 'react';
import { useTheme } from '../context/ThemeContext';

const AboutPage = () => {
  const { isDarkMode } = useTheme();

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : ''
      }`}
      style={!isDarkMode ? {
        backgroundImage: 'url(/white%20backgroud.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      } : {}}
    >
      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`rounded-2xl p-8 backdrop-blur-md transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/50 border border-cyan-400/30 shadow-2xl shadow-cyan-400/10' 
            : 'bg-white/80 border border-gray-200 shadow-xl'
        }`}>
          <div className="text-center mb-12">
            <h1 className={`text-4xl font-bold mb-4 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              About Quantum
            </h1>
            <div className={`w-24 h-1 mx-auto rounded-full ${
              isDarkMode ? 'bg-gradient-to-r from-cyan-400 to-purple-500' : 'bg-gradient-to-r from-cyan-500 to-purple-600'
            }`}></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${
                isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
              }`}>
                Welcome to the Future of Commerce
              </h2>
              <p className={`text-lg mb-6 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Quantum is a revolutionary multi-seller platform that connects buyers and sellers across infinite dimensions. 
                We're not just an e-commerce platform – we're a gateway to cosmic commerce.
              </p>
              <p className={`text-lg mb-6 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Our advanced quantum technology ensures secure transactions, instant delivery, and unparalleled shopping experiences. 
                Whether you're exploring the multiverse or shopping locally, Quantum brings the future to your fingertips.
              </p>
            </div>
            
            <div className={`rounded-xl p-6 transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-700/50 border border-gray-600/50' 
                : 'bg-gray-50 border border-gray-200'
            }`}>
              <h3 className={`text-xl font-bold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Our Mission
              </h3>
              <p className={`transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                To revolutionize commerce by creating seamless connections between buyers and sellers across all dimensions, 
                making shopping an extraordinary experience that transcends traditional boundaries.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <h2 className={`text-2xl font-bold mb-8 text-center transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Why Choose Quantum?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Quantum Security',
                  description: 'Advanced encryption and security protocols protect every transaction across all dimensions.',
                  icon: '🔒'
                },
                {
                  title: 'Instant Delivery',
                  description: 'Quantum teleportation technology ensures your orders arrive instantly, anywhere in the multiverse.',
                  icon: '⚡'
                },
                {
                  title: 'Infinite Selection',
                  description: 'Access products from countless sellers across infinite dimensions and parallel universes.',
                  icon: '🌌'
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className={`rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gray-700/50 border border-gray-600/50 hover:border-cyan-400/50' 
                      : 'bg-gray-50 border border-gray-200 hover:border-cyan-300'
                  }`}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className={`text-lg font-bold mb-3 transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;


