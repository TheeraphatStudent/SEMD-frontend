import axios, { type AxiosError } from 'axios';

export type NormalizedErrorCode =
  | 'validation'
  | 'authentication'
  | 'permission'
  | 'rate_limit'
  | 'server'
  | 'network'
  | 'timeout'
  | 'unknown';

export interface NormalizedError {
  code: NormalizedErrorCode;
  message: string;
  status?: number;
}

const DEFAULT_MESSAGES: Record<NormalizedErrorCode, string> = {
  validation: 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบและลองอีกครั้ง',
  authentication: 'เซสชันไม่ถูกต้องหรือหมดอายุ กรุณาเข้าสู่ระบบใหม่',
  permission: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลหรือดำเนินการนี้',
  rate_limit: 'มีการเรียกใช้งานมากเกินไป กรุณาลองใหม่ในภายหลัง',
  server: 'ระบบเกิดข้อผิดพลาดภายใน กรุณาลองใหม่อีกครั้ง',
  network: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบเครือข่าย',
  timeout: 'การเชื่อมต่อใช้เวลานานเกินไป กรุณาลองใหม่',
  unknown: 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ',
};

function getErrorMessage(error: AxiosError<any>, fallbackCode: NormalizedErrorCode) {
  const responseMessage =
    typeof error.response?.data?.message === 'string'
      ? error.response.data.message
      : undefined;

  if (responseMessage) {
    const normalizedMessage = responseMessage.toLowerCase();

    if (normalizedMessage.includes('token expired')) {
      return 'เซสชันของคุณหมดอายุแล้ว กรุณาเข้าสู่ระบบอีกครั้งเพื่อดำเนินการต่อ';
    }

    if (normalizedMessage.includes('invalid url') || normalizedMessage.includes('url format')) {
      return 'เราไม่สามารถตรวจสอบ URL นี้ได้ เพราะรูปแบบ URL ไม่ถูกต้อง กรุณาตรวจสอบแล้วลองใหม่อีกครั้ง';
    }

    if (normalizedMessage.includes('invalid credentials')) {
      return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบและลองอีกครั้ง';
    }

    return responseMessage;
  }

  return DEFAULT_MESSAGES[fallbackCode];
}

export function normalizeError(error: unknown): NormalizedError {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return { code: 'timeout', message: DEFAULT_MESSAGES.timeout };
    }

    if (!error.response) {
      return { code: 'network', message: DEFAULT_MESSAGES.network };
    }

    const status = error.response.status;

    if (status === 400 || status === 422) {
      return { code: 'validation', status, message: getErrorMessage(error, 'validation') };
    }

    if (status === 401) {
      return { code: 'authentication', status, message: getErrorMessage(error, 'authentication') };
    }

    if (status === 403) {
      return { code: 'permission', status, message: getErrorMessage(error, 'permission') };
    }

    if (status === 429) {
      return { code: 'rate_limit', status, message: getErrorMessage(error, 'rate_limit') };
    }

    if (status >= 500) {
      return { code: 'server', status, message: getErrorMessage(error, 'server') };
    }

    return { code: 'unknown', status, message: getErrorMessage(error, 'unknown') };
  }

  if (error instanceof Error) {
    return { code: 'unknown', message: error.message || DEFAULT_MESSAGES.unknown };
  }

  return { code: 'unknown', message: DEFAULT_MESSAGES.unknown };
}
