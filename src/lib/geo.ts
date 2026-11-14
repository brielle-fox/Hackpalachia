import type { LatLng } from '../types';

const EARTH_RADIUS_MI = 3958.8;
const toRad = (d: number) => (d * Math.PI) / 180;

/** Great-circle (haversine) distance in miles. */
export function milesBetween(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_MI * Math.asin(Math.sqrt(h));
}

/**
 * Rough rural drive time. Assumptions: roads wind ~30% more than a straight line (× 1.3) and the
 * average speed on southeast Ohio county roads is ~40 mph. Never shows less than 5 minutes.
 */
export function approxDriveMinutes(a: LatLng, b: LatLng): number {
  return Math.max(5, Math.round((milesBetween(a, b) * 1.3) / 40 * 60));
}

/** "~25 min drive" under an hour; "~1 hr 10 min drive" from 60 minutes. */
export function formatDrive(mins: number): string {
  if (mins < 60) return `~${mins} min drive`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `~${h} hr ${m} min drive` : `~${h} hr drive`;
}
