import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Building,
  Search,
  MoreHorizontal,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { realApiRequest, RealApiError } from '../../lib/real-api-client';

interface ElevatorCategory {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

interface ElevatorCategoryFormData {
  name: string;
  description: string;
  isActive: boolean;
}

interface ElevatorCategoryManagementProps {
  triggerDialog?: boolean;
  onStatsChange?: () => void;
  apiError?: RealApiError | null;
  isApiAvailable?: boolean | null;
}

export default function ElevatorCategoryManagement({ triggerDialog, onStatsChange, apiError, isApiAvailable }: ElevatorCategoryManagementProps) {
  const [categories, setCategories] = useState<ElevatorCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [formData, setFormData] = useState<ElevatorCategoryFormData>({
    name: '',
    description: '',
    isActive: true
  });
  const [editingCategory, setEditingCategory] = useState<ElevatorCategory | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle external trigger to open dialog
  useEffect(() => {
    if (triggerDialog) {
      resetForm();
      setEditingCategory(null);
      setIsDialogOpen(true);
    }
  }, [triggerDialog]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      // Use real API request
      const data = await realApiRequest.get('/admin/elevator-types');
      const fetchedCategories = data.elevator_types || data.elevatorTypes || data.data || data || [];
      
      // Map API response to our interface if needed 
      const mappedCategories = Array.isArray(fetchedCategories) ? fetchedCategories.map((cat: any) => ({
        id: cat.id?.toString() || cat._id?.toString(),
        name: cat.name || cat.title,
        description: cat.description || '',
        isActive: cat.is_active !== undefined ? cat.is_active : (cat.isActive !== undefined ? cat.isActive : true),
        createdAt: cat.created_at || cat.createdAt || new Date().toLocaleDateString('fa-IR')
      })) : [];
      
      setCategories(mappedCategories);
    } catch (error) {
      console.error('Error fetching elevator types:', error);
      
      // Set empty array on error
      setCategories([]);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای دریافت انواع آسانسور');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت در دریافت انواع آسانسور');
        } else {
          toast.error('خطا در بارگذاری انواع آسانسور');
        }
      } else {
        toast.error('خطا در بارگذاری انواع آسانسور');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      isActive: true
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('نام نوع آسانسور الزامی است');
      return;
    }

    const categoryData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      is_active: formData.isActive
    };

    try {
      if (editingCategory) {
        // API call for update using apiRequest
        await apiRequest.put(`/admin/elevator-types/${editingCategory.id}`, categoryData);
        toast.success('نوع آسانسور بروزرسانی شد');
      } else {
        // API call for create using apiRequest
        await apiRequest.post('/admin/elevator-types', categoryData);
        toast.success('نوع آسانسور جدید ایجاد شد');
      }

      setIsDialogOpen(false);
      resetForm();
      setEditingCategory(null);
      // Refresh categories list
      fetchCategories();
    } catch (error) {
      console.error('Error saving elevator type:', error);
      toast.error(editingCategory ? 'خطا در بروزرسانی نوع آسانسور' : 'خطا در ایجاد نوع آسانسور');
    }
  };

  const handleEdit = (category: ElevatorCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      isActive: category.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (category: ElevatorCategory) => {
    if (!window.confirm(`آیا از حذف نوع آسانسور "${category.name}" اطمینان دارید؟`)) {
      return;
    }

    try {
      // API call for delete using apiRequest
      await apiRequest.delete(`/admin/elevator-types/${category.id}`);
      
      toast.success('نوع آسانسور حذف شد');
      // Refresh categories list
      fetchCategories();
    } catch (error) {
      console.error('Error deleting elevator type:', error);
      toast.error('خطا در حذف نوع آسانسور');
    }
  };

  const handleToggleActive = async (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;

    try {
      // API call for toggle using apiRequest
      await apiRequest.put(`/admin/elevator-types/${categoryId}`, {
        is_active: !category.isActive
      });

      toast.success(`نوع آسانسور "${category.name}" ${!category.isActive ? 'فعال' : 'غیرفعال'} شد`);
      // Refresh categories list
      fetchCategories();
    } catch (error) {
      console.error('Error toggling elevator type status:', error);
      toast.error('خطا در تغییر وضعیت نوع آسانسور');
    }
  };

  // فیلتر کردن دسته‌بندی‌ها
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && category.isActive) ||
                         (filterStatus === 'inactive' && !category.isActive);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-gray-900" />
          <h3 className="text-lg text-gray-900">مدیریت انواع آسانسور</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm();
                  setEditingCategory(null);
                }}
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white"
              >
                <Plus className="w-4 h-4" />
                نوع آسانسور جدید
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-md" style={{ direction: 'rtl', textAlign: 'right' }}>
              <DialogHeader style={{ textAlign: 'right' }}>
                <DialogTitle style={{ textAlign: 'right' }}>
                  {editingCategory ? 'ویرایش نوع آسانسور' : 'تعریف نوع آسانسور جدید'}
                </DialogTitle>
                <DialogDescription style={{ textAlign: 'right' }}>
                  {editingCategory ? 'اطلاعات نوع آسانسور را ویرایش کنید' : 'نوع آسانسور جدید تعریف کنید'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4" style={{ direction: 'rtl' }}>
                <div className="space-y-2">
                  <Label htmlFor="name" style={{ textAlign: 'right', display: 'block' }}>نام نوع آسانسور *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="مثال: آسانسور هیدرولیک"
                    required
                    style={{ textAlign: 'right', direction: 'rtl' }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" style={{ textAlign: 'right', display: 'block' }}>توضیحات</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="توضیحات مربوط به این نوع آسانسور..."
                    rows={3}
                    style={{ textAlign: 'right', direction: 'rtl' }}
                  />
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <Label htmlFor="isActive" style={{ textAlign: 'right' }}>فعال</Label>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                </div>

                <div className="flex justify-between pt-4 border-t">
                  {editingCategory && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        handleDelete(editingCategory);
                        setIsDialogOpen(false);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      حذف
                    </Button>
                  )}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      انصراف
                    </Button>
                    <Button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white">
                      {editingCategory ? 'بروزرسانی' : 'ایجاد'}
                    </Button>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* فیلترها و جستجو */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="جستجو در انواع آسانسور..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
            style={{ textAlign: 'right', direction: 'rtl' }}
          />
        </div>
        
        <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
          <SelectTrigger className="w-40" style={{ textAlign: 'right', direction: 'rtl' }}>
            <SelectValue placeholder="فیلتر وضعیت" />
          </SelectTrigger>
          <SelectContent style={{ direction: 'rtl' }}>
            <SelectItem value="all">همه</SelectItem>
            <SelectItem value="active">فعال</SelectItem>
            <SelectItem value="inactive">غیرفعال</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* لیست دسته‌بندی‌ها */}
      <div className="space-y-4">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <Card key={category.id} className="border border-gray-200 bg-white hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building className="w-8 h-8 text-gray-700" />
                    <div>
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={category.isActive ? "default" : "secondary"} className="text-xs">
                          {category.isActive ? 'فعال' : 'غیرفعال'}
                        </Badge>
                        <span className="text-xs text-gray-500">ایجاد شده: {category.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" style={{ direction: 'rtl' }}>
                      <DropdownMenuItem onClick={() => handleEdit(category)}>
                        <Edit className="w-4 h-4 ml-2" />
                        ویرایش
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleToggleActive(category.id)}
                        className={category.isActive ? 'text-orange-600' : 'text-green-600'}
                      >
                        <Switch className="w-4 h-4 ml-2" />
                        {category.isActive ? 'غیرفعال کردن' : 'فعال کردن'}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(category)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 ml-2" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center border border-gray-200 bg-white">
            <Building className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg text-gray-900 mb-2">هیچ نوع آسانسوری یافت نشد</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'نتیجه‌ای برای فیلترهای انتخاب شده یافت نشد' 
                : 'ابتدا انواع آسانسور را تعریف کنید'
              }
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}