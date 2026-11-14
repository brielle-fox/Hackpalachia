import { Star } from 'lucide-react';

export default function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  const full = Math.round(rating);
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={size}
          aria-hidden="true"
          className={i < full ? 'fill-warn text-warn' : 'fill-none text-stone-300'}
        />
      ))}
    </span>
  );
}
