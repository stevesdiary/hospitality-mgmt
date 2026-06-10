import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Search, MapPin, Calendar, Users, Star, Wifi, Car, Dumbbell,
  Shield, Clock, Tag, Building2, ChevronRight, Heart,
} from 'lucide-react';

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Animated counter ────────────────────────────────────────────────────────
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [display, setDisplay] = useState('0');
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const step = to / 80;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, to);
      const v = Math.round(current);
      setDisplay(v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}K` : v.toString());
      if (current >= to) clearInterval(timer);
    }, 25);
    return () => clearInterval(timer);
  }, [inView, to]);

  return <span ref={ref}>{display}{suffix}</span>;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const DESTINATIONS = [
  { city: 'Lagos', state: 'Lagos State', count: 234, gradient: 'from-amber-400 to-orange-500' },
  { city: 'Abuja', state: 'FCT', count: 187, gradient: 'from-blue-500 to-indigo-600' },
  { city: 'Port Harcourt', state: 'Rivers State', count: 156, gradient: 'from-emerald-400 to-teal-600' },
  { city: 'Kano', state: 'Kano State', count: 98, gradient: 'from-yellow-400 to-amber-500' },
  { city: 'Ibadan', state: 'Oyo State', count: 112, gradient: 'from-violet-400 to-purple-600' },
  { city: 'Calabar', state: 'Cross River', count: 74, gradient: 'from-rose-400 to-pink-600' },
];

const DEALS = [
  { id: '1', name: 'Eko Hotel & Suites', city: 'Lagos', orig: 75000, price: 52500, discount: 30, rating: 4.8, reviews: 1240, category: 'Luxury', grad: 'from-indigo-500 via-purple-600 to-blue-700', amenities: ['Wifi', 'Pool', 'Gym'] },
  { id: '2', name: 'Transcorp Hilton', city: 'Abuja', orig: 95000, price: 66500, discount: 30, rating: 4.9, reviews: 2100, category: 'Luxury', grad: 'from-cyan-500 via-blue-600 to-indigo-700', amenities: ['Wifi', 'Spa', 'Bar'] },
  { id: '3', name: 'Hotel Presidential', city: 'Port Harcourt', orig: 55000, price: 38500, discount: 30, rating: 4.6, reviews: 890, category: 'Standard', grad: 'from-emerald-500 via-teal-600 to-cyan-700', amenities: ['Wifi', 'Pool', 'Restaurant'] },
  { id: '4', name: 'Hamdala Hotel', city: 'Kano', orig: 35000, price: 24500, discount: 30, rating: 4.4, reviews: 567, category: 'Budget', grad: 'from-amber-500 via-orange-600 to-red-600', amenities: ['Wifi', 'Restaurant', 'Security'] },
];

const STATS = [
  { label: 'Listed Hotels', to: 5000, suffix: '+', icon: Building2, color: 'text-primary-600', bg: 'bg-primary-50' },
  { label: 'Cities Covered', to: 36, suffix: '', icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Happy Guests', to: 500000, suffix: '+', icon: Users, color: 'text-accent-600', bg: 'bg-accent-50' },
  { label: 'Years of Trust', to: 8, suffix: '+', icon: Star, color: 'text-violet-600', bg: 'bg-violet-50' },
];

const FEATURES = [
  { icon: Shield, title: 'Secure Booking', desc: 'Every reservation is protected with encrypted payments and instant confirmation.', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  { icon: Clock, title: '24 / 7 Support', desc: 'Our Nigeria-based support team is always available — day or night.', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { icon: Tag, title: 'Best Price Guarantee', desc: "Found it cheaper? We'll match the price and throw in an extra 10% discount.", color: 'text-accent-600', bg: 'bg-accent-50', border: 'border-accent-100' },
];

// ─── Star renderer ────────────────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
      ))}
    </span>
  );
}

// ─── Amenity icon mapper ───────────────────────────────────────────────────────
const amenityIcon: Record<string, React.ElementType> = {
  Wifi: Wifi, Pool: Tag, Gym: Dumbbell, Spa: Star, Bar: Tag,
  Restaurant: Tag, Security: Shield, Car: Car,
};

// ═══════════════════════════════════════════════════════════════════════════════
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState({ location: '', checkIn: '', checkOut: '', guests: '1' });
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams(searchForm);
    navigate(`/search?${p.toString()}`);
  };

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 pt-20">
        {/* Animated orbs */}
        {[
          { cls: 'top-1/4 left-1/4 w-[28rem] h-[28rem] bg-blue-600/20', dur: 8 },
          { cls: 'bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/20', dur: 10 },
          { cls: 'top-1/2 right-1/3 w-64 h-64 bg-cyan-600/15', dur: 12 },
        ].map(({ cls, dur }, i) => (
          <motion.div
            key={i}
            className={`absolute ${cls} rounded-full blur-3xl`}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.55, 0.3] }}
            transition={{ duration: dur, repeat: Infinity, delay: i * 2 }}
          />
        ))}

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '64px 64px' }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center w-full">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-sm text-white/90">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Nigeria's #1 Hotel Booking Platform</span>
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-[1.1]">
              Find Your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400">
                Perfect Stay
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-blue-100/75 text-lg md:text-xl mb-12 max-w-xl mx-auto">
              Book hotels, apartments and shortlets across Nigeria — best prices guaranteed.
            </motion.p>

            {/* Search card */}
            <motion.form
              variants={fadeUp}
              onSubmit={handleSearch}
              className="bg-white rounded-2xl shadow-2xl p-4 md:p-5 text-left"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="relative sm:col-span-2 md:col-span-1">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="City, hotel or area…"
                    value={searchForm.location}
                    onChange={(e) => setSearchForm((p) => ({ ...p, location: e.target.value }))}
                    className="input-field pl-10"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={searchForm.checkIn}
                    onChange={(e) => setSearchForm((p) => ({ ...p, checkIn: e.target.value }))}
                    className="input-field pl-10"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={searchForm.checkOut}
                    onChange={(e) => setSearchForm((p) => ({ ...p, checkOut: e.target.value }))}
                    className="input-field pl-10"
                  />
                </div>
                <button type="submit" className="btn-accent py-3 flex items-center justify-center space-x-2">
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </button>
              </div>
            </motion.form>

            {/* Quick city chips */}
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2 mt-5">
              {['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan'].map((c) => (
                <Link
                  key={c}
                  to={`/search?location=${c}`}
                  className="text-sm text-white/70 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-4 py-1.5 transition-all duration-200"
                >
                  {c}
                </Link>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {STATS.map(({ label, to, suffix, icon: Icon, color, bg }) => (
              <motion.div key={label} variants={fadeUp} className="text-center">
                <div className={`inline-flex p-3 rounded-2xl ${bg} mb-3`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <div className={`text-3xl font-display font-bold ${color}`}>
                  <Counter to={to} suffix={suffix} />
                </div>
                <div className="text-gray-500 text-sm mt-1">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Destinations ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.p variants={fadeUp} className="text-accent-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Explore Nigeria
            </motion.p>
            <motion.h2 variants={fadeUp} className="section-heading">Popular Destinations</motion.h2>
            <motion.p variants={fadeUp} className="section-sub mx-auto max-w-xl">
              Discover top cities with hundreds of hotels at your fingertips.
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
          >
            {DESTINATIONS.map(({ city, state, count, gradient }) => (
              <motion.div key={city} variants={fadeUp}>
                <Link to={`/search?location=${city}`}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -4 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className={`relative h-44 md:h-56 rounded-2xl bg-gradient-to-br ${gradient} overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300`}
                  >
                    {/* Shimmer overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
                    {/* Decorative circle */}
                    <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
                    <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-white/10" />

                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-white font-display font-bold text-xl leading-tight">{city}</h3>
                      <p className="text-white/75 text-sm">{state}</p>
                      <span className="inline-block mt-2 text-xs font-semibold bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                        {count} hotels
                      </span>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Top Deals ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4"
          >
            <div>
              <motion.p variants={fadeUp} className="text-accent-600 font-semibold text-sm uppercase tracking-wider mb-2">
                Limited Time
              </motion.p>
              <motion.h2 variants={fadeUp} className="section-heading">Top Deals</motion.h2>
            </div>
            <motion.div variants={fadeUp}>
              <Link to="/search?deals=true" className="btn-outline text-sm flex items-center space-x-1">
                <span>View all deals</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {DEALS.map((hotel) => (
              <motion.div key={hotel.id} variants={fadeUp}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.015 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="card overflow-hidden group"
                >
                  {/* Image area */}
                  <div className={`relative h-44 bg-gradient-to-br ${hotel.grad} overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                    {/* Discount badge */}
                    <div className="absolute top-3 left-3 bg-accent-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                      -{hotel.discount}%
                    </div>
                    {/* Wishlist */}
                    <button
                      onClick={() => setLiked((p) => ({ ...p, [hotel.id]: !p[hotel.id] }))}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all"
                    >
                      <Heart className={`h-4 w-4 ${liked[hotel.id] ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                    </button>
                    {/* Category */}
                    <div className="absolute bottom-3 left-3 text-xs font-semibold text-white bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-md">
                      {hotel.category}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <Stars rating={hotel.rating} />
                      <span className="text-xs text-gray-400">{hotel.reviews.toLocaleString()} reviews</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight mt-1 mb-1 line-clamp-1">{hotel.name}</h3>
                    <div className="flex items-center space-x-1 text-gray-400 text-xs mb-3">
                      <MapPin className="h-3 w-3" />
                      <span>{hotel.city}</span>
                    </div>

                    {/* Amenity chips */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {hotel.amenities.slice(0, 3).map((a) => {
                        const Icon = amenityIcon[a] ?? Tag;
                        return (
                          <span key={a} className="inline-flex items-center gap-1 text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            <Icon className="h-2.5 w-2.5" />
                            {a}
                          </span>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-400 line-through">₦{hotel.orig.toLocaleString()}</span>
                        <div className="text-base font-bold text-primary-700">₦{hotel.price.toLocaleString()}<span className="text-xs font-normal text-gray-400">/night</span></div>
                      </div>
                      <Link to={`/hotels/${hotel.id}`} className="btn-accent text-xs py-1.5 px-3">
                        Book
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Why StayNG
            </motion.p>
            <motion.h2 variants={fadeUp} className="section-heading">Book with Confidence</motion.h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {FEATURES.map(({ icon: Icon, title, desc, color, bg, border }) => (
              <motion.div key={title} variants={fadeUp}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className={`card p-8 border ${border} text-center h-full`}
                >
                  <motion.div
                    whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                    className={`inline-flex p-4 rounded-2xl ${bg} mb-5`}
                  >
                    <Icon className={`h-7 w-7 ${color}`} />
                  </motion.div>
                  <h3 className="text-lg font-display font-semibold text-gray-900 mb-3">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Newsletter CTA ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-primary-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-72 h-72 bg-violet-500/15 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, delay: 3 }}
        />

        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.p variants={fadeUp} className="text-blue-300 text-sm font-semibold uppercase tracking-wider mb-3">
              Get exclusive deals
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Never Miss a Great Deal
            </motion.h2>
            <motion.p variants={fadeUp} className="text-blue-200/70 mb-8">
              Subscribe and be the first to receive exclusive hotel deals, promotions and travel tips.
            </motion.p>
            <motion.form variants={fadeUp} onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
              />
              <button type="submit" className="btn-accent py-3 px-6 whitespace-nowrap">
                Subscribe
              </button>
            </motion.form>
            <motion.p variants={fadeUp} className="text-blue-300/50 text-xs mt-4">
              No spam. Unsubscribe any time.
            </motion.p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
