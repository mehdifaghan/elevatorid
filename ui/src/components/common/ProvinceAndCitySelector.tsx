import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';
import { 
  iranProvincesAndCities, 
  Province, 
  City, 
  getCitiesByProvinceId,
  searchProvinces,
  searchCities 
} from '../../lib/iran-provinces-cities';

interface ProvinceAndCitySelectorProps {
  value?: {
    provinceId?: number;
    cityId?: number;
  };
  onChange: (selection: { provinceId?: number; cityId?: number; provinceName?: string; cityName?: string }) => void;
  disabled?: boolean;
  required?: boolean;
  showSearch?: boolean;
  placeholder?: {
    province?: string;
    city?: string;
  };
  className?: string;
  layout?: 'horizontal' | 'vertical';
}

export default function ProvinceAndCitySelector({
  value,
  onChange,
  disabled = false,
  required = false,
  showSearch = true,
  placeholder = {
    province: 'استان را انتخاب کنید',
    city: 'شهر را انتخاب کنید'
  },
  className,
  layout = 'vertical'
}: ProvinceAndCitySelectorProps) {
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [provinceSearch, setProvinceSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [provinceOpen, setProvinceOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  // Initialize from value prop
  useEffect(() => {
    if (value?.provinceId) {
      const province = iranProvincesAndCities.find(p => p.id === value.provinceId);
      if (province) {
        setSelectedProvince(province);
        
        if (value.cityId) {
          const city = province.cities.find(c => c.id === value.cityId);
          if (city) {
            setSelectedCity(city);
          }
        }
      }
    }
  }, [value]);

  const handleProvinceSelect = (province: Province) => {
    setSelectedProvince(province);
    setSelectedCity(null); // Reset city when province changes
    setProvinceOpen(false);
    setProvinceSearch('');
    
    onChange({
      provinceId: province.id,
      provinceName: province.name,
      cityId: undefined,
      cityName: undefined
    });
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setCityOpen(false);
    setCitySearch('');
    
    onChange({
      provinceId: selectedProvince?.id,
      provinceName: selectedProvince?.name,
      cityId: city.id,
      cityName: city.name
    });
  };

  const handleClearSelection = () => {
    setSelectedProvince(null);
    setSelectedCity(null);
    onChange({});
  };

  const filteredProvinces = showSearch && provinceSearch 
    ? searchProvinces(provinceSearch)
    : iranProvincesAndCities;

  const availableCities = selectedProvince ? selectedProvince.cities : [];
  const filteredCities = showSearch && citySearch
    ? availableCities.filter(city => 
        city.name.toLowerCase().includes(citySearch.toLowerCase())
      )
    : availableCities;

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
        
        <Popover open={provinceOpen} onOpenChange={setProvinceOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={provinceOpen}
              className={cn(
                "w-full justify-between text-right h-10",
                !selectedProvince && "text-muted-foreground",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              disabled={disabled}
            >
              <span className="flex-1 text-right truncate">
                {selectedProvince ? selectedProvince.name : placeholder.province}
              </span>
              <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command className="w-full">
              {showSearch && (
                <CommandInput
                  placeholder="جستجوی استان..."
                  value={provinceSearch}
                  onValueChange={setProvinceSearch}
                  className="text-right"
                />
              )}
              <CommandEmpty>استانی یافت نشد.</CommandEmpty>
              <CommandGroup className="max-h-60 overflow-auto">
                {filteredProvinces.map((province) => (
                  <CommandItem
                    key={province.id}
                    value={province.name}
                    onSelect={() => handleProvinceSelect(province)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex-1 text-right">{province.name}</span>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {province.cities.length} شهر
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* City Selector */}
      <div className={fieldClasses}>
        <Label className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          شهر
          {required && <span className="text-red-500">*</span>}
        </Label>
        
        <Popover open={cityOpen} onOpenChange={setCityOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={cityOpen}
              className={cn(
                "w-full justify-between text-right h-10",
                !selectedCity && "text-muted-foreground",
                (!selectedProvince || disabled) && "opacity-50 cursor-not-allowed"
              )}
              disabled={!selectedProvince || disabled}
            >
              <span className="flex-1 text-right truncate">
                {selectedCity ? selectedCity.name : placeholder.city}
              </span>
              <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command className="w-full">
              {showSearch && (
                <CommandInput
                  placeholder="جستجوی شهر..."
                  value={citySearch}
                  onValueChange={setCitySearch}
                  className="text-right"
                />
              )}
              <CommandEmpty>
                {availableCities.length === 0 
                  ? "ابتدا استان را انتخاب کنید" 
                  : "شهری یافت نشد."
                }
              </CommandEmpty>
              <CommandGroup className="max-h-60 overflow-auto">
                {filteredCities.map((city) => (
                  <CommandItem
                    key={city.id}
                    value={city.name}
                    onSelect={() => handleCitySelect(city)}
                    className="flex items-center justify-end cursor-pointer"
                  >
                    <span className="text-right">{city.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Clear Selection Button */}
      {(selectedProvince || selectedCity) && (
        <div className="flex justify-start">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSelection}
            className="text-muted-foreground hover:text-foreground"
            disabled={disabled}
          >
            پاک کردن انتخاب
          </Button>
        </div>
      )}

      {/* Selection Summary */}
      {(selectedProvince || selectedCity) && (
        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>انتخاب شده:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedProvince && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Building className="w-3 h-3" />
                {selectedProvince.name}
              </Badge>
            )}
            {selectedCity && (
              <Badge variant="default" className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {selectedCity.name}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}