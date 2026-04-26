
/**
 * DEPRECATED: iCal service for booking calendar - booking system removed
 * This file is kept for backwards compatibility only
 */

export const iCalService = {
  generateICalUrl() {
    console.warn('[iCalService] Booking system deprecated');
    return null;
  },

  subscribeToCalendar() {
    console.warn('[iCalService] Booking system deprecated');
    return null;
  }
};
