import { useState, type ReactNode } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import type { Insurance } from '../../types';
import Toggle from '../ui/Toggle';
import Button from '../ui/Button';
import Chip from '../ui/Chip';
import Modal from '../ui/Modal';
import { INSURANCE_LABEL } from './labels';

export type MaxDrive = 15 | 30 | 45 | 60 | null; // null = Any

export interface FilterState {
  acceptingOnly: boolean;
  insurance: Insurance | 'any';
  telehealthOnly: boolean;
  maxDrive: MaxDrive;
}

const DRIVES: MaxDrive[] = [15, 30, 45, 60, null];
const driveLabel = (d: MaxDrive) => (d === null ? 'Any' : `${d} min`);
const INSURANCES = Object.keys(INSURANCE_LABEL) as Insurance[];

/** Inline row on desktop; a "Filters" button opening a bottom sheet on phones. */
export default function Filters({
  value, onChange, resultCount, defaultInsurance,
}: { value: FilterState; onChange: (f: FilterState) => void; resultCount: number; defaultInsurance: Insurance }) {
  const [open, setOpen] = useState(false);
  const set = <K extends keyof FilterState>(k: K, v: FilterState[K]) => onChange({ ...value, [k]: v });
  const active =
    Number(value.acceptingOnly) + Number(value.insurance !== 'any') + Number(value.telehealthOnly) + Number(value.maxDrive !== null);

  return (
    <>
      {/* Desktop */}
      <div className="hidden flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-stone-200 bg-white px-4 py-2 md:flex">
        <Toggle label="Accepting new patients" checked={value.acceptingOnly} onChange={(v) => set('acceptingOnly', v)} />
        <Select label="Insurance" value={value.insurance} onChange={(v) => set('insurance', v as FilterState['insurance'])}>
          <option value="any">Any</option>
          {INSURANCES.map((i) => <option key={i} value={i}>{INSURANCE_LABEL[i]}</option>)}
        </Select>
        <Toggle label="Offers telehealth" checked={value.telehealthOnly} onChange={(v) => set('telehealthOnly', v)} />
        <Select
          label="Max drive"
          value={String(value.maxDrive ?? 'any')}
          onChange={(v) => set('maxDrive', v === 'any' ? null : (Number(v) as MaxDrive))}
        >
          {DRIVES.map((d) => <option key={String(d)} value={String(d ?? 'any')}>{driveLabel(d)}</option>)}
        </Select>
      </div>

      {/* Phone */}
      <Button variant="secondary" className="md:hidden" onClick={() => setOpen(true)}>
        <SlidersHorizontal size={18} aria-hidden="true" />
        Filters{active ? ` (${active})` : ''}
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Filters"
        footer={
          <div className="flex w-full flex-col gap-2">
            <Button size="lg" fullWidth onClick={() => setOpen(false)}>
              Show {resultCount} {resultCount === 1 ? 'provider' : 'providers'}
            </Button>
            <Button
              variant="ghost"
              fullWidth
              onClick={() => onChange({ acceptingOnly: true, insurance: defaultInsurance, telehealthOnly: false, maxDrive: 45 })}
            >
              Reset filters
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-5 text-stone-900">
          <Toggle label="Accepting new patients" checked={value.acceptingOnly} onChange={(v) => set('acceptingOnly', v)} />
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-stone-600">Insurance</legend>
            <div className="flex flex-wrap gap-2">
              {(['any', ...INSURANCES] as const).map((i) => (
                <Chip key={i} selected={value.insurance === i} onClick={() => set('insurance', i)}>
                  {i === 'any' ? 'Any' : INSURANCE_LABEL[i]}
                </Chip>
              ))}
            </div>
          </fieldset>
          <Toggle label="Offers telehealth" checked={value.telehealthOnly} onChange={(v) => set('telehealthOnly', v)} />
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-stone-600">Max drive time</legend>
            <div className="flex flex-wrap gap-2">
              {DRIVES.map((d) => (
                <Chip key={String(d)} selected={value.maxDrive === d} onClick={() => set('maxDrive', d)}>{driveLabel(d)}</Chip>
              ))}
            </div>
          </fieldset>
        </div>
      </Modal>
    </>
  );
}

function Select({
  label, value, onChange, children,
}: { label: string; value: string; onChange: (v: string) => void; children: ReactNode }) {
  return (
    <label className="flex items-center gap-2 text-sm text-stone-600">
      {label}
      <span className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 appearance-none rounded-lg border border-stone-200 bg-white pr-8 pl-3 font-medium text-stone-900"
        >
          {children}
        </select>
        <ChevronDown size={16} aria-hidden="true" className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-stone-500" />
      </span>
    </label>
  );
}
