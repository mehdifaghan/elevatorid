import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Globe, 
  Code, 
  Terminal,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface OpenAPIViewerProps {
  showFullSpec?: boolean;
}

const OpenAPIViewer: React.FC<OpenAPIViewerProps> = ({ showFullSpec = false }) => {
  const [copied, setCopied] = useState(false);
  const [yamlContent, setYamlContent] = useState<string>('');

  useEffect(() => {
    // در اینجا می‌توانید محتوای فایل OpenAPI را از سرور دریافت کنید
    // یا به صورت استاتیک تعریف کنید
    const sampleYAML = `openapi: 3.0.3
info:
  title: سامانه جامع ردیابی قطعات و شناسنامه آسانسور
  description: |
    API مستندات برای سیستم جامع ردیابی قطعات و شناسنامه آسانسور
    شامل پنل ادمین و کاربر با قابلیت‌های احراز هویت، مدیریت قطعات، ردیابی انتقال‌ها و گزارش‌گیری
  version: 1.0.0
  contact:
    name: تیم توسعه
    url: https://elevatorid.ieeu.ir
servers:
  - url: https://elevatorid.ieeu.ir/v1
    description: سرور اصلی

security:
  - BearerAuth: []

tags:
  - name: Authentication
    description: احراز هویت و مدیریت نشست
  - name: Users
    description: مدیریت کاربران
  - name: Parts
    description: مدیریت قطعات
  - name: Transfers
    description: مدیریت انتقال‌ها
  - name: Elevators
    description: مدیریت آسانسورها
  - name: Requests
    description: درخواست‌ها و شکایات
  - name: Reports
    description: گزارش‌گیری

paths:
  /auth/login:
    post:
      tags: [Authentication]
      summary: ورود به سیستم
      description: ورود کاربر با شماره موبایل
      operationId: login
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [mobile]
              properties:
                mobile:
                  type: string
                  pattern: '^09[0-9]{9}$'
                  example: "09123456789"
      responses:
        '200':
          description: کد OTP ارسال شد
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                    example: "کد تایید به شماره شما ارسال شد"

# ... بقیه مستندات در فایل کامل موجود است`;

    setYamlContent(sampleYAML);
  }, []);

  const downloadFullSpec = async () => {
    try {
      // در حالت واقعی، فایل کامل را از سرور دریافت می‌کنید
      const response = await fetch('/docs/openapi-specification.yaml');
      const fullContent = await response.text();
      
      const blob = new Blob([fullContent], { type: 'application/x-yaml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'elevator-api-complete-specification.yaml';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('فایل کامل مستندات API دانلود شد');
    } catch (error) {
      console.error('خطا در دانلود:', error);
      // در صورت عدم دسترسی، محتوای نمونه را دانلود می‌کنیم
      const blob = new Blob([yamlContent], { type: 'application/x-yaml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'elevator-api-specification.yaml';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('فایل نمونه مستندات API دانلود شد');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(yamlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('محتوای مستندات کپی شد');
    } catch (error) {
      console.error('خطا در کپی:', error);
      toast.error('خطا در کپی کردن محتوا');
    }
  };

  const openInSwaggerEditor = () => {
    // ایجاد URL برای Swagger Editor با محتوای YAML
    const encodedYaml = encodeURIComponent(yamlContent);
    const swaggerUrl = `https://editor.swagger.io/#/?import=data:text/yaml;charset=utf-8,${encodedYaml}`;
    window.open(swaggerUrl, '_blank');
  };

  const openInPostman = () => {
    toast.info('برای import در Postman:', {
      description: 'فایل YAML را دانلود کرده و در Postman import کنید',
      duration: 4000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle>مستندات OpenAPI سامانه آسانسور</CardTitle>
              <CardDescription>
                مستندات کامل API شامل تمام endpoint های احراز هویت، مدیریت کاربران، قطعات، انتقال‌ها، آسانسورها و گزارش‌گیری
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* API Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">نسخه: 1.0.0</span>
            </div>
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Base URL: elevatorid.ieeu.ir/v1</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">فرمت: OpenAPI 3.0.3</span>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button onClick={downloadFullSpec} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              دانلود YAML کامل
            </Button>

            <Button 
              variant="outline" 
              onClick={copyToClipboard}
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  کپی شد!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  کپی محتوا
                </>
              )}
            </Button>

            <Button 
              variant="outline" 
              onClick={openInSwaggerEditor}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Swagger Editor
            </Button>

            <Button 
              variant="outline" 
              onClick={openInPostman}
              className="flex items-center gap-2"
            >
              <Terminal className="h-4 w-4" />
              Postman Import
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Tags Overview */}
      <Card>
        <CardHeader>
          <CardTitle>دسته‌بندی API ها</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Authentication', color: 'bg-blue-100 text-blue-800' },
              { name: 'Users', color: 'bg-green-100 text-green-800' },
              { name: 'Parts', color: 'bg-purple-100 text-purple-800' },
              { name: 'Transfers', color: 'bg-orange-100 text-orange-800' },
              { name: 'Elevators', color: 'bg-red-100 text-red-800' },
              { name: 'Requests', color: 'bg-yellow-100 text-yellow-800' },
              { name: 'Reports', color: 'bg-indigo-100 text-indigo-800' },
              { name: 'Dashboard', color: 'bg-pink-100 text-pink-800' },
              { name: 'Profile', color: 'bg-teal-100 text-teal-800' },
              { name: 'Settings', color: 'bg-gray-100 text-gray-800' },
            ].map((tag) => (
              <Badge key={tag.name} className={tag.color}>
                {tag.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* YAML Preview */}
      {showFullSpec && (
        <Card>
          <CardHeader>
            <CardTitle>پیش‌نمایش YAML</CardTitle>
            <CardDescription>
              نمایش بخشی از محتوای فایل OpenAPI Specification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 w-full rounded-md border p-4">
              <pre className="text-sm text-left" dir="ltr">
                <code>{yamlContent}</code>
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>لینک‌های مفید</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">ابزارهای توسعه</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Swagger UI برای تست API ها</li>
                <li>• Postman Collection برای تست</li>
                <li>• OpenAPI Generator برای SDK</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">مستندات بیشتر</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• راهنمای احراز هویت</li>
                <li>• نمونه کدهای مختلف</li>
                <li>• محدودیت‌ها و Rate Limiting</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OpenAPIViewer;