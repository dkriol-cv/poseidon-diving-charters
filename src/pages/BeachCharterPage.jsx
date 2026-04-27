
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Waves, Music, Utensils, Users, Loader2 } from 'lucide-react';
import { useBookingModal } from '@/contexts/BookingModalContext';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import { useService } from '@/hooks/useService';

const BeachCharterPage = () => {
  const { openModal } = useBookingModal();
  const { service, loading, error } = useService('beach-charter');

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const experienceImage = "https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Experiences%20-%20Photos/Private%20Boat%20Charter%20-%20Thumbnail%20-%20Photo.jpeg";

  return (
    <>
      <Helmet>
        <title>{service?.title || 'Beach Charter'} - Poseidon Diving Charters × Pirata Bar</title>
        <meta
          name="description"
          content={service?.description || "Experience the ultimate Meia Praia escape with our exclusive Beach Charter. A unique collaboration between Poseidon Diving Charters and Pirata Beach Bar in Lagos, Portugal."}
        />
      </Helmet>

      <div className="pt-24 bg-white dark:bg-[#0b1216]">
        {/* Hero Section */}
        <section className="relative py-20 px-4 border-b border-gray-100 dark:border-gray-800 bg-[#f5f7f9] dark:bg-[#111a1f]">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[#03c4c9] font-bold tracking-widest uppercase text-sm mb-4 block"
            >
              Lagos' Most Exclusive Beach Collaboration
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight font-futura"
            >
              BEACH CHARTER<br />
              <span className="text-3xl sm:text-4xl md:text-5xl">The Ultimate Meia Praia Escape</span>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-4 text-[#2d353b] dark:text-gray-300 text-lg font-medium"
            >
              <span>Poseidon Diving Charters</span>
              <span className="text-[#03c4c9] font-bold">×</span>
              <span>Pirata Bar</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-10 text-left"
            >
              <AvailabilityCalendar serviceName={service?.title || 'Beach Charter'} experienceImage={experienceImage} />
            </motion.div>
          </div>
        </section>

        {/* Intro Section */}
        <section className="py-20 px-4 bg-white dark:bg-[#0b1216]">
          <div className="container mx-auto max-w-4xl">
            {loading ? (
              <div className="flex items-center justify-center gap-2 text-[#8c959f]">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading experience details...</span>
              </div>
            ) : (
              <motion.p {...fadeInUp} className="text-lg text-[#8c959f] dark:text-gray-400 leading-relaxed text-center">
                {service?.description || "Experience a hidden gem of the Algarve coast with our new private charter, a unique collaboration between Poseidon Diving Charters and the legendary Pirata Beach Bar. Departing directly from the sands of Meia Praia, this experience is designed for groups of up to four looking for a relaxed, private getaway on the water."}
              </motion.p>
            )}
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4 bg-white dark:bg-[#0b1216]">
          <div className="container mx-auto max-w-7xl">
            <motion.h2 {...fadeInUp} className="text-3xl font-bold mb-12 text-center font-futura">
              What's Included
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
                <Card className="h-full border-gray-200 dark:border-gray-800 hover:border-[#03c4c9] transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-[#03c4c9]/10 p-3 rounded-full">
                        <Waves className="text-[#03c4c9]" size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-[#2d353b] dark:text-white">Boat Amenities</h3>
                    </div>
                    <p className="text-[#8c959f] dark:text-gray-400 leading-relaxed">
                      Sunbeds, sound system, swimming ladder, hot water shower, cabin with sofa area and private toilet
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
                <Card className="h-full border-gray-200 dark:border-gray-800 hover:border-[#03c4c9] transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-[#03c4c9]/10 p-3 rounded-full">
                        <Music className="text-[#03c4c9]" size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-[#2d353b] dark:text-white">Active Fun</h3>
                    </div>
                    <p className="text-[#8c959f] dark:text-gray-400 leading-relaxed">
                      Paddle boards, kayaks, flamingo floatie, snorkel or scuba diving
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
                <Card className="h-full border-gray-200 dark:border-gray-800 hover:border-[#03c4c9] transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-[#03c4c9]/10 p-3 rounded-full">
                        <Utensils className="text-[#03c4c9]" size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-[#2d353b] dark:text-white">Buffet & Drinks</h3>
                    </div>
                    <p className="text-[#8c959f] dark:text-gray-400 leading-relaxed">
                      Cold cuts, cheese and fruit buffet plus drinks included. Oyster and seafood platter on request
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
                <Card className="h-full border-gray-200 dark:border-gray-800 hover:border-[#03c4c9] transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-[#03c4c9]/10 p-3 rounded-full">
                        <Users className="text-[#03c4c9]" size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-[#2d353b] dark:text-white">Exclusive & Private</h3>
                    </div>
                    <p className="text-[#8c959f] dark:text-gray-400 leading-relaxed">
                      Entirely private charter for groups up to 4 guests
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 px-4 bg-[#f5f7f9] dark:bg-[#111a1f]">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div {...fadeInUp} className="bg-white dark:bg-[#162026] p-12 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg">
              <h2 className="text-3xl font-bold mb-4 font-futura text-[#2d353b] dark:text-white">Pricing</h2>
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[#03c4c9]" />
                  <span className="text-lg text-[#8c959f]">Loading pricing...</span>
                </div>
              ) : (
                <>
                  <div className="text-5xl font-bold text-[#03c4c9] mb-2 flex items-baseline gap-3">
                    {service?.promo_price ? (
                      <>
                        <span>€{service.promo_price}</span>
                        <span className="text-gray-400 line-through text-xl">€{service.base_price}</span>
                      </>
                    ) : (
                      <span>{service?.base_price ? `€${service.base_price}` : 'Price on request'}</span>
                    )}
                  </div>
                  <p className="text-[#8c959f] dark:text-gray-400 text-lg">
                    {service?.duration ? `${service.duration} for groups up to four people` : 'per hour for groups up to four people'}
                  </p>
                </>
              )}
            </motion.div>
          </div>
        </section>

        {/* WhatsApp Button Section */}
        <section className="py-20 px-4 bg-white dark:bg-[#0b1216]">
          <div className="container mx-auto max-w-2xl text-center">
            <motion.div {...fadeInUp}>
              <h2 className="text-3xl font-bold mb-6 font-futura">Book Your Beach Charter</h2>
              <p className="text-lg text-[#8c959f] dark:text-gray-400 mb-8 leading-relaxed">
                Contact us directly via WhatsApp to check availability and make your reservation.
              </p>
              <Button
                onClick={() => openModal(service?.title || 'Beach Charter', experienceImage)}
                size="lg"
                className="w-full sm:w-auto bg-[#03c4c9] hover:bg-[#f5c842] hover:text-[#2d353b] text-white font-bold border-none"
              >
                BOOK NOW
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Departure Info Section */}
        <section className="py-20 px-4 bg-[#f5f7f9] dark:bg-[#111a1f]">
          <div className="container mx-auto max-w-4xl">
            <motion.div {...fadeInUp} className="bg-blue-50 dark:bg-blue-900/10 p-8 rounded-lg border-l-4 border-[#03c4c9]">
              <div className="flex items-start gap-4">
                <MapPin className="text-[#03c4c9] mt-1 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-[#2d353b] dark:text-white uppercase text-xs tracking-widest mb-2">
                    Departure Point
                  </h4>
                  <p className="text-[#8c959f] dark:text-gray-400">
                    Pirata Beach Bar, Meia Praia beach, Lagos
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BeachCharterPage;
