import { useState } from 'react';
import { CircleCheck, Clock, Landmark, MessageCircle, ShieldCheck, ShieldQuestion } from 'lucide-react';
import type { Provider } from '../../types';
import { freshnessLabel } from '../../lib/freshness';
import Button from '../ui/Button';
import Chip from '../ui/Chip';
import Modal from '../ui/Modal';
import Stars from './Stars';

/** Shown on a listing when the 🤔 "patient unsure about trust" flag is on. */
export default function TrustPanel({ provider, daysAgo }: { provider: Provider; daysAgo: number }) {
  const [open, setOpen] = useState(false);
  const verifiers = provider.trust.verifiedBy;
  const top = [...(provider.trust.reviews ?? [])].sort((a, b) => b.rating - a.rating).slice(0, 2);
  const fresh = freshnessLabel(daysAgo);

  return (
    <section className="rounded-2xl border-2 border-brand bg-white p-5" aria-labelledby="trust-title">
      <h2 id="trust-title" className="flex items-center gap-2 text-lg font-semibold">
        <ShieldQuestion size={20} className="text-brand" aria-hidden="true" />
        Why you can trust this listing
      </h2>
      <ul className="mt-3 flex flex-col gap-2.5 text-sm">
        <li className="flex gap-2.5">
          <Landmark size={18} className="mt-0.5 shrink-0 text-stone-500" aria-hidden="true" />
          A public, non-profit directory: no ads, no paid rankings.
        </li>
        <li className="flex gap-2.5">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-stone-500" aria-hidden="true" />
          {verifiers.length ? `Verified by ${verifiers.join(' and ')}.` : 'Not yet verified by a local partner.'}
        </li>
        <li className="flex gap-2.5">
          <Clock size={18} className="mt-0.5 shrink-0 text-stone-500" aria-hidden="true" />
          The clinic itself confirmed this listing ({fresh.text.toLowerCase()}).
        </li>
      </ul>

      {top.length > 0 && (
        <>
          <p className="mt-4 text-sm font-medium text-stone-600">Top neighbor reviews</p>
          <ul className="mt-2 flex flex-col gap-2">
            {top.map((r) => (
              <li key={r.id} className="rounded-xl border border-stone-200 p-3">
                <div className="flex items-center justify-between gap-2 text-sm font-medium">
                  {r.author}
                  <Stars rating={r.rating} size={12} />
                </div>
                <p className="mt-1 text-sm text-stone-600">{r.text}</p>
              </li>
            ))}
          </ul>
        </>
      )}

      <Button variant="secondary" fullWidth className="mt-4" onClick={() => setOpen(true)}>
        <MessageCircle size={18} aria-hidden="true" />
        Talk to a community health worker first
      </Button>
      <ChwModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}

function ChwModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [phone, setPhone] = useState('');
  const [time, setTime] = useState<'Morning' | 'Afternoon' | 'Evening'>('Morning');
  const [sent, setSent] = useState(false);
  const close = () => {
    onClose();
    setSent(false);
  };

  if (sent) {
    return (
      <Modal open={open} onClose={close} title="Request sent" footer={<Button onClick={close}>Back to listing</Button>}>
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <CircleCheck size={40} className="text-ok" aria-hidden="true" />
          <p>A community health worker from your county will call you within 1 business day.</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Talk to a community health worker"
      footer={<Button onClick={() => setSent(true)} disabled={phone.replace(/\D/g, '').length < 10}>Request a call</Button>}
    >
      <form className="flex flex-col gap-4 text-stone-900" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
        <p className="text-sm text-stone-600">A local health worker can answer questions about this clinic before you book. Free, no obligation.</p>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-stone-600">
          Name (optional)
          <input className="h-12 rounded-xl border border-stone-200 px-3.5 font-normal text-stone-900" autoComplete="given-name" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-stone-600">
          Phone
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(740) 555-0142"
            className="h-12 rounded-xl border border-stone-200 px-3.5 font-normal text-stone-900"
            autoComplete="tel"
          />
        </label>
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-stone-600">Best time to call</legend>
          <div className="flex flex-wrap gap-2">
            {(['Morning', 'Afternoon', 'Evening'] as const).map((t) => (
              <Chip key={t} selected={time === t} onClick={() => setTime(t)}>{t}</Chip>
            ))}
          </div>
        </fieldset>
      </form>
    </Modal>
  );
}
