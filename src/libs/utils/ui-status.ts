import type { BadgeVariant } from '@/types/badge.types';

function normalizeValue(value: string | null | undefined) {
  return (value ?? '').trim().toLowerCase();
}

export function getPredictionStatusLabel(status: string | null | undefined) {
  const normalized = normalizeValue(status);

  if (normalized === 'safe' || normalized === 'benign') return 'ไม่พบสัญญาณอันตราย';
  if (normalized === 'malicious') return 'ตรวจพบความเสี่ยงสูง';
  if (normalized === 'suspicious') return 'ควรตรวจสอบเพิ่มเติม';
  if (normalized === 'pending') return 'กำลังรอผลการตรวจสอบ';
  if (normalized === 'submitting') return 'กำลังส่ง URL ไปตรวจสอบ';
  if (normalized === 'failed') return 'ยังไม่สามารถยืนยันความปลอดภัยได้';
  if (normalized === 'unknown' || normalized === 'idle') return 'พร้อมเริ่มตรวจสอบ';

  return 'ยังไม่สามารถยืนยันความปลอดภัยได้';
}

export function getPredictionStatusVariant(status: string | null | undefined): BadgeVariant {
  const normalized = normalizeValue(status);

  if (normalized === 'safe' || normalized === 'benign') return 'safe';
  if (normalized === 'malicious' || normalized === 'failed') return 'danger';
  if (normalized === 'suspicious' || normalized === 'pending' || normalized === 'submitting') return 'warning';
  return 'info';
}

export function getReportStatusLabel(status: string | null | undefined) {
  const normalized = normalizeValue(status);

  if (normalized === 'pending') return 'รอตรวจสอบ';
  if (normalized === 'in_review' || normalized === 'reviewing') return 'กำลังตรวจสอบ';
  if (normalized === 'accepted' || normalized === 'confirmed_malicious') return 'ยืนยันว่าอันตราย';
  if (normalized === 'confirmed_safe' || normalized === 'benign') return 'ยืนยันว่าปลอดภัย';
  if (normalized === 'rejected' || normalized === 'insufficient_data') return 'ข้อมูลไม่เพียงพอ';

  return status || 'ไม่ทราบสถานะ';
}

export function getReportStatusVariant(status: string | null | undefined): BadgeVariant {
  const normalized = normalizeValue(status);

  if (normalized === 'accepted' || normalized === 'confirmed_malicious') return 'danger';
  if (normalized === 'confirmed_safe' || normalized === 'benign') return 'safe';
  if (normalized === 'pending' || normalized === 'in_review' || normalized === 'reviewing') return 'warning';
  return 'info';
}

export function getFlagTypeLabel(type: string | null | undefined) {
  const normalized = normalizeValue(type);

  if (normalized === 'malicious') return 'เสี่ยงอันตราย';
  if (normalized === 'benign') return 'ปลอดภัย';

  return type || 'ไม่ระบุ';
}

export function getAclLabel(accessLevel: string | null | undefined) {
  const normalized = normalizeValue(accessLevel);

  if (normalized === 'private') return 'เฉพาะบัญชีของคุณ';
  if (normalized === 'global') return 'ใช้ร่วมทั้งระบบ';

  return accessLevel || 'ไม่ระบุ';
}

export function getBooleanLabel(value: boolean | null | undefined, labels: { trueLabel: string; falseLabel: string; unknownLabel?: string }) {
  if (value === true) return labels.trueLabel;
  if (value === false) return labels.falseLabel;
  return labels.unknownLabel || 'ไม่ระบุ';
}
