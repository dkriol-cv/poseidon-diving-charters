
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, Loader2 } from 'lucide-react';
import { useBookingModal } from '@/contexts/BookingModalContext';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import { useService, useServices } from '@/hooks/useService';
import { formatPrice } from '@/lib/formatters';
import { optimizeImage, srcSet } from '@/lib/imageHelpers';

const ExclusiveCharterPage = () => {
  const { openModal } = useBookingModal();
  const { services, loading, error } = useServices(['exclusive-charter', 'sunset-charter', 'morning-charter', 'afternoon-charter', 'boat-3-4-day-charter']);
  const service = services['exclusive-charter'];

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const experienceImage = "https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Experiences%20-%20Photos/Private%20Boat%20Charter%20-%20Thumbnail%20-%20Photo.jpeg";

  const charterOptions = [
    {
      slug: 'sunset-charter',
      title: "Sunset Boat Charter",
      duration: "2.5 Hours",
      time: "18:00 - 20:30",
      description: "Witness the magical Algarve sunset from the privacy of your own boat. Romantic and unforgettable."
    },
    {
      slug: 'morning-charter',
      title: "Morning Boat Charter",
      duration: "3.5 Hours",
      time: "09:30 - 13:00",
      description: "Start your day on the water. Ideal for families who want to enjoy the calm morning sea."
    },
    {
      slug: 'afternoon-charter',
      title: "Afternoon Boat Charter",
      duration: "3.5 Hours",
      time: "13:30 - 17:00",
      description: "Enjoy the warmest part of the day. Perfect for swimming and sunbathing."
    },
    {
      slug: 'boat-3-4-day-charter',
      title: "¾ Day Boat Charter",
      duration: "5.5 Hours",
      time: "09:30 - 15:00",
      description: "Our most popular extended option. Perfect for a leisurely day at sea — Premium Meals & Refreshments included."
    }
  ];



  return (
    <>
      <Helmet>
        <title>{service?.title || 'Private Boat Charter'} - Poseidon Diving Charters</title>
        <meta
          name="description"
          content={service?.description || "Private boat charter in Lagos, Portugal. Exclusive experiences with Premium Meals & Refreshments included, flexible activities, and itineraries. The boat, crew, and adventure are entirely yours."}
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
              Pure Exclusivity
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight font-futura"
            >
              PRIVATE<br />BOAT CHARTER
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 text-left"
            >
              <AvailabilityCalendar serviceName={service?.title || 'Private Boat Charter'} experienceImage={experienceImage} />
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
              <motion.div {...fadeInUp}>
                <h2 className="text-3xl font-bold mb-6 font-futura">Discover the Water on Your Terms</h2>
                
                {loading ? (
                  <div className="flex items-center gap-2 text-[#8c959f] mb-6">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading service details...</span>
                  </div>
                ) : (
                  <>
                    <p className="text-lg text-[#8c959f] dark:text-gray-400 mb-4 leading-relaxed font-lato">
                      {service?.description || "When you charter with us the boat, the crew, and the adventure are entirely yours. The boat belongs solely to your group, creating a personal environment perfect for celebrating with friends, family reunions, or romantic escapes."}
                    </p>
                    {service?.base_price && (
                      <div className="mb-6 p-4 bg-[#03c4c9]/10 border-l-4 border-[#03c4c9] rounded-lg">
                        <p className="text-sm text-[#8c959f] dark:text-gray-400">
                          <span className="font-bold text-[#03c4c9] text-lg">Starting from {formatPrice(service?.base_price)}</span>
                          {service.duration && <span className="ml-2">• {service.duration}</span>}
                        </p>
                      </div>
                    )}
                  </>
                )}

                <div className="space-y-4">
                  {[
                    { title: "Crew at your service", desc: "Captain and expert guide services dedicated to your group" },
                    { title: "Premium Meals & Refreshments", desc: "Premium Meals & Refreshments included" },
                    { title: "Activities of your choice", desc: "Paddleboarding, swimming, sunset trip, and more" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start p-4 bg-[#f5f7f9] dark:bg-[#162026] rounded-lg">
                      <Check className="text-[#03c4c9] mr-4 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <span className="font-bold block mb-1 text-[#2d353b] dark:text-white font-futura">{item.title}</span>
                        <span className="text-[#8c959f] dark:text-gray-400 text-sm font-lato">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
                <img
                  className="w-full h-auto rounded-lg shadow-2xl"
                  alt={service?.title || "Private boat charter"}
                  src={optimizeImage(experienceImage, { width: 900, quality: 75 })}
                  srcSet={srcSet(experienceImage, [500, 800, 1200], { quality: 75 })}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  width="900"
                  height="675"
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>
            </div>

            <motion.div {...fadeInUp} className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center font-futura">Choose Your Perfect Charter</h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {charterOptions.map((option, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-[#162026] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-xl hover:border-[#03c4c9] transition-all duration-300 relative group flex flex-col h-full"
                  >
                    <Badge className="absolute top-4 right-4 bg-[#03c4c9] hover:bg-[#02aeb3] text-white border-none">
                      Max 4 Guests
                    </Badge>

                    <h3 className="text-xl font-bold mb-2 text-[#2d353b] dark:text-white font-futura mt-6">
                      {option.title}
                    </h3>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-[#03c4c9] flex items-baseline gap-2">
                          {services[option.slug]?.promo_price ? (
                            <>
                              <span>{formatPrice(services[option.slug].promo_price)}</span>
                              <span className="text-gray-400 line-through text-sm">{formatPrice(services[option.slug]?.base_price)}</span>
                            </>
                          ) : (
                            <span>{formatPrice(services[option.slug]?.base_price)}</span>
                          )}
                        </span>
                      </div>
                      <span className="text-xs text-[#8c959f] uppercase tracking-wider font-bold">Total Price</span>
                    </div>

                    <div className="space-y-3 mb-6 flex-grow">
                      <div className="flex items-center text-sm text-[#8c959f] dark:text-gray-400">
                        <Clock size={16} className="mr-2 text-[#03c4c9]" />
                        <span>{option.duration} ({option.time})</span>
                      </div>
                      <p className="text-sm text-[#8c959f] dark:text-gray-400 leading-relaxed">
                        {option.description}
                      </p>
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
                      <Button 
                        onClick={() => openModal(`${service?.title || 'Private Boat Charter'} - ${option.title}`, experienceImage)}
                        className="w-full bg-[#03c4c9] hover:bg-[#f5c842] hover:text-[#2d353b] text-white"
                      >
                        BOOK THIS OPTION
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#f5f7f9] dark:bg-[#111a1f] p-8 rounded-lg mb-12 border-l-4 border-[#f5c842]">
                <p className="text-sm text-[#8c959f] dark:text-gray-400 font-lato">
                  <span className="font-bold text-[#2d353b] dark:text-white">Payment Information:</span> Full payment is required to secure your booking.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/10 p-8 rounded-lg mb-12 border-l-4 border-[#03c4c9]">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-[#2d353b] dark:text-white uppercase text-xs tracking-widest mb-2">Meeting Point</h4>
                    <p className="text-sm text-[#8c959f] dark:text-gray-400">Marina de Lagos, Gate E - F - G - H - I</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2d353b] dark:text-white uppercase text-xs tracking-widest mb-2">Check-in</h4>
                    <p className="text-sm text-[#8c959f] dark:text-gray-400">Please arrive at least 15 minutes before departure.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button 
                  onClick={() => openModal(`${service?.title || 'Private Boat Charter'} - General Inquiry`, experienceImage)}
                  size="lg" 
                  className="w-full sm:w-auto bg-[#03c4c9] hover:bg-[#f5c842] hover:text-[#2d353b] text-white font-bold border-none"
                >
                  MAKE A GENERAL INQUIRY
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ExclusiveCharterPage;
