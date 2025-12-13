import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { getUser, signOut } from '@/services/auth';
import { adminUsersAPI } from '@/services/adminUsers';

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ email: '', password: '', role: 'editor', active: true });
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const u = await getUser();
      setUser(u);
      try {
        const list = await adminUsersAPI.list();
        setUsers(list);
      } catch (err) {
        toast({ title: 'No se pudo cargar usuarios', description: err.message, variant: 'destructive' });
      }
    })();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({ title: 'Sesión cerrada' });
      navigate('/login');
    } catch (err) {
      toast({ title: 'No se pudo cerrar sesión', description: err.message, variant: 'destructive' });
    }
  };

  const handleCreate = async () => {
    try {
      if (!form.email || !form.password) throw new Error('Ingresa email y contraseña');
      const created = await adminUsersAPI.create(form.email, form.password, form.role, !!form.active);
      toast({ title: 'Usuario creado' });
      setUsers([created.profile, ...users]);
      setForm({ email: '', password: '', role: 'editor', active: true });
    } catch (err) {
      toast({ title: 'Error al crear usuario', description: err.message, variant: 'destructive' });
    }
  };

  const handleToggleActive = async (u) => {
    try {
      const updated = await adminUsersAPI.update(u.user_id, { active: !u.active });
      setUsers(users.map(x => x.user_id === u.user_id ? updated : x));
    } catch (err) {
      toast({ title: 'Error al actualizar', description: err.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (u) => {
    try {
      await adminUsersAPI.remove(u.user_id);
      setUsers(users.filter(x => x.user_id !== u.user_id));
      toast({ title: 'Usuario eliminado' });
    } catch (err) {
      toast({ title: 'Error al eliminar', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen gradient-bg-main relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl floating-animation" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-black/20 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-black">Panel de Administración</h1>
          <Button onClick={handleSignOut} className="bg-black/80 hover:bg-black text-white">Cerrar sesión</Button>
        </div>
        <div className="space-y-4">
          <div className="glass-effect rounded-3xl p-6 md:p-8 shadow-2xl">
            <p className="text-sm text-black/80">Usuario</p>
            <p className="font-medium text-black">{user?.email ?? 'Cargando...'}</p>
          </div>
          <div className="glass-effect rounded-3xl p-6 md:p-8 shadow-2xl">
            <p className="text-lg font-semibold mb-4 text-black">Administrar usuarios</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
              <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-white border border-gray-300 text-black placeholder:text-gray-500" />
              <Input type="password" placeholder="Contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="bg-white border border-gray-300 text-black placeholder:text-gray-500" />
              <select className="bg-white border border-gray-300 text-black rounded px-2 py-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="admin">admin</option>
                <option value="editor">editor</option>
                <option value="viewer">viewer</option>
              </select>
              <Button onClick={handleCreate} className="bg-black/80 hover:bg-black text-white">Crear</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-black">
                <thead>
                  <tr className="text-left">
                    <th className="p-2">Email</th>
                    <th className="p-2">Rol</th>
                    <th className="p-2">Activo</th>
                    <th className="p-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.user_id} className="border-t border-gray-200">
                      <td className="p-2">{u.email}</td>
                      <td className="p-2">
                        <select className="bg-white border border-gray-300 text-black rounded px-2 py-1" value={u.role} onChange={async (e) => {
                          try {
                            const updated = await adminUsersAPI.update(u.user_id, { role: e.target.value });
                            setUsers(users.map(x => x.user_id === u.user_id ? updated : x));
                          } catch (err) {
                            toast({ title: 'Error al cambiar rol', description: err.message, variant: 'destructive' });
                          }
                        }}>
                          <option value="admin">admin</option>
                          <option value="editor">editor</option>
                          <option value="viewer">viewer</option>
                        </select>
                      </td>
                      <td className="p-2">{u.active ? 'Sí' : 'No'}</td>
                      <td className="p-2 space-x-2">
                        <Button onClick={() => handleToggleActive(u)} className="bg-black/80 hover:bg-black text-white">
                          {u.active ? 'Desactivar' : 'Activar'}
                        </Button>
                        <Button onClick={() => handleDelete(u)} className="bg-black/80 hover:bg-black text-white">Eliminar</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button onClick={() => navigate('/stock')} className="bg-black/80 hover:bg-black text-white">Inventario</Button>
            <Button onClick={() => navigate('/promo')} className="bg-black/80 hover:bg-black text-white">Promociones</Button>
            <Button onClick={() => navigate('/sales')} className="bg-black/80 hover:bg-black text-white">Ventas</Button>
            <Button onClick={() => navigate('/report')} className="bg-black/80 hover:bg-black text-white">Reportes</Button>
            <Button onClick={() => navigate('/dashboard')} className="bg-black/80 hover:bg-black text-white">Dashboard</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
