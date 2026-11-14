// STUB — owned by WS3
export function freshnessLabel(daysAgo: number): { text: string; tone: 'fresh' | 'aging' | 'stale' } {
  const tone = daysAgo <= 7 ? 'fresh' : daysAgo <= 30 ? 'aging' : 'stale';
  const text = daysAgo === 0 ? 'Confirmed today' : `Confirmed ${daysAgo} days ago`;
  return { text, tone };
}
