import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RefreshCw } from 'lucide-react';
import { captchaService } from '../../services/captcha.service';
import { useApi } from '../../hooks/useApi';

interface CaptchaComponentProps {
  onValidate?: (isValid: boolean) => void;
  onValueChange?: (value: string) => void;
  onCaptchaChange?: (value: string) => void;
  onValidityChange?: (isValid: boolean) => void;
  onCaptchaIdChange?: (captchaId: string) => void;
  onApiStatusChange?: (isApiAvailable: boolean) => void;
  disabled?: boolean;
}

export default function CaptchaComponent({ 
  onValidate, 
  onValueChange, 
  onCaptchaChange, 
  onValidityChange,
  onCaptchaIdChange,
  onApiStatusChange,
  disabled = false 
}: CaptchaComponentProps) {
  const [captchaId, setCaptchaId] = useState('');
  const [captchaImageUrl, setCaptchaImageUrl] = useState('');
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isApiAvailable, setIsApiAvailable] = useState(true);
  const { makeRequest } = useApi();

  // دریافت CAPTCHA جدید از API - فقط از سرور
  const fetchNewCaptcha = async () => {
    console.log('🔍 [CAPTCHA] Starting fetchNewCaptcha...');
    setLoading(true);
    setError('');
    
    try {
      console.log('📡 [CAPTCHA] Making API request...');
      const response = await makeRequest(() => captchaService.getCaptcha());
      console.log('📡 [CAPTCHA] API Response:', response);
      
      if (response.success && response.data) {
        console.log('✅ [CAPTCHA] Success - Setting API available to TRUE');
        setCaptchaId(response.data.captchaId);
        setCaptchaImageUrl(response.data.imageUrl);
        setIsApiAvailable(true);
        setError(''); // پاک کردن خطای قبلی
        
        // اطلاع‌رسانی به کامپوننت والد
        onCaptchaIdChange?.(response.data.captchaId);
        onApiStatusChange?.(true);
        console.log('✅ [CAPTCHA] Notified parent - API Available: TRUE');
      } else {
        throw new Error(response.error || 'خطا در دریافت کد امنیتی');
      }
      
    } catch (error) {
      console.error('❌ [CAPTCHA] Error in fetchNewCaptcha:', error);
      console.log('🚨 [CAPTCHA] Setting API available to FALSE');
      setError('خطا در اتصال به سرور - کد امنیتی در دسترس نیست');
      setIsApiAvailable(false);
      setCaptchaImageUrl(''); // پاک کردن تصویر
      setCaptchaId(''); // پاک کردن ID
      
      // اطلاع‌رسانی عدم دسترسی API به والد
      onApiStatusChange?.(false);
      onCaptchaIdChange?.('');
      console.log('🚨 [CAPTCHA] Notified parent - API Available: FALSE');
      
      // بدون fallback محلی - فقط نمایش خطا
    } finally {
      setLoading(false);
      console.log('🏁 [CAPTCHA] fetchNewCaptcha completed');
    }
  };

  // کپچا فقط از سرور دریافت می‌شود - بدون fallback محلی

  // اعتبارسنجی CAPTCHA فقط از طریق API
  const validateCaptcha = async (value: string): Promise<boolean> => {
    if (!captchaId || !value || value.length < 4 || !isApiAvailable) {
      return false;
    }

    try {
      const response = await makeRequest(() => 
        captchaService.validateCaptcha({
          captchaId,
          captchaValue: value,
        })
      );

      if (response.success && response.data) {
        return response.data.valid === true;
      }
      
      return false;
    } catch (error) {
      console.error('خطا در اعتبارسنجی CAPTCHA:', error);
      return false;
    }
  };

  useEffect(() => {
    console.log('🚀 [CAPTCHA] useEffect triggered - Component mounted');
    fetchNewCaptcha();
  }, []);

  const handleRefresh = () => {
    setUserInput('');
    setError('');
    onValidate?.(false);
    onValueChange?.('');
    onCaptchaChange?.('');
    onValidityChange?.(false);
    fetchNewCaptcha();
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
    onValueChange?.(value);
    onCaptchaChange?.(value);
    
    // اعتبارسنجی لحظه‌ای پس از تکمیل ورودی
    if (value.length >= 4) {
      setLoading(true);
      const isValid = await validateCaptcha(value);
      setLoading(false);

      onValidate?.(isValid);
      onValidityChange?.(isValid);
    } else {
      onValidate?.(false);
      onValidityChange?.(false);
    }
  };

  // محاسبه وضعیت اعتبارسنجی
  const [isValid, setIsValid] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  // به‌روزرسانی پیام‌ها
  useEffect(() => {
    if (userInput.length === 0) {
      setValidationMessage('');
      setIsValid(false);
    } else if (userInput.length < 4) {
      setValidationMessage('حداقل ۴ کاراکتر وارد کنید');
      setIsValid(false);
    } else if (loading) {
      setValidationMessage('در حال بررسی...');
      setIsValid(false);
    } else {
      // بررسی اعتبار
      validateCaptcha(userInput).then(valid => {
        setIsValid(valid);
        setValidationMessage(valid ? 'کد امنیتی صحیح است' : 'کد امنیتی اشتباه است');
      });
    }
  }, [userInput, loading, captchaId]);

  const showValidation = userInput.length >= 4;

  return (
    <div className="space-y-2">
      <Label htmlFor="captcha">کد امنیتی</Label>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input
            id="captcha"
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="کد امنیتی را وارد کنید"
            className="text-left font-mono tracking-widest"
            dir="ltr"
            maxLength={8}
            disabled={disabled || loading}
          />
        </div>
        <div className="flex items-center gap-1">
          {captchaImageUrl ? (
            <img
              src={captchaImageUrl}
              alt="کد امنیتی"
              width={120}
              height={40}
              className="border rounded bg-gray-50"
              style={{ width: '120px', height: '40px', objectFit: 'contain' }}
            />
          ) : (
            <div className="border rounded bg-gray-50 flex items-center justify-center" style={{ width: '120px', height: '40px' }}>
              {loading ? (
                <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
              ) : !isApiAvailable ? (
                <span className="text-xs text-red-500">⚠️ خطا</span>
              ) : (
                <span className="text-xs text-gray-400">بارگذاری...</span>
              )}
            </div>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="p-1"
            disabled={disabled || loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      {/* نمایش خطا */}
      {error && (
        <p className="text-sm text-red-600">
          ⚠️ {error}
        </p>
      )}
      
      {/* نمایش وضعیت اعتبارسنجی */}
      {showValidation && !error && (
        <p className={`text-sm ${
          loading 
            ? 'text-blue-600' 
            : isValid 
              ? 'text-green-600' 
              : 'text-red-600'
        }`}>
          {loading 
            ? '🔄 در حال بررسی...' 
            : isValid 
              ? '✓ کد امنیتی صحیح است' 
              : '✗ کد امنیتی اشتباه است'
          }
        </p>
      )}
      
      {/* راهنمایی */}
      {!showValidation && !error && userInput.length === 0 && isApiAvailable && captchaImageUrl && (
        <p className="text-xs text-gray-500">
          کد امنیتی نمایش داده شده در تصویر را وارد کنید
        </p>
      )}
      
      {/* راهنمایی عدم دسترسی API - همیشه نمایش داده شود */}
      {!isApiAvailable && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
          <p className="text-sm text-red-700 font-medium">
            ⚠️ کد امنیتی از سرور دریافت نمی‌شود
          </p>
          <p className="text-xs text-red-600 mt-1">
            لطفاً اتصال اینترنت خود را بررسی کرده و صفحه را رفرش کنید
          </p>
        </div>
      )}
      
      {/* Hidden field for form submission */}
      <input 
        type="hidden" 
        name="captchaId" 
        value={captchaId}
      />
    </div>
  );
}