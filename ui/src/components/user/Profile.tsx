import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { 
  User, 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Upload, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Clock,
  Save,
  X,
  Image
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../../contexts/AuthContext';

interface CompanyProfile {
  companyName: string;
  nationalId: string;
  profileType: string[];
  province: string;
  city: string;
  address: string;
  postalCode: string;
  ceoName: string;
  ceoMobile: string;
  landlinePhone: string;
  email: string;
  website: string;
  establishedYear: string;
  employees: string;
  logo: string;
  licenses: {
    businessLicense: string;
    technicalLicense?: string;
    qualityLicense?: string;
  };
  status: 'pending' | 'approved' | 'incomplete';
}

const profileTypes = [
  { id: 'production', label: 'تولیدی' },
  { id: 'trading', label: 'بازرگانی' },
  { id: 'installation', label: 'نصب/مونتاژ' },
  { id: 'maintenance', label: 'نگهداری/تعمیر' }
];

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [profile, setProfile] = useState<CompanyProfile>({
    companyName: 'شرکت آسانسار تهران',
    nationalId: '14005678901',
    profileType: ['installation', 'maintenance'],
    province: 'تهران',
    city: 'تهران',
    address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
    postalCode: '1234567890',
    ceoName: 'احمد محمدی',
    ceoMobile: '09123456789',
    landlinePhone: '02122334455',
    email: 'info@elevator-tehran.com',
    website: 'www.elevator-tehran.com',
    establishedYear: '۱۳۹۵',
    employees: '۲۰-۵۰',
    logo: '',
    licenses: {
      businessLicense: 'BL-123456',
      technicalLicense: 'TL-789012',
      qualityLicense: ''
    },
    status: 'approved'
  });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('لطفاً یک فایل تصویری انتخاب کنید');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('حجم فایل نباید بیشتر از ۲ مگابایت باشد');
      return;
    }

    setLogoFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    setProfile(prev => ({ ...prev, logo: '' }));
  };

  const handleSaveProfile = () => {
    // Validate form data
    if (!profile.companyName || !profile.nationalId || !profile.ceoName || !profile.province || !profile.city || !profile.address) {
      toast.error('لطفاً فیلدهای ضروری را پر کنید');
      return;
    }

    // Here you would call the API to update profile and upload logo
    toast.success('پروفایل با موفقیت به‌روزرسانی شد');
    setIsEditing(false);
  };

  const handleFileUpload = (type: string) => {
    // Mock file upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.png';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast.success(`فایل ${type} آپلود شد`);
      }
    };
    input.click();
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          label: 'تایید شده',
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle,
          description: 'پروفایل شما تایید شده و می‌توانید از تمام خدمات استفاده کنید.'
        };
      case 'pending':
        return {
          label: 'در انتظار تایید',
          color: 'bg-yellow-100 text-yellow-800',
          icon: Clock,
          description: 'پروفایل شما در حال بررسی است. لطفاً منتظر بمانید.'
        };
      case 'incomplete':
        return {
          label: 'ناکامل',
          color: 'bg-red-100 text-red-800',
          icon: AlertCircle,
          description: 'برای تکمیل پروفایل، لطفاً اطلاعات مطلوبه را ارائه دهید.'
        };
      default:
        return {
          label: 'نامشخص',
          color: 'bg-gray-100 text-gray-800',
          icon: AlertCircle,
          description: ''
        };
    }
  };

  const statusInfo = getStatusInfo(profile.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">پروفایل شرکت</h1>
        <p className="text-muted-foreground">مدیریت اطلاعات و مدارک شرکت</p>
      </div>

      {/* Status Alert */}
      <Card className={`border-2 ${
        profile.status === 'approved' ? 'border-green-200 bg-green-50' :
        profile.status === 'pending' ? 'border-yellow-200 bg-yellow-50' :
        'border-red-200 bg-red-50'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-row-reverse">
            {profile.status === 'incomplete' && (
              <Button size="sm">
                تکمیل پروفایل
              </Button>
            )}
            <div className="flex-1 text-right">
              <div className="flex items-center gap-2 mb-1 justify-end flex-row-reverse">
                <Badge variant="secondary" className={statusInfo.color}>
                  {statusInfo.label}
                </Badge>
                <span className="font-medium">وضعیت پروفایل:</span>
              </div>
              <p className="text-sm">{statusInfo.description}</p>
            </div>
            <StatusIcon className={`w-5 h-5 ${
              profile.status === 'approved' ? 'text-green-600' :
              profile.status === 'pending' ? 'text-yellow-600' :
              'text-red-600'
            }`} />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="documents">مدارک و مجوزها</TabsTrigger>
          <TabsTrigger value="info">اطلاعات شرکت</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="text-right order-2">
                  <CardTitle>اطلاعات پایه شرکت</CardTitle>
                  <CardDescription>
                    اطلاعات عمومی و تماس شرکت
                  </CardDescription>
                </div>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => setIsEditing(!isEditing)}
                  className="order-1"
                >
                  {isEditing ? 'انصراف' : 'ویرایش'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6 flex-row-reverse">
                <div className="text-right">
                  <h3 className="text-lg font-semibold">{profile.companyName}</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">کد شرکت: CMP-{(user?.id || 1001).toString().padStart(6, '0')}</p>
                    <p className="text-sm text-muted-foreground">شناسه ملی: {profile.nationalId}</p>
                    <p className="text-sm text-muted-foreground">مدیرعامل: {profile.ceoName}</p>
                    <p className="text-sm text-muted-foreground">{profile.province} - {profile.city}</p>
                  </div>
                  <div className="flex gap-2 mt-2 flex-row-reverse">
                    {profile.profileType.map(type => (
                      <Badge key={type} variant="outline">
                        {profileTypes.find(pt => pt.id === type)?.label}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Avatar className="w-20 h-20">
                  <AvatarImage src={logoPreview || profile.logo} alt="لوگو شرکت" />
                  <AvatarFallback className="text-lg">
                    {(logoPreview || profile.logo) ? (
                      <img src={logoPreview || profile.logo} alt="لوگو شرکت" className="w-full h-full object-contain" />
                    ) : (
                      profile.companyName?.charAt(0) || 'ش'
                    )}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Logo Upload Section */}
              <div className="space-y-4">
                <Label className="text-right block">لوگو شرکت</Label>
                <div className="flex items-start gap-6 flex-row-reverse">
                  {/* Logo Preview */}
                  <div className="w-24 h-24 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center bg-muted/20">
                    {logoPreview || profile.logo ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={logoPreview || profile.logo} 
                          alt="لوگو شرکت" 
                          className="w-full h-full object-contain rounded-lg"
                        />
                        {isEditing && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -left-2 w-6 h-6 p-0 rounded-full"
                            onClick={handleRemoveLogo}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Image className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  
                  {/* Upload Controls */}
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-3 flex-row-reverse">
                      <input
                        type="file"
                        id="logo-upload"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        disabled={!isEditing}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                        disabled={!isEditing}
                        className="gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        {logoPreview || profile.logo ? 'تغییر لوگو' : 'آپلود لوگو'}
                      </Button>
                      {(logoPreview || profile.logo) && isEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveLogo}
                          className="gap-2 text-destructive hover:text-destructive-foreground"
                        >
                          <X className="w-4 h-4" />
                          حذف لوگو
                        </Button>
                      )}
                    </div>
                    
                    {/* File Requirements */}
                    <div className="text-xs text-muted-foreground space-y-1 text-right">
                      <p>• فرمت‌های پشتیبانی شده: JPG, PNG, GIF, WebP</p>
                      <p>• حداکثر حجم فایل: ۲ مگابایت</p>
                      <p>• ابعاد پیشنهادی: ۲۰۰×۲۰۰ پیکسل</p>
                      <p>• کیفیت بالا و پس‌زمینه شفاف ترجیح داده می‌شود</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />
              
              <div className="space-y-1">
                <h4 className="text-right">اطلاعات پایه</h4>
                <p className="text-sm text-muted-foreground text-right">مشخصات کلی و اطلاعات تماس شرکت</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-right block">نام شرکت *</Label>
                  <div className="relative">
                    <Building className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="companyName"
                      value={profile.companyName}
                      onChange={(e) => setProfile(prev => ({ ...prev, companyName: e.target.value }))}
                      disabled={!isEditing}
                      className="pr-10 text-right"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationalId" className="text-right block">شناسه ملی *</Label>
                  <Input
                    id="nationalId"
                    value={profile.nationalId}
                    onChange={(e) => setProfile(prev => ({ ...prev, nationalId: e.target.value }))}
                    disabled={!isEditing}
                    className="text-left"
                    dir="ltr"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ceoName" className="text-right block">نام مدیرعامل *</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="ceoName"
                      value={profile.ceoName}
                      onChange={(e) => setProfile(prev => ({ ...prev, ceoName: e.target.value }))}
                      disabled={!isEditing}
                      className="pr-10 text-right"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ceoMobile" className="text-right block">موبایل مدیرعامل *</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="ceoMobile"
                      value={profile.ceoMobile}
                      onChange={(e) => setProfile(prev => ({ ...prev, ceoMobile: e.target.value }))}
                      disabled={!isEditing}
                      className="pr-10 text-left"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landlinePhone" className="text-right block">تلفن ثابت</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="landlinePhone"
                      value={profile.landlinePhone}
                      onChange={(e) => setProfile(prev => ({ ...prev, landlinePhone: e.target.value }))}
                      disabled={!isEditing}
                      className="pr-10 text-left"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-right block">ایمیل *</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className="pr-10 text-left"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-right block">وب‌سایت</Label>
                  <Input
                    id="website"
                    value={profile.website}
                    onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                    disabled={!isEditing}
                    className="text-left"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="establishedYear" className="text-right block">سال تأسیس</Label>
                  <Input
                    id="establishedYear"
                    value={profile.establishedYear}
                    onChange={(e) => setProfile(prev => ({ ...prev, establishedYear: e.target.value }))}
                    disabled={!isEditing}
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employees" className="text-right block">تعداد کارکنان</Label>
                  <Select 
                    value={profile.employees}
                    onValueChange={(value) => setProfile(prev => ({ ...prev, employees: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="text-right">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">۱-۱۰ نفر</SelectItem>
                      <SelectItem value="11-20">۱۱-۲۰ نفر</SelectItem>
                      <SelectItem value="21-50">۲۱-۵۰ نفر</SelectItem>
                      <SelectItem value="51-100">۵۱-۱۰۰ نفر</SelectItem>
                      <SelectItem value="100+">بیش از ۱۰۰ نفر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="province" className="text-right block">استان *</Label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="province"
                      value={profile.province}
                      onChange={(e) => setProfile(prev => ({ ...prev, province: e.target.value }))}
                      disabled={!isEditing}
                      className="pr-10 text-right"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-right block">شهر *</Label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="city"
                      value={profile.city}
                      onChange={(e) => setProfile(prev => ({ ...prev, city: e.target.value }))}
                      disabled={!isEditing}
                      className="pr-10 text-right"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode" className="text-right block">کدپستی</Label>
                  <Input
                    id="postalCode"
                    value={profile.postalCode}
                    onChange={(e) => setProfile(prev => ({ ...prev, postalCode: e.target.value }))}
                    disabled={!isEditing}
                    className="text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-right block">آدرس کامل *</Label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-3 text-muted-foreground w-4 h-4" />
                  <Textarea
                    id="address"
                    value={profile.address}
                    onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                    disabled={!isEditing}
                    className="pr-10 text-right"
                    rows={3}
                    required
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile}>
                    <Save className="w-4 h-4 mr-2" />
                    ذخیره تغییرات
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader className="text-right">
              <CardTitle>مدارک و مجوزها</CardTitle>
              <CardDescription>
                آپلود و مدیریت مدارک قانونی شرکت
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business License */}
                <div className="space-y-3">
                  <Label className="text-right block">جواز کسب *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm font-medium">
                      {profile.licenses.businessLicense ? 'آپلود شده' : 'آپلود نشده'}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      فرمت: PDF, JPG, PNG - حداکثر ۵MB
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleFileUpload('جواز کسب')}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {profile.licenses.businessLicense ? 'تغییر فایل' : 'انتخاب فایل'}
                    </Button>
                  </div>
                  {profile.licenses.businessLicense && (
                    <div className="flex items-center gap-2 text-sm text-green-600 justify-end flex-row-reverse">
                      شماره: {profile.licenses.businessLicense}
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Technical License */}
                <div className="space-y-3">
                  <Label className="text-right block">مجوز فنی</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm font-medium">
                      {profile.licenses.technicalLicense ? 'آپلود شده' : 'آپلود نشده'}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      فرمت: PDF, JPG, PNG - حداکثر ۵MB
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleFileUpload('مجوز فنی')}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {profile.licenses.technicalLicense ? 'تغییر فایل' : 'انتخاب فایل'}
                    </Button>
                  </div>
                  {profile.licenses.technicalLicense && (
                    <div className="flex items-center gap-2 text-sm text-green-600 justify-end flex-row-reverse">
                      شماره: {profile.licenses.technicalLicense}
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Quality License */}
                <div className="space-y-3">
                  <Label className="text-right block">گواهی کیفیت</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm font-medium">
                      {profile.licenses.qualityLicense ? 'آپلود شده' : 'آپلود نشده'}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      فرمت: PDF, JPG, PNG - حداکثر ۵MB
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleFileUpload('گواهی کیفیت')}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {profile.licenses.qualityLicense ? 'تغییر فایل' : 'انتخاب فایل'}
                    </Button>
                  </div>
                  {profile.licenses.qualityLicense && (
                    <div className="flex items-center gap-2 text-sm text-green-600 justify-end flex-row-reverse">
                      شماره: {profile.licenses.qualityLicense}
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3 flex-row-reverse">
                  <div className="text-right">
                    <h4 className="font-medium text-blue-800">راهنمای آپلود مدارک</h4>
                    <ul className="text-sm text-blue-700 mt-1 space-y-1">
                      <li>• تمام مدارک باید واضح و قابل خواندن باشند</li>
                      <li>• فرمت‌های مجاز: PDF، JPG، PNG</li>
                      <li>• حداکثر حجم هر فایل: ۵ مگابایت</li>
                      <li>• مدارک باید معتبر و به‌روز باشند</li>
                    </ul>
                  </div>
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}