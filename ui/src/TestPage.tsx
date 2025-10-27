import React, { useState, lazy, Suspense } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Alert, AlertDescription } from './components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { 
  Shield, 
  User, 
  Settings,
  Building,
  Package,
  ArrowRightLeft,
  ClipboardList,
  BarChart,
  Eye,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
  TestTube,
  Code
} from 'lucide-react';

// Lazy load heavy components to improve initial load time
const ProvinceAndCitySelectorTest = lazy(() => import('./components/test/ProvinceAndCitySelectorTest'));
const PersianDatePicker = lazy(() => import('./components/common/PersianDatePicker').then(module => ({ default: module.PersianDatePicker })));
const APITestForm = lazy(() => import('./components/common/APITestForm'));

const TestPage = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [testDate, setTestDate] = useState('');

  const adminFeatures = [
    { icon: Shield, title: 'مدیریت کاربران', description: 'ایجاد و مدیریت کاربران همکار' },
    { icon: Settings, title: 'تنظیمات سیستم', description: 'پیکربندی عمومی سامانه' },
    { icon: Package, title: 'مدیریت قطعات', description: 'ثبت و مدیریت قطعات' },
    { icon: Building, title: 'مدیریت آسانسورها', description: 'ثبت و مدیریت آسانسورها' },
    { icon: ArrowRightLeft, title: 'مدیریت انتقال‌ها', description: 'پیگیری انتقال قطعات' },
    { icon: ClipboardList, title: 'مدیریت درخواست‌ها', description: 'بررسی و تایید درخواست‌ها' },
    { icon: BarChart, title: 'گزارش‌های مدیریتی', description: 'آمار و گزارش‌های جامع' },
  ];

  const userFeatures = [
    { icon: Package, title: 'محصولات', description: 'مشاهده و مدیریت محصولات' },
    { icon: Building, title: 'آسانسورها', description: 'مشاهده آسانسورهای ثبت شده' },
    { icon: ArrowRightLeft, title: 'انتقال‌ها', description: 'پیگیری انتقال قطعات' },
    { icon: ClipboardList, title: 'درخواست‌ها', description: 'ثبت و پیگیری درخواست‌ها' },
    { icon: BarChart, title: 'گزارش‌ها', description: 'گزارش‌های کاربری' },
    { icon: User, title: 'پروفایل', description: 'مدیریت اطلاعات شخصی' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            سامانه ردیابی قطعات و شناسنامه آسانسور
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            پلتفرم جامع مدیریت و ردیابی قطعات، آسانسورها و انتقال‌ها با قابلیت ایجاد شناسنامه دیجیتال
          </p>
        </div>

        {/* Authentication Status */}
        {user && (
          <Alert className="max-w-2xl mx-auto mb-8 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              شما با موفقیت وارد شده‌اید. نقش شما: <strong>{user.role === 'admin' ? 'مدیر' : 'کاربر'}</strong>
              {' - '}نام: <strong>{user.username}</strong>
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-6 justify-center mb-12">
          {/* Primary Authentication Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Button 
                  onClick={() => navigate('/api/login')}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                >
                  <User className="w-5 h-5 ml-2" />
                  ورود عملیاتی (API)
                </Button>
                <Button 
                  onClick={() => navigate('/login')}
                  size="lg"
                  variant="outline"
                  className="px-8 py-3"
                >
                  <TestTube className="w-5 h-5 ml-2" />
                  ورود نمایشی (Demo)
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => navigate(user.role === 'admin' ? '/admin' : '/user')}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              >
                <Shield className="w-5 h-5 ml-2" />
                ورود به پنل {user.role === 'admin' ? 'مدیریت' : 'کاربری'} (عملیاتی)
              </Button>
            )}
          </div>

          {/* Demo and API Sections */}
          <div className="grid lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Mock Data Demo Section */}
            <Card className="border-2 border-orange-200 shadow-lg">
              <CardHeader className="bg-orange-50 dark:bg-orange-900/20">
                <div className="flex items-center gap-3">
                  <TestTube className="w-6 h-6 text-orange-600" />
                  <div>
                    <CardTitle className="text-lg text-orange-800 dark:text-orange-200">
                      🎭 نسخه نمایشی (Mock Data)
                    </CardTitle>
                    <CardDescription className="text-orange-600 dark:text-orange-300">
                      با داده‌های تست و نمونه
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    برای آشنایی با رابط کاربری و امکانات سیستم
                  </p>
                  
                  {/* Demo Login Button */}
                  <Button 
                    onClick={() => navigate('/login')}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white mb-3"
                    size="sm"
                  >
                    <TestTube className="w-4 h-4 ml-2" />
                    ورود نمایشی
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => navigate('/demo/admin')}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Shield className="w-4 h-4 ml-2" />
                      پنل مدیریت
                    </Button>
                    <Button 
                      onClick={() => navigate('/demo/user')}
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                    >
                      <User className="w-4 h-4 ml-2" />
                      پنل کاربری
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Integration Section */}
            <Card className="border-2 border-green-200 shadow-lg">
              <CardHeader className="bg-green-50 dark:bg-green-900/20">
                <div className="flex items-center gap-3">
                  <Settings className="w-6 h-6 text-green-600" />
                  <div>
                    <CardTitle className="text-lg text-green-800 dark:text-green-200">
                      🔗 نسخه عملیاتی (API Integration)
                    </CardTitle>
                    <CardDescription className="text-green-600 dark:text-green-300">
                      متصل به API واقعی
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    برای استفاده عملیاتی با API elevatorid.ieeu.ir
                  </p>
                  
                  {/* API Login Button */}
                  <Button 
                    onClick={() => navigate('/api/login')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white mb-3"
                    size="sm"
                  >
                    <User className="w-4 h-4 ml-2" />
                    ورود عملیاتی
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => navigate('/api/admin')}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Shield className="w-4 h-4 ml-2" />
                      پنل مدیریت
                    </Button>
                    <Button 
                      onClick={() => navigate('/api/user')}
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                    >
                      <User className="w-4 h-4 ml-2" />
                      پنل کاربری
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Authentication Test Section */}
        {!user && (
          <Alert className="max-w-2xl mx-auto mb-8 bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>تست سیستم احراز هویت:</strong> شماره‌های نمونه را در صفحه ورود امتحان کنید.
              <br />
              مدیر: <code className="bg-blue-100 px-1 rounded">09121111111</code> | 
              کاربر: <code className="bg-blue-100 px-1 rounded">09122222222</code>
            </AlertDescription>
          </Alert>
        )}

        {/* Test Components Section */}
        <div className="mb-12">
          <Tabs defaultValue="main" className="w-full">
            <TabsList className="grid w-full grid-cols-5 max-w-4xl mx-auto">
              <TabsTrigger value="main" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                نمای کلی
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                تست API
              </TabsTrigger>
              <TabsTrigger value="location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                استان و شهر
              </TabsTrigger>
              <TabsTrigger value="date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                تقویم شمسی
              </TabsTrigger>
              <TabsTrigger value="components" className="flex items-center gap-2">
                <TestTube className="w-4 h-4" />
                کامپوننت‌ها
              </TabsTrigger>
            </TabsList>

            <TabsContent value="main" className="mt-8">
              {/* Feature Cards */}
              <div className="grid lg:grid-cols-2 gap-8">
          {/* Admin Panel */}
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-600" />
                <div>
                  <CardTitle className="text-2xl text-blue-800 dark:text-blue-200">
                    پنل مدیریت
                  </CardTitle>
                  <CardDescription className="text-blue-600 dark:text-blue-300">
                    برای مدیران و همکاران سیستم
                  </CardDescription>
                </div>
              </div>
              <Badge className="w-fit bg-blue-100 text-blue-800 border-blue-300">
                دسترسی کامل
              </Badge>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4">
                {adminFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <feature.icon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Panel */}
          <Card className="border-2 border-green-200 shadow-lg">
            <CardHeader className="bg-green-50 dark:bg-green-900/20">
              <div className="flex items-center gap-3">
                <User className="w-8 h-8 text-green-600" />
                <div>
                  <CardTitle className="text-2xl text-green-800 dark:text-green-200">
                    پنل کاربری
                  </CardTitle>
                  <CardDescription className="text-green-600 dark:text-green-300">
                    برای شرکت‌ها و کاربران عادی
                  </CardDescription>
                </div>
              </div>
              <Badge className="w-fit bg-green-100 text-green-800 border-green-300">
                دسترسی محدود
              </Badge>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4">
                {userFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <feature.icon className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
              </div>

              {/* Demo Credentials */}
              <Card className="max-w-2xl mx-auto bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                <CardHeader>
                  <CardTitle className="text-center text-yellow-800 dark:text-yellow-200">
                    🔑 اطلاعات ورود نمونه
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                      <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        👨‍💼 مدیر سیستم
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-mono" dir="ltr">
                        09121111111
                      </p>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                      <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        👤 کاربر عادی
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-mono" dir="ltr">
                        09122222222
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-4">
                    کد تایید: هر عدد ۶ رقمی (مثال: 123456)
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="mt-8">
              <Suspense fallback={
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="mr-2">در حال بارگذاری فرم تست API...</span>
                </div>
              }>
                <APITestForm />
              </Suspense>
            </TabsContent>

            <TabsContent value="location" className="mt-8">
              <Suspense fallback={
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="mr-2">در حال بارگذاری انتخابگر استان و شهر...</span>
                </div>
              }>
                <ProvinceAndCitySelectorTest />
              </Suspense>
            </TabsContent>

            <TabsContent value="date" className="mt-8">
              <div className="max-w-2xl mx-auto space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      تقویم شمسی فارسی
                    </CardTitle>
                    <CardDescription>
                      تقویم کامل با محاسبه دقیق سال‌های کبیسه و انتقال بین سال‌ها
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Suspense fallback={
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span className="mr-2">در حال بارگذاری تقویم...</span>
                      </div>
                    }>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">انتخاب تاریخ:</label>
                        <PersianDatePicker
                          value={testDate}
                          onChange={setTestDate}
                          placeholder="تاریخ را انتخاب کنید..."
                        />
                      </div>
                      
                      {testDate && (
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                          <h4 className="font-medium text-sm">تاریخ انتخاب شده:</h4>
                          <p className="text-lg font-mono bg-background p-2 rounded">
                            {testDate}
                          </p>
                        </div>
                      )}
                    </Suspense>

                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>✅ محاسبه دقیق سال‌های کبیسه</p>
                      <p>✅ انتقال صحیح بین سال‌های مختلف</p>
                      <p>✅ نمایش RTL و فارسی</p>
                      <p>✅ تست شده برای سال‌های ۱۳۵۰-۱۴۹۰</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="components" className="mt-8">
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold">کامپوننت‌های سیستم</h2>
                  <p className="text-muted-foreground">
                    کامپوننت‌های آماده برای استفاده در سیستم ردیابی قطعات
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="w-5 h-5" />
                        تست API
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p>✅ تست تمام Endpoints</p>
                        <p>✅ احراز هویت OTP</p>
                        <p>✅ مدیریت کاربران و قطعات</p>
                        <p>✅ نمایش پاسخ API</p>
                      </div>
                      <Button 
                        className="w-full mt-4" 
                        variant="outline"
                        onClick={() => {
                          const tabsTrigger = document.querySelector('[value="api"]') as HTMLButtonElement;
                          tabsTrigger?.click();
                        }}
                      >
                        مشاهده و تست
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        انتخابگر استان و شهر
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p>✅ ۳۱ استان و ۴۱۹+ شهر ایران</p>
                        <p>✅ جستجوی لحظه‌ای</p>
                        <p>✅ چیدمان افقی و عمودی</p>
                        <p>✅ نسخه ساده و پیشرفته</p>
                      </div>
                      <Button 
                        className="w-full mt-4" 
                        variant="outline"
                        onClick={() => {
                          const tabsTrigger = document.querySelector('[value="location"]') as HTMLButtonElement;
                          tabsTrigger?.click();
                        }}
                      >
                        مشاهده و تست
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        تقویم شمسی
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p>✅ محاسبه دقیق کبیسه</p>
                        <p>✅ انتقال صحیح سال‌ها</p>
                        <p>✅ نمایش RTL فارسی</p>
                        <p>✅ پشتیبانی ۱۴۰ سال</p>
                      </div>
                      <Button 
                        className="w-full mt-4" 
                        variant="outline"
                        onClick={() => {
                          const tabsTrigger = document.querySelector('[value="date"]') as HTMLButtonElement;
                          tabsTrigger?.click();
                        }}
                      >
                        مشاهده و تست
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>



        {/* Footer */}
        <div className="text-center mt-12 text-gray-600 dark:text-gray-400">
          <p>© ۱ۄۀۃ سامانه ردیابی قطعات و شناسنامه آسانسور</p>
        </div>
      </div>
    </div>
  );
};

export default TestPage;