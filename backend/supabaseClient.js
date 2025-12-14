const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;
let isServiceRole = false;
if (url && (serviceKey || anonKey)) {
  const key = serviceKey || anonKey;
  isServiceRole = !!serviceKey;
  supabase = createClient(url, key, {
    auth: { persistSession: false },
  });
}

module.exports = { supabase, isServiceRole };
