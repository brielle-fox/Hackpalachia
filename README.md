# CareBridge

**Hackpalachia Rural Health Hackathon · Athens, OH · Nov 14, 2026 · Care Delivery track**

CareBridge is a hub where rural residents can find a trusted provider who is actually accepting new patients. Providers use it to pool equipment, staff and space, and when home internet or travel gets in the way, it offers telehealth at local libraries and churches.

> Locations are real (Athens County and its neighbouring counties, Ohio). Availability, reviews, shared resources, the MyChart connection and text messages are **simulated** for this demo. All patients are fictional.

## Run it
```bash
npm install
npm run dev          # http://localhost:5173
# or, for the production build:
npm run build && npm run preview
```

## Demo
- **Script:** [`MASTER_PLAN.md` §7](MASTER_PLAN.md) or [`docs/speaker_script.md`](docs/speaker_script.md)
- **Before you start:** open the **Demo** button (bottom-right) → **Reset demo**.
- **Failure switches** (same Demo panel):
  - 📶 No home internet
  - ❄️ Partner cancelled
  - 🤔 Patient unsure
  - 🗂 Stale listings
- **Screenshots of every step:** [`screenshots/`](screenshots/)

## What's where
| Path | What |
|---|---|
| `src/` | The app (React + Vite + TypeScript + Tailwind, Leaflet map, no backend) |
| `pitch/CareBridge_Pitch.pptx` / `.pdf` | Pitch deck, built from the organizers' template |
| `docs/evidence.md` | Sources and numbers (source · year · place) |
| `MASTER_PLAN.md` | Full plan: contract, workstreams, demo script, pitch outline, Q&A |
