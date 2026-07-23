import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { Mail, Lock, Eye, EyeOff, User, Phone, Building2, MapPin } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setLoading, loginSuccess, setError } from '../../store/authSlice';
import { authService } from '../../services';
import toast from 'react-hot-toast';

interface OnboardForm {
  hotelName: string;
  contactEmail: string;
  address: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const schema = Joi.object({
  hotelName: Joi.string().min(2).required().messages({ 'string.empty': 'Hotel name is required', 'string.min': 'At least 2 characters' }),
  contactEmail: Joi.string().email({ tlds: { allow: false } }).required().messages({ 'string.email': 'Valid email required', 'string.empty': 'Hotel contact email is required' }),
  address: Joi.string().allow('').optional(),
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

const inputCls = 'w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm';

const OnboardHotelPage: React.FC = () => {
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<OnboardForm>({
    resolver: joiResolver(schema),
  });

  const onSubmit = async (data: OnboardForm) => {
    try {
      dispatch(setLoading(true));
      const result = await authService.onboardHotel({
        company: { name: data.hotelName, contactEmail: data.contactEmail, contactPhone: data.phoneNumber, address: data.address || undefined },
        admin: { firstName: data.firstName, lastName: data.lastName, email: data.email, phoneNumber: data.phoneNumber, password: data.password },
      });
      dispatch(loginSuccess({ token: result.token, user: result.user }));
      toast.success(`Welcome to StayNG, ${data.hotelName}!`);
      // New hotel admins go straight to their management console.
      navigate('/admin');
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Onboarding failed. Please try again.';
      dispatch(setError(msg));
      toast.error(msg);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-gray-900">List your hotel</h2>
        <p className="text-gray-500 mt-2 text-sm">Set up your property and your management account — you&apos;ll land straight in your dashboard.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Your property</p>
          <div className="space-y-4">
            <InputField label="Hotel / guest house name" error={errors.hotelName?.message} icon={Building2}>
              <input {...register('hotelName')} className={inputCls} placeholder="ABC Hotels & Suites" />
            </InputField>
            <InputField label="Hotel contact email" error={errors.contactEmail?.message} icon={Mail}>
              <input {...register('contactEmail')} type="email" className={inputCls} placeholder="reservations@abchotels.com" />
            </InputField>
            <InputField label="Address (optional)" error={errors.address?.message} icon={MapPin}>
              <input {...register('address')} className={inputCls} placeholder="Victoria Island, Lagos" />
            </InputField>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Your admin account</p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <InputField label="First name" error={errors.firstName?.message} icon={User}>
                <input {...register('firstName')} className={inputCls} placeholder="Ada" />
              </InputField>
              <InputField label="Last name" error={errors.lastName?.message} icon={User}>
                <input {...register('lastName')} className={inputCls} placeholder="Obi" />
              </InputField>
            </div>
            <InputField label="Your email" error={errors.email?.message} icon={Mail}>
              <input {...register('email')} type="email" className={inputCls} placeholder="ada@abchotels.com" />
            </InputField>
            <InputField label="Phone number" error={errors.phoneNumber?.message} icon={Phone}>
              <input {...register('phoneNumber')} className={inputCls} placeholder="08012345678" />
            </InputField>
            <InputField label="Password" error={errors.password?.message} icon={Lock}>
              <input {...register('password')} type={showPw ? 'text' : 'password'} className={inputCls} placeholder="Minimum 8 characters" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </InputField>
            <InputField label="Confirm password" error={errors.confirmPassword?.message} icon={Lock}>
              <input {...register('confirmPassword')} type={showConfirm ? 'text' : 'password'} className={inputCls} placeholder="Re-enter password" />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </InputField>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-accent w-full py-3 disabled:opacity-60">
          {isSubmitting ? 'Setting up…' : 'Create my hotel account'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">Sign in</Link>
      </p>
    </>
  );
};

export default OnboardHotelPage;
