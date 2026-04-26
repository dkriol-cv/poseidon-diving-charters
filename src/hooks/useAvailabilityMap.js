
/**
 * DEPRECATED: Availability map hook for old booking system
 * This file is kept for backwards compatibility only
 * New system uses direct Supabase queries in AvailabilityCalendar component
 */

export const useAvailabilityMap = () => {
  return {
    availabilityMap: {},
    loading: false,
    error: null,
    refetch: () => Promise.resolve(),
    checkAvailability: () => true,
    getAvailableSlots: () => []
  };
};

export default useAvailabilityMap;
