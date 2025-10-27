export type ClassValue = string | number | boolean | undefined | null | ClassValue[] | Record<string, any>;

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];
  
  inputs.forEach(input => {
    if (!input) return;
    
    if (typeof input === 'string') {
      classes.push(input);
    } else if (typeof input === 'number') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) classes.push(nested);
    } else if (typeof input === 'object') {
      Object.entries(input).forEach(([key, value]) => {
        if (value) classes.push(key);
      });
    }
  });
  
  // Simple deduplication - keeps last occurrence
  const classMap = new Map();
  classes.forEach(cls => {
    cls.split(' ').forEach(c => {
      if (c.trim()) classMap.set(c.trim(), true);
    });
  });
  
  return Array.from(classMap.keys()).join(' ');
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('fa-IR').format(d);
}

export function formatCurrency(amount: number, currency = 'IRR'): string {
  return new Intl.NumberFormat('fa-IR', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

export function formatNumber(number: number): string {
  return new Intl.NumberFormat('fa-IR').format(number);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function generateId(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidMobile(mobile: string): boolean {
  const mobileRegex = /^09\d{9}$/;
  return mobileRegex.test(mobile);
}

export function isValidNationalId(nationalId: string): boolean {
  if (!/^\d{10}$/.test(nationalId)) return false;
  
  const check = parseInt(nationalId[9]);
  const sum = nationalId
    .split('')
    .slice(0, 9)
    .reduce((acc, digit, index) => acc + parseInt(digit) * (10 - index), 0);
  
  const remainder = sum % 11;
  return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
}

export function convertPersianToEnglish(str: string): string {
  const persianNumbers = '۰۱۲۳۴۵۶۷۸۹';
  const englishNumbers = '0123456789';
  
  return str.replace(/[۰-۹]/g, (match) => {
    return englishNumbers[persianNumbers.indexOf(match)];
  });
}

export function convertEnglishToPersian(str: string): string {
  const persianNumbers = '۰۱۲۳۴۵۶۷۸۹';
  const englishNumbers = '0123456789';
  
  return str.replace(/[0-9]/g, (match) => {
    return persianNumbers[englishNumbers.indexOf(match)];
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function removeEmptyValues(obj: Record<string, any>): Record<string, any> {
  const cleaned: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== '') {
      if (typeof value === 'object' && !Array.isArray(value)) {
        const nestedCleaned = removeEmptyValues(value);
        if (Object.keys(nestedCleaned).length > 0) {
          cleaned[key] = nestedCleaned;
        }
      } else {
        cleaned[key] = value;
      }
    }
  }
  
  return cleaned;
}

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (typeof obj === 'object') {
    const cloned: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone((obj as any)[key]);
      }
    }
    return cloned;
  }
  return obj;
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function objectToQueryString(obj: Record<string, any>): string {
  const params = new URLSearchParams();
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => params.append(key, String(item)));
      } else {
        params.append(key, String(value));
      }
    }
  }
  
  return params.toString();
}

export function queryStringToObject(queryString: string): Record<string, any> {
  const params = new URLSearchParams(queryString);
  const obj: Record<string, any> = {};
  
  for (const [key, value] of params.entries()) {
    if (obj[key]) {
      if (Array.isArray(obj[key])) {
        obj[key].push(value);
      } else {
        obj[key] = [obj[key], value];
      }
    } else {
      obj[key] = value;
    }
  }
  
  return obj;
}