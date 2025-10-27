import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, ArrowRightLeft, Building, Users, TrendingUp, TrendingDown } from 'lucide-react';

const kpiData = [
  {
    title: 'تعداد قطعات',
    value: '12,845',
    change: '+12%',
    trend: 'up',
    icon: Package,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'انتقال‌ها',
    value: '3,234',
    change: '+8%',
    trend: 'up',
    icon: ArrowRightLeft,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: 'آسانسورها',
    value: '856',
    change: '+15%',
    trend: 'up',
    icon: Building,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'درخواست‌ها',
    value: '127',
    change: '-5%',
    trend: 'down',
    icon: Users,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
];

const trendData = [
  { month: 'فروردین', parts: 1200, transfers: 145, elevators: 45 },
  { month: 'اردیبهشت', parts: 1350, transfers: 167, elevators: 52 },
  { month: 'خرداد', parts: 1180, transfers: 134, elevators: 48 },
  { month: 'تیر', parts: 1420, transfers: 189, elevators: 61 },
  { month: 'مرداد', parts: 1380, transfers: 176, elevators: 58 },
  { month: 'شهریور', parts: 1590, transfers: 198, elevators: 67 },
];

const pieData = [
  { name: 'موتور', value: 30, color: '#0088FE' },
  { name: 'کابل', value: 25, color: '#00C49F' },
  { name: 'کنترلر', value: 20, color: '#FFBB28' },
  { name: 'سنسور', value: 15, color: '#FF8042' },
  { name: 'سایر', value: 10, color: '#8884D8' },
];

export default function Dashboard() {
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
            {[
              { action: 'ثبت قطعه جدید', user: 'شرکت آسانسار تهران', time: '۲ دقیقه پیش', type: 'create' },
              { action: 'انتقال قطعه', user: 'شرکت نصب سریع', time: '۱۵ دقیقه پیش', type: 'transfer' },
              { action: 'ثبت آسانسور جدید', user: 'شرکت مونتاژ امین', time: '۳۰ دقیقه پیش', type: 'elevator' },
              { action: 'درخواست تغییر اطلاعات', user: 'شرکت قطعات پارس', time: '۱ ساعت پیش', type: 'request' },
              { action: 'تایید درخواست', user: 'مدیر سیستم', time: '۲ ساعت پیش', type: 'approve' },
            ].map((activity, index) => (
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}