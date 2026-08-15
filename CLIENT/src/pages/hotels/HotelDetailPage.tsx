import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Wifi, Dumbbell, Car, Shield, Tag, ChevronLeft, Heart, Share2, CheckCircle, Users, BedDouble, Loader2 } from 'lucide-react';
import { hotelService, roomService } from '@/services';
import { transformHotel, transformRoom, transformPaginatedResponse } from '@/utils/apiTransformers';
import type { Hotel, Room } from '@/types';

const GRAD_COLORS = [
  'from-indigo-500 via-purple-600 to-blue-700', 'from-cyan-500 via-blue-600 to-indigo-700',
  'from-emerald-500 via-teal-600 to-cyan-700', 'from-amber-500 via-orange-600 to-red-600',
  'from-rose-500 via-pink-600 to-fuchsia-700', 'from-violet-500 via-purple-600 to-indigo-700',
];
const ROOM_GRADS = [
  'from-slate-400 to-slate-600', 'from-blue-400 to-indigo-600', 'from-violet-400 to-purple-600',
  'from-amber-400 to-orange-600', 'from-cyan-400 to-blue-600', 'from-teal-400 to-emerald-600',
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const cls = size === 'md' ? 'h-5 w-5' : 'h-3.5 w-3.5';
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`${cls} ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
      ))}
    </span>
  );
}

const amenityIcon: Record<string, React.ElementType> = {
  'Free WiFi': Wifi, Wifi: Wifi, 'Swimming Pool': Tag, Gym: Dumbbell, Spa: Star,
  Restaurant: Tag, Bar: Tag, 'Car Park': Car, '24h Security': Shield, DSTV: Tag, 'Front Desk 24h': Tag,
};

const HotelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [liked, setLiked] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [hotelRes, roomsRes] = await Promise.all([
          hotelService.getHotelById(id),
          roomService.getRoomsByHotel(id),
        ]);
        const hotelData = transformHotel((hotelRes as any).hotel || hotelRes);
        setHotel(hotelData);
        
        const roomsData = transformPaginatedResponse((roomsRes as any), 'Rooms', transformRoom);
        setRooms(roomsData.items);
        if (roomsData.items.length > 0) setSelectedRoom(roomsData.items[0]);
      } catch (err: any) {
        setError(err.message || 'Failed to load hotel');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Hotel not found</h3>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <Link to="/hotels" className="btn-accent text-sm">Back to Hotels</Link>
        </div>
      </div>
    );
  }

  const grad = GRAD_COLORS[Math.abs(hotel.id.charCodeAt(0)) % GRAD_COLORS.length];
  const category = hotel.starRating === 5 ? 'Luxury' : hotel.starRating === 4 ? 'Standard' : 'Budget';

  const nights = checkIn && checkOut
    ? Math.max(0, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 1;
  const total = (selectedRoom?.pricePerNight ?? 0) * nights;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`relative h-72 md:h-96 bg-gradient-to-br ${grad} overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <motion.div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-2xl" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 8, repeat: Infinity }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex items-center justify-between">
          <Link to="/hotels" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium transition-all">
            <ChevronLeft className="h-4 w-4" /><span>Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={() => setLiked(!liked)} className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all">
              <Heart className={`h-5 w-5 ${liked ? 'fill-red-400 text-red-400' : 'text-white'}`} />
            </button>
            <button className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all">
              <Share2 className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="badge bg-white/20 backdrop-blur-sm text-white text-xs border border-white/30">{category}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div variants={stagger} initial="hidden" animate="visible">
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl font-bold text-gray-900">{hotel.name}</h1>
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-2">
                    <MapPin className="h-4 w-4 text-primary-500" />
                    <span>{hotel.address}, {hotel.city}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-700">{hotel.rating || 0}</div>
                    <Stars rating={hotel.rating ?? 0} />
                    <div className="text-xs text-gray-400 mt-0.5">{hotel.reviewCount?.toLocaleString()} reviews</div>
                  </div>
                </div>
              </motion.div>
              <motion.p variants={fadeUp} className="text-gray-600 leading-relaxed mt-4">{hotel.description}</motion.p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.h2 variants={fadeUp} className="font-display text-xl font-semibold text-gray-900 mb-4">Amenities</motion.h2>
              <motion.div variants={stagger} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {hotel.amenities.map((a) => {
                  const Icon = amenityIcon[a] ?? Tag;
                  return (
                    <motion.div key={a} variants={fadeUp} className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-3 border border-gray-100 text-sm text-gray-700 font-medium">
                      <Icon className="h-4 w-4 text-primary-500 flex-shrink-0" />
                      <span className="line-clamp-1">{a}</span>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.h2 variants={fadeUp} className="font-display text-xl font-semibold text-gray-900 mb-4">Available Rooms</motion.h2>
              <motion.div variants={stagger} className="space-y-4">
                {rooms.map((room, idx) => (
                  <motion.div key={room.id} variants={fadeUp} whileHover={{ y: -2 }}
                    onClick={() => room.available && setSelectedRoom(room)}
                    className={`card p-0 overflow-hidden cursor-pointer transition-all ${selectedRoom?.id === room.id ? 'ring-2 ring-primary-500 ring-offset-1' : ''} ${!room.available ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md'}`}>
                    <div className="flex flex-col sm:flex-row">
                      <div className={`sm:w-28 h-28 bg-gradient-to-br ${ROOM_GRADS[idx % ROOM_GRADS.length]} flex-shrink-0`} />
                      <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 text-sm">{room.category}</h3>
                            {!room.available && <span className="badge bg-red-100 text-red-600 text-[10px]">Fully Booked</span>}
                            {selectedRoom?.id === room.id && room.available && <CheckCircle className="h-4 w-4 text-primary-500" />}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{room.maxOccupancy} guests</span>
                            <span className="flex items-center gap-1"><BedDouble className="h-3 w-3" />{room.bedType}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{room.description}</p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <div className="text-lg font-bold text-primary-700">₦{room.pricePerNight.toLocaleString()}</div>
                          <div className="text-xs text-gray-400">per night</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {rooms.length === 0 && (
                  <div className="text-center py-8 text-gray-400">No rooms available</div>
                )}
              </motion.div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="mb-5">
                  <span className="text-2xl font-bold text-primary-700">₦{(selectedRoom?.pricePerNight ?? 0).toLocaleString()}</span>
                  <span className="text-sm text-gray-400"> / night</span>
                </div>

                <div className="space-y-3 mb-5">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Check In</label>
                    <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Check Out</label>
                    <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Guests</label>
                    <select value={guests} onChange={(e) => setGuests(e.target.value)} className="input-field">
                      {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                </div>

                {checkIn && checkOut && nights > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-gray-100 py-4 mb-4 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>₦{(selectedRoom?.pricePerNight ?? 0).toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}</span>
                      <span>₦{total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Taxes &amp; fees</span>
                      <span>₦{Math.round(total * 0.075).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2">
                      <span>Total</span>
                      <span>₦{Math.round(total * 1.075).toLocaleString()}</span>
                    </div>
                  </motion.div>
                )}

                <Link to={selectedRoom?.available ? `/book/${selectedRoom.id}` : '#'}
                  className={`btn-accent w-full py-3 text-center ${!selectedRoom?.available ? 'opacity-50 pointer-events-none' : ''}`}>
                  {selectedRoom?.available ? 'Reserve Now' : 'Room Unavailable'}
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

export default HotelDetailPage;
