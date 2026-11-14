import type { ReactNode } from 'react';
const TONES = {
  neutral: 'bg-stone-100 text-stone-700 border-stone-200',
  ok: 'bg-green-50 text-green-800 border-green-200',
  warn: 'bg-amber-50 text-amber-800 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  brand: 'bg-brand-soft text-brand border-teal-200',
} as const;
export default function Chip({ tone = 'neutral', children }: { tone?: keyof typeof TONES; children: ReactNode }) {
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${TONES[tone]}`}>{children}</span>;
}
