import React, { useState } from 'react';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Building,
  Search,
  MoreHorizontal
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

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



// مقادیر پیش‌فرض برای انواع مختلف آسانسور
const defaultCategories: ElevatorCategory[] = [
  {
    id: '1',
    name: 'آسانسور هیدرولیک',
    description: 'آسانسور با سیستم هیدرولیک مناسب برای ساختمان‌های کم طبقه تا 6 طبقه، قابلیت حمل بار تا 2500 کیلوگرم',
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

interface ElevatorCategoryManagementProps {
  triggerDialog?: boolean;
}

export default function ElevatorCategoryManagement({ triggerDialog }: ElevatorCategoryManagementProps) {
  const [categories, setCategories] = useState<ElevatorCategory[]>(defaultCategories);
  const [editingCategory, setEditingCategory] = useState<ElevatorCategory | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  // Handle external trigger to open dialog
  React.useEffect(() => {
    if (triggerDialog) {
      resetForm();
      setEditingCategory(null);
      setIsDialogOpen(true);
    }
  }, [triggerDialog]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<ElevatorCategoryFormData>({
    name: '',
    description: '',
    isActive: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      isActive: true
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('نوع آسانسور الزامی است');
      return;
    }

    if (editingCategory) {
      // ویرایش دسته‌بندی موجود
      setCategories(prev => 
        prev.map(cat => 
          cat.id === editingCategory.id 
            ? { 
                ...cat, 
                ...formData,
                name: formData.name.trim(),
                description: formData.description.trim()
              }
            : cat
        )
      );
      toast.success('نوع آسانسور بروزرسانی شد');
    } else {
      // ایجاد دسته‌بندی جدید
      const newCategory: ElevatorCategory = {
        ...formData,
        id: Date.now().toString(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        createdAt: new Date().toLocaleDateString('fa-IR')
      };
      
      setCategories(prev => [...prev, newCategory]);
      toast.success('نوع آسانسور جدید ایجاد شد');
    }

    setIsDialogOpen(false);
    resetForm();
    setEditingCategory(null);
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

  const handleDelete = (category: ElevatorCategory) => {
    if (window.confirm(`آیا از حذف نوع آسانسور "${category.name}" اطمینان دارید؟`)) {
      setCategories(prev => prev.filter(cat => cat.id !== category.id));
      toast.success('نوع آسانسور حذف شد');
    }
  };

  const handleToggleActive = (categoryId: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat
      )
    );
    
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      toast.success(`نوع آسانسور "${category.name}" ${!category.isActive ? 'فعال' : 'غیرفعال'} شد`);
    }
  };

  // فیلتر کردن دسته‌بندی‌ها
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'active' && category.isActive) ||
                         (filterType === 'inactive' && !category.isActive);
    
    return matchesSearch && matchesFilter;
  });

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
                  نوع آسانسور و توضیحات آن را تعریف کنید
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4" style={{ direction: 'rtl' }}>
                <div className="space-y-2">
                  <Label htmlFor="name" style={{ textAlign: 'right', display: 'block' }}>نوع آسانسور *</Label>
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
                    <Button type="submit">
                      {editingCategory ? 'بروزرسانی' : 'ایجاد'}
                    </Button>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>


        </div>
      </div>

      {/* جستجو و فیلتر */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-700">جستجو در انواع آسانسور</Label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="جستجو بر اساس نام یا توضیحات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white pr-10 border-gray-300 focus:border-gray-900"
                style={{ textAlign: 'right', direction: 'rtl' }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700">فیلتر بر اساس وضعیت</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="bg-white border-gray-300 focus:border-gray-900" style={{ textAlign: 'right', direction: 'rtl' }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent style={{ direction: 'rtl' }}>
                <SelectItem value="all">همه موارد ({categories.length})</SelectItem>
                <SelectItem value="active">فعال ({categories.filter(cat => cat.isActive).length})</SelectItem>
                <SelectItem value="inactive">غیرفعال ({categories.filter(cat => !cat.isActive).length})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* نمایش آمار جستجو */}
        {searchTerm && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-700">
              نتایج جستجو: <span className="font-medium">{filteredCategories.length}</span> مورد از {categories.length} نوع آسانسور
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSearchTerm('')}
                className="mr-2 text-gray-600 hover:text-gray-800"
              >
                پاک کردن جستجو
              </Button>
            </p>
          </div>
        )}
      </div>

      {/* آمار سریع */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-gray-200 bg-white hover:shadow-sm transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Building className="w-5 h-5 text-gray-700" />
              <div className="text-2xl text-gray-900">{categories.length}</div>
            </div>
            <div className="text-sm text-gray-600">کل انواع آسانسور</div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 bg-white hover:shadow-sm transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-gray-700">✓</span>
              <div className="text-2xl text-gray-900">
                {categories.filter(cat => cat.isActive).length}
              </div>
            </div>
            <div className="text-sm text-gray-600">انواع فعال</div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 bg-white hover:shadow-sm transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-gray-700">○</span>
              <div className="text-2xl text-gray-900">
                {categories.filter(cat => !cat.isActive).length}
              </div>
            </div>
            <div className="text-sm text-gray-600">انواع غیرفعال</div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 bg-white hover:shadow-sm transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-gray-700">%</span>
              <div className="text-2xl text-gray-900">
                {Math.round((categories.filter(cat => cat.isActive).length / categories.length) * 100) || 0}%
              </div>
            </div>
            <div className="text-sm text-gray-600">نرخ فعال‌سازی</div>
          </CardContent>
        </Card>
      </div>

      {/* لیست انواع آسانسور */}
      <Card className="border border-gray-200 bg-white">
        <CardHeader className="bg-white border-b border-gray-200">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Building className="w-5 h-5 text-gray-700" />
            لیست انواع آسانسور
            <Badge variant="outline" className="mr-auto border-gray-300 text-gray-700">
              {filteredCategories.length} مورد
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[25%] text-right text-gray-900">نوع آسانسور</TableHead>
                  <TableHead className="w-[40%] text-right text-gray-900">توضیحات</TableHead>
                  <TableHead className="w-[120px] text-right text-gray-900">وضعیت</TableHead>
                  <TableHead className="w-[110px] text-right text-gray-900">تاریخ ایجاد</TableHead>
                  <TableHead className="w-[100px] text-center text-gray-900">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category, index) => (
                  <TableRow 
                    key={category.id} 
                    className={`transition-colors hover:bg-gray-50 ${!category.isActive ? 'opacity-60 bg-gray-25' : ''}`}
                  >
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-700">
                          {index + 1}
                        </span>
                        <span className="text-gray-900">{category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {category.description || '-'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Badge 
                          variant={category.isActive ? "default" : "secondary"}
                          className={`text-xs ${category.isActive ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                          {category.isActive ? 'فعال' : 'غیرفعال'}
                        </Badge>
                        <Switch
                          checked={category.isActive}
                          onCheckedChange={() => handleToggleActive(category.id)}
                          className="scale-75"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 text-right">
                      {category.createdAt}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-gray-50"
                            >
                              <MoreHorizontal className="h-4 w-4 text-gray-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" style={{ direction: 'rtl' }}>
                            <DropdownMenuItem 
                              onClick={() => handleEdit(category)} 
                              style={{ textAlign: 'right', justifyContent: 'flex-end' }}
                              className="hover:bg-gray-50"
                            >
                              <Edit className="h-4 w-4 mr-2 text-gray-600" />
                              ویرایش
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleToggleActive(category.id)}
                              style={{ textAlign: 'right', justifyContent: 'flex-end' }}
                              className="hover:bg-gray-50"
                            >
                              <span className="h-4 w-4 mr-2 text-gray-600">{category.isActive ? '○' : '●'}</span>
                              {category.isActive ? 'غیرفعال کردن' : 'فعال کردن'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(category)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              style={{ textAlign: 'right', justifyContent: 'flex-end' }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* پیام‌های خالی */}
      {filteredCategories.length === 0 && categories.length > 0 && (
        <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg mb-2 text-gray-900">نتیجه‌ای یافت نشد</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              هیچ نوع آسانسوری با معیارهای جستجوی شما پیدا نشد.<br />
              لطفاً کلمات کلیدی یا فیلترهای مختلفی امتحان کنید.
            </p>
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                }}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                پاک کردن فیلترها
              </Button>
              <Button
                onClick={() => {
                  resetForm();
                  setEditingCategory(null);
                  setIsDialogOpen(true);
                }}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                <Plus className="w-4 h-4 ml-1" />
                ایجاد نوع جدید
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {categories.length === 0 && (
        <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-xl mb-3 text-gray-900">شروع به تعریف انواع آسانسور کنید</h3>
            <p className="text-gray-600 mb-6 leading-relaxed max-w-md mx-auto">
              هنوز هیچ نوع آسانسوری تعریف نشده است. برای شروع، اولین نوع آسانسور خود را ایجاد کنید تا بتوانید دسته‌بندی قطعات را مدیریت کنید.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  resetForm();
                  setEditingCategory(null);
                  setIsDialogOpen(true);
                }}
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3"
                size="lg"
              >
                <Plus className="w-5 h-5 ml-2" />
                ایجاد اولین نوع آسانسور
              </Button>
              <div className="text-sm text-gray-600">
                نکته: شما می‌توانید انواع مختلف آسانسور مانند هیدرولیک و کششی را تعریف کنید
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}