// WS4: one-tap "Still accepting new patients?" confirmation (keeps listings fresh).
import type { Provider } from '../../types';
import { useStore } from '../../lib/store';
import { freshnessLabel } from '../../lib/freshness';
import { PButton, PCard } from './ui';

export default function AcceptingCard({ provider }: { provider: Provider }) {
  const confirmAccepting = useStore(s => s.confirmAccepting);
  const stale = useStore(s => s.flags.staleListings);
  const f = freshnessLabel(provider.lastConfirmedDaysAgo);
  const tone = f.tone === 'fresh' ? 'text-ok' : f.tone === 'aging' ? 'text-warn' : 'text-danger';
  const nudge = stale || f.tone !== 'fresh';
  return (
    <PCard className={nudge ? 'ring-2 ring-warn' : ''} title="Still accepting new patients?">
      <p className="mb-1 text-sm text-stone-600">
        Your listing currently says{' '}
        <strong className={provider.acceptingNewPatients ? 'text-ok' : 'text-danger'}>
          {provider.acceptingNewPatients ? 'Accepting new patients' : 'Not accepting new patients'}
        </strong>.
      </p>
      <p className={`mb-3 text-sm font-medium ${tone}`}>{f.text}</p>
      {nudge && <p className="mb-3 rounded-lg bg-amber-50 p-2 text-xs text-warn">Patients see how old this is. One tap keeps people out of the "do they still take patients?" guessing game.</p>}
      <div className="flex gap-2">
        <PButton onClick={() => confirmAccepting(provider.id, true)}>Yes, accepting</PButton>
        <PButton variant="secondary" onClick={() => confirmAccepting(provider.id, false)}>No, full right now</PButton>
      </div>
    </PCard>
  );
}
