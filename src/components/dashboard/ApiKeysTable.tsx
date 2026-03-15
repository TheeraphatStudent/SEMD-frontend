'use client';

import React, { useState } from 'react';
import { Badge, Button } from '@/components/ui';
import { DataTable, DataTableColumn } from '@/components/ui/DataTable';
import { Key, Copy, Trash2, Eye, EyeOff } from 'lucide-react';
import { alert } from '@/lib/alert';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  usage: number;
  maxUsage: number;
  created: string;
  expired: string;
  isActive: boolean;
  owner?: string;
}

interface ApiKeysTableProps {
  onCreateNew?: () => void;
  className?: string;
  data?: ApiKey[];
}

const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Production Key',
    key: 'sk-1234567890abcdef1234567890abcdef',
    usage: 7000,
    maxUsage: 10000,
    created: '12 Aug 2025 | 06:00',
    expired: '12 Sep 2025 | 06:00',
    isActive: true,
    owner: 'th1znaphat',
  },
  {
    id: '2',
    name: 'Testing Key',
    key: 'sk-abcdef1234567890abcdef1234567890',
    usage: 0,
    maxUsage: 10000,
    created: '3 Sep 2025 | 20:00',
    expired: '3 Oct 2025 | 20:00',
    isActive: true,
    owner: 'th1znaphat',
  },
];

const OwnerCell: React.FC<{ owner: string }> = ({ owner }) => (
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 bg-primary-light rounded-full flex items-center justify-center">
      <span className="text-xs font-bold text-primary-dark">{owner[0].toUpperCase()}</span>
    </div>
    <span className="text-sm text-dark">{owner}</span>
  </div>
);

const UsageCell: React.FC<{ usage: number; maxUsage: number }> = ({ usage, maxUsage }) => {
  const percentage = (usage / maxUsage) * 100;
  const colorClass = percentage >= 80 ? 'bg-danger' : percentage >= 60 ? 'bg-warning' : 'bg-primary';

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-primary-0">{usage.toLocaleString()} / {maxUsage.toLocaleString()}</span>
      </div>
      <div className="w-full bg-gray-primary-2 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const ApiKeysTable: React.FC<ApiKeysTableProps> = ({ 
  onCreateNew,
  className = '',
  data
}) => {
  const apiKeys = data || mockApiKeys;
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const handleCopy = async (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(key);
      alert.success('คัดลอกแล้ว', 'API Key ถูกคัดลอกไปยังคลิปบอร์ดแล้ว');
    } catch (error) {
      alert.error('เกิดข้อผิดพลาด', 'ไม่สามารถคัดลอก API Key ได้');
    }
  };

  const toggleKeyVisibility = (keyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId);
    } else {
      newVisibleKeys.add(keyId);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const maskKey = (key: string) => {
    return key.substring(0, 8) + '****';
  };

  const KeyCell: React.FC<{ apiKey: ApiKey }> = ({ apiKey }) => (
    <div className="flex items-center gap-2">
      <code className="text-xs font-mono text-primary-dark bg-primary-light px-2 py-1 rounded">
        {visibleKeys.has(apiKey.id) ? apiKey.key.substring(0, 16) + '...' : maskKey(apiKey.key)}
      </code>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => toggleKeyVisibility(apiKey.id, e)}
        className="p-1 h-auto"
      >
        {visibleKeys.has(apiKey.id) ? <EyeOff size={14} /> : <Eye size={14} />}
      </Button>
    </div>
  );

  const ActionCell: React.FC<{ apiKey: ApiKey }> = ({ apiKey }) => (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => handleCopy(apiKey.key, e)}
        className="text-xs px-2 py-1 h-auto"
      >
        คัดลอก Key
      </Button>
      <Badge variant={apiKey.isActive ? 'safe' : 'info'} className="text-xs">
        {apiKey.isActive ? 'การใช้งาน' : 'หยุด'}
      </Badge>
    </div>
  );

  const columns: DataTableColumn<ApiKey>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '60px',
      align: 'center',
      render: (value) => <span className="text-sm font-medium text-dark">{value}</span>
    },
    {
      key: 'owner',
      header: 'Owned',
      render: (value) => <OwnerCell owner={value || 'Unknown'} />
    },
    {
      key: 'key',
      header: 'Key',
      render: (_, row) => <KeyCell apiKey={row} />
    },
    {
      key: 'usage',
      header: 'Usage',
      render: (value, row) => <UsageCell usage={value} maxUsage={row.maxUsage} />
    },
    {
      key: 'created',
      header: 'Created at',
      hiddenOnMobile: true,
      render: (value) => <span className="text-xs text-gray-primary-0">{value}</span>
    },
    {
      key: 'expired',
      header: 'Expired at',
      hiddenOnMobile: true,
      render: (value) => <span className="text-xs text-gray-primary-0">{value}</span>
    },
    {
      key: 'actions',
      header: 'Action',
      render: (_, row) => <ActionCell apiKey={row} />
    },
  ];

  return (
    <DataTable<ApiKey>
      columns={columns}
      data={apiKeys}
      keyField="id"
      title="API Keys ของคุณ"
      titleIcon={<Key size={18} />}
      variant="full"
      maxHeight="400px"
      showBrowserBar={false}
      showToolbar={true}
      showPagination={true}
      showFilters={false}
      animated={true}
      className={className}
      showLiveDot={false}
      showAddButton={true}
      addButtonLabel="สร้าง Key"
      onAddClick={onCreateNew}
      pageSize={10}
      emptyMessage="ยังไม่มี API Key"
    />
  );
};
