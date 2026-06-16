import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, BedDouble, CalendarCheck, Users, TrendingUp, ArrowRight, CheckCircle, Clock, X } from 'lucide-react';
import { DUMMY_HOTELS, DUMMY_ROOMS, DUMMY_RESERVATIONS, DUMMY_USERS } from '@/data/dummy';

const STATS = [
  { label: 'Total Hotels', value: String(DUMMY_HOTELS.length), change: `+${DUMMY_HOTELS.length} total`, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50', grad: 'from-blue-500 to-indigo-600' },
  { label: 'Total Rooms', value: String(DUMMY_ROOMS.length), change: `+${DUMMY_ROOMS.length} total`, icon: BedDouble, color: 'text-violet-600', bg: 'bg-violet-50', grad: 'from-violet-500 to-purple-600' },
  { label: 'Reservations', value: String(DUMMY_RESERVATIONS.length), change: `+${DUMMY_RESERVATIONS.length} total`, icon: CalendarCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', grad: 'from-emerald-500 to-teal-600' },
  { label: 'Registered Users', value: String(DUMMY_USERS.length), change: `+${DUMMY_USERS.length} total`, icon: Users, color: 'text-accent-600', bg: 'bg-accent-50', grad: 'from-orange-400 to-red-500' },
];

const RECENT = DUMMY_RESERVATIONS.slice(0, 5).map((r) => ({
  id: r.id, guest: r.guestName, hotel: DUMMY_HOTELS.find((h) => h.id === r.hotelId)?.name ?? '',
  checkIn: r.checkInDate, status: r.status === 'checked-out' ? 'completed' : r.status,
}));

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const QUICK_LINKS = [
  { to: '/admin/hotels', label: 'Manage Hotels', icon: Building2, desc: 'Add, edit or remove hotels', grad: 'from-blue-500 to-indigo-600' },
  { to: '/admin/rooms', label: 'Manage Rooms', icon: BedDouble, desc: 'Configure room types and pricing', grad: 'from-violet-500 to-purple-600' },
  { to: '/admin/reservations', label: 'Reservations', icon: CalendarCheck, desc: 'Review and process bookings', grad: 'from-emerald-500 to-teal-600' },
  { to: '/admin/users', label: 'Manage Users', icon: Users, desc: 'View and manage guest accounts', grad: 'from-orange-400 to-red-500' },
];

const statusIcon: Record<string, React.ElementType> = { confirmed: CheckCircle, pending: Clock, completed: CheckCircle, cancelled: X };
const statusStyle: Record<string, string> = { confirmed: 'bg-emerald-100 text-emerald-700', pending: 'bg-amber-100 text-amber-700', completed: 'bg-blue-100 text-blue-700', cancelled: 'bg-red-100 text-red-600' };

const AdminDashboardPage: React.FC = () => (
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
      {/* Stats */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, change, icon: Icon, bg, color, grad }) => (
          <motion.div key={label} variants={fadeUp} whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 300 }}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <span className={`text-xs font-medium bg-gradient-to-r ${grad} bg-clip-text text-transparent`}>
                <TrendingUp className="h-3 w-3 inline mr-0.5" />{change.split(' ')[0]}
              </span>
            </div>
            <div className="text-2xl font-display font-bold text-gray-900">{value}</div>
            <div className="text-gray-500 text-sm mt-1">{label}</div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent reservations */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h2 className="font-display font-semibold text-gray-900">Recent Reservations</h2>
              <Link to="/admin/reservations" className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1 transition-colors">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {RECENT.map((r) => {
                const StatusIcon = statusIcon[r.status];
                return (
                  <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium text-sm text-gray-900">{r.guest}</span>
                        <span className="text-xs text-gray-400">#{r.id}</span>
                      </div>
                      <p className="text-xs text-gray-400 truncate">{r.hotel} · {r.checkIn}</p>
                    </div>
                    <span className={`badge text-xs flex items-center gap-1 ml-4 ${statusStyle[r.status]}`}>
                      <StatusIcon className="h-3 w-3" />
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick links */}
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

export default AdminDashboardPage;
