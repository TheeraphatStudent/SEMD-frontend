export type PredictionStatus =
  | 'idle'
  | 'validating'
  | 'submitting'
  | 'pending'
  | 'safe'
  | 'malicious'
  | 'suspicious'
  | 'unknown'
  | 'failed';

export interface PredictionRequest {
  url: string;
}

export interface PredictionResult {
  id: string;
  url: string;
  isMalicious: boolean | null;
  confidence: number | null;
  status: PredictionStatus;
  recommendation: string;
  predictedBy: string;
  responseTime: number | null;
  createdAt: string;
  details: Record<string, string | number | boolean | null>;
}

export interface PredictionResponse {
  prediction: PredictionResult;
  message: string;
}

export interface ReportUrlRequest {
  url: string;
  reason: string;
  description?: string;
}

export interface ReportedUrl {
  id: string;
  url: string;
  reason: string;
  description?: string;
  reportedBy: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface UrlFlag {
  id: string;
  url: string;
  isMalicious: boolean;
  reason: string;
  flaggedBy: string;
  createdAt: string;
  updatedAt: string;
}
