import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Book,
  Download,
  ExternalLink,
  Code,
  Server,
  Key,
  Globe,
  FileText,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import OpenAPIViewer from '../common/OpenAPIViewer';
import APIDocDownloader from '../common/APIDocDownloader';

interface APIEndpoint {
  method: string;
  path: string;
  summary: string;
  description: string;
  parameters: any[];
  responses: Record<string, any>;
  tags: string[];
}

interface APISpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  servers: Array<{
    url: string;
    description: string;
  }>;
  paths: Record<string, Record<string, APIEndpoint>>;
  components: any;
}

export default function APIDocumentation() {
  const [apiSpec, setApiSpec] = useState<APISpec | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);

  useEffect(() => {
    fetchAPISpec();
  }, []);

  const fetchAPISpec = async () => {
    try {
      setLoading(true);
      
      // Replace with actual API call
      // const response = await fetch('/api/v1/openapi.json');
      // const spec = await response.json();
      
      // Mock API spec for now
      const mockSpec: APISpec = {
        openapi: '3.0.0',
        info: {
          title: 'سامانه ردیابی قطعات آسانسور API',
          version: '1.0.0',
          description: 'API جامع برای مدیریت قطعات، آسانسورها و انتقال‌ها'
        },
        servers: [
          {
            url: 'https://elevatorid.ieeu.ir/v1',
            description: 'سرور اصلی'
          },
          {
            url: 'https://test.elevatorid.ieeu.ir/v1',
            description: 'سرور تست'
          }
        ],
        paths: {},
        components: {}
      };
      
      setApiSpec(mockSpec);
    } catch (error) {
      console.error('Error fetching API spec:', error);
      toast.error('خطا در بارگذاری مستندات API');
    } finally {
      setLoading(false);
    }
  };

  const downloadOpenAPISpec = async () => {
    try {
      // Replace with actual API call
      // const response = await fetch('/api/v1/openapi.json');
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = 'openapi-spec.json';
      // a.click();
      
      toast.success('فایل OpenAPI دانلود شد');
    } catch (error) {
      console.error('Error downloading API spec:', error);
      toast.error('خطا در دانلود مستندات');
    }
  };

  const getMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case 'get':
        return 'bg-green-100 text-green-800';
      case 'post':
        return 'bg-blue-100 text-blue-800';
      case 'put':
        return 'bg-orange-100 text-orange-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      case 'patch':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">در حال بارگذاری مستندات API...</p>
        </div>
      </div>
    );
  }

  const quickStartCode = `// نصب کتابخانه HTTP client
npm install axios

// پیکربندی اولیه
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://elevatorid.ieeu.ir/v1',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// مثال درخواست GET
const getParts = async () => {
  try {
    const response = await apiClient.get('/parts');
    console.log(response.data);
  } catch (error) {
    console.error('خطا:', error.response?.data);
  }
};

// مثال درخواست POST
const createPart = async (partData) => {
  try {
    const response = await apiClient.post('/parts', partData);
    console.log('قطعه ایجاد شد:', response.data);
  } catch (error) {
    console.error('خطا در ایجاد قطعه:', error.response?.data);
  }
};`;

  const authenticationCode = `// احراز هویت با شماره تلفن
const login = async (phone) => {
  const response = await fetch('https://elevatorid.ieeu.ir/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ phone })
  });
  
  const data = await response.json();
  console.log('کد OTP ارسال شد:', data.message);
};

// تایید کد OTP
const verifyOTP = async (phone, otp) => {
  const response = await fetch('https://elevatorid.ieeu.ir/v1/auth/verify-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ phone, otp })
  });
  
  const data = await response.json();
  if (data.token) {
    // ذخیره توکن برای درخواست‌های بعدی
    localStorage.setItem('access_token', data.token);
    console.log('ورود موفق');
  }
};`;

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1>مستندات API</h1>
          <p>راهنمای کامل استفاده از API سامانه</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadOpenAPISpec}>
            <Download className="w-4 h-4 ml-2" />
            دانلود OpenAPI
          </Button>
          <Button variant="outline" asChild>
            <a href="https://elevatorid.ieeu.ir/docs" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 ml-2" />
              Swagger UI
            </a>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">کلیات</TabsTrigger>
          <TabsTrigger value="quickstart">شروع سریع</TabsTrigger>
          <TabsTrigger value="authentication">احراز هویت</TabsTrigger>
          <TabsTrigger value="endpoints">اندپوینت‌ها</TabsTrigger>
          <TabsTrigger value="openapi">OpenAPI</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="w-5 h-5" />
                نمای کلی API
              </CardTitle>
              <CardDescription>
                معرفی API سامانه ردیابی قطعات آسانسور
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">درباره API</h3>
                <p className="text-muted-foreground">
                  API سامانه ردیابی قطعات آسانسور امکان دسترسی برنامه‌نویسی به تمامی عملکردهای سامانه را فراهم می‌کند.
                  این API بر اساس معماری REST طراحی شده و از استانداردهای مدرن وب پیروی می‌کند.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Server className="w-4 h-4" />
                    اطلاعات سرور
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>URL پایه:</strong> https://elevatorid.ieeu.ir/v1</p>
                    <p><strong>نسخه:</strong> {apiSpec?.info.version}</p>
                    <p><strong>پروتکل:</strong> HTTPS</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    احراز هویت
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>نوع:</strong> Bearer Token</p>
                    <p><strong>مکان:</strong> HTTP Header</p>
                    <p><strong>فرمت:</strong> Authorization: Bearer TOKEN</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">قابلیت‌های اصلی</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">قطعات</Badge>
                    <span>مدیریت قطعات و مشخصات فنی</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">آسانسورها</Badge>
                    <span>ثبت و مدیریت آسانسورها</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">انتقال‌ها</Badge>
                    <span>ردیابی انتقال قطعات</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">کاربران</Badge>
                    <span>مدیریت کاربران و دسترسی‌ها</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quickstart" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                شروع سریع
              </CardTitle>
              <CardDescription>
                نحوه استفاده از API در پروژه‌های خود
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">مثال کد JavaScript</h4>
                  <ScrollArea className="h-96 rounded border bg-muted p-4">
                    <pre className="text-sm">
                      <code>{quickStartCode}</code>
                    </pre>
                  </ScrollArea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">کدهای پاسخ رایج</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>200</span>
                        <span>درخواست موفق</span>
                      </div>
                      <div className="flex justify-between">
                        <span>201</span>
                        <span>ایجاد موفق</span>
                      </div>
                      <div className="flex justify-between">
                        <span>400</span>
                        <span>درخواست نامعتبر</span>
                      </div>
                      <div className="flex justify-between">
                        <span>401</span>
                        <span>عدم احراز هویت</span>
                      </div>
                      <div className="flex justify-between">
                        <span>403</span>
                        <span>عدم دسترسی</span>
                      </div>
                      <div className="flex justify-between">
                        <span>404</span>
                        <span>یافت نشد</span>
                      </div>
                      <div className="flex justify-between">
                        <span>500</span>
                        <span>خطای سرور</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">فرمت پاسخ خطا</h4>
                    <ScrollArea className="h-32 rounded border bg-muted p-3">
                      <pre className="text-xs">
                        <code>{`{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "داده‌های ارسالی نامعتبر است",
    "details": [
      {
        "field": "name",
        "message": "نام قطعه الزامی است"
      }
    ]
  }
}`}</code>
                      </pre>
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authentication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                احراز هویت
              </CardTitle>
              <CardDescription>
                نحوه احراز هویت و دریافت توکن دسترسی
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">فرآیند احراز هویت</h4>
                  <div className="space-y-2 text-sm">
                    <p>1. ارسال شماره تلفن به اندپوینت /auth/login</p>
                    <p>2. دریافت کد OTP از طریق پیامک</p>
                    <p>3. ارسال کد OTP به اندپوینت /auth/verify-otp</p>
                    <p>4. دریافت توکن دسترسی</p>
                    <p>5. استفاده از توکن در هدر Authorization</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">مثال کد احراز هویت</h4>
                  <ScrollArea className="h-72 rounded border bg-muted p-4">
                    <pre className="text-sm">
                      <code>{authenticationCode}</code>
                    </pre>
                  </ScrollArea>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">نکات مهم امنیتی</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• هرگز توکن‌های دسترسی را در کد front-end ذخیره نکنید</li>
                    <li>• از HTTPS برای تمام درخواست‌ها استفاده کنید</li>
                    <li>• توکن‌ها دارای مدت انقضا هستند و باید تجدید شوند</li>
                    <li>• کدهای OTP تنها برای مدت محدودی معتبر هستند</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                فهرست اندپوینت‌ها
              </CardTitle>
              <CardDescription>
                تمام اندپوینت‌های موجود در API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Globe className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">فهرست اندپوینت‌ها در نسخه آینده نمایش داده خواهد شد</p>
                <p className="text-sm text-muted-foreground mt-2">
                  برای مشاهده کامل اندپوینت‌ها از تب OpenAPI استفاده کنید
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="openapi" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                مشخصات OpenAPI
              </CardTitle>
              <CardDescription>
                مشاهده کامل مشخصات API در فرمت OpenAPI 3.0
              </CardDescription>
            </CardHeader>
            <CardContent>
              {apiSpec ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{apiSpec.info.title}</h3>
                      <p className="text-sm text-muted-foreground">نسخه {apiSpec.info.version}</p>
                    </div>
                    <APIDocDownloader />
                  </div>
                  
                  <ScrollArea className="h-96 rounded border">
                    <OpenAPIViewer spec={apiSpec} />
                  </ScrollArea>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">مشخصات OpenAPI بارگذاری نشد</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}