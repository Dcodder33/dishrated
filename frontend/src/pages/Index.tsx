
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import NearbyTrucks from '@/components/NearbyTrucks';
import TrendingTrucks from '@/components/TrendingTrucks';
import UpcomingEvents from '@/components/UpcomingEvents';
import HowItWorks from '@/components/HowItWorks';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

const Index = () => {
  // Smooth scroll to element function
  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50 relative">
      {/* Background Design Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-teal-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-yellow-200/40 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-blue-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-teal-300/25 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-teal-200/20 to-yellow-200/20 rounded-full blur-3xl"></div>
      </div>

      <Navbar />

      <main className="flex-grow pt-16 md:pt-20">
        <Hero />

        <div id="nearby-trucks">
          <NearbyTrucks />
        </div>

        <div id="trending-trucks">
          <TrendingTrucks />
        </div>

        <div id="upcoming-events">
          <UpcomingEvents />
        </div>

        <div id="how-it-works">
          <HowItWorks />
        </div>

        <div id="newsletter">
          <Newsletter />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
