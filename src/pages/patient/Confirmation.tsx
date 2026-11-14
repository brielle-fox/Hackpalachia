import { useEffect, useState, type ComponentType, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CalendarPlus, CircleCheck, House, Hospital, IdCard, Library, type LucideProps } from 'lucide-react';
import type { CareMode } from '../../types';
import { APP_NAME } from '../../config';
import { useStore } from '../../lib/store';
import { getAccessPoints } from '../../lib/data';
import Button from '../../components/ui/Button';
import SmsPreview from '../../components/patient/SmsPreview';
import { MODE_LABEL, firstName, fmtDayLong, fmtTime, parseSlot } from '../../components/patient/labels';
import { usePatient } from '../../components/patient/usePatient';

const MODE_ICON: Record<CareMode, ComponentType<LucideProps>> = {
  in_person: Hospital,
  telehealth_home: House,
  telehealth_access_point: Library,
};

export default function Confirmation() {
  const { apptId } = useParams();
  const patient = usePatient();
  const appt = useStore((s) => s.appointments.find((a) => a.id === apptId));
  const provider = useStore((s) => s.providers.find((p) => p.id === appt?.providerId));
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  if (!appt || !provider) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg font-semibold">We couldn’t find that booking</p>
        <p className="mt-1 text-stone-600">It may have been cleared when the demo was reset.</p>
        <Link to="/patient" className="mt-2 inline-flex min-h-11 items-center font-medium text-brand">Back to search</Link>
      </div>
    );
  }

  const ap = appt.accessPointId ? getAccessPoints().find((a) => a.id === appt.accessPointId) : undefined;
  const date = parseSlot(appt.datetime);
  const day = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const place = ap ? ap.name : appt.mode === 'telehealth_home' ? 'home (video link by text)' : provider.name;
  const where = ap ? `${ap.name} · ${ap.address}` : appt.mode === 'telehealth_home' ? 'Video visit from home' : provider.address;
  const ModeIcon = MODE_ICON[appt.mode];
  const sms = `${APP_NAME}: ${firstName(patient.displayName)}, your visit with ${provider.name} is ${day} ${fmtTime(date)} at ${place}. Reply C to confirm, R to reschedule.`;

  return (
    <div className="py-8 md:py-12">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_360px] md:gap-12">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <CircleCheck size={40} className="shrink-0 text-ok" aria-hidden="true" />
            <h1 className="text-2xl font-bold tracking-tight md:text-[32px] md:leading-10">You’re booked, {firstName(patient.displayName)}</h1>
          </div>

          <dl className="flex flex-col gap-3.5 rounded-2xl border border-stone-200 bg-white p-5">
            <Row label="Provider">{provider.name}</Row>
            <Row label="Visit type">
              <span className="inline-flex items-center gap-2"><ModeIcon size={18} className="text-brand" aria-hidden="true" />{MODE_LABEL[appt.mode]}</span>
            </Row>
            <Row label="Where">{where}</Row>
            <Row label="When">{fmtDayLong(date)} · {fmtTime(date)}</Row>
          </dl>

          {appt.mode !== 'in_person' && (
            <p className="flex items-center gap-3 rounded-xl bg-access-soft p-4 font-medium">
              <IdCard size={20} className="shrink-0 text-access" aria-hidden="true" />
              {appt.mode === 'telehealth_access_point'
                ? 'Bring a photo ID. A helper will set up the call.'
                : 'You’ll get a link by text 15 min before.'}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button variant="secondary" size="lg" onClick={() => setToast(true)}>
              <CalendarPlus size={18} aria-hidden="true" /> Add to calendar
            </Button>
            <Link to="/patient" className="inline-flex min-h-11 items-center gap-1.5 px-2 font-medium text-brand">
              <ArrowLeft size={16} aria-hidden="true" /> Back to search
            </Link>
            <Link to="/patient/telehealth" className="inline-flex min-h-11 items-center gap-1.5 px-2 font-medium text-brand">
              View telehealth access points <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <SmsPreview message={sms} />
      </div>

      {toast && (
        <div role="status" className="fixed bottom-20 left-1/2 z-[1100] -translate-x-1/2 rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white shadow-lg">
          Added to your calendar (demo)
        </div>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-stone-400">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
