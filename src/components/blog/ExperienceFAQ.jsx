import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqContent = {
  diving: [
    {
      question: "What is the maximum group size for dives?",
      answer: "We keep our groups small and intimate, with a maximum of 4 guests per charter. This ensures personalized attention, maximum safety, and a premium experience tailored to your skill level."
    },
    {
      question: "Do I need to bring my own diving gear?",
      answer: "You can bring your own gear if you prefer, but we offer top-of-the-line rental equipment for all our guests. Just let us know your sizes when booking, and we'll have everything ready for you on board."
    },
    {
      question: "Can non-divers join the charter?",
      answer: "Absolutely! Our charters are perfect for mixed groups. Non-divers can enjoy snorkeling, swimming, sunbathing on our comfortable decks, or simply relaxing with our premium refreshments while others dive."
    },
    {
      question: "What are the typical dive conditions in Lagos?",
      answer: "Lagos offers excellent visibility (typically 10-20 meters) and a variety of dive sites from reefs to wrecks. Water temperatures range from 15°C to 22°C depending on the season, so we provide appropriate wetsuits."
    },
    {
      question: "Do you offer night dives?",
      answer: "Yes, night dives can be arranged as part of our Tailor-Made Charters. Please request this during your booking consultation so we can plan the optimal itinerary and ensure specific safety protocols."
    }
  ]
};

const ExperienceFAQ = ({ type = 'diving' }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = faqContent[type] || faqContent.diving;

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12">
      <div className="flex items-center gap-2 mb-8 justify-center">
        <span className="h-[2px] w-10 bg-[#03c4c9]"></span>
        <span className="text-[#03c4c9] text-xs uppercase tracking-widest font-bold">Frequently Asked Questions</span>
        <span className="h-[2px] w-10 bg-[#03c4c9]"></span>
      </div>
      <h2 className="text-3xl font-bold mb-10 text-center text-[#2d353b] dark:text-white">Good to Know</h2>
      
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
                  <div className="p-6 pt-0 text-[#8c959f] dark:text-gray-400 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-800/50 mt-2">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceFAQ;