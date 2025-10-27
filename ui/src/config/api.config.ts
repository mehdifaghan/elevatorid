/**
 * API Configuration Management
 * مدیریت تنظیمات API - پشتیبانی از base URL دینامیک
 */

export interface APIEnvironment {
  name: string;
  displayName: string;
  baseURL: string;
  version: string;
  description?: string;
}

/**
 * تولید URL خودکار API بر اساس دامنه فعلی
 * برای مثال: example.com -> https://api.example.com
 */
const getAutoDomainAPIUrl = (): string => {
  if (typeof window === 'undefined') {
    return 'https://api.elevatorid.ir'; // fallback for SSR
  }

  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  // برای localhost از پورت 3000 استفاده کن
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  
  // برای دامنه‌های واقعی، api. را اضافه کن
  return `${protocol}//api.${hostname}`;
};

// تعریف محیط‌های مختلف API
export const API_ENVIRONMENTS: Record<string, APIEnvironment> = {
  auto: {
    name: 'auto',
    displayName: 'خودکار (بر اساس دامنه)',
    baseURL: getAutoDomainAPIUrl(),
    version: 'v1',
    description: 'تشخیص خودکار API بر اساس دامنه فعلی - Auto Detect'
  },
  production: {
    name: 'production',
    displayName: 'سرور اصلی',
    baseURL: 'https://api.elevatorid.ir',
    version: 'v1',
    description: 'سرور تولید - Production'
  },
  staging: {
    name: 'staging',
    displayName: 'سرور تست',
    baseURL: 'https://staging.api.elevatorid.ir',
    version: 'v1',
    description: 'سرور آزمایشی - Staging'
  },
  development: {
    name: 'development',
    displayName: 'سرور توسعه',
    baseURL: 'https://dev.api.elevatorid.ir',
    version: 'v1',
    description: 'سرور توسعه - Development'
  },
  local: {
    name: 'local',
    displayName: 'سرور محلی',
    baseURL: 'http://localhost:3000',
    version: 'v1',
    description: 'سرور محلی - Local Development'
  },
  custom: {
    name: 'custom',
    displayName: 'سرور سفارشی',
    baseURL: '',
    version: 'v1',
    description: 'آدرس سفارشی - Custom URL'
  }
};

// کلید ذخیره‌سازی در localStorage
const STORAGE_KEYS = {
  ENVIRONMENT: 'api_environment',
  CUSTOM_URL: 'api_custom_url',
  CUSTOM_VERSION: 'api_custom_version'
} as const;

/**
 * API Configuration Manager Class
 * کلاس مدیریت پیکربندی API
 */
class APIConfigManager {
  private currentEnvironment: string;
  private customURL: string;
  private customVersion: string;
  private listeners: Set<(config: { baseURL: string; version: string }) => void>;

  constructor() {
    // خواندن تنظیمات از localStorage
    this.currentEnvironment = this.loadFromStorage(STORAGE_KEYS.ENVIRONMENT, 'auto');
    this.customURL = this.loadFromStorage(STORAGE_KEYS.CUSTOM_URL, '');
    this.customVersion = this.loadFromStorage(STORAGE_KEYS.CUSTOM_VERSION, 'v1');
    this.listeners = new Set();

    // اعتبارسنجی محیط
    if (!API_ENVIRONMENTS[this.currentEnvironment]) {
      this.currentEnvironment = 'auto';
      this.saveToStorage(STORAGE_KEYS.ENVIRONMENT, 'auto');
    }
  }

  /**
   * دریافت تنظیمات فعلی API
   */
  getConfig(): { baseURL: string; version: string; fullURL: string } {
    const env = this.getCurrentEnvironment();
    
    if (env.name === 'custom' && this.customURL) {
      const version = this.customVersion || 'v1';
      return {
        baseURL: this.customURL,
        version,
        fullURL: `${this.customURL}/${version}`
      };
    }

    return {
      baseURL: env.baseURL,
      version: env.version,
      fullURL: `${env.baseURL}/${env.version}`
    };
  }

  /**
   * دریافت محیط فعلی
   */
  getCurrentEnvironment(): APIEnvironment {
    const env = API_ENVIRONMENTS[this.currentEnvironment];
    
    // برای محیط custom، از URL سفارشی استفاده کن
    if (this.currentEnvironment === 'custom' && this.customURL) {
      return {
        ...env,
        baseURL: this.customURL,
        version: this.customVersion || 'v1'
      };
    }
    
    // برای محیط auto، URL را مجدداً محاسبه کن (برای دامنه‌های مختلف)
    if (this.currentEnvironment === 'auto') {
      return {
        ...env,
        baseURL: getAutoDomainAPIUrl()
      };
    }
    
    return env;
  }

  /**
   * تنظیم محیط جدید
   */
  setEnvironment(environmentName: string): void {
    if (!API_ENVIRONMENTS[environmentName]) {
      console.error(`Invalid environment: ${environmentName}`);
      return;
    }

    this.currentEnvironment = environmentName;
    this.saveToStorage(STORAGE_KEYS.ENVIRONMENT, environmentName);
    this.notifyListeners();
  }

  /**
   * تنظیم URL سفارشی
   */
  setCustomURL(url: string, version: string = 'v1'): void {
    // حذف slash انتهایی
    const cleanURL = url.replace(/\/$/, '');
    
    this.customURL = cleanURL;
    this.customVersion = version;
    this.currentEnvironment = 'custom';

    this.saveToStorage(STORAGE_KEYS.CUSTOM_URL, cleanURL);
    this.saveToStorage(STORAGE_KEYS.CUSTOM_VERSION, version);
    this.saveToStorage(STORAGE_KEYS.ENVIRONMENT, 'custom');
    
    this.notifyListeners();
  }

  /**
   * دریافت لیست تمام محیط‌ها
   */
  getAvailableEnvironments(): APIEnvironment[] {
    return Object.values(API_ENVIRONMENTS);
  }

  /**
   * بازنشانی به تنظیمات پیش‌فرض
   */
  reset(): void {
    this.currentEnvironment = 'auto';
    this.customURL = '';
    this.customVersion = 'v1';

    localStorage.removeItem(STORAGE_KEYS.ENVIRONMENT);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_URL);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_VERSION);

    this.notifyListeners();
  }

  /**
   * اشتراک در تغییرات پیکربندی
   */
  subscribe(listener: (config: { baseURL: string; version: string }) => void): () => void {
    this.listeners.add(listener);
    
    // بازگرداندن تابع unsubscribe
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * اعلام تغییرات به listeners
   */
  private notifyListeners(): void {
    const config = this.getConfig();
    this.listeners.forEach(listener => {
      try {
        listener(config);
      } catch (error) {
        console.error('Error in API config listener:', error);
      }
    });
  }

  /**
   * ذخیره‌سازی در localStorage
   */
  private saveToStorage(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage:`, error);
    }
  }

  /**
   * خواندن از localStorage
   */
  private loadFromStorage(key: string, defaultValue: string): string {
    try {
      return localStorage.getItem(key) || defaultValue;
    } catch (error) {
      console.error(`Failed to load ${key} from localStorage:`, error);
      return defaultValue;
    }
  }

  /**
   * بررسی وضعیت اتصال به API
   */
  async checkConnection(): Promise<{ success: boolean; message: string; latency?: number }> {
    const config = this.getConfig();
    const startTime = Date.now();

    try {
      const response = await fetch(`${config.fullURL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      const latency = Date.now() - startTime;

      if (response.ok) {
        return {
          success: true,
          message: `اتصال برقرار شد (${latency}ms)`,
          latency
        };
      } else {
        return {
          success: false,
          message: `خطای سرور: ${response.status} ${response.statusText}`
        };
      }
    } catch (error: any) {
      const latency = Date.now() - startTime;
      
      if (error.name === 'AbortError') {
        return {
          success: false,
          message: 'زمان اتصال به پایان رسید (Timeout)'
        };
      }

      return {
        success: false,
        message: error.message || 'خطا در برقراری اتصال',
        latency
      };
    }
  }

  /**
   * دریافت اطلاعات debug
   */
  getDebugInfo(): Record<string, any> {
    return {
      currentEnvironment: this.currentEnvironment,
      config: this.getConfig(),
      customURL: this.customURL,
      customVersion: this.customVersion,
      availableEnvironments: this.getAvailableEnvironments().map(env => env.name),
      storageKeys: {
        environment: localStorage.getItem(STORAGE_KEYS.ENVIRONMENT),
        customURL: localStorage.getItem(STORAGE_KEYS.CUSTOM_URL),
        customVersion: localStorage.getItem(STORAGE_KEYS.CUSTOM_VERSION)
      }
    };
  }
}

// ایجاد نمونه singleton
export const apiConfig = new APIConfigManager();

// Export برای استفاده راحت‌تر
export const getAPIConfig = () => apiConfig.getConfig();
export const getAPIBaseURL = () => apiConfig.getConfig().fullURL;
export const getCurrentEnvironment = () => apiConfig.getCurrentEnvironment();

// Export default
export default apiConfig;
