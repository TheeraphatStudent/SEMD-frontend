'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { Copy, Code, Terminal, FileCode } from 'lucide-react';
import { alert } from '@/libs/utils/alert';

interface CodeExample {
  language: string;
  icon: React.ReactNode;
  code: string;
}

const codeExamples: CodeExample[] = [
  {
    language: 'cURL',
    icon: <Terminal size={16} />,
    code: `curl -X POST "$NEXT_PUBLIC_API_BASE_URL/prediction/predict" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"url": "https://example.com"}'`
  },
  {
    language: 'JavaScript',
    icon: <FileCode size={16} />,
    code: `const response = await fetch(\`\${process.env.NEXT_PUBLIC_API_BASE_URL}/prediction/predict\`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    url: 'https://example.com'
  })
});

const result = await response.json();
console.log(result);`
  },
  {
    language: 'Python',
    icon: <Code size={16} />,
    code: `import requests

url = "https://your-api-host/prediction/predict"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
}
data = {
    "url": "https://example.com"
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result)`
  }
];

const responseExample = `{
  "status": 200,
  "message": "Prediction completed",
  "data": {
    "id": "prediction-id",
    "url": "https://example.com",
    "is_malicious": false,
    "confidence": 0.97,
    "predicted_at": "2026-07-15T10:30:00Z"
  }
}`;

export const ApiDocumentation: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      alert.success('คัดลอกแล้ว', 'โค้ดถูกคัดลอกไปยังคลิปบอร์ดแล้ว');
    } catch (error) {
      alert.error('เกิดข้อผิดพลาด', 'ไม่สามารถคัดลอกโค้ดได้');
    }
  };

  return (
    <Card variant="elevated" className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code size={20} />
          วิธีใช้งาน API
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-primary-light border border-primary rounded-lg p-4">
          <p className="text-sm text-primary-dark">
            ใช้ API Key ในส่วน `Authorization: Bearer ...` เพื่อเรียก endpoint ที่ backend เปิดไว้จริง และอ้างอิง `NEXT_PUBLIC_API_BASE_URL` จาก environment เดียวกับแอปนี้
          </p>
          <p className="mt-2 text-sm text-primary-dark">
            หาก backend แสดงค่า secret เพียงครั้งเดียว อย่าลืมคัดลอกและจัดเก็บทันที เพราะ frontend จะไม่สร้าง key ปลอมขึ้นมาแทน
          </p>
        </div>

        <div>
          <div className="flex border-b border-gray-primary mb-4">
            {codeExamples.map((example, index) => (
              <button
                key={example.language}
                onClick={() => setActiveTab(index)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === index
                  ? 'border-primary text-primary-dark bg-primary-light/50'
                  : 'border-transparent text-gray-primary-0 hover:text-dark hover:border-gray-primary'
                  }`}
              >
                {example.icon}
                {example.language}
              </button>
            ))}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <div className="bg-dark rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                <span className="text-sm text-gray-300 font-medium">
                  {codeExamples[activeTab].language} Example
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(codeExamples[activeTab].code)}
                  className="text-gray-300 hover:text-white hover:bg-gray-700 p-1"
                >
                  <Copy size={14} />
                </Button>
              </div>
              <pre className="p-4 text-sm text-gray-100 overflow-x-auto">
                <code>{codeExamples[activeTab].code}</code>
              </pre>
            </div>
          </motion.div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-dark mb-3">ตัวอย่าง response ที่คุณจะได้รับ</h4>
          <div className="relative">
            <div className="bg-dark rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                <span className="text-sm text-gray-300 font-medium">JSON Response</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(responseExample)}
                  className="text-gray-300 hover:text-white hover:bg-gray-700 p-1"
                >
                  <Copy size={14} />
                </Button>
              </div>
              <pre className="p-4 text-sm text-gray-100 overflow-x-auto">
                <code>{responseExample}</code>
              </pre>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-primary-2 rounded-lg p-4">
            <h5 className="font-semibold text-dark mb-2">Base URL</h5>
            <code className="text-sm bg-white px-2 py-1 rounded border">
              {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://server:8000'}
            </code>
          </div>
          <div className="bg-gray-primary-2 rounded-lg p-4">
            <h5 className="font-semibold text-dark mb-2">Endpoint</h5>
            <p className="text-sm text-gray-primary-0">
              `POST /prediction/predict`
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-primary-1 bg-light px-4 py-4 text-sm text-gray-primary-0">
          หาก request ล้มเหลว ควรจัดการ error message ให้บอกได้ว่าเกิดอะไรขึ้นและควรแก้ไขอย่างไร เช่น URL ไม่ถูกต้อง เซสชันหมดอายุ หรือเกิน rate limit
        </div>
      </CardContent>
    </Card>
  );
};
