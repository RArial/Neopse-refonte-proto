import type { SortState } from '@/types/mediaLibrary';

export const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png'] as const;
/** Pour l'attribut `accept` : extensions + types MIME, certains OS ne filtrent que sur l'un des deux. */
export const ACCEPT_ATTRIBUTE = '.jpg,.jpeg,.png,image/jpeg,image/png';
export const ACCEPTED_FORMATS_LABEL = 'JPG, PNG';

// Valeur provisoire, reprise du code actuel : le poids max réel est à confirmer avec les devs.
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export const DEFAULT_SORT: SortState = { key: 'date', direction: 'desc' };

export const MAX_CROP_ZOOM = 4;

export const IMPORT_DONE_BANNER_MS = 4000;

// Valeur provisoire validée pour le proto (Actualités, Agenda, Éditos) ; le vrai ratio dépendra de la maquette du site.
export const THUMBNAIL_RATIO = { width: 4, height: 3 } as const;
