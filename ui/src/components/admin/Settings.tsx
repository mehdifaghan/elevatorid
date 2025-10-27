import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
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
  Bell,
  Shield,
  Database,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  supportEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  logoUrl: string;
  faviconUrl: string;
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

export default function Settings() {
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: 'سامانه ردیابی قطعات آسانسور',
    siteDescription: 'سامانه جامع ردیابی قطعات و شناسنامه آسانسور',
    supportEmail: 'support@elevator-system.ir',
    supportPhone: '021-88776655',
    maintenanceMode: false,
    registrationEnabled: true,
    logoUrl: '',
    faviconUrl: ''
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

  const [isTestingSMS, setIsTestingSMS] = useState(false);
  const [isTestingPayment, setIsTestingPayment] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);

  const handleSaveSystemSettings = async () => {
    setSaving(true);
    try {
      // Here you would call the API to save system settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      toast.success('تنظیمات عمومی ذخیره شد');
    } catch (error) {
      toast.error('خطا در ذخیره تنظیمات عمومی');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSMSSettings = async () => {
    if (!smsSettings.username || !smsSettings.password) {
      toast.error('نام کاربری و رمز عبور الزامی است');
      return;
    }
    
    setSaving(true);
    try {
      // Here you would call the API to save SMS settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      toast.success('تنظیمات پیامک ذخیره شد');
    } catch (error) {
      toast.error('خطا در ذخیره تنظیمات پیامک');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePaymentSettings = async () => {
    if (!paymentSettings.terminalId || !paymentSettings.merchantId || !paymentSettings.secretKey) {
      toast.error('تمام فیلدهای پرداخت الزامی است');
      return;
    }
    
    setSaving(true);
    try {
      // Here you would call the API to save payment settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      toast.success('تنظیمات پرداخت ذخیره شد');
    } catch (error) {
      toast.error('خطا در ذخیره تنظیمات پرداخت');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePaymentTypesSettings = async () => {
    setSaving(true);
    try {
      // Here you would call the API to save payment types settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      toast.success('تنظیمات انواع پرداخت ذخیره شد');
    } catch (error) {
      toast.error('خطا در ذخیره تنظیمات انواع پرداخت');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotificationSettings = async () => {
    setSaving(true);
    try {
      // Here you would call the API to save notification settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      toast.success('تنظیمات اعلان‌ها ذخیره شد');
    } catch (error) {
      toast.error('خطا در ذخیره تنظیمات اعلان‌ها');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSecuritySettings = async () => {
    if (securitySettings.passwordMinLength < 6) {
      toast.error('حداقل طول رمز عبور باید 6 کاراکتر باشد');
      return;
    }
    
    setSaving(true);
    try {
      // Here you would call the API to save security settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      toast.success('تنظیمات امنیت ذخیره شد');
    } catch (error) {
      toast.error('خطا در ذخیره تنظیمات امنیت');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveUploadSettings = async () => {
    if (uploadSettings.maxFileSize <= 0) {
      toast.error('حداکثر اندازه فایل باید بیشتر از 0 باشد');
      return;
    }
    
    setSaving(true);
    try {
      // Here you would call the API to save upload settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      toast.success('تنظیمات آپلود ذخیره شد');
    } catch (error) {
      toast.error('خطا در ذخیره تنظیمات آپلود');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBackupSettings = async () => {
    setSaving(true);
    try {
      // Here you would call the API to save backup settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      toast.success('تنظیمات پشتیبان‌گیری ذخیره شد');
    } catch (error) {
      toast.error('خطا در ذخیره تنظیمات پشتیبان‌گیری');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    try {
      // Here you would call the API to create backup
      await new Promise(resolve => setTimeout(resolve, 3000)); // Mock delay
      toast.success('پشتیبان‌گیری با موفقیت انجام شد');
    } catch (error) {
      toast.error('خطا در ایجاد پشتیبان');
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleTestSMS = async () => {
    if (!smsSettings.username || !smsSettings.password) {
      toast.error('ابتدا تنظیمات پیامک را ذخیره کنید');
      return;
    }

    setIsTestingSMS(true);
    try {
      // Mock API call to test SMS
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('پیامک تست با موفقیت ارسال شد');
    } catch (error) {
      toast.error('خطا در ارسال پیامک تست');
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
      // Mock API call to test payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('اتصال به درگاه پرداخت موفقیت‌آمیز بود');
    } catch (error) {
      toast.error('خطا در اتصال به درگاه پرداخت');
    } finally {
      setIsTestingPayment(false);
    }
  };

  const handleFileUpload = (type: 'logo' | 'favicon') => {
    // Mock file upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // In real implementation, you would upload the file and get a URL
        const mockUrl = URL.createObjectURL(file);
        if (type === 'logo') {
          setSystemSettings(prev => ({ ...prev, logoUrl: mockUrl }));
        } else {
          setSystemSettings(prev => ({ ...prev, faviconUrl: mockUrl }));
        }
        toast.success(`${type === 'logo' ? 'لوگو' : 'فاوآیکن'} آپلود شد`);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="text-right">
        <h1 className="text-3xl font-bold">تنظیمات سیستم</h1>
        <p className="text-muted-foreground">مدیریت تنظیمات عمومی سامانه</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6" dir="rtl">
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
                    value={systemSettings.siteName}
                    onChange={(e) => setSystemSettings(prev => ({ 
                      ...prev, 
                      siteName: e.target.value 
                    }))}
                  />
                </div>

                <div className="space-y-2 text-right">
                  <Label htmlFor="supportPhone">تلفن پشتیبانی</Label>
                  <Input
                    id="supportPhone"
                    value={systemSettings.supportPhone}
                    onChange={(e) => setSystemSettings(prev => ({ 
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
                  value={systemSettings.siteDescription}
                  onChange={(e) => setSystemSettings(prev => ({ 
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
                  value={systemSettings.supportEmail}
                  onChange={(e) => setSystemSettings(prev => ({ 
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
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(checked) => setSystemSettings(prev => ({ 
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
                    checked={systemSettings.registrationEnabled}
                    onCheckedChange={(checked) => setSystemSettings(prev => ({ 
                      ...prev, 
                      registrationEnabled: checked 
                    }))}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSystemSettings} disabled={saving}>
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

          {/* Logo and Favicon */}
          <Card>
            <CardHeader>
              <CardTitle>لوگو و فاوآیکن</CardTitle>
              <CardDescription>
                آپلود و مدیریت تصاویر سایت
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 text-right">
                  <Label>لوگوی سایت</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {systemSettings.logoUrl ? (
                      <div className="space-y-3">
                        <img
                          src={systemSettings.logoUrl}
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
                    {systemSettings.faviconUrl ? (
                      <div className="space-y-3">
                        <img
                          src={systemSettings.faviconUrl}
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تنظیمات اعلان‌ها</CardTitle>
              <CardDescription>
                پیکربندی سیستم اعلان‌رسانی
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-right">
                    <Label>اعلان‌های ایمیلی</Label>
                    <p className="text-sm text-muted-foreground">
                      فعال‌سازی ارسال اعلان‌ها از طریق ایمیل
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
              </div>

              {/* SMS Notifications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-right">
                    <Label>اعلان‌های پیامکی</Label>
                    <p className="text-sm text-muted-foreground">
                      فعال‌سازی ارسال اعلان‌ها از طریق پیامک
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
              </div>

              {/* Push Notifications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-right">
                    <Label>اعلان‌های Push</Label>
                    <p className="text-sm text-muted-foreground">
                      فعال‌سازی اعلان‌های فوری مرورگر
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

              {/* Webhook URL */}
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
                <p className="text-sm text-muted-foreground">
                  آدرس webhook برای دریافت اعلان‌های سیستمی
                </p>
              </div>

              {/* Report Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">گزارش‌های دوره‌ای</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-right">
                    <Label>گزارش روزانه</Label>
                    <p className="text-sm text-muted-foreground">
                      ارسال گزارش عملکرد روزانه
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
                      ارسال گزارش عملکرد هفتگی
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
                      ارسال فوری اعلان‌های خطا و مشکل
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
                <Button onClick={handleSaveNotificationSettings} disabled={saving}>
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تنظیمات امنیت</CardTitle>
              <CardDescription>
                پیکربندی امنیت سیستم و احراز هویت
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* OTP Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-right">
                    <Label>فعال‌سازی OTP</Label>
                    <p className="text-sm text-muted-foreground">
                      احراز هویت دو مرحله‌ای با کد یکبار مصرف
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

                {securitySettings.otpEnabled && (
                  <div className="space-y-2 text-right pr-4">
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
                      max="60"
                      className="text-left"
                      dir="ltr"
                    />
                  </div>
                )}
              </div>

              {/* Login Security */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">امنیت ورود</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 text-right">
                    <Label htmlFor="maxLoginAttempts">حداکثر تلاش ورود</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => setSecuritySettings(prev => ({ 
                        ...prev, 
                        maxLoginAttempts: parseInt(e.target.value) || 3 
                      }))}
                      min="1"
                      max="10"
                      className="text-left"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2 text-right">
                    <Label htmlFor="lockoutDuration">مدت قفل شدن (دقیقه)</Label>
                    <Input
                      id="lockoutDuration"
                      type="number"
                      value={securitySettings.lockoutDurationMinutes}
                      onChange={(e) => setSecuritySettings(prev => ({ 
                        ...prev, 
                        lockoutDurationMinutes: parseInt(e.target.value) || 15 
                      }))}
                      min="1"
                      max="1440"
                      className="text-left"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* Password Policy */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">سیاست رمز عبور</h3>
                
                <div className="space-y-2 text-right">
                  <Label htmlFor="passwordMinLength">حداقل طول رمز عبور</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => setSecuritySettings(prev => ({ 
                      ...prev, 
                      passwordMinLength: parseInt(e.target.value) || 8 
                    }))}
                    min="6"
                    max="50"
                    className="text-left"
                    dir="ltr"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-right">
                    <Label>الزامی بودن کاراکترهای ویژه</Label>
                    <p className="text-sm text-muted-foreground">
                      رمز عبور باید شامل نمادها باشد
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
              </div>

              {/* Additional Security */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-right">
                    <Label>فعال‌سازی کپچا</Label>
                    <p className="text-sm text-muted-foreground">
                      نمایش کپچا در فرم‌های ورود و ثبت‌نام
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
                    <Label>محدودسازی IP</Label>
                    <p className="text-sm text-muted-foreground">
                      فعال‌سازی لیست سفید IP
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

                {securitySettings.ipWhitelistEnabled && (
                  <div className="space-y-2 text-right pr-4">
                    <Label htmlFor="ipWhitelist">لیست IP مجاز</Label>
                    <Textarea
                      id="ipWhitelist"
                      value={securitySettings.ipWhitelist}
                      onChange={(e) => setSecuritySettings(prev => ({ 
                        ...prev, 
                        ipWhitelist: e.target.value 
                      }))}
                      placeholder="192.168.1.1&#10;192.168.1.100-192.168.1.200"
                      rows={4}
                      className="text-left"
                      dir="ltr"
                    />
                    <p className="text-sm text-muted-foreground">
                      هر IP یا محدوده را در خط جداگانه وارد کنید
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSecuritySettings} disabled={saving}>
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upload Settings */}
        <TabsContent value="uploads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تنظیمات آپلود</CardTitle>
              <CardDescription>
                پیکربندی آپلود فایل‌ها و تصاویر
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Size Limits */}
              <div className="space-y-2 text-right">
                <Label htmlFor="maxFileSize">حداکثر اندازه فایل (مگابایت)</Label>
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
                  className="text-left"
                  dir="ltr"
                />
              </div>

              {/* Upload Path */}
              <div className="space-y-2 text-right">
                <Label htmlFor="uploadPath">مسیر ذخیره فایل‌ها</Label>
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

              {/* Allowed File Types */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">انواع فایل مجاز</h3>
                
                <div className="space-y-2 text-right">
                  <Label htmlFor="allowedImageTypes">فرمت‌های تصویر مجاز</Label>
                  <Input
                    id="allowedImageTypes"
                    value={uploadSettings.allowedImageTypes.join(', ')}
                    onChange={(e) => setUploadSettings(prev => ({ 
                      ...prev, 
                      allowedImageTypes: e.target.value.split(',').map(type => type.trim()) 
                    }))}
                    placeholder="jpg, jpeg, png, gif"
                    className="text-left"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2 text-right">
                  <Label htmlFor="allowedDocumentTypes">فرمت‌های سند مجاز</Label>
                  <Input
                    id="allowedDocumentTypes"
                    value={uploadSettings.allowedDocumentTypes.join(', ')}
                    onChange={(e) => setUploadSettings(prev => ({ 
                      ...prev, 
                      allowedDocumentTypes: e.target.value.split(',').map(type => type.trim()) 
                    }))}
                    placeholder="pdf, doc, docx, xls, xlsx"
                    className="text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Image Processing */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-right">
                    <Label>تغییر اندازه خودکار تصاویر</Label>
                    <p className="text-sm text-muted-foreground">
                      کاهش اندازه تصاویر بزرگ
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

                {uploadSettings.enableImageResize && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-4">
                    <div className="space-y-2 text-right">
                      <Label htmlFor="maxImageWidth">حداکثر عرض (پیکسل)</Label>
                      <Input
                        id="maxImageWidth"
                        type="number"
                        value={uploadSettings.maxImageWidth}
                        onChange={(e) => setUploadSettings(prev => ({ 
                          ...prev, 
                          maxImageWidth: parseInt(e.target.value) || 1920 
                        }))}
                        min="100"
                        max="5000"
                        className="text-left"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-2 text-right">
                      <Label htmlFor="maxImageHeight">حداکثر ارتفاع (پیکسل)</Label>
                      <Input
                        id="maxImageHeight"
                        type="number"
                        value={uploadSettings.maxImageHeight}
                        onChange={(e) => setUploadSettings(prev => ({ 
                          ...prev, 
                          maxImageHeight: parseInt(e.target.value) || 1080 
                        }))}
                        min="100"
                        max="5000"
                        className="text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveUploadSettings} disabled={saving}>
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
                پیکربندی پشتیبان‌گیری خودکار از پایگاه داده
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Auto Backup */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-right">
                    <Label>پشتیبان‌گیری خودکار</Label>
                    <p className="text-sm text-muted-foreground">
                      فعال‌سازی پشتیبان‌گیری دوره‌ای
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

                {backupSettings.autoBackupEnabled && (
                  <div className="space-y-4 pr-4">
                    <div className="space-y-2 text-right">
                      <Label htmlFor="backupFrequency">تناوب پشتیبان‌گیری</Label>
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
                      <Label htmlFor="backupRetention">مدت نگهداری (روز)</Label>
                      <Input
                        id="backupRetention"
                        type="number"
                        value={backupSettings.backupRetentionDays}
                        onChange={(e) => setBackupSettings(prev => ({ 
                          ...prev, 
                          backupRetentionDays: parseInt(e.target.value) || 30 
                        }))}
                        min="1"
                        max="365"
                        className="text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Backup Settings */}
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

              {/* Backup Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-right">
                    <Label>شامل فایل‌های آپلود شده</Label>
                    <p className="text-sm text-muted-foreground">
                      پشتیبان‌گیری از فایل‌ها و تصاویر
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
                      کاهش اندازه فایل پشتیبان
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

              {/* Manual Backup */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">پشتیبان‌گیری دستی</h3>
                <p className="text-sm text-muted-foreground">
                  ایجاد فوری پشتیبان از پایگاه داده
                </p>
                
                <Button 
                  onClick={handleCreateBackup}
                  disabled={isCreatingBackup}
                  variant="outline"
                >
                  {isCreatingBackup ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      در حال ایجاد پشتیبان...
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4 ml-2" />
                      ایجاد پشتیبان
                    </>
                  )}
                </Button>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveBackupSettings} disabled={saving}>
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
                    {smsSettings.enabled ? 'فعال' : 'غیرفعال'}
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
                <Button onClick={handleSaveSMSSettings} disabled={saving}>
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
                <Button onClick={handleSavePaymentTypesSettings} disabled={saving}>
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
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-6">
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
                <Button onClick={handleSavePaymentSettings} disabled={saving}>
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
                    variant="outline"
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