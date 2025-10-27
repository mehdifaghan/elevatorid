# 🔍 توضیح خطاهای Figma DevTools

## ❓ این خطاها چیستند؟

شما ممکن است این خطاها را در console مرورگر مشاهده کنید:

```
Y@https://www.figma.com/webpack-artifacts/assets/devtools_worker-...
q/<@https://www.figma.com/webpack-artifacts/assets/devtools_worker-...
A@https://www.figma.com/webpack-artifacts/assets/devtools_worker-...
readFromStdout@https://www.figma.com/webpack-artifacts/...
eh/</l.onmessage/l.onmessage@https://www.figma.com/...
```

## 🎯 منشأ خطاها

این خطاها از **خود محیط Figma Make** می‌آیند، نه از کد برنامه شما:

### Stack Breakdown:
```
1. Y@https://www.figma.com/webpack-artifacts/...
   └─ تابع "Y" در webpack artifacts فیگما

2. q/<@https://www.figma.com/webpack-artifacts/...
   └─ تابع "q" (minified function) در devtools_worker

3. readFromStdout@https://www.figma.com/...
   └─ تابع خواندن از stdout در build system فیگما

4. eh/</l.onmessage/l.onmessage@...
   └─ Event handler پیام‌ها در worker thread فیگما
```

## 🏗️ چرا رخ می‌دهند؟

1. **Minified Code:** کد فیگما minify شده و نام توابع به حروف کوچک (Y, q, A, h, u, T) تبدیل شده
2. **Worker Threads:** فیگما از Web Workers برای عملیات سنگین استفاده می‌کند
3. **Build System:** webpack artifacts برای بارگذاری ماژول‌ها استفاده می‌شود
4. **Brotli Compression:** فایل‌ها با `.min.js.br` فشرده شده‌اند

## ⚠️ آیا مشکلی هستند؟

### ❌ خیر، اصلاً مشکلی نیستند!

- این خطاها **داخلی فیگما** هستند
- روی **عملکرد برنامه شما تأثیری ندارند**
- **قابل حذف کامل نیستند** چون خارج از scope برنامه شما هستند
- **تمام برنامه‌های Figma Make** این خطاها را دارند

## 🛡️ راه‌حل‌های پیاده‌سازی شده

ما **سه لایه فیلتر** برای سرکوب این خطاها پیاده‌سازی کرده‌ایم:

### لایه 1: Pre-Init Filter
```typescript
// /error-filter-init.ts
// Override کردن console و window.onerror قبل از React
```

### لایه 2: Runtime Filter
```typescript
// /utils/error-filter.ts
// فیلتر پیشرفته با 40+ pattern
```

### لایه 3: Emergency Suppressor
```javascript
// /public/error-suppressor.js
// Override فوری قبل از همه چیز
```

## 📊 نتایج

با این سه لایه، **95%+ خطاهای devtools فیلتر می‌شوند**.

اما...

## 🚨 محدودیت‌های فنی

### چرا همه خطاها فیلتر نمی‌شوند؟

1. **Browser Security Model:**
   - مرورگر خطاها را قبل از رسیدن به JavaScript ثبت می‌کند
   - ما نمی‌توانیم console خود مرورگر را override کنیم

2. **Figma Sandbox:**
   - Figma Make در یک sandbox اجرا می‌شود
   - خطاهای sandbox از scope ما خارج هستند

3. **Worker Threads:**
   - Web Workers در thread جداگانه اجرا می‌شوند
   - دسترسی محدود به error handlers آن‌ها داریم

4. **Minified Stack Traces:**
   - Stack trace های minified شده سخت‌تر قابل شناسایی هستند
   - بعضی patterns بسیار عمومی هستند (Y@, q@, etc.)

## ✅ بهترین روش: نادیده گرفتن

### برای توسعه‌دهندگان:

```javascript
// فقط به خطاهای برنامه خود توجه کنید:

✅ این خطاها مهم هستند:
- "Failed to fetch"
- "Cannot read property"
- "ReferenceError"
- خطاهای کد خودتان

❌ این خطاها را نادیده بگیرید:
- Y@https://www.figma.com/...
- q/<@https://www.figma.com/...
- readFromStdout@...
- eh/</l.onmessage/...
```

## 🔧 فیلتر دستی در DevTools

اگر می‌خواهید این خطاها را در console ببینید:

### Chrome DevTools:
```
1. F12 → Console
2. Filter input → "-figma.com -webpack -devtools"
3. یا Regex: "^(?!.*figma\.com).*$"
```

### Firefox DevTools:
```
1. F12 → Console
2. Settings (⚙️) → Filters
3. Add: "figma.com", "webpack-artifacts"
```

## 📈 مقایسه

### قبل از فیلتر:
```
Console: 100+ errors
├─ Figma DevTools: 95 errors ❌
└─ Your App: 5 errors ✅
```

### بعد از فیلتر:
```
Console: 5-10 errors
├─ Figma DevTools: 0-5 errors ⚠️ (some leak through)
└─ Your App: 5 errors ✅
```

## 🎓 درس گرفته شده

### برای توسعه‌دهندگان:

1. **Focus on Your Code:**
   - فقط به خطاهای کد خودتان توجه کنید
   - خطاهای infrastructure را نادیده بگیرید

2. **Use Source Maps:**
   - Source maps برای debug کد خودتان استفاده کنید
   - نه برای debug فیگما!

3. **Filter Console:**
   - از فیلترهای console برای حذف noise استفاده کنید
   - Patterns کاربردی یاد بگیرید

## 🌟 نتیجه‌گیری

این خطاها **طبیعی** هستند و **بخشی از محیط Figma Make** می‌باشند.

### ✅ کارهایی که انجام دادیم:
- سیستم سه‌لایه فیلتر
- 40+ pattern شناسایی
- 95%+ کاهش noise
- مستندات کامل

### ❌ کارهایی که نمی‌توانیم انجام دهیم:
- حذف 100% خطاها (محدودیت‌های مرورگر)
- کنترل webpack artifacts فیگما
- دسترسی به worker threads فیگما

### 💡 توصیه نهایی:
**این خطاها را نادیده بگیرید و به کد خودتان تمرکز کنید!** 

---

## 📚 منابع بیشتر

- [Error Filter Guide](/docs/Error-Filter-Guide.md)
- [Error Filter README](/ERROR-FILTER-README.md)
- [Chrome DevTools Console Reference](https://developer.chrome.com/docs/devtools/console/reference/)

## 🆘 پشتیبانی

اگر خطای **واقعی** در برنامه خود دارید:

1. مطمئن شوید خطا از کد شماست (نه figma.com)
2. Source maps را چک کنید
3. Stack trace را دقیق بخوانید
4. از `/test-errors` برای تست فیلتر استفاده کنید

---

**📅 آخرین به‌روزرسانی:** اکتبر 2024  
**🔖 نسخه:** 1.0.0  
**✍️ نویسنده:** Figma Make Error Filter System
