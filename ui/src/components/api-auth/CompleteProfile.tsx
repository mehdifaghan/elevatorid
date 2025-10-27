import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../hooks/useApi';
import { authService } from '../../services/auth.service';
import { Building2, User, MapPin, Phone, Mail, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import SimpleProvinceAndCitySelector from '../common/SimpleProvinceAndCitySelector';

interface ProfileFormData {
  profileType: string;
  companyName: string;
  tradeId: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  ceoPhone: string;
  email: string;
  description?: string;
}

export default function CompleteProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { makeRequest } = useApi();
  
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState<ProfileFormData>({
    profileType: '',
    companyName: '',
    tradeId: '',
    province: '',
    city: '',
    address: '',
    postalCode: '',
    ceoPhone: '',
    email: '',
    description: ''
  });

  const profileTypes = [
    { value: 'producer', label: 'تولیدکننده', icon: '🏭' },
    { value: 'installer', label: 'نصاب', icon: '🔧' },
    { value: 'maintenance', label: 'نگهداری و تعمیرات', icon: '⚙️' },
    { value: 'importer', label: 'واردکننده', icon: '🌍' },
    { value: 'distributor', label: 'توزیع‌کننده', icon: '🚚' },
    { value: 'inspector', label: 'بازرس', icon: '🔍' },
    { value: 'coop_org', label: 'اتحادیه/سازمان', icon: '🏢' },
  ];

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProvinceAndCityChange = (province: string, city: string) => {
    setFormData(prev => ({ ...prev, province, city }));
  };

  const validateStep1 = () => {
    if (!formData.profileType) {
      toast.error('لطفاً نوع فعالیت را انتخاب کنید');
      return false;
    }
    if (!formData.companyName || formData.companyName.length < 3) {
      toast.error('نام شرکت باید حداقل 3 کاراکتر باشد');
      return false;
    }
    if (!formData.tradeId || formData.tradeId.length < 10) {
      toast.error('شناسه ملی/اقتصادی معتبر نیست');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.province) {
      toast.error('لطفاً استان را انتخاب کنید');
      return false;
    }
    if (!formData.city) {
      toast.error('لطفاً شهر را انتخاب کنید');
      return false;
    }
    if (!formData.address || formData.address.length < 10) {
      toast.error('آدرس باید حداقل 10 کاراکتر باشد');
      return false;
    }
    if (!formData.postalCode || !/^\d{10}$/.test(formData.postalCode)) {
      toast.error('کد پستی باید 10 رقم باشد');
      return false;
    }
    if (!formData.ceoPhone || !/^0\d{10}$/.test(formData.ceoPhone)) {
      toast.error('شماره تلفن ثابت معتبر نیست (مثال: 02112345678)');
      return false;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('ایمیل معتبر نیست');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      // ارسال اطلاعات پروفایل به سرور
      const response = await makeRequest(() => authService.updateMe({
        profileType: formData.profileType,
        company: {
          name: formData.companyName,
          tradeId: formData.tradeId,
          province: formData.province,
          city: formData.city,
          address: formData.address,
          postalCode: formData.postalCode,
          ceoPhone: formData.ceoPhone,
          email: formData.email,
          description: formData.description
        }
      }));

      if (response) {
        toast.success('پروفایل شما با موفقیت تکمیل شد!');
        
        // به‌روزرسانی اطلاعات کاربر در AuthContext
        const meResponse = await makeRequest(() => authService.getMe());
        if (meResponse) {
          const userRole = meResponse.profiles?.[0]?.profileType === 'coop_org' ? 'admin' : 'user';
          login({
            id: meResponse.user.id,
            phone: meResponse.user.phone,
            role: userRole,
            status: meResponse.user.status,
            profiles: meResponse.profiles
          });

          // هدایت به داشبورد مناسب
          setTimeout(() => {
            navigate(userRole === 'admin' ? '/api/admin' : '/api/user', { replace: true });
          }, 1000);
        }
      }
    } catch (error: any) {
      console.error('Complete profile error:', error);
      const errorMessage = error?.response?.data?.message || 'خطا در ثبت اطلاعات';
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedProfileType = profileTypes.find(p => p.value === formData.profileType);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 relative overflow-hidden" dir="rtl">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 backdrop-blur-3xl"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-3xl space-y-8 relative z-10">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-2xl">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
              تکمیل اطلاعات پروفایل
            </h1>
            <p className="text-gray-600 font-medium">
              برای استفاده از سامانه، لطفاً اطلاعات زیر را تکمیل کنید
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {currentStep > 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
            </div>
            <span className={currentStep >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
              اطلاعات شرکت
            </span>
          </div>
          <div className="w-16 h-1 bg-gray-200 rounded">
            <div className={`h-full rounded transition-all duration-300 ${
              currentStep >= 2 ? 'bg-blue-600 w-full' : 'bg-gray-200 w-0'
            }`} />
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
              اطلاعات تماس
            </span>
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-md ring-1 ring-gray-200/50">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              {currentStep === 1 ? 'مرحله اول: اطلاعات شرکت' : 'مرحله دوم: اطلاعات تماس'}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 
                ? 'نوع فعالیت و مشخصات شرکت خود را وارد کنید'
                : 'آدرس و اطلاعات تماس خود را وارد کنید'
              }
            </CardDescription>
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
              {/* Step 1: Company Information */}
              {currentStep === 1 && (
                <div className="space-y-5">
                  {/* Profile Type */}
                  <div className="space-y-3">
                    <Label htmlFor="profileType" className="text-right block text-gray-700 font-medium">
                      نوع فعالیت *
                    </Label>
                    <Select
                      value={formData.profileType}
                      onValueChange={(value) => handleInputChange('profileType', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="bg-gray-50/80 border-gray-200 h-12 rounded-xl">
                        <SelectValue placeholder="انتخاب کنید..." />
                      </SelectTrigger>
                      <SelectContent>
                        {profileTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <span>{type.icon}</span>
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedProfileType && (
                      <Badge variant="secondary" className="gap-2">
                        <span>{selectedProfileType.icon}</span>
                        <span>{selectedProfileType.label}</span>
                      </Badge>
                    )}
                  </div>

                  {/* Company Name */}
                  <div className="space-y-3">
                    <Label htmlFor="companyName" className="text-right block text-gray-700 font-medium">
                      نام شرکت *
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="companyName"
                        type="text"
                        placeholder="مثال: شرکت آسانسور سازان"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className="text-right pr-12 bg-gray-50/80 border-gray-200 h-12 rounded-xl"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Trade ID */}
                  <div className="space-y-3">
                    <Label htmlFor="tradeId" className="text-right block text-gray-700 font-medium">
                      شناسه ملی / شناسه اقتصادی *
                    </Label>
                    <div className="relative">
                      <FileText className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="tradeId"
                        type="text"
                        placeholder="10 یا 11 رقم"
                        value={formData.tradeId}
                        onChange={(e) => handleInputChange('tradeId', e.target.value.replace(/\D/g, ''))}
                        className="text-right pr-12 bg-gray-50/80 border-gray-200 h-12 rounded-xl"
                        maxLength={11}
                        disabled={isLoading}
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Contact Information */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  {/* Province and City */}
                  <div className="space-y-3">
                    <Label className="text-right block text-gray-700 font-medium">
                      استان و شهر *
                    </Label>
                    <SimpleProvinceAndCitySelector
                      selectedProvince={formData.province}
                      selectedCity={formData.city}
                      onProvinceChange={(province) => handleInputChange('province', province)}
                      onCityChange={(city) => handleInputChange('city', city)}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-3">
                    <Label htmlFor="address" className="text-right block text-gray-700 font-medium">
                      آدرس کامل *
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute right-4 top-4 text-gray-400 w-5 h-5" />
                      <Textarea
                        id="address"
                        placeholder="آدرس دقیق شرکت را وارد کنید"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="text-right pr-12 bg-gray-50/80 border-gray-200 rounded-xl min-h-[100px]"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Postal Code */}
                  <div className="space-y-3">
                    <Label htmlFor="postalCode" className="text-right block text-gray-700 font-medium">
                      کد پستی *
                    </Label>
                    <Input
                      id="postalCode"
                      type="text"
                      placeholder="1234567890"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value.replace(/\D/g, ''))}
                      className="text-right bg-gray-50/80 border-gray-200 h-12 rounded-xl"
                      maxLength={10}
                      disabled={isLoading}
                      dir="ltr"
                    />
                  </div>

                  {/* CEO Phone */}
                  <div className="space-y-3">
                    <Label htmlFor="ceoPhone" className="text-right block text-gray-700 font-medium">
                      تلفن ثابت *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="ceoPhone"
                        type="tel"
                        placeholder="02112345678"
                        value={formData.ceoPhone}
                        onChange={(e) => handleInputChange('ceoPhone', e.target.value.replace(/\D/g, ''))}
                        className="text-right pr-12 bg-gray-50/80 border-gray-200 h-12 rounded-xl"
                        maxLength={11}
                        disabled={isLoading}
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-right block text-gray-700 font-medium">
                      ایمیل (اختیاری)
                    </Label>
                    <div className="relative">
                      <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="info@company.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="text-right pr-12 bg-gray-50/80 border-gray-200 h-12 rounded-xl"
                        disabled={isLoading}
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-right block text-gray-700 font-medium">
                      توضیحات (اختیاری)
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="توضیحات تکمیلی در مورد فعالیت شرکت"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="text-right bg-gray-50/80 border-gray-200 rounded-xl"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-4">
                {currentStep === 1 ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-semibold"
                    disabled={isLoading}
                  >
                    مرحله بعد ←
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePreviousStep}
                      className="flex-1 border-gray-300 py-4 rounded-xl font-semibold"
                      disabled={isLoading}
                    >
                      → مرحله قبل
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-3">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          در حال ثبت...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5" />
                          ثبت و ورود به سامانه
                        </div>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
