
import React, { createContext, useContext, useState } from 'react';

const BookingModalContext = createContext();

export const BookingModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [experienceName, setExperienceName] = useState('');
  const [experienceImage, setExperienceImage] = useState('');

  const openModal = (name, image = '') => {
    setExperienceName(name);
    setExperienceImage(image);
    setIsOpen(true);
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
