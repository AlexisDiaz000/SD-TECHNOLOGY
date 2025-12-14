import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;
if (url && anonKey) {
  supabase = createClient(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
}

export default supabase;
