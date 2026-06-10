import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      {/* Decorative left panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden flex-col justify-between p-12">
        <motion.div
          className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />

        <Link to="/" className="relative z-10 flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-white/20">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-display font-bold text-white">
            Stay<span className="text-amber-300">NG</span>
          </span>
        </Link>

        <div className="relative z-10">
          <h2 className="text-4xl font-display font-bold text-white mb-4 leading-tight">
            Nigeria's #1<br />Hotel Booking<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">Platform</span>
          </h2>
          <p className="text-blue-200/70 text-base leading-relaxed">
            Over 5,000 hotels, apartments and shortlets across every state in Nigeria.
          </p>
        </div>

        <div className="relative z-10 flex space-x-10">
          {[['5K+', 'Hotels'], ['36', 'States'], ['4.8★', 'Rating']].map(([val, lbl]) => (
            <div key={lbl}>
              <div className="text-2xl font-bold text-white">{val}</div>
              <div className="text-blue-300/60 text-sm">{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-7/12 flex items-center justify-center bg-white px-6 py-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center space-x-2 mb-8 lg:hidden">
            <Building2 className="h-6 w-6 text-primary-600" />
            <span className="text-xl font-display font-bold">Stay<span className="text-accent-500">NG</span></span>
          </Link>
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
