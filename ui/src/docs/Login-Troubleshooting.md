# 🔧 عیب‌یابی و حل مشکلات لاگین

## 🚨 مشکلات رایج و راه‌حل‌ها

---

## 1️⃣ کپچا لود نمی‌شود

### علائم
- تصویر کپچا نمایش داده نمی‌شود
- دکمه رفرش کار نمی‌کند
- خطای 500 یا Network Error

### راه‌حل‌ها

#### ✅ راه‌حل 1: بررسی اتصال به API
```bash
# تست با cURL
curl -X POST https://elevatorid.ieeu.ir/v1/captcha \
  -H "Content-Type: application/json" \
  -d '{"width": 200, "height": 70}'
```

#### ✅ راه‌حل 2: بررسی CORS
```typescript
// در api-client.ts
apiClient.interceptors.request.use((config) => {
  config.headers['Access-Control-Allow-Origin'] = '*';
  return config;
});
```

#### ✅ راه‌حل 3: بررسی Component
```typescript
// در CaptchaComponent.tsx
useEffect(() => {
  console.log('Fetching captcha...');
  fetchCaptcha();
}, []);

const fetchCaptcha = async () => {
  try {
    const data = await captchaService.getCaptcha();
    console.log('Captcha received:', data);
    // ...
  } catch (error) {
    console.error('Captcha error:', error);
  }
};
```

#### ✅ راه‌حل 4: Fallback برای خطا
```typescript
const [apiAvailable, setApiAvailable] = useState(true);

const fetchCaptcha = async () => {
  try {
    const data = await captchaService.getCaptcha();
    setApiAvailable(true);
    // ...
  } catch (error) {
    setApiAvailable(false);
    toast.error('خطا در دریافت کد تصویر');
  }
};

// در render
{!apiAvailable && (
  <Alert>
    <AlertDescription>
      در حال حاضر امکان دریافت کد تصویر وجود ندارد
    </AlertDescription>
  </Alert>
)}
```

---

## 2️⃣ لاگین Loading گیر می‌کند

### علائم
- دکمه لاگین در حالت loading می‌ماند
- درخواست API هرگز تکمیل نمی‌شود
- هیچ پیغام خطایی نمایش داده نمی‌شود

### راه‌حل‌ها

#### ✅ راه‌حل 1: افزودن Timeout
```typescript
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
});
```

#### ✅ راه‌حل 2: Cancel Token برای درخواست‌های قبلی
```typescript
import { useState, useRef } from 'react';
import axios, { CancelTokenSource } from 'axios';

function Login() {
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  const handleLogin = async () => {
    // Cancel previous request
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel('New request initiated');
    }

    // Create new cancel token
    cancelTokenRef.current = axios.CancelToken.source();

    try {
      await authService.login(mobile, captchaId, captcha, {
        cancelToken: cancelTokenRef.current.token,
      });
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request cancelled');
      } else {
        // Handle error
      }
    }
  };

  return (
    // ...
  );
}
```

#### ✅ راه‌حل 3: Force Reset بعد از Timeout
```typescript
const handleLogin = async () => {
  setLoading(true);

  const timeoutId = setTimeout(() => {
    setLoading(false);
    toast.error('درخواست بیش از حد طول کشید. لطفاً مجدداً تلاش کنید');
  }, 30000);

  try {
    await authService.login(mobile, captchaId, captcha);
    clearTimeout(timeoutId);
    // Success
  } catch (error) {
    clearTimeout(timeoutId);
    // Error
  } finally {
    setLoading(false);
  }
};
```

---

## 3️⃣ OTP Verification کار نمی‌کند

### علائم
- کد OTP قبول نمی‌شود
- خطای "کد تایید نادرست است"
- کد منقضی شده است

### راه‌حل‌ها

#### ✅ راه‌حل 1: بررسی فرمت OTP
```typescript
const handleVerify = async () => {
  // بررسی فرمت
  if (!/^\d{6}$/.test(otp)) {
    toast.error('کد تایید باید 6 رقم باشد');
    return;
  }

  // ارسال درخواست
  try {
    await authService.verifyOTP(mobile, otp);
  } catch (error) {
    // ...
  }
};
```

#### ✅ راه‌حل 2: بررسی Mobile Number
```typescript
const handleVerify = async () => {
  // اطمینان از وجود شماره موبایل
  const mobile = location.state?.mobile || localStorage.getItem('login_mobile');
  
  if (!mobile) {
    toast.error('شماره موبایل یافت نشد. لطفاً مجدداً وارد شوید');
    navigate('/api/login');
    return;
  }

  // ارسال درخواست
  try {
    await authService.verifyOTP(mobile, otp);
  } catch (error) {
    // ...
  }
};
```

#### ✅ راه‌حل 3: Retry با Exponential Backoff
```typescript
async function verifyWithRetry(mobile: string, otp: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await authService.verifyOTP(mobile, otp);
    } catch (error: any) {
      if (i === retries - 1) throw error;
      
      // Wait with exponential backoff
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

---

## 4️⃣ Redirect بعد از لاگین کار نمی‌کند

### علائم
- بعد از لاگین به صفحه خالی می‌رود
- 404 Not Found
- صفحه لاگین دوباره نمایش داده می‌شود

### راه‌حل‌ها

#### ✅ راه‌حل 1: بررسی Role و Redirect
```typescript
const handleVerify = async () => {
  try {
    const response = await authService.verifyOTP(mobile, otp);
    
    // ذخیره در localStorage
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    // به‌روزرسانی context
    login(response.user);
    
    // Redirect بر اساس role
    const redirectPath = response.user.role === 'admin' 
      ? '/api/admin' 
      : '/api/user';
    
    console.log('Redirecting to:', redirectPath);
    navigate(redirectPath, { replace: true });
    
  } catch (error) {
    // ...
  }
};
```

#### ✅ راه‌حل 2: استفاده از window.location برای Force Redirect
```typescript
const handleVerify = async () => {
  try {
    const response = await authService.verifyOTP(mobile, otp);
    
    // ذخیره اطلاعات
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    // Force redirect
    const redirectPath = response.user.role === 'admin' 
      ? '/api/admin' 
      : '/api/user';
    
    window.location.href = redirectPath;
    
  } catch (error) {
    // ...
  }
};
```

---

## 5️⃣ Token Expired Error

### علائم
- خطای 401 Unauthorized
- "توکن منقضی شده است"
- Auto logout

### راه‌حل‌ها

#### ✅ راه‌حل 1: Auto Refresh Token
```typescript
// در api-client.ts
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(
          `${BASE_URL}/auth/refresh`,
          { refresh_token: refreshToken }
        );

        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Logout
        localStorage.clear();
        window.location.href = '/api/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

#### ✅ راه‌حل 2: Proactive Token Refresh
```typescript
// Check token expiry every 5 minutes
useEffect(() => {
  const interval = setInterval(async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        // Decode JWT to check expiry
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiryTime = payload.exp * 1000;
        const now = Date.now();
        
        // Refresh if less than 5 minutes remaining
        if (expiryTime - now < 5 * 60 * 1000) {
          const refreshToken = localStorage.getItem('refresh_token');
          const response = await authService.refreshToken(refreshToken!);
          localStorage.setItem('access_token', response.access_token);
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
      }
    }
  }, 5 * 60 * 1000); // 5 minutes

  return () => clearInterval(interval);
}, []);
```

---

## 6️⃣ CORS Error

### علائم
- "Access-Control-Allow-Origin" error
- Network Error در Console
- درخواست‌ها به API fail می‌شوند

### راه‌حل‌ها

#### ✅ راه‌حل 1: بررسی Backend CORS Config
```javascript
// در Backend (Express example)
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:5173', 'https://yourdomain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

#### ✅ راه‌حل 2: استفاده از Proxy در Development
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/v1': {
        target: 'https://elevatorid.ieeu.ir',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
```

---

## 7️⃣ Console Errors از Figma DevTools

### علائم
- خطاهای webpack در console
- "devtools_worker" errors
- "ChunkLoadError"

### راه‌حل‌ها

#### ✅ راه‌حل 1: فیلتر کردن در Console
```typescript
// در App.tsx
const originalError = console.error;
console.error = (...args) => {
  const message = args.join(' ');
  if (message.includes('devtools_worker') || 
      message.includes('figma.com') ||
      message.includes('webpack')) {
    return; // Ignore
  }
  originalError.apply(console, args);
};
```

---

## 8️⃣ RTL Layout Issues

### علائم
- متن یا فرم‌ها در جهت اشتباه نمایش داده می‌شوند
- Input direction اشتباه است
- کامپوننت‌ها از راست به چپ نیستند

### راه‌حل‌ها

#### ✅ راه‌حل 1: اضافه کردن dir="rtl"
```tsx
<div className="min-h-screen" dir="rtl">
  <form>
    {/* content */}
  </form>
</div>
```

#### ✅ راه‌حل 2: تنظیم CSS Global
```css
/* در globals.css */
[dir="rtl"] {
  text-align: right;
  direction: rtl;
}

[dir="rtl"] input,
[dir="rtl"] textarea {
  text-align: right !important;
  direction: rtl !important;
}
```

---

## 9️⃣ Mobile Input Issues

### علائم
- کیبورد در موبایل مشکل دارد
- Input zoom می‌شود
- فرمت شماره موبایل اشتباه است

### راه‌حل‌ها

#### ✅ راه‌حل 1: تنظیم Input Type و Pattern
```tsx
<input
  type="tel"
  inputMode="numeric"
  pattern="[0-9]*"
  maxLength={11}
  placeholder="09123456789"
/>
```

#### ✅ راه‌حل 2: جلوگیری از Zoom در iOS
```html
<!-- در index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

#### ✅ راه‌حل 3: Font Size بالای 16px
```css
input {
  font-size: 16px; /* Prevents zoom on iOS */
}
```

---

## 🔟 Performance Issues

### علائم
- صفحه کند لود می‌شود
- Animation lag
- High memory usage

### راه‌حل‌ها

#### ✅ راه‌حل 1: Lazy Loading Components
```typescript
const Login = lazy(() => import('./components/api-auth/Login'));
```

#### ✅ راه‌حل 2: Optimize Images
```tsx
<img 
  src={captchaImage}
  alt="کد تصویر"
  loading="eager"
  decoding="async"
  width={200}
  height={70}
/>
```

#### ✅ راه‌حل 3: Memoization
```typescript
import { useMemo, useCallback } from 'react';

const Login = () => {
  const validateMobile = useCallback((value: string) => {
    return /^09\d{9}$/.test(value);
  }, []);

  const formattedMobile = useMemo(() => {
    return mobile.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
  }, [mobile]);

  // ...
};
```

---

## 📋 Checklist عیب‌یابی

### قبل از ارسال درخواست به Support:

- [ ] آیا API در دسترس است؟ (تست با cURL)
- [ ] آیا اتصال اینترنت فعال است؟
- [ ] آیا کپچا به درستی لود می‌شود؟
- [ ] آیا شماره موبایل فرمت صحیح دارد؟
- [ ] آیا توکن‌ها در localStorage ذخیره می‌شوند؟
- [ ] آیا خطای CORS وجود دارد؟
- [ ] آیا console errors مرتبط با برنامه هست؟
- [ ] آیا در browser دیگری هم مشکل وجود دارد؟
- [ ] آیا در حالت incognito/private هم مشکل هست؟
- [ ] آیا localStorage/cookies پاک شده‌اند؟

---

## 🛠️ ابزارهای دیباگ

### 1. React DevTools
```bash
# نصب extension برای Chrome/Firefox
# دیدن state و props کامپوننت‌ها
```

### 2. Network Tab
```
در DevTools → Network Tab
- فیلتر: XHR/Fetch
- بررسی Request/Response
- بررسی Headers
- بررسی Timing
```

### 3. Console Logs
```typescript
// اضافه کردن logs برای دیباگ
console.log('Mobile:', mobile);
console.log('Captcha ID:', captchaId);
console.log('Request:', { mobile, captchaId, captcha });
console.log('Response:', response);
console.log('Error:', error);
```

### 4. Postman/Insomnia
```
تست API endpoints به صورت مستقیم
بررسی Response format
بررسی Headers
بررسی Status codes
```

---

## 📞 دریافت کمک

اگر مشکل حل نشد:

1. 📖 مستندات کامل: `/docs/Login-Complete-Guide.md`
2. 🔍 API Guide: `/docs/API-Endpoints-Guide.md`
3. 🛡️ Security: `/docs/Security-Updates.md`
4. 🧪 Test Form: `/components/common/APITestForm.tsx`
5. 💬 تیم پشتیبانی: support@elevatorid.ir

---

## 🎯 نکات پیشگیری

1. ✅ همیشه Error Handling داشته باشید
2. ✅ از Try-Catch استفاده کنید
3. ✅ Loading States را مدیریت کنید
4. ✅ Timeout برای requests تنظیم کنید
5. ✅ Validation سمت کلاینت انجام دهید
6. ✅ Toast messages برای کاربر نمایش دهید
7. ✅ Console logs برای development
8. ✅ Error boundaries برای React
9. ✅ Fallback UI برای خطاها
10. ✅ Retry logic برای Network errors