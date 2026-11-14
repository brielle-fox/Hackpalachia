// WS4: requirement detail: pooling picture, ranked matches, propose → accept, ❄️ cancellation recovery.
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Match } from '../../types';
import { useStore } from '../../lib/store';
import { getAccessPoints } from '../../lib/data';
import { matchRequirement } from '../../lib/matching';
import { approxDriveMinutes, formatDrive } from '../../lib/geo';
import MapView from '../../components/map/MapView';
import MatchCard from '../../components/provider/MatchCard';
import PoolingColumns from '../../components/provider/PoolingColumns';
import { PButton, PCard, StatusChip } from '../../components/provider/ui';
import { KIND_META, SERVICE_LABEL } from '../../components/provider/vocab';
import { useCurrentProvider } from '../../components/provider/useCurrentProvider';

const RESOLVED = ['[re-matched]', '[telehealth]'];

export default function Requirement() {
  const { id } = useParams();
  const { id: currentId } = useCurrentProvider();
  const req = useStore(s => s.requirements.find(r => r.id === id));
  const providers = useStore(s => s.providers);
  const allMatches = useStore(s => s.matches);
  const flags = useStore(s => s.flags);
  const { saveMatches, acceptMatch, declineMatch, upsertRequirement } = useStore.getState();
  const [pending, setPending] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (!req) return <div className="mx-auto max-w-3xl p-6">Requirement not found. <Link className="text-brand underline" to="/provider">Back to dashboard</Link></div>;

  const matches = allMatches.filter(m => m.requirementId === req.id).sort((a, b) => b.score - a.score);
  const accepted = matches.find(m => m.status === 'accepted');
  const creator = providers.find(p => p.id === req.createdByProviderId);
  const isCreator = currentId === req.createdByProviderId;
  const name = (pid: string) => providers.find(p => p.id === pid)?.name ?? pid;
  const resolved = RESOLVED.some(t => req.note?.includes(t));
  const cancelled = flags.providerCancelled && req.status === 'scheduled' && !!accepted && !resolved;
  const shown = accepted ?? matches.find(m => m.status === 'proposed');

  const runMatching = () => {
    const ms = matchRequirement(req, providers, flags);
    saveMatches(req.id, ms);
  };
  const propose = (m: Match, extraNote?: string) => {
    setPending(m.id);
    timer.current = window.setTimeout(() => {
      acceptMatch(m.id);
      if (extraNote) {
        const latest = useStore.getState().requirements.find(r => r.id === req.id);
        if (latest) upsertRequirement({ ...latest, note: extraNote });
      }
      setPending(null);
    }, 1500);
  };
  const rematch = () => {
    if (!accepted) return;
    const out = new Set(accepted.partnerProviderIds);
    const ms = matchRequirement(req, providers.filter(p => !out.has(p.id)), flags)
      .map((m, i) => ({ ...m, id: `${req.id}-rm${Date.now() % 100000}-${i}` }));
    upsertRequirement({ ...req, status: 'matched', matchId: undefined });
    saveMatches(req.id, ms);
    if (ms[0]) propose(ms[0], `[re-matched] ${accepted.partnerProviderIds.map(name).join(' + ')} cancelled (roads closed); re-matched to ${ms[0].partnerProviderIds.map(name).join(' + ')}.`);
  };
  const nearestAP = getAccessPoints()
    .filter(a => a.hasPrivateRoom)
    .map(a => ({ a, mins: approxDriveMinutes(a.location, req.nearLocation) }))
    .sort((x, y) => x.mins - y.mins)[0];
  const convertTelehealth = () => {
    if (!nearestAP) return;
    upsertRequirement({ ...req, note: `[telehealth] Partner cancelled. Patient check-in moved to telehealth at ${nearestAP.a.name} (${formatDrive(nearestAP.mins)}); in-person screening to be rescheduled.` });
  };
  const highlight = shown?.partnerProviderIds ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-4 md:p-6">
      <Link to="/provider" className="text-sm text-brand hover:underline">← Dashboard</Link>

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-stone-500">{req.patientRef} · {SERVICE_LABEL[req.serviceType]} · near {req.nearTown}</p>
          <h1 className="text-2xl font-semibold">{req.note && !resolved ? req.note : `${SERVICE_LABEL[req.serviceType]} requirement`}</h1>
          <p className="text-sm text-stone-600">Window {req.windowStart} → {req.windowEnd} · created by {creator?.name}</p>
        </div>
        <StatusChip status={req.status} />
      </header>

      {cancelled && accepted && (
        <div role="alert" className="rounded-2xl border-2 border-danger bg-red-50 p-4">
          <p className="font-semibold text-danger">❄️ Partner cancelled (roads closed)</p>
          <p className="mb-3 text-sm text-stone-700">{accepted.partnerProviderIds.map(name).join(' + ')} can't make the trip. Nobody has to be stranded:</p>
          <div className="flex flex-wrap gap-2">
            <PButton variant="danger" onClick={rematch} disabled={!!pending}>Re-match with next partner</PButton>
            {nearestAP && <PButton variant="secondary" onClick={convertTelehealth}>Convert check-in to telehealth at {nearestAP.a.name} ({formatDrive(nearestAP.mins)})</PButton>}
          </div>
        </div>
      )}

      {req.status === 'scheduled' && accepted && !cancelled && (
        <div className="rounded-2xl border border-ok bg-green-50 p-4">
          <p className="text-lg font-semibold text-ok">✓ Scheduled · screening day at {accepted.proposedSiteName}</p>
          <p className="text-sm text-stone-700">{accepted.partnerProviderIds.map(name).join(' + ')} brings what was missing · {formatDrive(accepted.approxDriveMinutes)} · {req.windowStart}</p>
        </div>
      )}
      {req.note && resolved && (
        <p className="rounded-xl bg-brand-soft p-3 text-sm text-brand">{req.note.replace(/^\[[^\]]+\]\s*/, '')}</p>
      )}

      <PCard title="What's missing">
        <ul className="flex flex-wrap gap-2">
          {req.needs.map(n => <li key={n.kind + n.label} className="rounded-full border border-stone-300 px-3 py-1 text-sm">{KIND_META[n.kind].icon} {n.label}</li>)}
        </ul>
      </PCard>

      <PoolingColumns creator={creator} match={shown} providers={providers} />

      <div className="grid gap-4 md:grid-cols-[3fr_2fr]">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Matches</h2>
            {isCreator && req.status !== 'scheduled' && <PButton variant="secondary" onClick={runMatching}>{matches.length ? 'Refresh matches' : 'Find partners'}</PButton>}
          </div>
          {matches.length === 0 && <p className="rounded-xl border border-dashed border-stone-300 p-4 text-sm text-stone-500">No matches yet. Click "Find partners".</p>}
          {matches.map((m, i) => (
            <MatchCard key={m.id} match={m} req={req} providers={providers} rank={i} actions={
              m.status !== 'proposed' || req.status === 'scheduled' ? undefined
                : pending === m.id ? <span className="text-sm text-stone-600">⏳ Sent to {m.partnerProviderIds.map(name).join(' + ')}… waiting for them to confirm</span>
                : isCreator ? <PButton onClick={() => propose(m)} disabled={!!pending}>Propose collaboration</PButton>
                : m.partnerProviderIds.includes(currentId) ? <>
                    <PButton onClick={() => acceptMatch(m.id)}>Accept</PButton>
                    <PButton variant="secondary" onClick={() => declineMatch(m.id)}>Decline</PButton>
                  </> : undefined
            } />
          ))}
        </section>
        <section>
          <MapView providers={providers.filter(p => p.id === req.createdByProviderId || highlight.includes(p.id) || matches.some(m => m.partnerProviderIds.includes(p.id)))}
            origin={req.nearLocation} highlightIds={[req.createdByProviderId, ...highlight]} className="h-72 rounded-2xl md:h-96" />
        </section>
      </div>
    </div>
  );
}
