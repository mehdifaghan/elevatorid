import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Skeleton } from '../ui/skeleton';
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
  Settings
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { mockUsers } from '../../lib/mock-data';
import { formatPhoneNumber, getUserStatusLabel, getProfileTypeLabel } from '../../utils/helpers';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  suspended: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800'
};

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [userForAccessEdit, setUserForAccessEdit] = useState<any>(null);
  const [allUsers, setAllUsers] = useState(mockUsers);
  const [users, setUsers] = useState(mockUsers);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  // Simulate loading data
  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Handle search and filters
  useEffect(() => {
    let filteredUsers = [...allUsers];
    
    // Apply search filter
    if (searchTerm) {
      filteredUsers = filteredUsers.filter(user => 
        user.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm) ||
        user.company.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === statusFilter);
    }
    
    setUsers(filteredUsers);
  }, [searchTerm, statusFilter, allUsers]);

  const getUserStats = () => {
    const stats = {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      pending: users.filter(u => u.status === 'pending').length,
      suspended: users.filter(u => u.status === 'suspended').length
    };
    return stats;
  };

  const stats = getUserStats();

  const handleSendSMS = async (user: any) => {
    const message = prompt('متن پیامک را وارد کنید:');
    if (message) {
      toast.success(`پیامک با موفقیت به ${user.companyName} ارسال شد`);
    }
  };

  const handleSuspendUser = async (user: any) => {
    const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
    
    // Update both local state arrays
    setAllUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === user.id ? { ...u, status: newStatus } : u
      )
    );
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === user.id ? { ...u, status: newStatus } : u
      )
    );
    
    toast.success(`وضعیت ${user.companyName} به ${getUserStatusLabel(newStatus)} تغییر یافت`);
  };

  const handleDeleteUser = async (user: any) => {
    if (confirm(`آیا از حذف ${user.companyName} اطمینان دارید؟`)) {
      // Remove from both local state arrays
      setAllUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
      setUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
      toast.success(`${user.companyName} با موفقیت حذف شد`);
    }
  };

  const handleViewUser = (userId: number) => {
    setDetailLoading(true);
    setTimeout(() => {
      const user = allUsers.find(u => u.id === userId);
      if (user) {
        setSelectedUser(user);
        setIsDetailModalOpen(true);
      }
      setDetailLoading(false);
    }, 500);
  };

  const handleEditAccess = (user: any) => {
    setUserForAccessEdit(user);
    setIsAccessModalOpen(true);
  };

  const handleExportCSV = () => {
    const csvData = users.map(user => ({
      'کد شرکت': `CMP-${user.id.toString().padStart(6, '0')}`,
      'نام شرکت': user.companyName,
      'شماره تماس': user.phone,
      'وضعیت': getUserStatusLabel(user.status),
      'انواع پروفایل': user.profileTypes.map(type => getProfileTypeLabel(type)).join(', '),
      'استان': user.company.province,
      'شهر': user.company.city,
      'شناسه تجاری': user.company.tradeId
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `users-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('فایل CSV با موفقیت دانلود شد');
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="text-right">
          <h1 className="text-3xl font-bold">مدیریت کاربران</h1>
          <p className="text-muted-foreground">لیست کاربران و شرکت‌های ثبت‌شده</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 ml-2" />
              ایجاد کاربر همکار
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ایجاد کاربر همکار جدید</DialogTitle>
              <DialogDescription>
                اطلاعات کاربر همکار جدید را وارد کنید
              </DialogDescription>
            </DialogHeader>
            <CreateUserForm onClose={() => setIsCreateModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="جستجو بر اساس نام شرکت یا موبایل..."
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
                  <SelectItem value="active">فعال</SelectItem>
                  <SelectItem value="suspended">معلق</SelectItem>
                  <SelectItem value="pending">در انتظار</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => loadData()}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
                تازه‌سازی
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="w-4 h-4 ml-2" />
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
                  <TableHead className="text-right">شرکت</TableHead>
                  <TableHead className="text-right">تماس</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                  <TableHead className="text-right">نوع پروفایل</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Show skeleton loading
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-24" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  users?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium text-right">
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
                          {user.profileTypes.map((profileType, index) => (
                            <Badge 
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {getProfileTypeLabel(profileType)}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => handleViewUser(user.id)}
                              disabled={detailLoading}
                            >
                              <Eye className="w-4 h-4 ml-2" />
                              نمایش کامل
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleSendSMS(user)}
                            >
                              <MessageSquare className="w-4 h-4 ml-2" />
                              ارسال پیامک
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleEditAccess(user)}
                            >
                              <Settings className="w-4 h-4 ml-2" />
                              ویرایش سطح دسترسی
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleSuspendUser(user)}
                            >
                              <UserX className="w-4 h-4 ml-2" />
                              تعلیق/فعال‌سازی
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteUser(user)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 ml-2" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {!loading && users?.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">کاربری یافت نشد</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>جزئیات کاربر</DialogTitle>
            <DialogDescription>
              مشاهده اطلاعات کامل کاربر انتخاب شده
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserDetailsView user={selectedUser} />
          )}
        </DialogContent>
      </Dialog>

      {/* Access Edit Modal */}
      <Dialog open={isAccessModalOpen} onOpenChange={setIsAccessModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>ویرایش سطح دسترسی</DialogTitle>
            <DialogDescription>
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
              onUpdate={() => {
                loadData();
                setIsAccessModalOpen(false);
                setUserForAccessEdit(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreateUserForm({ onClose }: { onClose: () => void }) {
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
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Create new user object
      const newUser = {
        id: Date.now(), // Simple ID generation for demo
        companyName: formData.orgName,
        phone: formData.phone,
        status: 'pending' as const,
        profileTypes: ['coop_org'],
        company: {
          name: formData.orgName,
          tradeId: Math.floor(Math.random() * 100000).toString(),
          province: 'تهران',
          city: 'تهران',
          address: 'آدرس موقت'
        },
        profiles: [
          { id: Date.now(), profileType: 'coop_org', isActive: false }
        ]
      };

      // Add to mock data temporarily
      mockUsers.push(newUser);
      
      toast.success(`کاربر همکار ${formData.orgName} با موفقیت ایجاد شد`);
      setLoading(false);
      onClose();
      
      // Refresh the view
      window.location.reload();
    }, 1000);
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
  user: any; 
  onClose: () => void;
  onUpdate: () => void;
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
    
    // Simulate API call
    setTimeout(() => {
      toast.success(`سطح دسترسی ${user.companyName} با موفقیت به‌روزرسانی شد`);
      setLoading(false);
      onUpdate();
    }, 1000);
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

function UserDetailsView({ user }: { user: any }) {
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