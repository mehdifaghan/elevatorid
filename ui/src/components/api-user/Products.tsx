import React, { useState, useEffect } from 'react';
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
import { Alert, AlertDescription } from '../ui/alert';
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
  RefreshCw,
  Wifi,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import QRCodeGenerator from '../common/QRCodeGenerator';
import { PersianDatePicker } from '../common/PersianDatePicker';
import { realApiRequest } from '../../lib/real-api-client';

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

interface ProductCategory {
  id: string;
  name: string;
  specifications: {
    key: string;
    label: string;
    type: string;
  }[];
}

interface ProductStats {
  total: number;
  available: number;
  sold: number;
  reserved: number;
  installing?: number;
  delivered?: number;
}

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

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState<ProductStats>({
    total: 0,
    available: 0,
    sold: 0,
    reserved: 0,
    installing: 0,
    delivered: 0
  });



  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch products
      const productsResponse = await realApiRequest.get('/user/products');
      const products = productsResponse.data.products || [];
      setProducts(products);
      setStats(calculateStats(products));

      // Fetch categories
      const categoriesResponse = await realApiRequest.get('/user/product-categories');
      setCategories(categoriesResponse.data.categories || []);

    } catch (error: any) {
      console.error('Error fetching products data:', error);
      toast.error('خطا در بارگذاری اطلاعات محصولات');
      
      // Set empty states
      setProducts([]);
      setStats({
        total: 0,
        available: 0,
        sold: 0,
        reserved: 0,
        installing: 0,
        delivered: 0
      });
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (productsList: Product[]): ProductStats => {
    return {
      total: productsList.length,
      available: productsList.filter(p => p.status === 'available').length,
      sold: productsList.filter(p => p.status === 'sold').length,
      reserved: productsList.filter(p => p.status === 'reserved').length,
      installing: 0,
      delivered: 0
    };
  };

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

  const handleDeleteProduct = async (product: Product) => {
    if (confirm(`آیا از حذف ${product.name} اطمینان دارید؟`)) {
      try {
        await realApiRequest.delete(`/user/products/${product.id}`);
        setProducts(prev => prev.filter(p => p.id !== product.id));
        setStats(calculateStats(products.filter(p => p.id !== product.id)));
        toast.success(`${product.name} حذف شد`);
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('خطا در حذف محصول');
      }
    }
  };

  const handleSellProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsSellModalOpen(true);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
    toast.success('لیست محصولات به‌روزرسانی شد');
  };

  const handleCreateProduct = async (formData: any) => {
    try {
      const response = await realApiRequest.post('/user/products', formData);
      if (response.data) {
        await fetchData(); // Refresh the list
        toast.success('محصول جدید با موفقیت ثبت شد');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('خطا در ثبت محصول جدید');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">در حال بارگذاری محصولات...</p>
        </div>
      </div>
    );
  }

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
              <CreateProductForm 
                onClose={() => setIsCreateModalOpen(false)} 
                categories={categories}
                onSubmit={handleCreateProduct}
              />
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
              <p className="text-xl font-bold text-yellow-600">{stats.reserved}</p>
              <p className="text-xs text-muted-foreground">رزرو شده</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xl font-bold text-purple-600">{stats.installing || 0}</p>
              <p className="text-xs text-muted-foreground">در حال نصب</p>
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

// Create Product Form Component
function CreateProductForm({ 
  onClose, 
  categories, 
  onSubmit 
}: { 
  onClose: () => void; 
  categories: ProductCategory[];
  onSubmit: (data: any) => Promise<void>;
}) {
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    serialNumber: '',
    categoryId: '',
    manufacturer: '',
    brand: '',
    price: '',
    productType: 'manufactured',
    manufacturerCountry: 'ایران',
    originCountry: '',
    productionDate: '',
    specifications: {} as Record<string, string>
  });

  const [isBatchMode, setIsBatchMode] = useState(false);
  const [batchQuantity, setBatchQuantity] = useState(1);
  const [serialNumbers, setSerialNumbers] = useState<string[]>(['']);
  const [customsClearanceFile, setCustomsClearanceFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedCategory = categories.find(cat => cat.id === formData.categoryId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.productType === 'imported' && !customsClearanceFile) {
      toast.error('برای محصولات وارداتی، بارگذاری برگه سبز ترخیص کالا الزامی است');
      return;
    }
    
    if (isBatchMode) {
      const emptySerials = serialNumbers.filter(serial => !serial.trim());
      if (emptySerials.length > 0) {
        toast.error('لطفاً تمام شماره‌های سریال را وارد کنید');
        return;
      }

      const uniqueSerials = new Set(serialNumbers);
      if (uniqueSerials.size !== serialNumbers.length) {
        toast.error('شماره‌های سریال نمی‌توانند تکراری باشند');
        return;
      }
    }

    try {
      setLoading(true);
      
      const submitData = {
        ...formData,
        isBatchMode,
        batchQuantity: isBatchMode ? batchQuantity : 1,
        serialNumbers: isBatchMode ? serialNumbers : [formData.serialNumber],
        customsClearanceFile
      };

      await onSubmit(submitData);
      onClose();
      
    } catch (error) {
      console.error('Error submitting product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categoryId,
      specifications: {}
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
              <Label htmlFor="name" className="text-blue-700">
                نام محصول *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="نام محصول را وارد کنید"
                required
                className="text-right"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model" className="text-blue-700">
                مدل *
              </Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                placeholder="مدل محصول"
                required
                className="text-right"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId" className="text-blue-700">
                دسته‌بندی *
              </Label>
              <Select value={formData.categoryId} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب دسته‌بندی" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="manufacturer" className="text-blue-700">
                سازنده *
              </Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => setFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
                placeholder="نام شرکت سازنده"
                required
                className="text-right"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-blue-700">
                قیمت (ریال)
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="قیمت محصول"
                className="text-left"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-blue-700">
                نوع محصول *
              </Label>
              <Select 
                value={formData.productType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, productType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manufactured">تولیدی</SelectItem>
                  <SelectItem value="imported">وارداتی</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Serial Number Section */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-green-800">
              🏷️ شماره سریال
            </h3>
            <div className="flex items-center gap-2">
              <Switch
                checked={isBatchMode}
                onCheckedChange={setIsBatchMode}
              />
              <Label className="text-green-700">ثبت دسته‌ای</Label>
            </div>
          </div>

          {!isBatchMode ? (
            <div className="space-y-2">
              <Label htmlFor="serialNumber">شماره سریال *</Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                placeholder="شماره سریال محصول"
                required
                className="text-left"
                dir="ltr"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>تعداد محصولات</Label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={batchQuantity}
                  onChange={(e) => {
                    const quantity = parseInt(e.target.value) || 1;
                    setBatchQuantity(quantity);
                    setSerialNumbers(Array(quantity).fill(''));
                  }}
                  className="w-32 text-left"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label>شماره‌های سریال *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {serialNumbers.map((serial, index) => (
                    <Input
                      key={index}
                      value={serial}
                      onChange={(e) => {
                        const newSerials = [...serialNumbers];
                        newSerials[index] = e.target.value;
                        setSerialNumbers(newSerials);
                      }}
                      placeholder={`سریال ${index + 1}`}
                      className="text-left"
                      dir="ltr"
                      required
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Specifications */}
        {selectedCategory && selectedCategory.specifications.length > 0 && (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-medium text-purple-800 mb-4">
              ⚙️ مشخصات فنی
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedCategory.specifications.map((spec) => (
                <div key={spec.key} className="space-y-2">
                  <Label className="text-purple-700">{spec.label}</Label>
                  <Input
                    value={formData.specifications[spec.key] || ''}
                    onChange={(e) => handleSpecificationChange(spec.key, e.target.value)}
                    placeholder={spec.label}
                    className="text-right"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Import Documents (for imported products) */}
        {formData.productType === 'imported' && (
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="font-medium text-orange-800 mb-4">
              📋 مدارک وارداتی
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-orange-700">برگه سبز ترخیص کالا *</Label>
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setCustomsClearanceFile(file);
                      toast.success('فایل بارگذاری شد');
                    }
                  }}
                  className="text-right"
                />
                <p className="text-xs text-orange-600">
                  فقط فایل‌های PDF، JPG و PNG با حداکثر حجم ۵ مگابایت
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            انصراف
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                در حال ثبت...
              </>
            ) : (
              'ثبت محصول'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Product Details View Component
function ProductDetailsView({ product }: { product: Product }) {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات پایه</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">نام:</span>
              <span className="font-medium">{product.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">مدل:</span>
              <span className="font-medium">{product.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">سریال:</span>
              <span className="font-medium">{product.serialNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">سازنده:</span>
              <span className="font-medium">{product.manufacturer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">دسته‌بندی:</span>
              <Badge variant="outline">{product.categoryName}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">وضعیت:</span>
              <Badge className={statusColors[product.status]}>
                {statusLabels[product.status]}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>مشخصات فنی</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-muted-foreground">{key}:</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}