import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { AlertCircle, CalendarIcon, Check, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { cn } from '../../lib/utils';
import { PersianDatePicker } from './PersianDatePicker';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: (value: any) => string | null;
  };
  description?: string;
  width?: 'full' | 'half' | 'third';
  disabled?: boolean;
  defaultValue?: any;
}

export interface FormSection {
  title?: string;
  description?: string;
  fields: FormField[];
}

interface FormBuilderProps {
  sections: FormSection[];
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
  showProgress?: boolean;
  rtl?: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export default function FormBuilder({
  sections,
  onSubmit,
  submitLabel = 'ثبت',
  cancelLabel = 'انصراف',
  onCancel,
  loading = false,
  className = '',
  showProgress = false,
  rtl = true
}: FormBuilderProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [currentSection, setCurrentSection] = useState(0);

  // Initialize form data with default values
  useEffect(() => {
    const initialData: Record<string, any> = {};
    sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.defaultValue !== undefined) {
          initialData[field.name] = field.defaultValue;
        } else if (field.type === 'checkbox') {
          initialData[field.name] = false;
        } else if (field.type === 'select' || field.type === 'radio') {
          // Use undefined to allow placeholder to show properly
          initialData[field.name] = undefined;
        } else {
          initialData[field.name] = '';
        }
      });
    });
    setFormData(initialData);
  }, [sections]);

  const validateField = (field: FormField, value: any): string | null => {
    // Required validation
    if (field.required && (value === undefined || value === null || value === '' || (typeof value === 'string' && value.trim() === ''))) {
      return `${field.label} الزامی است`;
    }

    if (value === undefined || value === null || value === '' || (typeof value === 'string' && value.trim() === '')) {
      return null; // Empty non-required field is valid
    }

    const validation = field.validation;
    if (!validation) return null;

    // Pattern validation
    if (validation.pattern && typeof value === 'string' && !validation.pattern.test(value)) {
      return `فرمت ${field.label} صحیح نیست`;
    }

    // Length validation
    if (validation.minLength && typeof value === 'string' && value.length < validation.minLength) {
      return `${field.label} باید حداقل ${validation.minLength} کاراکتر باشد`;
    }

    if (validation.maxLength && typeof value === 'string' && value.length > validation.maxLength) {
      return `${field.label} باید حداکثر ${validation.maxLength} کاراکتر باشد`;
    }

    // Number validation
    if (field.type === 'number') {
      const numValue = Number(value);
      if (validation.min !== undefined && numValue < validation.min) {
        return `${field.label} باید حداقل ${validation.min} باشد`;
      }
      if (validation.max !== undefined && numValue > validation.max) {
        return `${field.label} باید حداکثر ${validation.max} باشد`;
      }
    }

    // Custom validation
    if (validation.custom) {
      return validation.custom(value);
    }

    return null;
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Real-time validation
    const field = sections.flatMap(s => s.fields).find(f => f.name === fieldName);
    if (field) {
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error || ''
      }));
    }
  };

  const handleFieldBlur = (fieldName: string) => {
    setTouchedFields(prev => new Set(prev).add(fieldName));
  };

  const validateAllFields = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    sections.forEach(section => {
      section.fields.forEach(field => {
        const error = validateField(field, formData[field.name]);
        if (error) {
          newErrors[field.name] = error;
          isValid = false;
        }
      });
    });

    setErrors(newErrors);
    setTouchedFields(new Set(Object.keys(newErrors)));
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAllFields()) {
      toast.error('لطفاً خطاهای فرم را برطرف کنید');
      return;
    }

    try {
      await onSubmit(formData);
      toast.success('اطلاعات با موفقیت ثبت شد');
    } catch (error) {
      toast.error('خطا در ثبت اطلاعات');
    }
  };

  const renderField = (field: FormField) => {
    const hasError = touchedFields.has(field.name) && errors[field.name];
    const isValid = touchedFields.has(field.name) && !errors[field.name] && formData[field.name];

    const fieldClasses = cn(
      "relative",
      field.width === 'half' && 'col-span-1 md:col-span-1',
      field.width === 'third' && 'col-span-1 md:col-span-1 lg:col-span-1',
      field.width === 'full' && 'col-span-full'
    );

    const inputClasses = cn(
      hasError && "border-destructive focus:border-destructive",
      isValid && "border-green-500 focus:border-green-500",
      field.disabled && "opacity-60 cursor-not-allowed"
    );

    return (
      <div key={field.name} className={fieldClasses}>
        <div className="space-y-2">
          <Label htmlFor={field.name} className="flex items-center gap-2">
            {field.label}
            {field.required && <span className="text-destructive">*</span>}
            {isValid && <Check className="h-4 w-4 text-green-500" />}
            {hasError && <AlertCircle className="h-4 w-4 text-destructive" />}
          </Label>

          {field.type === 'text' || field.type === 'email' || field.type === 'password' || field.type === 'tel' || field.type === 'number' ? (
            <Input
              id={field.name}
              type={field.type}
              value={formData[field.name] || ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              onBlur={() => handleFieldBlur(field.name)}
              placeholder={field.placeholder}
              disabled={field.disabled || loading}
              className={inputClasses}
              dir={field.type === 'tel' || field.type === 'email' ? 'ltr' : rtl ? 'rtl' : 'ltr'}
            />
          ) : field.type === 'textarea' ? (
            <Textarea
              id={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              onBlur={() => handleFieldBlur(field.name)}
              placeholder={field.placeholder}
              disabled={field.disabled || loading}
              className={inputClasses}
              rows={4}
            />
          ) : field.type === 'select' ? (
            <Select
              value={formData[field.name] || undefined}
              onValueChange={(value) => handleFieldChange(field.name, value)}
              disabled={field.disabled || loading}
            >
              <SelectTrigger className={inputClasses}>
                <SelectValue placeholder={field.placeholder || 'انتخاب کنید'} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : field.type === 'checkbox' ? (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.name}
                checked={formData[field.name] || false}
                onCheckedChange={(checked) => handleFieldChange(field.name, checked)}
                disabled={field.disabled || loading}
              />
              <Label 
                htmlFor={field.name} 
                className="text-sm font-normal cursor-pointer"
              >
                {field.placeholder}
              </Label>
            </div>
          ) : field.type === 'radio' ? (
            <RadioGroup
              value={formData[field.name] || undefined}
              onValueChange={(value) => handleFieldChange(field.name, value)}
              disabled={field.disabled || loading}
            >
              {field.options?.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${field.name}-${option.value}`} />
                  <Label htmlFor={`${field.name}-${option.value}`} className="font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : field.type === 'date' ? (
            <PersianDatePicker
              value={formData[field.name] || ''}
              onChange={(date) => handleFieldChange(field.name, date)}
              placeholder={field.placeholder || 'انتخاب تاریخ'}
              disabled={field.disabled || loading}
            />
          ) : field.type === 'file' ? (
            <Input
              id={field.name}
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                handleFieldChange(field.name, file);
              }}
              onBlur={() => handleFieldBlur(field.name)}
              disabled={field.disabled || loading}
              className={inputClasses}
            />
          ) : null}

          {field.description && (
            <p className="text-xs text-muted-foreground">{field.description}</p>
          )}

          {hasError && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors[field.name]}
            </p>
          )}
        </div>
      </div>
    );
  };

  const totalFields = sections.reduce((acc, section) => acc + section.fields.length, 0);
  const completedFields = Object.keys(formData).filter(key => {
    const value = formData[key];
    return value !== '' && value !== null && value !== undefined && value !== false;
  }).length;
  const progress = (completedFields / totalFields) * 100;

  return (
    <form onSubmit={handleSubmit} className={`space-y-8 ${className}`}>
      {showProgress && sections.length > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">پیشرفت تکمیل فرم</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {sections.map((section, sectionIndex) => (
        <Card key={sectionIndex}>
          {(section.title || section.description) && (
            <CardHeader>
              {section.title && <CardTitle>{section.title}</CardTitle>}
              {section.description && (
                <p className="text-muted-foreground">{section.description}</p>
              )}
            </CardHeader>
          )}
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.fields.map(renderField)}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex items-center justify-end gap-4">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={loading}
          className="min-w-24"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
              در حال ثبت...
            </div>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}

// Helper function to create common field patterns
export const createField = (
  name: string,
  label: string,
  type: FormField['type'],
  options?: Partial<FormField>
): FormField => ({
  name,
  label,
  type,
  ...options
});

// Common validation patterns
export const validationPatterns = {
  mobile: /^09\d{9}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  nationalId: /^\d{10}$/,
  postalCode: /^\d{10}$/,
  persianText: /^[\u0600-\u06FF\s]+$/,
  englishText: /^[a-zA-Z\s]+$/,
  alphaNumeric: /^[a-zA-Z0-9]+$/
};