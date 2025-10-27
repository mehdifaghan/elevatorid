import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { 
  Search, 
  Plus,
  MoreHorizontal, 
  Eye, 
  MessageSquare,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  RefreshCw,
  Wifi,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { realApiRequest } from '../../lib/real-api-client';

interface Request {
  id: string;
  type: 'profile_update' | 'part_change' | 'complaint' | 'support';
  title: string;
  description: string;
  submitDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  adminResponse?: string;
  responseDate?: string;
  attachments?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface RequestStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  inReview: number;
}

export default function UserRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState<RequestStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    inReview: 0
  });



  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    in_review: 'bg-blue-100 text-blue-800'
  };

  const statusLabels = {
    pending: 'در انتظار',
    approved: 'تایید شده',
    rejected: 'رد شده',
    in_review: 'در حال بررسی'
  };

  const statusIcons = {
    pending: Clock,
    approved: CheckCircle,
    rejected: XCircle,
    in_review: AlertCircle
  };

  const typeLabels = {
    profile_update: 'به‌روزرسانی پروفایل',
    part_change: 'تغییر قطعه',
    complaint: 'شکایت',
    support: 'پشتیبانی'
  };

  const priorityColors = {
    low: 'text-gray-600',
    medium: 'text-blue-600',
    high: 'text-orange-600',
    urgent: 'text-red-600'
  };

  const priorityLabels = {
    low: 'کم',
    medium: 'متوسط',
    high: 'بالا',
    urgent: 'فوری'
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      
      // Fetch requests
      const requestsResponse = await realApiRequest.get('/user/requests');
      const requests = requestsResponse.data.requests || [];
      setRequests(requests);
      setStats(calculateStats(requests));

    } catch (error: any) {
      console.error('Error fetching requests:', error);
      toast.error('خطا در بارگذاری اطلاعات درخواست‌ها');
      
      // Set empty states
      setRequests([]);
      setStats({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        inReview: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (requestsList: Request[]): RequestStats => {
    return {
      total: requestsList.length,
      pending: requestsList.filter(r => r.status === 'pending').length,
      approved: requestsList.filter(r => r.status === 'approved').length,
      rejected: requestsList.filter(r => r.status === 'rejected').length,
      inReview: requestsList.filter(r => r.status === 'in_review').length
    };
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesType = typeFilter === 'all' || request.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchRequests();
    setIsRefreshing(false);
    toast.success('درخواست‌ها با موفقیت به‌روزرسانی شد');
  };

  const handleCreateRequest = async (requestData: any) => {
    try {
      const response = await realApiRequest.post('/user/requests', requestData);
      if (response.data) {
        await fetchRequests(); // Refresh the list
        toast.success('درخواست جدید با موفقیت ثبت شد');
      }
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error('خطا در ثبت درخواست جدید');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">در حال بارگذاری درخواست‌ها...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">


      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">درخواست‌ها و شکایات</h1>
          <p className="text-muted-foreground">مدیریت درخواست‌ها و پیگیری وضعیت</p>
        </div>
        <Button
          onClick={() => setIsNewRequestModalOpen(true)}
          className="bg-black hover:bg-gray-800 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          درخواست جدید
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-xs text-muted-foreground">کل درخواست‌ها</p>
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
              <p className="text-xl font-bold text-green-600">{stats.approved}</p>
              <p className="text-xs text-muted-foreground">تایید شده</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xl font-bold text-red-600">{stats.rejected}</p>
              <p className="text-xs text-muted-foreground">رد شده</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xl font-bold text-indigo-600">{stats.inReview}</p>
              <p className="text-xs text-muted-foreground">در حال بررسی</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>لیست درخواست‌ها</CardTitle>
          <CardDescription>
            مشاهده و مدیریت درخواست‌ها و شکایات ارسالی
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="جستجو در درخواست‌ها..."
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
                <SelectItem value="approved">تایید شده</SelectItem>
                <SelectItem value="rejected">رد شده</SelectItem>
                <SelectItem value="in_review">در حال بررسی</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="نوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه انواع</SelectItem>
                <SelectItem value="profile_update">به‌روزرسانی پروفایل</SelectItem>
                <SelectItem value="part_change">تغییر قطعه</SelectItem>
                <SelectItem value="complaint">شکایت</SelectItem>
                <SelectItem value="support">پشتیبانی</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>عنوان درخواست</TableHead>
                  <TableHead>نوع</TableHead>
                  <TableHead>اولویت</TableHead>
                  <TableHead>تاریخ ثبت</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => {
                  const StatusIcon = statusIcons[request.status];
                  return (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-blue-600" />
                          <div>
                            <div className="font-medium">{request.title}</div>
                            <div className="text-sm text-muted-foreground max-w-md truncate">
                              {request.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {typeLabels[request.type]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${priorityColors[request.priority]}`}>
                          {priorityLabels[request.priority]}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          {request.submitDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={`${statusColors[request.status]} flex items-center gap-1 w-fit`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusLabels[request.status]}
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
                              onClick={() => setSelectedRequest(request)}
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
          
          {filteredRequests.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-muted-foreground">درخواستی یافت نشد</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Details Modal */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader className="text-right">
              <DialogTitle className="text-right">جزئیات درخواست</DialogTitle>
              <DialogDescription className="text-right">
                مشاهده اطلاعات کامل درخواست و پاسخ ادمین
              </DialogDescription>
            </DialogHeader>
            <RequestDetailsView request={selectedRequest} />
          </DialogContent>
        </Dialog>
      )}

      {/* New Request Modal */}
      {isNewRequestModalOpen && (
        <Dialog open={isNewRequestModalOpen} onOpenChange={setIsNewRequestModalOpen}>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader className="text-right">
              <DialogTitle className="text-right">ثبت درخواست جدید</DialogTitle>
              <DialogDescription className="text-right">
                اطلاعات درخواست جدید را وارد کنید
              </DialogDescription>
            </DialogHeader>
            <NewRequestForm 
              onSubmit={handleCreateRequest}
              onClose={() => setIsNewRequestModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Request Details View
function RequestDetailsView({ request }: { request: Request }) {
  const StatusIcon = statusIcons[request.status];
  
  return (
    <div className="space-y-6" dir="rtl">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{request.title}</h3>
            <Badge variant="outline" className="mt-1">
              {typeLabels[request.type]}
            </Badge>
          </div>
          <Badge 
            variant="secondary" 
            className={`${statusColors[request.status]} flex items-center gap-1`}
          >
            <StatusIcon className="w-3 h-3" />
            {statusLabels[request.status]}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">تاریخ ثبت:</span>
            <p className="font-medium">{request.submitDate}</p>
          </div>
          <div>
            <span className="text-muted-foreground">اولویت:</span>
            <p className={`font-medium ${priorityColors[request.priority]}`}>
              {priorityLabels[request.priority]}
            </p>
          </div>
        </div>

        <div>
          <span className="text-muted-foreground">شرح درخواست:</span>
          <p className="mt-1 p-3 bg-gray-50 rounded-lg text-sm">
            {request.description}
          </p>
        </div>

        {request.adminResponse && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">پاسخ ادمین:</span>
              {request.responseDate && (
                <span className="text-sm text-muted-foreground">
                  {request.responseDate}
                </span>
              )}
            </div>
            <p className="p-3 bg-blue-50 rounded-lg text-sm">
              {request.adminResponse}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// New Request Form
function NewRequestForm({ 
  onSubmit, 
  onClose 
}: { 
  onSubmit: (data: any) => Promise<void>; 
  onClose: () => void; 
}) {
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.title || !formData.description) {
      toast.error('لطفاً تمام فیلدهای ضروری را پر کنید');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>نوع درخواست *</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="نوع درخواست را انتخاب کنید" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="profile_update">به‌روزرسانی پروفایل</SelectItem>
            <SelectItem value="part_change">تغییر قطعه</SelectItem>
            <SelectItem value="complaint">شکایت</SelectItem>
            <SelectItem value="support">پشتیبانی</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>عنوان درخواست *</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="عنوان مختصر درخواست"
          className="text-right"
        />
      </div>

      <div className="space-y-2">
        <Label>اولویت</Label>
        <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">کم</SelectItem>
            <SelectItem value="medium">متوسط</SelectItem>
            <SelectItem value="high">بالا</SelectItem>
            <SelectItem value="urgent">فوری</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>شرح درخواست *</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="شرح کامل درخواست خود را بنویسید..."
          className="min-h-24 text-right"
          dir="rtl"
        />
      </div>

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
            'ثبت درخواست'
          )}
        </Button>
      </div>
    </form>
  );
}