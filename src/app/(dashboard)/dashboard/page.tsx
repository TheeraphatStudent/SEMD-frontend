'use client';

import { Card, CardContent } from '@/components/ui';
import { Shield, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark">แดชบอร์ด</h1>
        <p className="text-gray-primary-0 mt-1">ภาพรวมการใช้งานระบบ</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-primary-0">URL ที่ตรวจสอบ</p>
                <p className="text-2xl font-bold text-dark mt-1">1,234</p>
              </div>
              <div className="p-3 bg-primary-light rounded-lg">
                <Shield className="text-primary" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-primary-0">URL อันตราย</p>
                <p className="text-2xl font-bold text-accent-red mt-1">89</p>
              </div>
              <div className="p-3 bg-accent-light-red rounded-lg">
                <AlertTriangle className="text-accent-red" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-primary-0">URL ปลอดภัย</p>
                <p className="text-2xl font-bold text-accent-green mt-1">1,145</p>
              </div>
              <div className="p-3 bg-accent-light-green rounded-lg">
                <CheckCircle className="text-accent-green" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card variant="elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-primary-0">ความแม่นยำ</p>
                <p className="text-2xl font-bold text-dark mt-1">94.5%</p>
              </div>
              <div className="p-3 bg-accent-light-sky rounded-lg">
                <TrendingUp className="text-accent-sky" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="elevated">
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold text-dark mb-4">การตรวจสอบล่าสุด</h3>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-primary-2 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-dark">example-url-{i}.com</p>
                    <p className="text-xs text-gray-primary-0">เมื่อ {i} นาทีที่แล้ว</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    i % 2 === 0 
                      ? 'bg-accent-light-green text-accent-green' 
                      : 'bg-accent-light-red text-accent-red'
                  }`}>
                    {i % 2 === 0 ? 'ปลอดภัย' : 'อันตราย'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card variant="elevated">
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold text-dark mb-4">สถิติรายสัปดาห์</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-primary-0">URL ปลอดภัย</span>
                  <span className="font-medium text-dark">92.8%</span>
                </div>
                <div className="w-full bg-gray-primary-2 rounded-full h-2">
                  <div className="bg-accent-green h-2 rounded-full" style={{ width: '92.8%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-primary-0">URL อันตราย</span>
                  <span className="font-medium text-dark">7.2%</span>
                </div>
                <div className="w-full bg-gray-primary-2 rounded-full h-2">
                  <div className="bg-accent-red h-2 rounded-full" style={{ width: '7.2%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
