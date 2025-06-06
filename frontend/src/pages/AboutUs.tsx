import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

// ---------------------- About Us Page ---------------------- //
export const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Design Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-foodtruck-teal/5 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-foodtruck-gold/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-blue-200/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-foodtruck-teal/8 rounded-full blur-lg"></div>
      </div>

      <Navbar />
      <main className="flex-grow pt-20 pb-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <header className="text-center mb-16">
            <h1 className="font-serif text-5xl font-bold text-foodtruck-teal mb-4">
              About Us
            </h1>
            <p className="max-w-2xl mx-auto text-foodtruck-slate text-lg">
              We are Food Truck Tracker—a passionate team on a mission to connect food lovers with extraordinary street food experiences.
            </p>
          </header>
          {/* Our Mission */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-foodtruck-teal mb-4">Our Mission</h2>
            <p className="text-foodtruck-slate text-lg mb-4">
              Our mission is to revolutionize the way people discover and enjoy food trucks by providing real-time updates, engaging community interactions, and empowering vendors with innovative tools. We believe every meal should be an adventure.
            </p>
            <p className="text-foodtruck-slate text-lg">
              By leveraging technology and a deep passion for street food, we bring you closer to the flavors and stories behind every truck.
            </p>
          </section>

          {/* Our Journey */}
          <section className="mb-16 grid md:grid-cols-2 gap-8">
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-foodtruck-teal mb-4">Our Journey</h2>
              <p className="text-foodtruck-slate text-lg mb-4">
                From our humble beginnings as a group of food enthusiasts and tech innovators, we have grown into a vibrant community. Our journey is one of passion, persistence, and a deep love for the unique culinary experiences offered by food trucks.
              </p>
              <p className="text-foodtruck-slate text-lg">
                Every update and feature is designed with our community in mind. We celebrate the small victories, learn from challenges, and continuously strive to bring the best street food experiences to your fingertips.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1630706884490-8da5febdb854?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Our Journey"
                className="rounded-lg shadow-lg"
              />
            </div>
          </section>
          {/* Our Team */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-foodtruck-teal mb-8 text-center">Meet Our Team</h2>
            <div className="flex justify-center">
              {/* Team Member - Dhruv Gorai */}
              <div className="bg-white rounded-xl shadow-md p-8 max-w-sm">
                <div className="rounded-full w-32 h-32 mx-auto mb-6 border-4 border-foodtruck-gold overflow-hidden bg-gray-100">
                  <img
                    src="/images/Dhruv-gorai.png"
                    alt="Dhruv Gorai"
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: 'center 20%',
                      transform: 'scale(1.4)',
                      backgroundColor: 'transparent'
                    }}
                  />
                </div>
                <h3 className="text-2xl font-bold text-foodtruck-teal text-center">Dhruv Gorai</h3>
                <p className="text-foodtruck-slate text-center font-medium">Developer</p>
                <p className="text-foodtruck-slate text-sm mt-3 text-center leading-relaxed">
                  Full-stack developer passionate about creating innovative solutions that connect food lovers with amazing culinary experiences.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;