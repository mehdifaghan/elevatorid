import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { MapPin, Building, RefreshCw } from 'lucide-react';
import ProvinceAndCitySelector from '../common/ProvinceAndCitySelector';
import SimpleProvinceAndCitySelector from '../common/SimpleProvinceAndCitySelector';

interface LocationSelection {
  provinceId?: number;
  cityId?: number;
  provinceName?: string;
  cityName?: string;
}

export default function ProvinceAndCitySelectorTest() {
  const [advancedSelection, setAdvancedSelection] = useState<LocationSelection>({});
  const [simpleSelection, setSimpleSelection] = useState<LocationSelection>({});
  const [horizontalSelection, setHorizontalSelection] = useState<LocationSelection>({});

  const resetAll = () => {
    setAdvancedSelection({});
    setSimpleSelection({});
    setHorizontalSelection({});
  };

  const presetTehran = () => {
    const tehranSelection = {
      provinceId: 8,
      cityId: 98,
      provinceName: 'تهران',
      cityName: 'تهران'
    };
    setAdvancedSelection(tehranSelection);
    setSimpleSelection(tehranSelection);
    setHorizontalSelection(tehranSelection);
  };

  const presetIsfahan = () => {
    const isfahanSelection = {
      provinceId: 4,
      cityId: 43,
      provinceName: 'اصفهان',
      cityName: 'اصفهان'
    };
    setAdvancedSelection(isfahanSelection);
    setSimpleSelection(isfahanSelection);
    setHorizontalSelection(isfahanSelection);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <MapPin className="w-8 h-8 text-primary" />
          <h1>انتخابگر استان و شهر ایران</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          کامپوننت‌های مختلف برای انتخاب استان و شهرهای ایران با قابلیت جستجو و نمایش زیبا
        </p>
        
        <div className="flex justify-center gap-2 flex-wrap">
          <Button onClick={presetTehran} variant="outline" size="sm">
            <Building className="w-4 h-4 mr-2" />
            تهران
          </Button>
          <Button onClick={presetIsfahan} variant="outline" size="sm">
            <Building className="w-4 h-4 mr-2" />
            اصفهان
          </Button>
          <Button onClick={resetAll} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            پاک کردن همه
          </Button>
        </div>
      </div>

      {/* Advanced Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            انتخابگر پیشرفته (با جستجو)
          </CardTitle>
          <CardDescription>
            شامل جستجو، نمایش تعداد شهرها، و خلاصه انتخاب
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProvinceAndCitySelector
            value={advancedSelection}
            onChange={setAdvancedSelection}
            required
            showSearch
            placeholder={{
              province: 'استان مورد نظر را جستجو کنید...',
              city: 'شهر مورد نظر را جستجو کنید...'
            }}
          />
          
          {/* Selection Output */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">خروجی انتخاب:</h4>
            <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
              {JSON.stringify(advancedSelection, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Simple Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            انتخابگر ساده
          </CardTitle>
          <CardDescription>
            نسخه ساده‌تر بدون جستجو، فقط با dropdown معمولی
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SimpleProvinceAndCitySelector
            value={simpleSelection}
            onChange={setSimpleSelection}
            required
          />
          
          {/* Selection Output */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">خروجی انتخاب:</h4>
            <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
              {JSON.stringify(simpleSelection, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Horizontal Layout */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            چیدمان افقی
          </CardTitle>
          <CardDescription>
            نمایش استان و شهر در کنار هم (در صفحات بزرگ)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProvinceAndCitySelector
            value={horizontalSelection}
            onChange={setHorizontalSelection}
            layout="horizontal"
            showSearch
          />
          
          {/* Selection Output */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">خروجی انتخاب:</h4>
            <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
              {JSON.stringify(horizontalSelection, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>آمار کامل</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">31</div>
              <div className="text-sm text-muted-foreground">استان</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">419+</div>
              <div className="text-sm text-muted-foreground">شهر</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">پوشش ایران</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>نحوه استفاده</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">کامپوننت پیشرفته:</h4>
            <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
{`<ProvinceAndCitySelector
  value={{ provinceId: 8, cityId: 98 }}
  onChange={(selection) => console.log(selection)}
  required
  showSearch
  layout="horizontal"
/>`}
            </pre>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">کامپوننت ساده:</h4>
            <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
{`<SimpleProvinceAndCitySelector
  value={{ provinceId: 4, cityId: 43 }}
  onChange={(selection) => console.log(selection)}
  required
/>`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}