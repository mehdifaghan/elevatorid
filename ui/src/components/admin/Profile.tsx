import React, { useState } from 'react';
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

interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  ip: string;
  userAgent: string;
}

const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    action: 'ورود به سیستم',
    details: 'ورود موفقیت‌آمیز به پنل مدیریت',
    timestamp: '۱۴۰۲/۰۹/۱۵ - ۱۴:۳۰',
    ip: '192.168.1.100',
    userAgent: 'Chrome/119.0.0.0'
  },
  {
    id: '2',
    action: 'تایید درخواست',
    details: 'تایید درخواست تغییر اطلاعات شرکت قطعات پارس',
    timestamp: '۱۴۰۲/۰۹/۱۵ - ۱۲:۱۵',
    ip: '192.168.1.100',
    userAgent: 'Chrome/119.0.0.0'
  },
  {
    id: '3',
    action: 'ایجاد کاربر',
    details: 'ایجاد کاربر همکار جدید: محمد احمدی',
    timestamp: '۱۴۰۲/۰۹/۱۴ - ۱۶:۴۵',
    ip: '192.168.1.100',
    userAgent: 'Chrome/119.0.0.0'
  },
  {
    id: '4',
    action: 'تغییر تنظیمات',
    details: 'به‌روزرسانی تنظیمات پیامک',
    timestamp: '۱۴۰۲/۰۹/۱۴ - ۱۰:۲۰',
    ip: '192.168.1.100',
    userAgent: 'Chrome/119.0.0.0'
  },
  {
    id: '5',
    action: 'خروج از سیستم',
    details: 'خروج از پنل مدیریت',
    timestamp: '۱۴۰۲/۰۹/۱۳ - ۱۸:۰۰',
    ip: '192.168.1.100',
    userAgent: 'Chrome/119.0.0.0'
  }
];

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSaveProfile = () => {
    // Validate form data
    if (!formData.username || !formData.email || !formData.mobile) {
      toast.error('لطفاً تمام فیلدهای ضروری را پر کنید');
      return;
    }

    // Here you would call the API to update profile
    toast.success('پروفایل با موفقیت به‌روزرسانی شد');
    setIsEditing(false);
  };

  const handleChangePassword = () => {
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

    // Here you would call the API to change password
    toast.success('رمز عبور با موفقیت تغییر کرد');
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
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
                    دسترسی کامل
                    <Shield className="w-3 h-3 ml-1" />
                  </Badge>
                </div>
                <Avatar className="w-20 h-20">
                  <AvatarImage>
                    <User className="w-10 h-10" />
                  </AvatarImage>
                  <AvatarFallback className="text-lg">
                    {user?.username?.charAt(0).toUpperCase() || 'M'}
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
                    {mockActivityLogs.map((log) => (
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
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}