// WS5 — /patient/connect: mocked "Connect your patient portal (e.g., MyChart)".
// Real-world path: major portals expose standards-based patient-access APIs (SMART on FHIR)
// under federal interoperability rules; this demo only simulates that handshake.
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../../lib/store';
import { getProviders } from '../../lib/data';
import PortalConsent from '../../components/telehealth/PortalConsent';

const SYSTEMS: [RegExp, string][] = [
  [/^OhioHealth/i, 'OhioHealth'],
  [/^Hopewell/i, 'Hopewell Health Centers'],
  [/^Holzer/i, 'Holzer Health System'],
  [/^Memorial Health/i, 'Memorial Health System'],
  [/^Genesis/i, 'Genesis HealthCare System'],
  [/^Hocking Valley/i, 'Hocking Valley Community Hospital'],
  [/^Ohio University|Heritage/i, 'Ohio University Heritage College (OU Community Health)'],
];
function systemOf(name: string): string {
  for (const [re, sys] of SYSTEMS) if (re.test(name)) return sys;
  return name.split(/ [–-] /)[0].replace(/\s*\(.*\)$/, '');
}

export default function ConnectPortal() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const ret = params.get('return');
  const patientId = useStore(s => s.currentPatientId);
  const connected = useStore(s => s.patients.find(p => p.id === s.currentPatientId)?.portalConnected ?? false);
  const connectPortal = useStore(s => s.connectPortal);
  const [q, setQ] = useState('');
  const [system, setSystem] = useState<string | null>(null);
  const [step, setStep] = useState<'choose' | 'consent' | 'done'>(connected ? 'done' : 'choose');

  const systems = useMemo(() => Array.from(new Set(
    getProviders().filter(p => ['hospital', 'fqhc', 'clinic', 'behavioral_health'].includes(p.orgType)).map(p => systemOf(p.name)),
  )).sort(), []);
  const shown = systems.filter(s => s.toLowerCase().includes(q.toLowerCase()));

  const back = () => (ret ? navigate(ret) : navigate('/patient'));

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <span className="inline-block rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
        Demo: simulated connection
      </span>
      <h1 className="mt-3 text-2xl font-semibold">Connect your patient portal (e.g., MyChart)</h1>
      <p className="mt-1 text-stone-600">Skip re-typing your history. We only read what you allow.</p>

      {step === 'choose' && (
        <div className="mt-5">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search your health system"
            aria-label="Search health systems"
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-teal-300" />
          <ul className="mt-3 divide-y divide-stone-100 overflow-hidden rounded-2xl border border-stone-200 bg-white">
            {shown.map(s => (
              <li key={s}>
                <button type="button" onClick={() => { setSystem(s); setStep('consent'); }}
                  className="flex min-h-12 w-full items-center justify-between px-4 py-3 text-left hover:bg-brand-soft">
                  <span>🏥 {s}</span><span aria-hidden className="text-stone-400">›</span>
                </button>
              </li>
            ))}
            {shown.length === 0 && <li className="px-4 py-3 text-stone-500">No match. Try another name.</li>}
          </ul>
        </div>
      )}

      {step === 'consent' && system && (
        <div className="mt-6">
          <PortalConsent system={system}
            onAllow={() => { if (patientId) connectPortal(patientId); setStep('done'); }}
            onCancel={() => setStep('choose')} />
        </div>
      )}

      {step === 'done' && (
        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
          <div className="text-5xl" aria-hidden>✅</div>
          <p className="mt-2 text-lg font-semibold text-green-900">Your portal is connected.</p>
          <p className="text-green-900">Booking forms will be filled in for you.</p>
          <button type="button" onClick={back} className="mt-4 min-h-11 rounded-xl bg-brand px-5 font-semibold text-white">Back to booking</button>
        </div>
      )}
    </div>
  );
}
