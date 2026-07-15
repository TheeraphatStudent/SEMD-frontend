import { useState } from 'react';
import { scanService } from '@/services/scan.service';
import { PredictionResult, PredictionStatus } from '@/types/scan.types';
import { normalizeError } from '@/libs/utils/api-error';

export function useScan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [status, setStatus] = useState<PredictionStatus>('idle');

  const predict = async (url: string) => {
    setLoading(true);
    setError(null);
    setStatus('submitting');

    try {
      const response = await scanService.predictUrl(url);
      setResult(response.prediction);
      setStatus(response.prediction.status);
      return response.prediction;
    } catch (err) {
      const normalized = normalizeError(err);
      setStatus('failed');
      setError(normalized.message);
      throw normalized;
    } finally {
      setLoading(false);
    }
  };

  const getResult = async (id: string) => {
    setLoading(true);
    setError(null);
    setStatus('pending');

    try {
      const prediction = await scanService.getPredictionResult(id);
      setResult(prediction);
      setStatus(prediction.status);
      return prediction;
    } catch (err) {
      const normalized = normalizeError(err);
      setStatus('failed');
      setError(normalized.message);
      throw normalized;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setStatus('idle');
  };

  return {
    predict,
    getResult,
    reset,
    loading,
    error,
    result,
    status,
  };
}
