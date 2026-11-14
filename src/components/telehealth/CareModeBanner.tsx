// STUB — owned by WS5 (lets WS3's Book page import it before WS5 merges)
import type { CareMode, CareModeSuggestion } from '../../types';

const MODE_LABEL: Record<CareMode, string> = {
  in_person: 'In person',
  telehealth_home: 'Video from home',
  telehealth_access_point: 'Telehealth at a library',
};

export default function CareModeBanner({
  suggestion, onChoose,
}: { suggestion: CareModeSuggestion; onChoose: (m: CareMode) => void }) {
  const modes = [suggestion.recommended, ...suggestion.alternatives];
  return (
    <div className="rounded-2xl bg-brand-soft p-6">
      <p className="text-lg">{suggestion.reason}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {modes.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onChoose(m)}
            className="min-h-11 rounded-xl border border-stone-200 bg-white px-4 font-medium text-brand"
          >
            {MODE_LABEL[m]}
          </button>
        ))}
      </div>
    </div>
  );
}
