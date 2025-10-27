import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Bell, Eye, Lock, Globe, Smartphone, Mail, Save, Key, Wifi, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';
import { realApiRequest } from '../../lib/real-api-client';

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  transferUpdates: boolean;
  requestResponses: boolean;
  systemAlerts: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'limited';
  showEmail: boolean;
  showPhone: boolean;
  allowDataExport: boolean;
}

interface DisplaySettings {
  language: string;
  timezone: string;
  dateFormat: string;
  theme: 'light' | 'dark' | 'system';
}

interface AccountStatus {
  isActive: boolean;
  userType: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  lastLogin: string;
  registrationDate: string;
}



export default function UserSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    sms: false,
    push: true,
    transferUpdates: true,
    requestResponses: true,
    systemAlerts: false,
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'limited',
    showEmail: false,
    showPhone: false,
    allowDataExport: true,
  });

  const [display, setDisplay] = useState<DisplaySettings>({
    language: 'fa',
    timezone: 'Asia/Tehran',
    dateFormat: 'persian',
    theme: 'system',
  });

  const [accountStatus, setAccountStatus] = useState<AccountStatus>({
    isActive: true,
    userType: 'کاربر عادی',
    phoneVerified: true,
    emailVerified: false,
    lastLogin: 'امروز، ۱۴:۳۰',
    registrationDate: '۱۴۰۳/۰۱/۱۵'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });





  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setDataLoading(true);
      
      // Fetch user settings
      const settingsResponse = await realApiRequest.get('/user/settings');
      const data = settingsResponse.data;
      setNotifications(data.notifications || {
        email: false,
        sms: false,
        push: false,
        transferUpdates: false,
        requestResponses: false,
        systemAlerts: false,
      });
      setPrivacy(data.privacy || {
        profileVisibility: 'private',
        showEmail: false,
        showPhone: false,
        allowDataExport: false,
      });
      setDisplay(data.display || {
        language: 'fa',
        timezone: 'Asia/Tehran',
        dateFormat: 'persian',
        theme: 'system',
      });
      setAccountStatus(data.accountStatus || {
        isActive: false,
        userType: 'نامشخص',
        phoneVerified: false,
        emailVerified: false,
        lastLogin: 'نامشخص',
        registrationDate: 'نامشخص'
      });

    } catch (error: any) {
      console.error('Error fetching settings:', error);
      toast.error('خطا در بارگذاری تنظیمات');
      
      // Set empty states
      setNotifications({
        email: false,
        sms: false,
        push: false,
        transferUpdates: false,
        requestResponses: false,
        systemAlerts: false,
      });
      setPrivacy({
        profileVisibility: 'private',
        showEmail: false,
        showPhone: false,
        allowDataExport: false,
      });
      setDisplay({
        language: 'fa',
        timezone: 'Asia/Tehran',
        dateFormat: 'persian',
        theme: 'system',
      });
      setAccountStatus({
        isActive: false,
        userType: 'نامشخص',
        phoneVerified: false,
        emailVerified: false,
        lastLogin: 'نامشخص',
        registrationDate: 'نامشخص'
      });
    } finally {
      setDataLoading(false);
    }
  };

  const handleSaveSettings = async (settingType: string, settingsData: any) => {
    setLoading(true);
    try {
      let endpoint = '';
      switch (settingType) {
        case 'اعلانات':
          endpoint = '/user/settings/notifications';
          break;
        case 'حریم خصوصی':
          endpoint = '/user/settings/privacy';
          break;
        case 'نمایش':
          endpoint = '/user/settings/display';
          break;
        default:
          endpoint = '/user/settings';
      }

      const response = await realApiRequest.put(endpoint, settingsData);
      
      toast.success(`⚙️ تنظیمات ${settingType} با موفقیت ذخیره شد!`, {
        description: 'تغییرات شما اعمال و در سیستم ثبت گردید',
        duration: 4000,
      });
    } catch (error: any) {
      console.error(`Error saving ${settingType} settings:`, error);
      
      if (error.response?.data?.message) {
        toast.error(`❌ خطا در ذخیره تنظیمات ${settingType}`, {
          description: error.response.data.message,
          duration: 5000,
        });
      } else {
        toast.error('❌ خطا در ذخیره تنظیمات', {
          description: 'لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید',
          duration: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('⚠️ لطفاً تمام فیلدها را تکمیل کنید', {
        description: 'برای تغییر رمز عبور باید رمز فعلی و رمز جدید را وارد کنید',
        duration: 4000,
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('🔐 تکرار رمز عبور مطابقت ندارد', {
        description: 'رمز عبور جدید و تکرار آن باید یکسان باشند',
        duration: 4000,
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('🔒 رمز عبور باید حداقل ۸ کاراکتر باشد', {
        description: 'برای امنیت بیشتر، رمز عبور باید شامل حروف، اعداد و نمادها باشد',
        duration: 4000,
      });
      return;
    }

    // Password strength validation
    const hasUpperCase = /[A-Z]/.test(passwordData.newPassword);
    const hasLowerCase = /[a-z]/.test(passwordData.newPassword);
    const hasNumber = /\d/.test(passwordData.newPassword);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      toast.error('🔒 رمز عبور باید شامل حروف بزرگ، کوچک و عدد باشد', {
        description: 'برای امنیت بیشتر، رمز عبور قوی‌تری انتخاب کنید',
        duration: 4000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await realApiRequest.post('/user/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      toast.success('✅ رمز عبور با موفقیت تغییر یافت!', {
        description: 'رمز عبور جدید شما در سیستم ثبت شد. از این پس از رمز جدید استفاده کنید',
        duration: 5000,
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('Error changing password:', error);
      
      if (error.response?.data?.message) {
        toast.error('❌ خطا در تغییر رمز عبور', {
          description: error.response.data.message,
          duration: 5000,
        });
      } else if (error.response?.status === 400) {
        toast.error('❌ رمز عبور فعلی اشتباه است', {
          description: 'لطفاً رمز عبور فعلی را بررسی کنید',
          duration: 5000,
        });
      } else {
        toast.error('❌ خطا در تغییر رمز عبور', {
          description: 'ممکن است رمز فعلی اشتباه باشد. لطفاً دوباره تلاش کنید',
          duration: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">در حال بارگذاری تنظیمات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">


      {/* Header */}
      <div className="text-right">
        <h1 className="text-2xl font-semibold text-right">تنظیمات</h1>
        <p className="text-muted-foreground mt-2 text-right">
          مدیریت تنظیمات حساب کاربری و تنظیمات شخصی‌سازی
        </p>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="security" className="flex items-center gap-2 flex-row-reverse">
            <span>امنیت</span>
            <Lock className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="display" className="flex items-center gap-2 flex-row-reverse">
            <span>نمایش</span>
            <Globe className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2 flex-row-reverse">
            <span>حریم خصوصی</span>
            <Eye className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 flex-row-reverse">
            <span>اعلانات</span>
            <Bell className="w-4 h-4" />
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 flex-row-reverse">
                <span>تنظیمات اعلانات</span>
                <Bell className="w-5 h-5" />
              </CardTitle>
              <CardDescription className="text-right">
                نحوه دریافت اعلانات از سامانه را مشخص کنید
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-right">
              {/* Notification Channels */}
              <div className="space-y-4 text-right">
                <h4 className="font-medium text-right">روش‌های دریافت اعلان</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between" dir="rtl">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <div className="text-right">
                        <Label className="text-right">ایمیل</Label>
                        <p className="text-sm text-muted-foreground text-right">دریافت اعلانات از طریق ایمیل</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, email: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between" dir="rtl">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-4 h-4 text-muted-foreground" />
                      <div className="text-right">
                        <Label className="text-right">پیامک</Label>
                        <p className="text-sm text-muted-foreground text-right">دریافت اعلانات از طریق SMS</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, sms: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between" dir="rtl">
                    <div className="flex items-center gap-3">
                      <Bell className="w-4 h-4 text-muted-foreground" />
                      <div className="text-right">
                        <Label className="text-right">اعلانات Push</Label>
                        <p className="text-sm text-muted-foreground text-right">اعلانات فوری در مرورگر</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, push: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Notification Types */}
              <div className="space-y-4 text-right">
                <h4 className="font-medium text-right">انواع اعلانات</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between" dir="rtl">
                    <div className="text-right">
                      <Label className="text-right">به‌روزرسانی انتقالات</Label>
                      <p className="text-sm text-muted-foreground text-right">اطلاع از تغییرات وضعیت انتقالات</p>
                    </div>
                    <Switch
                      checked={notifications.transferUpdates}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, transferUpdates: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between" dir="rtl">
                    <div className="text-right">
                      <Label className="text-right">پاسخ درخواست‌ها</Label>
                      <p className="text-sm text-muted-foreground text-right">اطلاع از پاسخ درخواست‌های ارسالی</p>
                    </div>
                    <Switch
                      checked={notifications.requestResponses}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, requestResponses: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between" dir="rtl">
                    <div className="text-right">
                      <Label className="text-right">هشدارهای سیستم</Label>
                      <p className="text-sm text-muted-foreground text-right">اطلاع از مشکلات و نگهداری سیستم</p>
                    </div>
                    <Switch
                      checked={notifications.systemAlerts}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, systemAlerts: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-start pt-4">
                <Button 
                  onClick={() => handleSaveSettings('اعلانات', notifications)}
                  disabled={loading}
                  className="flex items-center gap-2 flex-row-reverse"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>در حال ذخیره...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>ذخیره تنظیمات</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 flex-row-reverse">
                <span>تنظیمات حریم خصوصی</span>
                <Eye className="w-5 h-5" />
              </CardTitle>
              <CardDescription className="text-right">
                کنترل نمایش اطلاعات شخصی و دسترسی دیگران
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-right">
              <div className="space-y-4 text-right">
                <div className="text-right">
                  <Label className="text-base text-right">نمایش پروفایل</Label>
                  <p className="text-sm text-muted-foreground mb-3 text-right">
                    تعیین کنید چه کسانی می‌توانند پروفایل شما را مشاهده کنند
                  </p>
                  <Select
                    value={privacy.profileVisibility}
                    onValueChange={(value: 'public' | 'private' | 'limited') => 
                      setPrivacy(prev => ({ ...prev, profileVisibility: value }))
                    }
                  >
                    <SelectTrigger className="text-right" dir="rtl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      <SelectItem value="public">عمومی</SelectItem>
                      <SelectItem value="limited">محدود</SelectItem>
                      <SelectItem value="private">خصوصی</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-3 text-right">
                  <h4 className="font-medium text-right">نمایش اطلاعات تماس</h4>
                  
                  <div className="flex items-center justify-between" dir="rtl">
                    <div className="text-right">
                      <Label className="text-right">نمایش ایمیل</Label>
                      <p className="text-sm text-muted-foreground text-right">آدرس ایمیل در پروفایل نمایش داده شود</p>
                    </div>
                    <Switch
                      checked={privacy.showEmail}
                      onCheckedChange={(checked) => 
                        setPrivacy(prev => ({ ...prev, showEmail: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between" dir="rtl">
                    <div className="text-right">
                      <Label className="text-right">نمایش شماره تلفن</Label>
                      <p className="text-sm text-muted-foreground text-right">شماره تلفن در پروفایل نمایش داده شود</p>
                    </div>
                    <Switch
                      checked={privacy.showPhone}
                      onCheckedChange={(checked) => 
                        setPrivacy(prev => ({ ...prev, showPhone: checked }))
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between" dir="rtl">
                  <div className="text-right">
                    <Label className="text-right">امکان صادرات داده‌ها</Label>
                    <p className="text-sm text-muted-foreground text-right">اجازه دانلود کپی از اطلاعات شخصی</p>
                  </div>
                  <Switch
                    checked={privacy.allowDataExport}
                    onCheckedChange={(checked) => 
                      setPrivacy(prev => ({ ...prev, allowDataExport: checked }))
                    }
                  />
                </div>
              </div>

              <div className="flex justify-start pt-4">
                <Button 
                  onClick={() => handleSaveSettings('حریم خصوصی', privacy)}
                  disabled={loading}
                  className="flex items-center gap-2 flex-row-reverse"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>در حال ذخیره...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>ذخیره تنظیمات</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Tab */}
        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 flex-row-reverse">
                <span>تنظیمات نمایش</span>
                <Globe className="w-5 h-5" />
              </CardTitle>
              <CardDescription className="text-right">
                شخصی‌سازی ظاهر و نحوه نمایش اطلاعات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-right">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 text-right">
                  <Label className="text-right">زبان</Label>
                  <Select
                    value={display.language}
                    onValueChange={(value) => 
                      setDisplay(prev => ({ ...prev, language: value }))
                    }
                  >
                    <SelectTrigger className="text-right" dir="rtl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      <SelectItem value="fa">فارسی</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 text-right">
                  <Label className="text-right">منطقه زمانی</Label>
                  <Select
                    value={display.timezone}
                    onValueChange={(value) => 
                      setDisplay(prev => ({ ...prev, timezone: value }))
                    }
                  >
                    <SelectTrigger className="text-right" dir="rtl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      <SelectItem value="Asia/Tehran">تهران (UTC+3:30)</SelectItem>
                      <SelectItem value="Asia/Dubai">دبی (UTC+4:00)</SelectItem>
                      <SelectItem value="Europe/London">لندن (UTC+0:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 text-right">
                  <Label className="text-right">فرمت تاریخ</Label>
                  <Select
                    value={display.dateFormat}
                    onValueChange={(value) => 
                      setDisplay(prev => ({ ...prev, dateFormat: value }))
                    }
                  >
                    <SelectTrigger className="text-right" dir="rtl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      <SelectItem value="persian">شمسی (۱۴۰۳/۰۱/۰۱)</SelectItem>
                      <SelectItem value="gregorian">میلادی (2024/03/21)</SelectItem>
                      <SelectItem value="hijri">قمری (۱۴۴۵/۰۹/۱۰)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 text-right">
                  <Label className="text-right">تم ظاهری</Label>
                  <Select
                    value={display.theme}
                    onValueChange={(value: 'light' | 'dark' | 'system') => 
                      setDisplay(prev => ({ ...prev, theme: value }))
                    }
                  >
                    <SelectTrigger className="text-right" dir="rtl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      <SelectItem value="light">روشن</SelectItem>
                      <SelectItem value="dark">تیره</SelectItem>
                      <SelectItem value="system">خودکار</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-start pt-4">
                <Button 
                  onClick={() => handleSaveSettings('نمایش', display)}
                  disabled={loading}
                  className="flex items-center gap-2 flex-row-reverse"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>در حال ذخیره...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>ذخیره تنظیمات</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="space-y-6">
            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 flex-row-reverse">
                  <span>تغییر رمز عبور</span>
                  <Key className="w-5 h-5" />
                </CardTitle>
                <CardDescription className="text-right">
                  برای امنیت بیشتر، رمز عبور خود را به‌روزرسانی کنید
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-right">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2 text-right">
                    <Label className="text-right">رمز عبور فعلی</Label>
                    <Input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => 
                        setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))
                      }
                      placeholder="رمز عبور فعلی"
                      className="text-left"
                      dir="ltr"
                    />
                  </div>
                  
                  <div className="space-y-2 text-right">
                    <Label className="text-right">رمز عبور جدید</Label>
                    <Input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => 
                        setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))
                      }
                      placeholder="رمز عبور جدید"
                      className="text-left"
                      dir="ltr"
                    />
                  </div>
                  
                  <div className="space-y-2 text-right">
                    <Label className="text-right">تکرار رمز عبور جدید</Label>
                    <Input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => 
                        setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))
                      }
                      placeholder="تکرار رمز عبور جدید"
                      className="text-left"
                      dir="ltr"
                    />
                  </div>
                </div>
                
                <div className="flex justify-start">
                  <Button 
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="flex items-center gap-2 flex-row-reverse"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>در حال تغییر...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>تغییر رمز عبور</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 flex-row-reverse">
                  <span>وضعیت حساب کاربری</span>
                  <Lock className="w-5 h-5" />
                </CardTitle>
                <CardDescription className="text-right">
                  اطلاعات امنیتی و وضعیت فعلی حساب شما
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-right">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3 text-right">
                    <div className="flex items-center justify-between" dir="rtl">
                      <span className="text-sm text-right">وضعیت حساب:</span>
                      <Badge variant={accountStatus.isActive ? "default" : "destructive"}>
                        {accountStatus.isActive ? 'فعال' : 'غیرفعال'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between" dir="rtl">
                      <span className="text-sm text-right">نوع کاربر:</span>
                      <Badge variant="secondary">{accountStatus.userType}</Badge>
                    </div>
                    <div className="flex items-center justify-between" dir="rtl">
                      <span className="text-sm text-right">تایید شماره تلفن:</span>
                      <Badge variant={accountStatus.phoneVerified ? "default" : "secondary"}>
                        {accountStatus.phoneVerified ? 'تایید شده' : 'در انتظار تایید'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-right">
                    <div className="flex items-center justify-between" dir="rtl">
                      <span className="text-sm text-right">تایید ایمیل:</span>
                      <Badge variant={accountStatus.emailVerified ? "default" : "secondary"}>
                        {accountStatus.emailVerified ? 'تایید شده' : 'در انتظار تایید'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between" dir="rtl">
                      <span className="text-sm text-right">آخرین ورود:</span>
                      <span className="text-sm text-muted-foreground text-right">{accountStatus.lastLogin}</span>
                    </div>
                    <div className="flex items-center justify-between" dir="rtl">
                      <span className="text-sm text-right">تاریخ ثبت‌نام:</span>
                      <span className="text-sm text-muted-foreground text-right">{accountStatus.registrationDate}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}