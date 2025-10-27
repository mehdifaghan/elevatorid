# ⚡ شروع سریع: تنظیمات دینامیک API

راهنمای سریع برای استفاده از سیستم مدیریت دینامیک API Base URL

## 🎯 خلاصه

سیستم اکنون امکان تغییر دینامیک Base URL و محیط API را **بدون نیاز به لاگین** فراهم می‌کند.

## 🚀 دسترسی سریع

### برای کاربران:
```
مسیر: /api-settings
مستقیم: https://yoursite.com/api-settings
```

### برای ادمین‌ها:
```
مسیر: /admin/api-config
یا: /api/admin/api-config
```

## 📍 نقاط دسترسی

### 1. صفحه اصلی (Landing Page)
- Badge "سرور اصلی" در کنار لوگو → کلیک کنید
- دکمه "تنظیمات API" در هدر → کلیک کنید

### 2. صفحه ورود (Login)
- دکمه "تنظیمات API" زیر فرم ورود

### 3. پنل ادمین
- منوی سمت راست → "پیکربندی API"

## ⚙️ محیط‌های موجود

| محیط | URL | استفاده |
|------|-----|----------|
| 🟢 Production | `https://api.elevatorid.ir/v1` | استفاده روزمره (پیش‌فرض) |
| 🟡 Staging | `https://staging.api.elevatorid.ir/v1` | تست قبل از تولید |
| 🔵 Development | `https://dev.api.elevatorid.ir/v1` | توسعه ویژگی‌های جدید |
| ⚫ Local | `http://localhost:3000/v1` | توسعه محلی |
| 🔧 Custom | دلخواه | سرور اختصاصی |

## 💻 استفاده در کد

### دریافت تنظیمات فعلی
```typescript
import apiConfig from './config/api.config';

const config = apiConfig.getConfig();
console.log(config.fullURL); // https://api.elevatorid.ir/v1
```

### تغییر محیط
```typescript
// تغییر به Staging
apiConfig.setEnvironment('staging');

// تغییر به Production
apiConfig.setEnvironment('production');
```

### URL سفارشی
```typescript
apiConfig.setCustomURL('https://my-api.com', 'v2');
```

### Subscribe به تغییرات
```typescript
const unsubscribe = apiConfig.subscribe((config) => {
  console.log('API URL changed to:', config.fullURL);
});

// cleanup
unsubscribe();
```

### بررسی اتصال
```typescript
const status = await apiConfig.checkConnection();
if (status.success) {
  console.log('Connected!', status.latency + 'ms');
}
```

## 🎨 کامپوننت‌های UI

### 1. PublicAPIConfig (صفحه عمومی)
```tsx
// استفاده در Route
<Route path="/api-settings" element={<PublicAPIConfig />} />
```

### 2. AdminAPIConfig (پنل ادمین)
```tsx
// استفاده در پنل ادمین
<Route path="api-config" element={<AdminAPIConfig />} />
```

### 3. SimpleAPIStatusBadge
```tsx
// نمایش Badge وضعیت
import SimpleAPIStatusBadge from './components/common/SimpleAPIStatusBadge';

<SimpleAPIStatusBadge />
```

### 4. APIStatusIndicator (Popover کامل)
```tsx
// نمایش Popover با جزئیات کامل
import APIStatusIndicator from './components/common/APIStatusIndicator';

<APIStatusIndicator />
```

## 🔧 تنظیمات پیشرفته

### افزودن محیط جدید

در `/config/api.config.ts`:

```typescript
export const API_ENVIRONMENTS: Record<string, APIEnvironment> = {
  // محیط‌های موجود...
  
  // محیط جدید
  myCustomEnv: {
    name: 'myCustomEnv',
    displayName: 'محیط سفارشی من',
    baseURL: 'https://my-env.example.com',
    version: 'v1',
    description: 'توضیحات محیط'
  }
};
```

### استفاده در Axios Client

فایل‌های `/lib/api-client.ts` و `/lib/real-api-client.ts` به صورت خودکار تنظیمات را اعمال می‌کنند:

```typescript
import axios from 'axios';
import { apiConfig } from '../config/api.config';

const client = axios.create({
  baseURL: apiConfig.getConfig().fullURL
});

// Auto-update on config change
apiConfig.subscribe((config) => {
  client.defaults.baseURL = config.fullURL;
});
```

## 📊 ذخیره‌سازی

تنظیمات در `localStorage` ذخیره می‌شود:

```typescript
// Keys
localStorage.getItem('api_environment')    // "production"
localStorage.getItem('api_custom_url')     // "https://..."
localStorage.getItem('api_custom_version') // "v1"
```

### پاک کردن تنظیمات
```typescript
apiConfig.reset();
// یا
localStorage.removeItem('api_environment');
localStorage.removeItem('api_custom_url');
localStorage.removeItem('api_custom_version');
```

## 🎯 سناریوهای رایج

### سناریو 1: تغییر به Staging قبل از ورود
```
1. باز کردن /api-settings
2. انتخاب "سرور تست"
3. کلیک "بررسی اتصال"
4. ورود به سیستم از /api/login
```

### سناریو 2: توسعه با Local Server
```
1. اجرای سرور محلی: npm run dev
2. باز کردن /api-settings
3. انتخاب "سرور محلی"
4. شروع توسعه
```

### سناریو 3: استفاده از سرور سازمانی
```
1. باز کردن /api-settings
2. انتخاب "سرور سفارشی"
3. وارد کردن: https://api.mycompany.ir
4. کلیک "اعمال تنظیمات سفارشی"
5. تست اتصال
```

## 🐛 Debug

### مشاهده تنظیمات فعلی
```typescript
console.log(apiConfig.getDebugInfo());
```

خروجی:
```json
{
  "currentEnvironment": "production",
  "config": {
    "baseURL": "https://api.elevatorid.ir",
    "version": "v1",
    "fullURL": "https://api.elevatorid.ir/v1"
  },
  "customURL": "",
  "customVersion": "v1",
  "availableEnvironments": ["production", "staging", "development", "local", "custom"],
  "storageKeys": {
    "environment": "production",
    "customURL": null,
    "customVersion": null
  }
}
```

## 📱 ریسپانسیو

همه کامپوننت‌ها کاملاً ریسپانسیو هستند:
- ✅ Mobile: نمایش کامل
- ✅ Tablet: نمایش بهینه
- ✅ Desktop: نمایش کامل

## 🔐 امنیت

### ✅ ایمن:
- تنظیمات فقط در client ذخیره می‌شود
- هیچ اطلاعات حساسی ذخیره نمی‌شود
- بدون نیاز به احراز هویت برای تنظیمات عمومی

### ⚠️ توجه:
- از HTTPS استفاده کنید
- URL های معتبر وارد کنید
- در production از محیط production استفاده کنید

## 🎓 منابع بیشتر

| مستند | توضیح |
|-------|-------|
| [API Config README](/config/README.md) | مستندات کامل API Config |
| [راهنمای کاربر](/docs/API-Settings-User-Guide.md) | راهنمای گام به گام برای کاربران |
| [Public Components](/components/public/README.md) | مستندات کامپوننت‌های عمومی |

## ✨ ویژگی‌های کلیدی

- ✅ **بدون نیاز به لاگین**: دسترسی عمومی
- ✅ **تغییر در لحظه**: بدون reload صفحه
- ✅ **ذخیره خودکار**: در localStorage
- ✅ **بررسی اتصال**: تست realtime
- ✅ **UI زیبا**: طراحی مدرن و کاربرپسند
- ✅ **RTL کامل**: پشتیبانی کامل از فارسی
- ✅ **ریسپانسیو**: تمام اندازه‌های صفحه
- ✅ **Type-safe**: TypeScript کامل

---

**به‌روزرسانی:** دی ۱۴۰۳  
**نسخه:** 1.0.0  
**وضعیت:** ✅ آماده استفاده
