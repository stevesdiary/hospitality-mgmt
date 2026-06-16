import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, X, Clock, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { DUMMY_RESERVATIONS, DUMMY_HOTELS, DUMMY_ROOMS, DUMMY_USERS } from '@/data/dummy';

const INIT_RESERVATIONS = DUMMY_RESERVATIONS.map((r) => ({
  id: r.id,
  guest: r.guestName, email: r.guestEmail,
  hotel: DUMMY_HOTELS.find((h) => h.id === r.hotelId)?.name ?? '',
  room: DUMMY_ROOMS.find((rm) => rm.id === r.roomId)?.category ?? '',
  checkIn: r.checkInDate, checkOut: r.checkOutDate,
  total: r.totalPrice,
  status: r.status === 'checked-out' ? 'completed' : r.status,
}));

const STATUS_TABS = ['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'];
const statusStyle: Record<string, string> = { confirmed: 'bg-emerald-100 text-emerald-700', pending: 'bg-amber-100 text-amber-700', completed: 'bg-blue-100 text-blue-700', cancelled: 'bg-red-100 text-red-600' };

const ManageReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState(INIT_RESERVATIONS);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('All');

  const filtered = reservations.filter((r) => {
    const matchTab = tab === 'All' || r.status === tab.toLowerCase();
    const matchSearch = r.guest.toLowerCase().includes(search.toLowerCase()) || r.hotel.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const updateStatus = (id: string, status: string) => {
    setReservations((p) => p.map((r) => r.id === id ? { ...r, status } : r));
    toast.success(`Reservation ${status}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-xs text-gray-400 mb-1">Admin</p>
          <h1 className="font-display text-2xl font-bold text-gray-900 mb-5">Manage Reservations</h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input type="text" placeholder="Search guest, hotel or ID…" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9 text-sm py-2" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {STATUS_TABS.map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['ID', 'Guest', 'Hotel / Room', 'Dates', 'Total', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((r) => (
                  <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-500">#{r.id}</td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900 whitespace-nowrap">{r.guest}</div>
                      <div className="text-xs text-gray-400">{r.email}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-700 whitespace-nowrap">{r.hotel}</div>
                      <div className="text-xs text-gray-400">{r.room}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                      <div>{r.checkIn}</div>
                      <div className="text-xs">→ {r.checkOut}</div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-primary-700 whitespace-nowrap">₦{r.total.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`badge text-xs ${statusStyle[r.status]}`}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="relative group">
                        <button className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-primary-600 bg-gray-100 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-all">
                          Update <ChevronDown className="h-3 w-3" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 hidden group-hover:block z-10">
                          {['confirmed', 'completed', 'cancelled'].filter((s) => s !== r.status).map((s) => (
                            <button key={s} onClick={() => updateStatus(r.id, s)}
                              className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 flex items-center gap-2 transition-colors capitalize">
                              {s === 'confirmed' && <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />}
                              {s === 'completed' && <Clock className="h-3.5 w-3.5 text-blue-500" />}
                              {s === 'cancelled' && <X className="h-3.5 w-3.5 text-red-500" />}
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="text-center py-16 text-gray-400 text-sm">No reservations found</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageReservationsPage;
