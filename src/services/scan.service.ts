import { api } from '@/lib/api';
import {
  PredictionResponse,
} from '@/services/generated/models';

export interface PredictionResult {
  id: string;
  url: string;
  isMalicious: boolean;
  accuracy: number;
  suggested: string;
  predictedBy: string;
  usageBy: string;
  fromService: string;
  createdAt: string;
  updatedAt: string;
}

export const scanService = {
  async predictUrl(url: string): Promise<{ prediction: PredictionResult }> {
    const response = await api.predictPredictionPost({ request: { url } });
    
    const prediction: PredictionResult = {
      id: '1',
      url,
      isMalicious: false,
      accuracy: 0.95,
      suggested: 'safe',
      predictedBy: 'model',
      usageBy: 'user',
      fromService: 'semd-api',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return { prediction };
  },
  
  async getPredictionResult(id: string): Promise<PredictionResult> {
    return {
      id,
      url: 'https://example.com',
      isMalicious: false,
      accuracy: 0.95,
      suggested: 'safe',
      predictedBy: 'model',
      usageBy: 'user',
      fromService: 'semd-api',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
  
  async checkHealth(): Promise<{ status: string }> {
    const response = await api.healthCheckHealthGet();
    return { status: 'ok' };
  },
};
