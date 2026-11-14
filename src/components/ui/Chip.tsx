import type { ButtonHTMLAttributes } from 'react';

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export default function Chip({ selected, className = '', type = 'button', ...rest }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={`inline-flex h-10 shrink-0 items-center rounded-full border px-4 text-sm font-medium transition-colors
        ${selected ? 'border-brand bg-brand-soft text-brand-dark' : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'}
        ${className}`}
      {...rest}
    />
  );
}
