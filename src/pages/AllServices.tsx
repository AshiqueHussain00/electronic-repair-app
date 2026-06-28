/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '../components/Navbar';
import {
  Wind,
  Tv,
  Droplet,
  Flame,
  Cpu,
  Tv as Television,
  ArrowRight,
  ShieldCheck,
  Clock,
  ThumbsUp,
  X,
  Star,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SERVICE_CATEGORIES, WORK_HOURS } from '../constants';
import { bookingService } from '../services/booking';
import { hoverScale, buttonPress, pageTransition, containerStagger, itemFadeIn } from '../animations';
import { formatCurrency } from '../utils';
import { toast } from 'react-hot-toast';
import LazyImage from '../components/LazyImage';

export default function AllServices() {
  const { user, isAuthenticated, isMockMode } = useAuth();
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

  // Map icon names to Lucide icons
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Wind': return <Wind className="w-5 h-5" />;
      case 'Tv': return <Tv className="w-5 h-5" />;
      case 'Droplet': return <Droplet className="w-5 h-5" />;
      case 'Flame': return <Flame className="w-5 h-5" />;
      default: return <Cpu className="w-5 h-5" />;
    }
  };

  // Get dynamic SLAs, checklist highlights, and ratings to make details page premium
  const getServiceHighlights = (serviceId: string) => {
    switch (serviceId) {
      case 'ac':
        return {
          sla: '2-Hour Response SLA',
          rating: '4.95',
          reviews: '3,240',
          checklist: ['Gas pressure monitoring & leak test', 'Condenser coil chemical deep wash', 'Electrical circuit relay calibration', '30-Day post-repair warranty cover']
        };
      case 'fridge':
        return {
          sla: '3-Hour Response SLA',
          rating: '4.91',
          reviews: '2,150',
          checklist: ['Defrost sensor & timer continuity check', 'Thermostat recalibration & dial testing', 'Cooling compressor health diagnostic', 'Door gasket sealing alignment check']
        };
      case 'washer':
        return {
          sla: 'Same-Day Service SLA',
          rating: '4.89',
          reviews: '1,860',
          checklist: ['High-torque motor belt inspection', 'Drainage control pump replacement', 'Control panel motherboard logic check', 'Suspension damper vibration testing']
        };
      case 'tv':
        return {
          sla: '45-Min Home SLA',
          rating: '4.93',
          reviews: '2,900',
          checklist: ['LED panel backlight voltage diagnostics', 'Motherboard T-Con circuit testing', 'HDMI/Audio decoder output calibration', 'Clean micro-fiber panel dust extract']
        };
      case 'microwave':
        return {
          sla: 'Same-Day Service SLA',
          rating: '4.86',
          reviews: '920',
          checklist: ['High-voltage magnetron safety check', 'Door interlock microswitch diagnostics', 'Touchpad controller relay diagnostic', 'Interior turntable drive motor service']
        };
      case 'induction':
        return {
          sla: '2-Hour Response SLA',
          rating: '4.82',
          reviews: '740',
          checklist: ['IGBT power switch replacement check', 'Thermal sensor diagnostic calibration', 'Control panel touchpad continuity test', 'Main filter circuit coil calibration']
        };
      case 'water-pump':
        return {
          sla: '3-Hour Response SLA',
          rating: '4.90',
          reviews: '1,120',
          checklist: ['Motor copper winding insulation test', 'Double-sealed bearing noise reduction', 'Pressure switch & control relay fixing', 'Impeller casing sand-blast cleaning']
        };
      case 'fan-light':
      default:
        return {
          sla: '45-Min Home SLA',
          rating: '4.88',
          reviews: '1,420',
          checklist: ['Multi-point safety loop wire checks', 'Speed regulator capacitor diagnostic', 'Smart hub connectivity synchronization', 'Secure anchor mount bracket setups']
        };
    }
  };

  const handleOpenBookingModal = (service: any) => {
    if (!isAuthenticated) {
      toast.error('Please register or log in to schedule repair services.');
      navigate('/login');
      return;
    }
    setSelectedService(service);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate || !bookingTime || !street || !city || !zipCode) {
      toast.error('Please fill in all scheduling and location details.');
      return;
    }

    setIsBookingSubmitting(true);
    try {
      if (!isMockMode) {
        // Backend DB API call
        await bookingService.createBooking({
          serviceId: selectedService.id,
          serviceName: selectedService.name,
          scheduledDate: bookingDate,
          scheduledTime: bookingTime,
          address: { street, city, state: 'NY', zipCode },
          amount: selectedService.basePrice,
          paymentMethod: 'CASH',
          problemDescription: desc,
        });
      } else {
        // Fallback mock localStorage write
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

        const key = `bookings_${user?.id}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.push(mockBooking);
        localStorage.setItem(key, JSON.stringify(existing));
      }

      toast.success('Repair request successfully booked in the queue!');
      setSelectedService(null);
      navigate('/customer');
    } catch (err: any) {
      toast.error(err.message || 'Failed to complete scheduling. Please try again.');
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans overflow-x-hidden selection:bg-blue-500/30 selection:text-white">
      {/* Background ambient light */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-gradient-to-br from-blue-900/10 to-transparent rounded-full filter blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 right-1/3 w-[600px] h-[600px] bg-gradient-to-br from-cyan-900/10 to-transparent rounded-full filter blur-3xl opacity-50"></div>
      </div>


      {/* Page Header */}
      <header className="relative pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
        <div className="flex flex-col gap-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-xs text-blue-300 font-semibold w-fit">
            <Sparkles className="w-3.5 h-3.5" /> Full Professional Appliance Repair Suite
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none">
            All Appliance & Electrical{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent block sm:inline">
              Services Catalog
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed mt-2">
            Browse our complete roster of certified maintenance programs. Lock in an experienced, background-screened technician equipped with OEM spare parts and diagnostic kits. 
          </p>
        </div>
      </header>

      {/* Main Service Registry Listing Grid */}
      <main className="py-8 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
        <motion.div
          variants={containerStagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {SERVICE_CATEGORIES.map((service) => {
            const specs = getServiceHighlights(service.id);
            return (
              <motion.div
                key={service.id}
                variants={itemFadeIn}
                className="rounded-3xl bg-slate-900/40 border border-slate-900 hover:border-slate-800 backdrop-blur-xl p-6 flex flex-col justify-between gap-6 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 group"
              >
                <div className="flex flex-col gap-4">
                  {/* Category Image Header */}
                  {service.image && (
                    <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-slate-900/40">
                      <LazyImage
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        wrapperClassName="w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                      
                      {/* SLA and Rating Badges */}
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 rounded bg-slate-950/80 border border-slate-850 backdrop-blur text-[10px] font-bold text-cyan-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {specs.sla}
                        </span>
                        <span className="px-2.5 py-1 rounded bg-slate-950/80 border border-slate-850 backdrop-blur text-[10px] font-bold text-amber-400 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400" /> {specs.rating} ({specs.reviews} Reviews)
                        </span>
                      </div>

                      {/* Icon overlay */}
                      <div className="absolute bottom-4 left-4 bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                        {getIconComponent(service.icon)}
                      </div>
                    </div>
                  )}

                  {/* Description Details */}
                  <div className="px-1 text-left">
                    <h3 className="text-xl font-bold text-white tracking-tight leading-snug">{service.name}</h3>
                    <p className="text-slate-400 text-xs mt-2 leading-relaxed">{service.description}</p>
                    
                    {/* Checklist features */}
                    <div className="mt-4 flex flex-col gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Service Coverage Includes</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                        {specs.checklist.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-slate-300 text-xs leading-normal">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Pricing & CTA */}
                <div className="pt-5 border-t border-slate-900 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Diagnose & Repair Base Rate</span>
                    <p className="text-lg font-black text-white mt-0.5">{formatCurrency(service.basePrice)} <span className="text-[10px] text-slate-400 font-normal">/ Session</span></p>
                  </div>
                  
                  <motion.button
                    onClick={() => handleOpenBookingModal(service)}
                    variants={buttonPress}
                    whileHover="whileHover"
                    whileTap="whileTap"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-lg shadow-blue-500/10 transition-all flex items-center gap-1.5"
                  >
                    Configure Booking <ArrowRight className="w-4.5 h-4.5" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </main>

      {/* BOOKING SCHEDULING DIALOG / MODAL (GLASSMORPHIC) */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-left"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                {/* Time Slot Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Select Time Slot</label>
                  <select
                    required
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/30"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/30"
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
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/30"
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
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/30"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 outline-none resize-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <motion.button
                  type="submit"
                  variants={buttonPress}
                  whileHover="whileHover"
                  whileTap="whileTap"
                  disabled={isBookingSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg mt-2 flex justify-center"
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

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-white tracking-wider">ELECTRONIC</span>
          </div>
          <div className="flex gap-6 text-slate-400 font-medium">
            <a href="/#services" className="hover:text-white transition-colors">Services</a>
            <a href="/#diagnostic" className="hover:text-white transition-colors">AI Diagnostic</a>
            <a href="/#about" className="hover:text-white transition-colors">About Us</a>
          </div>
          <p>© {new Date().getFullYear()} Electronic repair platform. Built to enterprise standards.</p>
        </div>
      </footer>
    </div>
  );
}
