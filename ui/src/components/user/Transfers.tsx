'use client';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import PDFGenerator from '../common/PDFGenerator';
import SellModal from '../common/SellModal';
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  ArrowRightLeft,
  Package,
  User,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Download,
  Printer,
  ShoppingCart,
  Building2,
  Phone,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Transfer {
  id: string;
  partId: string;
  partName: string;
  partSerial: string;
  direction: 'incoming' | 'outgoing';
  otherCompanyId: string;
  otherCompanyName: string;
  transferDate: string;
  status: 'pending' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
}

const mockTransfers: Transfer[] = [
  {
    id: '1',
    partId: 'P001',
    partName: 'موتور آسانسور AC',
    partSerial: 'AC20001234',
    direction: 'outgoing',
    otherCompanyId: '2',
    otherCompanyName: 'شرکت نصب سریع',
    transferDate: '۱۴۰۲/۰۹/۱۵',
    status: 'completed',
    reason: 'فروش'
  },
  {
    id: '2',
    partId: 'P002',
    partName: 'کنترلر فرکانس VFD',
    partSerial: 'VFD5005678',
    direction: 'incoming',
    otherCompanyId: '3',
    otherCompanyName: 'شرکت قطعات پارس',
    transferDate: '۱۴۰۲/۰۹/۱۲',
    status: 'pending',
    reason: 'خرید',
    notes: 'در انتظار تایید نهایی'
  },
  {
    id: '3',
    partId: 'P003',
    partName: 'کابل فولادی',
    partSerial: 'CAB789012',
    direction: 'outgoing',
    otherCompanyId: '4',
    otherCompanyName: 'شرکت مونتاژ امین',
    transferDate: '۱۴۰۲/۰۹/۱۰',
    status: 'cancelled',
    reason: 'فروش',
    notes: 'لغو شده به درخواست خریدار'
  }
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusLabels = {
  pending: 'در انتظار',
  completed: 'تکمیل شده',
  cancelled: 'لغو شده'
};

const statusIcons = {
  pending: Clock,
  completed: CheckCircle,
  cancelled: AlertCircle
};

const directionLabels = {
  incoming: 'دریافتی',
  outgoing: 'ارسالی'
};

const directionColors = {
  incoming: 'text-green-600',
  outgoing: 'text-blue-600'
};

export default function Transfers() {
  const [transfers, setTransfers] = useState<Transfer[]>(mockTransfers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [directionFilter, setDirectionFilter] = useState<string>('all');
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);


  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedTransferForSale, setSelectedTransferForSale] = useState<Transfer | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = transfer.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.partSerial.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.otherCompanyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transfer.status === statusFilter;
    const matchesDirection = directionFilter === 'all' || transfer.direction === directionFilter;
    
    return matchesSearch && matchesStatus && matchesDirection;
  });

  const getTransferStats = () => {
    const stats = {
      total: transfers.length,
      pending: transfers.filter(t => t.status === 'pending').length,
      completed: transfers.filter(t => t.status === 'completed').length,
      cancelled: transfers.filter(t => t.status === 'cancelled').length,
      incoming: transfers.filter(t => t.direction === 'incoming').length,
      outgoing: transfers.filter(t => t.direction === 'outgoing').length
    };
    return stats;
  };

  const stats = getTransferStats();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call to refresh data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset to original mock data (in real app, fetch from API)
      setTransfers(mockTransfers);
      
      toast.success('داده‌ها با موفقیت به‌روزرسانی شد');
    } catch (error) {
      toast.error('خطا در به‌روزرسانی داده‌ها');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">انتقال‌های قطعات</h1>
          <p className="text-muted-foreground">تاریخچه انتقال‌های دریافتی و ارسالی</p>
        </div>
        <Button 
          className="bg-black hover:bg-gray-800 text-white"
          onClick={() => {
            // Select first transfer for demo
            if (filteredTransfers.length > 0) {
              setSelectedTransferForSale(filteredTransfers[0]);
              setShowSellModal(true);
            } else {
              toast.error('🛒 هیچ انتقالی برای فروش یافت نشد', {
                description: 'در حال حاضر قطعه‌ای برای فروش موجود نیست',
                duration: 4000,
              });
            }
          }}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          فروش قطعه
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-xs text-muted-foreground">کل انتقال‌ها</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">در انتظار</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">تکمیل شده</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xl font-bold text-indigo-600">{stats.incoming + stats.outgoing}</p>
              <p className="text-xs text-muted-foreground">مجموع تبادل</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>لیست انتقال‌ها</CardTitle>
          <CardDescription>
            مدیریت و مشاهده انتقال‌های قطعات
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="جستجو در انتقال‌ها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2 shrink-0"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'در حال بارگذاری...' : 'تازه‌سازی'}
            </Button>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="وضعیت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="pending">در انتظار</SelectItem>
                <SelectItem value="completed">تکمیل شده</SelectItem>
                <SelectItem value="cancelled">لغو شده</SelectItem>
              </SelectContent>
            </Select>
            <Select value={directionFilter} onValueChange={setDirectionFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="نوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه انواع</SelectItem>
                <SelectItem value="incoming">دریافتی</SelectItem>
                <SelectItem value="outgoing">ارسالی</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>قطعه</TableHead>
                  <TableHead>نوع انتقال</TableHead>
                  <TableHead>شرکت مقابل</TableHead>
                  <TableHead>تاریخ</TableHead>
                  <TableHead>دلیل</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransfers.map((transfer) => {
                  const StatusIcon = statusIcons[transfer.status];
                  return (
                    <TableRow key={transfer.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-blue-600" />
                          <div>
                            <div className="font-medium">{transfer.partName}</div>
                            <div className="text-sm text-muted-foreground">
                              {transfer.partSerial}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`${directionColors[transfer.direction]} flex items-center gap-1 w-fit`}
                        >
                          <ArrowRightLeft className="w-3 h-3" />
                          {directionLabels[transfer.direction]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          {transfer.otherCompanyName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          {transfer.transferDate}
                        </div>
                      </TableCell>
                      <TableCell>{transfer.reason}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={`${statusColors[transfer.status]} flex items-center gap-1 w-fit`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusLabels[transfer.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" dir="rtl">
                            <DropdownMenuItem 
                              onClick={() => setSelectedTransfer(transfer)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              مشاهده جزئیات
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
          
          {filteredTransfers.length === 0 && (
            <div className="text-center py-8">
              <ArrowRightLeft className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-muted-foreground">انتقالی یافت نشد</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transfer Details Modal */}
      {selectedTransfer && (
        <Dialog open={!!selectedTransfer} onOpenChange={() => setSelectedTransfer(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden" dir="rtl">
            <DialogHeader className="text-right">
              <DialogTitle className="text-right">جزئیات انتقال</DialogTitle>
              <DialogDescription className="text-right">
                اطلاعات کامل انتقال قطعه و تولید مدارک
              </DialogDescription>
            </DialogHeader>
            <div className="modal-scroll-container">
              <TransferDetailsView transfer={selectedTransfer} />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Sell Modal */}
      {showSellModal && selectedTransferForSale && (
        <SellModal
          isOpen={showSellModal}
          onClose={() => {
            setShowSellModal(false);
            setSelectedTransferForSale(null);
          }}
          partData={{
            id: selectedTransferForSale.partId,
            name: selectedTransferForSale.partName,
            serialNumber: selectedTransferForSale.partSerial,
            category: 'قطعات الکتریکی',
            currentOwner: 'شرکت آسانسار تهران'
          }}
        />
      )}
    </div>
  );
}

// Mock data functions and Transfer Details View component remain the same...
function TransferDetailsView({ transfer }: { transfer: Transfer }) {
  const StatusIcon = statusIcons[transfer.status];
  
  return (
    <div className="space-y-6" dir="rtl" data-transfer-modal-content>
      {/* Header - Certificate Title */}
      <div className="text-center border-b-2 border-primary pb-4 header">
        <div className="flex items-center justify-center gap-3 mb-2">
          <ArrowRightLeft className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold text-primary">برگه انتقال قطعه</h2>
        </div>
        <h3 className="text-lg text-muted-foreground">سامانه ردیابی قطعات و شناسنامه آسانسور</h3>
        <p className="text-muted-foreground">شماره انتقال: {transfer.id.padStart(8, '0')}</p>
        <p className="text-sm text-muted-foreground">تاریخ صدور: {new Date().toLocaleDateString('fa-IR')}</p>
      </div>

      {/* Transfer Information Section */}
      <div className="border rounded-lg p-6 bg-gradient-to-r from-orange-50 to-orange-100 section">
        <div className="flex items-center gap-2 mb-4 section-title">
          <ArrowRightLeft className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-bold text-orange-800">اطلاعات انتقال</h3>
        </div>
        
        <div className="section-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between border-b border-orange-200 pb-1">
                <span className="text-muted-foreground">نام قطعه:</span>
                <span className="font-medium">{transfer.partName}</span>
              </div>
              <div className="flex justify-between border-b border-orange-200 pb-1">
                <span className="text-muted-foreground">شماره سریال:</span>
                <span className="font-medium font-mono">{transfer.partSerial}</span>
              </div>
              <div className="flex justify-between border-b border-orange-200 pb-1">
                <span className="text-muted-foreground">نوع انتقال:</span>
                <Badge 
                  variant="outline" 
                  className={`${directionColors[transfer.direction]}`}
                >
                  {directionLabels[transfer.direction]}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between border-b border-orange-200 pb-1">
                <span className="text-muted-foreground">شرکت مقابل:</span>
                <span className="font-medium">{transfer.otherCompanyName}</span>
              </div>
              <div className="flex justify-between border-b border-orange-200 pb-1">
                <span className="text-muted-foreground">تاریخ انتقال:</span>
                <span className="font-medium">{transfer.transferDate}</span>
              </div>
              <div className="flex justify-between border-b border-orange-200 pb-1">
                <span className="text-muted-foreground">دلیل انتقال:</span>
                <span className="font-medium">{transfer.reason}</span>
              </div>
            </div>
          </div>

          {transfer.notes && (
            <div className="mt-4 p-3 bg-orange-200 rounded-lg">
              <p className="font-medium text-orange-700 mb-1">یادداشت:</p>
              <p className="text-orange-800">{transfer.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Status Section */}
      <div className="border rounded-lg p-6 bg-gradient-to-r from-purple-50 to-purple-100 section">
        <div className="flex items-center gap-2 mb-4 section-title">
          <CheckCircle className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-bold text-purple-800">وضعیت انتقال</h3>
        </div>
        <div className="text-center section-content">
          <Badge 
            variant="secondary" 
            className={`${statusColors[transfer.status]} text-lg px-6 py-2 flex items-center gap-2 justify-center w-fit mx-auto`}
          >
            <StatusIcon className="w-4 h-4" />
            {statusLabels[transfer.status]}
          </Badge>
          <p className="text-sm text-muted-foreground mt-2">
            آخرین به‌روزرسانی: {transfer.transferDate}
          </p>
        </div>
      </div>

      {/* Export and Print Buttons */}
      <div className="text-center pt-6 border-t border-gray-300">
        <div className="mb-4 flex gap-4 justify-center">
          <Button 
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 gap-2"
            size="lg"
          >
            <FileText className="h-5 w-5" />
            صدور PDF
            <Download className="h-4 w-4" />
          </Button>
          
          <Button 
            onClick={() => window.print()}
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 gap-2"
            size="lg"
          >
            <Printer className="h-5 w-5" />
            چاپ برگه
          </Button>
        </div>
        <div className="footer">
          <p className="text-xs text-muted-foreground">
            این برگه توسط سامانه جامع ردیابی قطعات و شناسنامه آسانسور تولید شده است
          </p>
          <p className="text-xs text-muted-foreground">
            تاریخ تولید: {new Date().toLocaleDateString('fa-IR')} - ساعت: {new Date().toLocaleTimeString('fa-IR')}
          </p>
          <p className="text-xs text-muted-foreground">
            🌐 https://elevatorid.ieeu.ir
          </p>
        </div>
      </div>
    </div>
  );
}