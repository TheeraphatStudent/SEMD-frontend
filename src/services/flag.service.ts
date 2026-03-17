import * as api from '@/services/generated/semdApi';
import type {
  UrlFlagCreateRequest,
  UrlFlagUpdateRequest,
  GetAllFlagsSettingUrlFlagGetParams,
  GetMyFlagsSettingUrlFlagMeGetParams,
} from '@/services/generated/models';
import type { FlagRow } from '@/libs/utils/row';
import type { Verdict } from '@/libs/utils/types';

export interface UrlFlagData {
  id: number;
  url: string;
  type: string;
  access_level: string;
  flagged_at: string;
  flagged_by: string;
  status?: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

const mapFlagTypeToVerdict = (type: string): Verdict => {
  return type === 'MALICIOUS' ? 'Malicious' : 'Benign';
};

const mapToFlagRow = (data: UrlFlagData): FlagRow => ({
  id: data.id,
  url: data.url,
  date: data.flagged_at,
  flag: mapFlagTypeToVerdict(data.type),
  action: String(data.id),
});

export const flagService = {
  async getAllFlags(params?: GetAllFlagsSettingUrlFlagGetParams): Promise<FlagRow[]> {
    const result = await api.getAllFlagsSettingUrlFlagGet(params);
    const flags = (result.data || []) as UrlFlagData[];
    return flags.map(mapToFlagRow);
  },

  async getMyFlags(params?: GetMyFlagsSettingUrlFlagMeGetParams): Promise<FlagRow[]> {
    const result = await api.getMyFlagsSettingUrlFlagMeGet(params);
    const flags = (result.data || []) as UrlFlagData[];
    return flags.map(mapToFlagRow);
  },

  async getFlagById(flagId: number): Promise<UrlFlagData | null> {
    const result = await api.getFlagByIdSettingUrlFlagFlagIdGet(flagId);
    return result.data as UrlFlagData | null;
  },

  async createFlag(data: UrlFlagCreateRequest): Promise<UrlFlagData> {
    const result = await api.createFlagSettingUrlFlagPost(data);
    return result.data as UrlFlagData;
  },

  async updateFlag(flagId: number, data: UrlFlagUpdateRequest): Promise<UrlFlagData> {
    const result = await api.updateFlagSettingUrlFlagFlagIdPut(flagId, data);
    return result.data as UrlFlagData;
  },

  async deleteFlag(flagId: number): Promise<void> {
    await api.deleteFlagSettingUrlFlagFlagIdDelete(flagId);
  },
};

export type { UrlFlagCreateRequest, UrlFlagUpdateRequest };
