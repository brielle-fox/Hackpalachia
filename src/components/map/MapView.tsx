import { useEffect, useMemo, useState, type ReactNode } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet';
import { Clock } from 'lucide-react';
import type { AccessPoint, LatLng, Provider } from '../../types';
import { REGION_CENTER, REGION_ZOOM } from '../../config';
import { approxDriveMinutes, formatDrive } from '../../lib/geo';
import { freshnessLabel } from '../../lib/freshness';
import Badge from '../ui/Badge';
import Legend from './Legend';
import { accessPointIcon, originIcon, providerIcon } from './pins';
import './map.css';

export interface MapViewProps {
  providers?: Provider[];
  accessPoints?: AccessPoint[];
  center?: LatLng;            // default REGION_CENTER
  zoom?: number;              // default REGION_ZOOM
  selectedId?: string | null;
  onSelect?: (id: string, type: 'provider' | 'accessPoint') => void;
  highlightIds?: string[];    // e.g. matched partners; others render dimmed when non-empty
  origin?: LatLng;            // patient/requirement location: "You are here"-style pin, drive times measured from it
  fitToMarkers?: boolean;     // default true
  showLegend?: boolean;       // default true
  className?: string;         // caller sets height, e.g. "h-[60vh] md:h-full"
}

const TONE = { fresh: 'success', aging: 'warning', stale: 'danger' } as const;

export default function MapView({
  providers = [], accessPoints = [], center = REGION_CENTER, zoom = REGION_ZOOM, selectedId = null,
  onSelect, highlightIds = [], origin, fitToMarkers = true, showLegend = true, className = 'h-[60vh]',
}: MapViewProps) {
  const [wheelZoom] = useState(() => typeof window === 'undefined' || window.innerWidth >= 768);
  const hasHighlights = highlightIds.length > 0;

  const points = useMemo(
    () => [...providers.map((p) => p.location), ...accessPoints.map((a) => a.location)],
    [providers, accessPoints],
  );
  const markerKey = useMemo(
    () => [...providers.map((p) => p.id), ...accessPoints.map((a) => a.id)].join('|'),
    [providers, accessPoints],
  );
  const selectedPoint = useMemo(
    () => providers.find((p) => p.id === selectedId)?.location ?? accessPoints.find((a) => a.id === selectedId)?.location,
    [providers, accessPoints, selectedId],
  );

  const drive = (to: LatLng) => (origin ? formatDrive(approxDriveMinutes(origin, to)) : null);

  return (
    <div className={`cb-map relative isolate overflow-hidden rounded-2xl ${className}`}>
      <MapContainer center={[center.lat, center.lng]} zoom={zoom} scrollWheelZoom={wheelZoom} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBehavior
          points={points}
          markerKey={markerKey}
          origin={origin}
          fit={fitToMarkers}
          selected={selectedPoint}
          selectedId={selectedId}
        />

        {origin && (
          <Marker position={[origin.lat, origin.lng]} icon={originIcon} interactive={false} keyboard={false}>
            <Tooltip direction="top" offset={[0, -14]}>You are here</Tooltip>
          </Marker>
        )}

        {providers.map((p) => {
          const big = p.id === selectedId || highlightIds.includes(p.id);
          const fresh = freshnessLabel(p.lastConfirmedDaysAgo);
          return (
            <Marker
              key={p.id}
              position={[p.location.lat, p.location.lng]}
              icon={providerIcon(p.orgType, {
                big,
                dimmed: hasHighlights && !highlightIds.includes(p.id),
                notAccepting: !p.acceptingNewPatients,
              })}
              zIndexOffset={big ? 1000 : 0}
              title={p.name}
              eventHandlers={{ click: () => onSelect?.(p.id, 'provider') }}
            >
              <Popup>
                <PopupBody
                  name={p.name}
                  town={p.town}
                  drive={drive(p.location)}
                  onView={onSelect ? () => onSelect(p.id, 'provider') : undefined}
                >
                  <Badge tone={TONE[fresh.tone]} icon={<Clock size={12} aria-hidden="true" />}>{fresh.text}</Badge>
                  {p.acceptingNewPatients
                    ? <Badge tone="success">Accepting</Badge>
                    : <Badge tone="neutral">Not accepting</Badge>}
                </PopupBody>
              </Popup>
            </Marker>
          );
        })}

        {accessPoints.map((a) => {
          const big = a.id === selectedId || highlightIds.includes(a.id);
          const fresh = freshnessLabel(a.lastConfirmedDaysAgo);
          return (
            <Marker
              key={a.id}
              position={[a.location.lat, a.location.lng]}
              icon={accessPointIcon({ big, dimmed: hasHighlights && !highlightIds.includes(a.id) })}
              zIndexOffset={big ? 1000 : 0}
              title={a.name}
              eventHandlers={{ click: () => onSelect?.(a.id, 'accessPoint') }}
            >
              <Popup>
                <PopupBody
                  name={a.name}
                  town={a.town}
                  drive={drive(a.location)}
                  onView={onSelect ? () => onSelect(a.id, 'accessPoint') : undefined}
                >
                  <Badge tone={TONE[fresh.tone]} icon={<Clock size={12} aria-hidden="true" />}>{fresh.text}</Badge>
                  <Badge tone="access">Telehealth room</Badge>
                </PopupBody>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      {showLegend && <Legend />}
    </div>
  );
}

function PopupBody({
  name, town, drive, onView, children,
}: { name: string; town: string; drive: string | null; onView?: () => void; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 text-stone-900">
      <p className="text-sm leading-5 font-medium">{name}</p>
      <p className="text-xs text-stone-600">{town}</p>
      <div className="flex flex-wrap gap-1">{children}</div>
      {drive && <p className="text-xs text-stone-600">{drive}</p>}
      {onView && (
        <button
          type="button"
          onClick={onView}
          className="mt-1 min-h-9 rounded-lg border border-stone-200 text-sm font-medium text-brand hover:border-brand"
        >
          View
        </button>
      )}
    </div>
  );
}

/** Fits bounds when the marker set changes, flies to the selection, and keeps tiles sized correctly. */
function MapBehavior({
  points, markerKey, origin, fit, selected, selectedId,
}: {
  points: LatLng[]; markerKey: string; origin?: LatLng; fit: boolean; selected?: LatLng; selectedId: string | null;
}) {
  const map = useMap();

  // Grey-tile fix: recompute size on mount, window resize, and whenever the container changes size
  // (e.g. a List/Map toggle reveals a hidden map).
  useEffect(() => {
    const el = map.getContainer();
    const fixSize = () => map.invalidateSize();
    fixSize();
    window.addEventListener('resize', fixSize);
    const ro = new ResizeObserver(fixSize);
    ro.observe(el);
    return () => {
      window.removeEventListener('resize', fixSize);
      ro.disconnect();
    };
  }, [map]);

  useEffect(() => {
    if (!fit || points.length === 0) return;
    const all = origin ? [...points, origin] : points;
    map.fitBounds(L.latLngBounds(all.map((p) => [p.lat, p.lng])), { padding: [30, 30], maxZoom: 12 });
    // markerKey captures the marker set (points/origin derive from the same props), so it alone re-fits.
  }, [map, markerKey, fit]);

  useEffect(() => {
    if (!selected) return;
    map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), 12), { duration: 0.6 });
  }, [map, selectedId]);

  return null;
}
