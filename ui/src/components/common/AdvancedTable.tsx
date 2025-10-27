import React, { useState, useMemo } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  FileText,
  FileSpreadsheet,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
}

export interface TableFilter {
  key: string;
  value: string;
  label: string;
}

interface AdvancedTableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export default function AdvancedTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = true,
  filterable = true,
  exportable = true,
  pagination = true,
  pageSize = 10,
  onRowClick,
  loading = false,
  emptyMessage = 'هیچ داده‌ای یافت نشد',
  className = '',
  onRefresh,
  refreshing = false
}: AdvancedTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(item =>
        columns.some(column => {
          const value = item[column.key];
          return value && 
                 value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(item => {
          const itemValue = item[key];
          return itemValue && itemValue.toString() === value;
        });
      }
    });

    return filtered;
  }, [data, searchTerm, filters, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;
      
      const result = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? result : -result;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key: string) => {
    const column = columns.find(col => col.key === key);
    if (!column?.sortable) return;

    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
  };

  const handleFilter = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const handleExport = (format: 'csv' | 'json') => {
    if (format === 'csv') {
      const headers = columns.map(col => col.label).join(',');
      const rows = sortedData.map(item =>
        columns.map(col => {
          const value = item[col.key];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value || '';
        }).join(',')
      );
      
      const csvContent = [headers, ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `data-${Date.now()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('فایل CSV دانلود شد');
    } else {
      const jsonContent = JSON.stringify(sortedData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `data-${Date.now()}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('فایل JSON دانلود شد');
    }
  };

  const renderSortIcon = (column: TableColumn) => {
    if (!column.sortable || !sortConfig || sortConfig.key !== column.key) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400 ml-1" />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-4 w-4 text-blue-600 ml-1" />
      : <ArrowDown className="h-4 w-4 text-blue-600 ml-1" />;
  };

  const getUniqueValues = (key: string) => {
    const values = data.map(item => item[key]).filter(Boolean);
    return [...new Set(values)];
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex flex-col space-y-4">
          {/* Search and Export Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {searchable && (
              <div className="flex items-center gap-2 flex-1 max-w-lg">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="جستجو در داده‌ها..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
                {onRefresh && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={onRefresh}
                    disabled={refreshing}
                    className="gap-2 shrink-0"
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? 'در حال بارگذاری...' : 'تازه‌سازی'}
                  </Button>
                )}
              </div>
            )}
            
            {exportable && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExport('csv')}
                  className="gap-2"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  CSV
                </Button>
              </div>
            )}
          </div>

          {/* Filters */}
          {filterable && (
            <div className="flex flex-wrap gap-4">
              {columns.filter(col => col.filterable).map(column => (
                <div key={column.key} className="min-w-32">
                  <Select 
                    value={filters[column.key] || 'all'} 
                    onValueChange={(value) => handleFilter(column.key, value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder={column.label} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه {column.label}</SelectItem>
                      {getUniqueValues(column.key).map(value => (
                        <SelectItem key={value} value={value.toString()}>
                          {value.toString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead 
                      key={column.key}
                      className={`text-right ${column.sortable ? 'cursor-pointer select-none hover:bg-gray-50' : ''} ${column.width ? `w-${column.width}` : ''}`}
                      onClick={() => handleSort(column.key)}
                    >
                      <div className="flex items-center justify-end flex-row-reverse">
                        {column.label}
                        {column.sortable && renderSortIcon(column)}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell 
                      colSpan={columns.length} 
                      className="text-center py-8"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span>در حال بارگذاری...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={columns.length} 
                      className="text-center py-8 text-muted-foreground"
                    >
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item, index) => (
                    <TableRow 
                      key={index}
                      className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                      onClick={() => onRowClick?.(item)}
                    >
                      {columns.map((column) => (
                        <TableCell key={column.key} className="text-right">
                          {column.render 
                            ? column.render(item[column.key], item)
                            : item[column.key]
                          }
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {pagination && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              نمایش {((currentPage - 1) * pageSize) + 1} تا {Math.min(currentPage * pageSize, sortedData.length)} از {sortedData.length} رکورد
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-sm font-medium px-2">
                صفحه {currentPage} از {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}