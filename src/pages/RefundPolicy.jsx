import React from 'react';
import { Helmet } from 'react-helmet';
import Breadcrumbs from '@/components/Breadcrumbs';
import { motion } from 'framer-motion';

const RefundPolicy = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <>
      <Helmet>
        <title>Refund Policy - Poseidon Diving Charters</title>
        <meta name="description" content="Refund and Cancellation Policy for Poseidon Diving Charters. Understand our cancellation terms, refund eligibility, and weather-related policies." />
      </Helmet>
      <Breadcrumbs items={[{ name: 'Home', url: '/' }, { name: 'Refund Policy', url: '/refund-policy' }]} />
      
      <div className="pt-24 min-h-screen bg-[#f5f7f9] dark:bg-[#0b1216]">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <motion.div 
            {...fadeInUp}
            className="bg-white dark:bg-[#162026] p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-[#2d353b] dark:text-white">Refund & Cancellation Policy</h1>
            <p className="text-sm text-[#8c959f] dark:text-gray-400 mb-8">Last Updated: January 13, 2026</p>

            <div className="prose prose-lg dark:prose-invert max-w-none text-[#5e666e] dark:text-gray-300">
              <section className="mb-8">
                <h2 className="text-xl font-bold text-[#2d353b] dark:text-white mb-4">1. Cancellation by the Customer</h2>
                <p>
                  All cancellations must be provided in writing via email to <strong>info@poseidondivingcharters.com</strong>. Our refund eligibility is based on the notice period provided:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-4">
                  <li><strong>More than seven days’ notice:</strong> A full refund (100%) of the total amount paid will be issued.</li>
                  <li><strong>More than two days’ notice:</strong> A refund of 50% of the total amount paid may be issued.</li>
                  <li><strong>Less than two days’ notice:</strong> The full payment will be forfeited, and no refund will be issued.</li>
                  <li><strong>No-shows:</strong> Customers who fail to show up for a scheduled charter without prior notice will forfeit the full payment.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-[#2d353b] dark:text-white mb-4">2. Cancellation by Poseidon Diving Charters</h2>
                <p>
                  We reserve the right to cancel trips due to unforeseen circumstances, such as:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Adverse weather or unsafe sea conditions.</li>
                  <li>Mechanical issues with the vessel.</li>
                  <li>Safety concerns or crew illness.</li>
                </ul>
                <p className="mt-4">
                  In any of these cases, you will be offered the option to <strong>reschedule</strong> for an alternative date or receive a <strong>full refund</strong> of any amount paid.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-[#2d353b] dark:text-white mb-4">3. Weather Policy</h2>
                <p>
                  Safety is our primary concern. Decisions regarding weather and sea conditions are at the sole discretion of the Boat Captain.
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>If the Captain deems conditions unsafe, a full refund or rescheduling is guaranteed.</li>
                  <li>Cloudy weather, light rain, or air temperature are not grounds for cancellation if sea conditions are safe for navigation and diving.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-[#2d353b] dark:text-white mb-4">4. Refund Process</h2>
                <p>
                  Approved refunds will be processed via our payment provider (Stripe). Please note:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Refunds are issued to the original payment method used for the booking.</li>
                  <li>The processing time usually takes between <strong>5 to 10 business days</strong> to appear in your account, depending on your financial institution.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#2d353b] dark:text-white mb-4">5. Contact Information</h2>
                <p>
                  To request a cancellation or inquire about a refund, please contact us at:
                  <br />
                  <strong>Email:</strong> info@poseidondivingcharters.com
                  <br />
                  <strong>Phone/WhatsApp:</strong> +351 924 955 333
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default RefundPolicy;