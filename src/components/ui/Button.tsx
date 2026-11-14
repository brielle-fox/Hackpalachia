import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  secondary: 'bg-white text-brand border border-stone-200 hover:border-brand hover:bg-brand-soft/40',
  ghost: 'bg-transparent text-brand hover:bg-brand-soft/50',
  danger: 'bg-danger text-white hover:bg-red-700',
};

// Every size keeps a 44px minimum touch target.
const SIZES: Record<Size, string> = {
  sm: 'min-h-11 px-3 text-sm',
  md: 'min-h-11 px-[18px] text-base',
  lg: 'min-h-14 px-6 text-base',
};

export default function Button({
  variant = 'primary', size = 'md', fullWidth, className = '', type = 'button', ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors
        disabled:cursor-not-allowed disabled:opacity-40 ${VARIANTS[variant]} ${SIZES[size]}
        ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    />
  );
}
