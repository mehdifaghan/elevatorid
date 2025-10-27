import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Skeleton } from '../ui/skeleton';
import { 
  Search, 
  Eye, 
  ArrowRightLeft,
  User,
  Package,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Loader2,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { realApiRequest, RealApiError } from '../../lib/real-api-client';

interface TransferStats {
  total: number;
  pending: number;
  completed: number;
  cancelled: number;
  thisMonth: number;
  lastMonth: number;
  monthlyGrowth: number;
}

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
  documents?: string[];
  createdAt: string;
  updatedAt?: string;
}

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
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [stats, setStats] = useState<TransferStats>({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    thisMonth: 0,
    lastMonth: 0,
    monthlyGrowth: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchTransfers();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      
      // Use real API request
      const data = await realApiRequest.get('/admin/transfers/stats');
      const fetchedStats = data.stats || data;
      
      // Map API response to our interface
      const mappedStats: TransferStats = {
        total: fetchedStats.total || 0,
        pending: fetchedStats.pending || 0,
        completed: fetchedStats.completed || 0,
        cancelled: fetchedStats.cancelled || 0,
        thisMonth: fetchedStats.this_month || fetchedStats.thisMonth || 0,
        lastMonth: fetchedStats.last_month || fetchedStats.lastMonth || 0,
        monthlyGrowth: fetchedStats.monthly_growth || fetchedStats.monthlyGrowth || 0
      };
      
      setStats(mappedStats);
    } catch (error) {
      console.error('Error fetching transfer stats:', error);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای دریافت آمار انتقال‌ها');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت در دریافت آمار');
        } else {
          toast.error('خطا در بارگذاری آمار انتقال‌ها');
        }
      } else {
        toast.error('خطا در بارگذاری آمار انتقال‌ها');
      }
      
      // Set default empty stats on error
      setStats({
        total: 0,
        pending: 0,
        completed: 0,
        cancelled: 0,
        thisMonth: 0,
        lastMonth: 0,
        monthlyGrowth: 0
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      
      // Use real API request
      const data = await realApiRequest.get('/admin/transfers');
      const fetchedTransfers = data.transfers || data.data || data || [];
      
      // Map API response to our interface if needed
      const mappedTransfers = Array.isArray(fetchedTransfers) ? fetchedTransfers.map((transfer: any) => ({
        id: transfer.id?.toString() || transfer._id?.toString(),
        partId: transfer.part_id?.toString() || transfer.partId?.toString(),
        partName: transfer.part_name || transfer.partName || 'نامشخص',
        partSerial: transfer.part_serial || transfer.partSerial || 'نامشخص',
        fromCompanyId: transfer.from_company_id?.toString() || transfer.fromCompanyId?.toString(),
        fromCompanyName: transfer.from_company_name || transfer.fromCompanyName || 'نامشخص',
        toCompanyId: transfer.to_company_id?.toString() || transfer.toCompanyId?.toString(),
        toCompanyName: transfer.to_company_name || transfer.toCompanyName || 'نامشخص',
        transferDate: transfer.transfer_date || transfer.transferDate || new Date().toLocaleDateString('fa-IR'),
        status: transfer.status || 'pending',
        reason: transfer.reason || 'نامشخص',
        notes: transfer.notes,
        documents: transfer.documents || [],
        createdAt: transfer.created_at || transfer.createdAt || new Date().toLocaleDateString('fa-IR'),
        updatedAt: transfer.updated_at || transfer.updatedAt
      })) : [];
      
      setTransfers(mappedTransfers);
    } catch (error) {
      console.error('Error fetching transfers:', error);
      
      // Set empty array on error
      setTransfers([]);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای دریافت انتقال‌ها');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت در دریافت انتقال‌ها');
        } else {
          toast.error('خطا در بارگذاری انتقال‌ها');
        }
      } else {
        toast.error('خطا در بارگذاری انتقال‌ها');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = transfer.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.partSerial.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.fromCompanyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.toCompanyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transfer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const fetchTransferDetails = async (transferId: string) => {
    try {
      setDetailsLoading(true);
      
      // Use real API request to get detailed transfer information
      const data = await realApiRequest.get(`/admin/transfers/${transferId}`);
      const transferDetails = data.transfer || data;
      
      // Map to our interface
      const mappedTransfer: Transfer = {
        id: transferDetails.id?.toString() || transferDetails._id?.toString(),
        partId: transferDetails.part_id?.toString() || transferDetails.partId?.toString(),
        partName: transferDetails.part_name || transferDetails.partName || 'نامشخص',
        partSerial: transferDetails.part_serial || transferDetails.partSerial || 'نامشخص',
        fromCompanyId: transferDetails.from_company_id?.toString() || transferDetails.fromCompanyId?.toString(),
        fromCompanyName: transferDetails.from_company_name || transferDetails.fromCompanyName || 'نامشخص',
        toCompanyId: transferDetails.to_company_id?.toString() || transferDetails.toCompanyId?.toString(),
        toCompanyName: transferDetails.to_company_name || transferDetails.toCompanyName || 'نامشخص',
        transferDate: transferDetails.transfer_date || transferDetails.transferDate || new Date().toLocaleDateString('fa-IR'),
        status: transferDetails.status || 'pending',
        reason: transferDetails.reason || 'نامشخص',
        notes: transferDetails.notes,
        documents: transferDetails.documents || [],
        createdAt: transferDetails.created_at || transferDetails.createdAt || new Date().toLocaleDateString('fa-IR'),
        updatedAt: transferDetails.updated_at || transferDetails.updatedAt
      };
      
      setSelectedTransfer(mappedTransfer);
    } catch (error) {
      console.error('Error fetching transfer details:', error);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای دریافت جزئیات انتقال');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت در دریافت جزئیات');
        } else {
          toast.error('خطا در بارگذاری جزئیات انتقال');
        }
      } else {
        toast.error('خطا در بارگذاری جزئیات انتقال');
      }
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([fetchTransfers(), fetchStats()]);
      toast.success('داده‌ها با موفقیت به‌روزرسانی شد');
    } catch (error) {
      toast.error('خطا در به‌روزرسانی داده‌ها');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleViewDetails = async (transferId: string) => {
    await fetchTransferDetails(transferId);
  };

  const handleExportCSV = async () => {
    try {
      // Use real API request for CSV export
      const response = await realApiRequest.get('/admin/transfers/export/csv', {
        responseType: 'blob'
      });
      
      // Create blob from response
      const blob = new Blob([response], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `transfers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('فایل CSV با موفقیت صادر شد');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای صادرات فایل');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت در صادرات');
        } else {
          toast.error('خطا در صادرات فایل CSV');
        }
      } else {
        toast.error('خطا در صادرات فایل CSV');
      }
    }
  };



  return (
    <div className="space-y-6" dir="rtl">
      <div className="text-right">
        <h1 className="text-3xl font-bold">انتقال‌های قطعات</h1>
        <p className="text-muted-foreground">تاریخچه تمامی انتقال‌های انجام شده</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-3">
            <div className="text-center">
              {statsLoading ? (
                <Skeleton className="h-6 w-12 mx-auto mb-1" />
              ) : (
                <p className="text-xl font-bold text-blue-600">{stats.total}</p>
              )}
              <p className="text-xs text-muted-foreground">کل انتقال‌ها</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-3">
            <div className="text-center">
              {statsLoading ? (
                <Skeleton className="h-6 w-12 mx-auto mb-1" />
              ) : (
                <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
              )}
              <p className="text-xs text-muted-foreground">در انتظار</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-3">
            <div className="text-center">
              {statsLoading ? (
                <Skeleton className="h-6 w-12 mx-auto mb-1" />
              ) : (
                <p className="text-xl font-bold text-green-600">{stats.completed}</p>
              )}
              <p className="text-xs text-muted-foreground">تکمیل شده</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-3">
            <div className="text-center">
              {statsLoading ? (
                <Skeleton className="h-6 w-12 mx-auto mb-1" />
              ) : (
                <p className="text-xl font-bold text-red-600">{stats.cancelled}</p>
              )}
              <p className="text-xs text-muted-foreground">لغو شده</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-3">
            <div className="text-center">
              {statsLoading ? (
                <Skeleton className="h-6 w-12 mx-auto mb-1" />
              ) : (
                <div className="flex items-center justify-center gap-1">
                  <p className="text-xl font-bold text-purple-600">{stats.thisMonth}</p>
                  {stats.monthlyGrowth !== 0 && (
                    stats.monthlyGrowth > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )
                  )}
                </div>
              )}
              <p className="text-xs text-muted-foreground">این ماه</p>
              {!statsLoading && stats.monthlyGrowth !== 0 && (
                <p className={`text-xs ${stats.monthlyGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.monthlyGrowth > 0 ? '+' : ''}{Math.round(stats.monthlyGrowth)}%
                </p>
              )}
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
                  style={{ textAlign: 'right', direction: 'rtl' }}
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
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
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
                  <TableHead className="text-right">قطعه</TableHead>
                  <TableHead className="text-right">از شرکت</TableHead>
                  <TableHead className="text-right">به شرکت</TableHead>
                  <TableHead className="text-right">تاریخ انتقال</TableHead>
                  <TableHead className="text-right">دلیل</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Loading skeleton rows
                  [...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-4 h-4" />
                          <div>
                            <Skeleton className="h-4 w-24 mb-1" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-4 h-4" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-4 h-4" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-4 h-4" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  filteredTransfers.map((transfer) => {
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
                        <TableCell className="max-w-xs truncate">{transfer.reason}</TableCell>
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(transfer.id)}
                            disabled={detailsLoading}
                            className="gap-2"
                          >
                            {detailsLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                            {detailsLoading ? 'در حال بارگذاری...' : 'مشاهده جزئیات'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          
          {!loading && filteredTransfers.length === 0 && (
            <div className="text-center py-8">
              <ArrowRightLeft className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">انتقالی یافت نشد</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'نتیجه‌ای برای فیلترهای اعمال شده یافت نشد' 
                  : 'هنوز هیچ انتقالی انجام نشده است'
                }
              </p>
              {(searchTerm || statusFilter !== 'all') && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="mt-4"
                >
                  پاک کردن فیلترها
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transfer Details Modal */}
      {selectedTransfer && (
        <Dialog open={!!selectedTransfer} onOpenChange={() => setSelectedTransfer(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh]" style={{ direction: 'rtl', textAlign: 'right' }}>
            <DialogHeader style={{ textAlign: 'right' }}>
              <DialogTitle style={{ textAlign: 'right' }}>جزئیات انتقال</DialogTitle>
              <DialogDescription style={{ textAlign: 'right' }}>
                اطلاعات کامل انتقال قطعه
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[calc(90vh-8rem)] overflow-auto">
              {detailsLoading ? (
                <TransferDetailsLoading />
              ) : (
                <TransferDetailsView transfer={selectedTransfer} />
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function TransferDetailsLoading() {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Skeleton className="h-5 w-24 mb-2" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        
        <div>
          <Skeleton className="h-5 w-24 mb-2" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Skeleton className="h-5 w-24 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        
        <div>
          <Skeleton className="h-5 w-24 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      
      <div>
        <Skeleton className="h-5 w-24 mb-2" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}

function TransferDetailsView({ transfer }: { transfer: Transfer }) {
  const StatusIcon = statusIcons[transfer.status];
  
  return (
    <div className="space-y-6" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              اطلاعات قطعه
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">نام قطعه:</span>
                <span className="font-medium">{transfer.partName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">شماره سریال:</span>
                <span className="font-medium">{transfer.partSerial}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">شناسه قطعه:</span>
                <span className="font-medium">{transfer.partId}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              وضعیت انتقال
            </h4>
            <div className="space-y-3">
              <Badge 
                variant="secondary" 
                className={`${statusColors[transfer.status]} flex items-center gap-2 w-fit text-sm`}
              >
                <StatusIcon className="w-4 h-4" />
                {statusLabels[transfer.status]}
              </Badge>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">تاریخ ایجاد:</span>
                  <span className="font-medium">{transfer.createdAt}</span>
                </div>
                {transfer.updatedAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">آخرین بروزرسانی:</span>
                    <span className="font-medium">{transfer.updatedAt}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-600" />
              شرکت فرستنده
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">نام شرکت:</span>
                <span className="font-medium">{transfer.fromCompanyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">شناسه:</span>
                <span className="font-medium">{transfer.fromCompanyId}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              شرکت گیرنده
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">نام شرکت:</span>
                <span className="font-medium">{transfer.toCompanyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">شناسه:</span>
                <span className="font-medium">{transfer.toCompanyId}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            جزئیات انتقال
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">تاریخ انتقال:</span>
              <span className="font-medium">{transfer.transferDate}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-muted-foreground">دلیل انتقال:</span>
              <span className="font-medium text-left max-w-xs">{transfer.reason}</span>
            </div>
            {transfer.notes && (
              <div className="pt-2 border-t">
                <span className="text-muted-foreground block mb-2">یادداشت:</span>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">{transfer.notes}</p>
              </div>
            )}
            {transfer.documents && transfer.documents.length > 0 && (
              <div className="pt-2 border-t">
                <span className="text-muted-foreground block mb-2">مدارک ضمیمه:</span>
                <div className="flex flex-wrap gap-2">
                  {transfer.documents.map((doc, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      📎 {doc}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}