-- ============================================
-- سامانه جامع ردیابی قطعات و شناسنامه آسانسور
-- Database Schema - Version 1.0.0
-- ============================================

-- تنظیمات اولیه دیتابیس
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET COLLATE utf8mb4_persian_ci;

-- ============================================
-- 1. جدول استان‌ها
-- ============================================
CREATE TABLE `provinces` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL COMMENT 'نام استان',
  `slug` VARCHAR(100) NOT NULL COMMENT 'اسلاگ انگلیسی',
  `code` VARCHAR(10) NULL COMMENT 'کد استان',
  `is_active` BOOLEAN DEFAULT TRUE COMMENT 'وضعیت فعال/غیرفعال',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_provinces_slug` (`slug`),
  KEY `idx_provinces_active` (`is_active`),
  KEY `idx_provinces_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci 
COMMENT='جدول استان‌های ایران';

-- ============================================
-- 2. جدول شهرها
-- ============================================
CREATE TABLE `cities` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `province_id` INT UNSIGNED NOT NULL COMMENT 'شناسه استان',
  `name` VARCHAR(100) NOT NULL COMMENT 'نام شهر',
  `slug` VARCHAR(100) NOT NULL COMMENT 'اسلاگ انگلیسی',
  `code` VARCHAR(10) NULL COMMENT 'کد شهر',
  `is_active` BOOLEAN DEFAULT TRUE COMMENT 'وضعیت فعال/غیرفعال',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_cities_slug` (`slug`),
  KEY `idx_cities_province` (`province_id`),
  KEY `idx_cities_active` (`is_active`),
  KEY `idx_cities_name` (`name`),
  CONSTRAINT `fk_cities_province` 
    FOREIGN KEY (`province_id`) 
    REFERENCES `provinces` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci 
COMMENT='جدول شهرهای ایران';

-- ============================================
-- 3. جدول کاربران
-- ============================================
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `mobile` VARCHAR(11) NOT NULL COMMENT 'شماره موبایل',
  `email` VARCHAR(255) NULL COMMENT 'ایمیل',
  `name` VARCHAR(255) NULL COMMENT 'نام کامل',
  `national_id` VARCHAR(10) NULL COMMENT 'کد ملی',
  `role` ENUM('admin', 'user', 'operator') DEFAULT 'user' COMMENT 'نقش کاربر',
  `status` ENUM('pending', 'active', 'suspended', 'banned') DEFAULT 'pending' COMMENT 'وضعیت کاربر',
  `email_verified_at` TIMESTAMP NULL,
  `mobile_verified_at` TIMESTAMP NULL,
  `last_login_at` TIMESTAMP NULL COMMENT 'آخرین ورود',
  `last_login_ip` VARCHAR(45) NULL COMMENT 'IP آخرین ورود',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_mobile` (`mobile`),
  UNIQUE KEY `uk_users_email` (`email`),
  KEY `idx_users_role` (`role`),
  KEY `idx_users_status` (`status`),
  KEY `idx_users_national_id` (`national_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci 
COMMENT='جدول کاربران سیستم';

-- ============================================
-- 4. جدول پروفایل‌های کاربران (چند پروفایله)
-- ============================================
CREATE TABLE `user_profiles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT 'شناسه کاربر',
  `profile_type` ENUM('producer', 'installer', 'maintenance', 'coop_org') NOT NULL COMMENT 'نوع پروفایل',
  `is_active` BOOLEAN DEFAULT TRUE COMMENT 'پروفایل فعال',
  `company_name` VARCHAR(255) NULL COMMENT 'نام شرکت',
  `trade_id` VARCHAR(50) NULL COMMENT 'شناسه ثبت تجاری',
  `province_id` INT UNSIGNED NULL COMMENT 'استان',
  `city_id` INT UNSIGNED NULL COMMENT 'شهر',
  `address` TEXT NULL COMMENT 'آدرس',
  `postal_code` VARCHAR(10) NULL COMMENT 'کد پستی',
  `phone` VARCHAR(11) NULL COMMENT 'تلفن ثابت',
  `ceo_name` VARCHAR(255) NULL COMMENT 'نام مدیرعامل',
  `ceo_phone` VARCHAR(11) NULL COMMENT 'تلفن مدیرعامل',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_profiles_user` (`user_id`),
  KEY `idx_profiles_type` (`profile_type`),
  KEY `idx_profiles_active` (`is_active`),
  KEY `idx_profiles_province` (`province_id`),
  KEY `idx_profiles_city` (`city_id`),
  CONSTRAINT `fk_profiles_user` 
    FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_profiles_province` 
    FOREIGN KEY (`province_id`) 
    REFERENCES `provinces` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_profiles_city` 
    FOREIGN KEY (`city_id`) 
    REFERENCES `cities` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci 
COMMENT='جدول پروفایل‌های کاربران';

-- ============================================
-- 5. جدول OTP
-- ============================================
CREATE TABLE `otps` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `mobile` VARCHAR(11) NOT NULL COMMENT 'شماره موبایل',
  `code` VARCHAR(6) NOT NULL COMMENT 'کد OTP',
  `type` ENUM('login', 'register', 'reset_password') DEFAULT 'login' COMMENT 'نوع OTP',
  `expires_at` TIMESTAMP NOT NULL COMMENT 'زمان انقضا',
  `verified_at` TIMESTAMP NULL COMMENT 'زمان تایید',
  `ip_address` VARCHAR(45) NULL COMMENT 'IP درخواست کننده',
  `user_agent` TEXT NULL COMMENT 'User Agent',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_otps_mobile` (`mobile`),
  KEY `idx_otps_code` (`code`),
  KEY `idx_otps_expires` (`expires_at`),
  KEY `idx_otps_verified` (`verified_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci 
COMMENT='جدول کدهای OTP';

-- ============================================
-- 6. جدول کپچا
-- ============================================
CREATE TABLE `captchas` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `captcha_id` VARCHAR(100) NOT NULL COMMENT 'شناسه یکتا کپچا',
  `captcha_value` VARCHAR(10) NOT NULL COMMENT 'مقدار صحیح کپچا',
  `expires_at` TIMESTAMP NOT NULL COMMENT 'زمان انقضا',
  `verified_at` TIMESTAMP NULL COMMENT 'زمان تایید',
  `ip_address` VARCHAR(45) NULL COMMENT 'IP درخواست کننده',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_captchas_id` (`captcha_id`),
  KEY `idx_captchas_expires` (`expires_at`),
  KEY `idx_captchas_verified` (`verified_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci 
COMMENT='جدول کپچاها';

-- ============================================
-- 7. جدول توکن‌های دسترسی
-- ============================================
CREATE TABLE `access_tokens` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT 'شناسه کاربر',
  `token` VARCHAR(500) NOT NULL COMMENT 'توکن دسترسی',
  `refresh_token` VARCHAR(500) NULL COMMENT 'توکن تازه‌سازی',
  `expires_at` TIMESTAMP NOT NULL COMMENT 'زمان انقضا',
  `ip_address` VARCHAR(45) NULL COMMENT 'IP',
  `user_agent` TEXT NULL COMMENT 'User Agent',
  `revoked_at` TIMESTAMP NULL COMMENT 'زمان لغو',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tokens_token` (`token`),
  KEY `idx_tokens_user` (`user_id`),
  KEY `idx_tokens_expires` (`expires_at`),
  KEY `idx_tokens_revoked` (`revoked_at`),
  CONSTRAINT `fk_tokens_user` 
    FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci 
COMMENT='جدول توکن‌های دسترسی';

-- ============================================
-- 8. جدول انواع آسانسور
-- ============================================
CREATE TABLE `elevator_types` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL COMMENT 'نام نوع آسانسور',
  `slug` VARCHAR(100) NOT NULL COMMENT 'اسلاگ',
  `description` TEXT NULL COMMENT 'توضیحات',
  `is_active` BOOLEAN DEFAULT TRUE COMMENT 'وضعیت فعال',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_elevator_types_slug` (`slug`),
  KEY `idx_elevator_types_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci 
COMMENT='جدول انواع آسانسور';

-- ============================================
-- 9. جدول دسته‌بندی قطعات
-- ============================================
CREATE TABLE `parts_categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `elevator_type_id` INT UNSIGNED NULL COMMENT 'نوع آسانسور',
  `parent_id` INT UNSIGNED NULL COMMENT 'دسته والد',
  `name` VARCHAR(100) NOT NULL COMMENT 'نام دسته',
  `slug` VARCHAR(100) NOT NULL COMMENT 'اسلاگ',
  `description` TEXT NULL COMMENT 'توضیحات',
  `depth` TINYINT UNSIGNED DEFAULT 0 COMMENT 'عمق در درخت',
  `path` VARCHAR(500) NULL COMMENT 'مسیر درختی',
  `is_active` BOOLEAN DEFAULT TRUE COMMENT 'وضعیت فعال',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_parts_categories_slug` (`slug`),
  KEY `idx_parts_categories_parent` (`parent_id`),
  KEY `idx_parts_categories_elevator` (`elevator_type_id`),
  KEY `idx_parts_categories_active` (`is_active`),
  KEY `idx_parts_categories_path` (`path`(255)),
  CONSTRAINT `fk_parts_categories_parent` 
    FOREIGN KEY (`parent_id`) 
    REFERENCES `parts_categories` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_parts_categories_elevator` 
    FOREIGN KEY (`elevator_type_id`) 
    REFERENCES `elevator_types` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci 
COMMENT='جدول دسته‌بندی قطعات';

-- ============================================
-- 10. جدول ویژگی‌های فنی
-- ============================================
CREATE TABLE `technical_specs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` INT UNSIGNED NOT NULL COMMENT 'دسته‌بندی',
  `name` VARCHAR(100) NOT NULL COMMENT 'نام ویژگی',
  `slug` VARCHAR(100) NOT NULL COMMENT 'اسلاگ',
  `type` ENUM('text', 'number', 'select', 'boolean') DEFAULT 'text' COMMENT 'نوع فیلد',
  `unit` VARCHAR(50) NULL COMMENT 'واحد اندازه‌گیری',
  `options` JSON NULL COMMENT 'گزینه‌ها برای select',
  `is_required` BOOLEAN DEFAULT FALSE COMMENT 'الزامی',
  `is_active` BOOLEAN DEFAULT TRUE COMMENT 'فعال',
  `display_order` INT DEFAULT 0 COMMENT 'ترتیب نمایش',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_specs_slug` (`slug`),
  KEY `idx_specs_category` (`category_id`),
  KEY `idx_specs_active` (`is_active`),
  KEY `idx_specs_order` (`display_order`),
  CONSTRAINT `fk_specs_category` 
    FOREIGN KEY (`category_id`) 
    REFERENCES `parts_categories` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci 
COMMENT='جدول ویژگی‌های فنی قطعات';

-- ============================================
-- 11. جدول قطعات
-- ============================================
CREATE TABLE `parts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uid` VARCHAR(50) NOT NULL COMMENT 'شناسه یکتا قطعه',
  `category_id` INT UNSIGNED NOT NULL COMMENT 'دسته‌بندی',
  `name` VARCHAR(255) NOT NULL COMMENT 'نام قطعه',
  `description` TEXT NULL COMMENT 'توضیحات',
  `manufacturer` VARCHAR(255) NULL COMMENT 'سازنده',
  `model` VARCHAR(100) NULL COMMENT 'مدل',
  `serial_number` VARCHAR(100) NULL COMMENT 'شماره سریال',
  `manufacture_date` DATE NULL COMMENT 'تاریخ تولید',
  `warranty_months` SMALLINT UNSIGNED NULL COMMENT 'مدت گارانتی (ماه)',
  `status` ENUM('available', 'sold', 'in_transit', 'installed', 'defective') DEFAULT 'available' COMMENT 'وضعیت',
  `current_owner_id` BIGINT UNSIGNED NULL COMMENT 'مالک فعلی',
  `current_owner_type` ENUM('producer', 'installer', 'maintenance', 'coop_org', 'end_user') NULL COMMENT 'نوع مالک',
  `qr_code` VARCHAR(255) NULL COMMENT 'QR Code',
  `images` JSON NULL COMMENT 'تصاویر قطعه',
  `technical_data` JSON NULL COMMENT 'داده‌های فنی',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_parts_uid` (`uid`),
  KEY `idx_parts_category` (`category_id`),
  KEY `idx_parts_status` (`status`),
  KEY `idx_parts_owner` (`current_owner_id`),
  KEY `idx_parts_owner_type` (`current_owner_type`),
  KEY `idx_parts_serial` (`serial_number`),
  KEY `idx_parts_manufacturer` (`manufacturer`),
  CONSTRAINT `fk_parts_category` 
    FOREIGN KEY (`category_id`) 
    REFERENCES `parts_categories` (`id`) 
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_parts_owner` 
    FOREIGN KEY (`current_owner_id`) 
    REFERENCES `users` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci 
COMMENT='جدول قطعات';

-- ============================================
-- 12. جدول انتقالات قطعات
-- ============================================
CREATE TABLE `part_transfers` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `part_id` BIGINT UNSIGNED NOT NULL COMMENT 'شناسه قطعه',
  `from_user_id` BIGINT UNSIGNED NULL COMMENT 'فرستنده',
  `to_user_id` BIGINT UNSIGNED NOT NULL COMMENT 'گیرنده',
  `transfer_type` ENUM('sale', 'transfer', 'return', 'warranty') DEFAULT 'sale' COMMENT 'نوع انتقال',
  `status` ENUM('pending', 'in_transit', 'completed', 'cancelled') DEFAULT 'pending' COMMENT 'وضعیت',
  `price` DECIMAL(15,2) NULL COMMENT 'قیمت',
  `invoice_number` VARCHAR(50) NULL COMMENT 'شماره فاکتور',
  `notes` TEXT NULL COMMENT 'یادداشت‌ها',
  `transfer_date` TIMESTAMP NULL COMMENT 'تاریخ انتقال',
  `completed_at` TIMESTAMP NULL COMMENT 'تاریخ تکمیل',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_transfers_part` (`part_id`),
  KEY `idx_transfers_from` (`from_user_id`),
  KEY `idx_transfers_to` (`to_user_id`),
  KEY `idx_transfers_status` (`status`),
  KEY `idx_transfers_type` (`transfer_type`),
  KEY `idx_transfers_date` (`transfer_date`),
  CONSTRAINT `fk_transfers_part` 
    FOREIGN KEY (`part_id`) 
    REFERENCES `parts` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_transfers_from` 
    FOREIGN KEY (`from_user_id`) 
    REFERENCES `users` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_transfers_to` 
    FOREIGN KEY (`to_user_id`) 
    REFERENCES `users` (`id`) 
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci 
COMMENT='جدول انتقالات قطعات';

-- ============================================
-- 13. جدول آسانسورها
-- ============================================
CREATE TABLE `elevators` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uid` VARCHAR(50) NOT NULL COMMENT 'شناسه یکتا آسانسور',
  `elevator_type_id` INT UNSIGNED NOT NULL COMMENT 'نوع آسانسور',
  `owner_id` BIGINT UNSIGNED NOT NULL COMMENT 'مالک',
  `installer_id` BIGINT UNSIGNED NULL COMMENT 'نصاب',
  `maintenance_id` BIGINT UNSIGNED NULL COMMENT 'نگهدارنده',
  `building_name` VARCHAR(255) NULL COMMENT 'نام ساختمان',
  `province_id` INT UNSIGNED NULL COMMENT 'استان',
  `city_id` INT UNSIGNED NULL COMMENT 'شهر',
  `address` TEXT NULL COMMENT 'آدرس',
  `postal_code` VARCHAR(10) NULL COMMENT 'کد پستی',
  `floors_count` TINYINT UNSIGNED NULL COMMENT 'تعداد طبقات',
  `stops_count` TINYINT UNSIGNED NULL COMMENT 'تعداد توقف',
  `capacity` SMALLINT UNSIGNED NULL COMMENT 'ظرفیت (کیلوگرم)',
  `speed` DECIMAL(5,2) NULL COMMENT 'سرعت (متر بر ثانیه)',
  `installation_date` DATE NULL COMMENT 'تاریخ نصب',
  `certification_date` DATE NULL COMMENT 'تاریخ گواهینامه',
  `certification_number` VARCHAR(50) NULL COMMENT 'شماره گواهینامه',
  `certification_status` ENUM('valid', 'expired', 'pending') DEFAULT 'pending' COMMENT 'وضعیت گواهینامه',
  `last_maintenance_date` DATE NULL COMMENT 'آخرین سرویس',
  `next_maintenance_date` DATE NULL COMMENT 'سرویس بعدی',
  `status` ENUM('active', 'inactive', 'under_maintenance', 'out_of_order') DEFAULT 'active' COMMENT 'وضعیت',
  `qr_code` VARCHAR(255) NULL COMMENT 'QR Code',
  `images` JSON NULL COMMENT 'تصاویر',
  `specifications` JSON NULL COMMENT 'مشخصات فنی',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_elevators_uid` (`uid`),
  KEY `idx_elevators_type` (`elevator_type_id`),
  KEY `idx_elevators_owner` (`owner_id`),
  KEY `idx_elevators_installer` (`installer_id`),
  KEY `idx_elevators_maintenance` (`maintenance_id`),
  KEY `idx_elevators_province` (`province_id`),
  KEY `idx_elevators_city` (`city_id`),
  KEY `idx_elevators_status` (`status`),
  KEY `idx_elevators_cert_status` (`certification_status`),
  KEY `idx_elevators_next_maintenance` (`next_maintenance_date`),
  CONSTRAINT `fk_elevators_type` 
    FOREIGN KEY (`elevator_type_id`) 
    REFERENCES `elevator_types` (`id`) 
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_elevators_owner` 
    FOREIGN KEY (`owner_id`) 
    REFERENCES `users` (`id`) 
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_elevators_installer` 
    FOREIGN KEY (`installer_id`) 
    REFERENCES `users` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_elevators_maintenance` 
    FOREIGN KEY (`maintenance_id`) 
    REFERENCES `users` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_elevators_province` 
    FOREIGN KEY (`province_id`) 
    REFERENCES `provinces` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_elevators_city` 
    FOREIGN KEY (`city_id`) 
    REFERENCES `cities` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci 
COMMENT='جدول آسانسورها';

-- ============================================
-- 14. جدول قطعات نصب شده در آسانسور
-- ============================================
CREATE TABLE `elevator_parts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `elevator_id` BIGINT UNSIGNED NOT NULL COMMENT 'شناسه آسانسور',
  `part_id` BIGINT UNSIGNED NOT NULL COMMENT 'شناسه قطعه',
  `installed_by` BIGINT UNSIGNED NULL COMMENT 'نصب کننده',
  `installation_date` DATE NOT NULL COMMENT 'تاریخ نصب',
  `warranty_expiry_date` DATE NULL COMMENT 'انقضای گارانتی',
  `status` ENUM('active', 'replaced', 'removed', 'defective') DEFAULT 'active' COMMENT 'وضعیت',
  `notes` TEXT NULL COMMENT 'یادداشت‌ها',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_elevator_parts_elevator` (`elevator_id`),
  KEY `idx_elevator_parts_part` (`part_id`),
  KEY `idx_elevator_parts_installer` (`installed_by`),
  KEY `idx_elevator_parts_status` (`status`),
  KEY `idx_elevator_parts_date` (`installation_date`),
  CONSTRAINT `fk_elevator_parts_elevator` 
    FOREIGN KEY (`elevator_id`) 
    REFERENCES `elevators` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_elevator_parts_part` 
    FOREIGN KEY (`part_id`) 
    REFERENCES `parts` (`id`) 
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_elevator_parts_installer` 
    FOREIGN KEY (`installed_by`) 
    REFERENCES `users` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci 
COMMENT='جدول قطعات نصب شده در آسانسورها';

-- ============================================
-- 15. جدول سوابق تعمیر و نگهداری
-- ============================================
CREATE TABLE `maintenance_records` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `elevator_id` BIGINT UNSIGNED NOT NULL COMMENT 'شناسه آسانسور',
  `technician_id` BIGINT UNSIGNED NULL COMMENT 'تکنسین',
  `maintenance_type` ENUM('routine', 'repair', 'emergency', 'inspection') DEFAULT 'routine' COMMENT 'نوع سرویس',
  `maintenance_date` DATE NOT NULL COMMENT 'تاریخ سرویس',
  `description` TEXT NULL COMMENT 'شرح کار',
  `parts_replaced` JSON NULL COMMENT 'قطعات تعویض شده',
  `cost` DECIMAL(15,2) NULL COMMENT 'هزینه',
  `next_maintenance_date` DATE NULL COMMENT 'سرویس بعدی',
  `status` ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled' COMMENT 'وضعیت',
  `notes` TEXT NULL COMMENT 'یادداشت‌ها',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_maintenance_elevator` (`elevator_id`),
  KEY `idx_maintenance_technician` (`technician_id`),
  KEY `idx_maintenance_type` (`maintenance_type`),
  KEY `idx_maintenance_date` (`maintenance_date`),
  KEY `idx_maintenance_status` (`status`),
  CONSTRAINT `fk_maintenance_elevator` 
    FOREIGN KEY (`elevator_id`) 
    REFERENCES `elevators` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_maintenance_technician` 
    FOREIGN KEY (`technician_id`) 
    REFERENCES `users` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci 
COMMENT='جدول سوابق تعمیر و نگهداری';

-- ============================================
-- 16. جدول درخواست‌ها
-- ============================================
CREATE TABLE `requests` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT 'کاربر درخواست دهنده',
  `request_type` ENUM('part_order', 'installation', 'maintenance', 'certification', 'other') NOT NULL COMMENT 'نوع درخواست',
  `title` VARCHAR(255) NOT NULL COMMENT 'عنوان',
  `description` TEXT NOT NULL COMMENT 'شرح درخواست',
  `priority` ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium' COMMENT 'اولویت',
  `status` ENUM('pending', 'in_review', 'approved', 'rejected', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending' COMMENT 'وضعیت',
  `assigned_to` BIGINT UNSIGNED NULL COMMENT 'محول شده به',
  `elevator_id` BIGINT UNSIGNED NULL COMMENT 'آسانسور مرتبط',
  `part_id` BIGINT UNSIGNED NULL COMMENT 'قطعه مرتبط',
  `attachments` JSON NULL COMMENT 'فایل‌های پیوست',
  `admin_notes` TEXT NULL COMMENT 'یادداشت ادمین',
  `user_notes` TEXT NULL COMMENT 'یادداشت کاربر',
  `reviewed_at` TIMESTAMP NULL COMMENT 'زمان بررسی',
  `reviewed_by` BIGINT UNSIGNED NULL COMMENT 'بررسی کننده',
  `completed_at` TIMESTAMP NULL COMMENT 'زمان تکمیل',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_requests_user` (`user_id`),
  KEY `idx_requests_type` (`request_type`),
  KEY `idx_requests_status` (`status`),
  KEY `idx_requests_priority` (`priority`),
  KEY `idx_requests_assigned` (`assigned_to`),
  KEY `idx_requests_elevator` (`elevator_id`),
  KEY `idx_requests_part` (`part_id`),
  KEY `idx_requests_reviewed_by` (`reviewed_by`),
  CONSTRAINT `fk_requests_user` 
    FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_requests_assigned` 
    FOREIGN KEY (`assigned_to`) 
    REFERENCES `users` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_requests_elevator` 
    FOREIGN KEY (`elevator_id`) 
    REFERENCES `elevators` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_requests_part` 
    FOREIGN KEY (`part_id`) 
    REFERENCES `parts` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_requests_reviewed_by` 
    FOREIGN KEY (`reviewed_by`) 
    REFERENCES `users` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci 
COMMENT='جدول درخواست‌ها';

-- ============================================
-- 17. جدول شکایات
-- ============================================
CREATE TABLE `complaints` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT 'کاربر شکایت کننده',
  `complaint_type` ENUM('product_quality', 'service', 'delivery', 'installation', 'other') NOT NULL COMMENT 'نوع شکایت',
  `title` VARCHAR(255) NOT NULL COMMENT 'عنوان',
  `description` TEXT NOT NULL COMMENT 'شرح شکایت',
  `severity` ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium' COMMENT 'شدت',
  `status` ENUM('pending', 'in_review', 'investigating', 'resolved', 'rejected', 'closed') DEFAULT 'pending' COMMENT 'وضعیت',
  `elevator_id` BIGINT UNSIGNED NULL COMMENT 'آسانسور مرتبط',
  `part_id` BIGINT UNSIGNED NULL COMMENT 'قطعه مرتبط',
  `transfer_id` BIGINT UNSIGNED NULL COMMENT 'انتقال مرتبط',
  `attachments` JSON NULL COMMENT 'فایل‌های پیوست',
  `admin_response` TEXT NULL COMMENT 'پاسخ ادمین',
  `resolution` TEXT NULL COMMENT 'نحوه حل',
  `assigned_to` BIGINT UNSIGNED NULL COMMENT 'محول شده به',
  `resolved_at` TIMESTAMP NULL COMMENT 'زمان حل',
  `resolved_by` BIGINT UNSIGNED NULL COMMENT 'حل کننده',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_complaints_user` (`user_id`),
  KEY `idx_complaints_type` (`complaint_type`),
  KEY `idx_complaints_status` (`status`),
  KEY `idx_complaints_severity` (`severity`),
  KEY `idx_complaints_elevator` (`elevator_id`),
  KEY `idx_complaints_part` (`part_id`),
  KEY `idx_complaints_transfer` (`transfer_id`),
  KEY `idx_complaints_assigned` (`assigned_to`),
  KEY `idx_complaints_resolved_by` (`resolved_by`),
  CONSTRAINT `fk_complaints_user` 
    FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_complaints_elevator` 
    FOREIGN KEY (`elevator_id`) 
    REFERENCES `elevators` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_complaints_part` 
    FOREIGN KEY (`part_id`) 
    REFERENCES `parts` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_complaints_transfer` 
    FOREIGN KEY (`transfer_id`) 
    REFERENCES `part_transfers` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_complaints_assigned` 
    FOREIGN KEY (`assigned_to`) 
    REFERENCES `users` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_complaints_resolved_by` 
    FOREIGN KEY (`resolved_by`) 
    REFERENCES `users` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci 
COMMENT='جدول شکایات';

-- ============================================
-- 18. جدول تنظیمات سیستم
-- ============================================
CREATE TABLE `settings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category` VARCHAR(50) NOT NULL COMMENT 'دسته تنظیمات',
  `key` VARCHAR(100) NOT NULL COMMENT 'کلید',
  `value` TEXT NULL COMMENT 'مقدار',
  `type` ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string' COMMENT 'نوع داده',
  `description` TEXT NULL COMMENT 'توضیحات',
  `is_public` BOOLEAN DEFAULT FALSE COMMENT 'عمومی',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_settings_key` (`category`, `key`),
  KEY `idx_settings_category` (`category`),
  KEY `idx_settings_public` (`is_public`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci 
COMMENT='جدول تنظیمات سیستم';

-- ============================================
-- 19. جدول لاگ‌های سیستم
-- ============================================
CREATE TABLE `system_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NULL COMMENT 'کاربر',
  `action` VARCHAR(100) NOT NULL COMMENT 'عملیات',
  `entity_type` VARCHAR(50) NULL COMMENT 'نوع موجودیت',
  `entity_id` BIGINT UNSIGNED NULL COMMENT 'شناسه موجودیت',
  `description` TEXT NULL COMMENT 'شرح',
  `old_data` JSON NULL COMMENT 'داده قبلی',
  `new_data` JSON NULL COMMENT 'داده جدید',
  `ip_address` VARCHAR(45) NULL COMMENT 'IP',
  `user_agent` TEXT NULL COMMENT 'User Agent',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_logs_user` (`user_id`),
  KEY `idx_logs_action` (`action`),
  KEY `idx_logs_entity` (`entity_type`, `entity_id`),
  KEY `idx_logs_created` (`created_at`),
  CONSTRAINT `fk_logs_user` 
    FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci 
COMMENT='جدول لاگ‌های سیستم';

-- ============================================
-- 20. جدول اعلان‌ها
-- ============================================
CREATE TABLE `notifications` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT 'کاربر',
  `type` VARCHAR(50) NOT NULL COMMENT 'نوع اعلان',
  `title` VARCHAR(255) NOT NULL COMMENT 'عنوان',
  `message` TEXT NOT NULL COMMENT 'پیام',
  `data` JSON NULL COMMENT 'داده‌های اضافی',
  `link` VARCHAR(500) NULL COMMENT 'لینک',
  `is_read` BOOLEAN DEFAULT FALSE COMMENT 'خوانده شده',
  `read_at` TIMESTAMP NULL COMMENT 'زمان خواندن',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notifications_user` (`user_id`),
  KEY `idx_notifications_type` (`type`),
  KEY `idx_notifications_read` (`is_read`),
  KEY `idx_notifications_created` (`created_at`),
  CONSTRAINT `fk_notifications_user` 
    FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci 
COMMENT='جدول اعلان‌ها';

-- ============================================
-- 21. جدول فایل‌ها
-- ============================================
CREATE TABLE `files` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NULL COMMENT 'کاربر آپلودکننده',
  `entity_type` VARCHAR(50) NULL COMMENT 'نوع موجودیت',
  `entity_id` BIGINT UNSIGNED NULL COMMENT 'شناسه موجودیت',
  `file_name` VARCHAR(255) NOT NULL COMMENT 'نام فایل',
  `file_path` VARCHAR(500) NOT NULL COMMENT 'مسیر فایل',
  `file_size` BIGINT UNSIGNED NOT NULL COMMENT 'حجم (بایت)',
  `mime_type` VARCHAR(100) NOT NULL COMMENT 'نوع فایل',
  `file_type` ENUM('image', 'document', 'pdf', 'other') DEFAULT 'other' COMMENT 'دسته فایل',
  `is_public` BOOLEAN DEFAULT FALSE COMMENT 'عمومی',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_files_user` (`user_id`),
  KEY `idx_files_entity` (`entity_type`, `entity_id`),
  KEY `idx_files_type` (`file_type`),
  KEY `idx_files_public` (`is_public`),
  CONSTRAINT `fk_files_user` 
    FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci 
COMMENT='جدول فایل‌ها';

-- ============================================
-- 22. جدول انواع پرداخت
-- ============================================
CREATE TABLE `payment_types` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL COMMENT 'نام نوع پرداخت',
  `slug` VARCHAR(100) NOT NULL COMMENT 'اسلاگ',
  `description` TEXT NULL COMMENT 'توضیحات',
  `is_active` BOOLEAN DEFAULT TRUE COMMENT 'فعال',
  `config` JSON NULL COMMENT 'تنظیمات',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_payment_types_slug` (`slug`),
  KEY `idx_payment_types_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci 
COMMENT='جدول انواع پرداخت';

-- ============================================
-- 23. جدول تراکنش‌های مالی
-- ============================================
CREATE TABLE `transactions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT 'کاربر',
  `payment_type_id` INT UNSIGNED NULL COMMENT 'نوع پرداخت',
  `entity_type` VARCHAR(50) NULL COMMENT 'نوع موجودیت',
  `entity_id` BIGINT UNSIGNED NULL COMMENT 'شناسه موجودیت',
  `amount` DECIMAL(15,2) NOT NULL COMMENT 'مبلغ',
  `transaction_type` ENUM('payment', 'refund', 'charge') DEFAULT 'payment' COMMENT 'نوع تراکنش',
  `status` ENUM('pending', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending' COMMENT 'وضعیت',
  `reference_number` VARCHAR(100) NULL COMMENT 'شماره پیگیری',
  `tracking_code` VARCHAR(100) NULL COMMENT 'کد رهگیری',
  `description` TEXT NULL COMMENT 'شرح',
  `gateway_response` JSON NULL COMMENT 'پاسخ درگاه',
  `paid_at` TIMESTAMP NULL COMMENT 'زمان پرداخت',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_transactions_user` (`user_id`),
  KEY `idx_transactions_payment_type` (`payment_type_id`),
  KEY `idx_transactions_entity` (`entity_type`, `entity_id`),
  KEY `idx_transactions_status` (`status`),
  KEY `idx_transactions_reference` (`reference_number`),
  KEY `idx_transactions_tracking` (`tracking_code`),
  CONSTRAINT `fk_transactions_user` 
    FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`id`) 
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_transactions_payment_type` 
    FOREIGN KEY (`payment_type_id`) 
    REFERENCES `payment_types` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci 
COMMENT='جدول تراکنش‌های مالی';

-- ============================================
-- 24. جدول تنظیمات سیستم
-- ============================================
CREATE TABLE `system_settings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `setting_key` VARCHAR(100) NOT NULL COMMENT 'کلید تنظیم',
  `setting_value` TEXT NULL COMMENT 'مقدار تنظیم',
  `setting_type` ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string' COMMENT 'نوع تنظیم',
  `category` VARCHAR(50) NULL COMMENT 'دسته‌بندی',
  `description` VARCHAR(255) NULL COMMENT 'توضیحات',
  `is_public` BOOLEAN DEFAULT FALSE COMMENT 'قابل دسترسی عمومی',
  `is_locked` BOOLEAN DEFAULT FALSE COMMENT 'قفل شده (غیرقابل تغییر)',
  `created_by` BIGINT UNSIGNED NULL COMMENT 'ایجاد کننده',
  `updated_by` BIGINT UNSIGNED NULL COMMENT 'آخرین ویرایشگر',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_system_settings_key` (`setting_key`),
  KEY `idx_system_settings_category` (`category`),
  KEY `idx_system_settings_locked` (`is_locked`),
  CONSTRAINT `fk_system_settings_created_by` 
    FOREIGN KEY (`created_by`) 
    REFERENCES `users` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_system_settings_updated_by` 
    FOREIGN KEY (`updated_by`) 
    REFERENCES `users` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci 
COMMENT='جدول تنظیمات سیستم';

-- ============================================
-- Indexes برای بهبود Performance
-- ============================================

-- Full-text search indexes
ALTER TABLE `parts` ADD FULLTEXT INDEX `ft_parts_search` (`name`, `description`, `manufacturer`, `model`);
ALTER TABLE `elevators` ADD FULLTEXT INDEX `ft_elevators_search` (`building_name`, `address`);
ALTER TABLE `requests` ADD FULLTEXT INDEX `ft_requests_search` (`title`, `description`);
ALTER TABLE `complaints` ADD FULLTEXT INDEX `ft_complaints_search` (`title`, `description`);

-- ============================================
-- Views برای گزارش‌گیری
-- ============================================

-- View: آمار کلی قطعات
CREATE OR REPLACE VIEW `v_parts_stats` AS
SELECT 
  pc.name AS category_name,
  COUNT(p.id) AS total_parts,
  SUM(CASE WHEN p.status = 'available' THEN 1 ELSE 0 END) AS available_parts,
  SUM(CASE WHEN p.status = 'sold' THEN 1 ELSE 0 END) AS sold_parts,
  SUM(CASE WHEN p.status = 'installed' THEN 1 ELSE 0 END) AS installed_parts
FROM parts p
INNER JOIN parts_categories pc ON p.category_id = pc.id
GROUP BY pc.id, pc.name;

-- View: آمار آسانسورها
CREATE OR REPLACE VIEW `v_elevators_stats` AS
SELECT 
  et.name AS elevator_type,
  pr.name AS province,
  COUNT(e.id) AS total_elevators,
  SUM(CASE WHEN e.status = 'active' THEN 1 ELSE 0 END) AS active_elevators,
  SUM(CASE WHEN e.certification_status = 'valid' THEN 1 ELSE 0 END) AS certified_elevators,
  SUM(CASE WHEN e.next_maintenance_date < CURDATE() THEN 1 ELSE 0 END) AS overdue_maintenance
FROM elevators e
INNER JOIN elevator_types et ON e.elevator_type_id = et.id
LEFT JOIN provinces pr ON e.province_id = pr.id
GROUP BY et.id, et.name, pr.id, pr.name;

-- View: آمار درخواست‌ها
CREATE OR REPLACE VIEW `v_requests_stats` AS
SELECT 
  request_type,
  status,
  priority,
  COUNT(*) AS count,
  AVG(TIMESTAMPDIFF(HOUR, created_at, COALESCE(completed_at, NOW()))) AS avg_completion_hours
FROM requests
GROUP BY request_type, status, priority;

-- ============================================
-- Stored Procedures
-- ============================================

DELIMITER $$

-- Procedure: ثبت انتقال قطعه
CREATE PROCEDURE `sp_transfer_part`(
  IN p_part_id BIGINT UNSIGNED,
  IN p_from_user_id BIGINT UNSIGNED,
  IN p_to_user_id BIGINT UNSIGNED,
  IN p_transfer_type VARCHAR(20),
  IN p_price DECIMAL(15,2),
  IN p_notes TEXT
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'خطا در انتقال قطعه';
  END;

  START TRANSACTION;

  -- ایجاد رکورد انتقال
  INSERT INTO part_transfers (
    part_id, from_user_id, to_user_id, transfer_type, 
    status, price, notes, transfer_date
  ) VALUES (
    p_part_id, p_from_user_id, p_to_user_id, p_transfer_type,
    'pending', p_price, p_notes, NOW()
  );

  -- ثبت لاگ
  INSERT INTO system_logs (
    user_id, action, entity_type, entity_id, description
  ) VALUES (
    p_from_user_id, 'transfer_created', 'part', p_part_id,
    CONCAT('انتقال قطعه به کاربر ', p_to_user_id)
  );

  -- ارسال اعلان
  INSERT INTO notifications (
    user_id, type, title, message
  ) VALUES (
    p_to_user_id, 'transfer_received', 'انتقال جدید',
    CONCAT('یک قطعه به شما منتقل شده است')
  );

  COMMIT;
END$$

-- Procedure: تایید انتقال
CREATE PROCEDURE `sp_complete_transfer`(
  IN p_transfer_id BIGINT UNSIGNED,
  IN p_user_id BIGINT UNSIGNED
)
BEGIN
  DECLARE v_part_id BIGINT UNSIGNED;
  DECLARE v_to_user_id BIGINT UNSIGNED;
  
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'خطا در تایید انتقال';
  END;

  START TRANSACTION;

  -- دریافت اطلاعات انتقال
  SELECT part_id, to_user_id INTO v_part_id, v_to_user_id
  FROM part_transfers
  WHERE id = p_transfer_id;

  -- به‌روزرسانی وضعیت انتقال
  UPDATE part_transfers
  SET status = 'completed', completed_at = NOW()
  WHERE id = p_transfer_id;

  -- به‌روزرسانی مالک قطعه
  UPDATE parts
  SET current_owner_id = v_to_user_id, status = 'sold'
  WHERE id = v_part_id;

  -- ثبت لاگ
  INSERT INTO system_logs (
    user_id, action, entity_type, entity_id, description
  ) VALUES (
    p_user_id, 'transfer_completed', 'part', v_part_id,
    'انتقال تکمیل شد'
  );

  COMMIT;
END$$

-- Procedure: ثبت سرویس آسانسور
CREATE PROCEDURE `sp_log_maintenance`(
  IN p_elevator_id BIGINT UNSIGNED,
  IN p_technician_id BIGINT UNSIGNED,
  IN p_maintenance_type VARCHAR(20),
  IN p_description TEXT,
  IN p_cost DECIMAL(15,2),
  IN p_next_date DATE
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'خطا در ثبت سرویس';
  END;

  START TRANSACTION;

  -- ثبت رکورد سرویس
  INSERT INTO maintenance_records (
    elevator_id, technician_id, maintenance_type,
    maintenance_date, description, cost, next_maintenance_date, status
  ) VALUES (
    p_elevator_id, p_technician_id, p_maintenance_type,
    CURDATE(), p_description, p_cost, p_next_date, 'completed'
  );

  -- به‌روزرسانی آسانسور
  UPDATE elevators
  SET 
    last_maintenance_date = CURDATE(),
    next_maintenance_date = p_next_date
  WHERE id = p_elevator_id;

  -- ثبت لاگ
  INSERT INTO system_logs (
    user_id, action, entity_type, entity_id, description
  ) VALUES (
    p_technician_id, 'maintenance_logged', 'elevator', p_elevator_id,
    CONCAT('سرویس ', p_maintenance_type, ' انجام شد')
  );

  COMMIT;
END$$

DELIMITER ;

-- ============================================
-- Triggers
-- ============================================

DELIMITER $$

-- Trigger: به‌روزرسانی path در دسته‌بندی
CREATE TRIGGER `trg_parts_categories_path_insert`
BEFORE INSERT ON `parts_categories`
FOR EACH ROW
BEGIN
  IF NEW.parent_id IS NULL THEN
    SET NEW.depth = 0;
    SET NEW.path = CONCAT('/', NEW.id);
  ELSE
    SELECT depth + 1, CONCAT(path, '/', NEW.id)
    INTO NEW.depth, NEW.path
    FROM parts_categories
    WHERE id = NEW.parent_id;
  END IF;
END$$

-- Trigger: لاگ تغییرات قطعات
CREATE TRIGGER `trg_parts_update_log`
AFTER UPDATE ON `parts`
FOR EACH ROW
BEGIN
  IF OLD.status != NEW.status OR OLD.current_owner_id != NEW.current_owner_id THEN
    INSERT INTO system_logs (
      user_id, action, entity_type, entity_id, 
      old_data, new_data, description
    ) VALUES (
      NEW.current_owner_id, 'part_updated', 'part', NEW.id,
      JSON_OBJECT('status', OLD.status, 'owner', OLD.current_owner_id),
      JSON_OBJECT('status', NEW.status, 'owner', NEW.current_owner_id),
      'تغییر وضعیت یا مالکیت قطعه'
    );
  END IF;
END$$

-- Trigger: اعلان سرویس آسانسور
CREATE TRIGGER `trg_elevator_maintenance_alert`
AFTER UPDATE ON `elevators`
FOR EACH ROW
BEGIN
  IF NEW.next_maintenance_date < DATE_ADD(CURDATE(), INTERVAL 7 DAY) 
     AND (OLD.next_maintenance_date IS NULL OR OLD.next_maintenance_date != NEW.next_maintenance_date) THEN
    INSERT INTO notifications (
      user_id, type, title, message, link
    ) VALUES (
      NEW.owner_id, 'maintenance_due', 'یادآوری سرویس',
      CONCAT('آسانسور ', NEW.uid, ' نیاز به سرویس دارد'),
      CONCAT('/elevators/', NEW.id)
    );
  END IF;
END$$

DELIMITER ;

-- ============================================
-- داده‌های اولیه (Seed Data)
-- ============================================

-- تنظیمات پیش‌فرض
INSERT INTO `settings` (`category`, `key`, `value`, `type`, `description`, `is_public`) VALUES
('general', 'site_name', 'سامانه ردیابی قطعات آسانسور', 'string', 'نام سایت', TRUE),
('general', 'site_description', 'سیستم جامع ردیابی و مدیریت قطعات و شناسنامه آسانسور', 'string', 'توضیحات سایت', TRUE),
('otp', 'expiry_minutes', '2', 'number', 'مدت اعتبار OTP (دقیقه)', FALSE),
('otp', 'length', '6', 'number', 'طول کد OTP', FALSE),
('captcha', 'expiry_minutes', '5', 'number', 'مدت اعتبار کپچا (دقیقه)', FALSE),
('pagination', 'default_page_size', '20', 'number', 'تعداد پیش‌فرض در صفحه', TRUE),
('file', 'max_upload_size', '10485760', 'number', 'حداکثر حجم آپلود (بایت)', FALSE),
('maintenance', 'default_interval_months', '6', 'number', 'فاصله پیش‌فرض سرویس (ماه)', TRUE);

-- انواع پرداخت
INSERT INTO `payment_types` (`name`, `slug`, `description`, `is_active`) VALUES
('درگاه بانکی', 'bank_gateway', 'پرداخت از طریق درگاه بانکی', TRUE),
('کارت به کارت', 'card_to_card', 'واریز مستقیم به کارت', TRUE),
('نقدی', 'cash', 'پرداخت نقدی', TRUE),
('چک', 'check', 'پرداخت با چک', TRUE);

-- کاربر ادمین پیش‌فرض
INSERT INTO `users` (`mobile`, `email`, `name`, `role`, `status`, `mobile_verified_at`) VALUES
('09121111111', 'admin@elevatorid.ir', 'مدیر سیستم', 'admin', 'active', NOW());

-- نمونه استان‌ها (تهران و البرز)
INSERT INTO `provinces` (`name`, `slug`, `code`, `is_active`) VALUES
('تهران', 'tehran', '01', TRUE),
('البرز', 'alborz', '02', TRUE);

-- نمونه شهرها
INSERT INTO `cities` (`province_id`, `name`, `slug`, `code`, `is_active`) VALUES
(1, 'تهران', 'tehran-city', '0101', TRUE),
(1, 'ری', 'rey', '0102', TRUE),
(2, 'کرج', 'karaj', '0201', TRUE);

-- نمونه انواع آسانسور
INSERT INTO `elevator_types` (`name`, `slug`, `description`, `is_active`) VALUES
('آسانسور مسافربری', 'passenger', 'آسانسور استاندارد برای حمل مسافر', TRUE),
('آسانسور باربری', 'cargo', 'آسانسور مخصوص حمل بار', TRUE),
('آسانسور بیمارستانی', 'hospital', 'آسانسور مخصوص بیمارستان', TRUE),
('آسانسور ویلایی', 'villa', 'آسانسور کوچک برای منازل', TRUE);

-- ============================================
-- Indices اضافی برای Performance
-- ============================================

-- Composite indexes برای query های رایج
CREATE INDEX `idx_parts_owner_status` ON `parts` (`current_owner_id`, `status`);
CREATE INDEX `idx_elevators_owner_status` ON `elevators` (`owner_id`, `status`);
CREATE INDEX `idx_transfers_status_date` ON `part_transfers` (`status`, `transfer_date`);
CREATE INDEX `idx_requests_user_status` ON `requests` (`user_id`, `status`);
CREATE INDEX `idx_complaints_user_status` ON `complaints` (`user_id`, `status`);
CREATE INDEX `idx_notifications_user_read` ON `notifications` (`user_id`, `is_read`);

-- ============================================
-- Clean up old data (Jobs - نیاز به Scheduler)
-- ============================================

DELIMITER $$

CREATE EVENT IF NOT EXISTS `evt_cleanup_old_otps`
ON SCHEDULE EVERY 1 DAY
DO
BEGIN
  DELETE FROM otps WHERE expires_at < DATE_SUB(NOW(), INTERVAL 7 DAY);
END$$

CREATE EVENT IF NOT EXISTS `evt_cleanup_old_captchas`
ON SCHEDULE EVERY 1 DAY
DO
BEGIN
  DELETE FROM captchas WHERE expires_at < DATE_SUB(NOW(), INTERVAL 1 DAY);
END$$

CREATE EVENT IF NOT EXISTS `evt_cleanup_old_logs`
ON SCHEDULE EVERY 1 MONTH
DO
BEGIN
  DELETE FROM system_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 6 MONTH);
END$$

DELIMITER ;

-- ============================================
-- پایان Schema
-- ============================================

-- نمایش اطلاعات جداول
SELECT 
  TABLE_NAME AS 'Table',
  TABLE_ROWS AS 'Rows',
  ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) AS 'Size (MB)',
  TABLE_COMMENT AS 'Comment'
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;
