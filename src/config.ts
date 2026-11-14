export const APP_NAME = 'CareBridge';
export const DEMO_TODAY = '2026-11-14';
export const SIMULATED_NOTE =
  'Locations are real; availability, reviews and shared resources are simulated for this demo.';
export const REGION_CENTER = { lat: 39.3292, lng: -82.1013 }; // Athens, OH
export const REGION_ZOOM = 9;

export const DEMO_CAST = {
  patientId: 'p-linda',               // fictional persona in patients.json
  clinicProviderId: 'hopewell-the-plains',              // Linda's clinic: staff + exam room, NO retinal camera
  cameraPartnerId: 'ohiohealth-obleness',               // "Portable retinal camera" + technician
  backupPartnerId: 'hocking-valley-community-hospital', // second camera, farther (used on re-match)
  accessPointId: 'acpl-glouster',                       // Glouster library: private room + helper
  staleProviderId: 'genesis-primary-care-mcconnelsville', // seeded lastConfirmedDaysAgo: 45
} as const;
