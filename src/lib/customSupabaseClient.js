import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hcypqomjisyqrczwjrgc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjeXBxb21qaXN5cXJjendqcmdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MDAwNTcsImV4cCI6MjA4MDE3NjA1N30.m8u8g-qQjMV7WGdEgibkJLc3BGU2iKn8gllS4Za2Yok';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
