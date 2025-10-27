import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
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
  TrendingUp
} from 'lucide-react';

const monthlyData = [
  { month: 'فروردین', parts: 12, transfers: 4, elevators: 1 },
  { month: 'اردیبهشت', parts: 15, transfers: 6, elevators: 2 },
  { month: 'خرداد', parts: 8, transfers: 3, elevators: 0 },
  { month: 'تیر', parts: 18, transfers: 8, elevators: 3 },
  { month: 'مرداد', parts: 14, transfers: 5, elevators: 1 },
  { month: 'شهریور', parts: 22, transfers: 9, elevators: 2 },
];

const partsCategoryData = [
  { name: 'موتور', value: 35, color: '#0088FE' },
  { name: 'کنترلر', value: 28, color: '#00C49F' },
  { name: 'کابل', value: 22, color: '#FFBB28' },
  { name: 'سنسور', value: 15, color: '#FF8042' }
];

const transferValueData = [
  { date: '۱۴۰۲/۰۹/۰۱', incoming: 2, outgoing: 1, value: 45000000 },
  { date: '۱۴۰۲/۰۹/۰۵', incoming: 1, outgoing: 3, value: 67000000 },
  { date: '۱۴۰۲/۰۹/۱۰', incoming: 3, outgoing: 2, value: 52000000 },
  { date: '۱۴۰۲/۰۹/۱۵', incoming: 2, outgoing: 4, value: 78000000 },
];

const elevatorStatusData = [
  { status: 'فعال', count: 8, color: '#22c55e' },
  { status: 'در تعمیر', count: 2, color: '#f59e0b' },
  { status: 'غیرفعال', count: 1, color: '#ef4444' }
];

export default function Reports() {
  const [dateRange, setDateRange] = useState('last_month');
  const [reportType, setReportType] = useState<string>('overview');

  const kpiCards = [
    {
      title: 'کل قطعات',
      value: '89',
      change: '+5',
      trend: 'up',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'انتقال‌های انجام شده',
      value: '34',
      change: '+8',
      trend: 'up',
      icon: ArrowRightLeft,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'آسانسورهای نصب شده',
      value: '12',
      change: '+2',
      trend: 'up',
      icon: Building,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const recentActivities = [
    {
      type: 'part_added',
      title: 'ثبت قطعه جدید',
      description: 'موتور AC مدل AC-2000',
      date: '۱۴۰۲/۰۹/۱۵',
      icon: Package
    },
    {
      type: 'transfer_completed',
      title: 'تکمیل انتقال',
      description: 'انتقال کنترلر VFD به شرکت نصب سریع',
      date: '۱۴۰۲/۰۹/۱۴',
      icon: ArrowRightLeft
    },
    {
      type: 'elevator_registered',
      title: 'ثبت آسانسور',
      description: 'آسانسور مجتمع تجاری پارس',
      date: '۱۴۰۲/۰۹/۱۲',
      icon: Building
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">گزارش‌ها</h1>
        <p className="text-muted-foreground">آمار و گزارش‌های فعالیت‌های شما</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            فیلترهای گزارش
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">نوع گزارش</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">کلی</SelectItem>
                  <SelectItem value="parts">قطعات</SelectItem>
                  <SelectItem value="transfers">انتقال‌ها</SelectItem>
                  <SelectItem value="elevators">آسانسورها</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">بازه زمانی</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_week">هفته گذشته</SelectItem>
                  <SelectItem value="last_month">ماه گذشته</SelectItem>
                  <SelectItem value="last_3_months">۳ ماه گذشته</SelectItem>
                  <SelectItem value="last_year">سال گذشته</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="w-4 h-4 ml-2" />
                CSV
              </Button>
              <Button variant="outline">
                <FileText className="w-4 h-4 ml-2" />
                PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiCards.map((kpi, index) => (
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
                    <span className="text-sm text-green-600">{kpi.change}</span>
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
        {/* Monthly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>فعالیت ماهانه</CardTitle>
            <CardDescription>
              روند فعالیت‌های شما در ۶ ماه اخیر
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transfer Value Trend */}
        <Card>
          <CardHeader>
            <CardTitle>روند ارزش انتقال‌ها</CardTitle>
            <CardDescription>
              ارزش انتقال‌های دریافتی و ارسالی
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={transferValueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'value' ? `${Number(value).toLocaleString()} ریال` : value,
                      name === 'incoming' ? 'دریافتی' : 
                      name === 'outgoing' ? 'ارسالی' : 'ارزش'
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="incoming"
                    stroke="#22c55e"
                    name="دریافتی"
                  />
                  <Line
                    type="monotone"
                    dataKey="outgoing"
                    stroke="#3b82f6"
                    name="ارسالی"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Elevator Status */}
        <Card>
          <CardHeader>
            <CardTitle>وضعیت آسانسورها</CardTitle>
            <CardDescription>
              تعداد آسانسورها بر اساس وضعیت فعلی
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={elevatorStatusData}>
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

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>فعالیت‌های اخیر</CardTitle>
          <CardDescription>
            آخرین تغییرات و فعالیت‌های انجام شده
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-lg border">
                <div className="p-2 rounded-lg bg-blue-50">
                  <activity.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {activity.date}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>خلاصه فعالیت‌ها</CardTitle>
          <CardDescription>
            جدول خلاصه آمار بر اساس فیلترهای انتخاب‌شده
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">ماه</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">قطعات ثبت شده</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">انتقال‌ها</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">آسانسورها</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">درصد رشد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {monthlyData.map((month, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{month.month}</td>
                    <td className="px-4 py-3 text-sm">{month.parts}</td>
                    <td className="px-4 py-3 text-sm">{month.transfers}</td>
                    <td className="px-4 py-3 text-sm">{month.elevators}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="text-green-600 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        +{Math.floor(Math.random() * 20 + 5)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}