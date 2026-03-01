import { useState, useMemo } from 'react';

export interface UseTableFilterProps<T> {
  data: T[];
  filterKeys?: (keyof T)[];
}

export function useTableFilter<T extends Record<string, any>>({ 
  data, 
  filterKeys 
}: UseTableFilterProps<T>) {
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const filteredData = useMemo(() => {
    if (Object.keys(filters).length === 0) {
      return data;
    }

    return data.filter(item => {
      return Object.entries(filters).every(([key, filterValue]) => {
        if (!filterValue) return true;
        
        const itemValue = item[key];
        
        if (itemValue === null || itemValue === undefined) {
          return false;
        }

        const searchValue = filterValue.toLowerCase();
        const itemString = String(itemValue).toLowerCase();
        
        return itemString.includes(searchValue);
      });
    });
  }, [data, filters]);

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(v => v.length > 0).length;
  }, [filters]);

  return {
    filters,
    filteredData,
    handleFilterChange,
    clearFilters,
    activeFilterCount,
  };
}
