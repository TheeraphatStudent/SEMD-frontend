import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL } from '@/constants/api-endpoints';
import { APP_CONFIG } from '@/constants/config';
import { ApiResponse, ApiError } from '@/types/api.types';

class ApiClient {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    this.setupInterceptors();
  }
  
  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        const apiKey = this.getApiKey();
        if (apiKey) {
          config.headers['x-api-key'] = apiKey;
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          this.clearAuth();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        
        return Promise.reject(this.handleError(error));
      }
    );
  }
  
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(APP_CONFIG.TOKEN_KEY);
  }
  
  private getApiKey(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('semd_api_key');
  }
  
  private clearAuth(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(APP_CONFIG.TOKEN_KEY);
    localStorage.removeItem(APP_CONFIG.REFRESH_TOKEN_KEY);
    localStorage.removeItem(APP_CONFIG.USER_KEY);
  }
  
  private handleError(error: any): ApiError {
    if (error.response) {
      return {
        message: error.response.data?.message || error.response.data?.error || 'เกิดข้อผิดพลาด',
        code: error.response.data?.code,
        status: error.response.status,
        details: error.response.data,
      };
    } else if (error.request) {
      return {
        message: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
        code: 'NETWORK_ERROR',
      };
    } else {
      return {
        message: error.message || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ',
        code: 'UNKNOWN_ERROR',
      };
    }
  }
  
  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.get(url, config);
    return response.data.data || response.data as any;
  }
  
  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.post(url, data, config);
    return response.data.data || response.data as any;
  }
  
  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.put(url, data, config);
    return response.data.data || response.data as any;
  }
  
  public async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.patch(url, data, config);
    return response.data.data || response.data as any;
  }
  
  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.delete(url, config);
    return response.data.data || response.data as any;
  }
  
  public setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(APP_CONFIG.TOKEN_KEY, token);
  }
  
  public setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(APP_CONFIG.REFRESH_TOKEN_KEY, token);
  }
}

export const apiClient = new ApiClient();
