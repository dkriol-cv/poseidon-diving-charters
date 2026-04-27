
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, Loader2 } from 'lucide-react';
import { useBookingModal } from '@/contexts/BookingModalContext';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import { useService } from '@/hooks/useService';

const PreDesignedPage = () => {
  const { openModal } = useBookingModal();
  const { service, loading, error } = useService('pre-designed');

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const experienceImage = "https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Experiences%20-%20Photos/Pre-design%20diving%20charter-thumbnail%20photo.jpeg";

  const pricingOptions = [
    {
      slug: 'diving-3-4-day',
      title: "¾ Day Diving Charter",
      duration: "5.5 Hours",
      time: "09:00 – 14:30",
      defaultPrice: "1,250",
      sortPrice: 1250,
      description: "A complete diving experience with Premium Meals & Refreshments included, sunbathing and other activities packed into a convenient 3/4-day."
    },
    {
      slug: 'diving-full-day',
      title: "Full Day Diving Charter",
      duration: "7.5 Hours",
      time: "09:00 – 16:30",
      defaultPrice: "1,500",
      sortPrice: 1500,
      description: "Enjoy a full day diving charter for extra leisure time on the sunbeds. With this option, it's possible to go long-distance diving."
    }
  ];

  const loading = mainLoading || optionsLoading;
  const sortedPricingOptions = [...pricingOptions].sort((a, b) => a.sortPrice - b.sortPrice);

  return (
    <>
      <Helmet>
        <title>{service?.title || 'Pre-Designed Diving Charter'} - Poseidon Diving Charters</title>
        <meta
          name="description"
          content={service?.description || "All-inclusive diving charter packages in Lagos, Portugal. Easy to book with maximum adventure and minimum fuss. Two dives, expert guides, Premium Meals & Refreshments included."}
        />
      </Helmet>

      <div className="pt-24 bg-white dark:bg-[#0b1216]">
        {/* Hero */}
        <section className="relative py-20 px-4 border-b border-gray-100 dark:border-gray-800 bg-[#f5f7f9] dark:bg-[#111a1f]">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[#03c4c9] font-bold tracking-widest uppercase text-sm mb-4 block"
            >
              Hassle-Free Adventure
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
            >
              PRE-DESIGNED<br />DIVING CHARTER
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 text-left"
            >
              <AvailabilityCalendar serviceName={service?.title || 'Pre-Designed Diving Charter'} experienceImage={experienceImage} />
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container mx-auto max-w-7xl">
            {/* Layout: Text Left, Image Right */}
            <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
              <motion.div {...fadeInUp}>
                <h2 className="text-3xl font-bold mb-6">Adventure Made Simple</h2>
                
                {loading ? (
                  <div className="flex items-center gap-2 text-[#8c959f] mb-6">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading service details...</span>
                  </div>
                ) : (
                  <>
                    <p className="text-lg text-[#8c959f] dark:text-gray-400 mb-4 leading-relaxed">
                      {service?.description || "Let us plan your diving charter for the day. This diving trip is easy to book, all-inclusive and clear in its offering. We give you the maximum adventure with minimum fuss."}
                    </p>
                    {service?.base_price && (
                      <div className="mb-6 p-4 bg-[#03c4c9]/10 border-l-4 border-[#03c4c9] rounded-lg">
                        <p className="text-sm text-[#8c959f] dark:text-gray-400">
                          <span className="font-bold text-[#03c4c9] text-lg">Starting from €{service.base_price}</span>
                          {service.duration && <span className="ml-2">• {service.duration}</span>}
                        </p>
                      </div>
                    )}
                  </>
                )}

                <div className="space-y-4">
                  {[
                    { title: "Two dives", desc: "Carefully selected dive sites for your skill level" },
                    { title: "Expert Guidance", desc: "Captain and expert dive guide services included" },
                    { title: "All-Inclusive", desc: "Premium Meals & Refreshments included" }
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
              </motion.div>

              <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
                <img
                  className="w-full h-auto rounded-lg shadow-2xl"
                  alt={service?.title || "Pre-designed diving experience"}
                  src={experienceImage}
                />
              </motion.div>
            </div>

            {/* Pricing Section */}
            <motion.div {...fadeInUp} className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center">Pricing Options</h2>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {sortedPricingOptions.map((option, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-[#162026] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-xl hover:border-[#03c4c9] transition-all duration-300 relative group flex flex-col h-full"
                  >
                    <Badge className="absolute top-4 right-4 bg-[#03c4c9] hover:bg-[#02aeb3] text-white border-none">
                      Max 4 Guests
                    </Badge>

                    <h3 className="text-xl font-bold mb-2 text-[#2d353b] dark:text-white mt-6">
                      {option.title}
                    </h3>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-[#03c4c9]">
                          {services[option.slug]?.base_price ? `€${services[option.slug].base_price}` : 'Price on request'}
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
                        onClick={() => openModal(`${service?.title || 'Pre-designed Diving Charter'} - ${option.title}`, experienceImage)}
                        className="w-full bg-[#03c4c9] hover:bg-[#f5c842] hover:text-[#2d353b] text-white"
                      >
                        BOOK THIS OPTION
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAYMENT INFORMATION */}
              <div className="bg-[#f5f7f9] dark:bg-[#111a1f] p-8 rounded-lg mb-12 border-l-4 border-[#f5c842]">
                <p className="text-sm text-[#8c959f] dark:text-gray-400">
                  <span className="font-bold text-[#2d353b] dark:text-white">Payment Information:</span> Full payment is required to secure your booking.
                </p>
              </div>

              {/* MEETING POINT & CHECK-IN */}
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
                  onClick={() => openModal(`${service?.title || 'Pre-designed Diving Charter'} - General Inquiry`, experienceImage)}
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

export default PreDesignedPage;
