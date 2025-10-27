# 📊 مستندات کامل Dashboard - سامانه ردیابی قطعات آسانسور

## 🎯 خلاصه

این مستندات راهنمای کامل پیاده‌سازی و استفاده از سیستم داشبورد کاربر است که شامل:
- ✅ آمار لحظه‌ای (قطعات، انتقال‌ها، آسانسورها، درخواست‌ها)
- ✅ نمودارهای تعاملی (روند ماهانه، توزیع دسته‌بندی)
- ✅ فعالیت‌های اخیر
- ✅ بررسی وضعیت پروفایل

---

## 📚 مستندات موجود

### 1. 📖 Dashboard API Endpoints
**فایل:** [`Dashboard-API-Endpoints.md`](./Dashboard-API-Endpoints.md)

**برای چه کسانی:** Frontend & Backend Developers

**محتوا:**
- توضیحات کامل تمام endpoint‌ها
- نمونه Request/Response
- فیلدها و نوع داده‌ها
- کدهای خطای احتمالی
- نمونه کد JavaScript/TypeScript

**Endpoints تعریف شده:**
```
GET /user/dashboard/stats
GET /user/dashboard/monthly
GET /user/dashboard/parts-categories
GET /user/dashboard/activities
GET /user/profile/check
```

---

### 2. 🎨 Dashboard Implementation Guide (Frontend)
**فایل:** [`Dashboard-Implementation-Guide.md`](./Dashboard-Implementation-Guide.md)

**برای چه کسانی:** Frontend Developers

**محتوا:**
- معماری و ساختار فایل‌ها
- نحوه استفاده از `dashboard.service.ts`
- مثال‌های کامل کامپوننت React
- مدیریت state (Context, Redux, Zustand)
- مدیریت خطا
- بهینه‌سازی و Performance
- تست (Unit & Integration)

**نکات کلیدی:**
- استفاده از `DashboardService.loadAll()` برای بارگذاری موازی
- Caching و بهینه‌سازی
- React Query برای state management
- Error handling پیشرفته

---

### 3. 💻 Dashboard Backend Implementation
**فایل:** [`Dashboard-Backend-Implementation.md`](./Dashboard-Backend-Implementation.md)

**برای چه کسانی:** Backend Developers

**محتوا:**
- Database Schema مورد نیاز
- نمونه کد کامل Laravel
- نمونه کد کامل Node.js/Express
- نمونه کد Django
- بهینه‌سازی Query‌ها
- Caching Strategy
- Indexing
- نمونه تست‌ها

**Framework‌های پوشش داده شده:**
- ✅ Laravel/PHP
- ✅ Node.js/Express
- ✅ Django/Python

---

## 🚀 شروع سریع

### برای Frontend Developers

#### گام 1: Import کردن سرویس
```typescript
import DashboardService from '../services/dashboard.service';
```

#### گام 2: بارگذاری داده‌ها
```typescript
const dashboardData = await DashboardService.loadAll();
```

#### گام 3: استفاده در کامپوننت
```typescript
const [stats, setStats] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function loadDashboard() {
    try {
      const data = await DashboardService.loadAll();
      setStats(data.stats);
      setMonthlyData(data.monthlyData);
      // ...
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }
  
  loadDashboard();
}, []);
```

**مستندات کامل:** [Dashboard Implementation Guide](./Dashboard-Implementation-Guide.md)

---

### برای Backend Developers

#### گام 1: ایجاد جداول Database
```sql
CREATE TABLE parts (...);
CREATE TABLE transfers (...);
CREATE TABLE elevators (...);
CREATE TABLE requests (...);
CREATE TABLE activities (...);
```

#### گام 2: پیاده‌سازی Controller
```php
// Laravel
class UserDashboardController extends Controller
{
    public function getStats(Request $request) {
        // ...
    }
}
```

#### گام 3: تعریف Routes
```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user/dashboard/stats', [UserDashboardController::class, 'getStats']);
    // ...
});
```

**مستندات کامل:** [Dashboard Backend Implementation](./Dashboard-Backend-Implementation.md)

---

## 📊 معماری کلی

### جریان داده (Data Flow)

```
┌─────────────────┐
│  React Component│
│   (Dashboard)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Dashboard       │
│ Service         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ API Client      │
│ (Axios)         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ REST API        │
│ (Laravel/Node)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Database        │
│ (MySQL/Postgres)│
└─────────────────┘
```

### ساختار فایل‌ها

```
project/
├── components/
│   ├── api-user/
│   │   └── Dashboard.tsx          # کامپوننت داشبورد API
│   └── user/
│       └── Dashboard.tsx          # کامپوننت داشبورد Demo
│
├── services/
│   ├── dashboard.service.ts       # سرویس‌های داشبورد
│   └── index.ts                   # Export همه سرویس‌ها
│
├── lib/
│   └── real-api-client.ts         # HTTP Client
│
└── docs/
    ├── Dashboard-README.md                    # این فایل
    ├── Dashboard-API-Endpoints.md            # مستندات endpoint‌ها
    ├── Dashboard-Implementation-Guide.md     # راهنمای Frontend
    └── Dashboard-Backend-Implementation.md   # راهنمای Backend
```

---

## 🔑 ویژگی‌های کلیدی

### 1. آمار لحظه‌ای (Real-time Stats)
- ✅ تعداد قطعات در مالکیت
- ✅ تعداد انتقال‌های انجام شده
- ✅ تعداد آسانسورهای ثبت شده
- ✅ تعداد درخواست‌های باز
- ✅ تغییرات ماه جاری (مثبت/منفی)

### 2. نمودارهای تعاملی
- ✅ **نمودار روند ماهانه** (Area Chart)
  - 6 ماه اخیر
  - قطعات، انتقال‌ها، آسانسورها
  
- ✅ **نمودار دایره‌ای دسته‌بندی** (Pie Chart)
  - توزیع انواع قطعات
  - رنگ‌بندی خودکار

### 3. فعالیت‌های اخیر
- ✅ انتقال قطعات
- ✅ ثبت آسانسورهای جدید
- ✅ درخواست‌ها
- ✅ افزودن قطعات
- ✅ نمایش زمان نسبی (۲ ساعت پیش، ۱ روز پیش)
- ✅ وضعیت هر فعالیت (completed, pending, approved)

### 4. بررسی پروفایل
- ✅ تشخیص پروفایل ناقص
- ✅ لیست فیلدهای ناقص
- ✅ نمایش هشدار

---

## 🎨 نمونه UI Components

### KPI Cards
```tsx
<Card>
  <CardContent>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm">قطعات در مالکیت</p>
        <p className="text-2xl font-bold">245</p>
        <span className="text-sm text-green-600">+5 این ماه</span>
      </div>
      <Package className="h-6 w-6 text-blue-600" />
    </div>
  </CardContent>
</Card>
```

### Monthly Chart
```tsx
<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={monthlyData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Area dataKey="parts" fill="#0088FE" />
    <Area dataKey="transfers" fill="#00C49F" />
    <Area dataKey="elevators" fill="#FFBB28" />
  </AreaChart>
</ResponsiveContainer>
```

---

## 🔒 امنیت

### احراز هویت
- ✅ همه endpoint‌ها نیاز به JWT token دارند
- ✅ توکن در header `Authorization: Bearer <token>` ارسال می‌شود
- ✅ Auto refresh در صورت انقضا

### محدودیت‌ها
- ✅ Rate limiting برای جلوگیری از abuse
- ✅ Validation سمت سرور
- ✅ محافظت در برابر SQL Injection

---

## 📈 بهینه‌سازی

### Frontend
- ✅ **Parallel Loading**: بارگذاری موازی تمام endpoint‌ها
- ✅ **Caching**: کش کردن داده‌ها برای 5 دقیقه
- ✅ **Lazy Loading**: بارگذاری تدریجی کامپوننت‌ها
- ✅ **React Query**: استفاده از React Query برای state management

### Backend
- ✅ **Database Indexing**: ایندکس‌های بهینه روی جداول
- ✅ **Query Optimization**: استفاده از JOIN به جای N+1
- ✅ **Caching**: Redis/Memcached برای کش سرور
- ✅ **Pagination**: صفحه‌بندی برای لیست‌های بزرگ

---

## 🧪 تست

### Frontend Testing
```typescript
// Unit Test
test('loads dashboard stats', async () => {
  const stats = await DashboardService.getStats();
  expect(stats.partsCount).toBeGreaterThanOrEqual(0);
});

// Component Test
test('displays dashboard correctly', async () => {
  render(<Dashboard />);
  await waitFor(() => {
    expect(screen.getByText('قطعات در مالکیت')).toBeInTheDocument();
  });
});
```

### Backend Testing
```php
// Laravel Test
public function test_dashboard_stats_returns_correct_data()
{
    $user = User::factory()->create();
    $response = $this->actingAs($user)
        ->getJson('/api/user/dashboard/stats');
    
    $response->assertStatus(200)
        ->assertJsonStructure([
            'partsCount',
            'transfersCount',
            'elevatorsCount',
            'requestsCount'
        ]);
}
```

---

## 🐛 مشکلات رایج و حل آنها

### 1. خطای 401 (Unauthorized)
**علت:** توکن منقضی شده یا نامعتبر

**راه حل:**
```typescript
if (error.response?.status === 401) {
  // پاک کردن توکن و redirect به لاگین
  localStorage.removeItem('token');
  window.location.href = '/login';
}
```

### 2. داده‌ها لود نمی‌شوند
**علت:** مشکل در اتصال به API

**راه حل:**
1. بررسی Console برای خطاها
2. بررسی Network Tab
3. تست endpoint‌ها با Postman
4. بررسی CORS settings

### 3. نمودارها نمایش داده نمی‌شوند
**علت:** فرمت داده‌ها اشتباه است

**راه حل:**
```typescript
// اطمینان از فرمت صحیح داده‌ها
const monthlyData = response.data.monthlyData || [];
if (!Array.isArray(monthlyData)) {
  console.error('Invalid data format');
  return;
}
```

---

## 📱 نمونه‌های کاربردی

### استفاده ساده
```typescript
import DashboardService from '../services/dashboard.service';

const stats = await DashboardService.getStats();
console.log(stats.partsCount); // 245
```

### استفاده پیشرفته با React Query
```typescript
import { useQuery } from '@tanstack/react-query';
import DashboardService from '../services/dashboard.service';

function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: DashboardService.loadAll,
    staleTime: 5 * 60 * 1000, // 5 دقیقه
  });
  
  if (isLoading) return <Loading />;
  if (error) return <Error />;
  
  return <DashboardContent data={data} />;
}
```

### استفاده با Zustand
```typescript
import { create } from 'zustand';
import DashboardService from '../services/dashboard.service';

const useDashboardStore = create((set) => ({
  stats: null,
  loading: false,
  loadDashboard: async () => {
    set({ loading: true });
    const data = await DashboardService.loadAll();
    set({ stats: data.stats, loading: false });
  },
}));
```

---

## 🔗 لینک‌های مرتبط

### مستندات داخلی
- [Dashboard API Endpoints](./Dashboard-API-Endpoints.md) - مستندات endpoint‌ها
- [Dashboard Implementation Guide](./Dashboard-Implementation-Guide.md) - راهنمای Frontend
- [Dashboard Backend Implementation](./Dashboard-Backend-Implementation.md) - راهنمای Backend
- [API Quick Reference](./API-Quick-Reference.md) - مرجع سریع API
- [OpenAPI Specification](./openapi-specification.yaml) - مشخصات کامل API

### کتابخانه‌های استفاده شده
- [React](https://react.dev) - UI Framework
- [Recharts](https://recharts.org) - نمودارها
- [Axios](https://axios-http.com) - HTTP Client
- [React Query](https://tanstack.com/query) - State Management (اختیاری)
- [Zustand](https://zustand-demo.pmnd.rs) - State Management (اختیاری)

---

## 📞 پشتیبانی

### قبل از تماس
1. ✅ بررسی [مشکلات رایج](#-مشکلات-رایج-و-حل-آنها)
2. ✅ بررسی Console Errors
3. ✅ بررسی Network Tab
4. ✅ تست با Postman

### راه‌های ارتباطی
- 📧 Email: support@ieeu.ir
- 📱 تلفن: 021-12345678
- 🌐 Website: https://elevatorid.ieeu.ir

---

## 🎯 نقشه راه (Roadmap)

### نسخه فعلی (v1.0)
- ✅ آمار کامل داشبورد
- ✅ نمودارهای تعاملی
- ✅ فعالیت‌های اخیر
- ✅ بررسی پروفایل

### نسخه آینده (v1.1)
- ⏳ Real-time updates با WebSocket
- ⏳ Export به PDF/Excel
- ⏳ فیلترهای پیشرفته
- ⏳ Notification system

### نسخه آینده (v2.0)
- 📋 Dashboard customization
- 📋 Widget system
- 📋 Advanced analytics
- 📋 ML-based predictions

---

## 📄 License

این پروژه تحت لایسنس MIT منتشر شده است.

---

## 👥 مشارکت

برای مشارکت در این پروژه:
1. Fork کنید
2. Branch جدید بسازید
3. تغییرات را commit کنید
4. Pull Request ارسال کنید

---

**📅 آخرین به‌روزرسانی:** 1403/08/05 (اکتبر 2024)  
**📌 نسخه:** 1.0.0  
**✅ وضعیت:** فعال و آماده استفاده

---

**💡 نکته:** این مستندات به طور مداوم به‌روزرسانی می‌شود. برای آخرین تغییرات به repository رجوع کنید.
