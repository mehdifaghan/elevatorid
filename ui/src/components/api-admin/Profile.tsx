import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { User, Mail, Phone, Calendar, Activity, Shield } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../../contexts/AuthContext';
import { realApiRequest } from '../../lib/real-api-client';

interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  ip: string;
  userAgent: string;
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  mobile: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobile: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
    fetchActivityLogs();
  }, []);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await realApiRequest.get('/admin/profile');
      
      if (response.data) {
        setProfile(response.data);
        setFormData(prev => ({
          ...prev,
          username: response.data.username || '',
          email: response.data.email || '',
          mobile: response.data.mobile || ''
        }));
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast.error('خطا در بارگذاری اطلاعات پروفایل');
      
      // Fallback to user context data if API fails
      if (user) {
        setFormData(prev => ({
          ...prev,
          username: user.username || '',
          email: user.email || '',
          mobile: user.mobile || ''
        }));
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      const response = await realApiRequest.get('/admin/activity-logs');
      
      if (response.data) {
        setActivityLogs(response.data.logs || response.data || []);
      }
    } catch (error: any) {
      console.error('Error fetching activity logs:', error);
      
      // Don't show error toast for activity logs, just log silently
      // Many systems don't have activity logging implemented
      setActivityLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    // Validate form data
    if (!formData.username || !formData.email || !formData.mobile) {
      toast.error('لطفاً تمام فیلدهای ضروری را پر کنید');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('لطفاً ایمیل معتبر وارد کنید');
      return;
    }

    // Mobile validation (Iranian mobile number)
    const mobileRegex = /^09[0-9]{9}$/;
    if (!mobileRegex.test(formData.mobile)) {
      toast.error('لطفاً شماره موبایل معتبر وارد کنید (09xxxxxxxxx)');
      return;
    }

    try {
      setLoading(true);
      
      const response = await realApiRequest.put('/admin/profile', {
        username: formData.username,
        email: formData.email,
        mobile: formData.mobile
      });
      
      toast.success('پروفایل با موفقیت به‌روزرسانی شد');
      setIsEditing(false);
      
      // Refresh profile data
      await fetchProfile();
      
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 400) {
        toast.error('اطلاعات ارسالی نامعتبر است');
      } else if (error.response?.status === 409) {
        toast.error('نام کاربری یا ایمیل قبلاً استفاده شده است');
      } else {
        toast.error('خطا در به‌روزرسانی پروفایل');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('لطفاً تمام فیلدهای رمز عبور را پر کنید');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('رمز عبور جدید و تایید آن یکسان نیستند');
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error('رمز عبور باید حداقل ۸ کاراکتر باشد');
      return;
    }

    // Password strength validation
    const hasUpperCase = /[A-Z]/.test(formData.newPassword);
    const hasLowerCase = /[a-z]/.test(formData.newPassword);
    const hasNumber = /\d/.test(formData.newPassword);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      toast.error('رمز عبور باید شامل حروف بزرگ، کوچک و عدد باشد');
      return;
    }

    try {
      setLoading(true);
      
      const response = await realApiRequest.post('/admin/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      toast.success('رمز عبور با موفقیت تغییر کرد');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
    } catch (error: any) {
      console.error('Error changing password:', error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 400) {
        toast.error('رمز عبور فعلی اشتباه است');
      } else if (error.response?.status === 422) {
        toast.error('رمز عبور جدید معتبر نیست');
      } else {
        toast.error('خطا در تغییر رمز عبور');
      }
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'ورود به سیستم':
      case 'خروج از سیستم':
        return <User className="w-4 h-4" />;
      case 'تایید درخواست':
      case 'ایجاد کاربر':
        return <Shield className="w-4 h-4" />;
      case 'تغییر تنظیمات':
        return <Activity className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'ورود به سیستم':
        return 'text-green-600';
      case 'خروج از سیستم':
        return 'text-red-600';
      case 'تایید درخواست':
      case 'ایجاد کاربر':
        return 'text-blue-600';
      case 'تغییر تنظیمات':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">پروفایل مدیر</h1>
        <p className="text-muted-foreground">مدیریت اطلاعات حساب کاربری</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="activity">فعالیت‌های اخیر</TabsTrigger>
          <TabsTrigger value="profile">اطلاعات حساب</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="text-right order-2">
                  <CardTitle>اطلاعات شخصی</CardTitle>
                  <CardDescription>
                    مدیریت اطلاعات پایه حساب کاربری
                  </CardDescription>
                </div>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => setIsEditing(!isEditing)}
                  className="order-1"
                >
                  {isEditing ? 'انصراف' : 'ویرایش'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6 flex-row-reverse">
                <div className="text-right">
                  <h3 className="text-lg font-semibold">{user?.username}</h3>
                  <p className="text-muted-foreground">مدیر سیستم</p>
                  <Badge variant="outline" className="mt-1 flex-row-reverse">
                    {profile?.isActive ? 'فعال' : 'غیرفعال'}
                    <Shield className="w-3 h-3 ml-1" />
                  </Badge>
                </div>
                <Avatar className="w-20 h-20">
                  <AvatarImage>
                    <User className="w-10 h-10" />
                  </AvatarImage>
                  <AvatarFallback className="text-lg">
                    {(profile?.username || user?.username)?.charAt(0).toUpperCase() || 'M'}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-right block">نام کاربری</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      disabled={!isEditing}
                      className="pr-10 text-right"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-right block">ایمیل</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className="pr-10 text-left"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile" className="text-right block">شماره موبایل</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                      disabled={!isEditing}
                      className="pr-10 text-left"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-right block">تاریخ عضویت</Label>
                  <div className="relative">
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      value="۱۴۰۲/۰۵/۱۵"
                      disabled
                      className="pr-10 bg-muted text-right"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile}>
                    ذخیره تغییرات
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader className="text-right">
              <CardTitle>تغییر رمز عبور</CardTitle>
              <CardDescription>
                برای امنیت بیشتر، رمز عبور خود را تغییر دهید
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-right block">رمز عبور فعلی</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="text-left"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-right block">رمز عبور جدید</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="text-left"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-right block">تایید رمز عبور جدید</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleChangePassword}>
                  تغییر رمز عبور
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader className="text-right">
              <CardTitle>فعالیت‌های اخیر</CardTitle>
              <CardDescription>
                لیست آخرین فعالیت‌های انجام شده در سیستم
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">در حال بارگذاری فعالیت‌ها...</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">فعالیت</TableHead>
                        <TableHead className="text-right">جزئیات</TableHead>
                        <TableHead className="text-right">زمان</TableHead>
                        <TableHead className="text-right">IP</TableHead>
                        <TableHead className="text-right">مرورگر</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activityLogs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            <p className="text-muted-foreground">هیچ فعالیتی یافت نشد</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        activityLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-2 flex-row-reverse">
                                <span className="font-medium">{log.action}</span>
                                <div className={`p-1 rounded ${getActionColor(log.action)}`}>
                                  {getActionIcon(log.action)}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-md text-right">
                              <p className="text-sm text-muted-foreground truncate">
                                {log.details}
                              </p>
                            </TableCell>
                            <TableCell className="text-sm text-right">
                              {log.timestamp}
                            </TableCell>
                            <TableCell className="text-sm font-mono text-left" dir="ltr">
                              {log.ip}
                            </TableCell>
                            <TableCell className="text-sm text-right">
                              {log.userAgent}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}