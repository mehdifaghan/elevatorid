# مستندات API فرم ورود سامانه ردیابی قطعات آسانسور

## نمای کلی

این مستندات APIهای مربوط به احراز هویت فرم ورود را شرح می‌دهد. سیستم از OTP (کد یکبار مصرف) و CAPTCHA برای امنیت بالا استفاده می‌کند.

## Base URL
```
https://elevatorid.ieeu.ir/v1
```

## مراحل ورود

### 1. دریافت CAPTCHA
### 2. ارسال OTP
### 3. تایید OTP

---

## 🔐 مرحله 1: دریافت CAPTCHA

### `GET /captcha`

دریافت تصویر CAPTCHA جدید برای تایید امنیتی.

#### Headers
```http
Accept: application/json
```

#### Response

**✅ Success (200)**
```json
{
  "captchaId": "abc123def456",
  "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "expiresIn": 300
}
```

**❌ Error (500)**
```json
{
  "error": "خطا در تولید کد امنیتی",
  "message": "Internal server error"
}
```

#### مثال استفاده

```javascript
// دریافت CAPTCHA جدید
const getCaptcha = async () => {
  try {
    const response = await fetch('https://elevatorid.ieeu.ir/v1/captcha', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (response.ok) {
      setCaptchaId(data.captchaId);
      setCaptchaImageUrl(data.imageUrl);
    }
  } catch (error) {
    console.error('خطا در دریافت CAPTCHA:', error);
  }
};
```

---

## 📱 مرحله 2: ارسال OTP

### `POST /auth/send-otp`

ارسال کد تایید به شماره موبایل کاربر.

#### Headers
```http
Content-Type: application/json
Accept: application/json
```

#### Request Body

```json
{
  "phone": "09123456789",
  "captcha": "XY8K9",
  "captchaId": "abc123def456"
}
```

#### Fields Description

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `phone` | string | ✅ | شماره موبایل (الگو: `^09\d{9}$`) |
| `captcha` | string | ✅ | کد امنیتی وارد شده توسط کاربر |
| `captchaId` | string | ✅ | شناسه منحصر به فرد CAPTCHA |

#### Response

**✅ Success (200)**
```json
{
  "success": true,
  "message": "کد تایید ارسال شد",
  "data": {
    "expiresIn": 120,
    "resendAfter": 60
  }
}
```

**❌ Error (400) - اعتبارسنجی**
```json
{
  "success": false,
  "error": "شماره موبایل معتبر نیست",
  "details": {
    "field": "phone",
    "code": "INVALID_PHONE"
  }
}
```

**❌ Error (400) - CAPTCHA نامعتبر**
```json
{
  "success": false,
  "error": "کد امنیتی اشتباه است",
  "details": {
    "field": "captcha",
    "code": "INVALID_CAPTCHA"
  }
}
```

**❌ Error (429) - محدودیت تعداد درخواست**
```json
{
  "success": false,
  "error": "تعداد درخواست‌ها بیش از حد مجاز",
  "details": {
    "retryAfter": 300,
    "code": "RATE_LIMIT_EXCEEDED"
  }
}
```

#### مثال استفاده

```javascript
// ارسال درخواست OTP
const sendOTP = async (phoneNumber, captchaValue, captchaId) => {
  try {
    const response = await fetch('https://elevatorid.ieeu.ir/v1/auth/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        phone: phoneNumber,
        captcha: captchaValue,
        captchaId: captchaId
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('کد تایید ارسال شد');
      // هدایت به صفحه تایید OTP
    } else {
      console.error('خطا:', data.error);
    }
  } catch (error) {
    console.error('خطا در ارسال درخواست:', error);
  }
};
```

---

## ✅ مرحله 3: تایید OTP

### `POST /auth/verify-otp`

تایید کد OTP و دریافت توکن دسترسی.

#### Headers
```http
Content-Type: application/json
Accept: application/json
```

#### Request Body

```json
{
  "phone": "09123456789",
  "code": "123456"
}
```

#### Fields Description

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `phone` | string | ✅ | شماره موبایل (همان شماره مرحله قبل) |
| `code` | string | ✅ | کد ۶ رقمی دریافت شده |

#### Response

**✅ Success (200)**
```json
{
  "success": true,
  "message": "ورود موفقیت‌آمیز",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "user": {
      "id": 123,
      "phone": "09123456789",
      "role": "user",
      "profiles": [
        {
          "id": 1,
          "profileType": "installer",
          "isActive": true,
          "company": {
            "id": 1,
            "name": "شرکت نمونه",
            "tradeId": "123456789"
          }
        }
      ]
    }
  }
}
```

**❌ Error (400) - کد نامعتبر**
```json
{
  "success": false,
  "error": "کد تایید اشتباه است",
  "details": {
    "field": "code",
    "code": "INVALID_OTP",
    "attemptsLeft": 2
  }
}
```

**❌ Error (410) - کد منقضی**
```json
{
  "success": false,
  "error": "کد تایید منقضی شده است",
  "details": {
    "field": "code",
    "code": "EXPIRED_OTP"
  }
}
```

#### مثال استفاده

```javascript
// تایید کد OTP
const verifyOTP = async (phoneNumber, otpCode) => {
  try {
    const response = await fetch('https://elevatorid.ieeu.ir/v1/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        phone: phoneNumber,
        code: otpCode
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // ذخیره توکن
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      
      console.log('ورود موفق:', data.data.user);
      // هدایت به پنل کاربری
    } else {
      console.error('خطا در تایید:', data.error);
    }
  } catch (error) {
    console.error('خطا در تایید OTP:', error);
  }
};
```

---

## 🔄 اعتبارسنجی CAPTCHA

### `POST /captcha/validate`

اعتبارسنجی کد امنیتی (اختیاری - برای تست real-time).

#### Headers
```http
Content-Type: application/json
Accept: application/json
```

#### Request Body

```json
{
  "captchaId": "abc123def456",
  "captchaValue": "XY8K9"
}
```

#### Response

**✅ Success (200)**
```json
{
  "valid": true,
  "message": "کد امنیتی صحیح است"
}
```

**❌ Invalid (200)**
```json
{
  "valid": false,
  "message": "کد امنیتی اشتباه است"
}
```

---

## 📋 کدهای خطا

| کد HTTP | Error Code | توضیحات |
|---------|------------|----------|
| 400 | `INVALID_PHONE` | فرمت شماره موبایل اشتباه |
| 400 | `INVALID_CAPTCHA` | کد امنیتی اشتباه |
| 400 | `INVALID_OTP` | کد تایید اشتباه |
| 404 | `CAPTCHA_NOT_FOUND` | CAPTCHA یافت نشد |
| 410 | `EXPIRED_OTP` | کد تایید منقضی شده |
| 410 | `EXPIRED_CAPTCHA` | کد امنیتی منقضی شده |
| 429 | `RATE_LIMIT_EXCEEDED` | تعداد درخواست بیش از حد |
| 500 | `INTERNAL_ERROR` | خطای سرور |

---

## 🔒 امنیت

### محدودیت‌ها
- **Rate Limiting:** حداکثر 5 درخواست در دقیقه برای هر IP
- **OTP Expiry:** کد تایید پس از 2 دقیقه منقضی می‌شود
- **CAPTCHA Expiry:** کد امنیتی پس از 5 دقیقه منقضی می‌شود
- **Max Attempts:** حداکثر 3 تلاش برای تایید OTP

### Headers امنیتی
```http
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 4
X-RateLimit-Reset: 1640995200
```

---

## 🎯 مثال کامل جاوااسکریپت

```javascript
class AuthService {
  constructor() {
    this.baseURL = 'https://elevatorid.ieeu.ir/v1';
  }

  // دریافت CAPTCHA
  async getCaptcha() {
    const response = await fetch(`${this.baseURL}/captcha`);
    return await response.json();
  }

  // ارسال OTP
  async sendOTP(phone, captcha, captchaId) {
    const response = await fetch(`${this.baseURL}/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, captcha, captchaId })
    });
    return await response.json();
  }

  // تایید OTP
  async verifyOTP(phone, code) {
    const response = await fetch(`${this.baseURL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, code })
    });
    return await response.json();
  }

  // فرآیند کامل ورود
  async login(phone, captcha, captchaId, otp) {
    try {
      // مرحله 1: ارسال OTP
      const otpResult = await this.sendOTP(phone, captcha, captchaId);
      if (!otpResult.success) {
        throw new Error(otpResult.error);
      }

      // مرحله 2: تایید OTP
      const verifyResult = await this.verifyOTP(phone, otp);
      if (!verifyResult.success) {
        throw new Error(verifyResult.error);
      }

      return verifyResult.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }
}

// استفاده
const authService = new AuthService();

// دریافت CAPTCHA
const captchaData = await authService.getCaptcha();

// ورود کامل
const userData = await authService.login(
  '09123456789',
  'XY8K9',
  captchaData.captchaId,
  '123456'
);
```

---

## 📞 پشتیبانی

برای سوالات فنی:
- **ایمیل:** support@elevatorid.ieeu.ir
- **تلفن:** ۰۲۱-۱۲۳۴۵۶۷۸

---

## 📝 یادداشت‌ها

1. **شماره موبایل:** فقط شماره‌های ایرانی (۰۹xxxxxxxxx) پذیرفته می‌شوند
2. **CAPTCHA:** هر CAPTCHA فقط یک بار قابل استفاده است
3. **OTP:** کد تایید ۶ رقمی و حساس به زمان است
4. **Token Management:** Access token باید در header های بعدی ارسال شود
5. **Error Handling:** همیشه فیلد `success` را بررسی کنید

---

*آخرین بروزرسانی: دی ۱۴۰۳*