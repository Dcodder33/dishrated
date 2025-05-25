
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foodtruck-teal text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo and About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <MapPin className="h-5 w-5 text-foodtruck-teal" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                DishRated
              </span>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              Connecting food lovers with the best mobile eateries in your area. Discover unique flavors, track your favorites, and explore the vibrant world of street food.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/80 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/find-trucks" className="text-white/80 hover:text-white transition-colors text-sm">
                  Find Food Trucks
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-white/80 hover:text-white transition-colors text-sm">
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-white/80 hover:text-white transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/80 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/80 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: For Vendors */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-4">For Vendors</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/vendor-signup" className="text-white/80 hover:text-white transition-colors text-sm">
                  Become a Vendor
                </Link>
              </li>
              <li>
                <Link to="/vendor-login" className="text-white/80 hover:text-white transition-colors text-sm">
                  Vendor Login
                </Link>
              </li>
              <li>
                <Link to="/vendor-resources" className="text-white/80 hover:text-white transition-colors text-sm">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-white/80 hover:text-white transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="text-white/80 hover:text-white transition-colors text-sm">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-4">Get Foodie Updates</h4>
            <p className="text-sm text-white/80 mb-4">
              Subscribe to receive the latest food truck news, events, and exclusive offers.
            </p>
            <form className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2 rounded-lg text-foodtruck-slate bg-white/10 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all placeholder:text-white/50"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-foodtruck-gold text-foodtruck-slate rounded-lg font-medium hover:bg-white hover:text-foodtruck-teal transition-colors button-pulse"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/20 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-white/60 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} DishRated. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-sm text-white/60 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-white/60 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/accessibility" className="text-sm text-white/60 hover:text-white transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
