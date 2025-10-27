# ⚡ مرجع سریع صفحه لاگین

## 🔗 لینک‌های مهم

| مسیر | توضیحات |
|------|----------|
| `/api/login` | صفحه ورود با API واقعی |
| `/api/otp-verify` | صفحه تایید OTP |
| `/login` | صفحه ورود دمو (بدون API) |

---

## 🌐 API Endpoints

### Base URL
```
https://elevatorid.ieeu.ir/v1
```

### Endpoints

| Method | Endpoint | توضیحات |
|--------|----------|----------|
| POST | `/v1/captcha` | دریافت کپچا |
| POST | `/v1/auth/login` | ارسال شماره موبایل |
| POST | `/v1/auth/otp/verify` | تایید کد OTP |
| POST | `/v1/auth/refresh` | تازه‌سازی توکن |

---

## 📝 Request Examples

### 1. دریافت کپچا
```json
POST /v1/captcha
{
  "width": 200,
  "height": 70
}
```

**Response:**
```json
{
  "captcha_id": "uuid-here",
  "captcha_image": "data:image/png;base64,..."
}
```

---

### 2. ورود
```json
POST /v1/auth/login
{
  "mobile": "09123456789",
  "captcha_id": "uuid-here",
  "captcha_value": "ABC123"
}
```

**Response:**
```json
{
  "message": "کد تایید ارسال شد",
  "otp_sent": true,
  "expires_in": 120
}
```

---

### 3. تایید OTP
```json
POST /v1/auth/otp/verify
{
  "mobile": "09123456789",
  "otp": "123456"
}
```

**Response:**
```json
{
  "access_token": "jwt-token-here",
  "refresh_token": "refresh-token-here",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": "123",
    "mobile": "09123456789",
    "role": "admin",
    "name": "نام کاربر"
  }
}
```

---

## 🔄 Flow کوتاه

```
1. کاربر وارد /api/login می‌شود
   ↓
2. کپچا دریافت می‌شود (POST /v1/captcha)
   ↓
3. کاربر شماره موبایل + کپچا وارد می‌کند
   ↓
4. درخواست لاگین ارسال می‌شود (POST /v1/auth/login)
   ↓
5. OTP به موبایل ارسال می‌شود
   ↓
6. کاربر به /api/otp-verify منتقل می‌شود
   ↓
7. کاربر کد OTP را وارد می‌کند
   ↓
8. درخواست تایید ارسال می‌شود (POST /v1/auth/otp/verify)
   ↓
9. توکن‌ها دریافت و ذخیره می‌شوند
   ↓
10. کاربر به داشبورد منتقل می‌شود
```

---

## 📂 فایل‌های کلیدی

| فایل | مسیر | توضیحات |
|------|------|----------|
| Login | `/components/api-auth/Login.tsx` | صفحه اصلی لاگین |
| OTP | `/components/api-auth/OTPVerification.tsx` | صفحه تایید OTP |
| Captcha | `/components/common/CaptchaComponent.tsx` | کامپوننت کپچا |
| Auth Service | `/services/auth.service.ts` | سرویس احراز هویت |
| Captcha Service | `/services/captcha.service.ts` | سرویس کپچا |
| API Client | `/lib/api-client.ts` | کلاینت API |
| Auth Context | `/contexts/AuthContext.tsx` | کانتکست احراز هویت |

---

## 🎯 کد سریع

### استفاده از سرویس لاگین
```typescript
import { authService } from '../services/auth.service';

const handleLogin = async () => {
  try {
    await authService.login(mobile, captchaId, captcha);
    // موفق
  } catch (error) {
    // خطا
  }
};
```

### استفاده از سرویس OTP
```typescript
import { authService } from '../services/auth.service';

const handleVerify = async () => {
  try {
    const response = await authService.verifyOTP(mobile, otp);
    localStorage.setItem('access_token', response.access_token);
    // ورود موفق
  } catch (error) {
    // خطا
  }
};
```

### استفاده از کامپوننت کپچا
```tsx
<CaptchaComponent
  onCaptchaChange={setCaptcha}
  onCaptchaIdChange={setCaptchaId}
  onValidityChange={setCaptchaValid}
  disabled={loading}
/>
```

---

## ⚠️ خطاهای رایج

| کد | پیام | راه‌حل |
|----|------|--------|
| 400 | شماره نامعتبر | فرمت: 09xxxxxxxxx |
| 400 | کپچا نادرست | رفرش کپچا |
| 404 | کپچا منقضی | دریافت کپچای جدید |
| 429 | درخواست زیاد | صبر کردن |
| 401 | توکن نامعتبر | رفرش یا ورود مجدد |

---

## 🔐 توکن‌ها

### ذخیره
```typescript
localStorage.setItem('access_token', token);
localStorage.setItem('refresh_token', refreshToken);
```

### خواندن
```typescript
const token = localStorage.getItem('access_token');
```

### حذف (خروج)
```typescript
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
```

---

## 🧪 تست سریع با cURL

```bash
# کپچا
curl -X POST https://elevatorid.ieeu.ir/v1/captcha \
  -H "Content-Type: application/json" \
  -d '{"width": 200, "height": 70}'

# لاگین
curl -X POST https://elevatorid.ieeu.ir/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"mobile": "09123456789", "captcha_id": "uuid", "captcha_value": "ABC123"}'

# تایید OTP
curl -X POST https://elevatorid.ieeu.ir/v1/auth/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"mobile": "09123456789", "otp": "123456"}'
```

---

## 💡 نکات

1. ✅ همیشه از HTTPS استفاده کنید
2. ✅ توکن‌ها را امن نگه دارید
3. ✅ خطاها را به فارسی نمایش دهید
4. ✅ از Loading state استفاده کنید
5. ✅ اعتبارسنجی سمت کلاینت انجام دهید
6. ✅ از Toast برای نمایش پیام‌ها استفاده کنید

---

## 📚 مستندات کامل

برای اطلاعات بیشتر:
- [راهنمای کامل لاگین](/docs/Login-Complete-Guide.md)
- [راهنمای کپچا](/docs/Captcha-Integration-Guide.md)
- [راهنمای API](/docs/API-Endpoints-Guide.md)