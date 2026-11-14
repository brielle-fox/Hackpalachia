import { useEffect, useRef, useState } from 'react';
/** Calls onTimeout after `idleMs` idle + `countdownSec` warning. Returns warning state + reset. */
export function useIdleTimer(idleMs: number, countdownSec: number, onTimeout: () => void, enabled = true) {
  const [warning, setWarning] = useState(false);
  const [remaining, setRemaining] = useState(countdownSec);
  const idleRef = useRef<number | undefined>(undefined);
  const cbRef = useRef(onTimeout);
  cbRef.current = onTimeout;
  const warningRef = useRef(false);
  warningRef.current = warning;

  const reset = () => {
    setWarning(false);
    setRemaining(countdownSec);
    window.clearTimeout(idleRef.current);
    if (enabled) idleRef.current = window.setTimeout(() => setWarning(true), idleMs);
  };

  useEffect(() => {
    if (!enabled) return;
    const onActivity = () => { if (!warningRef.current) reset(); };
    const events = ['pointerdown', 'pointermove', 'keydown', 'touchstart', 'wheel'] as const;
    events.forEach(e => window.addEventListener(e, onActivity, { passive: true }));
    reset();
    return () => { events.forEach(e => window.removeEventListener(e, onActivity)); window.clearTimeout(idleRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, idleMs]);

  useEffect(() => {
    if (!warning) return;
    if (remaining <= 0) { setWarning(false); cbRef.current(); reset(); return; }
    const t = window.setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warning, remaining]);

  return { warning, remaining, stillHere: reset };
}
