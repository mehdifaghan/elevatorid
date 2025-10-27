import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../hooks/useApi';
import { authService } from '../../services/auth.service';
import { Wifi, WifiOff, RefreshCw, ArrowRight, Shield, Timer, Loader2 } from 'lucide-react';
import CaptchaComponent from '../common/CaptchaComponent';

export default function OTPVerification() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minutes
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connected');
  const [showResendCaptcha, setShowResendCaptcha] = useState(false);
  const [resendCaptcha, setResendCaptcha] = useState('');
  const [resendCaptchaId, setResendCaptchaId] = useState('');
  const [resendCaptchaValid, setResendCaptchaValid] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { makeRequest, isOnline } = useApi();
  
  // Get mobile from location state or localStorage
  const mobile = location.state?.mobile || localStorage.getItem('apiAuthMobile');

  useEffect(() => {
    if (!mobile) {
      toast.error('شماره موبایل یافت نشد');
      navigate('/api/login');
      return;
    }

    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mobile, navigate]);

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-600" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-red-600" />;
      case 'connecting':
        return <RefreshCw className="w-4 h-4 text-yellow-600 animate-spin" />;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error('کد تایید ۶ رقمی را وارد کنید');
      return;
    }

    setIsLoading(true);
    setConnectionStatus('connecting');

    try {
      const response = await makeRequest(() => authService.verifyOtp({ phone: mobile, code: otp }));
      
      if (response.accessToken && response.refreshToken) {
        setConnectionStatus('connected');
        
        // ذخیره توکن‌ها
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        
        // دریافت اطلاعات کاربر
        const meResponse = await makeRequest(() => authService.getMe());
        
        if (meResponse && meResponse.user) {
          const hasCompleteProfile = meResponse.profiles && 
                                     meResponse.profiles.length > 0 && 
                                     meResponse.profiles[0].company?.name;
          
          // تشخیص نقش کاربر
          const userRole = meResponse.profiles?.[0]?.profileType === 'coop_org' ? 'admin' : 'user';
          
          // لاگین کاربر در AuthContext
          login({
            id: meResponse.user.id,
            phone: meResponse.user.phone,
            role: userRole,
            status: meResponse.user.status,
            profiles: meResponse.profiles
          });
          
          // Clear stored mobile
          localStorage.removeItem('apiAuthMobile');
          
          // تشخیص خودکار: اگر پروفایل کامل نیست → تکمیل پروفایل
          // اگر پروفایل کامل است → داشبورد
          if (!hasCompleteProfile) {
            toast.success('خوش آمدید! لطفاً اطلاعات پروفایل خود را تکمیل کنید');
            navigate('/api/complete-profile', { replace: true });
          } else {
            toast.success('ورود موفق به سامانه');
            navigate(userRole === 'admin' ? '/api/admin' : '/api/user', { replace: true });
          }
        } else {
          setConnectionStatus('disconnected');
          toast.error('خطا در دریافت اطلاعات کاربر');
        }
      } else {
        setConnectionStatus('disconnected');
        toast.error(response.error || 'کد تایید اشتباه است');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setConnectionStatus('disconnected');
      toast.error('خطا در تایید کد');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0 || resendLoading) return;

    // نمایش captcha برای ارسال مجدد
    if (!showResendCaptcha) {
      setShowResendCaptcha(true);
      return;
    }

    // اعتبارسنجی captcha برای ارسال مجدد
    if (!resendCaptcha || !resendCaptchaValid) {
      toast.error('لطفاً کد امنیتی را به درستی وارد کنید');
      return;
    }

    setResendLoading(true);
    setConnectionStatus('connecting');

    try {
      const response = await makeRequest(() => authService.sendOtp({ 
        phone: mobile,
        captcha: resendCaptcha,
        captchaId: resendCaptchaId
      }));
      
      if (response.success) {
        setConnectionStatus('connected');
        toast.success('کد تایید جدید ارسال شد');
        setCountdown(120);
        setOtp('');
        setShowResendCaptcha(false);
        setResendCaptcha('');
        setResendCaptchaId('');
        setResendCaptchaValid(false);
      } else {
        setConnectionStatus('disconnected');
        toast.error(response.error || 'خطا در ارسال مجدد کد');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setConnectionStatus('disconnected');
      toast.error('خطا در ارسال مجدد کد');
    } finally {
      setResendLoading(false);
    }
  };

  if (!mobile) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 relative overflow-hidden" dir="rtl">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 backdrop-blur-3xl"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-green-700 to-blue-800 bg-clip-text text-transparent">
              تایید کد امنیتی
            </h1>
            <p className="text-gray-600 font-medium">
              کد ۶ رقمی ارسال شده به شماره
            </p>
            <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-green-50 px-4 py-2 rounded-full border border-blue-200">
              <span className="font-bold text-blue-800">{mobile}</span>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-md ring-1 ring-gray-200/50">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge variant="outline" className="bg-gradient-to-r from-green-50 to-blue-50 text-green-700 border-green-200/60 px-3 py-1">
                🔒 تایید هویت
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-8 p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="text-center">
                  <Label className="text-gray-700 font-medium text-lg">کد تایید ۶ رقمی</Label>
                  <p className="text-sm text-gray-500 mt-1">لطفاً کد دریافتی را در کادرهای زیر وارد کنید</p>
                </div>
                <div className="flex justify-center">
                  <InputOTP 
                    value={otp} 
                    onChange={setOtp}
                    maxLength={6}
                    disabled={isLoading}
                  >
                    <InputOTPGroup className="gap-1.5 sm:gap-2">
                      <InputOTPSlot index={0} className="w-10 h-12 sm:w-12 sm:h-14 text-base sm:text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                      <InputOTPSlot index={1} className="w-10 h-12 sm:w-12 sm:h-14 text-base sm:text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                      <InputOTPSlot index={2} className="w-10 h-12 sm:w-12 sm:h-14 text-base sm:text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                      <InputOTPSlot index={3} className="w-10 h-12 sm:w-12 sm:h-14 text-base sm:text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                      <InputOTPSlot index={4} className="w-10 h-12 sm:w-12 sm:h-14 text-base sm:text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                      <InputOTPSlot index={5} className="w-10 h-12 sm:w-12 sm:h-14 text-base sm:text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              {/* Countdown Timer */}
              {countdown > 0 && (
                <div className="flex items-center justify-center gap-3 text-gray-600 bg-gray-50 rounded-xl py-3 px-4">
                  <Timer className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">
                    زمان باقی‌مانده: 
                    <span className="text-blue-600 font-bold mx-1">{formatTime(countdown)}</span>
                  </span>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 disabled:transform-none"
                disabled={isLoading || otp.length !== 6 || !isOnline}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    در حال تایید کد...
                  </div>
                ) : (
                  <div className="flex items-center gap-3 justify-center">
                    <span>تایید و ورود به سامانه</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </div>
                )}
              </Button>
            </form>

            {/* Resend OTP */}
            <div className="text-center space-y-4">
              {showResendCaptcha && (
                <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50">
                  <Label className="text-right block mb-3 text-gray-700 font-medium">تایید امنیتی برای ارسال مجدد</Label>
                  <CaptchaComponent
                    onCaptchaChange={setResendCaptcha}
                    onCaptchaIdChange={setResendCaptchaId}
                    onValidityChange={setResendCaptchaValid}
                    disabled={resendLoading}
                  />
                </div>
              )}
              
              <Button 
                type="button"
                variant="outline"
                className="w-full text-gray-700 border-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 py-3 rounded-xl font-medium transition-all duration-200"
                disabled={countdown > 0 || resendLoading || !isOnline || (showResendCaptcha && !resendCaptchaValid)}
                onClick={handleResendOTP}
              >
                {resendLoading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    در حال ارسال مجدد کد...
                  </div>
                ) : countdown > 0 ? (
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-gray-500" />
                    ارسال مجدد ({formatTime(countdown)})
                  </div>
                ) : showResendCaptcha ? (
                  'تایید و ارسال مجدد کد'
                ) : (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    ارسال مجدد کد
                  </div>
                )}
              </Button>
              
              {showResendCaptcha && (
                <Button 
                  type="button"
                  variant="ghost"
                  className="w-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 py-2 rounded-lg"
                  onClick={() => {
                    setShowResendCaptcha(false);
                    setResendCaptcha('');
                    setResendCaptchaId('');
                    setResendCaptchaValid(false);
                  }}
                >
                  انصراف از ارسال مجدد
                </Button>
              )}

              <div className="pt-4 border-t border-gray-100">
                <Button 
                  type="button"
                  variant="link"
                  className="text-gray-600 hover:text-gray-800 flex items-center gap-2 text-sm"
                  onClick={() => navigate('/api/login')}
                >
                  <ArrowRight className="w-4 h-4" />
                  تغییر شماره موبایل
                </Button>
              </div>
            </div>


          </CardContent>
        </Card>

        {/* Connection Error Info */}
        {connectionStatus === 'disconnected' && (
          <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                  <WifiOff className="w-6 h-6 text-red-600" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-red-800">خطا در اتصال به API</p>
                  <p className="text-sm text-red-700 leading-relaxed">
                    لطفاً اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید
                  </p>
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  className="bg-white border-red-300 text-red-700 hover:bg-red-50"
                  onClick={() => window.location.reload()}
                >
                  🔄 تلاش مجدد
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}