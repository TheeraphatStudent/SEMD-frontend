import * as api from '@/services/generated/semdApi';
import type { PredictionRequest as ApiPredictionRequest } from '@/services/generated/models';
import type { PredictionResult } from '@/types/scan.types';

export const scanService = {
  async predictUrl(url: string): Promise<{ prediction: PredictionResult }> {
    const request: ApiPredictionRequest = { url };
    const data = await api.predictPredictionPredictPost(request) as any;
    
    return {
      prediction: {
        id: String(data.prediction_id ?? ''),
        url: url,
        isMalicious: data.is_malicious ?? false,
        accuracy: data.confidence ?? 0,
        suggested: data.suggested ?? '',
        predictedBy: data.model_used ?? '',
        usageBy: data.usage_by ?? '',
        fromService: data.from_service ?? '',
        createdAt: data.created_at ?? new Date().toISOString(),
        updatedAt: data.updated_at ?? new Date().toISOString(),
      },
    };
  },

  async getPredictionResult(id: string): Promise<PredictionResult> {
    return {
      id,
      url: '',
      isMalicious: false,
      accuracy: 0,
      suggested: '',
      predictedBy: '',
      usageBy: '',
      fromService: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
};
