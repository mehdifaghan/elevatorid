import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { User, Mail, Phone, Calendar, Activity, Shield, Building, MapPin, Save, Edit, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../../contexts/AuthContext';
import { realApiRequest } from '../../lib/real-api-client';
import ProvinceAndCitySelector from '../common/ProvinceAndCitySelector';

interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  ip: string;
  userAgent: string;
}

interface CompanyProfile {
  id: string;
  companyName: string;
  companyCode: string;
  managerName: string;
  email: string;
  mobile: string;
  phone?: string;
  address: string;
  provinceId: number;
  provinceName: string;
  cityId: number;
  cityName: string;
  postalCode: string;
  nationalCode: string;
  economicCode: string;
  registrationNumber: string;
  website?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

function Profile() {
  const { user } = useAuth();
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  
  const [basicFormData, setBasicFormData] = useState({
    managerName: '',
    email: '',
    mobile: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [companyFormData, setCompanyFormData] = useState({
    companyName: '',
    companyCode: '',
    phone: '',
    address: '',
    provinceId: 0,
    cityId: 0,
    postalCode: '',
    nationalCode: '',
    economicCode: '',
    registrationNumber: '',
    website: '',
    description: ''
  });

  useEffect(() => {
    fetchProfile();
    fetchActivityLogs();
  }, []);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await realApiRequest.get('/user/profile');
      
      if (response.data) {
        setProfile(response.data);
        setBasicFormData(prev => ({
          ...prev,
          managerName: response.data.managerName || '',
          email: response.data.email || '',
          mobile: response.data.mobile || ''
        }));
        setCompanyFormData(prev => ({
          ...prev,
          companyName: response.data.companyName || '',
          companyCode: response.data.companyCode || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
          provinceId: response.data.provinceId || 0,
          cityId: response.data.cityId || 0,
          postalCode: response.data.postalCode || '',
          nationalCode: response.data.nationalCode || '',
          economicCode: response.data.economicCode || '',
          registrationNumber: response.data.registrationNumber || '',
          website: response.data.website || '',
          description: response.data.description || ''
        }));
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast.error('خطا در بارگذاری اطلاعات پروفایل');
      
      // Fallback to user context data if API fails
      if (user) {
        setBasicFormData(prev => ({
          ...prev,
          managerName: user.username || '',
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
      const response = await realApiRequest.get('/user/activity-logs');
      
      if (response.data) {
        setActivityLogs(response.data.logs || response.data || []);
      }
    } catch (error: any) {
      console.error('Error fetching activity logs:', error);
      setActivityLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBasicInfo = async () => {
    // Validate form data
    if (!basicFormData.managerName || !basicFormData.email || !basicFormData.mobile) {
      toast.error('لطفاً تمام فیلدهای ضروری را پر کنید');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(basicFormData.email)) {
      toast.error('لطفاً ایمیل معتبر وارد کنید');
      return;
    }

    // Mobile validation (Iranian mobile number)
    const mobileRegex = /^09[0-9]{9}$/;
    if (!mobileRegex.test(basicFormData.mobile)) {
      toast.error('لطفاً شماره موبایل معتبر وارد کنید (09xxxxxxxxx)');
      return;
    }

    try {
      setLoading(true);
      
      const response = await realApiRequest.put('/user/profile/basic', {
        managerName: basicFormData.managerName,
        email: basicFormData.email,
        mobile: basicFormData.mobile
      });
      
      toast.success('اطلاعات پایه با موفقیت به‌روزرسانی شد');
      setIsEditingBasic(false);
      
      // Refresh profile data
      await fetchProfile();
      
    } catch (error: any) {
      console.error('Error updating basic info:', error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 400) {
        toast.error('اطلاعات ارسالی نامعتبر است');
      } else if (error.response?.status === 409) {
        toast.error('ایمیل یا شماره موبایل قبلاً استفاده شده است');
      } else {
        toast.error('خطا در به‌روزرسانی اطلاعات پایه');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCompanyInfo = async () => {
    // Validate form data
    if (!companyFormData.companyName || !companyFormData.nationalCode || !companyFormData.address) {
      toast.error('لطفاً فیلدهای ضروری را پر کنید');
      return;
    }

    if (!companyFormData.provinceId || !companyFormData.cityId) {
      toast.error('لطفاً استان و شهر را انتخاب کنید');
      return;
    }

    try {
      setLoading(true);
      
      const response = await realApiRequest.put('/user/profile/company', companyFormData);
      
      toast.success('اطلاعات شرکت با موفقیت به‌روزرسانی شد');
      setIsEditingCompany(false);
      
      // Refresh profile data
      await fetchProfile();
      
    } catch (error: any) {
      console.error('Error updating company info:', error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 400) {
        toast.error('اطلاعات ارسالی نامعتبر است');
      } else if (error.response?.status === 409) {
        toast.error('کد ملی یا شماره ثبت قبلاً استفاده شده است');
      } else {
        toast.error('خطا در به‌روزرسانی اطلاعات شرکت');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!basicFormData.currentPassword || !basicFormData.newPassword || !basicFormData.confirmPassword) {
      toast.error('لطفاً تمام فیلدهای رمز عبور را پر کنید');
      return;
    }

    if (basicFormData.newPassword !== basicFormData.confirmPassword) {
      toast.error('رمز عبور جدید و تایید آن یکسان نیستند');
      return;
    }

    if (basicFormData.newPassword.length < 8) {
      toast.error('رمز عبور باید حداقل ۸ کاراکتر باشد');
      return;
    }

    // Password strength validation
    const hasUpperCase = /[A-Z]/.test(basicFormData.newPassword);
    const hasLowerCase = /[a-z]/.test(basicFormData.newPassword);
    const hasNumber = /\d/.test(basicFormData.newPassword);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      toast.error('رمز عبور باید شامل حروف بزرگ، کوچک و عدد باشد');
      return;
    }

    try {
      setLoading(true);
      
      const response = await realApiRequest.post('/user/change-password', {
        currentPassword: basicFormData.currentPassword,
        newPassword: basicFormData.newPassword
      });
      
      toast.success('رمز عبور با موفقیت تغییر کرد');
      setBasicFormData(prev => ({
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

  const handleProvinceAndCityChange = (selection: { provinceId?: number; cityId?: number; provinceName?: string; cityName?: string }) => {
    setCompanyFormData(prev => ({
      ...prev,
      provinceId: selection.provinceId || 0,
      cityId: selection.cityId || 0
    }));
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'ورود به سیستم':
      case 'خروج از سیستم':
        return <User className="w-4 h-4" />;
      case 'ثبت آسانسور':
      case 'ویرایش آسانسور':
        return <Building className="w-4 h-4" />;
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
      case 'ثبت آسانسور':
      case 'ویرایش آسانسور':
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
        <h1 className="text-3xl font-bold">پروفایل شرکت</h1>
        <p className="text-muted-foreground">مدیریت اطلاعات شرکت و حساب کاربری</p>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activity">فعالیت‌های اخیر</TabsTrigger>
          <TabsTrigger value="company">اطلاعات شرکت</TabsTrigger>
          <TabsTrigger value="basic">اطلاعات پایه</TabsTrigger>
        </TabsList>

        {/* اطلاعات پایه */}
        <TabsContent value="basic" className="space-y-6">
          {/* Basic Information */}
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
                  variant={isEditingBasic ? "outline" : "default"}
                  onClick={() => setIsEditingBasic(!isEditingBasic)}
                  className="order-1"
                  disabled={loading}
                >
                  {isEditingBasic ? <X className="w-4 h-4 ml-1" /> : <Edit className="w-4 h-4 ml-1" />}
                  {isEditingBasic ? 'انصراف' : 'ویرایش'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {profileLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">در حال بارگذاری اطلاعات...</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-6 flex-row-reverse">
                  <div className="text-right">
                    <h3 className="text-lg font-semibold">{profile?.managerName || user?.username}</h3>
                    <p className="text-muted-foreground">مدیر شرکت</p>
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
                      {(profile?.managerName || user?.username)?.charAt(0).toUpperCase() || 'M'}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="managerName" className="text-right block">نام مدیر شرکت</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="managerName"
                      value={basicFormData.managerName}
                      onChange={(e) => setBasicFormData(prev => ({ ...prev, managerName: e.target.value }))}
                      disabled={!isEditingBasic}
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
                      value={basicFormData.email}
                      onChange={(e) => setBasicFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditingBasic}
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
                      value={basicFormData.mobile}
                      onChange={(e) => setBasicFormData(prev => ({ ...prev, mobile: e.target.value }))}
                      disabled={!isEditingBasic}
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
                      value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('fa-IR') : '۱۴۰۲/۰۵/۱۵'}
                      disabled
                      className="pr-10 bg-muted text-right"
                    />
                  </div>
                </div>
              </div>

              {isEditingBasic && (
                <div className="flex justify-end">
                  <Button onClick={handleSaveBasicInfo} disabled={loading}>
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-1"></div>
                        در حال ذخیره...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 ml-1" />
                        ذخیره تغییرات
                      </>
                    )}
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
                    value={basicFormData.currentPassword}
                    onChange={(e) => setBasicFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="text-left"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-right block">رمز عبور جدید</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={basicFormData.newPassword}
                    onChange={(e) => setBasicFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="text-left"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-right block">تایید رمز عبور جدید</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={basicFormData.confirmPassword}
                    onChange={(e) => setBasicFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleChangePassword} disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-1"></div>
                      در حال تغییر...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 ml-1" />
                      تغییر رمز عبور
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* اطلاعات شرکت */}
        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="text-right order-2">
                  <CardTitle>اطلاعات شرکت</CardTitle>
                  <CardDescription>
                    مدیریت اطلاعات شرکت و آدرس
                  </CardDescription>
                </div>
                <Button
                  variant={isEditingCompany ? "outline" : "default"}
                  onClick={() => setIsEditingCompany(!isEditingCompany)}
                  className="order-1"
                  disabled={loading}
                >
                  {isEditingCompany ? <X className="w-4 h-4 ml-1" /> : <Edit className="w-4 h-4 ml-1" />}
                  {isEditingCompany ? 'انصراف' : 'ویرایش'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-right block">نام شرکت *</Label>
                  <div className="relative">
                    <Building className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="companyName"
                      value={companyFormData.companyName}
                      onChange={(e) => setCompanyFormData(prev => ({ ...prev, companyName: e.target.value }))}
                      disabled={!isEditingCompany}
                      className="pr-10 text-right"
                      placeholder="نام شرکت را وارد کنید"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyCode" className="text-right block">کد پروفایل</Label>
                  <Input
                    id="companyCode"
                    value={companyFormData.companyCode}
                    onChange={(e) => setCompanyFormData(prev => ({ ...prev, companyCode: e.target.value }))}
                    disabled={!isEditingCompany}
                    className="text-left"
                    dir="ltr"
                    placeholder="کد پروفایل شرکت"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-right block">تلفن ثابت</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="phone"
                      type="tel"
                      value={companyFormData.phone}
                      onChange={(e) => setCompanyFormData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditingCompany}
                      className="pr-10 text-left"
                      dir="ltr"
                      placeholder="021-12345678"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationalCode" className="text-right block">کد ملی شرکت *</Label>
                  <Input
                    id="nationalCode"
                    value={companyFormData.nationalCode}
                    onChange={(e) => setCompanyFormData(prev => ({ ...prev, nationalCode: e.target.value }))}
                    disabled={!isEditingCompany}
                    className="text-left"
                    dir="ltr"
                    placeholder="1234567890"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="economicCode" className="text-right block">شناسه صنفی</Label>
                  <Input
                    id="economicCode"
                    value={companyFormData.economicCode}
                    onChange={(e) => setCompanyFormData(prev => ({ ...prev, economicCode: e.target.value }))}
                    disabled={!isEditingCompany}
                    className="text-left"
                    dir="ltr"
                    placeholder="شناسه صنفی شرکت"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationNumber" className="text-right block">شماره ثبت</Label>
                  <Input
                    id="registrationNumber"
                    value={companyFormData.registrationNumber}
                    onChange={(e) => setCompanyFormData(prev => ({ ...prev, registrationNumber: e.target.value }))}
                    disabled={!isEditingCompany}
                    className="text-left"
                    dir="ltr"
                    placeholder="شماره ثبت شرکت"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-right block">وب‌سایت</Label>
                  <Input
                    id="website"
                    type="url"
                    value={companyFormData.website}
                    onChange={(e) => setCompanyFormData(prev => ({ ...prev, website: e.target.value }))}
                    disabled={!isEditingCompany}
                    className="text-left"
                    dir="ltr"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode" className="text-right block">کد پستی</Label>
                  <Input
                    id="postalCode"
                    value={companyFormData.postalCode}
                    onChange={(e) => setCompanyFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                    disabled={!isEditingCompany}
                    className="text-left"
                    dir="ltr"
                    placeholder="1234567890"
                  />
                </div>
              </div>

              {/* استان و شهر */}
              <div className="space-y-2">
                <Label className="text-right block">استان و شهر *</Label>
                <ProvinceAndCitySelector
                  value={{
                    provinceId: companyFormData.provinceId,
                    cityId: companyFormData.cityId
                  }}
                  onChange={handleProvinceAndCityChange}
                  disabled={!isEditingCompany}
                  required={true}
                  showSearch={true}
                  placeholder={{
                    province: 'استان را انتخاب کنید',
                    city: 'شهر را انتخاب کنید'
                  }}
                  layout="horizontal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-right block">آدرس کامل *</Label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-3 text-muted-foreground w-4 h-4" />
                  <textarea
                    id="address"
                    value={companyFormData.address}
                    onChange={(e) => setCompanyFormData(prev => ({ ...prev, address: e.target.value }))}
                    disabled={!isEditingCompany}
                    className="w-full pr-10 pl-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md resize-none text-right"
                    rows={3}
                    placeholder="آدرس کامل شرکت را وارد کنید"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-right block">توضیحات</Label>
                <textarea
                  id="description"
                  value={companyFormData.description}
                  onChange={(e) => setCompanyFormData(prev => ({ ...prev, description: e.target.value }))}
                  disabled={!isEditingCompany}
                  className="w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md resize-none text-right"
                  rows={3}
                  placeholder="توضیحات اضافی در مورد شرکت"
                  dir="rtl"
                />
              </div>

              {isEditingCompany && (
                <div className="flex justify-end">
                  <Button onClick={handleSaveCompanyInfo} disabled={loading}>
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-1"></div>
                        در حال ذخیره...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 ml-1" />
                        ذخیره تغییرات
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* فعالیت‌های اخیر */}
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

export default Profile;