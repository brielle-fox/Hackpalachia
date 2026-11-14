import L from 'leaflet';
import type { OrgType } from '../../types';

/** Pin colors (MASTER_PLAN WS1 step 10). Keep in sync with Legend.tsx and the @theme pin tokens. */
export const PIN_COLORS: Record<OrgType | 'access_point', string> = {
  hospital: '#1d4ed8',
  fqhc: '#0f766e',
  clinic: '#0f766e',
  health_department: '#7c3aed',
  behavioral_health: '#db2777',
  dental: '#0891b2',
  pharmacy: '#0891b2',
  mobile_unit: '#0891b2',
  access_point: '#ea580c',
};

export interface PinState {
  big?: boolean;          // selected or highlighted → 30px
  dimmed?: boolean;       // not in highlightIds → 35%
  notAccepting?: boolean; // provider not accepting → 45% + grey ring
}

// Lucide "library" glyph so access points read as public places, not clinics.
const LIBRARY_GLYPH =
  '<svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>';

const cache = new Map<string, L.DivIcon>();

function build(color: string, { big, dimmed, notAccepting }: PinState, glyph = ''): L.DivIcon {
  const key = `${color}|${big}|${dimmed}|${notAccepting}|${glyph.length}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const size = big ? 30 : 22;
  const opacity = dimmed ? 0.35 : notAccepting ? 0.45 : 1;
  const ring = notAccepting ? '#a8a29e' : '#ffffff';
  const icon = L.divIcon({
    className: 'cb-pin',
    html: `<div style="width:${size}px;height:${size}px;background:${color};border:${notAccepting ? 3 : 2}px solid ${ring};border-radius:9999px;box-shadow:0 2px 4px rgba(0,0,0,.25);opacity:${opacity};display:grid;place-items:center;box-sizing:border-box">${glyph}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
    tooltipAnchor: [size / 2, 0],
  });
  cache.set(key, icon);
  return icon;
}

export function providerIcon(orgType: OrgType, state: PinState): L.DivIcon {
  return build(PIN_COLORS[orgType], state);
}

export function accessPointIcon(state: PinState): L.DivIcon {
  return build(PIN_COLORS.access_point, state, LIBRARY_GLYPH);
}

export const originIcon = L.divIcon({
  className: 'cb-pin',
  html: '<div style="width:36px;height:36px;border-radius:9999px;background:rgba(29,78,216,.18);display:grid;place-items:center"><div style="width:14px;height:14px;border-radius:9999px;background:#1d4ed8;border:3px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.3)"></div></div>',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});
