import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { PersianDatePicker } from '../common/PersianDatePicker';
import ElevatorRegistrationForm from '../common/ElevatorRegistrationForm';
import { 
  Search, 
  Plus,
  MoreHorizontal, 
  Eye, 
  Building,
  Package,
  MapPin,
  Settings,
  RefreshCw,
  FolderTree,
  CheckCircle,
  Clock,
  AlertCircle,
  Download
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import QRCodeGenerator from '../common/QRCodeGenerator';
import { elevatorsService } from '../../services/elevators.service';

// Types
interface Elevator {
  id: string;
  uid: string;
  buildingName: string;
  buildingType: string;
  address: string;
  province: string;
  city: string;
  municipalRegion: string;
  postalCode: string;
  buildingPermit: string;
  registrationPlate: string;
  installationDate: string;
  floors: number;
  capacity: string;
  motorType: string;
  status: 'active' | 'maintenance' | 'out_of_order' | 'installing';
  lastInspection: string;
  nextInspection: string;
  parts: ElevatorPart[];
  owner: {
    name: string;
    phone: string;
    email: string;
  };
  manager: {
    name: string;
    phone: string;
    company: string;
  };
  installer: {
    name: string;
    phone: string;
    company: string;
    license: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ElevatorPart {
  id: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  installationDate: string;
  warrantyExpiry: string;
  status: 'working' | 'needs_maintenance' | 'faulty';
}

export default function UserElevators() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCertificate, setSelectedCertificate] = useState<Elevator | null>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [elevators, setElevators] = useState<Elevator[]>([
    {
      id: '1',
      uid: 'ELV-2024-001',
      buildingName: 'برج میلاد',
      buildingType: 'اداری',
      address: 'تهران، خیابان ولیعصر، کوچه میلاد، پلاک 15',
      province: 'تهران',
      city: 'تهران',
      municipalRegion: '6',
      postalCode: '1234567890',
      buildingPermit: 'BP-2024-001',
      registrationPlate: 'RP-2024-001',
      installationDate: '1403/01/15',
      floors: 12,
      capacity: '8 نفر - 630 کیلوگرم',
      motorType: 'موتور کششی',
      status: 'active',
      lastInspection: '1403/05/10',
      nextInspection: '1403/11/10',
      parts: [
        {
          id: 'p1',
          name: 'موتور اصلی',
          brand: 'شیندلر',
          model: 'VF30-S',
          serialNumber: 'SH2023001',
          installationDate: '1403/01/15',
          warrantyExpiry: '1405/01/15',
          status: 'working'
        },
        {
          id: 'p2',
          name: 'کنترلر فرکانس',
          brand: 'زیمنس',
          model: 'SINAMICS-G120',
          serialNumber: 'SI2023002',
          installationDate: '1403/01/15',
          warrantyExpiry: '1405/01/15',
          status: 'working'
        }
      ],
      owner: {
        name: 'احمد محمدی',
        phone: '09123456789',
        email: 'ahmad@example.com'
      },
      manager: {
        name: 'علی رضایی',
        phone: '09123456790',
        company: 'شرکت مدیریت ساختمان'
      },
      installer: {
        name: 'محسن احمدی',
        phone: '09123456791',
        company: 'شرکت نصب آسانسور پارس',
        license: 'LIC-2024-001'
      },
      createdAt: '1403/01/15',
      updatedAt: '1403/05/20'
    },
    {
      id: '2',
      uid: 'ELV-2024-002',
      buildingName: 'مجتمع آزادی',
      buildingType: 'مسکونی',
      address: 'تهران، خیابان آزادی، کوچه گلستان، پلاک 25',
      province: 'تهران',
      city: 'تهران',
      municipalRegion: '2',
      postalCode: '1234567891',
      buildingPermit: 'BP-2024-002',
      registrationPlate: 'RP-2024-002',
      installationDate: '1403/02/10',
      floors: 8,
      capacity: '6 نفر - 450 کیلوگرم',
      motorType: 'موتور هیدرولیک',
      status: 'maintenance',
      lastInspection: '1403/04/15',
      nextInspection: '1403/10/15',
      parts: [
        {
          id: 'p3',
          name: 'پمپ هیدرولیک',
          brand: 'کونه',
          model: 'KH-450',
          serialNumber: 'KH2023003',
          installationDate: '1403/02/10',
          warrantyExpiry: '1405/02/10',
          status: 'needs_maintenance'
        }
      ],
      owner: {
        name: 'فاطمه کریمی',
        phone: '09123456792',
        email: 'fateme@example.com'
      },
      manager: {
        name: 'حسن موسوی',
        phone: '09123456793',
        company: 'شرکت مدیریت املاک'
      },
      installer: {
        name: 'رضا زارعی',
        phone: '09123456794',
        company: 'شرکت آسانسور سازان',
        license: 'LIC-2024-002'
      },
      createdAt: '1403/02/10',
      updatedAt: '1403/05/18'
    }
  ]);

  const statusColors = {
    active: 'bg-green-100 text-green-800 border-green-300',
    maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    out_of_order: 'bg-red-100 text-red-800 border-red-300',
    installing: 'bg-blue-100 text-blue-800 border-blue-300'
  };

  const statusLabels = {
    active: '🟢 فعال',
    maintenance: '🟡 تعمیرات',
    out_of_order: '🔴 خراب',
    installing: '🔵 در حال نصب'
  };

  const getElevatorStats = () => {
    return {
      total: elevators.length,
      active: elevators.filter(e => e.status === 'active').length,
      maintenance: elevators.filter(e => e.status === 'maintenance').length,
      outOfOrder: elevators.filter(e => e.status === 'out_of_order').length
    };
  };

  const filteredElevators = elevators.filter(elevator => {
    const matchesSearch = elevator.buildingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         elevator.uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         elevator.address.includes(searchTerm);
    const matchesStatus = selectedStatus === 'all' || elevator.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handlePartChange = (elevator: Elevator) => {
    setSelectedElevatorForPartChange(elevator);
    setIsPartChangeModalOpen(true);
  };

  const stats = getElevatorStats();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPartChangeModalOpen, setIsPartChangeModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [selectedElevatorForMaintenance, setSelectedElevatorForMaintenance] = useState<Elevator | null>(null);
  const [selectedElevatorForPartChange, setSelectedElevatorForPartChange] = useState<Elevator | null>(null);
  const [isNewElevatorModalOpen, setIsNewElevatorModalOpen] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast.success('✅ اطلاعات بروزرسانی شد');
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">مدیریت آسانسورها</h1>
          <p className="text-gray-600 mt-1">
            مدیریت آسانسورهای تحت مالکیت و مشاهده شناسنامه
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            بروزرسانی
          </Button>
          <Button 
            onClick={() => setIsNewElevatorModalOpen(true)}
            className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white"
          >
            <Plus className="w-4 h-4" />
            ثبت آسانسور جدید
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">کل آسانسورها</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">فعال</p>
                <p className="text-xl font-bold text-green-600">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">در تعمیرات</p>
                <p className="text-xl font-bold text-yellow-600">{stats.maintenance}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">خارج از سرویس</p>
                <p className="text-xl font-bold text-red-600">{stats.outOfOrder}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>جستجو</Label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="جستجو بر اساس نام ساختمان، شناسه یا آدرس..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>وضعیت</Label>
              <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="همه وضعیت‌ها" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                  <SelectItem value="active">فعال</SelectItem>
                  <SelectItem value="maintenance">تعمیرات</SelectItem>
                  <SelectItem value="out_of_order">خارج از سرویس</SelectItem>
                  <SelectItem value="installing">در حال نصب</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('all');
                }}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 ml-2" />
                پاک کردن فیلترها
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Elevators Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderTree className="w-5 h-5" />
            فهرست آسانسورها
          </CardTitle>
          <CardDescription>
            مدیریت و مشاهده جزئیات آسانسورهای تحت مالکیت
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>شناسه آسانسور</TableHead>
                <TableHead>نام ساختمان</TableHead>
                <TableHead>نوع ساختمان</TableHead>
                <TableHead>موقعیت</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>آخرین بازرسی</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredElevators.map((elevator) => (
                <TableRow key={elevator.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{elevator.uid}</p>
                      <p className="text-sm text-gray-500">طبقات: {elevator.floors}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{elevator.buildingName}</p>
                      <p className="text-sm text-gray-500">{elevator.capacity}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{elevator.buildingType}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-sm">{elevator.city}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[elevator.status]}>
                      {statusLabels[elevator.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>{elevator.lastInspection}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedCertificate(elevator);
                            setIsCertificateModalOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4 ml-2" />
                          شناسنامه آسانسور
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handlePartChange(elevator)}
                        >
                          <Settings className="w-4 h-4 ml-2" />
                          تغییر قطعات
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedElevatorForMaintenance(elevator);
                            setIsMaintenanceModalOpen(true);
                          }}
                        >
                          <RefreshCw className="w-4 h-4 ml-2" />
                          ثبت تعمیرات
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredElevators.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Building className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>هیچ آسانسوری یافت نشد</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certificate Modal */}
      {isCertificateModalOpen && selectedCertificate && (
        <Dialog open={isCertificateModalOpen} onOpenChange={() => {
          setIsCertificateModalOpen(false);
          setSelectedCertificate(null);
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden" dir="rtl">
            <DialogHeader className="text-right shrink-0">
              <DialogTitle className="text-right">شناسنامه آسانسور</DialogTitle>
              <DialogDescription className="text-right">
                اطلاعات جامع آسانسور {selectedCertificate.buildingName}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto modal-scroll-container">
              <ElevatorCertificate elevator={selectedCertificate} />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Part Change Modal */}
      {isPartChangeModalOpen && selectedElevatorForPartChange && (
        <Dialog open={isPartChangeModalOpen} onOpenChange={() => {
          setIsPartChangeModalOpen(false);
          setSelectedElevatorForPartChange(null);
        }}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden" dir="rtl">
            <DialogHeader className="text-right shrink-0">
              <DialogTitle className="text-right">تعویض قطعات آسانسور</DialogTitle>
              <DialogDescription className="text-right">
                ثبت تعویض قطعات آسانسور {selectedElevatorForPartChange.buildingName}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto modal-scroll-container">
              <PartChangeForm 
                elevator={selectedElevatorForPartChange}
                onClose={() => {
                  setIsPartChangeModalOpen(false);
                  setSelectedElevatorForPartChange(null);
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Maintenance Modal */}
      {isMaintenanceModalOpen && selectedElevatorForMaintenance && (
        <Dialog open={isMaintenanceModalOpen} onOpenChange={() => {
          setIsMaintenanceModalOpen(false);
          setSelectedElevatorForMaintenance(null);
        }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden" dir="rtl">
            <DialogHeader className="text-right shrink-0">
              <DialogTitle className="text-right">ثبت تعمیرات آسانسور</DialogTitle>
              <DialogDescription className="text-right">
                ثبت اطلاعات تعمیرات و نگهداری آسانسور {selectedElevatorForMaintenance.buildingName}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto modal-scroll-container">
              <MaintenanceForm 
                elevator={selectedElevatorForMaintenance}
                onClose={() => {
                  setIsMaintenanceModalOpen(false);
                  setSelectedElevatorForMaintenance(null);
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* New Elevator Registration Modal */}
      {isNewElevatorModalOpen && (
        <Dialog open={isNewElevatorModalOpen} onOpenChange={() => setIsNewElevatorModalOpen(false)}>
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden" dir="rtl">
            <DialogHeader className="text-right shrink-0">
              <DialogTitle className="text-right">ثبت آسانسور جدید</DialogTitle>
              <DialogDescription className="text-right">
                ثبت اطلاعات آسانسور جدید در سامانه ملی ردیابی آسانسور
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto modal-scroll-container">
              <ElevatorRegistrationForm 
                mode="user"
                onClose={() => setIsNewElevatorModalOpen(false)}
                onSubmit={async (elevatorData) => {
                  try {
                    // Transform form data to API format
                    const apiData = {
                      municipalityZone: elevatorData.municipalRegion,
                      buildPermitNo: elevatorData.buildingPermit || 'N/A',
                      registryPlate: elevatorData.registrationPlate || 'N/A',
                      province: elevatorData.provinceName || '',
                      city: elevatorData.cityName || '',
                      address: elevatorData.address,
                      postalCode: elevatorData.postalCode || '0000000000',
                      installerCompanyId: 1, // Default installer company for user mode
                      parts: elevatorData.parts.map(part => ({ partId: part.partId }))
                    };

                    console.log('Sending elevator data to API:', apiData);
                    
                    // Call the API
                    const response = await elevatorsService.createElevator(apiData);
                    
                    if (response.success && response.data) {
                      toast.success(`✅ آسانسور جدید با شناسه ${response.data.uid} ثبت شد`);
                      setIsNewElevatorModalOpen(false);
                      // Refresh the elevators list
                      // loadElevators(); // Uncomment if you have a load function
                    } else {
                      toast.error('خطا در ثبت آسانسور');
                    }
                  } catch (error) {
                    console.error('Error creating elevator:', error);
                    toast.error('خطا در ثبت آسانسور. لطفاً دوباره تلاش کنید.');
                  }
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Elevator Certificate Component
function ElevatorCertificate({ elevator }: { elevator: Elevator }) {
  // Define status colors and labels within the component
  const statusColors = {
    active: 'bg-green-100 text-green-800 border-green-300',
    maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    out_of_order: 'bg-red-100 text-red-800 border-red-300',
    installing: 'bg-blue-100 text-blue-800 border-blue-300'
  };

  const statusLabels = {
    active: '🟢 فعال',
    maintenance: '🟡 تعمیرات',
    out_of_order: '🔴 خراب',
    installing: '🔵 در حال نصب'
  };
  const qrData = {
    type: 'elevator_certificate',
    elevatorId: elevator.uid,
    buildingName: elevator.buildingName,
    verificationUrl: `https://elevatorid.ieeu.ir/verify/${elevator.uid}`,
    issuedAt: new Date().toISOString()
  };

  const handleDownloadPDF = () => {
    toast.success('📄 شناسنامه آسانسور در حال دانلود است', {
      description: `فایل PDF شناسنامه آسانسور ${elevator.buildingName} آماده می‌باشد`,
      duration: 4000,
    });
  };

  const handleCopyQRLink = () => {
    navigator.clipboard.writeText(qrData.verificationUrl);
    toast.success('🔗 لینک کپی شد', {
      description: 'لینک تایید شناسنامه در کلیپ‌بورد کپی شد',
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6 p-6" dir="rtl">
      {/* Header Section */}
      <div className="text-center border-b pb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">شناسنامه آسانسور</h1>
        <p className="text-gray-600">سامانه ملی ردیابی آسانسور</p>
        <div className="mt-4">
          <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-lg px-4 py-2">
            شناسه: {elevator.uid}
          </Badge>
        </div>
      </div>

      {/* Building Information Section */}
      <div className="border rounded-lg p-6 bg-gradient-to-r from-blue-50 to-blue-100 section">
        <div className="flex items-center gap-2 mb-4 section-title">
          <Building className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-blue-800">اطلاعات ساختمان</h3>
        </div>
        
        <div className="section-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between border-b border-blue-200 pb-1">
                <span className="text-muted-foreground">نام ساختمان:</span>
                <span className="font-medium">{elevator.buildingName}</span>
              </div>
              <div className="flex justify-between border-b border-blue-200 pb-1">
                <span className="text-muted-foreground">نوع ساختمان:</span>
                <span className="font-medium">{elevator.buildingType}</span>
              </div>
              <div className="flex justify-between border-b border-blue-200 pb-1">
                <span className="text-muted-foreground">استان:</span>
                <span className="font-medium">{elevator.province}</span>
              </div>
              <div className="flex justify-between border-b border-blue-200 pb-1">
                <span className="text-muted-foreground">شهر:</span>
                <span className="font-medium">{elevator.city}</span>
              </div>
              <div className="flex justify-between border-b border-blue-200 pb-1">
                <span className="text-muted-foreground">منطقه شهرداری:</span>
                <span className="font-medium">{elevator.municipalRegion}</span>
              </div>
              <div className="flex justify-between border-b border-blue-200 pb-1">
                <span className="text-muted-foreground">کد پستی:</span>
                <span className="font-medium font-mono">{elevator.postalCode}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between border-b border-blue-200 pb-1">
                <span className="text-muted-foreground">پروانه ساختمان:</span>
                <span className="font-medium">{elevator.buildingPermit}</span>
              </div>
              <div className="flex justify-between border-b border-blue-200 pb-1">
                <span className="text-muted-foreground">پلاک ثبتی:</span>
                <span className="font-medium">{elevator.registrationPlate}</span>
              </div>
              <div className="flex justify-between border-b border-blue-200 pb-1">
                <span className="text-muted-foreground">تاریخ نصب:</span>
                <span className="font-medium">{elevator.installationDate}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-200 rounded-lg">
            <p className="font-medium text-blue-700 mb-1">آدرس کامل:</p>
            <p className="text-blue-800">{elevator.address}</p>
          </div>
        </div>
      </div>

      {/* Elevator Specifications Section */}
      <div className="border rounded-lg p-6 bg-gradient-to-r from-green-50 to-green-100 section">
        <div className="flex items-center gap-2 mb-4 section-title">
          <Settings className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-bold text-green-800">مشخصات فنی آسانسور</h3>
        </div>
        
        <div className="section-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-200 rounded-lg">
              <div className="text-2xl font-bold text-green-800">{elevator.floors}</div>
              <div className="text-sm text-green-700">تعداد طبقات</div>
            </div>
            <div className="text-center p-4 bg-green-200 rounded-lg">
              <div className="text-2xl font-bold text-green-800">{elevator.capacity}</div>
              <div className="text-sm text-green-700">ظرفیت بار</div>
            </div>
            <div className="text-center p-4 bg-green-200 rounded-lg">
              <div className="text-lg font-bold text-green-800">{elevator.motorType}</div>
              <div className="text-sm text-green-700">نوع موتور</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between border-b border-green-200 pb-1">
              <span className="text-muted-foreground">وضعیت فعلی:</span>
              <Badge className={`${statusColors[elevator.status]}`}>
                {statusLabels[elevator.status]}
              </Badge>
            </div>
            <div className="flex justify-between border-b border-green-200 pb-1">
              <span className="text-muted-foreground">آخرین بازرسی:</span>
              <span className="font-medium">{elevator.lastInspection}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Parts Information Section */}
      <div className="border rounded-lg p-6 bg-gradient-to-r from-orange-50 to-orange-100 section">
        <div className="flex items-center gap-2 mb-4 section-title">
          <Package className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-bold text-orange-800">قطعات آسانسور</h3>
        </div>
        
        <div className="section-content">
          <div className="grid gap-4">
            {elevator.parts.map((part) => (
              <div key={part.id} className="bg-orange-200 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-orange-600">نام قطعه:</span>
                    <p className="font-medium text-orange-800">{part.name}</p>
                  </div>
                  <div>
                    <span className="text-orange-600">برند و مدل:</span>
                    <p className="font-medium text-orange-800">{part.brand} - {part.model}</p>
                  </div>
                  <div>
                    <span className="text-orange-600">شماره سریال:</span>
                    <p className="font-medium text-orange-800 font-mono">{part.serialNumber}</p>
                  </div>
                  <div>
                    <span className="text-orange-600">وضعیت:</span>
                    <Badge className={
                      part.status === 'working' ? 'bg-green-100 text-green-800 border-green-300' :
                      part.status === 'needs_maintenance' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                      'bg-red-100 text-red-800 border-red-300'
                    }>
                      {part.status === 'working' ? '✅ سالم' :
                       part.status === 'needs_maintenance' ? '⚠️ نیاز به تعمیر' : '❌ خراب'}
                    </Badge>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-orange-600">تاریخ نصب:</span>
                    <span className="font-medium text-orange-800 mr-2">{part.installationDate}</span>
                  </div>
                  <div>
                    <span className="text-orange-600">انقضای گارانتی:</span>
                    <span className="font-medium text-orange-800 mr-2">{part.warrantyExpiry}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="border rounded-lg p-6 bg-gradient-to-r from-purple-50 to-purple-100 section">
        <div className="flex items-center gap-2 mb-4 section-title">
          <Download className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-bold text-purple-800">کد تایید و دانلود</h3>
        </div>
        
        <div className="section-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="text-center">
              <QRCodeGenerator 
                data={JSON.stringify(qrData)}
                size={200}
                className="mx-auto"
              />
              <p className="text-sm text-purple-700 mt-2">
                کد QR برای تایید اصالت شناسنامه
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-purple-200 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">لینک تایید:</h4>
                <p className="text-sm font-mono bg-white p-2 rounded border text-purple-900 break-all">
                  {qrData.verificationUrl}
                </p>
              </div>
              
              <div className="space-y-2">
                <Button
                  onClick={handleCopyQRLink}
                  variant="outline"
                  className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  کپی لینک تایید
                </Button>
                <Button
                  onClick={handleDownloadPDF}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  دانلود شناسنامه PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="border rounded-lg p-6 bg-gradient-to-r from-gray-50 to-gray-100 section">
        <div className="flex items-center gap-2 mb-4 section-title">
          <Building className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-800">اطلاعات تماس</h3>
        </div>
        
        <div className="section-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">مالک ساختمان</h4>
              <div className="space-y-1 text-sm">
                <p className="text-gray-700">نام: {elevator.owner.name}</p>
                <p className="text-gray-700">تلفن: {elevator.owner.phone}</p>
                <p className="text-gray-700">ایمیل: {elevator.owner.email}</p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">مدیر ساختمان</h4>
              <div className="space-y-1 text-sm">
                <p className="text-gray-700">نام: {elevator.manager.name}</p>
                <p className="text-gray-700">تلفن: {elevator.manager.phone}</p>
                <p className="text-gray-700">شرکت: {elevator.manager.company}</p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">نصاب آسانسور</h4>
              <div className="space-y-1 text-sm">
                <p className="text-gray-700">نام: {elevator.installer.name}</p>
                <p className="text-gray-700">تلفن: {elevator.installer.phone}</p>
                <p className="text-gray-700">شرکت: {elevator.installer.company}</p>
                <p className="text-gray-700">مجوز: {elevator.installer.license}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 border-t pt-4">
        <p>این شناسنامه توسط سامانه ملی ردیابی آسانسور صادر شده است</p>
        <p>تاریخ صدور: {new Date().toLocaleDateString('fa-IR')}</p>
      </div>
    </div>
  );
}

// Part Change Form Component
function PartChangeForm({ 
  elevator, 
  onClose 
}: { 
  elevator: Elevator; 
  onClose: () => void;
}) {
  // Define status colors and labels within the component
  const statusColors = {
    active: 'bg-green-100 text-green-800 border-green-300',
    maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    out_of_order: 'bg-red-100 text-red-800 border-red-300',
    installing: 'bg-blue-100 text-blue-800 border-blue-300'
  };

  const statusLabels = {
    active: '🟢 فعال',
    maintenance: '🟡 تعمیرات',
    out_of_order: '🔴 خراب',
    installing: '🔵 در حال نصب'
  };
  const [formData, setFormData] = useState({
    oldPartName: '',
    newPartName: '',
    oldPartBrand: '',
    newPartBrand: '',
    oldPartModel: '',
    newPartModel: '',
    oldPartSerial: '',
    newPartSerial: '',
    changeDate: '',
    reason: '',
    technicianName: '',
    technicianPhone: '',
    warranteDuration: '',
    cost: '',
    notes: '',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'critical'
  });

  const [selectedPartCategory, setSelectedPartCategory] = useState('');

  const partCategories = [
    { value: 'motor', label: '🔧 موتور و محرک', parts: ['موتور اصلی', 'گیربکس', 'ترمز اضطراری', 'کوپلینگ'] },
    { value: 'control', label: '⚡ سیستم کنترل', parts: ['کنترلر فرکانس', 'برد کنترل', 'رله‌های اصلی', 'ترانسفورماتور'] },
    { value: 'safety', label: '🛡️ سیستم ایمنی', parts: ['سنسور طبقه', 'میکروسوئیچ درب', 'سنسور بار اضافی', 'سیستم اعلام خطر'] },
    { value: 'cabin', label: '🏠 کابین آسانسور', parts: ['دکمه‌های کابین', 'چراغ LED', 'فن کابین', 'آینه کابین', 'نرده دست'] },
    { value: 'doors', label: '🚪 سیستم درب', parts: ['موتور درب', 'سنسور درب', 'ریل درب', 'قفل الکترونیکی'] },
    { value: 'cables', label: '🔗 کابل‌ها', parts: ['کابل فولادی اصلی', 'کابل کنترل', 'کابل برق', 'کابل مسافری'] },
    { value: 'mechanical', label: '⚙️ قطعات مکانیکی', parts: ['شیو موتور', 'گاید ریل', 'کنترل وزن', 'سیستم تعادل'] }
  ];

  const reasonOptions = [
    '🔴 خرابی و عدم عملکرد',
    '⚠️ استهلاک طبیعی',
    '🔧 تعمیرات پیشگیرانه', 
    '📈 ارتقاء و بهبود عملکرد',
    '🛡️ افزایش ایمنی',
    '⚡ بهینه‌سازی مصرف انرژی',
    '🔊 کاهش صدا و لرزش',
    '📋 مطابقت با استاندارد',
    '💡 سایر دلایل'
  ];

  const getCurrentPartInfo = () => {
    const category = partCategories.find(cat => cat.value === selectedPartCategory);
    if (!category) return null;
    
    // Mock current part info - در نسخه واقعی از API دریافت می‌شود
    return {
      name: 'موتور اصلی',
      brand: 'شیندلر',
      model: 'VF30-S',
      serial: 'SH2023001',
      installDate: '1402/03/15'
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPartCategory || !formData.newPartName || !formData.changeDate || !formData.reason) {
      toast.error('خطا در اعتبارسنجی', {
        description: 'لطفاً فیلدهای الزامی را تکمیل کنید',
        duration: 3000,
      });
      return;
    }

    // Generate change ID
    const changeId = `CHG-${Date.now().toString().slice(-6)}`;
    
    const partChangeRecord = {
      id: changeId,
      elevatorId: elevator.id,
      elevatorUid: elevator.uid,
      buildingName: elevator.buildingName,
      category: selectedPartCategory,
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    toast.success(`تعویض قطعه با شناسه ${changeId} ثبت شد`, {
      description: `قطعه ${formData.newPartName} در آسانسور ${elevator.buildingName} با موفقیت ثبت گردید`,
      duration: 4000,
    });

    onClose();
  };

  const currentPart = getCurrentPartInfo();

  return (
    <div className="space-y-6" dir="rtl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Elevator Information */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-800 flex items-center gap-2 mb-3">
            🏢 اطلاعات آسانسور
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-blue-600">شناسه:</span>
              <span className="font-medium mr-2">{elevator.uid}</span>
            </div>
            <div>
              <span className="text-blue-600">ساختمان:</span>
              <span className="font-medium mr-2">{elevator.buildingName}</span>
            </div>
            <div>
              <span className="text-blue-600">وضعیت فعلی:</span>
              <Badge className={`${statusColors[elevator.status]} mr-2`}>
                {statusLabels[elevator.status]}
              </Badge>
            </div>
          </div>
        </div>

        {/* Part Category Selection */}
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <h3 className="font-medium text-orange-800 flex items-center gap-2 mb-4">
            🔧 انتخاب دسته‌بندی قطعه
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="partCategory" className="text-orange-700">
                دسته‌بندی قطعه *
              </Label>
              <Select 
                value={selectedPartCategory} 
                onValueChange={setSelectedPartCategory}
              >
                <SelectTrigger className="bg-white border-orange-300">
                  <SelectValue placeholder="انتخاب دسته‌بندی قطعه" />
                </SelectTrigger>
                <SelectContent>
                  {partCategories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPartCategory && (
              <div className="space-y-2">
                <Label className="text-orange-700">قطعات موجود در این دسته:</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {partCategories.find(cat => cat.value === selectedPartCategory)?.parts.map(part => (
                    <div 
                      key={part}
                      className={`p-2 rounded border cursor-pointer transition-colors ${
                        formData.oldPartName === part 
                          ? 'bg-orange-200 border-orange-400 text-orange-800' 
                          : 'bg-white border-orange-300 hover:bg-orange-50'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, oldPartName: part }))}
                    >
                      <span className="text-sm">{part}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Current Part Information */}
        {currentPart && formData.oldPartName && (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="font-medium text-red-800 flex items-center gap-2 mb-4">
              🔴 اطلاعات قطعه فعلی
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between border-b border-red-200 pb-1">
                  <span className="text-red-600">نام قطعه:</span>
                  <span className="font-medium">{currentPart.name}</span>
                </div>
                <div className="flex justify-between border-b border-red-200 pb-1">
                  <span className="text-red-600">برند:</span>
                  <span className="font-medium">{currentPart.brand}</span>
                </div>
                <div className="flex justify-between border-b border-red-200 pb-1">
                  <span className="text-red-600">مدل:</span>
                  <span className="font-medium">{currentPart.model}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-red-200 pb-1">
                  <span className="text-red-600">سریال:</span>
                  <span className="font-medium font-mono">{currentPart.serial}</span>
                </div>
                <div className="flex justify-between border-b border-red-200 pb-1">
                  <span className="text-red-600">تاریخ نصب:</span>
                  <span className="font-medium">{currentPart.installDate}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-3 p-2 bg-red-100 rounded border border-red-300">
              <p className="text-red-700 text-sm">
                💡 این قطعه پس از تایید تعویض، از شناسنامه آسانسور حذف و قطعه جدید جایگزین آن خواهد شد
              </p>
            </div>
          </div>
        )}

        {/* New Part Information */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-medium text-green-800 flex items-center gap-2 mb-4">
            🟢 اطلاعات قطعه جدید
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPartName" className="text-green-700">
                  نام قطعه جدید *
                </Label>
                <Input
                  id="newPartName"
                  placeholder="نام دقیق قطعه جدید"
                  value={formData.newPartName}
                  onChange={(e) => setFormData(prev => ({ ...prev, newPartName: e.target.value }))}
                  className="bg-white border-green-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPartBrand" className="text-green-700">
                  برند قطعه جدید
                </Label>
                <Input
                  id="newPartBrand"
                  placeholder="برند سازنده"
                  value={formData.newPartBrand}
                  onChange={(e) => setFormData(prev => ({ ...prev, newPartBrand: e.target.value }))}
                  className="bg-white border-green-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPartModel" className="text-green-700">
                  مدل قطعه جدید
                </Label>
                <Input
                  id="newPartModel"
                  placeholder="شماره مدل"
                  value={formData.newPartModel}
                  onChange={(e) => setFormData(prev => ({ ...prev, newPartModel: e.target.value }))}
                  className="bg-white border-green-300"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPartSerial" className="text-green-700">
                  شماره سریال جدید
                </Label>
                <Input
                  id="newPartSerial"
                  placeholder="شماره سریال یکتا"
                  value={formData.newPartSerial}
                  onChange={(e) => setFormData(prev => ({ ...prev, newPartSerial: e.target.value }))}
                  className="bg-white border-green-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warranteDuration" className="text-green-700">
                  مدت گارانتی (ماه)
                </Label>
                <Input
                  id="warranteDuration"
                  type="number"
                  placeholder="24"
                  value={formData.warranteDuration}
                  onChange={(e) => setFormData(prev => ({ ...prev, warranteDuration: e.target.value }))}
                  className="bg-white border-green-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost" className="text-green-700">
                  هزینه (تومان)
                </Label>
                <Input
                  id="cost"
                  type="number"
                  placeholder="1500000"
                  value={formData.cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                  className="bg-white border-green-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Change Details */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-medium text-yellow-800 flex items-center gap-2 mb-4">
            📝 جزئیات تعویض
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="changeDate" className="text-yellow-700">
                  تاریخ تعویض *
                </Label>
                <PersianDatePicker
                  value={formData.changeDate}
                  onChange={(date) => setFormData(prev => ({ ...prev, changeDate: date }))}
                  placeholder="انتخاب تاریخ"
                  className="bg-white border-yellow-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason" className="text-yellow-700">
                  دلیل تعویض *
                </Label>
                <Select 
                  value={formData.reason} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, reason: value }))}
                >
                  <SelectTrigger className="bg-white border-yellow-300">
                    <SelectValue placeholder="انتخاب دلیل تعویض" />
                  </SelectTrigger>
                  <SelectContent>
                    {reasonOptions.map(reason => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-yellow-700">
                  اولویت تعویض
                </Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as any }))}
                >
                  <SelectTrigger className="bg-white border-yellow-300">
                    <SelectValue placeholder="انتخاب اولویت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">🟢 کم</SelectItem>
                    <SelectItem value="normal">🟡 متوسط</SelectItem>
                    <SelectItem value="high">🟠 بالا</SelectItem>
                    <SelectItem value="critical">🔴 بحرانی</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="technicianName" className="text-yellow-700">
                  نام تکنسین
                </Label>
                <Input
                  id="technicianName"
                  placeholder="نام و نام خانوادگی"
                  value={formData.technicianName}
                  onChange={(e) => setFormData(prev => ({ ...prev, technicianName: e.target.value }))}
                  className="bg-white border-yellow-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="technicianPhone" className="text-yellow-700">
                  شماره تماس تکنسین
                </Label>
                <Input
                  id="technicianPhone"
                  placeholder="09123456789"
                  value={formData.technicianPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, technicianPhone: e.target.value }))}
                  className="bg-white border-yellow-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-yellow-700">
                  یادداشت‌های اضافی
                </Label>
                <Textarea
                  id="notes"
                  placeholder="توضیحات تکمیلی در مورد تعویض..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="bg-white border-yellow-300"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            انصراف
          </Button>
          <Button
            type="submit"
            className="bg-black hover:bg-gray-800 text-white"
          >
            ثبت تعویض قطعه
          </Button>
        </div>
      </form>
    </div>
  );
}

function MaintenanceForm({ 
  elevator, 
  onClose 
}: { 
  elevator: Elevator; 
  onClose: () => void;
}) {
  // Define status colors and labels within the component
  const statusColors = {
    active: 'bg-green-100 text-green-800 border-green-300',
    maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    out_of_order: 'bg-red-100 text-red-800 border-red-300',
    installing: 'bg-blue-100 text-blue-800 border-blue-300'
  };

  const statusLabels = {
    active: '🟢 فعال',
    maintenance: '🟡 تعمیرات',
    out_of_order: '🔴 خراب',
    installing: '🔵 در حال نصب'
  };
  const [formData, setFormData] = useState({
    maintenanceType: '',
    description: '',
    technicianName: '',
    technicianPhone: '',
    problemDescription: '',
    solutionDescription: '',
    partsUsed: [] as string[],
    priority: 'normal' as 'low' | 'normal' | 'high' | 'critical',
    estimatedDuration: '',
    actualDuration: '',
    cost: '',
    maintenanceDate: '',
    completionDate: '',
    status: 'in_progress' as 'scheduled' | 'in_progress' | 'completed' | 'cancelled',
    nextMaintenanceDate: '',
    notes: ''
  });

  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [customPartName, setCustomPartName] = useState('');

  const maintenanceTypes = [
    { value: 'preventive', label: '🔧 تعمیرات پیشگیرانه' },
    { value: 'corrective', label: '⚠️ تعمیرات اصلاحی' },
    { value: 'emergency', label: '🚨 تعمیرات اضطراری' },
    { value: 'inspection', label: '🔍 بازرسی دوره‌ای' },
    { value: 'upgrade', label: '⬆️ ارتقاء سیستم' },
    { value: 'cleaning', label: '🧽 نظافت و نگهداری' }
  ];

  const priorityOptions = [
    { value: 'low', label: '🟢 کم', color: 'bg-green-100 text-green-800 border-green-300' },
    { value: 'normal', label: '🟡 متوسط', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    { value: 'high', label: '🟠 بالا', color: 'bg-orange-100 text-orange-800 border-orange-300' },
    { value: 'critical', label: '🔴 بحرانی', color: 'bg-red-100 text-red-800 border-red-300' }
  ];

  const statusOptions = [
    { value: 'scheduled', label: '📅 زمان‌بندی شده', color: 'bg-blue-100 text-blue-800' },
    { value: 'in_progress', label: '⚙️ در حال انجام', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'completed', label: '✅ تکمیل شده', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: '❌ لغو شده', color: 'bg-red-100 text-red-800' }
  ];

  const availableParts = [
    'موتور آسانسور', 'کنترلر فرکانس', 'کابل فولادی', 'سنسور طبقه', 
    'دکمه‌های کابین', 'چراغ LED', 'فن کابین', 'سیستم ایمنی',
    'گیربکس', 'ترمز اضطراری', 'رله کنترل', 'ترانسفورماتور'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.maintenanceType || !formData.description || !formData.technicianName) {
      toast.error('خطا در اعتبارسنجی', {
        description: 'لطفاً فیلدهای الزامی را تکمیل کنید',
        duration: 3000,
      });
      return;
    }

    // Generate maintenance ID
    const maintenanceId = `MNT-${Date.now().toString().slice(-6)}`;
    
    const maintenanceRecord = {
      id: maintenanceId,
      elevatorId: elevator.id,
      elevatorUid: elevator.uid,
      buildingName: elevator.buildingName,
      ...formData,
      partsUsed: [...selectedParts, ...(customPartName ? [customPartName] : [])],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    toast.success(`تعمیرات با شناسه ${maintenanceId} ثبت شد`, {
      description: `تعمیرات آسانسور ${elevator.buildingName} با موفقیت در سیستم ثبت گردید`,
      duration: 4000,
    });

    onClose();
  };

  const addCustomPart = () => {
    if (customPartName.trim() && !selectedParts.includes(customPartName)) {
      setSelectedParts(prev => [...prev, customPartName]);
      setCustomPartName('');
    }
  };

  const removePart = (partName: string) => {
    setSelectedParts(prev => prev.filter(p => p !== partName));
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Elevator Information */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-800 flex items-center gap-2 mb-3">
            🏢 اطلاعات آسانسور
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-blue-600">شناسه:</span>
              <span className="font-medium mr-2">{elevator.uid}</span>
            </div>
            <div>
              <span className="text-blue-600">ساختمان:</span>
              <span className="font-medium mr-2">{elevator.buildingName}</span>
            </div>
            <div>
              <span className="text-blue-600">وضعیت فعلی:</span>
              <Badge className={`${statusColors[elevator.status]} mr-2`}>
                {statusLabels[elevator.status]}
              </Badge>
            </div>
          </div>
        </div>

        {/* Maintenance Details */}
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <h3 className="font-medium text-orange-800 flex items-center gap-2 mb-4">
            🔧 جزئیات تعمیرات
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maintenanceType" className="text-orange-700">
                نوع تعمیرات *
              </Label>
              <Select 
                value={formData.maintenanceType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, maintenanceType: value }))}
              >
                <SelectTrigger className="bg-white border-orange-300">
                  <SelectValue placeholder="انتخاب نوع تعمیرات" />
                </SelectTrigger>
                <SelectContent>
                  {maintenanceTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-orange-700">
                اولویت
              </Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as any }))}
              >
                <SelectTrigger className="bg-white border-orange-300">
                  <SelectValue placeholder="انتخاب اولویت" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map(priority => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description" className="text-orange-700">
                شرح تعمیرات *
              </Label>
              <Textarea
                id="description"
                placeholder="شرح کاملی از تعمیرات انجام شده ارائه دهید..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-white border-orange-300"
                rows={3}
                required
              />
            </div>
          </div>
        </div>

        {/* Technician Information */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-medium text-green-800 flex items-center gap-2 mb-4">
            👷 اطلاعات تکنسین
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="technicianName" className="text-green-700">
                نام تکنسین *
              </Label>
              <Input
                id="technicianName"
                placeholder="نام و نام خانوادگی تکنسین"
                value={formData.technicianName}
                onChange={(e) => setFormData(prev => ({ ...prev, technicianName: e.target.value }))}
                className="bg-white border-green-300"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="technicianPhone" className="text-green-700">
                شماره تماس تکنسین
              </Label>
              <Input
                id="technicianPhone"
                placeholder="09123456789"
                value={formData.technicianPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, technicianPhone: e.target.value }))}
                className="bg-white border-green-300"
              />
            </div>
          </div>
        </div>

        {/* Problem & Solution */}
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="font-medium text-red-800 flex items-center gap-2 mb-4">
            🔍 مشکل و راه‌حل
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="problemDescription" className="text-red-700">
                شرح مشکل
              </Label>
              <Textarea
                id="problemDescription"
                placeholder="مشکلات مشاهده شده در آسانسور را شرح دهید..."
                value={formData.problemDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, problemDescription: e.target.value }))}
                className="bg-white border-red-300"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="solutionDescription" className="text-red-700">
                شرح راه‌حل
              </Label>
              <Textarea
                id="solutionDescription"
                placeholder="اقدامات انجام شده برای حل مشکل را شرح دهید..."
                value={formData.solutionDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, solutionDescription: e.target.value }))}
                className="bg-white border-red-300"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Parts Used */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="font-medium text-purple-800 flex items-center gap-2 mb-4">
            🔩 قطعات استفاده شده
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label className="text-purple-700">انتخاب قطعات</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {availableParts.map(part => (
                    <div key={part} className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id={part}
                        checked={selectedParts.includes(part)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedParts(prev => [...prev, part]);
                          } else {
                            removePart(part);
                          }
                        }}
                      />
                      <Label htmlFor={part} className="text-sm text-purple-700 cursor-pointer">
                        {part}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-purple-700">قطعه سفارشی</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="نام قطعه"
                    value={customPartName}
                    onChange={(e) => setCustomPartName(e.target.value)}
                    className="bg-white border-purple-300"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomPart())}
                  />
                  <Button
                    type="button"
                    onClick={addCustomPart}
                    variant="outline"
                    size="sm"
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {selectedParts.length > 0 && (
              <div className="space-y-2">
                <Label className="text-purple-700">قطعات انتخاب شده:</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedParts.map(part => (
                    <Badge
                      key={part}
                      variant="secondary"
                      className="bg-purple-100 text-purple-800 border-purple-300 flex items-center gap-1"
                    >
                      {part}
                      <button
                        type="button"
                        onClick={() => removePart(part)}
                        className="ml-1 hover:text-purple-600"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Timing and Cost */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-medium text-yellow-800 flex items-center gap-2 mb-4">
            ⏱️ زمان‌بندی و هزینه
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maintenanceDate" className="text-yellow-700">
                تاریخ شروع تعمیرات
              </Label>
              <PersianDatePicker
                value={formData.maintenanceDate}
                onChange={(date) => setFormData(prev => ({ ...prev, maintenanceDate: date }))}
                placeholder="انتخاب تاریخ"
                className="bg-white border-yellow-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedDuration" className="text-yellow-700">
                مدت زمان تخمینی (ساعت)
              </Label>
              <Input
                id="estimatedDuration"
                type="number"
                placeholder="2"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                className="bg-white border-yellow-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actualDuration" className="text-yellow-700">
                مدت زمان واقعی (ساعت)
              </Label>
              <Input
                id="actualDuration"
                type="number"
                placeholder="1.5"
                value={formData.actualDuration}
                onChange={(e) => setFormData(prev => ({ ...prev, actualDuration: e.target.value }))}
                className="bg-white border-yellow-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost" className="text-yellow-700">
                هزینه (تومان)
              </Label>
              <Input
                id="cost"
                type="number"
                placeholder="500000"
                value={formData.cost}
                onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                className="bg-white border-yellow-300"
              />
            </div>
          </div>
        </div>

        {/* Status and Notes */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-800 flex items-center gap-2 mb-4">
            📋 وضعیت و یادداشت‌ها
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-gray-700">
                وضعیت تعمیرات
              </Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
              >
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue placeholder="انتخاب وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextMaintenanceDate" className="text-gray-700">
                تاریخ تعمیرات بعدی
              </Label>
              <PersianDatePicker
                value={formData.nextMaintenanceDate}
                onChange={(date) => setFormData(prev => ({ ...prev, nextMaintenanceDate: date }))}
                placeholder="انتخاب تاریخ"
                className="bg-white border-gray-300"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes" className="text-gray-700">
                یادداشت‌های اضافی
              </Label>
              <Textarea
                id="notes"
                placeholder="یادداشت‌ها، توصیه‌ها یا نکات مهم دیگر..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="bg-white border-gray-300"
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            انصراف
          </Button>
          <Button
            type="submit"
            className="bg-black hover:bg-gray-800 text-white"
          >
            ثبت تعمیرات
          </Button>
        </div>
      </form>
    </div>
  );
}