import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, ArrowRightLeft, Building, MessageSquare, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const kpiData = [
  {
    title: 'قطعات در مالکیت',
    value: '245',
    change: '+5',
    trend: 'up',
    icon: Package,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'انتقال‌های انجام شده',
    value: '89',
    change: '+12',
    trend: 'up',
    icon: ArrowRightLeft,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: 'آسانسورهای ثبت شده',
    value: '23',
    change: '+3',
    trend: 'up',
    icon: Building,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'درخواست‌های باز',
    value: '4',
    change: '-2',
    trend: 'down',
    icon: MessageSquare,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
];

const monthlyData = [
  { month: 'فروردین', parts: 45, transfers: 12, elevators: 3 },
  { month: 'اردیبهشت', parts: 52, transfers: 18, elevators: 5 },
  { month: 'خرداد', parts: 38, transfers: 14, elevators: 2 },
  { month: 'تیر', parts: 63, transfers: 22, elevators: 7 },
  { month: 'مرداد', parts: 49, transfers: 16, elevators: 4 },
  { month: 'شهریور', parts: 58, transfers: 19, elevators: 6 },
];

const partsCategoryData = [
  { name: 'موتور', value: 35, color: '#0088FE' },
  { name: 'کابل', value: 28, color: '#00C49F' },
  { name: 'کنترلر', value: 22, color: '#FFBB28' },
  { name: 'سنسور', value: 15, color: '#FF8042' },
];

export default function UserDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const isDemo = location.pathname.startsWith('/demo');

  const recentActivities = [
    {
      id: '1',
      type: 'transfer',
      title: 'انتقال قطعه موتور',
      description: 'انتقال موتور ۱۰HP به شرکت نصب سریع',
      time: '۲ ساعت پیش',
      status: 'completed',
      icon: ArrowRightLeft
    },
    {
      id: '2',
      type: 'elevator',
      title: 'ثبت آسانسور جدید',
      description: 'ثبت آسانسور مجتمع تجاری پارس',
      time: '۱ روز پیش',
      status: 'pending',
      icon: Building
    },
    {
      id: '3',
      type: 'request',
      title: 'درخواست تغییر اطلاعات',
      description: 'درخواست به‌روزرسانی آدرس شرکت',
      time: '۳ روز پیش',
      status: 'approved',
      icon: MessageSquare
    },
    {
      id: '4',
      type: 'part',
      title: 'افزودن قطعه جدید',
      description: 'ثبت کنترلر جدید مدل KX-200',
      time: '۱ هفته پیش',
      status: 'completed',
      icon: Package
    }
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">داشبورد</h1>
        <p className="text-muted-foreground">
          خوش آمدید {user?.companyName || user?.username}
        </p>
      </div>

      {/* Profile Status Alert */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <div className="flex-1">
              <p className="font-medium text-orange-800">پروفایل شرکت شما نیاز به تکمیل دارد</p>
              <p className="text-sm text-orange-600">برای استفاده کامل از خدمات، لطفاً اطلاعات شرکت خود را تکمیل کنید.</p>
            </div>
            <Link to={isDemo ? "/demo/user/profile" : "/user/profile"}>
              <Button variant="outline" size="sm" className="text-orange-600 border-orange-300">
                تکمیل پروفایل
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

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
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">
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
            <Button variant="outline" className="h-24 flex-col gap-2">
              <Package className="w-6 h-6" />
              ثبت قطعه جدید
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <ArrowRightLeft className="w-6 h-6" />
              انتقال قطعه
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <Building className="w-6 h-6" />
              ثبت آسانسور
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <MessageSquare className="w-6 h-6" />
              ثبت درخواست
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}