import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, QrCode, CalendarCheck, Globe, BedDouble,
  Users, BarChart3, ShieldCheck, ArrowRight, CheckCircle2,
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

// ─── Content ───────────────────────────────────────────────────────────────────
// StayNG is a management platform for hotels & guest houses — not a booking
// marketplace. The public site sells the product to hotel owners; guests reach
// an individual hotel only through that hotel's own /h/:slug page.
const STEPS = [
  { n: '1', title: 'List your property', desc: 'Add your hotel or guest house, rooms, rates and amenities in minutes.' },
  { n: '2', title: 'Share your booking link', desc: 'Every property gets its own branded page — put the link or QR anywhere your guests are.' },
  { n: '3', title: 'Run it from one dashboard', desc: 'Take bookings, check guests in and out, and track occupancy — all in one place.' },
];

const FEATURES = [
  { icon: CalendarCheck, title: 'Reservations', desc: 'See and manage every booking — pending, confirmed, checked-in — in a single view.', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  { icon: QrCode, title: 'Front Desk & QR Check-in', desc: 'Check guests in and out at the desk by scanning a booking QR or searching by name.', color: 'text-accent-600', bg: 'bg-accent-50', border: 'border-accent-100' },
  { icon: Globe, title: 'Your Own Booking Page', desc: 'A branded page for your property where guests view rooms and book you directly.', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { icon: BedDouble, title: 'Rooms & Availability', desc: 'Manage room types, rates and availability so your inventory is always accurate.', color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
  { icon: Users, title: 'Staff & Roles', desc: 'Invite your team and give front-desk and admin access scoped to your property.', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
  { icon: BarChart3, title: 'Reports & Occupancy', desc: 'Track bookings, revenue and occupancy at a glance to make better decisions.', color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100' },
];

const BENEFITS = [
  'No commission on your direct bookings',
  'Your brand, your booking page',
  'Multi-property ready',
  'NDPA-compliant data handling',
];

// ═══════════════════════════════════════════════════════════════════════════════
const HomePage: React.FC = () => {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 pt-20">
        {/* Animated orbs */}
        {[
          { cls: 'top-1/4 left-1/4 w-[28rem] h-[28rem] bg-blue-600/20', dur: 8 },
          { cls: 'bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/15', dur: 10 },
          { cls: 'top-1/2 right-1/3 w-64 h-64 bg-cyan-600/15', dur: 12 },
        ].map(({ cls, dur }, i) => (
          <motion.div
            key={i}
            className={`absolute ${cls} rounded-full blur-3xl`}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.55, 0.3] }}
            transition={{ duration: dur, repeat: Infinity, delay: i * 2 }}
          />
        ))}

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '64px 64px' }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center w-full">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-sm text-white/90">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Built for Nigerian hotels &amp; guest houses</span>
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-[1.1]">
              Run your hotel<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400">
                the smart way
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-blue-100/75 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              StayNG is the management platform for hotels and guest houses — take bookings on
              your own branded page and run front desk, reservations and reporting from one dashboard.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register" className="btn-accent py-3 px-7 flex items-center gap-2">
                List your hotel <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="py-3 px-7 rounded-xl border border-white/25 text-white/90 hover:bg-white/10 transition-colors text-sm font-semibold"
              >
                Sign in to your dashboard
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8">
              {BENEFITS.map((b) => (
                <span key={b} className="flex items-center gap-1.5 text-sm text-white/60">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {b}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-white border-b border-gray-100 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
            variants={stagger} className="text-center mb-14"
          >
            <motion.p variants={fadeUp} className="text-accent-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Up and running fast
            </motion.p>
            <motion.h2 variants={fadeUp} className="section-heading">How StayNG works</motion.h2>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {STEPS.map(({ n, title, desc }) => (
              <motion.div key={n} variants={fadeUp} className="text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-primary-900 text-white font-display font-bold text-lg mb-5">
                  {n}
                </div>
                <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────────── */}
      <section id="features" className="py-20 bg-gray-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Everything you need
            </motion.p>
            <motion.h2 variants={fadeUp} className="section-heading">One platform to run your property</motion.h2>
            <motion.p variants={fadeUp} className="section-sub mx-auto max-w-xl">
              From the front desk to your booking page, StayNG brings your operations together.
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {FEATURES.map(({ icon: Icon, title, desc, color, bg, border }) => (
              <motion.div key={title} variants={fadeUp}>
                <motion.div
                  whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300 }}
                  className={`card p-7 border ${border} h-full`}
                >
                  <div className={`inline-flex p-3.5 rounded-2xl ${bg} mb-5`}>
                    <Icon className={`h-6 w-6 ${color}`} />
                  </div>
                  <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Your own booking page highlight ──────────────────────────────────── */}
      <section id="booking-page" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
            <motion.p variants={fadeUp} className="text-accent-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Direct bookings
            </motion.p>
            <motion.h2 variants={fadeUp} className="section-heading text-left">Your property, your page</motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 leading-relaxed mt-4">
              Every hotel on StayNG gets its own branded booking page — like
              <span className="font-semibold text-gray-700"> stayng.com/h/your-hotel</span>. Share the
              link or a QR code and take reservations directly, with no marketplace competing for your guest.
            </motion.p>
            <motion.ul variants={fadeUp} className="mt-6 space-y-2.5">
              {['Only your rooms and rates — no rivals shown', 'Works from a link, QR code or your own site', 'Bookings flow straight into your dashboard'].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" style={{ width: '1.1rem', height: '1.1rem' }} /> {t}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="rounded-3xl bg-gradient-to-br from-[#0F2444] to-[#1A3A5C] p-8 shadow-2xl"
          >
            <div className="rounded-2xl bg-white/95 p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs text-gray-400">stayng.com/h/abc-hotels-and-suites</span>
              </div>
              <div className="h-24 rounded-xl bg-gradient-to-br from-[#0F2444] to-[#1A3A5C] mb-4 flex items-end p-3">
                <span className="text-white font-display font-bold">ABC Hotels &amp; Suites</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-lg border border-gray-100 p-2">
                    <div className="h-10 rounded bg-gray-100 mb-2" />
                    <div className="h-2 w-3/4 rounded bg-gray-200 mb-1" />
                    <div className="h-2 w-1/2 rounded bg-amber-300" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-primary-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 10, repeat: Infinity }}
        />
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
            <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to run your hotel smarter?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-blue-200/70 mb-8">
              Set up your property and start taking direct bookings today.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register" className="btn-accent py-3 px-7 flex items-center gap-2">
                Get started free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="py-3 px-7 rounded-xl border border-white/25 text-white/90 hover:bg-white/10 transition-colors text-sm font-semibold flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" /> Sign in
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
