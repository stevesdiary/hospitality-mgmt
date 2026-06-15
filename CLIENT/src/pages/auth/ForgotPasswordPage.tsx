import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { authService } from '../../services';
import toast from 'react-hot-toast';

const schema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.email': 'Enter a valid email address',
    'string.empty': 'Email is required',
  }),
});

const ForgotPasswordPage: React.FC = () => {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm({
    resolver: joiResolver(schema),
  });

  const onSubmit = async (data: { email: string }) => {
    try {
      await authService.forgotPassword(data.email);
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <div className="inline-flex p-4 bg-emerald-50 rounded-2xl mb-5">
          <CheckCircle className="h-10 w-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Check your inbox</h2>
        <p className="text-gray-500 text-sm mb-1">We sent a reset link to</p>
        <p className="font-semibold text-gray-800 mb-6">{getValues('email')}</p>
        <p className="text-xs text-gray-400 mb-6">Didn't receive it? Check your spam folder or try again.</p>
        <button onClick={() => setSent(false)} className="btn-outline text-sm w-full mb-3">Try again</button>
        <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Sign In
        </Link>
      </motion.div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-gray-900">Forgot password?</h2>
        <p className="text-gray-500 mt-2 text-sm">Enter your email and we'll send a reset link</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" style={{ width: '1.1rem', height: '1.1rem' }} />
            <input
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              className={`input-field pl-10 ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
            />
          </div>
          {errors.email && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1">
              {errors.email.message as string}
            </motion.p>
          )}
        </div>

        <motion.button type="submit" disabled={isSubmitting} whileTap={{ scale: 0.98 }} className="btn-accent w-full py-3">
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending…
            </span>
          ) : 'Send Reset Link'}
        </motion.button>
      </form>

      <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors mt-6">
        <ArrowLeft className="h-4 w-4" /> Back to Sign In
      </Link>
    </>
  );
};

export default ForgotPasswordPage;
