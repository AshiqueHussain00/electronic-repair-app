/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, KeyRound, Lock, Eye, EyeOff, ShieldAlert, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { pageTransition, buttonPress } from '../animations';

export default function ForgotPassword() {
  const { forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }
    setIsLoading(true);
    try {
      await forgotPassword(email);
      toast.success('Reset verification OTP dispatched!');
      setStep(2);
    } catch (err: any) {
      toast.error(err.message || 'Unable to locate account.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error('Please enter the 6-digit OTP code.');
      return;
    }
    // Simple state change. Actual verification happens in backend with reset password.
    toast.success('Code confirmed. Define your new credentials.');
    setStep(3);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(email, otp, newPassword);
      toast.success('Your credentials have been securely reset!');
      setStep(4);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center p-6 relative overflow-hidden"
    >
      {/* Ambient backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full filter blur-3xl animate-pulse delay-500"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-900/60 border border-slate-800 backdrop-blur-2xl p-8 sm:p-10 rounded-2xl shadow-2xl">
          {/* STEP 1: ENTER EMAIL */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/15 mb-4">
                  <ShieldAlert className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight mb-1">Reset Password</h2>
                <p className="text-slate-400 text-sm">
                  Provide your registered email address to receive a 6-digit recovery OTP.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-transparent focus:ring-2 focus:ring-blue-500 rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                variants={buttonPress}
                whileHover="whileHover"
                whileTap="whileTap"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Send Recovery OTP <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>

              <div className="text-center text-xs">
                <Link to="/login" className="text-slate-500 hover:text-slate-300 transition-colors">
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}

          {/* STEP 2: VERIFY OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/15 mb-4">
                  <KeyRound className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight mb-1">Verify Code</h2>
                <p className="text-slate-400 text-sm">
                  Enter the recovery OTP sent to <strong className="text-blue-300 font-semibold">{email}</strong>.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">6-Digit OTP</label>
                <input
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-transparent focus:ring-2 focus:ring-cyan-500 rounded-xl py-3 text-center text-xl font-bold tracking-widest text-cyan-400 outline-none transition-all"
                />
              </div>

              <motion.button
                type="submit"
                variants={buttonPress}
                whileHover="whileHover"
                whileTap="whileTap"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                Verify Code <ArrowRight className="w-4 h-4" />
              </motion.button>
            </form>
          )}

          {/* STEP 3: CREATE NEW PASSWORD */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/15 mb-4">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight mb-1">Secure Password</h2>
                <p className="text-slate-400 text-sm">Define a new strong passcode to lock your account.</p>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">New Password</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-transparent focus:ring-2 focus:ring-blue-500 rounded-xl py-2.5 pl-11 pr-11 text-sm outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Confirm Password</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-transparent focus:ring-2 focus:ring-blue-500 rounded-xl py-2.5 pl-11 pr-11 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                variants={buttonPress}
                whileHover="whileHover"
                whileTap="whileTap"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Update Credentials <CheckCircle2 className="w-4.5 h-4.5" />
                  </>
                )}
              </motion.button>
            </form>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
            <div className="flex flex-col items-center text-center gap-6">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, transition: { type: 'spring', damping: 10 } }}
                className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"
              >
                <CheckCircle2 className="w-8 h-8" />
              </motion.div>

              <div className="flex flex-col gap-1.5">
                <h3 className="text-2xl font-extrabold text-white">Password Updated</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Your security parameters have been updated successfully. You can now use your new credentials to authenticate.
                </p>
              </div>

              <motion.button
                variants={buttonPress}
                whileHover="whileHover"
                whileTap="whileTap"
                onClick={() => navigate('/login')}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                Proceed to Sign In <ArrowRight className="w-4.5 h-4.5" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
