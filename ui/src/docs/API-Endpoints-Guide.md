# 📚 راهنمای کامل API Endpoints سامانه ردیابی آسانسور

## 🔐 **1. احراز هویت (Authentication)**

### 1.1 ارسال کد OTP
**POST** `/auth/send-otp`

**Request Body:**
```json
{
  "mobile": "09123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "کد تایید به شماره شما ارسال شد",
  "otpToken": "temp_token_12345"
}
```

### 1.2 تایید کد OTP
**POST** `/auth/verify-otp`

**Request Body:**
```json
{
  "otpToken": "temp_token_12345",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_12345",
  "user": {
    "id": "user_123",
    "mobile": "09123456789",
    "role": "user",
    "name": "نام کاربر",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 1.3 تمدید توکن
**POST** `/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "refresh_token_12345"
}
```

**Response:**
```json
{
  "success": true,
  "accessToken": "new_access_token_12345",
  "refreshToken": "new_refresh_token_12345"
}
```

### 1.4 خروج از سیستم
**POST** `/auth/logout`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "با موفقیت خارج شدید"
}
```

---

## 📊 **2. داشبورد (Dashboard)**

### 2.1 آمار ادمین
**GET** `/dashboard/admin/stats`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "totalParts": 15420,
    "totalElevators": 850,
    "totalTransfers": 3200,
    "monthlyGrowth": {
      "users": 12.5,
      "parts": 8.3,
      "elevators": 15.2
    },
    "recentActivity": [
      {
        "id": "act_123",
        "type": "new_user",
        "description": "کاربر جدید ثبت نام کرد",
        "timestamp": "2024-01-01T12:00:00Z"
      }
    ]
  }
}
```

### 2.2 آمار کاربر
**GET** `/dashboard/user/stats`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "myParts": 45,
    "myElevators": 3,
    "myTransfers": 12,
    "pendingRequests": 2,
    "recentActivity": [
      {
        "id": "act_456",
        "type": "part_transferred",
        "description": "قطعه موتور منتقل شد",
        "timestamp": "2024-01-01T10:30:00Z"
      }
    ]
  }
}
```

---

## 👥 **3. مدیریت کاربران (Users)**

### 3.1 لیست کاربران
**GET** `/users`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: شماره صفحه (پیش‌فرض: 1)
- `limit`: تعداد در هر صفحه (پیش‌فرض: 20)
- `search`: جستجو در نام یا موبایل
- `role`: فیلتر نقش (admin, user)
- `status`: فیلتر وضعیت (active, inactive)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_123",
        "name": "علی احمدی",
        "mobile": "09123456789",
        "role": "user",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "lastLoginAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 1250,
      "page": 1,
      "limit": 20,
      "totalPages": 63
    }
  }
}
```

### 3.2 ایجاد کاربر جدید
**POST** `/users`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "نام کاربر",
  "mobile": "09123456789",
  "role": "user",
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "کاربر با موفقیت ایجاد شد",
  "data": {
    "id": "user_new_123",
    "name": "نام کاربر",
    "mobile": "09123456789",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-01T12:00:00Z"
  }
}
```

### 3.3 جزئیات کاربر
**GET** `/users/{userId}`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "علی احمدی",
    "mobile": "09123456789",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "lastLoginAt": "2024-01-15T10:30:00Z",
    "stats": {
      "totalParts": 45,
      "totalElevators": 3,
      "totalTransfers": 12
    }
  }
}
```

### 3.4 ویرایش کاربر
**PUT** `/users/{userId}`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "نام جدید",
  "role": "admin",
  "isActive": false
}
```

### 3.5 حذف کاربر
**DELETE** `/users/{userId}`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "کاربر با موفقیت حذف شد"
}
```

### 3.6 تغییر وضعیت کاربر
**PATCH** `/users/{userId}/toggle-status`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "وضعیت کاربر تغییر یافت",
  "isActive": false
}
```

---

## 🔧 **4. مدیریت قطعات (Parts)**

### 4.1 لیست قطعات
**GET** `/parts`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`, `limit`: صفحه‌بندی
- `search`: جستجو در نام یا کد
- `category`: فیلتر دسته‌بندی
- `status`: فیلتر وضعیت
- `ownerId`: فیلتر مالک

**Response:**
```json
{
  "success": true,
  "data": {
    "parts": [
      {
        "id": "part_123",
        "name": "موتور آسانسور",
        "partNumber": "MTR-2024-001",
        "category": "motor",
        "description": "موتور 10 نفره",
        "specifications": {
          "power": "10KW",
          "voltage": "380V",
          "brand": "شیندلر"
        },
        "status": "available",
        "ownerId": "user_123",
        "ownerName": "علی احمدی",
        "createdAt": "2024-01-01T00:00:00Z",
        "images": ["image1.jpg", "image2.jpg"],
        "qrCode": "QR-part-123"
      }
    ],
    "pagination": {
      "total": 15420,
      "page": 1,
      "limit": 20,
      "totalPages": 771
    }
  }
}
```

### 4.2 ایجاد قطعه جدید
**POST** `/parts`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "موتور آسانسور",
  "partNumber": "MTR-2024-001",
  "category": "motor",
  "description": "موتور 10 نفره",
  "specifications": {
    "power": "10KW",
    "voltage": "380V",
    "brand": "شیندلر"
  },
  "images": ["base64_image_data_1", "base64_image_data_2"]
}
```

### 4.3 جزئیات قطعه
**GET** `/parts/{partId}`

### 4.4 ویرایش قطعه
**PUT** `/parts/{partId}`

### 4.5 حذف قطعه
**DELETE** `/parts/{partId}`

### 4.6 لیست دسته‌بندی‌ها
**GET** `/parts/categories`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "motor",
      "name": "موتور",
      "description": "انواع موتورهای آسانسور",
      "count": 150
    },
    {
      "id": "cable",
      "name": "کابل",
      "description": "کابل‌های آسانسور",
      "count": 280
    }
  ]
}
```

### 4.7 ایجاد دسته‌بندی جدید
**POST** `/parts/categories`

**Request Body:**
```json
{
  "name": "دسته‌بندی جدید",
  "description": "توضیحات دسته‌بندی"
}
```

### 4.8 انتقال قطعه
**POST** `/parts/{partId}/transfer`

**Request Body:**
```json
{
  "recipientId": "user_456",
  "transferType": "sale",
  "price": 1500000,
  "notes": "فروش فوری"
}
```

### 4.9 دریافت QR کد قطعه
**GET** `/parts/{partId}/qr-code`

**Response:** QR Code image (PNG format)

---

## 🔄 **5. مدیریت انتقال‌ها (Transfers)**

### 5.1 لیست انتقال‌ها
**GET** `/transfers`

**Query Parameters:**
- `status`: pending, approved, rejected
- `type`: sale, gift, exchange
- `senderId`, `recipientId`: فیلتر بر اساس فرستنده/گیرنده

**Response:**
```json
{
  "success": true,
  "data": {
    "transfers": [
      {
        "id": "transfer_123",
        "partId": "part_123",
        "partName": "موتور آسانسور",
        "senderId": "user_123",
        "senderName": "علی احمدی",
        "recipientId": "user_456",
        "recipientName": "محمد رضایی",
        "transferType": "sale",
        "price": 1500000,
        "status": "pending",
        "notes": "فروش فوری",
        "createdAt": "2024-01-01T10:00:00Z",
        "approvedAt": null
      }
    ]
  }
}
```

### 5.2 جزئیات انتقال
**GET** `/transfers/{transferId}`

### 5.3 تایید انتقال
**POST** `/transfers/{transferId}/approve`

**Request Body:**
```json
{
  "adminNotes": "تایید شد"
}
```

### 5.4 رد انتقال
**POST** `/transfers/{transferId}/reject`

**Request Body:**
```json
{
  "reason": "مدارک ناقص",
  "adminNotes": "لطفا مدارک کامل ارسال کنید"
}
```

---

## 🏢 **6. مدیریت آسانسورها (Elevators)**

### 6.1 لیست آسانسورها
**GET** `/elevators`

**Response:**
```json
{
  "success": true,
  "data": {
    "elevators": [
      {
        "id": "elevator_123",
        "serialNumber": "ELV-2024-001",
        "building": {
          "name": "برج میلاد",
          "address": "تهران، میدان آزادی",
          "province": "تهران",
          "city": "تهران"
        },
        "specifications": {
          "capacity": "10 نفر",
          "floors": 15,
          "brand": "شیندلر",
          "model": "5500",
          "installationDate": "2024-01-01"
        },
        "ownerId": "user_123",
        "ownerName": "علی احمدی",
        "status": "active",
        "lastInspection": "2024-01-15T00:00:00Z",
        "parts": [
          {
            "partId": "part_123",
            "partName": "موتور اصلی",
            "installedAt": "2024-01-01T00:00:00Z"
          }
        ]
      }
    ]
  }
}
```

### 6.2 ایجاد آسانسور
**POST** `/elevators`

**Request Body:**
```json
{
  "serialNumber": "ELV-2024-001",
  "building": {
    "name": "برج میلاد",
    "address": "تهران، میدان آزادی",
    "province": "تهران",
    "city": "تهران"
  },
  "specifications": {
    "capacity": "10 نفر",
    "floors": 15,
    "brand": "شیندلر",
    "model": "5500",
    "installationDate": "2024-01-01"
  }
}
```

### 6.3 جزئیات آسانسور
**GET** `/elevators/{elevatorId}`

### 6.4 ویرایش آسانسور
**PUT** `/elevators/{elevatorId}`

### 6.5 حذف آسانسور
**DELETE** `/elevators/{elevatorId}`

### 6.6 دریافت گواهی آسانسور
**GET** `/elevators/{elevatorId}/certificate`

**Response:** PDF certificate file

### 6.7 لیست قطعات آسانسور
**GET** `/elevators/{elevatorId}/parts`

### 6.8 افزودن قطعه به آسانسور
**POST** `/elevators/{elevatorId}/parts`

**Request Body:**
```json
{
  "partId": "part_123",
  "installationNotes": "نصب در طبقه اول"
}
```

### 6.9 تعویض قطعه آسانسور
**POST** `/elevators/{elevatorId}/parts/{partId}/replace`

**Request Body:**
```json
{
  "newPartId": "part_456",
  "reason": "قطعه قدیمی خراب شد",
  "replacementNotes": "تعویض اضطراری"
}
```

---

## 📝 **7. مدیریت درخواست‌ها (Requests)**

### 7.1 لیست درخواست‌ها
**GET** `/requests`

**Query Parameters:**
- `type`: support, complaint, feature_request
- `status`: pending, in_progress, resolved, closed
- `priority`: low, medium, high, urgent

**Response:**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "req_123",
        "title": "مشکل در سیستم",
        "description": "سیستم کند کار می‌کند",
        "type": "support",
        "priority": "medium",
        "status": "pending",
        "userId": "user_123",
        "userName": "علی احمدی",
        "createdAt": "2024-01-01T10:00:00Z",
        "updatedAt": "2024-01-01T10:00:00Z",
        "attachments": ["file1.pdf", "image1.jpg"]
      }
    ]
  }
}
```

### 7.2 ایجاد درخواست
**POST** `/requests`

**Request Body:**
```json
{
  "title": "عنوان درخواست",
  "description": "شرح کامل مشکل یا درخواست",
  "type": "support",
  "priority": "medium",
  "attachments": ["base64_file_data"]
}
```

### 7.3 جزئیات درخواست
**GET** `/requests/{requestId}`

### 7.4 ویرایش درخواست
**PUT** `/requests/{requestId}`

### 7.5 پاسخ به درخواست
**POST** `/requests/{requestId}/respond`

**Request Body:**
```json
{
  "response": "پاسخ مدیر سیستم",
  "status": "resolved",
  "internalNotes": "یادداشت داخلی"
}
```

---

## 📊 **8. گزارش‌گیری (Reports)**

### 8.1 گزارش قطعات
**GET** `/reports/parts`

**Query Parameters:**
- `startDate`, `endDate`: بازه زمانی
- `category`: دسته‌بندی خاص
- `format`: json, csv, pdf

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalParts": 15420,
      "newPartsThisMonth": 245,
      "transferredParts": 180,
      "categoriesBreakdown": [
        {
          "category": "motor",
          "count": 150,
          "percentage": 35.2
        }
      ]
    },
    "charts": {
      "monthlyTrend": [...],
      "categoryDistribution": [...]
    }
  }
}
```

### 8.2 گزارش انتقال‌ها
**GET** `/reports/transfers`

### 8.3 گزارش آسانسورها
**GET** `/reports/elevators`

### 8.4 گزارش مالی
**GET** `/reports/financial`

---

## 👤 **9. مدیریت پروفایل (Profile)**

### 9.1 اطلاعات پروفایل
**GET** `/profile`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "علی احمدی",
    "mobile": "09123456789",
    "role": "user",
    "avatar": "avatar_url.jpg",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "lastLoginAt": "2024-01-15T10:30:00Z"
  }
}
```

### 9.2 ویرایش پروفایل
**PUT** `/profile`

**Request Body:**
```json
{
  "name": "نام جدید",
  "avatar": "base64_image_data"
}
```

### 9.3 تغییر آواتار
**POST** `/profile/avatar`

**Request Body:** Multipart form data with image file

### 9.4 تغییر رمز عبور
**POST** `/profile/change-password`

**Request Body:**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password",
  "confirmPassword": "new_password"
}
```

---

## ⚙️ **10. تنظیمات سیستم (Settings)**

### 10.1 دریافت تنظیمات
**GET** `/settings`

**Response:**
```json
{
  "success": true,
  "data": {
    "systemName": "سامانه ردیابی آسانسور",
    "maintenanceMode": false,
    "registrationEnabled": true,
    "maxFileSize": 10485760,
    "supportedFormats": ["jpg", "png", "pdf"],
    "notificationSettings": {
      "emailEnabled": true,
      "smsEnabled": true
    }
  }
}
```

### 10.2 بروزرسانی تنظیمات
**PUT** `/settings`

### 10.3 پشتیبان‌گیری
**POST** `/settings/backup`

**Response:**
```json
{
  "success": true,
  "message": "پشتیبان‌گیری آغاز شد",
  "backupId": "backup_123",
  "estimatedTime": "5 دقیقه"
}
```

---

## 📁 **11. آپلود فایل‌ها (Upload)**

### 11.1 آپلود تصویر
**POST** `/upload/image`

**Request Body:** Multipart form data

**Response:**
```json
{
  "success": true,
  "data": {
    "filename": "uploaded_image.jpg",
    "url": "https://api.example.com/files/uploaded_image.jpg",
    "size": 1048576,
    "type": "image/jpeg"
  }
}
```

### 11.2 آپلود سند
**POST** `/upload/document`

---

## 🗺️ **12. اطلاعات جغرافیایی (Geography)**

### 12.1 لیست استان‌ها
**GET** `/geography/provinces`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "تهران",
      "code": "TEH",
      "citiesCount": 16
    }
  ]
}
```

### 12.2 لیست شهرهای استان
**GET** `/geography/provinces/{provinceId}/cities`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "تهران",
      "provinceId": 1
    }
  ]
}
```

---

## 🔒 **نکات امنیتی:**

1. **Authentication**: تمام endpoints (به جز Authentication و Geography) نیاز به Bearer Token دارند
2. **Rate Limiting**: محدودیت تعداد درخواست در ثانیه
3. **Validation**: تمام ورودی‌ها اعتبارسنجی می‌شوند
4. **File Upload**: حداکثر اندازه فایل 10MB
5. **CORS**: فقط از domain های مجاز

## 📋 **کدهای خطا رایج:**

- `400`: Bad Request - داده‌های ورودی نامعتبر
- `401`: Unauthorized - احراز هویت نشده
- `403`: Forbidden - دسترسی محدود
- `404`: Not Found - منبع یافت نشد
- `429`: Too Many Requests - محدودیت نرخ
- `500`: Internal Server Error - خطای سرور

---

## ✅ **نحوه استفاده:**

```javascript
// Example usage with fetch
const response = await fetch('https://elevatorid.ieeu.ir/v1/parts', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
```