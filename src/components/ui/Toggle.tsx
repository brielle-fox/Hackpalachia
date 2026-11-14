interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  /** Keep the label for screen readers only (e.g. when a row already shows it). */
  hideLabel?: boolean;
}

export default function Toggle({ checked, onChange, label, hideLabel }: ToggleProps) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={hideLabel ? label : undefined}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-[26px] w-11 shrink-0 items-center rounded-full p-[3px] transition-colors
          ${checked ? 'bg-brand' : 'bg-stone-200'}`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-[18px]' : ''}`}
        />
      </button>
      {!hideLabel && <span className="text-base">{label}</span>}
    </label>
  );
}
