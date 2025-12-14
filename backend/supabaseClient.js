const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;
if (url && (serviceKey || anonKey)) {
  supabase = createClient(url, serviceKey || anonKey, {
    auth: { persistSession: false },
  });
}

module.exports = { supabase };
