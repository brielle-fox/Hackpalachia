import { ShieldCheck, Star } from 'lucide-react';
import type { TrustInfo } from '../../types';

/** "Verified by {first} (+N more)", average rating and how many neighbors reviewed. */
export default function TrustBadges({ trust }: { trust: TrustInfo }) {
  const [first, ...rest] = trust.verifiedBy;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium">
      {first ? (
        <span className="inline-flex items-center gap-1 text-brand">
          <ShieldCheck size={14} aria-hidden="true" />
          Verified by {first}
          {rest.length > 0 && ` +${rest.length}`}
        </span>
      ) : (
        <span className="text-stone-400">Not yet verified</span>
      )}
      {trust.rating !== undefined && (
        <span className="inline-flex items-center gap-1 text-warn">
          <Star size={13} aria-hidden="true" className="fill-warn" />
          {trust.rating.toFixed(1)}
        </span>
      )}
      {trust.reviewCount !== undefined && (
        <span className="text-stone-600">{trust.reviewCount} neighbors reviewed</span>
      )}
    </div>
  );
}
