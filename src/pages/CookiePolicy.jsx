import React from 'react';
import { Helmet } from 'react-helmet';
import Breadcrumbs from '@/components/Breadcrumbs';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import { ArrowLeft, Shield, Settings } from 'lucide-react';

const CookiePolicy = () => {
  const { resetConsent } = useCookieConsent();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <>
      <Helmet>
        <title>Cookie Policy - Poseidon Diving Charters</title>
        <meta name="description" content="Comprehensive guide to how Poseidon Diving Charters uses cookies, data collection, and your privacy rights." />
      </Helmet>
      <Breadcrumbs items={[{ name: 'Home', url: '/' }, { name: 'Cookie Policy', url: '/cookies' }]} />
      
      <div className="pt-24 min-h-screen bg-[#f5f7f9] dark:bg-[#0b1216]">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Link to="/" className="inline-flex items-center text-[#8c959f] dark:text-gray-400 hover:text-[#03c4c9] mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>

          <motion.div 
            {...fadeInUp}
            className="bg-white dark:bg-[#162026] p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-[#e6fcfc] dark:bg-[#0f2e30] p-3 rounded-full text-[#03c4c9]">
                <Shield size={32} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#2d353b] dark:text-white">Cookie Policy</h1>
                <p className="text-sm text-[#8c959f] dark:text-gray-400">Effective Date: January 14, 2026</p>
              </div>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none text-[#5e666e] dark:text-gray-300">
              <section className="mb-10">
                <h2 className="text-xl font-bold text-[#2d353b] dark:text-white mb-4">1. Introduction</h2>
                <p>
                  At Poseidon Diving Charters ("we", "us", or "our"), we respect your privacy and are committed to protecting your personal data. This Cookie Policy explains how and why we use cookies and similar technologies when you visit our website.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-xl font-bold text-[#2d353b] dark:text-white mb-4">2. What Are Cookies?</h2>
                <p>
                  Cookies are small text files placed on your device (computer, smartphone, tablet) when you visit a website. They allow the website to recognize your device, remember your preferences, and improve your user experience. Cookies do not typically contain any information that personally identifies a user, but personal information that we store about you may be linked to the information stored in and obtained from cookies.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-xl font-bold text-[#2d353b] dark:text-white mb-4">3. Categories of Cookies We Use</h2>
                
                <div className="space-y-6 mt-6">
                  <div className="bg-[#f9fafb] dark:bg-[#111a1f] p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-[#2d353b] dark:text-white mb-2">Essential Cookies</h3>
                    <p className="text-sm mb-4">
                      These cookies are strictly necessary for the website to function properly. They enable basic functions like page navigation, secure areas access, and booking management. You cannot opt-out of these cookies as the website cannot function without them.
                    </p>
                    <ul className="list-disc list-inside text-sm space-y-1 text-[#8c959f]">
                      <li><strong>Session ID:</strong> Maintains your session state while you navigate.</li>
                      <li><strong>Security Tokens:</strong> Prevents Cross-Site Request Forgery (CSRF).</li>
                      <li><strong>Cookie Consent:</strong> Remembers your cookie preferences.</li>
                    </ul>
                  </div>

                  <div className="bg-[#f9fafb] dark:bg-[#111a1f] p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-[#2d353b] dark:text-white mb-2">Analytics Cookies</h3>
                    <p className="text-sm mb-4">
                      These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us identify which pages are most popular and troubleshoot errors.
                    </p>
                    <ul className="list-disc list-inside text-sm space-y-1 text-[#8c959f]">
                      <li><strong>Google Analytics:</strong> Tracks page views, time on site, and traffic sources (IP addresses are anonymized).</li>
                      <li><strong>Performance:</strong> Measures load times and responsiveness.</li>
                    </ul>
                  </div>

                  <div className="bg-[#f9fafb] dark:bg-[#111a1f] p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-[#2d353b] dark:text-white mb-2">Marketing Cookies</h3>
                    <p className="text-sm mb-4">
                      These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.
                    </p>
                    <ul className="list-disc list-inside text-sm space-y-1 text-[#8c959f]">
                      <li><strong>Stripe:</strong> Uses cookies for fraud detection and secure payment processing.</li>
                      <li><strong>Social Media:</strong> Integration with Instagram and Facebook.</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-xl font-bold text-[#2d353b] dark:text-white mb-4">4. Data Retention</h2>
                <p>
                  We only retain cookie data for as long as necessary to fulfill the purposes outlined in this policy. Session cookies are deleted when you close your browser, while persistent cookies remain on your device for a set period (usually between 30 days and 2 years) or until you manually delete them.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-xl font-bold text-[#2d353b] dark:text-white mb-4">5. Managing Your Preferences</h2>
                <p className="mb-6">
                  You have the right to decide whether to accept or reject cookies. You can change your cookie preferences at any time by clicking the button below. This will reopen the consent banner.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center bg-[#f0fdfd] dark:bg-[#082024] p-6 rounded-xl border border-[#bfeeee] dark:border-[#0f3d42]">
                  <Settings className="text-[#03c4c9]" size={24} />
                  <div className="flex-1">
                    <h4 className="font-bold text-[#2d353b] dark:text-white">Cookie Settings</h4>
                    <p className="text-xs text-[#8c959f]">Update your consent choices or reset stored preferences.</p>
                  </div>
                  <Button onClick={resetConsent} className="whitespace-nowrap bg-[#03c4c9] hover:bg-[#029a9e]">
                    Manage Preferences
                  </Button>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-[#2d353b] dark:text-white mb-4">6. Contact Us</h2>
                <p>
                  If you have any questions about our use of cookies or your personal data, please contact us at <a href="mailto:info@poseidondivingcharters.com" className="text-[#03c4c9] hover:underline">info@poseidondivingcharters.com</a>.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CookiePolicy;