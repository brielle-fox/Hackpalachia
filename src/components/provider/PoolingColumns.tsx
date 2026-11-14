// WS4: the pooling picture. "You bring" (creator's own resources) vs "Partner brings" (coverage of a match).
import type { Match, Provider } from '../../types';
import { KIND_META } from './vocab';

export default function PoolingColumns({ creator, match, providers }: { creator?: Provider; match?: Match; providers: Provider[] }) {
  const name = (id: string) => providers.find(p => p.id === id)?.name ?? id;
  const partnerItems = match?.coverage.map(c => {
    const r = providers.find(p => p.id === c.providerId)?.resources.find(r => r.id === c.resourceId);
    return { key: c.resourceId + c.need.label, kind: c.need.kind, label: r?.label ?? c.need.label, who: name(c.providerId) };
  }) ?? [];
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
      <div className="rounded-2xl border border-stone-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">You bring</p>
        <p className="mb-2 font-semibold">{creator?.name ?? '—'}</p>
        <ul className="space-y-1 text-sm">
          {creator?.resources.map(r => <li key={r.id}>{KIND_META[r.kind].icon} {r.label}</li>)}
          {!creator?.resources.length && <li className="text-stone-400">No shared resources listed</li>}
        </ul>
      </div>
      <div className="flex items-center justify-center text-2xl text-brand" aria-hidden>＋</div>
      <div className={`rounded-2xl border p-4 ${match ? 'border-brand bg-brand-soft/40' : 'border-dashed border-stone-300 bg-white'}`}>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Partner brings</p>
        {match ? (
          <>
            <p className="mb-2 font-semibold">{match.partnerProviderIds.map(name).join(' + ')}</p>
            <ul className="space-y-1 text-sm">
              {partnerItems.map(i => <li key={i.key}>{KIND_META[i.kind].icon} {i.label}{match.partnerProviderIds.length > 1 && <span className="text-stone-500"> · {i.who}</span>}</li>)}
            </ul>
          </>
        ) : <p className="mt-2 text-sm text-stone-500">Find partners to fill the gaps.</p>}
      </div>
    </div>
  );
}
