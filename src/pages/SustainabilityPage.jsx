import React from 'react';
import { Helmet } from 'react-helmet';
import Breadcrumbs from '@/components/Breadcrumbs';
import { motion } from 'framer-motion';
const SustainabilityPage = () => {
  const fadeInUp = {
    initial: {
      opacity: 0,
      y: 30
    },
    whileInView: {
      opacity: 1,
      y: 0
    },
    viewport: {
      once: true
    },
    transition: {
      duration: 0.6
    }
  };
  return <>
      <Helmet>
        <title>Sustainability | Poseidon Diving Charters</title>
        <meta name="description" content="At Poseidon Diving Charters, our mission goes beyond providing dive experiences; it's about preserving the delicate marine ecosystems of the Algarve." />
      </Helmet>
      <Breadcrumbs items={[{ name: 'Home', url: '/' }, { name: 'Sustainability', url: '/sustainability' }]} />

      <div className="pt-24 bg-white dark:bg-[#0b1216] min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 px-4 border-b border-gray-100 dark:border-gray-800 bg-[#f5f7f9] dark:bg-[#111a1f]">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.span initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} className="text-[#03c4c9] font-bold tracking-widest uppercase text-sm mb-4 block">
              Our Responsibility
            </motion.span>
            <motion.h1 initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-[#2d353b] dark:text-white">
              Sustainability – diving with a purpose
            </motion.h1>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-3xl">
            <motion.div {...fadeInUp} className="space-y-8 text-lg leading-relaxed text-[#8c959f] dark:text-gray-300">
              
              <div className="mb-12 rounded-xl overflow-hidden shadow-xl">
              <img alt="Diver cleaning ocean floor" className="w-full h-auto object-cover max-h-[400px]" src="https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=2048&auto=format&fit=crop" />
              </div>

              <p>At Poseidon Diving Charters we are promoting responsible tourism. Our sustainability efforts are focused on practical action, education, and collaboration. When you choose to dive with us, you are actively contributing to the health and conservation of our oceans.</p>

              <p>We regularly organize and participate in underwater and beach cleanups to remove harmful plastics and discarded fishing gear from the marine environment. Divers are encouraged to join these efforts and collect any litter they find during their dives. Since we have implemented a firm no single-use plastic policy fresh water is provided in reusable bottles on all our charter trips.</p>

              <p>
                The "look, don't touch" code of conduct is adhered. We ensure all divers follow responsible diving practices, such as not touching or disturbing marine life, coral, or historical artifacts, and respecting underwater ecosystems. Our dive guides emphasize excellent buoyancy control to prevent accidental damage to sensitive marine life and habitats.
              </p>

              <p className="border-l-4 border-[#03c4c9] pl-6 py-2 italic text-[#2d353b] dark:text-gray-200 bg-gray-50 dark:bg-gray-900/50 rounded-r-lg">
                A core part of our work involves raising environmental awareness among our guests and the local community. Our guest briefings include information on local marine life, sensitive ecosystems, and best practices for low-impact diving. We use our platform to educate divers about global marine conservation issues, encouraging them to be advocates for the ocean long after their trip ends.
              </p>

            </motion.div>
          </div>
        </section>
      </div>
    </>;
};
export default SustainabilityPage;