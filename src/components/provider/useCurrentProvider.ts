// WS4: current provider org (falls back to the demo clinic so pages never render empty).
import { useStore } from '../../lib/store';
import { DEMO_CAST } from '../../config';

export function useCurrentProvider() {
  const id = useStore(s => s.currentProviderId) ?? DEMO_CAST.clinicProviderId;
  const provider = useStore(s => s.providers.find(p => p.id === id));
  return { id, provider };
}
