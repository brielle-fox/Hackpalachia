# [CareBridge] — Master Plan

> **Hackpalachia Rural Health Hackathon · Athens, OH · Sat Nov 14, 2026**
> Track: **Care Delivery** · Deliverables due **2:45 PM** (OneDrive) · Presenting from **3:00 PM**
>
> The product name is a placeholder. It lives in one constant (`APP_NAME` in `src/config.ts`), so renaming it later changes a single line.

---

## Contents
1. The product in one breath · 2. Tech stack · 3. Repository layout & ownership · 4. The contract (`types.ts`, helpers, demo cast, demo story, resource vocabulary, store) · 5. Team rules & timeline
6. **Workstreams**: WS1 Foundation · WS2 Real data & map · WS3 Patient side · WS4 Provider side · WS5 Telehealth & kiosk · WS6 Pitch & evidence
7. Demo script · 8. Failure switches · 9. Pitch outline · 10. Evidence bank · 11. Q&A prep · 12. Submission checklist · Appendix A: Real location seed list

---

## 0. How to use this file (read first)

1. **Everyone** reads Sections 1–5 (about 5 minutes). Together they are the shared contract.
2. Find your workstream in **Section 6**. Each one lists what you **own**, what you **must not touch**, what counts as **done**, and a **prompt to paste into your Claude**.
3. Give your Claude this whole file and say: *"I'm on Workstream N. Follow the prompt in that section."*
4. Work on your own branch (`ws<N>-<slug>`). Change **only the files your workstream owns**. If you need a change to a shared file (`types.ts`, `store.ts`, `App.tsx`), ask the **WS1 owner**, who makes it on `main`.
5. **WS1 merges first** (scaffold + contract + stubs). Everyone else branches off `main` *after* that merge.

---

## 1. The product in one breath

**One-sentence pitch:**
> For rural residents in and around Athens County, Ohio, [ProductName] helps people find a trusted provider who is actually accepting patients, and helps providers pool equipment, staff and space to deliver care, with telehealth at libraries and churches when home internet or travel gets in the way.

**Two separate sides, one website** (responsive; phone and desktop):

| | **Patient side** | **Provider side** |
|---|---|---|
| Who | Rural residents (pilot persona: adults aged 45–60 without a primary care provider) | Clinics, FQHCs, hospitals, health department, behavioral health orgs |
| Core job | **Search listings** "like online shopping": filter by service, accepting new patients, insurance, telehealth, distance | **Create requirements** for a patient they're already caring for (location + equipment + personnel), then **get matched** with partner providers who fill the gaps |
| Key features | Map of real nearby providers and telehealth access points · "Last confirmed X days ago" on every listing · trust signals (verified-by, neighbor reviews) · booking · **auto-telehealth** suggestion · mocked "Connect MyChart" | Dashboard · requirement builder · matching results (who covers which need) · shared-resource list · one-tap "Still accepting new patients?" confirmation · partner map |
| Device focus | Phone first | Desktop first |

**Telehealth access points:** public places (libraries, churches, community and senior centers) with a private room and a computer, so residents without home internet can still have a telehealth visit. Shown on the map and offered **automatically** when an in-person visit isn't feasible. Public computers get a **shared-computer mode** (`/kiosk`): large text, automatic sign-out, nothing saved.

**The two sides stay separate** in the code and in the UI. In the demo, the same fictional patient appears in both parts so the pitch tells one story (see Section 7).

**The insight behind it (judge input, cite by role):** people aged 45–60 in rural Facebook groups ask "does anyone know a primary care provider?" and get answers like "there's one at so-and-so but they don't take new patients." Information about who is accepting patients is scattered, stale and spread by word of mouth. Trust in large systems eroded during COVID. A single trusted third-party hub (potentially government-run) with **fresh** listings and **local trust signals** replaces that.

---

## 2. Tech stack (fixed; don't change without the WS1 owner)

| Concern | Choice | Notes |
|---|---|---|
| Build | **Vite + React + TypeScript** | `npm create vite@latest . -- --template react-ts` |
| Styling | **Tailwind CSS v4** | `@tailwindcss/vite` plugin; `@import "tailwindcss";` in `src/index.css` |
| Routing | **react-router-dom**, **`HashRouter`** | HashRouter means no server rewrites are needed and refreshing never 404s on Vercel |
| State | **zustand** with `persist` middleware (localStorage) | One store in `src/lib/store.ts`; includes a "Reset demo" action |
| Map | **leaflet + react-leaflet** | Match react-leaflet's major version to React (React 19 needs react-leaflet 5; React 18 needs react-leaflet 4). Free OpenStreetMap tiles, no API key. **Use `L.divIcon` markers** (colored circles or emoji) to avoid Vite's broken default marker images |
| Icons | `lucide-react` | Optional |
| Backend | **None.** Real public location data plus simulated availability in JSON | Login is fake: two buttons |
| Deploy | **Vercel** (or Netlify) from `main` | WS1 sets this up early so every merge produces a live URL |

**Run:** `npm install && npm run dev`. **Build check before merging:** `npm run build` must pass.

---

## 3. Repository layout and file ownership

```
/
├─ MASTER_PLAN.md                 (this file)
├─ index.html, vite.config.ts, package.json, tsconfig*.json      WS1
├─ public/
└─ src/
   ├─ main.tsx, App.tsx (routes), index.css                      WS1
   ├─ config.ts            APP_NAME, DEMO_TODAY, SIMULATED_NOTE    WS1
   ├─ types.ts             ★ THE CONTRACT ★                       WS1 (changes go through WS1)
   ├─ lib/
   │  ├─ store.ts          zustand store + demo flags             WS1
   │  ├─ data.ts           loads JSON, typed getters              WS1
   │  ├─ geo.ts            distance + drive-time estimate         WS2 (WS1 creates the stub)
   │  ├─ freshness.ts      "last confirmed" label/colour          WS3 (WS1 creates the stub)
   │  ├─ matching.ts       matchRequirement()                     WS4 (WS1 creates the stub)
   │  └─ telehealth.ts     suggestCareMode()                      WS5 (WS1 creates the stub)
   ├─ data/
   │  ├─ providers.json                                           WS2
   │  ├─ accessPoints.json                                        WS2
   │  ├─ requirements.json  { requirements: [], matches: [] }     WS4
   │  └─ patients.json      (fictional demo personas)             WS3
   ├─ components/
   │  ├─ ui/               Button, Card, Badge, Modal, Toggle     WS1
   │  ├─ Layout.tsx, RoleSwitcher.tsx, SimulatedFooter.tsx        WS1
   │  ├─ DemoPanel.tsx      failure toggles drawer                WS1
   │  ├─ map/MapView.tsx    reusable map + markers + legend       WS2
   │  ├─ patient/*          ListingCard, Filters, TrustBadges…    WS3
   │  ├─ provider/*         RequirementForm, MatchCard…           WS4
   │  └─ telehealth/*       AccessPointCard, CareModeBanner…      WS5 (WS1 stubs CareModeBanner)
   └─ pages/
      ├─ Landing.tsx                                              WS1
      ├─ patient/Search.tsx, Listing.tsx, Book.tsx, Confirmation.tsx   WS3
      ├─ patient/ConnectPortal.tsx                                WS5
      ├─ patient/AccessPoints.tsx                                 WS5
      ├─ provider/Dashboard.tsx, NewRequirement.tsx, Requirement.tsx   WS4
      └─ Kiosk.tsx                                                WS5
```

### Routes (WS1 registers all of them on day one; each page starts as a placeholder its owner replaces)

| Route | Page | Owner |
|---|---|---|
| `/` | Landing: "Continue as Patient" / "Continue as Provider" | WS1 |
| `/patient` | Search: list + map, filters | WS3 |
| `/patient/listing/:id` | Provider listing detail | WS3 |
| `/patient/book/:id` | Booking (uses `suggestCareMode`) | WS3 |
| `/patient/confirmation/:apptId` | Confirmation + mock text-message preview | WS3 |
| `/patient/telehealth` | Telehealth access points: map + list | WS5 |
| `/patient/connect` | Mocked "Connect your patient portal (e.g., MyChart)" | WS5 |
| `/provider` | Provider dashboard | WS4 |
| `/provider/requirements/new` | Requirement builder | WS4 |
| `/provider/requirements/:id` | Requirement detail + matches | WS4 |
| `/kiosk` | Shared-computer mode (library/church PC) | WS5 |

---

## 4. The contract: `src/types.ts`

WS1 commits this **exactly** as written. Other workstreams import from it and **never edit it on their branch**. If you need a field, ask the WS1 owner. Prefer adding optional fields to changing existing ones.

```ts
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
```

### Shared helpers (signatures are fixed; owners implement)

```ts
// src/lib/geo.ts (WS2)
export function milesBetween(a: LatLng, b: LatLng): number;          // haversine
export function approxDriveMinutes(a: LatLng, b: LatLng): number;    // miles × 1.3 road factor ÷ 40 mph × 60, rounded
export function formatDrive(mins: number): string;                   // "~25 min drive"

// src/lib/freshness.ts (WS3)
export function freshnessLabel(daysAgo: number): { text: string; tone: 'fresh' | 'aging' | 'stale' };
// 0 → "Confirmed today"; ≤7 fresh; 8–30 aging; >30 stale → "May be out of date · confirmed 45 days ago"

// src/lib/data.ts (WS1)
export function getProviders(): Provider[];
export function getProvider(id: string): Provider | undefined;
export function getAccessPoints(): AccessPoint[];
export function getPatients(): PatientProfile[];
export function getSeedRequirements(): Requirement[];   // requirements.json → .requirements
export function getSeedMatches(): Match[];              // requirements.json → .matches

// src/lib/store.ts (WS1)
export function useEffectiveProviders(): Provider[];   // providers with the 🗂 staleListings flag applied

// src/components/map/MapView.tsx (WS2): pass `origin` (patient or requirement location) so pins show drive times
// src/components/telehealth/CareModeBanner.tsx (WS5): props { suggestion: CareModeSuggestion; onChoose(mode: CareMode): void }
```

### Demo cast (`src/config.ts`; WS1 creates it with these ids, WS2 confirms them against Appendix A)

Every workstream and the demo script refer to the demo's key records **through this constant**, never by hard-coded ids.

```ts
export const DEMO_CAST = {
  patientId: 'p-linda',               // fictional persona in patients.json
  clinicProviderId: 'hopewell-the-plains',              // Linda's clinic: staff + exam room, NO retinal camera
  cameraPartnerId: 'ohiohealth-obleness',               // "Portable retinal camera" + technician
  backupPartnerId: 'hocking-valley-community-hospital', // second camera, farther (used on re-match)
  accessPointId: 'acpl-glouster',                       // Glouster library: private room + helper
  staleProviderId: 'genesis-primary-care-mcconnelsville', // seeded lastConfirmedDaysAgo: 45
} as const;
```

### Demo story data (canonical; WS2, WS3 and WS4 all follow this)

The pooling story is the user's original example: **one provider has the people and the room, another has the equipment.**

| Record | Who | Resources (exact labels) |
|---|---|---|
| `clinicProviderId` | Linda's clinic: `hopewell-the-plains` (a real FQHC site about 15 min from Glouster), `acceptingNewPatients: true`, takes Medicaid | personnel `Registered nurse`, personnel `Medical assistant`, location `Exam room`. **No** retinal camera, **no** technician |
| `cameraPartnerId` | `ohiohealth-obleness` (Athens hospital) | equipment `Portable retinal camera`, personnel `Retinal imaging technician`, equipment `Mobile clinic van` |
| `backupPartnerId` | `hocking-valley-community-hospital` (Logan; farther, used on ❄️ re-match) | equipment `Portable retinal camera`, personnel `Retinal imaging technician` |
| `staleProviderId` | `genesis-primary-care-mcconnelsville` | `lastConfirmedDaysAgo: 45` |
| `accessPointId` | `acpl-glouster` (Glouster Public Library) | `hasPrivateRoom: true`, `hasHelper: true` |
| `patientId` = `p-linda` | Fictional: 52, Glouster, Medicaid, type 2 diabetes, no primary care provider | `hasHomeInternet: true` (the 📶 switch takes it away live), `portalConnected: false`, `needs: ['primary_care','diabetes_care']`, Glouster town-centre coords |

**Demo requirement `req-demo`** (WS4 seeds it): created by the clinic for `Patient #A-104`, service `eye_care`, note "Annual diabetic eye exam: no retinal camera in-house", needs **equipment `Portable retinal camera` + personnel `Retinal imaging technician`**, near Glouster. Best match = the camera partner covering both needs, with the screening held in the clinic's own exam room. With ❄️ on, re-match returns the backup partner.

### Resource label vocabulary (canonical)

WS2 seeds providers with **only** these labels; WS4's requirement form offers exactly these and matches on them (case-insensitive).

| Kind | Labels |
|---|---|
| `equipment` | Portable retinal camera · Mobile clinic van · Portable ultrasound · Telehealth cart · Point-of-care A1C analyzer · Portable dental unit · Vaccine cold storage |
| `personnel` | Retinal imaging technician · Registered nurse · Nurse practitioner · Physician assistant · Medical assistant · Community health worker · Dental hygienist · Behavioral health counselor · Pharmacist |
| `location` | Exam room · Private telehealth room · Community room (pop-up clinic) · Parking for mobile unit |

### Store shape (`src/lib/store.ts`, WS1)

```ts
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
```

---

## 5. Team rules

**Git**
- `main` must always build. Merge only after `npm run build` passes.
- Branches: `ws1-foundation`, `ws2-data-map`, `ws3-patient`, `ws4-provider`, `ws5-telehealth`, `ws6-pitch`.
- **Merge order:** WS1 → WS2 (data) → everyone else, as soon as each is ready. Merge small and often. Don't sit on a branch for 2 hours.
- Before merging: `git pull origin main`, resolve conflicts, then `npm run build`.

**Code**
- Import types only from `src/types.ts`. Never redefine them locally.
- Work against the JSON in `src/data/` from the start. WS1 commits placeholder seed data so nobody waits for WS2.
- Use Tailwind; follow the visual conventions in WS1's section.
- Every page must work at **375px wide** (phone) and **1280px** (laptop).
- Use only fictional patients. Real provider and public-place data is fine.
- The **simulated-data footer** appears on every page (WS1's `SimulatedFooter`).

**Time (today)**

| Time | Milestone |
|---|---|
| ASAP | WS1 pushes scaffold + `types.ts` + stubs + placeholder data to `main` (target: 30 min) |
| +30 min | Everyone branches. WS2 swaps in real data as soon as it's verified |
| 1:30 PM | **Feature freeze.** Merge everything. Only fixes after this |
| 1:45 PM | Deploy final build; run the demo script end to end twice |
| 2:15 PM | Screenshots of every demo step go into the deck as a backup |
| 2:30 PM | Rehearse the full 8-minute pitch with a timer |
| **2:45 PM** | **Submit the deck + live URL + screenshots to the OneDrive folder** |

---

## 6. Workstreams

Six workstreams, each on its own branch. WS1 goes first and unblocks everyone. WS6 (pitch) doesn't write code and can start right away.

| WS | Name | Branch | People | Owner |
|---|---|---|---|---|
| 1 | Foundation & integration | `ws1-foundation` | 1 | **Brielle** (in progress) |
| 2 | Real data & map | `ws2-data-map` | 1 | **Brielle** (in progress) |
| 3 | Patient search, listings, trust & booking | `ws3-patient` | 1–2 | **Brielle** (in progress) |
| 4 | Provider requirements & matching | `ws4-provider` | 1–2 | **Claude** (done; on branch `ws4-provider`, see `docs/ws4-integration.md`) |
| 5 | Telehealth, shared-computer mode & portal mock | `ws5-telehealth` | 1 | **Claude** (done; on branch `ws5-telehealth`, see `docs/ws5-integration.md`) |
| 6 | Pitch deck & evidence | `ws6-pitch` | 1–2 | **Claude** (done; deck in `pitch/`, script and evidence in `docs/`) |

> **Smaller team?** Combine **WS1 + WS2** (one person: scaffold, then data and map), and fold **WS5 into WS3**. That leaves 4 people (or 3 if one person does WS6 alongside a code workstream).

---

### WS1 — Foundation & integration

**Goal**
Within about 30 minutes, get a running, deployed skeleton onto `main`: every route, the shared contract, the store, stubs and placeholder data. After that, own merging and the final deploy.

**Owns**
- `package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`, `vercel.json` (optional)
- `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/config.ts`, `src/types.ts`
- `src/lib/store.ts`, `src/lib/data.ts`
- Initial stubs only (owners replace them): `src/lib/geo.ts` (WS2), `src/lib/freshness.ts` (WS3), `src/lib/matching.ts` (WS4), `src/lib/telehealth.ts` (WS5)
- Placeholder seed data only: `src/data/*.json` (WS2/WS3/WS4 take these over)
- `src/components/ui/*`, `src/components/Layout.tsx`, `RoleSwitcher.tsx`, `SimulatedFooter.tsx`, `DemoPanel.tsx`
- `src/pages/Landing.tsx` + a placeholder file for every other page in Section 3

**Don't touch**
The bodies of other workstreams' pages, components and lib files once their owners have branched. After the first merge, only change them to fix a broken build during integration.

**Depends on / unblocks**
- Depends on: nothing.
- Unblocks: everyone. **Push to `main` before anyone else branches.**

**Build spec**

1. **Scaffold** (run in the repo root):
   ```bash
   npm create vite@latest . -- --template react-ts
   npm install
   npm install react-router-dom zustand leaflet react-leaflet lucide-react
   npm install -D tailwindcss @tailwindcss/vite @types/leaflet
   ```
   - ⚠️ **The repo root isn't empty**, so Vite asks what to do with the existing files. Choose **"Ignore files and continue"**. **Never** choose "Remove existing files", which deletes `MASTER_PLAN.md` and the hackathon materials.
   - Vite's template may overwrite the repo's `.gitignore`. Afterwards, make sure it still contains `*.zip` and `.env`; add them back if not.
   - **react-leaflet version:** check `react` in `package.json`. React 19 → `react-leaflet@^5`. React 18 → `react-leaflet@^4`. Pin it explicitly (`npm i react-leaflet@5`).
   - `vite.config.ts`: `plugins: [react(), tailwindcss()]` (import `tailwindcss` from `@tailwindcss/vite`).
   - `src/index.css`: `@import "tailwindcss";` plus the `@theme` tokens from step 10. Delete Vite's demo CSS and `App.css`.
   - `src/main.tsx`: `import 'leaflet/dist/leaflet.css'`, wrap `<App/>` in `<HashRouter>`.

2. **`src/config.ts`**
   ```ts
   export const APP_NAME = '[ProductName]';
   export const DEMO_TODAY = '2026-11-14';
   export const SIMULATED_NOTE =
     'Locations are real; availability, reviews and shared resources are simulated for this demo.';
   export const REGION_CENTER = { lat: 39.3292, lng: -82.1013 }; // Athens, OH
   export const REGION_ZOOM = 9;
   ```

3. **`src/types.ts`**: copy Section 4 **verbatim**. No edits.

4. **`src/lib/data.ts`**: import the four JSON files and export `getProviders`, `getProvider`, `getAccessPoints` and `getPatients` with the Section 4 signatures. Also export `getSeedRequirements(): Requirement[]` and `getSeedMatches(): Match[]` (`requirements.json` has the shape `{ "requirements": [...], "matches": [...] }`). Cast the JSON with `as Provider[]` and so on. These functions return the **seed** data; live state lives in the store.

5. **`src/lib/store.ts`**: zustand with `persist` (`name: 'hub-demo-v1'`), implementing every field and action of `AppState`.
   - Seed `providers`, `patients`, `requirements` and `matches` from `data.ts`. `appointments` start empty. `currentPatientId` = the first patient's id.
   - `confirmAccepting(id, accepting)` sets `acceptingNewPatients = accepting` and `lastConfirmedDaysAgo = 0`.
   - `acceptMatch(matchId)` sets the match `status = 'accepted'` and the linked requirement `status = 'scheduled'`. Set **all other** proposed matches for that requirement to `'declined'`.
   - `updateProviderResources(providerId, resources)` replaces that provider's `resources`. `declineMatch(matchId)` sets that match to `'declined'`.
   - `saveMatches(reqId, m)` replaces that requirement's matches. If `m.length > 0` and the status is `open`, set it to `'matched'`.
   - `resetDemo()` reseeds everything, clears the flags, sets `role = null`, and navigates nowhere (the caller handles routing).
   - Export `useStore`. Also export a selector helper, `useEffectiveProviders()`, which applies `flags.staleListings`: when on, set `lastConfirmedDaysAgo = 45` for every **third** provider (index % 3 === 0). It returns the derived list; it doesn't change stored data.

6. **Stubs.** Exact signatures from Section 4; trivial bodies; each marked `// STUB — owned by WSn`:
   - `geo.ts`: a working haversine `milesBetween`; `approxDriveMinutes = Math.round(miles*1.3/40*60)`; `formatDrive = m => \`~${m} min drive\``. (It's tiny, so WS1 can ship the real version.)
   - `freshness.ts`: `daysAgo<=7 → fresh`, `<=30 → aging`, else `stale`; text `"Confirmed today"` / `` `Confirmed ${d} days ago` ``.
   - `matching.ts`: `export const matchRequirement: MatchRequirementFn = () => [];`
   - `telehealth.ts`: `export const suggestCareMode: SuggestCareModeFn = () => ({ recommended: 'in_person', reason: 'In-person visit available.', alternatives: ['telehealth_home'] });`

7. **Placeholder seed JSON** that is type-valid, so nobody is blocked:
   - `providers.json`: 3 providers in Athens, Nelsonville and Pomeroy. Mix `acceptingNewPatients`. Give each 1–2 `resources` using the shared vocabulary (WS2, step 3), e.g. one has `"Portable retinal camera"` and another has `"Registered nurse"`.
   - `accessPoints.json`: 2 libraries (Athens, Glouster).
   - `patients.json`: 1 persona, `{ id: "p-linda", displayName: "Linda (fictional)", age: 52, town: "Glouster", location: {lat:39.5034,lng:-82.0846}, insurance: "medicaid", hasHomeInternet: true, portalConnected: false, needs: ["primary_care","diabetes_care"] }`. WS3 owns the final version.
   - `requirements.json`: `{ "requirements": [], "matches": [] }` (WS4 fills it).
   - `src/components/telehealth/CareModeBanner.tsx` stub (owned by WS5): `export default function CareModeBanner({ suggestion, onChoose }: { suggestion: CareModeSuggestion; onChoose: (m: CareMode) => void })` rendering `suggestion.reason` and one button per mode, so WS3's import builds before WS5 merges.

8. **Routes (`App.tsx`):** register every route in the Section 3 table inside `<Layout>`. Each non-WS1 page starts as `export default function X(){ return <PagePlaceholder title="Search — WS3" /> }` so owners only replace the body. Add a catch-all route (`*`) that sends users back to `/`.

9. **UI kit (`src/components/ui/`)**: small, typed, Tailwind-only:
   - `Button`: `variant: 'primary'|'secondary'|'ghost'|'danger'`, `size: 'sm'|'md'|'lg'`, forwards native props. Minimum height 44px (touch target).
   - `Card`: rounded-2xl, border, padding, optional `onClick` (hover ring when clickable).
   - `Badge`: `tone: 'neutral'|'success'|'warning'|'danger'|'info'`.
   - `Modal`: `open`, `onClose`, `title`, children. Closes on Esc or backdrop click. Full-screen sheet below the `sm` breakpoint.
   - `Toggle`: `checked`, `onChange`, `label`. Accessible (`role="switch"`, `aria-checked`).

10. **Visual conventions.** Put these in `@theme` in `index.css` so everyone uses the same tokens:

    | Token | Value | Use |
    |---|---|---|
    | `--color-brand` | `#0f766e` (teal-700) | primary buttons, links, header |
    | `--color-brand-soft` | `#ccfbf1` | selected states, highlights |
    | `--color-warn` | `#d97706` (amber-600) | "aging" freshness, cautions |
    | `--color-danger` | `#dc2626` (red-600) | "stale", cancellations |
    | `--color-ok` | `#16a34a` | "fresh", accepting patients |
    | Pins: hospital | `#1d4ed8` | |
    | Pins: fqhc / clinic | `#0f766e` | |
    | Pins: health_department | `#7c3aed` | |
    | Pins: behavioral_health | `#db2777` | |
    | Pins: dental / pharmacy / mobile_unit | `#0891b2` | |
    | Pins: access point | `#ea580c` (orange) | telehealth sites stand out |

    - Base font is 16px; `/kiosk` scales up to 20px (WS5).
    - Use stone/neutral greys for backgrounds and borders.
    - Breakpoints: design at 375px; the `md` breakpoint (768px) switches to side-by-side list + map.
    - Use only `rounded-xl`/`2xl`, `shadow-sm` and generous padding: calm, trustworthy, not flashy.

11. **`Layout.tsx`**:
    - Sticky header with APP_NAME (links to `/`), `RoleSwitcher` and a content `<main>`.
    - `max-w-6xl mx-auto px-4`, except when a page opts into full width via a `fullWidth` route prop or wrapper.
    - `SimulatedFooter` at the bottom of every page, and `DemoPanel` mounted once.

12. **`RoleSwitcher.tsx`**:
    - Shows the current role as a pill ("Patient · Linda" / "Provider · <org short name>") with a "Switch" button that sets `role=null` and goes to `/`.
    - Hidden on `/` and `/kiosk`.

13. **`SimulatedFooter.tsx`**: small grey text showing `SIMULATED_NOTE` and "Built at Hackpalachia 2026".

14. **`Landing.tsx`**:
    - Hero with APP_NAME and the one-sentence pitch (Section 1).
    - Two large cards:
      - **"I'm looking for care" → Continue as Patient**: sets role and `currentPatientId`, goes to `/patient`.
      - **"I'm a provider" → Continue as Provider**: a `<select>` of all providers (name + town), then sets role and `currentProviderId`, goes to `/provider`.
    - Secondary link: "Using a library or church computer? → Shared-computer mode" (`/kiosk`).

15. **`DemoPanel.tsx`**:
    - Fixed bottom-right round button "🎛 Demo". It opens a drawer (right side on desktop, bottom sheet on mobile).
    - Toggles, one per `DemoFlags` key:

      | Flag | Label |
      |---|---|
      | `noHomeInternet` | 📶 No home internet |
      | `providerCancelled` | ❄️ Partner/van cancelled (snow) |
      | `patientDistrustful` | 🤔 Patient unsure about trust |
      | `staleListings` | 🗂 Stale listings (30+ days) |

    - **Reset demo** button: confirm, then `resetDemo()`, then navigate to `/`.
    - **Shift+D** opens and closes the drawer. Ignore the shortcut while focus is in an input or textarea.
    - Show a small amber dot on the button whenever any flag is on, so the presenter knows the state.
    - Hidden on `/kiosk` unless `?demo=1` is in the URL.

16. **Deploy:** connect the repo to Vercel (framework preset **Vite**, build `npm run build`, output `dist`). HashRouter means no rewrites are needed. Post the live URL in the team chat. Every merge to `main` redeploys automatically.

17. **Integration duties (all day):**
    - Review and merge PRs in the Section 5 order. Run `npm run build` locally after each merge.
    - Own every change to `types.ts` and `store.ts`. Prefer adding **optional** fields. Announce changes in the team chat.
    - At **1:30 PM**, freeze features. Run the demo script (Section 7) on the deployed URL at 375px and 1280px.
    - Fix glue bugs: broken imports, missing route links, z-index between the Leaflet map and the DemoPanel or Modal (give the panel `z-[1000]`, since Leaflet panes go up to 700).

**Done when**
- [ ] `main` has the scaffold, `npm run dev` shows the Landing page, and `npm run build` passes
- [ ] `types.ts` matches Section 4 exactly; the four lib stubs export the Section 4 signatures
- [ ] Every route in Section 3 renders (placeholder or real) inside Layout, with the footer and DemoPanel
- [ ] Placeholder JSON is type-valid; the store persists and `Reset demo` restores the seed
- [ ] Landing → Patient and Landing → Provider (with org dropdown) both work
- [ ] DemoPanel toggles update `flags`; Shift+D works; the indicator dot shows
- [ ] Vercel URL is live and posted to the team
- [ ] At 1:45 PM, the final merged build is deployed and the demo script passes end to end

**Paste this into your Claude**
```text
I'm on Workstream 1 (Foundation & integration) for our hackathon project. Read MASTER_PLAN.md
in full, especially Sections 2 (stack), 3 (layout & routes), 4 (types.ts, helper signatures,
store shape), 5 (team rules) and "WS1 — Foundation & integration" in Section 6.

Do the WS1 Build spec steps 1–16 in order, on branch ws1-foundation:
- Scaffold Vite + React + TS in the repo root, add Tailwind v4 via @tailwindcss/vite,
  react-router-dom (HashRouter), zustand (persist), leaflet + react-leaflet (match the major
  version to React: React 19 → react-leaflet 5, React 18 → 4), lucide-react.
- Copy types.ts VERBATIM from Section 4. Implement store.ts and data.ts exactly to the
  documented shape. Create stubs for geo/freshness/matching/telehealth with the exact signatures.
- Create type-valid placeholder JSON, the UI kit, Layout/RoleSwitcher/SimulatedFooter/DemoPanel,
  Landing, and a placeholder page for every route in the Section 3 table.
Only create or edit the files WS1 owns. Keep components small and typed; use the Tailwind
tokens from step 10. Run `npm run build` and fix all errors before every commit. Then push and
open a PR to main (or merge directly if the team agreed). Tell me when main is ready so
teammates can branch.
```

---

### WS2 — Real data & map

**Goal**
Fill the map with **real** providers and public telehealth access points in and around Athens County, and build the reusable `MapView` that the patient, provider and telehealth pages all use.

**Owns**
- `src/data/providers.json`, `src/data/accessPoints.json`
- `src/lib/geo.ts`
- `src/components/map/MapView.tsx` (plus any `src/components/map/*` helpers, such as `pins.ts` and `Legend.tsx`)

**Don't touch**
`types.ts` (ask WS1), `store.ts`, any page file, and `patients.json` / `requirements.json`.

**Depends on / unblocks**
- Depends on: WS1's scaffold and types.
- Unblocks: WS3/WS4/WS5 maps, and WS4 matching (which needs real `resources`). **Merge a first batch of data early (about 8 providers and 4 access points), then top it up.**

**Build spec**

1. **Collect real locations.** Start from **Appendix A — Real location seed list**, then verify and extend it.
   - Counties: Athens, Meigs, Vinton, Hocking, Perry, Morgan, Washington.
   - Targets: **15–20 providers**, **8–10 access points**.

   | What | Source |
   |---|---|
   | FQHC sites | HRSA Find a Health Center: https://findahealthcenter.hrsa.gov |
   | Hospitals | Ohio Hospital Association members: https://ohiohospitals.org/About-OHA/Ohio-Hospitals/Member-Hospitals |
   | Clinics, dental, behavioral health | CMS NPPES NPI Registry API, e.g. `https://npiregistry.cms.hhs.gov/api/?version=2.1&city=Athens&state=OH&enumeration_type=NPI-2&limit=50` |
   | Health departments | County health department websites |
   | Libraries | Library system websites (Athens County Public Libraries, Meigs, Vinton, Logan-Hocking, Perry, Morgan, Washington) |
   | Coordinates | OpenStreetMap Nominatim (`https://nominatim.openstreetmap.org/search?q=<address>&format=json`, at most 1 request per second) or Google Maps → right-click → copy coordinates. Round to 5 decimals |

   - Aim for variety: at least 1 hospital, 3+ FQHC or clinic sites, 1 health department, 1–2 behavioral health, 1–2 dental, and 1 mobile unit if one exists.
   - Cover several towns so the map spreads out: Athens, Nelsonville, Glouster, Albany, Pomeroy, McArthur, Logan, New Lexington, McConnelsville, Marietta.
   - Access points: mostly libraries, plus 1–2 churches or community/senior centers. Set `status: "proposed_partner"` on most and `"active"` on 1–2.

2. **Field rules (`providers.json`)**:
   - `id`: a kebab-case slug, unique.
   - `name` / `address` / `town` / `county` / `location` / `phone` / `website` / `hours`: **real**.
   - `dataSource`: the URL you got the record from.
   - `services` and `insurances`: plausible for the org type. FQHCs get `sliding_scale` + `medicaid` + `medicare` + `private`.
   - **Simulated fields; keep them realistic and varied:**
     - `acceptingNewPatients`: about 60% `true`. **At least 2 primary-care providers within about 20 miles of Glouster must be `true`** (the demo persona needs results), and at least 1 nearby one should be `false` (shows the Facebook-group problem).
     - `lastConfirmedDaysAgo`: spread from 0 to 60. Most should be ≤7, a few 8–30, and 2–3 over 30.
     - `offersTelehealth`: about half.
     - `trust.verifiedBy`: 0–2 local bodies (e.g. "Athens City-County Health Dept", "Ohio Rural Health Program").
     - `rating` and `reviewCount`: plausible values.
     - `reviews`: 1–3 short reviews, authored `"Neighbor from <town>"`, with `daysAgo`. Never use a real person's name.
     - `resources`: 1–4 per provider, `id` = `<providerId>-r1`…, **labels only from the Section 4 vocabulary**.

3. **Resource labels and the demo pairing.** **Resource labels:** use the canonical vocabulary in **Section 4 → Resource label vocabulary** exactly (matching compares these strings). Seed the demo pairing exactly as described in **Section 4 → Demo story data**, and write the chosen ids into `DEMO_CAST` in `src/config.ts` (ask WS1 to merge that one-line change, or include it in your PR).
   - Spread the remaining labels so most of them appear at least once.

4. **`accessPoints.json` rules**:
   - Real `name`, `address`, `hours`, `location` and `dataSource`.
   - **Include the Glouster library branch** (the demo persona's town) with `hasPrivateRoom: true` and `hasHelper: true`.
   - Simulated: `devices` 1–4. `openSlots`: 3–6 entries between **2026-11-16 and 2026-11-21**, in `"YYYY-MM-DDTHH:mm"` format during opening hours. `lastConfirmedDaysAgo` 0–14.

5. **Validate:** both files must load with no TypeScript errors through `data.ts`. Quick check: `npm run build`. Then eyeball every pin on the map and fix any that land in the wrong town (swapped lat/lng is the usual cause).

6. **`src/lib/geo.ts`**: replace WS1's stub; keep the signatures.
   - `milesBetween`: haversine with Earth radius 3958.8 mi.
   - `approxDriveMinutes(a,b) = Math.max(5, Math.round(milesBetween(a,b) * 1.3 / 40 * 60))`. The 1.3 factor accounts for winding roads and 40 mph is an average rural speed. Comment the assumption.
   - `formatDrive(mins)`: under 60 → `"~25 min drive"`; 60 or more → `"~1 hr 10 min drive"`.

7. **`src/components/map/MapView.tsx`**
   ```ts
   interface MapViewProps {
     providers?: Provider[];
     accessPoints?: AccessPoint[];
     center?: LatLng;            // default REGION_CENTER
     zoom?: number;              // default REGION_ZOOM
     selectedId?: string | null;
     onSelect?: (id: string, type: 'provider' | 'accessPoint') => void;
     highlightIds?: string[];    // e.g. matched partners; others render dimmed when non-empty
     origin?: LatLng;            // patient/requirement location: "You are here"-style pin, drive times measured from it
     fitToMarkers?: boolean;     // default true
     showLegend?: boolean;       // default true
     className?: string;         // caller sets height, e.g. "h-[60vh] md:h-full"
   }
   ```
   - Use `MapContainer` + `TileLayer` (OSM tiles, attribution `© OpenStreetMap contributors`), `scrollWheelZoom={false}` on mobile widths.
   - **Pins:** `L.divIcon` with a `<div>` circle, 22px (30px when selected or highlighted), and a white 2px border with a shadow. Color comes from the Section 6 WS1 table: providers by `orgType`, access points orange with a 📶/🏛 glyph. Put the builder in `map/pins.ts`.
   - **Dimming:**
     - Providers with `acceptingNewPatients === false` render at 45% opacity with a grey ring.
     - When `highlightIds` is non-empty, any pin not in it renders at 35% opacity.
   - **Popup / tooltip:**
     - Name, then town.
     - A freshness badge (`freshnessLabel` from `lib/freshness.ts`).
     - Accepting / Not accepting (providers).
     - Drive time from `origin` if given (`formatDrive(approxDriveMinutes(...))`).
     - A "View" button that calls `onSelect`. Clicking a pin calls `onSelect` too.
   - **Fit bounds:** use an inner `useMap()` component that calls `map.fitBounds(bounds, { padding: [30,30], maxZoom: 12 })` whenever the marker set changes. Skip if there are no markers. When `selectedId` changes, `map.flyTo` that pin (zoom ≥ 12).
   - **Layout gotchas:**
     - The container needs an explicit height. In flex layouts the parent needs `min-h-0`.
     - Call `map.invalidateSize()` on mount and on window resize. This fixes grey tiles when the map is mounted in a hidden tab or modal.
   - **Legend** (`showLegend`): a small card bottom-left (`z-[500]`) listing pin colors: Hospital, Health center/clinic, Health dept, Behavioral health, Dental/pharmacy, Telehealth access point, plus "Faded = not accepting new patients".
   - Make sure `leaflet/dist/leaflet.css` is imported (WS1 does it in `main.tsx`; check it's there).

8. **Stretch (only if everything above is merged):** add an optional `shadeShortageCounties` prop. Fetch a simplified Ohio counties GeoJSON (store it in `src/data/se-ohio-counties.json`, the 7 counties only) and fill counties with a light red tint. Hard-code which ones are primary-care HPSAs from https://data.hrsa.gov/topics/health-workforce/shortage-areas, and mark the source in the legend.

**Done when**
- [ ] `providers.json` has 15–20 **real** providers across at least 5 towns, every one with a `dataSource` URL
- [ ] `accessPoints.json` has 8–10 **real** public places, including the Glouster library branch, with slots for Nov 16–21
- [ ] Resource labels come only from the shared vocabulary, and the demo's retinal-camera / registered-nurse pairing exists, with a fallback provider
- [ ] At least 2 accepting primary-care providers within about 20 miles of Glouster, and at least 1 nearby that's not accepting
- [ ] `geo.ts` is implemented with the fixed signatures
- [ ] `MapView` renders pins by type, dims correctly, shows popups with freshness and drive time, fits bounds, flies to the selection, and has a legend
- [ ] The map looks right at 375px and 1280px, with no grey tiles; `npm run build` passes
- [ ] First data batch merged early; final data merged before 1:30 PM

**Paste this into your Claude**
```text
I'm on Workstream 2 (Real data & map) for our hackathon project. Read MASTER_PLAN.md in full,
especially Section 4 (types.ts — Provider, AccessPoint, ResourceOffer, LatLng; geo.ts
signatures), Section 5 (team rules), "WS2 — Real data & map" in Section 6, and
"Appendix A — Real location seed list".

Work on branch ws2-data-map, branched from main AFTER WS1's scaffold is merged.
1. Build src/data/providers.json (15–20) and src/data/accessPoints.json (8–10) with REAL names,
   addresses, towns, counties and coordinates in Athens, Meigs, Vinton, Hocking, Perry, Morgan
   and Washington counties, OH. Start from Appendix A; verify each entry using the sources in
   Build spec step 1 (HRSA Find a Health Center, Ohio Hospital Association, NPPES NPI Registry
   API, library websites; geocode with Nominatim at ≤1 req/sec). Put the source URL in dataSource.
   Fill simulated fields exactly per steps 2–4. Use ONLY the resource-label vocabulary in Section 4,
   seed the demo pairing exactly per Section 4 → Demo story data, and fill DEMO_CAST ids in config.ts.
   Commit and merge a first batch (~8 providers, ~4 access points) as early as possible.
2. Implement src/lib/geo.ts per step 6 (keep the exact signatures).
3. Implement src/components/map/MapView.tsx (+ map/pins.ts, map/Legend.tsx) per step 7, with the
   exact props interface, divIcon pins, dimming, popups, fitBounds/flyTo, invalidateSize, legend.
Only touch the files WS2 owns; never edit types.ts or store.ts. The data must type-check against
types.ts. Run `npm run build` and fix all errors before every commit, then open a PR to main.
```

---

### WS3 — Patient search, listings & booking

**Goal**
Make finding care feel like online shopping: search, filter, compare trusted listings that show how fresh they are, then book. This is the patient half of the demo.

**Owns**
- `src/pages/patient/Search.tsx`, `Listing.tsx`, `Book.tsx`, `Confirmation.tsx`
- `src/components/patient/*`: `SearchBar`, `ServiceChips`, `Filters`, `ListingCard`, `TrustBadges`, `TrustPanel`, `FreshnessBadge`, `SlotPicker`, `SmsPreview`
- `src/lib/freshness.ts`
- `src/data/patients.json`

**Don't touch**
`types.ts`, `store.ts`, `data.ts`, `App.tsx` (WS1) · `MapView`, `geo.ts`, `providers.json`, `accessPoints.json` (WS2) · `telehealth.ts`, `components/telehealth/*`, `ConnectPortal.tsx`, `AccessPoints.tsx` (WS5) · anything under `provider/` (WS4).

**Depends on / unblocks**
- **Depends on:**
  - WS1: store, `getProviders()`, route placeholders, UI kit
  - WS2: `MapView`, `approxDriveMinutes`, `formatDrive`
  - WS5: `suggestCareMode`, `CareModeBanner`
- **Before WS2 and WS5 merge:** use WS1's placeholder data and stubs.
- **Unblocks:** demo steps 1–2 (Section 7) and the slide-5 screenshots for WS6.

**Build spec**

1. **`freshness.ts`.** Implement the fixed signature:
   - `0` → `{text:"Confirmed today", tone:"fresh"}`
   - `1–7` → `"Confirmed N days ago"`, fresh
   - `8–30` → `"Confirmed N days ago"`, aging
   - `>30` → `"May be out of date · confirmed N days ago"`, stale
   - Export a helper `effectiveDaysAgo(p: Provider, flags)`. When `flags.staleListings` is on, it returns `45` for every 3rd provider (by index in `getProviders()`) and the real value for the rest. Every component that shows freshness goes through this helper.
   - `FreshnessBadge`: green when fresh, amber when aging, red when stale, with a clock icon.

2. **`patients.json`** (fictional only; coordinates are town centres):
   - `p-linda`: Linda, 52, Glouster, `medicaid`, `hasHomeInternet: true`, `portalConnected: false`, `needs: ["primary_care","diabetes_care","eye_care"]`. Type 2 diabetes, no primary care provider. This is the demo persona.
   - Two extras for realism:
     - `p-ray`: 61, Pomeroy, medicare, no home internet
     - `p-dana`: 47, McArthur, private
   - The current patient is always `patients[0]` (`currentPatientId` defaults to it). There's no persona picker.
   - "No internet at home" = `!patient.hasHomeInternet || flags.noHomeInternet`. Compute it wherever you need it; never mutate the JSON.

3. **Search page (`/patient`).**
   - **Header:** a greeting ("Hi Linda · Glouster"), a "Connect MyChart" link to `/patient/connect` (hidden if already connected), and a "Telehealth near you" link to `/patient/telehealth`.
   - **`SearchBar`:** free text matched case-insensitively against name, town and services.
   - **`ServiceChips`:** horizontally scrollable chips, one per `ServiceType`, with human labels such as "Primary care" and "Diabetes care". Multi-select; empty means all.
   - **`Filters`:** on mobile they open in a bottom sheet; on desktop they're an inline row.
     - Accepting new patients (toggle, **on by default**)
     - Insurance (select; defaults to the patient's insurance; "Any")
     - Offers telehealth (toggle)
     - Max drive time (15 / 30 / 45 / 60 / Any)
   - **Results:**
     - Sort by `approxDriveMinutes(patient.location, p.location)` ascending.
     - With `flags.staleListings` on, stale listings sink below fresh and aging ones.
     - Show a result count ("8 providers within 45 min").
   - **Empty state:** "No one matches. Try widening drive time, or see telehealth options →" (links to `/patient/telehealth`).
   - **Layout:**
     - **Mobile (<768px):** a sticky List | Map segmented toggle; list by default.
     - **Desktop:** split view, list on the left (scrolls, about 40%) and `MapView` on the right (sticky, about 60%).
     - Selecting a card sets `selectedId`, which highlights and pans to its pin. Clicking a pin scrolls to and highlights its card. Pass `selectedId` / `onSelect` to `MapView` using WS2's props.

4. **`ListingCard`** (props `{provider, driveMins, selected, onSelect}`), top to bottom:
   - name and org-type label
   - town · `formatDrive(...)`
   - badge row:
     - **Accepting new patients** (green) or **Not accepting** (grey)
     - `FreshnessBadge`
     - "Telehealth" chip when available
   - insurance chips, with the patient's insurance highlighted
   - `TrustBadges`: "✓ Verified by {first verifiedBy}" (+N more), ★ rating, "{reviewCount} neighbors reviewed"

   The whole card links to `/patient/listing/:id`. Tap targets are at least 44px.

5. **Listing page (`/patient/listing/:id`).**
   - Show:
     - everything on the card
     - address, hours, phone (`tel:` link) and website
     - services list
     - a small `MapView` centred on the provider
     - reviews (author such as "Neighbor from Nelsonville", stars, text, "N days ago")
   - **Primary CTA:** "Book a visit" → `/patient/book/:id`. It's sticky at the bottom on mobile.
   - **If `!acceptingNewPatients`:** disable the CTA and show the panel "Not accepting new patients right now. Similar providers nearby:", listing up to 3 accepting providers that share a service with this one, sorted by drive time, as compact cards.
   - **If `flags.patientDistrustful`:** show **`TrustPanel`** above the CTA ("Why you can trust this listing"):
     - who runs the hub: "a public, non-profit directory; no ads, no paid rankings"
     - who verified the listing, and when (freshness)
     - the top 2 neighbor reviews
     - a **"Talk to a community health worker first"** button. It opens a modal (name optional, phone, best time) → mock confirmation: "A community health worker from your county will call you within 1 business day." Local state only.

6. **Book page (`/patient/book/:id`).**
   - **Persona summary card:**
     - If `portalConnected`: "Pre-filled from MyChart (simulated)", showing insurance, needs and the current-medications placeholder.
     - Otherwise: show the insurance and needs fields, plus a "Connect MyChart to pre-fill" link.
   - **Service select:** the provider's services, defaulting to the first patient need the provider offers.
   - **Care mode:** call `suggestCareMode(patient, provider, service, getAccessPoints(), flags)` and render `<CareModeBanner suggestion={s} onChoose={setMode} />`. **Props contract:** `{ suggestion: CareModeSuggestion; onChoose: (mode: CareMode) => void }`. `mode` defaults to `s.recommended`. Re-run whenever flags or service change, so toggling 📶 live updates the banner.
   - **`SlotPicker`:**
     - **In person or home telehealth:** generate simulated slots for the next 5 weekdays from `DEMO_TODAY`, 9:00–15:30 every 30 min. Seed the generator with the provider id and drop about 60% of slots deterministically so it looks real.
     - **Access-point telehealth:** use `s.accessPoint.openSlots`, and show the access point's name, "private room" and "helper available" chips.
     - Layout: day tabs, then a time-chip grid.
   - **Confirm:** `bookAppointment({id: crypto.randomUUID(), patientId, providerId, accessPointId, mode, datetime, status:"booked"})` → `/patient/confirmation/:apptId`.

7. **Confirmation page.**
   - **Summary:** provider, mode (with an icon), the location (clinic address, or access-point name and address), and date/time.
   - **Mode-specific note:**
     - **Access point:** "Bring a photo ID. A helper will set up the call."
     - **Home telehealth:** "You'll get a link by text 15 min before."
   - **`SmsPreview`:** a phone-style bubble:
     > "[APP_NAME]: Linda, your visit with {provider} is {day} {time} at {place}. Reply C to confirm, R to reschedule."

     Caption: "Text reminders work on any phone, no internet needed."
   - **"Add to calendar":** a mock that shows a toast.
   - **Links:** "Back to search" and "View telehealth access points".

8. **Polish.**
   - Use the "shop" look:
     - rounded cards
     - generous whitespace
     - colour-coded badges
     - skeleton states not needed
   - Every page works at 375px with no horizontal scroll.
   - Unknown `:id` → a friendly "Listing not found" with a back link.

**Done when**
- [ ] `/patient` filters and sorts by drive time; the List/Map toggle works on mobile and the split view works on desktop
- [ ] Selecting a card highlights its pin, and clicking a pin highlights its card
- [ ] Every card shows accepting, freshness, insurance, telehealth and trust badges; 🗂 stale listings turn red and sink
- [ ] A non-accepting listing shows 3 similar accepting providers nearby
- [ ] 🤔 distrust shows the TrustPanel, and the community-health-worker callback modal confirms
- [ ] The Book page re-renders the CareModeBanner live when 📶 is toggled, and access-point slots come from the access point
- [ ] Booking produces a Confirmation page with the SMS preview
- [ ] `patients.json` contains Linda plus 2 extras; no real patient data anywhere
- [ ] `npm run build` passes; checked at 375px and 1280px

**Paste this into your Claude**
```text
Read MASTER_PLAN.md fully (Sections 1–5 are the shared contract; Section 7 is the demo script).
I own Workstream WS3 — Patient search, listings & booking. Implement everything in the
"WS3" section's Build spec, in order.

Rules:
- Only create/modify the files listed under WS3 "Owns". Never edit src/types.ts, src/lib/store.ts,
  src/lib/data.ts, src/App.tsx, MapView, geo.ts, telehealth.ts or components/telehealth/*.
  If I need a change in one of those, stop and tell me exactly what to ask the owner for.
- Import all types from src/types.ts. Use store actions (bookAppointment etc.) and data getters as specified.
- Render <CareModeBanner suggestion onChoose /> from src/components/telehealth/CareModeBanner.tsx
  and call suggestCareMode from src/lib/telehealth.ts (these may still be WS1 stubs; that's fine).
- Use <MapView> from src/components/map/MapView.tsx with its documented props.
- Tailwind only. Mobile-first: must work at 375px; desktop split view at ≥768px.
- Fictional patients only.
- Run `npm run build` and fix all errors before every commit. Commit on branch ws3-patient
  in small steps with clear messages.
Start with freshness.ts and patients.json, then Search → ListingCard → Listing → Book → Confirmation.
```

---

### WS4 — Provider requirements & matching

**Goal**
Let a provider post what they're missing (location, equipment, personnel) to care for a patient they already see, and get matched with partner providers who fill the gaps. This is the provider half of the demo and its ❄️ failure moment.

**Owns**
- `src/pages/provider/Dashboard.tsx`, `NewRequirement.tsx`, `Requirement.tsx`
- `src/components/provider/*`: `AcceptingCard`, `RequirementList`, `IncomingRequests`, `ResourceManager`, `PartnerMap`, `NeedPicker`, `MatchCard`, `CoverageTable`, `ScheduledSummary`
- `src/lib/matching.ts` (replaces the WS1 stub)
- `src/data/requirements.json`

**Don't touch**
`types.ts`, `store.ts`, `data.ts`, `App.tsx` (WS1) · `MapView`, `geo.ts`, `providers.json` (WS2: if you need specific resource labels seeded, ask WS2) · everything under `patient/` and `telehealth/`.

**Depends on / unblocks**
- **Depends on:**
  - WS1: store actions `upsertRequirement`, `saveMatches`, `acceptMatch`, `confirmAccepting`, `setCurrentProvider`; the provider dropdown on Landing
  - WS2: `providers.json` with `resources[]` using the **exact demo labels below**; `MapView`; `geo.ts`
- **Unblocks:** demo steps 3–4 (Section 7).

**Resource labels:** use the canonical vocabulary in **Section 4 → Resource label vocabulary** exactly (matching compares these strings). `NeedPicker` offers exactly those labels; WS2 seeds providers with them.

**Build spec**

1. **`matching.ts`.** Implement `MatchRequirementFn` exactly.
   - **Normalize:** lowercase, trim, collapse whitespace, strip punctuation. A resource `r` covers need `n` if `r.kind === n.kind` and (`norm(r.label).includes(norm(n.label))` or the reverse).
   - **Candidates:** `providers` excluding `req.createdByProviderId`, each with its `coverable` needs.
   - **Greedy set cover:**
     - Pick the candidate covering the most still-uncovered needs; tie-break by lower `approxDriveMinutes(p.location, req.nearLocation)`.
     - Repeat until everything is covered or 2 partners are picked.
     - Produce the best combo, then 2 more alternatives: rerun with each previous combo's first partner excluded.
     - Dedupe combos by sorted partner ids; return at most 3.
   - **`score`:** `70 * covered/total` + `20 * (1 - min(worstDrive, 90)/90)` + `10 * freshnessFactor`, where `freshnessFactor = avg over partners of max(0, 1 - lastConfirmedDaysAgo/30)`. Round to an integer.
   - **Other fields:**
     - `approxDriveMinutes`: the worst-case partner drive
     - `proposedSiteName`: the name of the provider covering the `location` need, else the creator's name
     - `status: 'proposed'`
     - `id`: `${req.id}-m${i}`
   - **Sort** by score, descending.
   - **Cancellation is handled by the caller,** not inside the function. The Requirement page passes `providers` with the cancelled partner(s) filtered out. The signature stays pure.

2. **`requirements.json` seed** (3 items; `createdByProviderId` refers to ids in WS2's `providers.json`):
   - **`req-demo`:** the demo requirement. Its creator is `DEMO_CAST.clinicProviderId` (`hopewell-the-plains`).
     - `patientRef`: "Patient #A-104"
     - `serviceType`: `eye_care`
     - `note`: "Annual diabetic eye exam: no retinal camera in-house"
     - `needs`: Equipment "Portable retinal camera", Personnel "Retinal imaging technician" (the clinic already has the nurse and the exam room)
     - `nearTown`: Glouster
     - `status`: `open`
     - Expected match: `DEMO_CAST.cameraPartnerId` covers both needs; the screening happens in the clinic's own exam room (`proposedSiteName` = the creator's name). With ❄️ on, re-match returns `DEMO_CAST.backupPartnerId`.
     - **Show the pooling:** the Requirement page displays a two-column "**You bring:** Registered nurse · Exam room" (from the creator's own `resources`) vs "**Partner brings:** Portable retinal camera · Retinal imaging technician". This is the user-facing picture of "A has the equipment, B has the people".
   - **`req-sched`:** already `scheduled`, with a seeded accepted match. Example: Registered nurse + Mobile clinic van for a flu/A1C pop-up near Pomeroy. Add it to the store via the seed.
   - **`req-open`:** `open`, for example Behavioral health counselor + Telehealth cart near McArthur.

3. **Dashboard (`/provider`)** is desktop-first: a 12-column grid with a main column of 8 and a side column of 4. On mobile it stacks.
   - **Header:** the current org name, town and org type, plus a "Switch org" dropdown (`setCurrentProvider`; useful for demoing the partner side). If `currentProviderId` is null, redirect to `/`.
   - **`AcceptingCard`:** "Still accepting new patients?" with large Yes / No buttons → `confirmAccepting(id, bool)`. Below it, a `freshnessLabel` line that turns to "Confirmed today" instantly. Caption: "Patients see how recently you confirmed. Takes 1 tap a week."
   - **`RequirementList`** shows requirements created by this org:
     - each row: patientRef · service · needs count · status chip (open = blue, matched = amber, scheduled = green, cancelled = grey) · window
     - each row links to its detail page
     - a "+ New requirement" button
   - **`IncomingRequests`:** matches where `partnerProviderIds.includes(currentProviderId)` and `status === 'proposed'`.
     - each shows: the requesting org · which of *your* resources they need · site · dates
     - **Accept** calls `acceptMatch(id)`
     - **Decline** rewrites the match with status `declined` via `saveMatches(reqId, updated)`
   - **`ResourceManager`:** this org's `resources` grouped by kind as chips with ✕, plus an "Add resource" inline form (kind select + label combobox from the vocabulary + available days). It persists edits with the store's `updateProviderResources`.
   - **`PartnerMap`:** `MapView` with all other providers. Providers with ≥1 resource get a highlighted marker, and the popup lists their resources.

4. **NewRequirement (`/provider/requirements/new`).**
   - **Fields:**
     - patient reference (text, placeholder "Patient #A-104", helper text "De-identified, no names")
     - service type (select)
     - **Where care should happen:** the town select is built from the unique towns in providers and access points, and sets `nearTown` and `nearLocation` (the first matching entity's location). An optional "or a specific site" select lists providers and access points.
     - date window (two date inputs; defaults to `DEMO_TODAY` to +14 days)
     - optional note
   - **`NeedPicker`:** three groups (📍 Location, 🧰 Equipment, 👩‍⚕️ Personnel). Each has toggleable chips from the vocabulary plus "+ Other" free text.
   - **Validation:** at least 1 need and a town are required.
   - **Submit:**
     1. build the `Requirement` (`id: crypto.randomUUID()`, status `open`)
     2. `upsertRequirement`
     3. `matchRequirement(req, providers, flags)`
     4. `saveMatches`
     5. set status to `matched` if any match exists
     6. navigate to `/provider/requirements/:id`

5. **Requirement detail (`/provider/requirements/:id`).**
   - **Top:** patientRef, service, window, note, and the needs as chips.
   - **Ranked `MatchCard`s** (best first; the top one is badged "Best match"):
     - partner name(s) with town and drive time
     - score bar
     - **`CoverageTable`:** rows = needs, columns = partner, cell = ✓ plus the resource label, uncovered = —
     - a red "⚠ Not covered: …" banner if `uncovered.length`
     - CTA: **"Propose collaboration"**
   - **Propose collaboration:**
     - The button shows "Waiting for {partner}…".
     - After about 1.5s, `setTimeout` calls `acceptMatch(match.id)`. For an unscripted flow the partner can instead accept from their own dashboard via Switch org.
   - **Scheduled:** collapse the list into **`ScheduledSummary`**: "✅ Pop-up clinic day at {proposedSiteName} · {first date in window}", with each partner's role (e.g. "Holzer brings camera + technician"), plus a small `MapView` showing the partner → site lines if WS2 supports it, or just the markers.
   - **❄️ Failure flow** (`flags.providerCancelled && status === 'scheduled'`):
     - Show a red alert: **"{first partner} cancelled: roads closed (snow). Your patient still needs care."**
     - **"Re-match"** reruns `matchRequirement` with the cancelled partner(s) removed from `providers`, then `saveMatches`, then `upsertRequirement({...req, status:'matched'})`. The next-best combo appears.
     - **"Convert to telehealth at nearest access point":** find the nearest `AccessPoint` to `nearLocation` (`milesBetween`), then `upsertRequirement({...req, status:'scheduled', note: 'Converted to telehealth at {ap.name}'})`. Show the summary with the access point's name and its first `openSlot`.
   - **Unknown id** → "Requirement not found" with a back link.

6. **Layout and feel.**
   - Desktop-first and denser than the patient side: tables are OK, but each must collapse to stacked cards below 768px.
   - Status colours must match the dashboard chips everywhere.

**Done when**
- [ ] `matchRequirement` on `req-demo` returns the camera partner as best match covering both needs (score ≥ 80); with that partner filtered out, it returns the backup partner
- [ ] Requirement page shows "You bring" vs "Partner brings"
- [ ] Dashboard shows the Accepting card (one tap turns it to "Confirmed today"), requirements with status chips, incoming requests with Accept/Decline, resources and the partner map
- [ ] The NewRequirement form creates a requirement, runs matching and lands on its detail page
- [ ] "Propose collaboration" auto-accepts after ~1.5s and shows the pop-up clinic summary
- [ ] ❄️ on a scheduled requirement shows the cancellation alert; Re-match finds the next-best partner; Convert-to-telehealth picks the nearest access point
- [ ] Switching org to the partner shows the request in its Incoming list
- [ ] `npm run build` passes; usable at 1280px and readable at 375px

**Paste this into your Claude**
```text
Read MASTER_PLAN.md fully (Sections 1–5 are the shared contract; Section 7 is the demo script).
I own Workstream WS4 — Provider requirements & matching. Implement everything in the "WS4"
section's Build spec, in order.

Rules:
- Only create/modify files listed under WS4 "Owns". Never edit src/types.ts, src/lib/store.ts,
  src/lib/data.ts, src/App.tsx, MapView, geo.ts or providers.json. If I need a change there,
  stop and tell me exactly what to ask the owner (WS1 for types/store, WS2 for data/map).
- Implement src/lib/matching.ts with the exact MatchRequirementFn signature from types.ts
  (pure function; the caller filters out cancelled partners).
- Use the Section 4 resource label vocabulary exactly; reference demo records via DEMO_CAST in config.ts.
- Use store actions (upsertRequirement, saveMatches, acceptMatch, confirmAccepting,
  setCurrentProvider) and read flags from the store for the ❄️ providerCancelled flow.
- Tailwind only. Desktop-first, but every table collapses to cards under 768px.
- De-identified patient refs only (e.g. "Patient #A-104").
- Run `npm run build` and fix all errors before every commit. Commit on branch ws4-provider
  in small steps.
Start with matching.ts (verify against req-demo with a quick console test), then requirements.json,
Dashboard, NewRequirement, Requirement detail, then the ❄️ failure flow.
```

---

### WS5 — Telehealth access points, auto-telehealth & shared-computer mode

**Goal**
Make sure "no internet at home" or "can't get there" never ends someone's care. WS5 owns the logic that picks the care mode automatically, the banner that offers it, the telehealth access points page, the shared-computer (kiosk) mode for library and church PCs, and the mocked "Connect your patient portal (e.g., MyChart)" flow.

**Owns**
- `src/lib/telehealth.ts` (replaces WS1's stub for `suggestCareMode`)
- `src/components/telehealth/*`: `CareModeBanner.tsx`, `AccessPointCard.tsx`, `MockVideoCall.tsx`, `IdleTimer.tsx` (or a `useIdleTimer` hook in this folder), `PortalConsent.tsx`
- `src/pages/patient/AccessPoints.tsx` (`/patient/telehealth`)
- `src/pages/patient/ConnectPortal.tsx` (`/patient/connect`)
- `src/pages/Kiosk.tsx` (`/kiosk`)

**Don't touch**
`types.ts`, `store.ts`, `App.tsx`, `config.ts` (ask WS1) · `MapView.tsx`, `geo.ts`, `data/*.json` (ask WS2) · `pages/patient/Book.tsx` and other WS3 files. WS3 *renders* your `CareModeBanner`; agree on its props (below) and don't edit their page.

**Depends on / unblocks**
- **Depends on:**
  - WS1: stub `suggestCareMode`, store actions (`connectPortal`, `setRole`, `flags`), placeholder data, routes registered.
  - WS2: `MapView` (accepts a list of access points), `approxDriveMinutes`/`formatDrive`, real `accessPoints.json`.
  - WS3: `freshnessLabel`.
- **Unblocks:**
  - WS3: the Book page imports `CareModeBanner` + `suggestCareMode`, and reads `patient.portalConnected` to show "Prefilled from your patient portal".
  - Demo beats (b) and (e) in Section 7.
- **Until WS2/WS3 merge:** use the placeholder JSON and write a local fallback `freshnessLabel` inline. Delete it once WS3's version is on `main`.

**Build spec**
1. **`suggestCareMode()` in `src/lib/telehealth.ts`** (signature exactly as `SuggestCareModeFn`):
   1. `TELEHEALTH_ELIGIBLE: ServiceType[] = ['behavioral_health','primary_care','diabetes_care','pharmacy']`. Not eligible (they need equipment or hands-on care): `dental`, `eye_care`, `urgent_care`, `womens_health`, `pediatrics`, `specialty`.
   2. `drive = approxDriveMinutes(patient.location, provider.location)`.
   3. `inPersonInfeasible = flags.providerCancelled || drive > 45`.
   4. If the service is **not eligible**, return `in_person` with `alternatives: []` and a reason such as *"This visit needs equipment at the clinic, so it has to be in person. ~{drive} min drive."* If `inPersonInfeasible`, also add *"We'll flag this to your provider so they can find a closer option."*
   5. If eligible and in person **is** feasible, and the provider `offersTelehealth`: recommend `in_person`; alternatives are the telehealth modes the patient can use.
   6. If eligible **and** (`inPersonInfeasible` **or** the patient simply prefers it):
      - `patient.hasHomeInternet && !flags.noHomeInternet` → `telehealth_home`.
      - Otherwise → `telehealth_access_point`. Choose the nearest access point with `hasPrivateRoom === true` (`status` active or proposed_partner). Break ties by preferring `hasHelper`, then `openSlots.length > 0`. Return it as `accessPoint`.
      - If no access point qualifies, fall back to `in_person` with the reason *"We couldn't find a private telehealth room nearby. Call the clinic and they'll help."*
   7. Reason strings are plain language, second person, under 25 words. Examples:
      - `"No internet at home? You can do this visit at Glouster Public Library: private room, staff can help you connect. ~6 min drive."`
      - `"Your provider's van can't make it today because of the snow. You can see them by video from home instead."`
      - `"The clinic is about 55 minutes away. A video visit from home saves you the drive."`
   8. Pure function: no store access, no side effects. Add 4–6 `console.assert` sanity checks in a dev-only block, or write a tiny `telehealth.test.ts` if Vitest is already set up.
2. **`CareModeBanner`**
   - Props: `{ suggestion: CareModeSuggestion; onChoose: (mode: CareMode, accessPointId?: string) => void }`.
   - A big, friendly card (rounded-2xl, soft colored background, 18px+ text).
   - Icon by mode: 🏥 in person · 🏠 home video · 📚 access point.
   - Headline from `reason`. For an access point, show its name, `kind` icon, "Private room", "Staff can help you connect" (if `hasHelper`), `formatDrive(...)`, and the first open slot formatted as "Thu 10:00 AM".
   - Primary button: "Book this". Secondary buttons: one per alternative ("Rather go in person", "Video from home").
   - Phone-first: stacks vertically at 375px.
3. **`AccessPointCard`**
   - Kind icon (📚 library · ⛪ church · 🏛 community center · 🧓 senior center), name, town, hours.
   - Chips: "Private room", "Helper on site", "{devices} computers".
   - Freshness line via `freshnessLabel(lastConfirmedDaysAgo)`.
   - A muted **"Proposed partner site"** badge when `status === 'proposed_partner'`.
   - Next 3 `openSlots` as tappable pills (tapping navigates to `/patient/book/:providerId?ap=<id>&slot=<slot>` when a provider is in context; otherwise just highlights the slot).
4. **`/patient/telehealth` (`AccessPoints.tsx`)**
   - Intro line: *"No internet at home? These local places have a private room and a computer for your video visit."*
   - Filters: "Helper on site", "Open this week", county.
   - Desktop: list on the left, `MapView` (access points only) on the right. Phone: a List/Map toggle.
   - Sort by distance from the current patient's town.
   - Clicking a card centers the map on its pin.
5. **`/kiosk` (`Kiosk.tsx`), the shared-computer mode**
   - Full-screen layout without the normal nav. Base font ≥ 20px (`text-xl`), headings `text-4xl`, high-contrast colors (dark text on white, or white on near-black), focus rings visible, every target ≥ 64px tall.
   - Banner pinned at the top: **"This is a shared computer. Nothing is saved after you leave."**
   - Three giant buttons:
     - **Find care** → `/patient`
     - **Start my telehealth visit** → shows `MockVideoCall`
     - **Get help from staff** → a modal: *"A library staff member has been notified and will be right with you."* (simulated)
   - `MockVideoCall`:
     - a dark 16:9 panel with a provider placeholder avatar and the line *"Your visit will start when your provider joins"* (pulsing dot)
     - self-view tile with a camera-off icon
     - mic/camera/end buttons, all non-functional
   - **Idle timer:**
     - Track pointer, key and touch events.
     - After **3 minutes** idle, open a modal with a **30-second countdown**: "Still there? We'll sign you out to protect your privacy." with an "I'm still here" button.
     - At 0, run the end-session routine.
   - **"End session & clear"** (always visible, top-right) runs the end-session routine:
     - `setRole(null)`
     - reset any kiosk-local React state
     - remove anything from `sessionStorage`
     - navigate to `/kiosk`
     - show "Session cleared" for 3 seconds

     It must **not** call `resetDemo()` (that would wipe the demo's data).
6. **`/patient/connect` (`ConnectPortal.tsx`), mocked portal connection**
   - A "Demo: simulated connection" badge is always visible at the top.
   - **Step 1, choose your health system:** a list of distinct real health systems/orgs drawn from `providers.json` (hospitals and FQHCs, de-duplicated by name), plus a search box. Heading: "Connect your patient portal (e.g., MyChart)".
   - **Step 2, consent screen** (`PortalConsent`), styled like a generic sign-in-with-your-portal page:
     - **Will share:** name, insurance, active conditions, current medications.
     - **Won't share:** visit notes, test results, billing, anything else.
     - Buttons: "Allow" / "Cancel".
   - **Step 3, success:**
     - Call `connectPortal(currentPatientId)`.
     - Show a check, then "Your portal is connected. Booking forms will be filled in for you."
     - Link "Back to booking" (to the `?return=` URL if present, otherwise `/patient`).
   - Code comment and Q&A one-liner: *"In real life this uses the standards-based patient-access APIs (SMART on FHIR) that major portals already expose under federal interoperability rules."*
7. **Styling and accessibility**
   - Tailwind only.
   - Every interactive element has a visible label.
   - Icons are paired with text.
   - Works at 375px and 1280px.
   - The kiosk also works at a 1024×768 projector resolution.

**Done when**
- [ ] `suggestCareMode` returns:
  - `telehealth_access_point` for Linda + primary care + `noHomeInternet` on
  - `telehealth_home` when she has internet + `providerCancelled` on
  - `in_person` for `eye_care` regardless of flags
- [ ] `CareModeBanner` renders all three modes and calls `onChoose` with the correct mode and access point id
- [ ] `/patient/telehealth` shows real access points on the map + list, with freshness and the "Proposed partner site" badge
- [ ] `/kiosk`:
  - shows the banner and the 3 buttons
  - the mock video call opens
  - the idle modal appears (temporarily set the timeout to 10 s to test, then restore 3 min)
  - "End session & clear" returns to a clean kiosk without wiping demo data
- [ ] `/patient/connect` runs choose → consent → success, `portalConnected` becomes true, and the "Demo: simulated connection" badge is visible
- [ ] No TypeScript errors; `npm run build` passes; merged to `main`

**Paste this into your Claude**
```text
I'm on Workstream 5 (WS5) of our hackathon project. Read MASTER_PLAN.md in the repo root,
especially Sections 1–5 (shared contract) and the "WS5 — Telehealth access points,
auto-telehealth & shared-computer mode" section, plus Section 7 (demo script, beats b and e)
and Section 8 (failure switches).

Implement everything in WS5's Build spec, in order. Rules:
- Only create/modify the files listed under WS5 "Owns". Do NOT edit src/types.ts, store.ts,
  App.tsx, config.ts, MapView.tsx, geo.ts, data/*.json or any WS3 page. If you need a change
  there, stop and tell me exactly what to ask the owner for.
- Import all types from src/types.ts; use the exact SuggestCareModeFn signature.
- suggestCareMode must be a pure function (no store access).
- Tailwind only; must look good at 375px and 1280px; kiosk text >= 20px.
- Only fictional patients. Label simulated features clearly ("Demo: simulated connection").
- Run `npm run build` and fix all errors before every commit. Commit small and often on
  branch ws5-telehealth.
When done, walk me through the Done-when checklist and how to test each item.
```

---

### WS6 — Pitch deck & evidence

**Goal**
Turn the organizers' pitch template into an 8-minute deck that scores high on all four criteria. Back every claim with a cited fact, keep backup screenshots in case the live demo fails, and prepare the team for Q&A. Writing code is not part of this job. Your work counts for **75% of the score** (Evidence, Impact, Feasibility).

**Owns**
- `pitch/[ProductName]_Pitch.pptx`: a copy of `Athens Hackathon/Hackpalachia_Pitch_Template_Final.pptx` with every `[bracket]` replaced
- `docs/evidence.md`: the evidence bank (Section 10), with every number traced to a source
- `docs/deck-copy.md`: the slide text, drafted by Claude and pasted into the deck by a human
- `screenshots/`: one PNG per demo step (from 1:45 PM)

**Don't touch**
`src/` and anything else in the app. If the demo flow needs changing, tell the WS1 owner.

**Depends on / unblocks**
- **Depends on:**
  - the live URL from WS1
  - the demo script (Section 7)
  - the final screen names from WS3, WS4 and WS5, for the screenshots
- **Unblocks:** the 2:45 PM submission. Without the deck nothing gets scored.
- **Start now.** Slides 1–3, 6 and 7 and the appendix don't depend on the app at all.

**Build spec**
1. Draft all slide text in `docs/deck-copy.md`, using Section 9 as the starting point. Keep **≤ 25 words of body text per slide.** Judges should be listening, not reading.
2. Paste the text into the template in PowerPoint or Google Slides.
   - Keep the template's "Judged on: …" tags in the top-right corner of each slide.
   - Delete the "FOR TEAMS · READ FIRST" slide.
3. On slide 2 (Problem), add **one chart**: a bar chart of the primary-care physician ratio for each county against Ohio, using the data in Section 10. A chart that tells the story beats a table.
4. On slide 5 (Prototype):
   - Put the live demo URL in large text.
   - Add a 3-panel storyboard of screenshots as the backup.
   - Label the slide **Built / Simulated / Mocked** (see below).
5. Fill the Appendix with every source (author or publisher, title, year, place, link) and mark anything estimated.
6. Rehearse with a timer by 2:30 PM. Hard cap: **8:00**.

**What to say is built, simulated or mocked** (this goes on slide 5 and gets said out loud):

| Built (working code) | Simulated (fake data in real software) | Mocked (screen only) |
|---|---|---|
| Responsive web app, search and filters, map of **real** Athens-area locations, matching logic, auto-telehealth logic, shared-computer mode | "Accepting new patients" status, "last confirmed" dates, reviews, verified-by badges, providers' shared resources, booking slots, text messages | Sign-in, "Connect your patient portal (e.g., MyChart)" |

**Done when**
- [ ] Every `[bracket]` in the template is replaced, and the instructions slide is deleted
- [ ] Every number on a slide has a source, year and place, and appears in the Appendix
- [ ] Slide 2 shows the "how many people in our region" calculation explicitly
- [ ] Slide 5 has the live URL, backup screenshots, and the Built / Simulated / Mocked label
- [ ] Slide 6 names the riskiest assumption **and** how a pilot would test it
- [ ] Slide 7 names a pilot partner type, a measure, who keeps it running after the pilot, who pays, and **one** specific ask
- [ ] The full run-through comes in at ≤ 8:00 with a timer
- [ ] Deck (.pptx + PDF export), live URL and screenshots are uploaded to the OneDrive folder **by 2:45 PM**

**Paste this into your Claude**
```text
I'm on Workstream 6 (Pitch deck & evidence) of our hackathon project. Read MASTER_PLAN.md in full,
then follow the WS6 section plus Sections 9 (Pitch outline), 10 (Evidence bank) and 11 (Q&A prep).

Your tasks, in order:
1. Create docs/evidence.md from Section 10. Keep the ✅/⚠️ markers. For each ⚠️ item, tell me exactly
   which URL to open and what number to copy so I can verify it by hand.
2. Create docs/deck-copy.md: final text for every slide of Hackpalachia_Pitch_Template_Final.pptx
   (slide by slide, matching the template's [bracket] fields), using Section 9 as the draft.
   Max ~25 words of body text per slide. Keep the speaker notes separate.
3. Build the slide-2 chart data (primary-care physicians per county vs Ohio) as a small CSV I can
   paste into PowerPoint/Google Slides.
4. Draft the Appendix source list (author or publisher, title, year, place, link). Mark anything
   we estimated or inferred, and anything from outside SE Ohio that still needs local verification.

Rules: cite every fact with source, year and place. Never invent a statistic. If you can't verify
one, mark it ⚠️ TODO. Use only fictional, de-identified people (the persona is a composite). Be honest
about what is built vs simulated vs mocked. Don't touch anything in src/.
```

---

## 7. Demo script (≈3 minutes of the 8)

> **Persona (fictional composite):** **Linda, 52, Glouster (Athens County).** Has Medicaid and type 2 diabetes. Her primary care provider retired and she hasn't found a new one. She has a phone, but her home internet is unreliable. In the demo the 📶 switch shows it going out.
>
> **Demo cast** (`DEMO_CAST` in Section 4):
> - **Linda's clinic:** Hopewell Health Centers, The Plains (`hopewell-the-plains`). Accepting new patients; has a nurse, a medical assistant and an exam room, but no retinal camera.
> - **Camera partner:** OhioHealth O'Bleness Hospital, Athens (`ohiohealth-obleness`). Has a portable retinal camera and a retinal imaging technician.
> - **Backup partner:** Hocking Valley Community Hospital, Logan (`hocking-valley-community-hospital`). Used after the ❄️ toggle.
> - **Access point:** Glouster Public Library (`acpl-glouster`). Private room, and staff can help.
> - **Stale listing:** Genesis Primary Care, McConnelsville (`genesis-primary-care-mcconnelsville`). Last confirmed 45 days ago.

### Before you present (setup checklist)
- [ ] Open the live URL. **DemoPanel → "Reset demo".** Confirm all four flags are **off**.
- [ ] Browser zoom at **125%**. Hide bookmarks bar. Close notifications.
- [ ] **Tab 1:** `/#/` (Landing). **Tab 2:** `/#/kiosk` (for beat e).
- [ ] Linda is the default patient. Linda's clinic is selected in the provider dropdown.
- [ ] Backup screenshots of every beat are on the **Prototype slide** in the deck. One teammate holds the clicker for slides; the driver only drives the demo.
- [ ] Do one full dry run, then **Reset demo** again.

### Click-path and lines

| Time | Beat | Click | Say (roughly) |
|---|---|---|---|
| 0:00 | **a. Find care** | Landing → **Continue as Patient** | "This is Linda, a composite of people we heard about: 52, in Glouster, diabetic, and her doctor just retired. Today she'd ask a Facebook group." |
| 0:10 | | Search: **Primary care**; filters **Accepting new patients** + **Medicaid** | "Instead, she filters for who's actually taking new patients and takes her insurance." |
| 0:20 | | Point at the **map** (real Athens-area pins) → open **Linda's clinic** card | "These are real places around Athens. Every listing says when it was last confirmed: this one, **2 days ago**. It's **verified by** the county health department, and **neighbors from her area** reviewed it." *(verification and reviews simulated)* |
| 0:32 | | Scroll to the **stale** listing ("May be out of date · confirmed 45 days ago") | "That's the Facebook-group problem: old information. We flag it." |
| 0:40 | **b. Book with no internet** | Listing → **Connect your patient portal** → choose system → **Allow** → back | "She connects her existing patient portal (simulated) so she doesn't re-type her history." |
| 0:52 | | **Book**: form shows "Prefilled from your patient portal" | |
| 0:58 | | **DemoPanel → 📶 No home internet: ON** | "But Linda has no internet at home." |
| 1:03 | | **CareModeBanner** appears: *"No internet at home? … Glouster Public Library, private room, staff can help you connect, ~6 min. Thu 10:00 AM"* → **Book this** | "We automatically offer a private telehealth room at her local library, with someone there to help." |
| 1:15 | | Confirmation → **text message preview** | "She gets a plain text reminder. No app needed." |
| 1:25 | **c. Providers pool resources** | Switch role → **Provider** (Linda's clinic) → Dashboard | "Now the clinic's side. Linda needs a diabetic eye screening. They have the nurse and the room, but no retinal camera." |
| 1:40 | | **New requirement**: Patient #A-104 · eye care · needs *equipment: Portable retinal camera* + *personnel: Retinal imaging technician* · near Glouster · next 2 weeks → **Find partners** | "They post exactly what they're missing." |
| 1:55 | | Matches: **Camera partner**, score, "~25 min drive", covers the camera → **Propose** → **Accepted** | "The hub finds a partner with a portable camera. One trip: the camera comes to the clinic for a screening day covering several patients, instead of sending each one to Athens." |
| 2:15 | | Requirement status: **Scheduled · screening day at Hopewell The Plains** | |
| 2:20 | **d. Something goes wrong** | **DemoPanel → ❄️ Partner cancelled: ON** | "Then it snows and the partner's van can't make it." |
| 2:27 | | Requirement shows the cancellation → **Re-match** → **Backup partner** proposed → accepted (or screening rescheduled, with Linda's check-in switched to video) | "The hub re-matches to the next partner automatically, and nobody is stranded." |
| 2:45 | **e. The library PC** *(optional)* | Tab 2: `/kiosk` → **Start my telehealth visit** | "And this is what Linda sees on the library computer: huge buttons, a staff-help button, and nothing saved after she leaves." |
| 3:00 | | Back to slides | |

**If the live demo breaks:** say *"Let me show you the same flow from our screenshots,"* switch to the Prototype slide, and narrate the same beats. Never debug live.

**Be honest (required by the ground rules):** "**Built:** search, map with real locations, booking, matching, auto-telehealth, kiosk. **Simulated:** availability, reviews, verification badges, the patient-portal connection, and text messages."

### What each beat proves (rubric)

| Beat | Shows | Rubric criterion |
|---|---|---|
| a. Fresh listings, trust signals, real map | The specific barrier (stale word-of-mouth information, eroded trust) in a real place | **Evidence**, **Impact** |
| b. Auto-telehealth at the library | A realistic user under a real constraint (no broadband) | **Prototype** (score 5: handles a point of failure) |
| c. Providers pool equipment and staff | Who delivers it, using local partners; more visits per trip | **Feasibility**, **Impact** |
| d. Partner cancels → re-match | How the system handles a real failure (weather, a missed van) | **Prototype** (score 5) |
| e. Kiosk mode | What it asks of the person: no home device or internet needed | **Feasibility**, **Impact** |
| Honesty line | What was built, mocked or simulated | **Prototype** (judges are told to ask) |

---

## 8. Failure switches (DemoPanel) reference

The DemoPanel is a floating drawer (bottom-right "⚙ Demo" button) built by **WS1**. Each flag is stored in `store.flags`, and each owning workstream implements the reaction on its own pages.

| Flag | DemoPanel label | What changes, and where | Reaction built by |
|---|---|---|---|
| `noHomeInternet` | 📶 **No home internet** | `/patient/book/:id`: `suggestCareMode` skips `telehealth_home` and recommends the nearest access point. `CareModeBanner` shows the library card. `/patient/telehealth` shows a top note: "Showing places with a private room near you". | **WS5** (logic + banner), **WS3** (Book page re-renders on flag change) |
| `providerCancelled` | ❄️ **Partner / van cancelled** | `/provider/requirements/:id`: the accepted match's partner is marked unavailable, the status shows "Partner cancelled (weather)", and a **Re-match** button excludes that partner and proposes the next one. Patient booking: in-person counts as infeasible, so telehealth is offered. | **WS4** (re-match), **WS5** (care-mode rule) |
| `patientDistrustful` | 🤔 **Patient unsure / distrustful** | `/patient/listing/:id`: the trust panel expands (who verified it, neighbor reviews, "Who runs this site?" explainer) and a **"Talk to a community health worker first"** callback button appears (simulated confirmation). | **WS3** |
| `staleListings` | 🗂 **Stale listings** | Search and listing pages: a few providers render as if `lastConfirmedDaysAgo` were 45. They show the red "May be out of date" label and sort below fresh listings. Provider dashboard: the "Still accepting new patients?" prompt is highlighted. | **WS3** (patient side), **WS4** (dashboard prompt) |

The **Reset demo** button (WS1) turns all flags off and reseeds the store from JSON.

---

## 9. Pitch outline (template slide → content → rubric criterion)

**Time budget (8:00 hard cap):** 0:30 + 1:00 + 0:45 + 1:00 + **3:00 demo** + 0:45 + 0:45 = **7:45**. That leaves 15 seconds of buffer. The Success slide is optional; if you're over time, fold it into slide 7. The Appendix is not presented.

### Slide 1: Title · *Evidence · Impact* · ⏱ 0:30
- **Project name:** [ProductName]
- **One-sentence pitch** (say it word for word):
  > For rural residents in and around Athens County, Ohio, [ProductName] helps people find a trusted provider who is actually taking new patients, and helps providers pool equipment, staff and space to reach them, with telehealth at libraries and churches when internet or travel gets in the way.
- **Team:** name, plus each member's background (nursing student, engineer, business…). Any rural-health experience counts as evidence, so mention it.
- **Track:** Care Delivery
- **Speaker note:** Open with the hook: *"Right now, in a Facebook group somewhere in Appalachian Ohio, someone is typing 'does anyone know a doctor who's taking new patients?'"*

### Slide 2: The Problem · *Evidence · Impact* · ⏱ 1:00
- **Headline:** Finding a doctor in rural SE Ohio runs on word of mouth, and the answers are often out of date.
- **Big number:** **1 : 7,350** — residents per primary care physician in Meigs County, against **1 : 1,328** for Ohio as a whole. Meigs has 3 physicians for about 22,000 people. *(County Health Rankings 2025, Meigs Co. & Ohio)*
- **Chart:** primary-care physician ratio by county:

  | County | Ratio |
  |---|---|
  | Athens | 1 : 1,591 |
  | Hocking | 1 : 2,341 |
  | Perry | 1 : 3,546 |
  | Vinton | 1 : 6,348 |
  | Meigs | 1 : 7,350 |
  | Morgan | 1 : 13,682 |
  | Ohio | 1 : 1,328 |
- **Problem statement:** Rural adults aged 45–64 in Athens, Meigs and Vinton counties can't easily tell which nearby provider is accepting new patients and takes their insurance. They rely on Facebook groups and word of mouth, so they delay care. Many can't fall back on a video visit at home.
- **How many people in our region** (show this math on the slide):
  - Adults aged 45–64: Athens 13,300 + Meigs 6,137 + Vinton 3,694 = **23,131** *(ACS 2020–24)*
  - Of those, the share with no routine checkup in the past year is 23.6% / 20.2% / 20.9% *(CDC PLACES, BRFSS 2023)*. That gives 3,139 + 1,240 + 772 ≈ **5,150 people aged 45–64 who went a year without a checkup**.
  - On top of that, **≈ 6,000 households** in those three counties have no home internet subscription *(ACS 2020–24)*. Telehealth at home isn't an option for them.
  - *Label this as an estimate. The checkup rate covers all adults, not just ages 45–64.*
- **What we heard:**
  > "People ask in Facebook groups, 'does anyone know a primary care provider?' Someone answers, 'there's one at so-and-so, but they don't take new patients.' Is that really the best we can do?"

  — paraphrased from a conversation with a hackathon judge from the rural healthcare sector, Nov 2026
- **So our solution has to:** show **current, trusted** availability, and work for people **without home internet**.
- **Speaker note:** Name one barrier for one group in one place. Say the math out loud: judges score Impact partly on scale.

### Slide 3: Today's Journey · *Evidence* · ⏱ 0:45
- **Headline:** Linda's search for a doctor stalls at "they're not taking patients."
- **Persona (fictional composite):** Linda, 52, Glouster (Athens County). Medicaid. Type 2 diabetes. Her primary care provider retired and she has no new one. Spotty internet at home.
- **Who else matters:** the local clinic's front desk, a nearby FQHC, the county health department, the Glouster library, her adult daughter, her Medicaid plan.
- **Journey:**
  1. **START:** She runs out of her diabetes medication refills and needs a new primary care provider.
  2. **TRY:** She posts in a local Facebook group, gets three names, and calls her plan's directory listings.
  3. **BREAKDOWN** (orange card): Two aren't taking new patients. The third is 50 minutes away. Video visits drop on her home connection. *(Directories can't be trusted; see the OIG note in Section 10.)*
  4. **RESULT:** She delays care, her A1c climbs, and she ends up at urgent care or the ER. The system pays more for worse care.
- **What we still need to verify:** how often listings in SE Ohio are actually out of date. Our evidence on directory accuracy is national.
- **Speaker note:** Label her as a composite. Our solution changes step 3.

### Slide 4: Our Solution · *Impact · Feasibility* · ⏱ 1:00
- **Headline:** One trusted place to see who's actually taking patients nearby, and a way to be seen even without internet.
- **Today, at the breakdown:** stale lists, dead ends, and video visits that fail at home.
- **With [ProductName]:** Linda searches "primary care · Medicaid · accepting." Every listing shows **"Confirmed 2 days ago"** along with neighbor reviews and who verified it. She books. Because she has no home internet, the site **suggests a telehealth room at the Glouster library** with a staff helper.
- **Provider side:** Linda's new clinic needs a diabetic eye screening for her. It has staff but no retinal camera. [ProductName] matches it with a partner that has one, and they hold one pooled clinic day near Glouster.
- **Who delivers it:** A regional public entity (for example, a county health department or a state rural-health program) runs the hub. Providers keep their own listings current with a one-tap weekly confirmation. Libraries and churches host the telehealth rooms.
- **What it asks of the person:** any phone or a library computer; no app to install; free; works for searching without an account.
- **When it can't handle a case:** A listing that hasn't been confirmed in 30+ days is flagged "may be out of date." If a partner cancels, the visit is re-matched or switched to telehealth. A patient who isn't sure can **call a community health worker** instead.
- **Speaker note:** The tool only suggests options; people make every clinical decision. Stress the trust signals: a neighbor's word, made visible.

### Slide 5: Prototype · *Prototype* · ⏱ 3:00 (live demo)
- **Headline:** Linda finds care, even when the internet and the van both fail.
- **Scenario:** Linda (fictional) searches for a primary care provider, books, and loses internet. Then her clinic arranges an eye screening with a partner, and the partner's van cancels.
- **Watch for:** the **"last confirmed"** label and the **automatic switch to a library telehealth room** when the "📶 No home internet" switch is flipped.
- **When things go wrong (shown live):**
  - 📶 no home internet → library telehealth room
  - ❄️ partner van cancelled → re-matched to a different partner, or switched to telehealth
  - 🤔 patient unsure about trusting it → trust details plus a call from a community health worker
- **Label:** **Built:** web app, search, map of real Athens-area locations, matching and telehealth logic. **Simulated:** availability, reviews, resources, text messages. **Mocked:** sign-in, MyChart connection.
- Live URL in large text. Backup screenshots as a 3-panel storyboard.
- **Speaker note:** Follow the demo script in Section 7 exactly. Narrate *why* each step matters, not *what you're clicking*.

### Slide 6: Assumptions & Risks · *Evidence · Feasibility* · ⏱ 0:45
- **Headline:** The whole thing works only if listings stay current. Here's how we'd find out.
- **Our riskiest assumption:** providers will confirm "accepting new patients" at least weekly.
  - Second: they'll share equipment and space with other organizations.
  - Staff sharing is phase 2, because credentialing and liability across organizations need more groundwork.
- **How we'd test it:** In the pilot, track the share of listings confirmed within 7 days.
  - **≥ 80% after 8 weeks:** keep going.
  - **< 50%:** switch to front-desk text-message check-ins or tie confirmation to an existing reporting duty.
- **Biggest risk to the people we serve:** a stale listing sends someone on a long drive for nothing, or someone without a smartphone gets left out.
- **How we'd protect them:**
  - flag stale listings
  - offer a "call before you go" button
  - make library and church computers and a phone line through a community health worker first-class ways in
  - plain-language explanation of who runs the site and what it stores (minimal data, no medical records)
- **Speaker note:** Say what you learned today versus what a pilot still needs to test.

### Slide 7: Pilot & Ask · *Feasibility* · ⏱ 0:45
- **Headline:** 12 weeks, 3 counties, 2 library telehealth rooms.
- **First test:** Athens County plus Meigs and/or Vinton. About 10 provider sites list and confirm availability. 2 library branches host telehealth rooms. Adults aged 45–64 are the target users. 12 weeks.
- **Who would run it** (partner types):
  - county health department: operator and verifier
  - an FQHC: listings plus a pooled clinic day
  - the public library system: telehealth rooms and helpers
  - regional AHEC / OU Heritage College of Osteopathic Medicine: students as navigators
  - Area Agency on Aging: outreach to people aged 60 and over
  - **What they'd need:** a staff lead (~0.25 FTE), a laptop and webcam per room, and listing onboarding.
- **How we'd know:**

  | Measure | "Keep going" result |
  |---|---|
  | Share of searches that lead to a booking | ≥ 25% |
  | Days to first appointment | falling over the pilot |
  | Listings confirmed within 7 days | ≥ 80% |
  | Telehealth visits completed at access points | ≥ 40 |
  | **Follow-up visits completed** (the rubric's own example) | rising |
- **After the pilot:**
  - **Who runs it long term:** a public operator (county or state rural-health program).
  - **Who pays:** startup costs from the **Ohio Rural Health Transformation Program** (ODH) and foundation grants; ongoing costs from a small provider subscription or health-system sponsorship, since a filled appointment slot is revenue.
- **Our ask:** *"An introduction to the Athens County Public Libraries director and one FQHC operations lead, so we can pilot two library telehealth rooms."*

### Success slide (optional, ⏱ 0:15, or fold into slide 7)
| | Quantitative | Qualitative |
|---|---|---|
| **After the pilot** | ≥ 80% of listings confirmed within 7 days; ≥ 40 access-point visits; first appointment sooner | Residents say "I trust it more than the Facebook group" |
| **After year one** | All 7 counties in the region; follow-up completion up for listed clinics | Providers use it to pool resources without being prompted |
| **At scale** | Any rural region: the hub, the library-room model and the confirmation habit all transfer | It becomes the default answer to "does anyone know a doctor?" |

### Appendix (not presented; shared with judges)
- Every source from Section 10 in the format: author or publisher, title, year, place, link.
- Mark estimates: the "≈ 5,150" figure uses an all-adult checkup rate applied to ages 45–64.
- Note what is from outside SE Ohio and still needs local verification: the OIG directory findings are national; the Maclaren et al. study is from the UK; the USDA mortality figures are national.
- **People we spoke with (by role):** hackathon judges from the rural healthcare, pharma and other sectors. Add any subject-matter experts you talk to today.
- **Team:** name, background or role, contact.

---

## 10. Evidence bank (cite source · year · place)

✅ = checked against the source · ⚠️ = needs a human to verify before it goes on a slide

### From the organizer-provided reports (all ✅, checked against the PDFs)
| # | Fact | Source · year · place |
|---|---|---|
| E1 | In 2019, the natural-cause death rate for rural adults aged 25–54 was **43% higher** than for urban adults of the same age. In 1999 the gap was 6%. For all ages the gap grew from 6% to 20%. | Thomas, Dobis & McGranahan, *The Nature of the Rural-Urban Mortality Gap*, USDA ERS EIB-265, Mar 2024 · U.S. (CDC WONDER 1999–2019) |
| E2 | Ohio nursing homes report **severe or very severe access problems** for Medicaid residents with **transportation (40%)** and **emergency dental care (30%)**. | Scripps Gerontology Center, *Nursing Homes in Ohio: A Profile*, Winter 2025–26 · Ohio |
| E3 | Ohio nursing-staff turnover is **57.9%** (RNs 52.9%), above the national average and above every neighboring state. | Same as E2 (CMS 2023 data) · Ohio |
| E4 | From 2018 to 2023, nurse practitioners per health-system bed rose **0.18 → 0.30 (+66.7%)** and physician assistants **0.09 → 0.15 (+66.7%)**, while physicians rose only +4.5%. Health systems are relying more on NPs and PAs. | Odihi & Malone, *An Exploratory Analysis of U.S. Health System Workforce Trends*, NC Rural Health Research Program, Jul 2026 · U.S. (AHRQ Compendium) |
| E5 | Rural communities recruit and keep health staff through **informal networks of trusted local people**. The study recommends a formal community stakeholder group to reduce reliance on individual goodwill. This supports building on community trust. | Maclaren et al., *"Come and work here!"*, J Health Serv Res Policy 30(3), 2025 · remote/rural UK (⚠️ outside Ohio) |
| E6 | Ohio's **Rural Health Transformation Program** is a possible funding route. | ODH, odh.ohio.gov/know-our-programs/rural-health-transformation-program (listed in the organizers' data-source doc) · Ohio. ⚠️ Verify eligibility and timing |

### Local numbers (researched today)
| # | Fact | Source · year · place | Status |
|---|---|---|---|
| L1 | Primary care physician ratio, residents per physician: Athens **1,591:1** (39 PCPs), Hocking 2,341:1, Perry 3,546:1, Vinton **6,348:1** (2 PCPs), Meigs **7,350:1** (3 PCPs), Morgan 13,682:1 (1 PCP), Washington 1,382:1. Ohio 1,328:1; U.S. 1,334:1 | County Health Rankings & Roadmaps, 2025 release, analytic data file (countyhealthrankings.org → Data & Documentation → `analytic_data2025.csv`) · SE Ohio counties. The underlying physician data year is per CHR documentation, likely 2021 | ✅ (ratios computed from CHR's numerator and denominator) |
| L2 | Adults aged 45–64: Athens 13,300 (21.5% of 61,737), Meigs 6,137 (28.0%), Vinton 3,694 (29.2%), Hocking 7,860, Perry 9,574, Morgan 3,714, Washington 15,839. **All 7 counties: 60,118** | U.S. Census ACS 2020–2024 5-year, table B01001 (via api.censusreporter.org; confirm on data.census.gov) · SE Ohio | ✅ |
| L3 | Households with **no internet subscription** (no access, or access without a subscription): Athens 2,978 (12.9%), Meigs 1,977 (**21.7%**), Vinton 1,050 (19.7%), Morgan 17.9%, Hocking 13.7%, Perry 13.3%, Washington 12.2%. **All 7 counties: 13,431 households (14.4%)** | U.S. Census ACS 2020–2024 5-year, table B28002 · SE Ohio | ✅ |
| L4 | Adults with a routine checkup in the past year: Athens **76.4%**, Meigs 79.8%, Vinton 79.1%, Hocking 80.1%, Perry 79.2%, Morgan 80.8%, Washington 80.9% | CDC PLACES county estimates (BRFSS 2023 model-based), data.cdc.gov dataset swc5-untb · SE Ohio | ✅ |
| L5 | Uninsured adults aged 18–64: Athens 7.8%, Meigs 9.6%, Vinton 9.5% | CDC PLACES (BRFSS 2023) · SE Ohio | ✅ |
| L6 | Federal investigators found plan directories listing many **inactive** behavioral-health providers: reported as **55%** in Medicare Advantage plans and **28%** in Medicaid managed care plans | HHS-OIG, OEI-02-23-00540, Oct 2025 · U.S. Percentages are from the AHA news summary (aha.org/news/headline/2025-10-20-…); confirm in the full OIG PDF | ⚠️ |
| L7 | HRSA primary care Health Professional Shortage Area status for Athens, Meigs and Vinton | TODO: check data.hrsa.gov/topics/health-workforce/shortage-areas (search by county), or the Ohio Primary Care Office | ⚠️ TODO |

### "How many people" math (slide 2)
```
Pilot counties: Athens + Meigs + Vinton
Adults 45–64 (ACS 2020–24):      13,300 + 6,137 + 3,694 = 23,131
× no checkup in past year (PLACES 2023, all adults):
   13,300 × 23.6% = 3,139
    6,137 × 20.2% = 1,240
    3,694 × 20.9% =   772
                     ─────
                   ≈ 5,150 adults aged 45–64 without a routine checkup last year   (ESTIMATE)
Households with no internet subscription: 2,978 + 1,977 + 1,050 ≈ 6,000           (ACS 2020–24)
At scale (all 7 counties): 60,118 adults aged 45–64; 13,431 households offline.
```

---

## 11. Q&A prep

| Judge asks… | Our answer |
|---|---|
| **Evidence:** *Who did you hear this from?* | A judge who works in rural healthcare described the Facebook-group problem first-hand. County data backs up the shortage: Meigs has 1 primary care physician per 7,350 residents against 1 per 1,328 for Ohio. |
| **Evidence:** *What are you assuming that you haven't checked?* | That providers will keep their "accepting" status current. That's why the pilot's go/no-go measure is the share of listings confirmed within 7 days. |
| **Impact:** *How many people does this affect, and what one number shows it's working?* | About 5,150 adults aged 45–64 in three counties went a year without a checkup, and about 6,000 households there have no home internet. The one number to watch is follow-up visits completed. |
| **Feasibility:** *Who runs the pilot, and who pays after it?* | A county health department working with an FQHC and the library system. Startup funding from the Ohio Rural Health Transformation Program and grants; after that, provider subscriptions or health-system sponsorship, since a filled slot is revenue. |
| **Prototype:** *What happens when something goes wrong? What's real and what's mocked?* | We showed it live: no internet leads to a library telehealth room, and a cancelled van leads to a re-match or telehealth. The app and its logic are built, availability is simulated, and sign-in and the MyChart connection are mocked. |
| **Trust:** *Why would people trust a website more than their neighbors?* | It shows their neighbors: local reviews, "verified by" a local organization they know, and a visible "last confirmed" date. There's also a community health worker people can call. |
| **Who's left out?** *(no smartphone, no broadband, language, disability)* | You can search without an account. It works on any phone browser and on library and church computers in large-text shared-computer mode, and there's a phone-line fallback through a community health worker. Spanish and other languages would come after the pilot. |
| **Privacy / HIPAA:** *What data do you hold?* | Search needs no data at all. Booking stores only a ZIP code, insurance type and visit type, never medical records. Provider requirements use de-identified patient codes. |
| **Why not Google, Zocdoc or insurer directories?** | They don't show whether a provider is accepting new patients *this week*, and federal investigators have found directories full of inactive providers. Zocdoc-style tools also skip rural clinics and people without broadband. |
| **AI / errors:** *What if a match or suggestion is wrong?* | Matches and telehealth suggestions are rules-based and shown with the reason. A person accepts every match, and stale listings are flagged instead of hidden. |

---

## 12. Submission checklist (2:45 PM, hard deadline)

**App**
- [ ] `main` builds (`npm run build`) and the latest commit is deployed; the live URL opens on a phone **and** a laptop
- [ ] Demo script (Section 7) run end to end **twice** on the deployed URL, not just localhost
- [ ] "Reset demo" puts everything back to the starting state
- [ ] Simulated-data footer is visible on every page
- [ ] No real patient information anywhere; Linda and all reviews are fictional

**Deck** (built from `Hackpalachia_Pitch_Template_Final.pptx`)
- [ ] Instructions slide deleted; every `[bracket]` replaced
- [ ] One-sentence pitch on slide 1 matches what the presenter says out loud
- [ ] Every number has a source, year and place; full list on the appendix slide
- [ ] Slide 5 has screenshots of each demo beat (backup if the live demo fails)
- [ ] Slide 5 says plainly what is **built** (patient and provider flows, matching, map, telehealth suggestion), **real** (locations), and **simulated** (availability, reviews, resources, MyChart connection, text messages, video call)
- [ ] People we spoke with are listed **by role, not by name**

**Upload to the OneDrive folder**
- [ ] Deck (.pptx **and** a PDF export)
- [ ] Live URL and GitHub repo link (in the deck appendix and as a text file)
- [ ] `screenshots/` folder

**Presenting**
- [ ] Rehearsed with a timer: about 5 min of slides + 3 min of demo, under 8 min total
- [ ] Laptop charged, browser zoom 125%, demo tabs pre-opened, DemoPanel flags all **off**
- [ ] One person presents, one clicks through the demo, and everyone knows their Q&A topic (Section 11)

---

## Appendix A — Real location seed list

Research done on Nov 14, 2026. Names and addresses come from official or primary sources wherever they were available. Coordinates come from OpenStreetMap Nominatim.

**Legend**
- **Confidence:** ✅ confirmed on the organization's own site or an official listing · ⚠️ found in directories or aggregators, current status not confirmed. Use these anyway, but a teammate should spot-check them on the map.
- **Coordinates:** a plain value is matched to the building or house number · `≈` means approximate: matched to the street, a neighboring address, or the town center. Pins marked ≈ may sit a little off the building.
- **ServiceType** values follow `src/types.ts`. Services are inferred from each clinic's name and its organization's service list, so treat them as plausible rather than verified.

### A.1 Providers (22)

| id | name | orgType | address | town | county | lat | lng | services | phone | source | conf |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ohiohealth-obleness | OhioHealth O'Bleness Hospital | hospital | 55 Hospital Dr, Athens, OH 45701 | Athens | Athens | 39.32726 | -82.11430 | urgent_care, primary_care, womens_health, specialty, diabetes_care | — | OpenStreetMap; confirm on ohiohealth.com | ⚠️ |
| ohiohealth-nelsonville | OhioHealth Nelsonville Health Center (Urgent Care + Heritage College Primary Care) | clinic | 11 John Lloyd Evans Memorial Dr, Nelsonville, OH 45764 | Nelsonville | Athens | 39.46541 | -82.24978 | urgent_care, primary_care, pediatrics | 740-753-7342 | https://www.ohiohealth.com/nelsonville | ✅ |
| hopewell-athens | Hopewell Health Centers – Athens Behavioral Health / Primary Care | fqhc | 90 Hospital Dr, Athens, OH 45701 | Athens | Athens | 39.32893 | -82.11567 | primary_care, behavioral_health | 740-592-3091 | https://www.hopewellhealth.org/locations/ | ✅ |
| hopewell-nelsonville | Hopewell Health Centers – Nelsonville Dental & Primary Care | fqhc | 1950 Mount St. Marys Dr, Nelsonville, OH 45764 | Nelsonville | Athens | 39.46327 | -82.24321 | primary_care, dental | 740-797-2352 | https://www.hopewellhealth.org/locations/ | ✅ |
| hopewell-coolville | Hopewell Health Centers – Coolville Primary Care | fqhc | 25716 Wilson St, Coolville, OH 45723 | Coolville | Athens | ≈39.21796 | ≈-81.80677 | primary_care | 740-846-0008 | https://www.hopewellhealth.org/locations/ | ✅ |
| hopewell-the-plains | Hopewell Health Centers – Main Clinic (Appalachian Family Life Center) | fqhc | 25 S Clinton St, The Plains, OH 45780 | The Plains | Athens | ≈39.37009 | ≈-82.13237 | primary_care, womens_health, pediatrics | 740-249-4318 | https://www.hopewellhealth.org/locations/ | ✅ |
| hopewell-lancer | Hopewell Health Centers – Lancer Care Clinic | fqhc | 8461 State Route 144, Stewart, OH 45778 | Stewart | Athens | ≈39.30813 | ≈-81.89458 | primary_care, pediatrics | 740-662-0541 | https://www.hopewellhealth.org/locations/ | ✅ |
| athens-city-county-health-dept | Athens City-County Health Department | health_department | 278 W Union St, Athens, OH 45701 | Athens | Athens | 39.32986 | -82.11385 | womens_health, pediatrics, specialty | 740-592-4431 | https://npin.cdc.gov/organization/athens-city-county-health-department | ✅ |
| ou-heritage-community-clinic | Ohio University Heritage Community Clinic (base for the Heritage College mobile clinics) | clinic | 16 W Green Dr (Grosvenor Hall), Athens, OH 45701 | Athens | Athens | 39.32457 | -82.10606 | primary_care, diabetes_care, pediatrics | 740-593-2432 | https://www.ohio.edu/medicine/community-health/community-clinic/appointment | ✅ |
| health-recovery-services | Health Recovery Services | behavioral_health | 224 Columbus Rd, Athens, OH 45701 | Athens | Athens | 39.35721 | -82.10385 | behavioral_health | 740-592-6720 | https://ohio.edu/counseling/resources/athens | ⚠️ |
| hopewell-pomeroy | Hopewell Health Centers – Pomeroy Dental, Primary & Behavioral Health | fqhc | 41865 Pomeroy Pike, Pomeroy, OH 45769 | Pomeroy | Meigs | ≈39.05579 | ≈-82.01299 | primary_care, dental, behavioral_health | 740-992-0540 | https://www.hopewellhealth.org/locations/ | ✅ |
| hopewell-racine | Hopewell Health Centers – Racine Dental | fqhc | 106 Tyree Blvd, Racine, OH 45771 | Racine | Meigs | 38.97124 | -81.91174 | dental | 740-444-5247 | https://www.hopewellhealth.org/locations/ | ✅ |
| holzer-meigs | Holzer Meigs (clinic) | clinic | 88 E Memorial Dr, Pomeroy, OH 45769 | Pomeroy | Meigs | 39.03895 | -82.04554 | primary_care, womens_health, pediatrics | 740-992-0060 | https://holzer.org/locations/locations-profile/?id=9 | ⚠️ |
| holzer-meigs-ed | Holzer Meigs Emergency Department (24/7) | hospital | 41861 Pomeroy Pike, Pomeroy, OH 45769 | Pomeroy | Meigs | 39.05579 | -82.01299 | urgent_care | — | https://holzer.org/locations/locations-profile/?id=10 | ⚠️ |
| fruth-pharmacy-pomeroy | Fruth Pharmacy – Pomeroy | pharmacy | 706 W Main St, Pomeroy, OH 45769 | Pomeroy | Meigs | 39.01061 | -82.04481 | pharmacy | 740-992-6491 | https://www.rxless.com/pharmacies/ohio/pomeroy/fruth-pharmacy/706-W-Main-St/1346255270 (NPI record) | ⚠️ |
| hopewell-mcarthur | Hopewell Health Centers – McArthur Dental, Primary & Behavioral Health | fqhc | 31891 State Route 93 N, McArthur, OH 45651 | McArthur | Vinton | 39.26200 | -82.47738 | primary_care, dental, behavioral_health | 740-596-5249 | https://www.hopewellhealth.org/locations/ | ✅ |
| hocking-valley-community-hospital | Hocking Valley Community Hospital | hospital | 601 State Route 664 N, Logan, OH 43138 | Logan | Hocking | 39.54812 | -82.42993 | urgent_care, primary_care, specialty | 740-380-8000 | https://www.hockinghillschamber.com/member/hocking-valley-community-hospital | ⚠️ |
| hopewell-logan | Hopewell Health Centers – Logan Primary Care | fqhc | 30381 Chieftain Dr, Logan, OH 43138 | Logan | Hocking | 39.55442 | -82.45509 | primary_care | 740-385-2555 | https://www.hopewellhealth.org/locations/ | ✅ |
| hopewell-new-lexington | Hopewell Health Centers – New Lexington Primary Care | fqhc | 2541 Panther Dr, New Lexington, OH 43764 | New Lexington | Perry | 39.72625 | -82.20616 | primary_care, womens_health | 740-342-4192 | https://www.hopewellhealth.org/locations/ | ✅ |
| genesis-primary-care-mcconnelsville | Genesis Primary Care – McConnelsville | clinic | 4279 State Route 376, McConnelsville, OH 43756 | McConnelsville | Morgan | ≈39.64877 | ≈-81.85337 | primary_care | 740-651-5188 | https://www.genesishcs.org/taxonomy/term/5261 | ⚠️ |
| marietta-memorial-hospital | Memorial Health System – Marietta Memorial Hospital | hospital | 401 Matthew St, Marietta, OH 45750 | Marietta | Washington | 39.43170 | -81.46454 | urgent_care, specialty, womens_health, diabetes_care, eye_care | 740-374-1400 | https://mhsystem.org/locations/hospital/marietta-memorial | ✅ |
| hopewell-marietta-bh | Hopewell Health Centers – Washington Behavioral Health (Marietta) | behavioral_health | 207 Colegate Dr, Suite D, Marietta, OH 45750 | Marietta | Washington | 39.42142 | -81.43418 | behavioral_health | 740-376-0930 | https://www.hopewellhealth.org/locations/ | ✅ |

**Proposed `DEMO_CAST` ids** (WS2 confirms these and writes them into `src/config.ts`; resources follow Section 4 → Demo story data, using only the canonical labels):

| `DEMO_CAST` key | id | Why |
|---|---|---|
| `clinicProviderId` | `hopewell-the-plains` | Hopewell's main FQHC clinic, about 15 min from Glouster. Gets `Registered nurse`, `Medical assistant`, `Exam room` and **no** camera |
| `cameraPartnerId` | `ohiohealth-obleness` | The Athens hospital. Gets `Portable retinal camera`, `Retinal imaging technician` and `Mobile clinic van` |
| `backupPartnerId` | `hocking-valley-community-hospital` | Farther away (Logan). Gets `Portable retinal camera` and `Retinal imaging technician` |
| `accessPointId` | `acpl-glouster` | Glouster Public Library, Linda's town |
| `staleProviderId` | `genesis-primary-care-mcconnelsville` | Seeded `lastConfirmedDaysAgo: 45` |

Other realistic extras (canonical labels only): `ou-heritage-community-clinic` gets `Mobile clinic van` + `Nurse practitioner` (the Heritage College runs mobile units across southeast Ohio, per [OU News 2024](https://www.ohio.edu/news/2024/04/heritage-college-osteopathic-medicine-adds-mini-mobile-unit-health-clinic-fleet)). `athens-city-county-health-dept` gets `Registered nurse` + `Vaccine cold storage` + `Community room (pop-up clinic)`. `marietta-memorial-hospital` gets `Portable ultrasound` + `Nurse practitioner`.

### A.2 Telehealth access points (15)

| id | name | kind | address | town | county | lat | lng | hours (real, as published) | phone | source | conf |
|---|---|---|---|---|---|---|---|---|---|---|---|
| acpl-athens | Athens Public Library (ACPL) | library | 30 Home St, Athens, OH 45701 | Athens | Athens | 39.33445 | -82.08411 | Mon–Thu 9–8, Fri–Sat 9–5 | 740-592-4272 | https://www.myacpl.org/branches/ | ✅ |
| acpl-nelsonville | Nelsonville Public Library (ACPL main branch) | library | 95 W Washington St, Nelsonville, OH 45764 | Nelsonville | Athens | 39.46077 | -82.23398 | Mon–Thu 10–6, Fri 9–5, Sat 9–1 | 740-753-2118 | https://www.myacpl.org/branches/ | ✅ |
| acpl-the-plains | The Plains Public Library | library | 14 S Plains Rd, The Plains, OH 45780 | The Plains | Athens | ≈39.35006 | ≈-82.13598 | Mon–Thu 10–6, Fri 9–5, Sat 9–1 | 740-797-4579 | https://www.myacpl.org/branches/ | ✅ |
| acpl-glouster | Glouster Public Library | library | 20 Toledo St, Glouster, OH 45732 | Glouster | Athens | 39.50015 | -82.08723 | Mon–Thu 10–6, Fri 9–5, Sat 9–1 | 740-737-6034 | https://www.myacpl.org/branches/ | ✅ |
| acpl-wells-albany | Wells Public Library (Albany) | library | 5200 Washington Rd, Albany, OH 45710 | Albany | Athens | 39.22541 | -82.20574 | Mon–Fri 10–6, Sat 9–1 | 740-737-6030 | https://www.myacpl.org/branches/ | ✅ |
| acpl-chauncey | Chauncey Public Library | library | 29 Converse St, Chauncey, OH 45719 | Chauncey | Athens | 39.39914 | -82.12867 | Mon–Fri 10–6, Sat 9–1 | 740-797-2512 | https://www.myacpl.org/branches/ | ✅ |
| acpl-coolville | Coolville Public Library | library | 26401 Main St, Coolville, OH 45723 | Coolville | Athens | 39.22197 | -81.79694 | Mon–Thu 10–6, Fri 9–5 | 740-737-6036 | https://www.myacpl.org/branches/ | ✅ |
| usac-athens-community-center | United Seniors of Athens County (Athens Community Center) | senior_center | 701 E State St, Suite 101, Athens, OH 45701 | Athens | Athens | 39.33648 | -82.07537 | not published; use "Mon–Fri 9–4 (confirm)" | 740-594-3535 | https://www.aaa7.org/county-directories | ⚠️ |
| fbc-nelsonville | First Baptist Church of Nelsonville (candidate) | church | 15 Adams St, Nelsonville, OH 45764 | Nelsonville | Athens | ≈39.46435 | ≈-82.23728 | not published | — | https://directory.plentiful.org/ohio/nelsonville/the-first-baptist-church-of-nelsonville-c6647ce5 | ⚠️ |
| bishopville-church-of-christ | Bishopville Church of Christ (candidate) | church | 6555 State Route 78, Glouster, OH 45732 | Bishopville (Glouster mailing address) | Morgan | 39.51318 | -82.04774 | not published | 740-767-4177 | https://directory.plentiful.org/ohio/glouster/bishopville-church-of-christ-food-pantry-c222d1a6 | ⚠️ |
| meigs-library-pomeroy | Meigs County District Public Library – Pomeroy | library | 216 W Main St, Pomeroy, OH 45769 | Pomeroy | Meigs | 39.02576 | -82.03664 | confirm on site | 740-992-5813 | https://www.meigslibrary.org/findinfo | ✅ |
| herbert-wescoat-library | Herbert Wescoat Memorial Library | library | 120 N Market St, McArthur, OH 45651 | McArthur | Vinton | 39.24747 | -82.47852 | confirm on site | 740-596-5691 | https://www.vintoncountypublic.lib.oh.us/node/482 | ✅ |
| logan-hocking-library | Logan-Hocking County District Library | library | 230 E Main St, Logan, OH 43138 | Logan | Hocking | 39.54019 | -82.40508 | confirm on site | 740-385-2348 | https://www.ohiolegalhelp.org/resource/logan-hocking-county-district-library | ⚠️ |
| perry-county-library | Perry County District Library – New Lexington | library | 117 S Jackson St, New Lexington, OH 43764 | New Lexington | Perry | 39.71444 | -82.20570 | confirm on site | — | https://www.pcdl.org/about | ⚠️ |
| kate-love-simpson-library | Kate Love Simpson Morgan County Library | library | 358 E Main St, McConnelsville, OH 43756 | McConnelsville | Morgan | 39.64852 | -81.84896 | confirm on site | 740-962-2533 | https://www.morgan.lib.oh.us/about | ✅ |

Give every access point `status: "proposed_partner"` in the demo. None of them has agreed to anything, so the pins should be labeled "proposed partner site." `hasPrivateRoom`, `hasHelper`, `devices` and `openSlots` are simulated.

### A.3 Fallback town-center coordinates (OpenStreetMap Nominatim; use for patient personas and for "near town" in requirements)

| Town | County | lat | lng |
|---|---|---|---|
| Athens | Athens | 39.32920 | -82.10130 ≈ (downtown) |
| Nelsonville | Athens | 39.45868 | -82.23182 |
| The Plains | Athens | 39.37009 | -82.13237 |
| Glouster | Athens | 39.50313 | -82.08459 |
| Albany | Athens | 39.22757 | -82.20237 |
| Chauncey | Athens | 39.39785 | -82.12931 |
| Coolville | Athens | 39.22174 | -81.79736 |
| Pomeroy | Meigs | 39.02805 | -82.03422 |
| McArthur | Vinton | 39.24646 | -82.47849 |
| Logan | Hocking | 39.54010 | -82.40710 ≈ (downtown; Nominatim returned Logan *County*, so this was taken from the library pin) |
| New Lexington | Perry | 39.71399 | -82.20783 |
| McConnelsville | Morgan | 39.64877 | -81.85337 |
| Marietta | Washington | 39.41677 | -81.45484 |

### A.4 How WS2 should use this

1. Copy each row into `src/data/providers.json` or `src/data/accessPoints.json`, matching the `Provider` and `AccessPoint` types.
   - Use the `id` column as given.
   - Drop the `≈` signs; the numbers are still usable.
   - Put the source URL in `dataSource`.
2. **Real fields:** name, address, town, county, location, phone, hours. **Simulated fields:** `acceptingNewPatients`, `lastConfirmedDaysAgo`, `offersTelehealth`, `trust`, `resources`, `insurances`, and for access points `status`, `hasPrivateRoom`, `hasHelper`, `devices`, `openSlots`. The `SimulatedFooter` covers the simulated fields.
3. **Spread out the simulated values** so the demo is interesting.
   - Make about 30% of primary-care listings `acceptingNewPatients: false`. That is the Facebook-group problem.
   - Make 2–3 listings 30+ days stale.
   - Make sure the demo persona's town (Glouster) has **no** nearby primary care that is accepting new patients and takes Medicaid, so the story has to send them to a farther provider or to telehealth at the Glouster library.
4. Hopewell Health Centers (FQHC) almost certainly takes Medicaid and offers a sliding fee scale, so set `insurances: ["medicaid","medicare","private","sliding_scale"]` for Hopewell sites. That is a reasonable simulation, not verified per site.
5. Hopewell has other sites that are relevant but not in the table, such as the Respite crisis program, the REACH youth day-treatment sites and the WIC offices. Add them only if the map looks sparse.

### A.5 Notes and caveats found during research

- **Health Recovery Services (Athens):** the address comes from an Ohio University resource page. No merger with Hopewell was found. Current status is unconfirmed.
- **Holzer Meigs** appears to be a clinic plus a freestanding 24/7 emergency department, not a full inpatient hospital. Treat both entries that way.
- **Genesis McConnelsville:** one Genesis page lists a Zanesville address for this clinic, which is probably an error. The pin is at the town center.
- **Perry County District Library:** the library posted a notice to bidders for a New Lexington renovation in March 2025 ([PDF](https://pcdl.org/sites/default/files/attachments/Notice%20to%20Bidders%20PCDL_NEWLEX_RENO%2025MAR25.pdf)). Services may be temporarily relocated, so confirm before naming it in the pitch.
- **United Seniors of Athens County:** one MapQuest listing marks it "Closed," which is probably stale. A 2019 county brochure and the regional Area Agency on Aging directory still list it.
- **Bishopville Church of Christ** has a Glouster mailing address but sits in **Morgan County** according to OpenStreetMap. Directories disagree on the house number (6555 vs 6655 SR 78).
- **No hospital or clinic closures** turned up for any site in this list. The research was not exhaustive.
- Hopewell describes itself as having **22 sites across 9 southeast Ohio counties**. That is a useful scale and partner fact for the pitch's feasibility slide.
