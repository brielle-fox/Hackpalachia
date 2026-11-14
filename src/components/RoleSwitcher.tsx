import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';

/** "Patient · Linda" / "Provider · <org short name>" plus Switch. Hidden on / and /kiosk. */
export default function RoleSwitcher() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const role = useStore((s) => s.role);
  const setRole = useStore((s) => s.setRole);
  const patient = useStore((s) => s.patients.find((p) => p.id === s.currentPatientId));
  const provider = useStore((s) => s.providers.find((p) => p.id === s.currentProviderId));

  if (pathname === '/' || pathname === '/kiosk' || !role) return null;

  const who =
    role === 'patient'
      ? patient?.displayName.replace(/\s*\(.*\)$/, '') ?? 'Guest'
      : shortOrgName(provider?.name ?? 'Provider');

  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="truncate rounded-full bg-brand-soft px-3 py-1.5 text-sm font-medium text-brand-dark">
        {role === 'patient' ? 'Patient' : 'Provider'} · {who}
      </span>
      <button
        type="button"
        onClick={() => {
          setRole(null);
          navigate('/');
        }}
        className="min-h-11 shrink-0 rounded-lg px-2 text-sm font-medium text-brand hover:underline"
      >
        Switch
      </button>
    </div>
  );
}

/** "Hopewell Health Centers – Main Clinic" → "Hopewell Main Clinic"; otherwise the text before the dash. */
function shortOrgName(name: string): string {
  const [org, site] = name.split(' – ');
  if (!site) return org;
  return `${org.replace(' Health Centers', '')} ${site.split(' (')[0]}`;
}
