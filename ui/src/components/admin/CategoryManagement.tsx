import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { 
  Plus, 
  Edit, 
  Edit2,
  Trash2, 
  FolderTree, 
  Package,
  Building,
  ArrowRight,
  Search,
  Info,
  X
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TechnicalSpec {
  name: string;
  type: 'text' | 'number' | 'list' | 'boolean';
  unit: string;
}

interface Category {
  id: string;
  name: string;
  parentId?: string;
  children?: Category[];
  technicalSpecs?: TechnicalSpec[];
}

interface ElevatorType {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

interface CategoryFormData {
  name: string;
  parentId?: string;
  technicalSpecs: TechnicalSpec[];
}

// Category icons mapping
const categoryIcons: { [key: string]: string } = {
  'موتور': '🔧',
  'کنترل': '⚡',
  'ایمنی': '🛡️',
  'کابین': '🏠',
  'درب': '🚪',
  'کابل': '🔗',
  'مکانیکی': '⚙️',
  'الکترونیک': '💻',
  'هیدرولیک': '💧'
};

// مقادیر پیش‌فرض دسته‌بندی‌های قطعات
const defaultCategories: Category[] = [
  {
    id: '1',
    name: 'موتور',
    technicalSpecs: [
      { name: 'قدرت', type: 'number', unit: 'HP' },
      { name: 'ولتاژ', type: 'number', unit: 'V' },
      { name: 'دور در دقیقه', type: 'number', unit: 'RPM' }
    ]
  },
  {
    id: '1-1',
    name: 'موتور AC',
    parentId: '1',
    technicalSpecs: [
      { name: 'قدرت', type: 'number', unit: 'HP' },
      { name: 'ولتاژ ورودی', type: 'number', unit: 'V' },
      { name: 'فرکانس', type: 'number', unit: 'Hz' },
      { name: 'نوع روتور', type: 'list', unit: 'قفسه سنجابی/حلقه‌ای' }
    ]
  },
  {
    id: '1-2',
    name: 'موتور DC',
    parentId: '1',
    technicalSpecs: [
      { name: 'قدرت', type: 'number', unit: 'HP' },
      { name: 'ولتاژ', type: 'number', unit: 'V' },
      { name: 'جریان', type: 'number', unit: 'A' },
      { name: 'نوع کموتاتور', type: 'list', unit: 'کربنی/مسی' }
    ]
  },
  {
    id: '2',
    name: 'کنترل کننده',
    technicalSpecs: [
      { name: 'نوع ورودی', type: 'text', unit: '' },
      { name: 'تعداد طبقات', type: 'number', unit: 'طبقه' },
      { name: 'نوع ارتباط', type: 'list', unit: 'RS485/CAN/Ethernet' }
    ]
  },
  {
    id: '2-1',
    name: 'کنترلر فرکانس',
    parentId: '2',
    technicalSpecs: [
      { name: 'قدرت', type: 'number', unit: 'KW' },
      { name: 'ولتاژ ورودی', type: 'number', unit: 'V' },
      { name: 'محدوده فرکانس', type: 'text', unit: 'Hz' },
      { name: 'نوع کنترل', type: 'list', unit: 'V/f/Vector/DTC' }
    ]
  },
  {
    id: '3',
    name: 'کابل',
    technicalSpecs: [
      { name: 'قطر', type: 'number', unit: 'mm' },
      { name: 'ظرفیت جریان', type: 'number', unit: 'A' },
      { name: 'ولتاژ مجاز', type: 'number', unit: 'V' }
    ]
  }
];

// مقادیر پیش‌فرض انواع آسانسور
const defaultElevatorTypes: ElevatorType[] = [
  {
    id: '1',
    name: 'آسانسور هیدرولیک',
    description: 'آسانسور با سیستم هیدرولیک مناسب برای ساختمان‌های کم طبقه تا 6 طبقه',
    isActive: true,
    createdAt: '۱۴۰۲/۰۹/۱۵'
  },
  {
    id: '2',
    name: 'آسانسور کششی',
    description: 'آسانسور با سیستم کششی شامل MRL (بدون موتورخانه) و کلاسیک (با موتورخانه) مناسب برای ساختمان‌های بلند',
    isActive: true,
    createdAt: '۱۴۰۲/۰۹/۱۴'
  }
];

interface CategoryManagementProps {
  triggerDialog?: boolean;
}

export default function CategoryManagement({ triggerDialog }: CategoryManagementProps) {
  const [selectedElevatorType, setSelectedElevatorType] = useState<ElevatorType | null>(null);
  const [elevatorTypes, setElevatorTypes] = useState<ElevatorType[]>(defaultElevatorTypes);
  const [currentCategories, setCurrentCategories] = useState<Category[]>(defaultCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    parentId: undefined,
    technicalSpecs: [{ name: '', type: 'text', unit: '' }]
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
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

    // Validate and filter technical specs
    const validSpecs = formData.technicalSpecs.filter(spec => 
      spec.name.trim() && spec.type && spec.unit.trim()
    );

    const newCategory: Category = {
      id: editingCategory?.id || Date.now().toString(),
      name: formData.name.trim(),
      parentId: formData.parentId,
      technicalSpecs: validSpecs.length > 0 ? validSpecs : undefined
    };

    let updatedCategories;
    if (editingCategory) {
      updatedCategories = currentCategories.map(cat => 
        cat.id === editingCategory.id ? newCategory : cat
      );
      toast.success('دسته‌بندی بروزرسانی شد');
    } else {
      updatedCategories = [...currentCategories, newCategory];
      toast.success('دسته‌بندی جدید ایجاد شد');
    }

    setCurrentCategories(updatedCategories);
    setIsDialogOpen(false);
    resetForm();
    setEditingCategory(null);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      parentId: category.parentId,
      technicalSpecs: category.technicalSpecs?.length 
        ? category.technicalSpecs 
        : [{ name: '', type: 'text', unit: '' }]
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (category: Category) => {
    if (window.confirm(`آیا از حذف دسته‌بندی "${category.name}" اطمینان دارید؟`)) {
      const updatedCategories = currentCategories.filter(cat => cat.id !== category.id);
      setCurrentCategories(updatedCategories);
      toast.success('دسته‌بندی حذف شد');
    }
  };

  const handleSelectElevatorType = (elevatorType: ElevatorType) => {
    setSelectedElevatorType(elevatorType);
  };

  const handleBackToElevatorTypes = () => {
    setSelectedElevatorType(null);
  };

  // Helper function to find parent category name
  const getParentCategoryName = (parentId: string) => {
    const parent = currentCategories.find(cat => cat.id === parentId);
    return parent ? parent.name : '';
  };

  // Helper function to get category hierarchy
  const getCategoryHierarchy = (category: Category): string => {
    if (!category.parentId) return category.name;
    
    const parent = currentCategories.find(cat => cat.id === category.parentId);
    if (parent) {
      return `${getCategoryHierarchy(parent)} / ${category.name}`;
    }
    return category.name;
  };

  // Render categories table with hierarchy
  const renderCategoriesList = () => {
    // Get all categories with hierarchy information
    const allCategories = currentCategories.map(category => ({
      ...category,
      hierarchy: getCategoryHierarchy(category),
      isParent: !category.parentId,
      parentName: category.parentId ? 
        currentCategories.find(cat => cat.id === category.parentId)?.name || 'والد موجود نیست' : 
        '-',
      techSpecsCount: category.technicalSpecs?.length || 0
    }));

    // Sort categories by hierarchy
    const sortedCategories = allCategories.sort((a, b) => {
      // First sort by parent/child, then by name
      if (a.isParent && !b.isParent) return -1;
      if (!a.isParent && b.isParent) return 1;
      return a.hierarchy.localeCompare(b.hierarchy, 'fa');
    });

    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right w-12">#</TableHead>
                <TableHead className="text-right">نام دسته‌بندی</TableHead>
                <TableHead className="text-right">سلسله مراتب</TableHead>
                <TableHead className="text-right">والد</TableHead>
                <TableHead className="text-right">نوع</TableHead>
                <TableHead className="text-right">مشخصات فنی</TableHead>
                <TableHead className="text-right w-32">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCategories.map((category, index) => (
                <TableRow key={category.id} className={`
                  ${category.isParent ? 'bg-blue-50/50 hover:bg-blue-50/70' : 
                    !currentCategories.find(cat => cat.id === category.parentId) ? 'bg-yellow-50/50 hover:bg-yellow-50/70' : 
                    'bg-green-50/30 hover:bg-green-50/50'}
                `}>
                  <TableCell className="text-right font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {categoryIcons[category.name] || '📦'}
                      </span>
                      <span className="font-medium">
                        {category.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm text-muted-foreground">
                      {category.hierarchy}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`text-sm ${
                      category.parentName === 'والد موجود نیست' ? 'text-red-600' : 
                      category.parentName === '-' ? 'text-gray-500' : 'text-gray-700'
                    }`}>
                      {category.parentName}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant={
                        category.isParent ? 'default' : 
                        !currentCategories.find(cat => cat.id === category.parentId) ? 'destructive' : 
                        'secondary'
                      }
                      className="text-xs"
                    >
                      {category.isParent ? 'دسته‌بندی اصلی' : 
                       !currentCategories.find(cat => cat.id === category.parentId) ? 'یتیم' : 
                       'زیر دسته‌بندی'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">
                        {category.techSpecsCount} مشخصه
                      </span>
                      {category.technicalSpecs && category.technicalSpecs.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {category.technicalSpecs.slice(0, 2).map((spec, specIndex) => (
                            <Badge key={specIndex} variant="outline" className="text-xs">
                              {spec.name}
                            </Badge>
                          ))}
                          {category.technicalSpecs.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{category.technicalSpecs.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        onClick={() => handleDelete(category)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {sortedCategories.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              هیچ دسته‌بندی‌ای برای این نوع آسانسور تعریف نشده است
            </p>
          </div>
        )}
      </div>
    );
  };

  // فیلتر کردن انواع آسانسور بر اساس جستجو
  const filteredElevatorTypes = elevatorTypes.filter(type =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!selectedElevatorType) {
    // نمایش لیست انواع آسانسور
    return (
      <div className="space-y-6" style={{ direction: 'rtl' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">انتخاب نوع آسانسور برای مدیریت دسته‌بندی قطعات</h3>
          </div>

        </div>

        {/* راهنمای استفاده */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">راهنمای استفاده:</p>
                <p>اب��دا نوع آسانسور مورد نظر خود را از لیست زیر انتخاب کنید، سپس می‌توانید دسته‌بندی‌های قطعات مربوط به آن نوع آسانسور را تعریف و مدیریت کنید.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* جستجو در انواع آسانسور */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="جستجو در انواع آسانسور..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
            style={{ textAlign: 'right', direction: 'rtl' }}
          />
        </div>

        {/* لیست انواع آسانسور */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredElevatorTypes.map(elevatorType => {
            const partsCount = currentCategories.filter(cat => 
              cat.name.includes(elevatorType.name.split(' ')[1] || '')
            ).length;
            
            return (
              <Card 
                key={elevatorType.id} 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-400 hover:scale-[1.02]"
                onClick={() => handleSelectElevatorType(elevatorType)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base leading-tight">{elevatorType.name}</CardTitle>
                        {partsCount > 0 && (
                          <p className="text-xs text-blue-600 mt-1">
                            {partsCount} دسته‌بندی قطعات
                          </p>
                        )}
                        {partsCount === 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            هنوز دسته‌بندی تعریف نشده
                          </p>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {elevatorType.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant={elevatorType.isActive ? 'default' : 'secondary'} className="text-xs">
                        {elevatorType.isActive ? 'فعال' : 'غیرفعال'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {elevatorType.createdAt}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredElevatorTypes.length === 0 && (
          <Card className="p-8 text-center">
            <Building className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">هیچ نوع آسانسوری یافت نشد</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'نتیجه‌ای برای جستجوی شما یافت نشد' : 'ابتدا انواع آسانسور را تعریف کنید'}
            </p>
          </Card>
        )}
      </div>
    );
  }

  // نمایش دسته‌بندی‌های قطعات برای نوع آسانسور انتخاب شده
  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderTree className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold">
            دسته‌بندی قطعات: {selectedElevatorType.name}
          </h3>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setEditingCategory(null);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              دسته‌بندی جدید
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[90vh]" style={{ direction: 'rtl', textAlign: 'right' }}>
            <DialogHeader style={{ textAlign: 'right' }}>
              <DialogTitle style={{ textAlign: 'right' }}>
                {editingCategory ? 'ویرایش دسته‌بندی' : 'ایجاد دسته‌بندی جدید'}
              </DialogTitle>
              <DialogDescription style={{ textAlign: 'right' }}>
                دسته‌بندی قطعات برای {selectedElevatorType.name}
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
                        {currentCategories
                          .filter(cat => cat.id !== editingCategory?.id)
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
                            placeholder="مثال: قدرت"
                            style={{ textAlign: 'right', direction: 'rtl' }}
                          />
                        </div>
                        <div className="w-32">
                          <Label className="text-sm">نوع</Label>
                          <Select
                            value={spec.type}
                            onValueChange={(value: any) => updateSpecRow(index, 'type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">متن</SelectItem>
                              <SelectItem value="number">عدد</SelectItem>
                              <SelectItem value="list">لیست</SelectItem>
                              <SelectItem value="boolean">بله/خیر</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-1">
                          <Label className="text-sm">واحد</Label>
                          <Input
                            value={spec.unit}
                            onChange={(e) => updateSpecRow(index, 'unit', e.target.value)}
                            placeholder="مثال: HP"
                            style={{ textAlign: 'right', direction: 'rtl' }}
                          />
                        </div>
                        {formData.technicalSpecs.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeSpecRow(index)}
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <div></div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      انصراف
                    </Button>
                    <Button type="submit">
                      {editingCategory ? 'بروزرسانی' : 'ایجاد'}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* اطلاعات نوع آسانسور انتخاب شده */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Building className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="font-medium text-blue-800">{selectedElevatorType.name}</h4>
              <p className="text-sm text-blue-600">{selectedElevatorType.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* لیست دسته‌بندی‌های قطعات */}
      <div className="space-y-4">
        {renderCategoriesList()}
      </div>

      {currentCategories.length === 0 && (
        <Card className="p-8 text-center">
          <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">هیچ دسته‌بندی یافت نشد</h3>
          <p className="text-muted-foreground mb-4">
            برای {selectedElevatorType.name}، اولین دسته‌بندی قطعات را ایجاد کنید
          </p>
          <Button
            onClick={() => {
              resetForm();
              setEditingCategory(null);
              setIsDialogOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            ایجاد دسته‌بندی
          </Button>
        </Card>
      )}
    </div>
  );
}