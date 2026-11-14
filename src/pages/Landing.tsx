import { useState, type ComponentType, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, ChevronDown, Clock, Hospital, Monitor, ShieldCheck, Stethoscope, Video, type LucideProps,
} from 'lucide-react';
import { DEMO_CAST } from '../config';
import { useStore } from '../lib/store';
import type { ServiceType } from '../types';
import Button from '../components/ui/Button';
import Chip from '../components/ui/Chip';

const QUICK_SERVICES: { value: ServiceType; label: string }[] = [
  { value: 'primary_care', label: 'Primary care' },
  { value: 'diabetes_care', label: 'Diabetes care' },
  { value: 'dental', label: 'Dental' },
  { value: 'behavioral_health', label: 'Behavioral health' },
];

const TRUST: { Icon: ComponentType<LucideProps>; title: string; body: string }[] = [
  { Icon: Clock, title: 'Fresh, not word of mouth', body: 'Every listing shows when it was last confirmed. Outdated information is flagged.' },
  { Icon: ShieldCheck, title: 'Locally verified', body: 'Checked by county partners and reviewed by neighbors. No ads or paid rankings.' },
  { Icon: Video, title: 'Care without home internet', body: 'Private telehealth rooms at libraries and churches, offered automatically.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const providers = useStore((s) => s.providers);
  const patients = useStore((s) => s.patients);
  const setRole = useStore((s) => s.setRole);
  const setCurrentPatient = useStore((s) => s.setCurrentPatient);
  const setCurrentProvider = useStore((s) => s.setCurrentProvider);

  const defaultProvider = providers.some((p) => p.id === DEMO_CAST.clinicProviderId)
    ? DEMO_CAST.clinicProviderId
    : providers[0]?.id ?? '';
  const [providerId, setProviderId] = useState(defaultProvider);

  const continueAsPatient = (service?: ServiceType) => {
    setRole('patient');
    setCurrentPatient(patients[0]?.id ?? null);
    navigate(service ? `/patient?service=${service}` : '/patient');
  };

  const continueAsProvider = () => {
    if (!providerId) return;
    setRole('provider');
    setCurrentProvider(providerId);
    navigate('/provider');
  };

  return (
    <div className="pb-10 md:pb-16">
      {/* Hero */}
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-4 pt-12 pb-9 text-center md:gap-5 md:pt-24 md:pb-16">
        <p className="text-xs font-medium tracking-[0.08em] text-brand uppercase">Athens County &amp; Southeast Ohio</p>
        <h1 className="text-[32px] leading-10 font-bold tracking-[-0.015em] text-balance md:text-[44px] md:leading-[52px] md:tracking-[-0.02em]">
          Connecting southeast Ohio to care, and providers to each other.
        </h1>
        <p className="max-w-[520px] text-stone-600 text-pretty">
          Every listing is confirmed and dated by the provider, so no one has to rely on secondhand tips.
        </p>
      </section>

      {/* Role cards */}
      <section className="grid gap-4 md:grid-cols-2 md:gap-6" aria-label="Choose how you'll use CareBridge">
        <RoleCard
          Icon={Stethoscope}
          iconTone="bg-brand-soft text-brand"
          overline="For residents"
          title="I’m looking for care"
          body="Search by service, insurance and distance. See who’s accepting new patients and when that was last confirmed."
        >
          <div className="flex flex-col gap-2 pb-4">
            <p className="text-sm font-medium">Start with a service</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_SERVICES.map((s) => (
                <Chip key={s.value} onClick={() => continueAsPatient(s.value)}>{s.label}</Chip>
              ))}
            </div>
          </div>
          <Button size="lg" fullWidth onClick={() => continueAsPatient()}>Continue as Patient</Button>
        </RoleCard>

        <RoleCard
          Icon={Hospital}
          iconTone="bg-info-soft text-info"
          overline="For clinics & health systems"
          title="I’m a provider"
          body="Post the equipment, staff or space you’re missing and get matched with local partners who can fill the gap."
        >
          <div className="flex flex-col gap-1.5 pb-4">
            <label htmlFor="org" className="text-sm font-medium">Your organization</label>
            <div className="relative">
              <select
                id="org"
                value={providerId}
                onChange={(e) => setProviderId(e.target.value)}
                className="h-12 w-full appearance-none truncate rounded-xl border border-stone-200 bg-white pr-10 pl-3.5"
              >
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} · {p.town}</option>
                ))}
              </select>
              <ChevronDown size={18} aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-stone-500" />
            </div>
          </div>
          <Button size="lg" variant="secondary" fullWidth onClick={continueAsProvider} disabled={!providerId}>
            Continue as Provider
          </Button>
        </RoleCard>
      </section>

      {/* Trust strip */}
      <section className="mt-10 grid gap-6 border-t border-stone-200 pt-6 md:mt-16 md:grid-cols-3 md:gap-10 md:pt-8">
        {TRUST.map(({ Icon, title, body }) => (
          <div key={title} className="flex gap-3.5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
              <Icon size={20} aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-medium">{title}</h2>
              <p className="mt-1 text-sm text-stone-600">{body}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Shared-computer link */}
      <div className="mt-8 flex justify-center md:mt-10">
        <Link
          to="/kiosk"
          className="group flex flex-col items-center gap-1.5 rounded-2xl bg-stone-100 px-4 py-3 text-sm sm:flex-row sm:gap-2.5 sm:rounded-full sm:px-5"
        >
          <span className="flex items-center gap-2 text-stone-600">
            <Monitor size={18} aria-hidden="true" />
            Using a library or church computer?
          </span>
          <span className="flex items-center gap-1.5 font-medium text-brand group-hover:underline">
            Open shared-computer mode
            <ArrowRight size={16} aria-hidden="true" />
          </span>
        </Link>
      </div>
    </div>
  );
}

function RoleCard({
  Icon, iconTone, overline, title, body, children,
}: {
  Icon: ComponentType<LucideProps>;
  iconTone: string;
  overline: string;
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
      <span className={`grid h-12 w-12 place-items-center rounded-xl ${iconTone}`}>
        <Icon size={24} aria-hidden="true" />
      </span>
      <p className="mt-5 text-xs font-medium tracking-[0.06em] text-stone-400 uppercase">{overline}</p>
      <h2 className="mt-1.5 text-2xl font-semibold tracking-[-0.01em]">{title}</h2>
      <p className="mt-2 text-stone-600">{body}</p>
      <div className="min-h-6 flex-1" />
      {children}
    </div>
  );
}
