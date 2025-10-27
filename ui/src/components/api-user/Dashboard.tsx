import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, ArrowRightLeft, Building, MessageSquare, TrendingUp, AlertCircle, CheckCircle, Clock, Wifi } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'sonner@2.0.3';
import DashboardService from '../../services/dashboard.service';

interface DashboardStats {
  partsCount: number;
  transfersCount: number;
  elevatorsCount: number;
  requestsCount: number;
  partsChange: number;
  transfersChange: number;
  elevatorsChange: number;
  requestsChange: number;
}

interface MonthlyData {
  month: string;
  parts: number;
  transfers: number;
  elevators: number;
}

interface PartCategory {
  name: string;
  value: number;
  color: string;
}

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  status: string;
  icon: any;
}

export default function UserDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const isDemo = location.pathname.startsWith('/demo');
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [partsCategoryData, setPartsCategoryData] = useState<PartCategory[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [profileIncomplete, setProfileIncomplete] = useState(false);



  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // بارگذاری موازی تمام داده‌ها برای سرعت بهتر
      const dashboardData = await DashboardService.loadAll();
      
      // تنظیم state‌ها
      setStats(dashboardData.stats);
      setMonthlyData(dashboardData.monthlyData);
      setPartsCategoryData(dashboardData.categories);
      
      // افزودن آیکون به هر فعالیت
      setRecentActivities(dashboardData.activities.map((activity) => ({
        ...activity,
        icon: getActivityIcon(activity.type)
      })));
      
      // بررسی تکمیل بودن پروفایل
      setProfileIncomplete(!dashboardData.profileCheck.isComplete);

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      
      // مدیریت خطاها بر اساس نوع
      if (error.response?.status === 401) {
        toast.error('لطفاً مجدداً وارد شوید');
        // AuthContext خودکار redirect می‌کند
      } else if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
        toast.error('مشکل در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید.');
      } else if (error.response?.status >= 500) {
        toast.error('مشکلی در سرور پیش آمده است. لطفاً بعداً تلاش کنید.');
      } else {
        toast.error('خطا در بارگذاری اطلاعات داشبورد');
      }
      
      // Set empty states
      setStats({
        partsCount: 0,
        transfersCount: 0,
        elevatorsCount: 0,
        requestsCount: 0,
        partsChange: 0,
        transfersChange: 0,
        elevatorsChange: 0,
        requestsChange: 0
      });
      setMonthlyData([]);
      setPartsCategoryData([]);
      setRecentActivities([]);
      setProfileIncomplete(false);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'transfer':
        return ArrowRightLeft;
      case 'elevator':
        return Building;
      case 'request':
        return MessageSquare;
      case 'part':
        return Package;
      default:
        return Package;
    }
  };

  const kpiData = [
    {
      title: 'قطعات در مالکیت',
      value: stats?.partsCount?.toString() || '0',
      change: stats?.partsChange ? `+${stats.partsChange}` : '0',
      trend: 'up',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'انتقال‌های انجام شده',
      value: stats?.transfersCount?.toString() || '0',
      change: stats?.transfersChange ? `+${stats.transfersChange}` : '0',
      trend: 'up',
      icon: ArrowRightLeft,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'آسانسورهای ثبت شده',
      value: stats?.elevatorsCount?.toString() || '0',
      change: stats?.elevatorsChange ? `+${stats.elevatorsChange}` : '0',
      trend: 'up',
      icon: Building,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'درخواست‌های باز',
      value: stats?.requestsCount?.toString() || '0',
      change: stats?.requestsChange ? `${stats.requestsChange}` : '0',
      trend: (stats?.requestsChange || 0) >= 0 ? 'up' : 'down',
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 ml-1" />تکمیل شده</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 ml-1" />در انتظار</Badge>;
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 ml-1" />تایید شده</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">در حال بارگذاری داشبورد...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">


      <div>
        <h1 className="text-3xl font-bold">داشبورد</h1>
        <p className="text-muted-foreground">
          خوش آمدید {user?.companyName || user?.username}
        </p>
      </div>

      {/* Profile Status Alert */}
      {profileIncomplete && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <div className="flex-1">
                <p className="font-medium text-orange-800">پروفایل شرکت شما نیاز به تکمیل دارد</p>
                <p className="text-sm text-orange-600">برای استفاده کامل از خدمات، لطفاً اطلاعات شرکت خود را تکمیل کنید.</p>
              </div>
              <Link to={isDemo ? "/demo/user/profile" : "/api/user/profile"}>
                <Button variant="outline" size="sm" className="text-orange-600 border-orange-300">
                  تکمیل پروفایل
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {kpi.title}
                  </p>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className={`h-4 w-4 ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                    <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.change}
                    </span>
                    <span className="text-xs text-muted-foreground">این ماه</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>روند ماهانه فعالیت‌ها</CardTitle>
            <CardDescription>
              تعداد قطعات، انتقال‌ها و آسانسورها در ۶ ماه اخیر
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
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

        {/* Parts Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>توزیع انواع قطعات</CardTitle>
            <CardDescription>
              درصد انواع قطعات در مالکیت شما
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={partsCategoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {partsCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>فعالیت‌های اخیر</CardTitle>
              <CardDescription>
                آخرین تغییرات و فعالیت‌های شما
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              مشاهده همه
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <activity.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(activity.status)}
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>اقدامات سریع</CardTitle>
          <CardDescription>
            دسترسی سریع به عملیات پرکاربرد
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to={isDemo ? "/demo/user/products" : "/api/user/products"}>
              <Button variant="outline" className="h-24 flex-col gap-2 w-full">
                <Package className="w-6 h-6" />
                ثبت قطعه جدید
              </Button>
            </Link>
            <Link to={isDemo ? "/demo/user/transfers" : "/api/user/transfers"}>
              <Button variant="outline" className="h-24 flex-col gap-2 w-full">
                <ArrowRightLeft className="w-6 h-6" />
                انتقال قطعه
              </Button>
            </Link>
            <Link to={isDemo ? "/demo/user/elevators" : "/api/user/elevators"}>
              <Button variant="outline" className="h-24 flex-col gap-2 w-full">
                <Building className="w-6 h-6" />
                ثبت آسانسور
              </Button>
            </Link>
            <Link to={isDemo ? "/demo/user/requests" : "/api/user/requests"}>
              <Button variant="outline" className="h-24 flex-col gap-2 w-full">
                <MessageSquare className="w-6 h-6" />
                ثبت درخواست
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}