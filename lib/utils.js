import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date, format = 'PP') {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function truncate(str, length = 50) {
  if (!str || str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function getStatusColor(status) {
  const statusColors = {
    // Product Status
    draft: 'gray',
    pending_approval: 'warning',
    approved: 'success',
    rejected: 'danger',
    inactive: 'gray',
    
    // Order Status
    new: 'primary',
    accepted: 'success',
    processing: 'warning',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'danger',
    returned: 'warning',
    
    // Payment Status
    pending: 'warning',
    completed: 'success',
    failed: 'danger',
    refunded: 'warning',
  };

  return statusColors[status] || 'gray';
}

export function getStatusBadgeClass(status) {
  const color = getStatusColor(status);
  return `badge badge-${color}`;
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function generateSKU() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `SKU-${timestamp}-${random}`.toUpperCase();
}

export function validateGST(gst) {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gst);
}

export function validatePAN(pan) {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
}

export function validateMobile(mobile) {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
}

export function calculatePercentage(value, total) {
  if (total === 0) return 0;
  return ((value / total) * 100).toFixed(2);
}

export function generateRandomColor() {
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b',
    '#10b981', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
