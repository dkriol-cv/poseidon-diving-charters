import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const { 
    isOpen, 
    preferences, 
    updatePreferences, 
    acceptAll, 
    rejectAll, 
    savePreferences,
    setIsOpen
  } = useCookieConsent();

  const [showDetails, setShowDetails] = useState(false);

  // If fully closed (user made choice), only show a small trigger button (optional)
  // For this task, we assume "isOpen" controls the banner visibility initially
  // If isOpen is false, we render nothing (or a small floating shield if desired later)
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        role="dialog"
        aria-labelledby="cookie-consent-title"
        aria-describedby="cookie-consent-desc"
      >
        <div className="max-w-7xl mx-auto bg-white dark:bg-[#162026] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          
          {/* Header / Basic Banner */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2 text-[#03c4c9]">
                  <Shield size={24} />
                  <h2 id="cookie-consent-title" className="font-bold text-lg text-[#2d353b] dark:text-white">
                    We Value Your Privacy
                  </h2>
                </div>
                <p id="cookie-consent-desc" className="text-[#5e666e] dark:text-gray-400 text-sm leading-relaxed max-w-3xl">
                  We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                  <Link to="/cookie-policy" className="ml-1 underline text-[#03c4c9] hover:text-[#029a9e]">
                    Read our Cookie Policy
                  </Link>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 min-w-[300px] sm:min-w-0">
                {!showDetails ? (
                  <>
                     <Button 
                      variant="outline" 
                      onClick={() => setShowDetails(true)}
                      className="border-gray-200 dark:border-gray-700"
                      aria-label="Customize cookie preferences"
                    >
                      Preferences
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={rejectAll}
                      className="text-[#5e666e] dark:text-gray-400 hover:text-[#2d353b] hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Reject All
                    </Button>
                    <Button 
                      onClick={acceptAll}
                      className="bg-[#03c4c9] hover:bg-[#029a9e] text-white"
                    >
                      Accept All
                    </Button>
                  </>
                ) : (
                   <div className="hidden sm:block">
                      <Button variant="ghost" size="icon" onClick={() => setShowDetails(false)}>
                        <X size={20} />
                      </Button>
                   </div>
                )}
              </div>
            </div>
          </div>

          {/* Expanded Preferences Panel */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-gray-100 dark:border-gray-800 bg-[#f5f7f9] dark:bg-[#0d1419]"
              >
                <div className="p-6 md:p-8 space-y-6">
                  {/* Essential */}
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-[#162026] rounded-xl border border-gray-100 dark:border-gray-800">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[#2d353b] dark:text-white">Essential</span>
                        <span className="text-[10px] uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">Required</span>
                      </div>
                      <p className="text-xs text-[#8c959f] dark:text-gray-400">
                        Necessary for the website to function (e.g., booking system, session security). Cannot be disabled.
                      </p>
                    </div>
                    <Switch 
                      checked={preferences.essential} 
                      disabled={true} 
                      aria-label="Essential cookies (always active)"
                    />
                  </div>

                  {/* Analytics */}
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-[#162026] rounded-xl border border-gray-100 dark:border-gray-800">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[#2d353b] dark:text-white">Analytics</span>
                      </div>
                      <p className="text-xs text-[#8c959f] dark:text-gray-400">
                        Helps us understand how you use the site so we can improve user experience.
                      </p>
                    </div>
                    <Switch 
                      checked={preferences.analytics} 
                      onCheckedChange={(checked) => updatePreferences('analytics', checked)} 
                      aria-label="Toggle analytics cookies"
                    />
                  </div>

                  {/* Marketing */}
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-[#162026] rounded-xl border border-gray-100 dark:border-gray-800">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[#2d353b] dark:text-white">Marketing</span>
                      </div>
                      <p className="text-xs text-[#8c959f] dark:text-gray-400">
                        Used to deliver relevant advertisements and track effectiveness. Includes Stripe fraud detection.
                      </p>
                    </div>
                    <Switch 
                      checked={preferences.marketing} 
                      onCheckedChange={(checked) => updatePreferences('marketing', checked)} 
                      aria-label="Toggle marketing cookies"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowDetails(false)}
                      className="text-[#5e666e] dark:text-gray-400"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={savePreferences}
                      className="bg-[#03c4c9] hover:bg-[#029a9e] text-white"
                    >
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsent;