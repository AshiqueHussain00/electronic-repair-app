/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '../components/Navbar';
import {
  Sparkles,
  Wind,
  Tv,
  Droplet,
  Flame,
  Star,
  ShieldCheck,
  Clock,
  ThumbsUp,
  Cpu,
  ArrowRight,
  Menu,
  X,
  User,
  Wrench,
  Settings,
  LogOut,
  ChevronRight,
  Info,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SERVICE_CATEGORIES, WORK_HOURS } from '../constants';
import { hoverScale, buttonPress, containerStagger, itemFadeIn } from '../animations';
import { formatCurrency, getInitialsAvatar } from '../utils';
import { toast } from 'react-hot-toast';
import LazyImage from '../components/LazyImage';

export default function Home() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  // Booking Flow Dialog State
  const [selectedService, setSelectedService] = useState<any>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [desc, setDesc] = useState('');
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);

  // Interactive diagnostic helper
  const [diagnosticText, setDiagnosticText] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Map icon strings to Lucide components
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Wind': return <Wind className="w-6 h-6" />;
      case 'Tv': return <Tv className="w-6 h-6" />;
      case 'Droplet': return <Droplet className="w-6 h-6" />;
      case 'Flame': return <Flame className="w-6 h-6" />;
      default: return <Cpu className="w-6 h-6" />;
    }
  };

  const handleDiagnose = () => {
    if (!diagnosticText.trim()) {
      toast.error('Please describe the problem with your appliance first.');
      return;
    }
    setIsAnalyzing(true);
    setAiAnalysis(null);

    // Simple robust local diagnostic logic mimicking expert system
    setTimeout(() => {
      let analysis = '';
      const text = diagnosticText.toLowerCase();

      if (text.includes('ac') || text.includes('cooling') || text.includes('air')) {
        analysis = "🛠️ DIAGNOSIS: Refrigerant Leak or Compressor Fault detected.\n💡 RECOMMENDATION: Power off the AC. Avoid running to prevent compressor burn-out. Book our standard AC Repair package for pressure testing and gas top-up.\n💰 APPROX COST: $80 - $120";
      } else if (text.includes('tv') || text.includes('display') || text.includes('screen')) {
        analysis = "🛠️ DIAGNOSIS: Backlight Inverter failure or T-Con Board error.\n💡 RECOMMENDATION: Test for 'flashlight' display to confirm backlight issue. Screen panel replacement may not be necessary. Book specialized TV diagnostics.\n💰 APPROX COST: $90 - $150";
      } else if (text.includes('refrigerator') || text.includes('fridge') || text.includes('ice')) {
        analysis = "🛠️ DIAGNOSIS: Defrost Timer Failure or Thermostat malfunction.\n💡 RECOMMENDATION: Unplug the appliance for 2 hours to clear ice buildup on condenser coils. Book Fridge repair if issue recurs.\n💰 APPROX COST: $70 - $110";
      } else {
        analysis = "🛠️ DIAGNOSIS: Multi-point relay trigger or power supply interruption.\n💡 RECOMMENDATION: Verify socket circuit breakers. Our diagnostic specialist will analyze wire continuity and control board relays on-site.\n💰 APPROX COST: Starting from $40";
      }

      setAiAnalysis(analysis);
      setIsAnalyzing(false);
      toast.success('Instant analysis computed successfully!');
    }, 1200);
  };

  const handleOpenBookingModal = (service: any) => {
    if (!isAuthenticated) {
      toast.error('Please register or log in to schedule repair services.');
      navigate('/login');
      return;
    }
    setSelectedService(service);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate || !bookingTime || !street || !city || !zipCode) {
      toast.error('Please fill in all scheduling and location details.');
      return;
    }

    setIsBookingSubmitting(true);
    setTimeout(() => {
      // Create local storage booking
      const mockBooking = {
        id: `book-${Date.now()}`,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        scheduledDate: bookingDate,
        scheduledTime: bookingTime,
        address: { street, city, state: 'NY', zipCode },
        status: 'PENDING',
        amount: selectedService.basePrice,
        paymentStatus: 'PENDING',
        paymentMethod: 'CASH',
        problemDescription: desc,
        createdAt: new Date().toISOString(),
      };

      // Push to customer bookings array in localStorage
      const key = `bookings_${user?.id}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(mockBooking);
      localStorage.setItem(key, JSON.stringify(existing));

      toast.success(`Booking created successfully! Access your panel to track status.`);
      setIsBookingSubmitting(false);
      setSelectedService(null);
      // Navigate to customer dashboard booking tab
      navigate('/customer');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans overflow-x-hidden selection:bg-blue-500/30 selection:text-white">
      {/* Dynamic Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-600/10 to-transparent rounded-full filter blur-3xl opacity-50"></div>
        <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-600/10 to-transparent rounded-full filter blur-3xl opacity-40"></div>
      </div>


      {/* LUXURY HERO SECTION */}
      <section className="relative pt-12 pb-20 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
        {/* Left Column: Text & CTA */}
        <div className="lg:col-span-7 flex flex-col gap-6 relative z-10">
          {/* Sparkle micro badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 font-semibold w-fit"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Professional Electronics Repair & Appliance Services
          </motion.div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Professional Electronics Repair{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent block sm:inline">
              At Your Doorstep
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl">
            Book trusted, verified repair specialists for Air Conditioners, Refrigerators, Smart TVs, Washing Machines, and Home appliances. Rapid, clean-guaranteed care.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
            <motion.a
              href="#services"
              variants={buttonPress}
              whileHover="whileHover"
              whileTap="whileTap"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-blue-500/15 flex items-center justify-center gap-2"
            >
              Book Service Now <ArrowRight className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="#diagnostic"
              variants={buttonPress}
              whileHover="whileHover"
              whileTap="whileTap"
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              Diagnose Problem
            </motion.a>
          </div>

          {/* Inline statistics indicator */}
          <div className="mt-8 flex items-center gap-6 border-t border-slate-900 pt-8">
            <div className="flex items-center gap-2 text-amber-400">
              <Star className="w-5 h-5 fill-amber-400" />
              <span className="text-sm font-bold text-white">4.92 / 5.00</span>
              <span className="text-slate-500 text-xs">(10k+ Reviews)</span>
            </div>
            <div className="h-4 w-px bg-slate-800"></div>
            <div className="text-slate-400 text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> 100% Secure Sessions
            </div>
          </div>
        </div>

        {/* Right Column: Interactive layered floating mockup dashboard */}
        <div className="lg:col-span-5 relative w-full h-[450px] flex items-center justify-center">
          {/* Main Visual Centerpiece Card */}
          <div className="w-full max-w-sm h-[380px] rounded-3xl bg-gradient-to-tr from-slate-900 to-slate-950 border border-slate-800/80 p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between group">
            {/* Background Technician Image Overlay */}
            <div className="absolute inset-0 z-0">
              <LazyImage
                src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80"
                alt="Electrician Technician at Work"
                className="w-full h-full object-cover opacity-30 filter grayscale group-hover:scale-105 group-hover:opacity-40 transition-all duration-700"
                wrapperClassName="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
            </div>

            {/* Glowing orb element */}
            <div className="absolute top-10 right-10 w-24 h-24 bg-cyan-500/10 rounded-full filter blur-2xl animate-pulse"></div>

            {/* Core Card Branding & Title */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Dispatch Map</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-extrabold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">GPS LIVE</span>
            </div>

            {/* Simulated Live Action Status */}
            <div className="relative z-10 text-left mt-auto">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Current Target</span>
              <h3 className="text-lg font-extrabold text-white mt-0.5">Washing Machine Repair</h3>
              <p className="text-slate-400 text-xs mt-1">Sensing controller board failure logs on-site.</p>
            </div>
          </div>

          {/* Floating Card 1: Booking confirmation */}
          <div className="absolute -top-4 -left-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl flex items-center gap-3.5 animate-bounce-slow max-w-[220px]">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-xs font-bold text-white truncate">Booking Confirmed</p>
              <span className="text-[10px] text-slate-400 font-medium">AC Clean & Repair Service</span>
            </div>
          </div>

          {/* Floating Card 2: Mechanic profile assigned */}
          <div className="absolute -bottom-4 -right-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl flex items-center gap-3.5 animate-float-slow max-w-[240px]">
            <LazyImage
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
              alt="Assigned Technician"
              className="w-full h-full object-cover"
              wrapperClassName="w-10 h-10 rounded-full shrink-0 border border-slate-700"
            />
            <div className="text-left overflow-hidden">
              <p className="text-xs font-bold text-white truncate">John Electrician</p>
              <span className="text-[10px] text-cyan-400 font-bold block">4.92★ Certified specialist</span>
            </div>
          </div>

          {/* Floating Card 3: Response SLA Badge */}
          <div className="absolute top-1/4 -right-6 px-3.5 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-xl text-cyan-400 text-xs font-bold flex items-center gap-2 shadow-xl shrink-0">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>SLA: 45 Min Arrival</span>
          </div>
        </div>
      </section>

      {/* SERVICE CATALOG SECTION */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900 relative">
        <div className="text-center flex flex-col items-center gap-3 mb-16">
          <div className="text-xs font-semibold text-cyan-400 tracking-widest uppercase">CATALOG</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Our Premium Services</h2>
          <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
            Select an appliance category to book a verified expert. transparent flat-rate pricing.
          </p>
        </div>

        {/* Grid of service categories */}
        <motion.div
          variants={containerStagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {SERVICE_CATEGORIES.slice(0, 4).map((service) => (
            <motion.div
              key={service.id}
              variants={itemFadeIn}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-slate-800 backdrop-blur-xl flex flex-col justify-between transition-all overflow-hidden"
            >
              <div className="flex flex-col gap-4">
                {/* Premium Image Header */}
                {service.image && (
                  <div className="relative h-40 w-full overflow-hidden">
                    <LazyImage
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      wrapperClassName="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur border border-slate-800 text-blue-400 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {getIconComponent(service.icon)}
                    </div>
                  </div>
                )}
                <div className="px-5 pt-1">
                  <h3 className="font-bold text-base text-white leading-snug">{service.name}</h3>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{service.description}</p>
                </div>
              </div>

              <div className="mt-5 px-5 pb-5 flex items-center justify-between pt-4 border-t border-slate-900">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Base Price</span>
                  <p className="text-base font-bold text-white">{formatCurrency(service.basePrice)}</p>
                </div>
                <button
                  onClick={() => handleOpenBookingModal(service)}
                  className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-xs font-bold text-blue-400 group-hover:text-white rounded-lg border border-slate-800 group-hover:border-transparent transition-all"
                >
                  Book Service
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Services CTA */}
        <div className="flex justify-center mt-12">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-xl text-xs font-extrabold text-blue-400 hover:text-blue-300 hover:bg-slate-850 shadow-lg hover:shadow-blue-500/5 transition-all group"
          >
            Browse All Service Categories ({SERVICE_CATEGORIES.length}+)
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* PHOTO CATALOG SECTION */}
      <section id="catalog" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center flex flex-col items-center gap-3 mb-16">
          <div className="text-xs font-semibold text-cyan-400 tracking-widest uppercase">OUR WORK</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Our Repairs in Action</h2>
          <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
            Real-world on-site appliance repairs and system setups completed by our registered specialists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Air Conditioner Repair",
              desc: "Compressor servicing & deep cleaning",
              tag: "AC Service",
              img: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80"
            },
            {
              title: "Washing Machine Repair",
              desc: "Drum bearing replacement & belt check",
              tag: "Washer",
              img: "https://images.unsplash.com/photo-1518152006812-cdff28b66480?auto=format&fit=crop&w=600&q=80"
            },
            {
              title: "Smart TV Diagnostics",
              desc: "Backlight board circuit diagnostics",
              tag: "Smart TV",
              img: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80"
            },
            {
              title: "Refrigerator Maintenance",
              desc: "Thermostat sensor & cooling coil check",
              tag: "Fridge",
              img: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=600&q=80"
            },
            {
              title: "Water Pump Installation",
              desc: "High pressure winding motor service",
              tag: "Water Pump",
              img: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80"
            },
            {
              title: "Smart Lighting Setup",
              desc: "Modular smart pendant lights calibration",
              tag: "Electrical",
              img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80"
            }
          ].map((photo, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              className="group relative h-72 rounded-2xl overflow-hidden border border-slate-900 shadow-2xl flex flex-col justify-end p-6 hover:border-slate-800 transition-all"
            >
              {/* Background Photo */}
              <div className="absolute inset-0 z-0">
                <LazyImage
                  src={photo.img}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  wrapperClassName="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              </div>

              {/* Floating Tag */}
              <span className="absolute top-4 right-4 z-10 px-2.5 py-0.5 rounded bg-blue-600/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                {photo.tag}
              </span>

              {/* Photo Details */}
              <div className="relative z-10 text-left">
                <h3 className="text-base font-extrabold text-white leading-snug">{photo.title}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-normal">{photo.desc}</p>
                <div className="h-0.5 w-0 bg-blue-500 group-hover:w-full transition-all duration-300 mt-3 rounded-full"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BECOME A VENDOR / PARTNER ONBOARDING SECTION */}
      <section id="partner" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Side: Text and Steps */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-semibold text-blue-300 w-fit">
              <Wrench className="w-3.5 h-3.5 text-blue-400" /> GROW YOUR BUSINESS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Become a Registered Magic Mistry Vendor
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
              Are you an expert technician? Partner with Magic Mistry to access premium customer leads, automated job dispatches, and secure weekly payouts. Join India's fastest growing electronics repair network.
            </p>

            {/* Timeline steps */}
            <div className="flex flex-col gap-6 mt-4">
              {[
                {
                  step: "01",
                  title: "Submit Registration Profile",
                  desc: "Submit your business details, specialized skill tags, and identity documents for review."
                },
                {
                  step: "02",
                  title: "Background Check & Screening",
                  desc: "Our dispatch team conducts rigorous verification of license credentials and practical skill tests."
                },
                {
                  step: "03",
                  title: "Onboard & Set Availability",
                  desc: "Get access to the Partner App, verify dispatch coverage zones, and switch status to Online."
                },
                {
                  step: "04",
                  title: "Accept Jobs & Start Earning",
                  desc: "Accept nearby incoming orders, complete certified diagnostics, and receive settled weekly payouts."
                }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start group">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-sm text-cyan-400 shrink-0 group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent transition-all">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-none">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-md">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: High-fidelity Call-to-Action Card */}
          <div className="lg:col-span-5 relative w-full h-[460px] flex items-center justify-center">
            {/* Visual background wrapper */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-cyan-500/5 rounded-3xl border border-slate-900/60 filter blur-xl"></div>
            
            <div className="w-full max-w-sm rounded-3xl bg-slate-900/80 border border-slate-800/80 p-8 shadow-2xl backdrop-blur-xl relative z-10 flex flex-col justify-between h-full text-left">
              <div className="flex flex-col gap-4">
                <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded w-fit">
                  Onboarding Portal
                </span>
                <h3 className="text-xl font-extrabold text-white">Join as a Partner</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Start receiving repair orders instantly. Complete our partner application form below.
                </p>

                <div className="flex flex-col gap-3.5 mt-2 text-xs font-semibold text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Free Registration & App Access
                  </div>
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Keep 100% of Customer Tips
                  </div>
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> 24/7 Dispatch Team Support
                  </div>
                </div>
              </div>

              {/* Application Form Trigger */}
              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={() => {
                    toast.success("Application form loaded! Redirecting to technician signup...");
                    navigate("/signup", { state: { defaultRole: "TECHNICIAN" } });
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3 rounded-xl shadow-lg transition-all text-xs text-center flex items-center justify-center gap-2"
                >
                  Submit Application Online <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-[9px] text-slate-500 text-center block">
                  Processing time: 24 - 48 Hours. Requires ID verification checks.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center flex flex-col items-center gap-3 mb-16">
          <div className="text-xs font-semibold text-cyan-400 tracking-widest uppercase">QUALITY GUARANTEE</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">The Magic Mistry Standard</h2>
          <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
            Every booking is covered by our elite security, timing, and warranty policies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Vetted Specialists</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Every mechanic in our registry has passed continuous background checks, holds active certifications, and averages 4.8+ user ratings.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">45-Min SLA Guarantee</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              We value your schedule. If our technician is more than 30 minutes late for the selected slot, we issue an instant $20 discount voucher.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <ThumbsUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">30-Day Free Warranty</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              If the appliance reports the exact same issue within 30 days of service completion, our mechanic revisits and completes the fix at $0 cost.
            </p>
          </div>
        </div>
      </section>

      {/* BOOKING SCHEDULING DIALOG / MODAL (GLASSMORPHIC) */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 mb-2">
                Book {selectedService.name}
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Fill in scheduling coordinates to lock your repair session. Base charge: <strong className="text-white">{formatCurrency(selectedService.basePrice)}</strong>.
              </p>

              <form onSubmit={handleBookingSubmit} className="flex flex-col gap-4">
                {/* Date Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Select Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-100 outline-none"
                  />
                </div>

                {/* Time Slot Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Select Time Slot</label>
                  <select
                    required
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-100 outline-none"
                  >
                    <option value="">Choose a slot...</option>
                    {WORK_HOURS.map((hr) => (
                      <option key={hr} value={hr}>{hr}</option>
                    ))}
                  </select>
                </div>

                {/* Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="123 repair main st"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-100 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">City</label>
                    <input
                      type="text"
                      required
                      placeholder="New York"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-100 outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Zip Code</label>
                    <input
                      type="text"
                      required
                      placeholder="10001"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-100 outline-none"
                    />
                  </div>
                </div>

                {/* Optional Symptoms */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Describe Issue (Optional)</label>
                  <textarea
                    placeholder="Describe what is wrong with the appliance..."
                    rows={2}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 outline-none resize-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  variants={buttonPress}
                  whileHover="whileHover"
                  whileTap="whileTap"
                  disabled={isBookingSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg mt-2"
                >
                  {isBookingSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : (
                    `Schedule Booking`
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-white tracking-wider">ELECTRONIC</span>
          </div>
          <div className="flex gap-6 text-slate-400 font-medium">
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#diagnostic" className="hover:text-white transition-colors">AI Diagnostic</a>
            <a href="#about" className="hover:text-white transition-colors">About Us</a>
          </div>
          <p>© {new Date().getFullYear()} Electronic repair platform. Built to enterprise standards.</p>
        </div>
      </footer>
    </div>
  );
}
