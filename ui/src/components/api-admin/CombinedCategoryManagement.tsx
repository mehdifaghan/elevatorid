import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Skeleton } from '../ui/skeleton';
import { Building, Package, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { realApiRequest, RealApiError } from '../../lib/real-api-client';
import CategoryList from './CategoryList';
import ElevatorCategoryManagement from './ElevatorCategoryManagement';

interface CategoryStats {
  partsCategories: number;
  elevatorTypes: number;
  activeItems: number;
  totalManagement: number;
}

export default function CombinedCategoryManagement() {
  const [activeTab, setActiveTab] = useState('parts');
  const [stats, setStats] = useState<CategoryStats>({
    partsCategories: 0,
    elevatorTypes: 0,
    activeItems: 0,
    totalManagement: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [apiError, setApiError] = useState<RealApiError | null>(null);
  const [isApiAvailable, setIsApiAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    checkApiAvailability();
    fetchStats();
  }, []);

  const checkApiAvailability = async () => {
    try {
      const isAvailable = await realApiRequest.checkApiStatus();
      setIsApiAvailable(isAvailable);
      if (!isAvailable) {
        setApiError({
          isNetworkError: true,
          isAuthError: false,
          isServerError: false,
          message: 'API در دسترس نیست'
        });
      }
    } catch (error) {
      setIsApiAvailable(false);
      setApiError({
        isNetworkError: true,
        isAuthError: false,
        isServerError: false,
        message: 'عدم دسترسی به سرور'
      });
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      setApiError(null);

      // Fetch both parts categories and elevator types stats in parallel
      const [partsResponse, elevatorsResponse] = await Promise.allSettled([
        realApiRequest.get('/admin/parts-categories'),
        realApiRequest.get('/admin/elevator-types')
      ]);

      let partsCount = 0;
      let elevatorsCount = 0;
      let activeItems = 0;

      // Process parts categories response
      if (partsResponse.status === 'fulfilled') {
        const partsData = partsResponse.value;
        const partsList = partsData.categories || partsData.parts_categories || partsData.data || [];
        partsCount = Array.isArray(partsList) ? partsList.length : 0;
        activeItems += Array.isArray(partsList) ? partsList.filter((item: any) => item.is_active !== false && item.isActive !== false).length : 0;
      }

      // Process elevator types response
      if (elevatorsResponse.status === 'fulfilled') {
        const elevatorsData = elevatorsResponse.value;
        const elevatorsList = elevatorsData.elevator_types || elevatorsData.elevatorTypes || elevatorsData.data || [];
        elevatorsCount = Array.isArray(elevatorsList) ? elevatorsList.length : 0;
        activeItems += Array.isArray(elevatorsList) ? elevatorsList.filter((item: any) => item.is_active !== false && item.isActive !== false).length : 0;
      }

      setStats({
        partsCategories: partsCount,
        elevatorTypes: elevatorsCount,
        activeItems: activeItems,
        totalManagement: partsCount + elevatorsCount
      });

      setIsApiAvailable(true);

      // Show warnings if some requests failed
      if (partsResponse.status === 'rejected' || elevatorsResponse.status === 'rejected') {
        toast.warning('برخی اطلاعات آمار قابل دسترسی نیست');
      }

    } catch (error) {
      console.error('Error fetching category stats:', error);
      setApiError(error as RealApiError);
      setIsApiAvailable(false);
      
      // Set default stats on error
      setStats({
        partsCategories: 0,
        elevatorTypes: 0,
        activeItems: 0,
        totalManagement: 0
      });

      if (error && typeof error === 'object' && 'isNetworkError' in error) {
        const apiError = error as RealApiError;
        if (apiError.isNetworkError) {
          toast.error('عدم دسترسی به سرور');
        } else if (apiError.isAuthError) {
          toast.error('خطای احراز هویت');
        } else {
          toast.error('خطا در دریافت آمار دسته‌بندی‌ها');
        }
      }
    } finally {
      setStatsLoading(false);
    }
  };



  return (
    <div className="container mx-auto p-6 space-y-6" style={{ direction: 'rtl' }}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6 text-gray-900" />
          <Building className="w-6 h-6 text-gray-900" />
        </div>
        <div>
          <h1 className="text-2xl text-gray-900">مدیریت دسته‌بندی‌ها</h1>
          <p className="text-gray-600">مدیریت دسته‌بندی قطعات و انواع آسانسور</p>
        </div>
      </div>

      {/* API Status Alert */}
      {apiError && !statsLoading && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">خطا در اتصال به API:</span> {apiError.message}
              </div>
              <div className="flex items-center gap-2">
                {isApiAvailable === false ? (
                  <WifiOff className="w-4 h-4 text-red-500" />
                ) : (
                  <Wifi className="w-4 h-4 text-green-500" />
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    checkApiAvailability();
                    fetchStats();
                  }}
                  className="text-orange-700 border-orange-300 hover:bg-orange-100"
                >
                  تلاش مجدد
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-gray-700" />
              <div>
                <p className="text-sm text-gray-600">دسته‌بندی قطعات</p>
                {statsLoading ? (
                  <Skeleton className="h-6 w-8" />
                ) : (
                  <p className="text-xl text-gray-900">{stats.partsCategories}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Building className="w-8 h-8 text-gray-700" />
              <div>
                <p className="text-sm text-gray-600">انواع آسانسور</p>
                {statsLoading ? (
                  <Skeleton className="h-6 w-8" />
                ) : (
                  <p className="text-xl text-gray-900">{stats.elevatorTypes}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl text-gray-700">⚡</span>
              <div>
                <p className="text-sm text-gray-600">موارد فعال</p>
                {statsLoading ? (
                  <Skeleton className="h-6 w-8" />
                ) : (
                  <p className="text-xl text-gray-900">{stats.activeItems}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl text-gray-700">📊</span>
              <div>
                <p className="text-sm text-gray-600">کل مدیریت‌ها</p>
                {statsLoading ? (
                  <Skeleton className="h-6 w-8" />
                ) : (
                  <p className="text-xl text-gray-900">{stats.totalManagement}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Card className="border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <span className="text-gray-700">📋</span>
            مدیریت دسته‌بندی‌ها
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" style={{ direction: 'rtl' }}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-100">
              <TabsTrigger value="parts" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900">
                <Package className="w-4 h-4" />
                دسته‌بندی قطعات
              </TabsTrigger>
              <TabsTrigger value="elevators" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900">
                <Building className="w-4 h-4" />
                انواع آسانسور
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="parts" className="mt-6">
              <CategoryList 
                onStatsChange={fetchStats}
                apiError={apiError}
                isApiAvailable={isApiAvailable}
              />
            </TabsContent>
            
            <TabsContent value="elevators" className="mt-6">
              <ElevatorCategoryManagement 
                onStatsChange={fetchStats}
                apiError={apiError}
                isApiAvailable={isApiAvailable}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}