/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '../components/Navbar';
import {
  Wrench,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Globe,
  DollarSign,
  TrendingUp,
  Cpu,
  Mail,
  Building,
  Briefcase,
  Check,
  FileText,
  User,
  Power,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getInitialsAvatar } from '../utils';
import { hoverScale, buttonPress, containerStagger, itemFadeIn, pageTransition } from '../animations';
import { toast } from 'react-hot-toast';

export default function BecomeVendor() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  // Form State
  const [businessName, setBusinessName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [jurisdiction, setJurisdiction] = useState('');
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [volume, setVolume] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleCapability = (cap: string) => {
    if (capabilities.includes(cap)) {
      setCapabilities(capabilities.filter((c) => c !== cap));
    } else {
      setCapabilities([...capabilities, cap]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!businessName || !taxId || !email || !jurisdiction || capabilities.length === 0 || !volume) {
      toast.error('Please fill in all required operational information fields.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success('Vendor application submitted successfully! Reviewing credentials...');
    }, 2000);
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white"
    >


      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
        <div className="lg:col-span-7 flex flex-col gap-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 font-semibold w-fit"
          >
            <Building className="w-3.5 h-3.5 text-blue-400" /> VENDOR PARTNERSHIP PROGRAM
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Scale your electronics repair{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent block sm:inline">
              business globally.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl">
            Join the Electronic elite network. Access enterprise-grade tools, secure global payments, and a steady stream of high-value repair requests. We handle the logistics; you focus on the fix.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
            <motion.a
              href="#apply-form"
              variants={buttonPress}
              whileHover="whileHover"
              whileTap="whileTap"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-blue-500/15 flex items-center justify-center gap-2"
            >
              Apply to Network <ArrowRight className="w-5 h-5" />
            </motion.a>
          </div>

          <div className="mt-8 flex items-center gap-10 border-t border-slate-900 pt-8">
            <div className="flex flex-col">
              <span className="text-3xl font-extrabold text-white">10k+</span>
              <span className="text-xs text-slate-500 font-medium uppercase mt-1 tracking-wider">Active Vendors</span>
            </div>
            <div className="h-10 w-px bg-slate-800"></div>
            <div className="flex flex-col">
              <span className="text-3xl font-extrabold text-white">$50M+</span>
              <span className="text-xs text-slate-500 font-medium uppercase mt-1 tracking-wider">Paid Annually</span>
            </div>
            <div className="h-10 w-px bg-slate-800"></div>
            <div className="flex flex-col">
              <span className="text-3xl font-extrabold text-white">99.9%</span>
              <span className="text-xs text-slate-500 font-medium uppercase mt-1 tracking-wider">Uptime Guarantee</span>
            </div>
          </div>
        </div>

        {/* Right Side Image & Earnings Badge */}
        <div className="lg:col-span-5 relative w-full h-[450px] flex items-center justify-center">
          <div className="w-full max-w-sm h-[380px] rounded-3xl bg-slate-900 border border-slate-800/80 p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80"
                alt="Electrician Technician at Work"
                className="w-full h-full object-cover opacity-45 filter grayscale group-hover:scale-105 group-hover:opacity-55 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="text-[10px] text-cyan-400 font-extrabold px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 uppercase">GPS ONLINE</span>
            </div>

            {/* Earnings Badge overlay */}
            <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-slate-800 flex items-center justify-between shadow-2xl relative z-10 animate-float-slow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Average Partner yields</span>
                  <span className="text-sm font-black text-white">$12,450 / Month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center flex flex-col items-center gap-3 mb-16">
          <div className="text-xs font-semibold text-cyan-400 tracking-widest uppercase">CAPABILITIES</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Engineered for Elite Technicians</h2>
          <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
            Everything you need to run a high-volume repair operation seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: 'Global Reach, Local Execution',
              desc: 'Tap into our massive international customer base. Receive pre-vetted repair requests targeted directly to your specialized skill set and geographical operating zones.',
              icon: <Globe className="w-5 h-5 text-blue-400" />
            },
            {
              title: 'Secure, Instant Payouts',
              desc: 'Zero waiting periods. Payments are locked in escrow and released instantly upon validated repair completion directly to your banking institution.',
              icon: <DollarSign className="w-5 h-5 text-cyan-400" />
            },
            {
              title: 'Advanced Growth Tools',
              desc: 'Access your real-time analytics dashboard to track performance metrics, customer satisfaction ratings, and revenue forecasting analytics.',
              icon: <TrendingUp className="w-5 h-5 text-indigo-400" />
            },
            {
              title: 'OEM Parts Procurement Network',
              desc: 'Access our proprietary supply chain. Order certified OEM parts at enterprise wholesale rates directly through your partner portal, ensuring quality and maximizing margins.',
              icon: <Cpu className="w-5 h-5 text-violet-400" />
            }
          ].map((feat, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-slate-800 transition-all flex gap-5 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                {feat.icon}
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-lg text-white leading-snug">{feat.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ONBOARDING STEPS SECTION */}
      <section id="onboarding" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Onboarding Timeline Steps */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-semibold text-cyan-300 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> TIMELINE PROTOCOL
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Onboarding Protocol</h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
              Our vetting process is rigorous to maintain network integrity, but highly streamlined for your convenience. Go from application to earning in under 72 hours.
            </p>

            {/* Timeline wrapper with line */}
            <div className="relative flex flex-col gap-8 mt-6 pl-8">
              <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-900"></div>

              {[
                {
                  step: "01",
                  title: "Submit Profile",
                  desc: "Provide business details, core competencies, and operational jurisdiction via the secure portal below."
                },
                {
                  step: "02",
                  title: "KYC & Verification",
                  desc: "Autonomous identity verification and credential check. We validate your technical certifications and business licensing."
                },
                {
                  step: "03",
                  title: "System Integration",
                  desc: "Access onboarding modules on the Vendor Dashboard. Configure your operational hours, dispatch zones, and payout routing."
                },
                {
                  step: "04",
                  title: "Initialize Operations",
                  desc: "Start receiving certified repair requests. Execute jobs, update logs, and receive instant payouts."
                }
              ].map((item, idx) => (
                <div key={idx} className="relative flex flex-col gap-1 text-left">
                  <div className="absolute -left-[38px] top-0 w-8 h-8 rounded-full bg-slate-950 border-2 border-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                    {item.step}
                  </div>
                  <h4 className="text-sm font-bold text-white leading-none">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-md">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Illustration */}
          <div className="lg:col-span-5 relative w-full h-[450px] flex items-center justify-center">
            <div className="w-full max-w-sm h-[380px] rounded-3xl bg-slate-900 border border-slate-900/60 p-6 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-cyan-500/5 filter blur-xl"></div>
              {/* Spinning microchip schematic */}
              <div className="w-48 h-48 rounded-full bg-cyan-600/5 border-2 border-dashed border-cyan-500/20 flex items-center justify-center animate-spin-slow">
                <Cpu className="w-16 h-16 text-cyan-500/40" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* APPLICATION FORM SECTION */}
      <section id="apply-form" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-900">
        <div className="text-center flex flex-col items-center gap-3 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Initialize Vendor Application</h2>
          <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
            Secure your position in the Electronic network. All fields are encrypted and transmitted securely.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-900 rounded-3xl p-6 sm:p-10 backdrop-blur-xl relative">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleFormSubmit}
                className="flex flex-col gap-8 text-left"
              >
                {/* 01. ENTITY INFORMATION */}
                <div className="flex flex-col gap-5">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/80 pb-2">
                    01. ENTITY INFORMATION
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-400">Legal Business Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Acme Electronics Repair LLC"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-transparent focus:ring-2 focus:ring-blue-500 rounded-xl py-2.5 px-4 text-sm text-slate-100 outline-none placeholder-slate-600 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-400">Tax ID / EIN *</label>
                      <input
                        type="text"
                        required
                        placeholder="XX-XXXXXXX"
                        value={taxId}
                        onChange={(e) => setTaxId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-transparent focus:ring-2 focus:ring-blue-500 rounded-xl py-2.5 px-4 text-sm text-slate-100 outline-none placeholder-slate-600 transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400">Primary Contact Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="admin@acmerepair.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-transparent focus:ring-2 focus:ring-blue-500 rounded-xl py-2.5 px-4 text-sm text-slate-100 outline-none placeholder-slate-600 transition-all"
                    />
                  </div>
                </div>

                {/* 02. OPERATIONAL CAPABILITIES */}
                <div className="flex flex-col gap-5">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/80 pb-2">
                    02. OPERATIONAL CAPABILITIES
                  </h3>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400">Primary Operating Jurisdiction / States *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Seattle, WA metro or other Area"
                      value={jurisdiction}
                      onChange={(e) => setJurisdiction(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-transparent focus:ring-2 focus:ring-blue-500 rounded-xl py-2.5 px-4 text-sm text-slate-100 outline-none placeholder-slate-600 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-bold text-slate-400">Service Capabilities (Select all that apply) *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {[
                        'Consumer WLAN Devices',
                        'Enterprise Server Hardware',
                        'PCB Micro-Soldering',
                        'Drone / UAV Systems'
                      ].map((cap, idx) => (
                        <div
                          key={idx}
                          onClick={() => toggleCapability(cap)}
                          className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            capabilities.includes(cap)
                              ? 'bg-blue-600/10 border-blue-500 text-white'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-xs font-bold">{cap}</span>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            capabilities.includes(cap)
                              ? 'bg-blue-600 border-transparent text-white'
                              : 'border-slate-800'
                          }`}>
                            {capabilities.includes(cap) && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400">Estimated Monthly Repair Volume Capacity *</label>
                    <select
                      required
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-transparent focus:ring-2 focus:ring-blue-500 rounded-xl py-2.5 px-4 text-sm text-slate-400 outline-none transition-all cursor-pointer"
                    >
                      <option value="">Select capacity tier...</option>
                      <option value="1-50">1 - 50 Repairs / Month</option>
                      <option value="51-200">51 - 200 Repairs / Month</option>
                      <option value="201-1000">201 - 1,000 Repairs / Month</option>
                      <option value="1000+">Over 1,000 Repairs / Month</option>
                    </select>
                  </div>
                </div>

                {/* Submit Container */}
                <div className="flex flex-col gap-4 mt-4 border-t border-slate-800 pt-6">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      required
                      id="vendor-terms"
                      className="mt-0.5 rounded accent-blue-600"
                    />
                    <label htmlFor="vendor-terms" className="text-[10px] text-slate-400 leading-normal cursor-pointer select-none">
                      By submitting, you agree to our Vendor Service Provider Agreement and Privacy Policy. All inputs are securely encrypted.
                    </label>
                  </div>

                  <motion.button
                    type="submit"
                    variants={buttonPress}
                    whileHover="whileHover"
                    whileTap="whileTap"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Encrypting Profile...
                      </>
                    ) : (
                      <>
                        Submit Application <ArrowRight className="w-4.5 h-4.5" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center text-center gap-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-black text-white">Application Received Successfully</h3>
                  <p className="text-slate-400 text-sm max-w-md mt-1 leading-relaxed">
                    Our partner relations department has received your business details and is verified. We will email update requests to <strong className="text-white">{email}</strong> within 24 to 48 hours.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs rounded-xl"
                >
                  Return to Homepage
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-extrabold text-2xl tracking-tighter text-white uppercase">
              Electronic
            </span>
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
            <a href="#" className="hover:text-white transition-colors">Hardware Warranty</a>
            <a href="#" className="hover:text-white transition-colors">Sustainability</a>
            <a href="#" className="hover:text-white transition-colors">Global Support</a>
          </nav>

          <p className="text-xs text-slate-500 font-medium tracking-wider">
            © 2026 Electronic Repair. All rights reserved.
          </p>
        </div>
      </footer>
    </motion.div>
  );
}

// Simple placeholder for Menu icon to avoid imports compilation check errors
function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={props.className}
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
