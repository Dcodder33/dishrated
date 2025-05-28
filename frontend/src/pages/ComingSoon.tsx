import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Star, Truck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ComingSoon = () => {
  return (
    <div className="min-h-screen flex flex-col bg-yellow-50">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-16 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Icon */}
          <div className="mb-8">
            <div className="relative inline-flex items-center justify-center w-24 h-24 bg-foodtruck-teal rounded-full">
              <Clock className="h-12 w-12 text-white" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <Star className="h-4 w-4 text-foodtruck-slate" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foodtruck-slate mb-4">
            Coming Soon!
          </h1>
          
          {/* Subheading */}
          <p className="text-xl text-foodtruck-slate/80 mb-8">
            We're cooking up something amazing for you
          </p>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center justify-center mb-4">
              <Truck className="h-8 w-8 text-foodtruck-teal mr-3" />
              <h2 className="text-2xl font-semibold text-foodtruck-slate">DishRated</h2>
            </div>
            <p className="text-foodtruck-slate/70 leading-relaxed">
              This feature is currently under development. Our team is working hard to bring you 
              the best food truck discovery experience. Stay tuned for exciting updates!
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="w-12 h-12 bg-foodtruck-lightgray rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="font-medium text-foodtruck-slate mb-2">Find Trucks</h3>
              <p className="text-sm text-foodtruck-slate/70">Discover amazing food trucks near you</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="w-12 h-12 bg-foodtruck-lightgray rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="font-medium text-foodtruck-slate mb-2">Reviews</h3>
              <p className="text-sm text-foodtruck-slate/70">Read and write authentic reviews</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="w-12 h-12 bg-foodtruck-lightgray rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎉</span>
              </div>
              <h3 className="font-medium text-foodtruck-slate mb-2">Events</h3>
              <p className="text-sm text-foodtruck-slate/70">Join exciting food truck events</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-foodtruck-teal text-white rounded-lg hover:bg-foodtruck-slate transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            
            <p className="text-sm text-foodtruck-slate/60">
              Want to stay updated? Follow us for the latest news and updates!
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ComingSoon;
