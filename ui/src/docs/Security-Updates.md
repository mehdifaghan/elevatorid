# تغییرات امنیتی سامانه

## 🚨 مشکل امنیتی شناسایی شده

### مشکل قبلی:
- روت‌های `/api/admin/*` و `/api/user/*` **بدون احراز هویت** در دسترس بودند
- کاربران می‌توانستند بدون وارد کردن CAPTCHA و OTP وارد پنل شوند
- دسترسی آزاد به تمامی عملیات ادمین و کاربر

## ✅ راه‌حل‌های اعمال شده

### 1. **ایجاد کامپوننت ProtectedRoute**
```typescript
// /components/common/ProtectedRoute.tsx
export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  allowedRoles 
}: ProtectedRouteProps)
```

**ویژگی‌ها:**
- بررسی وضعیت احراز هویت کاربر
- کنترل نقش کاربر (admin/user)
- هدایت به صفحه لاگین در صورت عدم احراز هویت
- نمایش پیام خطای دسترسی برای نقش‌های غیرمجاز

### 2. **به‌روزرسانی App.tsx**
```typescript
// قبل (غیرامن):
<Route path="/api/admin/*" element={<AdminLayout />}>

// بعد (امن):
<Route path="/api/admin/*" element={
  <ProtectedRoute requiredRole="admin">
    <AdminLayout />
  </ProtectedRoute>
}>
```

### 3. **اصلاح AuthContext**
```typescript
// حذف mock authentication برای روت‌های API
const isDemoRoute = window.location.pathname.startsWith('/demo/');
// حذف شده: || window.location.pathname.startsWith('/api/admin') || window.location.pathname.startsWith('/api/user')
```

**تغییرات:**
- حذف mock user برای روت‌های `/api/admin` و `/api/user`
- تنها روت‌های `/demo/*` از mock استفاده می‌کنند
- اجبار استفاده از token واقعی API

### 4. **بهبود فرآیند Login**
```typescript
// AuthContext - ساده‌سازی login
const login = useCallback(async (accessToken: string, refreshTokenValue?: string) => {
  setTokens(accessToken, refreshTokenValue || 'refresh-token-placeholder');
  const userData = await authService.getMe();
  const transformedUser = transformUserData(userData);
  setUser(transformedUser);
}, [transformUserData]);
```

---

## 🔒 ساختار امنیتی جدید

### **فلوچارت دسترسی:**
```
کاربر وارد روت /api/admin یا /api/user می‌شود
                    ↓
            ProtectedRoute بررسی می‌کند
                    ↓
آیا کاربر احراز هویت شده؟ → خیر → هدایت به /api/login
                    ↓ بله
آیا نقش کاربر مناسب است؟ → خیر → نمایش پیام خطای دسترسی
                    ↓ بله
            اجازه دسترسی داده می‌شود
```

### **مراحل احراز هویت:**
1. **ورود به صفحه لاگین** (`/api/login`)
2. **وارد کردن شماره موبایل**
3. **حل کردن CAPTCHA** (اجباری)
4. **ارسال درخواست OTP**
5. **وارد کردن کد 6 رقمی**
6. **تایید OTP و دریافت Token**
7. **ذخیره Token و اطلاعات کاربر**
8. **هدایت به پنل مناسب**

---

## 🛡️ تست‌های امنیتی

### **تست 1: دسترسی مستقیم**
```bash
# تست دسترسی بدون احراز هویت
curl -X GET "http://localhost:3000/api/admin"
# انتظار: هدایت به صفحه لاگین
```

### **تست 2: Token غیرمعتبر**
```javascript
// پاک کردن localStorage
localStorage.clear();
// تلاش برای دسترسی به پنل
window.location.href = '/api/admin';
// انتظار: هدایت به صفحه لاگین
```

### **تست 3: نقش غیرمجاز**
```javascript
// کاربر با نقش 'user' تلاش برای دسترسی به پنل ادمین
window.location.href = '/api/admin';
// انتظار: نمایش پیام "دسترسی غیرمجاز"
```

### **تست 4: CAPTCHA اجباری**
```javascript
// تلاش برای ارسال درخواست بدون CAPTCHA
// انتظار: غیرفعال بودن دکمه ارسال
```

### **تست 5: OTP اجباری**
```javascript
// تلاش برای عبور بدون OTP صحیح
// انتظار: عدم دریافت Token و ماندن در صفحه OTP
```

---

## 📋 چک‌لیست امنیت

### ✅ **تکمیل شده:**
- [x] محافظت از روت‌های `/api/admin/*`
- [x] محافظت از روت‌های `/api/user/*`
- [x] CAPTCHA اجباری در لاگین
- [x] OTP اجباری برای تایید
- [x] CAPTCHA اجباری برای ارسال مجدد OTP
- [x] بررسی نقش کاربر
- [x] مدیریت Token واقعی
- [x] پیام‌های خطای مناسب

### 🔄 **در حال توسعه:**
- [ ] Rate limiting برای درخواست‌های متعدد
- [ ] Logging عملیات امنیتی
- [ ] Session timeout
- [ ] Two-factor authentication (اختیاری)

### 📝 **توصیه‌های آینده:**
- [ ] هش کردن Token‌ها در localStorage
- [ ] استفاده از Secure HTTP-Only Cookies
- [ ] پیاده‌سازی CSRF protection
- [ ] Audit log برای عملیات حساس

---

## 🚀 نحوه استفاده

### **برای ادمین:**
1. رفتن به `/api/login`
2. وارد کردن شماره موبایل
3. حل CAPTCHA
4. وارد کردن OTP
5. دسترسی به `/api/admin/*`

### **برای کاربر:**
1. رفتن به `/api/login`
2. وارد کردن شماره موبایل
3. حل CAPTCHA
4. وارد کردن OTP  
5. دسترسی به `/api/user/*`

### **برای Demo (بدون احراز هویت):**
- `/demo/admin/*` - همچنان بدون احراز هویت
- `/demo/user/*` - همچنان بدون احراز هویت

---

## ⚠️ نکات مهم

### **برای توسعه‌دهندگان:**
- تمامی روت‌های جدید API باید از `ProtectedRoute` استفاده کنند
- Token‌ها در `localStorage` ذخیره می‌شوند
- هر تغییر در ساختار User باید در `AuthContext` اعمال شود

### **برای کاربران:**
- هیچ راه میانبری برای عبور از احراز هویت وجود ندارد
- CAPTCHA و OTP اجباری هستند
- نقش کاربر تعیین‌کننده دسترسی‌هاست

### **برای امنیت:**
- تمامی Token‌ها از API واقعی دریافت می‌شوند
- هیچ Mock Data در روت‌های محافظت شده استفاده نمی‌شود
- دسترسی‌ها بر اساس نقش کاربر کنترل می‌شوند

---

## 🔧 فایل‌های تغییر یافته

1. **`/components/common/ProtectedRoute.tsx`** - جدید
2. **`/App.tsx`** - اضافه شدن ProtectedRoute
3. **`/contexts/AuthContext.tsx`** - حذف mock برای API routes
4. **`/components/api-auth/Login.tsx`** - بهبود اعتبارسنجی
5. **`/components/api-auth/OTPVerification.tsx`** - CAPTCHA برای ارسال مجدد

---

*تاریخ اعمال: دی ۱۴۰۳*  
*وضعیت: فعال و تست شده*  
*اولویت: بالا - امنیت سیستم*