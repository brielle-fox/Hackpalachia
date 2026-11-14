// WS5 — rendered by WS3's Book page. Props contract: { suggestion, onChoose(mode, accessPointId?) }.
import type { CareMode, CareModeSuggestion } from '../../types';
import { formatSlot } from '../../lib/telehealth';
import { KIND_ICON, MODE_ICON, MODE_LABEL } from './icons';
import Chip from './Chip';

const BG: Record<CareMode, string> = {
  in_person: 'bg-white border-stone-200',
  telehealth_home: 'bg-sky-50 border-sky-200',
  telehealth_access_point: 'bg-orange-50 border-orange-200',
};

export default function CareModeBanner({ suggestion, onChoose }: {
  suggestion: CareModeSuggestion;
  onChoose: (mode: CareMode, accessPointId?: string) => void;
}) {
  const { recommended, reason, accessPoint: ap, alternatives } = suggestion;
  const slot = ap?.openSlots[0];
  return (
    <section aria-live="polite" className={`rounded-2xl border-2 p-5 shadow-sm ${BG[recommended]}`}>
      <div className="flex items-start gap-3">
        <span className="text-4xl leading-none" aria-hidden>{MODE_ICON[recommended]}</span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            {recommended === 'in_person' ? 'Suggested: in person' : recommended === 'telehealth_home' ? 'Suggested: video from home' : 'Suggested: telehealth near you'}
          </p>
          <p className="mt-1 text-lg font-medium leading-snug text-stone-900">{reason}</p>
          {ap && (
            <div className="mt-3 rounded-xl bg-white/80 p-3">
              <p className="font-semibold">{KIND_ICON[ap.kind]} {ap.name}</p>
              <p className="text-sm text-stone-600">{ap.address}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Chip tone="ok">🚪 Private room</Chip>
                {ap.hasHelper && <Chip tone="brand">🙋 Staff can help you connect</Chip>}
                {slot && <Chip tone="warn">🗓 {formatSlot(slot)}</Chip>}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={() => onChoose(recommended, ap?.id)}
          className="min-h-11 rounded-xl bg-brand px-5 py-2.5 text-base font-semibold text-white hover:opacity-90 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300">
          Book this
        </button>
        {alternatives.map(m => (
          <button key={m} type="button" onClick={() => onChoose(m, m === 'telehealth_access_point' ? ap?.id : undefined)}
            className="min-h-11 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-base text-stone-800 hover:bg-stone-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300">
            {MODE_ICON[m]} {MODE_LABEL[m]}
          </button>
        ))}
      </div>
    </section>
  );
}
