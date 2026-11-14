// WS4: small local UI pieces (WS1's ui kit can replace these at integration).
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { RequirementStatus } from '../../types';
import { STATUS_META } from './vocab';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
const VARIANT: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:opacity-90',
  secondary: 'border border-stone-300 bg-white text-stone-800 hover:bg-stone-50',
  ghost: 'text-brand hover:bg-brand-soft',
  danger: 'bg-danger text-white hover:opacity-90',
};
export function PButton({ variant = 'primary', className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button {...rest} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT[variant]} ${className}`} />;
}
export function PCard({ title, action, children, className = '' }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-stone-200 bg-white p-4 shadow-sm md:p-5 ${className}`}>
      {(title || action) && <div className="mb-3 flex items-center justify-between gap-2"><h2 className="text-base font-semibold">{title}</h2>{action}</div>}
      {children}
    </section>
  );
}
export function StatusChip({ status }: { status: RequirementStatus }) {
  const m = STATUS_META[status];
  return <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${m.cls}`}>{m.label}</span>;
}
export function Chip({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'ok' | 'warn' | 'danger' | 'brand' }) {
  const t = { neutral: 'bg-stone-100 text-stone-700', ok: 'bg-green-50 text-ok', warn: 'bg-amber-50 text-warn', danger: 'bg-red-50 text-danger', brand: 'bg-brand-soft text-brand' }[tone];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${t}`}>{children}</span>;
}
