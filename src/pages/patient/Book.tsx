import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CircleCheck, Link2 } from 'lucide-react';
import type { CareMode, ServiceType } from '../../types';
import { useStore } from '../../lib/store';
import { getAccessPoints } from '../../lib/data';
import { suggestCareMode } from '../../lib/telehealth';
import CareModeBanner from '../../components/telehealth/CareModeBanner';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import SlotPicker, { generateSlots } from '../../components/patient/SlotPicker';
import { INSURANCE_LABEL, MODE_LABEL, SERVICE_LABEL, firstName, fmtDayLong, fmtTime, parseSlot } from '../../components/patient/labels';
import { usePatient } from '../../components/patient/usePatient';

export default function Book() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const patient = usePatient();
  const provider = useStore((s) => s.providers.find((p) => p.id === id));
  const flags = useStore((s) => s.flags);
  const bookAppointment = useStore((s) => s.bookAppointment);
  const accessPoints = getAccessPoints();

  const defaultService: ServiceType | undefined =
    provider && (patient.needs.find((n) => provider.services.includes(n)) ?? provider.services[0]);
  const [service, setService] = useState<ServiceType | undefined>(defaultService);

  // Re-runs whenever flags or service change, so toggling 📶 updates the banner live.
  const suggestion = useMemo(
    () => (provider && service ? suggestCareMode(patient, provider, service, accessPoints, flags) : null),
    [patient, provider, service, accessPoints, flags],
  );
  const [mode, setMode] = useState<CareMode>(suggestion?.recommended ?? 'in_person');
  const [apId, setApId] = useState<string | undefined>(params.get('ap') ?? suggestion?.accessPoint?.id);
  const [slot, setSlot] = useState<string | null>(params.get('slot'));
  const [day, setDay] = useState<string | null>(params.get('slot')?.slice(0, 10) ?? null);

  // When the suggestion changes (e.g. 📶 toggled), adopt its mode and clear the old time.
  // Skips the first render so a ?slot= link from an access-point card survives.
  const suggestionKey = `${suggestion?.recommended}|${suggestion?.accessPoint?.id ?? ''}`;
  const lastKey = useRef(suggestionKey);
  useEffect(() => {
    if (!suggestion || lastKey.current === suggestionKey) return;
    lastKey.current = suggestionKey;
    setMode(suggestion.recommended);
    setApId(suggestion.accessPoint?.id);
    setSlot(null);
    setDay(null);
  }, [suggestion, suggestionKey]);

  const accessPoint = mode === 'telehealth_access_point'
    ? accessPoints.find((a) => a.id === apId) ?? suggestion?.accessPoint
    : undefined;
  const slots = useMemo(
    () => (accessPoint ? accessPoint.openSlots : provider ? generateSlots(provider.id) : []),
    [accessPoint, provider],
  );

  if (!provider) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg font-semibold">Provider not found</p>
        <Link to="/patient" className="mt-2 inline-flex min-h-11 items-center font-medium text-brand">Back to search</Link>
      </div>
    );
  }

  const confirm = () => {
    if (!slot) return;
    const apptId = crypto.randomUUID();
    bookAppointment({
      id: apptId,
      patientId: patient.id,
      providerId: provider.id,
      accessPointId: mode === 'telehealth_access_point' ? accessPoint?.id : undefined,
      mode,
      datetime: slot,
      status: 'booked',
    });
    navigate(`/patient/confirmation/${apptId}`);
  };

  const when = slot ? `${fmtDayLong(parseSlot(slot))} · ${fmtTime(parseSlot(slot))}` : 'Pick a time';
  const where = mode === 'telehealth_access_point' && accessPoint
    ? `${accessPoint.name} · ${accessPoint.address.split(',')[0]}`
    : mode === 'telehealth_home' ? 'Video from home' : provider.address;

  return (
    <div className="pt-6 pb-28 md:pb-12">
      <Link to={`/patient/listing/${provider.id}`} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-brand">
        <ArrowLeft size={16} aria-hidden="true" /> Back to listing
      </Link>
      <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-[32px] md:leading-10">Book a visit</h1>
      <p className="mt-1 text-stone-600">{provider.name}</p>

      <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col gap-6">
          {/* Persona summary */}
          <section className={`rounded-2xl border p-5 ${patient.portalConnected ? 'border-brand bg-brand-soft' : 'border-stone-200 bg-white'}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">{patient.displayName} · {patient.age} · {patient.town}</p>
              {patient.portalConnected
                ? <Badge tone="success" icon={<CircleCheck size={12} aria-hidden="true" />}>Pre-filled from MyChart (simulated)</Badge>
                : <Badge>Not connected</Badge>}
            </div>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label="Insurance">{INSURANCE_LABEL[patient.insurance]}</Field>
              <Field label="Needs">{patient.needs.map((n) => SERVICE_LABEL[n]).join(' · ')}</Field>
              {patient.portalConnected && <Field label="Current medications">Metformin 500 mg twice daily (placeholder)</Field>}
            </dl>
            {!patient.portalConnected && (
              <Link to={`/patient/connect?return=/patient/book/${provider.id}`} className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-brand">
                <Link2 size={16} aria-hidden="true" /> Connect MyChart to pre-fill
              </Link>
            )}
          </section>

          {/* Service */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-stone-600">Service</span>
            <select
              value={service}
              onChange={(e) => setService(e.target.value as ServiceType)}
              className="h-12 rounded-xl border border-stone-200 bg-white px-3.5"
            >
              {provider.services.map((s) => <option key={s} value={s}>{SERVICE_LABEL[s]}</option>)}
            </select>
            <span className="text-xs text-stone-400">Defaults to the first of your needs this clinic offers.</span>
          </label>

          {/* Care mode */}
          {suggestion && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">How would you like to be seen?</h2>
              <CareModeBanner
                suggestion={suggestion}
                onChoose={(m: CareMode, ap?: string) => {
                  setMode(m);
                  if (ap) setApId(ap);
                  setSlot(null);
                  setDay(null);
                }}
              />
              {mode !== suggestion.recommended && (
                <p className="mt-2 text-sm text-stone-600">You chose: <span className="font-medium text-stone-900">{MODE_LABEL[mode]}</span></p>
              )}
            </section>
          )}

          {/* Slots */}
          <section className="rounded-2xl border border-stone-200 bg-white p-5">
            <h2 className="text-lg font-semibold">{accessPoint ? `Pick a time at ${accessPoint.name}` : 'Pick a time'}</h2>
            {accessPoint && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {accessPoint.hasPrivateRoom && <Badge tone="access">Private room</Badge>}
                {accessPoint.hasHelper && <Badge tone="access">Helper available</Badge>}
              </div>
            )}
            <div className="mt-4">
              <SlotPicker slots={slots} value={slot} onChange={setSlot} day={day} onDayChange={setDay} />
            </div>
            <p className="mt-3 text-xs text-stone-400">
              {accessPoint ? 'Times come from the access point’s open telehealth slots.' : 'Simulated availability for the next 5 weekdays.'}
            </p>
          </section>
        </div>

        {/* Summary */}
        <aside className="hidden md:block">
          <div className="sticky top-20 flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Your visit</h2>
            <dl className="flex flex-col gap-3">
              <Field label="Provider">{provider.name}</Field>
              <Field label="Visit type">{MODE_LABEL[mode]}</Field>
              <Field label="Where">{where}</Field>
              <Field label="When">{when}</Field>
              <Field label="Insurance">{INSURANCE_LABEL[patient.insurance]}</Field>
            </dl>
            <Button size="lg" fullWidth disabled={!slot} onClick={confirm}>Confirm booking</Button>
            <p className="text-xs text-stone-400">{firstName(patient.displayName)} gets a text reminder. No app needed.</p>
          </div>
        </aside>
      </div>

      {/* Phone sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-[800] border-t border-stone-200 bg-white p-4 pr-28 md:hidden">
        <Button size="lg" fullWidth disabled={!slot} onClick={confirm}>
          {slot ? `Confirm · ${fmtTime(parseSlot(slot))}` : 'Pick a time'}
        </Button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-stone-400">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
