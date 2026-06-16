import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Star, Heart, Calendar, Users, SlidersHorizontal, X, Wifi, Dumbbell, Tag } from 'lucide-react';
import { DUMMY_HOTELS } from '@/data/dummy';

const GRAD: Record<string, string> = {
  'h-001': 'from-indigo-500 to-purple-700', 'h-002': 'from-cyan-500 to-blue-700',
  'h-003': 'from-emerald-500 to-teal-700',  'h-004': 'from-amber-500 to-orange-700',
  'h-005': 'from-rose-500 to-pink-700',     'h-006': 'from-violet-500 to-indigo-700',
};
const categoryLabel = (stars: number) => stars === 5 ? 'Luxury' : stars === 4 ? 'Standard' : 'Budget';

const ALL_HOTELS = DUMMY_HOTELS.map((h) => ({
  id: h.id, name: h.name, city: h.city,
  rating: h.rating ?? 0, price: h.priceRange.min,
  category: categoryLabel(h.starRating),
  grad: GRAD[h.id] ?? 'from-gray-400 to-gray-600',
  amenities: h.amenities.slice(0, 3),
}));

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
      ))}
    </span>
  );
}

type ActiveFilter = { type: string; value: string };

const SearchHotelsPage: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const [location, setLocation] = useState(params.get('location') ?? '');
  const [checkIn, setCheckIn] = useState(params.get('checkIn') ?? '');
  const [checkOut, setCheckOut] = useState(params.get('checkOut') ?? '');
  const [guests, setGuests] = useState(params.get('guests') ?? '1');
  const [priceMax, setPriceMax] = useState(100000);
  const [selectedCat, setSelectedCat] = useState('All');
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  useEffect(() => {
    const newFilters: ActiveFilter[] = [];
    if (location) newFilters.push({ type: 'location', value: location });
    if (selectedCat !== 'All') newFilters.push({ type: 'category', value: selectedCat });
    if (priceMax < 100000) newFilters.push({ type: 'price', value: `Up to ₦${(priceMax / 1000).toFixed(0)}K` });
    setActiveFilters(newFilters);
  }, [location, selectedCat, priceMax]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams({ location, checkIn, checkOut, guests });
  };

  const removeFilter = (f: ActiveFilter) => {
    if (f.type === 'location') setLocation('');
    if (f.type === 'category') setSelectedCat('All');
    if (f.type === 'price') setPriceMax(100000);
  };

  const results = ALL_HOTELS.filter((h) => {
    if (location && !h.city.toLowerCase().includes(location.toLowerCase()) && !h.name.toLowerCase().includes(location.toLowerCase())) return false;
    if (selectedCat !== 'All' && h.category !== selectedCat) return false;
    if (h.price > priceMax) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            <div className="relative sm:col-span-2 md:col-span-2">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input type="text" placeholder="City, hotel or area…" value={location} onChange={(e) => setLocation(e.target.value)} className="input-field pl-10" />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="input-field pl-10" />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="input-field pl-10" />
            </div>
            <button type="submit" className="btn-accent flex items-center justify-center gap-2">
              <Search className="h-4 w-4" /><span>Search</span>
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-gray-500 font-medium">
              <span className="text-gray-900 font-bold">{results.length}</span> hotels found
              {location && <span className="text-primary-600"> in "{location}"</span>}
            </span>
            <AnimatePresence>
              {activeFilters.map((f) => (
                <motion.span key={f.value} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  {f.value}
                  <button onClick={() => removeFilter(f)}><X className="h-3 w-3 hover:text-primary-900" /></button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <button onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${showFilterPanel ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-200 hover:border-primary-400'}`}>
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>

        <AnimatePresence>
          {showFilterPanel && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Category</h4>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Luxury', 'Standard', 'Budget'].map((c) => (
                      <button key={c} onClick={() => setSelectedCat(c)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCat === c ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Max Price: <span className="text-primary-600">₦{(priceMax / 1000).toFixed(0)}K/night</span>
                  </h4>
                  <input type="range" min={10000} max={350000} step={5000} value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} className="w-full accent-primary-600" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Guests</h4>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <select value={guests} onChange={(e) => setGuests(e.target.value)} className="input-field pl-9">
                      {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((hotel) => (
            <motion.div key={hotel.id} variants={fadeUp} layout>
              <motion.div whileHover={{ y: -5, scale: 1.01 }} transition={{ type: 'spring', stiffness: 300 }} className="card overflow-hidden group">
                <div className={`relative h-44 bg-gradient-to-br ${hotel.grad}`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                  <button onClick={() => setLiked((p) => ({ ...p, [hotel.id]: !p[hotel.id] }))}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all">
                    <Heart className={`h-4 w-4 ${liked[hotel.id] ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                  </button>
                  <span className="absolute bottom-3 left-3 text-xs font-semibold text-white bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-md">{hotel.category}</span>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <Stars rating={hotel.rating} />
                    <span className="text-xs text-gray-400">{hotel.rating}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mt-1 mb-0.5 line-clamp-1">{hotel.name}</h3>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                    <MapPin className="h-3 w-3" /><span>{hotel.city}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {hotel.amenities.map((a) => (
                      <span key={a} className="inline-flex items-center gap-1 text-[10px] font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {a.includes('WiFi') ? <Wifi className="h-2.5 w-2.5" /> : a === 'Gym' ? <Dumbbell className="h-2.5 w-2.5" /> : <Tag className="h-2.5 w-2.5" />}
                        {a}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-primary-700">₦{hotel.price.toLocaleString()}</span>
                      <span className="text-xs text-gray-400"> /night</span>
                    </div>
                    <Link to={`/hotels/${hotel.id}`} className="btn-accent text-xs py-1.5 px-3">View</Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {results.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No results found</h3>
            <p className="text-gray-400 text-sm mb-4">Try a different city name or adjust filters</p>
            <button onClick={() => { setLocation(''); setSelectedCat('All'); setPriceMax(100000); }} className="btn-outline text-sm">Clear search</button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchHotelsPage;
