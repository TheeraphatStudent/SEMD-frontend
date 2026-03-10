import { useState } from 'react';
import { scanService } from '@/services/scan.service';
import { PredictionResult } from '@/types/scan.types';

export function useScan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  
  const predict = async (url: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // const response = await scanService.predictUrl(url);
      // setResult(response.prediction);
      // return response.prediction;
      const response = await scanService.getPredictionResult('1');
      setResult(response);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'ไม่สามารถตรวจสอบ URL ได้';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const getResult = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const prediction = await scanService.getPredictionResult(id);
      setResult(prediction);
      return prediction;
    } catch (err: any) {
      const errorMessage = err.message || 'ไม่สามารถดึงข้อมูลผลการตรวจสอบได้';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const reset = () => {
    setResult(null);
    setError(null);
  };
  
  return {
    predict,
    getResult,
    reset,
    loading,
    error,
    result,
  };
}
