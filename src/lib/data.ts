// Seed data getters. These return the JSON as committed; live (mutable) state lives in the store.
import type { AccessPoint, Match, PatientProfile, Provider, Requirement } from '../types';
import providersJson from '../data/providers.json';
import accessPointsJson from '../data/accessPoints.json';
import patientsJson from '../data/patients.json';
import requirementsJson from '../data/requirements.json';

const providers = providersJson as Provider[];
const accessPoints = accessPointsJson as AccessPoint[];
const patients = patientsJson as PatientProfile[];
const seed = requirementsJson as { requirements: Requirement[]; matches: Match[] };

export function getProviders(): Provider[] {
  return providers;
}

export function getProvider(id: string): Provider | undefined {
  return providers.find((p) => p.id === id);
}

export function getAccessPoints(): AccessPoint[] {
  return accessPoints;
}

export function getPatients(): PatientProfile[] {
  return patients;
}

export function getSeedRequirements(): Requirement[] {
  return seed.requirements;
}

export function getSeedMatches(): Match[] {
  return seed.matches;
}
