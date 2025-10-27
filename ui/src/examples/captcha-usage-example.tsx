// مثال کامل از نحوه استفاده از کامپوننت CAPTCHA با API

import React, { useState } from 'react';
import CaptchaComponent from '../components/common/CaptchaComponent';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner@2.0.3';

export default function CaptchaUsageExample() {
  const [formData, setFormData] = useState({
    phone: '',
    captcha: '',
    captchaId: '',
  });
  const [captchaValid, setCaptchaValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // اعتبارسنجی
    if (!formData.phone) {
      toast.error('شماره تلفن را وارد کنید');
      return;
    }

    if (!formData.captcha) {
      toast.error('کد امنیتی را وارد کنید');
      return;
    }

    if (!captchaValid) {
      toast.error('کد امنیتی صحیح نیست');
      return;
    }

    setLoading(true);

    try {
      // ارسال درخواست به API با فیلدهای captcha
      const response = await fetch('/api/some-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formData.phone,
          captcha: formData.captcha,
          captchaId: formData.captchaId,
          // سایر فیلدهای فرم...
        }),
      });

      if (response.ok) {
        toast.success('درخواست با موفقیت ارسال شد');
        
        // Reset form
        setFormData({
          phone: '',
          captcha: '',
          captchaId: '',
        });
        setCaptchaValid(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'خطا در ارسال درخواست');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="phone">شماره تلفن</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              phone: e.target.value
            }))}
            placeholder="09123456789"
          />
        </div>

        <CaptchaComponent
          onCaptchaChange={(value) => setFormData(prev => ({
            ...prev,
            captcha: value
          }))}
          onCaptchaIdChange={(id) => setFormData(prev => ({
            ...prev,
            captchaId: id
          }))}
          onValidityChange={setCaptchaValid}
          disabled={loading}
        />

        <Button 
          type="submit" 
          disabled={loading || !captchaValid}
          className="w-full"
        >
          {loading ? 'در حال ارسال...' : 'ارسال'}
        </Button>
      </form>

      {/* نمایش اطلاعات فرم برای debug */}
      <div className="mt-6 p-4 bg-gray-100 rounded text-sm">
        <h3 className="font-bold">وضعیت فرم:</h3>
        <p>شماره تلفن: {formData.phone}</p>
        <p>کد امنیتی: {formData.captcha}</p>
        <p>ID کپچا: {formData.captchaId}</p>
        <p>اعتبار کپچا: {captchaValid ? '✅ معتبر' : '❌ نامعتبر'}</p>
      </div>
    </div>
  );
}

// نحوه استفاده در سایر کامپوننت‌ها:

/*
import CaptchaComponent from './components/common/CaptchaComponent';

function MyForm() {
  const [captchaData, setCaptchaData] = useState({
    value: '',
    id: '',
    isValid: false
  });

  const handleCaptchaChange = (value: string) => {
    setCaptchaData(prev => ({ ...prev, value }));
  };

  const handleCaptchaIdChange = (id: string) => {
    setCaptchaData(prev => ({ ...prev, id }));
  };

  const handleValidityChange = (isValid: boolean) => {
    setCaptchaData(prev => ({ ...prev, isValid }));
  };

  const submitForm = async () => {
    if (!captchaData.isValid) {
      alert('کد امنیتی صحیح نیست');
      return;
    }

    await fetch('/api/endpoint', {
      method: 'POST',
      body: JSON.stringify({
        // سایر فیلدها...
        captcha: captchaData.value,
        captchaId: captchaData.id
      })
    });
  };

  return (
    <form>
      // سایر فیلدهای فرم...
      
      <CaptchaComponent
        onCaptchaChange={handleCaptchaChange}
        onCaptchaIdChange={handleCaptchaIdChange}
        onValidityChange={handleValidityChange}
      />
      
      <button 
        onClick={submitForm}
        disabled={!captchaData.isValid}
      >
        ارسال
      </button>
    </form>
  );
}
*/