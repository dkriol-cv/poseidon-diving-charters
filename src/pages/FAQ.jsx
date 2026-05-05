import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Breadcrumbs from '@/components/Breadcrumbs';
import { faqPageSchema } from '@/lib/seoHelpers';

const faqCategories = [
  {
    title: "Logistics & Booking",
    faqs: [
      {
        question: "Where is the meeting point for departure?",
        answer: "The meeting point for departure is in Marina de Lagos, at gate E - F - G - H - I. Please arrive at least 15 minutes before departure for check-in and briefing."
      },
      {
        question: "What is included in the package?",
        answer: "All our charters include meals and drinks, refreshments, snacks and water. As well towels and the water activity equipment is waiting for you onboard.\n\nIf you have allergies or special dietary restrictions, please contact our support team.\n\nThe diving charters also include diving suits, BCD:s, regulators, fins, masks, as well as bottles, weights etc. If you rather use your own equipment, you are welcome to bring it."
      },
      {
        question: "Are there age or certification requirements?",
        answer: "There is no age requirement for our private boat charters. However, we require swimming ability. Small children must use life vests and floatation devices.\n\nFor our diving charters all divers must present a valid certification card from a recognized agency (e.g., PADI, SSI, NAUI) before their diving charter trip. We apply minimum experience requirements, such as a certain certification level or a minimum number of logged dives, especially for more advanced diving such as wreck diving or cave diving."
      },
      {
        question: "What is the cancellation policy?",
        answer: "All cancellations must be provided in writing via email. If a cancellation is made with more than seven days’ notice a full refund will be issued, with more than two days’ notice a refund of 50% may be issued, with less than two days’ notice the full payment may be forfeited, and no refund will be issued.\n\nCustomer who fails to show up for a scheduled charter without prior notice will lose the full payment.\n\nWe reserve the right to cancel trips due to weather, mechanical issues, or safety concerns. In such cases, rescheduling or a full refund will be provided."
      }
    ]
  },
  {
    title: "Boat Facilities",
    faqs: [
      {
        question: "Are there toilets and freshwater showers on board?",
        answer: "There is a toilet onboard in the cabin and fresh hot water shower on the deck."
      },
      {
        question: "Is there dry storage for personal items?",
        answer: "Inside the cabin there is plenty of storage for personal items. As well there is a safety box for wallets and phones."
      },
      {
        question: "Are food and drinks provided?",
        answer: "We provide lunch/dinner with drinks, tea/coffee, snacks and water. It is all included in the price of the charter. Alcohol is permitted after the water sports activities/diving.\n\nFor lunch/dinner we prepare the dining area inside the cabin. However, there is also a possibility to enjoy your meal on the sun loungers outside."
      }
    ]
  },
  {
    title: "Safety & Health",
    faqs: [
      {
        question: "What emergency equipment is on board?",
        answer: "The boat carries all emergency equipment required under Portuguese maritime regulations, for a Navigation Class 4 vessel. As a maritime tourism (MT) charter, the requirements ensure the vessel can handle coastal emergencies independently.\n\nFor example, the boat carries one certified life jacket for every person on board, plus models for children, at least one ring buoy with a self-igniting light plus a life raft with capacity sufficient for all guests and crew. The boat also carries two first aid kits plus an emergency oxygen kit. There is a fixed VHF radio with Digital Selective Calling (DSC) capabilities, portable fire extinguishers located near the engine and galley, and both manual and electric bilge pumps.\n\nThe captain provides a safety briefing to all passengers regarding the location and use of the equipment listed above before departure."
      },
      {
        question: "Is a Divemaster present in the water?",
        answer: "On the diving excursions there is a Divemaster to lead the group underwater."
      }
    ]
  },
  {
    title: "Dive Conditions & Experience",
    faqs: [
      {
        question: "What will the diving be like?",
        answer: "Temperatures vary by season, usually ranging from 14°C to 22°C . We recommend a 7mm wetsuit or a drysuit during the winter and spring, while a 5mm or 7mm wetsuit is usually comfortable from July through October.\n\nWe often benefit from good clarity, with visibility typically ranging between 5 and 15 meters, though it can reach up to 20+ meters on the best days.\n\nThe four decommissioned warships of Ocean Revival Underwater Park sit on a sandy bottom at depths of 26 to 32 meters. However, the upper structures and masts can make parts of the wrecks accessible to Open Water divers.\n\nThe volcanic reef Rocha Negra offers dramatic vertical drops. Most of the action happens between 12 and 22 meters, where the dark basalt walls meet the seabed, though some sections go deeper for those with the right experience.\n\nAround Sagres, we explore beautiful limestone caverns and reefs. These sites typically range from shallow, sunlit areas at 8–12 meters to deeper offshore pinnacles reaching 25+ meters.\n\nCurrents are generally mild to moderate. While the Ocean Revival area is often quite calm, some sites closer to Sagres can offer drift dives. Our crew always assesses the conditions on the day to ensure a safe and enjoyable dive for your experience level."
      },
      {
        question: "What marine life will we see?",
        answer: "The waters between Portimão and Sagres has a mix of Atlantic and Mediterranean species. You can expect shoals of sea bream, snappers, and sardines, often accompanied by barracudas. It is also common to spot lobsters, spider crabs, and various species of shrimp in the crevices and ship structures. At the Ocean Revival site, the warships have become ecosystems where snappers and triggerfish are common sights.\n\nThe area is also known for its macro photography. You’ll find a variety of nudibranchs, octopuses, and cuttlefish expertly camouflaged. Depending on the season and luck, we occasionally encounter seahorses, stingrays, and even sunfish (Mola Mola) or dolphins during the boat ride to the sites."
      },
      {
        question: "How many divers will be on the boat?",
        answer: "We offer a premium, small-group experience. Our boat is licensed to carry a maximum of four divers per trip, which means you will have a high level of personal attention. The guide-to-diver ratio is never more than 1:4, ensuring a safe and tailored experience for everyone."
      }
    ]
  }
];

const FAQAccordion = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-[#162026] shadow-sm hover:border-[#03c4c9] transition-colors duration-300"
        >
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
          >
            <span className="font-bold text-[#2d353b] dark:text-white pr-4">{faq.question}</span>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 bg-[#f5f7f9] dark:bg-[#0b1216] p-2 rounded-full text-[#03c4c9]"
            >
              <ChevronDown size={18} />
            </motion.div>
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {/* O segredo está no whitespace-pre-line aqui embaixo */}
                <div className="p-6 pt-0 text-[#8c959f] dark:text-gray-400 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-800/50 mt-2 whitespace-pre-line">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

// ... Resto do componente FAQPage permanece igual
const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState(0);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-[#f5f7f9] dark:bg-[#0b1216] pt-28 pb-20">
      <Helmet>
        <title>FAQ - Poseidon Diving Charters</title>
        <meta name="description" content="Frequently asked questions about booking, facilities, safety, and dive conditions with Poseidon Diving Charters." />
        <script type="application/ld+json">
          {JSON.stringify(faqPageSchema(faqCategories.flatMap((c) => c.faqs)))}
        </script>
      </Helmet>
      <Breadcrumbs items={[{ name: 'Home', url: '/' }, { name: 'FAQ', url: '/faq' }]} />

      {/* Header Section */}
      <section className="container mx-auto px-4 mb-16 text-center max-w-3xl">
        <motion.div {...fadeInUp}>
          <div className="flex items-center gap-2 mb-4 justify-center">
            <span className="h-[2px] w-10 bg-[#03c4c9]"></span>
            <span className="text-[#03c4c9] text-xs uppercase tracking-widest font-bold">Help Center</span>
            <span className="h-[2px] w-10 bg-[#03c4c9]"></span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2d353b] dark:text-white mb-6">Frequently Asked Questions</h1>
          <p className="text-lg text-[#8c959f] dark:text-gray-400">
            Find answers to common questions about our charters, facilities, and the unforgettable experiences we offer in Lagos.
          </p>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

          {/* Sidebar */}
          <motion.div
            className="md:w-1/3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white dark:bg-[#162026] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 sticky top-32">
              <h3 className="font-bold text-[#2d353b] dark:text-white mb-4 px-4 pt-2">Categories</h3>
              <div className="space-y-1">
                {faqCategories.map((category, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveCategory(idx)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${activeCategory === idx
                        ? 'bg-[#03c4c9]/10 text-[#03c4c9]'
                        : 'text-[#8c959f] hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-[#2d353b] dark:hover:text-white'
                      }`}
                  >
                    {category.title}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Accordion */}
          <motion.div
            className="md:w-2/3"
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#2d353b] dark:text-white">
                {faqCategories[activeCategory].title}
              </h2>
            </div>
            <FAQAccordion faqs={faqCategories[activeCategory].faqs} />
          </motion.div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 mt-24">
        <motion.div
          className="bg-[#162026] rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto shadow-xl relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute top-0 left-0 w-2 h-full bg-[#03c4c9]"></div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Still have questions?</h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            If you couldn't find the answer you were looking for, our team is always ready to help you plan the perfect experience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild className="bg-[#03c4c9] text-white hover:bg-[#f5c842] hover:text-[#2d353b] font-bold py-6 px-8 rounded-lg">
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button asChild variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white py-6 px-8 rounded-lg">
              <a href="https://wa.me/351924955333" target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} className="mr-2" /> WhatsApp Us
              </a>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default FAQPage;