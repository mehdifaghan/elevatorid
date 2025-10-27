# 🌐 راهنمای تنظیمات API

## تنظیم خودکار دامنه API

سیستم به صورت پیش‌فرض روی حالت **خودکار (Auto)** تنظیم شده است که به طور هوشمند آدرس API را بر اساس دامنه فعلی تشخیص می‌دهد.

### نحوه کارکرد

وقتی برنامه را روی هر دامنه‌ای deploy می‌کنید، سیستم به صورت خودکار API را به این شکل تنظیم می‌کند:

| دامنه فعلی | API Base URL |
|-----------|--------------|
| `example.com` | `https://api.example.com` |
| `elevatorid.ir` | `https://api.elevatorid.ir` |
| `mydomain.com` | `https://api.mydomain.com` |
| `localhost` | `http://localhost:3000` |

### محیط‌های در دسترس

1. **خودکار (Auto)** - پیش‌فرض ✅
   - تشخیص خودکار بر اساس دامنه فعلی
   - بهترین گزینه برای production

2. **سرور اصلی (Production)**
   - `https://api.elevatorid.ir`
   - برای استفاده ثابت از سرور اصلی

3. **سرور تست (Staging)**
   - `https://staging.api.elevatorid.ir`
   - برای تست‌های قبل از انتشار

4. **سرور توسعه (Development)**
   - `https://dev.api.elevatorid.ir`
   - برای توسعه‌دهندگان

5. **سرور محلی (Local)**
   - `http://localhost:3000`
   - برای توسعه محلی

6. **سرور سفارشی (Custom)**
   - آدرس دلخواه
   - برای تست با سرورهای سفارشی

### تغییر محیط API

#### از طریق کد:

```typescript
import { apiConfig } from './config/api.config';

// استفاده از محیط خودکار (پیش‌فرض)
apiConfig.setEnvironment('auto');

// استفاده از سرور اصلی
apiConfig.setEnvironment('production');

// استفاده از URL سفارشی
apiConfig.setCustomURL('https://myapi.example.com', 'v1');

// بازگشت به حالت پیش‌فرض
apiConfig.reset();
```

#### از طریق رابط کاربری:

1. به صفحه تنظیمات API بروید
2. محیط مورد نظر را انتخاب کنید
3. تنظیمات به صورت خودکار ذخیره می‌شود

### نکات مهم

- ✅ سیستم به صورت پیش‌فرض در حالت **Auto** است
- ✅ برای production نیازی به تغییر تنظیمات نیست
- ✅ localhost به صورت خودکار به `http://localhost:3000` متصل می‌شود
- ✅ تمام دامنه‌های دیگر به `https://api.{domain}` متصل می‌شوند
- ⚠️ اطمینان حاصل کنید که subdomain `api.` برای دامنه شما تنظیم شده است

### مثال‌های عملی

#### Deploy روی Vercel/Netlify:
```
دامنه: myapp.vercel.app
API: https://api.myapp.vercel.app
```

#### Deploy روی دامنه سفارشی:
```
دامنه: elevatorid.ir
API: https://api.elevatorid.ir
```

#### توسعه محلی:
```
دامنه: localhost:5173
API: http://localhost:3000
```

### دسترسی به تنظیمات

```typescript
import { apiConfig, getAPIConfig, getAPIBaseURL } from './config/api.config';

// دریافت تنظیمات فعلی
const config = getAPIConfig();
console.log(config);
// { baseURL: 'https://api.example.com', version: 'v1', fullURL: 'https://api.example.com/v1' }

// دریافت فقط URL کامل
const apiUrl = getAPIBaseURL();
console.log(apiUrl); // 'https://api.example.com/v1'

// دریافت اطلاعات محیط فعلی
const env = apiConfig.getCurrentEnvironment();
console.log(env);
// { name: 'auto', displayName: 'خودکار (بر اساس دامنه)', baseURL: '...', ... }
```

### بررسی اتصال

```typescript
import { apiConfig } from './config/api.config';

const checkConnection = async () => {
  const result = await apiConfig.checkConnection();
  
  if (result.success) {
    console.log(`✅ متصل به API در ${result.latency}ms`);
  } else {
    console.error(`❌ خطا: ${result.message}`);
  }
};
```

### اشتراک در تغییرات

```typescript
import { apiConfig } from './config/api.config';

// Listen کردن به تغییرات تنظیمات
const unsubscribe = apiConfig.subscribe((config) => {
  console.log('تنظیمات API تغییر کرد:', config);
});

// لغو اشتراک
unsubscribe();
```

---

## 🔧 راهنمای توسعه‌دهندگان

### ساختار فایل

```
config/
  ├── api.config.ts      # تنظیمات اصلی API
  └── README.md          # این فایل
```

### توابع اصلی

- `getAutoDomainAPIUrl()` - تولید URL خودکار بر اساس دامنه
- `apiConfig.getConfig()` - دریافت تنظیمات فعلی
- `apiConfig.setEnvironment()` - تنظیم محیط جدید
- `apiConfig.setCustomURL()` - تنظیم URL سفارشی
- `apiConfig.checkConnection()` - بررسی اتصال به API

### پشتیبانی

برای سوالات و مشکلات:
- 📧 ایمیل: support@elevatorid.ir
- 📱 تلفن: 021-12345678
