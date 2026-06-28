/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wrench,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  DollarSign,
  Star,
  Settings,
  Power,
  ShieldCheck,
  Briefcase,
  AlertCircle,
  Eye,
  Info,
  Award,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { getInitialsAvatar, formatDate, formatCurrency } from '../utils';
import { toast } from 'react-hot-toast';
import { hoverScale, buttonPress, pageTransition } from '../animations';

export default function TechnicianDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'jobs' | 'earnings' | 'reviews' | 'profile'>('jobs');
  const [availability, setAvailability] = useState<'AVAILABLE' | 'BUSY' | 'OFFLINE'>('AVAILABLE');
  const [isLoading, setIsLoading] = useState(true);

  // Real DB state data
  const [assignedJobs, setAssignedJobs] = useState<any[]>([]);
  const [availableJobs, setAvailableJobs] = useState<any[]>([]);

  // Computed states
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [jobsCompletedCount, setJobsCompletedCount] = useState(0);
  const [avgRating, setAvgRating] = useState(4.8);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/bookings');
      const allBookings = res.data;

      // Filter local lists
      const assigned = allBookings.filter((b: any) => b.technicianId === user?.id);
      const available = allBookings.filter((b: any) => b.status === 'PENDING' && !b.technicianId);

      setAssignedJobs(assigned);
      setAvailableJobs(available);

      // Compute statistics based on completed jobs
      const completed = assigned.filter((b: any) => b.status === 'COMPLETED');
      const earningsSum = completed.reduce((sum: number, b: any) => sum + (Number(b.amount) || 0), 0);
      setTotalEarnings(earningsSum);
      setJobsCompletedCount(completed.length);

      // Compute average rating
      const reviewed = completed.filter((b: any) => b.reviewed);
      if (reviewed.length > 0) {
        const ratingSum = reviewed.reduce((sum: number, b: any) => sum + (Number(b.reviewRating) || 0), 0);
        setAvgRating(Number((ratingSum / reviewed.length).toFixed(2)));
      } else {
        setAvgRating(4.8);
      }
    } catch (err: any) {
      toast.error('Failed to synchronize dispatcher queues.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchJobs();
    }
  }, [user]);

  const handleAcceptJob = async (jobId: string) => {
    try {
      await api.post(`/bookings/${jobId}/accept`);
      toast.success('Service job accepted! Check your assigned queue.');
      fetchJobs();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to accept job assignment.');
    }
  };

  const handleUpdateStatus = async (jobId: string, currentStatus: string) => {
    let nextStatus = 'ACCEPTED';
    if (currentStatus === 'ACCEPTED') {
      nextStatus = 'IN_PROGRESS';
    } else if (currentStatus === 'IN_PROGRESS') {
      nextStatus = 'COMPLETED';
    }

    try {
      await api.patch(`/bookings/${jobId}/status`, { status: nextStatus });
      toast.success(`Job updated successfully to ${nextStatus === 'IN_PROGRESS' ? 'In Progress' : 'Completed'}`);
      fetchJobs();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update repair order status.');
    }
  };

  const handleToggleAvailability = (status: 'AVAILABLE' | 'BUSY' | 'OFFLINE') => {
    setAvailability(status);
    toast.success(`Availability changed to ${status.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row relative">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-6 md:h-screen sticky top-0 z-30">
        <div className="flex flex-col gap-8 text-left">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent uppercase">
                Electronic
              </span>
              <p className="text-[9px] text-cyan-400 tracking-wider font-semibold">PRO WORKER</p>
            </div>
          </div>

          {/* User profile details */}
          <div className="flex flex-col gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <img
                src={user?.avatar || getInitialsAvatar(user?.name || '')}
                alt="avatar"
                className="w-10 h-10 rounded-full shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="overflow-hidden">
                <h4 className="text-sm font-bold text-white truncate leading-none">{user?.name}</h4>
                <span className="text-[10px] text-slate-500 mt-1 block">Certified Specialist</span>
              </div>
            </div>

            {/* Availability pill trigger */}
            <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[9px] font-bold">
              <button
                onClick={() => handleToggleAvailability('AVAILABLE')}
                className={`py-1 rounded text-center transition-all ${
                  availability === 'AVAILABLE' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-500 hover:text-white'
                }`}
              >
                Online
              </button>
              <button
                onClick={() => handleToggleAvailability('BUSY')}
                className={`py-1 rounded text-center transition-all ${
                  availability === 'BUSY' ? 'bg-amber-500/10 text-amber-400' : 'text-slate-500 hover:text-white'
                }`}
              >
                Busy
              </button>
              <button
                onClick={() => handleToggleAvailability('OFFLINE')}
                className={`py-1 rounded text-center transition-all ${
                  availability === 'OFFLINE' ? 'bg-red-500/10 text-red-400' : 'text-slate-500 hover:text-white'
                }`}
              >
                Offline
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'jobs'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/15'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Briefcase className="w-4.5 h-4.5" /> Service Orders
            </button>
            <button
              onClick={() => setActiveTab('earnings')}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'earnings'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/15'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <DollarSign className="w-4.5 h-4.5" /> Payouts & Earnings
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'reviews'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/15'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Star className="w-4.5 h-4.5" /> Reviews
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

      {/* Main Panel Content */}
      <main className="flex-1 p-6 sm:p-10 md:h-screen md:overflow-y-auto bg-slate-950 flex flex-col text-left">
        {/* Metric summary boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="p-5 bg-slate-900/40 border border-slate-900 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Gross Earnings</span>
              <p className="text-2xl font-extrabold text-white mt-1">{formatCurrency(totalEarnings)}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 bg-slate-900/40 border border-slate-900 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Jobs Completed</span>
              <p className="text-2xl font-extrabold text-white mt-1">{jobsCompletedCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 bg-slate-900/40 border border-slate-900 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Expert Rating</span>
              <p className="text-2xl font-extrabold text-white mt-1">{avgRating}<span className="text-amber-400 text-lg">★</span></p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Dynamic content rendering */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-slate-900 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest animate-pulse">Syncing dispatcher queues...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* JOBS TAB */}
            {activeTab === 'jobs' && (
              <div className="flex flex-col gap-8">
                {/* Assigned repairs queue */}
                <div className="flex flex-col gap-4">
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    Assigned Repairs Queue <span className="text-xs font-normal text-slate-500">({assignedJobs.filter(j => j.status !== 'COMPLETED').length})</span>
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    {assignedJobs.filter((j) => j.status !== 'COMPLETED').length === 0 ? (
                      <div className="p-10 border border-dashed border-slate-800 bg-slate-900/10 rounded-2xl text-center text-slate-500 font-medium">
                        No active jobs in your queue. Accept jobs below to start work.
                      </div>
                    ) : (
                      assignedJobs
                        .filter((j) => j.status !== 'COMPLETED')
                        .map((job) => (
                          <div
                            key={job.id}
                            className="p-5 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col md:flex-row justify-between gap-6 relative"
                          >
                            <div className="flex flex-col gap-3">
                              <div className="flex items-center gap-3">
                                <h3 className="font-bold text-white text-base">{job.serviceName}</h3>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  job.status === 'ACCEPTED'
                                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'
                                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                                }`}>
                                  {job.status === 'ACCEPTED' ? 'Assigned' : 'In Progress'}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-1 text-xs text-slate-400">
                                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(job.scheduledDate)}</span>
                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {job.scheduledTime}</span>
                                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.address.street}, {job.address.city}</span>
                              </div>

                              <div className="p-3 bg-slate-950/50 border border-slate-900 text-xs rounded-xl text-slate-300">
                                <p><strong>Customer:</strong> {job.customerName} | {job.customerPhone}</p>
                                <p className="mt-1"><strong>Symptoms:</strong> {job.problemDescription || 'No description provided'}</p>
                              </div>
                            </div>

                            {/* Status updates */}
                            <div className="flex flex-col justify-between items-end gap-3 shrink-0">
                              <div className="text-right">
                                <span className="text-[10px] text-slate-500 font-bold uppercase">Payout</span>
                                <p className="text-lg font-bold text-white">{formatCurrency(job.amount)}</p>
                              </div>

                              <button
                                onClick={() => handleUpdateStatus(job.id, job.status)}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/10 transition-all"
                              >
                                {job.status === 'ACCEPTED' ? 'Start Service' : 'Mark Completed'}
                              </button>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* Available repairs queue */}
                <div className="flex flex-col gap-4">
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    Available Repair Requests <span className="text-xs font-normal text-slate-500">({availableJobs.length})</span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableJobs.length === 0 ? (
                      <div className="p-10 md:col-span-2 border border-dashed border-slate-800 bg-slate-900/10 rounded-2xl text-center text-slate-500 font-medium">
                        No new repair requests in the local dispatch queue. Checked just now.
                      </div>
                    ) : (
                      availableJobs.map((job) => (
                        <div
                          key={job.id}
                          className="p-5 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col justify-between gap-4 text-left"
                        >
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="font-bold text-white text-base leading-snug">{job.serviceName}</h3>
                              <span className="px-2 py-0.5 rounded bg-slate-850 text-slate-400 border border-slate-800 text-[10px] font-bold">
                                Pending Dispatch
                              </span>
                            </div>

                            <div className="flex flex-col gap-1 text-xs text-slate-400 mt-1">
                              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(job.scheduledDate)} @ {job.scheduledTime}</span>
                              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.address.city}, {job.address.zipCode}</span>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-slate-500 uppercase font-semibold">Payout</span>
                              <p className="text-base font-bold text-white">{formatCurrency(job.amount)}</p>
                            </div>
                            <button
                              onClick={() => handleAcceptJob(job.id)}
                              className="px-4 py-2 bg-slate-900 hover:bg-blue-600 border border-slate-800 hover:border-transparent text-xs font-bold text-blue-400 hover:text-white rounded-lg transition-all"
                            >
                              Accept Job
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* EARNINGS TAB */}
            {activeTab === 'earnings' && (
              <div className="flex flex-col gap-6">
                <h2 className="text-lg font-extrabold text-white">Payout & Earnings Registry</h2>
                
                <div className="bg-slate-900/40 border border-slate-900 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-900/80 text-xs uppercase tracking-wider">
                        <th className="p-4">Reference ID</th>
                        <th className="p-4">Repair Service</th>
                        <th className="p-4">Completion Date</th>
                        <th className="p-4">Client Name</th>
                        <th className="p-4 text-right">Earning Payout</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignedJobs.filter(j => j.status === 'COMPLETED').length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-500">No earnings logged yet. Complete jobs to receive payouts.</td>
                        </tr>
                      ) : (
                        assignedJobs
                          .filter((j) => j.status === 'COMPLETED')
                          .map((job) => (
                            <tr key={job.id} className="border-b border-slate-800/50 text-xs">
                              <td className="p-4 font-mono text-slate-500 text-[10px]">#{job.id.substring(0, 10)}</td>
                              <td className="p-4 font-bold text-white">{job.serviceName}</td>
                              <td className="p-4 text-slate-400">{formatDate(job.updatedAt || job.scheduledDate)}</td>
                              <td className="p-4 text-slate-300">{job.customerName}</td>
                              <td className="p-4 text-right text-emerald-400 font-bold">{formatCurrency(job.amount)}</td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <div className="flex flex-col gap-6">
                <h2 className="text-lg font-extrabold text-white">Customer Reviews & Ratings</h2>

                <div className="grid grid-cols-1 gap-4">
                  {assignedJobs.filter(j => j.reviewed).length === 0 ? (
                    <div className="p-10 border border-dashed border-slate-800 bg-slate-900/10 rounded-2xl text-center text-slate-500 font-medium">
                      No ratings or review comments received yet.
                    </div>
                  ) : (
                    assignedJobs
                      .filter((j) => j.reviewed)
                      .map((job) => (
                        <div
                          key={job.id}
                          className="p-5 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col gap-3 text-left"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] text-slate-500 uppercase font-semibold">Service Type</span>
                              <h4 className="text-sm font-bold text-white">{job.serviceName}</h4>
                            </div>
                            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-amber-400 text-xs font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              <span>{job.reviewRating} / 5</span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed italic mt-1">
                            "{job.reviewComment || 'No feedback comments provided.'}"
                          </p>
                          <span className="text-[10px] text-slate-500 font-bold block mt-2">
                            — Review by {job.customerName} on {formatDate(job.updatedAt || job.scheduledDate)}
                          </span>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
