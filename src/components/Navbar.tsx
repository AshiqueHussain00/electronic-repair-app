/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Wrench, User, LogOut, Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getInitialsAvatar } from '../utils';
import { buttonPress } from '../animations';
import { toast } from 'react-hot-toast';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Handle smooth scroll for hashed navigation links
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, [location]);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    toast.success('Logged out successfully.');
    navigate('/');
  };

  const isHome = location.pathname === '/';

  const getNavLinkProps = (hash: string) => {
    if (isHome) {
      return {
        href: hash,
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          setMobileMenuOpen(false);
          const targetId = hash.substring(1);
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      };
    } else {
      return {
        href: `/${hash}`,
        onClick: () => {
          setMobileMenuOpen(false);
        }
      };
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-900 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/10">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                ELECTRONIC
              </span>
              <p className="text-[9px] text-cyan-400 tracking-wider font-semibold uppercase">PRO REPAIR</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/services"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/services'
                  ? 'text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Services
            </Link>
            <Link
              to="/become-a-vendor"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/become-a-vendor'
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Become a Vendor
            </Link>
            <a
              {...getNavLinkProps('#catalog')}
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/' && location.hash === '#catalog'
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Our Work
            </a>
            <a
              {...getNavLinkProps('#about')}
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/' && location.hash === '#about'
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Why Us
            </a>
          </nav>

          {/* User Authentication / Profile Dropdown */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-1.5 pr-4 rounded-full hover:border-slate-700 transition-colors"
                >
                  <img
                    className="w-8 h-8 rounded-full"
                    src={user.avatar || getInitialsAvatar(user.name)}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-left">
                    <p className="text-xs font-bold text-white leading-none">{user.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium capitalize mt-0.5">{user.role.toLowerCase()}</p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2.5 w-52 rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-2xl backdrop-blur-xl"
                    >
                      <Link
                        to={`/${user.role.toLowerCase()}`}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-sm text-slate-300 hover:text-white transition-colors"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <User className="w-4 h-4 text-blue-400" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-red-500/10 text-sm text-red-400 hover:text-red-300 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <motion.div variants={buttonPress} whileHover="whileHover" whileTap="whileTap">
                  <Link
                    to="/signup"
                    className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/15 transition-all"
                  >
                    Register
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-400 hover:text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden sticky top-18 left-0 right-0 z-40 bg-slate-900 border-b border-slate-800 p-6 flex flex-col gap-5 shadow-2xl"
          >
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/services'
                  ? 'text-white font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Services
            </Link>
            <Link
              to="/become-a-vendor"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-medium ${
                location.pathname === '/become-a-vendor' ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Become a Vendor
            </Link>
            <a
              {...getNavLinkProps('#catalog')}
              className="text-sm font-medium text-slate-300 hover:text-white"
            >
              Our Work
            </a>
            <a
              {...getNavLinkProps('#about')}
              className="text-sm font-medium text-slate-300 hover:text-white"
            >
              Why Us
            </a>
            <div className="h-px bg-slate-800 my-1"></div>
            {isAuthenticated && user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 rounded-full"
                    src={user.avatar || getInitialsAvatar(user.name)}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-left">
                    <p className="text-sm font-bold text-white leading-none">{user.name}</p>
                    <p className="text-xs text-slate-400 font-medium capitalize mt-1">{user.role.toLowerCase()}</p>
                  </div>
                </div>
                <Link
                  to={`/${user.role.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl transition-all text-xs"
                >
                  <User className="w-4 h-4 text-blue-400" /> Go to Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-bold py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-sm font-medium text-slate-300 hover:text-white py-2.5 border border-slate-800 hover:border-slate-700 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-center text-sm font-semibold py-3 rounded-xl shadow-lg transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
