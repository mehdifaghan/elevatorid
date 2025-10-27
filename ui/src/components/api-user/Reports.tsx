import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { 
  Download,
  BarChart3,
  Package,
  ArrowRightLeft,
  Building,
  Calendar,
  Filter,
  FileText,
  TrendingUp,
  Wifi,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { realApiRequest } from '../../lib/real-api-client';

interface ReportData {
  monthlyData: {
    month: string;
    parts: number;
    transfers: number;
    elevators: number;
  }[];
  partsCategoryData: {
    name: string;
    value: number;
    color: string;
  }[];
  transferValueData: {
    date: string;
    incoming: number;
    outgoing: number;
    value: number;
  }[];
  elevatorStatusData: {
    status: string;
    count: number;
    color: string;
  }[];
  summary: {
    totalParts: number;
    totalTransfers: number;
    totalElevators: number;
    totalValue: number;
  };
}

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('last_month');
  const [reportType, setReportType] = useState<string>('overview');
  const [reportData, setReportData] = useState<ReportData | null>(null);



  useEffect(() => {
    fetchReportData();
  }, [dateRange, reportType]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      // Fetch reports data
      const reportsResponse = await realApiRequest.get('/user/reports', {
        params: {
          dateRange,
          reportType
        }
      });
      
      setReportData(reportsResponse.data);

    } catch (error: any) {
      console.error('Error fetching reports data:', error);
      toast.error('خطا در بارگذاری اطلاعات گزارش‌ها');
      
      // Set empty states
      setReportData({
        monthlyData: [],
        partsCategoryData: [],
        transferValueData: [],
        elevatorStatusData: [],
        summary: {
          totalParts: 0,
          totalTransfers: 0,
          totalElevators: 0,
          totalValue: 0
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async (format: 'pdf' | 'excel') => {
    try {
      const response = await realApiRequest.get(`/user/reports/export`, {
        params: {
          format,
          dateRange,
          reportType
        },
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${dateRange}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`گزارش ${format.toUpperCase()} با موفقیت دانلود شد`);
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error(`خطا در دانلود گزارش ${format.toUpperCase()}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">در حال بارگذاری گزارش‌ها...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">خطا در بارگذاری اطلاعات گزارش</p>
        <Button 
          onClick={() => fetchReportData()} 
          className="mt-4"
          variant="outline"
        >
          تلاش مجدد
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">


      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">گزارش‌ها و تحلیل‌ها</h1>
          <p className="text-muted-foreground">مشاهده آمار و گزارش‌های تفصیلی</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleExportReport('pdf')}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExportReport('excel')}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center gap-2 flex-1">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">فیلترها:</span>
            </div>
            
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="نوع گزارش" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">خلاصه کلی</SelectItem>
                <SelectItem value="parts">گزارش قطعات</SelectItem>
                <SelectItem value="transfers">گزارش انتقالات</SelectItem>
                <SelectItem value="elevators">گزارش آسانسورها</SelectItem>
                <SelectItem value="financial">گزارش مالی</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="بازه زمانی" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_week">هفته گذشته</SelectItem>
                <SelectItem value="last_month">ماه گذشته</SelectItem>
                <SelectItem value="last_3_months">سه ماه گذشته</SelectItem>
                <SelectItem value="last_6_months">شش ماه گذشته</SelectItem>
                <SelectItem value="last_year">سال گذشته</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">کل قطعات</p>
                <p className="text-xl font-bold">{reportData.summary.totalParts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ArrowRightLeft className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">کل انتقالات</p>
                <p className="text-xl font-bold">{reportData.summary.totalTransfers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">کل آسانسورها</p>
                <p className="text-xl font-bold">{reportData.summary.totalElevators}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ارزش کل (ریال)</p>
                <p className="text-xl font-bold">{reportData.summary.totalValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              فعالیت ماهانه
            </CardTitle>
            <CardDescription>
              روند فعالیت‌ها در ماه‌های اخیر
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reportData.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="parts"
                    stackId="1"
                    stroke="#0088FE"
                    fill="#0088FE"
                    name="قطعات"
                  />
                  <Area
                    type="monotone"
                    dataKey="transfers"
                    stackId="1"
                    stroke="#00C49F"
                    fill="#00C49F"
                    name="انتقالات"
                  />
                  <Area
                    type="monotone"
                    dataKey="elevators"
                    stackId="1"
                    stroke="#FFBB28"
                    fill="#FFBB28"
                    name="آسانسورها"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Parts Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              توزیع دسته‌بندی قطعات
            </CardTitle>
            <CardDescription>
              درصد هر دسته از کل قطعات
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportData.partsCategoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {reportData.partsCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Transfer Value Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5" />
              روند ارزش انتقالات
            </CardTitle>
            <CardDescription>
              تغییرات ارزش انتقالات در طول زمان
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reportData.transferValueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${(value as number).toLocaleString()} ریال`} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="ارزش"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Elevator Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              وضعیت آسانسورها
            </CardTitle>
            <CardDescription>
              توزیع آسانسورها بر اساس وضعیت
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData.elevatorStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            جدول تفصیلی انتقالات
          </CardTitle>
          <CardDescription>
            آخرین انتقالات با جزئیات
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-2">تاریخ</th>
                  <th className="text-right p-2">دریافتی</th>
                  <th className="text-right p-2">ارسالی</th>
                  <th className="text-right p-2">ارزش (ریال)</th>
                </tr>
              </thead>
              <tbody>
                {reportData.transferValueData.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{item.date}</td>
                    <td className="p-2 text-green-600">{item.incoming}</td>
                    <td className="p-2 text-blue-600">{item.outgoing}</td>
                    <td className="p-2 font-medium">{item.value.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Report Actions */}
      <Card>
        <CardHeader>
          <CardTitle>عملیات گزارش</CardTitle>
          <CardDescription>
            دانلود و اشتراک‌گذاری گزارش‌ها
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => handleExportReport('pdf')}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              دانلود PDF
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleExportReport('excel')}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              دانلود Excel
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.print()}
              className="gap-2"
            >
              <FileText className="w-4 h-4" />
              چاپ گزارش
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}