import type { CareMode, Insurance, OrgType, ServiceType } from '../../types';

export const SERVICE_LABEL: Record<ServiceType, string> = {
  primary_care: 'Primary care',
  diabetes_care: 'Diabetes care',
  dental: 'Dental',
  behavioral_health: 'Behavioral health',
  womens_health: 'Women’s health',
  pediatrics: 'Pediatrics',
  urgent_care: 'Urgent care',
  pharmacy: 'Pharmacy',
  eye_care: 'Eye care',
  specialty: 'Specialty care',
};
export const SERVICE_ORDER = Object.keys(SERVICE_LABEL) as ServiceType[];

export const ORG_LABEL: Record<OrgType, string> = {
  hospital: 'Hospital',
  fqhc: 'Health center (FQHC)',
  clinic: 'Clinic',
  health_department: 'Health department',
  behavioral_health: 'Behavioral health',
  mobile_unit: 'Mobile unit',
  pharmacy: 'Pharmacy',
  dental: 'Dental',
};

export const INSURANCE_LABEL: Record<Insurance, string> = {
  medicaid: 'Medicaid',
  medicare: 'Medicare',
  private: 'Private',
  sliding_scale: 'Sliding scale',
};

export const MODE_LABEL: Record<CareMode, string> = {
  in_person: 'In person',
  telehealth_home: 'Video from home',
  telehealth_access_point: 'Telehealth at a library',
};

/** "2026-11-19T10:00" parsed as local time (no timezone shifts). */
export function parseSlot(s: string): Date {
  const [d, t = '00:00'] = s.split('T');
  const [y, m, day] = d.split('-').map(Number);
  const [h, min] = t.split(':').map(Number);
  return new Date(y, m - 1, day, h, min);
}

export const fmtTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
export const fmtDayShort = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short' });
export const fmtDayLong = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

/** "Linda (fictional)" → "Linda" */
export const firstName = (displayName: string) => displayName.replace(/\s*\(.*\)$/, '').split(' ')[0];
