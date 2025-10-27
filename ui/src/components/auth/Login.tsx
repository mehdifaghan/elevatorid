import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../../contexts/AuthContext';
import CaptchaComponent from '../common/CaptchaComponent';
import { Phone } from 'lucide-react';

export default function Login() {
  const [mobile, setMobile] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaValid, setCaptchaValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mobile) {
      toast.error('شماره موبایل را وارد کنید');
      return;
    }

    if (!captchaValid) {
      toast.error('کپچا را تکمیل کنید');
      return;
    }

    const mobileRegex = /^09\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      toast.error('شماره موبایل معتبر نیست');
      return;
    }

    setIsLoading(true);
    try {
      // For now, use a dummy captcha token - in real implementation this would come from actual captcha
      const captchaToken = `captcha_${Date.now()}`;
      await login(mobile, captchaToken);
      navigate('/otp-verify', { state: { mobile } });
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoMobile: string) => {
    setMobile(demoMobile);
    setCaptchaValid(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">ورود به سامانه</CardTitle>
          <CardDescription>
            سامانه ردیابی قطعات و شناسنامه آسانسور
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Demo Credentials Info */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">🎯 حساب‌های نمونه:</h4>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <div><strong>مدیر:</strong> <span className="font-mono" dir="ltr">09121111111</span></div>
              <div><strong>کاربر:</strong> <span className="font-mono" dir="ltr">09122222222</span></div>
              <div className="text-xs mt-2 text-blue-600 dark:text-blue-400">
                کد تایید: هر عددی قابل قبول است (1234)
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <Label htmlFor="mobile" className="text-center">شماره موبایل</Label>
              </div>
              <p className="text-xs text-gray-500 text-center">شماره موبایل خود را در کادرهای زیر وارد کنید</p>
              <div className="flex justify-center" dir="ltr">
                <InputOTP 
                  value={mobile} 
                  onChange={setMobile}
                  maxLength={11}
                  disabled={isLoading}
                >
                  <InputOTPGroup className="gap-0.5 sm:gap-1">
                    <InputOTPSlot index={0} className="w-6 h-9 sm:w-7 sm:h-10 text-sm sm:text-base font-bold border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                    <InputOTPSlot index={1} className="w-6 h-9 sm:w-7 sm:h-10 text-sm sm:text-base font-bold border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                    <InputOTPSlot index={2} className="w-6 h-9 sm:w-7 sm:h-10 text-sm sm:text-base font-bold border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                    <InputOTPSlot index={3} className="w-6 h-9 sm:w-7 sm:h-10 text-sm sm:text-base font-bold border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                    <InputOTPSlot index={4} className="w-6 h-9 sm:w-7 sm:h-10 text-sm sm:text-base font-bold border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                    <InputOTPSlot index={5} className="w-6 h-9 sm:w-7 sm:h-10 text-sm sm:text-base font-bold border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                    <InputOTPSlot index={6} className="w-6 h-9 sm:w-7 sm:h-10 text-sm sm:text-base font-bold border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                    <InputOTPSlot index={7} className="w-6 h-9 sm:w-7 sm:h-10 text-sm sm:text-base font-bold border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                    <InputOTPSlot index={8} className="w-6 h-9 sm:w-7 sm:h-10 text-sm sm:text-base font-bold border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                    <InputOTPSlot index={9} className="w-6 h-9 sm:w-7 sm:h-10 text-sm sm:text-base font-bold border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                    <InputOTPSlot index={10} className="w-6 h-9 sm:w-7 sm:h-10 text-sm sm:text-base font-bold border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {mobile.length > 0 && mobile.length < 11 && (
                <p className="text-xs text-orange-600 text-center">
                  {11 - mobile.length} رقم باقی‌مانده
                </p>
              )}
              {mobile.length === 11 && (
                <div className="flex items-center justify-center gap-1.5 text-green-600 text-xs">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>شماره کامل شد</span>
                </div>
              )}
            </div>
            
            <CaptchaComponent 
              onValidate={setCaptchaValid}
              onValueChange={setCaptcha}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !captchaValid || mobile.length !== 11}
            >
              {isLoading ? 'در حال ارسال...' : 'ارسال کد تایید'}
            </Button>

            {/* Quick Demo Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('09121111111')}
                className="text-xs"
              >
                مدیر نمونه
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('09122222222')}
                className="text-xs"
              >
                کاربر نمونه
              </Button>
            </div>

            {/* Demo Access Links */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3 text-center">
                🔍 مشاهده بدون ورود (دمو)
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/demo/admin')}
                  className="text-xs"
                >
                  پنل مدیریت
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/demo/user')}
                  className="text-xs"
                >
                  پنل کاربری
                </Button>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-2">
                مشاهده تمام قابلیت‌های سیستم بدون نیاز به ثبت‌نام
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
