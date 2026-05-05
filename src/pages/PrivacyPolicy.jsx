import React from 'react';
import { Helmet } from 'react-helmet';
import Breadcrumbs from '@/components/Breadcrumbs';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <>
      <Helmet>
        <title>Privacy Policy - Poseidon Diving Charters</title>
        <meta name="description" content="Privacy Policy for Poseidon Diving Charters. Learn how we collect, use, and protect your personal data in accordance with GDPR." />
      </Helmet>
      <Breadcrumbs items={[{ name: 'Home', url: '/' }, { name: 'Privacy Policy', url: '/privacy' }]} />
      
      <div className="pt-24 min-h-screen bg-[#f5f7f9] dark:bg-[#0b1216]">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <motion.div 
            {...fadeInUp}
            className="bg-white dark:bg-[#162026] p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-[#2d353b] dark:text-white">Privacy Policy</h1>
            <p className="text-sm text-[#8c959f] dark:text-gray-400 mb-8">Last Updated: January 13, 2026</p>

            <div className="prose prose-lg dark:prose-invert max-w-none text-[#5e666e] dark:text-gray-300">
              <section className="mb-8">
                <h2 className="text-xl font-bold text-[#2d353b] dark:text-white mb-4">1. Introduction</h2>
                <p>
                  Poseidon Diving Charters collects personal data about you that you provide to us when you use our website or our services, for example when you book a trip or contact our customer service. We are committed to protecting your privacy in accordance with the General Data Protection Regulation (GDPR).
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-[#2d353b] dark:text-white mb-4">2. Data We Collect</h2>
                <p>We may collect and process the following categories of data:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Personal details:</strong> Name, email address, telephone number, address, and photographs/videos from charter occasions.</li>
                  <li><strong>Health details:</strong> Past medical history and medical examinations (required for safety and legal compliance).</li>
                  <li><strong>Charter preferences:</strong> Meals and drinks, dietary and activity preferences, special occasion dates, special accommodations, diving skills, and wetsuit size.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-[#2d353b] dark:text-white mb-4">3. How We Use Your Data</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Identify and authenticate you:</strong> To verify your identity when you access and use our services.</li>
                  <li><strong>Provide emergency and security services:</strong> To protect your vital interests in case of an emergency situation on board.</li>
                  <li><strong>Service Delivery:</strong> To provide the charter services you or your group have requested.</li>
                  <li><strong>Communication:</strong> To notify you of changes to your itinerary or important health and safety information.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-[#2d353b] dark:text-white mb-4">4. Customer Testimonials</h2>
                <p>
                  We may publish guest testimonials and guest photographs on our mailings, brochures, websites, and social media pages. Prior to publishing the testimonial or photographs, we obtain guests' consent to publish their names, charter dates, photos, videos, and travel destinations along with their testimonial, as applicable.
                </p>
                <p className="mt-4">
                  If you wish to update or delete your testimonial, you can contact us via the methods described under <strong>"Contact"</strong>.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-[#2d353b] dark:text-white mb-4">5. Data Storage and Third-Parties</h2>
                <p>
                  We do not sell your personal information. To provide our services, we use trusted third-party providers:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Supabase:</strong> For secure database storage and management of your booking details.</li>
                  <li><strong>Stripe:</strong> For secure payment processing. We do not store credit card details; they are handled directly by Stripe in compliance with PCI-DSS.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-[#2d353b] dark:text-white mb-4">6. Your Rights</h2>
                <p>
                  Under the GDPR, you have the right to access, rectify, or request the deletion of your personal data. You may also withdraw your consent for media publication or object to the processing of your personal data at any time.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#2d353b] dark:text-white mb-4">7. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy or our data practices, please contact MLVDM Green Calm Sea, Lda at <strong>info@poseidondivingcharters.com</strong>.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;