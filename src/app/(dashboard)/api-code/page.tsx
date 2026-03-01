'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { Code } from 'lucide-react';

export default function ApiCodePage() {
  const codeExamples = [
    {
      language: 'Python',
      code: `import requests

url = "http://localhost:8000/api/v1/predict/predict"
headers = {
    "x-api-key": "your-api-key",
    "Authorization": "Bearer your-token"
}
data = {"url": "https://example.com"}

response = requests.post(url, json=data, headers=headers)
print(response.json())`,
    },
    {
      language: 'JavaScript',
      code: `const response = await fetch('http://localhost:8000/api/v1/predict/predict', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your-api-key',
    'Authorization': 'Bearer your-token'
  },
  body: JSON.stringify({ url: 'https://example.com' })
});

const data = await response.json();
console.log(data);`,
    },
    {
      language: 'cURL',
      code: `curl -X POST "http://localhost:8000/api/v1/predict/predict" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: your-api-key" \\
  -H "Authorization: Bearer your-token" \\
  -d '{"url": "https://example.com"}'`,
    },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark">API Code Examples</h1>
        <p className="text-gray-primary-0 mt-1">ตัวอย่างโค้ดสำหรับเรียกใช้ API</p>
      </div>
      
      {codeExamples.map((example, i) => (
        <Card key={i} variant="elevated">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Code className="text-primary" size={20} />
              <CardTitle>{example.language}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-dark text-light rounded-lg overflow-x-auto">
              <code className="text-sm">{example.code}</code>
            </pre>
          </CardContent>
        </Card>
      ))}
      
      <Card variant="outlined">
        <CardContent className="pt-6">
          <h3 className="font-bold text-dark mb-2">หมายเหตุ</h3>
          <ul className="text-sm text-gray-primary-0 space-y-1 list-disc list-inside">
            <li>แทนที่ <code className="px-1 py-0.5 bg-gray-primary-2 rounded">your-api-key</code> ด้วย API Key ของคุณ</li>
            <li>แทนที่ <code className="px-1 py-0.5 bg-gray-primary-2 rounded">your-token</code> ด้วย Bearer Token ของคุณ</li>
            <li>ตรวจสอบให้แน่ใจว่า API endpoint ถูกต้อง</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
