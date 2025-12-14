import { supabase, isServiceRole } from '../../_lib/supabaseClient.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      if (!isServiceRole) return res.status(503).json({ error: 'Admin API requiere SUPABASE_SERVICE_ROLE_KEY en backend' });
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data || []);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      if (!isServiceRole) return res.status(503).json({ error: 'Admin API requiere SUPABASE_SERVICE_ROLE_KEY en backend' });
      const { email, password, role = 'editor', active = true } = req.body || {};
      if (!email || !password) return res.status(400).json({ error: 'Email y password requeridos' });
      const { data: created, error: createErr } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
      if (createErr) return res.status(400).json({ error: createErr.message });
      const userId = created.user?.id;
      const { error: profErr } = await supabase.from('profiles').insert([{ user_id: userId, email, role, active }]);
      if (profErr) return res.status(400).json({ error: profErr.message });
      return res.status(200).json(created);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).end('Method Not Allowed');
  }
}

