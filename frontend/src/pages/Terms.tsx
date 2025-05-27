import React from 'react';
import { FileText, Scale, Shield, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-foodtruck-teal to-foodtruck-slate py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Scale className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              These terms govern your use of DishRated. Please read them carefully before using our platform.
            </p>
            <p className="text-white/80 mt-4">
              Last updated: March 1, 2024
            </p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Overview */}
            <div className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="w-12 h-12 bg-foodtruck-teal/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-6 w-6 text-foodtruck-teal" />
                  </div>
                  <h3 className="font-semibold text-foodtruck-slate mb-2">Clear Terms</h3>
                  <p className="text-sm text-gray-600">Straightforward language about our service</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-foodtruck-teal/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-foodtruck-teal" />
                  </div>
                  <h3 className="font-semibold text-foodtruck-slate mb-2">Fair Usage</h3>
                  <p className="text-sm text-gray-600">Guidelines for responsible platform use</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-foodtruck-teal/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="h-6 w-6 text-foodtruck-teal" />
                  </div>
                  <h3 className="font-semibold text-foodtruck-slate mb-2">Your Rights</h3>
                  <p className="text-sm text-gray-600">Understanding your rights and responsibilities</p>
                </div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-600 mb-6">
                  By accessing or using DishRated ("the Service"), you agree to be bound by these Terms of Service ("Terms"). 
                  If you disagree with any part of these terms, you may not access the Service. These Terms apply to all 
                  visitors, users, and others who access or use the Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">2. Description of Service</h2>
                <p className="text-gray-600 mb-4">
                  DishRated is a platform that connects food truck vendors with customers. Our services include:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>Food truck discovery and location tracking</li>
                  <li>Menu browsing and ordering capabilities</li>
                  <li>Review and rating system</li>
                  <li>Event listings and participation</li>
                  <li>Vendor dashboard and management tools</li>
                  <li>Customer communication features</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">3. User Accounts</h2>
                
                <h3 className="text-xl font-semibold text-foodtruck-slate mb-3">Account Creation</h3>
                <p className="text-gray-600 mb-4">
                  To use certain features of the Service, you must create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your account information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>

                <h3 className="text-xl font-semibold text-foodtruck-slate mb-3">Account Termination</h3>
                <p className="text-gray-600 mb-6">
                  You may terminate your account at any time. We reserve the right to suspend or terminate accounts 
                  that violate these Terms or for any other reason at our sole discretion.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">4. Acceptable Use</h2>
                <p className="text-gray-600 mb-4">
                  You agree not to use the Service to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Post false, misleading, or fraudulent content</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Distribute spam, malware, or harmful content</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with the proper functioning of the Service</li>
                  <li>Use the Service for commercial purposes without authorization</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">5. Vendor Terms</h2>
                
                <h3 className="text-xl font-semibold text-foodtruck-slate mb-3">Vendor Responsibilities</h3>
                <p className="text-gray-600 mb-4">
                  Food truck vendors using our platform agree to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>Provide accurate business and menu information</li>
                  <li>Maintain current operating hours and location data</li>
                  <li>Comply with all applicable food safety regulations</li>
                  <li>Honor orders placed through the platform</li>
                  <li>Respond to customer inquiries in a timely manner</li>
                  <li>Maintain appropriate business licenses and permits</li>
                </ul>

                <h3 className="text-xl font-semibold text-foodtruck-slate mb-3">Fees and Payments</h3>
                <p className="text-gray-600 mb-6">
                  Vendor subscription fees are outlined in our pricing page. Payment terms, refund policies, 
                  and fee structures are subject to the specific vendor agreement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">6. Content and Intellectual Property</h2>
                
                <h3 className="text-xl font-semibold text-foodtruck-slate mb-3">User Content</h3>
                <p className="text-gray-600 mb-4">
                  You retain ownership of content you post on the Service. By posting content, you grant us a 
                  non-exclusive, worldwide, royalty-free license to use, display, and distribute your content 
                  in connection with the Service.
                </p>

                <h3 className="text-xl font-semibold text-foodtruck-slate mb-3">Our Content</h3>
                <p className="text-gray-600 mb-6">
                  The Service and its original content, features, and functionality are owned by DishRated and 
                  are protected by international copyright, trademark, and other intellectual property laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">7. Privacy</h2>
                <p className="text-gray-600 mb-6">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your 
                  use of the Service, to understand our practices regarding the collection and use of your information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">8. Disclaimers</h2>
                <p className="text-gray-600 mb-4">
                  The Service is provided "as is" and "as available" without warranties of any kind. We disclaim 
                  all warranties, including but not limited to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>Merchantability and fitness for a particular purpose</li>
                  <li>Non-infringement of third-party rights</li>
                  <li>Uninterrupted or error-free operation</li>
                  <li>Accuracy or reliability of content</li>
                  <li>Security of data transmission</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">9. Limitation of Liability</h2>
                <p className="text-gray-600 mb-6">
                  To the maximum extent permitted by law, DishRated shall not be liable for any indirect, 
                  incidental, special, consequential, or punitive damages, including but not limited to loss 
                  of profits, data, or business opportunities, arising from your use of the Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">10. Indemnification</h2>
                <p className="text-gray-600 mb-6">
                  You agree to indemnify and hold harmless DishRated and its affiliates from any claims, 
                  damages, losses, or expenses arising from your use of the Service, violation of these Terms, 
                  or infringement of any third-party rights.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">11. Governing Law</h2>
                <p className="text-gray-600 mb-6">
                  These Terms shall be governed by and construed in accordance with the laws of the State of 
                  New York, without regard to its conflict of law provisions. Any disputes arising from these 
                  Terms shall be resolved in the courts of New York.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">12. Changes to Terms</h2>
                <p className="text-gray-600 mb-6">
                  We reserve the right to modify these Terms at any time. We will notify users of material 
                  changes by posting the updated Terms on this page and updating the "Last updated" date. 
                  Your continued use of the Service after changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">13. Contact Information</h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about these Terms, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-600 mb-2"><strong>Email:</strong> legal@dishrated.com</p>
                  <p className="text-gray-600 mb-2"><strong>Address:</strong> 123 Food Street, Culinary District, New York, NY 10001</p>
                  <p className="text-gray-600"><strong>Phone:</strong> +1 (555) 123-4567</p>
                </div>
              </section>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
