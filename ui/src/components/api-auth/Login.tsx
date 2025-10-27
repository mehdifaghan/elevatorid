import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../../contexts/AuthContext';
import CaptchaComponent from '../common/CaptchaComponent';
import { useApi } from '../../hooks/useApi';
import { authService } from '../../services/auth.service';
import { Phone, Shield, Loader2 } from 'lucide-react';

export default function Login() {
  const [mobile, setMobile] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaId, setCaptchaId] = useState('');
  const [captchaValid, setCaptchaValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { makeRequest, isOnline } = useApi();



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    

    
    if (!mobile) {
      toast.error('شماره موبایل را وارد کنید');
      return;
    }

    if (!captchaId) {
      toast.error('در حال بارگذاری کد امنیتی، لطفاً صبر کنید');
      return;
    }

    if (!captcha || captcha.length < 4) {
      toast.error('کد امنیتی را تکمیل کنید');
      return;
    }

    if (!captchaValid) {
      toast.error('کد امنیتی صحیح نیست');
      return;
    }

    // Validate Iranian mobile number
    const mobileRegex = /^09[0-9]{9}$/;
    if (!mobileRegex.test(mobile)) {
      toast.error('شماره موبایل معتبر نیست');
      return;
    }

    setIsLoading(true);
    setApiError(null); // Clear previous errors

    try {
      const response = await makeRequest(() => authService.sendOtp({ 
        phone: mobile,
        captcha: captcha,
        captchaId: captchaId
      }));
      
      if (response.success) {
        setApiError(null);
        toast.success('کد تایید ارسال شد');
        // Store mobile for OTP verification
        localStorage.setItem('apiAuthMobile', mobile);
        navigate('/api/otp-verify', { state: { mobile } });
      } else {
        const errorMessage = response.error || 'خطا در ارسال کد تایید';
        setApiError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = 'خطا در اتصال به سرور API - لطفاً از اتصال اینترنت خود اطمینان حاصل کنید';
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 relative overflow-hidden" dir="rtl">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 backdrop-blur-3xl"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-lg space-y-8 relative z-10">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
              ورود به سامانه
            </h1>
            <p className="text-gray-600 font-medium">
              سامانه جامع ردیابی قطعات و شناسنامه آسانسور
            </p>
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-md ring-1 ring-gray-200/50">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">

            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 p-8">
            {/* API Error Alert */}
            {apiError && (
              <Alert className="bg-gradient-to-r from-red-50 to-rose-50 border-red-200 shadow-sm">
                <AlertDescription className="text-red-700 font-medium">
                  ⚠️ {apiError}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <Label htmlFor="mobile" className="text-gray-700 font-medium text-center">
                    شماره موبایل
                  </Label>
                </div>
                <p className="text-sm text-gray-500 text-center">شماره موبایل خود را در کادرهای زیر وارد کنید</p>
                <div className="flex justify-center" dir="ltr">
                  <InputOTP 
                    value={mobile} 
                    onChange={setMobile}
                    maxLength={11}
                    disabled={isLoading}
                  >
                    <InputOTPGroup className="gap-0.5 sm:gap-1">
                      <InputOTPSlot index={0} className="w-6 h-9 sm:w-8 sm:h-11 text-sm sm:text-base font-bold border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                      <InputOTPSlot index={1} className="w-6 h-9 sm:w-8 sm:h-11 text-sm sm:text-base font-bold border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                      <InputOTPSlot index={2} className="w-6 h-9 sm:w-8 sm:h-11 text-sm sm:text-base font-bold border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                      <InputOTPSlot index={3} className="w-6 h-9 sm:w-8 sm:h-11 text-sm sm:text-base font-bold border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                      <InputOTPSlot index={4} className="w-6 h-9 sm:w-8 sm:h-11 text-sm sm:text-base font-bold border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                      <InputOTPSlot index={5} className="w-6 h-9 sm:w-8 sm:h-11 text-sm sm:text-base font-bold border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                      <InputOTPSlot index={6} className="w-6 h-9 sm:w-8 sm:h-11 text-sm sm:text-base font-bold border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                      <InputOTPSlot index={7} className="w-6 h-9 sm:w-8 sm:h-11 text-sm sm:text-base font-bold border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                      <InputOTPSlot index={8} className="w-6 h-9 sm:w-8 sm:h-11 text-sm sm:text-base font-bold border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                      <InputOTPSlot index={9} className="w-6 h-9 sm:w-8 sm:h-11 text-sm sm:text-base font-bold border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                      <InputOTPSlot index={10} className="w-6 h-9 sm:w-8 sm:h-11 text-sm sm:text-base font-bold border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {mobile.length > 0 && mobile.length < 11 && (
                  <p className="text-xs text-orange-600 text-center">
                    {11 - mobile.length} رقم باقی‌مانده
                  </p>
                )}
                {mobile.length === 11 && (
                  <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>شماره کامل شد</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-right block text-gray-700 font-medium">تایید امنیتی</Label>
                <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200">
                  <CaptchaComponent
                    onCaptchaChange={setCaptcha}
                    onCaptchaIdChange={setCaptchaId}
                    onValidityChange={setCaptchaValid}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 disabled:transform-none"
                disabled={isLoading || !isOnline || !captchaValid || !mobile || !captcha || mobile.length !== 11}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    در حال ارسال کد تایید...
                  </div>
                ) : (
                  <div className="flex items-center gap-3 justify-center">
                    <span>ارسال کد تایید</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                )}
              </Button>
            </form>



            {/* Alternative Options */}
            <div className="text-center pt-6 border-t border-gray-100">
              <div className="space-y-3">
                <Button 
                  type="button"
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-6 py-2 rounded-lg transition-colors"
                  onClick={() => navigate('/')}
                >
                  ← بازگشت به صفحه اصلی
                </Button>
                
                <div className="text-center">
                  <Button 
                    type="button"
                    variant="link"
                    className="text-sm text-blue-600 hover:text-blue-800 underline-offset-4"
                    onClick={() => navigate('/demo/admin')}
                  >
                    آزمایش با پنل نمونه
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


      </div>
    </div>
  );
}
