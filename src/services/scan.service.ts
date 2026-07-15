import { api } from '@/libs/utils/api';
import { normalizeError } from '@/libs/utils/api-error';
import type { PredictionResult, PredictionStatus } from '@/types/scan.types';

const STORAGE_KEY = 'semd_prediction_result';

function canUseSessionStorage() {
  return typeof window !== 'undefined';
}

function inferStatus(isMalicious: boolean | null, confidence: number | null): PredictionStatus {
  if (isMalicious === true) {
    return confidence !== null && confidence < 0.8 ? 'suspicious' : 'malicious';
  }

  if (isMalicious === false) {
    return 'safe';
  }

  return 'unknown';
}

function toNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function toBoolean(value: unknown): boolean | null {
  return typeof value === 'boolean' ? value : null;
}

function toStringValue(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function extractPredictionPayload(data: unknown) {
  if (!data || typeof data !== 'object') {
    return {};
  }

  return data as Record<string, unknown>;
}

function buildRecommendation(status: PredictionStatus) {
  switch (status) {
    case 'safe':
      return 'ไม่พบสัญญาณอันตรายจากการประเมินครั้งนี้ แต่ควรตรวจสอบบริบทของลิงก์ก่อนใช้งานเสมอ';
    case 'suspicious':
      return 'ผลลัพธ์ยังมีความไม่แน่นอน ควรใช้ความระมัดระวังและหลีกเลี่ยงการกรอกข้อมูลสำคัญ';
    case 'malicious':
      return 'ควรหลีกเลี่ยงการเปิดลิงก์นี้ และไม่ควรกรอกข้อมูลส่วนตัวหรือรหัสผ่าน';
    case 'unknown':
      return 'ระบบยังไม่สามารถยืนยันสถานะของลิงก์นี้ได้ กรุณาลองใหม่อีกครั้งหรือใช้บริการตรวจสอบอื่น';
    default:
      return 'ระบบไม่สามารถยืนยันผลลัพธ์ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง';
  }
}

function normalizePrediction(raw: unknown): PredictionResult {
  const payload = extractPredictionPayload(raw);
  const id = toStringValue(payload.id) || crypto.randomUUID();
  const url = toStringValue(payload.url);
  const isMalicious = toBoolean(payload.is_malicious ?? payload.isMalicious);
  const confidence = toNumber(payload.confidence);
  const predictedBy = toStringValue(payload.model_used ?? payload.model ?? payload.source ?? 'SEMD');
  const responseTime = toNumber(payload.response_time ?? payload.responseTime);
  const createdAt = toStringValue(payload.predicted_at ?? payload.created_at ?? payload.createdAt) || new Date().toISOString();
  const status = inferStatus(isMalicious, confidence);

  return {
    id,
    url,
    isMalicious,
    confidence,
    status,
    recommendation: buildRecommendation(status),
    predictedBy,
    responseTime,
    createdAt,
    details: Object.entries(payload).reduce<Record<string, string | number | boolean | null>>((acc, [key, value]) => {
      if (['string', 'number', 'boolean'].includes(typeof value) || value === null) {
        acc[key] = value as string | number | boolean | null;
      }
      return acc;
    }, {}),
  };
}

function persistPrediction(prediction: PredictionResult) {
  if (!canUseSessionStorage()) {
    return;
  }

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(prediction));
}

function readPersistedPrediction(id: string): PredictionResult | null {
  if (!canUseSessionStorage()) {
    return null;
  }

  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    const parsed = JSON.parse(stored) as PredictionResult;
    return parsed.id === id ? parsed : null;
  } catch {
    return null;
  }
}

export const scanService = {
  async predictUrl(url: string): Promise<{ prediction: PredictionResult }> {
    try {
      const response = await api.predictPredictionPredictPost({ url });
      const prediction = normalizePrediction(response.data.data);
      persistPrediction(prediction);
      return { prediction };
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async getPredictionResult(id: string): Promise<PredictionResult> {
    const cached = readPersistedPrediction(id);
    if (cached) {
      return cached;
    }

    try {
      const response = await api.getPredictionDetailStatPredictionDetailGet();
      const match = response.data.data.find((item) => item.id === id);

      if (!match) {
        throw new Error('ไม่พบผลการตรวจสอบที่ร้องขอ');
      }

      const prediction = normalizePrediction(match);
      persistPrediction(prediction);
      return prediction;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async checkHealth(): Promise<{ status: string }> {
    try {
      const response = await api.healthCheckHealthGet();
      return { status: response.data.status || 'ok' };
    } catch (error) {
      throw normalizeError(error);
    }
  },
};
