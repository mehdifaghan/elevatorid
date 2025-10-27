// Profile types in Persian
export const PROFILE_TYPES = {
  producer: 'تولیدکننده',
  importer: 'وارد کننده',
  installer: 'نصب کننده',
  seller: 'فروشنده',
  coop_org: 'سازمان همکار'
} as const;

// Request types
export const REQUEST_TYPES = {
  activation: 'فعال‌سازی',
  upgrade: 'ارتقای پروفایل'
} as const;

// Request statuses
export const REQUEST_STATUSES = {
  pending: 'در انتظار بررسی',
  approved: 'تایید شده',
  rejected: 'رد شده'
} as const;

// Complaint statuses
export const COMPLAINT_STATUSES = {
  pending: 'در انتظار بررسی',
  in_review: 'در حال بررسی',
  resolved: 'حل شده',
  rejected: 'رد شده'
} as const;

// User statuses
export const USER_STATUSES = {
  pending: 'در انتظار تایید',
  active: 'فعال',
  suspended: 'معلق'
} as const;

// Part owner types
export const OWNER_TYPES = {
  company: 'شرکت',
  elevator: 'آسانسور'
} as const;

// Payment statuses
export const PAYMENT_STATUSES = {
  initiated: 'آغاز شده',
  success: 'موفق',
  failed: 'ناموفق',
  canceled: 'لغو شده'
} as const;

// Feature data types
export const FEATURE_DATA_TYPES = {
  string: 'متن',
  number: 'عدد',
  boolean: 'بولی',
  date: 'تاریخ',
  enum: 'لیست'
} as const;

// Iran provinces
export const PROVINCES = [
  'آذربایجان شرقی',
  'آذربایجان غربی',
  'اردبیل',
  'اصفهان',
  'البرز',
  'ایلام',
  'بوشهر',
  'تهران',
  'چهارمحال و بختیاری',
  'خراسان جنوبی',
  'خراسان رضوی',
  'خراسان شمالی',
  'خوزستان',
  'زنجان',
  'سمنان',
  'سیستان و بلوچستان',
  'فارس',
  'قزوین',
  'قم',
  'کردستان',
  'کرمان',
  'کرمانشاه',
  'کهگیلویه و بویراحمد',
  'گلستان',
  'گیلان',
  'لرستان',
  'مازندران',
  'مرکزی',
  'هرمزگان',
  'همدان',
  'یزد'
];

// Common countries for manufacturing
export const COUNTRIES = [
  { code: 'IR', name: 'ایران' },
  { code: 'DE', name: 'آلمان' },
  { code: 'IT', name: 'ایتالیا' },
  { code: 'TR', name: 'ترکیه' },
  { code: 'CN', name: 'چین' },
  { code: 'JP', name: 'ژاپن' },
  { code: 'KR', name: 'کره جنوبی' },
  { code: 'CH', name: 'سوئیس' },
  { code: 'FI', name: 'فنلاند' },
  { code: 'SE', name: 'سوئد' },
  { code: 'FR', name: 'فرانسه' },
  { code: 'ES', name: 'اسپانیا' },
  { code: 'US', name: 'ایالات متحده' },
  { code: 'GB', name: 'انگلستان' },
];

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  page: 1,
  size: 20,
  maxSize: 100
};

// File upload limits
export const FILE_UPLOAD = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.pdf']
};