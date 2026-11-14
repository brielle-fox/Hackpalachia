// WS4: provider dashboard (desktop-first; stacks on mobile).
import { Link } from 'react-router-dom';
import { useStore } from '../../lib/store';
import MapView from '../../components/map/MapView';
import AcceptingCard from '../../components/provider/AcceptingCard';
import ResourceManager from '../../components/provider/ResourceManager';
import { PButton, PCard, StatusChip } from '../../components/provider/ui';
import { SERVICE_LABEL } from '../../components/provider/vocab';
import { useCurrentProvider } from '../../components/provider/useCurrentProvider';

export default function Dashboard() {
  const { id, provider } = useCurrentProvider();
  const providers = useStore(s => s.providers);
  const requirements = useStore(s => s.requirements);
  const matches = useStore(s => s.matches);
  const { acceptMatch, declineMatch } = useStore.getState();
  if (!provider) return <div className="p-6">Unknown provider.</div>;

  const mine = requirements.filter(r => r.createdByProviderId === id);
  const incoming = matches.filter(m => m.status === 'proposed' && m.partnerProviderIds.includes(id)
    && requirements.find(r => r.id === m.requirementId)?.createdByProviderId !== id);
  const name = (pid: string) => providers.find(p => p.id === pid)?.name ?? pid;
  const partners = providers.filter(p => p.id !== id && p.resources.length > 0);

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-4 md:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-stone-500">Provider dashboard</p>
          <h1 className="text-2xl font-semibold">{provider.name}</h1>
          <p className="text-sm text-stone-600">{provider.town}, {provider.county} County</p>
        </div>
        <Link to="/provider/requirements/new"><PButton>+ New requirement</PButton></Link>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <AcceptingCard provider={provider} />
        <PCard title={`Incoming collaboration requests${incoming.length ? ` (${incoming.length})` : ''}`}>
          {incoming.length === 0 && <p className="text-sm text-stone-500">No requests right now.</p>}
          <ul className="space-y-3">
            {incoming.map(m => {
              const r = requirements.find(r => r.id === m.requirementId)!;
              const asked = m.coverage.filter(c => c.providerId === id).map(c => c.need.label);
              return (
                <li key={m.id} className="rounded-xl border border-stone-200 p-3">
                  <p className="text-sm"><strong>{name(r.createdByProviderId)}</strong> asks for <strong>{asked.join(', ')}</strong></p>
                  <p className="mb-2 text-xs text-stone-500">{SERVICE_LABEL[r.serviceType]} · near {r.nearTown} · {r.windowStart} → {r.windowEnd}</p>
                  <div className="flex flex-wrap gap-2">
                    <PButton onClick={() => acceptMatch(m.id)}>Accept</PButton>
                    <PButton variant="secondary" onClick={() => declineMatch(m.id)}>Decline</PButton>
                    <Link to={`/provider/requirements/${r.id}`} className="self-center text-sm text-brand hover:underline">Details</Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </PCard>
      </div>

      <PCard title="My requirements" action={<Link to="/provider/requirements/new" className="text-sm text-brand hover:underline">+ New</Link>}>
        {mine.length === 0 && <p className="text-sm text-stone-500">None yet. Create one when a patient needs something you can't provide alone.</p>}
        <table className="hidden w-full text-sm md:table">
          <thead><tr className="text-left text-xs uppercase text-stone-500"><th className="py-1">Patient</th><th>Service</th><th>Missing</th><th>Near</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {mine.map(r => (
              <tr key={r.id} className="border-t border-stone-100">
                <td className="py-2">{r.patientRef}</td>
                <td>{SERVICE_LABEL[r.serviceType]}</td>
                <td className="text-stone-600">{r.needs.map(n => n.label).join(', ')}</td>
                <td>{r.nearTown}</td>
                <td><StatusChip status={r.status} /></td>
                <td className="text-right"><Link to={`/provider/requirements/${r.id}`} className="text-brand hover:underline">Open →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="space-y-2 md:hidden">
          {mine.map(r => (
            <li key={r.id}>
              <Link to={`/provider/requirements/${r.id}`} className="block rounded-xl border border-stone-200 p-3">
                <div className="flex items-center justify-between"><span className="font-medium">{r.patientRef}</span><StatusChip status={r.status} /></div>
                <p className="text-sm text-stone-600">{SERVICE_LABEL[r.serviceType]} · near {r.nearTown}</p>
                <p className="text-xs text-stone-500">Missing: {r.needs.map(n => n.label).join(', ')}</p>
              </Link>
            </li>
          ))}
        </ul>
      </PCard>

      <div className="grid gap-4 md:grid-cols-2">
        <ResourceManager provider={provider} />
        <PCard title="Partners nearby">
          <p className="mb-2 text-sm text-stone-600">{partners.length} providers in the region list equipment, staff or space they can share.</p>
          <MapView providers={providers} origin={provider.location} highlightIds={[id, ...partners.map(p => p.id)]} className="h-72 rounded-xl" />
        </PCard>
      </div>
    </div>
  );
}
