import React from 'react';
import { Eye, Ear, Hand, Heart } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Accessibility = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-foodtruck-teal to-foodtruck-slate py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Accessibility Statement
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              DishRated is committed to ensuring digital accessibility for people with disabilities. 
              We continually improve the user experience for everyone.
            </p>
          </div>
        </section>

        {/* Accessibility Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Overview */}
            <div className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="w-12 h-12 bg-foodtruck-teal/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Eye className="h-6 w-6 text-foodtruck-teal" />
                  </div>
                  <h3 className="font-semibold text-foodtruck-slate mb-2">Visual</h3>
                  <p className="text-sm text-gray-600">Screen reader compatible, high contrast, scalable text</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-foodtruck-teal/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Ear className="h-6 w-6 text-foodtruck-teal" />
                  </div>
                  <h3 className="font-semibold text-foodtruck-slate mb-2">Auditory</h3>
                  <p className="text-sm text-gray-600">Visual indicators, captions, and text alternatives</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-foodtruck-teal/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Hand className="h-6 w-6 text-foodtruck-teal" />
                  </div>
                  <h3 className="font-semibold text-foodtruck-slate mb-2">Motor</h3>
                  <p className="text-sm text-gray-600">Keyboard navigation, large click targets</p>
                </div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">Our Commitment</h2>
                <p className="text-gray-600 mb-6">
                  DishRated is committed to providing a website that is accessible to the widest possible audience, 
                  regardless of technology or ability. We are actively working to increase the accessibility and 
                  usability of our website and in doing so adhere to many of the available standards and guidelines.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">Standards Compliance</h2>
                <p className="text-gray-600 mb-4">
                  This website endeavors to conform to level AA of the World Wide Web Consortium (W3C) Web Content 
                  Accessibility Guidelines 2.1. These guidelines explain how to make web content more accessible for 
                  people with disabilities, and user friendly for everyone.
                </p>
                <p className="text-gray-600 mb-6">
                  The guidelines have three levels of compliance: A, AA, and AAA. We have chosen Level AA as our 
                  target as it covers a wide range of recommendations for making content accessible.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">Accessibility Features</h2>
                
                <h3 className="text-xl font-semibold text-foodtruck-slate mb-3">Visual Accessibility</h3>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>High contrast color schemes for better readability</li>
                  <li>Scalable text that can be enlarged up to 200% without loss of functionality</li>
                  <li>Alternative text for all images and graphics</li>
                  <li>Clear visual focus indicators for keyboard navigation</li>
                  <li>Consistent navigation and layout throughout the site</li>
                </ul>

                <h3 className="text-xl font-semibold text-foodtruck-slate mb-3">Keyboard Navigation</h3>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>Full keyboard accessibility for all interactive elements</li>
                  <li>Logical tab order throughout all pages</li>
                  <li>Skip links to main content areas</li>
                  <li>Keyboard shortcuts for common actions</li>
                </ul>

                <h3 className="text-xl font-semibold text-foodtruck-slate mb-3">Screen Reader Support</h3>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>Semantic HTML markup for proper content structure</li>
                  <li>ARIA labels and descriptions where appropriate</li>
                  <li>Descriptive link text and button labels</li>
                  <li>Proper heading hierarchy for easy navigation</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">Assistive Technologies</h2>
                <p className="text-gray-600 mb-4">
                  Our website is designed to be compatible with the following assistive technologies:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>Screen readers (JAWS, NVDA, VoiceOver, TalkBack)</li>
                  <li>Voice recognition software</li>
                  <li>Keyboard-only navigation</li>
                  <li>Switch navigation devices</li>
                  <li>Screen magnification software</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">Browser Compatibility</h2>
                <p className="text-gray-600 mb-4">
                  Our website is designed to work with recent versions of the following browsers:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>Google Chrome</li>
                  <li>Mozilla Firefox</li>
                  <li>Safari</li>
                  <li>Microsoft Edge</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">Known Limitations</h2>
                <p className="text-gray-600 mb-4">
                  Despite our efforts, some limitations may exist. Known issues include:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>Some third-party embedded content may not be fully accessible</li>
                  <li>Complex interactive maps may have limited screen reader support</li>
                  <li>Some dynamic content updates may not be immediately announced to screen readers</li>
                </ul>
                <p className="text-gray-600 mb-6">
                  We are actively working to address these limitations and improve accessibility across all features.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">Ongoing Efforts</h2>
                <p className="text-gray-600 mb-4">
                  We are continuously working to improve the accessibility of our website. Our efforts include:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>Regular accessibility audits and testing</li>
                  <li>User testing with people who use assistive technologies</li>
                  <li>Staff training on accessibility best practices</li>
                  <li>Incorporating accessibility into our design and development process</li>
                  <li>Staying updated with the latest accessibility standards and guidelines</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">Feedback and Contact</h2>
                <p className="text-gray-600 mb-4">
                  We welcome your feedback on the accessibility of DishRated. Please let us know if you encounter 
                  accessibility barriers or have suggestions for improvement:
                </p>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-foodtruck-slate mb-3">Contact Information</h4>
                  <p className="text-gray-600 mb-2"><strong>Email:</strong> accessibility@dishrated.com</p>
                  <p className="text-gray-600 mb-2"><strong>Phone:</strong> +1 (555) 123-4567</p>
                  <p className="text-gray-600 mb-2"><strong>Address:</strong> 123 Food Street, Culinary District, New York, NY 10001</p>
                </div>

                <p className="text-gray-600 mb-6">
                  When contacting us about accessibility, please include:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>The specific page or feature you're having trouble with</li>
                  <li>The assistive technology you're using</li>
                  <li>A description of the problem you encountered</li>
                  <li>Your contact information for follow-up</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">Alternative Access</h2>
                <p className="text-gray-600 mb-6">
                  If you are unable to access any content or use any feature on our website due to a disability, 
                  we are happy to provide the information through an alternative communication method. Please 
                  contact us using the information above, and we will work with you to provide the information 
                  or service you need through an alternative method.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">Assessment and Review</h2>
                <p className="text-gray-600 mb-6">
                  This accessibility statement was last reviewed on March 1, 2024. We review and update this 
                  statement regularly to ensure it remains accurate and reflects our current accessibility efforts. 
                  The website was last tested for accessibility compliance in February 2024.
                </p>
              </section>

            </div>
          </div>
        </section>

        {/* Quick Tips Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foodtruck-slate mb-4">
                Accessibility Tips
              </h2>
              <p className="text-xl text-gray-600">
                Quick tips to improve your browsing experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-foodtruck-slate mb-3">
                  Keyboard Navigation
                </h3>
                <p className="text-gray-600 mb-4">
                  Use Tab to move forward, Shift+Tab to move backward, and Enter or Space to activate links and buttons.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-foodtruck-slate mb-3">
                  Text Size
                </h3>
                <p className="text-gray-600 mb-4">
                  Use Ctrl/Cmd + Plus (+) to increase text size, Ctrl/Cmd + Minus (-) to decrease, and Ctrl/Cmd + 0 to reset.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-foodtruck-slate mb-3">
                  High Contrast
                </h3>
                <p className="text-gray-600 mb-4">
                  Enable high contrast mode in your operating system settings for better visibility of text and interface elements.
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

export default Accessibility;
