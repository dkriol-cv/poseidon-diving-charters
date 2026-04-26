
import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * DEPRECATED: Booking page - automatic booking system removed
 * All bookings are now handled via manual contact (WhatsApp/Email/Phone)
 * Redirects to homepage
 */

const BookingPage = () => {
  return <Navigate to="/" replace />;
};

export default BookingPage;
