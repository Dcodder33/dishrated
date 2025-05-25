
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
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
