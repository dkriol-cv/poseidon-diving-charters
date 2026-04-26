
/**
 * DEPRECATED: Stripe client - payment processing removed
 * This file is kept for backwards compatibility only
 * All bookings are now handled via manual contact (WhatsApp/Email/Phone)
 */

export const createCheckoutSession = () => Promise.resolve(null);
export const processPayment = () => Promise.resolve(null);
export const getPaymentIntent = () => Promise.resolve(null);
export const confirmPayment = () => Promise.resolve(null);
export const cancelPayment = () => Promise.resolve(null);
export const stripePromise = Promise.resolve(null);

export default {
  createCheckoutSession,
  processPayment,
  getPaymentIntent,
  confirmPayment,
  cancelPayment,
  stripePromise
};
