import React from 'react';
import { Download, BookOpen, Video, Users, FileText, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const VendorResources = () => {
  const resources = [
    {
      category: "Getting Started",
      items: [
        {
          title: "Vendor Onboarding Guide",
          description: "Complete step-by-step guide to setting up your food truck on DishRated",
          type: "PDF",
          icon: FileText,
          downloadUrl: "#"
        },
        {
          title: "Platform Overview Video",
          description: "Watch a comprehensive overview of all vendor features",
          type: "Video",
          icon: Video,
          downloadUrl: "#"
        },
        {
          title: "Quick Start Checklist",
          description: "Essential tasks to complete in your first week",
          type: "PDF",
          icon: FileText,
          downloadUrl: "#"
        }
      ]
    },
    {
      category: "Marketing & Growth",
      items: [
        {
          title: "Social Media Marketing Kit",
          description: "Templates, graphics, and best practices for social media",
          type: "ZIP",
          icon: Download,
          downloadUrl: "#"
        },
        {
          title: "Customer Engagement Strategies",
          description: "Proven techniques to build customer loyalty",
          type: "PDF",
          icon: BookOpen,
          downloadUrl: "#"
        },
        {
          title: "Event Participation Guide",
          description: "How to maximize your presence at food truck events",
          type: "PDF",
          icon: FileText,
          downloadUrl: "#"
        }
      ]
    },
    {
      category: "Operations",
      items: [
        {
          title: "Menu Management Best Practices",
          description: "Optimize your menu for maximum appeal and profitability",
          type: "PDF",
          icon: BookOpen,
          downloadUrl: "#"
        },
        {
          title: "Location Strategy Guide",
          description: "Choose the best locations and timing for your truck",
          type: "PDF",
          icon: FileText,
          downloadUrl: "#"
        },
        {
          title: "Customer Service Excellence",
          description: "Training materials for exceptional customer service",
          type: "Video",
          icon: Video,
          downloadUrl: "#"
        }
      ]
    },
    {
      category: "Technical Support",
      items: [
        {
          title: "Dashboard User Manual",
          description: "Detailed guide to using your vendor dashboard",
          type: "PDF",
          icon: BookOpen,
          downloadUrl: "#"
        },
        {
          title: "Mobile App Tutorial",
          description: "How to use the DishRated mobile app for vendors",
          type: "Video",
          icon: Video,
          downloadUrl: "#"
        },
        {
          title: "Troubleshooting Guide",
          description: "Common issues and their solutions",
          type: "PDF",
          icon: FileText,
          downloadUrl: "#"
        }
      ]
    }
  ];

  const webinars = [
    {
      title: "Maximizing Your Food Truck Revenue",
      date: "March 15, 2024",
      time: "2:00 PM EST",
      description: "Learn proven strategies to increase your daily sales and customer retention.",
      status: "upcoming"
    },
    {
      title: "Social Media Marketing for Food Trucks",
      date: "March 8, 2024",
      time: "1:00 PM EST",
      description: "Build your brand and attract customers through effective social media.",
      status: "recorded"
    },
    {
      title: "Seasonal Menu Planning",
      date: "February 28, 2024",
      time: "3:00 PM EST",
      description: "Adapt your menu to seasons and local events for maximum impact.",
      status: "recorded"
    }
  ];

  const faqs = [
    {
      question: "How do I update my truck's location?",
      answer: "You can update your location through the vendor dashboard or mobile app. Go to 'Live Location' and either share your current GPS location or manually set your position on the map."
    },
    {
      question: "How often should I update my menu?",
      answer: "We recommend reviewing your menu monthly and updating it based on seasonal ingredients, customer feedback, and sales data. You can make changes anytime through your dashboard."
    },
    {
      question: "What's the best way to handle customer reviews?",
      answer: "Respond to all reviews professionally and promptly. Thank customers for positive feedback and address concerns in negative reviews constructively. This shows you care about customer experience."
    },
    {
      question: "How can I participate in local events?",
      answer: "Check the Events section in your dashboard regularly. You can apply to participate in events posted by event organizers or create your own events to promote special offers."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-foodtruck-teal to-foodtruck-slate py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Vendor Resources
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Everything you need to succeed on DishRated. From getting started guides to advanced marketing strategies.
            </p>
          </div>
        </section>

        {/* Resources Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {resources.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-12">
                <h2 className="text-3xl font-bold text-foodtruck-slate mb-8">
                  {category.category}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-foodtruck-teal/10 rounded-lg flex items-center justify-center">
                          <item.icon className="h-6 w-6 text-foodtruck-teal" />
                        </div>
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {item.type}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-foodtruck-slate mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {item.description}
                      </p>
                      
                      <Button 
                        className="w-full bg-foodtruck-teal hover:bg-foodtruck-teal/90 text-white"
                        onClick={() => window.open(item.downloadUrl, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Webinars Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foodtruck-slate mb-4">
                Training Webinars
              </h2>
              <p className="text-xl text-gray-600">
                Join our expert-led sessions to grow your business
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {webinars.map((webinar, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      webinar.status === 'upcoming' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {webinar.status === 'upcoming' ? 'Upcoming' : 'Recorded'}
                    </span>
                    <Video className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foodtruck-slate mb-2">
                    {webinar.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {webinar.description}
                  </p>
                  
                  <div className="text-sm text-gray-500 mb-4">
                    <p>{webinar.date} at {webinar.time}</p>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-foodtruck-teal text-foodtruck-teal hover:bg-foodtruck-teal hover:text-white"
                  >
                    {webinar.status === 'upcoming' ? 'Register' : 'Watch Recording'}
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              ))}
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
              <p className="text-xl text-gray-600">
                Quick answers to common vendor questions
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-foodtruck-slate mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">
                Can't find what you're looking for?
              </p>
              <Button className="bg-foodtruck-teal hover:bg-foodtruck-teal/90 text-white">
                Contact Support
              </Button>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="py-16 bg-foodtruck-teal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Need Additional Support?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Our dedicated vendor support team is here to help you succeed. Get personalized assistance when you need it.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-foodtruck-teal px-8 py-3"
              >
                <Users className="h-5 w-5 mr-2" />
                Schedule 1-on-1 Call
              </Button>
              <Button 
                className="bg-foodtruck-gold text-foodtruck-slate hover:bg-white px-8 py-3"
              >
                Join Vendor Community
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default VendorResources;
