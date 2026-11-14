import { useEffect, useState, type ComponentType } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircleHelp, History, SlidersHorizontal, Snowflake, WifiOff, X, type LucideProps } from 'lucide-react';
import { useStore } from '../lib/store';
import type { DemoFlags } from '../types';
import Toggle from './ui/Toggle';
import Badge from './ui/Badge';
import Button from './ui/Button';
import Modal from './ui/Modal';

const SCENARIOS: { key: keyof DemoFlags; label: string; effect: string; Icon: ComponentType<LucideProps> }[] = [
  { key: 'noHomeInternet', label: 'No home internet', effect: 'Booking offers a library telehealth room', Icon: WifiOff },
  { key: 'providerCancelled', label: 'Partner cancelled (snow)', effect: 'Scheduled requirements show re-match', Icon: Snowflake },
  { key: 'patientDistrustful', label: 'Patient unsure about trust', effect: 'Listings explain why they can be trusted', Icon: CircleHelp },
  { key: 'staleListings', label: 'Stale listings', effect: 'Every third listing shows 45 days old', Icon: History },
];

function isTyping(el: Element | null) {
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (el as HTMLElement).isContentEditable;
}

export default function DemoPanel() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const flags = useStore((s) => s.flags);
  const setFlag = useStore((s) => s.setFlag);
  const resetDemo = useStore((s) => s.resetDemo);
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const hidden = pathname === '/kiosk' && !new URLSearchParams(search).has('demo');
  const onCount = Object.values(flags).filter(Boolean).length;

  useEffect(() => {
    if (hidden) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.shiftKey && e.key.toLowerCase() === 'd' && !e.metaKey && !e.ctrlKey && !e.altKey && !isTyping(document.activeElement)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hidden]);

  if (hidden) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open demo controls${onCount ? `, ${onCount} on` : ''}`}
        className="fixed right-4 bottom-4 z-[1000] inline-flex h-12 items-center gap-2 rounded-full bg-stone-900 pr-[18px] pl-4
          font-medium text-white shadow-lg transition hover:bg-stone-800 md:right-6 md:bottom-6"
      >
        <SlidersHorizontal size={18} aria-hidden="true" />
        Demo
        {onCount > 0 && <span className="h-2.5 w-2.5 rounded-full bg-warn" aria-hidden="true" />}
      </button>

      {open && (
        <div className="fixed inset-0 z-[1000]">
          <div className="absolute inset-0 bg-stone-900/30" onClick={() => setOpen(false)} aria-hidden="true" />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Demo controls"
            className="absolute inset-x-0 bottom-0 flex max-h-[90dvh] flex-col gap-4 overflow-y-auto rounded-t-[20px] bg-white px-5 pt-3 pb-7
              shadow-2xl md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-[400px] md:rounded-none md:p-6"
          >
            <div className="mx-auto h-1 w-10 rounded-full bg-stone-200 md:hidden" aria-hidden="true" />
            <div className="flex items-center gap-2.5">
              <SlidersHorizontal size={20} aria-hidden="true" />
              <h2 className="flex-1 text-lg font-semibold">Demo controls</h2>
              {onCount > 0 && <Badge tone="warning">{onCount} on</Badge>}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close demo controls"
                className="grid h-9 w-9 place-items-center rounded-lg text-stone-500 hover:bg-stone-100"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-stone-600">Simulate real-world failures during the pitch. Pages respond live.</p>

            <p className="text-xs font-medium tracking-wide text-stone-400 uppercase">Scenarios</p>
            <ul className="flex flex-col gap-2">
              {SCENARIOS.map(({ key, label, effect, Icon }) => {
                const on = flags[key];
                return (
                  <li
                    key={key}
                    className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 transition-colors
                      ${on ? 'border-brand bg-brand-soft' : 'border-stone-200 bg-white'}`}
                  >
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-[10px] ${on ? 'bg-white text-brand' : 'bg-stone-100 text-stone-600'}`}>
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">{label}</span>
                      <span className="block text-xs text-stone-600">{effect}</span>
                    </span>
                    <Toggle checked={on} onChange={(v) => setFlag(key, v)} label={label} hideLabel />
                  </li>
                );
              })}
            </ul>

            <div className="mt-auto flex flex-col gap-4 border-t border-stone-200 pt-4">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setConfirming(true)}
                className="border-danger-soft text-danger hover:border-danger hover:bg-danger-soft/50"
              >
                Reset demo
              </Button>
              <p className="flex items-center justify-center gap-1.5 text-xs text-stone-400">
                Toggle this panel
                <kbd className="rounded-md border border-stone-200 bg-stone-100 px-1.5 py-0.5 font-sans text-stone-600">Shift</kbd>
                <kbd className="rounded-md border border-stone-200 bg-stone-100 px-1.5 py-0.5 font-sans text-stone-600">D</kbd>
              </p>
            </div>
          </aside>
        </div>
      )}

      <Modal
        open={confirming}
        onClose={() => setConfirming(false)}
        title="Reset the demo?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirming(false)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => {
                resetDemo();
                setConfirming(false);
                setOpen(false);
                navigate('/');
              }}
            >
              Reset demo
            </Button>
          </>
        }
      >
        This clears bookings, matches and scenario switches, then returns to the start page.
      </Modal>
    </>
  );
}
