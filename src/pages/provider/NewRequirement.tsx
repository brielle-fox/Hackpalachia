// WS4: requirement builder → runs matching → lands on the detail page.
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Requirement, RequirementNeed, ServiceType } from '../../types';
import { useStore } from '../../lib/store';
import { matchRequirement } from '../../lib/matching';
import NeedPicker from '../../components/provider/NeedPicker';
import { PButton, PCard } from '../../components/provider/ui';
import { SERVICE_LABEL } from '../../components/provider/vocab';
import { knownTowns } from '../../components/provider/towns';
import { useCurrentProvider } from '../../components/provider/useCurrentProvider';

const addDays = (iso: string, d: number) => { const x = new Date(iso + 'T12:00:00'); x.setDate(x.getDate() + d); return x.toISOString().slice(0, 10); };
const TODAY = '2026-11-14';

export default function NewRequirement() {
  const nav = useNavigate();
  const { id: creatorId, provider } = useCurrentProvider();
  const providers = useStore(s => s.providers);
  const flags = useStore(s => s.flags);
  const towns = useMemo(() => knownTowns(providers), [providers]);
  const [patientRef, setPatientRef] = useState('Patient #A-104');
  const [service, setService] = useState<ServiceType>('eye_care');
  const [town, setTown] = useState(towns.some(t => t.town === 'Glouster') ? 'Glouster' : provider?.town ?? towns[0]?.town ?? '');
  const [start, setStart] = useState(addDays(TODAY, 3));
  const [end, setEnd] = useState(addDays(TODAY, 14));
  const [needs, setNeeds] = useState<RequirementNeed[]>([]);
  const [note, setNote] = useState('');
  const valid = patientRef.trim() && needs.length > 0 && town && start <= end;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    const loc = towns.find(t => t.town === town)?.location ?? provider!.location;
    const req: Requirement = {
      id: `req-${Date.now().toString(36)}`, createdByProviderId: creatorId, patientRef: patientRef.trim(), serviceType: service,
      needs, nearTown: town, nearLocation: loc, windowStart: start, windowEnd: end, status: 'open', note: note.trim() || undefined,
    };
    const { upsertRequirement, saveMatches } = useStore.getState();
    upsertRequirement(req);
    saveMatches(req.id, matchRequirement(req, providers, flags));
    nav(`/provider/requirements/${req.id}`);
  };

  const field = 'min-h-11 w-full rounded-xl border border-stone-300 bg-white px-3';
  return (
    <form onSubmit={submit} className="mx-auto max-w-3xl space-y-4 p-4 md:p-6">
      <div>
        <p className="text-sm text-stone-500">{provider?.name}</p>
        <h1 className="text-2xl font-semibold">New requirement</h1>
        <p className="text-sm text-stone-600">Post what you're missing for a patient you already care for. We'll find partners who can fill the gap.</p>
      </div>
      <PCard title="Patient & care">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">Patient reference (de-identified)
            <input className={field} value={patientRef} onChange={e => setPatientRef(e.target.value)} />
          </label>
          <label className="text-sm">Service
            <select className={field} value={service} onChange={e => setService(e.target.value as ServiceType)}>
              {(Object.keys(SERVICE_LABEL) as ServiceType[]).map(s => <option key={s} value={s}>{SERVICE_LABEL[s]}</option>)}
            </select>
          </label>
          <label className="text-sm">Where should care happen?
            <select className={field} value={town} onChange={e => setTown(e.target.value)}>
              {towns.map(t => <option key={t.town}>{t.town}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-sm">From<input type="date" className={field} value={start} onChange={e => setStart(e.target.value)} /></label>
            <label className="text-sm">To<input type="date" className={field} value={end} onChange={e => setEnd(e.target.value)} /></label>
          </div>
          <label className="text-sm md:col-span-2">Note (optional)
            <input className={field} placeholder="e.g. Annual diabetic eye exam: no retinal camera in-house" value={note} onChange={e => setNote(e.target.value)} />
          </label>
        </div>
      </PCard>
      <PCard title="What are you missing?">
        <NeedPicker value={needs} onChange={setNeeds} />
      </PCard>
      <div className="flex justify-end gap-2">
        <PButton type="button" variant="ghost" onClick={() => nav('/provider')}>Cancel</PButton>
        <PButton type="submit" disabled={!valid}>Find partners →</PButton>
      </div>
    </form>
  );
}
