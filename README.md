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

## یادداشت در مورد وابستگی‌ها

به دلیل محدودیت‌های محیطی در این ریپو، تنها اسکلت پروژه و فایل‌های پیکربندی فراهم شده است. برای اجرای کامل پروژه لازم است پس از کلون کردن ریپو در محیط توسعه خود، دستورات Composer را اجرا کرده و vendorها را نصب کنید.

