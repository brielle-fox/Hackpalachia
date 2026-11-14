// WS4: one ranked match: who covers which need, drive time, score.
import type { ReactNode } from 'react';
import type { Match, Provider, Requirement } from '../../types';
import { formatDrive } from '../../lib/geo';
import { KIND_META } from './vocab';
import { Chip } from './ui';

export default function MatchCard({ match, req, providers, rank, actions }: {
  match: Match; req: Requirement; providers: Provider[]; rank: number; actions?: ReactNode;
}) {
  const name = (id: string) => providers.find(p => p.id === id)?.name ?? id;
  const best = rank === 0 && match.status === 'proposed';
  return (
    <article className={`rounded-2xl border bg-white p-4 shadow-sm ${match.status === 'accepted' ? 'border-ok ring-2 ring-green-200' : best ? 'border-brand' : 'border-stone-200'}`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">{best ? '★ Best match' : `Option ${rank + 1}`}</p>
          <h3 className="text-base font-semibold">{match.partnerProviderIds.map(name).join(' + ')}</h3>
          <p className="text-sm text-stone-600">{formatDrive(match.approxDriveMinutes)} to {req.nearTown} · at {match.proposedSiteName}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="rounded-xl bg-brand-soft px-3 py-1 text-lg font-bold text-brand">{match.score}<span className="text-xs font-medium">/100</span></span>
          {match.status === 'accepted' && <Chip tone="ok">Accepted</Chip>}
          {match.status === 'declined' && <Chip tone="danger">Declined</Chip>}
        </div>
      </div>
      {/* coverage: table on desktop, stacked on mobile */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs uppercase text-stone-500"><th className="py-1">Need</th><th>Covered by</th><th></th></tr></thead>
          <tbody>
            {req.needs.map(n => {
              const c = match.coverage.find(c => c.need.kind === n.kind && c.need.label === n.label);
              return (
                <tr key={n.kind + n.label} className="border-t border-stone-100">
                  <td className="py-1.5">{KIND_META[n.kind].icon} {n.label}</td>
                  <td>{c ? name(c.providerId) : <span className="text-danger">Not covered</span>}</td>
                  <td className="text-right">{c ? <span className="text-ok">✓</span> : <span className="text-danger">✕</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ul className="space-y-1 md:hidden">
        {req.needs.map(n => {
          const c = match.coverage.find(c => c.need.kind === n.kind && c.need.label === n.label);
          return (
            <li key={n.kind + n.label} className="rounded-lg bg-stone-50 p-2 text-sm">
              <span className={c ? 'text-ok' : 'text-danger'}>{c ? '✓' : '✕'}</span> {KIND_META[n.kind].icon} {n.label}
              <span className="block text-xs text-stone-500">{c ? name(c.providerId) : 'Not covered'}</span>
            </li>
          );
        })}
      </ul>
      {match.uncovered.length > 0 && (
        <p className="mt-2 rounded-lg bg-amber-50 p-2 text-xs text-warn">Still missing: {match.uncovered.map(u => u.label).join(', ')}</p>
      )}
      {actions && <div className="mt-3 flex flex-wrap gap-2">{actions}</div>}
    </article>
  );
}
