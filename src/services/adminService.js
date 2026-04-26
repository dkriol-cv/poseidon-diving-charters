
import { supabase } from '@/lib/customSupabaseClient';

// Contacts
export const getContacts = async () => {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};

export const markContactAsRead = async (id, status = 'read') => {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating contact ${id}:`, error);
    throw error;
  }
};

export const archiveContact = async (id) => {
  return markContactAsRead(id, 'archived');
};
