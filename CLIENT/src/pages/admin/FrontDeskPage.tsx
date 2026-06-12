import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, CheckCircle, LogOut, AlertCircle, User,
  Calendar, MapPin, Bed, Users, Clock, ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import reservationService from '../../services/reservation.service';
import type { Reservation } from '../../types';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending:      { label: 'Pending',     color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' },
  confirmed:    { label: 'Confirmed',   color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200' },
  'checked-in': { label: 'Checked In',  color: 'text-green-700',  bg: 'bg-green-50 border-green-200' },
  'checked-out':{ label: 'Checked Out', color: 'text-gray-600',   bg: 'bg-gray-50 border-gray-200' },
  cancelled:    { label: 'Cancelled',   color: 'text-red-700',    bg: 'bg-red-50 border-red-200' },
  'no-show':    { label: 'No Show',     color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
};

const fmt = (d?: string) =>
  d ? new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const fmtTime = (d?: string) =>
  d ? new Date(d).toLocaleString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

const FrontDeskPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [notFound, setNotFound] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const lookup = async (id: string) => {
    const trimmed = id.trim();
    if (!trimmed) return;
    setLoading(true);
    setNotFound(false);
    setReservation(null);
    try {
      const res: any = await reservationService.lookupReservation(trimmed);
      setReservation(res?.reservation || res);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    lookup(query);
  };

  const handleCheckIn = async () => {
    if (!reservation) return;
    setActionLoading(true);
    try {
      const res: any = await reservationService.checkIn(reservation.id);
      setReservation(res?.reservation || res);
      toast.success(`${guestName} checked in successfully!`);
    } catch (err: any) {
      toast.error(err.message || 'Check-in failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!reservation) return;
    setActionLoading(true);
    try {
      const res: any = await reservationService.checkOut(reservation.id);
      setReservation(res?.reservation || res);
      toast.success(`${guestName} checked out successfully!`);
    } catch (err: any) {
      toast.error(err.message || 'Check-out failed');
    } finally {
      setActionLoading(false);
    }
  };

  const hotel = reservation ? (reservation.Hotel || reservation.hotel) : null;
  const room  = reservation ? (reservation.Room  || reservation.room)  : null;
  const guest = reservation ? (reservation.User  || reservation.user)  : null;
  const guestName = guest ? `${(guest as any).firstName} ${(guest as any).lastName}` : 'Guest';
  const status = reservation ? STATUS_CONFIG[reservation.status] || STATUS_CONFIG.pending : null;

  const canCheckIn  = reservation && ['pending', 'confirmed'].includes(reservation.status);
  const canCheckOut = reservation && reservation.status === 'checked-in';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header bar */}
      <div className="bg-primary-800 text-white px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Front Desk</h1>
            <p className="text-primary-300 text-sm">Search booking → verify guest → issue key card</p>
          </div>
          <div className="text-right text-sm">
            <p className="text-primary-300">
              {new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <p className="font-semibold">{new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Search */}
        <form onSubmit={handleSearch} className="relative">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Paste or type booking ID / scan QR code…"
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-3.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Look Up <ChevronRight size={16} /></>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 ml-1">
            Tip: if the guest has the app, the QR code scanner on a connected device will paste the booking ID here automatically.
          </p>
        </form>

        {/* Not found */}
        <AnimatePresence>
          {notFound && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"
            >
              <AlertCircle size={18} className="shrink-0" />
              <div>
                <p className="font-semibold">Booking not found</p>
                <p className="text-red-500">Double-check the ID. Ask the guest to show their confirmation email or app QR code.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result card */}
        <AnimatePresence>
          {reservation && (
            <motion.div
              key={reservation.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
            >
              {/* Status bar */}
              <div className={`flex items-center justify-between px-5 py-3 border-b ${status?.bg}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${reservation.status === 'checked-in' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                  <span className={`text-sm font-semibold ${status?.color}`}>{status?.label}</span>
                </div>
                <span className="font-mono text-xs text-gray-400 select-all">{reservation.id.toUpperCase().slice(0, 8)}</span>
              </div>

              <div className="p-5 space-y-5">
                {/* Guest info — prominent */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-xl font-bold text-primary-700 shrink-0">
                    {(guest as any)?.firstName?.[0]}{(guest as any)?.lastName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xl font-bold text-gray-900">{guestName}</p>
                    <p className="text-sm text-gray-500 truncate">{(guest as any)?.email}</p>
                    {(guest as any)?.phoneNumber && (
                      <p className="text-sm text-gray-500">{(guest as any).phoneNumber}</p>
                    )}
                  </div>
                  <User size={20} className="text-gray-300" />
                </div>

                {/* Hotel + room */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                      <MapPin size={11} /> Hotel
                    </p>
                    <p className="font-semibold text-gray-800 text-sm leading-tight">{(hotel as any)?.name || '—'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{(hotel as any)?.city}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                      <Bed size={11} /> Room
                    </p>
                    <p className="font-semibold text-gray-800 text-sm">
                      {(room as any)?.roomNumber ? `No. ${(room as any).roomNumber}` : (room as any)?.category || '—'}
                    </p>
                    <p className="text-xs text-gray-400 capitalize mt-0.5">{(room as any)?.bedType || ''}</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-blue-50 rounded-xl p-3">
                    <Calendar size={14} className="mx-auto text-blue-400 mb-1" />
                    <p className="text-xs text-gray-400">Check-in</p>
                    <p className="text-sm font-semibold text-gray-800">{fmt(reservation.dateIn || reservation.checkInDate)}</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3">
                    <Calendar size={14} className="mx-auto text-blue-400 mb-1" />
                    <p className="text-xs text-gray-400">Check-out</p>
                    <p className="text-sm font-semibold text-gray-800">{fmt(reservation.dateOut || reservation.checkOutDate)}</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3">
                    <Users size={14} className="mx-auto text-blue-400 mb-1" />
                    <p className="text-xs text-gray-400">Guests</p>
                    <p className="text-sm font-semibold text-gray-800">{reservation.guestCount || reservation.numberOfGuests || 1}</p>
                  </div>
                </div>

                {/* Actual times if recorded */}
                {(reservation.checkInTime || reservation.checkOutTime) && (
                  <div className="bg-green-50 rounded-xl px-4 py-3 text-sm text-green-700 flex items-start gap-2">
                    <Clock size={15} className="mt-0.5 shrink-0" />
                    <div className="space-y-0.5">
                      {reservation.checkInTime && (
                        <p><span className="font-medium">Checked in:</span> {fmtTime(reservation.checkInTime)}</p>
                      )}
                      {reservation.checkOutTime && (
                        <p><span className="font-medium">Checked out:</span> {fmtTime(reservation.checkOutTime)}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action bar */}
              {(canCheckIn || canCheckOut) && (
                <div className="border-t border-gray-100 px-5 py-4">
                  {canCheckIn && (
                    <button
                      onClick={handleCheckIn}
                      disabled={actionLoading}
                      className="w-full flex items-center justify-center gap-3 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-lg transition-colors disabled:opacity-60"
                    >
                      {actionLoading ? (
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle size={22} />
                          Check In — Issue Key Card
                        </>
                      )}
                    </button>
                  )}
                  {canCheckOut && (
                    <button
                      onClick={handleCheckOut}
                      disabled={actionLoading}
                      className="w-full flex items-center justify-center gap-3 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg transition-colors disabled:opacity-60"
                    >
                      {actionLoading ? (
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <LogOut size={22} />
                          Check Out Guest
                        </>
                      )}
                    </button>
                  )}
                  <p className="text-xs text-gray-400 text-center mt-2">
                    {canCheckIn
                      ? 'Verify guest ID, then press the button to record check-in and issue a key card.'
                      : 'Press to record check-out time and collect the key card.'}
                  </p>
                </div>
              )}

              {/* Already done state */}
              {reservation.status === 'checked-out' && (
                <div className="border-t border-gray-100 px-5 py-4 text-center text-sm text-gray-400">
                  Reservation complete — guest has checked out.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!loading && !reservation && !notFound && (
          <div className="text-center py-16 text-gray-300 select-none">
            <Search size={48} className="mx-auto mb-3 opacity-40" />
            <p className="text-gray-400 font-medium">Enter a booking number to get started</p>
            <p className="text-sm text-gray-300 mt-1">
              The guest can find their booking number in their confirmation email or the app.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FrontDeskPage;
