import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { Checkbox } from '../ui/checkbox';
import { Skeleton } from '../ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
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
  Ship,
  FolderTree,
  Loader2,
  ArrowRightLeft,
  ShoppingCart,
  Download,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Clock,
  Search,
  User
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import QRCodeGenerator from '../common/QRCodeGenerator';
import AdvancedTable, { TableColumn } from '../common/AdvancedTable';
import { PersianDatePicker } from '../common/PersianDatePicker';
import { realApiRequest, RealApiError } from '../../lib/real-api-client';
import SellModal from '../common/SellModal';

interface PartStats {
  total: number;
  available: number;
  installed: number;
  maintenance: number;
  sold: number;
  thisMonth: number;
  lastMonth: number;
  monthlyGrowth: number;
}

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
  partUid: string;
  title: string;
  barcode: string;
  categoryId: string;
  categoryName?: string;
  manufacturerCountry: string;
  originCountry: string;
  registrantCompanyId: string;
  registrantCompanyName?: string;
  currentOwner: {
    type: 'company' | 'elevator';
    companyId?: string;
    elevatorId?: string;
    companyName?: string;
    elevatorName?: string;
  };
  status: 'available' | 'sold' | 'installed' | 'maintenance';
  createdAt: string;
  updatedAt?: string;
  features?: Array<{
    featureId: number;
    name: string;
    key: string;
    value: any;
  }>;
  qrCode?: string;
}

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
  const [parts, setParts] = useState<Part[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<PartStats>({
    total: 0,
    available: 0,
    installed: 0,
    maintenance: 0,
    sold: 0,
    thisMonth: 0,
    lastMonth: 0,
    monthlyGrowth: 0
  });
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [partToSell, setPartToSell] = useState<Part | null>(null);
  const [partToTransfer, setPartToTransfer] = useState<Part | null>(null);
  const [partToDelete, setPartToDelete] = useState<Part | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchParts();
    fetchCategories();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      
      // Use real API request
      const data = await realApiRequest.get('/admin/parts/stats');
      const fetchedStats = data.stats || data;
      
      // Map API response to our interface
      const mappedStats: PartStats = {
        total: fetchedStats.total || 0,
        available: fetchedStats.available || 0,
        installed: fetchedStats.installed || 0,
        maintenance: fetchedStats.maintenance || 0,
        sold: fetchedStats.sold || 0,
        thisMonth: fetchedStats.this_month || fetchedStats.thisMonth || 0,
        lastMonth: fetchedStats.last_month || fetchedStats.lastMonth || 0,
        monthlyGrowth: fetchedStats.monthly_growth || fetchedStats.monthlyGrowth || 0
      };
      
      setStats(mappedStats);
    } catch (error) {
      console.error('Error fetching part stats:', error);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای دریافت آمار قطعات');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت در دریافت آمار');
        } else {
          toast.error('خطا در بارگذاری آمار قطعات');
        }
      } else {
        toast.error('خطا در بارگذاری آمار قطعات');
      }
      
      // Set default empty stats on error
      setStats({
        total: 0,
        available: 0,
        installed: 0,
        maintenance: 0,
        sold: 0,
        thisMonth: 0,
        lastMonth: 0,
        monthlyGrowth: 0
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchParts = async () => {
    try {
      setLoading(true);
      
      // Use real API request
      const data = await realApiRequest.get('/admin/parts');
      const fetchedParts = data.parts || data.data || data || [];
      
      // Map API response to our interface if needed
      const mappedParts = Array.isArray(fetchedParts) ? fetchedParts.map((part: any) => ({
        id: part.id?.toString() || part._id?.toString(),
        partUid: part.part_uid || part.partUid || part.uid || 'نامشخص',
        title: part.title || part.name || 'نامشخص',
        barcode: part.barcode || '',
        categoryId: part.category_id?.toString() || part.categoryId?.toString() || '',
        categoryName: part.category_name || part.categoryName || part.category?.title || 'نامشخص',
        manufacturerCountry: part.manufacturer_country || part.manufacturerCountry || 'نامشخص',
        originCountry: part.origin_country || part.originCountry || 'نامشخص',
        registrantCompanyId: part.registrant_company_id?.toString() || part.registrantCompanyId?.toString() || '',
        registrantCompanyName: part.registrant_company_name || part.registrantCompanyName || 'نامشخص',
        currentOwner: {
          type: part.current_owner?.type || part.currentOwner?.type || 'company',
          companyId: part.current_owner?.company_id?.toString() || part.currentOwner?.companyId?.toString(),
          elevatorId: part.current_owner?.elevator_id?.toString() || part.currentOwner?.elevatorId?.toString(),
          companyName: part.current_owner?.company_name || part.currentOwner?.companyName || 'نامشخص',
          elevatorName: part.current_owner?.elevator_name || part.currentOwner?.elevatorName
        },
        status: part.status || 'available',
        createdAt: part.created_at || part.createdAt || new Date().toLocaleDateString('fa-IR'),
        updatedAt: part.updated_at || part.updatedAt,
        features: part.features || [],
        qrCode: part.qr_code || part.qrCode
      })) : [];
      
      setParts(mappedParts);
    } catch (error) {
      console.error('Error fetching parts:', error);
      
      // Set empty array on error
      setParts([]);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای دریافت قطعات');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت در دریافت قطعات');
        } else {
          toast.error('خطا در بارگذاری قطعات');
        }
      } else {
        toast.error('خطا در بارگذاری قطعات');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // Use real API request
      const data = await realApiRequest.get('/admin/categories/parts');
      const fetchedCategories = data.categories || data.data || data || [];
      
      // Map API response if needed
      const mappedCategories = Array.isArray(fetchedCategories) ? fetchedCategories.map((category: any) => ({
        id: category.id?.toString() || category._id?.toString(),
        name: category.title || category.name,
        parentId: category.parent_id?.toString() || category.parentId?.toString(),
        children: category.children || [],
        technicalSpecs: category.technical_specs || category.technicalSpecs || []
      })) : [];
      
      setCategories(mappedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (!apiError.isNetworkError) {
          toast.error('خطا در بارگذاری دسته‌بندی‌ها');
        }
      }
    }
  };

  const handleDeletePart = async (part: Part) => {
    try {
      // Use real API request
      await realApiRequest.delete(`/admin/parts/${part.id}`);
      
      setParts(prev => prev.filter(p => p.id !== part.id));
      setPartToDelete(null);
      toast.success(`${part.title} حذف شد`);
      
      // Refresh stats after deletion
      fetchStats();
    } catch (error) {
      console.error('Error deleting part:', error);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای حذف قطعه');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت');
        } else {
          toast.error('خطا در حذف قطعه');
        }
      } else {
        toast.error('خطا در حذف قطعه');
      }
    }
  };

  const handleSellPart = async (sellData: any) => {
    try {
      if (!partToSell) return;
      
      // Use real API request
      await realApiRequest.post(`/admin/parts/${partToSell.id}/sell`, sellData);
      
      // Update local state
      setParts(prev => prev.map(p => 
        p.id === partToSell.id 
          ? { ...p, status: 'sold', currentOwner: { type: 'company', companyId: sellData.buyerCompanyId } }
          : p
      ));
      
      setIsSellModalOpen(false);
      setPartToSell(null);
      toast.success(`${partToSell.title} با موفقیت فروخته شد`);
      
      // Refresh stats after sale
      fetchStats();
    } catch (error) {
      console.error('Error selling part:', error);
      toast.error('خطا در فروش قطعه');
    }
  };

  const handleTransferPart = async (transferData: any) => {
    try {
      if (!partToTransfer) return;
      
      // Use real API request
      await realApiRequest.post(`/admin/parts/${partToTransfer.id}/transfer`, transferData);
      
      // Update local state
      setParts(prev => prev.map(p => 
        p.id === partToTransfer.id 
          ? { ...p, currentOwner: { type: 'company', companyId: transferData.targetCompanyId } }
          : p
      ));
      
      setIsTransferModalOpen(false);
      setPartToTransfer(null);
      toast.success(`${partToTransfer.title} با موفقیت منتقل شد`);
    } catch (error) {
      console.error('Error transferring part:', error);
      toast.error('خطا در انتقال قطعه');
    }
  };

  const handleGenerateQR = async (part: Part) => {
    try {
      // Use real API request
      const response = await realApiRequest.post(`/admin/parts/${part.id}/qr`);
      
      if (response.qrCode) {
        // Update local state with QR code
        setParts(prev => prev.map(p => 
          p.id === part.id ? { ...p, qrCode: response.qrCode } : p
        ));
        toast.success('کد QR با موفقیت تولید شد');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('خطا در تولید کد QR');
    }
  };

  const handleGeneratePDF = async (part: Part) => {
    try {
      // Use real API request
      const response = await realApiRequest.post(`/admin/parts/${part.id}/pdf`);
      
      if (response.downloadUrl) {
        // Open PDF in new tab
        window.open(response.downloadUrl, '_blank');
        toast.success('شناسنامه PDF با موفقیت تولید شد');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('خطا در تولید شناسنامه PDF');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchParts(),
        fetchCategories(),
        fetchStats()
      ]);
      toast.success('داده‌ها با موفقیت به‌روزرسانی شد');
    } catch (error) {
      toast.error('خطا در به‌روزرسانی داده‌ها');
    } finally {
      setIsRefreshing(false);
    }
  };



  const filteredParts = parts.filter(part => {
    const matchesSearch = part.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         part.partUid.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         part.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (part.categoryName && part.categoryName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || part.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
    
    return categoryName || 'نامشخص';
  };



  // Loading skeleton for stats
  const StatsLoadingSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="border-l-4 border-l-gray-300">
          <CardContent className="p-3">
            <div className="text-center space-y-2">
              <Skeleton className="h-6 w-12 mx-auto" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const tableColumns: TableColumn<Part>[] = [
    {
      key: 'title',
      label: 'نام قطعه',
      sortable: true,
      render: (value, item) => (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-blue-600" />
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-xs text-muted-foreground">
              UID: {item.partUid}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'barcode',
      label: 'بارکد',
      sortable: true,
      render: (value, item) => (
        <div className="font-mono text-sm">
          {value || 'بدون بارکد'}
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
      key: 'manufacturerCountry',
      label: 'کشور سازنده',
      sortable: true,
      render: (value) => (
        <div className="text-sm">{value}</div>
      )
    },
    {
      key: 'currentOwner',
      label: 'مالک فعلی',
      sortable: true,
      render: (value, item) => (
        <div className="text-sm">
          {value.type === 'company' ? (
            <div>
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {value.companyName || item.registrantCompanyName || 'نامشخص'}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-1">
                <Package className="w-3 h-3" />
                {value.elevatorName || 'آسانسور نامشخص'}
              </div>
            </div>
          )}
        </div>
      )
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
      sortable: true,
      render: (value) => (
        <div className="text-sm">{value}</div>
      )
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
            <DropdownMenuItem 
              onClick={() => handleGeneratePDF(item)}
              style={{ textAlign: 'right', justifyContent: 'flex-end' }}
            >
              <FileText className="w-4 h-4 mr-2" />
              دانلود شناسنامه PDF
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleGenerateQR(item)}
              style={{ textAlign: 'right', justifyContent: 'flex-end' }}
            >
              <QrCode className="w-4 h-4 mr-2" />
              تولید QR Code
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {item.status === 'available' && (
              <>
                <DropdownMenuItem 
                  onClick={() => {
                    setPartToSell(item);
                    setIsSellModalOpen(true);
                  }}
                  style={{ textAlign: 'right', justifyContent: 'flex-end' }}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  فروش قطعه
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    setPartToTransfer(item);
                    setIsTransferModalOpen(true);
                  }}
                  style={{ textAlign: 'right', justifyContent: 'flex-end' }}
                >
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  انتقال قطعه
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem style={{ textAlign: 'right', justifyContent: 'flex-end' }}>
              <Edit className="w-4 h-4 mr-2" />
              ویرایش
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setPartToDelete(item)}
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
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="text-right">
          <h1 className="text-3xl font-bold">مدیریت قطعات</h1>
          <p className="text-muted-foreground">لیست و مدیریت تمامی قطعات سیستم</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 ml-2" />
            )}
            به‌روزرسانی
          </Button>
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
      {statsLoading ? (
        <StatsLoadingSkeleton />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
                <p className="text-xl font-bold text-green-600">{stats.available}</p>
                <p className="text-xs text-muted-foreground">در انبار</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-xl font-bold text-purple-600">{stats.installed}</p>
                <p className="text-xs text-muted-foreground">نصب شده</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-xl font-bold text-orange-600">{stats.maintenance}</p>
                <p className="text-xs text-muted-foreground">در تعمیر</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-indigo-500">
            <CardContent className="p-3">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <p className="text-lg font-bold text-indigo-600">{stats.thisMonth}</p>
                  {stats.monthlyGrowth > 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : stats.monthlyGrowth < 0 ? (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  ) : null}
                </div>
                <p className="text-xs text-muted-foreground">این ماه</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="جستجو در قطعات (نام، UID، بارکد)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="فیلتر وضعیت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه وضعیت‌ها</SelectItem>
            <SelectItem value="available">موجود</SelectItem>
            <SelectItem value="installed">نصب شده</SelectItem>
            <SelectItem value="maintenance">در تعمیر</SelectItem>
            <SelectItem value="sold">فروخته شده</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            لیست قطعات
          </CardTitle>
          <CardDescription>
            {loading ? (
              <span>در حال بارگذاری...</span>
            ) : parts.length > 0 ? (
              <>مجموعاً {parts.length} قطعه یافت شد</>
            ) : (
              <>هیچ قطعه‌ای یافت نشد</>
            )}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <div className="rounded-md border">
                <div className="overflow-hidden">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 space-x-reverse p-4 border-b last:border-b-0">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                      <Skeleton className="h-8 w-20" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : parts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium text-muted-foreground">
                  قطعه‌ای یافت نشد
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'هیچ قطعه‌ای با این فیلترها موجود نیست. لطفاً جستجوی خود را تغییر دهید.'
                    : 'هنوز قطعه‌ای ثبت نشده است. پس از ثبت قطعات جدید، آنها در اینجا نمایش داده خواهند شد.'
                  }
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleRefresh} 
                  variant="outline" 
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 ml-2" />
                  )}
                  تلاش مجدد
                </Button>
                {(searchTerm || statusFilter !== 'all') && (
                  <Button 
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                    }}
                    variant="ghost"
                  >
                    پاک کردن فیلترها
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <AdvancedTable
              data={filteredParts}
              columns={tableColumns}
              searchable={false}
              filterable={false}
              exportable={true}
              pagination={true}
              pageSize={15}
              emptyMessage="قطعه‌ای یافت نشد"
              onRowClick={(part) => setSelectedPart(part)}
              onRefresh={handleRefresh}
              refreshing={isRefreshing}
            />
          )}
        </CardContent>
      </Card>

      {/* Part Details Modal */}
      {selectedPart && (
        <Dialog open={!!selectedPart} onOpenChange={() => setSelectedPart(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh]" style={{ direction: 'rtl', textAlign: 'right' }}>
            <DialogHeader style={{ textAlign: 'right' }}>
              <DialogTitle style={{ textAlign: 'right' }}>شناسنامه قطعه: {selectedPart.title}</DialogTitle>
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

      {/* Sell Modal */}
      {partToSell && (
        <SellModal
          isOpen={isSellModalOpen}
          onClose={() => {
            setIsSellModalOpen(false);
            setPartToSell(null);
          }}
          onSell={handleSellPart}
          part={{
            id: partToSell.id,
            name: partToSell.title,
            model: '',
            serialNumber: partToSell.partUid,
            price: 0
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {partToDelete && (
        <AlertDialog open={!!partToDelete} onOpenChange={() => setPartToDelete(null)}>
          <AlertDialogContent style={{ direction: 'rtl', textAlign: 'right' }}>
            <AlertDialogHeader style={{ textAlign: 'right' }}>
              <AlertDialogTitle style={{ textAlign: 'right' }}>تأیید حذف قطعه</AlertDialogTitle>
              <AlertDialogDescription style={{ textAlign: 'right' }}>
                آیا از حذف قطعه "{partToDelete.title}" اطمینان دارید؟ این عمل قابل بازگشت نیست.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-row-reverse">
              <AlertDialogCancel onClick={() => setPartToDelete(null)}>
                انصراف
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeletePart(partToDelete)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                حذف
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate customs clearance file for imported parts
    if (formData.productType === 'imported' && !customsClearanceFile) {
      toast.error('برای قطعات وارداتی، بارگذاری برگه سبز ترخیص کالا الزامی است');
      return;
    }
    
    try {
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

        // Use real API request for batch creation
        const batchData = {
          parts: serialNumbers.map(serial => ({
            title: formData.name,
            categoryId: parseInt(formData.categoryId),
            barcode: serial,
            manufacturerCountry: formData.manufacturerCountry,
            originCountry: formData.productType === 'imported' ? formData.originCountry : formData.manufacturerCountry,
            features: Object.entries(formData.specifications).map(([key, value]) => ({
              featureKey: key,
              value: value
            }))
          }))
        };

        await realApiRequest.post('/admin/parts/batch', batchData);
        toast.success(`${batchQuantity} قطعه ${formData.productType === 'imported' ? 'وارداتی' : 'تولیدی'} دسته‌ای ثبت شد`);
      } else {
        // Use real API request for single creation
        const partData = {
          title: formData.name,
          categoryId: parseInt(formData.categoryId),
          barcode: formData.serialNumber,
          manufacturerCountry: formData.manufacturerCountry,
          originCountry: formData.productType === 'imported' ? formData.originCountry : formData.manufacturerCountry,
          features: Object.entries(formData.specifications).map(([key, value]) => ({
            featureKey: key,
            value: value
          }))
        };

        await realApiRequest.post('/admin/parts', partData);
        toast.success(`قطعه ${formData.productType === 'imported' ? 'وارداتی' : 'تولیدی'} جدید ثبت شد`);
      }
      
      onClose();
      // Refresh the parent component
      window.location.reload();
    } catch (error) {
      console.error('Error creating part:', error);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای ثبت قطعه');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت');
        } else {
          toast.error('خطا در ثبت قطعه');
        }
      } else {
        toast.error('خطا در ثبت قطعه');
      }
    }
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
                placeholder="نام قطعه را وارد کنید"
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

function PartDetailsView({ part }: { part: Part }) {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Tabs defaultValue="info" className="w-full" dir="rtl">
            <TabsList className="grid w-full grid-cols-3" dir="rtl">
              <TabsTrigger value="info" className="text-right">اطلاعات پایه</TabsTrigger>
              <TabsTrigger value="features" className="text-right">مشخصات فنی</TabsTrigger>
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
                          <p className="mt-1 font-medium text-right">{part.title}</p>
                        </div>
                        <div className="text-right">
                          <Label className="text-sm font-medium text-muted-foreground text-right">UID قطعه:</Label>
                          <p className="mt-1 font-medium text-right font-mono">{part.partUid}</p>
                        </div>
                        <div className="text-right">
                          <Label className="text-sm font-medium text-muted-foreground text-right">بارکد:</Label>
                          <p className="mt-1 font-medium text-right font-mono">{part.barcode || 'بدون بارکد'}</p>
                        </div>
                        <div className="text-right">
                          <Label className="text-sm font-medium text-muted-foreground text-right">دسته‌بندی:</Label>
                          <p className="mt-1 font-medium text-right">{part.categoryName || 'نامشخص'}</p>
                        </div>
                        <div className="text-right">
                          <Label className="text-sm font-medium text-muted-foreground text-right">کشور سازنده:</Label>
                          <p className="mt-1 font-medium text-right">{part.manufacturerCountry}</p>
                        </div>
                        <div className="text-right">
                          <Label className="text-sm font-medium text-muted-foreground text-right">کشور مبدأ:</Label>
                          <p className="mt-1 font-medium text-right">{part.originCountry}</p>
                        </div>
                        <div className="text-right">
                          <Label className="text-sm font-medium text-muted-foreground text-right">وضعیت:</Label>
                          <div className="mt-1">
                            <Badge 
                              variant="secondary" 
                              className={statusColors[part.status as keyof typeof statusColors]}
                            >
                              {statusLabels[part.status as keyof typeof statusLabels]}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <Label className="text-sm font-medium text-muted-foreground text-right">مالک فعلی:</Label>
                          <p className="mt-1 font-medium text-right">
                            {part.currentOwner.type === 'company' 
                              ? (part.currentOwner.companyName || part.registrantCompanyName || 'شرکت نامشخص')
                              : (part.currentOwner.elevatorName || 'آسانسور نامشخص')
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <h4 className="font-medium text-sm text-muted-foreground mb-3 text-right">تاریخ‌ها</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="text-right">
                          <Label className="text-sm font-medium text-muted-foreground text-right">تاریخ ثبت:</Label>
                          <p className="mt-1 font-medium text-right">{part.createdAt}</p>
                        </div>
                        {part.updatedAt && (
                          <div className="text-right">
                            <Label className="text-sm font-medium text-muted-foreground text-right">آخرین بروزرسانی:</Label>
                            <p className="mt-1 font-medium text-right">{part.updatedAt}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="features" className="space-y-4" dir="rtl">
              <Card className="text-right">
                <CardHeader className="text-right">
                  <CardTitle className="text-lg text-right">مشخصات فنی</CardTitle>
                </CardHeader>
                <CardContent className="text-right">
                  {part.features && part.features.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {part.features.map((feature, index) => (
                        <div key={index} className="text-right">
                          <Label className="text-sm font-medium text-muted-foreground text-right">
                            {feature.name}:
                          </Label>
                          <p className="mt-1 font-medium text-right">{feature.value || 'نامشخص'}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">مشخصات فنی تعریف نشده</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4" dir="rtl">
              <Card className="text-right">
                <CardHeader className="text-right">
                  <CardTitle className="text-lg text-right">تاریخچه انتقال‌ها</CardTitle>
                </CardHeader>
                <CardContent className="text-right">
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">تاریخچه انتقال در دسترس نیست</p>
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
              {part.qrCode ? (
                <div className="text-center">
                  <img src={part.qrCode} alt="QR Code" className="w-44 h-44 mx-auto" />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => window.open(part.qrCode, '_blank')}
                  >
                    <Download className="w-4 h-4 ml-2" />
                    دانلود
                  </Button>
                </div>
              ) : (
                <QRCodeGenerator 
                  data={`https://elevatorid.ieeu.ir/part/${part.partUid}`}
                  title="کد QR قطعه"
                  size={180}
                />
              )}
            </CardContent>
          </Card>
          
          <Card className="text-right mt-4">
            <CardHeader className="text-right">
              <CardTitle className="text-lg text-right">عملیات سریع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="w-4 h-4 ml-2" />
                دانلود شناسنامه PDF
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <ExternalLink className="w-4 h-4 ml-2" />
                مشاهده در سایت
              </Button>
              {part.status === 'available' && (
                <>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <ShoppingCart className="w-4 h-4 ml-2" />
                    فروش قطعه
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <ArrowRightLeft className="w-4 h-4 ml-2" />
                    انتقال قطعه
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Parts;