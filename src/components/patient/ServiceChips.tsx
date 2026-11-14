import type { ServiceType } from '../../types';
import Chip from '../ui/Chip';
import { SERVICE_LABEL, SERVICE_ORDER } from './labels';

/** Horizontally scrollable, multi-select. Empty selection means all services. */
export default function ServiceChips({
  selected, onChange,
}: { selected: ServiceType[]; onChange: (s: ServiceType[]) => void }) {
  const toggle = (s: ServiceType) =>
    onChange(selected.includes(s) ? selected.filter((x) => x !== s) : [...selected, s]);
  return (
    <div
      role="group"
      aria-label="Filter by service"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden"
    >
      {SERVICE_ORDER.map((s) => (
        <Chip key={s} selected={selected.includes(s)} onClick={() => toggle(s)}>{SERVICE_LABEL[s]}</Chip>
      ))}
    </div>
  );
}
