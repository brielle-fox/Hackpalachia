# CareBridge: Design reference

The Figma file is the visual source of truth for WS1–WS3. This page records where everything lives and the decisions made, so the code can follow it without reopening Figma.

**Figma file:** https://www.figma.com/design/3EPWjnax6srniqTTYJv54n

| Page | What's on it | Link |
|---|---|---|
| WS1/WS2 · Foundations | Color/radius tokens, text styles, UI kit (Button, Card, Badge, Modal, Toggle, Chip), Header, SimulatedFooter, Demo button, Lucide icons, map pins/popup/legend, ListingCard, CareModeBanner | [open](https://www.figma.com/design/3EPWjnax6srniqTTYJv54n?node-id=0-1) |
| WS1 · Landing & Demo Panel | Landing (desktop + phone), Demo Panel drawer + bottom sheet, reset confirmation, page placeholder, hero headline options | [open](https://www.figma.com/design/3EPWjnax6srniqTTYJv54n?node-id=1-2) |
| WS3 · Patient | Search (desktop split view, phone list/map, filters sheet, empty state), Listing (default, TrustPanel, not accepting, CHW modal, not found), Book (before/after 📶), Confirmation | [open](https://www.figma.com/design/3EPWjnax6srniqTTYJv54n?node-id=1-3) |
| Parked · WS4 / WS5 | Provider and Telehealth/Portal screens, drawn before scope was narrowed. Out of scope for this branch; available to whoever owns WS4/WS5 | — |

## Tokens (`src/index.css` → `@theme`)

| Token | Value | Use |
|---|---|---|
| `brand` | `#0f766e` | Primary buttons, links, logo |
| `brand-soft` | `#ccfbf1` | Selected states, icon tiles |
| `brand-dark` | `#115e59` | Text on `brand-soft` |
| `ok` / `ok-soft` | `#16a34a` / `#dcfce7` | Fresh, accepting |
| `warn` / `warn-soft` | `#d97706` / `#fef3c7` | Aging, cautions, "flag on" dot |
| `danger` / `danger-soft` | `#dc2626` / `#fee2e2` | Stale, cancellations, reset |
| `info` / `info-soft` | `#1d4ed8` / `#dbeafe` | Hospital pins, provider icon tile |
| `access` / `access-soft` | `#ea580c` / `#ffedd5` | Telehealth access points |
| Pins | hospital `#1d4ed8` · fqhc/clinic `#0f766e` · health dept `#7c3aed` · behavioral `#db2777` · dental/pharmacy/mobile `#0891b2` · access point `#ea580c` | Map |
| Neutrals | Tailwind `stone` (bg `stone-50`, borders `stone-200`, body `stone-900`, secondary `stone-600`, muted `stone-400`) | Everything else |

Type: **Inter**. Display 44/52 bold (−2%), H1 32/40 bold (−1.5%), H2 24/32 semibold (−1%), H3 18/26 semibold, Body 16/24, Small 14/20, Caption 12/16 medium. Radii: `rounded-xl` (12) and `rounded-2xl` (16) only.

## Decisions

- **No emojis in the UI.** All icons are [Lucide](https://lucide.dev) (`lucide-react`); Figma icon components are named `Icon/<lucide-name>`.
- **Logo:** teal rounded square with a white bridge glyph, followed by the wordmark.
- **Landing hero copy:**
  - Eyebrow: *Athens County & Southeast Ohio*
  - Headline: *Connecting southeast Ohio to care, and providers to each other.*
  - Supporting line: *Every listing is confirmed and dated by the provider, so no one has to rely on secondhand tips.*
- **Landing role cards:** stethoscope icon "I'm looking for care" (with four quick-start service chips that open Search pre-filtered) and hospital icon "I'm a provider" (with the organization dropdown).
- **Trust strip:** Fresh, not word of mouth (clock) · Locally verified (shield-check) · Care without home internet (video).
- **Demo Panel:** right-hand drawer on desktop, bottom sheet on phones; scenario rows with icon, label, one-line effect and switch; "N on" badge; Reset demo asks for confirmation first; Shift+D hint.
- **WS3 greeting:** "Hi, Cindy!"
- **Placeholder pages:** dashed card with workstream, page name and route.
