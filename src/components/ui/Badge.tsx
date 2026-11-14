import type { ReactNode } from 'react';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'brand' | 'access';

const TONES: Record<BadgeTone, string> = {
  neutral: 'bg-stone-100 text-stone-600',
  success: 'bg-ok-soft text-ok',
  warning: 'bg-warn-soft text-warn',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
  brand: 'bg-brand-soft text-brand-dark',
  access: 'bg-access-soft text-access',
};

export default function Badge({
  tone = 'neutral', icon, children, className = '',
}: { tone?: BadgeTone; icon?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]} ${className}`}>
      {icon}
      {children}
    </span>
  );
}
