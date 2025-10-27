# 🚀 راهنمای دیپلوی روی cPanel

این راهنما مراحل کامل آپلود و راه‌اندازی پروژه Elevator ID روی سرور cPanel را شرح می‌دهد.

## 🌟 ویژگی جدید: تنظیم خودکار دامنه API

**خبر خوب!** سیستم به صورت خودکار آدرس API را بر اساس دامنه فعلی تشخیص می‌دهد. 

🎯 **بدون نیاز به تغییر کد!**
- روی `example.com` → API: `https://api.example.com`
- روی `elevatorid.ir` → API: `https://api.elevatorid.ir`
- روی `localhost` → API: `http://localhost:3000`

📖 برای اطلاعات بیشتر: [راهنمای تنظیم خودکار API](/docs/Auto-Domain-API-Guide.md)

## 📋 پیش‌نیازها

- دسترسی به cPanel
- Node.js و npm نصب شده روی سیستم محلی (برای build)
- فضای کافی روی هاست (حداقل 100MB)
- **تنظیم subdomain `api.` در DNS** (برای اتصال به API)

## 🔨 مرحله 1: Build پروژه

ابتدا باید پروژه را build کنید:

```bash
npm install
npm run build
```

این دستور یک پوشه `dist` یا `build` ایجاد می‌کند که شامل فایل‌های آماده برای دیپلوی است.

## 📂 مرحله 2: آپلود فایل‌ها

### روش 1: استفاده از File Manager

1. وارد cPanel شوید
2. به بخش **File Manager** بروید
3. به پوشه `public_html` بروید (یا پوشه دامنه‌تان)
4. تمام فایل‌های داخل پوشه `dist` یا `build` را آپلود کنید
5. فایل `.htaccess` را هم آپلود کنید (در روت پروژه)

### روش 2: استفاده از FTP

1. از نرم‌افزار FileZilla یا WinSCP استفاده کنید
2. به سرور متصل شوید
3. فایل‌ها را به `public_html` منتقل کنید

## ⚙️ مرحله 3: تنظیمات .htaccess

فایل `.htaccess` که ایجاد شده شامل:

✅ **Rewrite Rules** - برای پشتیبانی از React Router
✅ **GZIP Compression** - برای کاهش حجم فایل‌ها
✅ **Browser Caching** - برای بهبود سرعت
✅ **Security Headers** - برای امنیت بیشتر
✅ **UTF-8 Encoding** - برای پشتیبانی از فارسی

### اگر فایل .htaccess کار نمی‌کند:

1. در cPanel به **MultiPHP INI Editor** بروید
2. گزینه `display_errors = On` را فعال کنید (موقتاً)
3. خطاها را بررسی کنید

## 🔧 مرحله 4: تنظیمات DNS برای API

### مهم! تنظیم subdomain برای API

سیستم به صورت خودکار به `api.` + دامنه شما متصل می‌شود. باید در DNS دامنه خود یک رکورد اضافه کنید:

**مثال برای `elevatorid.ir`:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | api | 5.78.xxx.xxx (IP سرور API) | 3600 |

یا

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | api | your-api-server.com | 3600 |

### نحوه تنظیم در cPanel:

1. وارد cPanel شوید
2. به بخش **Zone Editor** یا **Advanced DNS Zone Editor** بروید
3. یک رکورد جدید اضافه کنید:
   - **Type:** A یا CNAME
   - **Name:** api
   - **Address/Target:** IP یا hostname سرور API
4. Save کنید

### بررسی تنظیمات DNS:

```bash
# در Terminal/CMD
ping api.yourdomain.com

# باید به IP سرور API شما پاسخ دهد
```

### اگر روی ساب‌دامنه هستید:

فایل `.htaccess` را ویرایش کنید:

```apache
RewriteBase /subdirectory/
RewriteRule . /subdirectory/index.html [L]
```

## 🌐 مرحله 5: تنظیمات HTTPS

اگر SSL دارید، در فایل `.htaccess` این خطوط را از حالت کامنت خارج کنید:

```apache
<IfModule mod_rewrite.c>
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

## 🐛 رفع مشکلات رایج

### ❌ خطای 404

**علت:** فایل `.htaccess` کار نمی‌کند

**راه‌حل:**
1. مطمئن شوید `mod_rewrite` فعال است
2. فایل `.htaccess` در روت باشد
3. مجوزها را بررسی کنید (644)

```bash
chmod 644 .htaccess
```

### ❌ صفحه سفید

**علت:** مسیرهای asset ها اشتباه است

**راه‌حل:**
در فایل `vite.config.ts` یا `package.json`:

```json
{
  "homepage": "."
}
```

یا در Vite:

```js
export default {
  base: './'
}
```

### ❌ فایل‌های CSS/JS لود نمی‌شوند

**علت:** MIME Types اشتباه است

**راه‌حل:**
در `.htaccess` این خطوط را اضافه کنید:

```apache
AddType application/javascript .js
AddType text/css .css
```

### ❌ خطای CORS

**علت:** API از دامنه دیگری است

**راه‌حل:**
در `.htaccess`:

```apache
<IfModule mod_headers.c>
  Header set Access-Control-Allow-Origin "*"
  Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
  Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>
```

## 📊 بررسی عملکرد

بعد از دیپلوی:

1. ✅ صفحه اصلی لود می‌شود
2. ✅ Navigation بین صفحات کار می‌کند
3. ✅ Refresh صفحه خطا نمی‌دهد
4. ✅ فایل‌های CSS/JS لود می‌شوند
5. ✅ تصاویر نمایش داده می‌شوند
6. ✅ API calls کار می‌کنند

## 🔐 بهینه‌سازی امنیت

### 1. محافظت از فایل‌های حساس

```apache
<FilesMatch "\.(env|sql|md)$">
  Order allow,deny
  Deny from all
</FilesMatch>
```

### 2. محدود کردن دسترسی به پوشه‌های خاص

```apache
<Directory "/path/to/admin">
  AuthType Basic
  AuthName "Restricted Area"
  AuthUserFile /path/to/.htpasswd
  Require valid-user
</Directory>
```

## 📈 بهینه‌سازی سرعت

### 1. فعال‌سازی GZIP (در .htaccess موجود است)

### 2. Browser Caching (در .htaccess موجود است)

### 3. استفاده از CDN

برای فایل‌های استاتیک می‌توانید از CDN استفاده کنید.

## 🔄 به‌روزرسانی پروژه

برای به‌روزرسانی:

1. پروژه را مجدداً build کنید
2. فایل‌های قدیمی را پاک کنید
3. فایل‌های جدید را آپلود کنید
4. Cache مرورگر را پاک کنید (Ctrl+Shift+R)

## 📱 تست روی موبایل

1. از Chrome DevTools استفاده کنید
2. Responsive mode را فعال کنید
3. سایز‌های مختلف را تست کنید

## 🆘 پشتیبانی

اگر مشکلی داشتید:

1. لاگ‌های cPanel را بررسی کنید
2. Console مرورگر را چک کنید (F12)
3. Network tab را بررسی کنید

## ✅ چک‌لیست نهایی

### Frontend:
- [ ] فایل‌های build آپلود شدند
- [ ] فایل .htaccess در روت است
- [ ] مجوزهای فایل‌ها درست است (644 برای فایل‌ها، 755 برای پوشه‌ها)
- [ ] HTTPS فعال است (اختیاری)
- [ ] تمام صفحات کار می‌کنند
- [ ] فرم‌ها کار می‌کنند
- [ ] عکس‌ها نمایش داده می‌شوند

### API:
- [ ] ✨ subdomain `api.` در DNS تنظیم شده است
- [ ] ✨ `ping api.yourdomain.com` کار می‌کند
- [ ] ✨ سرور API روی `api.yourdomain.com` در دسترس است
- [ ] ✨ endpoint `/v1/health` پاسخ می‌دهد
- [ ] API calls از frontend کار می‌کنند
- [ ] لاگین و احراز هویت کار می‌کند

### بررسی نهایی:
```bash
# تست کردن API از terminal
curl https://api.yourdomain.com/v1/health

# باید پاسخ 200 OK بدهد
```

## 🎉 تبریک!

سایت شما با موفقیت دیپلوی شد! 🚀

---

**تاریخ آخرین به‌روزرسانی:** 2025-01-14
**نسخه:** 1.0.0
