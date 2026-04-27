
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Euro, ChevronRight } from 'lucide-react';
import { useBookingModal } from '@/contexts/BookingModalContext';
import { useServices } from '@/hooks/useService';
import { formatPrice } from '@/lib/formatters';

const ExperiencesPage = () => {
  const { openModal } = useBookingModal();
  const { services: servicesData, loading } = useServices([
    'tailor-made', 'pre-designed', 'exclusive-charter', 'beach-charter',
    'sunset-charter', 'morning-charter', 
    'afternoon-charter', 'boat-3-4-day-charter', 'diving-3-4-day', 'diving-full-day'
  ]);

  const services = Object.values(servicesData);

  const getPrice = (slug) => {
    const s = services.find(srv => srv.slug === slug);
    if (!s) return "Price on request";
    
    return (
      <span className="flex flex-col sm:flex-row sm:items-baseline gap-2">
        {s.promo_price ? (
          <>
            <span className="text-[#03c4c9] font-bold">{formatPrice(s.promo_price)}</span>
            <span className="text-gray-400 line-through text-[10px]">{formatPrice(s.base_price)}</span>
          </>
        ) : (
          <span>From {formatPrice(s.base_price)}</span>
        )}
      </span>
    );
  };

  const getRawPrice = (slug) => {
    const s = services.find(srv => srv.slug === slug);
    if (!s) return "Price on request";
    
    const finalPrice = s.promo_price || s.base_price;
    if (!finalPrice) return "Price on request";

    return (
      <span className="flex items-baseline gap-2">
        {s.promo_price ? (
          <span className="text-gray-400 line-through text-sm mr-1">{formatPrice(s.base_price)}</span>
        ) : null}
        <span>{formatPrice(finalPrice)}</span>
      </span>
    );
  };

  const getName = (slug, defaultName) => {
    const s = services.find(srv => srv.slug === slug);
    return s?.name || defaultName;
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const primaryBtn = "w-full bg-[#03c4c9] hover:bg-[#f5c842] hover:text-[#2d353b] text-white";

  const tailorMadeImage = "https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Experiences%20-%20Photos/Tailor-made%20Diving%20Charter%20-%20Thumbnail%20-%20Photo.jpeg";
  const preDesignedImage = "https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Experiences%20-%20Photos/Pre-design%20diving%20charter-thumbnail%20photo.jpeg";
  const privateBoatImage = "https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Experiences%20-%20Photos/Private%20Boat%20Charter%20-%20Thumbnail%20-%20Photo.jpeg";

  return (
    <>
      <Helmet>
        <title>Experiences - Poseidon Diving Charters</title>
        <meta name="description" content="Explore all Poseidon experiences in one place." />
      </Helmet>

      <section className="relative h-[60vh] min-h-[420px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img className="w-full h-full object-cover" alt="Poseidon experiences" src="https://images.unsplash.com/photo-1544551763-46a013bb70d5" />
        </div>
        <div className="relative z-20 container mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-display-page text-white font-bold text-4xl sm:text-5xl md:text-6xl mb-4">
            EXPERIENCES
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35, duration: 0.8 }} className="flex items-center justify-center text-gray-300 text-sm uppercase tracking-widest">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-[#03c4c9]">Experiences</span>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.8 }} className="mt-6 max-w-3xl mx-auto text-white/90 text-lg">
            Contact us directly via WhatsApp, phone, or email to book your experience. If you have questions or special requests, we're here to help.
          </motion.p>
        </div>
      </section>

      <section className="py-20 px-4 bg-[#f5f7f9] dark:bg-[#111a1f] -mt-10 relative z-30 rounded-t-3xl">
        <div className="container mx-auto max-w-7xl">
          <motion.div {...fadeInUp} className="grid lg:grid-cols-3 gap-8">

            <div className="bg-white dark:bg-[#162026] rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 flex flex-col">
              <div className="relative h-60 overflow-hidden">
                <img src={tailorMadeImage} alt="Tailor-made diving charter" className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#03c4c9]">BESPOKE</div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-3 text-[#2d353b] dark:text-white">{getName('tailor-made', 'Tailor-made diving charter')}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm flex-grow">
                  The bespoke diving trip is a unique, high-end experience that matches your desires and skill level. Consultation and planning is part of the premium service.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400"><Clock size={16} className="mr-2 text-[#03c4c9]" />7.5 Hours</div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400"><Users size={16} className="mr-2 text-[#03c4c9]" />Max 4 guests</div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 col-span-2"><Euro size={16} className="mr-2 text-[#03c4c9]" />{getPrice('tailor-made')}</div>
                </div>
                <div className="mt-auto space-y-3">
                  <Button onClick={() => openModal('Tailor-made diving charter', tailorMadeImage)} className={primaryBtn}>BOOK NOW</Button>
                  <Button asChild variant="outline" className="w-full"><Link to="/tailor-made">LEARN MORE</Link></Button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#162026] rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 flex flex-col">
              <div className="relative h-60 overflow-hidden">
                <img src={preDesignedImage} alt="Pre-designed diving charter" className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#03c4c9]">ALL-INCLUSIVE</div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-3 text-[#2d353b] dark:text-white">{getName('pre-designed', 'Pre-designed diving charter')}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm flex-grow">Let us plan your charter for the day. This diving trip is easy to book, all-inclusive and clear in its offering. Maximum adventure with minimum fuss.</p>
                <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400"><Clock size={16} className="mr-2 text-[#03c4c9]" />5.5 or 7.5 Hours</div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400"><Users size={16} className="mr-2 text-[#03c4c9]" />Max 4 guests</div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 col-span-2"><Euro size={16} className="mr-2 text-[#03c4c9]" />{getPrice('pre-designed')}</div>
                </div>
                <div className="mt-auto space-y-3">
                  <Button onClick={() => openModal('Pre-designed diving charter', preDesignedImage)} className={primaryBtn}>BOOK NOW</Button>
                  <Button asChild variant="outline" className="w-full"><Link to="/pre-designed">LEARN MORE</Link></Button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#162026] rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 flex flex-col">
              <div className="relative h-60 overflow-hidden">
                <img src={privateBoatImage} alt="Private Boat Charter" className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#03c4c9]">EXCLUSIVITY</div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-3 text-[#2d353b] dark:text-white">{getName('exclusive-charter', 'Private Boat Charter')}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm flex-grow">Our boat charter offers private exclusivity. Discover the water on your terms. When you charter with us the boat, the crew, and the adventure are entirely yours.</p>
                <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400"><Clock size={16} className="mr-2 text-[#03c4c9]" />2.5 to 5.5 Hours</div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400"><Users size={16} className="mr-2 text-[#03c4c9]" />Max 4 guests</div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 col-span-2"><Euro size={16} className="mr-2 text-[#03c4c9]" />{getPrice('exclusive-charter')}</div>
                </div>
                <div className="mt-auto space-y-3">
                  <Button onClick={() => openModal('Private Boat Charter', privateBoatImage)} className={primaryBtn}>BOOK NOW</Button>
                  <Button asChild variant="outline" className="w-full"><Link to="/exclusive-charter">LEARN MORE</Link></Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white dark:bg-[#0b1216]">
        <div className="container mx-auto max-w-7xl">
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto text-center mb-14">
            <h2 className="text-3xl font-bold mb-4">Pre-Designed Diving Charter Pricing</h2>
            <p className="text-lg text-[#8c959f] dark:text-gray-400 leading-relaxed">Choose the option that fits your day.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="bg-white dark:bg-[#162026] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-xl hover:border-[#03c4c9] transition-all duration-300 flex flex-col relative h-full">
              <Badge className="absolute top-4 right-4 bg-[#03c4c9] hover:bg-[#02aeb3] text-white border-none">Max 4 Guests</Badge>
              <div className="mt-8 mb-2"><h3 className="text-xl font-bold text-[#2d353b] dark:text-white">{getName('pre-designed', '¾ Day Diving Charter')}</h3></div>
              <div className="mb-6">
                <div className="flex items-baseline gap-1"><span className="text-3xl font-bold text-[#03c4c9]">{getRawPrice('pre-designed')}</span></div>
                <span className="text-xs text-[#8c959f] uppercase tracking-wider font-bold">Total Price</span>
              </div>
              <div className="space-y-3 mb-6 flex-grow">
                <div className="flex items-center text-sm text-[#8c959f] dark:text-gray-400"><Clock size={16} className="mr-2 text-[#03c4c9]" /><span>5.5 Hours (09:00 – 14:30)</span></div>
                <p className="text-sm text-[#8c959f] dark:text-gray-400 leading-relaxed">A complete diving experience with Premium Meals & Refreshments included, sunbathing and other activities packed into a convenient 3/4-day.</p>
              </div>
              <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
                <Button onClick={() => openModal('Pre-designed diving charter - ¾ Day', preDesignedImage)} className="w-full bg-[#03c4c9] hover:bg-[#f5c842] hover:text-[#2d353b] text-white">BOOK THIS OPTION</Button>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="bg-white dark:bg-[#162026] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-xl hover:border-[#03c4c9] transition-all duration-300 flex flex-col relative h-full">
              <Badge className="absolute top-4 right-4 bg-[#03c4c9] hover:bg-[#02aeb3] text-white border-none">Max 4 Guests</Badge>
              <div className="mt-8 mb-2"><h3 className="text-xl font-bold text-[#2d353b] dark:text-white">{getName('diving-full-day', 'Full Day Diving Charter')}</h3></div>
              <div className="mb-6">
                <div className="flex items-baseline gap-1"><span className="text-3xl font-bold text-[#03c4c9]">{getRawPrice('diving-full-day')}</span></div>
                <span className="text-xs text-[#8c959f] uppercase tracking-wider font-bold">Total Price</span>
              </div>
              <div className="space-y-3 mb-6 flex-grow">
                <div className="flex items-center text-sm text-[#8c959f] dark:text-gray-400"><Clock size={16} className="mr-2 text-[#03c4c9]" /><span>7.5 Hours (09:00 – 16:30)</span></div>
                <p className="text-sm text-[#8c959f] dark:text-gray-400 leading-relaxed">Enjoy a full day diving charter for extra leisure time on the sunbeds. With this option, it's possible to go long-distance diving.</p>
              </div>
              <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
                <Button onClick={() => openModal('Pre-designed diving charter - Full Day', preDesignedImage)} className="w-full bg-[#03c4c9] hover:bg-[#f5c842] hover:text-[#2d353b] text-white">BOOK THIS OPTION</Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[#f5f7f9] dark:bg-[#111a1f]">
        <div className="container mx-auto max-w-7xl">
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto text-center mb-14">
            <h2 className="text-3xl font-bold mb-4">Private Boat Charter Options</h2>
            <p className="text-lg text-[#8c959f] dark:text-gray-400 leading-relaxed">Pick the timing that suits your group.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              { slug: 'sunset-charter', title: 'Sunset Boat Charter', time: '2.5 Hours (18:00 - 20:30)', price: getRawPrice('sunset-charter'), desc: 'Witness the magical Algarve sunset from the privacy of your own boat.' },
              { slug: 'morning-charter', title: 'Morning Boat Charter', time: '3.5 Hours (09:30 - 13:00)', price: getRawPrice('morning-charter'), desc: 'Start your day on the water. Ideal for families who want to enjoy the calm morning sea.' },
              { slug: 'afternoon-charter', title: 'Afternoon Boat Charter', time: '3.5 Hours (13:30 - 17:00)', price: getRawPrice('afternoon-charter'), desc: 'Enjoy the warmest part of the day. Perfect for swimming and sunbathing.' },
              { slug: 'boat-3-4-day-charter', title: '¾ Day Boat Charter', time: '5.5 Hours (09:30 - 15:00)', price: getRawPrice('boat-3-4-day-charter'), desc: 'Our most popular extended option. Perfect for a leisurely day at sea.' }
            ].map((option, idx) => (
              <motion.div key={idx} {...fadeInUp} transition={{ delay: idx * 0.05 }} className="bg-white dark:bg-[#162026] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-xl hover:border-[#03c4c9] transition-all duration-300 flex flex-col relative h-full">
                <Badge className="absolute top-4 right-4 bg-[#03c4c9] hover:bg-[#02aeb3] text-white border-none">Max 4 Guests</Badge>
                <div className="mt-8 mb-2"><h3 className="text-xl font-bold text-[#2d353b] dark:text-white">{getName(option.slug, option.title)}</h3></div>
                <div className="mb-6">
                  <div className="flex items-baseline gap-1"><span className="text-3xl font-bold text-[#03c4c9]">{option.price}</span></div>
                  <span className="text-xs text-[#8c959f] uppercase tracking-wider font-bold">Total Price</span>
                </div>
                <div className="space-y-3 mb-6 flex-grow">
                  <div className="flex items-center text-sm text-[#8c959f] dark:text-gray-400"><Clock size={16} className="mr-2 text-[#03c4c9]" /><span>{option.time}</span></div>
                  <p className="text-sm text-[#8c959f] dark:text-gray-400 leading-relaxed">{option.desc}</p>
                </div>
                <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
                  <Button onClick={() => openModal(`Private Boat Charter - ${option.title}`, privateBoatImage)} className="w-full bg-[#03c4c9] hover:bg-[#f5c842] hover:text-[#2d353b] text-white">BOOK THIS OPTION</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ExperiencesPage;
