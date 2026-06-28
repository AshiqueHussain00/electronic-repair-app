/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from 'axios';

// Create a globally-configured Axios instance
export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial for cookie-based JWT/Refresh Token security
});

// Request interceptor to attach bearer token if stored in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally and perform silent token refreshes
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration (401 unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt silent refresh using cookies (HttpOnly cookie) or localStorage refresh token
        const refreshResponse = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        const { accessToken } = refreshResponse.data;

        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token expired or invalid; trigger auto logout
        localStorage.removeItem('accessToken');
        // Let callers handle the error or redirect to login
      }
    }

    return Promise.reject(error);
  }
);
