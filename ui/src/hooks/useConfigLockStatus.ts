/**
 * Hook برای بررسی وضعیت قفل تنظیمات API
 */

import { useState, useEffect } from 'react';
import { settingsService } from '../services/settings.service';

export interface ConfigLockStatus {
  isCompleted: boolean;
  isLocked: boolean;
  isLoading: boolean;
  shouldShowConfigMenu: boolean;
  error: string | null;
}

export function useConfigLockStatus() {
  const [status, setStatus] = useState<ConfigLockStatus>({
    isCompleted: false,
    isLocked: false,
    isLoading: true,
    shouldShowConfigMenu: true,
    error: null,
  });

  useEffect(() => {
    checkConfigStatus();
  }, []);

  const checkConfigStatus = async () => {
    try {
      setStatus(prev => ({ ...prev, isLoading: true, error: null }));

      const [isCompleted, isLocked] = await Promise.all([
        settingsService.isAPIConfigCompleted(),
        settingsService.isAPIConfigLocked(),
      ]);

      // منو را فقط نمایش بده اگر:
      // 1. هنوز تکمیل نشده است، یا
      // 2. تکمیل شده اما هنوز قفل نشده است
      const shouldShowConfigMenu = !isCompleted || (isCompleted && !isLocked);

      setStatus({
        isCompleted,
        isLocked,
        isLoading: false,
        shouldShowConfigMenu,
        error: null,
      });
    } catch (error) {
      console.error('خطا در بررسی وضعیت قفل:', error);
      setStatus(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'خطا در بررسی وضعیت',
      }));
    }
  };

  const refreshStatus = () => {
    checkConfigStatus();
  };

  return {
    ...status,
    refreshStatus,
  };
}

export default useConfigLockStatus;
