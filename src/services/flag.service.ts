import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { PaginatedResponse } from '@/types/api.types';
import { UrlFlag } from '@/types/scan.types';

export const flagService = {
  async getFlags(params?: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<UrlFlag>> {
    return await apiClient.get<PaginatedResponse<UrlFlag>>(
      API_ENDPOINTS.FLAG.LIST,
      { params }
    );
  },
  
  async createFlag(data: {
    url: string;
    isMalicious: boolean;
    reason: string;
  }): Promise<UrlFlag> {
    return await apiClient.post<UrlFlag>(
      API_ENDPOINTS.FLAG.CREATE,
      data
    );
  },
  
  async getFlag(id: string): Promise<UrlFlag> {
    return await apiClient.get<UrlFlag>(
      API_ENDPOINTS.FLAG.GET(id)
    );
  },
  
  async updateFlag(
    id: string,
    data: Partial<UrlFlag>
  ): Promise<UrlFlag> {
    return await apiClient.put<UrlFlag>(
      API_ENDPOINTS.FLAG.UPDATE(id),
      data
    );
  },
  
  async deleteFlag(id: string): Promise<void> {
    return await apiClient.delete(API_ENDPOINTS.FLAG.DELETE(id));
  },
};
