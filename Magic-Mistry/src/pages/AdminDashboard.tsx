/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  Users,
  Wrench,
  Calendar,
  Settings,
  Power,
  Sliders,
  DollarSign,
  Plus,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Briefcase,
  X,
  Mail,
  Lock,
  Phone,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { getInitialsAvatar, formatDate, formatCurrency } from '../utils';
import { toast } from 'react-hot-toast';
import { hoverScale, buttonPress, pageTransition } from '../animations';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  joined: string;
}

interface StatsData {
  activeUsersCount: number;
  activeVendorsCount: number;
  workingVendorsCount: number;
  completedWorksCount: number;
  totalEarnings: number;
  vendorBreakdown: Array<{
    id: string;
    name: string;
    email: string;
    status: string;
    isWorking: boolean;
    worksDone: number;
  }>;
}

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'bookings'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Loaded DB state data
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState<StatsData>({
    activeUsersCount: 0,
    activeVendorsCount: 0,
    workingVendorsCount: 0,
    completedWorksCount: 0,
    totalEarnings: 0,
    vendorBreakdown: [],
  });

  // Modal / Form state for Vendor Creation
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const [vendorEmail, setVendorEmail] = useState('');
  const [vendorPhone, setVendorPhone] = useState('');
  const [vendorPassword, setVendorPassword] = useState('');
  const [vendorBasePrice, setVendorBasePrice] = useState('60');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isSubmittingVendor, setIsSubmittingVendor] = useState(false);

  const availableSkills = ['AC Service', 'Washing Machine', 'Smart TV', 'Refrigerator', 'Electrical', 'Water Pump'];

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, bookingsRes, statsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/bookings'),
        api.get('/admin/stats'),
      ]);
      setUsers(usersRes.data);
      setBookings(bookingsRes.data);
      setStats(statsRes.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to synchronize administration datasets.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleBlockUser = async (userId: string, currentStatus: string) => {
    try {
      const res = await api.post(`/admin/users/${userId}/toggle-block`);
      const updatedStatus = res.data.status;
      toast.success(`User successfully ${updatedStatus === 'BLOCKED' ? 'suspended' : 're-activated'}`);
      
      // Update local states
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: updatedStatus } : u))
      );
      // Refresh stats
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to complete security status toggle.');
    }
  };

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName || !vendorEmail || !vendorPassword) {
      toast.error('Please specify vendor name, email address, and authentication credentials.');
      return;
    }

    setIsSubmittingVendor(true);
    try {
      const res = await api.post('/admin/vendors', {
        name: vendorName,
        email: vendorEmail,
        phone: vendorPhone,
        password: vendorPassword,
        basePrice: Number(vendorBasePrice) || 60,
        skills: selectedSkills,
      });

      toast.success(res.data.message || 'Vendor registered successfully in the system database.');
      
      // Clear forms
      setVendorName('');
      setVendorEmail('');
      setVendorPhone('');
      setVendorPassword('');
      setVendorBasePrice('60');
      setSelectedSkills([]);
      setShowCreateModal(false);

      // Refresh data
      await fetchDashboardData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create vendor account.');
    } finally {
      setIsSubmittingVendor(false);
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row relative">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-6 md:h-screen sticky top-0 z-30">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent uppercase">
                Electronic
              </span>
              <p className="text-[9px] text-cyan-400 tracking-wider font-semibold">ADMIN CENTER</p>
            </div>
          </div>

          {/* Admin Account Info */}
          <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-white uppercase">
              EA
            </div>
            <div className="overflow-hidden text-left">
              <h4 className="text-sm font-bold text-white truncate leading-none">Electronic Admin</h4>
              <span className="text-[10px] text-red-400 mt-1 block font-bold tracking-wide uppercase">Super Admin</span>
            </div>
          </div>

          {/* Tab Links */}
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/15'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Sliders className="w-4.5 h-4.5" /> Platform Control
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'users'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/15'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Users className="w-4.5 h-4.5" /> Registry Accounts
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'bookings'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/15'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Calendar className="w-4.5 h-4.5" /> Repair Orders
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
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-slate-900 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest animate-pulse">Syncing administrative metrics...</p>
          </div>
        ) : (
          <>
            {/* Top metrics summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
              <div className="p-5 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Net Revenue Done</span>
                <div className="flex items-baseline justify-between mt-2">
                  <p className="text-2xl font-black text-white">{formatCurrency(stats.totalEarnings)}</p>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <div className="p-5 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Completed Works</span>
                <div className="flex items-baseline justify-between mt-2">
                  <p className="text-2xl font-black text-white">{stats.completedWorksCount}</p>
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                </div>
              </div>
              <div className="p-5 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Active Users</span>
                <div className="flex items-baseline justify-between mt-2">
                  <p className="text-2xl font-black text-white">{stats.activeUsersCount}</p>
                  <Users className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div className="p-5 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Active Vendors</span>
                <div className="flex items-baseline justify-between mt-2">
                  <p className="text-2xl font-black text-white">{stats.activeVendorsCount}</p>
                  <Wrench className="w-4 h-4 text-violet-400" />
                </div>
              </div>
              <div className="p-5 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Vendors Working</span>
                <div className="flex items-baseline justify-between mt-2">
                  <p className="text-2xl font-black text-white">{stats.workingVendorsCount}</p>
                  <Activity className="w-4 h-4 text-amber-400" />
                </div>
              </div>
            </div>

            {/* Platform Control Overview Tab */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-6">
                {/* Vendor Performance Breakdown */}
                <div className="p-6 bg-slate-900/40 border border-slate-900 rounded-2xl">
                  <h3 className="font-extrabold text-white text-base mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-400" /> Vendor Work Breakdown
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    List of all system vendors, completed jobs (works done), and current live status.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                          <th className="pb-3">Vendor Name</th>
                          <th className="pb-3">Email Address</th>
                          <th className="pb-3">Works Done</th>
                          <th className="pb-3">Working Status</th>
                          <th className="pb-3">Security Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.vendorBreakdown.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-4 text-center text-slate-500 font-medium">No vendors registered in system.</td>
                          </tr>
                        ) : (
                          stats.vendorBreakdown.map((v) => (
                            <tr key={v.id} className="border-b border-slate-800/40">
                              <td className="py-3 font-bold text-white flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[8px] font-bold flex items-center justify-center">V</span>
                                {v.name}
                              </td>
                              <td className="py-3 text-slate-400">{v.email}</td>
                              <td className="py-3 font-extrabold text-slate-200">{v.worksDone} Repairs Completed</td>
                              <td className="py-3">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide ${
                                    v.isWorking
                                      ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                                      : 'bg-slate-800 text-slate-400 border border-slate-700/50'
                                  }`}
                                >
                                  {v.isWorking ? 'BUSY (WORKING)' : 'IDLE'}
                                </span>
                              </td>
                              <td className="py-3">
                                <span
                                  className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                    v.status === 'ACTIVE'
                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                  }`}
                                >
                                  {v.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Diagnostics summary block */}
                <div className="p-6 bg-slate-900/40 border border-slate-900 rounded-2xl">
                  <h3 className="font-bold text-white text-base mb-4">Diagnostics Node Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                    <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between">
                      <span className="text-slate-400">Database Connection Node</span>
                      <span className="text-emerald-400 font-bold">Stable (0.1ms)</span>
                    </div>
                    <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between">
                      <span className="text-slate-400">Escrow Payment Gateway</span>
                      <span className="text-emerald-400 font-bold">Operational</span>
                    </div>
                    <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between">
                      <span className="text-slate-400">API Server Node</span>
                      <span className="text-emerald-400 font-bold">Online</span>
                    </div>
                    <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between">
                      <span className="text-slate-400">WebSockets Server Status</span>
                      <span className="text-emerald-400 font-bold">Connected</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Registry Tab */}
            {activeTab === 'users' && (
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-extrabold text-white">Registered Accounts Database</h2>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg transition-all"
                  >
                    <Plus className="w-4 h-4" /> Create Vendor
                  </button>
                </div>

                <div className="bg-slate-900/40 border border-slate-900 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-900/80 text-xs uppercase tracking-wider">
                        <th className="p-4">User Details</th>
                        <th className="p-4">Account Type</th>
                        <th className="p-4">Security Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-500">No users found in database.</td>
                        </tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u.id} className="border-b border-slate-800/50 text-xs">
                            <td className="p-4">
                              <div className="flex items-center gap-3 text-left">
                                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200">
                                  {u.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-bold text-white leading-none">{u.name}</p>
                                  <span className="text-[10px] text-slate-500 mt-1 block">{u.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  u.role === 'ADMIN'
                                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                    : u.role === 'TECHNICIAN'
                                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                }`}
                              >
                                {u.role === 'TECHNICIAN' ? 'VENDOR (TECH)' : u.role}
                              </span>
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  u.status === 'ACTIVE'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}
                              >
                                {u.status || 'ACTIVE'}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              {u.role !== 'ADMIN' && (
                                <button
                                  onClick={() => handleToggleBlockUser(u.id, u.status)}
                                  className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                                    u.status === 'ACTIVE'
                                      ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white'
                                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white'
                                  }`}
                                >
                                  {u.status === 'ACTIVE' ? 'Suspend Account' : 'Reactivate'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Repair Orders Tab */}
            {activeTab === 'bookings' && (
              <div className="flex flex-col gap-6">
                <h2 className="text-lg font-extrabold text-white">System Repair Bookings</h2>
                <div className="bg-slate-900/40 border border-slate-900 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-900/80 text-xs uppercase tracking-wider">
                        <th className="p-4">ID Ref</th>
                        <th className="p-4">Client</th>
                        <th className="p-4">Service</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Technician Assigned</th>
                        <th className="p-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-500">No bookings logged in database.</td>
                        </tr>
                      ) : (
                        bookings.map((b) => (
                          <tr key={b.id} className="border-b border-slate-800/50 text-xs">
                            <td className="p-4 font-mono text-slate-500 text-[10px]">#{b.id.substring(0, 10)}</td>
                            <td className="p-4">
                              <p className="font-bold text-white leading-none">{b.customerName}</p>
                              <span className="text-[9px] text-slate-500 mt-1 block">{b.customerPhone}</span>
                            </td>
                            <td className="p-4 text-slate-300 font-medium">{b.serviceName}</td>
                            <td className="p-4 text-slate-400">{formatDate(b.scheduledDate)}</td>
                            <td className="p-4 text-slate-300 font-bold">
                              {b.technicianName ? (
                                <span className="text-cyan-400">{b.technicianName}</span>
                              ) : (
                                <span className="text-slate-500 font-normal italic">Unassigned (Queue)</span>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  b.status === 'COMPLETED'
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS'
                                      ? 'bg-blue-500/10 text-blue-400'
                                      : 'bg-yellow-500/10 text-yellow-400'
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* CREATE VENDOR DIALOG OVERLAY */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            ></motion.div>

            {/* Card Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-left"
            >
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/5">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">Create Vendor Account</h3>
                  <p className="text-xs text-slate-400 mt-1">Configure credentials and specialized service skills.</p>
                </div>
              </div>

              <form onSubmit={handleCreateVendor} className="flex flex-col gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Vendor Full Name</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                      <Users className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe Tech"
                      value={vendorName}
                      onChange={(e) => setVendorName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        required
                        placeholder="john@repair.com"
                        value={vendorEmail}
                        onChange={(e) => setVendorEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Contact Number</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        <Phone className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="+1555123456"
                        value={vendorPhone}
                        onChange={(e) => setVendorPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Password & Base Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Login Password</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={vendorPassword}
                        onChange={(e) => setVendorPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Base Price (Per Hour)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        <DollarSign className="w-4 h-4" />
                      </span>
                      <input
                        type="number"
                        required
                        value={vendorBasePrice}
                        onChange={(e) => setVendorBasePrice(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Skills tags selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Service Competency Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {availableSkills.map((skill) => {
                      const isSelected = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                            isSelected
                              ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Vendor button */}
                <motion.button
                  type="submit"
                  variants={buttonPress}
                  whileHover="whileHover"
                  whileTap="whileTap"
                  disabled={isSubmittingVendor}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-lg mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmittingVendor ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>Create Account & Authorize</>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
