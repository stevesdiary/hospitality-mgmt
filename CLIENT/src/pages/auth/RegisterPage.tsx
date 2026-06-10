import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setLoading, loginSuccess, setError } from '../../store/authSlice';
import { authService } from '../../services';
import toast from 'react-hot-toast';

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const schema = Joi.object({
  firstName: Joi.string().min(2).required().messages({ 'string.empty': 'First name is required', 'string.min': 'At least 2 characters' }),
  lastName: Joi.string().min(2).required().messages({ 'string.empty': 'Last name is required', 'string.min': 'At least 2 characters' }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({ 'string.email': 'Valid email required', 'string.empty': 'Email is required' }),
  phoneNumber: Joi.string().pattern(/^(?:\+?234|0)\d{10}$/).required().messages({
    'string.pattern.base': 'Enter a valid Nigerian phone number (e.g. 08012345678)',
    'string.empty': 'Phone number is required',
  }),
  password: Joi.string().min(8).required().messages({ 'string.min': 'Minimum 8 characters', 'string.empty': 'Password is required' }),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({ 'any.only': 'Passwords do not match' }),
});

const InputField = ({ label, error, icon: Icon, children }: {
  label: string; error?: string; icon: React.ElementType; children: React.ReactNode;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" style={{ width: '1rem', height: '1rem' }} />
      {children}
    </div>
    {error && (
      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1">
        {error}
      </motion.p>
    )}
  </div>
);

const RegisterPage: React.FC = () => {
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: joiResolver(schema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      dispatch(setLoading(true));
      const { confirmPassword: _, ...payload } = data;
      const result = await authService.register(payload);
      dispatch(loginSuccess({ token: result.token, user: result.user }));
      toast.success('Account created! Welcome to StayNG.');
      navigate('/');
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Registration failed. Please try again.';
      dispatch(setError(msg));
      toast.error(msg);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-gray-900">Create account</h2>
        <p className="text-gray-500 mt-2 text-sm">Join StayNG and discover the best hotels</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <InputField label="First Name" error={errors.firstName?.message} icon={User}>
            <input
              type="text"
              placeholder="Chidi"
              {...register('firstName')}
              className={`input-field pl-9 ${errors.firstName ? 'border-red-400 focus:ring-red-400' : ''}`}
            />
          </InputField>
          <InputField label="Last Name" error={errors.lastName?.message} icon={User}>
            <input
              type="text"
              placeholder="Okonkwo"
              {...register('lastName')}
              className={`input-field pl-9 ${errors.lastName ? 'border-red-400 focus:ring-red-400' : ''}`}
            />
          </InputField>
        </div>

        <InputField label="Email Address" error={errors.email?.message} icon={Mail}>
          <input
            type="email"
            placeholder="chidi@example.com"
            {...register('email')}
            className={`input-field pl-9 ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
          />
        </InputField>

        <InputField label="Phone Number" error={errors.phoneNumber?.message} icon={Phone}>
          <input
            type="tel"
            placeholder="08012345678"
            {...register('phoneNumber')}
            className={`input-field pl-9 ${errors.phoneNumber ? 'border-red-400 focus:ring-red-400' : ''}`}
          />
        </InputField>

        <InputField label="Password" error={errors.password?.message} icon={Lock}>
          <input
            type={showPw ? 'text' : 'password'}
            placeholder="Min. 8 characters"
            {...register('password')}
            className={`input-field pl-9 pr-11 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
          />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
            {showPw ? <EyeOff style={{ width: '1rem', height: '1rem' }} /> : <Eye style={{ width: '1rem', height: '1rem' }} />}
          </button>
        </InputField>

        <InputField label="Confirm Password" error={errors.confirmPassword?.message} icon={Lock}>
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Repeat password"
            {...register('confirmPassword')}
            className={`input-field pl-9 pr-11 ${errors.confirmPassword ? 'border-red-400 focus:ring-red-400' : ''}`}
          />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
            {showConfirm ? <EyeOff style={{ width: '1rem', height: '1rem' }} /> : <Eye style={{ width: '1rem', height: '1rem' }} />}
          </button>
        </InputField>

        <p className="text-xs text-gray-400 leading-relaxed">
          By creating an account you agree to our{' '}
          <Link to="/" className="text-primary-600 hover:underline">Terms of Service</Link> and{' '}
          <Link to="/" className="text-primary-600 hover:underline">Privacy Policy</Link>.
        </p>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileTap={{ scale: 0.98 }}
          className="btn-accent w-full py-3"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account…
            </span>
          ) : 'Create Account'}
        </motion.button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Sign in</Link>
      </p>
    </>
  );
};

export default RegisterPage;
