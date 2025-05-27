import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Truck, Mail, Lock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const VendorLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      // Simulate login process
      setTimeout(async () => {
        // For demo purposes, accept any email/password combination
        if (formData.email && formData.password) {
          // Mock successful login
          const mockUser = {
            id: '1',
            email: formData.email,
            name: 'Food Truck Owner',
            role: 'owner'
          };

          await login(mockUser);

          toast({
            title: "Welcome back!",
            description: "Successfully logged in to your vendor dashboard.",
          });

          navigate('/owner/dashboard');
        } else {
          toast({
            title: "Login Failed",
            description: "Please check your credentials and try again.",
            variant: "destructive"
          });
        }
        setIsSubmitting(false);
      }, 1500);
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-foodtruck-teal to-foodtruck-slate py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Truck className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Vendor Login
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Access your food truck dashboard to manage your business, track orders, and connect with customers.
            </p>
          </div>
        </section>

        {/* Login Form Section */}
        <section className="py-16">
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foodtruck-slate mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-600">
                  Sign in to your vendor account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foodtruck-teal focus:border-transparent transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-foodtruck-teal hover:text-foodtruck-slate transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foodtruck-teal focus:border-transparent transition-colors"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-foodtruck-teal focus:ring-foodtruck-teal border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-foodtruck-teal hover:bg-foodtruck-teal/90 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Don't have a vendor account?{' '}
                    <Link to="/vendor-signup" className="text-foodtruck-teal hover:text-foodtruck-teal/80 font-medium">
                      Apply to become a vendor
                    </Link>
                  </p>
                </div>

                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Looking for customer login?{' '}
                    <Link to="/login" className="text-foodtruck-teal hover:text-foodtruck-teal/80 font-medium">
                      Customer Login
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            {/* Demo Credentials */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials</h3>
              <p className="text-sm text-blue-700">
                For testing purposes, you can use any email and password combination to log in.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foodtruck-slate mb-4">
                Vendor Dashboard Features
              </h2>
              <p className="text-xl text-gray-600">
                Everything you need to manage your food truck business
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-foodtruck-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-foodtruck-teal" />
                </div>
                <h3 className="text-xl font-semibold text-foodtruck-slate mb-2">
                  Truck Management
                </h3>
                <p className="text-gray-600">
                  Update your truck information, menu, and operating hours
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-foodtruck-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-foodtruck-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foodtruck-slate mb-2">
                  Analytics
                </h3>
                <p className="text-gray-600">
                  Track your performance with detailed insights and reports
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-foodtruck-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-foodtruck-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foodtruck-slate mb-2">
                  Location Sharing
                </h3>
                <p className="text-gray-600">
                  Share your real-time location with customers
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default VendorLogin;
