import { useMemo } from 'react';
import { DEMO_TODAY } from '../../config';
import Chip from '../ui/Chip';
import { fmtDayShort, fmtTime, parseSlot } from './labels';

/** Simulated clinic availability: next 5 weekdays from DEMO_TODAY, 9:00–15:30 every 30 min, ~60% dropped. */
export function generateSlots(seedKey: string): string[] {
  let seed = [...seedKey].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
  const out: string[] = [];
  const day = parseSlot(`${DEMO_TODAY}T00:00`);
  let weekdays = 0;
  while (weekdays < 5) {
    day.setDate(day.getDate() + 1);
    if (day.getDay() === 0 || day.getDay() === 6) continue;
    weekdays++;
    const ymd = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
    for (let m = 9 * 60; m <= 15 * 60 + 30; m += 30) {
      if (rand() < 0.6) continue;
      out.push(`${ymd}T${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
    }
  }
  return out;
}

/** Day tabs, then a grid of time chips. */
export default function SlotPicker({
  slots, value, onChange, day, onDayChange,
}: { slots: string[]; value: string | null; onChange: (s: string) => void; day: string | null; onDayChange: (d: string) => void }) {
  const days = useMemo(() => [...new Set(slots.map((s) => s.slice(0, 10)))], [slots]);
  const activeDay = day && days.includes(day) ? day : days[0];
  const times = slots.filter((s) => s.startsWith(activeDay ?? '__'));

  if (!slots.length) return <p className="text-sm text-stone-600">No open times this week. Call to ask about a cancellation list.</p>;

  return (
    <div className="flex flex-col gap-3">
      <div role="tablist" aria-label="Day" className="flex gap-1.5 overflow-x-auto pb-1">
        {days.map((d) => {
          const date = parseSlot(`${d}T00:00`);
          const on = d === activeDay;
          return (
            <button
              key={d}
              role="tab"
              type="button"
              aria-selected={on}
              onClick={() => onDayChange(d)}
              className={`flex min-h-14 min-w-16 flex-1 flex-col items-center justify-center rounded-xl px-2 transition-colors
                ${on ? 'bg-brand text-white' : 'bg-stone-100 text-stone-900 hover:bg-stone-200'}`}
            >
              <span className={`text-xs ${on ? 'text-white/80' : 'text-stone-600'}`}>{fmtDayShort(date)}</span>
              <span className="font-medium">{date.getDate()}</span>
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2" role="tabpanel">
        {times.map((s) => (
          <Chip key={s} selected={value === s} onClick={() => onChange(s)}>{fmtTime(parseSlot(s))}</Chip>
        ))}
      </div>
    </div>
  );
}
