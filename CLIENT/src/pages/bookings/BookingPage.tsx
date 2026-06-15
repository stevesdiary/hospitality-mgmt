import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { ChevronLeft, BedDouble, Users, Calendar, CheckCircle, CreditCard, Phone, Mail, User } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock — replace with API call using useParams roomId
const ROOM = {
  id: 'r2',
  hotelName: 'Eko Hotel & Suites',
  hotelId: '1',
  category: 'Deluxe Suite',
  price: 75000,
  capacity: 2,
  grad: 'from-blue-400 to-indigo-600',
};

interface GuestForm {
  firstName: string; lastName: string;
  email: string; phone: string;
  specialRequests: string;
}

const BookingPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  void roomId;
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');
  const [payMethod, setPayMethod] = useState<'card' | 'transfer'>('card');
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<GuestForm>();

  const nights = checkIn && checkOut
    ? Math.max(0, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 1;
  const subtotal = ROOM.price * nights;
  const tax = Math.round(subtotal * 0.075);
  const total = subtotal + tax;

  const onSubmit = async (data: GuestForm) => {
    if (!checkIn || !checkOut || nights < 1) { toast.error('Please select valid check-in and check-out dates.'); return; }
    setLoading(true);
    // Simulate API
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setConfirmed(true);
    void data;
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="inline-flex p-5 bg-emerald-50 rounded-full mb-6">
            <CheckCircle className="h-12 w-12 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 text-sm mb-6">Your reservation at <span className="font-semibold text-gray-800">{ROOM.hotelName}</span> has been confirmed. A confirmation email is on its way.</p>
          <div className="bg-gray-50 rounded-2xl p-4 text-sm text-left space-y-2 mb-8">
            <div className="flex justify-between"><span className="text-gray-500">Room</span><span className="font-medium">{ROOM.category}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Check-in</span><span className="font-medium">{checkIn}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Check-out</span><span className="font-medium">{checkOut}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="font-bold text-primary-700">₦{total.toLocaleString()}</span></div>
          </div>
          <button onClick={() => navigate('/my-reservations')} className="btn-accent w-full py-3">View My Reservations</button>
          <Link to="/" className="block text-center text-sm text-gray-500 hover:text-primary-600 mt-4 transition-colors">Back to Home</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center gap-3">
          <Link to={`/hotels/${ROOM.hotelId}`} className="flex items-center gap-1.5 text-gray-500 hover:text-primary-600 text-sm font-medium transition-colors">
            <ChevronLeft className="h-4 w-4" /> Back
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="font-display text-lg font-bold text-gray-900">Complete Your Booking</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Dates */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary-500" /> Stay Dates
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Check In</label>
                    <input type="date" value={checkIn} min={new Date().toISOString().split('T')[0]} onChange={(e) => setCheckIn(e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Check Out</label>
                    <input type="date" value={checkOut} min={checkIn || new Date().toISOString().split('T')[0]} onChange={(e) => setCheckOut(e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Guests</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <select value={guests} onChange={(e) => setGuests(e.target.value)} className="input-field pl-9">
                        {Array.from({ length: ROOM.capacity }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest details */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-primary-500" /> Guest Details
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                      <input type="text" placeholder="Chidi" {...register('firstName', { required: 'Required' })}
                        className={`input-field ${errors.firstName ? 'border-red-400' : ''}`} />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                      <input type="text" placeholder="Okonkwo" {...register('lastName', { required: 'Required' })}
                        className={`input-field ${errors.lastName ? 'border-red-400' : ''}`} />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-gray-400" /> Email Address
                    </label>
                    <input type="email" placeholder="chidi@example.com" {...register('email', { required: 'Required' })}
                      className={`input-field ${errors.email ? 'border-red-400' : ''}`} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-gray-400" /> Phone Number
                    </label>
                    <input type="tel" placeholder="08012345678" {...register('phone', { required: 'Required' })}
                      className={`input-field ${errors.phone ? 'border-red-400' : ''}`} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Special Requests <span className="text-gray-400 font-normal">(optional)</span></label>
                    <textarea rows={3} placeholder="Any specific requirements for your stay…" {...register('specialRequests')}
                      className="input-field resize-none" />
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary-500" /> Payment Method
                </h2>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {(['card', 'transfer'] as const).map((m) => (
                    <button
                      key={m} type="button"
                      onClick={() => setPayMethod(m)}
                      className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${payMethod === m ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >
                      {m === 'card' ? '💳 Debit / Credit Card' : '🏦 Bank Transfer'}
                    </button>
                  ))}
                </div>

                {payMethod === 'card' && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Number</label>
                      <input type="text" placeholder="1234 5678 9012 3456" maxLength={19} className="input-field" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry</label>
                        <input type="text" placeholder="MM / YY" maxLength={7} className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
                        <input type="text" placeholder="•••" maxLength={4} className="input-field" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Name on Card</label>
                      <input type="text" placeholder="CHIDI OKONKWO" className="input-field" />
                    </div>
                  </motion.div>
                )}

                {payMethod === 'transfer' && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-blue-50 rounded-xl p-4 text-sm space-y-2">
                    <p className="font-semibold text-blue-800">Bank Transfer Details</p>
                    <div className="text-blue-700 space-y-1">
                      <p>Bank: <span className="font-medium">Zenith Bank</span></p>
                      <p>Account Name: <span className="font-medium">StayNG Payments Ltd</span></p>
                      <p>Account No: <span className="font-medium">1234567890</span></p>
                      <p>Amount: <span className="font-bold">₦{total.toLocaleString()}</span></p>
                    </div>
                    <p className="text-blue-500 text-xs mt-2">Use your booking reference as the transfer narration. Your booking will be confirmed once payment is verified.</p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right: summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className={`h-28 bg-gradient-to-br ${ROOM.grad}`} />
                  <div className="p-5">
                    <p className="text-xs text-gray-400 mb-0.5">{ROOM.hotelName}</p>
                    <h3 className="font-display font-bold text-gray-900 mb-1">{ROOM.category}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><BedDouble className="h-3 w-3" /> Suite</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{ROOM.capacity} guests max</span>
                    </div>

                    <div className="border-t border-gray-100 mt-4 pt-4 space-y-2.5 text-sm">
                      <div className="flex justify-between text-gray-500">
                        <span>₦{ROOM.price.toLocaleString()} × {nights} night{nights !== 1 ? 's' : ''}</span>
                        <span>₦{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Taxes &amp; fees (7.5%)</span>
                        <span>₦{tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2.5">
                        <span>Total</span>
                        <span className="text-primary-700">₦{total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={{ scale: 0.98 }}
                  className="btn-accent w-full py-3.5"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Confirming…
                    </span>
                  ) : `Confirm & Pay ₦${total.toLocaleString()}`}
                </motion.button>

                <div className="space-y-2">
                  {['Free cancellation up to 24h before check-in', 'Instant confirmation', 'Secure encrypted payment'].map((t) => (
                    <div key={t} className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
