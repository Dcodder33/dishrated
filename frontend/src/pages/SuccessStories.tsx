import React from 'react';
import { Star, TrendingUp, Users, MapPin, Quote } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const SuccessStories = () => {
  const stories = [
    {
      name: "Maria's Tacos",
      owner: "Maria Rodriguez",
      location: "Austin, TX",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=2081&auto=format&fit=crop",
      story: "When I started Maria's Tacos, I was struggling to find customers. DishRated changed everything. Within 3 months, my daily sales increased by 200% and I now have a loyal customer base that follows me everywhere I go.",
      metrics: {
        salesIncrease: "200%",
        newCustomers: "1,500+",
        rating: 4.9,
        monthsOnPlatform: 18
      },
      quote: "DishRated didn't just help me find customers - it helped me build a community around my food truck."
    },
    {
      name: "Seoul Kitchen",
      owner: "David Kim",
      location: "Los Angeles, CA",
      image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?q=80&w=2070&auto=format&fit=crop",
      story: "As a Korean fusion truck, I needed to reach adventurous food lovers. DishRated's platform helped me connect with exactly the right audience. The event participation feature has been a game-changer for my business.",
      metrics: {
        salesIncrease: "150%",
        newCustomers: "2,200+",
        rating: 4.8,
        monthsOnPlatform: 24
      },
      quote: "The analytics helped me understand my customers better and optimize my menu for maximum appeal."
    },
    {
      name: "Burger Bliss",
      owner: "Jake Thompson",
      location: "Portland, OR",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2099&auto=format&fit=crop",
      story: "I was spending too much time on marketing and not enough time cooking. DishRated's marketing tools and customer insights allowed me to focus on what I do best while still growing my customer base consistently.",
      metrics: {
        salesIncrease: "180%",
        newCustomers: "1,800+",
        rating: 4.7,
        monthsOnPlatform: 12
      },
      quote: "The location sharing feature means my customers always know where to find me. No more lost sales!"
    },
    {
      name: "Sweet Treats Mobile",
      owner: "Sarah Johnson",
      location: "Miami, FL",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=2089&auto=format&fit=crop",
      story: "Starting a dessert truck was my dream, but I didn't know how to reach customers. DishRated's platform connected me with sweet-toothed customers across Miami. Now I'm booked for events months in advance.",
      metrics: {
        salesIncrease: "250%",
        newCustomers: "3,000+",
        rating: 4.9,
        monthsOnPlatform: 15
      },
      quote: "From struggling to make ends meet to having a waiting list for events - DishRated made it possible."
    }
  ];

  const stats = [
    {
      icon: TrendingUp,
      value: "175%",
      label: "Average Sales Increase",
      description: "Vendors see significant growth within their first 6 months"
    },
    {
      icon: Users,
      value: "50,000+",
      label: "New Customers Connected",
      description: "Monthly new customer connections across our platform"
    },
    {
      icon: Star,
      value: "4.8",
      label: "Average Vendor Rating",
      description: "High customer satisfaction across all food trucks"
    },
    {
      icon: MapPin,
      value: "500+",
      label: "Active Food Trucks",
      description: "Growing community of successful vendors"
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
              Success Stories
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Discover how food truck owners like you have transformed their businesses with DishRated. 
              Real stories, real results, real growth.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foodtruck-slate mb-4">
                Platform Impact
              </h2>
              <p className="text-xl text-gray-600">
                The numbers speak for themselves
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <div className="w-16 h-16 bg-foodtruck-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-8 w-8 text-foodtruck-teal" />
                  </div>
                  <div className="text-3xl font-bold text-foodtruck-slate mb-2">
                    {stat.value}
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mb-2">
                    {stat.label}
                  </div>
                  <p className="text-sm text-gray-600">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foodtruck-slate mb-4">
                Vendor Success Stories
              </h2>
              <p className="text-xl text-gray-600">
                Meet the food truck owners who've grown their businesses with DishRated
              </p>
            </div>

            <div className="space-y-16">
              {stories.map((story, index) => (
                <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}>
                  {/* Image */}
                  <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <div className="relative">
                      <img
                        src={story.image}
                        alt={story.name}
                        className="w-full h-80 object-cover rounded-2xl shadow-lg"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{story.metrics.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-3xl font-bold text-foodtruck-slate mb-2">
                          {story.name}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-4">
                          <span className="font-medium">{story.owner}</span>
                          <span className="mx-2">•</span>
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{story.location}</span>
                        </div>
                      </div>

                      <div className="bg-foodtruck-teal/5 border-l-4 border-foodtruck-teal p-6 rounded-r-lg">
                        <Quote className="h-6 w-6 text-foodtruck-teal mb-3" />
                        <p className="text-lg italic text-gray-700 leading-relaxed">
                          "{story.quote}"
                        </p>
                      </div>

                      <p className="text-gray-600 leading-relaxed">
                        {story.story}
                      </p>

                      {/* Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-foodtruck-teal">
                            {story.metrics.salesIncrease}
                          </div>
                          <div className="text-sm text-gray-600">Sales Increase</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-foodtruck-teal">
                            {story.metrics.newCustomers}
                          </div>
                          <div className="text-sm text-gray-600">New Customers</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-foodtruck-teal">
                            {story.metrics.rating}
                          </div>
                          <div className="text-sm text-gray-600">Rating</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-foodtruck-teal">
                            {story.metrics.monthsOnPlatform}
                          </div>
                          <div className="text-sm text-gray-600">Months</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foodtruck-slate mb-4">
                What Our Vendors Say
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  quote: "DishRated helped me turn my passion into a profitable business. The customer insights are invaluable.",
                  author: "Alex Chen",
                  business: "Fusion Express"
                },
                {
                  quote: "The event participation feature has doubled my weekend revenue. Couldn't be happier!",
                  author: "Lisa Martinez",
                  business: "Taco Libre"
                },
                {
                  quote: "Finally, a platform that understands food truck owners. The support team is amazing.",
                  author: "Mike Wilson",
                  business: "BBQ Masters"
                },
                {
                  quote: "My customers love being able to track my location. No more missed sales due to confusion.",
                  author: "Emma Davis",
                  business: "Gourmet Grilled Cheese"
                },
                {
                  quote: "The analytics helped me optimize my menu and increase my average order value by 40%.",
                  author: "Carlos Ruiz",
                  business: "Street Eats"
                },
                {
                  quote: "From day one, DishRated felt like a partner in my success, not just another platform.",
                  author: "Jennifer Lee",
                  business: "Asian Fusion Truck"
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                  <Quote className="h-6 w-6 text-foodtruck-teal mb-4" />
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="border-t pt-4">
                    <div className="font-semibold text-foodtruck-slate">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.business}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-foodtruck-teal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Write Your Success Story?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join hundreds of successful food truck owners who have transformed their businesses with DishRated.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-foodtruck-gold text-foodtruck-slate hover:bg-white px-8 py-3 text-lg font-medium">
                Start Your Free Trial
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-foodtruck-teal px-8 py-3 text-lg"
              >
                Schedule a Demo
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SuccessStories;
