import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Check, Video } from 'lucide-react';
import type { Insurance, Provider } from '../../types';
import { formatDrive } from '../../lib/geo';
import { effectiveDaysAgo } from '../../lib/freshness';
import { useStore } from '../../lib/store';
import Badge from '../ui/Badge';
import FreshnessBadge from './FreshnessBadge';
import TrustBadges from './TrustBadges';
import { INSURANCE_LABEL, ORG_LABEL } from './labels';

interface ListingCardProps {
  provider: Provider;
  driveMins: number;
  selected: boolean;
  onSelect: () => void;
  patientInsurance?: Insurance;
}

/** The whole card links to the listing; hovering or focusing it selects its map pin. */
const ListingCard = forwardRef<HTMLAnchorElement, ListingCardProps>(function ListingCard(
  { provider: p, driveMins, selected, onSelect, patientInsurance },
  ref,
) {
  const flags = useStore((s) => s.flags);
  return (
    <Link
      ref={ref}
      to={`/patient/listing/${p.id}`}
      onMouseEnter={onSelect}
      onFocus={onSelect}
      className={`block rounded-2xl border bg-white p-5 shadow-sm transition
        ${selected ? 'border-brand bg-brand-soft/60 ring-2 ring-brand/20' : 'border-stone-200 hover:border-stone-300'}`}
    >
      <h3 className="text-lg leading-snug font-semibold">{p.name}</h3>
      <p className="mt-0.5 text-xs text-stone-600">{ORG_LABEL[p.orgType]}</p>
      <p className="mt-3 text-sm text-stone-600">{p.town} · {formatDrive(driveMins)}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {p.acceptingNewPatients ? (
          <Badge tone="success" icon={<span className="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true" />}>
            Accepting new patients
          </Badge>
        ) : (
          <Badge tone="neutral">Not accepting</Badge>
        )}
        <FreshnessBadge daysAgo={effectiveDaysAgo(p, flags)} />
        {p.offersTelehealth && <Badge tone="access" icon={<Video size={12} aria-hidden="true" />}>Telehealth</Badge>}
      </div>

      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Insurance accepted">
        {p.insurances.map((ins) => (
          <li key={ins}>
            {ins === patientInsurance ? (
              <Badge tone="brand" icon={<Check size={12} aria-hidden="true" />}>{INSURANCE_LABEL[ins]}</Badge>
            ) : (
              <Badge tone="neutral">{INSURANCE_LABEL[ins]}</Badge>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-4 border-t border-stone-200 pt-3">
        <TrustBadges trust={p.trust} />
      </div>
    </Link>
  );
});

export default ListingCard;
