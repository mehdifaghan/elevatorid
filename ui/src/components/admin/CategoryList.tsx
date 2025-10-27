import React, { useState } from 'react';
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
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  MoreVertical, 
  Folder,
  FolderOpen,
  Package
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

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

// انواع آسانسور موجود
const elevatorTypes: ElevatorType[] = [
  { id: '1', name: 'آسانسور مسافربری', description: 'آسانسور استاندارد برای حمل مسافر' },
  { id: '2', name: 'آسانسور بار', description: 'آسانسور مخصوص حمل بار سنگین' },
  { id: '3', name: 'آسانسور بیمارستانی', description: 'آسانسور مخصوص استفاده در بیمارستان' },
  { id: '4', name: 'آسانسور ویلایی', description: 'آسانسور کوچک برای منازل' }
];

// مقادیر پیش‌فرض دسته‌بندی‌های قطعات
const defaultCategories: Category[] = [
  {
    id: '1',
    name: 'موتور آسانسور',
    elevatorTypeId: '1',
    technicalSpecs: [
      { name: 'قدرت', type: 'number', unit: 'کیلووات' },
      { name: 'ولتاژ', type: 'select', unit: 'ولت', options: ['220', '380', '440'] },
      { name: 'سرعت', type: 'number', unit: 'دور بر دقیقه' }
    ],
    createdAt: '۱۴۰۳/۰۹/۱۵',
    isActive: true
  },
  {
    id: '2',
    name: 'کابل آسانسور',
    elevatorTypeId: '1',
    technicalSpecs: [
      { name: 'قطر', type: 'number', unit: 'میلی‌متر' },
      { name: 'طول', type: 'number', unit: 'متر' },
      { name: 'نوع عایق', type: 'select', unit: '', options: ['PVC', 'XLPE', 'EPR'] }
    ],
    createdAt: '۱۴۰۳/۰۹/۱۴',
    isActive: true
  },
  {
    id: '3',
    name: 'درب آسانسور',
    elevatorTypeId: '2',
    parentId: '4',
    technicalSpecs: [
      { name: 'عرض', type: 'number', unit: 'سانتی‌متر' },
      { name: 'ارتفاع', type: 'number', unit: 'سانتی‌متر' },
      { name: 'جنس', type: 'select', unit: '', options: ['استیل', 'آهن', 'آلومینیوم'] }
    ],
    createdAt: '۱۴۰۳/۰۹/۱۳',
    isActive: true
  },
  {
    id: '4',
    name: 'تجهیزات ورودی',
    elevatorTypeId: '2',
    technicalSpecs: [
      { name: 'نوع سیستم', type: 'select', unit: '', options: ['اتوماتیک', 'دستی'] }
    ],
    createdAt: '۱۴۰۳/۰۹/۱۲',
    isActive: true
  }
];

const categoryIcons: { [key: string]: string } = {
  'موتور آسانسور': '⚙️',
  'کابل آسانسور': '🔌',
  'درب آسانسور': '🚪',
  'تجهیزات ورودی': '🏗️',
  'سیستم کنترل': '🎛️',
  'چراغ‌ها': '💡',
  'دکمه‌ها': '🔘'
};

interface CategoryListProps {
  triggerDialog?: boolean;
}

export default function CategoryList({ triggerDialog }: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    elevatorTypeId: '',
    parentId: undefined,
    technicalSpecs: [{ name: '', type: 'text', unit: '' }]
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      elevatorTypeId: '',
      parentId: undefined,
      technicalSpecs: [{ name: '', type: 'text', unit: '' }]
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
      technicalSpecs: [...prev.technicalSpecs, { name: '', type: 'text', unit: '' }]
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
        i === index ? { ...spec, [field]: value } : spec
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('نام دسته‌بندی الزامی است');
      return;
    }

    if (!formData.elevatorTypeId) {
      toast.error('انتخاب نوع آسانسور الزامی است');
      return;
    }

    // Validate and filter technical specs
    const validSpecs = formData.technicalSpecs.filter(spec => 
      spec.name.trim() && spec.type && spec.unit.trim()
    );

    const newCategory: Category = {
      id: editingCategory?.id || Date.now().toString(),
      name: formData.name.trim(),
      elevatorTypeId: formData.elevatorTypeId,
      parentId: formData.parentId,
      technicalSpecs: validSpecs,
      createdAt: editingCategory?.createdAt || new Date().toLocaleDateString('fa-IR'),
      updatedAt: editingCategory ? new Date().toLocaleDateString('fa-IR') : undefined,
      isActive: true
    };

    if (editingCategory) {
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id ? newCategory : cat
      ));
      toast.success('دسته‌بندی با موفقیت بروزرسانی شد');
    } else {
      setCategories(prev => [...prev, newCategory]);
      toast.success('دسته‌بندی جدید با موفقیت ایجاد شد');
    }

    setIsDialogOpen(false);
    resetForm();
    setEditingCategory(null);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      elevatorTypeId: category.elevatorTypeId,
      parentId: category.parentId,
      technicalSpecs: category.technicalSpecs.length > 0 
        ? category.technicalSpecs 
        : [{ name: '', type: 'text', unit: '' }]
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (categoryId: string) => {
    const categoryToDelete = categories.find(cat => cat.id === categoryId);
    if (!categoryToDelete) return;

    // Check if category has children
    const hasChildren = categories.some(cat => cat.parentId === categoryId);
    if (hasChildren) {
      toast.error('نمی‌توان دسته‌بندی دارای زیرمجموعه را حذف کرد');
      return;
    }

    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    toast.success(`دسته‌بندی "${categoryToDelete.name}" حذف شد`);
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parentId" style={{ textAlign: 'right', display: 'block' }}>دسته‌بندی والد (اختیاری)</Label>
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
                    {formData.technicalSpecs.map((spec, index) => (
                      <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <Label className="text-sm">نام مشخصه</Label>
                          <Input
                            value={spec.name}
                            onChange={(e) => updateSpecRow(index, 'name', e.target.value)}
                            placeholder="نام مشخصه"
                            style={{ textAlign: 'right', direction: 'rtl' }}
                          />
                        </div>
                        <div className="w-32">
                          <Label className="text-sm">نوع</Label>
                          <Select
                            value={spec.type}
                            onValueChange={(value) => updateSpecRow(index, 'type', value)}
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
                            value={spec.unit}
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
                    ))}
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