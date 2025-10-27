import React, { useState, useEffect } from 'react';
import { MapPin, Building } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { cn } from '../../lib/utils';
import { 
  iranProvincesAndCities, 
  Province, 
  City, 
  getCitiesByProvinceId 
} from '../../lib/iran-provinces-cities';

interface SimpleProvinceAndCitySelectorProps {
  value?: {
    provinceId?: number;
    cityId?: number;
  };
  onChange: (selection: { provinceId?: number; cityId?: number; provinceName?: string; cityName?: string }) => void;
  disabled?: boolean;
  required?: boolean;
  placeholder?: {
    province?: string;
    city?: string;
  };
  className?: string;
  layout?: 'horizontal' | 'vertical';
}

export default function SimpleProvinceAndCitySelector({
  value,
  onChange,
  disabled = false,
  required = false,
  placeholder = {
    province: 'استان را انتخاب کنید',
    city: 'شهر را انتخاب کنید'
  },
  className,
  layout = 'vertical'
}: SimpleProvinceAndCitySelectorProps) {
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | undefined>(value?.provinceId);
  const [selectedCityId, setSelectedCityId] = useState<number | undefined>(value?.cityId);

  // Initialize from value prop
  useEffect(() => {
    setSelectedProvinceId(value?.provinceId);
    setSelectedCityId(value?.cityId);
  }, [value]);

  const handleProvinceChange = (provinceId: string) => {
    const id = parseInt(provinceId);
    const province = iranProvincesAndCities.find(p => p.id === id);
    
    setSelectedProvinceId(id);
    setSelectedCityId(undefined); // Reset city when province changes
    
    onChange({
      provinceId: id,
      provinceName: province?.name,
      cityId: undefined,
      cityName: undefined
    });
  };

  const handleCityChange = (cityId: string) => {
    const id = parseInt(cityId);
    const availableCities = selectedProvinceId ? getCitiesByProvinceId(selectedProvinceId) : [];
    const city = availableCities.find(c => c.id === id);
    const province = iranProvincesAndCities.find(p => p.id === selectedProvinceId);
    
    setSelectedCityId(id);
    
    onChange({
      provinceId: selectedProvinceId,
      provinceName: province?.name,
      cityId: id,
      cityName: city?.name
    });
  };

  const availableCities = selectedProvinceId ? getCitiesByProvinceId(selectedProvinceId) : [];

  const containerClasses = cn(
    "space-y-4",
    layout === 'horizontal' && "lg:flex lg:space-y-0 lg:space-x-4 lg:space-x-reverse",
    className
  );

  const fieldClasses = cn(
    "space-y-2",
    layout === 'horizontal' && "lg:flex-1"
  );

  return (
    <div className={containerClasses}>
      {/* Province Selector */}
      <div className={fieldClasses}>
        <Label className="flex items-center gap-2">
          <Building className="w-4 h-4" />
          استان
          {required && <span className="text-red-500">*</span>}
        </Label>
        
        <Select
          value={selectedProvinceId?.toString() || ""}
          onValueChange={handleProvinceChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-full h-10">
            <SelectValue placeholder={placeholder.province} />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {iranProvincesAndCities.map((province) => (
              <SelectItem key={province.id} value={province.id.toString()}>
                <div className="flex items-center justify-between w-full">
                  <span className="flex-1 text-right">{province.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {province.cities.length} شهر
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City Selector */}
      <div className={fieldClasses}>
        <Label className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          شهر
          {required && <span className="text-red-500">*</span>}
        </Label>
        
        <Select
          value={selectedCityId?.toString() || ""}
          onValueChange={handleCityChange}
          disabled={!selectedProvinceId || disabled}
        >
          <SelectTrigger className={cn(
            "w-full h-10",
            !selectedProvinceId && "opacity-50"
          )}>
            <SelectValue placeholder={selectedProvinceId ? placeholder.city : "ابتدا استان را انتخاب کنید"} />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {availableCities.map((city) => (
              <SelectItem key={city.id} value={city.id.toString()}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Selection Display */}
      {(selectedProvinceId || selectedCityId) && (
        <div className="text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>انتخاب شده:</span>
            {selectedProvinceId && (
              <span className="font-medium">
                {iranProvincesAndCities.find(p => p.id === selectedProvinceId)?.name}
              </span>
            )}
            {selectedCityId && (
              <>
                <span>،</span>
                <span className="font-medium">
                  {availableCities.find(c => c.id === selectedCityId)?.name}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}