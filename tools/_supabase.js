// Tiny REST helper for build-time scripts.
// Reads SUPABASE_URL/SUPABASE_ANON_KEY from env, with hard-coded
// fallbacks (these are public anon keys — same as in src/lib/customSupabaseClient.js).

const URL = process.env.SUPABASE_URL || 'https://hcypqomjisyqrczwjrgc.supabase.co';
const KEY = process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjeXBxb21qaXN5cXJjendqcmdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MDAwNTcsImV4cCI6MjA4MDE3NjA1N30.m8u8g-qQjMV7WGdEgibkJLc3BGU2iKn8gllS4Za2Yok';

export async function pgrest(path) {
  const res = await fetch(`${URL}/rest/v1/${path}`, {
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      Accept: 'application/json',
    },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  return res.json();
}

export const SUPABASE_URL = URL;
