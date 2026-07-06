import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, User, LogOut, Menu, X, ChevronDown, MapPin } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { logout } from '../../store/authSlice';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const isTransparent = isHomePage && !isScrolled;

  const navLinks = [
    { to: '/#how-it-works', label: 'How it works' },
    { to: '/#features', label: 'Features' },
    { to: '/#booking-page', label: 'Your booking page' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isTransparent
            ? 'bg-transparent'
            : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 flex-shrink-0">
            <div className={`p-1.5 rounded-xl transition-colors ${isTransparent ? 'bg-white/20' : 'bg-primary-600'}`}>
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className={`text-xl font-display font-bold transition-colors ${isTransparent ? 'text-white' : 'text-gray-900'}`}>
              Stay<span className="text-accent-500">NG</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isTransparent
                    ? 'text-white/90 hover:text-white hover:bg-white/10'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Auth area */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all ${
                    isTransparent ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-semibold">
                    {user.firstName?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <span className="text-sm font-medium">{user.firstName}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 overflow-hidden"
                    >
                      <Link to="/profile" className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition-colors">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>My Profile</span>
                      </Link>
                      <Link to="/my-reservations" className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition-colors">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span>My Reservations</span>
                      </Link>
                      {(user.userType === 'admin' || user.userType === 'org_admin') && (
                        <Link to="/admin" className="flex items-center space-x-3 px-4 py-2.5 hover:bg-primary-50 text-sm text-primary-600 font-medium transition-colors">
                          <MapPin className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      )}
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={() => dispatch(logout())}
                        className="flex items-center space-x-3 px-4 py-2.5 hover:bg-red-50 text-sm text-red-600 w-full text-left transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all ${
                    isTransparent ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  Sign In
                </Link>
                <Link to="/register" className="btn-accent text-sm py-2 px-5">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isTransparent ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden bg-white border-t border-gray-100 shadow-lg"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map(({ to, label }) => (
                  <Link key={to} to={to} className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-600 font-medium transition-colors">
                    <span>{label}</span>
                  </Link>
                ))}
                <div className="border-t border-gray-100 pt-3 mt-3 space-y-2">
                  {isAuthenticated && user ? (
                    <>
                      <Link to="/profile" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                        <User className="h-5 w-5 text-gray-400" />
                        <span>{user.firstName}</span>
                      </Link>
                      <Link to="/my-reservations" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                        <Building2 className="h-5 w-5 text-gray-400" />
                        <span>My Reservations</span>
                      </Link>
                      <button
                        onClick={() => dispatch(logout())}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 w-full transition-colors"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col space-y-2 px-4">
                      <Link to="/login" className="btn-outline text-center text-sm">Sign In</Link>
                      <Link to="/register" className="btn-accent text-center text-sm">Get Started</Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className={`flex-grow ${isHomePage ? '' : 'pt-16 md:pt-20'}`}>{children}</main>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center space-x-2.5 mb-5">
                <div className="p-1.5 rounded-xl bg-primary-600">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-display font-bold">Stay<span className="text-accent-400">NG</span></span>
              </div>
              <p className="text-secondary-400 text-sm leading-relaxed">
                Nigeria's most trusted hotel booking platform. Find and book hotels across every state.
              </p>
              <div className="flex space-x-3 mt-6">
                {['f', 'in', '𝕏', 'ig'].map((s) => (
                  <div key={s} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors text-xs font-bold select-none">
                    {s}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider mb-5 text-secondary-400">Product</h4>
              <ul className="space-y-3 text-sm text-secondary-400">
                {[
                  { l: 'How it works', to: '/#how-it-works' },
                  { l: 'Features', to: '/#features' },
                  { l: 'Your booking page', to: '/#booking-page' },
                  { l: 'Sign in', to: '/login' },
                  { l: 'List your hotel', to: '/register' },
                ].map(({ l, to }) => (
                  <li key={l}><Link to={to} className="hover:text-white transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider mb-5 text-secondary-400">Company</h4>
              <ul className="space-y-3 text-sm text-secondary-400">
                {['About Us', 'Careers', 'Blog', 'Press', 'List Your Property'].map((l) => (
                  <li key={l}><Link to="/" className="hover:text-white transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider mb-5 text-secondary-400">Contact</h4>
              <ul className="space-y-3 text-sm text-secondary-400">
                <li>support@staynghotels.com</li>
                <li>+234 (0) 800 123 4567</li>
                <li>Lagos, Nigeria</li>
              </ul>
              <div className="mt-6 space-y-2">
                <p className="text-xs text-secondary-500 uppercase tracking-wider">Download our app</p>
                <div className="flex space-x-2">
                  {['App Store', 'Play Store'].map((s) => (
                    <div key={s} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer transition-colors text-xs font-medium">
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-secondary-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-secondary-500 text-sm">&copy; 2026 StayNG. All rights reserved.</p>
            <div className="flex space-x-6 text-sm text-secondary-500">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((l) => (
                <Link key={l} to="/" className="hover:text-white transition-colors">{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
