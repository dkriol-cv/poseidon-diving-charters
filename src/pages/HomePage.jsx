
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Users, Anchor, MapPin, CheckCircle2, MessageCircle, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { useBookingModal } from '@/contexts/BookingModalContext';
import BlogPreview from '@/components/blog/BlogPreview';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const HomePage = () => {
  const { openModal } = useBookingModal();
  const [showCalendar, setShowCalendar] = React.useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const heroImage = "https://images.unsplash.com/photo-1593351415075-3bac9f45c877?q=80&w=1171&auto=format&fit=crop";

  const primaryBtn = "bg-[#03c4c9] hover:bg-[#f5c842] hover:text-[#2d353b] text-white border-none rounded-xl h-14 font-bold transition-all duration-300";
  const outlineBtn = "border-2 border-[#03c4c9] text-[#03c4c9] bg-white hover:bg-gray-100 hover:text-[#02a8ad] rounded-xl h-14 font-bold transition-all duration-300";

  const renderServiceCard = (type) => {
    const defaults = {
      'tailor-made': {
        title: "Tailor-made diving charter",
        desc: "A bespoke diving experience designed to match your specific desires and skill level. Our premium service includes dedicated consultation.",
        img: "https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Experiences%20-%20Photos/Tailor-made%20Diving%20Charter%20-%20Thumbnail%20-%20Photo.jpeg",
        badge: "BESPOKE",
        btnText: "Design my charter",
        link: "/tailor-made"
      },
      'pre-designed': {
        title: "Pre-designed diving charter",
        desc: "Carefully curated itineraries that combine the best local dive sites with effortless booking. All-inclusive and ready for adventure.",
        img: "https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Experiences%20-%20Photos/Pre-design%20diving%20charter-thumbnail%20photo.jpeg",
        badge: "ALL-INCLUSIVE",
        btnText: "Find my trip",
        link: "/pre-designed"
      },
      'private-boat': {
        title: "Private Boat Charter",
        desc: "Absolute exclusivity on the water. Discover Lagos on your own terms with a dedicated boat and crew focused on your group.",
        img: "https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Experiences%20-%20Photos/Private%20Boat%20Charter%20-%20Thumbnail%20-%20Photo.jpeg",
        badge: "EXCLUSIVITY",
        btnText: "To my charter",
        link: "/exclusive-charter"
      }
    };

    const config = defaults[type];

    return (
      <motion.div {...fadeInUp} className="group relative h-[480px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2">
        <div className="absolute inset-0 z-0">
          <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={config.img} alt={config.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent"></div>
        </div>

        <div className="relative z-10 h-full p-8 flex flex-col justify-end">
          <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[10px] font-bold text-white tracking-widest uppercase">
            {config.badge}
          </div>

          <h3 className="text-2xl font-bold text-white mb-3 leading-tight tracking-tight">{config.title}</h3>
          <p className="text-white/90 text-sm mb-6 line-clamp-3 font-light leading-relaxed">
            {config.desc}
          </p>

          <Button asChild className={primaryBtn}>
            <Link to={config.link}>{config.btnText}</Link>
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Poseidon Diving Charters — Premium Private Diving & Boat Experiences</title>
        <meta name="description" content="Exclusive private diving and boat charters in Lagos, Algarve." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <img className="w-full h-full object-cover opacity-80" src={heroImage} alt="Ocean Background" loading="eager" />
        </div>

        <div className="relative z-20 container mx-auto px-4 lg:px-12 pt-20">
          <div className="max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tighter"
            >
              POSEIDON<br />
              DIVING CHARTERS
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-white/80 font-light mb-10 max-w-2xl leading-relaxed"
            >
              Lagos' premier private diving concierge — where absolute exclusivity meets personalized service.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-6 mb-12"
            >
              <div className="flex items-center gap-2 text-white/70 text-sm uppercase tracking-widest font-medium">
                <Users className="w-4 h-4 text-[#03c4c9]" /> Max 4 Guests
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm uppercase tracking-widest font-medium">
                <Anchor className="w-4 h-4 text-[#03c4c9]" /> Private Vessel
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm uppercase tracking-widest font-medium">
                <MapPin className="w-4 h-4 text-[#03c4c9]" /> Marina de Lagos
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-5"
            >
              <Button
                onClick={() => openModal('General Experience Inquiry', heroImage)}
                size="lg"
                className={primaryBtn + " px-12 shadow-lg shadow-[#03c4c9]/20"}
              >
                BOOK NOW
              </Button>

              <Button
                asChild
                size="lg"
                className={outlineBtn + " px-12"}
              >
                <Link to="/tailor-made">Tailor-Made Diving</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Floating Action Button - Fixed Mobile/Desktop */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-6 right-6 z-50 sm:bottom-10 sm:right-10"
      >
        <Button
          onClick={() => setShowCalendar(true)}
          className="rounded-full w-14 h-14 sm:w-auto sm:h-14 sm:px-6 shadow-2xl bg-[#03c4c9] hover:bg-[#f5c842] hover:text-[#2d353b] text-white border-none flex items-center justify-center gap-2 group transition-all duration-300"
        >
          <CalendarIcon className="w-6 h-6 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:block font-bold">CHECK DATES</span>
        </Button>
      </motion.div>

      {/* Experiences Cards Section */}
      <section id="experiences" className="pt-0 pb-28 px-4 bg-[#0b1216]">
        {/* Availability Bar - Integrated into dark section to avoid white gaps */}
        <div className="container mx-auto max-w-5xl relative z-40 -translate-y-1/2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-[#162026] rounded-2xl shadow-2xl p-6 md:p-2 border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center gap-4"
          >
            <div className="flex-1 flex items-center gap-4 w-full px-4">
              <div className="w-12 h-12 rounded-xl bg-[#03c4c9]/10 flex items-center justify-center flex-shrink-0">
                <CalendarIcon className="text-[#03c4c9]" size={24} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-[#03c4c9] uppercase tracking-widest">Plan Your Charter</p>
                <p className="text-sm text-[#2d353b] dark:text-gray-300 font-medium">Check real-time availability for our private vessel.</p>
              </div>
            </div>
            
            <div className="w-full md:w-auto p-2">
              <Button 
                onClick={() => setShowCalendar(true)}
                className="w-full md:w-auto h-14 px-10 bg-[#03c4c9] hover:bg-[#f5c842] hover:text-[#2d353b] text-white font-bold rounded-xl transition-all duration-300 group"
              >
                CHECK AVAILABILITY <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="container mx-auto max-w-7xl">
          <motion.div {...fadeInUp} className="mb-16 grid md:grid-cols-2 gap-8 items-end">
            <div>
              <h2 className="text-4xl font-bold text-white tracking-tight mb-4">Memorable experiences for selective people</h2>
              <div className="w-20 h-1 bg-[#03c4c9]"></div>
            </div>
            <div>
              <p className="text-[#8c959f] text-lg font-light leading-relaxed">
                Specialized in personalized experiences: <span className="text-white font-medium">tailor-made dives</span>, fresh meals and exclusive relaxation areas.
              </p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {renderServiceCard('tailor-made')}
            {renderServiceCard('pre-designed')}
            {renderServiceCard('private-boat')}
          </div>
        </div>
      </section>

      {/* Private Charter Model */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp} className="space-y-8">
              <h3 className="text-[#03c4c9] font-bold uppercase tracking-widest text-sm">Private Charter Model</h3>
              <h2 className="text-4xl md:text-5xl font-normal text-[#2d353b] leading-tight italic tracking-tighter opacity-80">
                " Your exclusive ocean adventure starts here. "
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#03c4c9] mt-1 flex-shrink-0" />
                  <p className="text-lg text-gray-700 font-light">
                    <strong>Total Privacy:</strong> The entire vessel and crew are dedicated solely to your group.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#03c4c9] mt-1 flex-shrink-0" />
                  <p className="text-lg text-gray-700 font-light">
                    <strong>Premium Gear:</strong> High-end equipment and professional instruction included.
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => openModal('General Experience Inquiry', 'https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Experiences%20-%20Photos/Boat%20-%20Poseidon%20Diving%20Charter%20-%2001.jpeg')} 
                size="lg" 
                className={primaryBtn + " px-12 shadow-xl"}
              >
                BOOK NOW
              </Button>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="relative">
              <img className="rounded-2xl shadow-2xl w-full aspect-square object-cover" src="https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Experiences%20-%20Photos/Boat%20-%20Poseidon%20Diving%20Charter%20-%2001.jpeg" alt="Boat" />
              <div className="absolute -bottom-6 -left-6 bg-[#03c4c9]/80 backdrop-blur-md p-8 rounded-2xl shadow-xl hidden md:block">
                <p className="text-white font-bold text-2xl tracking-tighter">MAX 4 GUESTS</p>
                <p className="text-white/80 text-sm uppercase tracking-widest">Absolute Exclusivity</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <BlogPreview />

      {/* Footer CTA */}
      <section className="py-24 px-4 bg-[#0b1216] border-t border-white/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Ready to explore?</h2>
          <p className="text-white/60 mb-10 font-light text-lg">Contact our concierge team for specialized requests or immediate booking assistance.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button asChild size="lg" className={primaryBtn + " px-12"}>
              <Link to="/contact">TALK TO OUR TEAM</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-[#25D366] border-none text-white hover:bg-[#128C7E] font-bold px-12 h-14 rounded-xl shadow-lg shadow-green-900/20 transition-all">
              <a href="https://wa.me/351924955333" target="_blank" rel="noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" /> WHATSAPP DIRECT
              </a>
            </Button>
          </div>
        </div>
      </section>
      {/* Calendar Modal */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-none bg-transparent">
          <div className="bg-white dark:bg-[#111a1f] p-6 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <CalendarIcon className="text-[#03c4c9]" />
                Charter Availability
              </DialogTitle>
              <DialogDescription className="text-base">
                Browse our real-time schedule. Greyed out dates are fully booked.
              </DialogDescription>
            </DialogHeader>
            <div className="bg-gray-50 dark:bg-[#0b1216] p-4 rounded-xl mb-6">
              <AvailabilityCalendar 
                serviceName="General Charter Inquiry" 
                experienceImage={heroImage} 
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HomePage;
