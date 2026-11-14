import type { AccessPoint } from '../../types';
import { freshnessLabel } from '../../lib/freshness';
import { formatDrive } from '../../lib/geo';
import { formatSlot } from '../../lib/telehealth';
import { KIND_ICON } from './icons';
import Chip from './Chip';

const TONE = { fresh: 'text-ok', aging: 'text-warn', stale: 'text-danger' } as const;

export default function AccessPointCard({ ap, driveMinutes, selected, onSelect, selectedSlot, onSlot }: {
  ap: AccessPoint;
  driveMinutes?: number;
  selected?: boolean;
  onSelect?: () => void;
  selectedSlot?: string | null;
  onSlot?: (slot: string) => void;
}) {
  const f = freshnessLabel(ap.lastConfirmedDaysAgo);
  return (
    <article
      onClick={onSelect}
      className={`cursor-pointer rounded-2xl border bg-white p-4 shadow-sm transition hover:ring-2 hover:ring-teal-200 ${selected ? 'ring-2 ring-brand' : 'border-stone-200'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-stone-900"><span aria-hidden>{KIND_ICON[ap.kind]}</span> {ap.name}</h3>
          <p className="text-sm text-stone-600">{ap.town} · {ap.county} County{driveMinutes != null && ` · ${formatDrive(driveMinutes)}`}</p>
        </div>
        {ap.status === 'proposed_partner' && <Chip>Proposed partner site</Chip>}
      </div>
      <p className="mt-1 text-sm text-stone-600">🕘 {ap.hours}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {ap.hasPrivateRoom ? <Chip tone="ok">🚪 Private room</Chip> : <Chip tone="warn">No private room</Chip>}
        {ap.hasHelper && <Chip tone="brand">🙋 Helper on site</Chip>}
        <Chip>💻 {ap.devices} computer{ap.devices === 1 ? '' : 's'}</Chip>
      </div>
      <p className={`mt-2 text-xs font-medium ${TONE[f.tone]}`}>● {f.text}</p>
      {ap.openSlots.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Open telehealth slots">
          {ap.openSlots.slice(0, 3).map(s => (
            <button key={s} type="button"
              onClick={e => { e.stopPropagation(); onSlot?.(s); }}
              className={`rounded-full border px-3 py-1 text-sm ${selectedSlot === s ? 'border-brand bg-brand text-white' : 'border-stone-300 bg-stone-50 hover:bg-brand-soft'}`}>
              {formatSlot(s)}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
