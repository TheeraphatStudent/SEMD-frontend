'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/libs/utils/utils';

export interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export const QRCode: React.FC<QRCodeProps> = ({ 
  value, 
  size = 128,
  className 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!value || !canvasRef.current) return;

    const generateQR = async () => {
      try {
        const QRCodeLib = (await import('qrcode')).default;
        await QRCodeLib.toCanvas(canvasRef.current, value, {
          width: size,
          margin: 1,
          color: {
            dark: '#3D2B1F',
            light: '#FFFFFF',
          },
        });
      } catch (error) {
        console.error('QR Code generation failed:', error);
      }
    };

    generateQR();
  }, [value, size]);

  if (!value) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-gray-100 rounded-lg',
          className
        )}
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-gray-400">No QR Data</span>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={cn('rounded-lg', className)}
    />
  );
};

QRCode.displayName = 'QRCode';
