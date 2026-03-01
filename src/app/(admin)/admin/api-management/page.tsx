'use client';

import { Card, CardHeader, CardTitle, CardContent, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button } from '@/components/ui';
import { Key, Activity } from 'lucide-react';

export default function AdminApiManagementPage() {
  const apiKeys = [
    { id: 1, user: 'john_doe', keyName: 'Production API', isActive: true, usageCount: 1250, lastUsed: '2024-01-15', created: '2024-01-01' },
    { id: 2, user: 'jane_admin', keyName: 'Development API', isActive: true, usageCount: 850, lastUsed: '2024-01-14', created: '2024-01-05' },
    { id: 3, user: 'bob_user', keyName: 'Test API', isActive: false, usageCount: 120, lastUsed: '2023-12-31', created: '2023-12-01' },
  ];
  
  const totalUsage = apiKeys.reduce((sum, key) => sum + key.usageCount, 0);
  const activeKeys = apiKeys.filter(k => k.isActive).length;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark">จัดการ API</h1>
        <p className="text-gray-primary-0 mt-1">จัดการ API Keys ของผู้ใช้ทั้งหมด</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-primary-0">API Keys ทั้งหมด</p>
                <p className="text-2xl font-bold text-dark mt-1">{apiKeys.length}</p>
              </div>
              <Key className="text-primary" size={32} />
            </div>
          </CardContent>
        </Card>
        
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-primary-0">Keys ที่ใช้งานอยู่</p>
                <p className="text-2xl font-bold text-accent-green mt-1">{activeKeys}</p>
              </div>
              <Key className="text-accent-green" size={32} />
            </div>
          </CardContent>
        </Card>
        
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-primary-0">การใช้งานรวม</p>
                <p className="text-2xl font-bold text-dark mt-1">{totalUsage.toLocaleString()}</p>
              </div>
              <Activity className="text-secondary" size={32} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>รายการ API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ผู้ใช้</TableHead>
                <TableHead>ชื่อ Key</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>จำนวนการใช้งาน</TableHead>
                <TableHead>ใช้งานล่าสุด</TableHead>
                <TableHead>วันที่สร้าง</TableHead>
                <TableHead>การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">{apiKey.user}</TableCell>
                  <TableCell>{apiKey.keyName}</TableCell>
                  <TableCell>
                    <Badge variant={apiKey.isActive ? 'success' : 'default'}>
                      {apiKey.isActive ? 'ใช้งานอยู่' : 'ไม่ใช้งาน'}
                    </Badge>
                  </TableCell>
                  <TableCell>{apiKey.usageCount.toLocaleString()}</TableCell>
                  <TableCell>{apiKey.lastUsed}</TableCell>
                  <TableCell>{apiKey.created}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">ดูรายละเอียด</Button>
                      <Button variant="danger" size="sm">ปิดการใช้งาน</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
