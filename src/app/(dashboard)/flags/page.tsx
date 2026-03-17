'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, DataTable, DataTableColumn, DataTableFilter, Badge, Modal } from '@/components/ui';
import { FlagRow } from '@/libs/utils/row';
import { flagService, UrlFlagCreateRequest } from '@/services/flag.service';
import { FlagType, ACLType } from '@/services/generated/models';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const filters: DataTableFilter[] = [
  { label: 'ทั้งหมด', value: 'all' },
  { label: 'Malicious', value: 'Malicious' },
  { label: 'Benign', value: 'Benign' },
];

const getRowBorderColor = (row: FlagRow): string => {
  return row.flag === 'Malicious' ? 'border-l-danger' : 'border-l-safe';
};

export default function FlagsPage() {
  const [rows, setRows] = useState<FlagRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newFlagType, setNewFlagType] = useState<FlagType>(FlagType.MALICIOUS);
  const [newAccessLevel, setNewAccessLevel] = useState<ACLType>(ACLType.PRIVATE);
  const [submitting, setSubmitting] = useState(false);

  const fetchFlags = useCallback(async () => {
    setLoading(true);
    try {
      const data = await flagService.getMyFlags();
      setRows(data);
    } catch (error) {
      console.error('Failed to fetch flags:', error);
      toast.error('ไม่สามารถโหลดรายการ Flag ได้');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlags();
  }, [fetchFlags]);

  const handleAddFlag = async () => {
    if (!newUrl.trim()) {
      toast.error('กรุณากรอก URL');
      return;
    }

    setSubmitting(true);
    try {
      const request: UrlFlagCreateRequest = {
        url: newUrl.trim(),
        type: newFlagType,
        access_level: newAccessLevel,
      };
      await flagService.createFlag(request);
      toast.success('เพิ่ม Flag สำเร็จ');
      setShowAddModal(false);
      setNewUrl('');
      setNewFlagType(FlagType.MALICIOUS);
      setNewAccessLevel(ACLType.PRIVATE);
      fetchFlags();
    } catch (error) {
      console.error('Failed to create flag:', error);
      toast.error('ไม่สามารถเพิ่ม Flag ได้');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFlag = async (flagId: number) => {
    try {
      await flagService.deleteFlag(flagId);
      toast.success('ลบ Flag สำเร็จ');
      fetchFlags();
    } catch (error) {
      console.error('Failed to delete flag:', error);
      toast.error('ไม่สามารถลบ Flag ได้');
    }
  };

  const getColumns = (): DataTableColumn<FlagRow>[] => [
    {
      key: 'id',
      header: 'ID',
      width: '60px',
      align: 'center',
    },
    {
      key: 'url',
      header: 'URL',
      render: (value: string) => (
        <span className="font-mono text-xs truncate max-w-[300px] block" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'วันที่',
      width: '140px',
      render: (value: string) => {
        const date = new Date(value);
        return (
          <span className="text-xs text-gray-primary-0">
            {date.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        );
      },
    },
    {
      key: 'flag',
      header: 'Flag',
      width: '100px',
      align: 'center',
      render: (value: string) => (
        <Badge variant={value === 'Malicious' ? 'malicious' : 'safe'}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      width: '120px',
      align: 'center',
      render: (value: string, row: FlagRow) => (
        <button
          onClick={() => handleDeleteFlag(row.id)}
          className="px-3 py-1.5 text-xs font-semibold text-danger bg-accent-light-red rounded-lg hover:bg-danger hover:text-white transition-colors"
        >
          ลบ Flag
        </button>
      ),
    },
  ];

  const ExpandedRowContent = ({ row }: { row: FlagRow }) => (
    <div className="p-4 bg-gray-primary-2 rounded-lg">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-primary-0">URL:</span>
          <p className="font-mono text-xs break-all">{row.url}</p>
        </div>
        <div>
          <span className="text-gray-primary-0">Flag:</span>
          <p className={row.flag === 'Malicious' ? 'text-danger' : 'text-safe'}>{row.flag}</p>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <button
          onClick={() => handleDeleteFlag(row.id)}
          className="px-3 py-1.5 text-xs font-semibold text-danger bg-accent-light-red rounded-lg hover:bg-danger hover:text-white transition-colors"
        >
          ลบ Flag
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark">จัดการ Flag</h1>
        <p className="text-gray-primary-0 mt-1">รายการ URL ที่ถูก Flag ในระบบ</p>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>รายการ URL Flags</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <DataTable<FlagRow>
              columns={getColumns()}
              data={rows}
              keyField="id"
              title="URL Flags"
              variant="full"
              maxHeight="400px"
              showBrowserBar={true}
              browserBarUrl="semd.app/dashboard/flags"
              showToolbar={true}
              showPagination={true}
              showFilters={true}
              filters={filters}
              filterKey="flag"
              animated={true}
              showLiveDot={true}
              showAddButton={true}
              addButtonLabel="+ เพิ่ม Flag"
              onAddClick={() => setShowAddModal(true)}
              rowBorderColor={getRowBorderColor}
              pageSize={10}
              emptyMessage="ยังไม่มีรายการ Flag"
            />
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="เพิ่ม URL Flag"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-dark mb-1.5">URL</label>
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-primary bg-gray-primary-light text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-1.5">ประเภท Flag</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setNewFlagType(FlagType.MALICIOUS)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  newFlagType === FlagType.MALICIOUS
                    ? 'bg-danger text-white border-danger'
                    : 'bg-white text-gray-primary-dark border-gray-primary hover:bg-gray-primary-light'
                }`}
              >
                Malicious
              </button>
              <button
                type="button"
                onClick={() => setNewFlagType(FlagType.BENIGN)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  newFlagType === FlagType.BENIGN
                    ? 'bg-safe text-white border-safe'
                    : 'bg-white text-gray-primary-dark border-gray-primary hover:bg-gray-primary-light'
                }`}
              >
                Benign
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-1.5">ระดับการเข้าถึง</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setNewAccessLevel(ACLType.PRIVATE)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  newAccessLevel === ACLType.PRIVATE
                    ? 'bg-primary text-dark border-primary'
                    : 'bg-white text-gray-primary-dark border-gray-primary hover:bg-gray-primary-light'
                }`}
              >
                Private
              </button>
              <button
                type="button"
                onClick={() => setNewAccessLevel(ACLType.GLOBAL)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  newAccessLevel === ACLType.GLOBAL
                    ? 'bg-primary text-dark border-primary'
                    : 'bg-white text-gray-primary-dark border-gray-primary hover:bg-gray-primary-light'
                }`}
              >
                Global
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gray-primary-light text-gray-primary-dark hover:bg-gray-primary transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleAddFlag}
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-dark text-primary hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
