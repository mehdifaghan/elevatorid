# 🚀 راهنمای سریع نصب دیتابیس

## گام 1: ایجاد دیتابیس

```sql
CREATE DATABASE elevator_tracking
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_persian_ci;
```

## گام 2: اجرای Schema

```bash
mysql -u root -p elevator_tracking < database/schema.sql
```

## گام 3: اجرای داده‌های اولیه

```bash
mysql -u root -p elevator_tracking < database/seed_data.sql
```

## گام 4: ایجاد کاربر Application

```sql
CREATE USER 'elevator_app'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE ON elevator_tracking.* TO 'elevator_app'@'localhost';
FLUSH PRIVILEGES;
```

## گام 5: تنظیم اتصال در .env

```env
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=elevator_tracking
DB_USERNAME=elevator_app
DB_PASSWORD=your_strong_password
```

## ✅ تست اتصال

```sql
-- لاگین کاربر ادمین
SELECT * FROM users WHERE mobile = '09121111111';

-- تعداد قطعات
SELECT COUNT(*) FROM parts;

-- لیست آسانسورها
SELECT uid, building_name, status FROM elevators;
```

## 📊 دیتای نمونه

بعد از نصب، این داده‌ها در دسترس هستند:

- **کاربران:** 5 کاربر (1 ادمین + 4 کاربر)
- **استان‌ها:** 31 استان
- **شهرها:** 30+ شهر
- **انواع آسانسور:** 8 نوع
- **قطعات:** 3 قطعه نمونه
- **آسانسورها:** 2 آسانسور نمونه

## 🔑 کاربران تستی

| نقش | شماره موبایل | رمز (OTP) |
|-----|--------------|-----------|
| ادمین | 09121111111 | هر کد 6 رقمی |
| تولیدکننده | 09122222222 | هر کد 6 رقمی |
| نصاب | 09123333333 | هر کد 6 رقمی |
| نگهدارنده | 09124444444 | هر کد 6 رقمی |
| کاربر | 09125555555 | هر کد 6 رقمی |

## 📝 مستندات کامل

برای اطلاعات بیشتر به [README.md](./README.md) مراجعه کنید.

---

**تبریک! 🎉 دیتابیس شما آماده است.**
