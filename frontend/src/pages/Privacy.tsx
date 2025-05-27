import React from 'react';
import { Shield, Eye, Lock, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-foodtruck-teal to-foodtruck-slate py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="text-white/80 mt-4">
              Last updated: March 1, 2024
            </p>
          </div>
        </section>

        {/* Privacy Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Overview */}
            <div className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="w-12 h-12 bg-foodtruck-teal/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Eye className="h-6 w-6 text-foodtruck-teal" />
                  </div>
                  <h3 className="font-semibold text-foodtruck-slate mb-2">Transparency</h3>
                  <p className="text-sm text-gray-600">We're clear about what data we collect and why</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-foodtruck-teal/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Lock className="h-6 w-6 text-foodtruck-teal" />
                  </div>
                  <h3 className="font-semibold text-foodtruck-slate mb-2">Security</h3>
                  <p className="text-sm text-gray-600">Your data is protected with industry-standard security</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-foodtruck-teal/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-foodtruck-teal" />
                  </div>
                  <h3 className="font-semibold text-foodtruck-slate mb-2">Control</h3>
                  <p className="text-sm text-gray-600">You have control over your personal information</p>
                </div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">1. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-foodtruck-slate mb-3">Personal Information</h3>
                <p className="text-gray-600 mb-4">
                  When you create an account or use our services, we may collect:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>Name and contact information (email, phone number)</li>
                  <li>Account credentials (username, password)</li>
                  <li>Profile information and preferences</li>
                  <li>Payment information (processed securely by third-party providers)</li>
                  <li>Business information (for food truck vendors)</li>
                </ul>

                <h3 className="text-xl font-semibold text-foodtruck-slate mb-3">Usage Information</h3>
                <p className="text-gray-600 mb-4">
                  We automatically collect information about how you use our platform:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage patterns and interactions with our platform</li>
                  <li>Location data (when you choose to share it)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-600 mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>Provide and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Personalize your experience on our platform</li>
                  <li>Analyze usage patterns to improve our services</li>
                  <li>Prevent fraud and ensure platform security</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">3. Information Sharing</h2>
                <p className="text-gray-600 mb-4">
                  We do not sell your personal information. We may share your information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li><strong>With your consent:</strong> When you explicitly agree to share information</li>
                  <li><strong>Service providers:</strong> With trusted third parties who help us operate our platform</li>
                  <li><strong>Business transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                  <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Public information:</strong> Reviews, ratings, and business information you choose to make public</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">4. Data Security</h2>
                <p className="text-gray-600 mb-4">
                  We implement appropriate security measures to protect your information:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Secure data centers and infrastructure</li>
                  <li>Employee training on data protection</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">5. Your Rights and Choices</h2>
                <p className="text-gray-600 mb-4">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li><strong>Access:</strong> Request a copy of your personal information</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request your data in a portable format</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong>Location:</strong> Control location sharing settings</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">6. Cookies and Tracking</h2>
                <p className="text-gray-600 mb-4">
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze how you use our platform</li>
                  <li>Provide personalized content and features</li>
                  <li>Measure the effectiveness of our marketing</li>
                </ul>
                <p className="text-gray-600 mb-6">
                  You can control cookies through your browser settings, but some features may not work properly if cookies are disabled.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">7. Children's Privacy</h2>
                <p className="text-gray-600 mb-6">
                  Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">8. International Data Transfers</h2>
                <p className="text-gray-600 mb-6">
                  Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and that your information receives adequate protection.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">9. Changes to This Policy</h2>
                <p className="text-gray-600 mb-6">
                  We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foodtruck-slate mb-4">10. Contact Us</h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about this privacy policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-600 mb-2"><strong>Email:</strong> privacy@dishrated.com</p>
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

export default Privacy;
