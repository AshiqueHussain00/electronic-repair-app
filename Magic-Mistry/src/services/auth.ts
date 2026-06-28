/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { api } from './api';
import { User, UserRole } from '../types';

export interface LoginResponse {
  user: User;
  accessToken: string;
  isOTPRequired?: boolean;
}

export interface RegisterResponse {
  user: User;
  message: string;
}

export const authService = {
  /**
   * Log in a user with email and password
   */
  async login(email: string, password: string, rememberMe: boolean = false): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', { email, password, rememberMe });
    return response.data;
  },

  /**
   * Register a new user
   */
  async register(data: { name: string; email: string; phone: string; password: string; role: UserRole }): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Verify an OTP code for email/phone verification
   */
  async verifyOTP(email: string, otp: string, purpose: 'REGISTER' | 'LOGIN' | 'FORGOT_PASSWORD'): Promise<{ user?: User; accessToken?: string; message: string }> {
    const response = await api.post('/auth/verify-otp', { email, otp, purpose });
    return response.data;
  },

  /**
   * Resend verification OTP code
   */
  async resendOTP(email: string, purpose: 'REGISTER' | 'LOGIN' | 'FORGOT_PASSWORD'): Promise<{ message: string }> {
    const response = await api.post('/auth/resend-otp', { email, purpose });
    return response.data;
  },

  /**
   * Request password reset OTP
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Complete password reset using OTP
   */
  async resetPassword(email: string, otp: string, password: string): Promise<{ message: string }> {
    const response = await api.post('/auth/reset-password', { email, otp, password });
    return response.data;
  },

  /**
   * Fetch currently authenticated user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Log out the current user session
   */
  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
  },
};
