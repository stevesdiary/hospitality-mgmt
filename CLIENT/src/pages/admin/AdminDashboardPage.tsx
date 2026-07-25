import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, BedDouble, CalendarCheck, Users, ArrowRight, CheckCircle, Clock, X, LogIn, LogOut, Loader2 } from 'lucide-react';
import { hotelService, roomService, reservationService, userService } from '../../services';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const QUICK_LINKS = [
  { to: '/admin/hotels', label: 'Manage Hotels', icon: Building2, desc: 'Add, edit or remove hotels', grad: 'from-blue-500 to-indigo-600' },
  { to: '/admin/rooms', label: 'Manage Rooms', icon: BedDouble, desc: 'Configure room types and pricing', grad: 'from-violet-500 to-purple-600' },
  { to: '/admin/reservations', label: 'Reservations', icon: CalendarCheck, desc: 'Review and process bookings', grad: 'from-emerald-500 to-teal-600' },
  { to: '/admin/users', label: 'Manage Users', icon: Users, desc: 'View and manage user accounts', grad: 'from-orange-400 to-red-500' },
];

const statusIcon: Record<string, React.ElementType> = {
  confirmed: CheckCircle, pending: Clock, 'checked-in': LogIn, 'checked-out': LogOut, cancelled: X, 'no-show': X,
};
const statusStyle: Record<string, string> = {
  confirmed: 'bg-emerald-100 text-emerald-700', pending: 'bg-amber-100 text-amber-700',
  'checked-in': 'bg-blue-100 text-blue-700', 'checked-out': 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-600', 'no-show': 'bg-red-100 text-red-600',
};

interface RecentRow { id: string; guest: string; hotel: string; checkIn: string; status: string; }

const AdminDashboardPage: React.FC = () => {
  const [counts, setCounts] = useState<{ hotels: number | null; rooms: number | null; reservations: number | null; users: number | null }>(
    { hotels: null, rooms: null, reservations: null, users: null }
  );
  const [recent, setRecent] = useState<RecentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      // Fetch independently so one failing endpoint doesn't blank the whole board.
      const [hotels, rooms, reservations, users] = await Promise.all([
        hotelService.getAllHotels().catch(() => null),
        roomService.getAllRooms().catch(() => null),
        reservationService.getAllReservations().catch(() => null),
        userService.getAllUsers().catch(() => null),
      ]) as any[];
      if (!active) return;
      setCounts({
        hotels: hotels?.Count ?? null,
        rooms: rooms?.Count ?? null,
        reservations: reservations?.Count ?? null,
        users: users?.Count ?? null,
      });
      const list = reservations?.Reservations ?? [];
      setRecent(list.slice(0, 5).map((r: any): RecentRow => ({
        id: r.bookingReference ?? `#${String(r.id).slice(0, 8)}`,
        guest: r.User ? `${r.User.firstName ?? ''} ${r.User.lastName ?? ''}`.trim() : (r.guestName || 'Guest'),
        hotel: r.Hotel?.name ?? '—',
        checkIn: r.dateIn ? String(r.dateIn).slice(0, 10) : '—',
        status: r.status ?? 'pending',
      })));
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const fmt = (n: number | null) => (n == null ? '—' : n.toLocaleString());

  const STATS = [
    { label: 'Total Hotels', value: fmt(counts.hotels), icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Rooms', value: fmt(counts.rooms), icon: BedDouble, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Reservations', value: fmt(counts.reservations), icon: CalendarCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Registered Users', value: fmt(counts.users), icon: Users, color: 'text-accent-600', bg: 'bg-accent-50' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm text-primary-600 font-semibold mb-1">Admin Panel</p>
            <h1 className="font-display text-3xl font-bold text-gray-900">Dashboard</h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(({ label, value, icon: Icon, bg, color }) => (
            <motion.div key={label} variants={fadeUp} whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${bg}`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
              </div>
              <div className="text-2xl font-display font-bold text-gray-900">{value}</div>
              <div className="text-gray-500 text-sm mt-1">{label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                <h2 className="font-display font-semibold text-gray-900">Recent Reservations</h2>
                <Link to="/admin/reservations" className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1 transition-colors">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {loading && (
                  <div className="flex items-center justify-center py-12 text-gray-400"><Loader2 className="h-6 w-6 animate-spin" /></div>
                )}
                {!loading && recent.length === 0 && (
                  <div className="text-center py-12 text-gray-400 text-sm">No reservations yet</div>
                )}
                {recent.map((r) => {
                  const StatusIcon = statusIcon[r.status] ?? Clock;
                  return (
                    <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-medium text-sm text-gray-900">{r.guest}</span>
                          <span className="text-xs text-gray-400">{r.id}</span>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{r.hotel} · {r.checkIn}</p>
                      </div>
                      <span className={`badge text-xs flex items-center gap-1 ml-4 ${statusStyle[r.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        <StatusIcon className="h-3 w-3" />
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-50">
                <h2 className="font-display font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-4 space-y-3">
                {QUICK_LINKS.map(({ to, label, icon: Icon, desc, grad }) => (
                  <Link key={to} to={to}>
                    <motion.div whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 400 }}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${grad} flex-shrink-0`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800">{label}</p>
                        <p className="text-xs text-gray-400 truncate">{desc}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-300 ml-auto flex-shrink-0" />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
