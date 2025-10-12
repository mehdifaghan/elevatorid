# ElevatorID SaaS Backend

این مخزن حاوی اسکلت کامل یک بک‌اند SaaS برای مدیریت سرویس و نگهداری آسانسور است که بر اساس معماری پیشنهادی در مستندات پروژه طراحی شده است. هدف این پروژه فراهم کردن نقطه شروع کامل برای تیم مهندسی جهت راه‌اندازی یک سرویس چندمستاجری (Multi-tenant) با Laravel 11، Sanctum، Redis و MySQL است.

## راه‌اندازی سریع

```bash
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

## پیش‌نیازها

- PHP 8.2+
- Composer 2.6+
- MySQL 8 یا MariaDB
- Redis 7
- Node.js 18 (برای ابزارهای فرانت/داده‌ی اضافی در صورت نیاز)

## ساختار پروژه

پروژه مطابق ساختار پیشنهادی با ماژول‌های دامنه‌ای در مسیر `app/Domain` سازماندهی شده است. کنترلرهای API در `app/Http/Controllers/Api/v1` قرار گرفته‌اند و از Form Requestها، Resourceها و Policyها برای اعمال قوانین دسترسی استفاده می‌شود.

```
app/
  Domain/
  Http/
  Policies/
  Services/
  Actions/
  Rules/
config/
database/
docs/
routes/
tests/
```

## مستندات

- مستند OpenAPI در `docs/openapi.yaml`
- کالکشن Postman در `docs/postman.json`

برای مشاهده رابط Swagger می‌توانید پس از اجرای پروژه به مسیر `/docs` مراجعه کنید (پس از نصب وابستگی‌های مورد نیاز `knuckleswtf/scribe`).

## Docker

پروژه دارای `Dockerfile` و `docker-compose.yml` برای راه‌اندازی سرویس‌های app، mysql و redis است. پس از نصب Docker و Docker Compose، می‌توانید با دستور زیر پروژه را اجرا کنید:

```bash
docker compose up --build -d
```

سپس برای اجرای مهاجرت‌ها و seederها وارد کانتینر اپ شوید:

```bash
docker compose exec app php artisan migrate --seed
```

## تست‌ها

سیستم تست با Pest پیکربندی شده است. برای اجرای تست‌ها پس از نصب وابستگی‌ها دستور زیر را اجرا کنید:

```bash
php artisan test
```

## استقرار روی cPanel

برای نصب برنامه روی محیط میزبانی cPanel مراحل زیر را دنبال کنید:

1. **آماده‌سازی سورس**
   - در محیط توسعه خود `composer install --no-dev` را اجرا کنید تا وابستگی‌ها نصب و پوشه `vendor/` ساخته شود.
   - دستور `npm install && npm run build` را در صورت نیاز به دارایی‌های فرانت اجرا کنید.
   - محتویات پروژه (از جمله پوشه‌های `vendor/` و `public/`) را در یک فایل ZIP قرار دهید.

2. **بارگذاری روی هاست**
   - از طریق File Manager یا FTP در cPanel وارد شوید و فایل ZIP را در پوشه‌ای غیر از `public_html` (مثلاً `~/elevatorid`) آپلود کنید.
   - فایل ZIP را Extract کنید و مطمئن شوید پوشه `storage/` و `bootstrap/cache/` مجوز نوشتن (755 یا 775) دارند.

3. **پیکربندی Document Root**
   - در بخش `Domains` یا `Subdomains`، دامنه یا زیردامنه‌ای ایجاد کنید که Document Root آن پوشه `public/` داخل پروژه باشد (مثلاً `~/elevatorid/public`).
   - در صورت نبود دسترسی به تغییر Document Root، می‌توانید محتوای پوشه `public/` را به `public_html/` منتقل کرده و مسیرهای `index.php` و `.htaccess` را برای اشاره به مسیر اصلی پروژه به‌روزرسانی کنید.

4. **تنظیم متغیرهای محیطی**
   - فایل `.env.example` را به `.env` کپی کرده و مقادیر مربوط به دیتابیس، Redis، ایمیل و سرویس‌ها را بر اساس اطلاعات هاست تکمیل کنید.
   - در صورت استفاده از `php artisan key:generate --show` مقدار کلید را دریافت و در `.env` قرار دهید یا دستور را از طریق Terminal cPanel اجرا کنید.

5. **ایجاد دیتابیس**
   - در بخش MySQL Database Wizard دیتابیس و کاربر جدید بسازید و دسترسی کامل به کاربر بدهید.
   - مقادیر `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` را در `.env` تنظیم کنید.

6. **اجرای مهاجرت‌ها و seederها**
   - از بخش Terminal یا SSH دستورهای زیر را اجرا کنید:

     ```bash
     php artisan migrate --force
     php artisan db:seed --force
     ```

7. **تنظیمات Cron و Queue**
   - برای اجرای زمان‌بندی‌ها در `Cron Jobs` دستور زیر را با بازه زمانی دلخواه (مثلاً هر دقیقه) ثبت کنید:

     ```bash
     * * * * * /usr/local/bin/php /home/USERNAME/elevatorid/artisan schedule:run >> /dev/null 2>&1
     ```

   - برای پردازش صف می‌توانید یک اسکریپت Supervisor روی سرور راه‌اندازی کنید یا از `php artisan queue:work` در یک فرآیند جداگانه استفاده کنید (در cPanel معمولاً با استفاده از Cron Job با دستور `php artisan queue:work --stop-when-empty`).

8. **تنظیمات امنیتی و بهینه‌سازی**
   - فرمان‌های زیر را حداقل یک‌بار اجرا کنید تا کش‌ها ساخته شوند:

     ```bash
     php artisan config:cache
     php artisan route:cache
     php artisan view:cache
     ```

   - مطمئن شوید دایرکتوری‌های حساس مانند `storage/` و `bootstrap/cache/` از طریق وب قابل دسترس نیستند.

9. **بررسی سلامت سرویس**
   - پس از استقرار، با فراخوانی آدرس `/healthz` از صحت پاسخگویی برنامه اطمینان حاصل کنید.

با اجرای مراحل فوق، برنامه با ساختار Laravel استاندارد در محیط اشتراکی cPanel قابل اجرا خواهد بود.

## یادداشت در مورد وابستگی‌ها

به دلیل محدودیت‌های محیطی در این ریپو، تنها اسکلت پروژه و فایل‌های پیکربندی فراهم شده است. برای اجرای کامل پروژه لازم است پس از کلون کردن ریپو در محیط توسعه خود، دستورات Composer را اجرا کرده و vendorها را نصب کنید.

