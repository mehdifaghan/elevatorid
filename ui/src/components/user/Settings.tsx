import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Bell, Eye, Lock, Globe, Smartphone, Mail, Save, Key, CreditCard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

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

interface PaymentTypesSettings {
  partsPaymentEnabled: boolean;
  partsPaymentPrice: number;
  elevatorPaymentEnabled: boolean;
  elevatorPaymentPrice: number;
}

interface DisplaySettings {
  language: string;
  timezone: string;
  dateFormat: string;
  theme: 'light' | 'dark' | 'system';
}

export default function UserSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

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

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [paymentTypesSettings, setPaymentTypesSettings] = useState<PaymentTypesSettings>({
    partsPaymentEnabled: false,
    partsPaymentPrice: 10000,
    elevatorPaymentEnabled: false,
    elevatorPaymentPrice: 50000
  });

  const handleSaveSettings = async (settingType: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`⚙️ تنظیمات ${settingType} با موفقیت ذخیره شد!`, {
        description: 'تغییرات شما اعمال و در سیستم ثبت گردید',
        duration: 4000,
      });
    } catch (error) {
      toast.error('❌ خطا در ذخیره تنظیمات', {
        description: 'لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید',
        duration: 5000,
      });
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

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('✅ رمز عبور با موفقیت تغییر یافت!', {
        description: 'رمز عبور جدید شما در سیستم ثبت شد. از این پس از رمز جدید استفاده کنید',
        duration: 5000,
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('❌ خطا در تغییر رمز عبور', {
        description: 'ممکن است رمز فعلی اشتباه باشد. لطفاً دوباره تلاش کنید',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

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
        <TabsList className="grid w-full grid-cols-5">
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
          <TabsTrigger value="payment" className="flex items-center gap-2 flex-row-reverse">
            <span>پرداخت</span>
            <CreditCard className="w-4 h-4" />
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
                  onClick={() => handleSaveSettings('اعلانات')}
                  disabled={loading}
                  className="flex items-center gap-2 flex-row-reverse"
                >
                  <span>ذخیره تنظیمات</span>
                  <Save className="w-4 h-4" />
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
                  onClick={() => handleSaveSettings('حریم خصوصی')}
                  disabled={loading}
                  className="flex items-center gap-2 flex-row-reverse"
                >
                  <span>ذخیره تنظیمات</span>
                  <Save className="w-4 h-4" />
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
                  onClick={() => handleSaveSettings('نمایش')}
                  disabled={loading}
                  className="flex items-center gap-2 flex-row-reverse"
                >
                  <span>ذخیره تنظیمات</span>
                  <Save className="w-4 h-4" />
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
                      className="text-right"
                      dir="rtl"
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
                      className="text-right"
                      dir="rtl"
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
                      className="text-right"
                      dir="rtl"
                    />
                  </div>
                </div>
                
                <div className="flex justify-start">
                  <Button 
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="flex items-center gap-2 flex-row-reverse"
                  >
                    <span>تغییر رمز عبور</span>
                    <Lock className="w-4 h-4" />
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
                      <Badge variant="default">فعال</Badge>
                    </div>
                    <div className="flex items-center justify-between" dir="rtl">
                      <span className="text-sm text-right">نوع کاربر:</span>
                      <Badge variant="secondary">کاربر عادی</Badge>
                    </div>
                    <div className="flex items-center justify-between" dir="rtl">
                      <span className="text-sm text-right">تایید شماره تلفن:</span>
                      <Badge variant="default">تایید شده</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-right">
                    <div className="flex items-center justify-between" dir="rtl">
                      <span className="text-sm text-right">تایید ایمیل:</span>
                      <Badge variant="secondary">در انتظار تایید</Badge>
                    </div>
                    <div className="flex items-center justify-between" dir="rtl">
                      <span className="text-sm text-right">آخرین ورود:</span>
                      <span className="text-sm text-muted-foreground text-right">امروز، ۱۴:۳۰</span>
                    </div>
                    <div className="flex items-center justify-between" dir="rtl">
                      <span className="text-sm text-right">تاریخ ثبت‌نام:</span>
                      <span className="text-sm text-muted-foreground text-right">۱۴۰۳/۰۱/۱۵</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payment Types Tab */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 flex-row-reverse">
                <span>انواع پرداخت</span>
                <CreditCard className="w-5 h-5" />
              </CardTitle>
              <CardDescription className="text-right">
                تنظیمات مربوط به انواع پرداخت و درگاه‌های پرداخت
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-right">
              {/* Parts Payment Settings */}
              <div className="space-y-4 text-right">
                <h4 className="font-medium text-right">پرداخت قطعات</h4>
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between" dir="rtl">
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Label className="text-right">فعال‌سازی پرداخت قطعات</Label>
                        <p className="text-sm text-muted-foreground text-right">
                          امکان پرداخت آنلاین برای خرید قطعات
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={paymentTypesSettings.partsPaymentEnabled}
                      onCheckedChange={(checked) => 
                        setPaymentTypesSettings(prev => ({ ...prev, partsPaymentEnabled: checked }))
                      }
                    />
                  </div>
                  
                  <div className="space-y-2 text-right">
                    <Label className="text-right">مبلغ پایه قطعات (ریال)</Label>
                    <Input
                      type="number"
                      value={paymentTypesSettings.partsPaymentPrice}
                      onChange={(e) => 
                        setPaymentTypesSettings(prev => ({ ...prev, partsPaymentPrice: parseInt(e.target.value) || 0 }))
                      }
                      placeholder="مثال: 10000"
                      className="text-right"
                      dir="rtl"
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      مبلغ پایه برای محاسبه هزینه‌های قطعات
                    </p>
                  </div>
                </div>
              </div>

              {/* Elevator Payment Settings */}
              <div className="space-y-4 text-right">
                <h4 className="font-medium text-right">پرداخت آسانسور</h4>
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between" dir="rtl">
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Label className="text-right">فعال‌سازی پرداخت آسانسور</Label>
                        <p className="text-sm text-muted-foreground text-right">
                          امکان پرداخت آنلاین برای خدمات آسانسور
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={paymentTypesSettings.elevatorPaymentEnabled}
                      onCheckedChange={(checked) => 
                        setPaymentTypesSettings(prev => ({ ...prev, elevatorPaymentEnabled: checked }))
                      }
                    />
                  </div>
                  
                  <div className="space-y-2 text-right">
                    <Label className="text-right">مبلغ پایه آسانسور (ریال)</Label>
                    <Input
                      type="number"
                      value={paymentTypesSettings.elevatorPaymentPrice}
                      onChange={(e) => 
                        setPaymentTypesSettings(prev => ({ ...prev, elevatorPaymentPrice: parseInt(e.target.value) || 0 }))
                      }
                      placeholder="مثال: 50000"
                      className="text-right"
                      dir="rtl"
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      مبلغ پایه برای محاسبه هزینه‌های آسانسور
                    </p>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-start">
                <Button 
                  onClick={() => handleSaveSettings('انواع پرداخت')}
                  disabled={loading}
                  className="flex items-center gap-2 flex-row-reverse"
                >
                  <span>ذخیره تنظیمات</span>
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}