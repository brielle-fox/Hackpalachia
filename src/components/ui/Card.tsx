import type { HTMLAttributes, KeyboardEvent } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  onClick?: () => void;
}

export default function Card({ onClick, className = '', children, ...rest }: CardProps) {
  const clickable = Boolean(onClick);
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (clickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.();
    }
  };
  return (
    <div
      onClick={onClick}
      onKeyDown={onKeyDown}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      className={`rounded-2xl border border-stone-200 bg-white p-6 shadow-sm
        ${clickable ? 'cursor-pointer transition hover:border-brand hover:ring-2 hover:ring-brand/20' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
