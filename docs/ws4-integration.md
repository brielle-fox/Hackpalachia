# WS4 integration notes (provider requirements & matching)

Built against the MASTER_PLAN Section 4 contract in a harness. Type-check clean, and `npm run build` passes alongside WS5. Contains **only WS4-owned files**.

## Files
- `src/lib/matching.ts`: `matchRequirement` (exact `MatchRequirementFn`, pure). Also exports `resourceCovers()`
- `src/data/requirements.json`: `{ requirements, matches }`, with:
  - `req-demo` (open)
  - `req-sched` (scheduled, plus its accepted match)
  - `req-incoming`: an incoming request to the demo clinic, so the dashboard has one to show
  - `req-open`
- `src/pages/provider/`: `Dashboard`, `NewRequirement`, `Requirement`
- `src/components/provider/`: `ui.tsx` (local Button/Card/chips), `vocab.ts`, `AcceptingCard`, `ResourceManager`, `NeedPicker`, `MatchCard`, `PoolingColumns`, `useCurrentProvider`, `towns`

## Verified
| Case | Best match | Score | Notes |
|---|---|---|---|
| `req-demo` | `ohiohealth-obleness` | 93 | covers 2/2, ~24 min, held at Hopewell The Plains |
| `req-demo` with O'Bleness excluded (❄️ re-match) | `hocking-valley-community-hospital` | 91 | |

## When merging with WS1–WS3
1. **WS1 store:** `saveMatches(reqId, m)` must **replace** that requirement's matches. `getSeedMatches()` must load `requirements.json → .matches`.
2. **WS2 `providers.json`:** must keep the demo-cast resource labels exactly (Section 4 → Demo story data), or `req-demo` won't match. `req-sched`'s seeded match references resource ids `athens-city-county-health-dept-r1` and `ou-heritage-community-clinic-r1`. If the ids differ, it still renders; coverage labels just fall back to the need label.
3. **Current provider:** falls back to `DEMO_CAST.clinicProviderId` when none is selected.
4. **Resolved cancellations** are tracked via `requirement.note` prefixes `[re-matched]` / `[telehealth]`, which hide the ❄️ alert. No contract change; "Reset demo" clears it.
5. **Dependencies:**
   - `MapView` (default export; props `providers`, `origin`, `highlightIds`, `className`)
   - `getAccessPoints`, `approxDriveMinutes`, `formatDrive`, `freshnessLabel`
   - Tailwind tokens `brand`, `brand-soft`, `ok`, `warn`, `danger`
   - **No dependency on `components/ui`**
