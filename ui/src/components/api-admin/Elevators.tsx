import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import { 
  MoreHorizontal, 
  Eye, 
  Building,
  Package,
  RefreshCw,
  Loader2,
  Edit,
  Save,
  X,
  Plus
} from 'lucide-react';
import AdvancedTable, { TableColumn } from '../common/AdvancedTable';
import QRCodeGenerator from '../common/QRCodeGenerator';
import PDFGenerator from '../common/PDFGenerator';
import { toast } from 'sonner@2.0.3';
import { PersianDatePicker } from '../common/PersianDatePicker';
import ProvinceAndCitySelector from '../common/ProvinceAndCitySelector';
import ElevatorRegistrationForm from '../common/ElevatorRegistrationForm';
import { Elevator, ElevatorDetails, Part, ElevatorPart } from '../../types/api';
import { realApiRequest, RealApiError } from '../../lib/real-api-client';

interface ElevatorWithExtras extends Elevator {
  installerCompanyName?: string;
  ownerCompanyName?: string;
  status?: 'active' | 'maintenance' | 'out_of_order' | 'installing';
  elevatorType?: 'passenger' | 'freight' | 'service';
  capacity?: number;
  floors?: number;
  buildingName?: string;
  installationDate?: string;
  municipalRegion?: string;
  provinceName?: string;
  cityName?: string;
  registrationPlate?: string;
  buildingPermit?: string;
  parts?: ElevatorPart[];
}

interface StatsData {
  total: number;
  active: number;
  maintenance: number;
  outOfOrder: number;
  installing: number;
}

const statusColors = {
  active: 'bg-green-100 text-green-800',
  maintenance: 'bg-yellow-100 text-yellow-800',
  out_of_order: 'bg-red-100 text-red-800',
  installing: 'bg-blue-100 text-blue-800'
};

const statusLabels = {
  active: 'فعال',
  maintenance: 'در تعمیر',
  out_of_order: 'خارج از سرویس',
  installing: 'در حال نصب'
};

const elevatorTypeLabels = {
  passenger: 'مسافربر',
  freight: 'باربر',
  service: 'خدماتی'
};

export default function AdminElevators() {
  const [elevators, setElevators] = useState<ElevatorWithExtras[]>([]);
  const [selectedElevator, setSelectedElevator] = useState<ElevatorWithExtras | null>(null);
  const [elevatorDetails, setElevatorDetails] = useState<ElevatorDetails | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPartsModalOpen, setIsPartsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    active: 0,
    maintenance: 0,
    outOfOrder: 0,
    installing: 0
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [availableParts, setAvailableParts] = useState<Part[]>([]);
  const [selectedParts, setSelectedParts] = useState<number[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  // Edit form state
  const [editForm, setEditForm] = useState<{
    municipalityZone: string;
    buildPermitNo: string;
    registryPlate: string;
    province: string;
    city: string;
    address: string;
    postalCode: string;
  }>({
    municipalityZone: '',
    buildPermitNo: '',
    registryPlate: '',
    province: '',
    city: '',
    address: '',
    postalCode: ''
  });

  useEffect(() => {
    fetchElevators();
    fetchStats();
  }, [page]);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      
      // Use real API request
      const data = await realApiRequest.get('/admin/elevators/stats');
      const fetchedStats = data.stats || data;
      
      // Map API response to our interface
      const mappedStats: StatsData = {
        total: fetchedStats.total || 0,
        active: fetchedStats.active || 0,
        maintenance: fetchedStats.maintenance || 0,
        outOfOrder: fetchedStats.outOfOrder || fetchedStats.out_of_order || 0,
        installing: fetchedStats.installing || 0
      };
      
      setStats(mappedStats);
    } catch (error) {
      console.error('Error fetching elevator stats:', error);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای دریافت آمار آسانسورها');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت در دریافت آمار');
        } else {
          toast.error('خطا در بارگذاری آمار آسانسورها');
        }
      } else {
        toast.error('خطا در بارگذاری آمار آسانسورها');
      }
      
      // Set default empty stats on error
      setStats({
        total: 0,
        active: 0,
        maintenance: 0,
        outOfOrder: 0,
        installing: 0
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchElevators = async () => {
    try {
      setLoading(true);
      
      const params = {
        page,
        size: 15,
        ...(searchTerm && { q: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      };

      // Use real API request
      const data = await realApiRequest.get('/admin/elevators', params);
      const fetchedElevators = data.elevators || data.data || data || [];
      
      // Map API response to our interface if needed
      const mappedElevators = Array.isArray(fetchedElevators) ? fetchedElevators.map((elevator: any) => ({
        id: elevator.id?.toString() || elevator._id?.toString(),
        elevatorUid: elevator.elevator_uid || elevator.elevatorUid || elevator.uid || 'نامشخص',
        uid: elevator.elevator_uid || elevator.elevatorUid || elevator.uid || 'نامشخص',
        buildingName: elevator.building_name || elevator.buildingName || `ساختمان ${elevator.elevator_uid || elevator.elevatorUid}`,
        address: elevator.address || 'آدرس نامشخص',
        provinceName: elevator.province_name || elevator.provinceName || elevator.province || 'نامشخص',
        cityName: elevator.city_name || elevator.cityName || elevator.city || 'نامشخص',
        postalCode: elevator.postal_code || elevator.postalCode || '',
        municipalityZone: elevator.municipality_zone || elevator.municipalityZone || 'نامشخص',
        municipalRegion: elevator.municipality_zone || elevator.municipalityZone || 'نامشخص',
        buildPermitNo: elevator.build_permit_no || elevator.buildPermitNo || '',
        buildingPermit: elevator.build_permit_no || elevator.buildPermitNo || '',
        registryPlate: elevator.registry_plate || elevator.registryPlate || '',
        registrationPlate: elevator.registry_plate || elevator.registryPlate || '',
        installerCompanyId: (elevator.installer_company_id || elevator.installerCompanyId || 1).toString(),
        installerCompanyName: elevator.installer_company_name || elevator.installerCompanyName || 'شرکت نصب‌کننده',
        ownerCompanyId: '1',
        ownerCompanyName: 'شرکت مالک',
        installationDate: elevator.installation_date || elevator.installationDate || elevator.created_at?.split('T')[0] || elevator.createdAt?.split('T')[0] || new Date().toLocaleDateString('fa-IR'),
        status: elevator.status || (Math.random() > 0.7 ? 'maintenance' : 'active'),
        elevatorType: elevator.elevator_type || elevator.elevatorType || (Math.random() > 0.5 ? 'passenger' : 'freight'),
        capacity: elevator.capacity || Math.floor(Math.random() * 10) + 5,
        floors: elevator.floors || Math.floor(Math.random() * 20) + 3,
        parts: elevator.parts || [],
        createdAt: elevator.created_at || elevator.createdAt,
        updatedAt: elevator.updated_at || elevator.updatedAt,
        // API fields
        province: elevator.province || '',
        city: elevator.city || ''
      })) : [];

      setElevators(mappedElevators);
      setTotalPages(Math.ceil((data.total || mappedElevators.length) / 15));
    } catch (error) {
      console.error('Error fetching elevators:', error);
      
      // Set empty array on error
      setElevators([]);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای دریافت آسانسورها');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت در دریافت آسانسورها');
        } else {
          toast.error('خطا در بارگذاری آسانسورها');
        }
      } else {
        toast.error('خطا در بارگذاری آسانسورها');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchElevatorDetails = async (elevatorId: number | string) => {
    try {
      // Use real API request
      const data = await realApiRequest.get(`/admin/elevators/${elevatorId}`);
      const details = data.elevator || data.data || data;
      
      if (details) {
        setElevatorDetails(details);
        return details;
      }
    } catch (error) {
      console.error('Error fetching elevator details:', error);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای دریافت جزئیات آسانسور');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت در دریافت جزئیات');
        } else {
          toast.error('خطا در بارگذاری جزئیات آسانسور');
        }
      } else {
        toast.error('خطا در بارگذاری جزئیات آسانسور');
      }
    }
    return null;
  };

  const fetchAvailableParts = async () => {
    try {
      // Use real API request
      const data = await realApiRequest.get('/admin/parts', { 
        page: 1, 
        size: 100,
        owner_type: 'company' // Only company-owned parts
      });
      
      const fetchedParts = data.parts || data.data || data || [];
      const mappedParts = Array.isArray(fetchedParts) ? fetchedParts.map((part: any) => ({
        id: part.id || part._id,
        partUid: part.part_uid || part.partUid || part.uid || 'نامشخص',
        title: part.title || part.name || 'نامشخص',
        barcode: part.barcode || '',
        categoryId: part.category_id || part.categoryId || 0,
        manufacturerCountry: part.manufacturer_country || part.manufacturerCountry || 'نامشخص',
        originCountry: part.origin_country || part.originCountry || 'نامشخص',
        registrantCompanyId: part.registrant_company_id || part.registrantCompanyId || 0,
        currentOwner: part.current_owner || part.currentOwner || { type: 'company' },
        createdAt: part.created_at || part.createdAt,
        updatedAt: part.updated_at || part.updatedAt
      })) : [];
      
      setAvailableParts(mappedParts);
    } catch (error) {
      console.error('Error fetching parts:', error);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای دریافت قطعات');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت در دریافت قطعات');
        } else {
          toast.error('خطا در بارگذاری قطعات');
        }
      } else {
        toast.error('خطا در بارگذاری قطعات');
      }
      
      setAvailableParts([]);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchElevators();
      await fetchStats();
      toast.success('داده‌ها با موفقیت به‌روزرسانی شد');
    } catch (error) {
      toast.error('خطا در به‌روزرسانی داده‌ها');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleViewDetails = async (elevator: ElevatorWithExtras) => {
    setSelectedElevator(elevator);
    await fetchElevatorDetails(elevator.id);
  };

  const handleEditElevator = async (elevator: ElevatorWithExtras) => {
    setSelectedElevator(elevator);
    setEditForm({
      municipalityZone: elevator.municipalRegion || '',
      buildPermitNo: elevator.buildingPermit || '',
      registryPlate: elevator.registrationPlate || '',
      province: elevator.provinceName || '',
      city: elevator.cityName || '',
      address: elevator.address || '',
      postalCode: elevator.postalCode || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedElevator) return;

    try {
      // Use real API request
      await realApiRequest.put(`/admin/elevators/${selectedElevator.id}`, editForm);
      toast.success('اطلاعات آسانسور با موفقیت به‌روزرسانی شد');
      setIsEditModalOpen(false);
      await fetchElevators();
    } catch (error) {
      console.error('Error updating elevator:', error);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای به‌روزرسانی آسانسور');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت در به‌روزرسانی');
        } else {
          toast.error('خطا در به‌روزرسانی اطلاعات آسانسور');
        }
      } else {
        toast.error('خطا در به‌روزرسانی اطلاعات آسانسور');
      }
    }
  };

  const handleManageParts = async (elevator: ElevatorWithExtras) => {
    setSelectedElevator(elevator);
    await fetchElevatorDetails(elevator.id);
    await fetchAvailableParts();
    setIsPartsModalOpen(true);
  };

  const handleInstallPart = async (partId: number) => {
    if (!selectedElevator) return;

    try {
      // Use real API request
      await realApiRequest.post(`/admin/elevators/${selectedElevator.id}/parts`, {
        part_id: partId,
        installed_at: new Date().toISOString()
      });
      toast.success('قطعه با موفقیت نصب شد');
      await fetchElevatorDetails(selectedElevator.id);
    } catch (error) {
      console.error('Error installing part:', error);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای نصب قطعه');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت در نصب قطعه');
        } else {
          toast.error('خطا در نصب قطعه');
        }
      } else {
        toast.error('خطا در نصب قطعه');
      }
    }
  };

  const handleReplacePart = async (partId: number) => {
    if (!selectedElevator) return;

    try {
      // Use real API request
      await realApiRequest.put(`/admin/elevators/${selectedElevator.id}/parts/${partId}`, {
        removed_at: new Date().toISOString()
      });
      toast.success('قطعه با موفقیت تعویض شد');
      await fetchElevatorDetails(selectedElevator.id);
    } catch (error) {
      console.error('Error replacing part:', error);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای تعویض قطعه');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت در تعویض قطعه');
        } else {
          toast.error('خطا در تعویض قطعه');
        }
      } else {
        toast.error('خطا در تعویض قطعه');
      }
    }
  };

  const columns: TableColumn<ElevatorWithExtras>[] = [
    {
      key: 'uid',
      label: 'شناسه آسانسور',
      sortable: true,
      render: (value, elevator) => (
        <div className="font-medium">
          {elevator.uid || elevator.elevatorUid}
        </div>
      )
    },
    {
      key: 'buildingName',
      label: 'نام ساختمان',
      sortable: true,
      render: (value, elevator) => (
        <div>
          <div className="font-medium">{elevator.buildingName || `ساختمان ${elevator.elevatorUid}`}</div>
          <div className="text-sm text-gray-500">{elevator.municipalRegion || elevator.municipalityZone}</div>
        </div>
      )
    },
    {
      key: 'address',
      label: 'آدرس',
      render: (value, elevator) => (
        <div className="max-w-xs truncate">
          {elevator.address}
        </div>
      )
    },
    {
      key: 'province',
      label: 'استان/شهر',
      render: (value, elevator) => (
        <div className="text-sm">
          <div>{elevator.provinceName || elevator.province}</div>
          <div className="text-gray-500">{elevator.cityName || elevator.city}</div>
        </div>
      )
    },
    {
      key: 'elevatorType',
      label: 'نوع آسانسور',
      sortable: true,
      filterable: true,
      render: (value, elevator) => (
        <Badge variant="secondary" className="text-xs">
          {elevatorTypeLabels[elevator.elevatorType || 'passenger']}
        </Badge>
      )
    },
    {
      key: 'capacity',
      label: 'ظرفیت',
      sortable: true,
      render: (value, elevator) => (
        <div className="text-center">
          {elevator.capacity || 8} نفر
        </div>
      )
    },
    {
      key: 'floors',
      label: 'طبقات',
      sortable: true,
      render: (value, elevator) => (
        <div className="text-center">
          {elevator.floors || 5}
        </div>
      )
    },
    {
      key: 'status',
      label: 'وضعیت',
      sortable: true,
      filterable: true,
      render: (value, elevator) => (
        <Badge className={statusColors[elevator.status || 'active']}>
          {statusLabels[elevator.status || 'active']}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      label: 'تاریخ ثبت',
      sortable: true,
      render: (value, elevator) => (
        <div className="text-sm">
          {elevator.createdAt ? new Date(elevator.createdAt).toLocaleDateString('fa-IR') : '-'}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'عملیات',
      render: (value, elevator) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48" style={{ direction: 'rtl' }}>
            <DropdownMenuItem 
              onClick={() => handleViewDetails(elevator)}
              className="flex items-center gap-2"
              style={{ textAlign: 'right', justifyContent: 'flex-end' }}
            >
              <Eye className="w-4 h-4" />
              مشاهده جزئیات
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleEditElevator(elevator)}
              className="flex items-center gap-2"
              style={{ textAlign: 'right', justifyContent: 'flex-end' }}
            >
              <Edit className="w-4 h-4" />
              ویرایش اطلاعات
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleManageParts(elevator)}
              className="flex items-center gap-2"
              style={{ textAlign: 'right', justifyContent: 'flex-end' }}
            >
              <Package className="w-4 h-4" />
              مدیریت قطعات
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  const filteredElevators = elevators.filter(elevator => {
    const searchValue = searchTerm.toLowerCase();
    const matchesSearch = 
      (elevator.uid || elevator.elevatorUid || '').toLowerCase().includes(searchValue) ||
      (elevator.buildingName || '').toLowerCase().includes(searchValue) ||
      (elevator.address || '').toLowerCase().includes(searchValue) ||
      (elevator.provinceName || elevator.province || '').toLowerCase().includes(searchValue) ||
      (elevator.cityName || elevator.city || '').toLowerCase().includes(searchValue);
    
    const matchesStatus = statusFilter === 'all' || elevator.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">در حال بارگذاری آسانسورها...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="text-right">
          <h1 className="text-3xl font-bold text-gray-900">مدیریت آسانسورها</h1>
          <p className="text-muted-foreground mt-1">لیست و مدیریت تمامی آسانسورهای ثبت‌شده در سیستم</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Building className="w-4 h-4 ml-2" />
              ثبت آسانسور جدید
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" style={{ direction: 'rtl', textAlign: 'right' }}>
            <DialogHeader className="text-right shrink-0" dir="rtl">
              <DialogTitle className="text-right">ثبت آسانسور جدید</DialogTitle>
              <DialogDescription className="text-right">
                اطلاعات آسانسور جدید را وارد کنید. تمامی فیلدهای ستاره‌دار الزامی می‌باشند.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto modal-scroll-container">
              <ElevatorRegistrationForm 
                mode="admin"
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={async (elevatorData) => {
                  try {
                    const apiData = {
                      municipality_zone: elevatorData.municipalRegion,
                      build_permit_no: elevatorData.buildingPermit || 'N/A',
                      registry_plate: elevatorData.registrationPlate || 'N/A',
                      province: elevatorData.provinceName || '',
                      city: elevatorData.cityName || '',
                      address: elevatorData.address,
                      postal_code: elevatorData.postalCode || '0000000000',
                      installer_company_id: parseInt(elevatorData.installerCompanyId || '1'),
                      parts: elevatorData.parts.map(part => ({ part_id: part.partId }))
                    };

                    // Use real API request
                    const data = await realApiRequest.post('/admin/elevators', apiData);
                    const createdElevator = data.elevator || data.data || data;
                    
                    if (createdElevator) {
                      const elevatorUid = createdElevator.elevator_uid || createdElevator.elevatorUid || createdElevator.uid;
                      toast.success(`✅ آسانسور جدید با شناسه ${elevatorUid} ثبت شد`);
                      setIsCreateModalOpen(false);
                      await fetchElevators();
                    } else {
                      toast.error('خطا در ثبت آسانسور');
                    }
                  } catch (error) {
                    console.error('Error creating elevator:', error);
                    
                    if (error && typeof error === 'object' && 'isNetworkError' in error) {
                      const apiError = error as RealApiError;
                      if (apiError.isNetworkError) {
                        toast.error('عدم دسترسی به سرور برای ثبت آسانسور');
                      } else if (apiError.isAuthError) {
                        toast.error('خطای احراز هویت در ثبت آسانسور');
                      } else {
                        toast.error('خطا در ثبت آسانسور');
                      }
                    } else {
                      toast.error('خطا در ثبت آسانسور. لطفاً دوباره تلاش کنید.');
                    }
                  }
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">کل آسانسورها</p>
                {statsLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">در حال بارگذاری...</span>
                  </div>
                ) : (
                  <p className="text-2xl font-bold">{stats.total}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">فعال</p>
                {statsLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">در حال بارگذاری...</span>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <RefreshCw className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">در تعمیر</p>
                {statsLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">در حال بارگذاری...</span>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-yellow-600">{stats.maintenance}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Building className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">خارج از سرویس</p>
                {statsLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">در حال بارگذاری...</span>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-red-600">{stats.outOfOrder}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">در حال نصب</p>
                {statsLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">در حال بارگذاری...</span>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-blue-600">{stats.installing}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="جستجو بر اساس شناسه، نام ساختمان، آدرس یا شهر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                style={{ textAlign: 'right', direction: 'rtl' }}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="فیلتر وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                  <SelectItem value="active">فعال</SelectItem>
                  <SelectItem value="maintenance">در تعمیر</SelectItem>
                  <SelectItem value="out_of_order">خارج از سرویس</SelectItem>
                  <SelectItem value="installing">در حال نصب</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Elevators Table */}
      <Card>
        <CardHeader>
          <CardTitle>لیست آسانسورها</CardTitle>
          <CardDescription>
            {filteredElevators.length} آسانسور از مجموع {elevators.length} آسانسور
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                <p className="text-muted-foreground">در حال بارگذاری لیست آسانسورها...</p>
              </div>
            </div>
          ) : elevators.length === 0 && !loading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-center space-y-4">
                <Building className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-medium text-foreground">هیچ آسانسوری یافت نشد</h3>
                  <p className="text-muted-foreground mt-1">
                    ممکن است مشکلی در اتصال به سرور وجود داشته باشد یا هنوز آسانسوری ثبت نشده باشد.
                  </p>
                </div>
                <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline">
                  {isRefreshing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      در حال تلاش مجدد...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 ml-2" />
                      تلاش مجدد
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <AdvancedTable
              data={filteredElevators}
              columns={columns}
              searchable={false}
              exportable={true}
              pagination={true}
              pageSize={15}
              emptyMessage="آسانسوری یافت نشد"
              onRowClick={(elevator) => handleViewDetails(elevator)}
              onRefresh={handleRefresh}
              refreshing={isRefreshing}
            />
          )}
        </CardContent>
      </Card>

      {/* Elevator Details Modal */}
      {selectedElevator && !isEditModalOpen && !isPartsModalOpen && (
        <Dialog open={!!selectedElevator} onOpenChange={() => setSelectedElevator(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden" style={{ direction: 'rtl', textAlign: 'right' }}>
            <DialogHeader className="text-right">
              <DialogTitle className="flex items-center gap-2" style={{ textAlign: 'right' }}>
                <Building className="w-5 h-5" />
                جزئیات آسانسور {selectedElevator.uid || selectedElevator.elevatorUid}
              </DialogTitle>
              <DialogDescription className="text-right">
                اطلاعات کامل آسانسور و شناسنامه آن
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto modal-scroll-container">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">اطلاعات پایه</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">شناسه آسانسور</Label>
                      <p className="font-medium">{selectedElevator.uid || selectedElevator.elevatorUid}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">نام ساختمان</Label>
                      <p className="font-medium">{selectedElevator.buildingName || `ساختمان ${selectedElevator.elevatorUid}`}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">آدرس</Label>
                      <p>{selectedElevator.address}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">استان</Label>
                        <p>{selectedElevator.provinceName || selectedElevator.province}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">شهر</Label>
                        <p>{selectedElevator.cityName || selectedElevator.city}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">کد پستی</Label>
                        <p>{selectedElevator.postalCode}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">منطقه شهرداری</Label>
                        <p>{selectedElevator.municipalRegion || selectedElevator.municipalityZone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Specifications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">مشخصات فنی</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">نوع آسانسور</Label>
                      <div className="font-medium">
                        <Badge variant="secondary">
                          {elevatorTypeLabels[selectedElevator.elevatorType || 'passenger']}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">ظرفیت</Label>
                        <p>{selectedElevator.capacity || 8} نفر</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">تعداد طبقات</Label>
                        <p>{selectedElevator.floors || 5} طبقه</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">تاریخ ثبت</Label>
                      <p>{selectedElevator.createdAt ? new Date(selectedElevator.createdAt).toLocaleDateString('fa-IR') : '-'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">وضعیت</Label>
                      <div>
                        <Badge className={statusColors[selectedElevator.status || 'active']}>
                          {statusLabels[selectedElevator.status || 'active']}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">اطلاعات مجوزها</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">شماره پروانه ساختمان</Label>
                      <p className="font-medium">{selectedElevator.buildingPermit || selectedElevator.buildPermitNo}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">شماره پلاک ثبتی</Label>
                      <p className="font-medium">{selectedElevator.registrationPlate || selectedElevator.registryPlate}</p>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">QR کد آسانسور</h3>
                  <div className="flex justify-center">
                    <QRCodeGenerator
                      data={`https://elevatorid.ieeu.ir/elevator/${selectedElevator.uid || selectedElevator.elevatorUid}`}
                      size={200}
                    />
                  </div>
                </div>
              </div>

              {/* Parts Management */}
              <div className="p-6 border-t">
                <h3 className="text-lg font-semibold mb-4">قطعات نصب شده</h3>
                {elevatorDetails?.parts && elevatorDetails.parts.length > 0 ? (
                  <div className="space-y-2">
                    {elevatorDetails.parts.map((part) => (
                      <div key={part.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{part.part?.title || `قطعه ${part.partId}`}</p>
                          <p className="text-sm text-gray-600">شناسه قطعه: {part.partId}</p>
                          <p className="text-sm text-gray-600">تاریخ نصب: {new Date(part.installedAt).toLocaleDateString('fa-IR')}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          نصب شده
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">هیچ قطعه‌ای ثبت نشده است</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 p-6 border-t">
                <QRCodeGenerator
                  data={`https://elevatorid.ieeu.ir/elevator/${selectedElevator.uid || selectedElevator.elevatorUid}`}
                  downloadButton={true}
                  filename={`elevator-${selectedElevator.uid || selectedElevator.elevatorUid}-qr`}
                />
                <PDFGenerator
                  title={`شناسنامه آسانسور ${selectedElevator.uid || selectedElevator.elevatorUid}`}
                  data={selectedElevator}
                  filename={`elevator-${selectedElevator.uid || selectedElevator.elevatorUid}-certificate.pdf`}
                />
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedElevator(null)}
                >
                  بستن
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Elevator Modal */}
      {selectedElevator && isEditModalOpen && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl" style={{ direction: 'rtl', textAlign: 'right' }}>
            <DialogHeader className="text-right">
              <DialogTitle className="flex items-center gap-2" style={{ textAlign: 'right' }}>
                <Edit className="w-5 h-5" />
                ویرایش اطلاعات آسانسور {selectedElevator.uid || selectedElevator.elevatorUid}
              </DialogTitle>
              <DialogDescription className="text-right">
                اطلاعات آسانسور را ویرایش کنید
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="municipalityZone">منطقه شهرداری</Label>
                  <Input
                    id="municipalityZone"
                    value={editForm.municipalityZone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, municipalityZone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="buildPermitNo">شماره پروانه ساختمان</Label>
                  <Input
                    id="buildPermitNo"
                    value={editForm.buildPermitNo}
                    onChange={(e) => setEditForm(prev => ({ ...prev, buildPermitNo: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="registryPlate">شماره پلاک ثبتی</Label>
                  <Input
                    id="registryPlate"
                    value={editForm.registryPlate}
                    onChange={(e) => setEditForm(prev => ({ ...prev, registryPlate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">کد پستی</Label>
                  <Input
                    id="postalCode"
                    value={editForm.postalCode}
                    onChange={(e) => setEditForm(prev => ({ ...prev, postalCode: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="province">استان</Label>
                  <Input
                    id="province"
                    value={editForm.province}
                    onChange={(e) => setEditForm(prev => ({ ...prev, province: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="city">شهر</Label>
                  <Input
                    id="city"
                    value={editForm.city}
                    onChange={(e) => setEditForm(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">آدرس</Label>
                <Textarea
                  id="address"
                  value={editForm.address}
                  onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSaveEdit} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  ذخیره تغییرات
                </Button>
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  <X className="w-4 h-4 ml-2" />
                  انصراف
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Parts Management Modal */}
      {selectedElevator && isPartsModalOpen && (
        <Dialog open={isPartsModalOpen} onOpenChange={setIsPartsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden" style={{ direction: 'rtl', textAlign: 'right' }}>
            <DialogHeader className="text-right">
              <DialogTitle className="flex items-center gap-2" style={{ textAlign: 'right' }}>
                <Package className="w-5 h-5" />
                مدیریت قطعات آسانسور {selectedElevator.uid || selectedElevator.elevatorUid}
              </DialogTitle>
              <DialogDescription className="text-right">
                نصب، تعویض و مدیریت قطعات آسانسور
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto modal-scroll-container">
              <Tabs defaultValue="installed" className="p-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="installed">قطعات نصب شده</TabsTrigger>
                  <TabsTrigger value="available">نصب قطعه جدید</TabsTrigger>
                </TabsList>
                
                <TabsContent value="installed" className="space-y-4">
                  {elevatorDetails?.parts && elevatorDetails.parts.length > 0 ? (
                    <div className="space-y-3">
                      {elevatorDetails.parts.map((part) => (
                        <div key={part.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{part.part?.title || `قطعه ${part.partId}`}</p>
                            <p className="text-sm text-gray-600">شناسه قطعه: {part.partId}</p>
                            <p className="text-sm text-gray-600">تاریخ نصب: {new Date(part.installedAt).toLocaleDateString('fa-IR')}</p>
                            {part.removedAt && (
                              <p className="text-sm text-red-600">تاریخ جابجایی: {new Date(part.removedAt).toLocaleDateString('fa-IR')}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={part.removedAt ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                              {part.removedAt ? 'تعویض شده' : 'نصب شده'}
                            </Badge>
                            {!part.removedAt && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReplacePart(part.partId)}
                              >
                                تعویض
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">هیچ قطعه‌ای نصب نشده است</p>
                  )}
                </TabsContent>
                
                <TabsContent value="available" className="space-y-4">
                  {availableParts.length > 0 ? (
                    <div className="space-y-3">
                      {availableParts.map((part) => (
                        <div key={part.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{part.title}</p>
                            <p className="text-sm text-gray-600">شناسه: {part.partUid}</p>
                            {part.barcode && (
                              <p className="text-sm text-gray-600">بارکد: {part.barcode}</p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleInstallPart(part.id)}
                            className="flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            نصب
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">قطعه‌ای برای نصب موجود نیست</p>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            <div className="flex gap-3 p-6 border-t">
              <Button variant="outline" onClick={() => setIsPartsModalOpen(false)}>
                بستن
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}