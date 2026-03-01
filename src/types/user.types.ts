import { Role } from '@/constants/config';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  role: Role;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface ApiAccessKey {
  id: string;
  key: string;
  name: string;
  userId: string;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  lastUsedAt?: string;
}

export interface CreateApiKeyRequest {
  name: string;
  expiresAt?: string;
}

export interface ApiAccessCode {
  id: string;
  code: string;
  name: string;
  userId: string;
  isActive: boolean;
  usageCount: number;
  maxUsage?: number;
  expiresAt?: string;
  createdAt: string;
}
