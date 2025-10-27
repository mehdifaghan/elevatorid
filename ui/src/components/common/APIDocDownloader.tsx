import React from 'react';
import { Button } from '../ui/button';
import { Download, FileText, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const APIDocDownloader: React.FC = () => {
  const [copied, setCopied] = React.useState(false);

  const downloadYAML = async () => {
    try {
      const response = await fetch('/docs/openapi-specification.yaml');
      const yamlContent = await response.text();
      
      const blob = new Blob([yamlContent], { type: 'application/x-yaml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'elevator-api-specification.yaml';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('فایل مستندات API با موفقیت دانلود شد');
    } catch (error) {
      console.error('خطا در دانلود فایل:', error);
      toast.error('خطا در دانلود فایل');
    }
  };

  const copyYAMLContent = async () => {
    try {
      const yamlContent = `openapi: 3.0.3
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

# توضیح: این فقط بخشی از محتوای کامل است
# برای دریافت فایل کامل از دکمه دانلود استفاده کنید`;

      await navigator.clipboard.writeText(yamlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('محتوای مستندات کپی شد');
    } catch (error) {
      console.error('خطا در کپی کردن:', error);
      toast.error('خطا در کپی کردن محتوا');
    }
  };

  const openInSwaggerUI = () => {
    const swaggerUrl = `https://editor.swagger.io/?url=https://elevatorid.ieeu.ir/v1/docs/openapi-specification.yaml`;
    window.open(swaggerUrl, '_blank');
  };

  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">مستندات API OpenAPI</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        مستندات کامل API شامل تمام endpoint های احراز هویت، مدیریت کاربران، قطعات، انتقال‌ها، آسانسورها، درخواست‌ها و گزارش‌گیری
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button onClick={downloadYAML} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          دانلود فایل YAML
        </Button>

        <Button 
          variant="outline" 
          onClick={copyYAMLContent}
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
          variant="secondary" 
          onClick={openInSwaggerUI}
          className="flex items-center gap-2 md:col-span-2"
        >
          <FileText className="h-4 w-4" />
          مشاهده در Swagger Editor
        </Button>
      </div>

      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <h4 className="font-medium mb-2">راهنمای استفاده:</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• برای دانلود فایل کامل از دکمه "دانلود فایل YAML" استفاده کنید</li>
          <li>• برای مشاهده و تست API ها در محیط Swagger از دکمه "مشاهده در Swagger Editor" استفاده کنید</li>
          <li>• فایل دانلود شده شامل تمام schemas، endpoints و مثال‌های مورد نیاز است</li>
          <li>• می‌توانید این فایل را در ابزارهای مختلف مانند Postman، Insomnia یا Swagger UI استفاده کنید</li>
        </ul>
      </div>
    </div>
  );
};

export default APIDocDownloader;