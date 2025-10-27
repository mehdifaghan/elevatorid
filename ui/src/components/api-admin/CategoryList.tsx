import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Skeleton } from '../ui/skeleton';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  MoreVertical, 
  Folder,
  FolderOpen,
  Package,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { realApiRequest, RealApiError } from '../../lib/real-api-client';

interface TechnicalSpec {
  name: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect';
  unit: string;
  options?: string[];
}

interface ElevatorType {
  id: string;
  name: string;
  description: string;
}

interface Category {
  id: string;
  name: string;
  elevatorTypeId: string;
  parentId?: string;
  technicalSpecs: TechnicalSpec[];
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
}

interface CategoryFormData {
  name: string;
  elevatorTypeId: string;
  parentId?: string;
  technicalSpecs: TechnicalSpec[];
}

// API cache for elevator types
let elevatorTypesCache: ElevatorType[] = [];

const categoryIcons: { [key: string]: string } = {
  'موتور آسانسور': '⚙️',
  'کابل آسانسور': '🔌',
  'درب آسانسور': '🚪',
  'تجهیزات ورودی': '🏗️',
  'سیستم کنترل': '🎛️',
  'چراغ‌ها': '💡',
  'دکمه‌ها': '🔘'
};

// Safe technical spec creation
const createSafeTechnicalSpec = (spec?: Partial<TechnicalSpec>): TechnicalSpec => ({
  name: spec?.name || '',
  type: (spec?.type && ['text', 'number', 'boolean', 'select', 'multiselect'].includes(spec.type)) ? spec.type : 'text',
  unit: spec?.unit || '',
  options: spec?.options
});

interface CategoryListProps {
  triggerDialog?: boolean;
  onStatsChange?: () => void;
  apiError?: RealApiError | null;
  isApiAvailable?: boolean | null;
}

export default function CategoryList({ triggerDialog, onStatsChange, apiError, isApiAvailable }: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [elevatorTypes, setElevatorTypes] = useState<ElevatorType[]>([]);
  const [loading, setLoading] = useState(true);
  const [elevatorTypesLoading, setElevatorTypesLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    elevatorTypeId: '',
    parentId: undefined,
    technicalSpecs: [createSafeTechnicalSpec()]
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchElevatorTypes();
    fetchCategories();
  }, []);

  const fetchElevatorTypes = async () => {
    try {
      setElevatorTypesLoading(true);
      
      // Use cache if available and API is accessible
      if (elevatorTypesCache.length > 0 && isApiAvailable !== false) {
        setElevatorTypes(elevatorTypesCache);
        setElevatorTypesLoading(false);
        return;
      }

      // Use real API request
      const data = await realApiRequest.get('/admin/elevator-types');
      const fetchedTypes = data.elevator_types || data.elevatorTypes || data.data || data || [];
      
      // Map to our interface if needed
      const mappedTypes = Array.isArray(fetchedTypes) ? fetchedTypes.map((type: any) => ({
        id: type.id?.toString() || type._id?.toString(),
        name: type.name || type.title,
        description: type.description || ''
      })) : [];
      
      elevatorTypesCache = mappedTypes;
      setElevatorTypes(mappedTypes);
    } catch (error) {
      console.error('Error fetching elevator types:', error);
      
      // Clear cache on API error
      elevatorTypesCache = [];
      setElevatorTypes([]);
      
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
      setElevatorTypesLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      // Use real API request
      const data = await realApiRequest.get('/admin/parts-categories');
      const fetchedCategories = data.categories || data.parts_categories || data.data || data || [];
      
      // Map API response to our interface if needed
      const mappedCategories = Array.isArray(fetchedCategories) ? fetchedCategories.map((cat: any) => ({
        id: cat.id?.toString() || cat._id?.toString(),
        name: cat.name || cat.title,
        elevatorTypeId: cat.elevator_type_id?.toString() || cat.elevatorTypeId?.toString(),
        parentId: cat.parent_id?.toString() || cat.parentId?.toString(),
        technicalSpecs: cat.technical_specs || cat.technicalSpecs || [],
        createdAt: cat.created_at || cat.createdAt || new Date().toLocaleDateString('fa-IR'),
        updatedAt: cat.updated_at || cat.updatedAt,
        isActive: cat.is_active !== undefined ? cat.is_active : (cat.isActive !== undefined ? cat.isActive : true)
      })) : [];
      
      setCategories(mappedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      
      // Set empty array on error
      setCategories([]);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای دریافت دسته‌بندی‌ها');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت در دریافت دسته‌بندی‌ها');
        } else {
          toast.error('خطا در بارگذاری دسته‌بندی‌ها');
        }
      } else {
        toast.error('خطا در بارگذاری دسته‌بندی‌ها');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      elevatorTypeId: '',
      parentId: undefined,
      technicalSpecs: [createSafeTechnicalSpec()]
    });
  };

  // Handle external trigger to open dialog
  React.useEffect(() => {
    if (triggerDialog) {
      resetForm();
      setEditingCategory(null);
      setIsDialogOpen(true);
    }
  }, [triggerDialog]);

  const addSpecRow = () => {
    setFormData(prev => ({
      ...prev,
      technicalSpecs: [...prev.technicalSpecs, createSafeTechnicalSpec()]
    }));
  };

  const removeSpecRow = (index: number) => {
    if (formData.technicalSpecs.length > 1) {
      setFormData(prev => ({
        ...prev,
        technicalSpecs: prev.technicalSpecs.filter((_, i) => i !== index)
      }));
    }
  };

  const updateSpecRow = (index: number, field: 'name' | 'type' | 'unit', value: string) => {
    setFormData(prev => ({
      ...prev,
      technicalSpecs: prev.technicalSpecs.map((spec, i) => 
        i === index ? createSafeTechnicalSpec({ ...spec, [field]: value }) : spec
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('نام دسته‌بندی الزامی است');
      return;
    }

    if (elevatorTypes.length === 0) {
      toast.error('انواع آسانسور از API قابل دسترسی نیست. لطفاً اتصال اینترنت خود را بررسی کنید.');
      return;
    }

    if (!formData.elevatorTypeId) {
      toast.error('انتخاب نوع آسانسور الزامی است');
      return;
    }

    // Validate and filter technical specs
    const validSpecs = formData.technicalSpecs
      .map(createSafeTechnicalSpec)
      .filter(spec => spec.name.trim() && spec.type && spec.unit.trim());

    const categoryData = {
      name: formData.name.trim(),
      elevatorTypeId: formData.elevatorTypeId,
      parentId: formData.parentId,
      technicalSpecs: validSpecs
    };

    try {
      const requestData = {
        name: categoryData.name,
        elevator_type_id: categoryData.elevatorTypeId,
        parent_id: categoryData.parentId,
        technical_specs: categoryData.technicalSpecs
      };

      if (editingCategory) {
        // API call for update using real API
        await realApiRequest.put(`/admin/parts-categories/${editingCategory.id}`, requestData);
        toast.success('دسته‌بندی با موفقیت بروزرسانی شد');
      } else {
        // API call for create using real API
        await realApiRequest.post('/admin/parts-categories', requestData);
        toast.success('دسته‌بندی جدید با موفقیت ایجاد شد');
      }

      setIsDialogOpen(false);
      resetForm();
      setEditingCategory(null);
      // Refresh categories list
      fetchCategories();
      // Update parent stats
      onStatsChange?.();
    } catch (error) {
      console.error('Error saving category:', error);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای ذخیره دسته‌بندی');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت - لطفاً مجدداً وارد شوید');
        } else {
          toast.error(editingCategory ? 'خطا در بروزرسانی دسته‌بندی' : 'خطا در ایجاد دسته‌بندی');
        }
      } else {
        toast.error(editingCategory ? 'خطا در بروزرسانی دسته‌بندی' : 'خطا در ایجاد دسته‌بندی');
      }
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      elevatorTypeId: category.elevatorTypeId,
      parentId: category.parentId,
      technicalSpecs: category.technicalSpecs.length > 0 
        ? category.technicalSpecs.map(createSafeTechnicalSpec)
        : [createSafeTechnicalSpec()]
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    const categoryToDelete = categories.find(cat => cat.id === categoryId);
    if (!categoryToDelete) return;

    // Check if category has children
    const hasChildren = categories.some(cat => cat.parentId === categoryId);
    if (hasChildren) {
      toast.error('نمی‌توان دسته‌بندی دارای زیرمجموعه را حذف کرد');
      return;
    }

    if (!window.confirm(`آیا از حذف دسته‌بندی "${categoryToDelete.name}" اطمینان دارید؟`)) {
      return;
    }

    try {
      // API call for delete using apiRequest
      await realApiRequest.delete(`/admin/parts-categories/${categoryId}`);
      
      toast.success(`دسته‌بندی "${categoryToDelete.name}" حذف شد`);
      // Refresh categories list
      fetchCategories();
      // Update parent stats
      onStatsChange?.();
    } catch (error) {
      console.error('Error deleting category:', error);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای حذف دسته‌بندی');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت - لطفاً مجدداً وارد شوید');
        } else {
          toast.error('خطا در حذف دسته‌بندی');
        }
      } else {
        toast.error('خطا در حذف دسته‌بندی');
      }
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getParentName = (parentId?: string) => {
    if (!parentId) return null;
    const parent = categories.find(cat => cat.id === parentId);
    return parent?.name;
  };

  const getElevatorTypeName = (elevatorTypeId: string) => {
    const elevatorType = elevatorTypes.find(type => type.id === elevatorTypeId);
    return elevatorType?.name || 'نامشخص';
  };

  const getChildrenCount = (categoryId: string) => {
    return categories.filter(cat => cat.parentId === categoryId).length;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <Card key={index} className="border border-gray-200 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-6" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="جستجو در دسته‌بندی‌ها..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
            style={{ textAlign: 'right', direction: 'rtl' }}
          />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setEditingCategory(null);
              }}
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              <Plus className="w-4 h-4 ml-1" />
              دسته‌بندی جدید
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[90vh]" style={{ direction: 'rtl', textAlign: 'right' }}>
            <DialogHeader style={{ textAlign: 'right' }}>
              <DialogTitle style={{ textAlign: 'right' }}>
                {editingCategory ? 'ویرایش دسته‌بندی' : 'ایجاد دسته‌بندی جدید'}
              </DialogTitle>
              <DialogDescription style={{ textAlign: 'right' }}>
                اطلاعات دسته‌بندی قطعات را وارد کنید
              </DialogDescription>
            </DialogHeader>
            
            <div className="max-h-[calc(90vh-8rem)] overflow-auto">
              {/* API Status Warning */}
              {(isApiAvailable === false || (elevatorTypes.length === 0 && !elevatorTypesLoading)) && (
                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2 text-orange-800">
                    <Loader2 className="w-4 h-4" />
                    <span className="text-sm font-medium">هشدار</span>
                  </div>
                  <p className="text-sm text-orange-700 mt-1">
                    عدم دسترسی به برخی اطلاعات API. ممکن است برخی فیلدها قابل انتخاب نباشند.
                  </p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6" style={{ direction: 'rtl' }}>
                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" style={{ textAlign: 'right', display: 'block' }}>نام دسته‌بندی *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="نام دسته‌بندی را وارد کنید"
                      required
                      style={{ textAlign: 'right', direction: 'rtl' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="elevatorTypeId" style={{ textAlign: 'right', display: 'block' }}>نوع آسانسور *</Label>
                    {elevatorTypesLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <p className="text-sm text-gray-500">در حال بارگذاری انواع آسانسور...</p>
                      </div>
                    ) : elevatorTypes.length === 0 ? (
                      <div className="space-y-2">
                        <Select disabled>
                          <SelectTrigger style={{ textAlign: 'right', direction: 'rtl' }} className="bg-gray-50">
                            <SelectValue placeholder="انواع آسانسور در دسترس نیست" />
                          </SelectTrigger>
                        </Select>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-red-600">
                            عدم دسترسی به انواع آسانسور. لطفاً اتصال اینترنت خود را بررسی کنید.
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={fetchElevatorTypes}
                            disabled={elevatorTypesLoading}
                            className="text-xs"
                          >
                            <Loader2 className={`w-3 h-3 ml-1 ${elevatorTypesLoading ? 'animate-spin' : ''}`} />
                            {elevatorTypesLoading ? 'در حال بارگذاری...' : 'تلاش مجدد'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Select
                        value={formData.elevatorTypeId}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, elevatorTypeId: value }))}
                      >
                        <SelectTrigger style={{ textAlign: 'right', direction: 'rtl' }}>
                          <SelectValue placeholder="نوع آسانسور را انتخاب کنید..." />
                        </SelectTrigger>
                        <SelectContent style={{ direction: 'rtl' }}>
                          {elevatorTypes.map(type => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parentId" style={{ textAlign: 'right', display: 'block' }}>دسته‌بندی والد (اختیاری)</Label>
                    {loading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <p className="text-sm text-gray-500">در حال بارگذاری دسته‌بندی‌ها...</p>
                      </div>
                    ) : !formData.elevatorTypeId ? (
                      <div className="space-y-2">
                        <Select disabled>
                          <SelectTrigger style={{ textAlign: 'right', direction: 'rtl' }} className="bg-gray-50">
                            <SelectValue placeholder="ابتدا نوع آسانسور را انتخاب کنید" />
                          </SelectTrigger>
                        </Select>
                        <p className="text-sm text-gray-500">
                          برای انتخاب دسته‌بندی والد، ابتدا نوع آسانسور را مشخص کنید.
                        </p>
                      </div>
                    ) : (
                      <>
                        <Select
                          value={formData.parentId || 'none'}
                          onValueChange={(value) => setFormData(prev => ({ 
                            ...prev, 
                            parentId: value === 'none' ? undefined : value 
                          }))}
                        >
                          <SelectTrigger style={{ textAlign: 'right', direction: 'rtl' }}>
                            <SelectValue placeholder="انتخاب کنید..." />
                          </SelectTrigger>
                          <SelectContent style={{ direction: 'rtl' }}>
                            <SelectItem value="none">هیچ کدام (دسته‌بندی اصلی)</SelectItem>
                            {categories
                              .filter(cat => cat.id !== editingCategory?.id && cat.elevatorTypeId === formData.elevatorTypeId)
                              .map(category => (
                                <SelectItem key={category.id} value={category.id}>
                                  {categoryIcons[category.name] || '📦'} {category.name}
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                        {categories.filter(cat => cat.elevatorTypeId === formData.elevatorTypeId).length === 0 && categories.length > 0 && (
                          <p className="text-sm text-gray-500">
                            برای این نوع آسانسور هیچ دسته‌بندی موجود نیست.
                          </p>
                        )}
                        {categories.length === 0 && !loading && (
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-orange-600">
                              عدم دسترسی به دسته‌بندی‌ها. اتصال API بررسی شود.
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={fetchCategories}
                              disabled={loading}
                              className="text-xs"
                            >
                              <Loader2 className={`w-3 h-3 ml-1 ${loading ? 'animate-spin' : ''}`} />
                              {loading ? 'در حال بروزرسانی...' : 'بروزرسانی'}
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Technical Specifications */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">مشخصات فنی</Label>
                    <Button type="button" onClick={addSpecRow} size="sm" variant="outline">
                      <Plus className="w-4 h-4 ml-1" />
                      افزودن مشخصه
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.technicalSpecs.map((spec, index) => {
                      const safeSpec = createSafeTechnicalSpec(spec);
                      return (
                        <div key={index} className="flex gap-2 items-end">
                          <div className="flex-1">
                            <Label className="text-sm">نام مشخصه</Label>
                            <Input
                              value={safeSpec.name}
                              onChange={(e) => updateSpecRow(index, 'name', e.target.value)}
                              placeholder="نام مشخصه"
                              style={{ textAlign: 'right', direction: 'rtl' }}
                            />
                          </div>
                          <div className="w-32">
                            <Label className="text-sm">نوع</Label>
                            <Select
                              value={safeSpec.type}
                              onValueChange={(value: 'text' | 'number' | 'boolean' | 'select' | 'multiselect') => updateSpecRow(index, 'type', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">متن</SelectItem>
                                <SelectItem value="number">عدد</SelectItem>
                                <SelectItem value="select">انتخابی</SelectItem>
                                <SelectItem value="boolean">بولی</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="w-24">
                            <Label className="text-sm">واحد</Label>
                            <Input
                              value={safeSpec.unit}
                              onChange={(e) => updateSpecRow(index, 'unit', e.target.value)}
                              placeholder="واحد"
                              style={{ textAlign: 'right', direction: 'rtl' }}
                            />
                          </div>
                          {formData.technicalSpecs.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeSpecRow(index)}
                              className="mb-0"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white">
                    {editingCategory ? 'بروزرسانی' : 'ایجاد'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    انصراف
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => {
            const parentName = getParentName(category.parentId);
            const elevatorTypeName = getElevatorTypeName(category.elevatorTypeId);
            const childrenCount = getChildrenCount(category.id);
            
            return (
              <Card key={category.id} className="border border-gray-200 bg-white hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {category.parentId ? (
                          <Folder className="w-5 h-5 text-gray-600" />
                        ) : (
                          <FolderOpen className="w-5 h-5 text-gray-700" />
                        )}
                        <span className="text-xl">
                          {categoryIcons[category.name] || '📦'}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>نوع: {elevatorTypeName}</span>
                          {parentName && (
                            <>
                              <span>•</span>
                              <span>والد: {parentName}</span>
                            </>
                          )}
                          {childrenCount > 0 && (
                            <>
                              <span>•</span>
                              <span>{childrenCount} زیرمجموعه</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{category.technicalSpecs.length} مشخصه فنی</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={category.isActive ? "default" : "secondary"}>
                        {category.isActive ? 'فعال' : 'غیرفعال'}
                      </Badge>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" style={{ direction: 'rtl' }}>
                          <DropdownMenuItem onClick={() => handleEdit(category)}>
                            <Edit2 className="w-4 h-4 ml-2" />
                            ویرایش
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(category.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  {/* Technical Specs Preview */}
                  {category.technicalSpecs.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex flex-wrap gap-2">
                        {category.technicalSpecs.slice(0, 3).map((spec, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {spec.name} ({spec.unit || 'بدون واحد'})
                          </Badge>
                        ))}
                        {category.technicalSpecs.length > 3 && (
                          <Badge variant="outline" className="text-xs text-gray-500">
                            +{category.technicalSpecs.length - 3} مورد دیگر
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="p-8 text-center border border-gray-200 bg-white">
            <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg text-gray-900 mb-2">هیچ دسته‌بندی یافت نشد</h3>
            <p className="text-gray-600">
              {searchTerm ? 'نتیجه‌ای برای جستجوی شما یافت نشد' : 'ابتدا دسته‌بندی‌های قطعات را تعریف کنید'}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}