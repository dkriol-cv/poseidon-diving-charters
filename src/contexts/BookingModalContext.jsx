
import React, { createContext, useContext, useState } from 'react';

const BookingModalContext = createContext();

export const BookingModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [experienceName, setExperienceName] = useState('');
  const [experienceImage, setExperienceImage] = useState('');

  const loadStripeScript = () => {
    if (document.querySelector('script[src="https://js.stripe.com/v3/"]')) return;
    
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    document.body.appendChild(script);
    console.log('[Stripe] Loading script dynamically...');
  };

  const openModal = (name, image = '') => {
    setExperienceName(name);
    setExperienceImage(image);
    setIsOpen(true);
    loadStripeScript();
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setExperienceName('');
      setExperienceImage('');
    }, 300);
  };

  return (
    <BookingModalContext.Provider value={{ isOpen, experienceName, experienceImage, openModal, closeModal }}>
      {children}
    </BookingModalContext.Provider>
  );
};

export const useBookingModal = () => {
  const context = useContext(BookingModalContext);
  if (!context) {
    throw new Error('useBookingModal must be used within BookingModalProvider');
  }
  return context;
};
