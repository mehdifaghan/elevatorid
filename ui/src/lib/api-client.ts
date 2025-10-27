import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { toast } from 'sonner@2.0.3';
import { apiConfig } from '../config/api.config';
import { 
  mockUsers, 
  mockParts, 
  mockElevators, 
  mockTransfers, 
  mockRequests, 
  mockComplaints, 
  mockCategories,
  mockFeatures,
  mockSettings,
  createMockPaginatedResponse,
  mockApiDelay
} from './mock-data';

// Get API configuration dynamically
const getAPIBaseURL = () => apiConfig.getConfig().fullURL;

// Enable mock mode for development - DISABLED FOR REAL API TESTING
const USE_MOCK_API = false; // Forced to false for real API testing

// Set mock tokens when using mock API - DISABLED FOR REAL API TESTING
if (USE_MOCK_API && !localStorage.getItem('accessToken')) {
  localStorage.setItem('accessToken', 'mock-access-token');
  localStorage.setItem('refreshToken', 'mock-refresh-token');
  accessToken = 'mock-access-token';
  refreshToken = 'mock-refresh-token';
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: getAPIBaseURL(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Update baseURL dynamically when config changes
apiConfig.subscribe((config) => {
  apiClient.defaults.baseURL = config.fullURL;
  console.log('✅ API Base URL updated:', config.fullURL);
});

// Token management
let accessToken: string | null = null;
let refreshToken: string | null = null;

export const setTokens = (access: string, refresh: string) => {
  accessToken = access;
  refreshToken = refresh;
  localStorage.setItem('accessToken', access);
  localStorage.setItem('refreshToken', refresh);
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const getStoredTokens = () => {
  return {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  };
};

// Initialize tokens from storage
const storedTokens = getStoredTokens();
if (storedTokens.accessToken && storedTokens.refreshToken) {
  accessToken = storedTokens.accessToken;
  refreshToken = storedTokens.refreshToken;
}

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors and token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    // Skip error handling for mock API
    if (USE_MOCK_API) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && refreshToken && originalRequest) {
      try {
        const response = await axios.post(`${getAPIBaseURL()}/auth/refresh`, {}, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
        setTokens(newAccessToken, newRefreshToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error('خطایی در ارتباط با سرور رخ داده است');
    }

    return Promise.reject(error);
  }
);

// Mock API router
async function mockApiRequest(method: string, url: string, data?: any, params?: any): Promise<any> {
  await mockApiDelay(); // Simulate network delay

  // Parse URL and params
  const [path, queryString] = url.split('?');
  const searchParams = new URLSearchParams(queryString);
  const page = parseInt(params?.page || searchParams.get('page') || '1');
  const size = parseInt(params?.size || searchParams.get('size') || '20');
  const searchTerm = params?.q || searchParams.get('q');

  // Route mock requests
  if (path === '/admin/dashboard/stats') {
    return {
      totalElevators: mockElevators.length,
      totalParts: mockParts.length,
      totalTransfers: mockTransfers.length,
      totalUsers: mockUsers.length,
      pendingRequests: mockRequests.filter(r => r.status === 'pending').length,
      activeTransfers: mockTransfers.filter(t => t.status === 'in_transit').length,
      recentActivity: [
        {
          id: '1',
          type: 'قطعه',
          description: 'قطعه جدید ثبت شد',
          timestamp: new Date().toLocaleString('fa-IR'),
          status: 'success'
        },
        {
          id: '2',
          type: 'انتقال',
          description: 'انتقال تکمیل شد',
          timestamp: new Date(Date.now() - 3600000).toLocaleString('fa-IR'),
          status: 'success'
        }
      ]
    };
  }

  if (path === '/parts/all') {
    return mockParts;
  }
  
  if (path === '/admin/users') {
    return createMockPaginatedResponse(mockUsers, page, size, searchTerm);
  }
  
  if (path.match(/^\/admin\/users\/\d+$/)) {
    const userId = parseInt(path.split('/').pop()!);
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error('کاربر یافت نشد');
    return user;
  }

  if (path === '/admin/users' && method === 'POST') {
    return { id: Date.now(), ...data, status: 'pending' };
  }

  if (path.match(/^\/admin\/users\/\d+$/) && method === 'PUT') {
    // Handle user access update
    const userId = parseInt(path.split('/').pop()!);
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex !== -1 && data) {
      // Update user data with new access settings
      if (data.status) {
        mockUsers[userIndex].status = data.status;
      }
      if (data.profileTypes) {
        mockUsers[userIndex].profileTypes = data.profileTypes;
      }
      // Note: permissions would be stored in a separate field in real implementation
    }
    
    return { 
      success: true, 
      message: data.permissions || data.profileTypes || data.status 
        ? 'سطح دسترسی کاربر بروزرسانی شد' 
        : 'کاربر بروزرسانی شد' 
    };
  }

  if (path.match(/^\/admin\/users\/\d+$/) && method === 'DELETE') {
    return { success: true, message: 'کاربر حذف شد' };
  }

  if (path.match(/^\/admin\/users\/\d+\/sms$/)) {
    return { success: true, message: 'پیامک ارسال شد' };
  }

  if (path === '/admin/coworkers' && method === 'POST') {
    return { id: Date.now(), ...data, message: 'کاربر همکار ایجاد شد' };
  }

  if (path === '/parts') {
    let filteredParts = [...mockParts];
    
    // Apply ownerType filter
    if (params?.ownerType === 'company') {
      filteredParts = filteredParts.filter(part => 
        part.currentOwner?.type === 'company'
      );
    }
    
    const result = createMockPaginatedResponse(filteredParts, page, size, searchTerm);
    return {
      success: true,
      data: result
    };
  }

  if (path === '/elevators') {
    if (method === 'GET') {
      return createMockPaginatedResponse(mockElevators, page, size, searchTerm);
    }
    if (method === 'POST') {
      // Create new elevator
      const uid = `ELE-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}-2024`;
      const newElevator = {
        id: Date.now(),
        uid,
        status: 'active',
        certificationStatus: 'valid',
        installationDate: data.installationDate || new Date().toISOString(),
        lastMaintenanceDate: new Date().toISOString(),
        nextMaintenanceDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data
      };
      
      // Add to mock data for persistence during session
      mockElevators.unshift(newElevator);
      
      return {
        success: true,
        data: newElevator,
        message: `آسانسور با شناسه ${uid} ثبت شد`
      };
    }
  }

  if (path === '/transfers') {
    return createMockPaginatedResponse(mockTransfers, page, size, searchTerm);
  }

  if (path === '/requests') {
    return createMockPaginatedResponse(mockRequests, page, size, searchTerm);
  }

  if (path === '/complaints') {
    return createMockPaginatedResponse(mockComplaints, page, size, searchTerm);
  }

  if (path === '/categories') {
    if (method === 'GET') {
      const result = createMockPaginatedResponse(mockCategories, page, size, searchTerm);
      return { 
        success: true,
        data: params?.flat ? mockCategories : result
      };
    }
    
    if (method === 'POST') {
      const newCategory = {
        id: Date.now(),
        parentId: data?.parentId || null,
        title: data?.title || 'دسته‌بندی جدید',
        slug: data?.slug || data?.title?.toLowerCase().replace(/\s+/g, '-') || 'new-category',
        path: data?.parentId ? `/parent/${data.parentId}/${data.slug}` : `/${data.slug}`,
        depth: data?.parentId ? 1 : 0,
        isActive: data?.isActive !== false
      };
      
      // Add to mock data for session persistence
      mockCategories.push(newCategory);
      
      return {
        success: true,
        data: newCategory,
        message: 'دسته‌بندی ایجاد شد'
      };
    }
  }

  if (path.match(/^\/categories\/\d+$/)) {
    const categoryId = parseInt(path.split('/').pop()!);
    const categoryIndex = mockCategories.findIndex(c => c.id === categoryId);
    
    if (method === 'PUT' && categoryIndex !== -1) {
      mockCategories[categoryIndex] = {
        ...mockCategories[categoryIndex],
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      return {
        success: true,
        data: mockCategories[categoryIndex],
        message: 'دسته‌بندی بروزرسانی شد'
      };
    }
    
    if (method === 'DELETE' && categoryIndex !== -1) {
      const deletedCategory = mockCategories.splice(categoryIndex, 1)[0];
      
      return {
        success: true,
        data: deletedCategory,
        message: 'دسته‌بندی حذف شد'
      };
    }
  }

  if (path === '/features') {
    const categoryId = params?.categoryId || searchParams.get('categoryId');
    let features = mockFeatures;
    if (categoryId) {
      features = mockFeatures.filter(f => f.categoryId === parseInt(categoryId));
    }
    return { items: features };
  }

  if (path === '/admin/settings') {
    if (method === 'GET') {
      return mockSettings;
    }
    if (method === 'PUT') {
      return { ...mockSettings, ...data };
    }
  }

  // Mock elevator types management
  if (path === '/admin/elevator-types') {
    if (method === 'GET') {
      const mockElevatorTypes = [
        { id: '1', name: 'آسانسور مسافربری', description: 'آسانسور استاندارد برای حمل مسافر', is_active: true, created_at: '۱۴۰۳/۰۹/۱۵' },
        { id: '2', name: 'آسانسور بار', description: 'آسانسور مخصوص حمل بار سنگین', is_active: true, created_at: '۱۴۰۳/۰۹/۱۴' },
        { id: '3', name: 'آسانسور بیمارستانی', description: 'آسانسور مخصوص استفاده در بیمارستان', is_active: true, created_at: '۱۴۰۳/۰۹/۱۳' },
        { id: '4', name: 'آسانسور ویلایی', description: 'آسانسور کوچک برای منازل', is_active: false, created_at: '۱۴۰۳/۰۹/۱۲' }
      ];
      return { elevator_types: mockElevatorTypes };
    }
    if (method === 'POST') {
      return { 
        success: true, 
        data: { id: Date.now(), ...data, created_at: new Date().toLocaleDateString('fa-IR') },
        message: 'نوع آسانسور جدید ایجاد شد' 
      };
    }
  }

  if (path.match(/^\/admin\/elevator-types\/\d+$/)) {
    if (method === 'PUT') {
      return { success: true, message: 'نوع آسانسور بروزرسانی شد' };
    }
    if (method === 'DELETE') {
      return { success: true, message: 'نوع آسانسور حذف شد' };
    }
  }

  // Mock parts categories management
  if (path === '/admin/parts-categories') {
    if (method === 'GET') {
      const mockPartsCategories = [
        {
          id: '1',
          name: 'موتور آسانسور',
          elevator_type_id: '1',
          technical_specs: [
            { name: 'قدرت', type: 'number', unit: 'کیلووات' },
            { name: 'ولتاژ', type: 'select', unit: 'ولت', options: ['220', '380', '440'] }
          ],
          created_at: '۱۴۰۳/۰۹/۱۵',
          is_active: true
        },
        {
          id: '2',
          name: 'کابل آسانسور',
          elevator_type_id: '1',
          technical_specs: [
            { name: 'قطر', type: 'number', unit: 'میلی‌متر' },
            { name: 'طول', type: 'number', unit: 'متر' }
          ],
          created_at: '۱۴۰۳/۰۹/۱۴',
          is_active: true
        }
      ];
      return { parts_categories: mockPartsCategories };
    }
    if (method === 'POST') {
      return { 
        success: true, 
        data: { id: Date.now(), ...data, created_at: new Date().toLocaleDateString('fa-IR') },
        message: 'دسته‌بندی قطعات جدید ایجاد شد' 
      };
    }
  }

  if (path.match(/^\/admin\/parts-categories\/\d+$/)) {
    if (method === 'PUT') {
      return { success: true, message: 'دسته‌بندی قطعات بروزرسانی شد' };
    }
    if (method === 'DELETE') {
      return { success: true, message: 'دسته‌بندی قطعات حذف شد' };
    }
  }

  if (path === '/admin/requests') {
    return createMockPaginatedResponse(mockRequests, page, size, searchTerm);
  }

  if (path.match(/^\/admin\/requests\/\d+\/review$/)) {
    return { success: true, message: 'درخواست بررسی شد' };
  }

  if (path === '/admin/reports/overview') {
    return {
      summary: {
        partsTotal: mockParts.length,
        transfersTotal: mockTransfers.length,
        elevatorsTotal: mockElevators.length,
        requestsPending: mockRequests.filter(r => r.status === 'pending').length
      },
      series: [
        { date: '2024-01-01', value: 10 },
        { date: '2024-01-02', value: 15 },
        { date: '2024-01-03', value: 12 },
        { date: '2024-01-04', value: 18 },
        { date: '2024-01-05', value: 22 }
      ]
    };
  }

  if (path === '/reports/overview') {
    return {
      summary: {
        partsTotal: mockParts.length,
        transfersTotal: mockTransfers.length,
        elevatorsTotal: mockElevators.length,
        requestsPending: mockRequests.filter(r => r.status === 'pending').length
      },
      series: [
        { date: '2024-01-01', value: 8 },
        { date: '2024-01-02', value: 12 },
        { date: '2024-01-03', value: 10 },
        { date: '2024-01-04', value: 15 },
        { date: '2024-01-05', value: 18 }
      ]
    };
  }

  // Mock captcha endpoints - DISABLED FOR TESTING
  if (path === '/captcha' && false) { // غیرفعال شده برای تست
    if (method === 'GET') {
      // تولید captcha ID تصادفی
      const captchaId = `captcha_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // تولید کد تصادفی
      const captchaCode = Math.floor(1000 + Math.random() * 9000).toString();
      
      // تولید URL تصویر ساده با Canvas
      const canvas = document.createElement('canvas');
      canvas.width = 120;
      canvas.height = 40;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // پس‌زمینه
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // متن
        ctx.font = '20px Arial';
        ctx.fillStyle = '#1f2937';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(captchaCode, canvas.width / 2, canvas.height / 2);
        
        // ذخیره کد برای اعتبارسنجی
        localStorage.setItem(`mock_captcha_${captchaId}`, captchaCode);
        
        return {
          success: true,
          data: {
            captchaId,
            imageUrl: canvas.toDataURL()
          }
        };
      }
    }
  }

  if (path === '/captcha/validate' && false) { // غیرفعال شده برای تست
    if (method === 'POST') {
      const { captchaId, captchaValue } = data || {};
      const storedValue = localStorage.getItem(`mock_captcha_${captchaId}`);
      
      // پاک کردن کد پس از استفاده
      localStorage.removeItem(`mock_captcha_${captchaId}`);
      
      return {
        success: true,
        data: {
          valid: storedValue === captchaValue
        }
      };
    }
  }

  if (path === '/auth/send-otp') {
    // Store phone number for later use
    if (data?.phone) {
      localStorage.setItem('mockAuthPhone', data.phone);
    }
    return { success: true, message: 'کد تایید ارسال شد' };
  }

  if (path === '/auth/verify-otp') {
    // Store phone number for later use
    if (data?.phone) {
      localStorage.setItem('mockAuthPhone', data.phone);
    }
    // Mock OTP verification - always succeed
    return {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token'
    };
  }

  if (path === '/auth/refresh') {
    return {
      accessToken: 'new-mock-access-token',
      refreshToken: 'new-mock-refresh-token'
    };
  }

  if (path === '/auth/logout') {
    localStorage.removeItem('mockAuthPhone');
    return { success: true, message: 'خروج موفق' };
  }

  if (path === '/me') {
    // Get phone from stored auth data
    const storedPhone = localStorage.getItem('mockAuthPhone') || '09122222222';
    const isAdmin = storedPhone === '09121111111';
    
    return {
      user: {
        id: 1,
        phone: storedPhone,
        status: 'active'
      },
      profiles: [
        {
          id: 1,
          profileType: isAdmin ? 'coop_org' : 'producer',
          isActive: true,
          company: {
            id: 1,
            name: isAdmin ? 'مدیر سیستم' : 'شرکت نمونه',
            tradeId: '12345',
            province: 'تهران',
            city: 'تهران',
            address: 'تهران، خیابان ولیعصر، پلاک 123',
            postalCode: '1234567890',
            ceoPhone: '02112345678',
            email: 'info@company.com'
          }
        }
      ]
    };
  }

  // Default response for unhandled routes
  return { success: true, message: 'عملیات با موفقیت انجام شد' };
}

export default apiClient;

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ApiError {
  success: false;
  code: string;
  message: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    size: number;
    total: number;
  };
}

export interface SearchParams {
  q?: string;
  page?: number;
  size?: number;
  sort?: string;
}

// API request helpers
export const apiRequest = {
  get: function<T>(url: string, params?: any): Promise<T> {
    if (USE_MOCK_API) {
      return mockApiRequest('GET', url, undefined, params);
    }
    return apiClient.get(url, { params }).then(res => res.data);
  },
    
  post: function<T>(url: string, data?: any): Promise<T> {
    if (USE_MOCK_API) {
      return mockApiRequest('POST', url, data);
    }
    return apiClient.post(url, data).then(res => res.data);
  },
    
  put: function<T>(url: string, data?: any): Promise<T> {
    if (USE_MOCK_API) {
      return mockApiRequest('PUT', url, data);
    }
    return apiClient.put(url, data).then(res => res.data);
  },
    
  delete: function<T>(url: string): Promise<T> {
    if (USE_MOCK_API) {
      return mockApiRequest('DELETE', url);
    }
    return apiClient.delete(url).then(res => res.data);
  },
    
  upload: function<T>(url: string, formData: FormData): Promise<T> {
    if (USE_MOCK_API) {
      return mockApiRequest('POST', url, formData);
    }
    return apiClient.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },
};