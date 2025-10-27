import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../../contexts/AuthContext';

export default function OTPVerification() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(180);
  const { verifyOTP, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const mobile = location.state?.mobile;

  useEffect(() => {
    if (!mobile) {
      navigate('/login');
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mobile, navigate]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast.error('کد تایید باید ۶ رقم باشد');
      return;
    }

    setIsLoading(true);
    try {
      await verifyOTP(mobile, otp);
      // Navigate to dashboard after successful verification
      navigate('/dashboard');
    } catch (error) {
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    try {
      // For now, use a dummy captcha token for resend
      const captchaToken = `captcha_resend_${Date.now()}`;
      await login(mobile, captchaToken);
      setCanResend(false);
      setTimer(180);
      toast.success('کد تایید مجدداً ارسال شد');
    } catch (error) {
      // Error handled in AuthContext
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">تایید شماره موبایل</CardTitle>
          <CardDescription>
            کد تایید ۶ رقمی ارسال شده به شماره <span className="font-mono" dir="ltr">{mobile}</span> را وارد کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Demo Info */}
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-700 dark:text-green-300 text-center">
              💡 برای دمو: هر کد ۶ رقمی قابل قبول است (مثال: 123456)
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp" className="block text-center">کد تایید</Label>
              <div className="flex justify-center">
                <div dir="ltr" className="flex justify-center">
                  <InputOTP
                    value={otp}
                    onChange={setOtp}
                    maxLength={6}
                    dir="ltr"
                  >
                    <InputOTPGroup className="flex-row gap-1.5 sm:gap-2">
                      <InputOTPSlot index={0} className="w-9 h-11 sm:w-11 sm:h-13 text-base sm:text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                      <InputOTPSlot index={1} className="w-9 h-11 sm:w-11 sm:h-13 text-base sm:text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                      <InputOTPSlot index={2} className="w-9 h-11 sm:w-11 sm:h-13 text-base sm:text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                      <InputOTPSlot index={3} className="w-9 h-11 sm:w-11 sm:h-13 text-base sm:text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                      <InputOTPSlot index={4} className="w-9 h-11 sm:w-11 sm:h-13 text-base sm:text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                      <InputOTPSlot index={5} className="w-9 h-11 sm:w-11 sm:h-13 text-base sm:text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? 'در حال تایید...' : 'تایید و ورود'}
            </Button>
            
            <div className="text-center space-y-2">
              {timer > 0 ? (
                <p className="text-sm text-muted-foreground">
                  ارسال مجدد کد تا: {formatTime(timer)}
                </p>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResend}
                  disabled={!canResend}
                >
                  ارسال مجدد کد تایید
                </Button>
              )}
              
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/login')}
                className="text-sm"
              >
                بازگشت به صفحه ورود
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}