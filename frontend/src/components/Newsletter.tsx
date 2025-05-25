
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulating form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmail('');
      
      // Reset success state after a few seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };
  
  return (
    <section className="py-16 bg-yellow-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-foodtruck-teal/5 to-foodtruck-lightgray/50 z-0"></div>
      
      {/* Add decorative elements using the gold color */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-foodtruck-gold/5 rounded-full animate-float"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-foodtruck-gold/10 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-2 text-foodtruck-teal">
            <Send className="h-6 w-6 mx-auto hover:text-foodtruck-gold transition-colors duration-300" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foodtruck-slate mb-4">
            Get <span className="text-foodtruck-gold">Foodie</span> Updates
          </h2>
          <p className="text-foodtruck-slate/80 mb-8">
            Subscribe to our newsletter for the latest food truck news, event announcements, and exclusive deals.
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full px-4 py-3 rounded-full border border-foodtruck-slate/20 focus:outline-none focus:ring-2 focus:ring-foodtruck-gold/50 focus:border-transparent transition-all duration-300"
                  disabled={isSubmitting || isSubmitted}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className={cn(
                  "px-6 py-3 rounded-full font-medium shadow-lg transition-all duration-300",
                  isSubmitted
                    ? "bg-green-500 text-white"
                    : "bg-foodtruck-teal text-white hover:bg-foodtruck-slate relative overflow-hidden group"
                )}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : isSubmitted ? (
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Subscribed!
                  </span>
                ) : (
                  <>
                    <span className="relative z-10">Get Foodie Updates</span>
                    <span className="absolute bottom-0 left-0 w-full h-0 bg-foodtruck-gold transition-all duration-300 group-hover:h-full"></span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-foodtruck-slate/60 mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
