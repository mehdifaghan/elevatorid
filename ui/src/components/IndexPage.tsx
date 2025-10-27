import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Shield, 
  User, 
  Database, 
  Monitor, 
  Zap, 
  Lock,
  Globe,
  Code2,
  ArrowLeft,
  Play,
  TestTube,
  Building,
  Users,
  Package,
  Settings,
  ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PanelInfo {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  badge: {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    color: string;
  };
  features: string[];
}

function IndexPage() {
  const navigate = useNavigate();

  const adminPanels: PanelInfo[] = [
    {
      id: 'demo-admin',
      title: 'پنل ادمین نمایشی',
      description: 'پنل ادمین با داده‌های نمونه برای تست و نمایش قابلیت‌ها',
      path: '/demo/admin',
      icon: <Monitor className="w-6 h-6" />,
      badge: { text: 'Demo Data', variant: 'secondary', color: 'bg-blue-50 text-blue-700 border-blue-300' },
      features: ['داده‌های نمونه', 'بدون نیاز به API', 'تست سریع قابلیت‌ها', 'مودال دسته‌بندی بروزرسانی شده']
    },
    {
      id: 'api-admin',
      title: 'پنل ادمین API',
      description: 'پنل ادمین با اتصال واقعی به API سرور elevatorid.ieeu.ir',
      path: '/api/login',
      icon: <Database className="w-6 h-6" />,
      badge: { text: 'API Integration', variant: 'default', color: 'bg-green-50 text-green-700 border-green-300' },
      features: ['اتصال به API واقعی', 'داده‌های زنده', 'تست عملکرد سرور', 'مونیتورینگ اتصال']
    },
    {
      id: 'auth-admin',
      title: 'پنل ادمین احراز هویت شده',
      description: 'پنل ادمین با سیستم احراز هویت کامل و کنترل دسترسی',
      path: '/login',
      icon: <Lock className="w-6 h-6" />,
      badge: { text: 'Authenticated', variant: 'destructive', color: 'bg-red-50 text-red-700 border-red-300' },
      features: ['احراز هویت OTP', 'کنترل دسترسی', 'امنیت بالا', 'مدیریت نقش‌ها']
    }
  ];

  const userPanels: PanelInfo[] = [
    {
      id: 'demo-user',
      title: 'پنل کاربر نمایشی',
      description: 'پنل کاربر با داده‌های نمونه برای تست تجربه کاربری',
      path: '/demo/user',
      icon: <User className="w-6 h-6" />,
      badge: { text: 'Demo Data', variant: 'secondary', color: 'bg-blue-50 text-blue-700 border-blue-300' },
      features: ['تجربه کاربری کامل', 'ثبت و مدیریت آسانسور', 'درخواست‌ها و شکایات', 'گزارش‌گیری شخصی']
    },
    {
      id: 'api-user',
      title: 'پنل کاربر API',
      description: 'پنل کاربر با اتصال واقعی به API و قابلیت‌های کامل',
      path: '/api/login',
      icon: <Globe className="w-6 h-6" />,
      badge: { text: 'API Integration', variant: 'default', color: 'bg-green-50 text-green-700 border-green-300' },
      features: ['اتصال API واقعی', 'مدیریت محصولات', 'ردیابی انتقال‌ها', 'سینک داده‌ها']
    },
    {
      id: 'auth-user',
      title: 'پنل کاربر احراز هویت شده',
      description: 'پنل کاربر با ورود کامل و امکانات شخصی‌سازی',
      path: '/login',
      icon: <Shield className="w-6 h-6" />,
      badge: { text: 'Authenticated', variant: 'destructive', color: 'bg-red-50 text-red-700 border-red-300' },
      features: ['حساب کاربری شخصی', 'تنظیمات پیشرفته', 'گزارش‌های خصوصی', 'امنیت بالا']
    }
  ];

  const specialPages = [
    {
      id: 'test-page',
      title: 'صفحه تست کامپوننت‌ها',
      description: 'آزمایش و نمایش کامپوننت‌های ساخته شده',
      path: '/test',
      icon: <TestTube className="w-6 h-6" />,
      badge: { text: 'Development', variant: 'outline', color: 'bg-purple-50 text-purple-700 border-purple-300' }
    },
    {
      id: 'api-docs',
      title: 'مستندات API',
      description: 'مستندات کامل API و راهنمای استفاده',
      path: '/demo/admin/api-docs',
      icon: <Code2 className="w-6 h-6" />,
      badge: { text: 'Documentation', variant: 'outline', color: 'bg-gray-50 text-gray-700 border-gray-300' }
    }
  ];

  const quickStats = [
    { label: 'پنل‌های ادمین', value: '3', icon: <Building className="w-5 h-5" /> },
    { label: 'پنل‌های کاربر', value: '3', icon: <Users className="w-5 h-5" /> },
    { label: 'کامپوننت‌ها', value: '50+', icon: <Package className="w-5 h-5" /> },
    { label: 'صفحات مختلف', value: '25+', icon: <Settings className="w-5 h-5" /> }
  ];

  const renderPanelCard = (panel: PanelInfo) => (
    <Card key={panel.id} className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer border-2 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {panel.icon}
            </div>
            <div>
              <CardTitle className="text-lg mb-1">{panel.title}</CardTitle>
              <Badge variant={panel.badge.variant} className={panel.badge.color}>
                {panel.badge.text}
              </Badge>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <CardDescription className="text-sm leading-relaxed">
          {panel.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">ویژگی‌های کلیدی:</span>
            <ul className="space-y-1">
              {panel.features.map((feature, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <Button 
            onClick={() => {
              // برای پنل‌های API، مستقیماً به صفحه ورود هدایت کن
              if (panel.id === 'api-admin' || panel.id === 'api-user') {
                navigate('/api/login');
              } else {
                navigate(panel.path);
              }
            }}
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            variant="outline"
          >
            <Play className="w-4 h-4 ml-2" />
            {panel.id === 'api-admin' || panel.id === 'api-user' ? 'ورود با احراز هویت' : 'ورود به پنل'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary text-primary-foreground">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">سامانه جامع ردیابی قطعات و شناسنامه آسانسور</h1>
              <p className="text-xl text-muted-foreground">انتخاب پنل مورد نظر برای شروع کار</p>
            </div>
          </div>

          {/* Quick Access to API Login */}
          <div className="max-w-md mx-auto mb-8">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Database className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-semibold text-blue-800">دسترسی سریع به API</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    برای ورود به پنل‌های واقعی با اتصال API
                  </p>
                  <Button 
                    onClick={() => navigate('/api/login')}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    <Shield className="w-4 h-4 ml-2" />
                    ورود با احراز هویت API
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
            {quickStats.map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-lg bg-card border">
                <div className="flex justify-center mb-2 text-primary">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Panels */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">پنل‌های مدیریت (ادمین)</h2>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">
              کنترل کامل سیستم
            </Badge>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminPanels.map(renderPanelCard)}
          </div>
        </div>

        {/* User Panels */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">پنل‌های کاربری</h2>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
              تجربه کاربری بهینه
            </Badge>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPanels.map(renderPanelCard)}
          </div>
        </div>

        {/* Special Pages */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">صفحات ویژه</h2>
            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">
              ابزارها و مستندات
            </Badge>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            {specialPages.map((page) => (
              <Card key={page.id} className="hover:shadow-lg transition-all duration-300 group cursor-pointer border-2 hover:border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {page.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{page.title}</CardTitle>
                        <Badge variant={page.badge.variant} className={page.badge.color}>
                          {page.badge.text}
                        </Badge>
                      </div>
                    </div>
                    <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardDescription>{page.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    onClick={() => navigate(page.path)}
                    className="w-full"
                    variant="outline"
                  >
                    <ArrowLeft className="w-4 h-4 ml-2" />
                    مشاهده
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <Card className="bg-gradient-to-l from-primary/5 to-transparent border-primary/20">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-bold mb-4">📋 راهنمای سریع</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <strong>Demo:</strong> برای تست سریع بدون نیاز به API
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <strong>API:</strong> برای تست با اتصال واقعی به سرور
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <strong>Authenticated:</strong> برای ورود با احراز هویت کامل
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">🚀 مزایای سیستم</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    ردیابی کامل قطعات آسانسور
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    شناسنامه دیجیتال هوشمند
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    گزارش‌گیری پیشرفته و تحلیلی
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    رابط کاربری فارسی و ریسپانسیو
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            © 2024 سامانه ردیابی قطعات آسانسور • تمامی حقوق محفوظ است
          </p>
        </div>
      </div>
    </div>
  );
}

export default IndexPage;