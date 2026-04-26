
import { useState, useEffect, useCallback } from 'react';
import supabase from '@/lib/customSupabaseClient';

export const useService = (slug) => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchService = useCallback(async () => {
    if (!slug) {
      setError('No slug provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('services')
        .select('id, slug, title, price, description, duration, is_active')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // No rows returned - service not found or inactive
          console.warn(`Service with slug "${slug}" not found or inactive`);
          setService(null);
          setError('Service not found');
        } else {
          throw fetchError;
        }
      } else {
        setService(data);
      }
    } catch (err) {
      console.error('Error fetching service:', err);
      setError(err.message || 'Failed to fetch service');
      setService(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchService();

    // Auto-refetch every 10 seconds to keep data fresh
    const intervalId = setInterval(() => {
      fetchService();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [fetchService]);

  const refetch = useCallback(() => {
    fetchService();
  }, [fetchService]);

  return { service, loading, error, refetch };
};
