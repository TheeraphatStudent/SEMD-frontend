'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { Copy, Code, Terminal, FileCode } from 'lucide-react';
import { alert } from '@/lib/alert';

interface CodeExample {
  language: string;
  icon: React.ReactNode;
  code: string;
}

const codeExamples: CodeExample[] = [
  {
    language: 'cURL',
    icon: <Terminal size={16} />,
    code: `curl -X POST https://api.semd.app/v1/check \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"url": "https://example.com"}'`
  },
  {
    language: 'JavaScript',
    icon: <FileCode size={16} />,
    code: `const response = await fetch('https://api.semd.app/v1/check', {
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

url = "https://api.semd.app/v1/check"
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
  "verdict": "Safe",
  "confidence": 0.978,
  "type": "Legitimate",
  "url": "https://example.com",
  "checked_at": "2026-03-15T18:36:00Z"
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
            ใช้ API Key ในส่วน Authorization header เพื่อเข้าถึง SEMD API 
            ทุกครั้งที่ส่งคำขอ commit ณ repository สาธารณะ
          </p>
        </div>

        <div>
          <div className="flex border-b border-gray-primary mb-4">
            {codeExamples.map((example, index) => (
              <button
                key={example.language}
                onClick={() => setActiveTab(index)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === index
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
          <h4 className="text-sm font-semibold text-dark mb-3">Response ตัวอย่างในรูปแบบ JSON ดังนี้</h4>
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
              https://api.semd.app/v1
            </code>
          </div>
          <div className="bg-gray-primary-2 rounded-lg p-4">
            <h5 className="font-semibold text-dark mb-2">Rate Limit</h5>
            <p className="text-sm text-gray-primary-0">
              10,000 requests ต่อเดือน
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
