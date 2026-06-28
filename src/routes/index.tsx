/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import LoadingScreen from '../components/LoadingScreen';
import PublicLayout from '../components/PublicLayout';

// Lazy-loaded views for high performance
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));
const VerifyOTP = lazy(() => import('../pages/VerifyOTP'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const BecomeVendor = lazy(() => import('../pages/BecomeVendor'));
const AllServices = lazy(() => import('../pages/AllServices'));

// Dashboards
const CustomerDashboard = lazy(() => import('../pages/CustomerDashboard'));
const TechnicianDashboard = lazy(() => import('../pages/TechnicianDashboard'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));

/**
 * Guard for authenticated routes with optional role-based access control
 */
export const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: UserRole[] }> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium tracking-wide">Authenticating Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check roles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their default dashboard
    if (user.role === UserRole.ADMIN) return <Navigate to="/admin" replace />;
    if (user.role === UserRole.TECHNICIAN) return <Navigate to="/technician" replace />;
    return <Navigate to="/customer" replace />;
  }

  return <>{children}</>;
};

/**
 * Guard for public-only auth routes (Login, Signup, ForgotPassword)
 */
export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium tracking-wide">Verifying Access...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    if (user.role === UserRole.ADMIN) return <Navigate to="/admin" replace />;
    if (user.role === UserRole.TECHNICIAN) return <Navigate to="/technician" replace />;
    return <Navigate to="/customer" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public Pages with shared Navbar */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/become-a-vendor" element={<BecomeVendor />} />
          <Route path="/services" element={<AllServices />} />
        </Route>

        {/* Auth Pages (Protected from logged-in users) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/verify-otp"
          element={
            <PublicRoute>
              <VerifyOTP />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        {/* Role Protected Dashboards */}
        <Route
          path="/customer/*"
          element={
            <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/technician/*"
          element={
            <ProtectedRoute allowedRoles={[UserRole.TECHNICIAN]}>
              <TechnicianDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
