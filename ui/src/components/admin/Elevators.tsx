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
  MapPin,
  FileText,
  QrCode,
  User,
  RefreshCw
} from 'lucide-react';
import AdvancedTable, { TableColumn } from '../common/AdvancedTable';
import QRCodeGenerator from '../common/QRCodeGenerator';
import PDFGenerator from '../common/PDFGenerator';
import { toast } from 'sonner@2.0.3';
import { PersianDatePicker } from '../common/PersianDatePicker';
import ProvinceAndCitySelector from '../common/ProvinceAndCitySelector';
import ElevatorRegistrationForm from '../common/ElevatorRegistrationForm';
import { elevatorsService } from '../../services/elevators.service';

interface ElevatorPart {
  id: string;
  name: string;
  serialNumber: string;
  installedDate: string;
  status: 'installed' | 'replaced' | 'maintenance';
}

interface Elevator {
  id: string;
  uid: string;
  buildingName: string;
  address: string;
  provinceId?: number;
  provinceName?: string;
  cityId?: number;
  cityName?: string;
  postalCode: string;
  municipalRegion: string;
  buildingPermit: string;
  registrationPlate: string;
  ownerCompanyId: string;
  ownerCompanyName: string;
  installerCompanyId: string;
  installerCompanyName: string;
  installationDate: string;
  status: 'active' | 'maintenance' | 'out_of_order' | 'installing';
  elevatorType: 'passenger' | 'freight' | 'service';
  capacity: number;
  floors: number;
  parts: ElevatorPart[];
}

// Mock data for elevators
const mockElevators: Elevator[] = [
  {
    id: '1',
    uid: 'ELE-001-2024',
    buildingName: 'برج تجاری پارسیان',
    address: 'تهران، میدان ونک، برج پارسیان',
    provinceId: 8,
    provinceName: 'تهران',
    cityId: 301,
    cityName: 'تهران',
    postalCode: '1991864312',
    municipalRegion: 'منطقه 3',
    buildingPermit: 'BP-2024-001',
    registrationPlate: 'RP-2024-001',
    ownerCompanyId: '1',
    ownerCompanyName: 'شرکت توسعه ساختمان پارس',
    installerCompanyId: '1',
    installerCompanyName: 'شرکت نصب تکنولوژی',
    installationDate: '1403/06/15',
    status: 'active',
    elevatorType: 'passenger',
    capacity: 8,
    floors: 15,
    parts: [
      {
        id: '1',
        name: 'موتور کششی',
        serialNumber: 'MOT-001-2024',
        installedDate: '1403/06/15',
        status: 'installed'
      },
      {
        id: '2',
        name: 'کابین آسانسور',
        serialNumber: 'CAB-001-2024',
        installedDate: '1403/06/15',
        status: 'installed'
      }
    ]
  },
  {
    id: '2',
    uid: 'ELE-002-2024',
    buildingName: 'مجتمع مسکونی نیاوران',
    address: 'تهران، نیاوران، خیابان جماران',
    provinceId: 8,
    provinceName: 'تهران',
    cityId: 301,
    cityName: 'تهران',
    postalCode: '1991864313',
    municipalRegion: 'منطقه 1',
    buildingPermit: 'BP-2024-002',
    registrationPlate: 'RP-2024-002',
    ownerCompanyId: '2',
    ownerCompanyName: 'شرکت سرمایه‌گذاری آریا',
    installerCompanyId: '2',
    installerCompanyName: 'شرکت نصب سریع',
    installationDate: '1403/07/20',
    status: 'maintenance',
    elevatorType: 'passenger',
    capacity: 6,
    floors: 8,
    parts: []
  },
  {
    id: '3',
    uid: 'ELE-003-2024',
    buildingName: 'مرکز تجاری رز',
    address: 'اصفهان، خیابان چهارباغ عباسی',
    provinceId: 4,
    provinceName: 'اصفهان',
    cityId: 155,
    cityName: 'اصفهان',
    postalCode: '8173673159',
    municipalRegion: 'منطقه 6',
    buildingPermit: 'BP-2024-003',
    registrationPlate: 'RP-2024-003',
    ownerCompanyId: '3',
    ownerCompanyName: 'شرکت مدیریت مراکز تجاری رز',
    installerCompanyId: '3',
    installerCompanyName: 'شرکت ماشین‌سازی آریا',
    installationDate: '1403/05/10',
    status: 'active',
    elevatorType: 'freight',
    capacity: 12,
    floors: 6,
    parts: []
  }
];

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
  const [elevators, setElevators] = useState<Elevator[]>(mockElevators);
  const [selectedElevator, setSelectedElevator] = useState<Elevator | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const columns: TableColumn<Elevator>[] = [
    {
      key: 'uid',
      label: 'شناسه آسانسور',
      sortable: true,
      render: (value, elevator) => (
        <div className="font-medium">
          {elevator.uid}
        </div>
      )
    },
    {
      key: 'buildingName',
      label: 'نام ساختمان',
      sortable: true,
      render: (value, elevator) => (
        <div>
          <div className="font-medium">{elevator.buildingName}</div>
          <div className="text-sm text-gray-500">{elevator.municipalRegion}</div>
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
      key: 'ownerCompanyName',
      label: 'شرکت مالک',
      sortable: true,
      render: (value, elevator) => (
        <div className="text-sm">
          {elevator.ownerCompanyName}
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
          {elevatorTypeLabels[elevator.elevatorType]}
        </Badge>
      )
    },
    {
      key: 'capacity',
      label: 'ظرفیت',
      sortable: true,
      render: (value, elevator) => (
        <div className="text-center">
          {elevator.capacity} نفر
        </div>
      )
    },
    {
      key: 'floors',
      label: 'طبقات',
      sortable: true,
      render: (value, elevator) => (
        <div className="text-center">
          {elevator.floors}
        </div>
      )
    },
    {
      key: 'status',
      label: 'وضعیت',
      sortable: true,
      filterable: true,
      render: (value, elevator) => (
        <Badge className={statusColors[elevator.status]}>
          {statusLabels[elevator.status]}
        </Badge>
      )
    },
    {
      key: 'installationDate',
      label: 'تاریخ نصب',
      sortable: true,
      render: (value, elevator) => (
        <div className="text-sm">
          {elevator.installationDate}
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
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem 
              onClick={() => setSelectedElevator(elevator)}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              مشاهده جزئیات
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              ویرایش اطلاعات
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              مدیریت قطعات
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  const filteredElevators = elevators.filter(elevator => {
    const matchesSearch = elevator.uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         elevator.buildingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         elevator.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || elevator.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: elevators.length,
    active: elevators.filter(e => e.status === 'active').length,
    maintenance: elevators.filter(e => e.status === 'maintenance').length,
    outOfOrder: elevators.filter(e => e.status === 'out_of_order').length,
    installing: elevators.filter(e => e.status === 'installing').length
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
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
                    // Transform form data to API format
                    const apiData = {
                      municipalityZone: elevatorData.municipalRegion,
                      buildPermitNo: elevatorData.buildingPermit || 'N/A',
                      registryPlate: elevatorData.registrationPlate || 'N/A',
                      province: elevatorData.provinceName || '',
                      city: elevatorData.cityName || '',
                      address: elevatorData.address,
                      postalCode: elevatorData.postalCode || '0000000000',
                      installerCompanyId: parseInt(elevatorData.installerCompanyId || '1'),
                      parts: elevatorData.parts.map(part => ({ partId: part.partId }))
                    };

                    console.log('Sending elevator data to API:', apiData);
                    
                    // Call the API
                    const response = await elevatorsService.createElevator(apiData);
                    
                    if (response.success && response.data) {
                      toast.success(`✅ آسانسور جدید با شناسه ${response.data.uid} ثبت شد`);
                      setIsCreateModalOpen(false);
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
                <p className="text-2xl font-bold">{stats.total}</p>
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
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
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
                <p className="text-2xl font-bold text-yellow-600">{stats.maintenance}</p>
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
                <p className="text-2xl font-bold text-red-600">{stats.outOfOrder}</p>
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
                <p className="text-2xl font-bold text-blue-600">{stats.installing}</p>
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
                placeholder="جستجو بر اساس شناسه، نام ساختمان یا آدرس..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
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
          <AdvancedTable
            data={filteredElevators}
            columns={columns}
            searchable={false}
            exportable={true}
          />
        </CardContent>
      </Card>

      {/* Elevator Details Modal */}
      {selectedElevator && (
        <Dialog open={!!selectedElevator} onOpenChange={() => setSelectedElevator(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden" dir="rtl">
            <DialogHeader className="text-right">
              <DialogTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                جزئیات آسانسور {selectedElevator.uid}
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
                      <p className="font-medium">{selectedElevator.uid}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">نام ساختمان</Label>
                      <p className="font-medium">{selectedElevator.buildingName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">آدرس</Label>
                      <p>{selectedElevator.address}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">استان</Label>
                        <p>{selectedElevator.provinceName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">شهر</Label>
                        <p>{selectedElevator.cityName}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">کد پستی</Label>
                        <p>{selectedElevator.postalCode}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">منطقه شهرداری</Label>
                        <p>{selectedElevator.municipalRegion}</p>
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
                          {elevatorTypeLabels[selectedElevator.elevatorType]}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">ظرفیت</Label>
                        <p>{selectedElevator.capacity} نفر</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">تعداد طبقات</Label>
                        <p>{selectedElevator.floors} طبقه</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">تاریخ نصب</Label>
                      <p>{selectedElevator.installationDate}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">وضعیت</Label>
                      <div>
                        <Badge className={statusColors[selectedElevator.status]}>
                          {statusLabels[selectedElevator.status]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">اطلاعات شرکت‌ها</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">شرکت مالک</Label>
                      <p className="font-medium">{selectedElevator.ownerCompanyName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">شرکت نصب‌کننده</Label>
                      <p className="font-medium">{selectedElevator.installerCompanyName}</p>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">QR کد آسانسور</h3>
                  <div className="flex justify-center">
                    <QRCodeGenerator
                      value={`https://elevatorid.ieeu.ir/elevator/${selectedElevator.uid}`}
                      size={200}
                    />
                  </div>
                </div>
              </div>

              {/* Parts Management */}
              <div className="p-6 border-t">
                <h3 className="text-lg font-semibold mb-4">قطعات نصب شده</h3>
                {selectedElevator.parts.length > 0 ? (
                  <div className="space-y-2">
                    {selectedElevator.parts.map((part) => (
                      <div key={part.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{part.name}</p>
                          <p className="text-sm text-gray-600">شماره سریال: {part.serialNumber}</p>
                          <p className="text-sm text-gray-600">تاریخ نصب: {part.installedDate}</p>
                        </div>
                        <Badge 
                          className={
                            part.status === 'installed' ? 'bg-green-100 text-green-800' :
                            part.status === 'replaced' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {part.status === 'installed' ? 'نصب شده' :
                           part.status === 'replaced' ? 'تعویض شده' : 'در تعمیر'}
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
                  value={`https://elevatorid.ieeu.ir/elevator/${selectedElevator.uid}`}
                  downloadButton={true}
                  filename={`elevator-${selectedElevator.uid}-qr`}
                />
                <PDFGenerator
                  title={`شناسنامه آسانسور ${selectedElevator.uid}`}
                  data={selectedElevator}
                  filename={`elevator-${selectedElevator.uid}-certificate.pdf`}
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
    </div>
  );
}