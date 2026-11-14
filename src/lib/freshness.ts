import type { DemoFlags, Provider } from '../types';
import { getProviders } from './data';

export type FreshnessTone = 'fresh' | 'aging' | 'stale';

/** 0 → today; 1–7 fresh; 8–30 aging; over 30 stale ("May be out of date · confirmed N days ago"). */
export function freshnessLabel(daysAgo: number): { text: string; tone: FreshnessTone } {
  if (daysAgo <= 0) return { text: 'Confirmed today', tone: 'fresh' };
  const days = daysAgo === 1 ? '1 day' : `${daysAgo} days`;
  if (daysAgo <= 7) return { text: `Confirmed ${days} ago`, tone: 'fresh' };
  if (daysAgo <= 30) return { text: `Confirmed ${days} ago`, tone: 'aging' };
  return { text: `May be out of date · confirmed ${days} ago`, tone: 'stale' };
}

const seedIndex = new Map(getProviders().map((p, i) => [p.id, i]));

/**
 * Days since the provider confirmed, with the 🗂 stale-listings demo flag applied: when it's on,
 * every third provider (by seed order) reads 45 days. Same rule as useEffectiveProviders, so
 * calling it on an already-effective provider is harmless.
 */
export function effectiveDaysAgo(p: Provider, flags: Pick<DemoFlags, 'staleListings'>): number {
  const i = seedIndex.get(p.id);
  return flags.staleListings && i !== undefined && i % 3 === 0 ? 45 : p.lastConfirmedDaysAgo;
}
