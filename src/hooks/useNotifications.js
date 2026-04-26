import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const useEmailLogs = (filters = {}) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('email_logs')
        .select(`
          *,
          bookings (
            customer_name
          )
        `)
        .order('created_at', { ascending: false });

      if (filters.booking_id) query = query.eq('booking_id', filters.booking_id);
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.type) query = query.eq('email_type', filters.type);

      const { data, error: err } = await query;
      if (err) throw err;
      setLogs(data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, loading, error, refetch: fetchLogs };
};

export const useNotificationStats = () => {
  const [stats, setStats] = useState({
    total_sent: 0,
    total_failed: 0,
    delivery_rate: 0,
    recent_activity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Simplified fetching: get last 100 logs to calculate approximate stats
        // Real production apps might use a database view or RPC for aggregated stats
        const { data: emailLogs } = await supabase.from('email_logs').select('status, created_at').limit(100);

        const all = emailLogs || [];
        const total = all.length;
        const failed = all.filter(l => l.status === 'failed').length;
        const sent = total - failed; // Simplified

        setStats({
          total_sent: sent,
          total_failed: failed,
          delivery_rate: total > 0 ? Math.round((sent / total) * 100) : 100,
          recent_activity: all.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return { stats, loading };
};