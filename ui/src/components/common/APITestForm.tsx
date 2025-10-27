import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { realApiRequest } from '../../lib/real-api-client';
import { toast } from 'sonner';
import { Copy, Send, Loader2, CheckCircle, XCircle, Info, Eye, EyeOff } from 'lucide-react';

interface ApiEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  requiresAuth: boolean;
  category: string;
  bodyExample?: string;
  queryParams?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
}

// تمام API endpoints سیستم شما
const API_ENDPOINTS: ApiEndpoint[] = [
  // Authentication
  {
    id: 'send-otp',
    name: 'ارسال OTP',
    method: 'POST',
    path: '/auth/send-otp',
    description: 'ارسال کد OTP به شماره موبایل',
    requiresAuth: false,
    category: 'احراز هویت',
    bodyExample: JSON.stringify({
      mobile: "09123456789",
      captcha_token: "captured_token_from_captcha"
    }, null, 2)
  },
  {
    id: 'verify-otp',
    name: 'تأیید OTP',
    method: 'POST',
    path: '/auth/verify-otp',
    description: 'تأیید کد OTP و دریافت توکن',
    requiresAuth: false,
    category: 'احراز هویت',
    bodyExample: JSON.stringify({
      mobile: "09123456789",
      otp_code: "123456"
    }, null, 2)
  },
  {
    id: 'refresh-token',
    name: 'تجدید توکن',
    method: 'POST',
    path: '/auth/refresh',
    description: 'تجدید توکن دسترسی',
    requiresAuth: true,
    category: 'احراز هویت'
  },
  {
    id: 'me',
    name: 'اطلاعات کاربر',
    method: 'GET',
    path: '/auth/me',
    description: 'دریافت اطلاعات کاربر جاری',
    requiresAuth: true,
    category: 'احراز هویت'
  },
  
  // Captcha
  {
    id: 'captcha-generate',
    name: 'تولید CAPTCHA',
    method: 'GET',
    path: '/captcha/generate',
    description: 'تولید کپچای جدید',
    requiresAuth: false,
    category: 'امنیت'
  },
  
  // Admin - Users
  {
    id: 'admin-users-list',
    name: 'لیست کاربران',
    method: 'GET',
    path: '/admin/users',
    description: 'دریافت لیست تمام کاربران',
    requiresAuth: true,
    category: 'مدیریت کاربران',
    queryParams: [
      { name: 'page', type: 'number', required: false, description: 'شماره صفحه' },
      { name: 'limit', type: 'number', required: false, description: 'تعداد در هر صفحه' }
    ]
  },
  {
    id: 'admin-user-detail',
    name: 'جزئیات کاربر',
    method: 'GET',
    path: '/admin/users/{user_id}',
    description: 'دریافت جزئیات یک کاربر',
    requiresAuth: true,
    category: 'مدیریت کاربران'
  },
  
  // Admin - Parts
  {
    id: 'admin-parts-list',
    name: 'لیست قطعات',
    method: 'GET',
    path: '/admin/parts',
    description: 'دریافت لیست تمام قطعات',
    requiresAuth: true,
    category: 'مدیریت قطعات',
    queryParams: [
      { name: 'page', type: 'number', required: false, description: 'شماره صفحه' },
      { name: 'limit', type: 'number', required: false, description: 'تعداد در هر صفحه' },
      { name: 'category_id', type: 'number', required: false, description: 'فیلتر براساس دسته‌بندی' }
    ]
  },
  {
    id: 'admin-parts-create',
    name: 'ایجاد قطعه',
    method: 'POST',
    path: '/admin/parts',
    description: 'ایجاد قطعه جدید',
    requiresAuth: true,
    category: 'مدیریت قطعات',
    bodyExample: JSON.stringify({
      name: "نام قطعه",
      description: "توضیحات قطعه",
      category_id: 1,
      manufacturer: "سازنده",
      price: 100000
    }, null, 2)
  },
  
  // Admin - Categories
  {
    id: 'admin-categories-list',
    name: 'لیست دسته‌بندی‌ها',
    method: 'GET',
    path: '/admin/categories',
    description: 'دریافت لیست دسته‌بندی‌های قطعات',
    requiresAuth: true,
    category: 'مدیریت دسته‌بندی'
  },
  {
    id: 'admin-categories-create',
    name: 'ایجاد دسته‌بندی',
    method: 'POST',
    path: '/admin/categories',
    description: 'ایجاد دسته‌بندی جدید',
    requiresAuth: true,
    category: 'مدیریت دسته‌بندی',
    bodyExample: JSON.stringify({
      name: "نام دسته‌بندی",
      description: "توضیحات دسته‌بندی",
      parent_id: null
    }, null, 2)
  },
  
  // User - Products
  {
    id: 'user-products-list',
    name: 'محصولات کاربر',
    method: 'GET',
    path: '/user/products',
    description: 'دریافت لیست محصولات کاربر',
    requiresAuth: true,
    category: 'محصولات کاربر'
  },
  
  // Public - Catalog
  {
    id: 'catalog-parts',
    name: 'کاتالوگ قطعات',
    method: 'GET',
    path: '/catalog/parts',
    description: 'دریافت کاتالوگ عمومی قطعات',
    requiresAuth: false,
    category: 'کاتالوگ عمومی',
    queryParams: [
      { name: 'search', type: 'string', required: false, description: 'جستجو در نام قطعات' },
      { name: 'category', type: 'number', required: false, description: 'فیلتر براساس دسته‌بندی' }
    ]
  }
];

const CATEGORIES = [...new Set(API_ENDPOINTS.map(ep => ep.category))];

const ApiTestForm: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [requestBody, setRequestBody] = useState<string>('');
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [pathParams, setPathParams] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [showResponse, setShowResponse] = useState(false);

  const filteredEndpoints = selectedCategory === 'all' 
    ? API_ENDPOINTS 
    : API_ENDPOINTS.filter(ep => ep.category === selectedCategory);

  useEffect(() => {
    if (selectedEndpoint?.bodyExample) {
      setRequestBody(selectedEndpoint.bodyExample);
    } else {
      setRequestBody('');
    }
    setQueryParams({});
    setPathParams({});
    setResponse(null);
  }, [selectedEndpoint]);

  const buildUrl = () => {
    if (!selectedEndpoint) return '';
    
    let url = selectedEndpoint.path;
    
    // Replace path parameters
    Object.keys(pathParams).forEach(key => {
      url = url.replace(`{${key}}`, pathParams[key]);
    });
    
    // Add query parameters
    const queryString = Object.keys(queryParams)
      .filter(key => queryParams[key])
      .map(key => `${key}=${encodeURIComponent(queryParams[key])}`)
      .join('&');
    
    if (queryString) {
      url += `?${queryString}`;
    }
    
    return `https://elevatorid.ieeu.ir/v1${url}`;
  };

  const handleSendRequest = async () => {
    if (!selectedEndpoint) return;

    setLoading(true);
    setResponse(null);
    const startTime = Date.now();

    try {
      let url = selectedEndpoint.path;
      
      // Replace path parameters
      Object.keys(pathParams).forEach(key => {
        url = url.replace(`{${key}}`, pathParams[key]);
      });

      let result;
      const params = Object.keys(queryParams).reduce((acc, key) => {
        if (queryParams[key]) {
          acc[key] = queryParams[key];
        }
        return acc;
      }, {} as Record<string, string>);

      switch (selectedEndpoint.method) {
        case 'GET':
          result = await realApiRequest.get(url, params);
          break;
        case 'POST':
          const postData = requestBody ? JSON.parse(requestBody) : {};
          result = await realApiRequest.post(url, postData);
          break;
        case 'PUT':
          const putData = requestBody ? JSON.parse(requestBody) : {};
          result = await realApiRequest.put(url, putData);
          break;
        case 'DELETE':
          result = await realApiRequest.delete(url);
          break;
        default:
          throw new Error('متد HTTP پشتیبانی نمی‌شود');
      }

      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      setResponse({ success: true, data: result });
      setShowResponse(true);
      toast.success('درخواست با موفقیت ارسال شد');
    } catch (error: any) {
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      setResponse({ 
        success: false, 
        error: {
          message: error.message || 'خطا در ارسال درخواست',
          statusCode: error.statusCode,
          details: error.details
        }
      });
      setShowResponse(true);
      toast.error(error.message || 'خطا در ارسال درخواست');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('کپی شد');
  };

  const getPathParameters = (path: string) => {
    const matches = path.match(/\{([^}]+)\}/g);
    return matches ? matches.map(match => match.slice(1, -1)) : [];
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl" dir="rtl">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">فرم تست API</h1>
        <p className="text-muted-foreground">
          تست و آزمایش endpoint های سیستم ردیابی قطعات آسانسور
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary">Base URL: https://elevatorid.ieeu.ir/v1</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Request Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              تنظیمات درخواست
            </CardTitle>
            <CardDescription>
              endpoint مورد نظر را انتخاب کرده و پارامترهای لازم را وارد کنید
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <Label>دسته‌بندی</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب دسته‌بندی" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه دسته‌ها</SelectItem>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Endpoint Selection */}
            <div className="space-y-2">
              <Label>انتخاب Endpoint</Label>
              <Select 
                value={selectedEndpoint?.id || ''} 
                onValueChange={(value) => {
                  const endpoint = API_ENDPOINTS.find(ep => ep.id === value);
                  setSelectedEndpoint(endpoint || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب endpoint" />
                </SelectTrigger>
                <SelectContent>
                  {filteredEndpoints.map(endpoint => (
                    <SelectItem key={endpoint.id} value={endpoint.id}>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={endpoint.method === 'GET' ? 'secondary' : 
                                 endpoint.method === 'POST' ? 'default' : 
                                 endpoint.method === 'PUT' ? 'outline' : 'destructive'}
                        >
                          {endpoint.method}
                        </Badge>
                        {endpoint.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedEndpoint && (
              <>
                {/* Endpoint Info */}
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="space-y-2">
                    <div><strong>توضیحات:</strong> {selectedEndpoint.description}</div>
                    <div><strong>آدرس:</strong> {buildUrl()}</div>
                    <div className="flex items-center gap-2">
                      <strong>نیاز به احراز هویت:</strong>
                      {selectedEndpoint.requiresAuth ? (
                        <Badge variant="destructive">بله</Badge>
                      ) : (
                        <Badge variant="secondary">خیر</Badge>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>

                {/* URL Display with Copy Button */}
                <div className="space-y-2">
                  <Label>آدرس کامل درخواست</Label>
                  <div className="flex gap-2">
                    <Input value={buildUrl()} readOnly className="font-mono text-sm" />
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(buildUrl())}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Path Parameters */}
                {getPathParameters(selectedEndpoint.path).length > 0 && (
                  <div className="space-y-2">
                    <Label>پارامترهای مسیر</Label>
                    {getPathParameters(selectedEndpoint.path).map(param => (
                      <div key={param} className="space-y-1">
                        <Label className="text-sm">{param}</Label>
                        <Input
                          placeholder={`مقدار ${param} را وارد کنید`}
                          value={pathParams[param] || ''}
                          onChange={(e) => setPathParams(prev => ({
                            ...prev,
                            [param]: e.target.value
                          }))}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Query Parameters */}
                {selectedEndpoint.queryParams && selectedEndpoint.queryParams.length > 0 && (
                  <div className="space-y-2">
                    <Label>پارامترهای Query</Label>
                    {selectedEndpoint.queryParams.map(param => (
                      <div key={param.name} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">{param.name}</Label>
                          {param.required && <Badge variant="destructive" className="text-xs">ضروری</Badge>}
                          <span className="text-xs text-muted-foreground">({param.type})</span>
                        </div>
                        <Input
                          placeholder={param.description}
                          value={queryParams[param.name] || ''}
                          onChange={(e) => setQueryParams(prev => ({
                            ...prev,
                            [param.name]: e.target.value
                          }))}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Request Body */}
                {(selectedEndpoint.method === 'POST' || selectedEndpoint.method === 'PUT') && (
                  <div className="space-y-2">
                    <Label>محتوای درخواست (JSON)</Label>
                    <Textarea
                      placeholder="محتوای JSON درخواست را وارد کنید"
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      rows={8}
                      className="font-mono text-sm"
                    />
                  </div>
                )}

                {/* Send Button */}
                <Button 
                  onClick={handleSendRequest} 
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin ml-2" />
                      در حال ارسال...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 ml-2" />
                      ارسال درخواست
                    </>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Right Panel - Response */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {response?.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : response?.error ? (
                  <XCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
                پاسخ درخواست
              </div>
              {response && (
                <div className="flex items-center gap-2">
                  {responseTime && (
                    <Badge variant="outline" className="text-xs">
                      {responseTime}ms
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowResponse(!showResponse)}
                  >
                    {showResponse ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              )}
            </CardTitle>
            <CardDescription>
              {response ? 
                (response.success ? 'درخواست با موفقیت اجرا شد' : 'خطا در اجرای درخواست') :
                'پاسخ درخواست در اینجا نمایش داده می‌شود'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!response ? (
              <div className="text-center text-muted-foreground py-12">
                <Send className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>هنوز درخواستی ارسال نشده است</p>
                <p className="text-sm mt-2">ابتدا یک endpoint انتخاب کنید و درخواست را ارسال کنید</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center gap-2">
                  <Label>وضعیت:</Label>
                  <Badge variant={response.success ? 'default' : 'destructive'}>
                    {response.success ? 'موفق' : 'ناموفق'}
                  </Badge>
                  {response.error?.statusCode && (
                    <Badge variant="outline">
                      {response.error.statusCode}
                    </Badge>
                  )}
                </div>

                {/* Response Data */}
                {showResponse && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>محتوای پاسخ:</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(JSON.stringify(response, null, 2))}
                      >
                        <Copy className="h-4 w-4 ml-1" />
                        کپی
                      </Button>
                    </div>
                    <Textarea
                      readOnly
                      value={JSON.stringify(response, null, 2)}
                      rows={15}
                      className="font-mono text-sm"
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Info Panel */}
      <Card>
        <CardHeader>
          <CardTitle>راهنمای استفاده</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="endpoints" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="auth">احراز هویت</TabsTrigger>
              <TabsTrigger value="examples">نمونه‌ها</TabsTrigger>
            </TabsList>
            
            <TabsContent value="endpoints" className="space-y-4">
              <div className="text-sm space-y-2">
                <h4 className="font-medium">دسته‌بندی Endpoints:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CATEGORIES.map(category => {
                    const categoryEndpoints = API_ENDPOINTS.filter(ep => ep.category === category);
                    return (
                      <div key={category} className="space-y-2">
                        <h5 className="font-medium text-primary">{category}</h5>
                        <ul className="space-y-1 text-muted-foreground">
                          {categoryEndpoints.map(ep => (
                            <li key={ep.id} className="flex items-center gap-2">
                              <Badge size="sm" variant="outline">{ep.method}</Badge>
                              <span className="text-xs">{ep.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="auth" className="space-y-4">
              <div className="text-sm space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    برای استفاده از endpoint های محافظت شده، ابتدا باید از طریق OTP وارد شوید.
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <h4 className="font-medium">مراحل احراز هویت:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>ابتدا CAPTCHA تولید کنید</li>
                    <li>با شماره موبایل و توکن CAPTCHA، OTP دریافت کنید</li>
                    <li>کد OTP را تأیید کنید تا توکن دسترسی دریافت کنید</li>
                    <li>حالا می‌توانید از endpoint های محافظت شده استفاده کنید</li>
                  </ol>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="examples" className="space-y-4">
              <div className="text-sm space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">نمونه درخواست ارسال OTP:</h4>
                  <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`{
  "mobile": "09123456789",
  "captcha_token": "captured_token_from_captcha"
}`}
                  </pre>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">نمونه درخواست تأیید OTP:</h4>
                  <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`{
  "mobile": "09123456789",
  "otp_code": "123456"
}`}
                  </pre>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">نمونه پاسخ موفق:</h4>
                  <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`{
  "success": true,
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "mobile": "09123456789",
    "role": "user"
  }
}`}
                  </pre>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiTestForm;