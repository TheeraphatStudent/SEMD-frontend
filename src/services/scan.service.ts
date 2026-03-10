import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import {
  PredictionRequest,
  PredictionResponse,
  PredictionResult,
} from '@/types/scan.types';

export const scanService = {
  async predictUrl(url: string): Promise<PredictionResponse> {
    const data: PredictionRequest = { url };
    return await apiClient.post<PredictionResponse>(
      API_ENDPOINTS.PREDICT.PREDICT,
      data
    );
  },
  
  async getPredictionResult(id: string): Promise<PredictionResult> {
    // Mock data for testing
    if (id === '1') {
      return {
        id: '1',
        url: 'https://example.com',
        isMalicious: false,
        accuracy: 0.95,
        suggested: 'safe',
        predictedBy: 'model',
        usageBy: 'user',
        fromService: 'service',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    return await apiClient.get<PredictionResult>(
      API_ENDPOINTS.PREDICT.GET_RESULT(id)
    );
  },
  
  async checkHealth(): Promise<{ status: string }> {
    return await apiClient.get(API_ENDPOINTS.PREDICT.HEALTH);
  },
};
