import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Users, MapPin, TrendingUp, Check, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

const OwnerSignup = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    cuisineType: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await apiService.post('/admin/applications', formData);

      if (response.success) {
        toast({
          title: "Application Submitted!",
          description: "We'll review your application and get back to you within 2-3 business days.",
        });
        setFormData({
          businessName: '',
          ownerName: '',
          email: '',
          phone: '',
          cuisineType: '',
          description: ''
        });
      }
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: Users,
      title: "Reach More Customers",
      description: "Connect with thousands of food lovers actively searching for great meals"
    },
    {
      icon: MapPin,
      title: "Location Tracking",
      description: "Share your real-time location so customers can always find you"
    },
    {
      icon: TrendingUp,
      title: "Boost Sales",
      description: "Increase your revenue with our marketing tools and customer insights"
    },
    {
      icon: Truck,
      title: "Easy Management",
      description: "Manage your menu, schedule, and customer interactions from one dashboard"
    }
  ];

  const features = [
    "Real-time location sharing",
    "Menu management system",
    "Customer reviews and ratings",
    "Event participation opportunities",
    "Analytics and insights",
    "Marketing support",
    "Mobile-optimized dashboard",
    "24/7 customer support"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-foodtruck-teal to-foodtruck-slate py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join DishRated as a Food Truck Owner
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Grow your food truck business with our platform. Connect with hungry customers, 
              manage your operations, and increase your revenue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-foodtruck-gold text-foodtruck-slate hover:bg-white px-8 py-3 text-lg font-medium"
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-foodtruck-teal px-8 py-3 text-lg"
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foodtruck-slate mb-4">
                Why Choose DishRated?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join hundreds of successful food truck owners who have grown their business with our platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-foodtruck-teal/10 rounded-lg flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-foodtruck-teal" />
                  </div>
                  <h3 className="text-xl font-semibold text-foodtruck-slate mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foodtruck-slate mb-6">
                  Everything You Need to Succeed
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Our comprehensive platform provides all the tools you need to manage and grow your food truck business.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8" id="signup-form">
                <h3 className="text-2xl font-bold text-foodtruck-slate mb-6">
                  Start Your Application
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foodtruck-teal focus:border-transparent transition-colors"
                      placeholder="Your food truck name"
                    />
                  </div>

                  <div>
                    <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-2">
                      Owner Name *
                    </label>
                    <input
                      type="text"
                      id="ownerName"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foodtruck-teal focus:border-transparent transition-colors"
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foodtruck-teal focus:border-transparent transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foodtruck-teal focus:border-transparent transition-colors"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cuisineType" className="block text-sm font-medium text-gray-700 mb-2">
                      Cuisine Type *
                    </label>
                    <select
                      id="cuisineType"
                      name="cuisineType"
                      value={formData.cuisineType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foodtruck-teal focus:border-transparent transition-colors"
                    >
                      <option value="">Select cuisine type</option>
                      <option value="american">American</option>
                      <option value="mexican">Mexican</option>
                      <option value="italian">Italian</option>
                      <option value="asian">Asian</option>
                      <option value="indian">Indian</option>
                      <option value="mediterranean">Mediterranean</option>
                      <option value="fusion">Fusion</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Business Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foodtruck-teal focus:border-transparent transition-colors resize-none"
                      placeholder="Tell us about your food truck and what makes it special..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-foodtruck-teal hover:bg-foodtruck-teal/90 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Submitting Application...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>

                  <p className="text-sm text-gray-500 text-center">
                    Already have an account?{' '}
                    <Link to="/owner-login" className="text-foodtruck-teal hover:underline">
                      Sign in here
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OwnerSignup;
