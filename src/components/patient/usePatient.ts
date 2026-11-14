import { useEffect } from 'react';
import { useStore } from '../../lib/store';
import type { PatientProfile } from '../../types';

/**
 * The current patient (always patients[0] in the demo). Deep links straight into /patient/* still
 * work: if no role is set yet, this sets role = patient so the header pill shows.
 */
export function usePatient(): PatientProfile {
  const patient = useStore((s) => s.patients.find((p) => p.id === s.currentPatientId) ?? s.patients[0]);
  const role = useStore((s) => s.role);
  const setRole = useStore((s) => s.setRole);
  const setCurrentPatient = useStore((s) => s.setCurrentPatient);
  useEffect(() => {
    if (role !== 'patient') {
      setRole('patient');
      setCurrentPatient(patient.id);
    }
  }, [role, patient.id, setRole, setCurrentPatient]);
  return patient;
}

/** "No internet at home" = profile says so OR the 📶 demo flag is on. Never mutates the profile. */
export function useNoHomeInternet(patient: PatientProfile): boolean {
  const flag = useStore((s) => s.flags.noHomeInternet);
  return !patient.hasHomeInternet || flag;
}
