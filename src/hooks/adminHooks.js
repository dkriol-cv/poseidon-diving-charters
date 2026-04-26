
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { getContacts, markContactAsRead, archiveContact } from '@/services/adminService';
import { useToast } from '@/hooks/use-toast';

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchContacts = async () => {
    try {
      const data = await getContacts();
      setContacts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await markContactAsRead(id);
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status: 'read' } : c));
    } catch (error) {
      console.error("Error marking contact read:", error);
    }
  };

  const archive = async (id) => {
    try {
      await archiveContact(id);
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status: 'archived' } : c));
      toast({ title: "Archived", description: "Message moved to archive" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to archive message" });
    }
  };

  useEffect(() => {
    fetchContacts();
    const sub = supabase.channel('contacts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_submissions' }, fetchContacts)
      .subscribe();
    return () => sub.unsubscribe();
  }, []);

  return { contacts, loading, markRead, archive };
};
