-- ============================================
-- Seed Data - داده‌های اولیه برای تست
-- ============================================

SET NAMES utf8mb4;

-- ============================================
-- 1. داده‌های استان و شهر
-- ============================================

-- استان‌های ایران
INSERT INTO `provinces` (`name`, `slug`, `code`, `is_active`) VALUES
('آذربایجان شرقی', 'east-azerbaijan', '03', TRUE),
('آذربایجان غربی', 'west-azerbaijan', '04', TRUE),
('اردبیل', 'ardabil', '05', TRUE),
('اصفهان', 'isfahan', '06', TRUE),
('ایلام', 'ilam', '07', TRUE),
('بوشهر', 'bushehr', '08', TRUE),
('چهارمحال و بختیاری', 'chaharmahal-bakhtiari', '09', TRUE),
('خراسان جنوبی', 'south-khorasan', '10', TRUE),
('خراسان رضوی', 'razavi-khorasan', '11', TRUE),
('خراسان شمالی', 'north-khorasan', '12', TRUE),
('خوزستان', 'khuzestan', '13', TRUE),
('زنجان', 'zanjan', '14', TRUE),
('سمنان', 'semnan', '15', TRUE),
('سیستان و بلوچستان', 'sistan-baluchestan', '16', TRUE),
('فارس', 'fars', '17', TRUE),
('قزوین', 'qazvin', '18', TRUE),
('قم', 'qom', '19', TRUE),
('کردستان', 'kurdistan', '20', TRUE),
('کرمان', 'kerman', '21', TRUE),
('کرمانشاه', 'kermanshah', '22', TRUE),
('کهگیلویه و بویراحمد', 'kohgiluyeh-boyer-ahmad', '23', TRUE),
('گلستان', 'golestan', '24', TRUE),
('گیلان', 'gilan', '25', TRUE),
('لرستان', 'lorestan', '26', TRUE),
('مازندران', 'mazandaran', '27', TRUE),
('مرکزی', 'markazi', '28', TRUE),
('هرمزگان', 'hormozgan', '29', TRUE),
('همدان', 'hamadan', '30', TRUE),
('یزد', 'yazd', '31', TRUE);

-- شهرهای مهم تهران
INSERT INTO `cities` (`province_id`, `name`, `slug`, `code`) VALUES
(1, 'شمیرانات', 'shemiranat', '0103'),
(1, 'شهریار', 'shahriar', '0104'),
(1, 'ورامین', 'varamin', '0105'),
(1, 'پاکدشت', 'pakdasht', '0106'),
(1, 'اسلامشهر', 'islamshahr', '0107'),
(1, 'رباط کریم', 'robat-karim', '0108'),
(1, 'دماوند', 'damavand', '0109'),
(1, 'فیروزکوه', 'firuzkuh', '0110'),
(1, 'ملارد', 'malard', '0111'),
(1, 'پردیس', 'pardis', '0112');

-- شهرهای البرز
INSERT INTO `cities` (`province_id`, `name`, `slug`, `code`) VALUES
(2, 'نظرآباد', 'nazarabad', '0202'),
(2, 'اشتهارد', 'eshtehard', '0203'),
(2, 'طالقان', 'taleqan', '0204'),
(2, 'هشتگرد', 'hashtgerd', '0205'),
(2, 'ساوجبلاغ', 'savojbolagh', '0206'),
(2, 'فردیس', 'fardis', '0207'),
(2, 'محمدشهر', 'mohammad-shahr', '0208');

-- شهرهای اصفهان
INSERT INTO `cities` (`province_id`, `name`, `slug`, `code`) VALUES
(6, 'اصفهان', 'isfahan-city', '0601'),
(6, 'کاشان', 'kashan', '0602'),
(6, 'نجف‌آباد', 'najafabad', '0603'),
(6, 'خمینی‌شهر', 'khomeyni-shahr', '0604'),
(6, 'شاهین‌شهر', 'shahin-shahr', '0605'),
(6, 'نطنز', 'natanz', '0606'),
(6, 'گلپایگان', 'golpayegan', '0607'),
(6, 'فلاورجان', 'falavarjan', '0608');

-- شهرهای خراسان رضوی
INSERT INTO `cities` (`province_id`, `name`, `slug`, `code`) VALUES
(11, 'مشهد', 'mashhad', '1101'),
(11, 'نیشابور', 'neyshabur', '1102'),
(11, 'سبزوار', 'sabzevar', '1103'),
(11, 'تربت‌حیدریه', 'torbat-heydariyeh', '1104'),
(11, 'قوچان', 'quchan', '1105'),
(11, 'کاشمر', 'kashmar', '1106'),
(11, 'گناباد', 'gonabad', '1107');

-- شهرهای فارس
INSERT INTO `cities` (`province_id`, `name`, `slug`, `code`) VALUES
(17, 'شیراز', 'shiraz', '1701'),
(17, 'مرودشت', 'marvdasht', '1702'),
(17, 'جهرم', 'jahrom', '1703'),
(17, 'لار', 'lar', '1704'),
(17, 'فسا', 'fasa', '1705'),
(17, 'کازرون', 'kazerun', '1706'),
(17, 'آباده', 'abadeh', '1707');

-- ============================================
-- 2. کاربران تستی
-- ============================================

-- کاربر ادمین
INSERT INTO `users` (`mobile`, `email`, `name`, `national_id`, `role`, `status`, `mobile_verified_at`) VALUES
('09121111111', 'admin@elevatorid.ir', 'مدیر سیستم', '0012345678', 'admin', 'active', NOW());

-- کاربر تولیدکننده
INSERT INTO `users` (`mobile`, `email`, `name`, `national_id`, `role`, `status`, `mobile_verified_at`) VALUES
('09122222222', 'producer@elevatorid.ir', 'شرکت تولیدی آسانسور سپهر', '0023456789', 'user', 'active', NOW());

-- کاربر نصاب
INSERT INTO `users` (`mobile`, `email`, `name`, `national_id`, `role`, `status`, `mobile_verified_at`) VALUES
('09123333333', 'installer@elevatorid.ir', 'شرکت نصب و راه‌اندازی پارس', '0034567890', 'user', 'active', NOW());

-- کاربر نگهدارنده
INSERT INTO `users` (`mobile`, `email`, `name`, `national_id`, `role`, `status`, `mobile_verified_at`) VALUES
('09124444444', 'maintenance@elevatorid.ir', 'شرکت خدمات فنی آریا', '0045678901', 'user', 'active', NOW());

-- کاربر عادی
INSERT INTO `users` (`mobile`, `email`, `name`, `national_id`, `role`, `status`, `mobile_verified_at`) VALUES
('09125555555', 'user@elevatorid.ir', 'علی احمدی', '0056789012', 'user', 'active', NOW());

-- ============================================
-- 3. پروفایل‌های کاربران
-- ============================================

-- پروفایل تولیدکننده
INSERT INTO `user_profiles` (`user_id`, `profile_type`, `company_name`, `trade_id`, `province_id`, `city_id`, `address`, `postal_code`, `phone`, `ceo_name`, `ceo_phone`) VALUES
(2, 'producer', 'شرکت تولیدی آسانسور سپهر', '123456', 1, 1, 'تهران، خیابان ولیعصر، پلاک 123', '1234567890', '02112345678', 'محمد رضایی', '09121234567');

-- پروفایل نصاب
INSERT INTO `user_profiles` (`user_id`, `profile_type`, `company_name`, `trade_id`, `province_id`, `city_id`, `address`, `postal_code`, `phone`, `ceo_name`, `ceo_phone`) VALUES
(3, 'installer', 'شرکت نصب و راه‌اندازی پارس', '234567', 1, 1, 'تهران، خیابان انقلاب، پلاک 456', '9876543210', '02187654321', 'حسین کریمی', '09127654321');

-- پروفایل نگهدارنده
INSERT INTO `user_profiles` (`user_id`, `profile_type`, `company_name`, `trade_id`, `province_id`, `city_id`, `address`, `postal_code`, `phone`, `ceo_name`, `ceo_phone`) VALUES
(4, 'maintenance', 'شرکت خدمات فنی آریا', '345678', 1, 1, 'تهران، خیابان آزادی، پلاک 789', '5555555555', '02155555555', 'رضا محمدی', '09125555555');

-- ============================================
-- 4. انواع آسانسور (بیشتر)
-- ============================================

INSERT INTO `elevator_types` (`name`, `slug`, `description`) VALUES
('آسانسور پانوراما', 'panoramic', 'آسانسور با دیوار شیشه‌ای'),
('بالابر هیدرولیک', 'hydraulic', 'بالابر با سیستم هیدرولیک'),
('آسانسور صنعتی', 'industrial', 'آسانسور مخصوص کارخانجات'),
('آسانسور اتومبیل‌بر', 'car-lift', 'آسانسور حمل خودرو');

-- ============================================
-- 5. دسته‌بندی قطعات
-- ============================================

-- دسته‌های اصلی
INSERT INTO `parts_categories` (`elevator_type_id`, `parent_id`, `name`, `slug`, `description`, `depth`, `path`) VALUES
(1, NULL, 'موتور و گیربکس', 'motor-gearbox', 'قطعات مربوط به موتور', 0, '/1'),
(1, NULL, 'کابین', 'cabin', 'قطعات کابین آسانسور', 0, '/2'),
(1, NULL, 'سیستم کنترل', 'control-system', 'برد و کنترلر', 0, '/3'),
(1, NULL, 'درب و چارچوب', 'door-frame', 'درب کابین و طبقات', 0, '/4'),
(1, NULL, 'کابل و سیم', 'cable-wire', 'کابل‌های متحرک و ثابت', 0, '/5'),
(1, NULL, 'ریل و سنجاق', 'rail-guide', 'ریل راهنما و اتصالات', 0, '/6'),
(1, NULL, 'ایمنی', 'safety', 'قطعات ایمنی', 0, '/7');

-- زیر دسته‌های موتور
INSERT INTO `parts_categories` (`elevator_type_id`, `parent_id`, `name`, `slug`, `depth`, `path`) VALUES
(1, 1, 'موتور الکتریکی', 'electric-motor', 1, '/1/8'),
(1, 1, 'گیربکس', 'gearbox', 1, '/1/9'),
(1, 1, 'ترمز', 'brake', 1, '/1/10'),
(1, 1, 'کوپلینگ', 'coupling', 1, '/1/11');

-- زیر دسته‌های کابین
INSERT INTO `parts_categories` (`elevator_type_id`, `parent_id`, `name`, `slug`, `depth`, `path`) VALUES
(1, 2, 'درب کابین', 'cabin-door', 1, '/2/12'),
(1, 2, 'کف کابین', 'cabin-floor', 1, '/2/13'),
(1, 2, 'سقف کابین', 'cabin-ceiling', 1, '/2/14'),
(1, 2, 'دیوار کابین', 'cabin-wall', 1, '/2/15');

-- ============================================
-- 6. ویژگی‌های فنی
-- ============================================

-- ویژگی‌های موتور
INSERT INTO `technical_specs` (`category_id`, `name`, `slug`, `type`, `unit`, `is_required`, `display_order`) VALUES
(8, 'قدرت', 'power', 'number', 'کیلووات', TRUE, 1),
(8, 'ولتاژ', 'voltage', 'select', 'ولت', TRUE, 2),
(8, 'دور موتور', 'rpm', 'number', 'دور در دقیقه', TRUE, 3),
(8, 'برند', 'brand', 'text', NULL, FALSE, 4);

-- گزینه‌های ولتاژ
UPDATE `technical_specs` 
SET `options` = JSON_ARRAY('220', '380', '440') 
WHERE `slug` = 'voltage';

-- ویژگی‌های کابل
INSERT INTO `technical_specs` (`category_id`, `name`, `slug`, `type`, `unit`, `is_required`, `display_order`) VALUES
(5, 'قطر', 'diameter', 'number', 'میلی‌متر', TRUE, 1),
(5, 'طول', 'length', 'number', 'متر', TRUE, 2),
(5, 'تعداد رشته', 'strand_count', 'number', 'عدد', TRUE, 3),
(5, 'نوع عایق', 'insulation_type', 'select', NULL, FALSE, 4);

UPDATE `technical_specs` 
SET `options` = JSON_ARRAY('PVC', 'Silicon', 'Rubber') 
WHERE `slug` = 'insulation_type';

-- ============================================
-- 7. قطعات نمونه
-- ============================================

-- قطعه 1: موتور
INSERT INTO `parts` (
  `uid`, `category_id`, `name`, `description`, `manufacturer`, `model`, 
  `serial_number`, `manufacture_date`, `warranty_months`, `status`, 
  `current_owner_id`, `current_owner_type`, 
  `technical_data`
) VALUES (
  'PART-2024-001', 8, 'موتور آسانسور 5.5 کیلووات', 
  'موتور الکتریکی سه فاز با قدرت 5.5 کیلووات', 
  'Siemens', 'SM-5.5KW', 'SN-2024-001', '2024-01-15', 24,
  'available', 2, 'producer',
  JSON_OBJECT('power', '5.5', 'voltage', '380', 'rpm', '1420', 'brand', 'Siemens')
);

-- قطعه 2: کابل
INSERT INTO `parts` (
  `uid`, `category_id`, `name`, `description`, `manufacturer`, `model`,
  `serial_number`, `manufacture_date`, `warranty_months`, `status`,
  `current_owner_id`, `current_owner_type`,
  `technical_data`
) VALUES (
  'PART-2024-002', 5, 'کابل متحرک 12 رشته', 
  'کابل متحرک مخصوص آسانسور', 
  'پارس کابل', 'PC-12S', 'SN-2024-002', '2024-02-20', 18,
  'available', 2, 'producer',
  JSON_OBJECT('diameter', '8', 'length', '50', 'strand_count', '12', 'insulation_type', 'PVC')
);

-- قطعه 3: درب کابین
INSERT INTO `parts` (
  `uid`, `category_id`, `name`, `manufacturer`, `model`,
  `serial_number`, `manufacture_date`, `warranty_months`, `status`,
  `current_owner_id`, `current_owner_type`
) VALUES (
  'PART-2024-003', 12, 'درب اتوماتیک کابین', 
  'Fermator', 'FM-AUTO-2024', 'SN-2024-003', '2024-03-10', 36,
  'sold', 3, 'installer'
);

-- ============================================
-- 8. آسانسورهای نمونه
-- ============================================

-- آسانسور 1
INSERT INTO `elevators` (
  `uid`, `elevator_type_id`, `owner_id`, `installer_id`, `maintenance_id`,
  `building_name`, `province_id`, `city_id`, `address`, `postal_code`,
  `floors_count`, `stops_count`, `capacity`, `speed`,
  `installation_date`, `certification_number`, `certification_status`,
  `last_maintenance_date`, `next_maintenance_date`, `status`
) VALUES (
  'ELE-2024-001', 1, 5, 3, 4,
  'برج میلاد', 1, 1, 'تهران، خیابان ولیعصر، برج میلاد', '1234567890',
  10, 11, 630, 1.00,
  '2024-01-15', 'CERT-2024-001', 'valid',
  '2024-09-15', '2025-03-15', 'active'
);

-- آسانسور 2
INSERT INTO `elevators` (
  `uid`, `elevator_type_id`, `owner_id`, `installer_id`,
  `building_name`, `province_id`, `city_id`, `address`,
  `floors_count`, `stops_count`, `capacity`, `speed`,
  `installation_date`, `status`
) VALUES (
  'ELE-2024-002', 1, 5, 3,
  'ساختمان تجاری پارس', 1, 1, 'تهران، خیابان انقلاب، پلاک 123',
  5, 6, 450, 1.00,
  '2024-06-20', 'active'
);

-- ============================================
-- 9. قطعات نصب شده
-- ============================================

INSERT INTO `elevator_parts` (
  `elevator_id`, `part_id`, `installed_by`, `installation_date`,
  `warranty_expiry_date`, `status`, `notes`
) VALUES (
  1, 3, 3, '2024-01-15',
  '2027-01-15', 'active', 'نصب اولیه درب کابین'
);

-- ============================================
-- 10. سوابق تعمیر
-- ============================================

INSERT INTO `maintenance_records` (
  `elevator_id`, `technician_id`, `maintenance_type`, `maintenance_date`,
  `description`, `cost`, `next_maintenance_date`, `status`
) VALUES (
  1, 4, 'routine', '2024-09-15',
  'سرویس دوره‌ای 6 ماهه شامل روغنکاری و تنظیمات',
  5000000, '2025-03-15', 'completed'
);

-- ============================================
-- 11. انتقالات
-- ============================================

INSERT INTO `part_transfers` (
  `part_id`, `from_user_id`, `to_user_id`, `transfer_type`,
  `status`, `price`, `invoice_number`, `notes`,
  `transfer_date`, `completed_at`
) VALUES (
  3, 2, 3, 'sale',
  'completed', 15000000, 'INV-2024-001', 'فروش درب به شرکت نصاب',
  '2024-01-10', '2024-01-11'
);

-- ============================================
-- 12. درخواست‌ها
-- ============================================

INSERT INTO `requests` (
  `user_id`, `request_type`, `title`, `description`,
  `priority`, `status`, `elevator_id`
) VALUES (
  5, 'maintenance', 'درخواست سرویس دوره‌ای',
  'لطفاً سرویس 6 ماهه آسانسور انجام شود',
  'medium', 'pending', 1
);

INSERT INTO `requests` (
  `user_id`, `request_type`, `title`, `description`,
  `priority`, `status`
) VALUES (
  5, 'part_order', 'سفارش موتور آسانسور',
  'نیاز به موتور 5.5 کیلووات دارم',
  'high', 'in_review'
);

-- ============================================
-- 13. شکایات
-- ============================================

INSERT INTO `complaints` (
  `user_id`, `complaint_type`, `title`, `description`,
  `severity`, `status`, `part_id`
) VALUES (
  5, 'product_quality', 'کیفیت موتور',
  'موتور خریداری شده صدای زیادی دارد',
  'medium', 'pending', 1
);

-- ============================================
-- 14. تنظیمات اضافی
-- ============================================

INSERT INTO `settings` (`category`, `key`, `value`, `type`, `description`, `is_public`) VALUES
-- SMS
('sms', 'provider', 'kavenegar', 'string', 'ارائه دهنده SMS', FALSE),
('sms', 'api_key', 'YOUR_API_KEY', 'string', 'کلید API', FALSE),
('sms', 'sender', '10004346', 'string', 'شماره ارسال کننده', FALSE),
('sms', 'otp_template', 'verify', 'string', 'الگوی OTP', FALSE),

-- Email
('email', 'driver', 'smtp', 'string', 'درایور ایمیل', FALSE),
('email', 'host', 'smtp.example.com', 'string', 'هاست SMTP', FALSE),
('email', 'port', '587', 'number', 'پورت SMTP', FALSE),
('email', 'from_email', 'noreply@elevatorid.ir', 'string', 'ایمیل فرستنده', FALSE),
('email', 'from_name', 'سامانه آسانسور', 'string', 'نام فرستنده', TRUE),

-- Payment
('payment', 'currency', 'IRT', 'string', 'واحد پول (تومان)', TRUE),
('payment', 'gateway', 'zarinpal', 'string', 'درگاه پرداخت پیش‌فرض', FALSE),

-- Notification
('notification', 'maintenance_alert_days', '7', 'number', 'تعداد روز قبل از یادآوری سرویس', TRUE),
('notification', 'warranty_alert_days', '30', 'number', 'تعداد روز قبل از اخطار گارانتی', TRUE),

-- Upload
('upload', 'max_file_size', '10', 'number', 'حداکثر حجم فایل (مگابایت)', TRUE),
('upload', 'allowed_extensions', '["jpg","jpeg","png","pdf","doc","docx"]', 'json', 'پسوندهای مجاز', FALSE);

-- ============================================
-- 15. اعلان‌های نمونه
-- ============================================

INSERT INTO `notifications` (
  `user_id`, `type`, `title`, `message`, `link`, `is_read`
) VALUES (
  5, 'maintenance_due', 'یادآوری سرویس',
  'آسانسور ELE-2024-001 نیاز به سرویس دارد',
  '/elevators/1', FALSE
);

INSERT INTO `notifications` (
  `user_id`, `type`, `title`, `message`, `is_read`
) VALUES (
  3, 'transfer_received', 'انتقال جدید',
  'یک قطعه به شما منتقل شده است',
  FALSE
);

-- ============================================
-- پایان Seed Data
-- ============================================

SELECT 
  'Seed data inserted successfully!' AS message,
  (SELECT COUNT(*) FROM users) AS users_count,
  (SELECT COUNT(*) FROM parts) AS parts_count,
  (SELECT COUNT(*) FROM elevators) AS elevators_count,
  (SELECT COUNT(*) FROM provinces) AS provinces_count,
  (SELECT COUNT(*) FROM cities) AS cities_count;
