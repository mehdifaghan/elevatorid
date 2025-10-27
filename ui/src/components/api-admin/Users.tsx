import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Skeleton } from '../ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  MessageSquare, 
  UserX, 
  Trash2,
  Download,
  RefreshCw,
  Settings,
  Loader2,
  Users as UsersIcon,
  UserCheck,
  UserMinus,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { realApiRequest, RealApiError } from '../../lib/real-api-client';

interface UserStats {
  total: number;
  active: number;
  pending: number;
  suspended: number;
  thisMonth: number;
  lastMonth: number;
  monthlyGrowth: number;
}

interface UserSummary {
  id: number;
  companyName: string;
  phone: string;
  email?: string;
  status: 'active' | 'suspended' | 'pending';
  profileTypes: string[];
  createdAt?: string;
  lastActive?: string;
}

interface UserDetails extends UserSummary {
  company?: {
    name: string;
    tradeId?: string;
    province?: string;
    city?: string;
    address?: string;
  };
  profiles?: Array<{
    id: number;
    profileType: string;
    isActive: boolean;
  }>;
}

const statusColors = {
  active: 'bg-green-100 text-green-800',
  suspended: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800'
};

const getUserStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: 'فعال',
    suspended: 'معلق',
    pending: 'در انتظار تایید'
  };
  return labels[status] || status;
};

const getProfileTypeLabel = (profileType: string) => {
  const labels: Record<string, string> = {
    producer: 'تولیدکننده',
    importer: 'وارد کننده',
    installer: 'نصابی',
    seller: 'فروشنده',
    coop_org: 'سازمان همکار'
  };
  return labels[profileType] || profileType;
};

const formatPhoneNumber = (phone: string) => {
  if (!phone) return '';
  // Format Iranian phone numbers
  if (phone.startsWith('98')) {
    return phone.replace(/^98/, '+98 ');
  }
  if (phone.startsWith('09')) {
    return phone.replace(/^(\d{4})(\d{3})(\d{4})$/, '$1 $2 $3');
  }
  return phone;
};

export default function Users() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0,
    thisMonth: 0,
    lastMonth: 0,
    monthlyGrowth: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [userForAccessEdit, setUserForAccessEdit] = useState<UserSummary | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, statusFilter]);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      
      // Use real API request
      const data = await realApiRequest.get('/admin/users/stats');
      const fetchedStats = data.stats || data;
      
      // Map API response to our interface
      const mappedStats: UserStats = {
        total: fetchedStats.total || 0,
        active: fetchedStats.active || 0,
        pending: fetchedStats.pending || 0,
        suspended: fetchedStats.suspended || 0,
        thisMonth: fetchedStats.this_month || fetchedStats.thisMonth || 0,
        lastMonth: fetchedStats.last_month || fetchedStats.lastMonth || 0,
        monthlyGrowth: fetchedStats.monthly_growth || fetchedStats.monthlyGrowth || 0
      };
      
      setStats(mappedStats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای دریافت آمار کاربران');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت در دریافت آمار');
        } else {
          toast.error('خطا در بارگذاری آمار کاربران');
        }
      } else {
        toast.error('خطا در بارگذاری آمار کاربران');
      }
      
      // Set default empty stats on error
      setStats({
        total: 0,
        active: 0,
        pending: 0,
        suspended: 0,
        thisMonth: 0,
        lastMonth: 0,
        monthlyGrowth: 0
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Build search parameters
      const params: any = {};
      if (searchTerm) params.q = searchTerm;
      if (statusFilter !== 'all') params.status = statusFilter;
      
      // Use real API request
      const data = await realApiRequest.get('/admin/users', params);
      const fetchedUsers = data.users || data.data || data || [];
      
      // Map API response to our interface if needed
      const mappedUsers = Array.isArray(fetchedUsers) ? fetchedUsers.map((user: any) => ({
        id: user.id || user._id,
        companyName: user.company_name || user.companyName || user.company?.name || 'شرکت نامشخص',
        phone: user.phone || user.mobile || '',
        email: user.email,
        status: user.status || 'pending',
        profileTypes: user.profile_types || user.profileTypes || user.profiles?.map((p: any) => p.profileType) || [],
        createdAt: user.created_at || user.createdAt || new Date().toLocaleDateString('fa-IR'),
        lastActive: user.last_active || user.lastActive
      })) : [];
      
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      
      // Set empty array on error
      setUsers([]);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای دریافت کاربران');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت در دریافت کاربران');
        } else {
          toast.error('خطا در بارگذاری کاربران');
        }
      } else {
        toast.error('خطا در بارگذاری کاربران');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId: number) => {
    try {
      setDetailLoading(true);
      
      // Use real API request
      const data = await realApiRequest.get(`/admin/users/${userId}`);
      
      // Map API response
      const mappedUser: UserDetails = {
        id: data.id || data._id,
        companyName: data.company_name || data.companyName || data.company?.name || 'شرکت نامشخص',
        phone: data.phone || data.mobile || '',
        email: data.email,
        status: data.status || 'pending',
        profileTypes: data.profile_types || data.profileTypes || data.profiles?.map((p: any) => p.profileType) || [],
        createdAt: data.created_at || data.createdAt,
        lastActive: data.last_active || data.lastActive,
        company: data.company ? {
          name: data.company.name,
          tradeId: data.company.trade_id || data.company.tradeId,
          province: data.company.province,
          city: data.company.city,
          address: data.company.address
        } : undefined,
        profiles: data.profiles?.map((profile: any) => ({
          id: profile.id,
          profileType: profile.profile_type || profile.profileType,
          isActive: profile.is_active !== undefined ? profile.is_active : profile.isActive
        })) || []
      };
      
      setSelectedUser(mappedUser);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای دریافت جزئیات کاربر');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت');
        } else {
          toast.error('خطا در بارگذاری جزئیات کاربر');
        }
      } else {
        toast.error('خطا در بارگذاری جزئیات کاربر');
      }
    } finally {
      setDetailLoading(false);
    }
  };

  const sendSmsToUser = async (userId: number, message: string) => {
    try {
      // Use real API request
      await realApiRequest.post(`/admin/users/${userId}/sms`, { body: message });
      toast.success('پیامک با موفقیت ارسال شد');
    } catch (error) {
      console.error('Error sending SMS:', error);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای ارسال پیامک');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت');
        } else {
          toast.error('خطا در ارسال پیامک');
        }
      } else {
        toast.error('خطا در ارسال پیامک');
      }
    }
  };

  const updateUserStatus = async (userId: number, status: string) => {
    try {
      // Use real API request
      await realApiRequest.put(`/admin/users/${userId}`, { status });
      
      // Update local state
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status: status as any } : u
      ));
      
      toast.success('وضعیت کاربر بروزرسانی شد');
      
      // Refresh stats after status change
      fetchStats();
    } catch (error) {
      console.error('Error updating user status:', error);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای بروزرسانی وضعیت');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت');
        } else {
          toast.error('خطا در بروزرسانی وضعیت کاربر');
        }
      } else {
        toast.error('خطا در بروزرسانی وضعیت کاربر');
      }
    }
  };

  const deleteUser = async (user: UserSummary) => {
    try {
      // Use real API request
      await realApiRequest.delete(`/admin/users/${user.id}`);
      
      // Update local state
      setUsers(prev => prev.filter(u => u.id !== user.id));
      setUserToDelete(null);
      
      toast.success(`کاربر ${user.companyName} حذف شد`);
      
      // Refresh stats after deletion
      fetchStats();
    } catch (error) {
      console.error('Error deleting user:', error);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای حذف کاربر');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت');
        } else {
          toast.error('خطا در حذف کاربر');
        }
      } else {
        toast.error('خطا در حذف کاربر');
      }
    }
  };

  const exportUsers = async () => {
    try {
      // Use real API request
      const response = await realApiRequest.get('/admin/users/export', {}, { responseType: 'blob' });
      
      // Create blob URL and download
      const blob = new Blob([response], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('لیست کاربران صادر شد');
    } catch (error) {
      console.error('Error exporting users:', error);
      toast.error('خطا در صادرات لیست کاربران');
    }
  };

  const createCoworker = async (formData: any) => {
    try {
      // Use real API request
      await realApiRequest.post('/admin/coworkers', formData);
      
      toast.success('کاربر همکار با موفقیت ایجاد شد');
      setIsCreateModalOpen(false);
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error('Error creating coworker:', error);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای ایجاد کاربر');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت');
        } else {
          toast.error('خطا در ایجاد کاربر همکار');
        }
      } else {
        toast.error('خطا در ایجاد کاربر همکار');
      }
    }
  };

  const updateUserAccess = async (userId: number, accessData: any) => {
    try {
      // Use real API request
      await realApiRequest.put(`/admin/users/${userId}`, accessData);
      
      // Update local state
      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? { 
              ...u, 
              status: accessData.status || u.status,
              profileTypes: accessData.profileTypes || u.profileTypes
            }
          : u
      ));
      
      toast.success('سطح دسترسی با موفقیت بروزرسانی شد');
      setIsAccessModalOpen(false);
      setUserForAccessEdit(null);
    } catch (error) {
      console.error('Error updating user access:', error);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای بروزرسانی سطح دسترسی');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت');
        } else {
          toast.error('خطا در بروزرسانی سطح دسترسی');
        }
      } else {
        toast.error('خطا در بروزرسانی سطح دسترسی');
      }
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchUsers(),
        fetchStats()
      ]);
      toast.success('داده‌ها با موفقیت به‌روزرسانی شد');
    } catch (error) {
      toast.error('خطا در به‌روزرسانی داده‌ها');
    } finally {
      setIsRefreshing(false);
    }
  };



  const handleSendSMS = async (user: UserSummary) => {
    const message = prompt('متن پیامک را وارد کنید:');
    if (message) {
      await sendSmsToUser(user.id, message);
    }
  };

  const handleSuspendUser = async (user: UserSummary) => {
    const newStatus = 'suspended';
    await updateUserStatus(user.id, newStatus);
  };

  const handleDeleteUser = (user: UserSummary) => {
    setUserToDelete(user);
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

  const handleViewUser = (userId: number) => {
    fetchUserDetails(userId);
  };

  const handleEditAccess = (user: UserSummary) => {
    setUserForAccessEdit(user);
    setIsAccessModalOpen(true);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="text-right">
          <h1 className="text-3xl font-bold">مدیریت کاربران</h1>
          <p className="text-muted-foreground">لیست کاربران و شرکت‌های ثبت‌شده</p>
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
                ایجاد کاربر همکار
              </Button>
            </DialogTrigger>
            <DialogContent style={{ direction: 'rtl', textAlign: 'right' }}>
              <DialogHeader style={{ textAlign: 'right' }}>
                <DialogTitle style={{ textAlign: 'right' }}>ایجاد کاربر همکار جدید</DialogTitle>
                <DialogDescription style={{ textAlign: 'right' }}>
                  اطلاعات کاربر همکار جدید را وارد کنید
                </DialogDescription>
              </DialogHeader>
              <CreateUserForm onClose={() => setIsCreateModalOpen(false)} onCreate={createCoworker} />
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
                <p className="text-xs text-muted-foreground">کل کاربران</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-xl font-bold text-green-600">{stats.active}</p>
                <p className="text-xs text-muted-foreground">فعال</p>
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
          
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-xl font-bold text-red-600">{stats.suspended}</p>
                <p className="text-xs text-muted-foreground">تعلیق شده</p>
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
              placeholder="جستجو بر اساس نام شرکت یا موبایل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="فیلتر وضعیت" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه وضعیت‌ها</SelectItem>
              <SelectItem value="active">فعال</SelectItem>
              <SelectItem value="pending">در انتظار</SelectItem>
              <SelectItem value="suspended">تعلیق شده</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={exportUsers}>
            <Download className="w-4 h-4 ml-2" />
            خروجی CSV
          </Button>
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5" />
            لیست کاربران
          </CardTitle>
          <CardDescription>
            {loading ? (
              <span>در حال بارگذاری...</span>
            ) : users.length > 0 ? (
              <>مجموعاً {users.length} کاربر یافت شد</>
            ) : (
              <>هیچ کاربری یافت نشد</>
            )}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right w-12">#</TableHead>
                      <TableHead className="text-right">شرکت</TableHead>
                      <TableHead className="text-right">تماس</TableHead>
                      <TableHead className="text-right">وضعیت</TableHead>
                      <TableHead className="text-right">نوع پروفایل</TableHead>
                      <TableHead className="text-right w-32">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(5)].map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <UsersIcon className="w-8 h-8 text-gray-400" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium text-muted-foreground">
                  کاربری یافت نشد
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'هیچ کاربری با این فیلترها موجود نیست. لطفاً جستجوی خود را تغییر دهید.'
                    : 'هنوز کاربری ثبت نشده است. پس از ثبت کاربران جدید، آنها در اینجا نمایش داده خواهند شد.'
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
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right w-12">#</TableHead>
                      <TableHead className="text-right">شرکت</TableHead>
                      <TableHead className="text-right">تماس</TableHead>
                      <TableHead className="text-right">وضعیت</TableHead>
                      <TableHead className="text-right">نوع پروفایل</TableHead>
                      <TableHead className="text-right w-32">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, index) => (
                      <TableRow key={user.id} className="hover:bg-muted/50">
                        <TableCell className="text-right font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-right">
                          <div>
                            <div className="font-medium">{user.companyName}</div>
                            <div className="text-sm text-muted-foreground">
                              کد شرکت: CMP-{user.id.toString().padStart(6, '0')}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div>
                            <div>{formatPhoneNumber(user.phone)}</div>
                            {user.email && (
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge 
                            variant="secondary" 
                            className={statusColors[user.status]}
                          >
                            {getUserStatusLabel(user.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-wrap gap-1">
                            {user.profileTypes && user.profileTypes.length > 0 ? (
                              user.profileTypes.map((profileType, index) => (
                                <Badge 
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {getProfileTypeLabel(profileType)}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm text-muted-foreground">بدون پروفایل</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" style={{ direction: 'rtl' }}>
                              <DropdownMenuItem 
                                onClick={() => handleViewUser(user.id)}
                                disabled={detailLoading}
                                style={{ textAlign: 'right', justifyContent: 'flex-end' }}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                نمایش کامل
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleSendSMS(user)}
                                style={{ textAlign: 'right', justifyContent: 'flex-end' }}
                              >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                ارسال پیامک
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleEditAccess(user)}
                                style={{ textAlign: 'right', justifyContent: 'flex-end' }}
                              >
                                <Settings className="w-4 h-4 mr-2" />
                                ویرایش سطح دسترسی
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleSuspendUser(user)}
                                style={{ textAlign: 'right', justifyContent: 'flex-end' }}
                              >
                                {user.status === 'suspended' ? (
                                  <>
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    فعال‌سازی
                                  </>
                                ) : (
                                  <>
                                    <UserMinus className="w-4 h-4 mr-2" />
                                    تعلیق
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteUser(user)}
                                className="text-destructive focus:text-destructive"
                                style={{ textAlign: 'right', justifyContent: 'flex-end' }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                حذف
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl" style={{ direction: 'rtl', textAlign: 'right' }}>
          <DialogHeader style={{ textAlign: 'right' }}>
            <DialogTitle style={{ textAlign: 'right' }}>جزئیات کاربر</DialogTitle>
            <DialogDescription style={{ textAlign: 'right' }}>
              مشاهده اطلاعات کامل کاربر انتخاب شده
            </DialogDescription>
          </DialogHeader>
          {detailLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
          ) : selectedUser ? (
            <UserDetailsView user={selectedUser} />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">اطلاعات کاربر یافت نشد</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Access Edit Modal */}
      <Dialog open={isAccessModalOpen} onOpenChange={setIsAccessModalOpen}>
        <DialogContent className="max-w-md" style={{ direction: 'rtl', textAlign: 'right' }}>
          <DialogHeader style={{ textAlign: 'right' }}>
            <DialogTitle style={{ textAlign: 'right' }}>ویرایش سطح دسترسی</DialogTitle>
            <DialogDescription style={{ textAlign: 'right' }}>
              سطح دسترسی {userForAccessEdit?.companyName} را ویرایش کنید
            </DialogDescription>
          </DialogHeader>
          {userForAccessEdit && (
            <AccessEditForm 
              user={userForAccessEdit}
              onClose={() => {
                setIsAccessModalOpen(false);
                setUserForAccessEdit(null);
              }}
              onUpdate={(accessData) => {
                updateUserAccess(userForAccessEdit.id, accessData);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      {userToDelete && (
        <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
          <AlertDialogContent style={{ direction: 'rtl', textAlign: 'right' }}>
            <AlertDialogHeader style={{ textAlign: 'right' }}>
              <AlertDialogTitle style={{ textAlign: 'right' }}>تأیید حذف کاربر</AlertDialogTitle>
              <AlertDialogDescription style={{ textAlign: 'right' }}>
                آیا از حذف کاربر "{userToDelete.companyName}" اطمینان دارید؟ این عمل قابل بازگشت نیست و تمام اطلاعات مرتبط با این کاربر حذف خواهد شد.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-row-reverse">
              <AlertDialogCancel onClick={() => setUserToDelete(null)}>
                انصراف
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteUser(userToDelete)}
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

function CreateUserForm({ onClose, onCreate }: { onClose: () => void; onCreate: (data: any) => void }) {
  const [formData, setFormData] = useState({
    orgName: '',
    phone: '',
    access: {
      mgmtReports: false,
      partsInquiry: false,
      elevatorsInquiry: false
    }
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.orgName.trim()) {
      toast.error('نام سازمان الزامی است');
      return;
    }
    
    if (!formData.phone.trim()) {
      toast.error('شماره موبایل الزامی است');
      return;
    }
    
    // Phone validation
    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('شماره موبایل باید با 09 شروع شده و 11 رقم باشد');
      return;
    }
    
    setLoading(true);
    try {
      await onCreate(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      <div className="space-y-2 text-right">
        <Label htmlFor="orgName">نام سازمان</Label>
        <Input
          id="orgName"
          value={formData.orgName}
          onChange={(e) => setFormData(prev => ({ ...prev, orgName: e.target.value }))}
          required
        />
      </div>
      
      <div className="space-y-2 text-right">
        <Label htmlFor="phone">شماره موبایل</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          placeholder="09123456789"
          required
          className="text-left"
          dir="ltr"
        />
      </div>
      
      <div className="space-y-3 text-right">
        <Label>سطح دسترسی</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="mgmtReports"
              checked={formData.access.mgmtReports}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                access: { ...prev.access, mgmtReports: e.target.checked }
              }))}
              className="rounded border-input"
            />
            <Label htmlFor="mgmtReports" className="text-sm font-normal">
              دسترسی به گزارش‌های مدیریتی
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="partsInquiry"
              checked={formData.access.partsInquiry}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                access: { ...prev.access, partsInquiry: e.target.checked }
              }))}
              className="rounded border-input"
            />
            <Label htmlFor="partsInquiry" className="text-sm font-normal">
              استعلام قطعات
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="elevatorsInquiry"
              checked={formData.access.elevatorsInquiry}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                access: { ...prev.access, elevatorsInquiry: e.target.checked }
              }))}
              className="rounded border-input"
            />
            <Label htmlFor="elevatorsInquiry" className="text-sm font-normal">
              استعلام آسانسورها
            </Label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          انصراف
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'در حال ایجاد...' : 'ایجاد کاربر'}
        </Button>
      </div>
    </form>
  );
}

function AccessEditForm({ 
  user, 
  onClose, 
  onUpdate 
}: { 
  user: UserSummary; 
  onClose: () => void;
  onUpdate: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    profileTypes: user.profileTypes || [],
    status: user.status,
    permissions: {
      mgmtReports: false,
      partsInquiry: true,
      elevatorsInquiry: true,
      transferApproval: false,
      userManagement: false
    }
  });
  const [loading, setLoading] = useState(false);

  const handleProfileTypeChange = (profileType: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      profileTypes: checked 
        ? [...prev.profileTypes, profileType]
        : prev.profileTypes.filter(type => type !== profileType)
    }));
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: checked
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate({
        profileTypes: formData.profileTypes,
        status: formData.status,
        permissions: formData.permissions
      });
    } finally {
      setLoading(false);
    }
  };

  const availableProfileTypes = [
    { value: 'producer', label: 'تولیدکننده' },
    { value: 'importer', label: 'وارد کننده' },
    { value: 'installer', label: 'نصابی' },
    { value: 'seller', label: 'فروشنده' },
    { value: 'coop_org', label: 'سازمان همکار' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      <div className="space-y-4 text-right">
        <div className="space-y-2">
          <Label>وضعیت کاربر</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">فعال</SelectItem>
              <SelectItem value="pending">در انتظار</SelectItem>
              <SelectItem value="suspended">معلق</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>نوع پروفایل</Label>
          <div className="space-y-2">
            {availableProfileTypes.map((type) => (
              <div key={type.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`profile-${type.value}`}
                  checked={formData.profileTypes.includes(type.value)}
                  onChange={(e) => handleProfileTypeChange(type.value, e.target.checked)}
                  className="rounded border-input"
                />
                <Label htmlFor={`profile-${type.value}`} className="text-sm font-normal">
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>مجوزهای سیستم</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="mgmtReports"
                checked={formData.permissions.mgmtReports}
                onChange={(e) => handlePermissionChange('mgmtReports', e.target.checked)}
                className="rounded border-input"
              />
              <Label htmlFor="mgmtReports" className="text-sm font-normal">
                دسترسی به گزارش‌های مدیریتی
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="partsInquiry"
                checked={formData.permissions.partsInquiry}
                onChange={(e) => handlePermissionChange('partsInquiry', e.target.checked)}
                className="rounded border-input"
              />
              <Label htmlFor="partsInquiry" className="text-sm font-normal">
                استعلام قطعات
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="elevatorsInquiry"
                checked={formData.permissions.elevatorsInquiry}
                onChange={(e) => handlePermissionChange('elevatorsInquiry', e.target.checked)}
                className="rounded border-input"
              />
              <Label htmlFor="elevatorsInquiry" className="text-sm font-normal">
                استعلام آسانسورها
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="transferApproval"
                checked={formData.permissions.transferApproval}
                onChange={(e) => handlePermissionChange('transferApproval', e.target.checked)}
                className="rounded border-input"
              />
              <Label htmlFor="transferApproval" className="text-sm font-normal">
                تایید انتقال قطعات
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="userManagement"
                checked={formData.permissions.userManagement}
                onChange={(e) => handlePermissionChange('userManagement', e.target.checked)}
                className="rounded border-input"
              />
              <Label htmlFor="userManagement" className="text-sm font-normal">
                مدیریت کاربران
              </Label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          انصراف
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'در حال بروزرسانی...' : 'بروزرسانی'}
        </Button>
      </div>
    </form>
  );
}

function UserDetailsView({ user }: { user: UserDetails }) {
  return (
    <div className="space-y-4" dir="rtl">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-right">
          <Label className="text-sm font-medium text-muted-foreground">شماره موبایل</Label>
          <p>{formatPhoneNumber(user.phone)}</p>
        </div>
        <div className="text-right">
          <Label className="text-sm font-medium text-muted-foreground">وضعیت</Label>
          <p>
            <Badge className={statusColors[user.status]}>
              {getUserStatusLabel(user.status)}
            </Badge>
          </p>
        </div>
      </div>

      {user.company && (
        <div className="space-y-3 text-right">
          <h4 className="font-medium">اطلاعات شرکت</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-right">
              <Label className="text-sm font-medium text-muted-foreground">نام شرکت</Label>
              <p>{user.company.name}</p>
            </div>
            <div className="text-right">
              <Label className="text-sm font-medium text-muted-foreground">کد شرکت</Label>
              <p>CMP-{user.id.toString().padStart(6, '0')}</p>
            </div>
            <div className="text-right">
              <Label className="text-sm font-medium text-muted-foreground">شناسه تجاری</Label>  
              <p>{user.company.tradeId || '-'}</p>
            </div>
            <div className="text-right">
              <Label className="text-sm font-medium text-muted-foreground">استان</Label>
              <p>{user.company.province || '-'}</p>
            </div>
            <div className="text-right">
              <Label className="text-sm font-medium text-muted-foreground">شهر</Label>
              <p>{user.company.city || '-'}</p>
            </div>
            <div className="col-span-2 text-right">
              <Label className="text-sm font-medium text-muted-foreground">آدرس</Label>
              <p>{user.company.address || '-'}</p>
            </div>
          </div>
        </div>
      )}

      {user.profiles && user.profiles.length > 0 && (
        <div className="space-y-3 text-right">
          <h4 className="font-medium">پروفایل‌ها</h4>
          <div className="space-y-2">
            {user.profiles.map((profile) => (
              <div key={profile.id} className="flex items-center justify-between p-2 border rounded">
                <span>{getProfileTypeLabel(profile.profileType)}</span>
                <Badge variant={profile.isActive ? "default" : "secondary"}>
                  {profile.isActive ? 'فعال' : 'غیرفعال'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}