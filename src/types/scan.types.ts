export interface PredictionRequest {
  url: string;
}

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
