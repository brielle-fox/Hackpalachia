# WS5 integration notes (telehealth, kiosk, portal mock)

Built against the MASTER_PLAN Section 4 contract in a harness. Type-check clean. Contains **only WS5-owned files**.

## Files
- `src/lib/telehealth.ts`: `suggestCareMode` (exact `SuggestCareModeFn`). Also exports `nearestAccessPoint`, `formatSlot`, `TELEHEALTH_ELIGIBLE`, `MAX_REASONABLE_DRIVE`
- `src/components/telehealth/`: `CareModeBanner`, `AccessPointCard`, `MockVideoCall`, `PortalConsent`, `useIdleTimer`, `Chip`, `icons`
- `src/pages/patient/AccessPoints.tsx` (`/patient/telehealth`), `src/pages/patient/ConnectPortal.tsx` (`/patient/connect`), `src/pages/Kiosk.tsx` (`/kiosk`)

## Verified behaviour (Linda → Hopewell The Plains, about 19 min)
| Case | Recommended |
|---|---|
| Flags off, diabetes care | `in_person` (alternatives: home video, library) |
| 📶 No home internet | `telehealth_access_point` → Glouster Public Library |
| ❄️ Provider cancelled, has internet | `telehealth_home` |
| `eye_care` | `in_person` only (needs equipment) |

With 📶 on, the library is preferred whenever it's closer than the clinic, so demo beat (b) always shows the library banner.

## When merging with WS1–WS3
1. **WS3 Book page:** render `<CareModeBanner suggestion={suggestCareMode(patient, provider, service, getAccessPoints(), flags)} onChoose={(mode, accessPointId?) => …} />`. The second argument is optional. Show "Prefilled from your patient portal" when `patient.portalConnected`.
2. **Deep links WS3 should honour:**
   - Book page reads `?ap=<id>&slot=<slot>`. AccessPoints links to `/patient/book/:providerId?ap=…&slot=…` when opened with `?provider=<id>`.
   - ConnectPortal returns to `?return=<url>`, else `/patient`. Link to it as `/patient/connect?return=/patient/book/<id>`.
3. **`/kiosk` route:** register it **outside** `<Layout>` so it's full-screen. It still renders inside the layout.
4. **Kiosk sign-out** calls `setRole(null)` and `setCurrentPatient(null)`, never `resetDemo`. WS3 pages must handle `currentPatientId === null` by falling back to `patients[0]`.
5. **Idle timer:** `IDLE_MS` in `Kiosk.tsx` (3 min). Set it to `10_000` to test.
6. **Dependencies:**
   - store: `setRole`, `setCurrentPatient`, `connectPortal`, `flags`
   - helpers: `freshnessLabel`, `approxDriveMinutes`, `formatDrive`
   - `MapView` props: `accessPoints`, `origin`, `center`, `zoom`, `selectedId`, `highlightIds`, `onSelect`, `fitToMarkers`, `className`

   AccessPoints changes `center`/`zoom` on selection, so the real MapView should fly to a new center.
7. **UI kit:** nothing imports from `components/ui`. `Chip.tsx` is a local stand-in; swap it for WS1's `Badge` if you like.
