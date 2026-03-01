import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { PaginatedResponse } from '@/types/api.types';
import {
  UserProfile,
  UpdateProfileRequest,
  ApiAccessKey,
  CreateApiKeyRequest,
  ApiAccessCode,
} from '@/types/user.types';

export const userService = {
  async getProfile(): Promise<UserProfile> {
    return await apiClient.get<UserProfile>(API_ENDPOINTS.USER.PROFILE);
  },
  
  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    return await apiClient.put<UserProfile>(
      API_ENDPOINTS.USER.UPDATE_PROFILE,
      data
    );
  },
  
  async getUsers(params?: {
    page?: number;
    pageSize?: number;
    role?: string;
  }): Promise<PaginatedResponse<UserProfile>> {
    return await apiClient.get<PaginatedResponse<UserProfile>>(
      API_ENDPOINTS.USER.LIST,
      { params }
    );
  },
  
  async getUser(id: string): Promise<UserProfile> {
    return await apiClient.get<UserProfile>(API_ENDPOINTS.USER.GET(id));
  },
  
  async updateUser(
    id: string,
    data: Partial<UserProfile>
  ): Promise<UserProfile> {
    return await apiClient.put<UserProfile>(
      API_ENDPOINTS.USER.UPDATE(id),
      data
    );
  },
  
  async deleteUser(id: string): Promise<void> {
    return await apiClient.delete(API_ENDPOINTS.USER.DELETE(id));
  },
};

export const apiAccessService = {
  async getApiKeys(): Promise<ApiAccessKey[]> {
    return await apiClient.get<ApiAccessKey[]>(API_ENDPOINTS.API_ACCESS.LIST);
  },
  
  async createApiKey(data: CreateApiKeyRequest): Promise<ApiAccessKey> {
    return await apiClient.post<ApiAccessKey>(
      API_ENDPOINTS.API_ACCESS.CREATE,
      data
    );
  },
  
  async getApiKey(id: string): Promise<ApiAccessKey> {
    return await apiClient.get<ApiAccessKey>(
      API_ENDPOINTS.API_ACCESS.GET(id)
    );
  },
  
  async revokeApiKey(id: string): Promise<void> {
    return await apiClient.post(API_ENDPOINTS.API_ACCESS.REVOKE(id));
  },
  
  async regenerateApiKey(id: string): Promise<ApiAccessKey> {
    return await apiClient.post<ApiAccessKey>(
      API_ENDPOINTS.API_ACCESS.REGENERATE(id)
    );
  },
};
