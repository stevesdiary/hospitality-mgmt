import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Globe, Shield, Trash2, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${checked ? 'bg-primary-600' : 'bg-gray-200'}`}
    >
      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

const SettingsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [notifs, setNotifs] = useState({ email: true, sms: false, deals: true, reminders: true });
  const [prefs, setPrefs] = useState({ currency: 'NGN', language: 'en', darkMode: false });

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleNotif = (key: keyof typeof notifs) => setNotifs((p) => ({ ...p, [key]: !p[key] }));

  const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
    <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
        <div className="p-2 bg-primary-50 rounded-xl">
          <Icon className="h-4 w-4 text-primary-600" />
        </div>
        <h2 className="font-display font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );

  const Row = ({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-1">Account Settings</h1>
            <p className="text-gray-500 text-sm">Manage your preferences and account</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="visible" className="space-y-5">
          {/* Notifications */}
          <Section title="Notifications" icon={Bell}>
            <Row label="Email notifications" desc="Receive booking confirmations and updates via email">
              <Toggle checked={notifs.email} onChange={() => toggleNotif('email')} />
            </Row>
            <Row label="SMS notifications" desc="Get text messages for check-in reminders">
              <Toggle checked={notifs.sms} onChange={() => toggleNotif('sms')} />
            </Row>
            <Row label="Deals &amp; offers" desc="Be the first to know about exclusive hotel deals">
              <Toggle checked={notifs.deals} onChange={() => toggleNotif('deals')} />
            </Row>
            <Row label="Booking reminders" desc="Reminders before your check-in date">
              <Toggle checked={notifs.reminders} onChange={() => toggleNotif('reminders')} />
            </Row>
          </Section>

          {/* Preferences */}
          <Section title="Preferences" icon={Globe}>
            <Row label="Currency" desc="Default currency for prices">
              <select value={prefs.currency} onChange={(e) => setPrefs((p) => ({ ...p, currency: e.target.value }))}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="NGN">₦ Nigerian Naira</option>
                <option value="USD">$ US Dollar</option>
                <option value="GBP">£ British Pound</option>
              </select>
            </Row>
            <Row label="Language" desc="Display language">
              <select value={prefs.language} onChange={(e) => setPrefs((p) => ({ ...p, language: e.target.value }))}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="en">English</option>
                <option value="yo">Yorùbá</option>
                <option value="ig">Igbo</option>
                <option value="ha">Hausa</option>
              </select>
            </Row>
            <Row label="Dark Mode" desc="Switch to dark theme">
              <Toggle checked={prefs.darkMode} onChange={() => setPrefs((p) => ({ ...p, darkMode: !p.darkMode }))} />
            </Row>
          </Section>

          {/* Security */}
          <Section title="Security" icon={Shield}>
            <Row label="Two-Factor Authentication" desc="Add an extra layer of security to your account">
              <button className="btn-outline text-xs py-1.5 px-3">Enable</button>
            </Row>
            <Row label="Active sessions" desc="Manage devices logged in to your account">
              <button className="text-xs text-primary-600 hover:text-primary-700 font-semibold transition-colors">Manage</button>
            </Row>
            <Row label="Download my data" desc="Get a copy of all your account data">
              <button onClick={() => toast.success('Data export requested. You'll receive an email shortly.')} className="text-xs text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                Request
              </button>
            </Row>
          </Section>

          {/* Danger zone */}
          <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-red-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-red-50 flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-xl">
                <Trash2 className="h-4 w-4 text-red-500" />
              </div>
              <h2 className="font-display font-semibold text-gray-900">Danger Zone</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">Delete Account</p>
                  <p className="text-xs text-gray-400 mt-0.5">Permanently delete your account and all data</p>
                </div>
                <button onClick={() => toast.error('Account deletion requires contacting support.')} className="text-xs bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-3 py-1.5 rounded-lg transition-colors">
                  Delete
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">Sign Out</p>
                  <p className="text-xs text-gray-400 mt-0.5">Sign out of your account on this device</p>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded-lg transition-colors">
                  <LogOut className="h-3.5 w-3.5" /> Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
