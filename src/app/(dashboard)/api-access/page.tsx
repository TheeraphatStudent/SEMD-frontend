'use client';

import { useState } from 'react';
import { ApiDocumentation } from '@/components/dashboard/ApiDocumentation';
import { ApiKeysTable } from '@/components/dashboard/ApiKeysTable';
import { CreateApiKeyModal } from '@/components/dashboard/CreateApiKeyModal';

export default function ApiAccessPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleCreateNew = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleApiKeyCreated = (newApiKey: any) => {
    // Handle the new API key creation
    console.log('New API Key created:', newApiKey);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark">API Access</h1>
        <p className="text-gray-primary-0 mt-1">จัดการ API Keys สำหรับเข้าถึงระบบ</p>
      </div>
      
      <ApiDocumentation />
      
      <ApiKeysTable onCreateNew={handleCreateNew} />
      
      <CreateApiKeyModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleApiKeyCreated}
      />
    </div>
  );
}
