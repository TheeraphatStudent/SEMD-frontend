'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Input, Button, Badge } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { User, Mail, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('อัปเดตโปรไฟล์สำเร็จ');
    setIsEditing(false);
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark">โปรไฟล์</h1>
        <p className="text-gray-primary-0 mt-1">จัดการข้อมูลส่วนตัวของคุณ</p>
      </div>
      
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>ข้อมูลส่วนตัว</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'ยกเลิก' : 'แก้ไข'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                <User className="text-dark" size={40} />
              </div>
              <div>
                <p className="text-lg font-bold text-dark">{user?.username}</p>
                <Badge variant={
                  user?.role === 'master_admin' ? 'master-admin' :
                  user?.role === 'admin' ? 'admin' :
                  'info'
                }>
                  {user?.role === 'master_admin' ? 'Master Admin' :
                   user?.role === 'admin' ? 'Admin' :
                   'User'}
                </Badge>
              </div>
            </div>
            
            <Input
              label="ชื่อผู้ใช้"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              disabled={!isEditing}
            />
            
            <Input
              label="อีเมล"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
            />
            
            {isEditing && (
              <Button type="submit" variant="primary" className="w-full">
                บันทึกการเปลี่ยนแปลง
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
      
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>ความปลอดภัย</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-primary-2 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="text-secondary" size={20} />
                <div>
                  <p className="font-medium text-dark">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-primary-0">เพิ่มความปลอดภัยให้กับบัญชีของคุณ</p>
                </div>
              </div>
              <Badge variant={user?.twoFactorEnabled ? 'safe' : 'warning'}>
                {user?.twoFactorEnabled ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
              </Badge>
            </div>
            
            <Button variant="outline" className="w-full">
              เปลี่ยนรหัสผ่าน
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
