import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Code, 
  Globe,
  BookOpen,
  Zap,
  Shield,
  Database
} from 'lucide-react';
import OpenAPIViewer from '../common/OpenAPIViewer';

const APIDocumentation: React.FC = () => {
  const apiStats = {
    totalEndpoints: 55,
    authEndpoints: 4,
    publicEndpoints: 2,
    adminEndpoints: 36,
    userEndpoints: 13
  };

  const downloadJSON = () => {
    const openApiSpec = {
      openapi: "3.0.3",
      info: {
        title: "سامانه جامع ردیابی قطعات و شناسنامه آسانسور",
        description: "API مستندات برای سیستم جامع ردیابی قطعات و شناسنامه آسانسور",
        version: "1.0.0",
        contact: {
          name: "تیم توسعه",
          url: "https://elevatorid.ieeu.ir"
        }
      },
      servers: [
        {
          url: "https://elevatorid.ieeu.ir/v1",
          description: "سرور اصلی"
        }
      ],
      // ... بقیه مشخصات
    };

    const blob = new Blob([JSON.stringify(openApiSpec, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'elevator-api-specification.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">مستندات API</h1>
          <p className="text-gray-600 mt-1">
            مستندات کامل و ابزارهای توسعه برای API سامانه ردیابی آسانسور
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={downloadJSON}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            دانلود JSON
          </Button>
          <Button
            onClick={() => window.open('https://editor.swagger.io/', '_blank')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Swagger Editor
          </Button>
        </div>
      </div>

      {/* API Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">کل Endpoints</p>
                <p className="text-xl font-bold">{apiStats.totalEndpoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">احراز هویت</p>
                <p className="text-xl font-bold text-green-600">{apiStats.authEndpoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Database className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">عمومی</p>
                <p className="text-xl font-bold text-purple-600">{apiStats.publicEndpoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Zap className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ادمین</p>
                <p className="text-xl font-bold text-orange-600">{apiStats.adminEndpoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">کاربر</p>
                <p className="text-xl font-bold text-teal-600">{apiStats.userEndpoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نمای کلی</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="authentication">احراز هویت</TabsTrigger>
          <TabsTrigger value="examples">نمونه کدها</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OpenAPIViewer showFullSpec={true} />
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>دسته‌بندی کامل Endpoints</CardTitle>
              <CardDescription>
                فهرست کامل تمام API endpoints به تفکیک دسته‌ها - مجموعاً 55 HTTP methods در 39 paths
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Authentication Endpoints */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-lg">احراز هویت (Authentication)</h3>
                  <Badge variant="secondary">4 methods</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-7">
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                      <code className="text-sm font-mono">/auth/send-otp</code>
                    </div>
                    <p className="text-sm text-gray-600">ارسال کد OTP</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                      <code className="text-sm font-mono">/auth/verify-otp</code>
                    </div>
                    <p className="text-sm text-gray-600">تایید کد OTP</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                      <code className="text-sm font-mono">/auth/refresh</code>
                    </div>
                    <p className="text-sm text-gray-600">تمدید توکن</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                      <code className="text-sm font-mono">/auth/logout</code>
                    </div>
                    <p className="text-sm text-gray-600">خروج از سیستم</p>
                  </div>
                </div>
              </div>

              {/* Dashboard Endpoints */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-indigo-600" />
                  <h3 className="font-semibold text-lg">داشبورد (Dashboard)</h3>
                  <Badge variant="secondary">2 methods</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-7">
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-green-100 text-green-800">GET</Badge>
                      <code className="text-sm font-mono">/dashboard/admin/stats</code>
                    </div>
                    <p className="text-sm text-gray-600">آمار داشبورد ادمین</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-green-100 text-green-800">GET</Badge>
                      <code className="text-sm font-mono">/dashboard/user/stats</code>
                    </div>
                    <p className="text-sm text-gray-600">آمار داشبورد کاربر</p>
                  </div>
                </div>
              </div>

              {/* Users Management Endpoints */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-lg">مدیریت کاربران (Users)</h3>
                  <Badge variant="secondary">6 methods</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-7">
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-green-100 text-green-800">GET</Badge>
                      <code className="text-sm font-mono">/users</code>
                    </div>
                    <p className="text-sm text-gray-600">لیست کاربران</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                      <code className="text-sm font-mono">/users</code>
                    </div>
                    <p className="text-sm text-gray-600">ایجاد کاربر جدید</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-green-100 text-green-800">GET</Badge>
                      <code className="text-sm font-mono">/users/{'{userId}'}</code>
                    </div>
                    <p className="text-sm text-gray-600">جزئیات کاربر</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-yellow-100 text-yellow-800">PUT</Badge>
                      <code className="text-sm font-mono">/users/{'{userId}'}</code>
                    </div>
                    <p className="text-sm text-gray-600">ویرایش کاربر</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-red-100 text-red-800">DELETE</Badge>
                      <code className="text-sm font-mono">/users/{'{userId}'}</code>
                    </div>
                    <p className="text-sm text-gray-600">حذف کاربر</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-orange-100 text-orange-800">PATCH</Badge>
                      <code className="text-sm font-mono">/users/{'{userId}'}/toggle-status</code>
                    </div>
                    <p className="text-sm text-gray-600">تغییر وضعیت کاربر</p>
                  </div>
                </div>
              </div>

              {/* Parts Management Endpoints */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-lg">مدیریت قطعات (Parts)</h3>
                  <Badge variant="secondary">10 methods</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-7">
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-green-100 text-green-800">GET</Badge>
                      <code className="text-sm font-mono">/parts</code>
                    </div>
                    <p className="text-sm text-gray-600">لیست قطعات</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                      <code className="text-sm font-mono">/parts</code>
                    </div>
                    <p className="text-sm text-gray-600">ثبت قطعه جدید</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-green-100 text-green-800">GET</Badge>
                      <code className="text-sm font-mono">/parts/{'{partId}'}</code>
                    </div>
                    <p className="text-sm text-gray-600">جزئیات قطعه</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-yellow-100 text-yellow-800">PUT</Badge>
                      <code className="text-sm font-mono">/parts/{'{partId}'}</code>
                    </div>
                    <p className="text-sm text-gray-600">ویرایش قطعه</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-red-100 text-red-800">DELETE</Badge>
                      <code className="text-sm font-mono">/parts/{'{partId}'}</code>
                    </div>
                    <p className="text-sm text-gray-600">حذف قطعه</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-green-100 text-green-800">GET</Badge>
                      <code className="text-sm font-mono">/parts/categories</code>
                    </div>
                    <p className="text-sm text-gray-600">دسته‌بندی قطعات</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                      <code className="text-sm font-mono">/parts/categories</code>
                    </div>
                    <p className="text-sm text-gray-600">ایجاد دسته‌بندی جدید</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                      <code className="text-sm font-mono">/parts/{'{partId}'}/transfer</code>
                    </div>
                    <p className="text-sm text-gray-600">انتقال قطعه</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-green-100 text-green-800">GET</Badge>
                      <code className="text-sm font-mono">/parts/{'{partId}'}/qr-code</code>
                    </div>
                    <p className="text-sm text-gray-600">QR کد قطعه</p>
                  </div>
                </div>
              </div>

              {/* Transfers Management Endpoints */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-orange-600" />
                  <h3 className="font-semibold text-lg">مدیریت انتقال‌ها (Transfers)</h3>
                  <Badge variant="secondary">4 methods</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-7">
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-green-100 text-green-800">GET</Badge>
                      <code className="text-sm font-mono">/transfers</code>
                    </div>
                    <p className="text-sm text-gray-600">لیست انتقال‌ها</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-green-100 text-green-800">GET</Badge>
                      <code className="text-sm font-mono">/transfers/{'{transferId}'}</code>
                    </div>
                    <p className="text-sm text-gray-600">جزئیات انتقال</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                      <code className="text-sm font-mono">/transfers/{'{transferId}'}/approve</code>
                    </div>
                    <p className="text-sm text-gray-600">تایید انتقال</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                      <code className="text-sm font-mono">/transfers/{'{transferId}'}/reject</code>
                    </div>
                    <p className="text-sm text-gray-600">رد انتقال</p>
                  </div>
                </div>
              </div>

              {/* Elevators Management Endpoints */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-teal-600" />
                  <h3 className="font-semibold text-lg">مدیریت آسانسورها (Elevators)</h3>
                  <Badge variant="secondary">10 methods</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-7">
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-green-100 text-green-800">GET</Badge>
                      <code className="text-sm font-mono">/elevators</code>
                    </div>
                    <p className="text-sm text-gray-600">لیست آسانسورها</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                      <code className="text-sm font-mono">/elevators</code>
                    </div>
                    <p className="text-sm text-gray-600">ثبت آسانسور جدید</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-green-100 text-green-800">GET</Badge>
                      <code className="text-sm font-mono">/elevators/{'{elevatorId}'}</code>
                    </div>
                    <p className="text-sm text-gray-600">جزئیات آسانسور</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-yellow-100 text-yellow-800">PUT</Badge>
                      <code className="text-sm font-mono">/elevators/{'{elevatorId}'}</code>
                    </div>
                    <p className="text-sm text-gray-600">ویرایش آسانسور</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-red-100 text-red-800">DELETE</Badge>
                      <code className="text-sm font-mono">/elevators/{'{elevatorId}'}</code>
                    </div>
                    <p className="text-sm text-gray-600">حذف آسانسور</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-green-100 text-green-800">GET</Badge>
                      <code className="text-sm font-mono">/elevators/{'{elevatorId}'}/certificate</code>
                    </div>
                    <p className="text-sm text-gray-600">شناسنامه آسانسور</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-green-100 text-green-800">GET</Badge>
                      <code className="text-sm font-mono">/elevators/{'{elevatorId}'}/parts</code>
                    </div>
                    <p className="text-sm text-gray-600">قطعات آسانسور</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                      <code className="text-sm font-mono">/elevators/{'{elevatorId}'}/parts</code>
                    </div>
                    <p className="text-sm text-gray-600">افزودن قطعه به آسانسور</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                      <code className="text-sm font-mono">/elevators/{'{elevatorId}'}/parts/{'{partId}'}/replace</code>
                    </div>
                    <p className="text-sm text-gray-600">تعویض قطعه آسانسور</p>
                  </div>
                </div>
              </div>

              {/* Requests Management Endpoints */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-lg">مدیریت درخواست‌ها (Requests)</h3>
                  <Badge variant="secondary">5 methods</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-7">
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-green-100 text-green-800">GET</Badge>
                      <code className="text-sm font-mono">/requests</code>
                    </div>
                    <p className="text-sm text-gray-600">لیست درخواست‌ها</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                      <code className="text-sm font-mono">/requests</code>
                    </div>
                    <p className="text-sm text-gray-600">ثبت درخواست جدید</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-green-100 text-green-800">GET</Badge>
                      <code className="text-sm font-mono">/requests/{'{requestId}'}</code>
                    </div>
                    <p className="text-sm text-gray-600">جزئیات درخواست</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-yellow-100 text-yellow-800">PUT</Badge>
                      <code className="text-sm font-mono">/requests/{'{requestId}'}</code>
                    </div>
                    <p className="text-sm text-gray-600">ویرایش درخواست</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                      <code className="text-sm font-mono">/requests/{'{requestId}'}/respond</code>
                    </div>
                    <p className="text-sm text-gray-600">پاسخ به درخواست</p>
                  </div>
                </div>
              </div>

              {/* Reports Endpoints */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-pink-600" />
                  <h3 className="font-semibold text-lg">گزارش‌گیری (Reports)</h3>
                  <Badge variant="secondary">4 methods</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-7">
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-green-100 text-green-800">GET</Badge>
                      <code className="text-sm font-mono">/reports/parts</code>
                    </div>
                    <p className="text-sm text-gray-600">گزارش قطعات</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-green-100 text-green-800">GET</Badge>
                      <code className="text-sm font-mono">/reports/transfers</code>
                    </div>
                    <p className="text-sm text-gray-600">گزارش انتقال‌ها</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-green-100 text-green-800">GET</Badge>
                      <code className="text-sm font-mono">/reports/elevators</code>
                    </div>
                    <p className="text-sm text-gray-600">گزارش آسانسورها</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-green-100 text-green-800">GET</Badge>
                      <code className="text-sm font-mono">/reports/financial</code>
                    </div>
                    <p className="text-sm text-gray-600">گزارش مالی</p>
                  </div>
                </div>
              </div>

              {/* Profile Management Endpoints */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-cyan-600" />
                  <h3 className="font-semibold text-lg">مدیریت پروفایل (Profile)</h3>
                  <Badge variant="secondary">4 methods</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-7">
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-green-100 text-green-800">GET</Badge>
                      <code className="text-sm font-mono">/profile</code>
                    </div>
                    <p className="text-sm text-gray-600">اطلاعات پروفایل</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-yellow-100 text-yellow-800">PUT</Badge>
                      <code className="text-sm font-mono">/profile</code>
                    </div>
                    <p className="text-sm text-gray-600">ویرایش پروفایل</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                      <code className="text-sm font-mono">/profile/avatar</code>
                    </div>
                    <p className="text-sm text-gray-600">آپلود آواتار</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                      <code className="text-sm font-mono">/profile/change-password</code>
                    </div>
                    <p className="text-sm text-gray-600">تغییر رمز عبور</p>
                  </div>
                </div>
              </div>

              {/* Settings Management Endpoints */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold text-lg">تنظیمات سیستم (Settings)</h3>
                  <Badge variant="secondary">3 methods</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-7">
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-green-100 text-green-800">GET</Badge>
                      <code className="text-sm font-mono">/settings</code>
                    </div>
                    <p className="text-sm text-gray-600">تنظیمات سیستم</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-yellow-100 text-yellow-800">PUT</Badge>
                      <code className="text-sm font-mono">/settings</code>
                    </div>
                    <p className="text-sm text-gray-600">ویرایش تنظیمات</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                      <code className="text-sm font-mono">/settings/backup</code>
                    </div>
                    <p className="text-sm text-gray-600">پشتیبان‌گیری</p>
                  </div>
                </div>
              </div>

              {/* Upload Endpoints */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-violet-600" />
                  <h3 className="font-semibold text-lg">آپلود فایل‌ها (Upload)</h3>
                  <Badge variant="secondary">2 methods</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-7">
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                      <code className="text-sm font-mono">/upload/image</code>
                    </div>
                    <p className="text-sm text-gray-600">آپلود تصویر</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-blue-100 text-blue-800">POST</Badge>
                      <code className="text-sm font-mono">/upload/document</code>
                    </div>
                    <p className="text-sm text-gray-600">آپلود مستند</p>
                  </div>
                </div>
              </div>

              {/* Geography Endpoints */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-semibold text-lg">اطلاعات جغرافیایی (Geography)</h3>
                  <Badge variant="secondary">2 methods</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-7">
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-green-100 text-green-800">GET</Badge>
                      <code className="text-sm font-mono">/geography/provinces</code>
                    </div>
                    <p className="text-sm text-gray-600">لیست استان‌ها</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-green-100 text-green-800">GET</Badge>
                      <code className="text-sm font-mono">/geography/provinces/{'{provinceId}'}/cities</code>
                    </div>
                    <p className="text-sm text-gray-600">لیست شهرهای استان</p>
                  </div>
                </div>
              </div>

              {/* API Stats Summary */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">خلاصه آمار API</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">55</div>
                    <div className="text-sm text-gray-600">کل HTTP Methods</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-purple-600">39</div>
                    <div className="text-sm text-gray-600">Unique Paths</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-green-600">25</div>
                    <div className="text-sm text-gray-600">GET Methods</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-orange-600">19</div>
                    <div className="text-sm text-gray-600">POST Methods</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-cyan-600">11</div>
                    <div className="text-sm text-gray-600">دسته‌بندی اصلی</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authentication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>راهنمای احراز هویت</CardTitle>
              <CardDescription>
                نحوه استفاده از سیستم احراز هویت API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold">مراحل احراز هویت:</h3>
                <div className="space-y-2 pr-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">1</div>
                    <div>
                      <p className="font-medium">ارسال شماره موبایل</p>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded block mt-1">
                        POST /auth/send-otp
                      </code>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">2</div>
                    <div>
                      <p className="font-medium">تایید کد OTP</p>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded block mt-1">
                        POST /auth/verify-otp
                      </code>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">3</div>
                    <div>
                      <p className="font-medium">استفاده از JWT Token</p>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded block mt-1">
                        Authorization: Bearer {'<YOUR_TOKEN>'}
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <h3 className="font-semibold">نمونه درخواست ورود:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm" dir="ltr">
{`curl -X POST "https://elevatorid.ieeu.ir/v1/auth/login" \\
  -H "Content-Type: application/json" \\
  -d '{
    "mobile": "09123456789"
  }'`}
                  </pre>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <h3 className="font-semibold">نمونه پاسخ:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm" dir="ltr">
{`{
  "success": true,
  "message": "کد تایید به شماره شما ارسال شد",
  "otpToken": "temp_token_12345"
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>نمونه کدهای مختلف</CardTitle>
              <CardDescription>
                مثال‌هایی از استفاده از API در زبان‌های مختلف برنامه‌نویسی
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* JavaScript Example */}
              <div className="space-y-3">
                <h3 className="font-semibold">JavaScript (Fetch API):</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm" dir="ltr">
{`// Login request
const login = async (mobile) => {
  try {
    const response = await fetch('https://elevatorid.ieeu.ir/v1/auth/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mobile })
    });
    
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Usage
login('09123456789');`}
                  </pre>
                </div>
              </div>

              {/* Python Example */}
              <div className="space-y-3">
                <h3 className="font-semibold">Python (Requests):</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm" dir="ltr">
{`import requests

def login(mobile):
    url = "https://elevatorid.ieeu.ir/v1/auth/send-otp"
    payload = {"mobile": mobile}
    headers = {"Content-Type": "application/json"}
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

# Usage
result = login("09123456789")
print(result)`}
                  </pre>
                </div>
              </div>

              {/* cURL Example */}
              <div className="space-y-3">
                <h3 className="font-semibold">cURL:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm" dir="ltr">
{`# Login
curl -X POST "https://elevatorid.ieeu.ir/v1/auth/login" \\
  -H "Content-Type: application/json" \\
  -d '{"mobile": "09123456789"}'

# Get user profile (with auth)
curl -X GET "https://elevatorid.ieeu.ir/v1/profile" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json"`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default APIDocumentation;