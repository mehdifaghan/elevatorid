/**
 * API Configuration Component
 * کامپوننت تنظیمات و مدیریت API - برای ادمین
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  Server, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Settings2, 
  Zap,
  Globe,
  AlertTriangle,
  Info,
  Copy,
  Check,
  Lock,
  Save
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import apiConfig, { API_ENVIRONMENTS, type APIEnvironment } from '../../config/api.config';
import { settingsService } from '../../services/settings.service';
import { LockAPISettings } from './UnlockAPISettings';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function APIConfigPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentEnv, setCurrentEnv] = useState<APIEnvironment>(apiConfig.getCurrentEnvironment());
  const [selectedEnv, setSelectedEnv] = useState<string>(currentEnv.name);
  const [customURL, setCustomURL] = useState<string>('');
  const [customVersion, setCustomVersion] = useState<string>('v1');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean;
    message: string;
    latency?: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showLockDialog, setShowLockDialog] = useState(false);
  const [isConfigCompleted, setIsConfigCompleted] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  // بررسی دسترسی به صفحه
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const isLocked = await settingsService.isAPIConfigLocked();
        
        if (isLocked) {
          // اگر قفل شده، به داشبورد هدایت کن
          toast.error('تنظیمات API قفل شده است', {
            description: 'برای تغییر تنظیمات باید قفل را باز کنید',
          });
          navigate('/admin');
          return;
        }
        
        setIsCheckingAccess(false);
      } catch (error) {
        console.error('خطا در بررسی دسترسی:', error);
        setIsCheckingAccess(false);
      }
    };

    checkAccess();
  }, [navigate]);

  // به‌روزرسانی state با تغییرات config
  useEffect(() => {
    const unsubscribe = apiConfig.subscribe(() => {
      setCurrentEnv(apiConfig.getCurrentEnvironment());
    });

    return unsubscribe;
  }, []);

  // نمایش loading در حین بررسی دسترسی
  if (isCheckingAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">در حال بررسی دسترسی...</p>
        </div>
      </div>
    );
  }

  // بررسی اتصال به API
  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus(null);

    try {
      const result = await apiConfig.checkConnection();
      setConnectionStatus(result);

      if (result.success) {
        toast.success(result.message);
        
        // ذخیره تنظیمات در دیتابیس بعد از تست موفق
        await handleSaveConfiguration();
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      const errorResult = {
        success: false,
        message: error.message || 'خطا در بررسی اتصال'
      };
      setConnectionStatus(errorResult);
      toast.error(errorResult.message);
    } finally {
      setIsTestingConnection(false);
    }
  };

  // ذخیره تنظیمات در دیتابیس
  const handleSaveConfiguration = async () => {
    try {
      const config = apiConfig.getConfig();
      
      const success = await settingsService.saveAPIConfig({
        baseUrl: config.fullURL,
        userId: user?.id,
      });

      if (success) {
        setIsConfigCompleted(true);
        toast.success('تنظیمات با موفقیت در دیتابیس ذخیره شد', {
          description: 'اکنون می‌توانید تنظیمات را قفل کنید',
        });
      }
    } catch (error) {
      console.error('خطا در ذخیره تنظیمات:', error);
      toast.error('خطا در ذخیره تنظیمات در دیتابیس');
    }
  };

  // قفل کردن تنظیمات
  const handleLockSuccess = () => {
    setShowLockDialog(false);
    toast.success('تنظیمات API قفل شد', {
      description: 'منو از سایدبار حذف می‌شود...',
    });
    
    // بازخوانی صفحه بعد از 2 ثانیه
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  // تغییر محیط
  const handleEnvironmentChange = (envName: string) => {
    setSelectedEnv(envName);

    if (envName !== 'custom') {
      apiConfig.setEnvironment(envName);
      setConnectionStatus(null);
      toast.success(`محیط به "${API_ENVIRONMENTS[envName].displayName}" تغییر کرد`);
    }
  };

  // اعمال URL سفارشی
  const handleApplyCustomURL = () => {
    if (!customURL.trim()) {
      toast.error('لطفاً آدرس URL را وارد کنید');
      return;
    }

    // اعتبارسنجی URL
    try {
      new URL(customURL);
    } catch (error) {
      toast.error('آدرس URL نامعتبر است');
      return;
    }

    apiConfig.setCustomURL(customURL.trim(), customVersion.trim() || 'v1');
    setConnectionStatus(null);
    toast.success('URL سفارشی اعمال شد');
  };

  // بازنشانی به تنظیمات پیش‌فرض
  const handleReset = () => {
    apiConfig.reset();
    setSelectedEnv('production');
    setCustomURL('');
    setCustomVersion('v1');
    setConnectionStatus(null);
    toast.success('تنظیمات به حالت پیش‌فرض بازگشت');
  };

  // کپی URL به کلیپ‌برد
  const handleCopyURL = async () => {
    const config = apiConfig.getConfig();
    try {
      await navigator.clipboard.writeText(config.fullURL);
      setCopied(true);
      toast.success('URL کپی شد');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('خطا در کپی کردن');
    }
  };

  // دریافت رنگ badge بر اساس وضعیت
  const getStatusBadgeVariant = () => {
    if (!connectionStatus) return 'secondary';
    return connectionStatus.success ? 'default' : 'destructive';
  };

  const config = apiConfig.getConfig();

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 mb-2">
          <Server className="h-6 w-6" />
          تنظیمات API
        </h1>
        <p className="text-muted-foreground">
          مدیریت و پیکربندی اتصال به سرور API
        </p>
      </div>

      {/* Current Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            پیکربندی فعلی
          </CardTitle>
          <CardDescription>
            اطلاعات اتصال فعلی به سرور API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">محیط فعال</Label>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {currentEnv.displayName}
                </Badge>
                {currentEnv.name === 'production' && (
                  <Badge variant="default" className="text-xs">
                    <Zap className="h-3 w-3 ml-1" />
                    تولید
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">وضعیت اتصال</Label>
              <div>
                {connectionStatus ? (
                  <Badge variant={getStatusBadgeVariant()} className="text-sm">
                    {connectionStatus.success ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 ml-1" />
                        متصل {connectionStatus.latency && `(${connectionStatus.latency}ms)`}
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 ml-1" />
                        قطع شده
                      </>
                    )}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-sm">
                    <Info className="h-3 w-3 ml-1" />
                    نامشخص
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Base URL</Label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-muted px-3 py-2 rounded-md text-sm font-mono">
                  {config.baseURL}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyURL}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">نسخه API</Label>
              <code className="block bg-muted px-3 py-2 rounded-md text-sm font-mono">
                {config.version}
              </code>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">URL کامل</Label>
              <code className="block bg-muted px-3 py-2 rounded-md text-sm font-mono break-all">
                {config.fullURL}
              </code>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleTestConnection}
              disabled={isTestingConnection}
              className="flex-1"
            >
              {isTestingConnection ? (
                <>
                  <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                  در حال بررسی...
                </>
              ) : (
                <>
                  <Server className="h-4 w-4 ml-2" />
                  بررسی اتصال
                </>
              )}
            </Button>
          </div>

          {connectionStatus && !connectionStatus.success && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {connectionStatus.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Environment Selection Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            انتخاب محیط
          </CardTitle>
          <CardDescription>
            انتخاب محیط سرور برای اتصال
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>محیط سرور</Label>
            <Select value={selectedEnv} onValueChange={handleEnvironmentChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(API_ENVIRONMENTS).map((env) => (
                  <SelectItem key={env.name} value={env.name}>
                    <div className="flex items-center gap-2">
                      <span>{env.displayName}</span>
                      {env.name === 'production' && (
                        <Badge variant="default" className="text-xs">
                          توصیه شده
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedEnv && selectedEnv !== 'custom' && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {API_ENVIRONMENTS[selectedEnv].description}
                <br />
                <code className="text-xs mt-1 block">
                  {API_ENVIRONMENTS[selectedEnv].baseURL}/{API_ENVIRONMENTS[selectedEnv].version}
                </code>
              </AlertDescription>
            </Alert>
          )}

          {/* Custom URL Section */}
          {selectedEnv === 'custom' && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>آدرس سرور سفارشی</Label>
                <Input
                  type="url"
                  placeholder="https://api.example.com"
                  value={customURL}
                  onChange={(e) => setCustomURL(e.target.value)}
                  dir="ltr"
                  className="text-left font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  آدرس پایه سرور API را وارد کنید (بدون / در انتها)
                </p>
              </div>

              <div className="space-y-2">
                <Label>نسخه API</Label>
                <Input
                  type="text"
                  placeholder="v1"
                  value={customVersion}
                  onChange={(e) => setCustomVersion(e.target.value)}
                  dir="ltr"
                  className="text-left font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  نسخه API (معمولاً v1)
                </p>
              </div>

              <Button
                onClick={handleApplyCustomURL}
                disabled={!customURL.trim()}
                className="w-full"
              >
                <CheckCircle2 className="h-4 w-4 ml-2" />
                اعمال تنظیمات سفارشی
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lock Configuration Card */}
      {isConfigCompleted && connectionStatus?.success && !showLockDialog && (
        <div className="space-y-4">
          <Card className="border-2 border-green-500/30 bg-green-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                تنظیمات آماده قفل شدن
              </CardTitle>
              <CardDescription>
                تنظیمات API با موفقیت تکمیل و در دیتابیس ذخیره شد
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-green-500/30 bg-green-100/50">
                <Info className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <div className="space-y-2">
                    <p><strong>توجه مهم:</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-sm mr-4">
                      <li>با قفل کردن تنظیمات، منوی "تنظیمات API" از سایدبار حذف خواهد شد</li>
                      <li>این عملیات برای افزایش امنیت سیستم انجام می‌شود</li>
                      <li>در صورت نیاز به تغییر، می‌توانید قفل را باز کنید</li>
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button
                  onClick={() => setShowLockDialog(true)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Lock className="h-4 w-4 ml-2" />
                  قفل کردن تنظیمات
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                >
                  <RefreshCw className="h-4 w-4 ml-2" />
                  بازنشانی
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lock Dialog */}
      {showLockDialog && (
        <div className="space-y-4">
          <LockAPISettings
            onLockSuccess={handleLockSuccess}
            onCancel={() => setShowLockDialog(false)}
          />
        </div>
      )}

      {/* Actions Card */}
      {!isConfigCompleted && (
        <Card>
          <CardHeader>
            <CardTitle>عملیات</CardTitle>
            <CardDescription>
              بازنشانی و مدیریت تنظیمات
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 ml-2" />
                بازنشانی به پیش‌فرض
              </Button>
            </div>

            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>توجه:</strong> تغییر محیط API ممکن است بر عملکرد سیستم تأثیر بگذارد.
                لطفاً قبل از تغییر، از صحت تنظیمات مطمئن شوید.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Debug Info Card - Only in Development */}
      {process.env.NODE_ENV === 'development' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">اطلاعات Debug</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded-md overflow-auto max-h-40">
              {JSON.stringify(apiConfig.getDebugInfo(), null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
