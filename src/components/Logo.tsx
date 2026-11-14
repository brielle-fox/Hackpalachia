import { APP_NAME } from '../config';

/** Teal rounded square with a white bridge glyph, then the wordmark. */
export default function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-brand" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.25"
          strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 17h18" />
          <path d="M4 14Q12 6 20 14" />
          <path d="M8 11v6" />
          <path d="M12 10v7" />
          <path d="M16 11v6" />
        </svg>
      </span>
      <span className="text-lg font-semibold tracking-tight">{APP_NAME}</span>
    </span>
  );
}
