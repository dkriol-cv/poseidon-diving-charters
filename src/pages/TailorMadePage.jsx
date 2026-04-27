
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, MapPin, Clock, Loader2 } from 'lucide-react';
import { useBookingModal } from '@/contexts/BookingModalContext';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import { useService } from '@/hooks/useService';
import { formatPrice } from '@/lib/formatters';

const TailorMadePage = () => {
  const { openModal } = useBookingModal();
  const { service, loading, error } = useService('tailor-made');

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const experienceImage = "https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Experiences%20-%20Photos/Tailor-made%20Diving%20Charter%20-%20Thumbnail%20-%20Photo.jpeg";

  return (
    <>
      <Helmet>
        <title>{service?.title || 'Tailor-Made Diving Experience'} - Poseidon Diving Charters</title>
        <meta
          name="description"
          content={service?.description || "Create your bespoke diving experience with personalized consultation, Premium Meals & Refreshments included, and premium add-ons. High-end diving charters in Lagos, Portugal."}
        />
      </Helmet>

      <div className="pt-24 bg-white dark:bg-[#0b1216]">
        <section className="relative py-20 px-4 border-b border-gray-100 dark:border-gray-800 bg-[#f5f7f9] dark:bg-[#111a1f]">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[#03c4c9] font-bold tracking-widest uppercase text-sm mb-4 block"
            >
              Premium Service
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
            >
              TAILOR-MADE<br />DIVING EXPERIENCE
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 text-left"
            >
              <AvailabilityCalendar serviceName={service?.title || 'Tailor-Made Diving Experience'} experienceImage={experienceImage} />
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="grid md:grid-cols-2 gap-16 items-center mb-16">
              <motion.div {...fadeInUp}>
                <h2 className="text-3xl font-bold mb-6">Crafted To Your Desires</h2>
                
                {loading ? (
                  <div className="flex items-center gap-2 text-[#8c959f] mb-6">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading service details...</span>
                  </div>
                ) : (
                  <p className="text-lg text-[#8c959f] dark:text-gray-400 mb-8 leading-relaxed">
                    {service?.description || "The bespoke diving trip is a unique, high-end experience that matches your desires and skill level. Every detail is crafted to your preferences, creating an unforgettable adventure at sea."}
                  </p>
                )}

                <div className="space-y-4 mb-8">
                  {[
                    { title: "Personal consultation", desc: "Discuss your goals and preferences with us" },
                    { title: "Premium Meals & Refreshments", desc: "Premium Meals & Refreshments included" },
                    { title: "Premium add-ons", desc: "Water activities, photography services and living on board" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start p-4 bg-[#f5f7f9] dark:bg-[#162026] rounded-lg">
                      <Check className="text-[#03c4c9] mr-4 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <span className="font-bold block mb-1 text-[#2d353b] dark:text-white">{item.title}</span>
                        <span className="text-[#8c959f] dark:text-gray-400 text-sm">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#03c4c9]/10 border-l-4 border-[#03c4c9] p-6 rounded-lg mb-8">
                  <p className="text-[#8c959f] dark:text-gray-400 italic leading-relaxed">
                    This tailor-made charter is fully personalized. Premium Meals & Refreshments are included. Price and remaining inclusions are determined in consultation with our team—contact us to design your unique diving experience.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <div className="bg-[#f5f7f9] dark:bg-[#162026] p-4 rounded-lg flex items-start">
                    <MapPin className="text-[#03c4c9] mr-3 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="font-bold text-[#2d353b] dark:text-white text-sm mb-1">Meeting Point</h4>
                      <p className="text-xs text-[#8c959f] dark:text-gray-400">Marina de Lagos, Gate E - F - G - H - I</p>
                    </div>
                  </div>
                  <div className="bg-[#f5f7f9] dark:bg-[#162026] p-4 rounded-lg flex items-start">
                    <Clock className="text-[#03c4c9] mr-3 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="font-bold text-[#2d353b] dark:text-white text-sm mb-1">Check-in</h4>
                      <p className="text-xs text-[#8c959f] dark:text-gray-400">Arrive at least 15 min before departure.</p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => openModal(service?.title || 'Tailor-made diving charter', experienceImage)}
                  size="lg" 
                  className="w-full sm:w-auto bg-[#03c4c9] hover:bg-[#f5c842] hover:text-[#2d353b] text-white font-bold border-none"
                >
                  BOOK NOW
                </Button>
              </motion.div>

              <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
                <img
                  className="w-full h-auto rounded-lg shadow-2xl"
                  alt={service?.title || "Tailor-made experience detail"}
                  src={experienceImage} />
              </motion.div>
            </div>

          </div>
        </section>
      </div>
    </>
  );
};

export default TailorMadePage;
