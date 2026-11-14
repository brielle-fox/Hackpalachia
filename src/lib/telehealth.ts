// STUB — owned by WS5
import type { SuggestCareModeFn } from '../types';

export const suggestCareMode: SuggestCareModeFn = () => ({
  recommended: 'in_person',
  reason: 'In-person visit available.',
  alternatives: ['telehealth_home'],
});
