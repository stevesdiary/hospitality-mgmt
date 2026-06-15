import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Users, BedDouble, Maximize, Wifi, Tv, Wind, Coffee, CheckCircle, Star } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

// Mock — replace with API call
const ROOM = {
  id: 'r2',
  hotelId: '1',
  hotelName: 'Eko Hotel & Suites',
  category: 'Deluxe Suite',
  grad: 'from-blue-400 via-indigo-500 to-purple-600',
  price: 75000,
  capacity: 2,
  size: 45,
  availability: true,
  description: 'The Deluxe Suite offers a spacious retreat with stunning ocean views. Featuring a separate lounge area, king-size bed, and floor-to-ceiling windows overlooking the Atlantic, it combines luxury with comfort for the discerning traveller.',
  amenities: ['King Bed', 'Ocean View', 'Free WiFi', 'Smart TV', 'Air Conditioning', 'Mini Bar', 'Coffee Maker', 'Bathtub', 'Safe', '24h Room Service'],
  policies: ['Check-in from 2:00 PM', 'Check-out by 12:00 PM', 'No smoking', 'Pets not allowed', 'Free cancellation up to 24h before check-in'],
  reviews: [
    { id: '1', name: 'Amaka N.', rating: 5, date: 'Mar 2026', text: 'The ocean view was absolutely breathtaking. Will definitely book again!' },
    { id: '2', name: 'Tunde A.', rating: 5, date: 'Feb 2026', text: 'Spacious, clean and the service was exceptional. The suite exceeded expectations.' },
  ],
};

const amenityIcon: Record<string, React.ElementType> = {
  'Free WiFi': Wifi, 'Smart TV': Tv, 'Air Conditioning': Wind, 'Coffee Maker': Coffee,
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
      ))}
    </span>
  );
}

const RoomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  void id;
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const nights = checkIn && checkOut
    ? Math.max(0, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className={`relative h-64 md:h-80 bg-gradient-to-br ${ROOM.grad} overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <motion.div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Link to={`/hotels/${ROOM.hotelId}`} className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium transition-all">
            <ChevronLeft className="h-4 w-4" /> Back to Hotel
          </Link>
        </div>
        <div className="absolute bottom-6 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="badge bg-white/20 backdrop-blur-sm text-white border border-white/30 text-xs">{ROOM.category}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div variants={stagger} initial="hidden" animate="visible">
              <motion.div variants={fadeUp}>
                <p className="text-sm text-primary-600 font-semibold mb-1">{ROOM.hotelName}</p>
                <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">{ROOM.category}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-primary-400" />{ROOM.capacity} guests</span>
                  <span className="flex items-center gap-1.5"><BedDouble className="h-4 w-4 text-primary-400" />King Bed</span>
                  <span className="flex items-center gap-1.5"><Maximize className="h-4 w-4 text-primary-400" />{ROOM.size} m²</span>
                </div>
              </motion.div>
              <motion.p variants={fadeUp} className="text-gray-600 leading-relaxed mt-4">{ROOM.description}</motion.p>
            </motion.div>

            {/* Amenities */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.h2 variants={fadeUp} className="font-display text-xl font-semibold text-gray-900 mb-4">Room Amenities</motion.h2>
              <motion.div variants={stagger} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ROOM.amenities.map((a) => {
                  const Icon = amenityIcon[a] ?? CheckCircle;
                  return (
                    <motion.div key={a} variants={fadeUp} className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-3 border border-gray-100 text-sm text-gray-700 font-medium">
                      <Icon className="h-4 w-4 text-primary-500 flex-shrink-0" />
                      <span>{a}</span>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Policies */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.h2 variants={fadeUp} className="font-display text-xl font-semibold text-gray-900 mb-4">Room Policies</motion.h2>
              <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
                {ROOM.policies.map((p) => (
                  <div key={p} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Reviews */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.h2 variants={fadeUp} className="font-display text-xl font-semibold text-gray-900 mb-4">Guest Reviews</motion.h2>
              <motion.div variants={stagger} className="space-y-4">
                {ROOM.reviews.map((r) => (
                  <motion.div key={r.id} variants={fadeUp} className="bg-white rounded-2xl p-5 border border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-semibold">
                          {r.name[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{r.name}</div>
                          <div className="text-xs text-gray-400">{r.date}</div>
                        </div>
                      </div>
                      <Stars rating={r.rating} />
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{r.text}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Booking widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="mb-5">
                  <span className="text-2xl font-bold text-primary-700">₦{ROOM.price.toLocaleString()}</span>
                  <span className="text-sm text-gray-400"> / night</span>
                </div>

                <div className="space-y-3 mb-5">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Check In</label>
                    <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} min={new Date().toISOString().split('T')[0]} className="input-field" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Check Out</label>
                    <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} min={checkIn || new Date().toISOString().split('T')[0]} className="input-field" />
                  </div>
                </div>

                {checkIn && checkOut && nights > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-gray-100 py-4 mb-4 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>₦{ROOM.price.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}</span>
                      <span>₦{(ROOM.price * nights).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Taxes &amp; fees</span>
                      <span>₦{Math.round(ROOM.price * nights * 0.075).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2">
                      <span>Total</span>
                      <span>₦{Math.round(ROOM.price * nights * 1.075).toLocaleString()}</span>
                    </div>
                  </motion.div>
                )}

                <Link
                  to={ROOM.availability ? `/book/${ROOM.id}` : '#'}
                  className={`btn-accent w-full py-3 text-center ${!ROOM.availability ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  {ROOM.availability ? 'Book This Room' : 'Not Available'}
                </Link>
                <p className="text-center text-xs text-gray-400 mt-3">You won't be charged yet</p>

                <div className="mt-5 space-y-2">
                  {['Free cancellation up to 24h', 'Instant confirmation', 'Best price guarantee'].map((t) => (
                    <div key={t} className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailPage;
