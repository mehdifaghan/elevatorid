# راهنمای یکپارچه‌سازی CAPTCHA با API

## مقدمه

کامپوننت `CaptchaComponent` جدید برای کار با API های خارجی طراحی شده و امکان دریافت و اعتبارسنجی کد امنیتی از سرور را فراهم می‌کند.

## ویژگی‌های جدید

### 🔄 دریافت از API
- تصویر CAPTCHA از سرور دریافت می‌شود
- پشتیبانی از fallback محلی در صورت خطا
- مدیریت خطاهای شبکه

### ✅ اعتبارسنجی Server-side
- اعتبارسنجی از طریق API سرور
- اعتبارسنجی لحظه‌ای (Real-time)
- مدیریت وضعیت loading

### 🔐 امنیت بهتر
- هر CAPTCHA یک ID منحصر به فرد دارد
- انقضای خودکار
- جلوگیری از replay attacks

## API Endpoints

### دریافت CAPTCHA جدید
```
GET https://elevatorid.ieeu.ir/v1/captcha
```

**Response:**
```json
{
  "captchaId": "abc123def456",
  "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "expiresIn": 300
}
```

### اعتبارسنجی CAPTCHA
```
POST https://elevatorid.ieeu.ir/v1/captcha/validate
```

**Request:**
```json
{
  "captchaId": "abc123def456",
  "captchaValue": "XY8K9"
}
```

**Response:**
```json
{
  "valid": true,
  "message": "CAPTCHA معتبر است"
}
```

## نحوه استفاده

### 1. Import کامپوننت

```typescript
import CaptchaComponent from './components/common/CaptchaComponent';
```

### 2. مدیریت State

```typescript
const [captchaData, setCaptchaData] = useState({
  value: '',
  id: '',
  isValid: false
});
```

### 3. Handler Functions

```typescript
const handleCaptchaChange = (value: string) => {
  setCaptchaData(prev => ({ ...prev, value }));
};

const handleCaptchaIdChange = (id: string) => {
  setCaptchaData(prev => ({ ...prev, id }));
};

const handleValidityChange = (isValid: boolean) => {
  setCaptchaData(prev => ({ ...prev, isValid }));
};
```

### 4. استفاده در JSX

```jsx
<CaptchaComponent
  onCaptchaChange={handleCaptchaChange}
  onCaptchaIdChange={handleCaptchaIdChange}
  onValidityChange={handleValidityChange}
  disabled={loading}
/>
```

### 5. ارسال به API

```typescript
const submitForm = async () => {
  const formData = {
    // سایر فیلدهای فرم
    phone: phoneNumber,
    
    // فیلدهای CAPTCHA
    captcha: captchaData.value,
    captchaId: captchaData.id
  };

  const response = await fetch('/api/endpoint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  });
};
```

## Props کامپوننت

| Prop | Type | Description |
|------|------|-------------|
| `onCaptchaChange` | `(value: string) => void` | تغییر مقدار CAPTCHA |
| `onCaptchaIdChange` | `(id: string) => void` | تغییر ID کپچا |
| `onValidityChange` | `(isValid: boolean) => void` | تغییر وضعیت اعتبار |
| `onValidate` | `(isValid: boolean) => void` | Deprecated - از `onValidityChange` استفاده کنید |
| `onValueChange` | `(value: string) => void` | Deprecated - از `onCaptchaChange` استفاده کنید |
| `disabled` | `boolean` | غیرفعال کردن کامپوننت |

## مثال کامل فرم ورود

```tsx
import React, { useState } from 'react';
import CaptchaComponent from './components/common/CaptchaComponent';
import { authService } from './services/auth.service';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    phone: '',
    captcha: '',
    captchaId: ''
  });
  const [captchaValid, setCaptchaValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaValid) {
      toast.error('کد امنیتی صحیح نیست');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.sendOtp({
        phone: formData.phone,
        captcha: formData.captcha,
        captchaId: formData.captchaId
      });

      if (response.success) {
        toast.success('کد تایید ارسال شد');
        // redirect to OTP page
      }
    } catch (error) {
      toast.error('خطا در ارسال درخواست');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>شماره موبایل</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            phone: e.target.value
          }))}
        />
      </div>

      <CaptchaComponent
        onCaptchaChange={(value) => setFormData(prev => ({
          ...prev,
          captcha: value
        }))}
        onCaptchaIdChange={(id) => setFormData(prev => ({
          ...prev,
          captchaId: id
        }))}
        onValidityChange={setCaptchaValid}
        disabled={loading}
      />

      <button 
        type="submit" 
        disabled={loading || !captchaValid}
      >
        {loading ? 'در حال ارسال...' : 'ورود'}
      </button>
    </form>
  );
}
```

## مدیریت خطا

### خطاهای شبکه
کامپوننت در صورت عدم دسترسی به API، از CAPTCHA محلی استفاده می‌کند:

```typescript
// در صورت خطای API، fallback محلی اجرا می‌شود
catch (error) {
  console.error('خطا در دریافت CAPTCHA:', error);
  setError('خطا در بارگذاری کد امنیتی');
  generateFallbackCaptcha(); // CAPTCHA محلی
}
```

### پیام‌های کاربر
- 🔄 "در حال بررسی..." - هنگام اعتبارسنجی
- ✅ "کد امنیتی صحیح است" - اعتبارسنجی موفق
- ❌ "کد امنیتی اشتباه است" - اعتبارسنجی ناموفق
- ⚠️ "خطا در بارگذاری کد امنیتی" - خطای شبکه

## تنظیمات سرویس

سرویس CAPTCHA در فایل `services/captcha.service.ts` تعریف شده:

```typescript
export const captchaService = {
  // دریافت CAPTCHA جدید
  getCaptcha: () =>
    apiRequest.get<CaptchaResponse>('/captcha'),

  // اعتبارسنجی CAPTCHA
  validateCaptcha: (data: CaptchaValidationRequest) =>
    apiRequest.post<CaptchaValidationResponse>('/captcha/validate', data),
};
```

## نکات مهم

### امنیت
- هر CAPTCHA یک بار قابل استفاده است
- زمان انقضا را رعایت کنید
- فیلد `captchaId` را همیشه همراه `captcha` ارسال کنید

### Performance
- تصاویر CAPTCHA cache نمی‌شوند
- هر بار refresh کردن، درخواست جدید ارسال می‌شود
- از throttling در اعتبارسنجی استفاده می‌شود

### UX
- Loading state برای تجربه بهتر کاربر
- پیام‌های خطا روشن و واضح
- امکان refresh آسان کد امنیتی

## بروزرسانی از نسخه قدیمی

اگر از کامپوننت CAPTCHA قدیمی استفاده می‌کردید:

### قبل:
```jsx
<CaptchaComponent
  onValueChange={setCaptcha}
  onValidityChange={setCaptchaValid}
/>
```

### بعد:
```jsx
<CaptchaComponent
  onCaptchaChange={setCaptcha}
  onCaptchaIdChange={setCaptchaId}
  onValidityChange={setCaptchaValid}
/>
```

### تغییرات در ارسال فرم:

### قبل:
```typescript
authService.sendOtp({
  phone: mobile,
  captchaToken: captcha // deprecated
});
```

### بعد:
```typescript
authService.sendOtp({
  phone: mobile,
  captcha: captcha,
  captchaId: captchaId
});
```

## پشتیبانی و عیب‌یابی

### مشکلات رایج

1. **تصویر CAPTCHA نمایش داده نمی‌شود**
   - بررسی اتصال اینترنت
   - بررسی endpoint API
   - fallback محلی فعال می‌شود

2. **اعتبارسنجی کار نمی‌کند**
   - بررسی درستی `captchaId`
   - بررسی انقضای CAPTCHA
   - تست با refresh کردن

3. **خطای 400 در API**
   - بررسی فرمت درخواست
   - بررسی وجود فیلدهای الزامی
   - بررسی header های HTTP

### لاگ‌ها
کامپوننت خطاها را در console لاگ می‌کند:

```javascript
console.error('خطا در دریافت CAPTCHA:', error);
console.error('خطا در اعتبارسنجی CAPTCHA:', error);
```

## تست و توسعه

برای تست کامپوننت در محیط توسعه، از فایل نمونه استفاده کنید:

```bash
# فایل نمونه
/examples/captcha-usage-example.tsx
```

این فایل شامل یک فرم کامل با debugging info است.