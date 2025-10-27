import React, { useState, useEffect } from 'react';
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
import { Skeleton } from '../ui/skeleton';
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
  X,
  Loader2
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

// مقادیر پیش‌فرض دسته‌بندی‌های قطعات (برای نمایش در صورت نبود API)
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

// مقادیر پیش‌فرض انواع آسانسور (برای نمایش در صورت نبود API)
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

// Create a safe fallback for technical specs
const createSafeTechnicalSpec = (spec?: Partial<TechnicalSpec>): TechnicalSpec => ({
  name: spec?.name || '',
  type: (spec?.type && ['text', 'number', 'list', 'boolean'].includes(spec.type)) ? spec.type : 'text',
  unit: spec?.unit || ''
});

// Create safe category with validated data
const createSafeCategory = (category?: Partial<Category>): Category => ({
  id: category?.id && typeof category.id === 'string' && category.id.trim() ? category.id.trim() : '',
  name: category?.name && typeof category.name === 'string' && category.name.trim() ? category.name.trim() : '',
  parentId: category?.parentId && typeof category.parentId === 'string' && category.parentId.trim() ? category.parentId.trim() : undefined,
  children: category?.children,
  technicalSpecs: category?.technicalSpecs?.map(createSafeTechnicalSpec)
});

export default function CategoryManagement({ triggerDialog }: CategoryManagementProps) {
  const [selectedElevatorType, setSelectedElevatorType] = useState<ElevatorType | null>(null);
  const [elevatorTypes, setElevatorTypes] = useState<ElevatorType[]>(defaultElevatorTypes);
  const [currentCategories, setCurrentCategories] = useState<Category[]>(defaultCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    parentId: undefined,
    technicalSpecs: [createSafeTechnicalSpec()]
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchElevatorTypes();
  }, []);

  useEffect(() => {
    if (selectedElevatorType) {
      fetchCategories(selectedElevatorType.id);
    }
  }, [selectedElevatorType]);

  const fetchElevatorTypes = async () => {
    try {
      setLoading(true);
      
      // Replace with actual API call
      // const response = await fetch('https://elevatorid.ieeu.ir/v1/admin/elevator-types', {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      // const data = await response.json();
      // setElevatorTypes(data.elevatorTypes || []);
      
      // Use default data for now (with API structure)
      setElevatorTypes(defaultElevatorTypes);
    } catch (error) {
      console.error('Error fetching elevator types:', error);
      toast.error('خطا در بارگذاری انواع آسانسور');
      // Fallback to default data
      setElevatorTypes(defaultElevatorTypes);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async (elevatorTypeId: string) => {
    try {
      setCategoriesLoading(true);
      
      // Replace with actual API call
      // const response = await fetch(`https://elevatorid.ieeu.ir/v1/admin/categories?elevatorTypeId=${elevatorTypeId}`, {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      // const data = await response.json();
      // const safeCategories = (data.categories || []).map(createSafeCategory).filter(cat => cat.id);
      // setCurrentCategories(safeCategories);
      
      // Use default data for now (with API structure)
      setCurrentCategories(defaultCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('خطا در بارگذاری دسته‌بندی‌ها');
      // Fallback to default data
      setCurrentCategories(defaultCategories);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
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

    if (!selectedElevatorType) {
      toast.error('نوع آسانسور انتخاب نشده است');
      return;
    }

    // Validate and filter technical specs
    const validSpecs = formData.technicalSpecs
      .map(createSafeTechnicalSpec)
      .filter(spec => spec.name.trim() && spec.type && spec.unit.trim());

    const categoryData = {
      name: formData.name.trim(),
      parentId: formData.parentId,
      elevatorTypeId: selectedElevatorType.id,
      technicalSpecs: validSpecs.length > 0 ? validSpecs : undefined
    };

    try {
      if (editingCategory) {
        // API call for update
        // const response = await fetch(`https://elevatorid.ieeu.ir/v1/admin/categories/${editingCategory.id}`, {
        //   method: 'PUT',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(categoryData)
        // });

        // Temporary local update for demo
        const updatedCategories = currentCategories.map(cat => 
          cat.id === editingCategory.id ? { ...editingCategory, ...categoryData, id: editingCategory.id } : cat
        );
        setCurrentCategories(updatedCategories);
        toast.success('دسته‌بندی بروزرسانی شد');
      } else {
        // API call for create
        // const response = await fetch('https://elevatorid.ieeu.ir/v1/admin/categories', {
        //   method: 'POST',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(categoryData)
        // });

        // Temporary local create for demo
        const newCategory: Category = {
          id: Date.now().toString(),
          name: formData.name.trim(),
          parentId: formData.parentId,
          technicalSpecs: validSpecs.length > 0 ? validSpecs : undefined
        };
        setCurrentCategories([...currentCategories, newCategory]);
        toast.success('دسته‌بندی جدید ایجاد شد');
      }

      setIsDialogOpen(false);
      resetForm();
      setEditingCategory(null);
      // fetchCategories(selectedElevatorType.id); // Will be used with real API
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('خطا در ذخیره دسته‌بندی');
    }
  };

  const handleEdit = (category: Category) => {
    const safeCategory = createSafeCategory(category);
    setEditingCategory(safeCategory);
    setFormData({
      name: safeCategory.name,
      parentId: safeCategory.parentId,
      technicalSpecs: safeCategory.technicalSpecs?.length 
        ? safeCategory.technicalSpecs.map(createSafeTechnicalSpec)
        : [createSafeTechnicalSpec()]
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (category: Category) => {
    if (!window.confirm(`آیا از حذف دسته‌بندی "${category.name}" اطمینان دارید؟`)) {
      return;
    }

    try {
      // API call for delete
      // const response = await fetch(`https://elevatorid.ieeu.ir/v1/admin/categories/${category.id}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json'
      //   }
      // });

      // Temporary local delete for demo
      const updatedCategories = currentCategories.filter(cat => cat.id !== category.id);
      setCurrentCategories(updatedCategories);
      toast.success('دسته‌بندی حذف شد');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('خطا در حذف دسته‌بندی');
    }
  };

  const handleSelectElevatorType = (elevatorType: ElevatorType) => {
    setSelectedElevatorType(elevatorType);
  };

  const handleBackToElevatorTypes = () => {
    setSelectedElevatorType(null);
  };

  // Get safe categories for dropdown
  const getSafeCategories = (): Category[] => {
    return currentCategories
      .map(createSafeCategory)
      .filter(cat => cat.id && cat.name);
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
    if (categoriesLoading) {
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
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      );
    }

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">در حال بارگذاری مدیریت دسته‌بندی‌ها...</p>
        </div>
      </div>
    );
  }

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
                <p>ابتدا نوع آسانسور مورد نظر خود را از لیست زیر انتخاب کنید، سپس می‌توانید دسته‌بندی‌های قطعات مربوط به آن نوع آسانسور را تعریف و مدیریت کنید.</p>
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

      {currentCategories.length === 0 && !categoriesLoading && (
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