import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { PaginatedResponse } from '@/types/api.types';
import { ReportUrlRequest, ReportedUrl } from '@/types/scan.types';

export const reportService = {
  async createReport(data: ReportUrlRequest): Promise<ReportedUrl> {
    return await apiClient.post<ReportedUrl>(
      API_ENDPOINTS.REPORT.CREATE,
      data
    );
  },
  
  async getReports(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<PaginatedResponse<ReportedUrl>> {
    return await apiClient.get<PaginatedResponse<ReportedUrl>>(
      API_ENDPOINTS.REPORT.LIST,
      { params }
    );
  },
  
  async getReport(id: string): Promise<ReportedUrl> {
    return await apiClient.get<ReportedUrl>(
      API_ENDPOINTS.REPORT.GET(id)
    );
  },
  
  async updateReport(
    id: string,
    data: Partial<ReportedUrl>
  ): Promise<ReportedUrl> {
    return await apiClient.put<ReportedUrl>(
      API_ENDPOINTS.REPORT.UPDATE(id),
      data
    );
  },
  
  async deleteReport(id: string): Promise<void> {
    return await apiClient.delete(API_ENDPOINTS.REPORT.DELETE(id));
  },
};
