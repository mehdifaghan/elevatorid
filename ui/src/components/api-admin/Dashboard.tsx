import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, ArrowRightLeft, Building, Users, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface KPIData {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
  color: string;
  bgColor: string;
}

interface TrendData {
  month: string;
  parts: number;
  transfers: number;
  elevators: number;
}

interface PieData {
  name: string;
  value: number;
  color: string;
}

interface Activity {
  action: string;
  user: string;
  time: string;
  type: 'create' | 'transfer' | 'elevator' | 'request' | 'approve';
}

interface DashboardStats {
  totalParts: number;
  totalTransfers: number;
  totalElevators: number;
  totalRequests: number;
  partsChange: string;
  transfersChange: string;
  elevatorsChange: string;
  requestsChange: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [pieData, setPieData] = useState<PieData[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simulate API calls - replace with actual API endpoints
      await Promise.all([
        fetchStats(),
        fetchTrendData(),
        fetchPartsDistribution(),
        fetchRecentActivities()
      ]);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('خطا در بارگذاری اطلاعات داشبورد');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Replace with actual API call
      // const response = await fetch('/api/v1/admin/dashboard/stats');
      // const data = await response.json();
      
      // Mock data for now
      const mockStats: DashboardStats = {
        totalParts: 0,
        totalTransfers: 0,
        totalElevators: 0,
        totalRequests: 0,
        partsChange: '+0%',
        transfersChange: '+0%',
        elevatorsChange: '+0%',
        requestsChange: '+0%'
      };
      
      setStats(mockStats);
    } catch (error) {
      throw error;
    }
  };

  const fetchTrendData = async () => {
    try {
      // Replace with actual API call
      // const response = await fetch('/api/v1/admin/dashboard/trends');
      // const data = await response.json();
      
      // Mock data for now
      const mockTrendData: TrendData[] = [];
      
      setTrendData(mockTrendData);
    } catch (error) {
      throw error;
    }
  };

  const fetchPartsDistribution = async () => {
    try {
      // Replace with actual API call
      // const response = await fetch('/api/v1/admin/dashboard/parts-distribution');
      // const data = await response.json();
      
      // Mock data for now
      const mockPieData: PieData[] = [];
      
      setPieData(mockPieData);
    } catch (error) {
      throw error;
    }
  };

  const fetchRecentActivities = async () => {
    try {
      // Replace with actual API call
      // const response = await fetch('/api/v1/admin/dashboard/activities');
      // const data = await response.json();
      
      // Mock data for now
      const mockActivities: Activity[] = [];
      
      setActivities(mockActivities);
    } catch (error) {
      throw error;
    }
  };

  const kpiData: KPIData[] = [
    {
      title: 'تعداد قطعات',
      value: stats?.totalParts.toLocaleString('fa-IR') || '0',
      change: stats?.partsChange || '+0%',
      trend: 'up',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'انتقال‌ها',
      value: stats?.totalTransfers.toLocaleString('fa-IR') || '0',
      change: stats?.transfersChange || '+0%',
      trend: 'up',
      icon: ArrowRightLeft,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'آسانسورها',
      value: stats?.totalElevators.toLocaleString('fa-IR') || '0',
      change: stats?.elevatorsChange || '+0%',
      trend: 'up',
      icon: Building,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'درخواست‌ها',
      value: stats?.totalRequests.toLocaleString('fa-IR') || '0',
      change: stats?.requestsChange || '+0%',
      trend: 'down',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">در حال بارگذاری داده‌های داشبورد...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="text-right">
        <h1 className="text-3xl font-bold">داشبورد</h1>
        <p className="text-muted-foreground">خلاصه‌ای از وضعیت سامانه</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm font-medium text-muted-foreground">
                    {kpi.title}
                  </p>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.change}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>روند فعالیت‌ها</CardTitle>
            <CardDescription>
              نمودار روند قطعات، انتقال‌ها و آسانسورها در ۶ ماه اخیر
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
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
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">داده‌ای برای نمایش وجود ندارد</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Parts Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>توزیع انواع قطعات</CardTitle>
            <CardDescription>
              درصد انواع مختلف قطعات در سامانه
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">داده‌ای برای نمایش وجود ندارد</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>فعالیت‌های اخیر</CardTitle>
          <CardDescription>
            آخرین تغییرات و فعالیت‌ها در سامانه
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'create' ? 'bg-green-500' :
                      activity.type === 'transfer' ? 'bg-blue-500' :
                      activity.type === 'elevator' ? 'bg-purple-500' :
                      activity.type === 'request' ? 'bg-orange-500' :
                      'bg-gray-500'
                    }`} />
                    <div className="text-right">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.user}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">فعالیت اخیری وجود ندارد</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}