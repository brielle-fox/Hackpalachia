// WS5 — automatic care-mode suggestion (pure function, no store access).
import type {
  AccessPoint, CareMode, CareModeSuggestion, PatientProfile, Provider, ServiceType, SuggestCareModeFn,
} from '../types';
import { approxDriveMinutes, formatDrive } from './geo';

/** Services that can reasonably happen over video. Others need equipment or hands-on care. */
export const TELEHEALTH_ELIGIBLE: ServiceType[] = ['behavioral_health', 'primary_care', 'diabetes_care', 'pharmacy'];

/** In person is treated as infeasible beyond this drive time (minutes). */
export const MAX_REASONABLE_DRIVE = 45;

const KIND_WORD: Record<AccessPoint['kind'], string> = {
  library: 'library', church: 'church', community_center: 'community center', senior_center: 'senior center',
};

/** Nearest access point with a private room; ties → helper on site → has open slots. */
export function nearestAccessPoint(patient: PatientProfile, accessPoints: AccessPoint[]): AccessPoint | undefined {
  return accessPoints
    .filter(a => a.hasPrivateRoom && (a.status === 'active' || a.status === 'proposed_partner'))
    .map(a => ({ a, d: approxDriveMinutes(patient.location, a.location) }))
    .sort((x, y) =>
      x.d - y.d
      || Number(y.a.hasHelper) - Number(x.a.hasHelper)
      || Number(y.a.openSlots.length > 0) - Number(x.a.openSlots.length > 0))[0]?.a;
}

function accessPointReason(ap: AccessPoint, patient: PatientProfile, lead: string): string {
  const drive = approxDriveMinutes(patient.location, ap.location);
  const help = ap.hasHelper ? ', staff can help you connect' : '';
  const where = drive < 3 ? `Right in ${ap.town}` : formatDrive(drive);
  return `${lead} You can do this visit at ${ap.name}: private room${help}. ${where}.`;
}

export const suggestCareMode: SuggestCareModeFn = (patient, provider, service, accessPoints, flags): CareModeSuggestion => {
  const drive = approxDriveMinutes(patient.location, provider.location);
  const canVideoAtHome = patient.hasHomeInternet && !flags.noHomeInternet;
  const ap = nearestAccessPoint(patient, accessPoints);
  const inPersonInfeasible = flags.providerCancelled || drive > MAX_REASONABLE_DRIVE;
  const eligible = TELEHEALTH_ELIGIBLE.includes(service);

  // 1. Hands-on visits must be in person.
  if (!eligible) {
    const extra = inPersonInfeasible ? " We'll flag this to your provider so they can find a closer option." : '';
    return {
      recommended: 'in_person',
      reason: `This visit needs equipment at the clinic, so it has to be in person. ${formatDrive(drive)}.${extra}`,
      alternatives: [],
    };
  }

  const telehealthModes: CareMode[] = [
    ...(canVideoAtHome ? (['telehealth_home'] as CareMode[]) : []),
    ...(ap ? (['telehealth_access_point'] as CareMode[]) : []),
  ];

  // 2. In person can't happen (cancelled / too far) → best telehealth option.
  if (inPersonInfeasible) {
    const lead = flags.providerCancelled
      ? "Your provider can't make it in person today (weather or roads)."
      : `The clinic is about ${drive} minutes away.`;
    if (canVideoAtHome) {
      return {
        recommended: 'telehealth_home',
        reason: flags.providerCancelled
          ? `${lead} You can see them by video from home instead.`
          : `${lead} A video visit from home saves you the drive.`,
        alternatives: ap ? ['telehealth_access_point'] : [],
      };
    }
    if (ap) {
      return {
        recommended: 'telehealth_access_point',
        reason: accessPointReason(ap, patient, flags.providerCancelled ? `${lead} No internet at home?` : 'No internet at home?'),
        accessPoint: ap,
        alternatives: flags.providerCancelled ? [] : ['in_person'],
      };
    }
    return {
      recommended: 'in_person',
      reason: "We couldn't find a private telehealth room nearby. Call the clinic and they'll help.",
      alternatives: [],
    };
  }

  // 3. No home internet, and a private room nearby is closer than the clinic → offer it first.
  if (!canVideoAtHome && ap && approxDriveMinutes(patient.location, ap.location) < drive) {
    return {
      recommended: 'telehealth_access_point',
      reason: accessPointReason(ap, patient, 'No internet at home?'),
      accessPoint: ap,
      alternatives: ['in_person'],
    };
  }

  // 4. In person is fine.
  return {
    recommended: 'in_person',
    reason: provider.offersTelehealth && telehealthModes.length
      ? `You can see ${provider.name} in person, ${formatDrive(drive)}. Video is also available.`
      : `You can see ${provider.name} in person, ${formatDrive(drive)}.`,
    alternatives: provider.offersTelehealth ? telehealthModes : [],
  };
};

/** "2026-11-19T10:00" → "Thu 10:00 AM" (local, no timezone math). */
export function formatSlot(slot: string): string {
  const m = slot.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return slot;
  const d = new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  const day = d.toLocaleDateString('en-US', { weekday: 'short' });
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${day} ${time}`;
}

export { KIND_WORD };

// ── dev-only sanity checks ──
if (import.meta.env?.DEV) {
  const p: PatientProfile = {
    id: 't', displayName: 't', age: 52, town: 'Glouster', location: { lat: 39.50313, lng: -82.08459 },
    insurance: 'medicaid', hasHomeInternet: true, portalConnected: false, needs: [],
  };
  const prov = { id: 'x', name: 'Clinic', location: { lat: 39.37009, lng: -82.13237 }, offersTelehealth: true } as Provider;
  const ap: AccessPoint = {
    id: 'ap', name: 'Glouster Public Library', kind: 'library', address: '', town: 'Glouster', county: 'Athens',
    location: { lat: 39.50015, lng: -82.08723 }, hours: '', status: 'proposed_partner', hasPrivateRoom: true,
    hasHelper: true, devices: 2, openSlots: ['2026-11-19T10:00'], lastConfirmedDaysAgo: 1, dataSource: '',
  };
  const off = { noHomeInternet: false, providerCancelled: false, patientDistrustful: false, staleListings: false };
  console.assert(suggestCareMode(p, prov, 'primary_care', [ap], off).recommended === 'in_person', 'telehealth: default in person');
  console.assert(suggestCareMode(p, prov, 'primary_care', [ap], { ...off, noHomeInternet: true }).recommended === 'telehealth_access_point', 'telehealth: no internet → AP');
  console.assert(suggestCareMode(p, prov, 'primary_care', [ap], { ...off, providerCancelled: true }).recommended === 'telehealth_home', 'telehealth: cancelled → home');
  console.assert(suggestCareMode(p, prov, 'eye_care', [ap], { ...off, noHomeInternet: true, providerCancelled: true }).recommended === 'in_person', 'telehealth: eye care in person');
}
