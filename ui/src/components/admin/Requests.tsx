import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  User,
  Calendar,
  Send,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Request {
  id: string;
  type: 'profile_update' | 'part_change' | 'complaint' | 'support';
  title: string;
  description: string;
  companyId: string;
  companyName: string;
  submittedBy: string;
  submitDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  adminResponse?: string;
  responseDate?: string;
  attachments?: string[];
}

const mockRequests: Request[] = [
  {
    id: '1',
    type: 'profile_update',
    title: 'درخواست به‌روزرسانی آدرس شرکت',
    description: 'به دلیل تغییر محل دفتر، نیاز به به‌روزرسانی آدرس ثبت‌شده در سیستم داریم.',
    companyId: '1',
    companyName: 'شرکت آسانسار تهران',
    submittedBy: 'احمد محمدی',
    submitDate: '۱۴۰۲/۰۹/۱۵',
    status: 'pending',
    priority: 'medium'
  },
  {
    id: '2',
    type: 'complaint',
    title: 'شکایت از تأخیر در تایید انتقال',
    description: 'درخواست انتقال قطعه با کد P001 بیش از ۲ هفته است که در انتظار تایید مانده است.',
    companyId: '2',
    companyName: 'شرکت قطعات پارس',
    submittedBy: 'مریم احمدی',
    submitDate: '۱۴۰۲/۰۹/۱۲',
    status: 'in_review',
    priority: 'high',
    adminResponse: 'درخواست شما در حال بررسی است و تا پایان هفته پاسخ داده خواهد شد.',
    responseDate: '۱۴۰۲/۰۹/۱۳'
  },
  {
    id: '3',
    type: 'support',
    title: 'راهنمایی برای ثبت آسانسور جدید',
    description: 'نحوه ثبت آسانسور جدید در سیستم را متوجه نمی‌شوم. لطفاً راهنمایی کنید.',
    companyId: '3',
    companyName: 'شرکت نصب سریع',
    submittedBy: 'علی رضایی',
    submitDate: '۱۴۰۲/۰۹/۱۰',
    status: 'approved',
    priority: 'low',
    adminResponse: 'راهنمای کامل ثبت آسانسور برای شما ارسال شد. در صورت نیاز به راهنمایی بیشتر با پشتیبانی تماس بگیرید.',
    responseDate: '۱۴۰۲/۰۹/۱۱'
  }
];

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

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

const priorityLabels = {
  low: 'کم',
  medium: 'متوسط',
  high: 'بالا',
  urgent: 'فوری'
};

const typeLabels = {
  profile_update: 'به‌روزرسانی پروفایل',
  part_change: 'تغییر قطعه',
  complaint: 'شکایت',
  support: 'پشتیبانی'
};

export default function Requests() {
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call to refresh data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset to original mock data (in real app, fetch from API)
      setRequests(mockRequests);
      
      toast.success('داده‌ها با موفقیت به‌روزرسانی شد');
    } catch (error) {
      toast.error('خطا در به‌روزرسانی داده‌ها');
    } finally {
      setIsRefreshing(false);
    }
  };

  const getRequestStats = () => {
    const stats = {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      in_review: requests.filter(r => r.status === 'in_review').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length
    };
    return stats;
  };

  const stats = getRequestStats();

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesType = typeFilter === 'all' || request.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleApprove = (request: Request) => {
    setRequests(prev => prev.map(r => 
      r.id === request.id 
        ? { ...r, status: 'approved', responseDate: '۱۴۰۲/۰۹/۱۶' }
        : r
    ));
    toast.success('درخواست تایید شد');
  };

  const handleReject = (request: Request) => {
    setSelectedRequest(request);
    setIsResponseModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">درخواست‌ها و شکایات</h1>
        <p className="text-muted-foreground">بررسی و پاسخ به درخواست‌های کاربران</p>
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
        
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xl font-bold text-orange-600">{stats.in_review}</p>
              <p className="text-xs text-muted-foreground">در حال بررسی</p>
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
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="جستجو بر اساس عنوان یا شرکت..."
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
                  <SelectItem value="in_review">در حال بررسی</SelectItem>
                  <SelectItem value="approved">تایید شده</SelectItem>
                  <SelectItem value="rejected">رد شده</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="نوع درخواست" />
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
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>عنوان درخواست</TableHead>
                  <TableHead>نوع</TableHead>
                  <TableHead>شرکت</TableHead>
                  <TableHead>ارسال‌کننده</TableHead>
                  <TableHead>تاریخ ثبت</TableHead>
                  <TableHead>اولویت</TableHead>
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
                            <div className="font-medium max-w-xs truncate">{request.title}</div>
                            <div className="text-sm text-muted-foreground max-w-xs truncate">
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
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          {request.companyName}
                        </div>
                      </TableCell>
                      <TableCell>{request.submittedBy}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          {request.submitDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={priorityColors[request.priority]}
                        >
                          {priorityLabels[request.priority]}
                        </Badge>
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
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => setSelectedRequest(request)}
                            >
                              <Eye className="w-4 h-4 ml-2" />
                              مشاهده جزئیات
                            </DropdownMenuItem>
                            {request.status === 'pending' && (
                              <>
                                <DropdownMenuItem 
                                  onClick={() => handleApprove(request)}
                                  className="text-green-600"
                                >
                                  <CheckCircle className="w-4 h-4 ml-2" />
                                  تایید
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleReject(request)}
                                  className="text-red-600"
                                >
                                  <XCircle className="w-4 h-4 ml-2" />
                                  رد
                                </DropdownMenuItem>
                              </>
                            )}
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
      {selectedRequest && !isResponseModalOpen && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>جزئیات درخواست</DialogTitle>
              <DialogDescription>
                اطلاعات کامل درخواست ثبت‌شده
              </DialogDescription>
            </DialogHeader>
            <RequestDetailsView 
              request={selectedRequest} 
              onApprove={() => {
                handleApprove(selectedRequest);
                setSelectedRequest(null);
              }}
              onReject={() => {
                setIsResponseModalOpen(true);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Response Modal */}
      {isResponseModalOpen && selectedRequest && (
        <Dialog open={isResponseModalOpen} onOpenChange={() => {
          setIsResponseModalOpen(false);
          setSelectedRequest(null);
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>پاسخ به درخواست</DialogTitle>
              <DialogDescription>
                علت رد یا پاسخ خود را ثبت کنید
              </DialogDescription>
            </DialogHeader>
            <ResponseForm 
              request={selectedRequest}
              onSubmit={(response: string, action: 'approve' | 'reject') => {
                setRequests(prev => prev.map(r => 
                  r.id === selectedRequest.id 
                    ? { 
                        ...r, 
                        status: action === 'approve' ? 'approved' : 'rejected',
                        adminResponse: response,
                        responseDate: '۱۴۰۲/۰۹/۱۶'
                      }
                    : r
                ));
                setIsResponseModalOpen(false);
                setSelectedRequest(null);
                toast.success(`درخواست ${action === 'approve' ? 'تایید' : 'رد'} شد`);
              }}
              onClose={() => {
                setIsResponseModalOpen(false);
                setSelectedRequest(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function RequestDetailsView({ 
  request, 
  onApprove, 
  onReject 
}: { 
  request: Request; 
  onApprove: () => void;
  onReject: () => void;
}) {
  const StatusIcon = statusIcons[request.status];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">اطلاعات درخواست</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">نوع:</span>
              <span className="mr-2 font-medium">{typeLabels[request.type]}</span>
            </div>
            <div>
              <span className="text-muted-foreground">اولویت:</span>
              <Badge className={`mr-2 ${priorityColors[request.priority]}`}>
                {priorityLabels[request.priority]}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">تاریخ ثبت:</span>
              <span className="mr-2 font-medium">{request.submitDate}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">وضعیت درخواست</h4>
          <Badge 
            variant="secondary" 
            className={`${statusColors[request.status]} flex items-center gap-1 w-fit`}
          >
            <StatusIcon className="w-3 h-3" />
            {statusLabels[request.status]}
          </Badge>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">اطلاعات ارسال‌کننده</h4>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">شرکت:</span>
            <span className="mr-2 font-medium">{request.companyName}</span>
          </div>
          <div>
            <span className="text-muted-foreground">ارسال‌کننده:</span>
            <span className="mr-2 font-medium">{request.submittedBy}</span>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">عنوان درخواست</h4>
        <p className="font-medium">{request.title}</p>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">شرح درخواست</h4>
        <p className="text-sm bg-gray-50 p-3 rounded-lg">{request.description}</p>
      </div>
      
      {request.adminResponse && (
        <div>
          <h4 className="font-medium mb-2">پاسخ مدیر</h4>
          <p className="text-sm bg-blue-50 p-3 rounded-lg">{request.adminResponse}</p>
          <p className="text-xs text-muted-foreground mt-1">
            تاریخ پاسخ: {request.responseDate}
          </p>
        </div>
      )}
      
      {request.status === 'pending' && (
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onReject}>
            <XCircle className="w-4 h-4 ml-2" />
            رد درخواست
          </Button>
          <Button onClick={onApprove}>
            <CheckCircle className="w-4 h-4 ml-2" />
            تایید درخواست
          </Button>
        </div>
      )}
    </div>
  );
}

function ResponseForm({ 
  request, 
  onSubmit, 
  onClose 
}: { 
  request: Request;
  onSubmit: (response: string, action: 'approve' | 'reject') => void;
  onClose: () => void;
}) {
  const [response, setResponse] = useState('');
  const [action, setAction] = useState<'approve' | 'reject'>('reject');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!response.trim()) {
      toast.error('لطفاً پاسخ خود را وارد کنید');
      return;
    }
    onSubmit(response, action);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">درخواست: {request.title}</h4>
        <p className="text-sm text-muted-foreground mb-4">{request.description}</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="response">پاسخ شما</Label>
        <Textarea
          id="response"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="پاسخ یا علت رد درخواست را وارد کنید..."
          rows={4}
          required
        />
      </div>
      
      <div className="flex items-center gap-4">
        <Label>نوع پاسخ:</Label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="action"
              value="approve"
              checked={action === 'approve'}
              onChange={(e) => setAction(e.target.value as 'approve' | 'reject')}
            />
            <span className="text-green-600">تایید</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="action"
              value="reject"
              checked={action === 'reject'}
              onChange={(e) => setAction(e.target.value as 'approve' | 'reject')}
            />
            <span className="text-red-600">رد</span>
          </label>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          انصراف
        </Button>
        <Button type="submit">
          <Send className="w-4 h-4 ml-2" />
          ارسال پاسخ
        </Button>
      </div>
    </form>
  );
}