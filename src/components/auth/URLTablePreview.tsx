'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui';
import { DataTable, DataTableColumn } from '@/components/ui/DataTable';
import { mockRows, reporterColors } from '@/libs/utils/mockData';
import { URLRow } from '@/libs/utils/row';
import { Verdict } from '@/libs/utils/types';

interface URLTablePreviewProps {
  variant?: 'full' | 'compact';
  maxHeight?: string;
  showBrowserBar?: boolean;
  showToolbar?: boolean;
  showPagination?: boolean;
  showFilters?: boolean;
  animated?: boolean;
  className?: string;
  data?: URLRow[];
  title?: string;
  onAddClick?: () => void;
}

const verdictLabels: Record<Verdict, string> = {
  Benign: 'Benign',
  Malicious: 'Malicious'
};

const typeLabels: Record<string, string> = {
  Phishing: 'Phishing',
  Malware: 'Malware',
  Scam: 'Scam',
  Suspicious: 'Suspicious',
  Legitimate: 'Legitimate',
};

const TypeBadge: React.FC<{ type: string }> = ({ type }) => {
  const styles: Record<string, string> = {
    Phishing: 'bg-accent-light-red text-gray-accent-red border-[#F0BBBB]',
    Malware: 'bg-accent-light-red text-gray-accent-red border-[#F0BBBB]',
    Scam: 'bg-accent-light-orange text-primary-dark border-[#F0D5A0]',
    Suspicious: 'bg-accent-light-orange text-primary-dark border-[#F0D5A0]',
    Legitimate: 'bg-accent-light-green text-gray-accent-green border-[#B0D9A0]',
  };

  return (
    <Badge variant="info" className={`inline-flex items-center gap-1 rounded-full px-[10px] py-[3px] text-[11px] font-bold border whitespace-nowrap ${styles[type] || ''}`}>
      {typeLabels[type] || type}
    </Badge>
  );
};

const VerdictBadge: React.FC<{ verdict: Verdict }> = ({ verdict }) => {
  const styles: Record<Verdict, string> = {
    Benign: 'bg-accent-light-green text-safe border-safe',
    Malicious: 'bg-accent-light-red text-danger border-danger',
  };

  return (
    <Badge variant="info" className={`inline-flex items-center gap-1 rounded-full px-[10px] py-[3px] text-[11px] font-bold border whitespace-nowrap ${styles[verdict]}`}>
      {verdictLabels[verdict]}
    </Badge>
  );
};

const ConfidenceBar: React.FC<{ value: number }> = ({ value }) => {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), 150);
    return () => clearTimeout(timer);
  }, [value]);

  const colorClass = value >= 80 ? 'bg-safe' : value >= 60 ? 'bg-warning' : 'bg-danger';

  return (
    <div className="flex items-center gap-[7px]">
      <div className="w-[55px] h-[5px] bg-gray-primary rounded-[3px] overflow-hidden">
        <div 
          className={`h-full rounded-[3px] transition-all duration-[900ms] ease-out ${colorClass}`}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="text-[11.5px] font-bold">{value}%</span>
    </div>
  );
};

const URLCell: React.FC<{ url: string; variant: 'full' | 'compact' }> = ({ url, variant }) => (
  <div className="relative group">
    <span className={`block font-mono text-[11px] text-secondary-dark overflow-hidden text-ellipsis whitespace-nowrap ${variant === 'compact' ? 'max-w-[120px]' : 'max-w-[200px]'}`}>
      {url}
    </span>
    <div className="absolute bottom-full left-0 mb-[5px] bg-dark text-primary text-[10.5px] px-[10px] py-1 rounded-md whitespace-nowrap max-w-[300px] overflow-hidden text-ellipsis font-mono opacity-0 group-hover:opacity-100 translate-y-[3px] group-hover:translate-y-0 transition-all duration-150 z-30 pointer-events-none">
      {url}
    </div>
  </div>
);

const ReporterCell: React.FC<{ reporter: string }> = ({ reporter }) => (
  <div className="inline-flex items-center gap-1">
    <span 
      className="w-[22px] h-[22px] rounded-full inline-flex items-center justify-center text-[9.5px] font-extrabold text-dark mr-1"
      style={{ background: reporterColors[reporter] || '#EBE1D5' }}
    >
      {reporter[0].toUpperCase()}
    </span>
    <span className="text-[12px]">{reporter}</span>
  </div>
);

const ExpandedRowContent: React.FC<{ row: URLRow }> = ({ row }) => (
  <div className="grid grid-cols-3 gap-[10px]">
    <div>
      <label className="text-[9.5px] font-extrabold text-gray-primary-dark uppercase tracking-wider block mb-[3px]">Full URL</label>
      <span className="font-mono text-[11px] break-all">{row.url}</span>
    </div>
    <div>
      <label className="text-[9.5px] font-extrabold text-gray-primary-dark uppercase tracking-wider block mb-[3px]">Submitted</label>
      <span className="text-[12.5px] font-semibold">{row.date}</span>
    </div>
    <div>
      <label className="text-[9.5px] font-extrabold text-gray-primary-dark uppercase tracking-wider block mb-[3px]">Reporter</label>
      <span className="text-[12.5px] font-semibold">{row.reporter}</span>
    </div>
    <div>
      <label className="text-[9.5px] font-extrabold text-gray-primary-dark uppercase tracking-wider block mb-[3px]">ML Verdict</label>
      <VerdictBadge verdict={row.verdict} />
    </div>
    <div>
      <label className="text-[9.5px] font-extrabold text-gray-primary-dark uppercase tracking-wider block mb-[3px]">Confidence</label>
      <span className="text-[18px] font-extrabold">{row.conf}%</span>
    </div>
    <div>
      <label className="text-[9.5px] font-extrabold text-gray-primary-dark uppercase tracking-wider block mb-[3px]">Threat Type</label>
      <TypeBadge type={row.type} />
    </div>
  </div>
);

export const URLTablePreview: React.FC<URLTablePreviewProps> = ({
  variant = 'compact',
  maxHeight = '320px',
  showBrowserBar = true,
  showToolbar = true,
  showPagination = true,
  showFilters = true,
  animated = true,
  className = '',
  data,
  title = 'รายงานล่าสุด',
  onAddClick,
}) => {
  const rows = data || mockRows;

  const getColumns = (): DataTableColumn<URLRow>[] => {
    const baseColumns: DataTableColumn<URLRow>[] = [
      {
        key: 'id',
        header: '#',
        width: '40px',
        align: 'center',
        render: (value) => <span className="text-[11px] text-gray-primary-dark">{value}</span>
      },
      {
        key: 'url',
        header: 'URL',
        render: (value) => <URLCell url={value} variant={variant} />
      },
    ];

    if (variant === 'full') {
      baseColumns.push({
        key: 'date',
        header: 'วันที่รายงาน',
        hiddenOnMobile: true,
        render: (value) => <span className="text-[11.5px] text-gray-primary-dark whitespace-nowrap">{value}</span>
      });
    }

    baseColumns.push(
      {
        key: 'type',
        header: 'ประเภท',
        render: (value) => <TypeBadge type={value} />
      },
      {
        key: 'verdict',
        header: 'ผลลัพธ์',
        render: (value) => <VerdictBadge verdict={value} />
      }
    );

    if (variant === 'full') {
      baseColumns.push(
        {
          key: 'conf',
          header: 'ค่าความถูกต้อง',
          render: (value) => <ConfidenceBar value={value} />
        },
        {
          key: 'reporter',
          header: 'ผู้รายงาน',
          hiddenOnMobile: true,
          render: (value) => <ReporterCell reporter={value} />
        }
      );
    }

    return baseColumns;
  };

  const filters = [
    { label: 'Benign', value: 'Benign' },
    { label: 'Malicious', value: 'Malicious' },
  ];

  const getRowBorderColor = (row: URLRow): string => {
    return row.verdict === 'Benign' 
      ? 'border-l-[3px] border-l-safe' 
      : 'border-l-[3px] border-l-danger';
  };

  return (
    <DataTable<URLRow>
      columns={getColumns()}
      data={rows}
      keyField="id"
      title={title}
      variant={variant}
      maxHeight={maxHeight}
      showBrowserBar={showBrowserBar}
      browserBarUrl="semd.app/dashboard/reports"
      showToolbar={showToolbar}
      showPagination={showPagination}
      showFilters={showFilters}
      filters={filters}
      filterKey="verdict"
      animated={animated}
      className={className}
      showLiveDot={true}
      showAddButton={variant === 'full'}
      addButtonLabel="+ เพิ่ม URL"
      onAddClick={onAddClick}
      rowBorderColor={getRowBorderColor}
      expandedRowRender={(row) => <ExpandedRowContent row={row} />}
      pageSize={10}
    />
  );
};

export default URLTablePreview;
