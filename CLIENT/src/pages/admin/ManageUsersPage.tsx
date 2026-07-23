import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Edit2, Trash2, X, Shield, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { userService } from '../../services';

interface UserRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userType: string;
  joined: string;
}

const typeStyle: Record<string, string> = {
  admin: 'bg-violet-100 text-violet-700',
  org_admin: 'bg-blue-100 text-blue-700',
  guest: 'bg-gray-100 text-gray-600',
  regular: 'bg-gray-100 text-gray-600',
  premium: 'bg-amber-100 text-amber-700',
};

interface EditForm { firstName: string; lastName: string; phone: string; }

const ManageUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [form, setForm] = useState<EditForm>({ firstName: '', lastName: '', phone: '' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await userService.getAllUsers();
      const list = res?.Users ?? res?.users ?? res?.data ?? [];
      setUsers(list.map((u: any): UserRow => ({
        id: u.id,
        firstName: u.firstName ?? '',
        lastName: u.lastName ?? '',
        email: u.email ?? '—',
        phone: u.phoneNumber != null ? String(u.phoneNumber) : '—',
        userType: u.type ?? u.userType ?? 'regular',
        joined: u.createdAt ? String(u.createdAt).slice(0, 10) : '—',
      })));
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = users.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (u: UserRow) => { setEditUser(u); setForm({ firstName: u.firstName, lastName: u.lastName, phone: u.phone === '—' ? '' : u.phone }); };

  const handleSave = async () => {
    if (!editUser) return;
    setSaving(true);
    try {
      await userService.updateUser(editUser.id, {
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phone,
      } as any);
      toast.success('User updated!');
      setEditUser(null);
      await load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to update user.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await userService.deleteUser(id);
      setUsers((p) => p.filter((u) => u.id !== id));
      toast.success('User removed.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to remove user.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-xs text-gray-400 mb-1">Admin</p>
          <h1 className="font-display text-2xl font-bold text-gray-900 mb-5">Manage Users</h1>
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input type="text" placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9 text-sm py-2" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['User', 'Email', 'Phone', 'Role', 'Joined', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((user) => (
                  <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {(user.firstName[0] ?? '').toUpperCase()}{(user.lastName[0] ?? '').toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900 whitespace-nowrap">{user.firstName} {user.lastName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{user.email}</td>
                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{user.phone}</td>
                    <td className="px-5 py-4">
                      <span className={`badge text-xs ${typeStyle[user.userType] ?? 'bg-gray-100 text-gray-600'}`}>
                        {(user.userType === 'admin' || user.userType === 'org_admin') && <Shield className="h-3 w-3 inline mr-1" />}
                        {user.userType}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">{user.joined}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEdit(user)} title="Edit" className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {loading && <div className="flex items-center justify-center py-16 text-gray-400"><Loader2 className="h-6 w-6 animate-spin" /></div>}
            {!loading && filtered.length === 0 && <div className="text-center py-16 text-gray-400 text-sm">No users found</div>}
          </div>
        </div>
      </div>

      {/* Edit modal — role changes go through a controlled flow, not here. */}
      <AnimatePresence>
        {editUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-gray-900">Edit User</h3>
                <button onClick={() => setEditUser(null)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">First name</label>
                    <input value={form.firstName} onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Last name</label>
                    <input value={form.lastName} onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                  <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="input-field" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setEditUser(null)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-accent flex-1 disabled:opacity-60">{saving ? 'Saving…' : 'Save Changes'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageUsersPage;
