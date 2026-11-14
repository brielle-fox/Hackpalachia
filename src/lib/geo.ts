// STUB — owned by WS2 (working version shipped by WS1; WS2 refines it)
import type { LatLng } from '../types';

const EARTH_RADIUS_MI = 3958.8;
const toRad = (d: number) => (d * Math.PI) / 180;

/** Haversine distance in miles. */
export function milesBetween(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_MI * Math.asin(Math.sqrt(h));
}

/** miles × 1.3 road factor ÷ 40 mph × 60, rounded. */
export function approxDriveMinutes(a: LatLng, b: LatLng): number {
  return Math.round((milesBetween(a, b) * 1.3) / 40 * 60);
}

export function formatDrive(mins: number): string {
  return `~${mins} min drive`;
}
