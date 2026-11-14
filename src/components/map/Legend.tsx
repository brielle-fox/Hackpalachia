import { useState } from 'react';
import { Info, X } from 'lucide-react';
import { PIN_COLORS } from './pins';

const ITEMS: [string, string][] = [
  [PIN_COLORS.hospital, 'Hospital'],
  [PIN_COLORS.fqhc, 'Health center / clinic'],
  [PIN_COLORS.health_department, 'Health dept'],
  [PIN_COLORS.behavioral_health, 'Behavioral health'],
  [PIN_COLORS.dental, 'Dental / pharmacy'],
  [PIN_COLORS.access_point, 'Telehealth access point'],
];

/** Bottom-left legend. Open by default on desktop; a small "Legend" button on phones. */
export default function Legend() {
  const [open, setOpen] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 768);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute bottom-3 left-3 z-[500] inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-medium text-stone-600 shadow-sm"
      >
        <Info size={14} aria-hidden="true" /> Legend
      </button>
    );
  }

  return (
    <div className="absolute bottom-3 left-3 z-[500] rounded-xl bg-white/95 p-3 text-xs shadow-sm">
      <div className="mb-1.5 flex items-center justify-between gap-4">
        <span className="font-medium text-stone-900">Legend</span>
        <button type="button" onClick={() => setOpen(false)} aria-label="Hide legend" className="text-stone-400 hover:text-stone-600">
          <X size={14} />
        </button>
      </div>
      <ul className="flex flex-col gap-1.5">
        {ITEMS.map(([color, label]) => (
          <li key={label} className="flex items-center gap-2 text-stone-600">
            <span className="h-3 w-3 rounded-full" style={{ background: color }} aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-stone-400">Faded = not accepting new patients</p>
    </div>
  );
}
