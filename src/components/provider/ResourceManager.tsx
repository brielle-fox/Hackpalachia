// WS4: the provider's shareable resources (equipment / personnel / location).
import { useState } from 'react';
import type { Provider, ResourceKind, ResourceOffer } from '../../types';
import { useStore } from '../../lib/store';
import { KIND_META, RESOURCE_VOCAB } from './vocab';
import { PButton, PCard } from './ui';

const KINDS: ResourceKind[] = ['location', 'equipment', 'personnel'];

export default function ResourceManager({ provider }: { provider: Provider }) {
  const update = useStore(s => s.updateProviderResources);
  const [kind, setKind] = useState<ResourceKind>('equipment');
  const [label, setLabel] = useState(RESOURCE_VOCAB.equipment[0]);
  const remove = (id: string) => update(provider.id, provider.resources.filter(r => r.id !== id));
  const add = () => {
    if (!label.trim()) return;
    const r: ResourceOffer = { id: `${provider.id}-r${Date.now()}`, providerId: provider.id, kind, label: label.trim(), availableDays: ['Tue', 'Thu'] };
    update(provider.id, [...provider.resources, r]);
  };
  return (
    <PCard title="What we can share">
      <div className="space-y-3">
        {KINDS.map(k => {
          const items = provider.resources.filter(r => r.kind === k);
          return (
            <div key={k}>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-500">{KIND_META[k].icon} {KIND_META[k].label}</p>
              <div className="flex flex-wrap gap-2">
                {items.length === 0 && <span className="text-sm text-stone-400">Nothing listed</span>}
                {items.map(r => (
                  <span key={r.id} className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-3 py-1 text-sm text-brand">
                    {r.label}
                    <button aria-label={`Remove ${r.label}`} className="ml-1 rounded-full px-1 hover:bg-white" onClick={() => remove(r.id)}>✕</button>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-col gap-2 border-t border-stone-100 pt-3 sm:flex-row">
        <select className="min-h-11 rounded-xl border border-stone-300 px-3" value={kind} onChange={e => { const k = e.target.value as ResourceKind; setKind(k); setLabel(RESOURCE_VOCAB[k][0]); }}>
          {KINDS.map(k => <option key={k} value={k}>{KIND_META[k].label}</option>)}
        </select>
        <select className="min-h-11 flex-1 rounded-xl border border-stone-300 px-3" value={label} onChange={e => setLabel(e.target.value)}>
          {RESOURCE_VOCAB[kind].map(l => <option key={l}>{l}</option>)}
        </select>
        <PButton variant="secondary" onClick={add}>+ Add</PButton>
      </div>
    </PCard>
  );
}
