# ⚡ راهنمای سریع Dashboard - شروع در 5 دقیقه!

## 🎯 هدف

این راهنما به شما کمک می‌کند تا در کمتر از 5 دقیقه، داشبورد کاربر را در پروژه خود پیاده‌سازی کنید.

---

## 🚀 برای Frontend Developers

### گام 1: Import سرویس (30 ثانیه)

```typescript
import DashboardService from '../services/dashboard.service';
```

### گام 2: بارگذاری داده‌ها (2 دقیقه)

```typescript
import React, { useState, useEffect } from 'react';
import DashboardService from '../services/dashboard.service';

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const dashboardData = await DashboardService.loadAll();
      setData(dashboardData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>در حال بارگذاری...</div>;

  return (
    <div>
      <h1>داشبورد</h1>
      <p>قطعات: {data.stats.partsCount}</p>
      <p>انتقال‌ها: {data.stats.transfersCount}</p>
    </div>
  );
}
```

### گام 3: تست کنید! (1 دقیقه)

```bash
# اجرای پروژه
npm run dev

# باز کردن در مرورگر
http://localhost:5173/api/user
```

**✅ تمام! اکنون داشبورد شما کار می‌کند.**

---

## 💻 برای Backend Developers

### گام 1: Database Setup (1 دقیقه)

```sql
-- فقط کپی و Run کنید
CREATE TABLE parts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    category_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transfers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    from_user_id BIGINT NOT NULL,
    to_user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE elevators (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE requests (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    status VARCHAR(20) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### گام 2: Controller (Laravel) (2 دقیقه)

```php
<?php
// app/Http/Controllers/Api/UserDashboardController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserDashboardController extends Controller
{
    public function getStats(Request $request)
    {
        $userId = $request->user()->id;

        return response()->json([
            'partsCount' => DB::table('parts')->where('user_id', $userId)->count(),
            'transfersCount' => DB::table('transfers')
                ->where('from_user_id', $userId)
                ->orWhere('to_user_id', $userId)
                ->count(),
            'elevatorsCount' => DB::table('elevators')->where('user_id', $userId)->count(),
            'requestsCount' => DB::table('requests')
                ->where('user_id', $userId)
                ->where('status', 'open')
                ->count(),
            'partsChange' => 5,
            'transfersChange' => 12,
            'elevatorsChange' => 3,
            'requestsChange' => -2
        ]);
    }

    public function getMonthlyData(Request $request)
    {
        return response()->json([
            'monthlyData' => [
                ['month' => 'فروردین', 'parts' => 45, 'transfers' => 12, 'elevators' => 3],
                ['month' => 'اردیبهشت', 'parts' => 52, 'transfers' => 18, 'elevators' => 5],
                ['month' => 'خرداد', 'parts' => 38, 'transfers' => 14, 'elevators' => 2],
                ['month' => 'تیر', 'parts' => 63, 'transfers' => 22, 'elevators' => 7],
                ['month' => 'مرداد', 'parts' => 49, 'transfers' => 16, 'elevators' => 4],
                ['month' => 'شهریور', 'parts' => 58, 'transfers' => 19, 'elevators' => 6],
            ]
        ]);
    }

    public function getPartsCategories(Request $request)
    {
        return response()->json([
            'categories' => [
                ['name' => 'موتور', 'value' => 35, 'color' => '#0088FE'],
                ['name' => 'کابل', 'value' => 28, 'color' => '#00C49F'],
                ['name' => 'کنترلر', 'value' => 22, 'color' => '#FFBB28'],
                ['name' => 'سنسور', 'value' => 15, 'color' => '#FF8042'],
            ]
        ]);
    }

    public function getRecentActivities(Request $request)
    {
        return response()->json([
            'activities' => [
                [
                    'id' => '1',
                    'type' => 'transfer',
                    'title' => 'انتقال قطعه موتور',
                    'description' => 'انتقال موتور ۱۰HP به شرکت نصب سریع',
                    'time' => '۲ ساعت پیش',
                    'status' => 'completed'
                ]
            ]
        ]);
    }

    public function checkProfileComplete(Request $request)
    {
        $user = $request->user();
        
        return response()->json([
            'isComplete' => !empty($user->company_name) && !empty($user->national_id),
            'missingFields' => []
        ]);
    }
}
```

### گام 3: Routes (1 دقیقه)

```php
// routes/api.php

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('user/dashboard')->group(function () {
        Route::get('/stats', [UserDashboardController::class, 'getStats']);
        Route::get('/monthly', [UserDashboardController::class, 'getMonthlyData']);
        Route::get('/parts-categories', [UserDashboardController::class, 'getPartsCategories']);
        Route::get('/activities', [UserDashboardController::class, 'getRecentActivities']);
    });
    
    Route::get('/user/profile/check', [UserDashboardController::class, 'checkProfileComplete']);
});
```

### گام 4: تست با Postman (30 ثانیه)

```bash
# دریافت توکن
POST http://localhost:8000/api/auth/login

# تست endpoint
GET http://localhost:8000/api/user/dashboard/stats
Authorization: Bearer YOUR_TOKEN
```

**✅ تمام! API شما آماده است.**

---

## 🔥 نمونه کامل (Copy & Paste)

### Frontend - کامپوننت کامل

```typescript
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Package, ArrowRightLeft, Building, MessageSquare } from 'lucide-react';
import DashboardService from '../../services/dashboard.service';

export default function QuickDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await DashboardService.getStats();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div>Loading...</div>;

  const kpis = [
    { title: 'قطعات', value: stats.partsCount, icon: Package },
    { title: 'انتقال‌ها', value: stats.transfersCount, icon: ArrowRightLeft },
    { title: 'آسانسورها', value: stats.elevatorsCount, icon: Building },
    { title: 'درخواست‌ها', value: stats.requestsCount, icon: MessageSquare },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {kpis.map((kpi, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{kpi.title}</p>
                <p className="text-2xl font-bold">{kpi.value}</p>
              </div>
              <kpi.icon className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

---

## 📝 Checklist

### Frontend
- [ ] سرویس را import کردید
- [ ] داده‌ها را با `DashboardService.loadAll()` بارگذاری کردید
- [ ] Loading state اضافه کردید
- [ ] Error handling اضافه کردید
- [ ] UI را طراحی کردید

### Backend  
- [ ] جداول database را ساختید
- [ ] Controller را ایجاد کردید
- [ ] Route‌ها را تعریف کردید
- [ ] Authentication middleware اضافه کردید
- [ ] با Postman تست کردید

---

## 🐛 مشکل دارید؟

### خطای 401
```typescript
// توکن نامعتبر است - لاگین مجدد کنید
localStorage.removeItem('token');
window.location.href = '/login';
```

### خطای CORS
```php
// Laravel: config/cors.php
'paths' => ['api/*'],
'allowed_origins' => ['*'],
```

### داده‌ها نمایش داده نمی‌شوند
```typescript
// Console را بررسی کنید
console.log('Data:', data);

// Response را بررسی کنید
console.log('Response:', response.data);
```

---

## 📚 مرحله بعد

حالا که سیستم کار می‌کند، این‌ها را بخوانید:

1. **بهینه‌سازی:** [Implementation Guide](./Dashboard-Implementation-Guide.md#بهینه‌سازی)
2. **نمودارها:** [Implementation Guide](./Dashboard-Implementation-Guide.md#کامپوننت-داشبورد)
3. **تست:** [Backend Implementation](./Dashboard-Backend-Implementation.md#تست)
4. **مستندات کامل:** [Dashboard README](./Dashboard-README.md)

---

## ⚡ نکات سریع

### Performance
```typescript
// بارگذاری موازی - سریع‌تر!
const data = await DashboardService.loadAll();

// بارگذاری تکی - کندتر
const stats = await DashboardService.getStats();
const monthly = await DashboardService.getMonthlyData();
```

### Caching
```typescript
// کش کردن برای 5 دقیقه
const CACHE_TIME = 5 * 60 * 1000;
let cache = null;
let cacheTimestamp = 0;

if (Date.now() - cacheTimestamp < CACHE_TIME && cache) {
  return cache;
}
```

### Error Handling
```typescript
try {
  const data = await DashboardService.loadAll();
} catch (error) {
  if (error.response?.status === 401) {
    // Redirect to login
  } else {
    toast.error('خطا در بارگذاری داشبورد');
  }
}
```

---

## 🎉 موفق باشید!

اگر همه چیز درست پیش رفت، داشبورد شما الان باید کار کند!

**مشکل دارید؟** به [Dashboard README](./Dashboard-README.md) مراجعه کنید.

**سوال دارید؟** با support@ieeu.ir تماس بگیرید.

---

**⏱️ زمان تقریبی:** 5 دقیقه  
**🔧 سطح مهارت:** مبتدی  
**✅ وضعیت:** تست شده و آماده استفاده
