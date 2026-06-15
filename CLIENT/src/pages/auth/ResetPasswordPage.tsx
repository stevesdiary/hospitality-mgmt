import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
import { authService } from '../../services';
import toast from 'react-hot-toast';

interface ResetForm { password: string; confirmPassword: string; }

const schema = Joi.object({
  password: Joi.string().min(8).required().messages({ 'string.min': 'Minimum 8 characters', 'string.empty': 'Password is required' }),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({ 'any.only': 'Passwords do not match' }),
});

const ResetPasswordPage: React.FC = () => {
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') ?? '';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetForm>({
    resolver: joiResolver(schema),
  });

  const onSubmit = async (data: ResetForm) => {
    try {
      await authService.resetPassword(token, data.password);
      setDone(true);
    } catch {
      toast.error('Reset link is invalid or expired. Please request a new one.');
    }
  };

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <div className="inline-flex p-4 bg-emerald-50 rounded-2xl mb-5">
          <CheckCircle className="h-10 w-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Password updated!</h2>
        <p className="text-gray-500 text-sm mb-8">You can now sign in with your new password.</p>
        <button onClick={() => navigate('/login')} className="btn-accent w-full py-3">Go to Sign In</button>
      </motion.div>
    );
  }

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-gray-500 text-sm mb-4">Invalid or missing reset token.</p>
        <Link to="/forgot-password" className="btn-accent">Request new link</Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-gray-900">Set new password</h2>
        <p className="text-gray-500 mt-2 text-sm">Choose a strong password for your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" style={{ width: '1.1rem', height: '1.1rem' }} />
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              {...register('password')}
              className={`input-field pl-10 pr-11 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              {showPw ? <EyeOff style={{ width: '1.1rem', height: '1.1rem' }} /> : <Eye style={{ width: '1.1rem', height: '1.1rem' }} />}
            </button>
          </div>
          {errors.password && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1">{errors.password.message}</motion.p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" style={{ width: '1.1rem', height: '1.1rem' }} />
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repeat password"
              {...register('confirmPassword')}
              className={`input-field pl-10 pr-11 ${errors.confirmPassword ? 'border-red-400 focus:ring-red-400' : ''}`}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              {showConfirm ? <EyeOff style={{ width: '1.1rem', height: '1.1rem' }} /> : <Eye style={{ width: '1.1rem', height: '1.1rem' }} />}
            </button>
          </div>
          {errors.confirmPassword && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</motion.p>}
        </div>

        <motion.button type="submit" disabled={isSubmitting} whileTap={{ scale: 0.98 }} className="btn-accent w-full py-3">
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Updating…
            </span>
          ) : 'Update Password'}
        </motion.button>
      </form>

      <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors mt-6">
        <ArrowLeft className="h-4 w-4" /> Back to Sign In
      </Link>
    </>
  );
};

export default ResetPasswordPage;
