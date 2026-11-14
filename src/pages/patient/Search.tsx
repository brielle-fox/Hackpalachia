import { useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Link2, List, Map as MapIcon, MapPin, SearchX, Video } from 'lucide-react';
import type { ServiceType } from '../../types';
import { useEffectiveProviders, useStore } from '../../lib/store';
import { approxDriveMinutes } from '../../lib/geo';
import { effectiveDaysAgo, freshnessLabel } from '../../lib/freshness';
import MapView from '../../components/map/MapView';
import ListingCard from '../../components/patient/ListingCard';
import SearchBar from '../../components/patient/SearchBar';
import ServiceChips from '../../components/patient/ServiceChips';
import Filters, { type FilterState } from '../../components/patient/Filters';
import { INSURANCE_LABEL, SERVICE_LABEL, SERVICE_ORDER, firstName } from '../../components/patient/labels';
import { usePatient } from '../../components/patient/usePatient';

export default function Search() {
  const patient = usePatient();
  const providers = useEffectiveProviders();
  const flags = useStore((s) => s.flags);
  const [params] = useSearchParams();

  const initialService = params.get('service') as ServiceType | null;
  const [query, setQuery] = useState('');
  const [services, setServices] = useState<ServiceType[]>(
    initialService && SERVICE_ORDER.includes(initialService) ? [initialService] : [],
  );
  const [filters, setFilters] = useState<FilterState>({
    acceptingOnly: true,
    insurance: patient.insurance,
    telehealthOnly: false,
    maxDrive: 45,
  });
  const [view, setView] = useState<'list' | 'map'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const cardRefs = useRef(new Map<string, HTMLAnchorElement>());

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return providers
      .map((p) => ({ p, mins: approxDriveMinutes(patient.location, p.location) }))
      .filter(({ p, mins }) => {
        if (q) {
          const hay = [p.name, p.town, ...p.services.map((s) => SERVICE_LABEL[s])].join(' ').toLowerCase();
          if (!hay.includes(q)) return false;
        }
        if (services.length && !p.services.some((s) => services.includes(s))) return false;
        if (filters.acceptingOnly && !p.acceptingNewPatients) return false;
        if (filters.insurance !== 'any' && !p.insurances.includes(filters.insurance)) return false;
        if (filters.telehealthOnly && !p.offersTelehealth) return false;
        if (filters.maxDrive !== null && mins > filters.maxDrive) return false;
        return true;
      })
      .sort((a, b) => {
        if (flags.staleListings) {
          const sa = freshnessLabel(effectiveDaysAgo(a.p, flags)).tone === 'stale';
          const sb = freshnessLabel(effectiveDaysAgo(b.p, flags)).tone === 'stale';
          if (sa !== sb) return sa ? 1 : -1;
        }
        return a.mins - b.mins;
      });
  }, [providers, patient.location, query, services, filters, flags]);

  const resultProviders = useMemo(() => results.map((r) => r.p), [results]);
  const selected = results.find((r) => r.p.id === selectedId);
  const count = `${results.length} ${results.length === 1 ? 'provider' : 'providers'}${filters.maxDrive !== null ? ` within ${filters.maxDrive} min` : ''}`;

  const selectFromMap = (id: string) => {
    setSelectedId(id);
    cardRefs.current.get(id)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const cards = results.map(({ p, mins }) => (
    <ListingCard
      key={p.id}
      ref={(el) => {
        if (el) cardRefs.current.set(p.id, el);
        else cardRefs.current.delete(p.id);
      }}
      provider={p}
      driveMins={mins}
      selected={p.id === selectedId}
      onSelect={() => setSelectedId(p.id)}
      patientInsurance={patient.insurance}
    />
  ));

  const empty = (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-stone-200 bg-white px-6 py-10 text-center">
      <SearchX size={32} className="text-stone-400" aria-hidden="true" />
      <p className="text-lg font-semibold">No one matches.</p>
      <p className="text-stone-600">
        Try widening drive time, or{' '}
        <Link to="/patient/telehealth" className="font-medium text-brand underline-offset-2 hover:underline">
          see telehealth options →
        </Link>
      </p>
    </div>
  );

  return (
    <div className="px-4 py-6 md:px-8">
      {/* Greeting */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-[32px] md:leading-10">Hi, {firstName(patient.displayName)}!</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-600">
            <MapPin size={14} aria-hidden="true" />
            {patient.town} · {INSURANCE_LABEL[patient.insurance]}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!patient.portalConnected && (
            <Link to="/patient/connect?return=/patient" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 text-sm font-medium text-brand hover:border-brand">
              <Link2 size={16} aria-hidden="true" /> Connect MyChart
            </Link>
          )}
          <Link to="/patient/telehealth" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 text-sm font-medium text-brand hover:border-brand">
            <Video size={16} aria-hidden="true" /> Telehealth near you
          </Link>
        </div>
      </div>

      {/* Search + filters */}
      <div className="mt-5 flex flex-col gap-3">
        <SearchBar value={query} onChange={setQuery} />
        <ServiceChips selected={services} onChange={setServices} />
        <div className="flex items-center justify-between gap-3 md:block">
          <Filters value={filters} onChange={setFilters} resultCount={results.length} defaultInsurance={patient.insurance} />
          <p className="text-sm font-medium text-stone-600 md:hidden">{count}</p>
        </div>
        <div className="hidden items-center justify-between md:flex">
          <p className="font-medium">{count}</p>
          <p className="text-sm text-stone-600">Sorted by drive time from {patient.town}</p>
        </div>
      </div>

      {/* Phone: List | Map */}
      <div className="sticky top-16 z-[400] -mx-4 mt-3 bg-stone-50 px-4 py-2 md:hidden">
        <div className="grid grid-cols-2 rounded-xl bg-stone-100 p-1" role="tablist" aria-label="View">
          {(['list', 'map'] as const).map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={view === v}
              onClick={() => setView(v)}
              className={`flex min-h-10 items-center justify-center gap-2 rounded-[9px] text-sm font-medium ${view === v ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'}`}
            >
              {v === 'list' ? <List size={16} aria-hidden="true" /> : <MapIcon size={16} aria-hidden="true" />}
              {v === 'list' ? 'List' : 'Map'}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="mt-3 md:mt-4 md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-6">
        <div className={`${view === 'list' ? 'flex' : 'hidden md:flex'} flex-col gap-3 md:gap-4`}>
          {results.length ? cards : empty}
        </div>
        <div className={`${view === 'map' ? 'flex' : 'hidden md:flex'} flex-col gap-3 md:sticky md:top-20 md:h-[calc(100dvh-6rem)] md:self-start`}>
          <MapView
            providers={resultProviders}
            origin={patient.location}
            selectedId={selectedId}
            onSelect={(id) => selectFromMap(id)}
            className="h-[60vh] md:h-full"
          />
          {view === 'map' && selected && (
            <div className="md:hidden">
              <ListingCard
                provider={selected.p}
                driveMins={selected.mins}
                selected
                onSelect={() => {}}
                patientInsurance={patient.insurance}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
