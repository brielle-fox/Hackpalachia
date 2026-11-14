// WS4: pick what the requirement is MISSING, grouped by kind, from the canonical vocabulary (+ free text).
import { useState } from 'react';
import type { RequirementNeed, ResourceKind } from '../../types';
import { KIND_META, RESOURCE_VOCAB } from './vocab';

const KINDS: ResourceKind[] = ['location', 'equipment', 'personnel'];
const same = (a: RequirementNeed, b: RequirementNeed) => a.kind === b.kind && a.label.toLowerCase() === b.label.toLowerCase();

export default function NeedPicker({ value, onChange }: { value: RequirementNeed[]; onChange: (n: RequirementNeed[]) => void }) {
  const [other, setOther] = useState<Record<ResourceKind, string>>({ location: '', equipment: '', personnel: '' });
  const toggle = (n: RequirementNeed) => onChange(value.some(v => same(v, n)) ? value.filter(v => !same(v, n)) : [...value, n]);
  return (
    <div className="space-y-4">
      {KINDS.map(k => {
        const custom = value.filter(v => v.kind === k && !RESOURCE_VOCAB[k].some(l => l.toLowerCase() === v.label.toLowerCase()));
        return (
          <fieldset key={k}>
            <legend className="mb-2 text-sm font-semibold">{KIND_META[k].icon} {KIND_META[k].label}</legend>
            <div className="flex flex-wrap gap-2">
              {[...RESOURCE_VOCAB[k], ...custom.map(c => c.label)].map(l => {
                const n = { kind: k, label: l };
                const on = value.some(v => same(v, n));
                return (
                  <button type="button" key={l} aria-pressed={on} onClick={() => toggle(n)}
                    className={`min-h-9 rounded-full border px-3 py-1 text-sm transition ${on ? 'border-brand bg-brand text-white' : 'border-stone-300 bg-white text-stone-700 hover:border-brand'}`}>
                    {on ? '✓ ' : ''}{l}
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex gap-2">
              <input className="min-h-9 flex-1 rounded-xl border border-stone-300 px-3 text-sm" placeholder="+ Other…" value={other[k]}
                onChange={e => setOther({ ...other, [k]: e.target.value })}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (other[k].trim()) { toggle({ kind: k, label: other[k].trim() }); setOther({ ...other, [k]: '' }); } } }} />
              <button type="button" className="rounded-xl px-3 text-sm text-brand hover:bg-brand-soft"
                onClick={() => { if (other[k].trim()) { toggle({ kind: k, label: other[k].trim() }); setOther({ ...other, [k]: '' }); } }}>Add</button>
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}
