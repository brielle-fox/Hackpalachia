// ───────── basics ─────────
export type Role = 'patient' | 'provider';
export interface LatLng { lat: number; lng: number }

export type County =
  | 'Athens' | 'Meigs' | 'Vinton' | 'Hocking' | 'Perry' | 'Morgan' | 'Washington';

export type ServiceType =
  | 'primary_care' | 'dental' | 'behavioral_health' | 'womens_health'
  | 'pediatrics' | 'urgent_care' | 'pharmacy' | 'eye_care'
  | 'diabetes_care' | 'specialty';

export type Insurance = 'medicaid' | 'medicare' | 'private' | 'sliding_scale';

export type CareMode = 'in_person' | 'telehealth_home' | 'telehealth_access_point';

// ───────── trust ─────────
export interface Review {
  id: string;
  author: string;            // e.g. "Neighbor from Nelsonville" (never a real name)
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  daysAgo: number;
}
export interface TrustInfo {
  verifiedBy: string[];      // e.g. ["Athens City-County Health Dept"] (simulated)
  rating?: number;           // average, 1–5
  reviewCount?: number;
  reviews?: Review[];
}

// ───────── providers ─────────
export type OrgType =
  | 'hospital' | 'fqhc' | 'clinic' | 'health_department'
  | 'behavioral_health' | 'mobile_unit' | 'pharmacy' | 'dental';

export type ResourceKind = 'equipment' | 'personnel' | 'location';

export interface ResourceOffer {
  id: string;
  providerId: string;
  kind: ResourceKind;
  label: string;             // e.g. "Portable retinal camera", "Registered nurse", "Mobile clinic van"
  detail?: string;
  availableDays?: string[];  // e.g. ["Tue","Thu"]
}

export interface Provider {
  id: string;                // kebab-case slug, e.g. "ohiohealth-obleness"
  name: string;              // REAL name
  orgType: OrgType;
  address: string;           // REAL address
  town: string;
  county: County;
  location: LatLng;          // REAL coordinates (5 decimals)
  phone?: string;
  website?: string;
  hours?: string;
  services: ServiceType[];
  insurances: Insurance[];
  // simulated fields ↓ (see SIMULATED_NOTE)
  acceptingNewPatients: boolean;
  lastConfirmedDaysAgo: number;
  offersTelehealth: boolean;
  trust: TrustInfo;
  resources: ResourceOffer[];
  // provenance ↓
  dataSource: string;        // where the real name/address came from (URL)
}

// ───────── telehealth access points ─────────
export type AccessPointKind = 'library' | 'church' | 'community_center' | 'senior_center';

export interface AccessPoint {
  id: string;
  name: string;              // REAL public place
  kind: AccessPointKind;
  address: string;
  town: string;
  county: County;
  location: LatLng;
  hours: string;
  // simulated ↓
  status: 'proposed_partner' | 'active';
  hasPrivateRoom: boolean;
  hasHelper: boolean;        // staff or volunteer can help with the call
  devices: number;
  openSlots: string[];       // ISO-ish local strings, e.g. "2026-11-19T10:00"
  lastConfirmedDaysAgo: number;
  dataSource: string;
}

// ───────── patients (fictional only) ─────────
export interface PatientProfile {
  id: string;
  displayName: string;       // fictional
  age: number;
  town: string;
  location: LatLng;          // town-centre coords, never a home address
  insurance: Insurance;
  hasHomeInternet: boolean;
  portalConnected: boolean;  // mocked MyChart connection
  needs: ServiceType[];
}

// ───────── provider requirements & matching ─────────
export interface RequirementNeed {
  kind: ResourceKind;
  label: string;             // free text, matched case-insensitively against ResourceOffer.label
}

export type RequirementStatus = 'open' | 'matched' | 'scheduled' | 'cancelled';

export interface Requirement {
  id: string;
  createdByProviderId: string;
  patientRef: string;        // de-identified, e.g. "Patient #A-104"
  serviceType: ServiceType;
  needs: RequirementNeed[];  // what the creator is MISSING
  nearTown: string;          // where care should happen
  nearLocation: LatLng;
  windowStart: string;       // "2026-11-18"
  windowEnd: string;
  status: RequirementStatus;
  matchId?: string;
  note?: string;
}

export interface NeedCoverage {
  need: RequirementNeed;
  providerId: string;
  resourceId: string;
}

export interface Match {
  id: string;
  requirementId: string;
  partnerProviderIds: string[];
  coverage: NeedCoverage[];
  uncovered: RequirementNeed[];
  score: number;             // 0–100
  approxDriveMinutes: number;// partner(s) → nearLocation, worst case
  proposedSiteName: string;  // e.g. a library or the creator's clinic
  status: 'proposed' | 'accepted' | 'declined';
}

// ───────── appointments ─────────
export interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  accessPointId?: string;    // set when mode = telehealth_access_point
  mode: CareMode;
  datetime: string;
  status: 'booked' | 'cancelled';
}

// ───────── demo controls ─────────
export interface DemoFlags {
  noHomeInternet: boolean;       // 📶 patient has no internet at home
  providerCancelled: boolean;    // ❄️ partner/van cancelled (snow, roads)
  patientDistrustful: boolean;   // 🤔 patient unsure about trusting the provider
  staleListings: boolean;        // 🗂 force some listings to be 30+ days stale
}

// ───────── cross-workstream function signatures ─────────
// WS1 creates stubs with these exact signatures; WS4/WS5 replace the bodies.
export type MatchRequirementFn = (
  req: Requirement, providers: Provider[], flags: DemoFlags
) => Match[];                    // sorted best-first

export interface CareModeSuggestion {
  recommended: CareMode;
  reason: string;                // plain-language, shown to the patient
  accessPoint?: AccessPoint;     // nearest suitable, when recommended = telehealth_access_point
  alternatives: CareMode[];
}
export type SuggestCareModeFn = (
  patient: PatientProfile, provider: Provider, service: ServiceType,
  accessPoints: AccessPoint[], flags: DemoFlags
) => CareModeSuggestion;
