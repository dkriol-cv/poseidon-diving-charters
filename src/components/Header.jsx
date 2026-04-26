import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExperiencesOpen, setIsExperiencesOpen] = useState(false);
  const [isMobileExperiencesOpen, setIsMobileExperiencesOpen] = useState(false);

  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const useSolidHeader = !isHomePage || isScrolled;

  const experienceLinks = [
    { name: 'Tailor-Made Diving Charter', path: '/tailor-made' },
    { name: 'Pre-Designed Diving Charter', path: '/pre-designed' },
    { name: 'Private Boat Charter', path: '/exclusive-charter' },
    { name: 'Beach Charter', path: '/beach-charter' }
  ];

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'Sustainability', path: '/sustainability' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const isExperienceActive = experienceLinks.some(link => location.pathname === link.path);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsExperiencesOpen(false);
    setIsMobileExperiencesOpen(false);
  }, [location]);

  const getNavLinkClasses = (isSolid, path) => {
    const isActive =
      location.pathname === path ||
      (path === '/blog' && location.pathname.startsWith('/blog/'));

    return cn(
      "font-medium text-[10px] xl:text-xs tracking-widest uppercase transition-colors duration-300 whitespace-nowrap",
      isSolid
        ? isActive
          ? "text-[#03c4c9] font-bold"
          : "text-[#2d353b] dark:text-gray-200 hover:text-[#03c4c9]"
        : isActive
          ? "text-[#f5c842] font-bold"
          : "text-white hover:text-[#f5c842]"
    );
  };

  const getExperiencesClasses = (isSolid) => {
    return cn(
      "font-medium text-[10px] xl:text-xs tracking-widest uppercase transition-colors duration-300 whitespace-nowrap flex items-center gap-1",
      isSolid
        ? isExperienceActive
          ? "text-[#03c4c9] font-bold"
          : "text-[#2d353b] dark:text-gray-200 hover:text-[#03c4c9]"
        : isExperienceActive
          ? "text-[#f5c842] font-bold"
          : "text-white hover:text-[#f5c842]"
    );
  };

  const LOGO_BLACK_ICON =
    "https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Poseidon%20Diving%20Charters%20-%20Logo%20Blue/poseidon_diving_charters_black_favicon-01.png";

  const LOGO_WHITE_ICON =
    "https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Poseidon%20Diving%20Charters%20-%20Logo%20Blue/poseidon_diving_charters_favicon-01.png";

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
        useSolidHeader
          ? "bg-white dark:bg-[#0b1216] shadow-md py-0 h-20 xl:h-24"
          : "bg-gradient-to-b from-black/60 to-transparent py-4 h-28 xl:h-32"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 h-full">
        <div className="flex items-center justify-between h-full">
          <Link to="/" className="flex-shrink-0 relative z-20">
            <img
              src={useSolidHeader ? LOGO_BLACK_ICON : LOGO_WHITE_ICON}
              alt="Poseidon Diving Charters Icon"
              className={cn(
                "w-auto transition-all duration-300",
                useSolidHeader ? "h-12 xl:h-14" : "h-14 sm:h-16 xl:h-20"
              )}
            />
          </Link>

          <div className="flex items-center">
            <nav className="hidden xl:flex items-center space-x-4 xl:space-x-8">
              <Link
                to="/"
                className={getNavLinkClasses(useSolidHeader, '/')}
              >
                Home
              </Link>

              <div
                className="relative"
                onMouseEnter={() => setIsExperiencesOpen(true)}
                onMouseLeave={() => setIsExperiencesOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setIsExperiencesOpen(!isExperiencesOpen)}
                  className={getExperiencesClasses(useSolidHeader)}
                >
                  Experiences
                  <ChevronDown
                    size={14}
                    className={cn(
                      "transition-transform duration-200",
                      isExperiencesOpen && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {isExperiencesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-5"
                    >
                      <div className="min-w-[280px] bg-white dark:bg-[#0b1216] rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-3">
                        {experienceLinks.map(link => (
                          <Link
                            key={link.name}
                            to={link.path}
                            className={cn(
                              "block px-5 py-3 text-xs uppercase tracking-widest font-medium transition-colors duration-200 whitespace-nowrap",
                              location.pathname === link.path
                                ? "text-[#03c4c9] font-bold"
                                : "text-[#2d353b] dark:text-gray-200 hover:text-[#03c4c9]"
                            )}
                          >
                            {link.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks
                .filter(link => link.path !== '/')
                .map(link => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={getNavLinkClasses(useSolidHeader, link.path)}
                  >
                    {link.name}
                  </Link>
                ))}
            </nav>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "ml-4 xl:hidden p-2 transition-colors duration-300 z-20 relative",
                useSolidHeader
                  ? "text-[#2d353b] dark:text-white hover:text-[#03c4c9]"
                  : "text-white hover:text-[#f5c842]"
              )}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-white dark:bg-[#0b1216] border-t border-gray-100 dark:border-gray-800 shadow-lg absolute top-full left-0 right-0 w-full max-h-[90vh] overflow-y-auto z-40"
          >
            <nav className="container mx-auto px-6 py-8 flex flex-col space-y-2">
              <Link
                to="/"
                className="text-[#2d353b] dark:text-gray-200 hover:text-[#03c4c9] transition-colors duration-200 font-medium text-sm uppercase tracking-wider py-4 border-b border-gray-100 dark:border-gray-800"
              >
                Home
              </Link>

              <button
                type="button"
                onClick={() => setIsMobileExperiencesOpen(!isMobileExperiencesOpen)}
                className={cn(
                  "w-full flex items-center justify-between text-left transition-colors duration-200 font-medium text-sm uppercase tracking-wider py-4 border-b border-gray-100 dark:border-gray-800",
                  isExperienceActive
                    ? "text-[#03c4c9] font-bold"
                    : "text-[#2d353b] dark:text-gray-200 hover:text-[#03c4c9]"
                )}
              >
                Experiences
                <ChevronDown
                  size={18}
                  className={cn(
                    "transition-transform duration-200",
                    isMobileExperiencesOpen && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {isMobileExperiencesOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pl-4 border-b border-gray-100 dark:border-gray-800"
                  >
                    {experienceLinks.map(link => (
                      <Link
                        key={`mobile-${link.name}`}
                        to={link.path}
                        className={cn(
                          "block text-[#2d353b] dark:text-gray-200 hover:text-[#03c4c9] transition-colors duration-200 font-medium text-xs uppercase tracking-wider py-3",
                          location.pathname === link.path && "text-[#03c4c9] font-bold"
                        )}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {navLinks
                .filter(link => link.path !== '/')
                .map(link => (
                  <Link
                    key={`mobile-${link.name}`}
                    to={link.path}
                    className="text-[#2d353b] dark:text-gray-200 hover:text-[#03c4c9] transition-colors duration-200 font-medium text-sm uppercase tracking-wider py-4 border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    {link.name}
                  </Link>
                ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;