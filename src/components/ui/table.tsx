'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  onFilterChange?: (filters: Record<string, string>) => void;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, onFilterChange, ...props }, ref) => {
    return (
      <div className="w-full overflow-auto rounded-lg border border-gray-primary-1">
        <table
          ref={ref}
          className={cn('w-full text-sm', className)}
          {...props}
        />
      </div>
    );
  }
);

Table.displayName = 'Table';

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => {
    return (
      <thead
        ref={ref}
        className={cn('bg-primary-light border-b border-gray-primary-1', className)}
        {...props}
      />
    );
  }
);

TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => {
    return (
      <tbody
        ref={ref}
        className={cn('[&_tr:last-child]:border-0', className)}
        {...props}
      />
    );
  }
);

TableBody.displayName = 'TableBody';

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          'border-b border-gray-primary-1 transition-colors',
          'hover:bg-gray-primary-2 data-[state=selected]:bg-primary-light',
          className
        )}
        {...props}
      />
    );
  }
);

TableRow.displayName = 'TableRow';

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  filterable?: boolean;
  filterKey?: string;
  onFilterChange?: (key: string, value: string) => void;
}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, filterable = false, filterKey, onFilterChange, children, ...props }, ref) => {
    const [filterValue, setFilterValue] = useState('');
    const [showFilter, setShowFilter] = useState(false);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFilterValue(value);
      if (onFilterChange && filterKey) {
        onFilterChange(filterKey, value);
      }
    };

    return (
      <th
        ref={ref}
        className={cn(
          'h-12 px-4 text-left align-middle font-bold text-dark',
          '[&:has([role=checkbox])]:pr-0',
          filterable && 'cursor-pointer select-none',
          className
        )}
        {...props}
      >
        <div className="space-y-2">
          <div 
            className="flex items-center gap-2"
            onClick={() => filterable && setShowFilter(!showFilter)}
          >
            {children}
            {filterable && (
              <Search 
                size={14} 
                className={cn(
                  'transition-colors',
                  showFilter ? 'text-primary' : 'text-gray-primary-0'
                )}
              />
            )}
          </div>
          
          {filterable && showFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <input
                type="text"
                value={filterValue}
                onChange={handleFilterChange}
                onClick={(e) => e.stopPropagation()}
                placeholder="ค้นหา..."
                className={cn(
                  'w-full px-2 py-1 text-xs font-normal',
                  'border border-gray-primary-1 rounded',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                  'bg-light text-dark placeholder:text-gray-primary-0'
                )}
              />
            </motion.div>
          )}
        </div>
      </th>
    );
  }
);

TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={cn(
          'p-4 align-middle text-gray-primary-0',
          '[&:has([role=checkbox])]:pr-0',
          className
        )}
        {...props}
      />
    );
  }
);

TableCell.displayName = 'TableCell';
