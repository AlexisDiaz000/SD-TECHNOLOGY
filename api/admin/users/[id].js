import { supabase, isServiceRole } from '../../_lib/supabaseClient.js';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'ID requerido' });

  if (req.method === 'PATCH') {
    try {
      if (!isServiceRole) return res.status(503).json({ error: 'Admin API requiere SUPABASE_SERVICE_ROLE_KEY en backend' });
      const payload = req.body || {};
      const { data, error } = await supabase.from('profiles').update(payload).eq('user_id', id).select().single();
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      if (!isServiceRole) return res.status(503).json({ error: 'Admin API requiere SUPABASE_SERVICE_ROLE_KEY en backend' });
      const { error: delErr } = await supabase.auth.admin.deleteUser(id);
      if (delErr) return res.status(400).json({ error: delErr.message });
      const { error: profErr } = await supabase.from('profiles').delete().eq('user_id', id);
      if (profErr) return res.status(400).json({ error: profErr.message });
      return res.status(200).json({ ok: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'PATCH, DELETE');
    return res.status(405).end('Method Not Allowed');
  }
}

