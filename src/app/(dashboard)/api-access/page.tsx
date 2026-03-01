'use client';

import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';
import { Key, Plus, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ApiAccessPage() {
  const apiKeys = [
    { id: 1, name: 'Production API', key: 'sk_live_abc123...', isActive: true, created: '2024-01-01', lastUsed: '2024-01-15' },
    { id: 2, name: 'Development API', key: 'sk_test_xyz789...', isActive: true, created: '2024-01-10', lastUsed: '2024-01-14' },
    { id: 3, name: 'Old API Key', key: 'sk_live_old456...', isActive: false, created: '2023-12-01', lastUsed: '2023-12-31' },
  ];
  
  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('คัดลอก API Key แล้ว');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">API Access</h1>
          <p className="text-gray-primary-0 mt-1">จัดการ API Keys สำหรับเข้าถึงระบบ</p>
        </div>
        <Button variant="primary">
          <Plus size={20} className="mr-2" />
          สร้าง API Key ใหม่
        </Button>
      </div>
      
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>API Keys ของคุณ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="p-4 bg-gray-primary-2 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-light rounded-lg">
                      <Key className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-dark">{apiKey.name}</p>
                      <p className="text-xs text-gray-primary-0">สร้างเมื่อ: {apiKey.created}</p>
                    </div>
                  </div>
                  <Badge variant={apiKey.isActive ? 'success' : 'default'}>
                    {apiKey.isActive ? 'ใช้งานอยู่' : 'ไม่ใช้งาน'}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-light rounded border border-gray-primary-1">
                  <code className="flex-1 text-sm text-dark font-mono">{apiKey.key}</code>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleCopy(apiKey.key)}
                  >
                    <Copy size={16} />
                  </Button>
                </div>
                
                <p className="text-xs text-gray-primary-0 mt-2">
                  ใช้งานล่าสุด: {apiKey.lastUsed}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
