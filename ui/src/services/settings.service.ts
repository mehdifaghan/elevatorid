/**
 * سرویس مدیریت تنظیمات سیستم
 * Settings Service for System Configuration Management
 */

export interface SystemSetting {
  id?: number;
  setting_key: string;
  setting_value: string | null;
  setting_type: 'string' | 'number' | 'boolean' | 'json';
  category?: string | null;
  description?: string | null;
  is_public?: boolean;
  is_locked?: boolean;
  created_by?: number | null;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface APIConfigSettings {
  api_base_url: string;
  api_key?: string;
  api_secret?: string;
  config_completed: boolean;
  config_locked: boolean;
  configured_at?: string;
  configured_by?: number;
}

class SettingsService {
  private readonly STORAGE_KEY = 'system_settings';
  private readonly API_CONFIG_CATEGORY = 'api_config';
  private cache: Map<string, SystemSetting> = new Map();

  /**
   * دریافت تنظیم خاص
   */
  async getSetting(key: string): Promise<SystemSetting | null> {
    try {
      // بررسی cache
      if (this.cache.has(key)) {
        return this.cache.get(key)!;
      }

      // دریافت از localStorage (در حالت واقعی باید از API دریافت شود)
      const settings = this.getAllSettingsFromStorage();
      const setting = settings.find(s => s.setting_key === key);
      
      if (setting) {
        this.cache.set(key, setting);
      }
      
      return setting || null;
    } catch (error) {
      console.error('خطا در دریافت تنظیم:', error);
      return null;
    }
  }

  /**
   * دریافت مقدار تنظیم
   */
  async getSettingValue<T = any>(key: string, defaultValue?: T): Promise<T> {
    try {
      const setting = await this.getSetting(key);
      
      if (!setting || setting.setting_value === null) {
        return defaultValue as T;
      }

      // تبدیل مقدار بر اساس نوع
      switch (setting.setting_type) {
        case 'boolean':
          return (setting.setting_value === 'true' || setting.setting_value === '1') as T;
        
        case 'number':
          return Number(setting.setting_value) as T;
        
        case 'json':
          try {
            return JSON.parse(setting.setting_value) as T;
          } catch {
            return defaultValue as T;
          }
        
        case 'string':
        default:
          return setting.setting_value as T;
      }
    } catch (error) {
      console.error('خطا در دریافت مقدار تنظیم:', error);
      return defaultValue as T;
    }
  }

  /**
   * ذخیره تنظیم
   */
  async saveSetting(
    key: string,
    value: any,
    options?: {
      type?: SystemSetting['setting_type'];
      category?: string;
      description?: string;
      isPublic?: boolean;
      isLocked?: boolean;
      userId?: number;
    }
  ): Promise<boolean> {
    try {
      // بررسی قفل بودن
      const existingSetting = await this.getSetting(key);
      if (existingSetting?.is_locked) {
        console.warn(`تنظیم ${key} قفل شده و قابل تغییر نیست`);
        return false;
      }

      // تبدیل مقدار به رشته
      let stringValue: string;
      const settingType = options?.type || 'string';
      
      switch (settingType) {
        case 'json':
          stringValue = JSON.stringify(value);
          break;
        case 'boolean':
          stringValue = value ? 'true' : 'false';
          break;
        case 'number':
          stringValue = String(value);
          break;
        default:
          stringValue = String(value);
      }

      const setting: SystemSetting = {
        setting_key: key,
        setting_value: stringValue,
        setting_type: settingType,
        category: options?.category || null,
        description: options?.description || null,
        is_public: options?.isPublic || false,
        is_locked: options?.isLocked || false,
        updated_by: options?.userId || null,
        updated_at: new Date().toISOString(),
      };

      // اگر تنظیم جدید است
      if (!existingSetting) {
        setting.created_by = options?.userId || null;
        setting.created_at = new Date().toISOString();
      } else {
        setting.id = existingSetting.id;
        setting.created_by = existingSetting.created_by;
        setting.created_at = existingSetting.created_at;
      }

      // ذخیره در storage
      this.saveSettingToStorage(setting);
      
      // به‌روزرسانی cache
      this.cache.set(key, setting);
      
      return true;
    } catch (error) {
      console.error('خطا در ذخیره تنظیم:', error);
      return false;
    }
  }

  /**
   * حذف تنظیم
   */
  async deleteSetting(key: string): Promise<boolean> {
    try {
      // بررسی قفل بودن
      const setting = await this.getSetting(key);
      if (setting?.is_locked) {
        console.warn(`تنظیم ${key} قفل شده و قابل حذف نیست`);
        return false;
      }

      // حذف از storage
      const settings = this.getAllSettingsFromStorage();
      const filtered = settings.filter(s => s.setting_key !== key);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
      
      // حذف از cache
      this.cache.delete(key);
      
      return true;
    } catch (error) {
      console.error('خطا در حذف تنظیم:', error);
      return false;
    }
  }

  /**
   * دریافت تنظیمات یک دسته
   */
  async getSettingsByCategory(category: string): Promise<SystemSetting[]> {
    try {
      const settings = this.getAllSettingsFromStorage();
      return settings.filter(s => s.category === category);
    } catch (error) {
      console.error('خطا در دریافت تنظیمات دسته:', error);
      return [];
    }
  }

  /**
   * ذخیره تنظیمات API
   */
  async saveAPIConfig(config: {
    baseUrl: string;
    apiKey?: string;
    apiSecret?: string;
    userId?: number;
  }): Promise<boolean> {
    try {
      // ذخیره Base URL
      await this.saveSetting('api_base_url', config.baseUrl, {
        type: 'string',
        category: this.API_CONFIG_CATEGORY,
        description: 'آدرس پایه API',
        isPublic: false,
        isLocked: false,
        userId: config.userId,
      });

      // ذخیره API Key (اختیاری)
      if (config.apiKey) {
        await this.saveSetting('api_key', config.apiKey, {
          type: 'string',
          category: this.API_CONFIG_CATEGORY,
          description: 'کلید API',
          isPublic: false,
          isLocked: false,
          userId: config.userId,
        });
      }

      // ذخیره API Secret (اختیاری)
      if (config.apiSecret) {
        await this.saveSetting('api_secret', config.apiSecret, {
          type: 'string',
          category: this.API_CONFIG_CATEGORY,
          description: 'کلید محرمانه API',
          isPublic: false,
          isLocked: false,
          userId: config.userId,
        });
      }

      // علامت‌گذاری به عنوان تکمیل شده
      await this.saveSetting('api_config_completed', true, {
        type: 'boolean',
        category: this.API_CONFIG_CATEGORY,
        description: 'وضعیت تکمیل تنظیمات API',
        isPublic: true,
        isLocked: false,
        userId: config.userId,
      });

      // ثبت زمان تنظیم
      await this.saveSetting('api_configured_at', new Date().toISOString(), {
        type: 'string',
        category: this.API_CONFIG_CATEGORY,
        description: 'زمان تنظیم API',
        isPublic: false,
        isLocked: false,
        userId: config.userId,
      });

      // ثبت کاربر تنظیم‌کننده
      if (config.userId) {
        await this.saveSetting('api_configured_by', config.userId, {
          type: 'number',
          category: this.API_CONFIG_CATEGORY,
          description: 'کاربر تنظیم‌کننده API',
          isPublic: false,
          isLocked: false,
          userId: config.userId,
        });
      }

      return true;
    } catch (error) {
      console.error('خطا در ذخیره تنظیمات API:', error);
      return false;
    }
  }

  /**
   * قفل کردن تنظیمات API
   */
  async lockAPIConfig(userId?: number): Promise<boolean> {
    try {
      // بررسی تکمیل بودن تنظیمات
      const isCompleted = await this.getSettingValue<boolean>('api_config_completed', false);
      
      if (!isCompleted) {
        console.warn('تنظیمات API هنوز تکمیل نشده است');
        return false;
      }

      // قفل کردن تمام تنظیمات API
      const apiSettings = await this.getSettingsByCategory(this.API_CONFIG_CATEGORY);
      
      for (const setting of apiSettings) {
        if (setting.setting_key) {
          const value = await this.getSettingValue(setting.setting_key);
          await this.saveSetting(setting.setting_key, value, {
            type: setting.setting_type,
            category: setting.category || undefined,
            description: setting.description || undefined,
            isPublic: setting.is_public,
            isLocked: true, // قفل کردن
            userId,
          });
        }
      }

      // علامت‌گذاری به عنوان قفل شده
      await this.saveSetting('api_config_locked', true, {
        type: 'boolean',
        category: this.API_CONFIG_CATEGORY,
        description: 'وضعیت قفل تنظیمات API',
        isPublic: true,
        isLocked: true,
        userId,
      });

      // ثبت زمان قفل
      await this.saveSetting('api_locked_at', new Date().toISOString(), {
        type: 'string',
        category: this.API_CONFIG_CATEGORY,
        description: 'زمان قفل تنظیمات API',
        isPublic: false,
        isLocked: true,
        userId,
      });

      // پاک کردن cache
      this.cache.clear();

      return true;
    } catch (error) {
      console.error('خطا در قفل کردن تنظیمات API:', error);
      return false;
    }
  }

  /**
   * باز کردن قفل تنظیمات API (فقط برای موارد خاص)
   */
  async unlockAPIConfig(userId?: number, adminPassword?: string): Promise<boolean> {
    try {
      // در محیط واقعی باید رمز ادمین را بررسی کنیم
      // این یک مکانیزم امنیتی است
      
      if (!adminPassword) {
        console.warn('رمز ادمین الزامی است');
        return false;
      }

      // شبیه‌سازی بررسی رمز (در واقعیت باید از API بررسی شود)
      // این فقط برای نمایش است و باید حذف شود
      
      // باز کردن قفل تمام تنظیمات API
      const apiSettings = await this.getSettingsByCategory(this.API_CONFIG_CATEGORY);
      
      for (const setting of apiSettings) {
        if (setting.setting_key) {
          const value = await this.getSettingValue(setting.setting_key);
          await this.saveSetting(setting.setting_key, value, {
            type: setting.setting_type,
            category: setting.category || undefined,
            description: setting.description || undefined,
            isPublic: setting.is_public,
            isLocked: false, // باز کردن قفل
            userId,
          });
        }
      }

      // به‌روزرسانی وضعیت قفل
      await this.saveSetting('api_config_locked', false, {
        type: 'boolean',
        category: this.API_CONFIG_CATEGORY,
        description: 'وضعیت قفل تنظیمات API',
        isPublic: true,
        isLocked: false,
        userId,
      });

      // ثبت زمان باز کردن قفل
      await this.saveSetting('api_unlocked_at', new Date().toISOString(), {
        type: 'string',
        category: this.API_CONFIG_CATEGORY,
        description: 'زمان باز کردن قفل تنظیمات API',
        isPublic: false,
        isLocked: false,
        userId,
      });

      // ثبت کاربر باز کننده قفل
      if (userId) {
        await this.saveSetting('api_unlocked_by', userId, {
          type: 'number',
          category: this.API_CONFIG_CATEGORY,
          description: 'کاربر باز کننده قفل API',
          isPublic: false,
          isLocked: false,
          userId,
        });
      }

      // پاک کردن cache
      this.cache.clear();

      return true;
    } catch (error) {
      console.error('خطا در باز کردن قفل تنظیمات API:', error);
      return false;
    }
  }

  /**
   * بررسی وضعیت تکمیل تنظیمات API
   */
  async isAPIConfigCompleted(): Promise<boolean> {
    return await this.getSettingValue<boolean>('api_config_completed', false);
  }

  /**
   * بررسی وضعیت قفل تنظیمات API
   */
  async isAPIConfigLocked(): Promise<boolean> {
    return await this.getSettingValue<boolean>('api_config_locked', false);
  }

  /**
   * دریافت تنظیمات API
   */
  async getAPIConfig(): Promise<APIConfigSettings | null> {
    try {
      const baseUrl = await this.getSettingValue<string>('api_base_url');
      
      if (!baseUrl) {
        return null;
      }

      return {
        api_base_url: baseUrl,
        api_key: await this.getSettingValue<string>('api_key'),
        api_secret: await this.getSettingValue<string>('api_secret'),
        config_completed: await this.getSettingValue<boolean>('api_config_completed', false),
        config_locked: await this.getSettingValue<boolean>('api_config_locked', false),
        configured_at: await this.getSettingValue<string>('api_configured_at'),
        configured_by: await this.getSettingValue<number>('api_configured_by'),
      };
    } catch (error) {
      console.error('خطا در دریافت تنظیمات API:', error);
      return null;
    }
  }

  /**
   * دریافت تمام تنظیمات از localStorage
   */
  private getAllSettingsFromStorage(): SystemSetting[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('خطا در خواندن تنظیمات:', error);
      return [];
    }
  }

  /**
   * ذخیره تنظیم در localStorage
   */
  private saveSettingToStorage(setting: SystemSetting): void {
    try {
      const settings = this.getAllSettingsFromStorage();
      const index = settings.findIndex(s => s.setting_key === setting.setting_key);
      
      if (index >= 0) {
        settings[index] = setting;
      } else {
        settings.push(setting);
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('خطا در ذخیره تنظیم:', error);
    }
  }

  /**
   * پاک کردن cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * پاک کردن تمام تنظیمات (فقط برای توسعه)
   */
  async clearAllSettings(): Promise<boolean> {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      this.cache.clear();
      return true;
    } catch (error) {
      console.error('خطا در پاک کردن تنظیمات:', error);
      return false;
    }
  }
}

// Export singleton instance
export const settingsService = new SettingsService();
export default settingsService;
