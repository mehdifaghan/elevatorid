import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Building, Package, Plus } from 'lucide-react';
import CategoryList from './CategoryList';
import ElevatorCategoryManagement from './ElevatorCategoryManagement';

export default function CombinedCategoryManagement() {
  const [activeTab, setActiveTab] = useState('parts');
  const [triggerPartsDialog, setTriggerPartsDialog] = useState(false);
  const [triggerElevatorDialog, setTriggerElevatorDialog] = useState(false);

  const handleAddPartsCategory = () => {
    setActiveTab('parts');
    setTriggerPartsDialog(true);
    // Reset trigger after a short delay to allow the component to respond
    setTimeout(() => setTriggerPartsDialog(false), 100);
  };

  const handleAddElevatorCategory = () => {
    setActiveTab('elevators');
    setTriggerElevatorDialog(true);
    // Reset trigger after a short delay to allow the component to respond
    setTimeout(() => setTriggerElevatorDialog(false), 100);
  };

  return (
    <div className="container mx-auto p-6 space-y-6" style={{ direction: 'rtl' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
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
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handleAddPartsCategory}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white"
          >
            <Plus className="w-4 h-4" />
            دسته‌بندی قطعات جدید
          </Button>
          <Button
            onClick={handleAddElevatorCategory}
            variant="outline"
            className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Plus className="w-4 h-4" />
            نوع آسانسور جدید
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-gray-700" />
              <div>
                <p className="text-sm text-gray-600">دسته‌بندی قطعات</p>
                <p className="text-xl text-gray-900">-</p>
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
                <p className="text-xl text-gray-900">2</p>
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
                <p className="text-xl text-gray-900">-</p>
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
                <p className="text-xl text-gray-900">-</p>
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
              <CategoryList triggerDialog={triggerPartsDialog} />
            </TabsContent>
            
            <TabsContent value="elevators" className="mt-6">
              <ElevatorCategoryManagement triggerDialog={triggerElevatorDialog} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}