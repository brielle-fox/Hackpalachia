import { Clock } from 'lucide-react';
import { freshnessLabel } from '../../lib/freshness';
import Badge from '../ui/Badge';

const TONE = { fresh: 'success', aging: 'warning', stale: 'danger' } as const;

/** Green when fresh, amber when aging, red when stale. Pass days already run through effectiveDaysAgo. */
export default function FreshnessBadge({ daysAgo }: { daysAgo: number }) {
  const f = freshnessLabel(daysAgo);
  return (
    <Badge tone={TONE[f.tone]} icon={<Clock size={12} aria-hidden="true" />}>
      {f.text}
    </Badge>
  );
}
