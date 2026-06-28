/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Format number to USD currency (or any custom currency)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a ISO date string into a clean readable date
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Generate a random initials avatar URL
 */
export function getInitialsAvatar(name: string): string {
  const parts = name.split(' ');
  const initials = parts.map((p) => p[0]).join('').slice(0, 2).toUpperCase();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563EB&color=ffffff&bold=true&size=128`;
}

/**
 * Clean phone number representation
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}
