import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, LogIn, LogOut, Trash2, Loader2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { reservationService } from '../../services';

interface ReservationRow {
  id: string;
  ref: string;
  guest: string;
  email: string;
  hotel: string;
  room: string;
  checkIn: string;
  checkOut: string;
  total: number;
  status: string;
}

const STATUS_TABS = ['All', 'Pending', 'Confirmed', 'Checked-in', 'Checked-out', 'Cancelled'];
const statusStyle: Record<string, string> = {
  confirmed: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  'checked-in': 'bg-blue-100 text-blue-700',
  'checked-out': 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-600',
  'no-show': 'bg-red-100 text-red-600',
};

const dateOnly = (d?: string) => (d ? String(d).slice(0, 10) : '—');

const toRow = (r: any): ReservationRow => {
  const nights = r.dateIn && r.dateOut
    ? Math.max(1, Math.round((new Date(r.dateOut).getTime() - new Date(r.dateIn).getTime()) / 86400000))
    : 1;
  const price = r.Room?.price ?? 0;
  const guestName = r.User ? `${r.User.firstName ?? ''} ${r.User.lastName ?? ''}`.trim() : r.guestName;
  return {
    id: r.id,
    ref: r.bookingReference ?? `#${String(r.id).slice(0, 8)}`,
    guest: guestName || 'Guest',
    email: r.User?.email ?? r.guestEmail ?? '—',
    hotel: r.Hotel?.name ?? '—',
    room: r.Room?.category ?? r.Room?.type ?? '—',
    checkIn: dateOnly(r.dateIn),
    checkOut: dateOnly(r.dateOut),
    total: price * nights,
    status: r.status ?? 'pending',
  };
};

const ManageReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<ReservationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('All');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await reservationService.getAllReservations();
      const list = res?.Reservations ?? res?.reservations ?? res?.data ?? [];
      setReservations(list.map(toRow));
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to load reservations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = reservations.filter((r) => {
    const matchTab = tab === 'All' || r.status === tab.toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = r.guest.toLowerCase().includes(q) || r.hotel.toLowerCase().includes(q) || r.ref.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const doCheckIn = async (id: string) => {
    try { await reservationService.checkIn(id); toast.success('Guest checked in'); await load(); }
    catch (err: any) { toast.error(err?.response?.data?.message ?? 'Check-in failed'); }
  };
  const doCheckOut = async (id: string) => {
    try { await reservationService.checkOut(id); toast.success('Guest checked out'); await load(); }
    catch (err: any) { toast.error(err?.response?.data?.message ?? 'Check-out failed'); }
  };
  const doDelete = async (id: string) => {
    try { await reservationService.deleteReservation(id); setReservations((p) => p.filter((r) => r.id !== id)); toast.success('Reservation deleted'); }
    catch (err: any) { toast.error(err?.response?.data?.message ?? 'Delete failed'); }
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
              <input type="text" placeholder="Search guest, hotel or ref…" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9 text-sm py-2" />
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
                  {['Ref', 'Guest', 'Hotel / Room', 'Dates', 'Total', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((r) => (
                  <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-500 whitespace-nowrap">{r.ref}</td>
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
                    <td className="px-5 py-4 font-semibold text-primary-700 whitespace-nowrap">{r.total ? `₦${r.total.toLocaleString()}` : '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`badge text-xs ${statusStyle[r.status] ?? 'bg-gray-100 text-gray-600'}`}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="relative group">
                        <button className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-primary-600 bg-gray-100 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-all">
                          Actions <ChevronDown className="h-3 w-3" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 hidden group-hover:block z-10">
                          {r.status !== 'checked-in' && r.status !== 'checked-out' && r.status !== 'cancelled' && (
                            <button onClick={() => doCheckIn(r.id)} className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 flex items-center gap-2 transition-colors">
                              <LogIn className="h-3.5 w-3.5 text-blue-500" /> Check in
                            </button>
                          )}
                          {r.status === 'checked-in' && (
                            <button onClick={() => doCheckOut(r.id)} className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 flex items-center gap-2 transition-colors">
                              <LogOut className="h-3.5 w-3.5 text-gray-500" /> Check out
                            </button>
                          )}
                          <button onClick={() => doDelete(r.id)} className="w-full text-left px-4 py-2 text-xs hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors">
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {loading && <div className="flex items-center justify-center py-16 text-gray-400"><Loader2 className="h-6 w-6 animate-spin" /></div>}
            {!loading && filtered.length === 0 && <div className="text-center py-16 text-gray-400 text-sm">No reservations found</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageReservationsPage;
