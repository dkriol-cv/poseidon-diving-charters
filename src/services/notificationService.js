
/**
 * DEPRECATED: Notification service for bookings - booking system removed
 * This file is kept for backwards compatibility only
 * All functions return mock responses
 */

export const notificationService = {
  async resendNotification() {
    console.warn('[NotificationService] Booking system deprecated');
    return { success: true, message: 'Booking system removed - no action taken' };
  },

  async sendBookingConfirmation() {
    console.warn('[NotificationService] Booking system deprecated');
    return { success: true, message: 'Booking system removed - no action taken' };
  },

  async sendAdminAlert() {
    console.warn('[NotificationService] Booking system deprecated');
    return { success: true, message: 'Booking system removed - no action taken' };
  },

  async sendCancellationEmail() {
    console.warn('[NotificationService] Booking system deprecated');
    return { success: true, message: 'Booking system removed - no action taken' };
  },

  formatNotificationTime(timestamp) {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case 'sent':
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }
};
