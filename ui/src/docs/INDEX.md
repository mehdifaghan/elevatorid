# 📚 فهرست کامل مستندات سامانه ردیابی قطعات و شناسنامه آسانسور

## 🆕 جدید: فیلتر خطاها (Error Filtering)

| سند | توضیحات | وضعیت |
|-----|----------|--------|
| [⭐ توضیح خطاهای Figma](/FIGMA-ERRORS-EXPLANATION.md) | **شروع از اینجا!** درک خطاهای devtools | 🔥 جدید |
| [❓ FAQ خطاهای Figma](/FIGMA-ERRORS-FAQ.md) | سوالات متداول (15 سوال) | 🔥 جدید |
| [Error Filter Guide](./Error-Filter-Guide.md) | راهنمای کامل سیستم فیلتر خطاها | ✅ جدید |
| [Error Filter Quick Reference](./Error-Filter-Quick-Reference.md) | مرجع سریع فیلتر خطاها | ✅ جدید |
| [Error Filter README](/ERROR-FILTER-README.md) | راهنمای جامع فیلتر | ✅ جدید |
| [Changelog](/CHANGELOG-ERROR-FILTER.md) | تاریخچه تغییرات فیلتر | ✅ جدید |

**⚠️ توجه مهم:** اگر خطاهای `Y@`, `q/<@`, `readFromStdout` می‌بینید، حتماً [توضیح خطاهای Figma](/FIGMA-ERRORS-EXPLANATION.md) را بخوانید!

---

## 🔐 احراز هویت (Authentication)

| سند | توضیحات | وضعیت |
|-----|----------|--------|
| [Login README](./Login-README.md) | نقطه شروع و خلاصه کلی | ✅ کامل |
| [راهنمای کامل لاگین](./Login-Complete-Guide.md) | مستندات جامع با نمونه کد | ✅ کامل |
| [مرجع سریع](./Login-Quick-Reference.md) | دستورات و نمونه‌های سریع | ✅ کامل |
| [پیکربندی](./Login-Configuration.md) | تنظیمات و Environment Variables | ✅ کامل |
| [عیب‌یابی](./Login-Troubleshooting.md) | حل مشکلات رایج | ✅ کامل |

---

## 🌐 API Documentation

| سند | توضیحات | وضعیت |
|-----|----------|--------|
| [🚀 تنظیم خودکار دامنه API](./Auto-Domain-API-Guide.md) | **جدید!** راهنمای سریع دامنه خودکار | 🔥 جدید |
| [API Endpoints Guide](./API-Endpoints-Guide.md) | راهنمای کامل API endpoints | ✅ کامل |
| [API Quick Reference](./API-Quick-Reference.md) | مرجع سریع API | ✅ کامل |
| [OpenAPI Specification](./openapi-specification.yaml) | فایل YAML مشخصات API | ✅ کامل |

### 📊 Dashboard APIs (جدید!)

| سند | توضیحات | وضعیت |
|-----|----------|--------|
| [⚡ Dashboard Quick Start](./Dashboard-Quick-Start.md) | **شروع اینجا!** راه‌اندازی در 5 دقیقه | 🔥 جدید |
| [📊 Dashboard README](./Dashboard-README.md) | نقطه شروع و خلاصه کلی داشبورد | 🔥 جدید |
| [📊 Dashboard API Endpoints](./Dashboard-API-Endpoints.md) | endpoint‌های داشبورد کاربر | 🔥 جدید |
| [📖 Dashboard Implementation Guide](./Dashboard-Implementation-Guide.md) | راهنمای پیاده‌سازی Frontend | 🔥 جدید |
| [💻 Dashboard Backend Implementation](./Dashboard-Backend-Implementation.md) | راهنمای پیاده‌سازی Backend | 🔥 جدید |

---

## 🛡️ امنیت (Security)

| سند | توضیحات | وضعیت |
|-----|----------|--------|
| [Security Updates](./Security-Updates.md) | به‌روزرسانی‌های امنیتی | ✅ کامل |
| [Captcha Integration](./Captcha-Integration-Guide.md) | راهنمای یکپارچه‌سازی کپچا | ✅ کامل |

---

## 📖 مستندات تغییرات

| سند | توضیحات | وضعیت |
|-----|----------|--------|
| [Login Changes Summary](./Login-Changes-Summary.md) | خلاصه تغییرات لاگین | ✅ کامل |
| [Login API Documentation](./Login-API-Documentation.md) | مستندات API لاگین | ✅ کامل |

---

## 🚀 شروع سریع

### برای توسعه‌دهنده‌های جدید:

1. 📖 شروع با [Login README](./Login-README.md)
2. ⚡ مطالعه [مرجع سریع](./Login-Quick-Reference.md)
3. 🌐 بررسی [API Quick Reference](./API-Quick-Reference.md)
4. 🔧 در صورت مشکل: [عیب‌یابی](./Login-Troubleshooting.md)

### برای Backend Developers:

1. 🌐 [API Endpoints Guide](./API-Endpoints-Guide.md)
2. 📄 [OpenAPI Specification](./openapi-specification.yaml)
3. 🛡️ [Security Updates](./Security-Updates.md)

### برای Frontend Developers:

1. 📖 [راهنمای کامل لاگین](./Login-Complete-Guide.md)
2. ⚙️ [پیکربندی](./Login-Configuration.md)
3. 🖼️ [Captcha Integration](./Captcha-Integration-Guide.md)

---

## 📂 ساختار پروژه

```
/docs
├── INDEX.md                          ← شما اینجا هستید
│
├── احراز هویت (Authentication)
│   ├── Login-README.md               → نقطه شروع
│   ├── Login-Complete-Guide.md       → راهنمای جامع
│   ├── Login-Quick-Reference.md      → مرجع سریع
│   ├── Login-Configuration.md        → پیکربندی
│   ├── Login-Troubleshooting.md      → عیب‌یابی
│   ├── Login-Changes-Summary.md      → تغییرات
│   └── Login-API-Documentation.md    → API لاگین
│
├── API Documentation
│   ├── API-Endpoints-Guide.md        → راهنمای endpoints
│   ├── API-Quick-Reference.md        → مرجع سریع API
│   └── openapi-specification.yaml    → OpenAPI spec
│
├── Dashboard (جدید!)
│   ├── Dashboard-API-Endpoints.md           → endpoint‌های داشبورد
│   ├── Dashboard-Implementation-Guide.md    → راهنمای Frontend
│   └── Dashboard-Backend-Implementation.md  → راهنمای Backend
│
└── امنیت (Security)
    ├── Security-Updates.md           → امنیت
    └── Captcha-Integration-Guide.md  → کپچا
```

---

## 🔗 مسیرهای مهم برنامه

### صفحات عمومی

| مسیر | توضیحات |
|------|----------|
| `/` | صفحه اصلی |
| `/test` | صفحه تست |

### احراز هویت - Demo (Mock Data)

| مسیر | توضیحات |
|------|----------|
| `/login` | ورود دمو |
| `/otp-verify` | تایید OTP دمو |

### احراز هویت - API (واقعی)

| مسیر | توضیحات |
|------|----------|
| `/api/login` | ورود با API واقعی ✅ |
| `/api/otp-verify` | تایید OTP با API واقعی ✅ |

### پنل ادمین - Demo

| مسیر | توضیحات |
|------|----------|
| `/demo/admin` | داشبورد ادمین دمو |
| `/demo/admin/users` | کاربران دمو |
| `/demo/admin/parts` | قطعات دمو |
| `/demo/admin/elevators` | آسانسورها دمو |

### پنل ادمین - API (نیاز به احراز هویت)

| مسیر | توضیحات |
|------|----------|
| `/api/admin` | داشبورد ادمین ✅ |
| `/api/admin/users` | مدیریت کاربران ✅ |
| `/api/admin/parts` | مدیریت قطعات ✅ |
| `/api/admin/elevators` | مدیریت آسانسورها ✅ |
| `/api/admin/settings` | تنظیمات ✅ |

### پنل کاربر - API (نیاز به احراز هویت)

| مسیر | توضیحات |
|------|----------|
| `/api/user` | داشبورد کاربر ✅ |
| `/api/user/products` | محصولات کاربر ✅ |
| `/api/user/elevators` | آسانسورهای کاربر ✅ |
| `/api/user/requests` | درخواست‌های کاربر ✅ |

---

## 🌐 API Endpoints اصلی

### Base URL
```
https://elevatorid.ieeu.ir/v1
```

### Authentication

| Method | Endpoint | توضیحات | مستندات |
|--------|----------|----------|----------|
| POST | `/v1/captcha` | دریافت کپچا | [📖](./Login-Complete-Guide.md#1️⃣-دریافت-کپچا) |
| POST | `/v1/auth/login` | ورود با موبایل | [📖](./Login-Complete-Guide.md#2️⃣-ورود-login) |
| POST | `/v1/auth/otp/verify` | تایید OTP | [📖](./Login-Complete-Guide.md#3️⃣-تایید-otp) |
| POST | `/v1/auth/refresh` | تازه‌سازی توکن | [📖](./Login-Complete-Guide.md#4️⃣-تازه‌سازی-توکن) |

### Users Management

| Method | Endpoint | توضیحات |
|--------|----------|----------|
| GET | `/v1/admin/users` | لیست کاربران |
| POST | `/v1/admin/users` | ایجاد کاربر |
| PUT | `/v1/admin/users/:id` | ویرایش کاربر |
| DELETE | `/v1/admin/users/:id` | حذف کاربر |

### Parts Management

| Method | Endpoint | توضیحات |
|--------|----------|----------|
| GET | `/v1/parts` | لیست قطعات |
| POST | `/v1/parts` | ایجاد قطعه |
| PUT | `/v1/parts/:id` | ویرایش قطعه |
| DELETE | `/v1/parts/:id` | حذف قطعه |

### Elevators Management

| Method | Endpoint | توضیحات |
|--------|----------|----------|
| GET | `/v1/elevators` | لیست آسانسورها |
| POST | `/v1/elevators` | ثبت آسانسور |
| PUT | `/v1/elevators/:id` | ویرایش آسانسور |
| DELETE | `/v1/elevators/:id` | حذف آسانسور |

---

## 📊 وضعیت پیاده‌سازی

### ✅ انجام شده

- [x] سیستم احراز هویت با OTP
- [x] یکپارچه‌سازی کپچا
- [x] مدیریت توکن‌ها
- [x] Auto refresh token
- [x] پنل ادمین API
- [x] پنل کاربر API
- [x] مستندات کامل
- [x] عیب‌یابی و troubleshooting
- [x] پشتیبانی RTL
- [x] طراحی ریسپانسیو

### 🔄 در حال انجام

- [ ] Unit Tests
- [ ] E2E Tests
- [ ] Performance Optimization
- [ ] PWA Support

### 📋 برنامه آینده

- [ ] Two-Factor Authentication
- [ ] Social Login
- [ ] Biometric Authentication
- [ ] Advanced Analytics
- [ ] Real-time Notifications

---

## 🛠️ ابزارها و تکنولوژی‌ها

### Frontend

- ⚛️ React 18
- 🎨 Tailwind CSS v4
- 🚀 Vite
- 📱 React Router
- 🎯 TypeScript
- 🌐 Axios
- 🎨 Shadcn/UI

### State Management

- 🔄 React Context API
- 💾 LocalStorage

### UI Components

- 📦 Shadcn/UI
- 🎯 Lucide Icons
- 📊 Recharts
- 🔔 Sonner (Toast)

### Development Tools

- 🔍 ESLint
- 💅 Prettier
- 🧪 React Testing Library (آینده)
- 📖 Storybook (آینده)

---

## 📖 راهنماهای مرتبط

### برای مبتدیان

1. [شروع با Login](./Login-README.md)
2. [نحوه استفاده از کپچا](./Captcha-Integration-Guide.md)
3. [تنظیمات اولیه](./Login-Configuration.md)

### برای توسعه‌دهندگان

1. [راهنمای کامل API](./API-Endpoints-Guide.md)
2. [راهنمای کامل لاگین](./Login-Complete-Guide.md)
3. [مشکلات رایج و حل آنها](./Login-Troubleshooting.md)

### برای DevOps

1. [تنظیمات پیکربندی](./Login-Configuration.md)
2. [امنیت](./Security-Updates.md)
3. [OpenAPI Spec](./openapi-specification.yaml)

---

## 🧪 تست و Debug

### Manual Testing

```bash
# Test Captcha
curl -X POST https://elevatorid.ieeu.ir/v1/captcha \
  -H "Content-Type: application/json" \
  -d '{"width": 200, "height": 70}'

# Test Login
curl -X POST https://elevatorid.ieeu.ir/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "09123456789",
    "captcha_id": "uuid",
    "captcha_value": "ABC123"
  }'
```

### Component Testing

استفاده از `/components/common/APITestForm.tsx` برای تست تمام endpoints

---

## 🔒 امنیت

### نکات مهم

- ✅ همیشه از HTTPS استفاده کنید
- ✅ توکن‌ها را امن نگه دارید
- ✅ از Rate Limiting استفاده کنید
- ✅ CAPTCHA برای جلوگیری از bot
- ✅ OTP با محدودیت زمانی
- ✅ اعتبارسنجی سمت کلاینت و سرور

### مستندات امنیتی

- [Security Updates](./Security-Updates.md)
- [Captcha Integration](./Captcha-Integration-Guide.md)

---

## 📱 تماس و پشتیبانی

### راه‌های ارتباطی

- 📧 Email: support@elevatorid.ir
- 📱 تلفن: 021-12345678
- 🌐 Website: https://elevatorid.ieeu.ir

### قبل از تماس

1. بررسی [Troubleshooting](./Login-Troubleshooting.md)
2. بررسی [FAQ](#faq)
3. بررسی Console Errors
4. بررسی Network Tab

---

## ❓ FAQ

### سوالات متداول

**Q: چگونه می‌توانم سیستم لاگین را تست کنم؟**
A: از مسیر `/api/login` برای لاگین با API واقعی استفاده کنید. برای تست بدون API، از `/login` استفاده کنید.

**Q: کپچا لود نمی‌شود، چه کنم؟**
A: راهنمای [Troubleshooting - کپچا](./Login-Troubleshooting.md#1️⃣-کپچا-لود-نمی‌شود) را ببینید.

**Q: بعد از لاگین redirect نمی‌شود؟**
A: راهنمای [Troubleshooting - Redirect](./Login-Troubleshooting.md#4️⃣-redirect-بعد-از-لاگین) را ببینید.

**Q: چگونه توکن را refresh کنم؟**
A: سیستم به صورت خودکار توکن را refresh می‌کند. برای اطلاعات بیشتر [Token Refresh](./Login-Complete-Guide.md#4️⃣-تازه‌سازی-توکن) را ببینید.

**Q: RTL درست کار نمی‌کند؟**
A: راهنمای [Troubleshooting - RTL](./Login-Troubleshooting.md#8️⃣-rtl-layout-issues) را ببینید.

---

## 🎯 مراحل بعدی

### برای توسعه‌دهندگان جدید

1. ✅ خواندن [Login README](./Login-README.md)
2. ✅ مطالعه [Quick Reference](./Login-Quick-Reference.md)
3. ✅ اجرای پروژه و تست `/api/login`
4. ✅ بررسی [Complete Guide](./Login-Complete-Guide.md)
5. ✅ آشنایی با [API Endpoints](./API-Endpoints-Guide.md)

### برای ادامه توسعه

1. پیاده‌سازی Unit Tests
2. بهینه‌سازی Performance
3. افزودن PWA Support
4. پیاده‌سازی Analytics
5. بهبود UX/UI

---

## 📊 آمار پروژه

- 📄 **تعداد مستندات**: 11 فایل
- 📦 **Components**: 90+ کامپوننت
- 🌐 **API Endpoints**: 40+ endpoint
- 📱 **Pages**: 30+ صفحه
- ✅ **Test Coverage**: در حال توسعه

---

## 🙏 Contributors

تشکر از تمام افرادی که در این پروژه مشارکت کرده‌اند.

---

## 📝 License

MIT License - برای جزئیات به فایل LICENSE مراجعه کنید.

---

## 🔄 آخرین به‌روزرسانی

**تاریخ:** اکتبر 2024
**نسخه:** 1.0.0
**وضعیت:** ✅ فعال و کامل

---

**💡 نکته:** این فایل به طور مداوم به‌روزرسانی می‌شود. برای آخرین تغییرات، همیشه نسخه آنلاین را بررسی کنید.