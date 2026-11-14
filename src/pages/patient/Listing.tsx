import type { ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Clock, Compass, Globe, MapPin, Phone, Video } from 'lucide-react';
import { useEffectiveProviders, useStore } from '../../lib/store';
import { approxDriveMinutes, formatDrive } from '../../lib/geo';
import { effectiveDaysAgo } from '../../lib/freshness';
import MapView from '../../components/map/MapView';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import FreshnessBadge from '../../components/patient/FreshnessBadge';
import TrustBadges from '../../components/patient/TrustBadges';
import TrustPanel from '../../components/patient/TrustPanel';
import Stars from '../../components/patient/Stars';
import { INSURANCE_LABEL, ORG_LABEL, SERVICE_LABEL } from '../../components/patient/labels';
import { usePatient } from '../../components/patient/usePatient';

export default function Listing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const patient = usePatient();
  const providers = useEffectiveProviders();
  const flags = useStore((s) => s.flags);
  const p = providers.find((x) => x.id === id);

  if (!p) return <NotFound />;

  const days = effectiveDaysAgo(p, flags);
  const mins = approxDriveMinutes(patient.location, p.location);
  const similar = providers
    .filter((x) => x.id !== p.id && x.acceptingNewPatients && x.services.some((s) => p.services.includes(s)))
    .map((x) => ({ x, m: approxDriveMinutes(patient.location, x.location) }))
    .sort((a, b) => a.m - b.m)
    .slice(0, 3);
  const reviews = p.trust.reviews ?? [];

  const bookCard = (
    <Button size="lg" fullWidth disabled={!p.acceptingNewPatients} onClick={() => navigate(`/patient/book/${p.id}`)}>
      Book a visit
    </Button>
  );

  return (
    <div className="pt-6 pb-28 md:pb-12">
      <Link to="/patient" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-brand">
        <ArrowLeft size={16} aria-hidden="true" /> Back to results
      </Link>

      <div className="mt-2 grid gap-8 md:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex flex-col gap-5">
          {/* Title block */}
          <header>
            <h1 className="text-2xl font-bold tracking-tight md:text-[32px] md:leading-10">{p.name}</h1>
            <p className="mt-1 text-sm text-stone-600">{ORG_LABEL[p.orgType]}</p>
            <p className="mt-2 text-stone-600">{p.town} · {formatDrive(mins)}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.acceptingNewPatients
                ? <Badge tone="success" icon={<span className="h-1.5 w-1.5 rounded-full bg-ok" />}>Accepting new patients</Badge>
                : <Badge tone="neutral">Not accepting</Badge>}
              <FreshnessBadge daysAgo={days} />
              {p.offersTelehealth && <Badge tone="access" icon={<Video size={12} aria-hidden="true" />}>Telehealth</Badge>}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.insurances.map((i) => i === patient.insurance
                ? <Badge key={i} tone="brand" icon={<Check size={12} aria-hidden="true" />}>{INSURANCE_LABEL[i]}</Badge>
                : <Badge key={i}>{INSURANCE_LABEL[i]}</Badge>)}
            </div>
            <div className="mt-3"><TrustBadges trust={p.trust} /></div>
          </header>

          {!p.acceptingNewPatients && (
            <section className="rounded-2xl bg-warn-soft p-4">
              <h2 className="font-medium">Not accepting new patients right now. Similar providers nearby:</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {similar.map(({ x, m }) => (
                  <li key={x.id}>
                    <Link to={`/patient/listing/${x.id}`} className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white p-3.5 hover:border-brand">
                      <span>
                        <span className="block text-sm font-medium">{x.name}</span>
                        <span className="block text-xs text-stone-600">{x.town} · {formatDrive(m)}</span>
                      </span>
                      <Badge tone="success">Accepting</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {flags.patientDistrustful && <TrustPanel provider={p} daysAgo={days} />}

          <section>
            <h2 className="text-lg font-semibold">Services</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {p.services.map((s) => (
                <span key={s} className="inline-flex h-10 items-center rounded-full border border-stone-200 bg-white px-4 text-sm font-medium text-stone-600">
                  {SERVICE_LABEL[s]}
                </span>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-3.5 rounded-2xl border border-stone-200 bg-white p-5">
            <Detail icon={<MapPin size={18} />} label="Address">{p.address}</Detail>
            <Detail icon={<Clock size={18} />} label="Hours">{p.hours ?? 'Call for hours'}</Detail>
            {p.phone && (
              <Detail icon={<Phone size={18} />} label="Phone">
                <a href={`tel:${p.phone.replace(/\D/g, '')}`} className="text-brand hover:underline">{p.phone}</a>
              </Detail>
            )}
            {p.website && (
              <Detail icon={<Globe size={18} />} label="Website">
                <a href={p.website} target="_blank" rel="noreferrer" className="break-all text-brand hover:underline">
                  {p.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                </a>
              </Detail>
            )}
          </section>

          <MapView providers={[p]} center={p.location} zoom={12} fitToMarkers={false} showLegend={false} className="h-56 md:hidden" />

          {reviews.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold">What neighbors say</h2>
              <ul className="mt-2 flex flex-col gap-3">
                {reviews.map((r) => (
                  <li key={r.id} className="rounded-xl border border-stone-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{r.author}</span>
                      <span className="text-xs text-stone-400">{r.daysAgo} days ago</span>
                    </div>
                    <div className="mt-1"><Stars rating={r.rating} /></div>
                    <p className="mt-1.5 text-sm text-stone-600">{r.text}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Desktop side column */}
        <aside className="hidden flex-col gap-4 md:flex">
          <MapView providers={[p]} center={p.location} zoom={12} fitToMarkers={false} showLegend={false} className="h-72" />
          <div className="sticky top-20 rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="text-lg font-semibold">{p.acceptingNewPatients ? 'Ready to book?' : 'Not taking new patients'}</h2>
            <p className="mt-1 mb-4 text-sm text-stone-600">
              {p.acceptingNewPatients ? 'In person or by video. Booking takes about a minute.' : 'Try one of the similar providers listed.'}
            </p>
            {bookCard}
          </div>
        </aside>
      </div>

      {/* Phone sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-[800] border-t border-stone-200 bg-white p-4 pr-28 md:hidden">
        <Button size="lg" fullWidth disabled={!p.acceptingNewPatients} onClick={() => navigate(`/patient/book/${p.id}`)}>
          Book a visit
        </Button>
      </div>
    </div>
  );
}

function Detail({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 text-stone-500" aria-hidden="true">{icon}</span>
      <div>
        <p className="text-xs text-stone-400">{label}</p>
        <div>{children}</div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex justify-center py-24">
      <div className="flex max-w-sm flex-col items-center gap-3 rounded-2xl border border-stone-200 bg-white p-8 text-center">
        <Compass size={32} className="text-stone-400" aria-hidden="true" />
        <h1 className="text-lg font-semibold">Listing not found</h1>
        <p className="text-sm text-stone-600">This provider may have moved or the link is old.</p>
        <Link to="/patient" className="inline-flex min-h-11 items-center gap-1.5 font-medium text-brand">
          <ArrowLeft size={16} aria-hidden="true" /> Back to search
        </Link>
      </div>
    </div>
  );
}
