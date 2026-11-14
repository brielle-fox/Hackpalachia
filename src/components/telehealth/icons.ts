import type { AccessPointKind, CareMode } from '../../types';
export const KIND_ICON: Record<AccessPointKind, string> = { library: '📚', church: '⛪', community_center: '🏛', senior_center: '🧓' };
export const MODE_ICON: Record<CareMode, string> = { in_person: '🏥', telehealth_home: '🏠', telehealth_access_point: '📚' };
export const MODE_LABEL: Record<CareMode, string> = {
  in_person: 'Rather go in person', telehealth_home: 'Video from home', telehealth_access_point: 'Use a nearby private room',
};
