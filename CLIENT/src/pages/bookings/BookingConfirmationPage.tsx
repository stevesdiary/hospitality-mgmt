import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle, Calendar, MapPin, Users, Download, ArrowLeft, Clock } from 'lucide-react';
import reservationService from '../../services/reservation.service';
import type { Reservation } from '../../types';

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  'checked-in': 'bg-green-100 text-green-800',
  'checked-out': 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-800',
  'no-show': 'bg-orange-100 text-orange-800',
};

const fmt = (d?: string) =>
  d ? new Date(d).toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) : '—';

const BookingConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    reservationService.getReservationById(id)
      .then((r: any) => setReservation(r?.reservation || r))
      .catch(() => setError('Could not load booking details.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-lg text-gray-600">{error || 'Booking not found.'}</p>
        <Link to="/my-reservations" className="btn-accent">View My Bookings</Link>
      </div>
    );
  }

  const hotel = reservation.Hotel || reservation.hotel;
  const room = reservation.Room || reservation.room;
  const guest = reservation.User || reservation.user;
  const nights = Math.max(
    1,
    Math.round(
      (new Date(reservation.dateOut || reservation.checkOutDate).getTime() -
        new Date(reservation.dateIn || reservation.checkInDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Back link */}
        <Link to="/my-reservations" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6">
          <ArrowLeft size={16} /> My Bookings
        </Link>

        {/* Success banner */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500 text-white rounded-2xl p-5 flex items-center gap-4 mb-6 shadow-lg"
        >
          <CheckCircle size={36} className="shrink-0" />
          <div>
            <p className="font-bold text-lg leading-tight">Booking Confirmed!</p>
            <p className="text-green-100 text-sm">Show your QR code at the front desk — no forms to fill.</p>
          </div>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Hotel header */}
          <div className="bg-gradient-to-r from-primary-700 to-primary-500 px-6 py-5 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold">{(hotel as any)?.name || 'Hotel'}</h1>
                <p className="text-primary-200 text-sm flex items-center gap-1 mt-1">
                  <MapPin size={13} />
                  {(hotel as any)?.address}, {(hotel as any)?.city}
                </p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_COLOR[reservation.status] || 'bg-white/20 text-white'}`}>
                {reservation.status}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* QR code + booking number */}
            <div className="flex flex-col items-center gap-3 py-4 border-b border-dashed border-gray-200">
              <div className="p-3 bg-white rounded-xl border-2 border-primary-100 shadow-sm">
                <QRCodeSVG
                  value={reservation.id}
                  size={160}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-widest">Booking Number</p>
                <p className="font-mono text-lg font-bold text-primary-700 mt-0.5 select-all">
                  {reservation.id.toUpperCase().slice(0, 8)}
                </p>
                <p className="text-xs text-gray-400 mt-1">Full ID: <span className="font-mono">{reservation.id}</span></p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide flex items-center gap-1 mb-1">
                  <Calendar size={12} /> Check-in
                </p>
                <p className="font-semibold text-gray-800 text-sm">{fmt(reservation.dateIn || reservation.checkInDate)}</p>
                <p className="text-xs text-gray-400 mt-0.5">From 2:00 PM</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide flex items-center gap-1 mb-1">
                  <Calendar size={12} /> Check-out
                </p>
                <p className="font-semibold text-gray-800 text-sm">{fmt(reservation.dateOut || reservation.checkOutDate)}</p>
                <p className="text-xs text-gray-400 mt-0.5">By 12:00 PM</p>
              </div>
            </div>

            {/* Room + duration */}
            <div className="flex items-center justify-between bg-primary-50 rounded-xl px-4 py-3">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Room</p>
                <p className="font-semibold text-gray-800">
                  {(room as any)?.roomNumber ? `Room ${(room as any).roomNumber}` : (room as any)?.category || 'Standard Room'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Duration</p>
                <p className="font-semibold text-gray-800">{nights} night{nights !== 1 ? 's' : ''}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wide flex items-center gap-1 justify-end">
                  <Users size={12} /> Guests
                </p>
                <p className="font-semibold text-gray-800">{reservation.guestCount || reservation.numberOfGuests || 1}</p>
              </div>
            </div>

            {/* Guest info */}
            {guest && (
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Guest</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-700">
                    {(guest as any).firstName?.[0]}{(guest as any).lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{(guest as any).firstName} {(guest as any).lastName}</p>
                    <p className="text-sm text-gray-400">{(guest as any).email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actual check-in time if already checked in */}
            {reservation.checkInTime && (
              <div className="bg-green-50 rounded-xl px-4 py-3 flex items-center gap-3 text-green-700">
                <Clock size={16} />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide">Checked in</p>
                  <p className="text-sm font-semibold">
                    {new Date(reservation.checkInTime).toLocaleString('en-NG')}
                  </p>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
              <p className="font-semibold mb-1">At the front desk</p>
              <ol className="list-decimal list-inside space-y-1 text-amber-700">
                <li>Show this QR code <strong>or</strong> give your booking number</li>
                <li>Present a valid government-issued ID</li>
                <li>Collect your key card — you're done!</li>
              </ol>
            </div>
          </div>

          {/* Footer actions */}
          <div className="border-t border-gray-100 px-6 py-4 flex gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Download size={16} /> Print / Save PDF
            </button>
            <Link
              to="/my-reservations"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-600 rounded-xl text-sm font-medium text-white hover:bg-primary-700 transition-colors"
            >
              All Bookings
            </Link>
          </div>
        </motion.div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Need help? Contact the hotel directly using the number in your confirmation email.
        </p>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
