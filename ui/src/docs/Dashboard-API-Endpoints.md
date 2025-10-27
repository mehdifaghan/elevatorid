# مستندات API Endpoint‌های داشبورد کاربر

این مستندات شامل تمام endpoint‌های مورد نیاز برای داشبورد کاربر است.

## پیش‌نیازها

تمام endpoint‌های این بخش نیاز به احراز هویت دارند و باید توکن JWT در هدر Authorization ارسال شود:

```
Authorization: Bearer <token>
```

---

## 1. دریافت آمار کامل داشبورد

### Endpoint
```
GET /user/dashboard/stats
```

### توضیحات
دریافت آمار کامل برای داشبورد کاربر شامل تعداد قطعات، انتقال‌ها، آسانسورها و درخواست‌ها به همراه تغییرات در ماه جاری.

### پارامترها
هیچ پارامتری ندارد.

### نمونه Response (200 OK)
```json
{
  "partsCount": 245,
  "transfersCount": 89,
  "elevatorsCount": 23,
  "requestsCount": 4,
  "partsChange": 5,
  "transfersChange": 12,
  "elevatorsChange": 3,
  "requestsChange": -2
}
```

### فیلدها

| فیلد | نوع | توضیحات |
|------|-----|---------|
| `partsCount` | integer | تعداد کل قطعات در مالکیت |
| `transfersCount` | integer | تعداد کل انتقال‌های انجام شده |
| `elevatorsCount` | integer | تعداد کل آسانسورهای ثبت شده |
| `requestsCount` | integer | تعداد درخواست‌های باز |
| `partsChange` | integer | تغییر تعداد قطعات در ماه جاری (مثبت: افزایش، منفی: کاهش) |
| `transfersChange` | integer | تغییر تعداد انتقال‌ها در ماه جاری |
| `elevatorsChange` | integer | تغییر تعداد آسانسورها در ماه جاری |
| `requestsChange` | integer | تغییر تعداد درخواست‌ها در ماه جاری |

### کدهای خطا
- `401 Unauthorized`: کاربر احراز هویت نشده است
- `500 Internal Server Error`: خطای سرور

---

## 2. دریافت داده‌های ماهانه

### Endpoint
```
GET /user/dashboard/monthly
```

### توضیحات
دریافت داده‌های ماهانه برای نمودار روند فعالیت‌ها در 6 ماه اخیر (قطعات، انتقال‌ها، آسانسورها).

### پارامترها
هیچ پارامتری ندارد.

### نمونه Response (200 OK)
```json
{
  "monthlyData": [
    {
      "month": "فروردین",
      "parts": 45,
      "transfers": 12,
      "elevators": 3
    },
    {
      "month": "اردیبهشت",
      "parts": 52,
      "transfers": 18,
      "elevators": 5
    },
    {
      "month": "خرداد",
      "parts": 38,
      "transfers": 14,
      "elevators": 2
    },
    {
      "month": "تیر",
      "parts": 63,
      "transfers": 22,
      "elevators": 7
    },
    {
      "month": "مرداد",
      "parts": 49,
      "transfers": 16,
      "elevators": 4
    },
    {
      "month": "شهریور",
      "parts": 58,
      "transfers": 19,
      "elevators": 6
    }
  ]
}
```

### فیلدهای monthlyData

| فیلد | نوع | توضیحات |
|------|-----|---------|
| `month` | string | نام ماه شمسی |
| `parts` | integer | تعداد قطعات ثبت شده در آن ماه |
| `transfers` | integer | تعداد انتقال‌های انجام شده در آن ماه |
| `elevators` | integer | تعداد آسانسورهای ثبت شده در آن ماه |

### کدهای خطا
- `401 Unauthorized`: کاربر احراز هویت نشده است
- `500 Internal Server Error`: خطای سرور

---

## 3. دریافت توزیع دسته‌بندی قطعات

### Endpoint
```
GET /user/dashboard/parts-categories
```

### توضیحات
دریافت توزیع انواع قطعات در مالکیت کاربر برای نمایش در نمودار دایره‌ای (Pie Chart).

### پارامترها
هیچ پارامتری ندارد.

### نمونه Response (200 OK)
```json
{
  "categories": [
    {
      "name": "موتور",
      "value": 35,
      "color": "#0088FE"
    },
    {
      "name": "کابل",
      "value": 28,
      "color": "#00C49F"
    },
    {
      "name": "کنترلر",
      "value": 22,
      "color": "#FFBB28"
    },
    {
      "name": "سنسور",
      "value": 15,
      "color": "#FF8042"
    }
  ]
}
```

### فیلدهای categories

| فیلد | نوع | توضیحات |
|------|-----|---------|
| `name` | string | نام دسته‌بندی |
| `value` | integer | تعداد قطعات در این دسته |
| `color` | string | کد رنگ هگزادسیمال برای نمودار |

### کدهای خطا
- `401 Unauthorized`: کاربر احراز هویت نشده است
- `500 Internal Server Error`: خطای سرور

---

## 4. دریافت فعالیت‌های اخیر

### Endpoint
```
GET /user/dashboard/activities
```

### توضیحات
دریافت فهرست فعالیت‌های اخیر کاربر شامل انتقال قطعات، ثبت آسانسورها، درخواست‌ها و افزودن قطعات.

### پارامترها
هیچ پارامتری ندارد.

### نمونه Response (200 OK)
```json
{
  "activities": [
    {
      "id": "1",
      "type": "transfer",
      "title": "انتقال قطعه موتور",
      "description": "انتقال موتور ۱۰HP به شرکت نصب سریع",
      "time": "۲ ساعت پیش",
      "status": "completed"
    },
    {
      "id": "2",
      "type": "elevator",
      "title": "ثبت آسانسور جدید",
      "description": "ثبت آسانسور مجتمع تجاری پارس",
      "time": "۱ روز پیش",
      "status": "pending"
    },
    {
      "id": "3",
      "type": "request",
      "title": "درخواست تغییر اطلاعات",
      "description": "درخواست به‌روزرسانی آدرس شرکت",
      "time": "۳ روز پیش",
      "status": "approved"
    },
    {
      "id": "4",
      "type": "part",
      "title": "افزودن قطعه جدید",
      "description": "ثبت کنترلر جدید مدل KX-200",
      "time": "۱ هفته پیش",
      "status": "completed"
    }
  ]
}
```

### فیلدهای activities

| فیلد | نوع | توضیحات |
|------|-----|---------|
| `id` | string | شناسه یکتای فعالیت |
| `type` | string | نوع فعالیت: `transfer`, `elevator`, `request`, `part` |
| `title` | string | عنوان فعالیت |
| `description` | string | توضیحات فعالیت |
| `time` | string | زمان نسبی فعالیت (مثلاً "۲ ساعت پیش") |
| `status` | string | وضعیت فعالیت: `completed`, `pending`, `approved` |

### کدهای خطا
- `401 Unauthorized`: کاربر احراز هویت نشده است
- `500 Internal Server Error`: خطای سرور

---

## 5. بررسی تکمیل بودن پروفایل

### Endpoint
```
GET /user/profile/check
```

### توضیحات
بررسی اینکه آیا پروفایل کاربر کامل است یا نیاز به تکمیل دارد.

### پارامترها
هیچ پارامتری ندارد.

### نمونه Response (200 OK) - پروفایل ناقص
```json
{
  "isComplete": false,
  "missingFields": [
    "companyName",
    "nationalId",
    "address",
    "province",
    "city"
  ]
}
```

### نمونه Response (200 OK) - پروفایل کامل
```json
{
  "isComplete": true,
  "missingFields": []
}
```

### فیلدها

| فیلد | نوع | توضیحات |
|------|-----|---------|
| `isComplete` | boolean | آیا پروفایل کامل است |
| `missingFields` | array | لیست فیلدهای ناقص (خالی اگر پروفایل کامل باشد) |

### کدهای خطا
- `401 Unauthorized`: کاربر احراز هویت نشده است
- `500 Internal Server Error`: خطای سرور

---

## نمونه کد استفاده (JavaScript/TypeScript)

### استفاده با Axios

```typescript
import axios from 'axios';

const API_BASE_URL = 'https://api.elevatorid.ir/v1';
const token = localStorage.getItem('token');

// تنظیم هدر پیش‌فرض
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// دریافت آمار داشبورد
async function getDashboardStats() {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/dashboard/stats`);
    console.log('Stats:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}

// دریافت داده‌های ماهانه
async function getMonthlyData() {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/dashboard/monthly`);
    console.log('Monthly Data:', response.data.monthlyData);
    return response.data.monthlyData;
  } catch (error) {
    console.error('Error fetching monthly data:', error);
    throw error;
  }
}

// دریافت دسته‌بندی قطعات
async function getPartsCategories() {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/dashboard/parts-categories`);
    console.log('Parts Categories:', response.data.categories);
    return response.data.categories;
  } catch (error) {
    console.error('Error fetching parts categories:', error);
    throw error;
  }
}

// دریافت فعالیت‌های اخیر
async function getRecentActivities() {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/dashboard/activities`);
    console.log('Recent Activities:', response.data.activities);
    return response.data.activities;
  } catch (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
}

// بررسی تکمیل پروفایل
async function checkProfileComplete() {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/profile/check`);
    console.log('Profile Complete:', response.data.isComplete);
    return response.data;
  } catch (error) {
    console.error('Error checking profile:', error);
    throw error;
  }
}

// بارگذاری کامل داشبورد
async function loadDashboard() {
  try {
    const [stats, monthly, categories, activities, profileStatus] = await Promise.all([
      getDashboardStats(),
      getMonthlyData(),
      getPartsCategories(),
      getRecentActivities(),
      checkProfileComplete()
    ]);

    return {
      stats,
      monthly,
      categories,
      activities,
      profileStatus
    };
  } catch (error) {
    console.error('Error loading dashboard:', error);
    throw error;
  }
}
```

### استفاده با Fetch API

```typescript
const API_BASE_URL = 'https://api.elevatorid.ir/v1';

async function fetchWithAuth(endpoint: string) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// استفاده
const stats = await fetchWithAuth('/user/dashboard/stats');
const monthly = await fetchWithAuth('/user/dashboard/monthly');
const categories = await fetchWithAuth('/user/dashboard/parts-categories');
const activities = await fetchWithAuth('/user/dashboard/activities');
const profileCheck = await fetchWithAuth('/user/profile/check');
```

---

## نکات مهم

### احراز هویت
- همه endpoint‌ها نیاز به توکن JWT دارند
- توکن باید در هدر `Authorization` با فرمت `Bearer <token>` ارسال شود
- در صورت انقضای توکن، باید از refresh token برای دریافت توکن جدید استفاده کنید

### مدیریت خطا
- همیشه خطاهای 401 (Unauthorized) را برای redirect به صفحه لاگین مدیریت کنید
- خطاهای 500 را با پیام مناسب به کاربر نمایش دهید
- از try-catch برای مدیریت خطاهای شبکه استفاده کنید

### بهینه‌سازی
- می‌توانید از Promise.all برای فراخوانی همزمان چند endpoint استفاده کنید
- داده‌های داشبورد را در state management (Redux, Zustand, etc.) کش کنید
- از polling یا WebSocket برای به‌روزرسانی real-time استفاده کنید

### تست
برای تست endpoint‌ها می‌توانید از ابزارهای زیر استفاده کنید:
- Postman
- Insomnia
- cURL
- Thunder Client (VS Code Extension)

---

## پشتیبانی

در صورت بروز مشکل یا سوال، با تیم پشتیبانی تماس بگیرید:

- ایمیل: support@ieeu.ir
- تلفن: 021-12345678
- وب‌سایت: https://elevatorid.ieeu.ir

---

**آخرین به‌روزرسانی:** 1403/08/05
