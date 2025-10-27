'use client';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { 
  Search, 
  ShoppingCart,
  Package,
  Building2,
  User,
  Phone,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { PersianDatePicker } from './PersianDatePicker';

// Mock data for available parts
const mockAvailableParts = [
  { id: 'P-001', name: 'موتور آسانسور 1000 کیلو', code: 'MOT-1000', serial: 'M-2024-001', category: 'موتور' },
  { id: 'P-002', name: 'کابل آسانسور 10 متری', code: 'CAB-010', serial: 'C-2024-002', category: 'کابل' },
  { id: 'P-003', name: 'کنترلر هوشمند', code: 'CTR-SMART', serial: 'CT-2024-003', category: 'کنترلر' },
  { id: 'P-004', name: 'درب آسانسور طلایی', code: 'DOOR-GOLD', serial: 'D-2024-004', category: 'درب' },
  { id: 'P-005', name: 'دکمه‌های کابین', code: 'BTN-CABIN', serial: 'B-2024-005', category: 'دکمه' },
  { id: 'P-006', name: 'ریل راهنما', code: 'RAIL-GUIDE', serial: 'R-2024-006', category: 'ریل' },
  { id: 'P-007', name: 'موتور چرخ دنده', code: 'MOT-GEAR', serial: 'MG-2024-007', category: 'موتور' },
  { id: 'P-008', name: 'سنسور طبقه', code: 'SENS-FLOOR', serial: 'S-2024-008', category: 'سنسور' }
];

interface SellModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedPart?: any; // For Products component usage
  title?: string;
  description?: string;
}

export default function SellModal({ 
  isOpen, 
  onClose, 
  preSelectedPart, 
  title = "فروش قطعه",
  description = "انجام فرآیند فروش قطعه"
}: SellModalProps) {
  // Part selection states
  const [selectedPart, setSelectedPart] = useState<any>(preSelectedPart || null);
  const [partSearchTerm, setPartSearchTerm] = useState('');
  
  // Company and buyer info states
  const [companySearchTerm, setCompanySearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedCompanyData, setSelectedCompanyData] = useState<any>(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [saleDate, setSaleDate] = useState('');
  const [notes, setNotes] = useState('');
  

  
  // CEO OTP verification states
  const [ceoOtp, setCeoOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Filter available parts based on search term
  const filteredParts = mockAvailableParts.filter(part => 
    partSearchTerm === '' || 
    part.name.toLowerCase().includes(partSearchTerm.toLowerCase()) ||
    part.code.toLowerCase().includes(partSearchTerm.toLowerCase()) ||
    part.serial.toLowerCase().includes(partSearchTerm.toLowerCase())
  );

  // Mock companies data with complete profiles
  const mockCompanies = [
    { 
      id: 'CMP-001', 
      name: 'شرکت نصب سریع', 
      code: 'CMP-001',
      contactPerson: 'احمد محمدی',
      phone: '09123456789',
      address: 'تهران، خیابان ولیعصر، پلاک 123',
      ceos: [
        { id: 'CEO-001-1', name: 'علی احمدی', phone: '09111111111' },
        { id: 'CEO-001-2', name: 'سارا محمدی', phone: '09222222222' }
      ]
    },
    { 
      id: 'CMP-002', 
      name: 'شرکت قطعات پارس', 
      code: 'CMP-002',
      contactPerson: 'رضا حسینی',
      phone: '09987654321',
      address: 'اصفهان، خیابان چهارباغ، پلاک 456',
      ceos: [
        { id: 'CEO-002-1', name: 'مهدی رضایی', phone: '09333333333' }
      ]
    },
    { 
      id: 'CMP-003', 
      name: 'شرکت مونتاژ امین', 
      code: 'CMP-003',
      contactPerson: 'فاطمه زارعی',
      phone: '09876543210',
      address: 'شیراز، خیابان کریم‌خان، پلاک 789',
      ceos: [
        { id: 'CEO-003-1', name: 'امین زارعی', phone: '09444444444' },
        { id: 'CEO-003-2', name: 'نازنین احمدی', phone: '09555555555' }
      ]
    },
    { 
      id: 'CMP-004', 
      name: 'شرکت آسانسار مدرن', 
      code: 'CMP-004',
      contactPerson: 'حسن مرادی',
      phone: '09765432109',
      address: 'مشهد، خیابان امام رضا، پلاک 321',
      ceos: [
        { id: 'CEO-004-1', name: 'حسن مرادی', phone: '09666666666' }
      ]
    },
    { 
      id: 'CMP-005', 
      name: 'شرکت تعمیرات سریع', 
      code: 'CMP-005',
      contactPerson: 'زهرا کریمی',
      phone: '09654321098',
      address: 'تبریز، خیابان ارک، پلاک 654',
      ceos: [
        { id: 'CEO-005-1', name: 'مجید کریمی', phone: '09777777777' },
        { id: 'CEO-005-2', name: 'زهرا کریمی', phone: '09888888888' },
        { id: 'CEO-005-3', name: 'پوریا احمدی', phone: '09999999999' }
      ]
    }
  ];

  // Mock seller company profile (current user's company)
  const mockSellerCompany = {
    id: 'SELLER-001',
    name: 'شرکت ما (فروشنده)',
    code: 'SELLER-001',
    ceo: {
      id: 'SELLER-CEO-1', 
      name: 'محمد رضا احمدی', 
      phone: '09101010101'
    }
  };

  // Handle company selection and auto-fill buyer info
  const handleCompanySelection = (companyId: string) => {
    setSelectedCompany(companyId);
    const company = mockCompanies.find(c => c.id === companyId);
    if (company) {
      setSelectedCompanyData(company);
      setBuyerName(company.contactPerson);
      setBuyerPhone(company.phone);
      setBuyerAddress(company.address);
    } else {
      setSelectedCompanyData(null);
      setBuyerName('');
      setBuyerPhone('');
      setBuyerAddress('');
    }
  };



  // Handle OTP sending for CEO approval
  const handleSendOtp = () => {
    if (!selectedPart) {
      toast.error('ابتدا قطعه‌ای را انتخاب کنید');
      return;
    }
    
    // Mock OTP sending to seller's CEO
    setIsOtpSent(true);
    toast.success(`🔐 کد تایید به شماره ${mockSellerCompany.ceo.phone} (${mockSellerCompany.ceo.name}) ارسال شد`);
  };

  // Handle form reset
  const resetForm = () => {
    if (!preSelectedPart) {
      setSelectedPart(null);
      setPartSearchTerm('');
    }
    setCompanySearchTerm('');
    setSelectedCompany('');
    setSelectedCompanyData(null);
    setBuyerName('');
    setBuyerPhone('');
    setBuyerAddress('');
    setSalePrice('');
    setSaleDate('');
    setNotes('');
    setCeoOtp('');
    setIsOtpSent(false);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!selectedPart) {
      toast.error('لطفاً ابتدا قطعه‌ای را انتخاب کنید');
      return;
    }
    
    if (!isOtpSent || ceoOtp.length !== 6) {
      toast.error('لطفاً کد تایید مدیرعامل را وارد کنید');
      return;
    }
    
    toast.success(
      `✅ فروش قطعه ${selectedPart.name} با تایید ${mockSellerCompany.ceo.name} ثبت شد`
    );
    resetForm();
    onClose();
  };

  // Handle modal close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" dir="rtl">
        <DialogHeader className="text-right flex-shrink-0">
          <DialogTitle className="text-right flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-green-600" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-right">
            {preSelectedPart ? `${description} ${preSelectedPart.name}` : description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4 overflow-y-auto flex-1 px-1">
          {/* Part Selection - only show if no preselected part */}
          {!preSelectedPart && (
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Package className="w-4 h-4" />
                انتخاب قطعه
              </label>
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="جستجو بر اساس نام، کد یا شماره سریال قطعه..."
                    value={partSearchTerm}
                    onChange={(e) => setPartSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <Select value={selectedPart?.id || ''} onValueChange={(value) => {
                  const part = mockAvailableParts.find(p => p.id === value);
                  setSelectedPart(part || null);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب قطعه برای فروش" />
                  </SelectTrigger>
                  <SelectContent dir="rtl" className="max-h-60">
                    {filteredParts.map((part) => (
                      <SelectItem key={part.id} value={part.id}>
                        <div className="flex flex-col items-start w-full gap-1">
                          <div className="flex justify-between items-center w-full">
                            <span className="font-medium">{part.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {part.category}
                            </Badge>
                          </div>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>کد: {part.code}</span>
                            <span>سریال: {part.serial}</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                    {filteredParts.length === 0 && (
                      <div className="p-2 text-center text-muted-foreground text-sm">
                        قطعه‌ای با این مشخصات یافت نشد
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Selected Part Info */}
          {selectedPart && (
            <div className="bg-blue-50 p-4 rounded-lg border">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600" />
                اطلاعات قطعه انتخاب شده
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">نام قطعه:</span>
                  <span className="font-medium">{selectedPart.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">کد قطعه:</span>
                  <span className="font-medium font-mono">{selectedPart.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">شماره سریال:</span>
                  <span className="font-medium font-mono">{selectedPart.serial}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">دسته‌بندی:</span>
                  <span className="font-medium">{selectedPart.category}</span>
                </div>
              </div>
            </div>
          )}

          {/* Company Search and Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              شرکت خریدار
            </label>
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="جستجو بر اساس نام یا کد شرکت..."
                  value={companySearchTerm}
                  onChange={(e) => setCompanySearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={selectedCompany} onValueChange={handleCompanySelection}>
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب شرکت خریدار" />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  {mockCompanies.filter(company => 
                    companySearchTerm === '' || 
                    company.name.toLowerCase().includes(companySearchTerm.toLowerCase()) ||
                    company.code.toLowerCase().includes(companySearchTerm.toLowerCase())
                  ).map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      <div className="flex flex-col items-start w-full gap-1">
                        <div className="flex justify-between items-center w-full">
                          <span className="font-medium">{company.name}</span>
                          <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                            {company.code}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          📞 {company.phone} | 👤 {company.contactPerson}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Auto-filled Buyer Info */}
          {selectedCompanyData && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-medium mb-3 flex items-center gap-2 text-green-800">
                ✅ اطلاعات خریدار (از پروفایل شرکت)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-green-700">
                    <User className="w-4 h-4" />
                    نام مسئول خرید
                  </label>
                  <Input 
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="bg-white border-green-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-green-700">
                    <Phone className="w-4 h-4" />
                    شماره تماس
                  </label>
                  <Input 
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="bg-white border-green-300"
                  />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <label className="text-sm font-medium flex items-center gap-2 text-green-700">
                  <MapPin className="w-4 h-4" />
                  آدرس شرکت
                </label>
                <Input 
                  value={buyerAddress}
                  onChange={(e) => setBuyerAddress(e.target.value)}
                  className="bg-white border-green-300"
                />
              </div>
              <p className="text-xs text-green-600 mt-2">
                💡 این اطلاعات از پروفایل شرکت خریدار بارگذاری شده و قابل ویرایش است
              </p>
            </div>
          )}

          {/* Manual Buyer Info (when no company selected) */}
          {!selectedCompanyData && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  نام خریدار
                </label>
                <Input 
                  placeholder="ابتدا شرکت خریدار را انتخاب کنید" 
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  شماره تماس
                </label>
                <Input 
                  placeholder="ابتدا شرکت خریدار را انتخاب کنید" 
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  disabled
                />
              </div>
            </div>
          )}

          {/* Manual Address (when no company selected) */}
          {!selectedCompanyData && (
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                آدرس
              </label>
              <Input 
                placeholder="ابتدا شرکت خریدار را انتخاب کنید" 
                value={buyerAddress}
                onChange={(e) => setBuyerAddress(e.target.value)}
                disabled
              />
            </div>
          )}

          {/* Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">قیمت فروش (تومان)</label>
              <Input 
                placeholder="مبلغ به تومان" 
                type="number" 
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">تاریخ فروش</label>
              <PersianDatePicker
                value={saleDate}
                onChange={setSaleDate}
                placeholder="انتخاب تاریخ فروش"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">یادداشت</label>
            <Input 
              placeholder="توضیحات اضافی (اختیاری)" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>



          {/* CEO OTP Verification */}
          <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-yellow-800 flex items-center gap-2">
                    🔐 تایید مدیرعامل شرکت فروشنده
                  </h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    کد تایید به شماره <span className="font-mono">{mockSellerCompany.ceo.phone}</span> (<strong>{mockSellerCompany.ceo.name}</strong>) ارسال خواهد شد
                  </p>
                </div>
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSendOtp}
                  disabled={!selectedPart || isOtpSent}
                  className="border-yellow-600 text-yellow-700 hover:bg-yellow-100"
                >
                  {isOtpSent ? '✅ کد ارسال شد' : '📤 ارسال کد تایید'}
                </Button>
              </div>
              
              {isOtpSent && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-yellow-800">
                    کد تایید ۶ رقمی ارسال شده به {mockSellerCompany.ceo.name}
                  </label>
                  <div className="flex justify-center">
                    <InputOTP
                      value={ceoOtp}
                      onChange={setCeoOtp}
                      maxLength={6}
                      dir="ltr"
                    >
                      <InputOTPGroup className="gap-1.5 sm:gap-2">
                        <InputOTPSlot index={0} className="w-9 h-11 sm:w-11 sm:h-13 text-base sm:text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                        <InputOTPSlot index={1} className="w-9 h-11 sm:w-11 sm:h-13 text-base sm:text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                        <InputOTPSlot index={2} className="w-9 h-11 sm:w-11 sm:h-13 text-base sm:text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                        <InputOTPSlot index={3} className="w-9 h-11 sm:w-11 sm:h-13 text-base sm:text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                        <InputOTPSlot index={4} className="w-9 h-11 sm:w-11 sm:h-13 text-base sm:text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                        <InputOTPSlot index={5} className="w-9 h-11 sm:w-11 sm:h-13 text-base sm:text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <p className="text-xs text-yellow-600 text-center">
                    کد تایید به شماره <span className="font-mono">{mockSellerCompany.ceo.phone}</span> ارسال شده است
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Action Buttons - Fixed at bottom */}
        <div className="flex gap-3 justify-end pt-4 border-t bg-white sticky bottom-0 flex-shrink-0">
          <Button
            variant="outline"
            onClick={handleClose}
          >
            انصراف
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!selectedPart || !isOtpSent || ceoOtp.length !== 6}
            onClick={handleSubmit}
          >
            {!selectedPart ? 'انتخاب قطعه' : 
             !isOtpSent ? 'ارسال کد تایید' : 
             ceoOtp.length !== 6 ? 'وارد کردن کد تایید' : 
             '✅ ثبت فروش'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}