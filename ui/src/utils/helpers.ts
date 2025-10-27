import { PROFILE_TYPES, REQUEST_TYPES, REQUEST_STATUSES, COMPLAINT_STATUSES, USER_STATUSES, OWNER_TYPES, PAYMENT_STATUSES, FEATURE_DATA_TYPES } from './constants';
import type { ProfileType } from '../types/api';

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11 && cleaned.startsWith('09')) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
};

// Format date to Persian
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch {
    return dateString;
  }
};

// Format currency (IRR)
export const formatCurrency = (amount: number): string => {
  if (typeof amount !== 'number') return '0';
  
  return new Intl.NumberFormat('fa-IR', {
    style: 'currency',
    currency: 'IRR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format large numbers with Persian digits
export const formatNumber = (num: number): string => {
  if (typeof num !== 'number') return '0';
  
  return new Intl.NumberFormat('fa-IR').format(num);
};

// Get profile type label
export const getProfileTypeLabel = (type: ProfileType): string => {
  return PROFILE_TYPES[type] || type;
};

// Get request type label
export const getRequestTypeLabel = (type: 'activation' | 'upgrade'): string => {
  return REQUEST_TYPES[type] || type;
};

// Get request status label
export const getRequestStatusLabel = (status: 'pending' | 'approved' | 'rejected'): string => {
  return REQUEST_STATUSES[status] || status;
};

// Get complaint status label
export const getComplaintStatusLabel = (status: 'pending' | 'in_review' | 'resolved' | 'rejected'): string => {
  return COMPLAINT_STATUSES[status] || status;
};

// Get user status label
export const getUserStatusLabel = (status: 'pending' | 'active' | 'suspended'): string => {
  return USER_STATUSES[status] || status;
};

// Get owner type label
export const getOwnerTypeLabel = (type: 'company' | 'elevator'): string => {
  return OWNER_TYPES[type] || type;
};

// Get payment status label
export const getPaymentStatusLabel = (status: 'initiated' | 'success' | 'failed' | 'canceled'): string => {
  return PAYMENT_STATUSES[status] || status;
};

// Get feature data type label
export const getFeatureDataTypeLabel = (type: 'string' | 'number' | 'boolean' | 'date' | 'enum'): string => {
  return FEATURE_DATA_TYPES[type] || type;
};

// Generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Validate Iranian phone number
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^09\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

// Validate Iranian postal code
export const isValidPostalCode = (code: string): boolean => {
  const postalRegex = /^\d{10}$/;
  return postalRegex.test(code.replace(/\D/g, ''));
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate barcode
export const generateBarcode = (prefix: string = 'P'): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// Calculate pagination info
export const calculatePagination = (page: number, size: number, total: number) => {
  const totalPages = Math.ceil(total / size);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;
  const startItem = (page - 1) * size + 1;
  const endItem = Math.min(page * size, total);

  return {
    totalPages,
    hasNext,
    hasPrev,
    startItem,
    endItem,
    showing: `نمایش ${formatNumber(startItem)} تا ${formatNumber(endItem)} از ${formatNumber(total)} مورد`
  };
};

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  
  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
}

// Convert Persian digits to English
export const persianToEnglishDigits = (str: string): string => {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  const englishDigits = '0123456789';
  
  return str.replace(/[۰-۹]/g, (match) => {
    return englishDigits[persianDigits.indexOf(match)];
  });
};

// Convert English digits to Persian
export const englishToPersianDigits = (str: string): string => {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  const englishDigits = '0123456789';
  
  return str.replace(/[0-9]/g, (match) => {
    return persianDigits[englishDigits.indexOf(match)];
  });
};

// File size formatter
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 بایت';
  
  const k = 1024;
  const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Sort array by Persian text
export function sortByPersianText<T>(
  array: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aValue = String(a[key]);
    const bValue = String(b[key]);
    const result = aValue.localeCompare(bValue, 'fa');
    return direction === 'asc' ? result : -result;
  });
}