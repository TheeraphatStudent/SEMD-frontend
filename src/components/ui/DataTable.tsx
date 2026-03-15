'use client';

import React, { useState, useMemo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pulse } from '@/components/ui';
import { ChevronLeft, ChevronRight, Plus, Filter } from 'lucide-react';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  hidden?: boolean;
  hiddenOnMobile?: boolean;
  render?: (value: any, row: T, index: number) => ReactNode;
}

export interface DataTableFilter {
  label: string;
  value: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyField?: string;
  title?: string;
  titleIcon?: ReactNode;
  variant?: 'full' | 'compact';
  maxHeight?: string;
  showBrowserBar?: boolean;
  browserBarUrl?: string;
  showToolbar?: boolean;
  showPagination?: boolean;
  showFilters?: boolean;
  filters?: DataTableFilter[];
  filterKey?: string;
  animated?: boolean;
  className?: string;
  showLiveDot?: boolean;
  showAddButton?: boolean;
  addButtonLabel?: string;
  onAddClick?: () => void;
  onRowClick?: (row: T, index: number) => void;
  rowBorderColor?: (row: T) => string;
  expandedRowRender?: (row: T) => ReactNode;
  emptyMessage?: string;
  pageSize?: number;
}

const LiveDot: React.FC = () => (
  <Pulse size="sm" variant="success" />
);

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField = 'id',
  title = 'รายการ',
  titleIcon,
  variant = 'full',
  maxHeight = '320px',
  showBrowserBar = false,
  browserBarUrl = 'semd.app/dashboard',
  showToolbar = true,
  showPagination = true,
  showFilters = false,
  filters = [],
  filterKey,
  animated = true,
  className = '',
  showLiveDot = true,
  showAddButton = false,
  addButtonLabel = '+ เพิ่มรายการ',
  onAddClick,
  onRowClick,
  rowBorderColor,
  expandedRowRender,
  emptyMessage = 'ไม่พบข้อมูล',
  pageSize = 10,
}: DataTableProps<T>) {
  const [filter, setFilter] = useState<string>('all');
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    if (filter === 'all' || !filterKey) return data;
    return data.filter(row => row[filterKey] === filter);
  }, [data, filter, filterKey]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 4;
    setIsScrolledToBottom(isAtBottom);
  };

  const toggleRowExpansion = (rowKey: string | number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowKey)) {
      newExpanded.delete(rowKey);
    } else {
      newExpanded.add(rowKey);
    }
    setExpandedRows(newExpanded);
  };

  const handleRowClick = (row: T, index: number) => {
    if (expandedRowRender) {
      toggleRowExpansion(row[keyField]);
    }
    if (onRowClick) {
      onRowClick(row, index);
    }
  };

  const containerClass = variant === 'compact' ? 'max-w-[480px]' : 'max-w-full';
  const visibleColumns = columns.filter(col => !col.hidden);

  const allFilters: DataTableFilter[] = [
    { label: 'ทั้งหมด', value: 'all' },
    ...filters
  ];

  return (
    <div className={`mx-auto bg-white rounded-[18px] border border-gray-primary shadow-xl overflow-hidden ${containerClass} ${className}`}>
      {showBrowserBar && (
        <div className="bg-gray-primary-light px-4 py-[9px] flex items-center gap-2 border-b border-gray-primary">
          <div className="w-[10px] h-[10px] rounded-full bg-danger" />
          <div className="w-[10px] h-[10px] rounded-full bg-warning" />
          <div className="w-[10px] h-[10px] rounded-full bg-safe" />
          <div className="flex-1 bg-white border border-gray-primary rounded-md px-3 py-[3px] text-[11.5px] text-gray-primary-dark font-mono ml-2">
            {browserBarUrl}
          </div>
        </div>
      )}

      {showToolbar && (
        <div className="flex items-center justify-between px-[18px] py-3 border-b border-gray-primary bg-light flex-wrap gap-2">
          <div className="flex items-center gap-[10px]">
            {titleIcon && <span className="text-primary-dark">{titleIcon}</span>}
            <span className="text-[14.5px] font-bold">{title}</span>
            <span className="bg-primary-light text-primary-dark text-[11px] font-bold px-[9px] py-[2px] rounded-full">
              {filteredData.length} รายการ
            </span>
            {showLiveDot && <LiveDot />}
          </div>
          <div className="flex gap-[6px] flex-wrap">
            {showFilters && filters.length > 0 && (
              <>
                {allFilters.map((btn) => (
                  <button
                    key={btn.value}
                    onClick={() => {
                      setFilter(btn.value);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-[5px] rounded-[7px] text-[12px] font-semibold border transition-all cursor-pointer ${
                      filter === btn.value
                        ? 'bg-primary text-dark border-primary'
                        : 'bg-gray-primary-light text-gray-primary-dark border-gray-primary hover:bg-primary hover:text-dark hover:border-primary'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </>
            )}
            {showAddButton && (
              <button 
                onClick={onAddClick}
                className="px-3 py-[5px] rounded-[7px] text-[12px] font-semibold bg-dark text-primary border-dark hover:opacity-90 transition-opacity"
              >
                {addButtonLabel}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="relative">
        <div 
          className="overflow-y-auto"
          onScroll={handleScroll}
          style={{ maxHeight, scrollbarWidth: 'thin', scrollbarColor: '#FFCE69 #FFF6E4' }}
        >
          <table className="w-full border-collapse text-[12.5px]">
            <thead>
              <tr>
                {visibleColumns.map((col) => (
                  <th 
                    key={col.key}
                    className={`bg-primary text-dark px-[14px] py-[9px] font-bold sticky top-0 z-[2] whitespace-nowrap ${
                      col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                    } ${col.hiddenOnMobile ? 'hidden md:table-cell' : ''}`}
                    style={{ width: col.width }}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length} className="px-[14px] py-8 text-center text-gray-primary-0">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => {
                  const rowKey = row[keyField];
                  const isExpanded = expandedRows.has(rowKey);
                  const borderColor = rowBorderColor ? rowBorderColor(row) : '';
                  
                  const RowWrapper = animated ? motion.tr : 'tr';
                  const rowProps = animated ? {
                    initial: { opacity: 0, x: -8 },
                    animate: { opacity: 1, x: 0 },
                    transition: { duration: 0.35, delay: index * 0.055 }
                  } : {};

                  return (
                    <React.Fragment key={rowKey}>
                      <RowWrapper
                        {...rowProps}
                        className={`border-b border-gray-primary-light cursor-pointer transition-colors hover:bg-[#FFFBF0] ${borderColor} ${isExpanded ? 'bg-primary-light' : ''}`}
                        onClick={() => handleRowClick(row, index)}
                      >
                        {visibleColumns.map((col) => (
                          <td 
                            key={col.key}
                            className={`px-[14px] py-[9px] ${
                              col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''
                            } ${col.hiddenOnMobile ? 'hidden md:table-cell' : ''}`}
                          >
                            {col.render 
                              ? col.render(row[col.key], row, index)
                              : row[col.key]
                            }
                          </td>
                        ))}
                      </RowWrapper>
                      
                      {expandedRowRender && (
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.tr
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="bg-primary-light border-t border-dashed border-gray-primary"
                            >
                              <td colSpan={visibleColumns.length} className="p-0">
                                <motion.div
                                  initial={{ opacity: 0, y: -4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="p-[14px_18px]"
                                >
                                  {expandedRowRender(row)}
                                </motion.div>
                              </td>
                            </motion.tr>
                          )}
                        </AnimatePresence>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-11 bg-gradient-to-t from-[rgba(255,246,228,0.9)] to-transparent pointer-events-none"
          animate={{ opacity: isScrolledToBottom ? 0 : [1, 0.25, 1] }}
          transition={{ duration: 2, repeat: isScrolledToBottom ? 0 : Infinity }}
        />
      </div>

      {showPagination && (
        <div className="flex items-center justify-between px-[18px] py-[9px] border-t border-gray-primary bg-light text-[12px] text-gray-primary-dark">
          <span>
            แสดง {((currentPage - 1) * pageSize) + 1}–{Math.min(currentPage * pageSize, filteredData.length)} จาก {filteredData.length} รายการ
          </span>
          <div className="flex gap-1">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-[27px] h-[27px] rounded-md border border-gray-primary bg-white text-[12px] flex items-center justify-center cursor-pointer hover:bg-gray-primary-light disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-[27px] h-[27px] rounded-md border text-[12px] font-bold flex items-center justify-center cursor-pointer ${
                    currentPage === pageNum
                      ? 'border-primary bg-primary text-dark'
                      : 'border-gray-primary bg-white hover:bg-gray-primary-light'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="w-[27px] h-[27px] rounded-md border border-gray-primary bg-white text-[12px] flex items-center justify-center cursor-pointer hover:bg-gray-primary-light disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
