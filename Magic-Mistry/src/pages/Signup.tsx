/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Wrench, Shield, Mail, Lock, Phone, UserCheck, Sparkles, Check, Info, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { hoverScale, buttonPress, pageTransition } from '../animations';

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const defaultRole = (location.state as any)?.defaultRole || UserRole.CUSTOMER;
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [passwordValue, setPasswordValue] = useState('');
  const [strength, setStrength] = useState({ score: 0, text: 'Very Weak', color: 'bg-red-500' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const watchPassword = watch('password');

  // Sync password value to measure strength
  useEffect(() => {
    setPasswordValue(watchPassword || '');
  }, [watchPassword]);

  // Live Password Strength Calculation
  useEffect(() => {
    if (!passwordValue) {
      setStrength({ score: 0, text: 'None', color: 'bg-slate-800' });
      return;
    }

    let score = 0;
    if (passwordValue.length >= 6) score += 1;
    if (passwordValue.length >= 10) score += 1;
    if (/[A-Z]/.test(passwordValue)) score += 1;
    if (/[0-9]/.test(passwordValue)) score += 1;
    if (/[^A-Za-z0-9]/.test(passwordValue)) score += 1;

    let text = 'Very Weak';
    let color = 'bg-red-500';

    if (score === 2) {
      text = 'Weak';
      color = 'bg-orange-500';
    } else if (score === 3) {
      text = 'Medium';
      color = 'bg-yellow-500';
    } else if (score === 4) {
      text = 'Strong';
      color = 'bg-emerald-500';
    } else if (score === 5) {
      text = 'Excellent';
      color = 'bg-cyan-500';
    }

    setStrength({ score, text, color });
  }, [passwordValue]);

  const onSubmit = async (data: any) => {
    if (!data.terms) {
      toast.error('You must accept the terms & conditions to register.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: UserRole.CUSTOMER,
      });

      toast.success('Account created! Please verify with the 6-digit OTP.');
      // Pass email as state so OTP verify page can prefill
      navigate('/verify-otp', { state: { email: data.email, purpose: 'REGISTER' } });
    } catch (error: any) {
      toast.error(error.message || 'Registration failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-950 text-slate-100 font-sans overflow-x-hidden"
    >
      {/* Left Column: Splash & Trust info */}
      <div className="hidden lg:flex lg:col-span-4 relative flex-col justify-between p-10 bg-gradient-to-br from-indigo-900/40 via-slate-950 to-blue-900/30 border-r border-slate-800">
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              MAGIC MISTRY
            </span>
          </div>
        </div>

        <div className="my-auto relative z-10 flex flex-col gap-6 max-w-sm">
          <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
            Join the Premier Network of Home Appliance Experts
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Create an account to quickly book repairs, schedule visits, download verified receipts, or join our technician pool to earn on your schedule.
          </p>

          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs text-slate-300">
                <strong>100% Secure Payments</strong> processed directly via standard channels.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs text-slate-300">
                <strong>Fully Vetted Mechanics</strong> with 5+ years of verified industry experience.
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>

      {/* Right Column: Interactive signup form */}
      <div className="lg:col-span-8 flex flex-col justify-center p-6 sm:p-12 relative bg-slate-950">
        <button
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 sm:top-10 sm:left-10 w-9 h-9 rounded-xl border border-slate-900 bg-slate-950/80 text-slate-400 hover:text-white hover:bg-slate-900 hover:border-slate-800 flex items-center justify-center transition-all shadow-lg group z-20"
          title="Close and Return to Home"
        >
          <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Create an Account</h2>
            <p className="text-slate-400 text-sm">Fill in your information to register on Magic Mistry.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className={`w-full bg-slate-900/80 border ${
                    errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:ring-blue-500'
                  } rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:border-transparent transition-all`}
                  {...registerField('name', {
                    required: 'Please enter your full name',
                    minLength: { value: 3, message: 'Name must be at least 3 characters long' },
                  })}
                />
              </div>
              {errors.name && <span className="text-xs text-red-400 mt-1">{errors.name.message}</span>}
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className={`w-full bg-slate-900/80 border ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:ring-blue-500'
                  } rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:border-transparent transition-all`}
                  {...registerField('email', {
                    required: 'Please enter your email',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address',
                    },
                  })}
                />
              </div>
              {errors.email && <span className="text-xs text-red-400 mt-1">{errors.email.message}</span>}
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+15550009999"
                  className={`w-full bg-slate-900/80 border ${
                    errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:ring-blue-500'
                  } rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:border-transparent transition-all`}
                  {...registerField('phone', {
                    required: 'Please enter your phone number',
                    pattern: {
                      value: /^\+?[\d\s-]{8,15}$/,
                      message: 'Please enter a valid phone number (e.g. +15551234567)',
                    },
                  })}
                />
              </div>
              {errors.phone && <span className="text-xs text-red-400 mt-1">{errors.phone.message}</span>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className={`w-full bg-slate-900/80 border ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:ring-blue-500'
                  } rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:border-transparent transition-all`}
                  {...registerField('password', {
                    required: 'Please enter a password',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                />
              </div>
              {errors.password && <span className="text-xs text-red-400 mt-1">{errors.password.message}</span>}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className={`w-full bg-slate-900/80 border ${
                    errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:ring-blue-500'
                  } rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:border-transparent transition-all`}
                  {...registerField('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === watchPassword || 'Passwords do not match',
                  })}
                />
              </div>
              {errors.confirmPassword && (
                <span className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</span>
              )}
            </div>

            {/* Password Strength Meter */}
            {passwordValue && (
              <div className="md:col-span-2 flex flex-col gap-1 p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-slate-400">Password Strength:</span>
                  <span
                    className={`${
                      strength.score <= 1
                        ? 'text-red-400'
                        : strength.score <= 3
                          ? 'text-yellow-400'
                          : 'text-emerald-400'
                    }`}
                  >
                    {strength.text}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-full flex-1 rounded-full transition-all duration-300 ${
                        i < strength.score ? strength.color : 'bg-slate-800'
                      }`}
                    ></div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                  <Info className="w-3 h-3 text-cyan-400" /> Use 10+ characters with capital letters, numbers & symbols
                </p>
              </div>
            )}



            {/* Terms checkbox */}
            <div className="md:col-span-2 flex items-start mt-2">
              <input
                id="terms"
                type="checkbox"
                className="h-4.5 w-4.5 rounded border-slate-800 bg-slate-900 text-blue-600 focus:ring-blue-500/30 mt-0.5"
                {...registerField('terms', { required: true })}
              />
              <label htmlFor="terms" className="ml-2.5 text-xs text-slate-400 leading-normal">
                I authorize Magic Mistry to collect, store, and process my contact coordinates in compliance with standard privacy policies and terms of service.
              </label>
            </div>

            {/* Submit */}
            <div className="md:col-span-2 mt-4">
              <motion.button
                type="submit"
                variants={buttonPress}
                whileHover="whileHover"
                whileTap="whileTap"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 hover:shadow-blue-500/20 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Create Account <UserCheck className="w-4.5 h-4.5" />
                  </>
                )}
              </motion.button>
            </div>
          </form>

          {/* Bottom link for mobile devices */}
          <div className="lg:hidden text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
