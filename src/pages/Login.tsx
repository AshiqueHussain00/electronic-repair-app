/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, LogIn, ArrowRight, ShieldCheck, Sparkles, Star, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { hoverScale, buttonPress, pageTransition } from '../animations';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password, data.rememberMe);
      toast.success('Welcome back to Magic Mistry!');
      // Navigate to home/dashboard - AuthContext logic handles redirection but standard redirect helps
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.success('Connecting with Google Secure OAuth...');
    // Simulated Google Login redirecting to customer profile or default mock profile
    setTimeout(() => {
      login('ansariazad7864@gmail.com', 'CustPass@Electronic2026!');
    }, 1000);
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-950 text-slate-100 font-sans overflow-hidden"
    >
      {/* Left Column: Modern Illustration & Tech Visuals */}
      <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-12 bg-gradient-to-br from-blue-900/40 via-slate-950 to-purple-900/30 border-r border-slate-800 overflow-hidden">
        {/* Floating animated ambient shapes */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse delay-700"></div>

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              MAGIC MISTRY
            </span>
            <p className="text-[10px] text-cyan-400 tracking-widest font-semibold uppercase">REPAIR PLATFORM</p>
          </div>
        </div>

        {/* Hero Concept Visualizer */}
        <div className="relative z-10 my-auto flex flex-col gap-8 max-w-md">
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 w-fit">
              <ShieldCheck className="w-3.5 h-3.5" /> Trusted by 10,000+ households
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white leading-[1.15]">
              Experience the Future of{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Appliance Care
              </span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Book expert repairs with elite technicians. Fast response times, upfront prices, and real-time support.
            </p>
          </div>

          {/* Statistical Floating Card */}
          <motion.div
            variants={hoverScale}
            whileHover="whileHover"
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex flex-col gap-4 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Rating</span>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-sm font-bold text-white">4.9/5</span>
              </div>
            </div>
            <div className="flex -space-x-2 overflow-hidden">
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                alt="user"
                referrerPolicy="no-referrer"
              />
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                alt="user"
                referrerPolicy="no-referrer"
              />
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900"
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
                alt="user"
                referrerPolicy="no-referrer"
              />
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-slate-900">
                +12k
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Rated outstanding for customer support, technician competence, and clean-up.
            </p>
          </motion.div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} Magic Mistry. All rights reserved.
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="lg:col-span-7 flex flex-col justify-center p-6 sm:p-12 md:p-20 relative bg-slate-950">
        <button
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 sm:top-10 sm:left-10 w-9 h-9 rounded-xl border border-slate-900 bg-slate-950/80 text-slate-400 hover:text-white hover:bg-slate-900 hover:border-slate-800 flex items-center justify-center transition-all shadow-lg group z-20"
          title="Close and Return to Home"
        >
          <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>
        <div className="absolute top-10 right-10 text-xs text-slate-400">
          New to Magic Mistry?{' '}
          <Link to="/signup" className="text-blue-400 font-semibold hover:underline">
            Create an Account
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
            <p className="text-slate-400 text-sm">Sign in to book repair services or track your current service bookings.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* Username/Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email Address or Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="email"
                  type="text"
                  placeholder="name@example.com or phone"
                  className={`w-full bg-slate-900/80 border ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:ring-blue-500'
                  } rounded-xl py-3 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:border-transparent transition-all`}
                  {...registerField('email', {
                    required: 'Please enter your email or mobile number',
                    validate: (value) => {
                      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                      const isPhone = /^\+?[\d\s-]{8,15}$/.test(value);
                      return isEmail || isPhone || 'Please enter a valid email address or phone number';
                    },
                  })}
                />
              </div>
              {errors.email && <span className="text-xs text-red-400 mt-1">{errors.email.message}</span>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold text-blue-400 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full bg-slate-900/80 border ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:ring-blue-500'
                  } rounded-xl py-3 pl-11 pr-11 text-sm text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:border-transparent transition-all`}
                  {...registerField('password', {
                    required: 'Please enter your password',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters long',
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <span className="text-xs text-red-400 mt-1">{errors.password.message}</span>}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                className="h-4.5 w-4.5 rounded border-slate-800 bg-slate-900 text-blue-600 focus:ring-blue-500/30"
                {...registerField('rememberMe')}
              />
              <label htmlFor="rememberMe" className="ml-2.5 text-sm text-slate-400 select-none">
                Remember me on this device
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              variants={buttonPress}
              whileHover="whileHover"
              whileTap="whileTap"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 hover:shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In <LogIn className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-800"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-950 px-3 text-slate-500 font-semibold tracking-wider">Or continue with</span>
            </div>
          </div>

          {/* Third-party OAuth Buttons */}
          <div className="grid grid-cols-1 gap-3">
            <motion.button
              type="button"
              variants={buttonPress}
              whileHover="whileHover"
              whileTap="whileTap"
              onClick={handleGoogleLogin}
              className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-colors"
            >
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Sign in with Google
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
