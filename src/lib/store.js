import { supabase } from '@/lib/customSupabaseClient';

// Helper to determine environment
const isProduction = import.meta.env.PROD; 

export const db = {
  bookings: {
    getAll: async () => {
      try {
        if (!supabase) throw new Error("Supabase client not initialized");
        
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('booking_date', { ascending: false });
        
        if (error) throw error;
        return data || [];
      } catch (e) {
        console.error("Failed to fetch bookings:", e.message);
        return [];
      }
    },
    getById: async (id) => {
      try {
        if (!supabase) throw new Error("Supabase client not initialized");

        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data;
      } catch (e) {
        console.error(`Failed to fetch booking ${id}:`, e.message);
        throw e;
      }
    },
    create: async (bookingData) => {
      try {
        if (!supabase) throw new Error("Supabase client not initialized");

        const { data, error } = await supabase
            .from('bookings')
            .insert([bookingData])
            .select()
            .single();
        
        if (error) throw error;
        return data;
      } catch (e) {
        console.error("Failed to create booking:", e.message);
        throw e;
      }
    },
    update: async (id, updates) => {
      try {
        if (!supabase) throw new Error("Supabase client not initialized");

        const { data, error } = await supabase.from('bookings').update(updates).eq('id', id).select();
        
        if (error) throw error;
        return data;
      } catch (e) {
        console.error(`Failed to update booking ${id}:`, e.message);
        throw e;
      }
    }
  },
  timeSlots: {
    _cache: null,
    _cacheTime: 0,
    clearCache: () => {
      console.log("Store: Clearing timeSlots cache");
      db.timeSlots._cache = null;
      db.timeSlots._cacheTime = 0;
    },
    getAll: async (forceRefresh = false) => {
       console.log(`Store: Fetching all time slots (Force Refresh: ${forceRefresh})...`);
       
       // Cache check (5 minutes = 300000 ms)
       const now = Date.now();
       if (!forceRefresh && db.timeSlots._cache && (now - db.timeSlots._cacheTime < 300000)) {
           console.log("Store: Returning cached time slots");
           return db.timeSlots._cache;
       }

       try {
           if (!supabase) throw new Error("Supabase client not initialized");

           const { data, error } = await supabase.from('time_slots').select('*');
           
           if (error) {
             console.error("Store: Error fetching time slots:", error.message);
             db.timeSlots.clearCache();
             throw error;
           }
           
           console.log(`Store: Successfully fetched ${data?.length || 0} time slots.`);
           
           // Update Cache
           db.timeSlots._cache = data || [];
           db.timeSlots._cacheTime = now;

           return data || [];
       } catch (err) {
           console.error("Store: Unexpected error in timeSlots.getAll:", err.message);
           db.timeSlots.clearCache();
           // Return empty array to prevent app crash, but log error
           return [];
       }
    }
  },
  config: {
    get: async (key) => {
      try {
        if (!supabase) return null;
        const { data, error } = await supabase.from('admin_settings').select('*').single(); 
        if (error) return null;
        return data ? data[key] : null;
      } catch (e) {
        console.error(`Failed to fetch config ${key}:`, e.message);
        return null;
      }
    }
  },
  auth: supabase ? supabase.auth : {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  }
};