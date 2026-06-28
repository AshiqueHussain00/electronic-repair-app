/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { api } from './api';
import { Booking, BookingStatus } from '../types';

export const bookingService = {
  /**
   * Create a new service booking
   */
  async createBooking(data: {
    serviceId: string;
    serviceName: string;
    scheduledDate: string;
    scheduledTime: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    amount: number;
    paymentMethod: 'CASH' | 'CARD' | 'UPI';
    problemDescription?: string;
  }): Promise<Booking> {
    const response = await api.post<Booking>('/bookings', data);
    return response.data;
  },

  /**
   * Fetch bookings for the logged-in user (Customer, Technician, or Admin)
   */
  async getBookings(): Promise<Booking[]> {
    const response = await api.get<Booking[]>('/bookings');
    return response.data;
  },

  /**
   * Fetch single booking details by ID
   */
  async getBookingById(id: string): Promise<Booking> {
    const response = await api.get<Booking>(`/bookings/${id}`);
    return response.data;
  },

  /**
   * Update the status of a booking (Technician or Admin only)
   */
  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
    const response = await api.patch<Booking>(`/bookings/${id}/status`, { status });
    return response.data;
  },

  /**
   * Accept a booking job (Technicians only)
   */
  async acceptBooking(id: string): Promise<Booking> {
    const response = await api.post<Booking>(`/bookings/${id}/accept`);
    return response.data;
  },

  /**
   * Submit review/rating for a completed booking
   */
  async submitReview(bookingId: string, rating: number, comment: string): Promise<{ message: string }> {
    const response = await api.post(`/bookings/${bookingId}/review`, { rating, comment });
    return response.data;
  },
};
