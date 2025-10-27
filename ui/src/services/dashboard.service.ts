import { realApiRequest } from '../lib/real-api-client';

/**
 * سرویس داشبورد کاربر
 * 
 * این سرویس شامل تمام endpoint‌های مورد نیاز برای داشبورد کاربر است
 */

// ================== Types ==================

export interface DashboardStats {
  partsCount: number;
  transfersCount: number;
  elevatorsCount: number;
  requestsCount: number;
  partsChange: number;
  transfersChange: number;
  elevatorsChange: number;
  requestsChange: number;
}

export interface MonthlyDataItem {
  month: string;
  parts: number;
  transfers: number;
  elevators: number;
}

export interface MonthlyDataResponse {
  monthlyData: MonthlyDataItem[];
}

export interface PartCategory {
  name: string;
  value: number;
  color: string;
}

export interface PartsCategoriesResponse {
  categories: PartCategory[];
}

export interface Activity {
  id: string;
  type: 'transfer' | 'elevator' | 'request' | 'part';
  title: string;
  description: string;
  time: string;
  status: 'completed' | 'pending' | 'approved';
}

export interface ActivitiesResponse {
  activities: Activity[];
}

export interface ProfileCheckResponse {
  isComplete: boolean;
  missingFields: string[];
}

// ================== Service Functions ==================

/**
 * دریافت آمار کامل داشبورد
 * 
 * @returns {Promise<DashboardStats>} آمار داشبورد شامل تعداد قطعات، انتقال‌ها، آسانسورها و درخواست‌ها
 * 
 * @example
 * ```typescript
 * const stats = await DashboardService.getStats();
 * console.log(`تعداد قطعات: ${stats.partsCount}`);
 * ```
 */
export async function getStats(): Promise<DashboardStats> {
  const response = await realApiRequest.get<DashboardStats>('/user/dashboard/stats');
  return response.data;
}

/**
 * دریافت داده‌های ماهانه برای نمودار
 * 
 * @returns {Promise<MonthlyDataItem[]>} داده‌های 6 ماه اخیر
 * 
 * @example
 * ```typescript
 * const monthlyData = await DashboardService.getMonthlyData();
 * // استفاده در نمودار recharts
 * <AreaChart data={monthlyData}>...</AreaChart>
 * ```
 */
export async function getMonthlyData(): Promise<MonthlyDataItem[]> {
  const response = await realApiRequest.get<MonthlyDataResponse>('/user/dashboard/monthly');
  return response.data.monthlyData || [];
}

/**
 * دریافت توزیع دسته‌بندی قطعات
 * 
 * @returns {Promise<PartCategory[]>} لیست دسته‌بندی‌ها با تعداد و رنگ
 * 
 * @example
 * ```typescript
 * const categories = await DashboardService.getPartsCategories();
 * // استفاده در نمودار دایره‌ای
 * <PieChart>
 *   <Pie data={categories} dataKey="value" nameKey="name" />
 * </PieChart>
 * ```
 */
export async function getPartsCategories(): Promise<PartCategory[]> {
  const response = await realApiRequest.get<PartsCategoriesResponse>('/user/dashboard/parts-categories');
  return response.data.categories || [];
}

/**
 * دریافت فعالیت‌های اخیر کاربر
 * 
 * @returns {Promise<Activity[]>} لیست فعالیت‌های اخیر
 * 
 * @example
 * ```typescript
 * const activities = await DashboardService.getRecentActivities();
 * activities.forEach(activity => {
 *   console.log(`${activity.title} - ${activity.status}`);
 * });
 * ```
 */
export async function getRecentActivities(): Promise<Activity[]> {
  const response = await realApiRequest.get<ActivitiesResponse>('/user/dashboard/activities');
  return response.data.activities || [];
}

/**
 * بررسی تکمیل بودن پروفایل کاربر
 * 
 * @returns {Promise<ProfileCheckResponse>} وضعیت پروفایل و فیلدهای ناقص
 * 
 * @example
 * ```typescript
 * const { isComplete, missingFields } = await DashboardService.checkProfileComplete();
 * if (!isComplete) {
 *   console.log('فیلدهای ناقص:', missingFields);
 * }
 * ```
 */
export async function checkProfileComplete(): Promise<ProfileCheckResponse> {
  const response = await realApiRequest.get<ProfileCheckResponse>('/user/profile/check');
  return response.data;
}

/**
 * بارگذاری کامل داده‌های داشبورد
 * 
 * این تابع تمام endpoint‌های داشبورد را به صورت موازی فراخوانی می‌کند
 * برای بهینه‌سازی سرعت بارگذاری
 * 
 * @returns {Promise<DashboardData>} تمام داده‌های داشبورد
 * 
 * @example
 * ```typescript
 * try {
 *   const dashboardData = await DashboardService.loadAll();
 *   // استفاده از داده‌ها
 *   setStats(dashboardData.stats);
 *   setMonthlyData(dashboardData.monthlyData);
 * } catch (error) {
 *   console.error('خطا در بارگذاری داشبورد:', error);
 * }
 * ```
 */
export async function loadAll() {
  const [stats, monthlyData, categories, activities, profileCheck] = await Promise.all([
    getStats(),
    getMonthlyData(),
    getPartsCategories(),
    getRecentActivities(),
    checkProfileComplete(),
  ]);

  return {
    stats,
    monthlyData,
    categories,
    activities,
    profileCheck,
  };
}

// Export as default object
const DashboardService = {
  getStats,
  getMonthlyData,
  getPartsCategories,
  getRecentActivities,
  checkProfileComplete,
  loadAll,
};

export default DashboardService;
