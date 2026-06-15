import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Edit2, Trash2, X, UserCheck, UserX, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const USERS = [
  { id: 'u1', firstName: 'Amaka', lastName: 'Nwosu', email: 'amaka@email.com', phone: '08012345678', userType: 'guest', status: 'active', joined: '2026-01-15', bookings: 4 },
  { id: 'u2', firstName: 'Tunde', lastName: 'Adeyemi', email: 'tunde@email.com', phone: '08023456789', userType: 'guest', status: 'active', joined: '2026-02-10', bookings: 7 },
  { id: 'u3', firstName: 'Chioma', lastName: 'Okafor', email: 'chioma@email.com', phone: '07034567890', userType: 'admin', status: 'active', joined: '2025-11-05', bookings: 1 },
  { id: 'u4', firstName: 'Emeka', lastName: 'Eze', email: 'emeka@email.com', phone: '09045678901', userType: 'guest', status: 'suspended', joined: '2026-03-01', bookings: 2 },
  { id: 'u5', firstName: 'Fatima', lastName: 'Bello', email: 'fatima@email.com', phone: '08156789012', userType: 'guest', status: 'active', joined: '2026-03-18', bookings: 3 },
];

const typeStyle: Record<string, string> = { admin: 'bg-violet-100 text-violet-700', guest: 'bg-gray-100 text-gray-600', org_admin: 'bg-blue-100 text-blue-700' };
const statusStyle: Record<string, string> = { active: 'bg-emerald-100 text-emerald-700', suspended: 'bg-red-100 text-red-600' };

const ManageUsersPage: React.FC = () => {
  const [users, setUsers] = useState(USERS);
  const [search, setSearch] = useState('');
  const [editUser, setEditUser] = useState<typeof USERS[0] | null>(null);

  const filtered = users.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setUsers((p) => p.map((u) => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
    const user = users.find((u) => u.id === id);
    toast.success(`User ${user?.status === 'active' ? 'suspended' : 'activated'}`);
  };

  const handleDelete = (id: string) => { setUsers((p) => p.filter((u) => u.id !== id)); toast.success('User removed.'); };

  const handleSaveRole = (role: string) => {
    if (!editUser) return;
    setUsers((p) => p.map((u) => u.id === editUser.id ? { ...u, userType: role } : u));
    toast.success('Role updated!');
    setEditUser(null);
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
                  {['User', 'Email', 'Phone', 'Role', 'Bookings', 'Status', 'Joined', 'Actions'].map((h) => (
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
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <span className="font-medium text-gray-900 whitespace-nowrap">{user.firstName} {user.lastName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{user.email}</td>
                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{user.phone}</td>
                    <td className="px-5 py-4">
                      <span className={`badge text-xs ${typeStyle[user.userType] ?? 'bg-gray-100 text-gray-600'}`}>
                        {user.userType === 'admin' && <Shield className="h-3 w-3 inline mr-1" />}
                        {user.userType}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-700 text-center">{user.bookings}</td>
                    <td className="px-5 py-4">
                      <span className={`badge text-xs ${statusStyle[user.status]}`}>{user.status}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">{user.joined}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setEditUser(user)} title="Change role" className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => toggleStatus(user.id)} title={user.status === 'active' ? 'Suspend' : 'Activate'} className={`p-1.5 rounded-lg transition-all ${user.status === 'active' ? 'text-gray-400 hover:text-amber-600 hover:bg-amber-50' : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'}`}>
                          {user.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
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
            {filtered.length === 0 && <div className="text-center py-16 text-gray-400 text-sm">No users found</div>}
          </div>
        </div>
      </div>

      {/* Role edit modal */}
      <AnimatePresence>
        {editUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-gray-900">Change Role</h3>
                <button onClick={() => setEditUser(null)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-5">Changing role for <span className="font-semibold text-gray-900">{editUser.firstName} {editUser.lastName}</span></p>
              <div className="space-y-2">
                {['guest', 'admin', 'org_admin'].map((role) => (
                  <button key={role} onClick={() => handleSaveRole(role)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${editUser.userType === role ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50'}`}>
                    <span className="flex items-center gap-2">
                      {role === 'admin' && <Shield className="h-4 w-4 text-violet-500" />}
                      {role} {editUser.userType === role && '(current)'}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageUsersPage;
