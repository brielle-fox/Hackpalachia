import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Appointment, DemoFlags, Match, PatientProfile, Provider, Requirement, ResourceOffer, Role,
} from '../types';
import { getPatients, getProviders, getSeedMatches, getSeedRequirements } from './data';

interface AppState {
  role: Role | null;
  currentPatientId: string | null;        // defaults to the demo persona
  currentProviderId: string | null;       // chosen on Landing from a dropdown
  providers: Provider[];                  // seeded from JSON; mutable (confirm accepting, edit resources)
  requirements: Requirement[];
  matches: Match[];
  appointments: Appointment[];
  patients: PatientProfile[];
  flags: DemoFlags;
  // actions
  setRole(r: Role | null): void;
  setCurrentPatient(id: string | null): void;   // kiosk sign-out clears this without resetDemo()
  setCurrentProvider(id: string): void;
  setFlag<K extends keyof DemoFlags>(k: K, v: boolean): void;
  confirmAccepting(providerId: string, accepting: boolean): void;   // sets lastConfirmedDaysAgo = 0
  updateProviderResources(providerId: string, resources: ResourceOffer[]): void;
  upsertRequirement(r: Requirement): void;
  saveMatches(reqId: string, m: Match[]): void;
  acceptMatch(matchId: string): void;    // → requirement.status = 'scheduled'
  declineMatch(matchId: string): void;
  bookAppointment(a: Appointment): void;
  connectPortal(patientId: string): void;
  resetDemo(): void;                     // reseed everything (incl. seed matches) from JSON
}

const NO_FLAGS: DemoFlags = {
  noHomeInternet: false,
  providerCancelled: false,
  patientDistrustful: false,
  staleListings: false,
};

// Deep-copied so mutating store data can never touch the imported JSON modules.
function seedState() {
  const patients = structuredClone(getPatients());
  return {
    role: null as Role | null,
    currentPatientId: patients[0]?.id ?? null,
    currentProviderId: null as string | null,
    providers: structuredClone(getProviders()),
    requirements: structuredClone(getSeedRequirements()),
    matches: structuredClone(getSeedMatches()),
    appointments: [] as Appointment[],
    patients,
    flags: { ...NO_FLAGS },
  };
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      ...seedState(),

      setRole: (role) => set({ role }),
      setCurrentPatient: (currentPatientId) => set({ currentPatientId }),
      setCurrentProvider: (currentProviderId) => set({ currentProviderId }),
      setFlag: (k, v) => set((s) => ({ flags: { ...s.flags, [k]: v } })),

      confirmAccepting: (providerId, accepting) =>
        set((s) => ({
          providers: s.providers.map((p) =>
            p.id === providerId ? { ...p, acceptingNewPatients: accepting, lastConfirmedDaysAgo: 0 } : p,
          ),
        })),

      updateProviderResources: (providerId, resources) =>
        set((s) => ({
          providers: s.providers.map((p) => (p.id === providerId ? { ...p, resources } : p)),
        })),

      upsertRequirement: (r) =>
        set((s) => {
          const exists = s.requirements.some((x) => x.id === r.id);
          return {
            requirements: exists ? s.requirements.map((x) => (x.id === r.id ? r : x)) : [...s.requirements, r],
          };
        }),

      saveMatches: (reqId, m) =>
        set((s) => ({
          matches: [...s.matches.filter((x) => x.requirementId !== reqId), ...m],
          requirements: s.requirements.map((r) =>
            r.id === reqId && m.length > 0 && r.status === 'open' ? { ...r, status: 'matched' } : r,
          ),
        })),

      acceptMatch: (matchId) =>
        set((s) => {
          const match = s.matches.find((x) => x.id === matchId);
          if (!match) return {};
          return {
            matches: s.matches.map((x) => {
              if (x.id === matchId) return { ...x, status: 'accepted' };
              if (x.requirementId === match.requirementId && x.status === 'proposed') return { ...x, status: 'declined' };
              return x;
            }),
            requirements: s.requirements.map((r) =>
              r.id === match.requirementId ? { ...r, status: 'scheduled', matchId } : r,
            ),
          };
        }),

      declineMatch: (matchId) =>
        set((s) => ({ matches: s.matches.map((x) => (x.id === matchId ? { ...x, status: 'declined' } : x)) })),

      bookAppointment: (a) => set((s) => ({ appointments: [...s.appointments, a] })),

      connectPortal: (patientId) =>
        set((s) => ({
          patients: s.patients.map((p) => (p.id === patientId ? { ...p, portalConnected: true } : p)),
        })),

      resetDemo: () => set(seedState()),
    }),
    {
      name: 'hub-demo-v1',
      // Bump whenever seed JSON changes so browsers with an older saved demo reseed instead of
      // showing stale data. v2: real WS2 providers/access points + WS3 personas.
      version: 2,
      migrate: () => seedState() as unknown as AppState,
    },
  ),
);

/** Providers with the 🗂 staleListings flag applied (every third one shows 45 days). Derived only; never stored. */
export function useEffectiveProviders(): Provider[] {
  const providers = useStore((s) => s.providers);
  const stale = useStore((s) => s.flags.staleListings);
  return useMemo(
    () => (stale ? providers.map((p, i) => (i % 3 === 0 ? { ...p, lastConfirmedDaysAgo: 45 } : p)) : providers),
    [providers, stale],
  );
}
