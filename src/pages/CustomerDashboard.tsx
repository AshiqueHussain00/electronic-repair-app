/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  FileText,
  Star,
  Settings,
  ShieldCheck,
  Power,
  Wrench,
  AlertCircle,
  CreditCard,
  Heart,
  ChevronRight,
  ChevronDown,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getInitialsAvatar, formatDate, formatCurrency } from '../utils';
import { toast } from 'react-hot-toast';
import { buttonPress } from '../animations';

export default function CustomerDashboard() {
  const { user, logout, updateUserInState } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'bookings' | 'invoices' | 'wishlist' | 'profile' | 'settings'>('bookings');
  const [bookings, setBookings] = useState<any[]>([]);

  // Feedback/review state
  const [ratingBooking, setRatingBooking] = useState<any | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Profile Form States
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');

  // Load bookings from localStorage
  useEffect(() => {
    if (user) {
      const key = `bookings_${user.id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setBookings(JSON.parse(saved));
      } else {
        // Seed initial mock booking so dashboard isn't dry
        const seed = [
          {
            id: 'book-1',
            serviceId: 'ac',
            serviceName: 'Air Conditioner Repair',
            scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
            scheduledTime: '11:00 AM',
            address: {
              street: '456 Elite Broadway Rd',
              city: 'New York',
              state: 'NY',
              zipCode: '10002',
            },
            status: 'ACCEPTED',
            amount: 80,
            paymentStatus: 'PAID',
            paymentMethod: 'CARD',
            problemDescription: 'Flickering motor sound and low compressor cooling.',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'book-2',
            serviceId: 'tv',
            serviceName: 'LED/Smart TV Repair',
            scheduledDate: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
            scheduledTime: '03:00 PM',
            address: {
              street: '456 Elite Broadway Rd',
              city: 'New York',
              state: 'NY',
              zipCode: '10002',
            },
            status: 'COMPLETED',
            amount: 90,
            paymentStatus: 'PAID',
            paymentMethod: 'UPI',
            problemDescription: 'Horizontal black bar at the top of the display.',
            createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
            reviewed: false,
          },
        ];
        localStorage.setItem(key, JSON.stringify(seed));
        setBookings(seed);
      }
    }
  }, [user]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      toast.error('Full Name is required.');
      return;
    }
    if (user) {
      const updated = {
        ...user,
        name: profileName,
        phone: profilePhone,
      };
      updateUserInState(updated);
      toast.success('Your profile coordinates have been securely updated!');
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        return { ...b, status: 'CANCELLED' };
      }
      return b;
    });
    setBookings(updated);
    if (user) {
      localStorage.setItem(`bookings_${user.id}`, JSON.stringify(updated));
    }
    toast.success('Service booking has been cancelled successfully.');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast.error('Please write a short review comment.');
      return;
    }

    const updated = bookings.map((b) => {
      if (b.id === ratingBooking.id) {
        return { ...b, reviewed: true };
      }
      return b;
    });

    setBookings(updated);
    if (user) {
      localStorage.setItem(`bookings_${user.id}`, JSON.stringify(updated));
    }

    toast.success('Thank you for rating our technician!');
    setRatingBooking(null);
    setReviewComment('');
    setReviewRating(5);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-[10px] font-bold border border-yellow-500/20">Pending Match</span>;
      case 'ACCEPTED':
        return <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">Technician Assigned</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20">Repairing</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">Completed</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold border border-red-500/20">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">Unknown</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row relative">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-6 md:h-screen sticky top-0">
        <div className="flex flex-col gap-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent uppercase">
                Magic Mistry
              </span>
              <p className="text-[9px] text-cyan-400 tracking-wider font-semibold">CUSTOMER HUB</p>
            </div>
          </div>

          {/* User badge */}
          <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <img
              src={user?.avatar || getInitialsAvatar(user?.name || '')}
              alt="avatar"
              className="w-10 h-10 rounded-full shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-white truncate leading-none">{user?.name}</h4>
              <span className="text-[10px] text-slate-500 mt-1 block">Customer Account</span>
            </div>
          </div>

          {/* Tab lists */}
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'bookings'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/15'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Calendar className="w-4.5 h-4.5" /> Bookings Tracker
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'invoices'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/15'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <FileText className="w-4.5 h-4.5" /> Service Invoices
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'wishlist'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/15'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Heart className="w-4.5 h-4.5" /> Wishlist
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/15'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <User className="w-4.5 h-4.5" /> Edit Profile
            </button>
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors mt-8"
        >
          <Power className="w-4.5 h-4.5" /> Log Out Session
        </button>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-6 sm:p-10 md:h-screen md:overflow-y-auto bg-slate-950">
        {/* Header greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-900">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hello, {user?.name.split(' ')[0]}
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage scheduled service sessions and review repair reports.</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-fit bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs py-2.5 px-5 rounded-xl flex items-center gap-2"
          >
            New Repair Booking <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Tab Contents */}
        <div className="flex flex-col gap-6">
          {/* 1. BOOKINGS TRACKER */}
          {activeTab === 'bookings' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-extrabold text-white">Your Scheduled Bookings</h2>

              {bookings.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col items-center gap-3">
                  <Calendar className="w-10 h-10 text-slate-600" />
                  <p className="text-slate-400 text-sm font-semibold">No active service sessions</p>
                  <p className="text-slate-500 text-xs px-10">
                    You do not have any pending or accepted repair bookings currently scheduled.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-6 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col md:flex-row justify-between gap-6 relative overflow-hidden backdrop-blur-xl"
                    >
                      {/* Left Block */}
                      <div className="flex flex-col gap-3.5">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg text-white">{booking.serviceName}</h3>
                          {getStatusBadge(booking.status)}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-2 gap-x-6 text-xs text-slate-400 font-medium">
                          <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-500 shrink-0" />{' '}
                            {formatDate(booking.scheduledDate)}
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-500 shrink-0" /> {booking.scheduledTime}
                          </span>
                          <span className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-500 shrink-0" /> {booking.address.street}
                          </span>
                        </div>

                        {booking.problemDescription && (
                          <div className="p-3 bg-slate-950/60 rounded-xl text-slate-400 text-xs border border-slate-900 leading-normal">
                            <strong>Problem:</strong> {booking.problemDescription}
                          </div>
                        )}
                      </div>

                      {/* Right Block */}
                      <div className="flex flex-col md:items-end justify-between gap-4 shrink-0">
                        <div className="md:text-right">
                          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                            Total Investment
                          </span>
                          <p className="text-xl font-bold text-white mt-0.5">{formatCurrency(booking.amount)}</p>
                          <span className="text-[10px] text-cyan-400 font-bold block mt-1 capitalize">
                            Payment: {booking.paymentStatus} ({booking.paymentMethod})
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {booking.status === 'COMPLETED' && !booking.reviewed && (
                            <button
                              onClick={() => setRatingBooking(booking)}
                              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 shadow-lg"
                            >
                              Leave Star Rating <Star className="w-3.5 h-3.5 fill-slate-950" />
                            </button>
                          )}

                          {['PENDING', 'ACCEPTED'].includes(booking.status) && (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="px-4 py-2 bg-slate-900 hover:bg-red-500/10 hover:text-red-400 text-slate-400 font-bold text-xs rounded-xl border border-slate-800 hover:border-transparent transition-all"
                            >
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. INVOICES */}
          {activeTab === 'invoices' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-extrabold text-white">Your Service Invoices</h2>
              <div className="bg-slate-900/40 border border-slate-900 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-900/80 text-xs uppercase tracking-wider">
                      <th className="p-4">Invoice ID</th>
                      <th className="p-4">Service</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings
                      .filter((b) => b.status === 'COMPLETED')
                      .map((b) => (
                        <tr key={b.id} className="border-b border-slate-800/50 text-xs">
                          <td className="p-4 font-mono text-slate-400">INV-{b.id.toUpperCase()}</td>
                          <td className="p-4 font-bold text-white">{b.serviceName}</td>
                          <td className="p-4 text-slate-300">{formatDate(b.scheduledDate)}</td>
                          <td className="p-4 text-slate-300 font-semibold">{formatCurrency(b.amount)}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                              Paid
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => toast.success('Downloading Secure Invoice PDF...')}
                              className="text-blue-400 hover:underline font-semibold"
                            >
                              Download PDF
                            </button>
                          </td>
                        </tr>
                      ))}
                    {bookings.filter((b) => b.status === 'COMPLETED').length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">
                          No paid receipts available yet. Complete a repair job to unlock downloadable invoices.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-extrabold text-white">Your Saved Favorites</h2>
              <div className="p-8 text-center bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col items-center gap-3">
                <Heart className="w-10 h-10 text-slate-600" />
                <p className="text-slate-400 text-sm font-semibold">Wishlist is empty</p>
                <p className="text-slate-500 text-xs px-10">
                  Bookmark repair services from our homepage to list them here for rapid scheduling.
                </p>
              </div>
            </div>
          )}

          {/* 4. PROFILE FORM */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="max-w-md bg-slate-900/40 border border-slate-900 p-6 sm:p-8 rounded-2xl flex flex-col gap-5">
              <h2 className="text-lg font-extrabold text-white mb-2">Edit Account Settings</h2>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-100 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400">Phone Coordinate</label>
                <input
                  type="text"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-100 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400">Registered Email</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-slate-500 outline-none cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-blue-400" /> For security purposes, email modifications require Admin permission.
                </span>
              </div>

              <motion.button
                type="submit"
                variants={buttonPress}
                whileHover="whileHover"
                whileTap="whileTap"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg mt-3"
              >
                Save Changes
              </motion.button>
            </form>
          )}
        </div>

        {/* FEEDBACK RATING DIALOG MODAL */}
        <AnimatePresence>
          {ratingBooking && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl"
              >
                <h3 className="text-xl font-extrabold text-white mb-2">Rate Your Repair Service</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                  Please share your honest rating and comment for <strong className="text-white">{ratingBooking.serviceName}</strong>. This maintains quality standards.
                </p>

                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                  {/* Rating selection */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400">Quality Score</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((stars) => (
                        <button
                          key={stars}
                          type="button"
                          onClick={() => setReviewRating(stars)}
                          className="p-1 focus:outline-none"
                        >
                          <Star
                            className={`w-8 h-8 transition-colors ${
                              stars <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400">Share Your Experience</label>
                    <textarea
                      required
                      placeholder="Was the technician professional? Did they clean up?"
                      rows={4}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 outline-none resize-none"
                    />
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setRatingBooking(null)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-xs font-bold text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
