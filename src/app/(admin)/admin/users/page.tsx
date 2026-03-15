'use client';

import { Card, CardHeader, CardTitle, CardContent, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button } from '@/components/ui';
import { Users, UserPlus } from 'lucide-react';

export default function AdminUsersPage() {
  const users = [
    { id: 1, username: 'john_doe', email: 'john@example.com', role: 'user', status: 'active', createdAt: '2024-01-01' },
    { id: 2, username: 'jane_admin', email: 'jane@example.com', role: 'admin', status: 'active', createdAt: '2024-01-05' },
    { id: 3, username: 'bob_user', email: 'bob@example.com', role: 'user', status: 'inactive', createdAt: '2024-01-10' },
    { id: 4, username: 'master_admin', email: 'master@example.com', role: 'master_admin', status: 'active', createdAt: '2023-12-01' },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">จัดการผู้ใช้</h1>
          <p className="text-gray-primary-0 mt-1">จัดการบัญชีผู้ใช้ในระบบ</p>
        </div>
        <Button variant="primary">
          <UserPlus size={20} className="mr-2" />
          เพิ่มผู้ใช้ใหม่
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-primary-0">ผู้ใช้ทั้งหมด</p>
                <p className="text-2xl font-bold text-dark mt-1">{users.length}</p>
              </div>
              <Users className="text-primary" size={32} />
            </div>
          </CardContent>
        </Card>
        
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-primary-0">ผู้ดูแลระบบ</p>
                <p className="text-2xl font-bold text-dark mt-1">
                  {users.filter(u => u.role === 'admin' || u.role === 'master_admin').length}
                </p>
              </div>
              <Users className="text-secondary" size={32} />
            </div>
          </CardContent>
        </Card>
        
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-primary-0">ผู้ใช้ทั่วไป</p>
                <p className="text-2xl font-bold text-dark mt-1">
                  {users.filter(u => u.role === 'user').length}
                </p>
              </div>
              <Users className="text-accent-green" size={32} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>รายการผู้ใช้</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อผู้ใช้</TableHead>
                <TableHead>อีเมล</TableHead>
                <TableHead>บทบาท</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>วันที่สร้าง</TableHead>
                <TableHead>การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={
                      user.role === 'master_admin' ? 'master-admin' :
                      user.role === 'admin' ? 'admin' :
                      'info'
                    }>
                      {user.role === 'master_admin' ? 'Master Admin' :
                       user.role === 'admin' ? 'Admin' :
                       'User'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'safe' : 'warning'}>
                      {user.status === 'active' ? 'ใช้งานอยู่' : 'ไม่ใช้งาน'}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.createdAt}</TableCell>
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
