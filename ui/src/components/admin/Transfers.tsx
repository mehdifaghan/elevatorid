import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  Download,
  ArrowRightLeft,
  User,
  Package,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Transfer {
  id: string;
  partId: string;
  partName: string;
  partSerial: string;
  fromCompanyId: string;
  fromCompanyName: string;
  toCompanyId: string;
  toCompanyName: string;
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
    fromCompanyId: '1',
    fromCompanyName: 'شرکت قطعات پارس',
    toCompanyId: '2',
    toCompanyName: 'شرکت آسانسار تهران',
    transferDate: '۱۴۰۲/۰۹/۱۵',
    status: 'completed',
    reason: 'فروش'
  },
  {
    id: '2',
    partId: 'P002',
    partName: 'کنترلر فرکانس VFD',
    partSerial: 'VFD5005678',
    fromCompanyId: '2',
    fromCompanyName: 'شرکت آسانسار تهران',
    toCompanyId: '3',
    toCompanyName: 'شرکت نصب سریع',
    transferDate: '۱۴۰۲/۰۹/۱۲',
    status: 'pending',
    reason: 'انتقال برای نصب',
    notes: 'در انتظار تایید مدیرعامل'
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

export default function Transfers() {
  const [transfers, setTransfers] = useState<Transfer[]>(mockTransfers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = transfer.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.partSerial.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.fromCompanyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.toCompanyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transfer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getTransferStats = () => {
    const stats = {
      total: transfers.length,
      pending: transfers.filter(t => t.status === 'pending').length,
      completed: transfers.filter(t => t.status === 'completed').length,
      cancelled: transfers.filter(t => t.status === 'cancelled').length
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
      <div>
        <h1 className="text-3xl font-bold">انتقال‌های قطعات</h1>
        <p className="text-muted-foreground">تاریخچه تمامی انتقال‌های انجام شده</p>
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
        
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xl font-bold text-red-600">{stats.cancelled}</p>
              <p className="text-xs text-muted-foreground">لغو شده</p>
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
                  placeholder="جستجو بر اساس قطعه یا شرکت..."
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
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="pending">در انتظار</SelectItem>
                  <SelectItem value="completed">تکمیل شده</SelectItem>
                  <SelectItem value="cancelled">لغو شده</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                خروجی CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>قطعه</TableHead>
                  <TableHead>از شرکت</TableHead>
                  <TableHead>به شرکت</TableHead>
                  <TableHead>تاریخ انتقال</TableHead>
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
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          {transfer.fromCompanyName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          {transfer.toCompanyName}
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
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              دانلود مدارک
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
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader className="text-right">
              <DialogTitle className="text-right">جزئیات انتقال</DialogTitle>
              <DialogDescription className="text-right">
                اطلاعات کامل انتقال قطعه
              </DialogDescription>
            </DialogHeader>
            <TransferDetailsView transfer={selectedTransfer} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function TransferDetailsView({ transfer }: { transfer: Transfer }) {
  const StatusIcon = statusIcons[transfer.status];
  
  return (
    <div className="space-y-6" dir="rtl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">اطلاعات قطعه</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">نام قطعه:</span>
              <span className="mr-2 font-medium">{transfer.partName}</span>
            </div>
            <div>
              <span className="text-muted-foreground">شماره سریال:</span>
              <span className="mr-2 font-medium">{transfer.partSerial}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">وضعیت انتقال</h4>
          <Badge 
            variant="secondary" 
            className={`${statusColors[transfer.status]} flex items-center gap-1 w-fit`}
          >
            <StatusIcon className="w-3 h-3" />
            {statusLabels[transfer.status]}
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">شرکت فرستنده</h4>
          <p className="text-sm">{transfer.fromCompanyName}</p>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">شرکت گیرنده</h4>
          <p className="text-sm">{transfer.toCompanyName}</p>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">جزئیات انتقال</h4>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">تاریخ انتقال:</span>
            <span className="mr-2 font-medium">{transfer.transferDate}</span>
          </div>
          <div>
            <span className="text-muted-foreground">دلیل انتقال:</span>
            <span className="mr-2 font-medium">{transfer.reason}</span>
          </div>
          {transfer.notes && (
            <div>
              <span className="text-muted-foreground">یادداشت:</span>
              <span className="mr-2">{transfer.notes}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}