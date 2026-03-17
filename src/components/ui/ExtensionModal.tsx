'use client';

import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { cn } from '@/libs/utils/utils';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Modal } from './modal';
import { Card } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Input } from './input';

export type ExtensionStatus = 'available' | 'unavailable';

interface ExtensionCardProps {
  name: string;
  iconUrl: string;
  storeUrl: string;
  status: ExtensionStatus;
}

interface ExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  chromeStatus?: ExtensionStatus;
  firefoxStatus?: ExtensionStatus;
}

const ExtensionCard: React.FC<ExtensionCardProps> = ({ name, iconUrl, storeUrl, status }) => {
  const isAvailable = status === 'available';

  return (
    <a
      href={storeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1"
    >
      <Card
        variant="outlined"
        animated={false}
        className={cn(
          'h-full p-4 border-2 transition-all hover:shadow-md cursor-pointer',
          'flex flex-col items-center gap-3 group',
          isAvailable
            ? 'border-safe/30 bg-safe/5 hover:border-safe hover:bg-safe/10'
            : 'border-gray-primary-1 bg-gray-primary-2 hover:border-gray-primary'
        )}
      >
        <div className="relative">
          <img
            src={iconUrl}
            alt={name}
            className="w-12 h-12 object-contain"
          />
          <ExternalLink
            size={14}
            className="absolute -top-1 -right-1 text-gray-primary-0 opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>

        <div className="text-center">
          <p className="text-sm font-semibold text-dark">{name}</p>
          <Badge
            variant={isAvailable ? 'safe' : 'benign'}
            animated={false}
            className="mt-1"
          >
            {isAvailable ? 'พร้อมใช้งาน' : 'ไม่พร้อมใช้งาน'}
          </Badge>
        </div>
      </Card>
    </a>
  );
};

export const ExtensionModal: React.FC<ExtensionModalProps> = ({
  isOpen,
  onClose,
  chromeStatus = 'available',
  firefoxStatus = 'available',
}) => {
  const { createExtensionToken } = useAuth();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClose = () => {
    setAccessToken(null);
    setShowConfirm(false);
    setCopied(false);
    onClose();
  };

  const handleGenerateToken = async () => {
    setIsGenerating(true);
    try {
      const token = await createExtensionToken();
      setAccessToken(token);
      setShowConfirm(false);
      toast.success('สร้าง Access Token สำเร็จ');
    } catch (error) {
      console.error('Failed to generate token:', error);
      toast.error('ไม่สามารถสร้าง Token ได้');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToken = () => {
    if (accessToken) {
      navigator.clipboard.writeText(accessToken);
      setCopied(true);
      toast.success('คัดลอก Token แล้ว');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const maskedToken = '••••••';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Browser Extensions"
      size="md"
    >
      <div className="space-y-5">
        <p className="text-sm text-gray-primary-0 -mt-2">
          ติดตั้ง Extension เพื่อตรวจสอบ URL ได้ทันที
        </p>

        <div className="flex gap-4">
          <ExtensionCard
            name="Chrome Extension"
            iconUrl="https://fonts.gstatic.com/s/i/productlogos/chrome_store/v7/192px.svg"
            storeUrl="https://chromewebstore.google.com/"
            status={chromeStatus}
          />
          <ExtensionCard
            name="Firefox Add-on"
            iconUrl="https://addons.mozilla.org/favicon.ico?v=3"
            storeUrl="https://addons.mozilla.org/en-US/firefox/addon/semd-suspicious-url-evaluation/?utm_source=addons.mozilla.org"
            status={firefoxStatus}
          />
        </div>

        <Card variant="default" animated={false} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-dark">Access Token</p>
            <Badge variant="info" animated={false}>มีอายุ 30 วัน</Badge>
          </div>

          <div className="relative mb-3">
            <div className="flex items-center gap-2">
              <Input
                value={accessToken || maskedToken}
                readOnly
                className={cn(
                  'font-mono text-sm tracking-wider flex-1',
                  !accessToken && 'text-gray-primary-0'
                )}
              />
              {accessToken && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyToken}
                  animated={false}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check size={16} className="text-safe" />
                  ) : (
                    <Copy size={16} />
                  )}
                </Button>
              )}
            </div>
          </div>

          {!accessToken && !showConfirm && (
            <Button
              variant="primary"
              onClick={() => setShowConfirm(true)}
              className="w-full"
              animated={false}
            >
              สร้าง Access Token
            </Button>
          )}

          {showConfirm && !accessToken && (
            <div className="space-y-3">
              <p className="text-xs text-warning text-center">
                Token เดิมจะถูกยกเลิก คุณต้องการสร้างใหม่หรือไม่?
              </p>
              <div className="flex gap-2">
                <Button
                  variant="danger"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1"
                  animated={false}
                >
                  ยกเลิก
                </Button>
                <Button
                  variant="primary"
                  onClick={handleGenerateToken}
                  isLoading={isGenerating}
                  className="flex-1"
                  animated={false}
                >
                  ยืนยัน
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </Modal>
  );
};

export default ExtensionModal;
