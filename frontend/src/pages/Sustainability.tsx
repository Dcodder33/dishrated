import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

// ---------------------- Sustainability Page ---------------------- //
export const Sustainability: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <header className="text-center mb-16">
            <h1 className="font-serif text-5xl font-bold text-foodtruck-teal mb-4">
              Sustainability
            </h1>
            <p className="max-w-2xl mx-auto text-foodtruck-slate text-lg">
              Our commitment to a greener future is at the core of everything we do. Discover how we empower food trucks to embrace sustainable practices.
            </p>
          </header>

          {/* Our Sustainability Commitment */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-foodtruck-teal mb-4">Our Sustainability Commitment</h2>
            <p className="text-foodtruck-slate text-lg mb-4">
              At Food Truck Tracker, we believe that delicious food and environmental responsibility go hand in hand. We actively promote vendors who adopt eco-friendly packaging, source local ingredients, and implement waste-reduction measures.
            </p>
            <p className="text-foodtruck-slate text-lg">
              By highlighting sustainable practices, we not only help users make informed choices but also support a network of vendors dedicated to reducing their environmental impact.
            </p>
          </section>

          {/* Success Stories */}
          <section className="mb-16 grid md:grid-cols-2 gap-8">
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-foodtruck-teal mb-4">Success Stories</h2>
              <p className="text-foodtruck-slate text-lg mb-4">
                Real-life examples demonstrate the transformative power of sustainable practices. Our platform has enabled vendors to significantly reduce waste and increase the use of compostable materials.
              </p>
              <p className="text-foodtruck-slate text-lg">
                Explore inspiring stories of vendors who have turned environmental challenges into opportunities, making a positive impact on their communities.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Success Story"
                className="rounded-lg shadow-lg"
              />
            </div>
          </section>

          {/* Community Impact & Partnerships */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-foodtruck-teal mb-4">Community Impact & Partnerships</h2>
            <p className="text-foodtruck-slate text-lg mb-4">
              Our impact extends beyond individual vendors. We collaborate with local NGOs, environmental organizations, and community groups to promote sustainable street food practices.
            </p>
            <p className="text-foodtruck-slate text-lg mb-4">
              Through eco-certification programs, waste reduction workshops, and community events, we’re building a network of partners who share our vision of a greener, healthier future.
            </p>
            <p className="text-foodtruck-slate text-lg">
              Every order and every interaction contributes to a larger movement towards sustainability. Join us in making a difference.
            </p>
          </section>

          {/* Call-to-Action */}
          <section className="text-center">
            <Button
              onClick={() =>
                toast({
                  title: "Stay Tuned",
                  description: "More sustainability initiatives are on the way!",
                })
              }
              variant="outline"
              className="flex items-center mx-auto px-6 py-3 border border-foodtruck-slate/20 rounded-lg text-foodtruck-slate hover:bg-foodtruck-lightgray/50"
            >
              Learn More About Our Initiatives
            </Button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};


export default Sustainability;