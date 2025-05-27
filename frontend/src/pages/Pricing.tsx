import React, { useState } from 'react';
import { Check, X, Star, Truck, TrendingUp, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { toast } = useToast();

  const plans = [
    {
      name: "Starter",
      description: "Perfect for new food trucks getting started",
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        "Basic truck profile",
        "Menu management",
        "Location sharing",
        "Customer reviews",
        "Basic analytics",
        "Email support"
      ],
      limitations: [
        "Limited to 1 truck",
        "Basic customization",
        "Standard support"
      ],
      popular: false,
      icon: Truck
    },
    {
      name: "Professional",
      description: "For established trucks looking to grow",
      monthlyPrice: 59,
      yearlyPrice: 590,
      features: [
        "Everything in Starter",
        "Advanced analytics",
        "Event participation",
        "Social media integration",
        "Custom branding",
        "Priority support",
        "Marketing tools",
        "Customer insights"
      ],
      limitations: [
        "Limited to 3 trucks"
      ],
      popular: true,
      icon: TrendingUp
    },
    {
      name: "Enterprise",
      description: "For food truck fleets and franchises",
      monthlyPrice: 149,
      yearlyPrice: 1490,
      features: [
        "Everything in Professional",
        "Unlimited trucks",
        "Multi-location management",
        "Advanced reporting",
        "API access",
        "Dedicated account manager",
        "Custom integrations",
        "White-label options"
      ],
      limitations: [],
      popular: false,
      icon: Users
    }
  ];

  const handleGetStarted = (planName: string) => {
    toast({
      title: "Plan Selected!",
      description: `You've selected the ${planName} plan. Redirecting to signup...`,
    });
  };

  const getPrice = (plan: typeof plans[0]) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan: typeof plans[0]) => {
    const monthlyCost = plan.monthlyPrice * 12;
    const yearlyCost = plan.yearlyPrice;
    return monthlyCost - yearlyCost;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-foodtruck-teal to-foodtruck-slate py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Choose the perfect plan for your food truck business. All plans include our core features with no hidden fees.
            </p>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-foodtruck-teal'
                    : 'text-white hover:text-white/80'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-foodtruck-teal'
                    : 'text-white hover:text-white/80'
                }`}
              >
                Yearly
                <span className="ml-2 text-xs bg-foodtruck-gold text-foodtruck-slate px-2 py-1 rounded">
                  Save 17%
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                    plan.popular ? 'ring-2 ring-foodtruck-teal scale-105' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-foodtruck-teal text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-foodtruck-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <plan.icon className="h-8 w-8 text-foodtruck-teal" />
                    </div>
                    <h3 className="text-2xl font-bold text-foodtruck-slate mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {plan.description}
                    </p>
                    
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-foodtruck-slate">
                        ${getPrice(plan)}
                      </span>
                      <span className="text-gray-600">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                    
                    {billingCycle === 'yearly' && (
                      <p className="text-sm text-green-600 font-medium">
                        Save ${getSavings(plan)} per year
                      </p>
                    )}
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                    
                    {plan.limitations.map((limitation, limitationIndex) => (
                      <div key={limitationIndex} className="flex items-center">
                        <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                          <X className="h-3 w-3 text-gray-400" />
                        </div>
                        <span className="text-gray-500">{limitation}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleGetStarted(plan.name)}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                      plan.popular
                        ? 'bg-foodtruck-teal hover:bg-foodtruck-teal/90 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-foodtruck-slate'
                    }`}
                  >
                    Get Started
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foodtruck-slate mb-4">
                Compare All Features
              </h2>
              <p className="text-xl text-gray-600">
                See what's included in each plan
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                        Features
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                        Starter
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                        Professional
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                        Enterprise
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { feature: "Number of Trucks", starter: "1", professional: "3", enterprise: "Unlimited" },
                      { feature: "Menu Management", starter: true, professional: true, enterprise: true },
                      { feature: "Location Sharing", starter: true, professional: true, enterprise: true },
                      { feature: "Customer Reviews", starter: true, professional: true, enterprise: true },
                      { feature: "Basic Analytics", starter: true, professional: true, enterprise: true },
                      { feature: "Advanced Analytics", starter: false, professional: true, enterprise: true },
                      { feature: "Event Participation", starter: false, professional: true, enterprise: true },
                      { feature: "Custom Branding", starter: false, professional: true, enterprise: true },
                      { feature: "API Access", starter: false, professional: false, enterprise: true },
                      { feature: "Dedicated Support", starter: false, professional: false, enterprise: true }
                    ].map((row, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {row.feature}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {typeof row.starter === 'boolean' ? (
                            row.starter ? (
                              <Check className="h-5 w-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-gray-400 mx-auto" />
                            )
                          ) : (
                            <span className="text-sm text-gray-900">{row.starter}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {typeof row.professional === 'boolean' ? (
                            row.professional ? (
                              <Check className="h-5 w-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-gray-400 mx-auto" />
                            )
                          ) : (
                            <span className="text-sm text-gray-900">{row.professional}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {typeof row.enterprise === 'boolean' ? (
                            row.enterprise ? (
                              <Check className="h-5 w-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-gray-400 mx-auto" />
                            )
                          ) : (
                            <span className="text-sm text-gray-900">{row.enterprise}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foodtruck-slate mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "Can I change my plan anytime?",
                  answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
                },
                {
                  question: "Is there a free trial?",
                  answer: "We offer a 14-day free trial for all plans. No credit card required to start your trial."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans."
                },
                {
                  question: "Can I cancel anytime?",
                  answer: "Yes, you can cancel your subscription at any time. Your account will remain active until the end of your current billing period."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-foodtruck-slate mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-foodtruck-teal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Grow Your Food Truck Business?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of successful food truck owners who trust DishRated to grow their business.
            </p>
            
            <Button 
              className="bg-foodtruck-gold text-foodtruck-slate hover:bg-white px-8 py-3 text-lg font-medium"
              onClick={() => handleGetStarted('Professional')}
            >
              Start Your Free Trial
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
