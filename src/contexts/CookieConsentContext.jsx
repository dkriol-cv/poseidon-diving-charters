import React, { createContext, useContext, useState, useEffect } from 'react';

const CookieConsentContext = createContext(undefined);

const STORAGE_KEY = 'cookie-consent-preferences';

const defaultPreferences = {
  essential: true, // Always true and read-only
  analytics: false,
  marketing: false,
};

export const CookieConsentProvider = ({ children }) => {
  const [consentState, setConsentState] = useState('pending'); // 'pending' | 'accepted' | 'rejected'
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check local storage on mount
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPreferences({ ...defaultPreferences, ...parsed.preferences });
        setConsentState(parsed.consentState);
      } catch (e) {
        console.error('Failed to parse cookie preferences', e);
        // If error, reset to defaults
        setPreferences(defaultPreferences);
      }
    } else {
      setIsOpen(true);
    }
  }, []);

  const saveToStorage = (newPreferences, newConsentState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      preferences: newPreferences,
      consentState: newConsentState
    }));
  };

  const acceptAll = () => {
    const newPreferences = {
      essential: true,
      analytics: true,
      marketing: true
    };
    setPreferences(newPreferences);
    setConsentState('accepted');
    saveToStorage(newPreferences, 'accepted');
    setIsOpen(false);
  };

  const rejectAll = () => {
    const newPreferences = {
      essential: true,
      analytics: false,
      marketing: false
    };
    setPreferences(newPreferences);
    setConsentState('rejected');
    saveToStorage(newPreferences, 'rejected');
    setIsOpen(false);
  };

  const updatePreferences = (category, value) => {
    if (category === 'essential') return; // Cannot change essential
    setPreferences(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const savePreferences = () => {
    // Determine state based on choices. If any non-essential is true, it's 'accepted' (custom)
    // If only essential is true, it's technically 'rejected' (minimized), but we track as 'accepted' user choice
    setConsentState('accepted');
    saveToStorage(preferences, 'accepted');
    setIsOpen(false);
  };

  const resetConsent = () => {
    setConsentState('pending');
    setPreferences(defaultPreferences);
    localStorage.removeItem(STORAGE_KEY);
    setIsOpen(true);
  };

  return (
    <CookieConsentContext.Provider value={{
      consentState,
      preferences,
      isOpen,
      setIsOpen,
      acceptAll,
      rejectAll,
      updatePreferences,
      savePreferences,
      resetConsent
    }}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};