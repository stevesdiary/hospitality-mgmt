import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, MapPin, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const HOTELS = [
  { id: '1', name: 'Eko Hotel & Suites', city: 'Lagos', category: 'Luxury', rooms: 24, rating: 4.8, status: 'active', grad: 'from-indigo-500 to-purple-700' },
  { id: '2', name: 'Transcorp Hilton Abuja', city: 'Abuja', category: 'Luxury', rooms: 32, rating: 4.9, status: 'active', grad: 'from-cyan-500 to-blue-700' },
  { id: '3', name: 'Hotel Presidential', city: 'Port Harcourt', category: 'Standard', rooms: 18, rating: 4.6, status: 'active', grad: 'from-emerald-500 to-teal-700' },
  { id: '4', name: 'Hamdala Hotel', city: 'Kano', category: 'Budget', rooms: 12, rating: 4.4, status: 'inactive', grad: 'from-amber-500 to-orange-700' },
  { id: '5', name: 'Wheatbaker Hotel', city: 'Lagos', category: 'Boutique', rooms: 15, rating: 4.7, status: 'active', grad: 'from-rose-500 to-pink-700' },
];

interface HotelForm { name: string; city: string; category: string; }

const CATEGORIES = ['Luxury', 'Standard', 'Budget', 'Boutique'];

const ManageHotelsPage: React.FC = () => {
  const [hotels, setHotels] = useState(HOTELS);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<typeof HOTELS[0] | null>(null);
  const [form, setForm] = useState<HotelForm>({ name: '', city: '', category: 'Luxury' });

  const filtered = hotels.filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase()) || h.city.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setEditing(null); setForm({ name: '', city: '', category: 'Luxury' }); setShowModal(true); };
  const openEdit = (h: typeof HOTELS[0]) => { setEditing(h); setForm({ name: h.name, city: h.city, category: h.category }); setShowModal(true); };

  const handleSave = () => {
    if (!form.name.trim() || !form.city.trim()) { toast.error('Name and city are required.'); return; }
    if (editing) {
      setHotels((p) => p.map((h) => h.id === editing.id ? { ...h, ...form } : h));
      toast.success('Hotel updated!');
    } else {
      const newHotel = { id: String(Date.now()), ...form, rooms: 0, rating: 0, status: 'active' as const, grad: 'from-gray-400 to-gray-600' };
      setHotels((p) => [newHotel, ...p]);
      toast.success('Hotel added!');
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setHotels((p) => p.filter((h) => h.id !== id));
    toast.success('Hotel removed.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Admin</p>
            <h1 className="font-display text-2xl font-bold text-gray-900">Manage Hotels</h1>
          </div>
          <button onClick={openNew} className="btn-accent flex items-center gap-2 self-start sm:self-auto">
            <Plus className="h-4 w-4" /> Add Hotel
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input type="text" placeholder="Search hotels…" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9 text-sm py-2" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Hotel', 'City', 'Category', 'Rooms', 'Rating', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((hotel) => (
                  <motion.tr key={hotel.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${hotel.grad} flex-shrink-0`} />
                        <span className="font-medium text-gray-900 whitespace-nowrap">{hotel.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{hotel.city}</span>
                    </td>
                    <td className="px-5 py-4"><span className="badge badge-primary text-xs">{hotel.category}</span></td>
                    <td className="px-5 py-4 text-gray-700">{hotel.rooms}</td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1 text-amber-600 font-medium"><Star className="h-3.5 w-3.5 fill-amber-400" />{hotel.rating}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge text-xs ${hotel.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {hotel.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(hotel)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(hotel.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400 text-sm">No hotels found</div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-gray-900 text-lg">{editing ? 'Edit Hotel' : 'Add New Hotel'}</h3>
                <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Hotel Name</label>
                  <input type="text" placeholder="e.g. Eko Hotel & Suites" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                  <input type="text" placeholder="e.g. Lagos" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="input-field">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleSave} className="btn-accent flex-1">{editing ? 'Save Changes' : 'Add Hotel'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageHotelsPage;
