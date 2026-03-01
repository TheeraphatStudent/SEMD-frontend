'use client';

import { Card, CardHeader, CardTitle, CardContent, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui';
import { Flag } from 'lucide-react';

export default function FlagsPage() {
  const flags = [
    { id: 1, url: 'https://malicious-site.com', isMalicious: true, reason: 'Known phishing site', flaggedBy: 'Admin', date: '2024-01-15' },
    { id: 2, url: 'https://safe-site.com', isMalicious: false, reason: 'Verified safe', flaggedBy: 'System', date: '2024-01-14' },
    { id: 3, url: 'https://suspicious.net', isMalicious: true, reason: 'Malware detected', flaggedBy: 'User', date: '2024-01-13' },
  ];
  
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>เหตุผล</TableHead>
                <TableHead>Flag โดย</TableHead>
                <TableHead>วันที่</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flags.map((flag) => (
                <TableRow key={flag.id}>
                  <TableCell className="font-medium">{flag.url}</TableCell>
                  <TableCell>
                    <Badge variant={flag.isMalicious ? 'danger' : 'success'}>
                      {flag.isMalicious ? 'อันตราย' : 'ปลอดภัย'}
                    </Badge>
                  </TableCell>
                  <TableCell>{flag.reason}</TableCell>
                  <TableCell>{flag.flaggedBy}</TableCell>
                  <TableCell>{flag.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
