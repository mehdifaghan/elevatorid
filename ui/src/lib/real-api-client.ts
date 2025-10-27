import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { apiConfig } from '../config/api.config';

// Get API configuration dynamically
const getAPIBaseURL = () => apiConfig.getConfig().fullURL;

// Create axios instance for real API
const realApiClient: AxiosInstance = axios.create({
  baseURL: getAPIBaseURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Update baseURL dynamically when config changes
apiConfig.subscribe((config) => {
  realApiClient.defaults.baseURL = config.fullURL;
  console.log('✅ API Base URL updated:', config.fullURL);
});

// Token management
export const getRealApiTokens = () => {
  return {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  };
};

// Request interceptor to add auth token
realApiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = getRealApiTokens();
    if (accessToken && accessToken !== 'mock-access-token') {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors and token refresh
realApiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    const { refreshToken } = getRealApiTokens();

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && refreshToken && refreshToken !== 'mock-refresh-token' && originalRequest) {
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return realApiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API error types
export interface RealApiError {
  isNetworkError: boolean;
  isAuthError: boolean;
  isServerError: boolean;
  message: string;
  statusCode?: number;
  details?: any;
}

// Helper function to classify API errors
export const classifyApiError = (error: any): RealApiError => {
  // Network errors (no response)
  if (!error.response) {
    return {
      isNetworkError: true,
      isAuthError: false,
      isServerError: false,
      message: 'عدم دسترسی به سرور. لطفاً اتصال اینترنت خود را بررسی کنید.',
      details: error.message
    };
  }

  const statusCode = error.response.status;
  
  // Authentication errors
  if (statusCode === 401 || statusCode === 403) {
    return {
      isNetworkError: false,
      isAuthError: true,
      isServerError: false,
      message: 'خطای احراز هویت. لطفاً مجدداً وارد شوید.',
      statusCode,
      details: error.response.data
    };
  }

  // Server errors
  if (statusCode >= 500) {
    return {
      isNetworkError: false,
      isAuthError: false,
      isServerError: true,
      message: 'خطای سرور. لطفاً دوباره تلاش کنید.',
      statusCode,
      details: error.response.data
    };
  }

  // Client errors
  const errorMessage = error.response.data?.message || 
                      error.response.data?.error || 
                      'خطا در درخواست';

  return {
    isNetworkError: false,
    isAuthError: false,
    isServerError: false,
    message: errorMessage,
    statusCode,
    details: error.response.data
  };
};

// Real API request helpers
export const realApiRequest = {
  get: async function<T>(url: string, params?: any): Promise<T> {
    try {
      const response = await realApiClient.get(url, { params });
      return response.data;
    } catch (error) {
      throw classifyApiError(error);
    }
  },
    
  post: async function<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await realApiClient.post(url, data);
      return response.data;
    } catch (error) {
      throw classifyApiError(error);
    }
  },
    
  put: async function<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await realApiClient.put(url, data);
      return response.data;
    } catch (error) {
      throw classifyApiError(error);
    }
  },
    
  delete: async function<T>(url: string): Promise<T> {
    try {
      const response = await realApiClient.delete(url);
      return response.data;
    } catch (error) {
      throw classifyApiError(error);
    }
  },
    
  upload: async function<T>(url: string, formData: FormData): Promise<T> {
    try {
      const response = await realApiClient.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw classifyApiError(error);
    }
  },

  // Helper to check API availability
  checkApiStatus: async function(): Promise<boolean> {
    try {
      await realApiClient.get('/health', { timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }
};

export default realApiClient;