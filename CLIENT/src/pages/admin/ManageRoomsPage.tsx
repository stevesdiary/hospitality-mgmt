import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, BedDouble, Users, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { roomService, hotelService } from '@/services';
import { transformRoom, transformHotel, transformPaginatedResponse } from '@/utils/apiTransformers';
import type { Room, Hotel } from '@/types';

const ROOM_GRADS = [
  'from-slate-400 to-slate-600', 'from-blue-400 to-indigo-600', 'from-violet-400 to-purple-600',
  'from-amber-400 to-orange-600', 'from-cyan-400 to-blue-600', 'from-teal-400 to-emerald-600',
];
const getGrad = (index: number) => ROOM_GRADS[index % ROOM_GRADS.length];

// Room categories accepted by the backend (models/room category ENUM).
const CATEGORIES = ['regular', 'luxury', 'conference', 'event hall', 'studio apartment'];
const GRADS = ['from-slate-400 to-slate-600', 'from-blue-400 to-indigo-600', 'from-violet-400 to-purple-600', 'from-amber-400 to-orange-600', 'from-rose-400 to-pink-600'];

interface RoomForm { hotelId: string; category: string; capacity: string; price: string; description: string; }

const ManageRoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<(Room & { grad: string; hotelName: string })[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<RoomForm>({ hotelId: '', category: 'standard', capacity: '2', price: '', description: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomsRes, hotelsRes] = await Promise.all([
        roomService.getAllRooms({ limit: 100 }),
        hotelService.getAllHotels({ limit: 100 }),
      ]);
      const hotelsData = transformPaginatedResponse((hotelsRes as any), 'Hotels', transformHotel);
      setHotels(hotelsData.items);

      const roomsData = transformPaginatedResponse((roomsRes as any), 'Rooms', transformRoom);
      setRooms(roomsData.items.map((r, i) => ({
        ...r,
        grad: getGrad(i),
        hotelName: hotelsData.items.find(h => h.id === r.hotelId)?.name || 'Unknown Hotel',
      })));
    } catch (err: any) {
      toast.error(err.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = rooms.filter((r) =>
    r.hotelName.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setEditing(null); setForm({ hotelId: hotels[0]?.id || '', category: 'standard', capacity: '2', price: '', description: '' }); setShowModal(true); };
  const openEdit = (r: Room & { hotelName: string }) => { setEditing(r); setForm({ hotelId: r.hotelId, category: r.category, capacity: String(r.maxOccupancy), price: String(r.pricePerNight), description: r.description }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.hotelId || !form.price) { toast.error('Hotel and price are required.'); return; }
    try {
      setSaving(true);
      const payload = { hotelId: form.hotelId, category: form.category, capacity: Number(form.capacity), price: Number(form.price), description: form.description, availability: true, condition: 'good' };
      if (editing) {
        await roomService.updateRoom(editing.id, payload as any);
        toast.success('Room updated!');
      } else {
        await roomService.createRoom(payload as any);
        toast.success('Room added!');
      }
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save room');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    try {
      await roomService.deleteRoom(id);
      toast.success('Room removed.');
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete room');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

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
                          <span className="font-medium text-gray-900 whitespace-nowrap block">{room.category}</span>
                          <span className="text-xs text-gray-400 flex items-center gap-1"><BedDouble className="h-3 w-3" />{room.bedType}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{room.hotelName}</td>
                    <td className="px-5 py-4 text-gray-700">
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-gray-400" />{room.maxOccupancy}</span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-primary-700">₦{room.pricePerNight.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`badge text-xs ${room.available ? statusStyle.available : statusStyle.occupied}`}>
                        {room.available ? 'available' : 'occupied'}
                      </span>
                    </td>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Hotel</label>
                  <select value={form.hotelId} onChange={(e) => setForm((p) => ({ ...p, hotelId: e.target.value }))} className="input-field">
                    {hotels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Room Category</label>
                  <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="input-field">
                    {['standard', 'deluxe', 'suite', 'presidential'].map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea placeholder="Room description..." value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="input-field" rows={2} />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-accent flex-1 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editing ? 'Save Changes' : 'Add Room'}
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
