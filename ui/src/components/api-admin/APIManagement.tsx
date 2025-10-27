import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { 
  Search, 
  Plus,
  MoreHorizontal, 
  Eye, 
  Edit,
  Copy,
  Download,
  Settings,
  Key,
  Globe,
  Trash2,
  Zap,
  Shield,
  RefreshCw,
  PlayCircle,
  Code,
  Database,
  Terminal,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import APIDocDownloader from '../common/APIDocDownloader';

// Types
interface APIEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  parameters: APIParameter[];
  responses: APIResponse[];
  tags: string[];
  authenticated: boolean;
  rateLimit: number;
  status: 'active' | 'deprecated' | 'disabled';
  version: string;
  createdAt: string;
  updatedAt: string;
}

interface APIParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  defaultValue?: string;
  example?: string;
}

interface APIResponse {
  statusCode: number;
  description: string;
  schema: any;
}

interface APIConfig {
  baseUrl: string;
  version: string;
  title: string;
  description: string;
  contact: {
    name: string;
    email: string;
    url: string;
  };
  license: {
    name: string;
    url: string;
  };
  servers: APIServer[];
}

interface APIServer {
  url: string;
  description: string;
  variables?: Record<string, any>;
}

export default function APIManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([]);
  const [loading, setLoading] = useState(true);

  const [apiConfig, setApiConfig] = useState<APIConfig>({
    baseUrl: 'https://elevatorid.ieeu.ir',
    version: 'v1',
    title: 'سامانه ردیابی آسانسور',
    description: 'API جامع برای مدیریت و ردیابی آسانسورها و قطعات',
    contact: {
      name: 'تیم فنی',
      email: 'api@elevatorid.ieeu.ir',
      url: 'https://elevatorid.ieeu.ir/contact'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    },
    servers: [
      { url: 'https://elevatorid.ieeu.ir/v1', description: 'Production Server' },
      { url: 'https://staging.elevatorid.ieeu.ir/v1', description: 'Staging Server' },
      { url: 'http://localhost:3000/v1', description: 'Development Server' }
    ]
  });

  const [isEndpointModalOpen, setIsEndpointModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);

  useEffect(() => {
    fetchEndpoints();
  }, []);

  const fetchEndpoints = async () => {
    try {
      setLoading(true);
      
      // Replace with actual API call
      // const response = await fetch('https://elevatorid.ieeu.ir/v1/admin/api/endpoints', {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      // const data = await response.json();
      // setEndpoints(data.endpoints || []);
      
      // No mock data - empty array
      setEndpoints([]);
    } catch (error) {
      console.error('Error fetching endpoints:', error);
      toast.error('خطا در بارگذاری Endpointها');
    } finally {
      setLoading(false);
    }
  };

  const methodColors = {
    GET: 'bg-green-100 text-green-800 border-green-300',
    POST: 'bg-blue-100 text-blue-800 border-blue-300',
    PUT: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    DELETE: 'bg-red-100 text-red-800 border-red-300',
    PATCH: 'bg-purple-100 text-purple-800 border-purple-300'
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800 border-green-300',
    deprecated: 'bg-orange-100 text-orange-800 border-orange-300',
    disabled: 'bg-red-100 text-red-800 border-red-300'
  };

  const statusLabels = {
    active: '🟢 فعال',
    deprecated: '🟡 منسوخ',
    disabled: '🔴 غیرفعال'
  };

  const filteredEndpoints = endpoints.filter(endpoint => {
    const matchesSearch = endpoint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         endpoint.description.includes(searchTerm);
    const matchesMethod = selectedMethod === 'all' || endpoint.method === selectedMethod;
    const matchesStatus = selectedStatus === 'all' || endpoint.status === selectedStatus;
    
    return matchesSearch && matchesMethod && matchesStatus;
  });

  const handleGenerateOpenAPI = async () => {
    try {
      // Replace with actual API call
      // const response = await fetch('https://elevatorid.ieeu.ir/v1/admin/api/openapi', {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      // const openApiSpec = await response.json();
      
      // Generate OpenAPI spec from current data
      const openApiSpec = {
        openapi: '3.0.0',
        info: {
          title: apiConfig.title,
          description: apiConfig.description,
          version: apiConfig.version,
          contact: apiConfig.contact,
          license: apiConfig.license
        },
        servers: apiConfig.servers,
        paths: {},
        components: {
          securitySchemes: {
            BearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
            }
          }
        }
      };

      // Add endpoints to spec
      endpoints.forEach(endpoint => {
        if (!openApiSpec.paths[endpoint.path]) {
          openApiSpec.paths[endpoint.path] = {};
        }
        
        openApiSpec.paths[endpoint.path][endpoint.method.toLowerCase()] = {
          summary: endpoint.name,
          description: endpoint.description,
          tags: endpoint.tags,
          parameters: endpoint.parameters.map(param => ({
            name: param.name,
            in: 'query',
            required: param.required,
            description: param.description,
            schema: { type: param.type, default: param.defaultValue }
          })),
          responses: endpoint.responses.reduce((acc, resp) => {
            acc[resp.statusCode] = { description: resp.description };
            return acc;
          }, {}),
          ...(endpoint.authenticated && { security: [{ BearerAuth: [] }] })
        };
      });

      const specString = JSON.stringify(openApiSpec, null, 2);
      const blob = new Blob([specString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'openapi-spec.json';
      a.click();
      
      toast.success('فایل OpenAPI تولید شد', {
        description: 'فایل openapi-spec.json دانلود شد',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error generating OpenAPI:', error);
      toast.error('خطا در تولید فایل OpenAPI');
    }
  };

  const handleTestEndpoint = (endpoint: APIEndpoint) => {
    toast.info(`تست API: ${endpoint.method} ${endpoint.path}`, {
      description: 'درخواست آزمایشی ارسال شد',
      duration: 3000,
    });
  };

  const handleCopyEndpoint = (endpoint: APIEndpoint) => {
    const curl = `curl -X ${endpoint.method} "${apiConfig.baseUrl}${endpoint.path}"${
      endpoint.authenticated ? ' -H "Authorization: Bearer YOUR_TOKEN"' : ''
    }`;
    navigator.clipboard.writeText(curl);
    toast.success('کپی شد', {
      description: 'دستور cURL در کلیپ‌بورد کپی شد',
      duration: 2000,
    });
  };

  const handleSaveEndpoint = async (endpoint: APIEndpoint) => {
    try {
      if (selectedEndpoint) {
        // Update existing endpoint
        // await fetch(`https://elevatorid.ieeu.ir/v1/admin/api/endpoints/${endpoint.id}`, {
        //   method: 'PUT',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(endpoint)
        // });
        
        setEndpoints(prev => prev.map(e => e.id === endpoint.id ? endpoint : e));
        toast.success('Endpoint بروزرسانی شد');
      } else {
        // Create new endpoint
        // const response = await fetch('https://elevatorid.ieeu.ir/v1/admin/api/endpoints', {
        //   method: 'POST',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(endpoint)
        // });
        // const newEndpoint = await response.json();
        
        setEndpoints(prev => [...prev, { ...endpoint, id: Date.now().toString() }]);
        toast.success('Endpoint جدید ایجاد شد');
      }
      setIsEndpointModalOpen(false);
      setSelectedEndpoint(null);
    } catch (error) {
      console.error('Error saving endpoint:', error);
      toast.error('خطا در ذخیره Endpoint');
    }
  };

  const handleSaveConfig = async (config: APIConfig) => {
    try {
      // Replace with actual API call
      // await fetch('https://elevatorid.ieeu.ir/v1/admin/api/config', {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(config)
      // });
      
      setApiConfig(config);
      setIsConfigModalOpen(false);
      toast.success('تنظیمات ذخیره شد');
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('خطا در ذخیره تنظیمات');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">در حال بارگذاری مدیریت API...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-right">
          <h1 className="text-2xl font-bold text-gray-900">مدیریت API</h1>
          <p className="text-gray-600 mt-1">
            طراحی، تست و مستندسازی APIهای سامانه
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setIsConfigModalOpen(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            تنظیمات API
          </Button>
          <Button
            onClick={handleGenerateOpenAPI}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            دانلود OpenAPI
          </Button>
          <Button
            onClick={() => setIsEndpointModalOpen(true)}
            className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white"
          >
            <Plus className="w-4 h-4" />
            Endpoint جدید
          </Button>
        </div>
      </div>

      {/* API Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">کل Endpointها</p>
                <p className="text-xl font-bold">{endpoints.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">فعال</p>
                <p className="text-xl font-bold text-green-600">
                  {endpoints.filter(e => e.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">احراز هویت</p>
                <p className="text-xl font-bold text-orange-600">
                  {endpoints.filter(e => e.authenticated).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Code className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">نسخه API</p>
                <p className="text-xl font-bold text-purple-600">{apiConfig.version}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>جستجو</Label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="جستجو در Endpointها..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                  style={{ textAlign: 'right', direction: 'rtl' }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Method</Label>
              <Select value={selectedMethod} onValueChange={(value) => setSelectedMethod(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="همه Methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه Methods</SelectItem>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>وضعیت</Label>
              <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="همه وضعیت‌ها" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                  <SelectItem value="active">فعال</SelectItem>
                  <SelectItem value="deprecated">منسوخ</SelectItem>
                  <SelectItem value="disabled">غیرفعال</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedMethod('all');
                  setSelectedStatus('all');
                }}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 ml-2" />
                پاک کردن فیلترها
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Endpoints Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Endpointهای API
          </CardTitle>
          <CardDescription>
            مدیریت و پیکربندی endpointهای سامانه
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">نام</TableHead>
                <TableHead className="text-right">Method</TableHead>
                <TableHead className="text-right">مسیر</TableHead>
                <TableHead className="text-right">وضعیت</TableHead>
                <TableHead className="text-right">احراز هویت</TableHead>
                <TableHead className="text-right">Rate Limit</TableHead>
                <TableHead className="text-right">آخرین بروزرسانی</TableHead>
                <TableHead className="text-right">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEndpoints.map((endpoint) => (
                <TableRow key={endpoint.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{endpoint.name}</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">
                        {endpoint.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={methodColors[endpoint.method]}>
                      {endpoint.method}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {endpoint.path}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[endpoint.status]}>
                      {statusLabels[endpoint.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {endpoint.authenticated ? (
                      <Badge className="bg-orange-100 text-orange-800">
                        <Key className="w-3 h-3 ml-1" />
                        بله
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800">خیر</Badge>
                    )}
                  </TableCell>
                  <TableCell>{endpoint.rateLimit}/h</TableCell>
                  <TableCell>{endpoint.updatedAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestEndpoint(endpoint)}
                        className="flex items-center gap-1"
                      >
                        <PlayCircle className="w-3 h-3" />
                        تست
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyEndpoint(endpoint)}
                        className="flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        کپی
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedEndpoint(endpoint);
                          setIsEndpointModalOpen(true);
                        }}
                        className="flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        ویرایش
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredEndpoints.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Database className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>هیچ Endpointی یافت نشد</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Endpoint Modal */}
      <Dialog open={isEndpointModalOpen} onOpenChange={setIsEndpointModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden" style={{ direction: 'rtl', textAlign: 'right' }}>
          <DialogHeader>
            <DialogTitle style={{ textAlign: 'right' }}>
              {selectedEndpoint ? 'ویرایش Endpoint' : 'ایجاد Endpoint جدید'}
            </DialogTitle>
            <DialogDescription style={{ textAlign: 'right' }}>
              تنظیمات و پیکربندی endpoint API
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            <EndpointForm
              endpoint={selectedEndpoint}
              onSave={handleSaveEndpoint}
              onCancel={() => {
                setIsEndpointModalOpen(false);
                setSelectedEndpoint(null);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* API Config Modal */}
      <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
        <DialogContent className="max-w-3xl" style={{ direction: 'rtl', textAlign: 'right' }}>
          <DialogHeader>
            <DialogTitle style={{ textAlign: 'right' }}>تنظیمات عمومی API</DialogTitle>
            <DialogDescription style={{ textAlign: 'right' }}>
              پیکربندی اطلاعات کلی و سرورهای API
            </DialogDescription>
          </DialogHeader>
          <APIConfigForm
            config={apiConfig}
            onSave={handleSaveConfig}
            onCancel={() => setIsConfigModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* API Documentation Download Section */}
      <APIDocDownloader />
    </div>
  );
}

// Endpoint Form Component
function EndpointForm({ 
  endpoint, 
  onSave, 
  onCancel 
}: { 
  endpoint: APIEndpoint | null;
  onSave: (endpoint: APIEndpoint) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<APIEndpoint>>(
    endpoint || {
      name: '',
      method: 'GET',
      path: '',
      description: '',
      parameters: [],
      responses: [],
      tags: [],
      authenticated: false,
      rateLimit: 100,
      status: 'active',
      version: 'v1'
    }
  );

  const [parameters, setParameters] = useState<APIParameter[]>(endpoint?.parameters || []);
  const [responses, setResponses] = useState<APIResponse[]>(endpoint?.responses || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date().toLocaleDateString('fa-IR');
    const savedEndpoint: APIEndpoint = {
      ...formData as APIEndpoint,
      parameters,
      responses,
      createdAt: endpoint?.createdAt || now,
      updatedAt: now
    };

    onSave(savedEndpoint);
  };

  const addParameter = () => {
    setParameters(prev => [...prev, {
      name: '',
      type: 'string',
      required: false,
      description: '',
      defaultValue: undefined,
      example: undefined
    }]);
  };

  const addResponse = () => {
    setResponses(prev => [...prev, {
      statusCode: 200,
      description: '',
      schema: {}
    }]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6" dir="rtl">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">اطلاعات اصلی</TabsTrigger>
          <TabsTrigger value="parameters">پارامترها</TabsTrigger>
          <TabsTrigger value="responses">پاسخ‌ها</TabsTrigger>
          <TabsTrigger value="security">امنیت</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>نام Endpoint *</Label>
              <Input
                placeholder="نام Endpoint"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                style={{ textAlign: 'right', direction: 'rtl' }}
              />
            </div>

            <div className="space-y-2">
              <Label>Method HTTP *</Label>
              <Select 
                value={formData.method || 'GET'} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, method: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>مسیر API *</Label>
              <Input
                placeholder="/api/v1/resource"
                value={formData.path || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, path: e.target.value }))}
                required
                style={{ textAlign: 'right', direction: 'rtl' }}
              />
            </div>

            <div className="space-y-2">
              <Label>وضعیت</Label>
              <Select 
                value={formData.status || 'active'} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">فعال</SelectItem>
                  <SelectItem value="deprecated">منسوخ</SelectItem>
                  <SelectItem value="disabled">غیرفعال</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>توضیحات</Label>
            <Textarea
              placeholder="توضیحات Endpoint..."
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              style={{ textAlign: 'right', direction: 'rtl' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>برچسب‌ها</Label>
              <Input
                placeholder="مثال: Users, Authentication"
                value={formData.tags?.join(', ') || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                }))}
                style={{ textAlign: 'right', direction: 'rtl' }}
              />
            </div>

            <div className="space-y-2">
              <Label>محدودیت نرخ (درخواست در ساعت)</Label>
              <Input
                type="number"
                placeholder="100"
                value={formData.rateLimit || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, rateLimit: Number(e.target.value) }))}
                style={{ textAlign: 'right', direction: 'rtl' }}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="parameters" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">پارامترهای ورودی</h3>
            <Button type="button" onClick={addParameter} variant="outline" size="sm">
              <Plus className="w-4 h-4 ml-2" />
              افزودن پارامتر
            </Button>
          </div>

          <div className="space-y-3">
            {parameters.map((param, index) => (
              <div key={index} className="grid grid-cols-6 gap-2 p-3 border rounded">
                <Input
                  placeholder="نام پارامتر"
                  value={param.name}
                  onChange={(e) => {
                    const newParams = [...parameters];
                    newParams[index].name = e.target.value;
                    setParameters(newParams);
                  }}
                  style={{ textAlign: 'right', direction: 'rtl' }}
                />
                <Select
                  value={param.type}
                  onValueChange={(value) => {
                    const newParams = [...parameters];
                    newParams[index].type = value as any;
                    setParameters(newParams);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">String</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="boolean">Boolean</SelectItem>
                    <SelectItem value="object">Object</SelectItem>
                    <SelectItem value="array">Array</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={param.required}
                    onChange={(e) => {
                      const newParams = [...parameters];
                      newParams[index].required = e.target.checked;
                      setParameters(newParams);
                    }}
                  />
                  <span className="text-sm">الزامی</span>
                </div>
                <Input
                  placeholder="توضیحات"
                  value={param.description}
                  onChange={(e) => {
                    const newParams = [...parameters];
                    newParams[index].description = e.target.value;
                    setParameters(newParams);
                  }}
                  style={{ textAlign: 'right', direction: 'rtl' }}
                />
                <Input
                  placeholder="مقدار پیش‌فرض"
                  value={param.defaultValue || ''}
                  onChange={(e) => {
                    const newParams = [...parameters];
                    newParams[index].defaultValue = e.target.value;
                    setParameters(newParams);
                  }}
                  style={{ textAlign: 'right', direction: 'rtl' }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setParameters(prev => prev.filter((_, i) => i !== index))}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="responses" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">پاسخ‌های ممکن</h3>
            <Button type="button" onClick={addResponse} variant="outline" size="sm">
              <Plus className="w-4 h-4 ml-2" />
              افزودن پاسخ
            </Button>
          </div>

          <div className="space-y-3">
            {responses.map((response, index) => (
              <div key={index} className="grid grid-cols-4 gap-2 p-3 border rounded">
                <Input
                  type="number"
                  placeholder="کد وضعیت"
                  value={response.statusCode}
                  onChange={(e) => {
                    const newResponses = [...responses];
                    newResponses[index].statusCode = Number(e.target.value);
                    setResponses(newResponses);
                  }}
                  style={{ textAlign: 'right', direction: 'rtl' }}
                />
                <Input
                  placeholder="توضیحات پاسخ"
                  value={response.description}
                  onChange={(e) => {
                    const newResponses = [...responses];
                    newResponses[index].description = e.target.value;
                    setResponses(newResponses);
                  }}
                  className="col-span-2"
                  style={{ textAlign: 'right', direction: 'rtl' }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setResponses(prev => prev.filter((_, i) => i !== index))}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">نیاز به احراز هویت</h3>
                <p className="text-sm text-gray-600">آیا این endpoint نیاز به احراز هویت دارد؟</p>
              </div>
              <Switch
                checked={formData.authenticated || false}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, authenticated: checked }))}
              />
            </div>

            {formData.authenticated && (
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-medium text-orange-800 mb-2">تنظیمات احراز هویت</h4>
                <p className="text-sm text-orange-700">
                  این endpoint از JWT Bearer Token برای احراز هویت استفاده می‌کند.
                  کاربران باید header Authorization با Bearer token ارسال کنند.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          انصراف
        </Button>
        <Button type="submit" className="bg-black hover:bg-gray-800 text-white">
          ذخیره Endpoint
        </Button>
      </div>
    </form>
  );
}

// API Config Form Component
function APIConfigForm({ 
  config, 
  onSave, 
  onCancel 
}: { 
  config: APIConfig;
  onSave: (config: APIConfig) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<APIConfig>(config);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addServer = () => {
    setFormData(prev => ({
      ...prev,
      servers: [...prev.servers, { url: '', description: '' }]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>عنوان API</Label>
          <Input
            placeholder="عنوان API"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            style={{ textAlign: 'right', direction: 'rtl' }}
          />
        </div>

        <div className="space-y-2">
          <Label>نسخه</Label>
          <Input
            placeholder="v1"
            value={formData.version}
            onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
            style={{ textAlign: 'right', direction: 'rtl' }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>URL پایه</Label>
        <Input
          placeholder="https://elevatorid.ieeu.ir"
          value={formData.baseUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, baseUrl: e.target.value }))}
          style={{ textAlign: 'right', direction: 'rtl' }}
        />
      </div>

      <div className="space-y-2">
        <Label>توضیحات</Label>
        <Textarea
          placeholder="توضیحات API..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          style={{ textAlign: 'right', direction: 'rtl' }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>نام تماس</Label>
          <Input
            placeholder="نام تیم فنی"
            value={formData.contact.name}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              contact: { ...prev.contact, name: e.target.value }
            }))}
            style={{ textAlign: 'right', direction: 'rtl' }}
          />
        </div>

        <div className="space-y-2">
          <Label>ایمیل تماس</Label>
          <Input
            type="email"
            placeholder="api@elevatorid.ieeu.ir"
            value={formData.contact.email}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              contact: { ...prev.contact, email: e.target.value }
            }))}
            style={{ textAlign: 'right', direction: 'rtl' }}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">سرورها</h3>
          <Button type="button" onClick={addServer} variant="outline" size="sm">
            <Plus className="w-4 h-4 ml-2" />
            افزودن سرور
          </Button>
        </div>

        <div className="space-y-3">
          {formData.servers.map((server, index) => (
            <div key={index} className="grid grid-cols-3 gap-2">
              <Input
                placeholder="URL سرور"
                value={server.url}
                onChange={(e) => {
                  const newServers = [...formData.servers];
                  newServers[index].url = e.target.value;
                  setFormData(prev => ({ ...prev, servers: newServers }));
                }}
                style={{ textAlign: 'right', direction: 'rtl' }}
              />
              <Input
                placeholder="توضیحات سرور"
                value={server.description}
                onChange={(e) => {
                  const newServers = [...formData.servers];
                  newServers[index].description = e.target.value;
                  setFormData(prev => ({ ...prev, servers: newServers }));
                }}
                style={{ textAlign: 'right', direction: 'rtl' }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  servers: prev.servers.filter((_, i) => i !== index)
                }))}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          انصراف
        </Button>
        <Button type="submit" className="bg-black hover:bg-gray-800 text-white">
          ذخیره تنظیمات
        </Button>
      </div>
    </form>
  );
}