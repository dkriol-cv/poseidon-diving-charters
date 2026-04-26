
/**
 * DEPRECATED: Email notification helpers - booking system removed
 * This file is kept for backwards compatibility only
 * All functions return mock success responses
 */

export const sendBookingConfirmationEmails = async () => {
  console.warn('[EmailHelper] Booking system deprecated - no emails sent');
  return { success: true, message: 'Booking system removed - no action taken' };
};

export const sendCancellationEmail = async () => {
  console.warn('[EmailHelper] Booking system deprecated - no emails sent');
  return { success: true, message: 'Booking system removed - no action taken' };
};

export const sendPaymentConfirmation = async () => {
  console.warn('[EmailHelper] Booking system deprecated - no emails sent');
  return { success: true, message: 'Booking system removed - no action taken' };
};

export const sendAdminNotification = async () => {
  console.warn('[EmailHelper] Booking system deprecated - no emails sent');
  return { success: true, message: 'Booking system removed - no action taken' };
};
