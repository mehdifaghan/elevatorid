# LiftApp SaaS Backend

این مخزن حاوی اسکلت کامل یک بک‌اند SaaS برای مدیریت سرویس و نگهداری آسانسور است که بر اساس معماری پیشنهادی در مستندات پروژه طراحی شده است. هدف این پروژه فراهم کردن نقطه شروع کامل برای تیم مهندسی جهت راه‌اندازی یک سرویس چندمستاجری (Multi-tenant) با Laravel 11، Sanctum، Redis و MySQL است.

## راه‌اندازی سریع

```bash
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

## نصب لوکال روی ویندوز (XAMPP)

برای اجرای پروژه به‌صورت لوکال روی ویندوز با استفاده از XAMPP مراحل زیر را دنبال کنید:

1. **نصب و آماده‌سازی XAMPP**
   - آخرین نسخه XAMPP با PHP 8.2 یا جدیدتر را از [apachefriends.org](https://www.apachefriends.org/index.html) دانلود و نصب کنید.
   - از طریق XAMPP Control Panel سرویس‌های **Apache** و **MySQL** را Start کنید.
   - در صورت نیاز به فعال بودن اکستنشن‌هایی مانند `fileinfo`, `openssl`, `intl` آن‌ها را در فایل `php.ini` فعال و Apache را ریستارت کنید.

2. **نصب Composer روی ویندوز**
   - نصب‌کننده Composer for Windows را از [getcomposer.org](https://getcomposer.org/download/) دریافت و اجرا کنید.
   - در مرحله انتخاب PHP، مسیر `php.exe` مربوط به نصب XAMPP (معمولاً `C:\xampp\php\php.exe`) را انتخاب کنید.
   - بعد از نصب، در Command Prompt با دستور `composer -V` از نصب صحیح مطمئن شوید.

3. **کلون و کپی سورس در مسیر XAMPP**
   - پروژه را با Git کلون کنید یا فایل ZIP را دانلود و استخراج کنید.
   - محتوای پروژه را در مسیری خارج از `htdocs` نگه دارید (مثلاً `C:\projects\liftapp`) و با دستور `php artisan serve` اجرا کنید **یا** کل پروژه را به `C:\xampp\htdocs\liftapp` منتقل کنید و Apache را به‌گونه‌ای تنظیم کنید که Document Root روی پوشه `public/` باشد.

4. **پیکربندی محیط و نصب وابستگی‌ها**
   - در Command Prompt یا PowerShell به مسیر پروژه بروید:

     ```powershell
     cd C:\projects\liftapp
     copy .env.example .env
     composer install
     php artisan key:generate
     ```

   - یک دیتابیس جدید با نام دلخواه در phpMyAdmin (آدرس `http://localhost/phpmyadmin`) بسازید و مقادیر `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` را در فایل `.env` تنظیم کنید (برای XAMPP معمولاً کاربر `root` بدون پسورد است).

5. **اجرای مهاجرت‌ها و داده نمونه**
   - پس از تنظیم اتصال دیتابیس، دستورات زیر را اجرا کنید تا جداول ساخته و داده‌های نمونه بارگذاری شوند:

     ```powershell
     php artisan migrate --seed
     ```

6. **اجرای سرویس‌ها**
   - برای اجرای API در محیط توسعه از دستور زیر استفاده کنید:

     ```powershell
     php artisan serve --host=127.0.0.1 --port=8000
     ```

   - در صورت نیاز به اجرای صف‌ها و زمان‌بندی در محیط ویندوز می‌توانید پنجره‌های Command Prompt جداگانه باز کنید:

     ```powershell
     php artisan queue:work
     php artisan schedule:work
     ```

   > ℹ️ **اگر با خطای `Class "Predis\Client" not found` روبه‌رو شدید**
   >
   > این خطا نشان می‌دهد که بسته‌ی Predis هنوز روی سیستم شما نصب نشده است. پس از دریافت آخرین نسخه‌ی پروژه، حتماً دستورات زیر را اجرا کنید تا وابستگی‌ها کامل نصب شوند:
   >
   > ```powershell
   > composer install
   > composer require predis/predis
   > ```
   >
   > دستور دوم تنها زمانی اجرا می‌شود که پس از نصب اولیه هنوز بسته‌ی `predis/predis` در مسیر `vendor/` موجود نباشد. پس از نصب موفق، دوباره `php artisan key:generate` را اجرا کنید. اگر قصد استفاده از Redis را ندارید، کافی است در فایل `.env` مقادیر زیر را نگه دارید تا برنامه از درایورهای فایل و sync استفاده کند و هیچ اتصالی به Redis برقرار نشود:
   >
   > ```dotenv
   > CACHE_DRIVER=file
   > QUEUE_CONNECTION=sync
   > REDIS_CLIENT=predis
   > ```

7. **دسترسی به پروژه**
   - پس از اجرای سرور محلی، از آدرس `http://127.0.0.1:8000` برای دسترسی به API یا Swagger (`/docs`) استفاده کنید.
   - اگر پروژه را به‌طور مستقیم زیر Apache قرار داده‌اید، آدرس `http://localhost` یا `http://localhost/liftapp/public` را استفاده کنید و مطمئن شوید Document Root روی پوشه `public/` تنظیم شده است.

> نکته: اگر از `php artisan serve` استفاده می‌کنید نیازی به تغییر تنظیمات Apache نیست و تنها کافی است سرویس MySQL XAMPP در حال اجرا باشد.

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
   - از طریق File Manager یا FTP در cPanel وارد شوید و فایل ZIP را در پوشه‌ای غیر از `public_html` (مثلاً `~/liftapp`) آپلود کنید.
   - فایل ZIP را Extract کنید و مطمئن شوید پوشه `storage/` و `bootstrap/cache/` مجوز نوشتن (755 یا 775) دارند.

3. **پیکربندی Document Root**
   - در بخش `Domains` یا `Subdomains`، دامنه یا زیردامنه‌ای ایجاد کنید که Document Root آن پوشه `public/` داخل پروژه باشد (مثلاً `~/liftapp/public`).
   - در صورت نبود دسترسی به تغییر Document Root، می‌توانید محتوای پوشه `public/` را به `public_html/` منتقل کرده و مسیرهای `index.php` و `.htaccess` را برای اشاره به مسیر اصلی پروژه به‌روزرسانی کنید.

4. **تنظیم متغیرهای محیطی**
   - فایل `.env.example` را به `.env` کپی کرده و مقادیر مربوط به دیتابیس، Redis، ایمیل و سرویس‌ها را بر اساس اطلاعات هاست تکمیل کنید.
   - در صورت استفاده از `php artisan key:generate --show` مقدار کلید را دریافت و در `.env` قرار دهید یا دستور را از طریق Terminal cPanel اجرا کنید.

5. **ایجاد دیتابیس**
   - در بخش MySQL Database Wizard دیتابیس و کاربر جدید بسازید و دسترسی کامل به کاربر بدهید.
   - مقادیر `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` را در `.env` تنظیم کنید.

6. **اجرای مهاجرت‌ها و seederها**
   - اگر دسترسی به Terminal یا SSH دارید، دستورهای زیر را اجرا کنید:

     ```bash
     php artisan migrate --force
     php artisan db:seed --force
     ```

   - اگر دسترسی ترمینال ندارید، یکی از راهکارهای بخش «نصب بدون ترمینال» در ادامه را دنبال کنید.

7. **تنظیمات Cron و Queue**
   - برای اجرای زمان‌بندی‌ها در `Cron Jobs` دستور زیر را با بازه زمانی دلخواه (مثلاً هر دقیقه) ثبت کنید:

     ```bash
     * * * * * /usr/local/bin/php /home/USERNAME/liftapp/artisan schedule:run >> /dev/null 2>&1
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

### نصب بدون دسترسی به ترمینال یا SSH

اگر پلن میزبانی شما اجازه اجرای دستورهای Artisan را نمی‌دهد، مراحل زیر را انجام دهید:

1. **اجرای مهاجرت‌ها در محیط توسعه**
   - پروژه را روی رایانهٔ شخصی خود نصب کنید (`composer install`, `php artisan migrate --seed`).
   - از ابزارهایی مثل phpMyAdmin یا `mysqldump` یک خروجی SQL از دیتابیس محلی تهیه کنید.
   - در هاست cPanel با استفاده از phpMyAdmin فایل SQL را روی دیتابیس تازه ایجاد شده ایمپورت کنید.

2. **بارگذاری فایل‌های vendor**
   - اطمینان حاصل کنید که پوشهٔ `vendor/` بعد از اجرای `composer install --no-dev` داخل آرشیو ZIP نهایی وجود دارد، چون روی هاست امکان نصب Composer ندارید.

3. **اجرای Artisan از طریق اسکریپت یک‌باره (اختیاری)**
   - اگر نیاز به اجرای دستورهایی مثل `config:cache` دارید، یک فایل موقت (مثلاً `public/artisan-runner.php`) ایجاد کنید و محتوای زیر را در آن قرار دهید:

     ```php
     <?php
     require __DIR__.'/../vendor/autoload.php';
     $app = require __DIR__.'/../bootstrap/app.php';
     $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

     foreach ([
         'config:cache',
         'route:cache',
     ] as $command) {
         $kernel->call($command);
         echo $command." executed\n";
     }
     ```

   - پس از آپلود، یک بار آدرس `https://your-domain.com/artisan-runner.php` را در مرورگر باز کنید تا دستورها اجرا شوند و سپس فایل را حذف کنید.

4. **به‌روزرسانی‌ها و Seedهای بعدی**
   - برای اعمال تغییرات جدید در دیتابیس، یا فایل SQL تازه تولید و ایمپورت کنید، یا برای هر مهاجرت اسکریپت Artisan موقتی مشابه بسازید.

5. **امنیت**
   - پس از پایان عملیات، حتماً فایل‌های موقتی (مانند `artisan-runner.php`) را حذف کنید تا از سوءاستفاده جلوگیری شود.

## یادداشت در مورد وابستگی‌ها

به دلیل محدودیت‌های محیطی در این ریپو، تنها اسکلت پروژه و فایل‌های پیکربندی فراهم شده است. برای اجرای کامل پروژه لازم است پس از کلون کردن ریپو در محیط توسعه خود، دستورات Composer را اجرا کرده و vendorها را نصب کنید.

