/**
 * کامپوننت مدیریت قفل تنظیمات API
 */

import React, { useState } from 'react';
import { Lock, Unlock, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { toast } from 'sonner@2.0.3';
import { settingsService } from '../../services/settings.service';
import { useAuth } from '../../contexts/AuthContext';

interface UnlockAPISettingsProps {
  onUnlockSuccess?: () => void;
  onCancel?: () => void;
}

export function UnlockAPISettings({ onUnlockSuccess, onCancel }: UnlockAPISettingsProps) {
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUnlock = async () => {
    try {
      setError(null);

      // اعتبارسنجی
      if (!password) {
        setError('لطفاً رمز ادمین را وارد کنید');
        return;
      }

      if (password !== confirmPassword) {
        setError('رمزهای وارد شده یکسان نیستند');
        return;
      }

      if (password.length < 8) {
        setError('رمز باید حداقل 8 کاراکتر باشد');
        return;
      }

      setIsUnlocking(true);

      // باز کردن قفل
      const success = await settingsService.unlockAPIConfig(user?.id, password);

      if (success) {
        toast.success('قفل تنظیمات API با موفقیت باز شد', {
          description: 'اکنون می‌توانید تنظیمات را ویرایش کنید',
        });
        
        onUnlockSuccess?.();
      } else {
        throw new Error('خطا در باز کردن قفل');
      }
    } catch (error) {
      console.error('خطا در باز کردن قفل:', error);
      setError(error instanceof Error ? error.message : 'خطا در باز کردن قفل تنظیمات');
      
      toast.error('خطا در باز کردن قفل', {
        description: 'لطفاً رمز را بررسی کرده و دوباره تلاش کنید',
      });
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <Card className="border-2 border-destructive/20">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl">باز کردن قفل تنظیمات API</CardTitle>
            <CardDescription className="mt-1">
              این عملیات نیاز به تأیید ادمین دارد
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Alert className="border-destructive/30 bg-destructive/5">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <AlertDescription className="text-destructive-foreground pr-7">
            <div className="space-y-2">
              <p className="font-medium">هشدار امنیتی</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>باز کردن قفل تنظیمات API یک عملیات حساس است</li>
                <li>این عملیات در لاگ‌های سیستم ثبت خواهد شد</li>
                <li>فقط در صورت ضرورت این عملیات را انجام دهید</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>

        {error && (
          <Alert className="border-destructive bg-destructive/5">
            <XCircle className="h-5 w-5 text-destructive" />
            <AlertDescription className="text-destructive pr-7">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-password">رمز ادمین</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="رمز ادمین خود را وارد کنید"
              disabled={isUnlocking}
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">تأیید رمز</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="رمز را مجدداً وارد کنید"
              disabled={isUnlocking}
              className="text-right"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleUnlock();
                }
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <Button
            variant="destructive"
            onClick={handleUnlock}
            disabled={isUnlocking || !password || !confirmPassword}
            className="flex-1"
          >
            {isUnlocking ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2" />
                در حال باز کردن قفل...
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4 ml-2" />
                باز کردن قفل
              </>
            )}
          </Button>

          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isUnlocking}
            >
              انصراف
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface LockAPISettingsProps {
  onLockSuccess?: () => void;
  onCancel?: () => void;
}

export function LockAPISettings({ onLockSuccess, onCancel }: LockAPISettingsProps) {
  const { user } = useAuth();
  const [isLocking, setIsLocking] = useState(false);

  const handleLock = async () => {
    try {
      setIsLocking(true);

      const success = await settingsService.lockAPIConfig(user?.id);

      if (success) {
        toast.success('تنظیمات API با موفقیت قفل شد', {
          description: 'منوی تنظیمات از سایدبار حذف خواهد شد',
        });
        
        onLockSuccess?.();
      } else {
        throw new Error('خطا در قفل کردن تنظیمات');
      }
    } catch (error) {
      console.error('خطا در قفل کردن:', error);
      
      toast.error('خطا در قفل کردن تنظیمات', {
        description: error instanceof Error ? error.message : 'لطفاً دوباره تلاش کنید',
      });
    } finally {
      setIsLocking(false);
    }
  };

  return (
    <Card className="border-2 border-green-500/20">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl">قفل کردن تنظیمات API</CardTitle>
            <CardDescription className="mt-1">
              بعد از قفل، منو از سایدبار حذف می‌شود
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Alert className="border-green-500/30 bg-green-500/5">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <AlertDescription className="pr-7">
            <div className="space-y-2">
              <p className="font-medium text-green-900">تنظیمات آماده قفل شدن است</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
                <li>تنظیمات API با موفقیت تکمیل شده است</li>
                <li>بعد از قفل، منوی کانفیگ از سایدبار حذف می‌شود</li>
                <li>برای تغییر تنظیمات باید قفل را باز کنید</li>
                <li>این عملیات قابل برگشت است</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>

        <div className="flex items-center gap-3 pt-4 border-t">
          <Button
            onClick={handleLock}
            disabled={isLocking}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isLocking ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2" />
                در حال قفل کردن...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 ml-2" />
                قفل کردن تنظیمات
              </>
            )}
          </Button>

          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isLocking}
            >
              انصراف
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default UnlockAPISettings;
