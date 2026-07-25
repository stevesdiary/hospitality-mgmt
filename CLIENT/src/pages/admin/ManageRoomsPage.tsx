import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, BedDouble, Users, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { roomService, hotelService } from '../../services';

interface RoomRow {
  id: string;
  hotel: string;
  category: string;
  capacity: number;
  price: number;
  condition: string;
}

// Room categories accepted by the backend (models/room category ENUM).
const CATEGORIES = ['regular', 'luxury', 'conference', 'event hall', 'studio apartment'];
const GRADS = ['from-slate-400 to-slate-600', 'from-blue-400 to-indigo-600', 'from-violet-400 to-purple-600', 'from-amber-400 to-orange-600', 'from-rose-400 to-pink-600'];

interface RoomForm { contactEmail: string; category: string; capacity: string; price: string; }
const emptyForm: RoomForm = { contactEmail: '', category: 'regular', capacity: '2', price: '' };

const ManageRoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<RoomRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<RoomRow | null>(null);
  const [form, setForm] = useState<RoomForm>(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [roomsRes, hotelsRes]: any[] = await Promise.all([
        roomService.getAllRooms(),
        hotelService.getAllHotels().catch(() => ({})),
      ]);
      const hotelList = hotelsRes?.Hotels ?? hotelsRes?.hotels ?? [];
      const nameById = new Map<string, string>(hotelList.map((h: any) => [h.id, h.name]));
      const list = roomsRes?.Rooms ?? roomsRes?.rooms ?? roomsRes?.data ?? [];
      setRooms(list.map((r: any): RoomRow => ({
        id: r.id,
        hotel: nameById.get(r.hotelId) ?? '—',
        category: r.category ?? '—',
        capacity: r.capacity ?? 0,
        price: r.price ?? 0,
        condition: r.condition ?? '—',
      })));
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to load rooms.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = rooms.filter((r) =>
    r.hotel.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (r: RoomRow) => { setEditing(r); setForm({ contactEmail: '', category: r.category, capacity: String(r.capacity), price: String(r.price) }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.price) { toast.error('Price is required.'); return; }
    if (!editing && !form.contactEmail.trim()) { toast.error("The hotel's contact email is required to add a room."); return; }
    setSaving(true);
    try {
      if (editing) {
        await roomService.updateRoom(editing.id, {
          category: form.category as any,
          capacity: Number(form.capacity),
          price: Number(form.price),
        } as any);
        toast.success('Room updated!');
      } else {
        await roomService.createRoom({
          contactEmail: form.contactEmail,
          category: form.category,
          capacity: Number(form.capacity),
          price: Number(form.price),
        } as any);
        toast.success('Room added!');
      }
      setShowModal(false);
      await load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to save room.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await roomService.deleteRoom(id);
      setRooms((p) => p.filter((r) => r.id !== id));
      toast.success('Room removed.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to remove room.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Admin</p>
            <h1 className="font-display text-2xl font-bold text-gray-900">Manage Rooms</h1>
          </div>
          <button onClick={openNew} className="btn-accent flex items-center gap-2 self-start sm:self-auto">
            <Plus className="h-4 w-4" /> Add Room
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input type="text" placeholder="Search rooms…" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9 text-sm py-2" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Room', 'Hotel', 'Capacity', 'Price/Night', 'Condition', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((room, i) => (
                  <motion.tr key={room.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${GRADS[i % GRADS.length]} flex-shrink-0`} />
                        <div>
                          <span className="font-medium text-gray-900 whitespace-nowrap block capitalize">{room.category}</span>
                          <span className="text-xs text-gray-400 flex items-center gap-1"><BedDouble className="h-3 w-3" />Room</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{room.hotel}</td>
                    <td className="px-5 py-4 text-gray-700">
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-gray-400" />{room.capacity}</span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-primary-700">₦{room.price.toLocaleString()}</td>
                    <td className="px-5 py-4"><span className="badge text-xs bg-gray-100 text-gray-600 capitalize">{room.condition}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(room)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(room.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {loading && <div className="flex items-center justify-center py-16 text-gray-400"><Loader2 className="h-6 w-6 animate-spin" /></div>}
            {!loading && filtered.length === 0 && <div className="text-center py-16 text-gray-400 text-sm">No rooms found</div>}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-gray-900 text-lg">{editing ? 'Edit Room' : 'Add New Room'}</h3>
                <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                {!editing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Hotel contact email</label>
                    <input type="email" placeholder="reservations@hotel.com" value={form.contactEmail} onChange={(e) => setForm((p) => ({ ...p, contactEmail: e.target.value }))} className="input-field" />
                    <p className="text-xs text-gray-400 mt-1">The room is added to the hotel with this contact email.</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Room Category</label>
                  <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="input-field capitalize">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Capacity</label>
                    <select value={form.capacity} onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value }))} className="input-field">
                      {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Price / Night (₦)</label>
                    <input type="number" placeholder="e.g. 45000" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} className="input-field" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-accent flex-1 disabled:opacity-60">
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Room'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageRoomsPage;
