import React from 'react';
import { Helmet } from 'react-helmet';
import Breadcrumbs from '@/components/Breadcrumbs';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AboutPage = () => {
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
      <title>About Us - Poseidon Diving Charters</title>
      <meta name="description" content="Learn about Poseidon Diving Charters, Lagos' premier provider of tailor-made diving experiences and private boat charters. Our story, values, and commitment to excellence." />
    </Helmet>
    <Breadcrumbs items={[{ name: 'Home', url: '/' }, { name: 'About', url: '/about' }]} />

    <div className="pt-24 bg-white dark:bg-[#0b1216]">
      {/* Hero */}
      <section className="relative py-20 px-4 border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h1 initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            About Poseidon
          </motion.h1>
          <motion.div initial={{
            opacity: 0,
            scaleX: 0
          }} animate={{
            opacity: 1,
            scaleX: 1
          }} transition={{
            delay: 0.3,
            duration: 0.8
          }} className="w-24 h-1 bg-[#03c4c9] mx-auto"></motion.div>
        </div>
      </section>

      {/* Content Section 1 */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp} className="space-y-6">
              <h2 className="text-3xl font-bold mb-4">A fresh and innovative concept</h2>
              <p className="text-lg text-[#8c959f] dark:text-gray-400 leading-relaxed">Poseidon Diving Charters offers tailor-made diving experiences in the beautiful waters of Lagos, Portugal. We provide both beginners and advanced divers a unique opportunity to explore the underwater landscapes. As a fresh and innovative concept on the Algarve Coast, we deliver high quality standards and personalized service.</p>
              <p className="text-lg text-[#8c959f] dark:text-gray-400 leading-relaxed">In addition to the diving charters, we offer private boat charters with lunch and water activities, as well as a sunset trip. For all our charters the onboard staff services are dedicated to our guests.</p>
            </motion.div>

            <motion.div {...fadeInUp} transition={{
              delay: 0.2
            }} className="relative">
              <div className="absolute -inset-4 bg-[#f5f7f9] dark:bg-[#162026] rounded-lg -z-10 transform rotate-2"></div>

              {/* UPDATED: fixed height + object-cover for consistent frame */}
              <img
                className="w-full h-72 sm:h-80 md:h-[420px] lg:h-[480px] object-cover rounded-lg shadow-lg"
                alt="Diving experience in Lagos"
                src="https://images.unsplash.com/photo-1593237950736-462492e827fe"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section 2 (Reversed) */}
      <section className="py-20 px-4 bg-[#f5f7f9] dark:bg-[#111a1f]">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp} transition={{
              delay: 0.2
            }} className="order-2 md:order-1 relative">
              <div className="absolute -inset-4 bg-white dark:bg-[#162026] rounded-lg -z-10 transform -rotate-2 shadow-sm"></div>

              {/* UPDATED: fixed height + object-cover for consistent frame */}
              <img
                className="w-full h-72 sm:h-80 md:h-[420px] lg:h-[480px] object-cover rounded-lg shadow-lg"
                alt="Charter boat and crew"
                src="https://images.unsplash.com/photo-1703871531859-400a76397480"
              />
            </motion.div>

            <motion.div {...fadeInUp} className="order-1 md:order-2 space-y-6">
              <h2 className="text-3xl font-bold mb-4">Personalized Service</h2>
              <p className="text-lg text-[#8c959f] dark:text-gray-400 leading-relaxed">The onboard staff includes the captain and a diving instructor/guide. Poseidon is equipped with diving gear for up to four people and guarantees a minimum of two dives per journey.</p>
              <p className="text-lg text-[#8c959f] dark:text-gray-400 leading-relaxed">Premium Meals & Refreshments are included on every charter trip. The services of the Tailor-made Diving Experience and the Private Boat Charter are bespoke, which means that the meals and drinks are chosen by you. When you’ve booked your trip our dedicated service team will reach out to plan your day.

                When chartering Poseidon, we cater for everything. All equipment for diving or other water activities, food and drinks, beach towels and sunscreen are already in place when you board. We assure you to simply arrive and enjoy a totally effortless day.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section 3 (Text Left / Image Right) */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp} className="space-y-6">
              <h2 className="text-3xl font-bold mb-4">Designed for Outdoor Comfort and Water Access</h2>

              <p className="text-lg text-[#8c959f] dark:text-gray-400 leading-relaxed">Poseidon X is a classic entry-level cruiser, which is well-regarded for its efficient use of space, providing amenities typically found on much larger vessels within a manageable 25-foot frame.</p>

              <p className="text-lg text-[#8c959f] dark:text-gray-400 leading-relaxed">The outside area provides a large sunbed that fits four people, a warm-water shower, a reinforced sea level platform with a bathing and a diving ladder. Further there are racks to transport scuba diving bottles safely.</p>

              <p className="text-lg text-[#8c959f] dark:text-gray-400 leading-relaxed">Poseidon X’s wide beam contributes to a spacious interior. The layout includes a forward V-berth, and a mid-cabin dinette in the main salon, a full gallery as well as an enclosed toilet space.</p>

              <p className="text-lg text-[#8c959f] dark:text-gray-400 leading-relaxed">There are a fully integrated first aid kit and oxygen kit provided onboard, full navigation and electronic equipment and a crew of two qualified skippers/diving instructors.</p>
            </motion.div>

            <motion.div {...fadeInUp} transition={{
              delay: 0.2
            }} className="relative">
              <div className="absolute -inset-4 bg-[#f5f7f9] dark:bg-[#162026] rounded-lg -z-10 transform rotate-2"></div>

              {/* UPDATED: fixed height + object-cover for consistent frame */}
              <img
                className="w-full h-72 sm:h-80 md:h-[420px] lg:h-[480px] object-cover rounded-lg shadow-lg"
                alt="Poseidon X outdoor comfort and water access"
                src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <section className="px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="py-10 border-b border-gray-100 dark:border-gray-800"></div>
        </div>
      </section>

      {/* Commitment */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div {...fadeInUp} className="space-y-8">
            <h2 className="text-3xl font-bold">A location for water sports enthusiasts</h2>
            <p className="text-xl text-[#8c959f] dark:text-gray-400 leading-relaxed">Lagos on Portugal’s Algarve coast is a premier destination for boat chartering and diving thanks to its unique natural beauty, wonderful year-round weather, diverse marine environment, and a local infrastructure catering to all water sports enthusiasts. The coastline around Lagos is famous worldwide for its breathtaking beauty, featuring dramatic limestone cliffs, sea caves, and hidden coves, particularly at the renowned Ponta da Piedade. These formations are best explored by boat, as many secluded beaches and caves are inaccessible by land.

              Poseidon Diving Charters operates from one of Portugal’s most renowned marinas, Marina de Lagos. This marina has received multiple prestigious awards, recognizing its high standards in quality, safety and environmental sustainability. For Poseidon Diving Charters, Marina de Lagos provides everything needed for smooth operations and unforgettable diving adventures.</p>
            <div className="pt-8">
              <Link to="/booking">
                <Button size="lg">
                  BOOK YOUR EXPERIENCE
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  </>;
};

export default AboutPage;