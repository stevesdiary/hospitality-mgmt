import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, Heart, Wifi, Dumbbell, Filter, ChevronDown, SlidersHorizontal, Tag, Loader2 } from 'lucide-react';
import { hotelService } from '@/services';
import { transformHotel, transformPaginatedResponse } from '@/utils/apiTransformers';
import type { Hotel } from '@/types';

const GRAD_COLORS = [
  'from-indigo-500 to-purple-700', 'from-cyan-500 to-blue-700', 'from-emerald-500 to-teal-700',
  'from-amber-500 to-orange-700', 'from-rose-500 to-pink-700', 'from-violet-500 to-indigo-700',
];
const getGrad = (index: number) => GRAD_COLORS[index % GRAD_COLORS.length];
const categoryLabel = (stars: number) => stars === 5 ? 'Luxury' : stars === 4 ? 'Standard' : 'Budget';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
      ))}
    </span>
  );
}

const CATEGORIES = ['All', 'Luxury', 'Standard', 'Budget'];
const SORT_OPTIONS = ['Recommended', 'Price: Low to High', 'Price: High to Low', 'Top Rated'];
const AMENITY_FILTERS = ['Wifi', 'Pool', 'Gym', 'Restaurant', 'Spa', 'Bar'];

const HotelsPage: React.FC = () => {
  const [hotels, setHotels] = useState<(Hotel & { grad: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Recommended');
  const [priceRange, setPriceRange] = useState(100000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await hotelService.getAllHotels({ limit: 50 });
        const data = response as any;
        const transformed = transformPaginatedResponse(data, 'Hotels', transformHotel);
        setHotels(transformed.items.map((h, i) => ({ ...h, grad: getGrad(i) })));
      } catch (err: any) {
        setError(err.message || 'Failed to load hotels');
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const toggleAmenity = (a: string) =>
    setSelectedAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const filtered = hotels.filter((h) => {
    const cat = categoryLabel(h.starRating);
    if (selectedCategory !== 'All' && cat !== selectedCategory) return false;
    if (h.priceRange.min > priceRange) return false;
    if (selectedAmenities.length > 0 && !selectedAmenities.every((a) => h.amenities.some(am => am.toLowerCase().includes(a.toLowerCase())))) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.priceRange.min - b.priceRange.min;
    if (sortBy === 'Price: High to Low') return b.priceRange.min - a.priceRange.min;
    if (sortBy === 'Top Rated') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Failed to load hotels</h3>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-accent text-sm">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-1">Browse Hotels</h1>
            <p className="text-gray-500 text-sm">{filtered.length} properties found across Nigeria</p>
          </motion.div>

          <div className="flex items-center space-x-2 mt-6 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <motion.button key={cat} onClick={() => setSelectedCategory(cat)} whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${selectedCategory === cat ? 'bg-primary-600 text-white shadow-sm shadow-primary-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {cat}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 flex-shrink-0">
            <button onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-200 mb-4 text-sm font-medium">
              <span className="flex items-center gap-2"><SlidersHorizontal className="h-4 w-4" /> Filters</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {(showFilters || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="lg:opacity-100 lg:h-auto overflow-hidden lg:overflow-visible">
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Tag className="h-4 w-4 text-primary-500" /> Price Range
                      </h3>
                      <input type="range" min={10000} max={100000} step={5000} value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full accent-primary-600" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>₦10K</span>
                        <span className="font-semibold text-primary-600">Up to ₦{(priceRange / 1000).toFixed(0)}K</span>
                        <span>₦100K</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Filter className="h-4 w-4 text-primary-500" /> Amenities
                      </h3>
                      <div className="space-y-2">
                        {AMENITY_FILTERS.map((a) => (
                          <label key={a} className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" checked={selectedAmenities.includes(a)} onChange={() => toggleAmenity(a)}
                              className="w-4 h-4 rounded accent-primary-600 cursor-pointer" />
                            <span className={`text-sm ${selectedAmenities.includes(a) ? 'text-primary-600 font-medium' : 'text-gray-600'} group-hover:text-primary-600 transition-colors`}>
                              {a}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {selectedAmenities.length > 0 && (
                      <button onClick={() => { setSelectedAmenities([]); setPriceRange(100000); setSelectedCategory('All'); }}
                        className="w-full text-sm text-red-500 hover:text-red-700 font-medium transition-colors">
                        Clear all filters
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm text-gray-500">{filtered.length} hotels</span>
              <div className="relative">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl text-sm px-4 py-2 pr-9 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer font-medium text-gray-700">
                  {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((hotel) => (
                <motion.div key={hotel.id} variants={fadeUp} layout>
                  <motion.div whileHover={{ y: -5, scale: 1.01 }} transition={{ type: 'spring', stiffness: 300 }} className="card overflow-hidden group">
                    <div className={`relative h-44 bg-gradient-to-br ${hotel.grad}`}>
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                      <button onClick={() => setLiked((p) => ({ ...p, [hotel.id]: !p[hotel.id] }))}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all">
                        <Heart className={`h-4 w-4 ${liked[hotel.id] ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                      </button>
                      <span className="absolute bottom-3 left-3 text-xs font-semibold text-white bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-md">
                        {categoryLabel(hotel.starRating)}
                      </span>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <Stars rating={hotel.rating || 0} />
                        <span className="text-xs text-gray-400">{hotel.reviewCount?.toLocaleString()}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm mt-1 mb-0.5 line-clamp-1">{hotel.name}</h3>
                      <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                        <MapPin className="h-3 w-3" />
                        <span>{hotel.city}, {hotel.state}</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {hotel.amenities.slice(0, 3).map((a) => (
                          <span key={a} className="inline-flex items-center gap-1 text-[10px] font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                            {a.includes('WiFi') ? <Wifi className="h-2.5 w-2.5" /> : a === 'Gym' ? <Dumbbell className="h-2.5 w-2.5" /> : null}
                            {a}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-base font-bold text-primary-700">₦{hotel.priceRange.min.toLocaleString()}</span>
                          <span className="text-xs text-gray-400"> /night</span>
                        </div>
                        <Link to={`/hotels/${hotel.id}`} className="btn-accent text-xs py-1.5 px-3">View Deal</Link>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            {filtered.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <div className="text-5xl mb-4">🏨</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No hotels found</h3>
                <p className="text-gray-400 text-sm">Try adjusting your filters</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelsPage;
