// WS4: known towns (from providers + access points) with an approximate centre, for "where should care happen".
import type { LatLng } from '../../types';
import { getAccessPoints } from '../../lib/data';
import type { Provider } from '../../types';

export function knownTowns(providers: Provider[]): { town: string; location: LatLng }[] {
  const acc = new Map<string, { lat: number; lng: number; n: number }>();
  for (const x of [...providers, ...getAccessPoints()]) {
    const t = acc.get(x.town) ?? { lat: 0, lng: 0, n: 0 };
    acc.set(x.town, { lat: t.lat + x.location.lat, lng: t.lng + x.location.lng, n: t.n + 1 });
  }
  return [...acc.entries()]
    .map(([town, v]) => ({ town, location: { lat: +(v.lat / v.n).toFixed(5), lng: +(v.lng / v.n).toFixed(5) } }))
    .sort((a, b) => a.town.localeCompare(b.town));
}
