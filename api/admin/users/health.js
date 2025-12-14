import { supabase, isServiceRole } from '../../_lib/supabaseClient.js';

export default async function handler(req, res) {
  try {
    if (!supabase) return res.status(503).json({ error: 'Supabase no configurado en backend' });
    const { error } = await supabase.from('products').select('*', { count: 'exact', head: true });
    if (error) return res.status(503).json({ error: `Supabase indisponible: ${error.message}` });
    return res.status(200).json({ ok: true, service_role: isServiceRole });
  } catch (err) {
    return res.status(503).json({ error: `Supabase health error: ${err.message}` });
  }
}

