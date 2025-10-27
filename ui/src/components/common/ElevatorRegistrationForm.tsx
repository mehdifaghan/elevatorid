import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { PersianDatePicker } from './PersianDatePicker';
import ProvinceAndCitySelector from './ProvinceAndCitySelector';
import { toast } from 'sonner@2.0.3';
import { partsService } from '../../services/parts.service';
import { catalogService } from '../../services/catalog.service';
import { Part, Category } from '../../types/api';

// Types
interface ElevatorPart {
  id: string;
  partId: number; // Reference to actual Part from API
  partUid: string;
  title: string;
  category: string;
  categoryId: number;
  serialNumber: string;
  installationDate: string;
  warrantyDuration: string;
  notes?: string;
}

interface ElevatorFormData {
  buildingName: string;
  buildingType?: string;
  address: string;
  provinceId?: number;
  provinceName?: string;
  cityId?: number;
  cityName?: string;
  postalCode: string;
  municipalRegion: string;
  buildingPermit: string;
  registrationPlate: string;
  installationDate: string;
  elevatorType: 'passenger' | 'freight' | 'service';
  capacity: string;
  floors: string;
  description?: string;
  
  // Owner Information
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  ownerCompanyId?: string;
  
  // Manager Information (for user panel)
  managerName?: string;
  managerPhone?: string;
  managerCompany?: string;
  
  // Installer Information
  installerName?: string;
  installerPhone?: string;
  installerCompany?: string;
  installerLicense?: string;
  installerCompanyId?: string;
  
  // Parts Information
  parts: ElevatorPart[];
}

interface ElevatorRegistrationFormProps {
  onClose: () => void;
  onSubmit: (elevatorData: ElevatorFormData) => void;
  mode: 'admin' | 'user'; // Determines which fields to show
  title?: string;
}

const buildingTypes = [
  'مسکونی',
  'اداری', 
  'تجاری',
  'صنعتی',
  'بیمارستان',
  'هتل',
  'آموزشی',
  'مختلط'
];

const elevatorTypes = [
  { value: 'passenger', label: 'مسافربر' },
  { value: 'freight', label: 'باربر' },
  { value: 'service', label: 'خدماتی' }
];

const municipalRegions = [
  'منطقه 1', 'منطقه 2', 'منطقه 3', 'منطقه 4', 'منطقه 5', 'منطقه 6', 
  'منطقه 7', 'منطقه 8', 'منطقه 9', 'منطقه 10', 'منطقه 11', 'منطقه 12',
  'منطقه 13', 'منطقه 14', 'منطقه 15', 'منطقه 16', 'منطقه 17', 'منطقه 18',
  'منطقه 19', 'منطقه 20', 'منطقه 21', 'منطقه 22'
];

// Mock data for admin mode
const mockOwnerCompanies = [
  { id: '1', name: 'شرکت توسعه ساختمان پارس' },
  { id: '2', name: 'شرکت سرمایه‌گذاری آریا' },
  { id: '3', name: 'شرکت مدیریت مراکز تجاری رز' },
  { id: '4', name: 'شرکت ساختمانی نیاوران' }
];

const mockInstallerCompanies = [
  { id: '1', name: 'شرکت نصب تکنولوژی' },
  { id: '2', name: 'شرکت نصب سریع' },
  { id: '3', name: 'شرکت ماشین‌سازی آریا' },
  { id: '4', name: 'شرکت فناوری آسانسور پارس' }
];

// Category icons mapping
const categoryIcons: { [key: string]: string } = {
  'موتور': '🔧',
  'کنترل': '⚡',
  'ایمنی': '🛡️',
  'کابین': '🏠',
  'درب': '🚪',
  'کابل': '🔗',
  'مکانیکی': '⚙️',
  'الکترونیک': '💻',
  'هیدرولیک': '💧'
};

export default function ElevatorRegistrationForm({ 
  onClose, 
  onSubmit, 
  mode, 
  title = 'ثبت آسانسور جدید' 
}: ElevatorRegistrationFormProps) {
  const [formData, setFormData] = useState<ElevatorFormData>({
    buildingName: '',
    buildingType: mode === 'user' ? '' : undefined,
    address: '',
    provinceId: undefined,
    provinceName: '',
    cityId: undefined,
    cityName: '',
    postalCode: '',
    municipalRegion: '',
    buildingPermit: '',
    registrationPlate: '',
    installationDate: '',
    elevatorType: 'passenger',
    capacity: '',
    floors: '',
    description: '',
    
    // Owner fields - different handling for admin vs user
    ownerName: mode === 'user' ? '' : undefined,
    ownerPhone: mode === 'user' ? '' : undefined,
    ownerEmail: mode === 'user' ? '' : undefined,
    ownerCompanyId: mode === 'admin' ? '' : undefined,
    
    // Manager fields - only for user mode
    managerName: mode === 'user' ? '' : undefined,
    managerPhone: mode === 'user' ? '' : undefined,
    managerCompany: mode === 'user' ? '' : undefined,
    
    // Installer fields
    installerName: mode === 'user' ? '' : undefined,
    installerPhone: mode === 'user' ? '' : undefined,
    installerCompany: mode === 'user' ? '' : undefined,
    installerLicense: mode === 'user' ? '' : undefined,
    installerCompanyId: mode === 'admin' ? '' : undefined,
    
    // Parts
    parts: [],
  });

  // API Data state
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableParts, setAvailableParts] = useState<Part[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [filteredParts, setFilteredParts] = useState<Part[]>([]);
  const [partsLoading, setPartsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Parts management state
  const [selectedPartId, setSelectedPartId] = useState<number | null>(null);
  const [currentPartForm, setCurrentPartForm] = useState<Omit<ElevatorPart, 'id'>>({
    partId: 0,
    partUid: '',
    title: '',
    category: '',
    categoryId: 0,
    serialNumber: '',
    installationDate: '',
    warrantyDuration: '',
    notes: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = mode === 'user' ? 5 : 4;

  // Load categories and parts on component mount
  useEffect(() => {
    loadCategoriesAndParts();
  }, []);

  // Filter parts when category changes
  useEffect(() => {
    if (selectedCategory) {
      // فیلتر قطعات بر اساس دسته‌بندی و مالکیت شرکت
      const filtered = availableParts.filter(part => 
        part.categoryId === selectedCategory.id &&
        // فقط قطعات مالکیت شرکت (که در انبار شرکت موجود است)
        part.currentOwner?.type === 'company'
      );
      setFilteredParts(filtered);
    } else {
      setFilteredParts([]);
    }
  }, [selectedCategory, availableParts]);

  const loadCategoriesAndParts = async () => {
    try {
      setPartsLoading(true);
      
      // Load categories (flat structure)
      const categoriesResponse = await catalogService.getCategories(true);
      if (categoriesResponse.success && categoriesResponse.data) {
        // Handle both flat array and paginated response
        const categoriesData = Array.isArray(categoriesResponse.data) 
          ? categoriesResponse.data 
          : categoriesResponse.data.items || [];
        
        // Filter only active categories
        const activeCategories = categoriesData.filter(cat => cat.isActive);
        setCategories(activeCategories);
      }
      
      // Load available parts (parts owned by current company)
      const partsResponse = await partsService.getParts({
        size: 1000, // Load all available parts
        ownerType: 'company', // فقط قطعات مالکیت شرکت
      });
      
      if (partsResponse.success && partsResponse.data) {
        // Handle both paginated and direct array responses
        const partsData = partsResponse.data.items || partsResponse.data || [];
        let partsArray = Array.isArray(partsData) ? partsData : [];
        
        // اگر داده‌ها به صورت pagination response باشند
        if (!Array.isArray(partsData) && partsData.items) {
          partsArray = partsData.items || [];
        }
        
        // اعمال فیلتر اضافی برای اطمینان از مالکیت شرکت (در حالت mock احتیاطی است)
        const companyOwnedParts = partsArray.filter(part => 
          part.currentOwner?.type === 'company'
        );
        setAvailableParts(companyOwnedParts);
      }
      
    } catch (error) {
      console.error('Error loading categories and parts:', error);
      toast.error('خطا در بارگذاری دسته‌بندی‌ها و قطعات');
      // Set empty arrays as fallback
      setCategories([]);
      setAvailableParts([]);
    } finally {
      setPartsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // جلوگیری از ارسال مکرر
    if (submitLoading) return;
    
    try {
      setSubmitLoading(true);
      
      // Basic validation
      const requiredFields = [
        'buildingName', 'address', 'municipalRegion', 'elevatorType', 
        'capacity', 'floors', 'installationDate'
      ];
      
      if (mode === 'user') {
        requiredFields.push('buildingType', 'ownerName', 'ownerPhone');
      } else {
        requiredFields.push('ownerCompanyId', 'installerCompanyId');
      }
      
      // Add default values for required API fields
      if (!formData.buildingPermit) {
        setFormData(prev => ({ ...prev, buildingPermit: 'N/A' }));
      }
      if (!formData.registrationPlate) {
        setFormData(prev => ({ ...prev, registrationPlate: 'N/A' }));
      }
      if (!formData.postalCode) {
        setFormData(prev => ({ ...prev, postalCode: '0000000000' }));
      }
      
      const missingFields = requiredFields.filter(field => {
        const value = formData[field as keyof ElevatorFormData];
        return !value || (typeof value === 'string' && value.trim() === '');
      });
      
      if (missingFields.length > 0) {
        toast.error('لطفاً تمام فیلدهای ضروری را پر کنید');
        return;
      }
      
      if (!formData.installationDate) {
        toast.error('لطفاً تاریخ نصب را انتخاب کنید');
        return;
      }
      
      // بررسی انتخاب استان و شهر
      if (!formData.provinceId || !formData.cityId) {
        toast.error('لطفاً استان و شهر را انتخاب کنید');
        return;
      }
      
      // اعتبارسنجی شماره تلفن (برای حالت کاربر)
      if (mode === 'user' && formData.ownerPhone) {
        const phoneRegex = /^09\d{9}$/;
        if (!phoneRegex.test(formData.ownerPhone)) {
          toast.error('شماره تلفن باید با 09 شروع شده و 11 رقم باشد');
          return;
        }
      }
      
      // اعتبارسنجی کد پستی (اختیاری اما اگر وارد شده باشد باید معتبر باشد)
      if (formData.postalCode && formData.postalCode.length !== 10) {
        toast.error('کد پستی باید 10 رقم باشد');
        return;
      }
      
      await onSubmit(formData);
      
    } catch (error) {
      console.error('خطا در ثبت آسانسور:', error);
      toast.error('خطا در ثبت آسانسور. لطفاً دوباره تلاش کنید.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Parts management functions
  const addPart = () => {
    if (!selectedPartId || !currentPartForm.serialNumber) {
      toast.error('لطفاً قطعه و شماره سریال را وارد کنید');
      return;
    }

    const selectedPart = availableParts.find(p => p.id === selectedPartId);
    if (!selectedPart) {
      toast.error('قطعه انتخاب شده یافت نشد');
      return;
    }

    const newPart: ElevatorPart = {
      id: Date.now().toString(),
      partId: selectedPart.id,
      partUid: selectedPart.partUid,
      title: selectedPart.title,
      category: selectedCategory?.title || '',
      categoryId: selectedPart.categoryId,
      serialNumber: currentPartForm.serialNumber,
      installationDate: formData.installationDate || currentPartForm.installationDate,
      warrantyDuration: currentPartForm.warrantyDuration,
      notes: currentPartForm.notes
    };

    setFormData(prev => ({
      ...prev,
      parts: [...prev.parts, newPart]
    }));

    // Reset form
    setCurrentPartForm({
      partId: 0,
      partUid: '',
      title: '',
      category: '',
      categoryId: 0,
      serialNumber: '',
      installationDate: '',
      warrantyDuration: '',
      notes: ''
    });
    setSelectedPartId(null);
    
    toast.success(`قطعه ${selectedPart.title} اضافه شد`);
  };

  const removePart = (partId: string) => {
    setFormData(prev => ({
      ...prev,
      parts: prev.parts.filter(part => part.id !== partId)
    }));
    toast.success('قطعه حذف شد');
  };

  const selectPart = (part: Part) => {
    setSelectedPartId(part.id);
    setCurrentPartForm(prev => ({
      ...prev,
      partId: part.id,
      partUid: part.partUid,
      title: part.title,
      category: selectedCategory?.title || '',
      categoryId: part.categoryId
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-800 flex items-center gap-2 mb-4">
                🏢 اطلاعات ساختمان
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buildingName" className="text-blue-700">
                    نام ساختمان <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="buildingName"
                    placeholder="نام ساختمان را وارد کنید"
                    value={formData.buildingName}
                    onChange={(e) => setFormData(prev => ({ ...prev, buildingName: e.target.value }))}
                    className="bg-white border-blue-300"
                    required
                  />
                </div>

                {mode === 'user' && (
                  <div className="space-y-2">
                    <Label htmlFor="buildingType" className="text-blue-700">
                      نوع ساختمان <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={formData.buildingType || ''} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, buildingType: value }))}
                    >
                      <SelectTrigger className="bg-white border-blue-300">
                        <SelectValue placeholder="انتخاب کنید" />
                      </SelectTrigger>
                      <SelectContent>
                        {buildingTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="municipalRegion" className="text-blue-700">
                    منطقه شهرداری <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={formData.municipalRegion} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, municipalRegion: value }))}
                  >
                    <SelectTrigger className="bg-white border-blue-300">
                      <SelectValue placeholder="انتخاب منطقه" />
                    </SelectTrigger>
                    <SelectContent>
                      {municipalRegions.map(region => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="text-blue-700">
                    آدرس کامل <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="آدرس کامل ساختمان را وارد کنید"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="bg-white border-blue-300"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-blue-700">
                    استان و شهر <span className="text-red-500">*</span>
                  </Label>
                  <div className="p-3 bg-white border border-blue-300 rounded-md">
                    <ProvinceAndCitySelector
                      value={{
                        provinceId: formData.provinceId,
                        cityId: formData.cityId
                      }}
                      onChange={(selection) => setFormData(prev => ({
                        ...prev,
                        provinceId: selection.provinceId,
                        provinceName: selection.provinceName || '',
                        cityId: selection.cityId,
                        cityName: selection.cityName || ''
                      }))}
                      required={true}
                      layout="horizontal"
                      placeholder={{
                        province: 'استان را انتخاب کنید',
                        city: 'شهر را انتخاب کنید'
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode" className="text-blue-700">
                    کد پستی
                  </Label>
                  <Input
                    id="postalCode"
                    placeholder="کد پستی 10 رقمی"
                    value={formData.postalCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                    className="bg-white border-blue-300"
                    maxLength={10}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buildingPermit" className="text-blue-700">
                    شماره پروانه ساختمان
                  </Label>
                  <Input
                    id="buildingPermit"
                    placeholder="شماره پروانه ساختمان"
                    value={formData.buildingPermit}
                    onChange={(e) => setFormData(prev => ({ ...prev, buildingPermit: e.target.value }))}
                    className="bg-white border-blue-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationPlate" className="text-blue-700">
                    پلاک ثبتی
                  </Label>
                  <Input
                    id="registrationPlate"
                    placeholder="پلاک ثبتی"
                    value={formData.registrationPlate}
                    onChange={(e) => setFormData(prev => ({ ...prev, registrationPlate: e.target.value }))}
                    className="bg-white border-blue-300"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-medium text-green-800 flex items-center gap-2 mb-4">
                🏗️ مشخصات آسانسور
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="elevatorType" className="text-green-700">
                    نوع آسانسور <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={formData.elevatorType} 
                    onValueChange={(value: 'passenger' | 'freight' | 'service') => 
                      setFormData(prev => ({ ...prev, elevatorType: value }))
                    }
                  >
                    <SelectTrigger className="bg-white border-green-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {elevatorTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity" className="text-green-700">
                    ظرفیت (کیلوگرم) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="مثال: 630"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                    className="bg-white border-green-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="floors" className="text-green-700">
                    تعداد طبقات <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="floors"
                    type="number"
                    placeholder="تعداد طبقات"
                    value={formData.floors}
                    onChange={(e) => setFormData(prev => ({ ...prev, floors: e.target.value }))}
                    className="bg-white border-green-300"
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="installationDate" className="text-green-700">
                    تاریخ نصب <span className="text-red-500">*</span>
                  </Label>
                  <PersianDatePicker
                    value={formData.installationDate}
                    onChange={(date) => setFormData(prev => ({ ...prev, installationDate: date }))}
                    placeholder="انتخاب تاریخ"
                    className="bg-white border-green-300"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description" className="text-green-700">
                    توضیحات اضافی
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="توضیحات اضافی در مورد آسانسور..."
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-white border-green-300"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        if (mode === 'admin') {
          return (
            <div className="space-y-6">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-medium text-purple-800 flex items-center gap-2 mb-4">
                  👥 اطلاعات مالک و نصاب
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerCompanyId" className="text-purple-700">
                      شرکت مالک <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={formData.ownerCompanyId || ''} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, ownerCompanyId: value }))}
                    >
                      <SelectTrigger className="bg-white border-purple-300">
                        <SelectValue placeholder="انتخاب شرکت مالک" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockOwnerCompanies.map(company => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="installerCompanyId" className="text-purple-700">
                      شرکت نصاب <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={formData.installerCompanyId || ''} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, installerCompanyId: value }))}
                    >
                      <SelectTrigger className="bg-white border-purple-300">
                        <SelectValue placeholder="انتخاب شرکت نصاب" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockInstallerCompanies.map(company => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          );
        } else {
          // User mode - Owner information
          return (
            <div className="space-y-6">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-medium text-purple-800 flex items-center gap-2 mb-4">
                  👤 اطلاعات مالک
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerName" className="text-purple-700">
                      نام و نام خانوادگی مالک <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="ownerName"
                      placeholder="نام و نام خانوادگی"
                      value={formData.ownerName || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                      className="bg-white border-purple-300"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ownerPhone" className="text-purple-700">
                      شماره تماس مالک <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="ownerPhone"
                      placeholder="09xxxxxxxxx"
                      value={formData.ownerPhone || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, ownerPhone: e.target.value }))}
                      className="bg-white border-purple-300"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ownerEmail" className="text-purple-700">
                      ایمیل مالک
                    </Label>
                    <Input
                      id="ownerEmail"
                      type="email"
                      placeholder="example@domain.com"
                      value={formData.ownerEmail || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, ownerEmail: e.target.value }))}
                      className="bg-white border-purple-300"
                    />
                  </div>
                </div>

                <div className="border-t border-purple-200 pt-4 mt-4">
                  <h4 className="text-md font-medium text-purple-900 mb-4">اطلاعات مدیر ساختمان (اختیاری)</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="managerName" className="text-purple-700">
                        نام مدیر ساختمان
                      </Label>
                      <Input
                        id="managerName"
                        placeholder="نام و نام خانوادگی"
                        value={formData.managerName || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, managerName: e.target.value }))}
                        className="bg-white border-purple-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="managerPhone" className="text-purple-700">
                        شماره تماس مدیر
                      </Label>
                      <Input
                        id="managerPhone"
                        placeholder="09xxxxxxxxx"
                        value={formData.managerPhone || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, managerPhone: e.target.value }))}
                        className="bg-white border-purple-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="managerCompany" className="text-purple-700">
                        شرکت مدیریت
                      </Label>
                      <Input
                        id="managerCompany"
                        placeholder="نام شرکت مدیریت ساختمان"
                        value={formData.managerCompany || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, managerCompany: e.target.value }))}
                        className="bg-white border-purple-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

      case 4:
        if (mode === 'admin') {
          // Admin mode - Parts information
          return (
            <div className="space-y-6">
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <h3 className="font-medium text-indigo-800 flex items-center gap-2 mb-4">
                  🔩 قطعات آسانسور
                </h3>
                
                {/* Category Selection */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-indigo-700">انتخاب دسته‌بندی قطعه</Label>
                    {partsLoading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="text-sm text-gray-600 mt-2">در حال بارگذاری دسته‌بندی‌ها...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {categories.map(category => (
                          <div
                            key={category.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              selectedCategory?.id === category.id
                                ? 'bg-indigo-200 border-indigo-400 text-indigo-800'
                                : 'bg-white border-indigo-300 hover:bg-indigo-50'
                            }`}
                            onClick={() => setSelectedCategory(category)}
                          >
                            <div className="text-center">
                              <div className="text-2xl mb-1">{categoryIcons[category.title] || '📦'}</div>
                              <div className="text-sm font-medium">{category.title}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Available Parts from selected category */}
                  {selectedCategory && (
                    <div className="space-y-2">
                      <Label className="text-indigo-700">قطعات موجود در انبار شرکت:</Label>
                      <div className="text-xs text-gray-600 mb-2">
                        * فقط قطعاتی که در حال حاضر در مالکیت شرکت است نمایش داده می‌شود
                      </div>
                      {filteredParts.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                          قطعه‌ای در این دسته‌بندی یافت نشد
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                          {filteredParts.map(part => (
                            <div
                              key={part.id}
                              className={`p-3 rounded border cursor-pointer transition-colors ${
                                selectedPartId === part.id
                                  ? 'bg-indigo-200 border-indigo-400 text-indigo-800'
                                  : 'bg-white border-indigo-300 hover:bg-indigo-50'
                              }`}
                              onClick={() => selectPart(part)}
                            >
                              <div className="space-y-1">
                                <div className="font-medium text-sm">{part.title}</div>
                                <div className="text-xs text-gray-600">UID: {part.partUid}</div>
                                <div className="text-xs text-gray-500">کشور: {part.manufacturerCountry || 'نامشخص'}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Part Form */}
                  {selectedPartId && (
                    <div className="space-y-4 mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800">اطلاعات نصب قطعه</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-blue-700">قطعه انتخاب شده</Label>
                          <div className="p-2 bg-white rounded border border-blue-300">
                            <div className="font-medium">{currentPartForm.title}</div>
                            <div className="text-sm text-gray-600">UID: {currentPartForm.partUid}</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-blue-700">شماره سریال نصب شده *</Label>
                          <Input
                            placeholder="شماره سریال قطعه نصب شده"
                            value={currentPartForm.serialNumber}
                            onChange={(e) => setCurrentPartForm(prev => ({ ...prev, serialNumber: e.target.value }))}
                            className="bg-white border-blue-300"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-blue-700">مدت گارانتی (ماه)</Label>
                          <Input
                            type="number"
                            placeholder="24"
                            value={currentPartForm.warrantyDuration}
                            onChange={(e) => setCurrentPartForm(prev => ({ ...prev, warrantyDuration: e.target.value }))}
                            className="bg-white border-blue-300"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-blue-700">یادداشت‌ها</Label>
                          <Input
                            placeholder="توضیحات اضافی درباره نصب"
                            value={currentPartForm.notes}
                            onChange={(e) => setCurrentPartForm(prev => ({ ...prev, notes: e.target.value }))}
                            className="bg-white border-blue-300"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={addPart}
                      disabled={!selectedPartId || !currentPartForm.serialNumber}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      اضافه کردن قطعه
                    </Button>
                  </div>
                </div>

                {/* Added Parts List */}
                {formData.parts.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="font-medium text-indigo-800">قطعات اضافه شده:</h4>
                    <div className="space-y-2">
                      {formData.parts.map((part) => (
                        <div key={part.id} className="bg-white p-3 rounded-lg border border-indigo-300 flex justify-between items-center">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{part.title}</span>
                              <Badge variant="secondary" className="text-xs">
                                {categoryIcons[part.category] || '📦'} {part.category}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>UID قطعه: {part.partUid}</div>
                              <div>سریال نصب: {part.serialNumber}</div>
                              {part.warrantyDuration && (
                                <div>گارانتی: {part.warrantyDuration} ماه</div>
                              )}
                              {part.notes && (
                                <div className="text-gray-500">توضیحات: {part.notes}</div>
                              )}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removePart(part.id)}
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            حذف
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        } else {
          // User mode - Installer information
          return (
            <div className="space-y-6">
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h3 className="font-medium text-orange-800 flex items-center gap-2 mb-4">
                  🔧 اطلاعات نصاب
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="installerName" className="text-orange-700">
                      نام نصاب
                    </Label>
                    <Input
                      id="installerName"
                      placeholder="نام و نام خانوادگی نصاب"
                      value={formData.installerName || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, installerName: e.target.value }))}
                      className="bg-white border-orange-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="installerPhone" className="text-orange-700">
                      شماره تماس نصاب
                    </Label>
                    <Input
                      id="installerPhone"
                      placeholder="09xxxxxxxxx"
                      value={formData.installerPhone || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, installerPhone: e.target.value }))}
                      className="bg-white border-orange-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="installerCompany" className="text-orange-700">
                      شرکت نصاب
                    </Label>
                    <Input
                      id="installerCompany"
                      placeholder="نام شرکت نصب آسانسور"
                      value={formData.installerCompany || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, installerCompany: e.target.value }))}
                      className="bg-white border-orange-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="installerLicense" className="text-orange-700">
                      شماره مجوز نصاب
                    </Label>
                    <Input
                      id="installerLicense"
                      placeholder="شماره مجوز یا پروانه کار"
                      value={formData.installerLicense || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, installerLicense: e.target.value }))}
                      className="bg-white border-orange-300"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <h4 className="text-md font-medium text-blue-900 mb-2">خلاصه اطلاعات</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p><strong>ساختمان:</strong> {formData.buildingName} - {formData.buildingType}</p>
                    <p><strong>آسانسور:</strong> {formData.floors} طبقه، {formData.capacity} کیلوگرم</p>
                    <p><strong>مالک:</strong> {formData.ownerName} - {formData.ownerPhone}</p>
                    <p><strong>موقعیت:</strong> {formData.cityName}, {formData.provinceName}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        }

      case 5:
        // Only for user mode - Parts information
        return (
          <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h3 className="font-medium text-indigo-800 flex items-center gap-2 mb-4">
                🔩 قطعات آسانسور
              </h3>
              
              {/* Category Selection */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-indigo-700">انتخاب دسته‌بندی قطعه</Label>
                  {partsLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
                      <p className="text-sm text-gray-600 mt-2">در حال بارگذاری دسته‌بندی‌ها...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.map(category => (
                        <div
                          key={category.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedCategory?.id === category.id
                              ? 'bg-indigo-200 border-indigo-400 text-indigo-800'
                              : 'bg-white border-indigo-300 hover:bg-indigo-50'
                          }`}
                          onClick={() => setSelectedCategory(category)}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-1">{categoryIcons[category.title] || '📦'}</div>
                            <div className="text-sm font-medium">{category.title}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Available Parts from selected category */}
                {selectedCategory && (
                  <div className="space-y-2">
                    <Label className="text-indigo-700">قطعات موجود در انبار شرکت:</Label>
                    <div className="text-xs text-gray-600 mb-2">
                      * فقط قطعاتی که در حال حاضر در مالکیت شرکت است نمایش داده می‌شود
                    </div>
                    {filteredParts.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        قطعه‌ای در این دسته‌بندی یافت نشد
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                        {filteredParts.map(part => (
                          <div
                            key={part.id}
                            className={`p-3 rounded border cursor-pointer transition-colors ${
                              selectedPartId === part.id
                                ? 'bg-indigo-200 border-indigo-400 text-indigo-800'
                                : 'bg-white border-indigo-300 hover:bg-indigo-50'
                            }`}
                            onClick={() => selectPart(part)}
                          >
                            <div className="space-y-1">
                              <div className="font-medium text-sm">{part.title}</div>
                              <div className="text-xs text-gray-600">UID: {part.partUid}</div>
                              <div className="text-xs text-gray-500">کشور: {part.manufacturerCountry || 'نامشخص'}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Part Form */}
                {selectedPartId && (
                  <div className="space-y-4 mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800">اطلاعات نصب قطعه</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-blue-700">قطعه انتخاب شده</Label>
                        <div className="p-2 bg-white rounded border border-blue-300">
                          <div className="font-medium">{currentPartForm.title}</div>
                          <div className="text-sm text-gray-600">UID: {currentPartForm.partUid}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-blue-700">شماره سریال نصب شده *</Label>
                        <Input
                          placeholder="شماره سریال قطعه نصب شده"
                          value={currentPartForm.serialNumber}
                          onChange={(e) => setCurrentPartForm(prev => ({ ...prev, serialNumber: e.target.value }))}
                          className="bg-white border-blue-300"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-blue-700">مدت گارانتی (ماه)</Label>
                        <Input
                          type="number"
                          placeholder="24"
                          value={currentPartForm.warrantyDuration}
                          onChange={(e) => setCurrentPartForm(prev => ({ ...prev, warrantyDuration: e.target.value }))}
                          className="bg-white border-blue-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-blue-700">یادداشت‌ها</Label>
                        <Input
                          placeholder="توضیحات اضافی درباره نصب"
                          value={currentPartForm.notes}
                          onChange={(e) => setCurrentPartForm(prev => ({ ...prev, notes: e.target.value }))}
                          className="bg-white border-blue-300"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={addPart}
                    disabled={!selectedPartId || !currentPartForm.serialNumber}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    اضافه کردن قطعه
                  </Button>
                </div>
              </div>

              {/* Added Parts List */}
              {formData.parts.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="font-medium text-indigo-800">قطعات اضافه شده:</h4>
                  <div className="space-y-2">
                    {formData.parts.map((part) => (
                      <div key={part.id} className="bg-white p-3 rounded-lg border border-indigo-300 flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{part.title}</span>
                            <Badge variant="secondary" className="text-xs">
                              {categoryIcons[part.category] || '📦'} {part.category}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>UID قطعه: {part.partUid}</div>
                            <div>سریال نصب: {part.serialNumber}</div>
                            {part.warrantyDuration && (
                              <div>گارانتی: {part.warrantyDuration} ماه</div>
                            )}
                            {part.notes && (
                              <div className="text-gray-500">توضیحات: {part.notes}</div>
                            )}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removePart(part.id)}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          حذف
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Final Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <h4 className="text-md font-medium text-blue-900 mb-2">خلاصه اطلاعات</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>ساختمان:</strong> {formData.buildingName} - {formData.buildingType}</p>
                  <p><strong>آسانسور:</strong> {formData.floors} طبقه، {formData.capacity} کیلوگرم</p>
                  <p><strong>مالک:</strong> {formData.ownerName} - {formData.ownerPhone}</p>
                  <p><strong>موقعیت:</strong> {formData.cityName}, {formData.provinceName}</p>
                  <p><strong>تعداد قطعات:</strong> {formData.parts.length} قطعه</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-6" dir="rtl">
      {/* Progress Steps - only for multi-step modes */}
      {totalSteps > 1 && (
        <>
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step}
                  </div>
                  {step < totalSteps && (
                    <div
                      className={`h-1 w-16 mx-2 ${
                        step < currentStep ? 'bg-black' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Labels */}
          <div className={`grid grid-cols-${totalSteps} gap-4 text-center text-sm mb-6`}>
            <div className={currentStep >= 1 ? 'text-black font-medium' : 'text-gray-500'}>
              اطلاعات ساختمان
            </div>
            <div className={currentStep >= 2 ? 'text-black font-medium' : 'text-gray-500'}>
              مشخصات آسانسور
            </div>
            <div className={currentStep >= 3 ? 'text-black font-medium' : 'text-gray-500'}>
              {mode === 'admin' ? 'مالک و نصاب' : 'اطلاعات مالک'}
            </div>
            {mode === 'user' && (
              <>
                <div className={currentStep >= 4 ? 'text-black font-medium' : 'text-gray-500'}>
                  اطلاعات نصاب
                </div>
                <div className={currentStep >= 5 ? 'text-black font-medium' : 'text-gray-500'}>
                  قطعات آسانسور
                </div>
              </>
            )}
            {mode === 'admin' && (
              <div className={currentStep >= 4 ? 'text-black font-medium' : 'text-gray-500'}>
                قطعات آسانسور
              </div>
            )}
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              انصراف
            </Button>
            {currentStep > 1 && totalSteps > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                مرحله قبل
              </Button>
            )}
          </div>
          
          <div className="flex gap-3">
            {currentStep < totalSteps && totalSteps > 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="bg-black hover:bg-gray-800 text-white"
              >
                مرحله بعد
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={submitLoading}
                className="bg-black hover:bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    در حال ثبت...
                  </div>
                ) : (
                  'ثبت آسانسور'
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}