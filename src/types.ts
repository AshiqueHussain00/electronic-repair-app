/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  TECHNICIAN = 'TECHNICIAN',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  basePrice: number;
  image?: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  technicianId?: string;
  technicianName?: string;
  scheduledDate: string;
  scheduledTime: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: BookingStatus;
  amount: number;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  paymentMethod: 'CASH' | 'CARD' | 'UPI';
  problemDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  type: 'BOOKING_UPDATE' | 'PAYMENT_SUCCESS' | 'GENERAL' | 'SECURITY';
  createdAt: string;
}

export interface TechnicianProfile {
  userId: string;
  specialties: string[]; // e.g. ["AC", "Refrigerator"]
  experienceYears: number;
  rating: number;
  totalJobs: number;
  status: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  earnings: number;
}
