# 🌐 تنظیم خودکار دامنه API

## خلاصه سریع

سیستم به صورت **کاملاً خودکار** آدرس API را از دامنه فعلی شناسایی می‌کند.

### چگونه کار می‌کند؟

```
دامنه فعلی → API URL
───────────────────────────────
example.com → https://api.example.com
elevatorid.ir → https://api.elevatorid.ir  
localhost → http://localhost:3000
```

## 🚀 برای Deploy

### 1. Build کنید
```bash
npm run build
```

### 2. فایل‌های dist را کپی کنید
فایل‌های build شده را روی سرور کپی کنید.

### 3. تنظیم DNS
یک رکورد A یا CNAME برای `api.` اضافه کنید:

```dns
Type: A
Name: api
Value: [IP سرور API شما]
```

### 4. تمام! ✅
سیستم خودکار کار می‌کند. نیازی به تغییر کد نیست!

## 📖 مستندات کامل

- [راهنمای سریع](/docs/Auto-Domain-API-Guide.md)
- [تنظیمات پیشرفته](/config/README.md)
- [راهنمای Deploy](/DEPLOYMENT-GUIDE.md)

## 🔍 بررسی وضعیت

### از Browser Console:
```javascript
// F12 -> Console
import('./config/api.config.js').then(m => {
  console.log('دامنه فعلی:', window.location.hostname);
  console.log('API URL:', m.getAPIBaseURL());
});
```

### از Terminal:
```bash
# بررسی DNS
ping api.yourdomain.com

# تست API
curl https://api.yourdomain.com/v1/health
```

## ⚙️ تغییر دستی (اختیاری)

اگر نیاز به تغییر دستی دارید:

```typescript
import { apiConfig } from './config/api.config';

// بازگشت به حالت خودکار (پیش‌فرض)
apiConfig.setEnvironment('auto');

// استفاده از آدرس ثابت
apiConfig.setEnvironment('production');

// استفاده از آدرس سفارشی
apiConfig.setCustomURL('https://my-api.com', 'v1');
```

## 🐛 مشکلات رایج

### API پیدا نمیشه
```bash
# بررسی DNS
ping api.yourdomain.com

# اگر پاسخ نداد، DNS تنظیم نشده
```

### خطای CORS
سرور API باید دامنه شما را در whitelist داشته باشد.

### در localhost کار نمی‌کنه
مطمئن شوید سرور API روی پورت 3000 در حال اجرا است.

## 💡 نکات مهم

✅ **حالت پیش‌فرض:** auto (تشخیص خودکار)  
✅ **بدون نیاز به rebuild** - فقط DNS را تنظیم کنید  
✅ **روی هر دامنه‌ای کار می‌کند**  
✅ **امن و بهینه** برای production  

---

**آخرین بروزرسانی:** 2024/01/19  
**نسخه:** 2.0.0
