const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

router.get('/health', async (req, res) => {
  try {
    if (!supabase) return res.status(503).json({ error: 'Supabase no configurado en backend' });
    const hasServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    const { error } = await supabase.from('products').select('*', { count: 'exact', head: true });
    if (error) return res.status(503).json({ error: `Supabase indisponible: ${error.message}` });
    return res.json({ ok: true, service_role: hasServiceRole });
  } catch (err) {
    return res.status(503).json({ error: `Supabase health error: ${err.message}` });
  }
});

router.get('/', async (req, res) => {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(503).json({ error: 'Admin API requiere SUPABASE_SERVICE_ROLE_KEY en backend' });
    }
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(503).json({ error: 'Admin API requiere SUPABASE_SERVICE_ROLE_KEY en backend' });
    }
    const { email, password, role = 'editor', active = true } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });
    const { data: createdUser, error: adminErr } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
    if (adminErr) return res.status(400).json({ error: adminErr.message });
    const userId = createdUser.user?.id;
    if (!userId) return res.status(400).json({ error: 'No se obtuvo ID de usuario' });
    const { data: profile, error: profErr } = await supabase.from('profiles').insert({ user_id: userId, email, role, active }).select().single();
    if (profErr) return res.status(400).json({ error: profErr.message });
    res.status(201).json({ user: createdUser.user, profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(503).json({ error: 'Admin API requiere SUPABASE_SERVICE_ROLE_KEY en backend' });
    }
    const { id } = req.params;
    const { role, active } = req.body || {};
    const update = {};
    if (role) update.role = role;
    if (typeof active === 'boolean') update.active = active;
    const { data, error } = await supabase.from('profiles').update(update).eq('user_id', id).select().single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(503).json({ error: 'Admin API requiere SUPABASE_SERVICE_ROLE_KEY en backend' });
    }
    const { id } = req.params;
    const { error: delErr } = await supabase.auth.admin.deleteUser(id);
    if (delErr) return res.status(400).json({ error: delErr.message });
    const { error: profErr } = await supabase.from('profiles').delete().eq('user_id', id);
    if (profErr) return res.status(400).json({ error: profErr.message });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

