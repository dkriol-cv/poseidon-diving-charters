import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Blog = () => {
  return (
    <>
      <Helmet>
        <title>Blog - Poseidon Diving Charters</title>
        <meta name="description" content="Read the latest stories, tips, and updates from Poseidon Diving Charters. Discover the beauty of Lagos diving and boat trips." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="pt-24 min-h-[80vh] flex flex-col bg-[#f5f7f9] dark:bg-[#0b1216]">
        {/* Blog Hero / Featured Post */}
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white dark:bg-[#161f26] rounded-2xl overflow-hidden shadow-xl"
          >
            {/* Imagem das Grutas do Algarve */}
            <div className="h-64 lg:h-[450px] overflow-hidden">
              <img
                src="https://unsplash.com/pt-br/fotografias/fotografia-de-litoral-durante-o-dia-cmYjQ30PbWk"
                alt="Ponta da Piedade Caves in Lagos, Algarve"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Texto do Artigo em Destaque */}
            <div className="p-8 lg:p-12">
              <span className="text-[#03c4c9] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
                Featured Post • Algarve
              </span>

              <h1 className="text-3xl md:text-4xl font-bold text-[#2d353b] dark:text-white mb-6 leading-tight">
                Ponta da Piedade: Discover the Hidden Golden Caves of Lagos
              </h1>

              <p className="text-md md:text-lg text-[#8c959f] dark:text-gray-400 mb-8 leading-relaxed">
                The Ponta da Piedade is arguably the most beautiful coastline in Portugal. Our latest guide explores the crystal-clear turquoise waters and the dramatic rock formations that have been carved by the Atlantic Ocean over thousands of years. From secret grottoes to hidden beaches only accessible by boat, join us on a journey through this natural Algarve masterpiece.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/post/ponta-da-piedade">
                  <Button
                    className="w-full sm:w-auto min-w-[160px] h-12 bg-[#03c4c9] hover:bg-[#f5c842] text-white hover:text-[#2d353b] font-bold text-xs tracking-wider uppercase transition-all duration-300"
                  >
                    Read More
                  </Button>
                </Link>

                <Link to="/booking">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto min-w-[160px] h-12 border-2 border-[#2d353b] dark:border-white/20 text-[#2d353b] dark:text-white hover:bg-[#2d353b] hover:text-white dark:hover:bg-white dark:hover:text-[#0b1216] font-bold text-xs tracking-wider uppercase transition-all duration-300 bg-transparent"
                  >
                    Book a Boat Trip
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Blog;