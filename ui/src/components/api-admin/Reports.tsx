import React, { useState, useEffect } from 'react';
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
  DollarSign,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import AdvancedTable, { TableColumn } from '../common/AdvancedTable';
import { realApiRequest, RealApiError } from '../../lib/real-api-client';

interface MonthlyStats {
  month: string;
  parts: number;
  transfers: number;
  elevators: number;
  users: number;
}

interface CompanyTypeData {
  name: string;
  value: number;
  color: string;
}

interface TransferTrendData {
  date: string;
  transfers: number;
  value: number;
}

interface TopCompanyData {
  name: string;
  parts: number;
  transfers: number;
  elevators: number;
}

interface KPICard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  description: string;
}

interface ReportData {
  monthlyStats: MonthlyStats[];
  companyTypes: CompanyTypeData[];
  transferTrends: TransferTrendData[];
  topCompanies: TopCompanyData[];
  kpis: {
    totalParts: number;
    totalTransfers: number;
    totalElevators: number;
    totalUsers: number;
    avgTransferTime: string;
    totalValue: string;
    completionRate: string;
    todayActivity: number;
  };
}

export default function Reports() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [reportType, setReportType] = useState<string>('overview');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, []);

  const handleRefresh = async () => {
    setHasError(false);
    await fetchReportData();
    toast.success('داده‌ها با موفقیت به‌روزرسانی شد');
  };

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setHasError(false);
      
      // Use real API request
      const data = await realApiRequest.get('/admin/reports');
      
      // Map API response to our interface
      const mappedData: ReportData = {
        monthlyStats: data.monthlyStats || data.monthly_stats || [],
        companyTypes: data.companyTypes || data.company_types || [],
        transferTrends: data.transferTrends || data.transfer_trends || [],
        topCompanies: data.topCompanies || data.top_companies || [],
        kpis: {
          totalParts: data.kpis?.totalParts || data.kpis?.total_parts || data.totalParts || data.total_parts || 0,
          totalTransfers: data.kpis?.totalTransfers || data.kpis?.total_transfers || data.totalTransfers || data.total_transfers || 0,
          totalElevators: data.kpis?.totalElevators || data.kpis?.total_elevators || data.totalElevators || data.total_elevators || 0,
          totalUsers: data.kpis?.totalUsers || data.kpis?.total_users || data.totalUsers || data.total_users || 0,
          avgTransferTime: data.kpis?.avgTransferTime || data.kpis?.avg_transfer_time || data.avgTransferTime || data.avg_transfer_time || '0 روز',
          totalValue: data.kpis?.totalValue || data.kpis?.total_value || data.totalValue || data.total_value || '0 ریال',
          completionRate: data.kpis?.completionRate || data.kpis?.completion_rate || data.completionRate || data.completion_rate || '0%',
          todayActivity: data.kpis?.todayActivity || data.kpis?.today_activity || data.todayActivity || data.today_activity || 0
        }
      };
      
      setReportData(mappedData);
      setHasError(false);
    } catch (error) {
      console.error('Error fetching report data:', error);
      
      // Set empty data structure on error
      setReportData({
        monthlyStats: [],
        companyTypes: [],
        transferTrends: [],
        topCompanies: [],
        kpis: {
          totalParts: 0,
          totalTransfers: 0,
          totalElevators: 0,
          totalUsers: 0,
          avgTransferTime: '0 روز',
          totalValue: '0 ریال',
          completionRate: '0%',
          todayActivity: 0
        }
      });
      setHasError(true);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای دریافت گزارش‌ها');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت در دریافت گزارش‌ها');
        } else {
          toast.error('خطا در بارگذاری گزارش‌ها');
        }
      } else {
        toast.error('خطا در بارگذاری گزارش‌ها');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (format: 'csv' | 'pdf' | 'excel') => {
    setIsGenerating(true);
    try {
      // Use real API request for report generation
      const response = await realApiRequest.post('/admin/reports/export', {
        format,
        reportType,
        companyFilter
      }, {
        responseType: 'blob'
      });
      
      // Handle blob response for file download
      const blob = new Blob([response], { type: format === 'pdf' ? 'application/pdf' : 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success(`گزارش ${format.toUpperCase()} با موفقیت تولید شد`);
    } catch (error) {
      console.error('Error generating report:', error);
      
      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور برای تولید گزارش');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت در تولید گزارش');
        } else {
          toast.error('خطا در تولید گزارش');
        }
      } else {
        toast.error('خطا در تولید گزارش');
      }
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
      render: () => new Date().toLocaleDateString('fa-IR')
    }
  ];

  const getKpiCards = (): KPICard[] => {
    if (!reportData) return [];
    
    return [
      {
        title: 'کل قطعات ثبت‌شده',
        value: reportData.kpis.totalParts.toLocaleString('fa-IR'),
        change: '+12%',
        trend: 'up',
        icon: Package,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        description: 'در ماه جاری'
      },
      {
        title: 'کل انتقال‌ها',
        value: reportData.kpis.totalTransfers.toLocaleString('fa-IR'),
        change: '+8%',
        trend: 'up',
        icon: ArrowRightLeft,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        description: 'انتقال موفق'
      },
      {
        title: 'کل آسانسورها',
        value: reportData.kpis.totalElevators.toLocaleString('fa-IR'),
        change: '+15%',
        trend: 'up',
        icon: Building,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        description: 'آسانسور فعال'
      },
      {
        title: 'کل کاربران',
        value: reportData.kpis.totalUsers.toLocaleString('fa-IR'),
        change: '+25%',
        trend: 'up',
        icon: Users,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        description: 'کاربر تایید شده'
      }
    ];
  };

  const getAdditionalKpis = (): KPICard[] => {
    if (!reportData) return [];
    
    return [
      {
        title: 'میانگین زمان انتقال',
        value: reportData.kpis.avgTransferTime,
        change: '-15%',
        trend: 'down',
        icon: Clock,
        color: 'text-cyan-600',
        bgColor: 'bg-cyan-50',
        description: 'بهبود عملکرد'
      },
      {
        title: 'ارزش کل انتقال‌ها',
        value: reportData.kpis.totalValue,
        change: '+22%',
        trend: 'up',
        icon: DollarSign,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        description: 'ریال'
      },
      {
        title: 'نرخ تکمیل درخواست‌ها',
        value: reportData.kpis.completionRate,
        change: '+3%',
        trend: 'up',
        icon: Target,
        color: 'text-rose-600',
        bgColor: 'bg-rose-50',
        description: 'درخواست‌های موفق'
      },
      {
        title: 'فعالیت امروز',
        value: reportData.kpis.todayActivity.toLocaleString('fa-IR'),
        change: '+8%',
        trend: 'up',
        icon: Activity,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        description: 'عملیات انجام‌شده'
      }
    ];
  };

  const EmptyChartState = ({ icon: Icon, title }: { icon: React.ComponentType<any>, title: string }) => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-4">
        <Icon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <div>
          <p className="text-muted-foreground font-medium">داده‌ای برای نمایش وجود ندارد</p>
          {hasError && (
            <p className="text-sm text-muted-foreground mt-1">
              ممکن است مشکلی در اتصال به سرور وجود داشته باشد
            </p>
          )}
        </div>
        {hasError && (
          <Button onClick={handleRefresh} disabled={loading} variant="outline" size="sm">
            {loading ? (
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
        )}
      </div>
    </div>
  );

  if (loading && !reportData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" dir="rtl">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">در حال بارگذاری گزارش‌ها...</p>
          <p className="text-sm text-muted-foreground">اتصال به سرور...</p>
        </div>
      </div>
    );
  }

  const kpiCards = getKpiCards();
  const additionalKpis = getAdditionalKpis();

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="text-right">
          <h1 className="text-3xl font-bold">گزارش‌ها و تحلیل‌ها</h1>
          <p className="text-muted-foreground">آمارها و گزارش‌های تفصیلی سیستم</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'در حال بارگذاری...' : 'تازه‌سازی'}
          </Button>
          
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
        <TabsList className="flex w-full" dir="rtl">
          <TabsTrigger value="overview" className="flex-1 text-center">نمای کلی</TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1 text-center">تحلیل‌ها</TabsTrigger>
          <TabsTrigger value="detailed" className="flex-1 text-center">گزارش تفصیلی</TabsTrigger>
          <TabsTrigger value="export" className="flex-1 text-center">صادرات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6" dir="rtl">
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

        <TabsContent value="analytics" className="space-y-6" dir="rtl">
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
                  {reportData?.monthlyStats.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={reportData.monthlyStats}>
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
                  ) : (
                    <EmptyChartState icon={BarChart3} title="آمار ماهانه" />
                  )}
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
                  {reportData?.companyTypes.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={reportData.companyTypes}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {reportData.companyTypes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyChartState icon={BarChart3} title="توزیع شرکت‌ها" />
                  )}
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
                  {reportData?.transferTrends.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={reportData.transferTrends}>
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
                  ) : (
                    <EmptyChartState icon={ArrowRightLeft} title="روند انتقال‌ها" />
                  )}
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
                  {reportData?.topCompanies.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={reportData.topCompanies}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="parts" fill="#0088FE" name="قطعات" />
                        <Bar dataKey="transfers" fill="#00C49F" name="انتقال‌ها" />
                        <Bar dataKey="elevators" fill="#FFBB28" name="آسانسورها" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyChartState icon={Building} title="شرکت‌های برتر" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6" dir="rtl">
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
              {reportData?.topCompanies && reportData.topCompanies.length > 0 ? (
                <AdvancedTable
                  data={reportData.topCompanies.map((company, index) => ({
                    ...company,
                    id: index + 1,
                    lastActivity: new Date().toLocaleDateString('fa-IR')
                  }))}
                  columns={tableColumns}
                  searchable={true}
                  exportable={true}
                  pagination={false}
                  emptyMessage="هیچ داده‌ای یافت نشد"
                />
              ) : (
                <div className="flex items-center justify-center min-h-[200px]">
                  <div className="text-center space-y-4">
                    <Building className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-medium text-foreground">هیچ داده‌ای یافت نشد</h3>
                      <p className="text-muted-foreground mt-1">
                        ممکن است مشکلی در اتصال به سرور وجود داشته باشد یا هنوز داده‌ای ثبت نشده باشد.
                      </p>
                    </div>
                    {hasError && (
                      <Button onClick={handleRefresh} disabled={loading} variant="outline">
                        {loading ? (
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
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6" dir="rtl">
          <Card>
            <CardHeader>
              <CardTitle>صادرات گزارش‌ها</CardTitle>
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