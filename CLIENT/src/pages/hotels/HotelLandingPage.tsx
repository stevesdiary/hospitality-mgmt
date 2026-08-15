import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, BedDouble, Users, ArrowRight, Loader2 } from 'lucide-react';
import hotelService from '@/services/hotel.service';
import type { Hotel } from '@/types';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const naira = (n: number) => `₦${Number(n || 0).toLocaleString('en-NG')}`;

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-white/20 text-white/20'}`}
        />
      ))}
    </span>
  );
}

/**
 * Per-hotel public landing/booking page.
 *
 * Reached at /h/:slug — a single hotel's own branded surface where guests see
 * only that hotel's rooms and services and start booking directly. There is no
 * cross-hotel browsing here; this page is scoped to one tenant.
 */
const HotelLandingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'notfound'>('loading');

  useEffect(() => {
    let active = true;
    (async () => {
      if (!slug) return;
      try {
        const res = await hotelService.getHotelBySlug(slug);
        const found = (res as any)?.hotel ?? res;
        if (active) {
          setHotel(found);
          setStatus(found ? 'ready' : 'notfound');
        }
      } catch {
        if (active) setStatus('notfound');
      }
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (status === 'notfound' || !hotel) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Hotel not found</h1>
        <p className="text-gray-500 mt-2 max-w-md">
          We couldn&apos;t find a hotel at this address. Please check the link provided by the hotel.
        </p>
      </div>
    );
  }

  const rooms = (hotel as any).rooms ?? [];
  const amenities: string[] = (hotel as any).facilities
    ? Object.entries((hotel as any).facilities[0] ?? {})
        .filter(([k, v]) => v === true && !['id', 'hotelId'].includes(k))
        .map(([k]) => k)
    : [];
  const reviews = (hotel as any).ratingAndReview ?? [];
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + (r.overall ?? r.rating ?? 0), 0) / reviews.length
      : 0;

  return (
    <div className="bg-[#F7F6F3] min-h-screen">
      {/* Branded hero — this hotel only */}
      <section className="relative overflow-hidden bg-[#0F2444] text-white">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-block text-xs font-semibold tracking-wide uppercase text-amber-400 mb-3">
              {(hotel as any).hotelType ?? 'Hotel & Suites'}
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold leading-tight max-w-3xl">
              {hotel.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-white/80">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-amber-400" />
                {[(hotel as any).address, (hotel as any).city, (hotel as any).state].filter(Boolean).join(', ')}
              </span>
              {avgRating > 0 && (
                <span className="flex items-center gap-2">
                  <Stars rating={avgRating} />
                  <span className="text-sm">{avgRating.toFixed(1)} ({reviews.length})</span>
                </span>
              )}
            </div>
            {(hotel as any).description && (
              <p className="mt-6 max-w-2xl text-white/70 leading-relaxed">{(hotel as any).description}</p>
            )}
            <a
              href="#rooms"
              className="inline-flex items-center gap-2 mt-8 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-[#0F2444] hover:bg-amber-400 transition-colors"
            >
              View rooms &amp; book <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Amenities */}
      {amenities.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-xl font-display font-bold text-gray-900 mb-5">What this hotel offers</h2>
          <div className="flex flex-wrap gap-2.5">
            {amenities.map((a) => (
              <span
                key={a}
                className="rounded-full bg-white border border-gray-200 px-4 py-1.5 text-sm text-gray-700 shadow-sm"
              >
                {a.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Rooms — book directly from here */}
      <section id="rooms" className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-xl font-display font-bold text-gray-900 mb-5">Rooms &amp; rates</h2>
        {rooms.length === 0 ? (
          <p className="text-gray-500">No rooms are currently listed for this hotel.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room: any, idx: number) => (
              <motion.div
                key={room.id ?? idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
              >
                <div className="h-36 bg-gradient-to-br from-[#0F2444] to-[#1A3A5C]" />
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display font-semibold text-gray-900">
                    {room.category ?? room.type ?? 'Room'}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" /> {room.capacity ?? room.guestCount ?? 2}
                    </span>
                    <span className="flex items-center gap-1">
                      <BedDouble className="h-4 w-4" /> {room.bedType ?? 'King'}
                    </span>
                  </div>
                  {room.description && (
                    <p className="text-sm text-gray-500 mt-3 line-clamp-2">{room.description}</p>
                  )}
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gray-900">{naira(room.price)}</span>
                      <span className="text-sm text-gray-400"> / night</span>
                    </div>
                    {room.id ? (
                      <Link
                        // Carry the hotel context so the booking binds to this
                        // tenant (the API derives companyId from hotelId).
                        to={`/book/${room.id}?hotelId=${(hotel as any).id}&h=${slug ?? ''}`}
                        className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-[#0F2444] hover:bg-amber-400 transition-colors"
                      >
                        Book
                      </Link>
                    ) : (
                      <span className="text-sm text-gray-400">Unavailable</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HotelLandingPage;
