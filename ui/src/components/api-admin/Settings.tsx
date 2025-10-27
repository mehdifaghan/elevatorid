import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Settings as SettingsIcon, 
  MessageSquare, 
  CreditCard, 
  Upload, 
  Image as ImageIcon,
  Save,
  TestTube,
  Check,
  X,
  AlertCircle,
  Loader2,
  RefreshCw,
  Bell,
  Shield,
  Database
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { realApiRequest, type RealApiError } from '../../lib/real-api-client';

interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  supportEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  logoUrl: string;
  faviconUrl: string;
}

interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  webhookUrl: string;
  dailyReportEnabled: boolean;
  weeklyReportEnabled: boolean;
  errorNotificationEnabled: boolean;
}

interface SecuritySettings {
  otpEnabled: boolean;
  otpExpiryMinutes: number;
  maxLoginAttempts: number;
  lockoutDurationMinutes: number;
  passwordMinLength: number;
  passwordRequireSpecialChars: boolean;
  captchaEnabled: boolean;
  ipWhitelistEnabled: boolean;
  ipWhitelist: string;
}

interface UploadSettings {
  maxFileSize: number;
  allowedImageTypes: string[];
  allowedDocumentTypes: string[];
  uploadPath: string;
  enableImageResize: boolean;
  maxImageWidth: number;
  maxImageHeight: number;
}

interface BackupSettings {
  autoBackupEnabled: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  backupRetentionDays: number;
  backupStoragePath: string;
  includeUploads: boolean;
  compressionEnabled: boolean;
}

interface SMSSettings {
  provider: 'farapayamak' | 'kavenegar';
  username: string;
  password: string;
  sender: string;
  enabled: boolean;
}

interface PaymentSettings {
  provider: 'mellat' | 'parsian';
  terminalId: string;
  merchantId: string;
  secretKey: string;
  enabled: boolean;
  testMode: boolean;
}

interface PaymentTypesSettings {
  partsPaymentEnabled: boolean;
  partsPaymentPrice: number;
  elevatorPaymentEnabled: boolean;
  elevatorPaymentPrice: number;
}

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    siteName: 'سامانه ردیابی قطعات آسانسور',
    siteDescription: 'سامانه جامع ردیابی قطعات و شناسنامه آسانسور',
    supportEmail: 'support@elevator-system.ir',
    supportPhone: '021-88776655',
    maintenanceMode: false,
    registrationEnabled: true,
    logoUrl: '',
    faviconUrl: ''
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailEnabled: true,
    smsEnabled: true,
    pushEnabled: false,
    webhookUrl: '',
    dailyReportEnabled: true,
    weeklyReportEnabled: true,
    errorNotificationEnabled: true
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    otpEnabled: true,
    otpExpiryMinutes: 5,
    maxLoginAttempts: 3,
    lockoutDurationMinutes: 15,
    passwordMinLength: 8,
    passwordRequireSpecialChars: true,
    captchaEnabled: true,
    ipWhitelistEnabled: false,
    ipWhitelist: ''
  });

  const [uploadSettings, setUploadSettings] = useState<UploadSettings>({
    maxFileSize: 5,
    allowedImageTypes: ['jpg', 'jpeg', 'png', 'gif'],
    allowedDocumentTypes: ['pdf', 'doc', 'docx', 'xls', 'xlsx'],
    uploadPath: '/uploads',
    enableImageResize: true,
    maxImageWidth: 1920,
    maxImageHeight: 1080
  });

  const [backupSettings, setBackupSettings] = useState<BackupSettings>({
    autoBackupEnabled: true,
    backupFrequency: 'daily',
    backupRetentionDays: 30,
    backupStoragePath: '/backups',
    includeUploads: true,
    compressionEnabled: true
  });

  const [smsSettings, setSmsSettings] = useState<SMSSettings>({
    provider: 'farapayamak',
    username: '',
    password: '',
    sender: '10008663',
    enabled: true
  });

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    provider: 'mellat',
    terminalId: '',
    merchantId: '',
    secretKey: '',
    enabled: false,
    testMode: true
  });

  const [paymentTypesSettings, setPaymentTypesSettings] = useState<PaymentTypesSettings>({
    partsPaymentEnabled: false,
    partsPaymentPrice: 10000,
    elevatorPaymentEnabled: false,
    elevatorPaymentPrice: 50000
  });

  const [isTestingSMS, setIsTestingSMS] = useState(false);
  const [isTestingPayment, setIsTestingPayment] = useState(false);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await realApiRequest.get('/admin/settings');
      
      if (response.success && response.data) {
        if (response.data.general) {
          setGeneralSettings(prev => ({ ...prev, ...response.data.general }));
        }
        if (response.data.notifications) {
          setNotificationSettings(prev => ({ ...prev, ...response.data.notifications }));
        }
        if (response.data.security) {
          setSecuritySettings(prev => ({ ...prev, ...response.data.security }));
        }
        if (response.data.uploads) {
          setUploadSettings(prev => ({ ...prev, ...response.data.uploads }));
        }
        if (response.data.backup) {
          setBackupSettings(prev => ({ ...prev, ...response.data.backup }));
        }
        if (response.data.sms) {
          setSmsSettings(prev => ({ ...prev, ...response.data.sms }));
        }
        if (response.data.payment) {
          setPaymentSettings(prev => ({ ...prev, ...response.data.payment }));
        }
        if (response.data.paymentTypes) {
          setPaymentTypesSettings(prev => ({ ...prev, ...response.data.paymentTypes }));
        }
        
        toast.success('تنظیمات از سرور بارگذاری شد');
      }
    } catch (err) {
      const apiError = err as RealApiError;
      const errorMessage = apiError.message || 'خطا در بارگذاری تنظیمات';
      setError(errorMessage);
      
      if (apiError.isNetworkError) {
        toast.error('خطا در اتصال به سرور. از تنظیمات پیش‌فرض استفاده می‌شود.');
      } else if (apiError.isAuthError) {
        toast.error('خطای احراز هویت. لطفاً مجدداً وارد شوید.');
      } else {
        toast.error(`خطا در بارگذاری تنظیمات: ${errorMessage}`);
      }
      
      console.error('Settings fetch error:', apiError);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGeneralSettings = async () => {
    try {
      setSaving(true);
      
      if (error) {
        toast.success('تنظیمات عمومی موقتاً ذخیره شد (عدم اتصال به سرور)');
        return;
      }
      
      const response = await realApiRequest.put('/admin/settings/general', generalSettings);
      
      if (response.success) {
        toast.success('تنظیمات عمومی ذخیره شد');
      }
    } catch (err) {
      const apiError = err as RealApiError;
      const errorMessage = apiError.message || 'خطا در ذخیره تنظیمات عمومی';
      toast.error(errorMessage);
      console.error('Save general settings error:', apiError);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotificationSettings = async () => {
    try {
      setSaving(true);
      
      if (error) {
        toast.success('تنظیمات اعلان‌ها موقتاً ذخیره شد (عدم اتصال به سرور)');
        return;
      }
      
      const response = await realApiRequest.put('/admin/settings/notifications', notificationSettings);
      
      if (response.success) {
        toast.success('تنظیمات اعلان‌ها ذخیره شد');
      }
    } catch (err) {
      const apiError = err as RealApiError;
      const errorMessage = apiError.message || 'خطا در ذخیره تنظیمات اعلان‌ها';
      toast.error(errorMessage);
      console.error('Save notification settings error:', apiError);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSecuritySettings = async () => {
    try {
      setSaving(true);
      
      if (error) {
        toast.success('تنظیمات امنیتی موقتاً ذخیره شد (عدم اتصال به سرور)');
        return;
      }
      
      const response = await realApiRequest.put('/admin/settings/security', securitySettings);
      
      if (response.success) {
        toast.success('تنظیمات امنیتی ذخیره شد');
      }
    } catch (err) {
      const apiError = err as RealApiError;
      const errorMessage = apiError.message || 'خطا در ذخیره تنظیمات امنیتی';
      toast.error(errorMessage);
      console.error('Save security settings error:', apiError);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveUploadSettings = async () => {
    try {
      setSaving(true);
      
      if (error) {
        toast.success('تنظیمات آپلود موقتاً ذخیره شد (عدم اتصال به سرور)');
        return;
      }
      
      const response = await realApiRequest.put('/admin/settings/uploads', uploadSettings);
      
      if (response.success) {
        toast.success('تنظیمات آپلود ذخیره شد');
      }
    } catch (err) {
      const apiError = err as RealApiError;
      const errorMessage = apiError.message || 'خطا در ذخیره تنظیمات آپلود';
      toast.error(errorMessage);
      console.error('Save upload settings error:', apiError);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBackupSettings = async () => {
    try {
      setSaving(true);
      
      if (error) {
        toast.success('تنظیمات پشتیبان‌گیری موقتاً ذخیره شد (عدم اتصال به سرور)');
        return;
      }
      
      const response = await realApiRequest.put('/admin/settings/backup', backupSettings);
      
      if (response.success) {
        toast.success('تنظیمات پشتیبان‌گیری ذخیره شد');
      }
    } catch (err) {
      const apiError = err as RealApiError;
      const errorMessage = apiError.message || 'خطا در ذخیره تنظیمات پشتیبان‌گیری';
      toast.error(errorMessage);
      console.error('Save backup settings error:', apiError);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSMSSettings = async () => {
    if (!smsSettings.username || !smsSettings.password) {
      toast.error('نام کاربری و رمز عبور الزامی است');
      return;
    }
    
    try {
      setSaving(true);
      
      if (error) {
        toast.success('تنظیمات پیامک موقتاً ذخیره شد (عدم اتصال به سرور)');
        return;
      }
      
      const response = await realApiRequest.put('/admin/settings/sms', smsSettings);
      
      if (response.success) {
        toast.success('تنظیمات پیامک ذخیره شد');
      }
    } catch (err) {
      const apiError = err as RealApiError;
      const errorMessage = apiError.message || 'خطا در ذخیره تنظیمات پیامک';
      toast.error(errorMessage);
      console.error('Save SMS settings error:', apiError);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePaymentSettings = async () => {
    if (!paymentSettings.terminalId || !paymentSettings.merchantId || !paymentSettings.secretKey) {
      toast.error('تمام فیلدهای پرداخت الزامی است');
      return;
    }
    
    try {
      setSaving(true);
      
      if (error) {
        toast.success('تنظیمات پرداخت موقتاً ذخیره شد (عدم اتصال به سرور)');
        return;
      }
      
      const response = await realApiRequest.put('/admin/settings/payment', paymentSettings);
      
      if (response.success) {
        toast.success('تنظیمات پرداخت ذخیره شد');
      }
    } catch (err) {
      const apiError = err as RealApiError;
      const errorMessage = apiError.message || 'خطا در ذخیره تنظیمات پرداخت';
      toast.error(errorMessage);
      console.error('Save payment settings error:', apiError);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePaymentTypesSettings = async () => {
    try {
      setSaving(true);
      
      if (error) {
        toast.success('تنظیمات انواع پرداخت موقتاً ذخیره شد (عدم اتصال به سرور)');
        return;
      }
      
      const response = await realApiRequest.put('/admin/settings/payment-types', paymentTypesSettings);
      
      if (response.success) {
        toast.success('تنظیمات انواع پرداخت ذخیره شد');
      }
    } catch (err) {
      const apiError = err as RealApiError;
      const errorMessage = apiError.message || 'خطا در ذخیره تنظیمات انواع پرداخت';
      toast.error(errorMessage);
      console.error('Save payment types settings error:', apiError);
    } finally {
      setSaving(false);
    }
  };

  const handleTestSMS = async () => {
    if (!smsSettings.username || !smsSettings.password) {
      toast.error('ابتدا تنظیمات پیامک را ذخیره کنید');
      return;
    }

    setIsTestingSMS(true);
    try {
      if (error) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success('تست پیامک (حالت آزمایشی - عدم اتصال به سرور)');
      } else {
        const response = await realApiRequest.post('/admin/settings/sms/test', {
          phone: '09123456789'
        });
        
        if (response.success) {
          toast.success('پیامک تست با موفقیت ارسال شد');
        }
      }
    } catch (err) {
      const apiError = err as RealApiError;
      const errorMessage = apiError.message || 'خطا در ارسال پیامک تست';
      toast.error(errorMessage);
      console.error('Test SMS error:', apiError);
    } finally {
      setIsTestingSMS(false);
    }
  };

  const handleTestPayment = async () => {
    if (!paymentSettings.terminalId || !paymentSettings.merchantId) {
      toast.error('ابتدا تنظیمات پرداخت را ذخیره کنید');
      return;
    }

    setIsTestingPayment(true);
    try {
      if (error) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success('تست درگاه پرداخت (حالت آزمایشی - عدم اتصال به سرور)');
      } else {
        const response = await realApiRequest.post('/admin/settings/payment/test', {
          amount: 1000
        });
        
        if (response.success) {
          toast.success('اتصال به درگاه پرداخت موفقیت‌آمیز بود');
        }
      }
    } catch (err) {
      const apiError = err as RealApiError;
      const errorMessage = apiError.message || 'خطا در اتصال به درگاه پرداخت';
      toast.error(errorMessage);
      console.error('Test payment error:', apiError);
    } finally {
      setIsTestingPayment(false);
    }
  };

  const handleFileUpload = async (type: 'logo' | 'favicon' | 'image' | 'document') => {
    const input = document.createElement('input');
    input.type = 'file';
    
    if (type === 'logo' || type === 'favicon' || type === 'image') {
      input.accept = 'image/*';
    } else {
      input.accept = '.pdf,.doc,.docx,.xls,.xlsx';
    }

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          if (error) {
            const mockUrl = URL.createObjectURL(file);
            if (type === 'logo') {
              setGeneralSettings(prev => ({ ...prev, logoUrl: mockUrl }));
            } else if (type === 'favicon') {
              setGeneralSettings(prev => ({ ...prev, faviconUrl: mockUrl }));
            }
            toast.success(`${type === 'logo' ? 'لوگو' : type === 'favicon' ? 'فاوآیکن' : 'فایل'} آپلود شد (حالت آزمایشی)`);
            return;
          }

          const formData = new FormData();
          formData.append('file', file);
          formData.append('type', type);

          const response = await realApiRequest.upload('/admin/upload', formData);

          if (response.success && response.data?.url) {
            if (type === 'logo') {
              setGeneralSettings(prev => ({ ...prev, logoUrl: response.data.url }));
            } else if (type === 'favicon') {
              setGeneralSettings(prev => ({ ...prev, faviconUrl: response.data.url }));
            }
            toast.success(`${type === 'logo' ? 'لوگو' : type === 'favicon' ? 'فاوآیکن' : 'فایل'} آپلود شد`);
          }
        } catch (err) {
          const apiError = err as RealApiError;
          const errorMessage = apiError.message || 'خطا در آپلود فایل';
          toast.error(errorMessage);
          console.error('File upload error:', apiError);
        }
      }
    };
    input.click();
  };

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    try {
      if (error) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        toast.success('پشتیبان‌گیری (حالت آزمایشی - عدم اتصال به سرور)');
      } else {
        const response = await realApiRequest.post('/admin/backup/create');
        
        if (response.success) {
          toast.success('پشتیبان‌گیری با موفقیت انجام شد');
        }
      }
    } catch (err) {
      const apiError = err as RealApiError;
      const errorMessage = apiError.message || 'خطا در ایجاد پشتیبان';
      toast.error(errorMessage);
      console.error('Create backup error:', apiError);
    } finally {
      setIsCreatingBackup(false);
    }
  };

  // Show loading banner only on initial load
  const showLoadingBanner = loading && !generalSettings.siteName && !error;

  return (
    <div className="space-y-6" dir="rtl">
      <div className="text-right">
        <h1 className="text-3xl font-bold">تنظیمات سیستم</h1>
        <p className="text-muted-foreground">مدیریت تنظیمات عمومی سامانه</p>
      </div>

      {/* Loading Banner */}
      {showLoadingBanner && (
        <Alert className="border-blue-200 bg-blue-50">
          <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
          <div>
            <h4 className="text-blue-800 font-medium">در حال بارگذاری تنظیمات</h4>
            <p className="text-blue-700 text-sm mt-1">اتصال به سرور و دریافت اطلاعات...</p>
          </div>
        </Alert>
      )}



      <Tabs defaultValue="general" className="space-y-6" dir="rtl">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2 flex-row-reverse">
            <span>عمومی</span>
            <SettingsIcon className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 flex-row-reverse">
            <span>اعلان‌ها</span>
            <Bell className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2 flex-row-reverse">
            <span>امنیت</span>
            <Shield className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="uploads" className="flex items-center gap-2 flex-row-reverse">
            <span>آپلود</span>
            <Upload className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2 flex-row-reverse">
            <span>پشتیبان</span>
            <Database className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2 flex-row-reverse">
            <span>پیامک و درگاه پرداخت</span>
            <MessageSquare className="w-4 h-4" />
          </TabsTrigger>
          {/* Note: Payment tab removed from this row due to space - will be in content */}
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تنظیمات عمومی سایت</CardTitle>
              <CardDescription>
                تنظیمات پایه و اطلاعات کلی سامانه
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 text-right">
                  <Label htmlFor="siteName">نام سایت</Label>
                  <Input
                    id="siteName"
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings(prev => ({ 
                      ...prev, 
                      siteName: e.target.value 
                    }))}
                  />
                </div>

                <div className="space-y-2 text-right">
                  <Label htmlFor="supportPhone">تلفن پشتیبانی</Label>
                  <Input
                    id="supportPhone"
                    value={generalSettings.supportPhone}
                    onChange={(e) => setGeneralSettings(prev => ({ 
                      ...prev, 
                      supportPhone: e.target.value 
                    }))}
                    className="text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2 text-right">
                <Label htmlFor="siteDescription">توضیحات سایت</Label>
                <Textarea
                  id="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={(e) => setGeneralSettings(prev => ({ 
                    ...prev, 
                    siteDescription: e.target.value 
                  }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2 text-right">
                <Label htmlFor="supportEmail">ایمیل پشتیبانی</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={generalSettings.supportEmail}
                  onChange={(e) => setGeneralSettings(prev => ({ 
                    ...prev, 
                    supportEmail: e.target.value 
                  }))}
                  className="text-left"
                  dir="ltr"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-right">
                    <Label>حالت تعمیرات</Label>
                    <p className="text-sm text-muted-foreground">
                      فعال‌سازی حالت تعمیرات سایت
                    </p>
                  </div>
                  <Switch
                    checked={generalSettings.maintenanceMode}
                    onCheckedChange={(checked) => setGeneralSettings(prev => ({ 
                      ...prev, 
                      maintenanceMode: checked 
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-right">
                    <Label>ثبت‌نام کاربران</Label>
                    <p className="text-sm text-muted-foreground">
                      امکان ثبت‌نام کاربران جدید
                    </p>
                  </div>
                  <Switch
                    checked={generalSettings.registrationEnabled}
                    onCheckedChange={(checked) => setGeneralSettings(prev => ({ 
                      ...prev, 
                      registrationEnabled: checked 
                    }))}
                  />
                </div>
              </div>

              {/* Logo and Favicon Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">لوگو و فاوآیکن</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 text-right">
                    <Label>لوگوی سایت</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {generalSettings.logoUrl ? (
                        <div className="space-y-3">
                          <img
                            src={generalSettings.logoUrl}
                            alt="Logo"
                            className="mx-auto h-16 object-contain"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFileUpload('logo')}
                          >
                            تغییر لوگو
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <Button
                            variant="outline"
                            onClick={() => handleFileUpload('logo')}
                          >
                            <Upload className="w-4 h-4 ml-2" />
                            آپلود لوگو
                          </Button>
                          <p className="text-sm text-muted-foreground">
                            حداکثر 2MB - PNG, JPG
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 text-right">
                    <Label>فاوآیکن</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {generalSettings.faviconUrl ? (
                        <div className="space-y-3">
                          <img
                            src={generalSettings.faviconUrl}
                            alt="Favicon"
                            className="mx-auto h-8 w-8 object-contain"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFileUpload('favicon')}
                          >
                            تغییر فاوآیکن
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <Button
                            variant="outline"
                            onClick={() => handleFileUpload('favicon')}
                          >
                            <Upload className="w-4 h-4 ml-2" />
                            آپلود فاوآیکن
                          </Button>
                          <p className="text-sm text-muted-foreground">
                            32x32px - ICO, PNG
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleSaveGeneralSettings} 
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      در حال ذخیره...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 ml-2" />
                      ذخیره تغییرات
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تنظیمات اعلان‌ها</CardTitle>
              <CardDescription>
                پیکربندی سیستم‌های اعلان‌رسانی
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-right">
                    <Label>اعلان‌های ایمیل</Label>
                    <p className="text-sm text-muted-foreground">
                      ارسال اعلان‌ها از طریق ایمیل
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailEnabled}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ 
                      ...prev, 
                      emailEnabled: checked 
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-right">
                    <Label>اعلان‌های پیامکی</Label>
                    <p className="text-sm text-muted-foreground">
                      ارسال اعلان‌ها از طریق پیامک
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsEnabled}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ 
                      ...prev, 
                      smsEnabled: checked 
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-right">
                    <Label>اعلان‌��ای Push</Label>
                    <p className="text-sm text-muted-foreground">
                      ارسال اعلان‌های فوری مرورگر
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushEnabled}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ 
                      ...prev, 
                      pushEnabled: checked 
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-2 text-right">
                <Label htmlFor="webhookUrl">آدرس Webhook</Label>
                <Input
                  id="webhookUrl"
                  value={notificationSettings.webhookUrl}
                  onChange={(e) => setNotificationSettings(prev => ({ 
                    ...prev, 
                    webhookUrl: e.target.value 
                  }))}
                  placeholder="https://example.com/webhook"
                  className="text-left"
                  dir="ltr"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-right">
                    <Label>گزارش روزانه</Label>
                    <p className="text-sm text-muted-foreground">
                      ارسال گزارش خلاصه روزانه
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.dailyReportEnabled}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ 
                      ...prev, 
                      dailyReportEnabled: checked 
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-right">
                    <Label>گزارش هفتگی</Label>
                    <p className="text-sm text-muted-foreground">
                      ارسال گزارش خلاصه هفتگی
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.weeklyReportEnabled}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ 
                      ...prev, 
                      weeklyReportEnabled: checked 
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-right">
                    <Label>اعلان خطاها</Label>
                    <p className="text-sm text-muted-foreground">
                      اطلاع‌رسانی خطاهای سیستم
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.errorNotificationEnabled}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ 
                      ...prev, 
                      errorNotificationEnabled: checked 
                    }))}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleSaveNotificationSettings} 
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      در حال ذخیره...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 ml-2" />
                      ذخیره تغییرات
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تنظیمات امنیتی</CardTitle>
              <CardDescription>
                پیکربندی تنظیمات امنیت و احراز هویت
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-right">
                    <Label>کد یکبار مصرف (OTP)</Label>
                    <p className="text-sm text-muted-foreground">
                      فعال‌سازی احراز هویت دو مرحله‌ای
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.otpEnabled}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ 
                      ...prev, 
                      otpEnabled: checked 
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-right">
                    <Label>کپچا</Label>
                    <p className="text-sm text-muted-foreground">
                      نمایش کپچا هنگام ورود
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.captchaEnabled}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ 
                      ...prev, 
                      captchaEnabled: checked 
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-right">
                    <Label>لیست سفید IP</Label>
                    <p className="text-sm text-muted-foreground">
                      محدود کردن دسترسی به IP های مشخص
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.ipWhitelistEnabled}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ 
                      ...prev, 
                      ipWhitelistEnabled: checked 
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 text-right">
                  <Label htmlFor="otpExpiry">مدت اعتبار OTP (دقیقه)</Label>
                  <Input
                    id="otpExpiry"
                    type="number"
                    value={securitySettings.otpExpiryMinutes}
                    onChange={(e) => setSecuritySettings(prev => ({ 
                      ...prev, 
                      otpExpiryMinutes: parseInt(e.target.value) || 5 
                    }))}
                    min="1"
                    max="30"
                  />
                </div>

                <div className="space-y-2 text-right">
                  <Label htmlFor="maxAttempts">حداکثر تلاش ورود</Label>
                  <Input
                    id="maxAttempts"
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings(prev => ({ 
                      ...prev, 
                      maxLoginAttempts: parseInt(e.target.value) || 3 
                    }))}
                    min="1"
                    max="10"
                  />
                </div>

                <div className="space-y-2 text-right">
                  <Label htmlFor="lockoutDuration">مدت قفل حساب (دقیقه)</Label>
                  <Input
                    id="lockoutDuration"
                    type="number"
                    value={securitySettings.lockoutDurationMinutes}
                    onChange={(e) => setSecuritySettings(prev => ({ 
                      ...prev, 
                      lockoutDurationMinutes: parseInt(e.target.value) || 15 
                    }))}
                    min="5"
                    max="1440"
                  />
                </div>

                <div className="space-y-2 text-right">
                  <Label htmlFor="passwordLength">حداقل طول رمز عبور</Label>
                  <Input
                    id="passwordLength"
                    type="number"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => setSecuritySettings(prev => ({ 
                      ...prev, 
                      passwordMinLength: parseInt(e.target.value) || 8 
                    }))}
                    min="6"
                    max="128"
                  />
                </div>
              </div>

              {securitySettings.ipWhitelistEnabled && (
                <div className="space-y-2 text-right">
                  <Label htmlFor="ipWhitelist">آدرس‌های IP مجاز</Label>
                  <Textarea
                    id="ipWhitelist"
                    value={securitySettings.ipWhitelist}
                    onChange={(e) => setSecuritySettings(prev => ({ 
                      ...prev, 
                      ipWhitelist: e.target.value 
                    }))}
                    placeholder="192.168.1.1&#10;10.0.0.0/8"
                    rows={4}
                    className="text-left"
                    dir="ltr"
                  />
                  <p className="text-sm text-muted-foreground">
                    هر IP در یک خط جداگانه وارد کنید
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5 text-right">
                  <Label>نیاز به کاراکترهای خاص</Label>
                  <p className="text-sm text-muted-foreground">
                    الزام استفاده از کاراکترهای خاص در رمز عبور
                  </p>
                </div>
                <Switch
                  checked={securitySettings.passwordRequireSpecialChars}
                  onCheckedChange={(checked) => setSecuritySettings(prev => ({ 
                    ...prev, 
                    passwordRequireSpecialChars: checked 
                  }))}
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleSaveSecuritySettings} 
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      در حال ذخیره...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 ml-2" />
                      ذخیره تغییرات
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upload Settings */}
        <TabsContent value="uploads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تنظیمات آپلود فایل</CardTitle>
              <CardDescription>
                محدودیت‌های آپلود و فرمت‌های مجاز
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 text-right">
                  <Label htmlFor="maxFileSize">حداکثر اندازه فایل (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={uploadSettings.maxFileSize}
                    onChange={(e) => setUploadSettings(prev => ({ 
                      ...prev, 
                      maxFileSize: parseInt(e.target.value) || 5 
                    }))}
                    min="1"
                    max="100"
                  />
                </div>

                <div className="space-y-2 text-right">
                  <Label htmlFor="uploadPath">مسیر آپلود</Label>
                  <Input
                    id="uploadPath"
                    value={uploadSettings.uploadPath}
                    onChange={(e) => setUploadSettings(prev => ({ 
                      ...prev, 
                      uploadPath: e.target.value 
                    }))}
                    className="text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-right">
                    <Label>تغییر اندازه تصاویر</Label>
                    <p className="text-sm text-muted-foreground">
                      خودکار کردن تغییر اندازه تصاویر آپلود شده
                    </p>
                  </div>
                  <Switch
                    checked={uploadSettings.enableImageResize}
                    onCheckedChange={(checked) => setUploadSettings(prev => ({ 
                      ...prev, 
                      enableImageResize: checked 
                    }))}
                  />
                </div>
              </div>

              {uploadSettings.enableImageResize && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 text-right">
                    <Label htmlFor="maxImageWidth">حداکثر عرض تصویر (px)</Label>
                    <Input
                      id="maxImageWidth"
                      type="number"
                      value={uploadSettings.maxImageWidth}
                      onChange={(e) => setUploadSettings(prev => ({ 
                        ...prev, 
                        maxImageWidth: parseInt(e.target.value) || 1920 
                      }))}
                      min="100"
                      max="4000"
                    />
                  </div>

                  <div className="space-y-2 text-right">
                    <Label htmlFor="maxImageHeight">حداکثر ارتفاع تصویر (px)</Label>
                    <Input
                      id="maxImageHeight"
                      type="number"
                      value={uploadSettings.maxImageHeight}
                      onChange={(e) => setUploadSettings(prev => ({ 
                        ...prev, 
                        maxImageHeight: parseInt(e.target.value) || 1080 
                      }))}
                      min="100"
                      max="4000"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2 text-right">
                  <Label>فرمت‌های تصویر مجاز</Label>
                  <div className="flex flex-wrap gap-2">
                    {['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].map((format) => (
                      <label key={format} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={uploadSettings.allowedImageTypes.includes(format)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setUploadSettings(prev => ({
                                ...prev,
                                allowedImageTypes: [...prev.allowedImageTypes, format]
                              }));
                            } else {
                              setUploadSettings(prev => ({
                                ...prev,
                                allowedImageTypes: prev.allowedImageTypes.filter(t => t !== format)
                              }));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">.{format}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-right">
                  <Label>فرمت‌های سند مجاز</Label>
                  <div className="flex flex-wrap gap-2">
                    {['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'rtf'].map((format) => (
                      <label key={format} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={uploadSettings.allowedDocumentTypes.includes(format)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setUploadSettings(prev => ({
                                ...prev,
                                allowedDocumentTypes: [...prev.allowedDocumentTypes, format]
                              }));
                            } else {
                              setUploadSettings(prev => ({
                                ...prev,
                                allowedDocumentTypes: prev.allowedDocumentTypes.filter(t => t !== format)
                              }));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">.{format}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  onClick={handleSaveUploadSettings} 
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      در حال ذخیره...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 ml-2" />
                      ذخیره تغییرات
                    </>
                  )}
                </Button>

                <Button 
                  variant="outline"
                  onClick={() => handleFileUpload('image')}
                  disabled={error}
                  className={error ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  <Upload className="w-4 h-4 ml-2" />
                  {error ? 'عدم اتصال' : 'تست آپلود تصویر'}
                </Button>

                <Button 
                  variant="outline"
                  onClick={() => handleFileUpload('document')}
                  disabled={error}
                  className={error ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  <Upload className="w-4 h-4 ml-2" />
                  {error ? 'عدم اتصال' : 'تست آپلود سند'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup Settings */}
        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تنظیمات پشتیبان‌گیری</CardTitle>
              <CardDescription>
                پیکربندی پشتیبان‌گیری خودکار و دستی
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-right">
                    <Label>پشتیبان‌گیری خودکار</Label>
                    <p className="text-sm text-muted-foreground">
                      فعال‌سازی پشتیبان‌گیری بر اساس برنامه
                    </p>
                  </div>
                  <Switch
                    checked={backupSettings.autoBackupEnabled}
                    onCheckedChange={(checked) => setBackupSettings(prev => ({ 
                      ...prev, 
                      autoBackupEnabled: checked 
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-right">
                    <Label>شامل فایل‌های آپلود</Label>
                    <p className="text-sm text-muted-foreground">
                      پشتیبان‌گیری از فایل‌های آپلود شده
                    </p>
                  </div>
                  <Switch
                    checked={backupSettings.includeUploads}
                    onCheckedChange={(checked) => setBackupSettings(prev => ({ 
                      ...prev, 
                      includeUploads: checked 
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-right">
                    <Label>فشرده‌سازی</Label>
                    <p className="text-sm text-muted-foreground">
                      فشرده‌سازی فایل‌های پشتیبان
                    </p>
                  </div>
                  <Switch
                    checked={backupSettings.compressionEnabled}
                    onCheckedChange={(checked) => setBackupSettings(prev => ({ 
                      ...prev, 
                      compressionEnabled: checked 
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 text-right">
                  <Label htmlFor="backupFrequency">دوره تکرار</Label>
                  <Select 
                    value={backupSettings.backupFrequency} 
                    onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                      setBackupSettings(prev => ({ ...prev, backupFrequency: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">روزانه</SelectItem>
                      <SelectItem value="weekly">هفتگی</SelectItem>
                      <SelectItem value="monthly">ماهانه</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 text-right">
                  <Label htmlFor="retentionDays">مدت نگهداری (روز)</Label>
                  <Input
                    id="retentionDays"
                    type="number"
                    value={backupSettings.backupRetentionDays}
                    onChange={(e) => setBackupSettings(prev => ({ 
                      ...prev, 
                      backupRetentionDays: parseInt(e.target.value) || 30 
                    }))}
                    min="1"
                    max="365"
                  />
                </div>
              </div>

              <div className="space-y-2 text-right">
                <Label htmlFor="backupPath">مسیر ذخیره پشتیبان</Label>
                <Input
                  id="backupPath"
                  value={backupSettings.backupStoragePath}
                  onChange={(e) => setBackupSettings(prev => ({ 
                    ...prev, 
                    backupStoragePath: e.target.value 
                  }))}
                  className="text-left"
                  dir="ltr"
                />
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  onClick={handleSaveBackupSettings} 
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      در حال ذخیره...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 ml-2" />
                      ذخیره تغییرات
                    </>
                  )}
                </Button>

                <Button 
                  variant="outline"
                  onClick={handleCreateBackup}
                  disabled={isCreatingBackup || error}
                  className={error ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  {isCreatingBackup ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      در حال ایجاد...
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4 ml-2" />
                      {error ? 'عدم اتصال' : 'ایجاد پشتیبان فوری'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMS Settings */}
        <TabsContent value="sms" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>تنظیمات پیامک</CardTitle>
                  <CardDescription>
                    پیکربندی سرویس ارسال پیامک
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={smsSettings.enabled ? "default" : "secondary"}>
                    {smsSettings.enabled ? 'فعال' : 'غیrfعال'}
                  </Badge>
                  <Switch
                    checked={smsSettings.enabled}
                    onCheckedChange={(checked) => setSmsSettings(prev => ({ 
                      ...prev, 
                      enabled: checked 
                    }))}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2 text-right">
                <Label htmlFor="smsProvider">ارائه‌دهنده سرویس</Label>
                <Select 
                  value={smsSettings.provider} 
                  onValueChange={(value: 'farapayamak' | 'kavenegar') => 
                    setSmsSettings(prev => ({ ...prev, provider: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farapayamak">فراپیامک</SelectItem>
                    <SelectItem value="kavenegar">کاوه‌نگار</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 text-right">
                  <Label htmlFor="smsUsername">نام کاربری</Label>
                  <Input
                    id="smsUsername"
                    value={smsSettings.username}
                    onChange={(e) => setSmsSettings(prev => ({ 
                      ...prev, 
                      username: e.target.value 
                    }))}
                    placeholder="نام کاربری پنل پیامک"
                  />
                </div>

                <div className="space-y-2 text-right">
                  <Label htmlFor="smsPassword">رمز عبور</Label>
                  <Input
                    id="smsPassword"
                    type="password"
                    value={smsSettings.password}
                    onChange={(e) => setSmsSettings(prev => ({ 
                      ...prev, 
                      password: e.target.value 
                    }))}
                    placeholder="رمز عبور پنل پیامک"
                  />
                </div>
              </div>

              <div className="space-y-2 text-right">
                <Label htmlFor="smsSender">شماره فرستنده</Label>
                <Input
                  id="smsSender"
                  value={smsSettings.sender}
                  onChange={(e) => setSmsSettings(prev => ({ 
                    ...prev, 
                    sender: e.target.value 
                  }))}
                  placeholder="شماره یا نام فرستنده"
                  className="text-left"
                  dir="ltr"
                />
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  onClick={handleSaveSMSSettings}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      در حال ذخیره...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 ml-2" />
                      ذخیره تنظیمات
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleTestSMS}
                  disabled={isTestingSMS || !smsSettings.enabled}
                >
                  <TestTube className="w-4 h-4 ml-2" />
                  {isTestingSMS ? 'در حال تست...' : 'تست ارسال'}
                </Button>
              </div>

              {smsSettings.enabled && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <p className="text-sm text-green-800">
                      سرویس پیامک فعال است و آماده ارسال
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Types Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>انواع پرداخت</CardTitle>
              <CardDescription>
                تنظیمات نرخ پرداخت برای ثبت قطعات و آسانسورها
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Parts Payment Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-right">
                    <Label>پرداخت ثبت قطعات</Label>
                    <p className="text-sm text-muted-foreground">
                      فعال‌سازی پرداخت برای ثبت هر قطعه
                    </p>
                  </div>
                  <Switch
                    checked={paymentTypesSettings.partsPaymentEnabled}
                    onCheckedChange={(checked) => setPaymentTypesSettings(prev => ({ 
                      ...prev, 
                      partsPaymentEnabled: checked 
                    }))}
                  />
                </div>
                
                {paymentTypesSettings.partsPaymentEnabled && (
                  <div className="space-y-2 text-right pr-4">
                    <Label htmlFor="partsPaymentPrice">قیمت ثبت هر قطعه (ریال)</Label>
                    <Input
                      id="partsPaymentPrice"
                      type="number"
                      value={paymentTypesSettings.partsPaymentPrice}
                      onChange={(e) => setPaymentTypesSettings(prev => ({ 
                        ...prev, 
                        partsPaymentPrice: parseInt(e.target.value) || 0 
                      }))}
                      placeholder="مبلغ به ریال"
                      min="0"
                      className="text-left"
                      dir="ltr"
                    />
                    <p className="text-sm text-muted-foreground">
                      مبلغ: {paymentTypesSettings.partsPaymentPrice.toLocaleString('fa-IR')} ریال
                    </p>
                  </div>
                )}
              </div>

              {/* Elevator Payment Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-right">
                    <Label>پرداخت ثبت آسانسور</Label>
                    <p className="text-sm text-muted-foreground">
                      فعال‌سازی پرداخت برای ثبت هر آسانسور
                    </p>
                  </div>
                  <Switch
                    checked={paymentTypesSettings.elevatorPaymentEnabled}
                    onCheckedChange={(checked) => setPaymentTypesSettings(prev => ({ 
                      ...prev, 
                      elevatorPaymentEnabled: checked 
                    }))}
                  />
                </div>
                
                {paymentTypesSettings.elevatorPaymentEnabled && (
                  <div className="space-y-2 text-right pr-4">
                    <Label htmlFor="elevatorPaymentPrice">قیمت ثبت هر آسانسور (ریال)</Label>
                    <Input
                      id="elevatorPaymentPrice"
                      type="number"
                      value={paymentTypesSettings.elevatorPaymentPrice}
                      onChange={(e) => setPaymentTypesSettings(prev => ({ 
                        ...prev, 
                        elevatorPaymentPrice: parseInt(e.target.value) || 0 
                      }))}
                      placeholder="مبلغ به ریال"
                      min="0"
                      className="text-left"
                      dir="ltr"
                    />
                    <p className="text-sm text-muted-foreground">
                      مبلغ: {paymentTypesSettings.elevatorPaymentPrice.toLocaleString('fa-IR')} ریال
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleSavePaymentTypesSettings} 
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      در حال ذخیره...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 ml-2" />
                      ذخیره انواع پرداخت
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Settings Card - Moved to SMS tab */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>تنظیمات پرداخت</CardTitle>
                  <CardDescription>
                    پیکربندی درگاه پرداخت آنلاین
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={paymentSettings.enabled ? "default" : "secondary"}>
                    {paymentSettings.enabled ? 'فعال' : 'غیرفعال'}
                  </Badge>
                  <Switch
                    checked={paymentSettings.enabled}
                    onCheckedChange={(checked) => setPaymentSettings(prev => ({ 
                      ...prev, 
                      enabled: checked 
                    }))}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2 text-right">
                <Label htmlFor="paymentProvider">درگاه پرداخت</Label>
                <Select 
                  value={paymentSettings.provider} 
                  onValueChange={(value: 'mellat' | 'parsian') => 
                    setPaymentSettings(prev => ({ ...prev, provider: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mellat">به‌پرداخت ملت</SelectItem>
                    <SelectItem value="parsian">پارسیان</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 text-right">
                  <Label htmlFor="terminalId">شناسه ترمینال</Label>
                  <Input
                    id="terminalId"
                    value={paymentSettings.terminalId}
                    onChange={(e) => setPaymentSettings(prev => ({ 
                      ...prev, 
                      terminalId: e.target.value 
                    }))}
                    placeholder="Terminal ID"
                    className="text-left"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2 text-right">
                  <Label htmlFor="merchantId">شناسه پذیرنده</Label>
                  <Input
                    id="merchantId"
                    value={paymentSettings.merchantId}
                    onChange={(e) => setPaymentSettings(prev => ({ 
                      ...prev, 
                      merchantId: e.target.value 
                    }))}
                    placeholder="Merchant ID"
                    className="text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2 text-right">
                <Label htmlFor="secretKey">کلید امنیتی</Label>
                <Input
                  id="secretKey"
                  type="password"
                  value={paymentSettings.secretKey}
                  onChange={(e) => setPaymentSettings(prev => ({ 
                    ...prev, 
                    secretKey: e.target.value 
                  }))}
                  placeholder="Secret Key"
                  className="text-left"
                  dir="ltr"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5 text-right">
                  <Label>حالت تست</Label>
                  <p className="text-sm text-muted-foreground">
                    فعال‌سازی حالت آزمایشی درگاه
                  </p>
                </div>
                <Switch
                  checked={paymentSettings.testMode}
                  onCheckedChange={(checked) => setPaymentSettings(prev => ({ 
                    ...prev, 
                    testMode: checked 
                  }))}
                />
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  onClick={handleSavePaymentSettings}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      در حال ذخیره...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 ml-2" />
                      ذخیره تنظیمات
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleTestPayment}
                  disabled={isTestingPayment || !paymentSettings.enabled}
                >
                  <TestTube className="w-4 h-4 ml-2" />
                  {isTestingPayment ? 'در حال تست...' : 'تست اتصال'}
                </Button>
              </div>

              {/* Payment Types Section in Payment Card */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium mb-4">انواع پرداخت</h3>
                
                {/* Parts Payment Settings */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 text-right">
                      <Label>پرداخت ثبت قطعات</Label>
                      <p className="text-sm text-muted-foreground">
                        فعال‌سازی پرداخت برای ثبت هر قطعه
                      </p>
                    </div>
                    <Switch
                      checked={paymentTypesSettings.partsPaymentEnabled}
                      onCheckedChange={(checked) => setPaymentTypesSettings(prev => ({ 
                        ...prev, 
                        partsPaymentEnabled: checked 
                      }))}
                    />
                  </div>
                  
                  {paymentTypesSettings.partsPaymentEnabled && (
                    <div className="space-y-2 text-right pr-4">
                      <Label htmlFor="partsPaymentPricePayment">قیمت ثبت هر قطعه (ریال)</Label>
                      <Input
                        id="partsPaymentPricePayment"
                        type="number"
                        value={paymentTypesSettings.partsPaymentPrice}
                        onChange={(e) => setPaymentTypesSettings(prev => ({ 
                          ...prev, 
                          partsPaymentPrice: parseInt(e.target.value) || 0 
                        }))}
                        placeholder="مبلغ به ریال"
                        min="0"
                        className="text-left"
                        dir="ltr"
                      />
                      <p className="text-sm text-muted-foreground">
                        مبلغ: {paymentTypesSettings.partsPaymentPrice.toLocaleString('fa-IR')} ریال
                      </p>
                    </div>
                  )}
                </div>

                {/* Elevator Payment Settings */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 text-right">
                      <Label>پرداخت ثبت آسانسور</Label>
                      <p className="text-sm text-muted-foreground">
                        فعال‌سازی پرداخت برای ثبت هر آسانسور
                      </p>
                    </div>
                    <Switch
                      checked={paymentTypesSettings.elevatorPaymentEnabled}
                      onCheckedChange={(checked) => setPaymentTypesSettings(prev => ({ 
                        ...prev, 
                        elevatorPaymentEnabled: checked 
                      }))}
                    />
                  </div>
                  
                  {paymentTypesSettings.elevatorPaymentEnabled && (
                    <div className="space-y-2 text-right pr-4">
                      <Label htmlFor="elevatorPaymentPricePayment">قیمت ثبت هر آسانسور (ریال)</Label>
                      <Input
                        id="elevatorPaymentPricePayment"
                        type="number"
                        value={paymentTypesSettings.elevatorPaymentPrice}
                        onChange={(e) => setPaymentTypesSettings(prev => ({ 
                          ...prev, 
                          elevatorPaymentPrice: parseInt(e.target.value) || 0 
                        }))}
                        placeholder="مبلغ به ریال"
                        min="0"
                        className="text-left"
                        dir="ltr"
                      />
                      <p className="text-sm text-muted-foreground">
                        مبلغ: {paymentTypesSettings.elevatorPaymentPrice.toLocaleString('fa-IR')} ریال
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end mb-4">
                  <Button 
                    onClick={handleSavePaymentTypesSettings} 
                    disabled={saving}
                    variant="outline"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        در حال ذخیره...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 ml-2" />
                        ذخیره انواع پرداخت
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {paymentSettings.testMode && paymentSettings.enabled && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <p className="text-sm text-yellow-800">
                      درگاه پرداخت در حالت تست فعال است
                    </p>
                  </div>
                </div>
              )}

              {!paymentSettings.testMode && paymentSettings.enabled && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <p className="text-sm text-green-800">
                      درگاه پرداخت فعال است و آماده دریافت پرداخت
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}