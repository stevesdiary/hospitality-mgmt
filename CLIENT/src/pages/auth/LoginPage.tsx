import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setLoading, loginSuccess, setError } from '../../store/authSlice';
import { authService } from '../../services';
import toast from 'react-hot-toast';

interface LoginForm {
  email: string;
  password: string;
}

const schema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.email': 'Enter a valid email address',
    'string.empty': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'string.empty': 'Password is required',
  }),
});

const LoginPage: React.FC = () => {
  const [showPw, setShowPw] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: joiResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      dispatch(setLoading(true));
      const result = await authService.login(data);
      dispatch(loginSuccess({ token: result.token, user: result.user }));
      toast.success(`Welcome back!`);
      // Hotel staff run operations from the management console; send them there.
      const isStaff = result.user?.userType === 'admin' || result.user?.userType === 'org_admin';
      navigate(isStaff ? '/admin' : '/my-reservations');
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Login failed. Please try again.';
      dispatch(setError(msg));
      toast.error(msg);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-gray-900">Welcome back</h2>
        <p className="text-gray-500 mt-2 text-sm">Sign in to your StayNG account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400 pointer-events-none" style={{ width: '1.1rem', height: '1.1rem' }} />
            <input
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              className={`input-field pl-10 ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
            />
          </div>
          {errors.email && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1">
              {errors.email.message}
            </motion.p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <Link to="/forgot-password" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" style={{ width: '1.1rem', height: '1.1rem' }} />
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
              className={`input-field pl-10 pr-11 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              {showPw ? <EyeOff style={{ width: '1.1rem', height: '1.1rem' }} /> : <Eye style={{ width: '1.1rem', height: '1.1rem' }} />}
            </button>
          </div>
          {errors.password && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </motion.p>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileTap={{ scale: 0.98 }}
          className="btn-primary w-full py-3 mt-1"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing in…
            </span>
          ) : 'Sign In'}
        </motion.button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
          Create one free
        </Link>
      </p>
    </>
  );
};

export default LoginPage;
