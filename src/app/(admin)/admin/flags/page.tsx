'use client';

import { Card, CardHeader, CardTitle, CardContent, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button } from '@/components/ui';
import { Shield, Plus } from 'lucide-react';

export default function AdminFlagsPage() {
  const flags = [
    { id: 1, url: 'https://phishing-site.com', isMalicious: true, reason: 'Phishing attempt', flaggedBy: 'System', status: 'active', date: '2024-01-15' },
    { id: 2, url: 'https://malware-distribution.net', isMalicious: true, reason: 'Malware detected', flaggedBy: 'Admin', status: 'active', date: '2024-01-14' },
    { id: 3, url: 'https://safe-verified.com', isMalicious: false, reason: 'Verified safe', flaggedBy: 'System', status: 'active', date: '2024-01-13' },
    { id: 4, url: 'https://old-threat.com', isMalicious: true, reason: 'Old threat', flaggedBy: 'User', status: 'inactive', date: '2023-12-01' },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">จัดการ URL Flags</h1>
          <p className="text-gray-primary-0 mt-1">จัดการ URL ที่ถูก Flag ในระบบ (Admin)</p>
        </div>
        <Button variant="primary">
          <Plus size={20} className="mr-2" />
          เพิ่ม Flag ใหม่
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-primary-0">Flags ทั้งหมด</p>
                <p className="text-2xl font-bold text-dark mt-1">{flags.length}</p>
              </div>
              <Shield className="text-primary" size={32} />
            </div>
          </CardContent>
        </Card>
        
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-primary-0">URL อันตราย</p>
                <p className="text-2xl font-bold text-accent-red mt-1">
                  {flags.filter(f => f.isMalicious).length}
                </p>
              </div>
              <Shield className="text-accent-red" size={32} />
            </div>
          </CardContent>
        </Card>
        
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-primary-0">URL ปลอดภัย</p>
                <p className="text-2xl font-bold text-accent-green mt-1">
                  {flags.filter(f => !f.isMalicious).length}
                </p>
              </div>
              <Shield className="text-accent-green" size={32} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>รายการ URL Flags</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>ประเภท</TableHead>
                <TableHead>เหตุผล</TableHead>
                <TableHead>Flag โดย</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>วันที่</TableHead>
                <TableHead>การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flags.map((flag) => (
                <TableRow key={flag.id}>
                  <TableCell className="font-medium">{flag.url}</TableCell>
                  <TableCell>
                    <Badge variant={flag.isMalicious ? 'danger' : 'safe'}>
                      {flag.isMalicious ? 'อันตราย' : 'ปลอดภัย'}
                    </Badge>
                  </TableCell>
                  <TableCell>{flag.reason}</TableCell>
                  <TableCell>{flag.flaggedBy}</TableCell>
                  <TableCell>
                    <Badge variant={flag.status === 'active' ? 'safe' : 'default'}>
                      {flag.status === 'active' ? 'ใช้งานอยู่' : 'ไม่ใช้งาน'}
                    </Badge>
                  </TableCell>
                  <TableCell>{flag.date}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">แก้ไข</Button>
                      <Button variant="danger" size="sm">ลบ</Button>
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
