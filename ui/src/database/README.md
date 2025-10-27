# 📊 راهنمای دیتابیس سامانه ردیابی قطعات آسانسور

## 🚀 نصب و راه‌اندازی

### 1. ایجاد دیتابیس

```sql
CREATE DATABASE elevator_tracking
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_persian_ci;

USE elevator_tracking;
```

### 2. اجرای Schema

```bash
mysql -u username -p elevator_tracking < database/schema.sql
```

یا از طریق phpMyAdmin:
1. وارد phpMyAdmin شوید
2. دیتابیس `elevator_tracking` را انتخاب کنید
3. به تب "SQL" بروید
4. محتوای فایل `schema.sql` را کپی و Paste کنید
5. دکمه "Go" را بزنید

---

## 📋 ساختار جداول

### جداول اصلی (23 جدول):

1. **provinces** - استان‌ها
2. **cities** - شهرها
3. **users** - کاربران
4. **user_profiles** - پروفایل‌های کاربران
5. **otps** - کدهای OTP
6. **captchas** - کپچاها
7. **access_tokens** - توکن‌های دسترسی
8. **elevator_types** - انواع آسانسور
9. **parts_categories** - دسته‌بندی قطعات
10. **technical_specs** - ویژگی‌های فنی
11. **parts** - قطعات
12. **part_transfers** - انتقالات قطعات
13. **elevators** - آسانسورها
14. **elevator_parts** - قطعات نصب شده
15. **maintenance_records** - سوابق تعمیر
16. **requests** - درخواست‌ها
17. **complaints** - شکایات
18. **settings** - تنظیمات سیستم
19. **system_logs** - لاگ‌های سیستم
20. **notifications** - اعلان‌ها
21. **files** - فایل‌ها
22. **payment_types** - انواع پرداخت
23. **transactions** - تراکنش‌های مالی

---

## 🔗 روابط جداول

### مدل ERD اصلی:

```
users (کاربران)
  ├── user_profiles (پروفایل‌ها) [1:N]
  ├── access_tokens (توکن‌ها) [1:N]
  ├── parts (قطعات - مالک) [1:N]
  ├── part_transfers (انتقالات) [1:N]
  ├── elevators (آسانسورها) [1:N]
  ├── maintenance_records (سرویس‌ها) [1:N]
  ├── requests (درخواست‌ها) [1:N]
  ├── complaints (شکایات) [1:N]
  ├── notifications (اعلان‌ها) [1:N]
  └── transactions (تراکنش‌ها) [1:N]

parts (قطعات)
  ├── parts_categories (دسته‌بندی) [N:1]
  ├── part_transfers (انتقالات) [1:N]
  └── elevator_parts (نصب شده) [1:N]

elevators (آسانسورها)
  ├── elevator_types (نوع) [N:1]
  ├── elevator_parts (قطعات) [1:N]
  └── maintenance_records (سرویس‌ها) [1:N]
```

---

## 🔑 نقش‌های کاربری

### انواع نقش‌ها:

1. **admin** - مدیر سیستم (دسترسی کامل)
2. **user** - کاربر عادی
3. **operator** - اپراتور سیستم

### انواع پروفایل (Profile Types):

1. **producer** - تولید کننده
2. **installer** - نصاب
3. **maintenance** - نگهدارنده
4. **coop_org** - سازمان تعاونی

---

## 📊 Views (نماهای از پیش تعریف شده)

### 1. آمار قطعات
```sql
SELECT * FROM v_parts_stats;
```

### 2. آمار آسانسورها
```sql
SELECT * FROM v_elevators_stats;
```

### 3. آمار درخواست‌ها
```sql
SELECT * FROM v_requests_stats;
```

---

## 🔧 Stored Procedures

### 1. انتقال قطعه
```sql
CALL sp_transfer_part(
  part_id,
  from_user_id,
  to_user_id,
  'sale',  -- transfer_type: sale, transfer, return, warranty
  1000000, -- price
  'توضیحات انتقال'
);
```

### 2. تایید انتقال
```sql
CALL sp_complete_transfer(
  transfer_id,
  user_id
);
```

### 3. ثبت سرویس
```sql
CALL sp_log_maintenance(
  elevator_id,
  technician_id,
  'routine',  -- maintenance_type: routine, repair, emergency, inspection
  'سرویس دوره‌ای',
  500000,     -- cost
  '2024-12-01' -- next_date
);
```

---

## 📝 نمونه Queries مفید

### 1. لیست قطعات یک کاربر
```sql
SELECT 
  p.uid,
  p.name,
  pc.name AS category,
  p.status,
  p.manufacture_date
FROM parts p
INNER JOIN parts_categories pc ON p.category_id = pc.id
WHERE p.current_owner_id = :user_id
ORDER BY p.created_at DESC;
```

### 2. آسانسورهای نیازمند سرویس
```sql
SELECT 
  e.uid,
  e.building_name,
  e.next_maintenance_date,
  u.name AS owner_name
FROM elevators e
INNER JOIN users u ON e.owner_id = u.id
WHERE e.next_maintenance_date < DATE_ADD(CURDATE(), INTERVAL 7 DAY)
  AND e.status = 'active'
ORDER BY e.next_maintenance_date ASC;
```

### 3. تاریخچه انتقالات یک قطعه
```sql
SELECT 
  pt.*,
  u_from.name AS from_user,
  u_to.name AS to_user
FROM part_transfers pt
LEFT JOIN users u_from ON pt.from_user_id = u_from.id
INNER JOIN users u_to ON pt.to_user_id = u_to.id
WHERE pt.part_id = :part_id
ORDER BY pt.created_at DESC;
```

### 4. درخواست‌های در انتظار
```sql
SELECT 
  r.*,
  u.name AS user_name,
  u.mobile
FROM requests r
INNER JOIN users u ON r.user_id = u.id
WHERE r.status = 'pending'
ORDER BY r.priority DESC, r.created_at ASC;
```

### 5. آمار کلی سیستم
```sql
SELECT 
  (SELECT COUNT(*) FROM users WHERE status = 'active') AS total_users,
  (SELECT COUNT(*) FROM parts WHERE status = 'available') AS available_parts,
  (SELECT COUNT(*) FROM elevators WHERE status = 'active') AS active_elevators,
  (SELECT COUNT(*) FROM requests WHERE status = 'pending') AS pending_requests;
```

---

## 🔒 امنیت دیتابیس

### 1. ایجاد کاربر دیتابیس

```sql
-- کاربر Application (فقط دسترسی‌های لازم)
CREATE USER 'elevator_app'@'localhost' IDENTIFIED BY 'strong_password_here';

-- دادن دسترسی‌ها
GRANT SELECT, INSERT, UPDATE, DELETE ON elevator_tracking.* TO 'elevator_app'@'localhost';
GRANT EXECUTE ON elevator_tracking.* TO 'elevator_app'@'localhost';

FLUSH PRIVILEGES;
```

### 2. کاربر فقط خواندنی (برای گزارشات)
```sql
CREATE USER 'elevator_readonly'@'localhost' IDENTIFIED BY 'readonly_password';
GRANT SELECT ON elevator_tracking.* TO 'elevator_readonly'@'localhost';
FLUSH PRIVILEGES;
```

---

## 💾 Backup و Restore

### Backup
```bash
# کل دیتابیس
mysqldump -u username -p elevator_tracking > backup_$(date +%Y%m%d).sql

# فقط ساختار (بدون داده)
mysqldump -u username -p --no-data elevator_tracking > structure.sql

# فقط داده‌ها
mysqldump -u username -p --no-create-info elevator_tracking > data.sql
```

### Restore
```bash
mysql -u username -p elevator_tracking < backup.sql
```

---

## 🔄 Migration و به‌روزرسانی

### اضافه کردن ستون جدید
```sql
ALTER TABLE parts 
ADD COLUMN warranty_expiry_date DATE NULL COMMENT 'تاریخ انقضای گارانتی'
AFTER warranty_months;
```

### اضافه کردن Index
```sql
CREATE INDEX idx_parts_warranty ON parts (warranty_expiry_date);
```

### تغییر نوع ستون
```sql
ALTER TABLE parts 
MODIFY COLUMN description LONGTEXT NULL COMMENT 'توضیحات';
```

---

## 📈 بهینه‌سازی Performance

### 1. بررسی Slow Queries
```sql
-- فعال کردن slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
```

### 2. Analyze Tables
```sql
ANALYZE TABLE parts;
ANALYZE TABLE elevators;
ANALYZE TABLE part_transfers;
```

### 3. Optimize Tables
```sql
OPTIMIZE TABLE parts;
OPTIMIZE TABLE elevators;
```

### 4. بررسی Indexes
```sql
SHOW INDEX FROM parts;
EXPLAIN SELECT * FROM parts WHERE status = 'available';
```

---

## 🧹 نگهداری و Clean Up

### پاکسازی داده‌های قدیمی

```sql
-- حذف OTP های منقضی شده (بیش از 7 روز)
DELETE FROM otps WHERE expires_at < DATE_SUB(NOW(), INTERVAL 7 DAY);

-- حذف کپچاهای قدیمی (بیش از 1 روز)
DELETE FROM captchas WHERE expires_at < DATE_SUB(NOW(), INTERVAL 1 DAY);

-- حذف لاگ‌های قدیمی (بیش از 6 ماه)
DELETE FROM system_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 6 MONTH);
```

**نکته:** این کارها به صورت خودکار توسط Event Scheduler انجام می‌شوند.

### بررسی Event Scheduler

```sql
SHOW EVENTS;

-- فعال کردن Event Scheduler
SET GLOBAL event_scheduler = ON;
```

---

## 📊 Monitoring

### بررسی حجم جداول
```sql
SELECT 
  TABLE_NAME,
  ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) AS 'Size (MB)',
  TABLE_ROWS
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'elevator_tracking'
ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC;
```

### بررسی Connections
```sql
SHOW PROCESSLIST;
SHOW STATUS LIKE 'Threads_connected';
```

---

## 🐛 Troubleshooting

### مشکل رمزنگاری (Character Set)
```sql
ALTER DATABASE elevator_tracking 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_persian_ci;

-- برای تک تک جداول
ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci;
```

### مشکل Foreign Key
```sql
-- غیرفعال کردن موقت
SET FOREIGN_KEY_CHECKS = 0;

-- انجام عملیات

-- فعال کردن دوباره
SET FOREIGN_KEY_CHECKS = 1;
```

### مشکل Lock
```sql
-- بررسی Lock ها
SHOW OPEN TABLES WHERE In_use > 0;

-- Kill کردن Process
KILL process_id;
```

---

## 📚 منابع

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [MySQL Performance Blog](https://www.percona.com/blog/)
- [DB Design Best Practices](https://www.sqlshack.com/database-design-best-practices/)

---

## 🔐 Security Checklist

- [ ] کاربر root غیرفعال شود
- [ ] کاربرهای اختصاصی با دسترسی محدود
- [ ] پسوردهای قوی (حداقل 16 کاراکتر)
- [ ] Firewall برای محدود کردن دسترسی
- [ ] SSL/TLS برای اتصالات
- [ ] Backup منظم (روزانه/هفتگی)
- [ ] Log ها را بررسی کنید
- [ ] SQL Injection prevention در کد
- [ ] Prepared Statements استفاده شود

---

**نسخه:** 1.0.0  
**آخرین به‌روزرسانی:** اکتبر 2024