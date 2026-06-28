/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, CheckCircle, RefreshCw, KeyRound, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { pageTransition, buttonPress } from '../animations';

export default function VerifyOTP() {
  const { verifyOTP, resendOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from location state, or fallback if none (for testing / direct access)
  const email = location.state?.email || 'ansariazad7864@gmail.com';
  const purpose = location.state?.purpose || 'REGISTER';

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Verification code countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (isNaN(Number(value))) return; // numbers only

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto next
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        // Move focus back
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    const newOtp = [...otp];

    for (let i = 0; i < 6; i++) {
      if (pastedData[i] && !isNaN(Number(pastedData[i]))) {
        newOtp[i] = pastedData[i];
      }
    }
    setOtp(newOtp);

    // Focus last or appropriate box
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex].focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      toast.error('Please complete the 6-digit verification code.');
      return;
    }

    setIsVerifying(true);
    try {
      await verifyOTP(email, code, purpose);
      toast.success('Identity verified successfully!');
      // Auth route guards will automatically handle dashboard routing, but navigating is nice
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'OTP verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await resendOTP(email, purpose);
      toast.success('A fresh 6-digit OTP has been dispatched.');
      setCountdown(60);
      setOtp(new Array(6).fill(''));
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    } catch (error: any) {
      toast.error(error.message || 'Unable to resend code.');
    } finally {
      setIsResending(false);
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
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl animate-pulse delay-500"></div>

      {/* Floating Sparkles decorative */}
      <div className="absolute top-10 right-10 opacity-25">
        <Sparkles className="w-8 h-8 text-cyan-400" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Core Card */}
        <div className="bg-slate-900/60 border border-slate-800 backdrop-blur-2xl p-8 sm:p-10 rounded-2xl shadow-2xl flex flex-col items-center text-center">
          {/* Lock Icon Circle */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/15 mb-6">
            <KeyRound className="w-7 h-7 text-white" />
          </div>

          <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">Check Your Inbox</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            We have transmitted a secure 6-digit OTP code to <br />
            <strong className="text-blue-300 font-semibold">{email}</strong>.
          </p>

          {/* OTP Digit Inputs */}
          <div className="flex gap-2 sm:gap-3 justify-center mb-8" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                ref={(el) => {
                  if (el) inputRefs.current[index] = el;
                }}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-11 h-13 sm:w-12 sm:h-14 bg-slate-950 border border-slate-800 rounded-xl text-center text-xl font-extrabold text-cyan-400 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            ))}
          </div>

          {/* Verification Actions */}
          <motion.button
            variants={buttonPress}
            whileHover="whileHover"
            whileTap="whileTap"
            onClick={handleVerify}
            disabled={isVerifying}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 hover:shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            {isVerifying ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Verify Identity <CheckCircle className="w-4.5 h-4.5" />
              </>
            )}
          </motion.button>

          {/* Resend and timer options */}
          <div className="mt-6 flex flex-col items-center gap-2">
            {countdown > 0 ? (
              <span className="text-xs text-slate-500">
                You can request a new code in{' '}
                <strong className="text-slate-300 font-bold">{countdown}s</strong>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-xs text-blue-400 font-bold hover:underline inline-flex items-center gap-1.5 focus:outline-none"
              >
                {isResending ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" /> Resend Verification OTP
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
