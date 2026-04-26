import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const TermsOfService = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <>
      <Helmet>
        <title>Terms of Service - Poseidon Diving Charters</title>
        <meta name="description" content="Terms of Service for Poseidon Diving Charters. Read our user responsibilities, liability limitations, and service agreements." />
      </Helmet>
      
      <div className="pt-24 min-h-screen bg-[#f5f7f9] dark:bg-[#0b1216]">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <motion.div 
            {...fadeInUp}
            className="bg-white dark:bg-[#162026] p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-[#2d353b] dark:text-white">Terms of Service</h1>
            <p className="text-sm text-[#8c959f] dark:text-gray-400 mb-8">Last Updated: January 13, 2026</p>

            <div className="prose prose-lg dark:prose-invert max-w-none text-[#5e666e] dark:text-gray-300">
              <section className="mb-8">
                <h2 className="text-xl font-bold text-[#2d353b] dark:text-white mb-4">1. Acceptance of Terms</h2>
                <p>
                  These Terms of Service are an agreement between MLVDM Green Calm Sea, Lda (hereinafter referred to as 'the Company', 'we', or 'Poseidon Diving Charters') and you, the user. By accessing poseidondivingcharters.com or booking any services, you agree to be bound by these Terms of Service. If you do not agree, you must not use our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-[#2d353b] dark:text-white mb-4">2. Definition of Service</h2>
                <p>
                  Poseidon Diving Charters offers crewed charter, meaning the Company provides the boat, the captain and crew. The Company retains operational control; however, customers must always follow the captain’s directions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-[#2d353b] dark:text-white mb-4">3. Diving Requirements & Safety</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Certification:</strong> All divers must present a valid certification card from a recognized agency (e.g., PADI, SSI, NAUI) before their diving charter trip. We apply minimum experience requirements, such as a certain certification level or a minimum number of logged dives, especially for more advanced dive sites.</li>
                  <li><strong>Health:</strong> Divers must certify that they are in good physical health and free from conditions that may make diving unsafe. We reserve the right to require a complete medical questionnaire, a waiver and a medical statement signed by a physician.</li>
                  <li><strong>Substance Use:</strong> Diving while under the influence of alcohol or drugs is strictly prohibited, and costumers may be excluded without a refund if they appear impaired.</li>
                  <li><strong>Safety Briefings:</strong> You must attend and follow all safety briefings.</li>
                  <li><strong>Authority:</strong> The Boat Captain and Dive Guide have final authority. Failure to follow instructions may result in removal from the trip without refund.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-[#2d353b] dark:text-white mb-4">4. Bookings and Payments</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Payment:</strong> Full payment is required at the time of booking to secure your spot.</li>
                  <li><strong>Cancellations by Customer:</strong> 
                    <ul className="list-circle pl-6 mt-2">
                      <li>More than 7 days' notice: Full refund.</li>
                      <li>More than 2 days' notice: 50% refund of the amount after the deposit.</li>
                      <li>Less than 2 days' notice or No-show: Full payment forfeited; no refund.</li>
                    </ul>
                  </li>
                  <li><strong>No-shows:</strong> Customer who fail to show up for a scheduled charter without prior notice will forfeit the full payment.</li>
                  <li><strong>Cancellations by Company:</strong> If we cancel due to weather, mechanical issues, or safety concerns, a full refund or rescheduling will be provided.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-[#2d353b] dark:text-white mb-4">5. Liability & Equipment</h2>
                <p>
                  Scuba diving and boat travel involve inherent risks. By booking, you voluntarily release Poseidon Diving Charters from liability for personal injury or property damage, except in cases of gross negligence. Customers are responsible for any equipment provided; damaged or lost equipment will be charged at current replacement value. We strongly advise carrying personal travel and health insurance.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-[#2d353b] dark:text-white mb-4">6. Environmental Protection</h2>
                <p>
                  We adhere to a "look, don't touch" code of conduct. Divers must respect underwater ecosystems, not touch or disturb marine life or historical artifacts, and not collect any coral or other marine animals.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-[#2d353b] dark:text-white mb-4">7. Intellectual Property</h2>
                <p>
                  All content on this website, including text, logos, and photos, is the property of Poseidon Diving Charters and may not be used without written permission.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-[#2d353b] dark:text-white mb-4">8. Governing Law</h2>
                <p>
                  These terms are governed by the laws of Portugal. Any disputes relating to these terms and services shall be resolved exclusively in the courts of <strong>Tribunal Judicial de Lagos</strong>.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-bold text-[#2d353b] dark:text-white mb-4">9. Contact Information</h2>
                <p>
                  Questions about the Terms of Service should be sent to us at <strong>info@poseidondivingcharters.com</strong>.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default TermsOfService;