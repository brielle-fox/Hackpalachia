// WS4: matchRequirement (pure). Cancelled partners are filtered out by the CALLER.
import type { MatchRequirementFn, Match, NeedCoverage, Provider, Requirement, RequirementNeed, ResourceOffer } from '../types';
import { approxDriveMinutes } from './geo';

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();

export function resourceCovers(r: ResourceOffer, n: RequirementNeed): boolean {
  if (r.kind !== n.kind) return false;
  const a = norm(r.label), b = norm(n.label);
  return a.length > 0 && b.length > 0 && (a.includes(b) || b.includes(a));
}

interface Combo { partners: Provider[]; coverage: NeedCoverage[]; uncovered: RequirementNeed[] }

function greedy(req: Requirement, candidates: Provider[]): Combo {
  let uncovered = [...req.needs];
  const partners: Provider[] = [];
  const coverage: NeedCoverage[] = [];
  while (uncovered.length > 0 && partners.length < 2) {
    let best: { p: Provider; covers: NeedCoverage[]; drive: number } | null = null;
    for (const p of candidates) {
      if (partners.includes(p)) continue;
      const covers: NeedCoverage[] = [];
      for (const n of uncovered) {
        const r = p.resources.find(r => resourceCovers(r, n));
        if (r) covers.push({ need: n, providerId: p.id, resourceId: r.id });
      }
      if (covers.length === 0) continue;
      const drive = approxDriveMinutes(p.location, req.nearLocation);
      if (!best || covers.length > best.covers.length || (covers.length === best.covers.length && drive < best.drive)) best = { p, covers, drive };
    }
    if (!best) break;
    partners.push(best.p);
    coverage.push(...best.covers);
    uncovered = uncovered.filter(n => !best!.covers.some(c => c.need === n));
  }
  return { partners, coverage, uncovered };
}

function toMatch(req: Requirement, combo: Combo, providers: Provider[], i: number): Match {
  const total = req.needs.length || 1;
  const drives = combo.partners.map(p => approxDriveMinutes(p.location, req.nearLocation));
  const worst = drives.length ? Math.max(...drives) : 0;
  const fresh = combo.partners.length
    ? combo.partners.reduce((s, p) => s + Math.max(0, 1 - p.lastConfirmedDaysAgo / 30), 0) / combo.partners.length
    : 0;
  const score = Math.round(70 * (combo.coverage.length / total) + 20 * (1 - Math.min(worst, 90) / 90) + 10 * fresh);
  const locCov = combo.coverage.find(c => c.need.kind === 'location');
  const creator = providers.find(p => p.id === req.createdByProviderId);
  const siteName = locCov ? providers.find(p => p.id === locCov.providerId)?.name : creator?.name;
  return {
    id: `${req.id}-m${i}`,
    requirementId: req.id,
    partnerProviderIds: combo.partners.map(p => p.id),
    coverage: combo.coverage,
    uncovered: combo.uncovered,
    score,
    approxDriveMinutes: worst,
    proposedSiteName: siteName ?? req.nearTown,
    status: 'proposed',
  };
}

export const matchRequirement: MatchRequirementFn = (req, providers) => {
  const candidates = providers.filter(p => p.id !== req.createdByProviderId);
  const combos: Combo[] = [];
  const seen = new Set<string>();
  const excluded = new Set<string>();
  for (let attempt = 0; attempt < 3; attempt++) {
    const combo = greedy(req, candidates.filter(p => !excluded.has(p.id)));
    if (combo.partners.length === 0) break;
    const key = combo.partners.map(p => p.id).sort().join('|');
    if (!seen.has(key)) { seen.add(key); combos.push(combo); }
    excluded.add(combo.partners[0].id);
  }
  return combos
    .map((c, i) => toMatch(req, c, providers, i))
    .sort((a, b) => b.score - a.score)
    .map((m, i) => ({ ...m, id: `${req.id}-m${i}` }));
};
