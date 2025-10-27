# راهنمای پیاده‌سازی داشبورد کاربر

این راهنما نحوه استفاده از سرویس داشبورد و اتصال به API را توضیح می‌دهد.

## فهرست مطالب
1. [معماری](#معماری)
2. [نصب و راه‌اندازی](#نصب-و-راه‌اندازی)
3. [استفاده از سرویس](#استفاده-از-سرویس)
4. [کامپوننت داشبورد](#کامپوننت-داشبورد)
5. [مدیریت خطا](#مدیریت-خطا)
6. [بهینه‌سازی](#بهینه‌سازی)

---

## معماری

### ساختار فایل‌ها

```
├── components/
│   ├── api-user/
│   │   └── Dashboard.tsx          # کامپوننت داشبورد متصل به API
│   └── user/
│       └── Dashboard.tsx          # کامپوننت داشبورد دمو (Mock Data)
├── services/
│   └── dashboard.service.ts       # سرویس‌های API داشبورد
├── lib/
│   └── real-api-client.ts         # کلاینت HTTP برای API
└── docs/
    ├── Dashboard-API-Endpoints.md           # مستندات endpoint‌ها
    └── Dashboard-Implementation-Guide.md    # این فایل
```

### جریان داده

```
Component (Dashboard.tsx)
    ↓
Service (dashboard.service.ts)
    ↓
HTTP Client (real-api-client.ts)
    ↓
API Server (https://api.elevatorid.ir/v1)
```

---

## نصب و راه‌اندازی

### پیش‌نیازها

1. **توکن احراز هویت**: کاربر باید لاگین کرده باشد
2. **تنظیمات API**: URL پایه API باید تنظیم شده باشد
3. **دسترسی شبکه**: اتصال به سرور API

### تنظیمات اولیه

#### 1. تنظیم URL پایه API

در فایل `/config/api.config.ts`:

```typescript
export const API_CONFIG = {
  baseURL: 'https://api.elevatorid.ir/v1',
  timeout: 10000,
};
```

#### 2. تنظیم توکن

توکن به صورت خودکار از `localStorage` یا `AuthContext` خوانده می‌شود.

---

## استفاده از سرویس

### Import سرویس

```typescript
import DashboardService from '../services/dashboard.service';
// یا
import { dashboardService } from '../services';
```

### استفاده پایه

```typescript
// دریافت آمار
const stats = await DashboardService.getStats();

// دریافت داده‌های ماهانه
const monthlyData = await DashboardService.getMonthlyData();

// دریافت دسته‌بندی قطعات
const categories = await DashboardService.getPartsCategories();

// دریافت فعالیت‌های اخیر
const activities = await DashboardService.getRecentActivities();

// بررسی تکمیل پروفایل
const profileCheck = await DashboardService.checkProfileComplete();
```

### بارگذاری همزمان (بهینه)

```typescript
// بارگذاری کامل داشبورد با یک فراخوانی
const dashboardData = await DashboardService.loadAll();

// استفاده از داده‌ها
console.log(dashboardData.stats);
console.log(dashboardData.monthlyData);
console.log(dashboardData.categories);
console.log(dashboardData.activities);
console.log(dashboardData.profileCheck);
```

---

## کامپوننت داشبورد

### نمونه کامل کامپوننت

```typescript
import React, { useState, useEffect } from 'react';
import DashboardService, { 
  DashboardStats, 
  MonthlyDataItem, 
  PartCategory, 
  Activity 
} from '../../services/dashboard.service';
import { toast } from 'sonner@2.0.3';

export default function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyDataItem[]>([]);
  const [categories, setCategories] = useState<PartCategory[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [profileIncomplete, setProfileIncomplete] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      
      // بارگذاری همزمان تمام داده‌ها
      const data = await DashboardService.loadAll();
      
      setStats(data.stats);
      setMonthlyData(data.monthlyData);
      setCategories(data.categories);
      setActivities(data.activities);
      setProfileIncomplete(!data.profileCheck.isComplete);
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('خطا در بارگذاری داشبورد');
      
      // تنظیم مقادیر پیش‌فرض در صورت خطا
      setStats({
        partsCount: 0,
        transfersCount: 0,
        elevatorsCount: 0,
        requestsCount: 0,
        partsChange: 0,
        transfersChange: 0,
        elevatorsChange: 0,
        requestsChange: 0
      });
      
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard 
          title="قطعات در مالکیت" 
          value={stats?.partsCount || 0}
          change={stats?.partsChange || 0}
        />
        {/* ... */}
      </div>

      {/* Charts */}
      <MonthlyChart data={monthlyData} />
      <CategoryPieChart data={categories} />
      
      {/* Recent Activities */}
      <ActivitiesList activities={activities} />
    </div>
  );
}
```

### State Management

برای پروژه‌های بزرگتر، می‌توانید از state management استفاده کنید:

#### با Redux Toolkit

```typescript
// dashboardSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import DashboardService from '../services/dashboard.service';

export const fetchDashboard = createAsyncThunk(
  'dashboard/fetchAll',
  async () => {
    return await DashboardService.loadAll();
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: null,
    monthlyData: [],
    categories: [],
    activities: [],
    profileIncomplete: false,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.monthlyData = action.payload.monthlyData;
        state.categories = action.payload.categories;
        state.activities = action.payload.activities;
        state.profileIncomplete = !action.payload.profileCheck.isComplete;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default dashboardSlice.reducer;
```

#### با Zustand

```typescript
// useDashboardStore.ts
import { create } from 'zustand';
import DashboardService from '../services/dashboard.service';

interface DashboardStore {
  stats: any;
  monthlyData: any[];
  categories: any[];
  activities: any[];
  loading: boolean;
  error: string | null;
  loadDashboard: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  stats: null,
  monthlyData: [],
  categories: [],
  activities: [],
  loading: false,
  error: null,
  
  loadDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const data = await DashboardService.loadAll();
      set({
        stats: data.stats,
        monthlyData: data.monthlyData,
        categories: data.categories,
        activities: data.activities,
        loading: false,
      });
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
    }
  },
}));
```

---

## مدیریت خطا

### خطاهای رایج

#### 1. خطای 401 (Unauthorized)

```typescript
try {
  const stats = await DashboardService.getStats();
} catch (error) {
  if (error.response?.status === 401) {
    // توکن منقضی شده - redirect به لاگین
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}
```

#### 2. خطای شبکه

```typescript
try {
  const stats = await DashboardService.getStats();
} catch (error) {
  if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
    toast.error('مشکل در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید.');
  }
}
```

#### 3. خطای سرور (500)

```typescript
try {
  const stats = await DashboardService.getStats();
} catch (error) {
  if (error.response?.status >= 500) {
    toast.error('مشکلی در سرور پیش آمده است. لطفاً بعداً تلاش کنید.');
  }
}
```

### تابع کمکی برای مدیریت خطا

```typescript
function handleDashboardError(error: any) {
  if (!error.response) {
    // خطای شبکه
    toast.error('مشکل در اتصال به سرور');
    return;
  }

  switch (error.response.status) {
    case 401:
      // Unauthorized
      toast.error('لطفاً مجدداً وارد شوید');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      break;
    
    case 403:
      // Forbidden
      toast.error('شما دسترسی لازم را ندارید');
      break;
    
    case 404:
      // Not Found
      toast.error('داده‌های درخواستی یافت نشد');
      break;
    
    case 500:
    case 502:
    case 503:
      // Server Error
      toast.error('مشکلی در سرور پیش آمده است');
      break;
    
    default:
      toast.error('خطای نامشخص');
  }
}
```

---

## بهینه‌سازی

### 1. کش کردن داده‌ها

```typescript
const CACHE_DURATION = 5 * 60 * 1000; // 5 دقیقه
let cachedData: any = null;
let cacheTime: number = 0;

async function loadDashboardWithCache() {
  const now = Date.now();
  
  if (cachedData && (now - cacheTime) < CACHE_DURATION) {
    return cachedData;
  }
  
  const data = await DashboardService.loadAll();
  cachedData = data;
  cacheTime = now;
  
  return data;
}
```

### 2. Lazy Loading

```typescript
// بارگذاری اولیه فقط آمار
const stats = await DashboardService.getStats();

// بارگذاری بقیه در پس‌زمینه
setTimeout(async () => {
  const monthlyData = await DashboardService.getMonthlyData();
  const categories = await DashboardService.getPartsCategories();
  // ...
}, 500);
```

### 3. Polling برای به‌روزرسانی خودکار

```typescript
useEffect(() => {
  // بارگذاری اولیه
  loadDashboard();
  
  // به‌روزرسانی هر 30 ثانیه
  const interval = setInterval(loadDashboard, 30000);
  
  return () => clearInterval(interval);
}, []);
```

### 4. استفاده از React Query

```typescript
import { useQuery } from '@tanstack/react-query';

function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: DashboardService.loadAll,
    staleTime: 5 * 60 * 1000, // 5 دقیقه
    cacheTime: 10 * 60 * 1000, // 10 دقیقه
    refetchInterval: 30000, // هر 30 ثانیه
  });
}

// استفاده در کامپوننت
function Dashboard() {
  const { data, isLoading, error } = useDashboard();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;
  
  return <DashboardContent data={data} />;
}
```

---

## تست

### تست واحد (Unit Test)

```typescript
import { describe, it, expect, vi } from 'vitest';
import DashboardService from './dashboard.service';
import * as apiClient from '../lib/real-api-client';

describe('DashboardService', () => {
  it('should fetch stats successfully', async () => {
    const mockStats = {
      partsCount: 100,
      transfersCount: 50,
      elevatorsCount: 20,
      requestsCount: 5,
      partsChange: 10,
      transfersChange: 5,
      elevatorsChange: 2,
      requestsChange: -1,
    };
    
    vi.spyOn(apiClient.realApiRequest, 'get').mockResolvedValue({
      data: mockStats,
    });
    
    const stats = await DashboardService.getStats();
    
    expect(stats).toEqual(mockStats);
    expect(apiClient.realApiRequest.get).toHaveBeenCalledWith('/user/dashboard/stats');
  });
});
```

### تست یکپارچگی (Integration Test)

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard';

test('loads and displays dashboard data', async () => {
  render(<Dashboard />);
  
  // بررسی loading state
  expect(screen.getByText(/در حال بارگذاری/i)).toBeInTheDocument();
  
  // صبر برای بارگذاری داده‌ها
  await waitFor(() => {
    expect(screen.getByText(/قطعات در مالکیت/i)).toBeInTheDocument();
  });
  
  // بررسی نمایش داده‌ها
  expect(screen.getByText('245')).toBeInTheDocument();
});
```

---

## مثال کامل

فایل `/components/api-user/Dashboard.tsx` یک نمونه کامل از پیاده‌سازی داشبورد با تمام ویژگی‌های ذکر شده است.

برای مشاهده کد کامل، به این فایل مراجعه کنید.

---

## منابع بیشتر

- [مستندات API Endpoints](./Dashboard-API-Endpoints.md)
- [راهنمای real-api-client](../lib/real-api-client.ts)
- [مستندات OpenAPI کامل](./openapi-specification.yaml)

---

**نکته مهم**: همیشه خطاها را به درستی مدیریت کنید و تجربه کاربری خوبی برای حالت‌های خطا و بارگذاری فراهم کنید.
