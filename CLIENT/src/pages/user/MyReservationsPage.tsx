import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Calendar, MapPin, ChevronRight, Search, X } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };

const RESERVATIONS = [
  { id: 'R001', hotelName: 'Eko Hotel & Suites', room: 'Deluxe Suite', city: 'Lagos', checkIn: '2026-04-10', checkOut: '2026-04-13', nights: 3, total: 243000, status: 'confirmed', grad: 'from-blue-400 to-indigo-600' },
  { id: 'R002', hotelName: 'Transcorp Hilton Abuja', room: 'Executive Suite', city: 'Abuja', checkIn: '2026-05-02', checkOut: '2026-05-04', nights: 2, total: 193000, status: 'pending', grad: 'from-cyan-500 to-blue-700' },
  { id: 'R003', hotelName: 'Hotel Presidential', room: 'Standard Room', city: 'Port Harcourt', checkIn: '2026-02-14', checkOut: '2026-02-16', nights: 2, total: 86900, status: 'completed', grad: 'from-emerald-500 to-teal-700' },
  { id: 'R004', hotelName: 'Wheatbaker Hotel', room: 'Deluxe Room', city: 'Lagos', checkIn: '2026-01-20', checkOut: '2026-01-22', nights: 2, total: 107800, status: 'cancelled', grad: 'from-rose-500 to-pink-700' },
];

const STATUS_TABS = ['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'];

const statusStyle: Record<string, string> = {
  confirmed: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-600',
};

const MyReservationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = RESERVATIONS.filter((r) => {
    const matchTab = activeTab === 'All' || r.status === activeTab.toLowerCase();
    const matchSearch = r.hotelName.toLowerCase().includes(search.toLowerCase()) || r.city.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-1">My Reservations</h1>
            <p className="text-gray-500 text-sm">{RESERVATIONS.length} total bookings</p>
          </motion.div>

          {/* Search */}
          <div className="relative mt-5 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by hotel or city…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 pr-9"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1">
            {STATUS_TABS.map((t) => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === t ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div key="list" variants={stagger} initial="hidden" animate="visible" className="space-y-4">
              {filtered.map((r) => (
                <motion.div key={r.id} variants={fadeUp} layout>
                  <motion.div whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row">
                      <div className={`sm:w-36 h-28 sm:h-auto bg-gradient-to-br ${r.grad} flex-shrink-0`} />
                      <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`badge text-xs ${statusStyle[r.status]}`}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span>
                            <span className="text-xs text-gray-400">#{r.id}</span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-0.5 truncate">{r.hotelName}</h3>
                          <p className="text-sm text-gray-500 mb-2">{r.room}</p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{r.city}</span>
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{r.checkIn} → {r.checkOut}</span>
                            <span>{r.nights} night{r.nights > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end gap-3 flex-shrink-0">
                          <div className="text-right">
                            <div className="text-base font-bold text-primary-700">₦{r.total.toLocaleString()}</div>
                            <div className="text-xs text-gray-400">Total paid</div>
                          </div>
                          <Link to={`/hotels/1`} className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors whitespace-nowrap">
                            <Building2 className="h-3.5 w-3.5" /> View Hotel <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <div className="text-5xl mb-4">🏨</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No reservations found</h3>
              <p className="text-gray-400 text-sm mb-6">
                {search ? 'Try a different search term' : `No ${activeTab.toLowerCase()} bookings yet`}
              </p>
              <Link to="/hotels" className="btn-accent text-sm">Browse Hotels</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyReservationsPage;
