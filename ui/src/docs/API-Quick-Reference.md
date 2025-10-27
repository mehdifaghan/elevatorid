# 🚀 مرجع سریع API Endpoints

## 📋 **فهرست کلی (55 HTTP Methods در 39 Paths)**

| دسته‌بندی | تعداد Methods | Paths |
|-----------|---------------|-------|
| 🔐 Authentication | 4 | `/auth/*` |
| 📊 Dashboard | 2 | `/dashboard/*` |
| 👥 Users | 6 | `/users/*` |
| 🔧 Parts | 10 | `/parts/*` |
| 🔄 Transfers | 4 | `/transfers/*` |
| 🏢 Elevators | 10 | `/elevators/*` |
| 📝 Requests | 5 | `/requests/*` |
| 📊 Reports | 4 | `/reports/*` |
| 👤 Profile | 4 | `/profile/*` |
| ⚙️ Settings | 3 | `/settings/*` |
| 📁 Upload | 2 | `/upload/*` |
| 🗺️ Geography | 2 | `/geography/*` |

---

## 🔐 **Authentication (4 Methods)**

```bash
POST /auth/send-otp          # ارسال OTP
POST /auth/verify-otp        # تایید OTP و ورود
POST /auth/refresh           # تمدید توکن
POST /auth/logout            # خروج
```

**نمونه Request:**
```json
// POST /auth/send-otp
{ "mobile": "09123456789" }

// POST /auth/verify-otp  
{ "otpToken": "temp_123", "otp": "123456" }
```

---

## 👥 **Users (6 Methods)**

```bash
GET    /users                # لیست کاربران + فیلتر
POST   /users                # ایجاد کاربر
GET    /users/{id}           # جزئیات کاربر
PUT    /users/{id}           # ویرایش کاربر
DELETE /users/{id}           # حذف کاربر
PATCH  /users/{id}/toggle-status  # تغییر وضعیت
```

**Query Params:**
- `?page=1&limit=20&search=نام&role=user&status=active`

---

## 🔧 **Parts (10 Methods)**

```bash
GET    /parts               # لیست قطعات + فیلتر
POST   /parts               # ایجاد قطعه
GET    /parts/{id}          # جزئیات قطعه
PUT    /parts/{id}          # ویرایش قطعه
DELETE /parts/{id}          # حذف قطعه
GET    /parts/categories    # لیست دسته‌بندی‌ها
POST   /parts/categories    # ایجاد دسته‌بندی
POST   /parts/{id}/transfer # انتقال قطعه
GET    /parts/{id}/qr-code  # QR کد قطعه
```

**نمونه Request:**
```json
// POST /parts
{
  "name": "موتور آسانسور",
  "partNumber": "MTR-001",
  "category": "motor",
  "specifications": { "power": "10KW" }
}
```

---

## 🏢 **Elevators (10 Methods)**

```bash
GET    /elevators           # لیست آسانسورها
POST   /elevators           # ثبت آسانسور
GET    /elevators/{id}      # جزئیات آسانسور
PUT    /elevators/{id}      # ویرایش آسانسور
DELETE /elevators/{id}      # حذف آسانسور
GET    /elevators/{id}/certificate      # گواهی PDF
GET    /elevators/{id}/parts           # قطعات آسانسور
POST   /elevators/{id}/parts           # افزودن قطعه
POST   /elevators/{id}/parts/{partId}/replace  # تعویض قطعه
```

---

## 🔄 **Transfers (4 Methods)**

```bash
GET  /transfers             # لیست انتقال‌ها
GET  /transfers/{id}        # جزئیات انتقال
POST /transfers/{id}/approve # تایید انتقال
POST /transfers/{id}/reject  # رد انتقال
```

**Query Params:**
- `?status=pending&type=sale&senderId=user_123`

---

## 📝 **Requests (5 Methods)**

```bash
GET  /requests              # لیست درخواست‌ها
POST /requests              # ثبت درخواست
GET  /requests/{id}         # جزئیات درخواست
PUT  /requests/{id}         # ویرایش درخواست
POST /requests/{id}/respond # پاسخ به درخواست
```

**نمونه Request:**
```json
// POST /requests
{
  "title": "مشکل سیستم",
  "description": "توضیحات کامل",
  "type": "support",
  "priority": "medium"
}
```

---

## 📊 **Reports (4 Methods)**

```bash
GET /reports/parts          # گزارش قطعات
GET /reports/transfers      # گزارش انتقال‌ها
GET /reports/elevators      # گزارش آسانسورها
GET /reports/financial      # گزارش مالی
```

**Query Params:**
- `?startDate=2024-01-01&endDate=2024-01-31&format=json`

---

## 👤 **Profile (4 Methods)**

```bash
GET  /profile               # اطلاعات پروفایل
PUT  /profile               # ویرایش پروفایل
POST /profile/avatar        # تغییر آواتار
POST /profile/change-password # تغییر رمز
```

---

## 📊 **Dashboard (2 Methods)**

```bash
GET /dashboard/admin/stats  # آمار ادمین
GET /dashboard/user/stats   # آمار کاربر
```

---

## ⚙️ **Settings (3 Methods)**

```bash
GET  /settings              # دریافت تنظیمات
PUT  /settings              # بروزرسانی تنظیمات
POST /settings/backup       # پشتیبان‌گیری
```

---

## 📁 **Upload (2 Methods)**

```bash
POST /upload/image          # آپلود تصویر
POST /upload/document       # آپلود سند
```

**Content-Type:** `multipart/form-data`

---

## 🗺️ **Geography (2 Methods)**

```bash
GET /geography/provinces              # لیست استان‌ها
GET /geography/provinces/{id}/cities  # شهرهای استان
```

---

## 🔒 **Headers مورد نیاز:**

```javascript
// همه endpoints (به جز Authentication & Geography)
{
  "Authorization": "Bearer YOUR_TOKEN",
  "Content-Type": "application/json"
}

// File Upload
{
  "Authorization": "Bearer YOUR_TOKEN",
  "Content-Type": "multipart/form-data"
}
```

---

## 📋 **کدهای پاسخ HTTP:**

| کد | معنی | توضیح |
|----|------|-------|
| `200` | OK | موفق |
| `201` | Created | ایجاد شد |
| `400` | Bad Request | داده نامعتبر |
| `401` | Unauthorized | احراز هویت نشده |
| `403` | Forbidden | دسترسی ندارد |
| `404` | Not Found | یافت نشد |
| `429` | Too Many Requests | محدودیت نرخ |
| `500` | Server Error | خطای سرور |

---

## 🎯 **فرمت کلی پاسخ:**

```json
{
  "success": true,
  "message": "پیام",
  "data": { ... },
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

---

## ⚡ **نکات مهم:**

1. **Base URL:** `https://elevatorid.ieeu.ir/v1`
2. **Rate Limit:** حداکثر 100 درخواست در دقیقه
3. **Timeout:** 30 ثانیه
4. **Max File Size:** 10MB
5. **Supported Formats:** JPG, PNG, PDF
6. **Date Format:** ISO 8601 (`2024-01-01T12:00:00Z`)
7. **Mobile Format:** `09XXXXXXXXX`

---

## 🚀 **نمونه استفاده سریع:**

```javascript
// ورود
const otpToken = await fetch('/auth/send-otp', {
  method: 'POST',
  body: JSON.stringify({ mobile: '09123456789' })
});

// دریافت قطعات
const parts = await fetch('/parts?page=1&limit=10', {
  headers: { 'Authorization': 'Bearer TOKEN' }
});

// ایجاد قطعه
const newPart = await fetch('/parts', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer TOKEN' },
  body: JSON.stringify({
    name: 'موتور',
    category: 'motor',
    partNumber: 'MTR-001'
  })
});
```

---

## 🔗 **منابع بیشتر:**

- 📚 [راهنمای کامل API](./API-Endpoints-Guide.md)
- 💻 [نمونه‌های کاربردی](../examples/api-usage-examples.js)
- 🔧 [TypeScript Types](../types/api-detailed.ts)
- 📖 [OpenAPI Specification](./openapi-specification.yaml)