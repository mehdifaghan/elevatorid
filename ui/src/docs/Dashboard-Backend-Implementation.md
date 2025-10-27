# راهنمای پیاده‌سازی Backend برای Dashboard

این مستندات برای توسعه‌دهندگان backend است که باید endpoint‌های داشبورد را پیاده‌سازی کنند.

---

## فهرست مطالب
1. [Endpoints مورد نیاز](#endpoints-مورد-نیاز)
2. [Database Schema](#database-schema)
3. [نمونه کد Laravel](#نمونه-کد-laravel)
4. [نمونه کد Node.js/Express](#نمونه-کد-nodejsexpress)
5. [نمونه کد Django](#نمونه-کد-django)
6. [بهینه‌سازی و Performance](#بهینه‌سازی-و-performance)

---

## Endpoints مورد نیاز

### خلاصه

| Method | Endpoint | توضیحات | احراز هویت |
|--------|----------|---------|------------|
| GET | `/user/dashboard/stats` | آمار کامل داشبورد | ✅ Required |
| GET | `/user/dashboard/monthly` | داده‌های ماهانه | ✅ Required |
| GET | `/user/dashboard/parts-categories` | توزیع دسته‌بندی قطعات | ✅ Required |
| GET | `/user/dashboard/activities` | فعالیت‌های اخیر | ✅ Required |
| GET | `/user/profile/check` | بررسی تکمیل پروفایل | ✅ Required |

---

## Database Schema

### جداول مورد نیاز

```sql
-- جدول قطعات
CREATE TABLE parts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES part_categories(id)
);

-- جدول انتقالات
CREATE TABLE transfers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    part_id BIGINT NOT NULL,
    from_user_id BIGINT NOT NULL,
    to_user_id BIGINT NOT NULL,
    status ENUM('pending', 'completed', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (part_id) REFERENCES parts(id),
    FOREIGN KEY (from_user_id) REFERENCES users(id),
    FOREIGN KEY (to_user_id) REFERENCES users(id)
);

-- جدول آسانسورها
CREATE TABLE elevators (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    building_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- جدول درخواست‌ها
CREATE TABLE requests (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- جدول دسته‌بندی قطعات
CREATE TABLE part_categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#0088FE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول فعالیت‌ها (Log)
CREATE TABLE activities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    type ENUM('transfer', 'elevator', 'request', 'part') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('completed', 'pending', 'approved') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## نمونه کد Laravel

### 1. Controller

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UserDashboardController extends Controller
{
    /**
     * دریافت آمار کامل داشبورد
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStats(Request $request)
    {
        $userId = $request->user()->id;
        $currentMonth = Carbon::now()->startOfMonth();
        $previousMonth = Carbon::now()->subMonth()->startOfMonth();

        // تعداد قطعات
        $partsCount = DB::table('parts')
            ->where('user_id', $userId)
            ->count();

        $partsLastMonth = DB::table('parts')
            ->where('user_id', $userId)
            ->whereBetween('created_at', [$previousMonth, $currentMonth])
            ->count();

        // تعداد انتقالات
        $transfersCount = DB::table('transfers')
            ->where(function($query) use ($userId) {
                $query->where('from_user_id', $userId)
                      ->orWhere('to_user_id', $userId);
            })
            ->count();

        $transfersLastMonth = DB::table('transfers')
            ->where(function($query) use ($userId) {
                $query->where('from_user_id', $userId)
                      ->orWhere('to_user_id', $userId);
            })
            ->whereBetween('created_at', [$previousMonth, $currentMonth])
            ->count();

        // تعداد آسانسورها
        $elevatorsCount = DB::table('elevators')
            ->where('user_id', $userId)
            ->count();

        $elevatorsLastMonth = DB::table('elevators')
            ->where('user_id', $userId)
            ->whereBetween('created_at', [$previousMonth, $currentMonth])
            ->count();

        // تعداد درخواست‌های باز
        $requestsCount = DB::table('requests')
            ->where('user_id', $userId)
            ->where('status', 'open')
            ->count();

        $requestsPreviousCount = DB::table('requests')
            ->where('user_id', $userId)
            ->where('created_at', '<', $currentMonth)
            ->where('status', 'open')
            ->count();

        return response()->json([
            'partsCount' => $partsCount,
            'transfersCount' => $transfersCount,
            'elevatorsCount' => $elevatorsCount,
            'requestsCount' => $requestsCount,
            'partsChange' => $partsLastMonth,
            'transfersChange' => $transfersLastMonth,
            'elevatorsChange' => $elevatorsLastMonth,
            'requestsChange' => $requestsCount - $requestsPreviousCount,
        ]);
    }

    /**
     * دریافت داده‌های ماهانه
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMonthlyData(Request $request)
    {
        $userId = $request->user()->id;
        $sixMonthsAgo = Carbon::now()->subMonths(6)->startOfMonth();

        $monthlyData = [];
        $persianMonths = [
            1 => 'فروردین', 2 => 'اردیبهشت', 3 => 'خرداد',
            4 => 'تیر', 5 => 'مرداد', 6 => 'شهریور',
            7 => 'مهر', 8 => 'آبان', 9 => 'آذر',
            10 => 'دی', 11 => 'بهمن', 12 => 'اسفند'
        ];

        for ($i = 5; $i >= 0; $i--) {
            $monthStart = Carbon::now()->subMonths($i)->startOfMonth();
            $monthEnd = Carbon::now()->subMonths($i)->endOfMonth();
            
            // تبدیل به ماه شمسی (باید از کتابخانه مناسب استفاده شود)
            $persianMonthNumber = $this->getPersianMonth($monthStart);
            $monthName = $persianMonths[$persianMonthNumber];

            $parts = DB::table('parts')
                ->where('user_id', $userId)
                ->whereBetween('created_at', [$monthStart, $monthEnd])
                ->count();

            $transfers = DB::table('transfers')
                ->where(function($query) use ($userId) {
                    $query->where('from_user_id', $userId)
                          ->orWhere('to_user_id', $userId);
                })
                ->whereBetween('created_at', [$monthStart, $monthEnd])
                ->count();

            $elevators = DB::table('elevators')
                ->where('user_id', $userId)
                ->whereBetween('created_at', [$monthStart, $monthEnd])
                ->count();

            $monthlyData[] = [
                'month' => $monthName,
                'parts' => $parts,
                'transfers' => $transfers,
                'elevators' => $elevators,
            ];
        }

        return response()->json([
            'monthlyData' => $monthlyData
        ]);
    }

    /**
     * دریافت توزیع دسته‌بندی قطعات
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPartsCategories(Request $request)
    {
        $userId = $request->user()->id;

        $categories = DB::table('parts')
            ->select(
                'part_categories.name',
                'part_categories.color',
                DB::raw('COUNT(parts.id) as value')
            )
            ->join('part_categories', 'parts.category_id', '=', 'part_categories.id')
            ->where('parts.user_id', $userId)
            ->groupBy('part_categories.id', 'part_categories.name', 'part_categories.color')
            ->get();

        return response()->json([
            'categories' => $categories
        ]);
    }

    /**
     * دریافت فعالیت‌های اخیر
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRecentActivities(Request $request)
    {
        $userId = $request->user()->id;

        $activities = DB::table('activities')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => (string) $activity->id,
                    'type' => $activity->type,
                    'title' => $activity->title,
                    'description' => $activity->description,
                    'time' => $this->getRelativeTime($activity->created_at),
                    'status' => $activity->status,
                ];
            });

        return response()->json([
            'activities' => $activities
        ]);
    }

    /**
     * بررسی تکمیل بودن پروفایل
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkProfileComplete(Request $request)
    {
        $user = $request->user();
        $requiredFields = ['company_name', 'national_id', 'address', 'province', 'city'];
        $missingFields = [];

        foreach ($requiredFields as $field) {
            if (empty($user->$field)) {
                $missingFields[] = $field;
            }
        }

        return response()->json([
            'isComplete' => empty($missingFields),
            'missingFields' => $missingFields
        ]);
    }

    /**
     * تبدیل تاریخ به زمان نسبی فارسی
     */
    private function getRelativeTime($datetime)
    {
        $diff = Carbon::parse($datetime)->diffForHumans();
        // تبدیل به فارسی
        return str_replace(
            ['seconds ago', 'minutes ago', 'hours ago', 'days ago', 'weeks ago'],
            ['ثانیه پیش', 'دقیقه پیش', 'ساعت پیش', 'روز پیش', 'هفته پیش'],
            $diff
        );
    }

    /**
     * دریافت شماره ماه شمسی
     */
    private function getPersianMonth($date)
    {
        // باید از کتابخانه Jalali استفاده شود
        // این فقط یک placeholder است
        return $date->month;
    }
}
```

### 2. Routes (routes/api.php)

```php
use App\Http\Controllers\Api\UserDashboardController;

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

---

## نمونه کد Node.js/Express

### 1. Controller (controllers/dashboardController.js)

```javascript
const db = require('../config/database');
const moment = require('moment-jalaali');

/**
 * دریافت آمار کامل داشبورد
 */
exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentMonth = moment().startOf('jMonth');
    const previousMonth = moment().subtract(1, 'jMonth').startOf('jMonth');

    // Query‌های موازی برای بهینه‌سازی
    const [
      partsCount,
      partsLastMonth,
      transfersCount,
      transfersLastMonth,
      elevatorsCount,
      elevatorsLastMonth,
      requestsCount,
      requestsPreviousCount
    ] = await Promise.all([
      // قطعات
      db.query('SELECT COUNT(*) as count FROM parts WHERE user_id = ?', [userId]),
      db.query('SELECT COUNT(*) as count FROM parts WHERE user_id = ? AND created_at >= ?', 
        [userId, previousMonth.format('YYYY-MM-DD')]),
      
      // انتقالات
      db.query('SELECT COUNT(*) as count FROM transfers WHERE from_user_id = ? OR to_user_id = ?', 
        [userId, userId]),
      db.query('SELECT COUNT(*) as count FROM transfers WHERE (from_user_id = ? OR to_user_id = ?) AND created_at >= ?',
        [userId, userId, previousMonth.format('YYYY-MM-DD')]),
      
      // آسانسورها
      db.query('SELECT COUNT(*) as count FROM elevators WHERE user_id = ?', [userId]),
      db.query('SELECT COUNT(*) as count FROM elevators WHERE user_id = ? AND created_at >= ?',
        [userId, previousMonth.format('YYYY-MM-DD')]),
      
      // درخواست‌ها
      db.query('SELECT COUNT(*) as count FROM requests WHERE user_id = ? AND status = "open"', [userId]),
      db.query('SELECT COUNT(*) as count FROM requests WHERE user_id = ? AND status = "open" AND created_at < ?',
        [userId, currentMonth.format('YYYY-MM-DD')])
    ]);

    res.json({
      partsCount: partsCount[0].count,
      transfersCount: transfersCount[0].count,
      elevatorsCount: elevatorsCount[0].count,
      requestsCount: requestsCount[0].count,
      partsChange: partsLastMonth[0].count,
      transfersChange: transfersLastMonth[0].count,
      elevatorsChange: elevatorsLastMonth[0].count,
      requestsChange: requestsCount[0].count - requestsPreviousCount[0].count
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'خطا در دریافت آمار داشبورد' });
  }
};

/**
 * دریافت داده‌های ماهانه
 */
exports.getMonthlyData = async (req, res) => {
  try {
    const userId = req.user.id;
    const monthlyData = [];

    for (let i = 5; i >= 0; i--) {
      const monthStart = moment().subtract(i, 'jMonth').startOf('jMonth');
      const monthEnd = moment().subtract(i, 'jMonth').endOf('jMonth');
      const monthName = monthStart.format('jMMMM');

      const [parts, transfers, elevators] = await Promise.all([
        db.query('SELECT COUNT(*) as count FROM parts WHERE user_id = ? AND created_at BETWEEN ? AND ?',
          [userId, monthStart.format('YYYY-MM-DD'), monthEnd.format('YYYY-MM-DD')]),
        db.query('SELECT COUNT(*) as count FROM transfers WHERE (from_user_id = ? OR to_user_id = ?) AND created_at BETWEEN ? AND ?',
          [userId, userId, monthStart.format('YYYY-MM-DD'), monthEnd.format('YYYY-MM-DD')]),
        db.query('SELECT COUNT(*) as count FROM elevators WHERE user_id = ? AND created_at BETWEEN ? AND ?',
          [userId, monthStart.format('YYYY-MM-DD'), monthEnd.format('YYYY-MM-DD')])
      ]);

      monthlyData.push({
        month: monthName,
        parts: parts[0].count,
        transfers: transfers[0].count,
        elevators: elevators[0].count
      });
    }

    res.json({ monthlyData });
  } catch (error) {
    console.error('Error fetching monthly data:', error);
    res.status(500).json({ message: 'خطا در دریافت داده‌های ماهانه' });
  }
};

// ... بقیه توابع مشابه Laravel
```

### 2. Routes (routes/dashboard.js)

```javascript
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/user/dashboard/stats', dashboardController.getStats);
router.get('/user/dashboard/monthly', dashboardController.getMonthlyData);
router.get('/user/dashboard/parts-categories', dashboardController.getPartsCategories);
router.get('/user/dashboard/activities', dashboardController.getRecentActivities);
router.get('/user/profile/check', dashboardController.checkProfileComplete);

module.exports = router;
```

---

## نمونه کد Django

### views.py

```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Q
from datetime import datetime, timedelta
from .models import Part, Transfer, Elevator, Request, Activity
import jdatetime

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_stats(request):
    user = request.user
    current_month = jdatetime.datetime.now().replace(day=1)
    previous_month = current_month - timedelta(days=1)
    previous_month = previous_month.replace(day=1)

    # آمار قطعات
    parts_count = Part.objects.filter(user=user).count()
    parts_last_month = Part.objects.filter(
        user=user,
        created_at__gte=previous_month
    ).count()

    # آمار انتقالات
    transfers_count = Transfer.objects.filter(
        Q(from_user=user) | Q(to_user=user)
    ).count()
    
    # ... ادامه مشابه Laravel

    return Response({
        'partsCount': parts_count,
        'transfersCount': transfers_count,
        'elevatorsCount': elevators_count,
        'requestsCount': requests_count,
        'partsChange': parts_last_month,
        'transfersChange': transfers_last_month,
        'elevatorsChange': elevators_last_month,
        'requestsChange': requests_change
    })
```

---

## بهینه‌سازی و Performance

### 1. Caching

```php
use Illuminate\Support\Facades\Cache;

public function getStats(Request $request)
{
    $userId = $request->user()->id;
    $cacheKey = "dashboard_stats_{$userId}";

    return Cache::remember($cacheKey, 300, function () use ($userId) {
        // محاسبات آمار
        return [
            'partsCount' => ...,
            // ...
        ];
    });
}
```

### 2. Database Indexing

```sql
-- ایندکس‌های لازم برای بهینه‌سازی
CREATE INDEX idx_parts_user_created ON parts(user_id, created_at);
CREATE INDEX idx_transfers_users_created ON transfers(from_user_id, to_user_id, created_at);
CREATE INDEX idx_elevators_user_created ON elevators(user_id, created_at);
CREATE INDEX idx_requests_user_status ON requests(user_id, status);
CREATE INDEX idx_activities_user_created ON activities(user_id, created_at);
```

### 3. Query Optimization

```php
// استفاده از Eager Loading
$activities = Activity::with(['user', 'part'])
    ->where('user_id', $userId)
    ->limit(10)
    ->get();

// استفاده از Raw Query برای عملیات سنگین
$stats = DB::select("
    SELECT 
        (SELECT COUNT(*) FROM parts WHERE user_id = ?) as parts_count,
        (SELECT COUNT(*) FROM transfers WHERE from_user_id = ? OR to_user_id = ?) as transfers_count,
        (SELECT COUNT(*) FROM elevators WHERE user_id = ?) as elevators_count,
        (SELECT COUNT(*) FROM requests WHERE user_id = ? AND status = 'open') as requests_count
", [$userId, $userId, $userId, $userId, $userId]);
```

---

## تست

### Unit Test (PHPUnit)

```php
public function test_get_stats_returns_correct_data()
{
    $user = User::factory()->create();
    Part::factory()->count(10)->create(['user_id' => $user->id]);
    
    $response = $this->actingAs($user)
        ->getJson('/api/user/dashboard/stats');
    
    $response->assertStatus(200)
        ->assertJson([
            'partsCount' => 10
        ]);
}
```

---

**نکته**: این کدها نمونه هستند و باید با توجه به ساختار دقیق پروژه تنظیم شوند.
