
import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * DEPRECATED: Checkout page - payment processing removed
 * All bookings are now handled via manual contact (WhatsApp/Email/Phone)
 * Redirects to homepage
 */

const CheckoutPage = () => {
  return <Navigate to="/" replace />;
};

export default CheckoutPage;
