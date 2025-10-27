import React, { useState, useMemo } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { Checkbox } from '../ui/checkbox';
import { 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  QrCode,
  FileText,
  Package,
  RefreshCw,
  Ship
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useApi } from '../../hooks/useApi';
import QRCodeGenerator from '../common/QRCodeGenerator';
import AdvancedTable, { TableColumn } from '../common/AdvancedTable';
import { PersianDatePicker } from '../common/PersianDatePicker';

interface TechnicalSpec {
  name: string;
  type: 'text' | 'number' | 'list' | 'boolean';
  unit: string;
}

interface Category {
  id: string;
  name: string;
  parentId?: string;
  children?: Category[];
  technicalSpecs?: TechnicalSpec[];
}

interface Part {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  categoryId: string;
  categoryName: string;
  manufacturer: string;
  specifications: Record<string, any>;
  status: 'available' | 'sold' | 'installed' | 'maintenance';
  ownerId: string;
  ownerName: string;
  createdAt: string;
  qrCode: string;
}

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'موتور',
    technicalSpecs: [
      { name: 'قدرت', type: 'number', unit: 'HP' },
      { name: 'ولتاژ', type: 'number', unit: 'V' },
      { name: 'فرکانس', type: 'number', unit: 'Hz' },
      { name: 'دور در دقیقه', type: 'number', unit: 'RPM' },
      { name: 'نوع موتور', type: 'list', unit: 'AC/DC/سرو' }
    ],
    children: [
      { 
        id: '1-1', 
        name: 'موتور AC', 
        parentId: '1',
        technicalSpecs: [
          { name: 'قدرت', type: 'number', unit: 'HP' },
          { name: 'ولتاژ ورودی', type: 'number', unit: 'V' },
          { name: 'فرکانس', type: 'number', unit: 'Hz' },
          { name: 'نوع روتور', type: 'list', unit: 'قفسه سنجابی/حلقه‌ای' },
          { name: 'راندمان', type: 'number', unit: '%' }
        ]
      },
      { 
        id: '1-2', 
        name: 'موتور DC', 
        parentId: '1',
        technicalSpecs: [
          { name: 'قدرت', type: 'number', unit: 'HP' },
          { name: 'ولتاژ', type: 'number', unit: 'V' },
          { name: 'جریان', type: 'number', unit: 'A' },
          { name: 'نوع کموتاتور', type: 'list', unit: 'کربنی/مسی' },
          { name: 'مقاوم به آب', type: 'boolean', unit: 'بله/خیر' }
        ]
      },
      { 
        id: '1-3', 
        name: 'موتور گیربکس', 
        parentId: '1',
        technicalSpecs: [
          { name: 'قدرت', type: 'number', unit: 'HP' },
          { name: 'نسبت گیربکس', type: 'text', unit: 'نسبت' },
          { name: 'گشتاور خروجی', type: 'number', unit: 'Nm' },
          { name: 'نوع گیربکس', type: 'list', unit: 'چرخ دنده‌ای/کرمی' }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'کنترلر',
    technicalSpecs: [
      { name: 'قدرت', type: 'number', unit: 'KW' },
      { name: 'ولتاژ ورودی', type: 'number', unit: 'V' },
      { name: 'ولتاژ خروجی', type: 'number', unit: 'V' },
      { name: 'نوع ارتباط', type: 'list', unit: 'RS485/CAN/Ethernet' },
      { name: 'تنظیمات قابل برنامه‌ریزی', type: 'boolean', unit: 'بله/خیر' }
    ],
    children: [
      { 
        id: '2-1', 
        name: 'کنترلر فرکانس', 
        parentId: '2',
        technicalSpecs: [
          { name: 'قدرت', type: 'number', unit: 'KW' },
          { name: 'ولتاژ ورودی', type: 'number', unit: 'V' },
          { name: 'محدوده فرکانس', type: 'text', unit: 'Hz' },
          { name: 'نوع کنترل', type: 'list', unit: 'V/f/Vector/DTC' },
          { name: 'محافظت از موتور', type: 'boolean', unit: 'بله/خیر' }
        ]
      },
      { 
        id: '2-2', 
        name: 'کنترلر حرکت', 
        parentId: '2',
        technicalSpecs: [
          { name: 'تعداد محور', type: 'number', unit: 'محور' },
          { name: 'دقت موقعیت', type: 'number', unit: 'mm' },
          { name: 'سرعت حداکثر', type: 'number', unit: 'm/s' },
          { name: 'نوع انکودر', type: 'list', unit: 'افزایشی/مطلق' }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'کابل',
    technicalSpecs: [
      { name: 'قطر', type: 'number', unit: 'mm' },
      { name: 'ظرفیت جریان', type: 'number', unit: 'A' },
      { name: 'ولتاژ مجاز', type: 'number', unit: 'V' },
      { name: 'جنس', type: 'list', unit: 'مس/آلومینیوم/فولاد' },
      { name: 'عایق', type: 'list', unit: 'PVC/XLPE/EPR' }
    ],
    children: [
      { 
        id: '3-1', 
        name: 'کابل فولادی', 
        parentId: '3',
        technicalSpecs: [
          { name: 'قطر', type: 'number', unit: 'mm' },
          { name: 'استحکام شکست', type: 'number', unit: 'N' },
          { name: 'تعداد رشته', type: 'number', unit: 'رشته' },
          { name: 'پوشش', type: 'list', unit: 'گالوانیزه/استنلس/بدون' },
          { name: 'انعطاف‌پذیری', type: 'list', unit: 'نرم/سخت/نیمه‌نرم' }
        ]
      },
      { 
        id: '3-2', 
        name: 'کابل برق', 
        parentId: '3',
        technicalSpecs: [
          { name: 'مقطع', type: 'number', unit: 'mm²' },
          { name: 'تعداد رشته', type: 'number', unit: 'رشته' },
          { name: 'نوع عایق', type: 'list', unit: 'PVC/XLPE/EPR' },
          { name: 'ولتاژ مجاز', type: 'number', unit: 'V' },
          { name: 'مقاوم به حریق', type: 'boolean', unit: 'بله/خیر' }
        ]
      }
    ]
  }
];

const mockParts: Part[] = [
  {
    id: '1',
    name: 'موتور آسانسور AC',
    model: 'AC-2000',
    serialNumber: 'AC20001234',
    categoryId: '1-1',
    categoryName: 'موتور AC',
    manufacturer: 'شرکت موتور پارس',
    specifications: {
      power: '10HP',
      voltage: '380V',
      frequency: '50Hz',
      speed: '1450RPM'
    },
    status: 'available',
    ownerId: '1',
    ownerName: 'شرکت آسانسار تهران',
    createdAt: '۱۴۰۲/۰۹/۱۵',
    qrCode: 'QR123456'
  },
  {
    id: '2',
    name: 'کنترلر فرکانس VFD',
    model: 'VFD-500',
    serialNumber: 'VFD5005678',
    categoryId: '2-1',
    categoryName: 'کنترلر فرکانس',
    manufacturer: 'شرکت الکترونیک پیشرو',
    specifications: {
      power: '5.5KW',
      inputVoltage: '380V',
      outputVoltage: '0-380V',
      frequency: '0-50Hz'
    },
    status: 'installed',
    ownerId: '2',
    ownerName: 'شرکت نصب سریع',
    createdAt: '۱۴۰۲/۰۹/۱۲',
    qrCode: 'QR789012'
  }
];

const statusColors = {
  available: 'bg-green-100 text-green-800',
  sold: 'bg-blue-100 text-blue-800',
  installed: 'bg-purple-100 text-purple-800',
  maintenance: 'bg-yellow-100 text-yellow-800'
};

const statusLabels = {
  available: 'موجود',
  sold: 'فروخته شده',
  installed: 'نصب شده',
  maintenance: 'در تعمیر'
};

function Parts() {
  const [parts, setParts] = useState<Part[]>(mockParts);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getPartStats = () => {
    const stats = {
      total: parts.length,
      inStock: parts.filter(p => p.status === 'in_stock').length,
      inUse: parts.filter(p => p.status === 'in_use').length,
      broken: parts.filter(p => p.status === 'broken').length
    };
    return stats;
  };

  const stats = getPartStats();

  const handleDeletePart = (part: Part) => {
    if (confirm(`آیا از حذف ${part.name} اطمینان دارید؟`)) {
      setParts(prev => prev.filter(p => p.id !== part.id));
      toast.success(`${part.name} حذف شد`);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call to refresh data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset to original mock data (in real app, fetch from API)
      setParts(mockParts);
      setCategories(mockCategories);
      
      toast.success('داده‌ها با موفقیت به‌روزرسانی شد');
    } catch (error) {
      toast.error('خطا در به‌روزرسانی داده‌ها');
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatCategoryDisplay = (categoryId: string, categoryName: string) => {
    // پیدا کردن دسته‌بندی والد
    let parentCategory = null;
    
    // بررسی تمام دسته‌بندی‌ها
    for (const category of categories) {
      if (category.children) {
        const childCategory = category.children.find((child: Category) => child.id === categoryId);
        if (childCategory) {
          parentCategory = category;
          break;
        }
      }
    }
    
    // اگر دسته‌بندی والد پیدا شد، آن را هم نمایش بده
    if (parentCategory) {
      return `${parentCategory.name} / ${categoryName}`;
    }
    
    return categoryName;
  };

  const tableColumns: TableColumn<Part>[] = [
    {
      key: 'name',
      label: 'نام قطعه',
      sortable: true,
      render: (value, item) => (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-blue-600" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'model',
      label: 'مدل/سریال',
      sortable: true,
      render: (value, item) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">
            {item.serialNumber}
          </div>
        </div>
      )
    },
    {
      key: 'categoryName',
      label: 'دسته‌بندی',
      filterable: true,
      render: (value, item) => (
        <Badge variant="outline" className="text-xs">
          {formatCategoryDisplay(item.categoryId, value)}
        </Badge>
      )
    },
    {
      key: 'manufacturer',
      label: 'سازنده',
      sortable: true
    },
    {
      key: 'ownerName',
      label: 'مالک',
      sortable: true
    },
    {
      key: 'status',
      label: 'وضعیت',
      filterable: true,
      sortable: true,
      render: (value) => (
        <Badge 
          variant="secondary" 
          className={statusColors[value as keyof typeof statusColors]}
        >
          {statusLabels[value as keyof typeof statusLabels]}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      label: 'تاریخ ثبت',
      sortable: true
    },
    {
      key: 'actions',
      label: 'عملیات',
      render: (_, item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" style={{ direction: 'rtl' }}>
            <DropdownMenuItem 
              onClick={() => setSelectedPart(item)}
              style={{ textAlign: 'right', justifyContent: 'flex-end' }}
            >
              <Eye className="w-4 h-4 mr-2" />
              شناسنامه قطعه
            </DropdownMenuItem>
            <DropdownMenuItem style={{ textAlign: 'right', justifyContent: 'flex-end' }}>
              <Edit className="w-4 h-4 mr-2" />
              ویرایش
            </DropdownMenuItem>
            <DropdownMenuItem style={{ textAlign: 'right', justifyContent: 'flex-end' }}>
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleDeletePart(item)}
              className="text-destructive focus:text-destructive"
              style={{ textAlign: 'right', justifyContent: 'flex-end' }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              حذف
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">مدیریت قطعات</h1>
          <p className="text-muted-foreground">لیست و مدیریت تمامی قطعات سیستم</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 ml-2" />
                ثبت قطعه جدید
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh]" style={{ direction: 'rtl', textAlign: 'right' }}>
              <DialogHeader style={{ textAlign: 'right' }}>
                <DialogTitle style={{ textAlign: 'right' }}>ثبت قطعه جدید</DialogTitle>
                <DialogDescription style={{ textAlign: 'right' }}>
                  اطلاعات قطعه جدید را وارد کنید
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[calc(90vh-8rem)] overflow-auto" style={{ direction: 'rtl' }}>
                <CreatePartForm 
                  categories={categories}
                  onClose={() => setIsCreateModalOpen(false)} 
                />
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-xs text-muted-foreground">کل قطعات</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xl font-bold text-green-600">{stats.inStock}</p>
              <p className="text-xs text-muted-foreground">در انبار</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xl font-bold text-yellow-600">{stats.inUse}</p>
              <p className="text-xs text-muted-foreground">در استفاده</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xl font-bold text-red-600">{stats.broken}</p>
              <p className="text-xs text-muted-foreground">خراب</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <AdvancedTable
        data={parts}
        columns={tableColumns}
        searchable={true}
        filterable={true}
        exportable={true}
        pagination={true}
        pageSize={15}
        emptyMessage="قطعه‌ای یافت نشد"
        onRowClick={(part) => setSelectedPart(part)}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
      />

      {/* Part Details Modal */}
      {selectedPart && (
        <Dialog open={!!selectedPart} onOpenChange={() => setSelectedPart(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh]" style={{ direction: 'rtl', textAlign: 'right' }}>
            <DialogHeader style={{ textAlign: 'right' }}>
              <DialogTitle style={{ textAlign: 'right' }}>شناسنامه قطعه: {selectedPart.name}</DialogTitle>
              <DialogDescription style={{ textAlign: 'right' }}>
                مشاهده اطلاعات کامل و مشخصات فنی قطعه
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(90vh-8rem)] overflow-auto" style={{ direction: 'rtl' }}>
              <PartDetailsView part={selectedPart} />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Mock data for countries
const countries = [
  'ایران', 'آلمان', 'ایتالیا', 'ترکیه', 'چین', 'کره جنوبی', 'ژاپن', 'فنلاند', 'سوئد', 'سوئیس'
];

function CreatePartForm({ categories, onClose }: { categories: Category[]; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    serialNumber: '',
    categoryId: '',
    manufacturer: '',
    brand: '',
    price: '',
    productType: 'manufactured', // manufactured or imported
    manufacturerCountry: 'ایران', // پیش‌فرض برای محصولات تولیدی
    originCountry: '',
    productionDate: '',
    specifications: {} as Record<string, string>
  });

  // Batch registration states
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [batchQuantity, setBatchQuantity] = useState(1);
  const [serialNumbers, setSerialNumbers] = useState<string[]>(['']);

  // Import document states
  const [customsClearanceFile, setCustomsClearanceFile] = useState<File | null>(null);

  // Find selected category (check both parent categories and their children)
  const selectedCategory = useMemo(() => {
    if (!formData.categoryId) return null;
    
    // First check if it's a main category
    const mainCategory = categories.find(cat => cat.id === formData.categoryId);
    if (mainCategory) return mainCategory;
    
    // Then check if it's a child category
    for (const cat of categories) {
      if (cat.children) {
        const childCategory = cat.children.find(child => child.id === formData.categoryId);
        if (childCategory) return childCategory;
      }
    }
    return null;
  }, [formData.categoryId, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate customs clearance file for imported parts
    if (formData.productType === 'imported' && !customsClearanceFile) {
      toast.error('برای قطعات وارداتی، بارگذاری برگه سبز ترخیص کالا الزامی است');
      return;
    }
    
    if (isBatchMode) {
      // Validate serial numbers
      const emptySerials = serialNumbers.filter(serial => !serial.trim());
      if (emptySerials.length > 0) {
        toast.error('لطفاً تمام شماره‌های سریال را وارد کنید');
        return;
      }

      // Check for duplicate serial numbers
      const uniqueSerials = new Set(serialNumbers);
      if (uniqueSerials.size !== serialNumbers.length) {
        toast.error('شماره‌های سریال نمی‌توانند تکراری باشند');
        return;
      }

      toast.success(`${batchQuantity} قطعه ${formData.productType === 'imported' ? 'وارداتی' : 'تولیدی'} دسته‌ای ثبت شد`);
    } else {
      toast.success(`قطعه ${formData.productType === 'imported' ? 'وارداتی' : 'تولیدی'} جدید ثبت شد`);
    }
    
    onClose();
  };

  const handleCategoryChange = (categoryId: string) => {
    console.log('Category changed to:', categoryId);
    setFormData(prev => ({
      ...prev,
      categoryId,
      specifications: {} // Reset specifications when category changes
    }));
  };

  const handleSpecificationChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }));
  };

  // Handle batch mode toggle
  const handleBatchModeChange = (checked: boolean) => {
    setIsBatchMode(checked);
    if (checked) {
      setSerialNumbers(Array(batchQuantity).fill(''));
      setFormData(prev => ({ ...prev, serialNumber: '' })); // Clear single serial number
    } else {
      setSerialNumbers(['']);
      setBatchQuantity(1);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (quantity: number) => {
    setBatchQuantity(quantity);
    const newSerialNumbers = Array(quantity).fill('');
    // Preserve existing serial numbers
    for (let i = 0; i < Math.min(quantity, serialNumbers.length); i++) {
      newSerialNumbers[i] = serialNumbers[i] || '';
    }
    setSerialNumbers(newSerialNumbers);
  };

  // Handle serial number change for batch
  const handleSerialNumberChange = (index: number, value: string) => {
    setSerialNumbers(prev => {
      const newSerialNumbers = [...prev];
      newSerialNumbers[index] = value;
      return newSerialNumbers;
    });
  };

  // Handle customs clearance file upload
  const handleCustomsClearanceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (PDF, JPG, PNG)
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('فقط فایل‌های PDF، JPG و PNG مجاز هستند');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('حجم فایل نباید بیشتر از ۵ مگابایت باشد');
        return;
      }
      
      setCustomsClearanceFile(file);
      toast.success('فایل برگه سبز ترخیص کالا بارگذاری شد');
    }
  };

  // Handle product type change - reset customs file when changing from imported to manufactured
  const handleProductTypeChange = (value: string) => {
    setFormData(prev => {
      const newData = { ...prev, productType: value };
      
      // وقتی نوع قطعه تولیدی انتخاب شود، کشور سازنده را اتوماتیک روی ایران تنظیم کن
      if (value === 'manufactured') {
        newData.manufacturerCountry = 'ایران';
      } else if (value === 'imported') {
        // برای قطعات وارداتی، کشور سازنده را خالی کن تا کاربر انتخاب کند
        newData.manufacturerCountry = '';
      }
      
      return newData;
    });
    
    // Reset customs file if changing from imported to manufactured
    if (value === 'manufactured' && customsClearanceFile) {
      setCustomsClearanceFile(null);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Part Information */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-800 flex items-center gap-2 mb-4">
            📦 اطلاعات پایه قطعه
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-blue-700 flex items-center gap-2">
                📝 نام قطعه *
              </Label>
              <Input
                id="name"
                placeholder="نام قطع�� را وارد کنید"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white border-blue-300"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model" className="text-blue-700 flex items-center gap-2">
                🏷️ مدل *
              </Label>
              <Input
                id="model"
                placeholder="مدل قطعه"
                value={formData.model}
                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                className="bg-white border-blue-300"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="text-blue-700 flex items-center gap-2">
                📂 دسته‌بندی قطعه *
              </Label>
              <Select value={formData.categoryId} onValueChange={handleCategoryChange}>
                <SelectTrigger className="bg-white border-blue-300">
                  <SelectValue placeholder="انتخاب دسته‌بندی" />
                </SelectTrigger>
                <SelectContent>
                  {categories.flatMap(cat => 
                    cat.children ? cat.children.map(child => (
                      <SelectItem key={child.id} value={child.id}>
                        {child.name}
                      </SelectItem>
                    )) : [
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ]
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="manufacturer" className="text-blue-700 flex items-center gap-2">
                🏭 سازنده *
              </Label>
              <Input
                id="manufacturer"
                placeholder="نام سازنده"
                value={formData.manufacturer}
                onChange={(e) => setFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
                className="bg-white border-blue-300"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="brand" className="text-blue-700 flex items-center gap-2">
                🏢 برند
              </Label>
              <Input
                id="brand"
                placeholder="نام برند"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                className="bg-white border-blue-300"
              />
            </div>
          </div>
        </div>

        {/* Batch Registration Option */}
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-indigo-800 flex items-center gap-2">
              📊 نحوه ثبت قطعه
            </h3>
            <div className="flex items-center gap-3">
              <Label htmlFor="batch-mode" className="text-indigo-700 flex items-center gap-2">
                📦 ثبت دسته‌ای
              </Label>
              <Switch
                id="batch-mode"
                checked={isBatchMode}
                onCheckedChange={handleBatchModeChange}
              />
            </div>
          </div>

          {isBatchMode ? (
            <div className="space-y-4">
              <div className="bg-white p-3 rounded border border-indigo-300">
                <p className="text-indigo-700 mb-3 flex items-center gap-2">
                  ✨ حالت ثبت دسته‌ای فعال است
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-indigo-700 flex items-center gap-2">
                      🔢 تعداد قطعات *
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      max={50}
                      value={batchQuantity}
                      onChange={(e) => handleQuantityChange(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                      className="bg-white border-indigo-300 text-left"
                      dir="ltr"
                    />
                    <p className="text-xs text-indigo-600">
                      💡 حداکثر ۵۰ قطعه در هر بار
                    </p>
                  </div>
                </div>
              </div>

              {/* Serial Numbers Input */}
              <div className="bg-white p-3 rounded border border-indigo-300">
                <h4 className="font-medium text-indigo-800 mb-3 flex items-center gap-2">
                  🏷️ شماره‌های سریال قطعات
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                  {serialNumbers.map((serial, index) => (
                    <div key={index} className="space-y-1">
                      <Label className="text-indigo-700 text-sm">
                        قطعه {index + 1}
                      </Label>
                      <Input
                        placeholder={`Serial Number ${index + 1}`}
                        value={serial}
                        onChange={(e) => handleSerialNumberChange(index, e.target.value)}
                        className="bg-white border-indigo-300 text-left"
                        dir="ltr"
                        required
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-indigo-600 mt-2">
                  ⚠️ تمام شماره‌های سریال باید منحصر به فرد باشند
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-3 rounded border border-indigo-300">
              <div className="space-y-2">
                <Label htmlFor="serialNumber" className="text-indigo-700 flex items-center gap-2">
                  🔢 شماره سریال *
                </Label>
                <Input
                  id="serialNumber"
                  placeholder="Serial Number"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                  className="bg-white border-indigo-300 text-left"
                  dir="ltr"
                  required
                />
                <p className="text-xs text-indigo-600">
                  💡 برای ثبت چندین قطعه با مشخصات یکسان، حالت دسته‌ای را فعال کنید
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Price Information */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-medium text-green-800 flex items-center gap-2 mb-4">
            💰 اطلاعات قیمت
          </h3>
          <div className="space-y-2">
            <Label htmlFor="price" className="text-green-700 flex items-center gap-2">
              💵 قیمت (ریال)
            </Label>
            <Input
              id="price"
              type="number"
              placeholder="قیمت قطعه به ریال"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className="bg-white border-green-300 text-left"
              dir="ltr"
            />
            <p className="text-xs text-green-600">
              💡 در صورت عدم وارد کردن، قیمت به عنوان "تعیین نشده" ثبت خواهد شد
            </p>
          </div>
        </div>

        {/* Debug info */}
        {formData.categoryId && (
          <div className="bg-yellow-50 p-3 rounded border border-yellow-300">
            <p className="text-xs text-yellow-800">
              🐛 Debug: categoryId = {formData.categoryId}, selectedCategory = {selectedCategory?.name || 'null'}, 
              specs = {selectedCategory?.technicalSpecs?.length || 0}
            </p>
          </div>
        )}

        {/* Manufacturing/Import Information */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="font-medium text-purple-800 flex items-center gap-2 mb-4">
            🌍 اطلاعات تولید/واردات
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-purple-700 flex items-center gap-2">
                🏭 نوع قطعه *
              </Label>
              <Select value={formData.productType} onValueChange={handleProductTypeChange}>
                <SelectTrigger className="bg-white border-purple-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manufactured">🏭 تولیدی</SelectItem>
                  <SelectItem value="imported">🚢 وارداتی</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-purple-700 flex items-center gap-2">
                📅 {formData.productType === 'manufactured' ? 'تاریخ تولید' : 'تاریخ واردات'}
              </Label>
              <PersianDatePicker
                value={formData.productionDate}
                onChange={(date) => setFormData(prev => ({ ...prev, productionDate: date }))}
                placeholder={formData.productType === 'manufactured' ? 'انتخاب تاریخ تولید' : 'انتخاب تاریخ واردات'}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-purple-700 flex items-center gap-2">
                🏳️ کشور سازنده *
                {formData.productType === 'manufactured' && (
                  <span className="text-xs text-green-600">(اتوماتیک)</span>
                )}
              </Label>
              <Select 
                value={formData.manufacturerCountry} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, manufacturerCountry: value }))}
                disabled={formData.productType === 'manufactured'}
              >
                <SelectTrigger className={`bg-white border-purple-300 ${formData.productType === 'manufactured' ? 'opacity-75 cursor-not-allowed' : ''}`}>
                  <SelectValue placeholder={formData.productType === 'manufactured' ? 'ایران' : 'انتخاب کشور'} />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.productType === 'manufactured' && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  ✨ برای قطعات تولیدی، کشور سازنده اتوماتیک ایران انتخاب می‌شود
                </p>
              )}
            </div>
            
            {formData.productType === 'imported' && (
              <div className="space-y-2">
                <Label className="text-purple-700 flex items-center gap-2">
                  🌍 کشور مبدأ
                </Label>
                <Select value={formData.originCountry} onValueChange={(value) => setFormData(prev => ({ ...prev, originCountry: value }))}>
                  <SelectTrigger className="bg-white border-purple-300">
                    <SelectValue placeholder="انتخاب کشور مبدأ" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Import Documents Section */}
          {formData.productType === 'imported' && (
            <div className="mt-4 space-y-3">
              <div className="bg-orange-50 p-3 rounded border border-orange-300">
                <h4 className="font-medium text-orange-800 mb-3 flex items-center gap-2">
                  📄 مدارک واردات (الزامی)
                </h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-orange-700 flex items-center gap-2">
                      📋 برگه سبز ترخیص کالا *
                    </Label>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleCustomsClearanceFileChange}
                      className="bg-white border-orange-300"
                    />
                    {customsClearanceFile && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        ✅ فایل انتخاب شده: {customsClearanceFile.name}
                      </p>
                    )}
                    <p className="text-xs text-orange-600">
                      📎 فرمت‌های مجاز: PDF، JPG، PNG | حداکثر حجم: ۵ مگابایت
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Technical Specifications */}
        {selectedCategory && selectedCategory.technicalSpecs && selectedCategory.technicalSpecs.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-800 flex items-center gap-2 mb-4">
              ⚙️ مشخصات فنی ({selectedCategory.name})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedCategory.technicalSpecs.map(spec => (
                <div key={spec.name} className="space-y-2">
                  <Label className="text-gray-700 flex items-center gap-2">
                    🔧 {spec.name} {spec.unit && `(${spec.unit})`}
                  </Label>
                  {spec.type === 'list' ? (
                    <Select
                      value={formData.specifications[spec.name] || ''}
                      onValueChange={(value) => handleSpecificationChange(spec.name, value)}
                    >
                      <SelectTrigger className="bg-white border-gray-300">
                        <SelectValue placeholder={`انتخاب ${spec.name}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {spec.unit.split('/').map(option => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : spec.type === 'boolean' ? (
                    <Select
                      value={formData.specifications[spec.name] || ''}
                      onValueChange={(value) => handleSpecificationChange(spec.name, value)}
                    >
                      <SelectTrigger className="bg-white border-gray-300">
                        <SelectValue placeholder={`انتخاب ${spec.name}`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">بله</SelectItem>
                        <SelectItem value="false">خیر</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      type={spec.type === 'number' ? 'number' : 'text'}
                      placeholder={`وارد کردن ${spec.name}`}
                      value={formData.specifications[spec.name] || ''}
                      onChange={(e) => handleSpecificationChange(spec.name, e.target.value)}
                      className="bg-white border-gray-300"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            انصراف
          </Button>
          <Button
            type="submit"
            className="bg-black hover:bg-gray-800 text-white"
          >
            ثبت قطعه
          </Button>
        </div>
      </form>
    </div>
  );
}

function CategoryManagement({ categories, onSave, onClose }: { 
  categories: Category[]; 
  onSave: (categories: Category[]) => void; 
  onClose: () => void; 
}) {
  const [localCategories, setLocalCategories] = useState(categories);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  const handleAddCategory = (categoryData: { name: string; parentId?: string; technicalSpecs?: TechnicalSpec[] }) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: categoryData.name,
      parentId: categoryData.parentId,
      technicalSpecs: categoryData.technicalSpecs
    };

    if (categoryData.parentId) {
      setLocalCategories(prev => 
        prev.map(cat => {
          if (cat.id === categoryData.parentId) {
            return {
              ...cat,
              children: [...(cat.children || []), newCategory]
            };
          }
          return cat;
        })
      );
    } else {
      setLocalCategories(prev => [...prev, newCategory]);
    }

    setIsAddCategoryOpen(false);
    toast.success('دسته جدید اضافه شد');
  };

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between border-b pb-4">
        <h3 className="text-lg font-medium">لیست دسته‌بندی‌ها</h3>
        <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 ml-2" />
              افزودن دسته
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>افزودن دسته جدید</DialogTitle>
              <DialogDescription>
                دسته‌بندی جدید برای قطعات ایجاد کنید
              </DialogDescription>
            </DialogHeader>
            <AddCategoryForm 
              categories={localCategories}
              onSubmit={handleAddCategory}
              onClose={() => setIsAddCategoryOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="max-h-96 overflow-y-auto border rounded-lg p-4">
        {localCategories.map(category => (
          <div key={category.id} className="space-y-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <FolderTree className="w-4 h-4" />
                  <span className="font-medium text-right">{category.name}</span>
                </div>
              </div>
              {category.technicalSpecs && category.technicalSpecs.length > 0 && (
                <div className="mr-6 text-sm text-muted-foreground">
                  <div className="flex flex-wrap gap-2">
                    {category.technicalSpecs.map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec.name} ({spec.type}): {spec.unit}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {category.children && (
              <div className="mr-6">
                {category.children.map(child => (
                  <div key={child.id} className="space-y-1">
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <span className="text-right">{child.name}</span>
                    </div>
                    {child.technicalSpecs && child.technicalSpecs.length > 0 && (
                      <div className="mr-4 text-sm text-muted-foreground">
                        <div className="flex flex-wrap gap-2">
                          {child.technicalSpecs.map((spec, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {spec.name} ({spec.type}): {spec.unit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          انصراف
        </Button>
        <Button onClick={() => { onSave(localCategories); onClose(); }}>
          ذخیره تغییرات
        </Button>
      </div>
    </div>
  );
}

function AddCategoryForm({ 
  categories, 
  onSubmit, 
  onClose 
}: { 
  categories: Category[]; 
  onSubmit: (data: { name: string; parentId?: string; technicalSpecs?: TechnicalSpec[] }) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    parentId: 'none'
  });

  const [technicalSpecs, setTechnicalSpecs] = useState<Array<{ name: string; type: string; unit: string }>>([ 
    { name: '', type: 'text', unit: '' }
  ]);

  const addSpecRow = () => {
    setTechnicalSpecs(prev => [...prev, { name: '', type: 'text', unit: '' }]);
  };

  const removeSpecRow = (index: number) => {
    if (technicalSpecs.length > 1) {
      setTechnicalSpecs(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateSpecRow = (index: number, field: 'name' | 'type' | 'unit', value: string) => {
    setTechnicalSpecs(prev => 
      prev.map((spec, i) => 
        i === index ? { ...spec, [field]: value } : spec
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('نام دسته الزامی است');
      return;
    }

    // Filter out empty specs and convert to proper format
    const validSpecs: TechnicalSpec[] = technicalSpecs
      .filter(spec => spec.name.trim() && spec.unit.trim())
      .map(spec => ({
        name: spec.name.trim(),
        type: spec.type as 'text' | 'number' | 'list' | 'boolean',
        unit: spec.unit.trim()
      }));

    onSubmit({
      name: formData.name.trim(),
      parentId: formData.parentId === 'none' ? undefined : formData.parentId,
      technicalSpecs: validSpecs.length > 0 ? validSpecs : undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      <div className="space-y-2 text-right">
        <Label htmlFor="categoryName">نام دسته</Label>
        <Input
          id="categoryName"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="نام دسته‌بندی جدید..."
          required
        />
      </div>
      
      <div className="space-y-2 text-right">
        <Label htmlFor="parentCategory">دسته والد (اختیاری)</Label>
        <Select 
          value={formData.parentId} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, parentId: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="انتخاب دسته والد..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">بدون دسته والد (دسته اصلی)</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-right">مشخصات فنی (اختیاری)</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={addSpecRow}
          >
            <Plus className="w-4 h-4 ml-2" />
            افزودن مشخصه
          </Button>
        </div>
        
        <div className="space-y-3 max-h-60 overflow-y-auto border rounded-lg p-3">
          {technicalSpecs.map((spec, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="نام مشخصه (مثال: قدرت)"
                  value={spec.name}
                  onChange={(e) => updateSpecRow(index, 'name', e.target.value)}
                  className="flex-1"
                />
                {technicalSpecs.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSpecRow(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Select 
                  value={spec.type} 
                  onValueChange={(value) => updateSpecRow(index, 'type', value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="نوع مقدار..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">متنی</SelectItem>
                    <SelectItem value="number">عددی</SelectItem>
                    <SelectItem value="list">لیست انتخابی</SelectItem>
                    <SelectItem value="boolean">بله/خیر</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="واحد/مقدار (مثال: HP یا AC/DC)"
                  value={spec.unit}
                  onChange={(e) => updateSpecRow(index, 'unit', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-sm text-muted-foreground text-right">
          مشخصات فنی به عنوان الگویی برای قطعات این دسته استفاده می‌شود. نوع مقدار نحوه ورود داده را تعیین می‌کند.
        </p>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          انصراف
        </Button>
        <Button type="submit">
          افزودن دسته
        </Button>
      </div>
    </form>
  );
}

function PartDetailsView({ part }: { part: Part }) {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Tabs defaultValue="info" className="w-full" dir="rtl">
            <TabsList className="grid w-full grid-cols-2" dir="rtl">
              <TabsTrigger value="info" className="text-right">اطلاعات قطعه</TabsTrigger>
              <TabsTrigger value="history" className="text-right">تاریخچه</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-4" dir="rtl">
              <Card className="text-right">
                <CardHeader className="text-right">
                  <CardTitle className="text-lg text-right">اطلاعات کامل قطعه</CardTitle>
                </CardHeader>
                <CardContent className="text-right">
                  <div className="space-y-6 text-right">
                    <div className="text-right">
                      <h4 className="font-medium text-sm text-muted-foreground mb-3 text-right">اطلاعات پایه</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="text-right">
                          <Label className="text-sm font-medium text-muted-foreground text-right">نام قطعه:</Label>
                          <p className="mt-1 font-medium text-right">{part.name}</p>
                        </div>
                        <div className="text-right">
                          <Label className="text-sm font-medium text-muted-foreground text-right">مدل:</Label>
                          <p className="mt-1 font-medium text-right">{part.model}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:col-span-1" dir="rtl">
          <Card className="text-right">
            <CardHeader className="text-right">
              <CardTitle className="text-lg text-right">کد QR قطعه</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4 text-right">
              <QRCodeGenerator 
                data={`https://elevatorid.ieeu.ir/part/${part.serialNumber}`}
                title="کد QR قطعه"
                size={180}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Parts;