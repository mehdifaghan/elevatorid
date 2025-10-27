import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
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
  Download,
  Wifi,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import QRCodeGenerator from '../common/QRCodeGenerator';
import { realApiRequest } from '../../lib/real-api-client';

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

interface ElevatorStats {
  total: number;
  active: number;
  maintenance: number;
  outOfOrder: number;
  installing: number;
}

export default function UserElevators() {
  const [elevators, setElevators] = useState<Elevator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCertificate, setSelectedCertificate] = useState<Elevator | null>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPartChangeModalOpen, setIsPartChangeModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [selectedElevatorForMaintenance, setSelectedElevatorForMaintenance] = useState<Elevator | null>(null);
  const [selectedElevatorForPartChange, setSelectedElevatorForPartChange] = useState<Elevator | null>(null);
  const [isNewElevatorModalOpen, setIsNewElevatorModalOpen] = useState(false);
  const [stats, setStats] = useState<ElevatorStats>({
    total: 0,
    active: 0,
    maintenance: 0,
    outOfOrder: 0,
    installing: 0
  });



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

  useEffect(() => {
    fetchElevators();
  }, []);

  const fetchElevators = async () => {
    try {
      setLoading(true);
      
      // Fetch elevators
      const elevatorsResponse = await realApiRequest.get('/user/elevators');
      const elevators = elevatorsResponse.data.elevators || [];
      setElevators(elevators);
      setStats(calculateStats(elevators));

    } catch (error: any) {
      console.error('Error fetching elevators:', error);
      toast.error('خطا در بارگذاری اطلاعات آسانسورها');
      
      // Set empty states
      setElevators([]);
      setStats({
        total: 0,
        active: 0,
        maintenance: 0,
        outOfOrder: 0,
        installing: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (elevatorsList: Elevator[]): ElevatorStats => {
    return {
      total: elevatorsList.length,
      active: elevatorsList.filter(e => e.status === 'active').length,
      maintenance: elevatorsList.filter(e => e.status === 'maintenance').length,
      outOfOrder: elevatorsList.filter(e => e.status === 'out_of_order').length,
      installing: elevatorsList.filter(e => e.status === 'installing').length
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchElevators();
    setIsRefreshing(false);
    toast.success('✅ اطلاعات بروزرسانی شد');
  };

  const handleCreateElevator = async (elevatorData: any) => {
    try {
      const response = await realApiRequest.post('/user/elevators', elevatorData);
      if (response.data) {
        await fetchElevators(); // Refresh the list
        toast.success('آسانسور جدید با موفقیت ثبت شد');
      }
    } catch (error) {
      console.error('Error creating elevator:', error);
      toast.error('خطا در ثبت آسانسور جدید');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">در حال بارگذاری آسانسورها...</p>
        </div>
      </div>
    );
  }

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
                <p className="text-sm text-gray-600">تعمیرات</p>
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
                <p className="text-sm text-gray-600">خراب</p>
                <p className="text-xl font-bold text-red-600">{stats.outOfOrder}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="جستجو آسانسور..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="انتخاب وضعیت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="active">فعال</SelectItem>
                <SelectItem value="maintenance">تعمیرات</SelectItem>
                <SelectItem value="out_of_order">خراب</SelectItem>
                <SelectItem value="installing">در حال نصب</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Elevators List */}
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
      {selectedCertificate && (
        <Dialog open={isCertificateModalOpen} onOpenChange={setIsCertificateModalOpen}>
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden" dir="rtl">
            <DialogHeader className="text-right">
              <DialogTitle>شناسنامه آسانسور {selectedCertificate.uid}</DialogTitle>
              <DialogDescription>
                اطلاعات کامل و مشخصات فنی آسانسور
              </DialogDescription>
            </DialogHeader>
            <div className="modal-scroll-container">
              <ElevatorCertificate elevator={selectedCertificate} />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* New Elevator Modal */}
      {isNewElevatorModalOpen && (
        <Dialog open={isNewElevatorModalOpen} onOpenChange={setIsNewElevatorModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh]" dir="rtl">
            <DialogHeader className="text-right">
              <DialogTitle>ثبت آسانسور جدید</DialogTitle>
              <DialogDescription>
                اطلاعات آسانسور جدید را وارد کنید
              </DialogDescription>
            </DialogHeader>
            <div className="modal-scroll-container">
              <ElevatorRegistrationForm 
                onSubmit={handleCreateElevator}
                onCancel={() => setIsNewElevatorModalOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Part Change Modal */}
      {isPartChangeModalOpen && selectedElevatorForPartChange && (
        <Dialog open={isPartChangeModalOpen} onOpenChange={setIsPartChangeModalOpen}>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader className="text-right">
              <DialogTitle>تغییر قطعات آسانسور</DialogTitle>
              <DialogDescription>
                ثبت تغییرات قطعات آسانسور {selectedElevatorForPartChange.uid}
              </DialogDescription>
            </DialogHeader>
            <PartChangeForm 
              elevator={selectedElevatorForPartChange}
              onClose={() => setIsPartChangeModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Maintenance Modal */}
      {isMaintenanceModalOpen && selectedElevatorForMaintenance && (
        <Dialog open={isMaintenanceModalOpen} onOpenChange={setIsMaintenanceModalOpen}>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader className="text-right">
              <DialogTitle>ثبت تعمیرات آسانسور</DialogTitle>
              <DialogDescription>
                ثبت اطلاعات تعمیرات آسانسور {selectedElevatorForMaintenance.uid}
              </DialogDescription>
            </DialogHeader>
            <MaintenanceForm 
              elevator={selectedElevatorForMaintenance}
              onClose={() => setIsMaintenanceModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Certificate Component
function ElevatorCertificate({ elevator }: { elevator: Elevator }) {
  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="text-center border-b-2 border-primary pb-4">
        <h2 className="text-2xl font-bold text-primary mb-2">شناسنامه آسانسور</h2>
        <p className="text-lg text-muted-foreground">سامانه ردیابی قطعات و شناسنامه آسانسور</p>
        <p className="text-sm text-muted-foreground">شناسه: {elevator.uid}</p>
      </div>

      {/* Building Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات ساختمان</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">نام ساختمان:</span>
              <span className="font-medium">{elevator.buildingName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">نوع ساختمان:</span>
              <span className="font-medium">{elevator.buildingType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">تعداد طبقات:</span>
              <span className="font-medium">{elevator.floors}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ظرفیت:</span>
              <span className="font-medium">{elevator.capacity}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>اطلاعات فنی</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">نوع موتور:</span>
              <span className="font-medium">{elevator.motorType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">تاریخ نصب:</span>
              <span className="font-medium">{elevator.installationDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">آخرین بازرسی:</span>
              <span className="font-medium">{elevator.lastInspection}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">بازرسی بعدی:</span>
              <span className="font-medium">{elevator.nextInspection}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QR Code */}
      <div className="text-center">
        <QRCodeGenerator 
          value={`https://elevatorid.ieeu.ir/elevator/${elevator.uid}`}
          size={150}
        />
        <p className="text-sm text-muted-foreground mt-2">کد QR آسانسور</p>
      </div>
    </div>
  );
}

// Part Change Form Component
function PartChangeForm({ elevator, onClose }: { elevator: Elevator; onClose: () => void }) {
  const [selectedPart, setSelectedPart] = useState('');
  const [newPartSerial, setNewPartSerial] = useState('');
  const [changeReason, setChangeReason] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // API call to change part
      await realApiRequest.post(`/user/elevators/${elevator.id}/change-part`, {
        partId: selectedPart,
        newPartSerial,
        reason: changeReason
      });
      
      toast.success('تغییر قطعه با موفقیت ثبت شد');
      onClose();
    } catch (error) {
      console.error('Error changing part:', error);
      toast.error('خطا در ثبت تغییر قطعه');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>انتخاب قطعه</Label>
        <Select value={selectedPart} onValueChange={setSelectedPart}>
          <SelectTrigger>
            <SelectValue placeholder="قطعه را انتخاب کنید" />
          </SelectTrigger>
          <SelectContent>
            {elevator.parts.map((part) => (
              <SelectItem key={part.id} value={part.id}>
                {part.name} - {part.serialNumber}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>شماره سریال قطعه جدید</Label>
        <Input
          value={newPartSerial}
          onChange={(e) => setNewPartSerial(e.target.value)}
          placeholder="شماره سریال جدید"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>دلیل تغییر</Label>
        <Textarea
          value={changeReason}
          onChange={(e) => setChangeReason(e.target.value)}
          placeholder="دلیل تغییر قطعه را بنویسید..."
          required
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          انصراف
        </Button>
        <Button type="submit">
          ثبت تغییر
        </Button>
      </div>
    </form>
  );
}

// Maintenance Form Component  
function MaintenanceForm({ elevator, onClose }: { elevator: Elevator; onClose: () => void }) {
  const [maintenanceType, setMaintenanceType] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [performedBy, setPerformedBy] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // API call to record maintenance
      await realApiRequest.post(`/user/elevators/${elevator.id}/maintenance`, {
        type: maintenanceType,
        description,
        cost: parseFloat(cost),
        performedBy
      });
      
      toast.success('تعمیرات با موفقیت ثبت شد');
      onClose();
    } catch (error) {
      console.error('Error recording maintenance:', error);
      toast.error('خطا در ثبت تعمیرات');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>نوع تعمیرات</Label>
        <Select value={maintenanceType} onValueChange={setMaintenanceType}>
          <SelectTrigger>
            <SelectValue placeholder="نوع تعمیرات را انتخاب کنید" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="preventive">تعمیرات پیشگیرانه</SelectItem>
            <SelectItem value="corrective">تعمیرات اصلاحی</SelectItem>
            <SelectItem value="emergency">تعمیرات اضطراری</SelectItem>
            <SelectItem value="inspection">بازرسی</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>شرح تعمیرات</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="شرح کامل تعمیرات انجام شده..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label>هزینه (ریال)</Label>
        <Input
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          placeholder="هزینه تعمیرات"
        />
      </div>

      <div className="space-y-2">
        <Label>انجام‌دهنده</Label>
        <Input
          value={performedBy}
          onChange={(e) => setPerformedBy(e.target.value)}
          placeholder="نام انجام‌دهنده تعمیرات"
          required
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          انصراف
        </Button>
        <Button type="submit">
          ثبت تعمیرات
        </Button>
      </div>
    </form>
  );
}