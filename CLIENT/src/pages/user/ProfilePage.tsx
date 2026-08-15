import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, Camera, Save, Lock, Loader2 } from 'lucide-react';
import type { RootState } from '../../store';
import { updateUser } from '../../store/authSlice';
import { userService, authService, apiService } from '../../services';
import toast from 'react-hot-toast';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [tab, setTab] = useState<'info' | 'password'>('info');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      phoneNumber: (user as any)?.phoneNumber ?? '',
    },
  });

  const onSaveProfile = async (data: any) => {
    if (!user?.id) return;
    setSaving(true);
    try {
      await userService.updateUser(user.id, {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
      } as any);
      dispatch(updateUser({ firstName: data.firstName, lastName: data.lastName, phoneNumber: data.phoneNumber } as any));
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const onPickAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    setUploading(true);
    try {
      const { url } = await apiService.uploadImage(file);
      await userService.updateUser(user.id, { avatarUrl: url } as any);
      dispatch(updateUser({ avatarUrl: url } as any));
      toast.success('Photo updated!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to upload photo.');
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const sendResetLink = async () => {
    if (!user?.email) return;
    setSendingReset(true);
    try {
      await authService.forgotPassword(user.email);
      toast.success('Password reset link sent to your email.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Could not send reset link.');
    } finally {
      setSendingReset(false);
    }
  };

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || 'U';
  const avatarUrl = (user as any)?.avatarUrl;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : initials}
              </div>
              <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={onPickAvatar} />
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                disabled={uploading}
                title="Change photo"
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                {uploading ? <Loader2 className="h-3.5 w-3.5 text-gray-500 animate-spin" /> : <Camera className="h-3.5 w-3.5 text-gray-500" />}
              </button>
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h1>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <span className="badge badge-primary mt-1.5 text-xs capitalize">{(user as any)?.userType ?? 'Guest'}</span>
            </div>
          </motion.div>

          <div className="flex gap-1 mt-6">
            {(['info', 'password'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t ? 'bg-primary-600 text-white' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}>
                {t === 'info' ? 'Personal Info' : 'Password'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tab === 'info' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 p-6">
            <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-gray-400" /> First Name
                  </label>
                  <input type="text" {...register('firstName', { required: 'Required' })}
                    className={`input-field ${errors.firstName ? 'border-red-400' : ''}`} />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-gray-400" /> Last Name
                  </label>
                  <input type="text" {...register('lastName', { required: 'Required' })}
                    className={`input-field ${errors.lastName ? 'border-red-400' : ''}`} />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-gray-400" /> Email Address
                </label>
                <input type="email" {...register('email')} disabled className="input-field bg-gray-50 cursor-not-allowed text-gray-400" />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed. Contact support if needed.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-gray-400" /> Phone Number
                </label>
                <input type="tel" {...register('phoneNumber')} placeholder="08012345678" className="input-field" />
              </div>

              <div className="pt-2">
                <motion.button type="submit" disabled={saving} whileTap={{ scale: 0.98 }} className="btn-primary flex items-center gap-2">
                  {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? 'Saving…' : 'Save Changes'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {tab === 'password' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 p-6 max-w-md">
            <div className="flex items-start gap-3 mb-5">
              <div className="p-2 bg-primary-50 rounded-xl">
                <Lock className="h-4 w-4 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Reset your password</h3>
                <p className="text-sm text-gray-500 mt-1">
                  We&apos;ll email a secure link to <span className="font-medium text-gray-700">{user?.email}</span> that lets
                  you set a new password. The link expires shortly for your security.
                </p>
              </div>
            </div>
            <motion.button onClick={sendResetLink} disabled={sendingReset} whileTap={{ scale: 0.98 }} className="btn-primary flex items-center gap-2">
              {sendingReset ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Mail className="h-4 w-4" />}
              {sendingReset ? 'Sending…' : 'Send reset link'}
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
