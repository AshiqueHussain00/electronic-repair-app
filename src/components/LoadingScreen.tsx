/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Wrench } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden select-none">
      {/* Background radial soft lights */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-blue-600/10 rounded-full filter blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/10 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Animated outer ring spinner */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-4 border-slate-900 border-t-blue-500 border-r-cyan-500 shadow-lg shadow-blue-500/10"
          ></motion.div>

          {/* Central Logo icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: [0.95, 1.05, 0.95], opacity: 1 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400"
          >
            <Wrench className="w-6 h-6 animate-pulse" />
          </motion.div>
        </div>

        {/* Text descriptions */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <motion.span
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="text-xs font-black tracking-widest text-slate-100 uppercase bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent"
          >
            LOADING ELECTRONIC SYSTEMS
          </motion.span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            Fetching secure modules...
          </span>
        </div>
      </div>
    </div>
  );
}
