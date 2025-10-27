import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { Checkbox } from '../ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import SellModal from '../common/SellModal';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  ShoppingCart,
  Package,
  QrCode,
  FileText,
  Ship,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import QRCodeGenerator from '../common/QRCodeGenerator';
import { PersianDatePicker } from '../common/PersianDatePicker';

interface Product {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  categoryId: string;
  categoryName: string;
  manufacturer: string;
  specifications: Record<string, any>;
  status: 'available' | 'sold' | 'reserved';
  createdAt: string;
  price?: number;
  productType?: 'manufactured' | 'imported';
}

const mockProducts: Product[] = [
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
    createdAt: '۱۴۰۲/۰۹/۱۵',
    price: 25000000,
    productType: 'manufactured'
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
    status: 'sold',
    createdAt: '۱۴۰۲/۰۹/۱۲',
    price: 18000000,
    productType: 'manufactured'
  },
  // Batch registered products (same specs, different serials)
  {
    id: '3',
    name: 'کابل آسانسور سه فاز',
    model: 'CABLE-3P-10',
    serialNumber: 'CAB3P001',
    categoryId: '3-1',
    categoryName: 'کابل',
    manufacturer: 'شرکت کابل ایران',
    specifications: {
      wireCount: '10',
      crossSection: '2.5mm²',
      insulationType: 'PVC',
      length: '100متر'
    },
    status: 'available',
    createdAt: '۱۴۰۲/۰۹/۱۰',
    price: 5000000,
    productType: 'manufactured'
  },
  {
    id: '4',
    name: 'کابل آسانسور سه فاز',
    model: 'CABLE-3P-10',
    serialNumber: 'CAB3P002',
    categoryId: '3-1',
    categoryName: 'کابل',
    manufacturer: 'شرکت کابل ایران',
    specifications: {
      wireCount: '10',
      crossSection: '2.5mm²',
      insulationType: 'PVC',
      length: '100متر'
    },
    status: 'available',
    createdAt: '۱۴۰۲/۰۹/۱۰',
    price: 5000000,
    productType: 'manufactured'
  },
  {
    id: '5',
    name: 'کابل آسانسور سه فاز',
    model: 'CABLE-3P-10',
    serialNumber: 'CAB3P003',
    categoryId: '3-1',
    categoryName: 'کابل',
    manufacturer: 'شرکت کابل ایران',
    specifications: {
      wireCount: '10',
      crossSection: '2.5mm²',
      insulationType: 'PVC',
      length: '100متر'
    },
    status: 'reserved',
    createdAt: '۱۴۰۲/۰۹/۱۰',
    price: 5000000,
    productType: 'manufactured'
  },
  // Imported product sample
  {
    id: '6',
    name: 'اینکودر اتیس',
    model: 'OTIS-ENC-2024',
    serialNumber: 'OTIS24001',
    categoryId: '2-1',
    categoryName: 'کنترلر فرکانس',
    manufacturer: 'OTIS Elevator Co.',
    specifications: {
      resolution: '1024 PPR',
      voltage: '24V DC',
      outputType: 'Incremental',
      ipRating: 'IP67'
    },
    status: 'available',
    createdAt: '۱۴۰۲/۰۹/۰۸',
    price: 35000000,
    productType: 'imported'
  }
];

const statusColors = {
  available: 'bg-green-100 text-green-800',
  sold: 'bg-blue-100 text-blue-800',
  reserved: 'bg-yellow-100 text-yellow-800'
};

const statusLabels = {
  available: 'موجود',
  sold: 'فروخته شده',
  reserved: 'رزرو شده'
};

const mockCompanies = [
  { id: '1', name: 'شرکت آسانسار تهران' },
  { id: '2', name: 'شرکت نصب سریع' },
  { id: '3', name: 'شرکت مونتاژ امین' }
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getProductStats = () => {
    const stats = {
      total: products.length,
      available: products.filter(p => p.status === 'available').length,
      sold: products.filter(p => p.status === 'sold').length,
      installing: products.filter(p => p.status === 'installing').length,
      delivered: products.filter(p => p.status === 'delivered').length
    };
    return stats;
  };

  const stats = getProductStats();
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  // Function to identify batch products (products with same name, model, and specs)
  const getBatchInfo = (product: Product) => {
    const batchProducts = products.filter(p => 
      p.name === product.name && 
      p.model === product.model && 
      p.manufacturer === product.manufacturer &&
      JSON.stringify(p.specifications) === JSON.stringify(product.specifications)
    );
    
    if (batchProducts.length > 1) {
      const currentIndex = batchProducts.findIndex(p => p.id === product.id);
      return {
        isBatch: true,
        batchSize: batchProducts.length,
        batchIndex: currentIndex + 1
      };
    }
    
    return { isBatch: false, batchSize: 1, batchIndex: 1 };
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDeleteProduct = (product: Product) => {
    if (confirm(`آیا از حذف ${product.name} اطمینان دارید؟`)) {
      setProducts(prev => prev.filter(p => p.id !== product.id));
      toast.success(`${product.name} حذف شد`);
    }
  };

  const handleSellProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsSellModalOpen(true);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Reset products to original mock data (in real app, this would fetch from API)
      setProducts(mockProducts);
      toast.success('لیست محصولات به‌روزرسانی شد');
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">مدیریت محصولات</h1>
          <p className="text-muted-foreground">قطعات و محصولات در مالکیت شما</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 ml-2" />
              ثبت محصول جدید
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader className="text-right" dir="rtl">
              <DialogTitle className="text-right">ثبت محصول جدید</DialogTitle>
              <DialogDescription className="text-right">
                اطلاعات محصول جدید را وارد کنید. برای ثبت چندین محصول با مشخصات یکسان، حالت دسته‌ای را فعال کنید.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(90vh-8rem)] overflow-auto">
              <CreateProductForm onClose={() => setIsCreateModalOpen(false)} />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-xs text-muted-foreground">کل محصولات</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xl font-bold text-green-600">{stats.available}</p>
              <p className="text-xs text-muted-foreground">در دسترس</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xl font-bold text-orange-600">{stats.sold}</p>
              <p className="text-xs text-muted-foreground">فروخته شده</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xl font-bold text-yellow-600">{stats.installing}</p>
              <p className="text-xs text-muted-foreground">در حال نصب</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xl font-bold text-purple-600">{stats.delivered}</p>
              <p className="text-xs text-muted-foreground">تحویل داده شده</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="جستجو بر اساس نام، مدل یا سریال..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="available">موجود</SelectItem>
                  <SelectItem value="sold">فروخته شده</SelectItem>
                  <SelectItem value="reserved">رزرو شده</SelectItem>
                </SelectContent>
              </Select>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="shrink-0"
                    >
                      <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>تازه‌سازی لیست محصولات</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>نام محصول</TableHead>
                  <TableHead>مدل/سریال</TableHead>
                  <TableHead>دسته‌بندی</TableHead>
                  <TableHead>قیمت</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>تاریخ ثبت</TableHead>
                  <TableHead>عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const batchInfo = getBatchInfo(product);
                  return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {product.productType === 'imported' ? (
                          <Ship className="w-4 h-4 text-purple-600" />
                        ) : (
                          <Package className="w-4 h-4 text-blue-600" />
                        )}
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span>{product.name}</span>
                            {product.productType === 'imported' && (
                              <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                                🚢 وارداتی
                              </Badge>
                            )}
                          </div>
                          {batchInfo.isBatch && (
                            <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 text-xs w-fit">
                              📊 دسته‌ای {batchInfo.batchIndex}/{batchInfo.batchSize}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.model}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.serialNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {product.categoryName}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {product.price ? (
                        <span className="font-medium">
                          {product.price.toLocaleString()} ریال
                        </span>
                      ) : (
                        <span className="text-muted-foreground">تعیین نشده</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={statusColors[product.status]}
                      >
                        {statusLabels[product.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.createdAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => setSelectedProduct(product)}
                          >
                            <Eye className="w-4 h-4 ml-2" />
                            مشاهده جزئیات
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 ml-2" />
                            ویرایش
                          </DropdownMenuItem>
                          {product.status === 'available' && (
                            <DropdownMenuItem 
                              onClick={() => handleSellProduct(product)}
                            >
                              <ShoppingCart className="w-4 h-4 ml-2" />
                              فروش
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <QrCode className="w-4 h-4 ml-2" />
                            QR Code
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="w-4 h-4 ml-2" />
                            دانلود شناسنامه
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteProduct(product)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-muted-foreground">محصولی یافت نشد</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Details Modal */}
      {selectedProduct && !isSellModalOpen && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-6xl max-h-[95vh]">
            <DialogHeader className="text-right" dir="rtl">
              <DialogTitle className="text-right">جزئیات محصول: {selectedProduct.name}</DialogTitle>
              <DialogDescription className="text-right">
                مشاهده اطلاعات کامل، مشخصات فنی و تاریخچه محصول
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(95vh-8rem)] overflow-auto">
              <ProductDetailsView product={selectedProduct} />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}

      {/* Sell Product Modal */}
      {isSellModalOpen && selectedProduct && (
        <SellModal
          isOpen={isSellModalOpen}
          onClose={() => {
            setIsSellModalOpen(false);
            setSelectedProduct(null);
          }}
          preSelectedPart={{
            id: selectedProduct.id,
            name: selectedProduct.name,
            code: selectedProduct.model,
            serial: selectedProduct.serialNumber,
            category: selectedProduct.categoryName
          }}
          title="فروش محصول"
          description="انجام فرآیند فروش محصول"
        />
      )}
    </div>
  );
}

// Mock data for categories and specifications
const mockCategories = [
  { 
    id: '1', 
    name: 'موتور آسانسور',
    specifications: [
      { key: 'power', label: 'قدرت (HP)', type: 'text' },
      { key: 'voltage', label: 'ولتاژ (V)', type: 'text' },
      { key: 'frequency', label: 'فرکانس (Hz)', type: 'text' },
      { key: 'speed', label: 'سرعت (RPM)', type: 'text' }
    ]
  },
  { 
    id: '2', 
    name: 'کنترلر',
    specifications: [
      { key: 'inputVoltage', label: 'ولتاژ ورودی (V)', type: 'text' },
      { key: 'outputVoltage', label: 'ولتاژ خروجی (V)', type: 'text' },
      { key: 'capacity', label: 'ظرفیت (A)', type: 'text' },
      { key: 'protocol', label: 'پروتکل ارتباطی', type: 'text' }
    ]
  },
  { 
    id: '3', 
    name: 'کابل',
    specifications: [
      { key: 'wireCount', label: 'تعداد سیم', type: 'text' },
      { key: 'crossSection', label: 'سطح مقطع (mm²)', type: 'text' },
      { key: 'insulationType', label: 'نوع عایق', type: 'text' },
      { key: 'length', label: 'طول (متر)', type: 'text' }
    ]
  }
];

const countries = [
  'ایران', 'آلمان', 'ایتالیا', 'ترکیه', 'چین', 'کره جنوبی', 'ژاپن', 'فنلاند', 'سوئد', 'سوئیس'
];

function CreateProductForm({ onClose }: { onClose: () => void }) {
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

  const selectedCategory = mockCategories.find(cat => cat.id === formData.categoryId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate customs clearance file for imported products
    if (formData.productType === 'imported' && !customsClearanceFile) {
      toast.error('برای محصولات وارداتی، بارگذاری برگه سبز ترخیص کالا الزامی است');
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

      toast.success(`${batchQuantity} محصول ${formData.productType === 'imported' ? 'وارداتی' : 'تولیدی'} دسته‌ای ثبت شد`);
    } else {
      toast.success(`محصول ${formData.productType === 'imported' ? 'وارداتی' : 'تولیدی'} جدید ثبت شد`);
    }
    
    onClose();
  };

  const handleCategoryChange = (categoryId: string) => {
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
      
      // وقتی نوع محصول تولیدی انتخاب شود، کشور سازنده را اتوماتیک روی ایران تنظیم کن
      if (value === 'manufactured') {
        newData.manufacturerCountry = 'ایران';
      } else if (value === 'imported') {
        // برای محصولات وارداتی، کشور سازنده را خالی کن تا کاربر انتخاب کند
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
        {/* Basic Product Information */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-800 flex items-center gap-2 mb-4">
            📦 اطلاعات پایه محصول
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-blue-700 flex items-center gap-2">
                📝 نام محصول *
              </Label>
              <Input
                id="name"
                placeholder="نام محصول را وارد کنید"
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
                placeholder="مدل محصول"
                value={formData.model}
                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                className="bg-white border-blue-300"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="text-blue-700 flex items-center gap-2">
                📂 دسته‌بندی محصول *
              </Label>
              <Select value={formData.categoryId} onValueChange={handleCategoryChange}>
                <SelectTrigger className="bg-white border-blue-300">
                  <SelectValue placeholder="انتخاب دسته‌بندی" />
                </SelectTrigger>
                <SelectContent>
                  {mockCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
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
              📊 نحوه ثبت محصول
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
                      🔢 تعداد محصولات *
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
                      💡 حداکثر ۵۰ محصول در هر بار
                    </p>
                  </div>
                </div>
              </div>

              {/* Serial Numbers Input */}
              <div className="bg-white p-3 rounded border border-indigo-300">
                <h4 className="font-medium text-indigo-800 mb-3 flex items-center gap-2">
                  🏷️ شماره‌های سریال محصولات
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                  {serialNumbers.map((serial, index) => (
                    <div key={index} className="space-y-1">
                      <Label className="text-indigo-700 text-sm">
                        محصول {index + 1}
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
                  💡 برای ثبت چندین محصول با مشخصات یکسان، حالت دسته‌ای را فعال کنید
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
              placeholder="قیمت محصول به ریال"
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

        {/* Manufacturing/Import Information */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="font-medium text-purple-800 flex items-center gap-2 mb-4">
            🌍 اطلاعات تولید/واردات
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-purple-700 flex items-center gap-2">
                🏭 نوع محصول *
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
                  ✨ برای محصولات تولیدی، کشور سازنده اتوماتیک ایران انتخاب می‌شود
                </p>
              )}
            </div>
            
            {formData.productType === 'imported' && (
              <div className="space-y-2">
                <Label className="text-purple-700 flex items-center gap-2">
                  🌍 کشور مبدا
                </Label>
                <Select value={formData.originCountry} onValueChange={(value) => setFormData(prev => ({ ...prev, originCountry: value }))}>
                  <SelectTrigger className="bg-white border-purple-300">
                    <SelectValue placeholder="انتخاب کشور مبدا" />
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
        </div>

        {/* Import Documents Section - Only for imported products */}
        {formData.productType === 'imported' && (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="font-medium text-red-800 flex items-center gap-2 mb-4">
              📄 مدارک گمرکی
            </h3>
            <div className="space-y-4">
              <div className="bg-white p-3 rounded border border-red-300">
                <div className="space-y-3">
                  <Label className="text-red-700 flex items-center gap-2">
                    📋 برگه سبز ترخیص کالا *
                  </Label>
                  
                  {!customsClearanceFile ? (
                    <div className="border-2 border-dashed border-red-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
                      <input
                        type="file"
                        id="customs-clearance"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleCustomsClearanceFileChange}
                      />
                      <label
                        htmlFor="customs-clearance"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <div className="bg-red-100 p-3 rounded-full">
                          <svg
                            className="w-6 h-6 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-red-700 font-medium">کلیک کنید تا فایل انتخاب کنید</p>
                          <p className="text-red-600 text-sm mt-1">
                            فرمت‌های مجاز: PDF، JPG، PNG (حداکثر ۵ مگابایت)
                          </p>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-2 rounded">
                            <svg
                              className="w-5 h-5 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-green-800">{customsClearanceFile.name}</p>
                            <p className="text-sm text-green-600">
                              {(customsClearanceFile.size / 1024 / 1024).toFixed(2)} مگابایت
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setCustomsClearanceFile(null)}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          حذف
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-amber-50 border border-amber-200 rounded p-3">
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                      <div className="text-sm text-amber-800">
                        <p className="font-medium mb-1">⚠️ نکات مهم:</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                          <li>برگه سبز ترخیص کالا برای محصولات وارداتی الزامی است</li>
                          <li>فایل باید واضح و خوانا باشد</li>
                          <li>اطلاعات روی برگه باید با مشخصات وارد شده مطابقت داشته باشد</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Technical Specifications */}
        {selectedCategory && (
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="font-medium text-orange-800 flex items-center gap-2 mb-4">
              ⚙️ مشخصات فنی {selectedCategory.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedCategory.specifications.map(spec => (
                <div key={spec.key} className="space-y-2">
                  <Label className="text-orange-700 flex items-center gap-2">
                    🔧 {spec.label}
                  </Label>
                  <Input
                    type={spec.type}
                    placeholder={`${spec.label} را وارد کنید`}
                    value={formData.specifications[spec.key] || ''}
                    onChange={(e) => handleSpecificationChange(spec.key, e.target.value)}
                    className="bg-white border-orange-300"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-orange-600 mt-3">
              ⚡ مشخصات فنی بر اساس دسته‌بندی انتخاب شده تولید می‌شوند
            </p>
          </div>
        )}

        {!selectedCategory && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="text-center text-gray-600">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p>ابتدا دسته‌بندی محصول را انتخاب کنید تا مشخصات فنی نمایش داده شود</p>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={onClose}>
            ❌ انصراف
          </Button>
          <Button 
            type="submit" 
            className="bg-green-600 hover:bg-green-700"
            disabled={
              !formData.name || 
              !formData.model || 
              !formData.categoryId || 
              !formData.manufacturer ||
              (isBatchMode ? serialNumbers.some(serial => !serial.trim()) : !formData.serialNumber) ||
              (formData.productType === 'imported' && !customsClearanceFile)
            }
          >
            {isBatchMode ? `✅ ثبت ${batchQuantity} محصول ${formData.productType === 'imported' ? 'وارداتی' : 'تولیدی'}` : `✅ ثبت محصول ${formData.productType === 'imported' ? 'وارداتی' : 'تولیدی'}`}
          </Button>
        </div>
      </form>
    </div>
  );
}

function ProductDetailsView({ product }: { product: Product }) {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="space-y-6">
        {/* محتوای اطلاعات */}
        <div>
          <Tabs defaultValue="info" className="w-full" dir="rtl">
            <TabsList className="grid w-full grid-cols-2" dir="rtl">
              <TabsTrigger value="info" className="text-right">اطلاعات محصول</TabsTrigger>
              <TabsTrigger value="history" className="text-right">تاریخچه</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-4" dir="rtl">
              <Card className="text-right">
                <CardHeader className="text-right">
                  <CardTitle className="text-lg text-right">اطلاعات کامل محصول</CardTitle>
                </CardHeader>
                <CardContent className="text-right">
                  <div className="space-y-6 text-right">
                    {/* اطلاعات پایه */}
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-3">اطلاعات پایه</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">شناسه محصول:</Label>
                          <p className="mt-1 font-medium text-blue-600">#{product.id}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">نام محصول:</Label>
                          <p className="mt-1 font-medium">{product.name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">مدل:</Label>
                          <p className="mt-1 font-medium">{product.model}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">شماره سریال:</Label>
                          <p className="mt-1 font-mono font-medium bg-gray-50 px-2 py-1 rounded text-sm">{product.serialNumber}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">سازنده:</Label>
                          <p className="mt-1 font-medium">{product.manufacturer}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">دسته‌بندی:</Label>
                          <div className="mt-1">
                            <Badge variant="outline">{product.categoryName}</Badge>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">وضعیت:</Label>
                          <div className="mt-1">
                            <Badge variant="secondary" className={statusColors[product.status]}>
                              {statusLabels[product.status]}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">قیمت:</Label>
                          <p className="mt-1 font-medium">
                            {product.price ? (
                              <span className="text-green-600">{product.price.toLocaleString()} ریال</span>
                            ) : (
                              <span className="text-gray-500">تعیین نشده</span>
                            )}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">تاریخ ثبت:</Label>
                          <p className="mt-1 font-medium">{product.createdAt}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">نوع محصول:</Label>
                          <div className="mt-1">
                            <Badge variant="secondary" className={product.productType === 'imported' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                              {product.productType === 'imported' ? '🚢 وارداتی' : '🏭 تولیدی'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* مشخصات فنی */}
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-3">مشخصات فنی</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <Label className="text-sm font-medium text-blue-700">{key}:</Label>
                            <p className="mt-1 font-medium text-blue-900">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">تاریخچه محصول</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-r-2 border-blue-500 pr-4 bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <p className="font-medium">ثبت اولیه محصول</p>
                      </div>
                      <p className="text-sm text-muted-foreground">📅 {product.createdAt}</p>
                      <p className="text-sm text-muted-foreground">👤 توسط: شرکت خودی</p>
                    </div>
                    <div className="border-r-2 border-green-500 pr-4 bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <p className="font-medium">تایید اطلاعات</p>
                      </div>
                      <p className="text-sm text-muted-foreground">📅 {product.createdAt}</p>
                      <p className="text-sm text-muted-foreground">🤖 توسط: سیستم</p>
                    </div>
                    {product.status === 'sold' && (
                      <div className="border-r-2 border-orange-500 pr-4 bg-orange-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <p className="font-medium">فروش محصول</p>
                        </div>
                        <p className="text-sm text-muted-foreground">📅 {product.createdAt}</p>
                        <p className="text-sm text-muted-foreground">👨‍💼 توسط: مدیر شرکت</p>
                      </div>
                    )}
                    {product.status === 'reserved' && (
                      <div className="border-r-2 border-yellow-500 pr-4 bg-yellow-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <p className="font-medium">رزرو محصول</p>
                        </div>
                        <p className="text-sm text-muted-foreground">📅 {product.createdAt}</p>
                        <p className="text-sm text-muted-foreground">👤 توسط: مشتری</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* QR Code و مدارک */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">کد QR محصول</CardTitle>
              <CardDescription>
                برای اسکن و دسترسی سریع به اطلاعات محصول
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <QRCodeGenerator 
                data={`https://elevatorid.ieeu.ir/product/${product.serialNumber}`}
                title="کد QR محصول"
                size={180}
              />
              <div className="text-center text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg w-full">
                <p className="font-medium text-gray-700">شناسه محصول:</p>
                <p className="font-mono font-bold text-blue-600 text-lg">#{product.id}</p>
                <p className="font-medium text-gray-700 mt-2">شماره سریال:</p>
                <p className="font-mono font-medium text-gray-900">{product.serialNumber}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* تولید شناسنامه */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">شناسنامه محصول</CardTitle>
              <CardDescription>
                تولید و دانلود شناسنامه کامل محصول
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  // اینجا محتوای تب اطلاعات محصول را برای PDF آماده می‌کنیم
                  const certificateData = {
                    ...product,
                    certificateTitle: 'شناسنامه محصول',
                    generatedAt: new Date().toLocaleDateString('fa-IR'),
                    sections: [
                      {
                        title: 'اطلاعات پایه',
                        data: {
                          'شناسه محصول': `#${product.id}`,
                          'نام محصول': product.name,
                          'مدل': product.model,
                          'شماره سریال': product.serialNumber,
                          'سازنده': product.manufacturer,
                          'دسته‌بندی': product.categoryName,
                          'وضعیت': statusLabels[product.status],
                          'قیمت': product.price ? `${product.price.toLocaleString()} ریال` : 'تعیین نشده',
                          'تاریخ ثبت': product.createdAt,
                          'نوع محصول': product.productType === 'imported' ? 'وارداتی' : 'تولیدی'
                        }
                      },
                      {
                        title: 'مشخصات فنی',
                        data: product.specifications
                      }
                    ]
                  };
                  
                  toast.success(`شناسنامه ${product.name} در حال تولید...`);
                  
                  // اینجا می‌توان API call برای تولید PDF ارسال کرد
                  console.log('Certificate data for PDF:', certificateData);
                }}
              >
                <FileText className="w-4 h-4 ml-2" />
                تولید شناسنامه محصول
              </Button>
              
              <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded border border-blue-200">
                💡 شناسنامه شامل تمام اطلاعات، مشخصات فنی و کد QR محصول خواهد بود
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

