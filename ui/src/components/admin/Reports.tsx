import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { 
  Download,
  BarChart3,
  Package,
  ArrowRightLeft,
  Building,
  Users,
  Calendar,
  Filter,
  FileText,
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  Clock,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import AdvancedTable, { TableColumn } from '../common/AdvancedTable';

const monthlyStatsData = [
  { month: 'فروردین', parts: 120, transfers: 45, elevators: 12, users: 8 },
  { month: 'اردیبهشت', parts: 135, transfers: 52, elevators: 15, users: 12 },
  { month: 'خرداد', parts: 118, transfers: 38, elevators: 9, users: 6 },
  { month: 'تیر', parts: 142, transfers: 67, elevators: 18, users: 15 },
  { month: 'مرداد', parts: 138, transfers: 54, elevators: 14, users: 9 },
  { month: 'شهریور', parts: 159, transfers: 72, elevators: 21, users: 18 },
  { month: 'مهر', parts: 145, transfers: 48, elevators: 16, users: 11 },
  { month: 'آبان', parts: 167, transfers: 63, elevators: 19, users: 14 }
];

const companyTypeData = [
  { name: 'تولیدی', value: 35, color: '#0088FE' },
  { name: 'بازرگانی', value: 28, color: '#00C49F' },
  { name: 'نصب/مونتاژ', value: 22, color: '#FFBB28' },
  { name: 'نگهداری', value: 15, color: '#FF8042' }
];

const transferTrendData = [
  { date: '۱۴۰۲/۰۹/۰۱', transfers: 12, value: 2500000 },
  { date: '۱۴۰۲/۰۹/۰۲', transfers: 8, value: 1800000 },
  { date: '۱۴۰۲/۰۹/۰۳', transfers: 15, value: 3200000 },
  { date: '۱۴۰۲/۰۹/۰۴', transfers: 10, value: 2100000 },
  { date: '۱۴۰۲/۰۹/۰۵', transfers: 18, value: 3800000 },
  { date: '۱۴۰۲/۰۹/۰۶', transfers: 14, value: 2900000 },
  { date: '۱۴۰۲/۰۹/۰۷', transfers: 22, value: 4500000 }
];

const topCompaniesData = [
  { name: 'شرکت آسانسار تهران', parts: 89, transfers: 34, elevators: 12 },
  { name: 'شرکت قطعات پارس', parts: 67, transfers: 28, elevators: 8 },
  { name: 'شرکت نصب سریع', parts: 45, transfers: 42, elevators: 15 },
  { name: 'شرکت مونتاژ امین', parts: 38, transfers: 19, elevators: 7 },
  { name: 'شرکت الکترونیک پیشرو', parts: 52, transfers: 15, elevators: 4 }
];

export default function Reports() {
  const [reportType, setReportType] = useState<string>('overview');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleGenerateReport = async (format: 'csv' | 'pdf' | 'excel') => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`گزارش ${format.toUpperCase()} با موفقیت تولید شد`);
    } catch (error) {
      toast.error('خطا در تولید گزارش');
    } finally {
      setIsGenerating(false);
    }
  };

  const tableColumns: TableColumn[] = [
    {
      key: 'name',
      label: 'شرکت',
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>
    },
    {
      key: 'parts',
      label: 'قطعات',
      sortable: true,
      render: (value) => (
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          {value}
        </Badge>
      )
    },
    {
      key: 'transfers',
      label: 'انتقال‌ها',
      sortable: true,
      render: (value) => (
        <Badge variant="outline" className="bg-green-50 text-green-700">
          {value}
        </Badge>
      )
    },
    {
      key: 'elevators',
      label: 'آسانسورها',
      sortable: true,
      render: (value) => (
        <Badge variant="outline" className="bg-purple-50 text-purple-700">
          {value}
        </Badge>
      )
    },
    {
      key: 'lastActivity',
      label: 'آخرین فعالیت',
      sortable: true,
      render: () => '۱۴۰۲/۰۹/۱۵'
    }
  ];

  const kpiCards = [
    {
      title: 'کل قطعات ثبت‌شده',
      value: '12,845',
      change: '+12%',
      trend: 'up',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'در ماه جاری'
    },
    {
      title: 'کل انتقال‌ها',
      value: '3,234',
      change: '+8%',
      trend: 'up',
      icon: ArrowRightLeft,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'انتقال موفق'
    },
    {
      title: 'کل آسانسورها',
      value: '856',
      change: '+15%',
      trend: 'up',
      icon: Building,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'آسانسور فعال'
    },
    {
      title: 'کل کاربران',
      value: '127',
      change: '+25%',
      trend: 'up',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'کاربر تایید شده'
    }
  ];

  const additionalKpis = [
    {
      title: 'میانگین زمان انتقال',
      value: '2.3 روز',
      change: '-15%',
      trend: 'down',
      icon: Clock,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      description: 'بهبود عملکرد'
    },
    {
      title: 'ارزش کل انتقال‌ها',
      value: '۲.۴ میلیارد',
      change: '+22%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: 'ریال'
    },
    {
      title: 'نرخ تکمیل درخواست‌ها',
      value: '94.2%',
      change: '+3%',
      trend: 'up',
      icon: Target,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      description: 'درخواست‌های موفق'
    },
    {
      title: 'فعالیت امروز',
      value: '156',
      change: '+8%',
      trend: 'up',
      icon: Activity,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'عملیات انجام‌شده'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">گزارش‌ها و تحلیل‌ها</h1>
          <p className="text-muted-foreground">آمارها و گزارش‌های تفصیلی سیستم</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => handleGenerateReport('csv')}
            disabled={isGenerating}
            variant="outline"
            size="sm"
          >
            <Download className="w-4 h-4 ml-2" />
            CSV
          </Button>
          <Button 
            onClick={() => handleGenerateReport('excel')}
            disabled={isGenerating}
            variant="outline"
            size="sm"
          >
            <FileText className="w-4 h-4 ml-2" />
            Excel
          </Button>
          <Button 
            onClick={() => handleGenerateReport('pdf')}
            disabled={isGenerating}
          >
            <FileText className="w-4 h-4 ml-2" />
            {isGenerating ? 'در حال تولید...' : 'گزارش PDF'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نمای کلی</TabsTrigger>
          <TabsTrigger value="analytics">تحلیل‌ها</TabsTrigger>
          <TabsTrigger value="detailed">گزارش تفصیلی</TabsTrigger>
          <TabsTrigger value="export">صادرات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Primary KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiCards.map((kpi, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {kpi.title}
                      </p>
                      <p className="text-2xl font-bold mb-2">{kpi.value}</p>
                      <div className="flex items-center gap-1">
                        {kpi.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {kpi.change}
                        </span>
                        <span className="text-xs text-muted-foreground mr-2">
                          {kpi.description}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                      <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Secondary KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalKpis.map((kpi, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {kpi.title}
                      </p>
                      <p className="text-2xl font-bold mb-2">{kpi.value}</p>
                      <div className="flex items-center gap-1">
                        {kpi.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-green-600" />
                        )}
                        <span className="text-sm text-green-600">
                          {kpi.change}
                        </span>
                        <span className="text-xs text-muted-foreground mr-2">
                          {kpi.description}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                      <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>آمار ماهانه</CardTitle>
                <CardDescription>
                  روند فعالیت‌ها در ماه‌های اخیر
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyStatsData}>
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
                        name="انتقال‌ها"
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

            {/* Company Types Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>توزیع انواع شرکت‌ها</CardTitle>
                <CardDescription>
                  درصد انواع مختلف شرکت‌های عضو
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={companyTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {companyTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Transfer Trend */}
            <Card>
              <CardHeader>
                <CardTitle>روند انتقال‌ها</CardTitle>
                <CardDescription>
                  تعداد و ارزش انتقال‌ها در هفته اخیر
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={transferTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="transfers"
                        stroke="#8884d8"
                        name="تعداد انتقال"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="value"
                        stroke="#82ca9d"
                        name="ارزش (ریال)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Top Companies */}
            <Card>
              <CardHeader>
                <CardTitle>شرکت‌های برتر</CardTitle>
                <CardDescription>
                  فعال‌ترین شرکت‌ها بر اساس تعداد فعالیت
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topCompaniesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="parts" fill="#0088FE" name="قطعات" />
                      <Bar dataKey="transfers" fill="#00C49F" name="انتقال‌ها" />
                      <Bar dataKey="elevators" fill="#FFBB28" name="آسانسورها" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                گزارش تفصیلی شرکت‌ها
                <div className="flex gap-2">
                  <Select value={companyFilter} onValueChange={setCompanyFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="فیلتر شرکت" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه شرکت‌ها</SelectItem>
                      <SelectItem value="1">شرکت آسانسار تهران</SelectItem>
                      <SelectItem value="2">شرکت قطعات پارس</SelectItem>
                      <SelectItem value="3">شرکت نصب سریع</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AdvancedTable
                data={topCompaniesData.map((company, index) => ({
                  ...company,
                  id: index + 1,
                  lastActivity: '۱۴۰۲/۰۹/۱۵'
                }))}
                columns={tableColumns}
                searchable={true}
                exportable={true}
                pagination={false}
                emptyMessage="هیچ داده‌ای یافت نشد"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">صادرات گزارش‌ها</CardTitle>
              <CardDescription>
                گزارش‌های مختلف را در فرمت‌های مختلف دانلود کنید
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="text-center space-y-4">
                    <BarChart3 className="h-12 w-12 mx-auto text-blue-600" />
                    <h3 className="font-semibold">گزارش کلی سیستم</h3>
                    <p className="text-sm text-muted-foreground">
                      آمار کلی قطعات، انتقال‌ها و آسانسورها
                    </p>
                    <Button 
                      onClick={() => handleGenerateReport('pdf')}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      دانلود PDF
                    </Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="text-center space-y-4">
                    <Package className="h-12 w-12 mx-auto text-green-600" />
                    <h3 className="font-semibold">گزارش قطعات</h3>
                    <p className="text-sm text-muted-foreground">
                      لیست کامل قطعات و وضعیت آن‌ها
                    </p>
                    <Button 
                      onClick={() => handleGenerateReport('excel')}
                      disabled={isGenerating}
                      className="w-full"
                      variant="outline"
                    >
                      دانلود Excel
                    </Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="text-center space-y-4">
                    <ArrowRightLeft className="h-12 w-12 mx-auto text-purple-600" />
                    <h3 className="font-semibold">گزارش انتقال‌ها</h3>
                    <p className="text-sm text-muted-foreground">
                      تاریخچه و جزئیات انتقال‌های انجام‌شده
                    </p>
                    <Button 
                      onClick={() => handleGenerateReport('csv')}
                      disabled={isGenerating}
                      className="w-full"
                      variant="outline"
                    >
                      دانلود CSV
                    </Button>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}