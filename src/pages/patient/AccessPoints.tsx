// WS5 — /patient/telehealth: places with a private room + computer for a video visit.
import { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../lib/store';
import { getAccessPoints } from '../../lib/data';
import { approxDriveMinutes } from '../../lib/geo';
import MapView from '../../components/map/MapView';
import AccessPointCard from '../../components/telehealth/AccessPointCard';
import type { County } from '../../types';
import { DEMO_TODAY } from '../../config';

function inNextWeek(slot: string) {
  const t = new Date(slot.slice(0, 10)).getTime(), today = new Date(DEMO_TODAY).getTime();
  return t >= today && t - today <= 7 * 86400000;
}

export default function AccessPoints() {
  const patient = useStore(s => s.patients.find(p => p.id === s.currentPatientId) ?? s.patients[0]);
  const noInternet = useStore(s => s.flags.noHomeInternet);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const providerId = params.get('provider');
  const [helperOnly, setHelperOnly] = useState(false);
  const [thisWeek, setThisWeek] = useState(false);
  const [county, setCounty] = useState<County | 'all'>('all');
  const [view, setView] = useState<'list' | 'map'>('list');
  const [selected, setSelected] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);

  const all = getAccessPoints();
  const counties = useMemo(() => Array.from(new Set(all.map(a => a.county))).sort(), [all]);
  const list = useMemo(() => all
    .filter(a => !noInternet || a.hasPrivateRoom)
    .filter(a => !helperOnly || a.hasHelper)
    .filter(a => !thisWeek || a.openSlots.some(inNextWeek))
    .filter(a => county === 'all' || a.county === county)
    .map(a => ({ a, d: patient ? approxDriveMinutes(patient.location, a.location) : 0 }))
    .sort((x, y) => x.d - y.d), [all, noInternet, helperOnly, thisWeek, county, patient]);

  const sel = list.find(x => x.a.id === selected)?.a;

  const pickSlot = (apId: string, s: string) => {
    setSelected(apId); setSlot(s);
    if (providerId) navigate(`/patient/book/${providerId}?ap=${apId}&slot=${encodeURIComponent(s)}`);
  };

  const filterBtn = (on: boolean, set: (v: boolean) => void, label: string) => (
    <button type="button" onClick={() => set(!on)} aria-pressed={on}
      className={`rounded-full border px-3 py-1.5 text-sm ${on ? 'border-brand bg-brand text-white' : 'border-stone-300 bg-white'}`}>{label}</button>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-5">
      <h1 className="text-2xl font-semibold text-stone-900">Telehealth near you</h1>
      <p className="mt-1 text-stone-600">No internet at home? These local places have a private room and a computer for your video visit.</p>
      {noInternet && (
        <p className="mt-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm text-orange-900">
          📶 Showing places with a private room near you{patient ? ` (${patient.town})` : ''}.
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {filterBtn(helperOnly, setHelperOnly, '🙋 Helper on site')}
        {filterBtn(thisWeek, setThisWeek, '🗓 Open this week')}
        <select aria-label="County" value={county} onChange={e => setCounty(e.target.value as County | 'all')}
          className="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm">
          <option value="all">All counties</option>
          {counties.map(c => <option key={c} value={c}>{c} County</option>)}
        </select>
        <div className="ml-auto flex overflow-hidden rounded-full border border-stone-300 md:hidden">
          {(['list', 'map'] as const).map(v => (
            <button key={v} type="button" onClick={() => setView(v)}
              className={`px-3 py-1.5 text-sm capitalize ${view === v ? 'bg-brand text-white' : 'bg-white'}`}>{v}</button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className={`space-y-3 ${view === 'map' ? 'hidden md:block' : ''} md:max-h-[70vh] md:overflow-y-auto md:pr-1`}>
          <p className="text-sm text-stone-500">{list.length} place{list.length === 1 ? '' : 's'}, nearest first</p>
          {list.map(({ a, d }) => (
            <AccessPointCard key={a.id} ap={a} driveMinutes={d} selected={a.id === selected}
              onSelect={() => setSelected(a.id)} selectedSlot={a.id === selected ? slot : null} onSlot={s => pickSlot(a.id, s)} />
          ))}
          {list.length === 0 && <p className="rounded-xl bg-white p-4 text-stone-600">No places match these filters.</p>}
        </div>
        <div className={`${view === 'list' ? 'hidden md:block' : ''} md:sticky md:top-4 md:self-start`}>
          <MapView
            accessPoints={list.map(x => x.a)}
            origin={patient?.location}
            center={sel?.location}
            zoom={sel ? 13 : undefined}
            selectedId={selected}
            highlightIds={selected ? [selected] : []}
            onSelect={(id) => setSelected(id)}
            fitToMarkers={!sel}
            className="h-[60vh] w-full overflow-hidden rounded-2xl md:h-[70vh]"
          />
        </div>
      </div>
    </div>
  );
}
