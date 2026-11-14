// WS4: canonical resource label vocabulary (MASTER_PLAN Section 4). Keep in sync with providers.json.
import type { ResourceKind, ServiceType, RequirementStatus } from '../../types';

export const RESOURCE_VOCAB: Record<ResourceKind, string[]> = {
  equipment: ['Portable retinal camera', 'Mobile clinic van', 'Portable ultrasound', 'Telehealth cart', 'Point-of-care A1C analyzer', 'Portable dental unit', 'Vaccine cold storage'],
  personnel: ['Retinal imaging technician', 'Registered nurse', 'Nurse practitioner', 'Physician assistant', 'Medical assistant', 'Community health worker', 'Dental hygienist', 'Behavioral health counselor', 'Pharmacist'],
  location: ['Exam room', 'Private telehealth room', 'Community room (pop-up clinic)', 'Parking for mobile unit'],
};

export const KIND_META: Record<ResourceKind, { icon: string; label: string }> = {
  location: { icon: '📍', label: 'Location' },
  equipment: { icon: '🧰', label: 'Equipment' },
  personnel: { icon: '🧑‍⚕️', label: 'Personnel' },
};

export const SERVICE_LABEL: Record<ServiceType, string> = {
  primary_care: 'Primary care', dental: 'Dental', behavioral_health: 'Behavioral health', womens_health: "Women's health",
  pediatrics: 'Pediatrics', urgent_care: 'Urgent care', pharmacy: 'Pharmacy', eye_care: 'Eye care',
  diabetes_care: 'Diabetes care', specialty: 'Specialty',
};

export const STATUS_META: Record<RequirementStatus, { label: string; cls: string }> = {
  open: { label: 'Open', cls: 'bg-stone-100 text-stone-700 border-stone-300' },
  matched: { label: 'Matched', cls: 'bg-sky-50 text-sky-800 border-sky-300' },
  scheduled: { label: 'Scheduled', cls: 'bg-green-50 text-green-800 border-green-300' },
  cancelled: { label: 'Cancelled', cls: 'bg-red-50 text-red-700 border-red-300' },
};
