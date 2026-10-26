import type { SortState } from '@/types/mediaLibrary';

export const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png'] as const;
/** Pour l'attribut `accept` : extensions + types MIME, certains OS ne filtrent que sur l'un des deux. */
export const ACCEPT_ATTRIBUTE = '.jpg,.jpeg,.png,image/jpeg,image/png';
export const ACCEPTED_FORMATS_LABEL = 'JPG, PNG';

// Valeur provisoire, reprise du code actuel : le poids max réel est à confirmer avec les devs.
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

// Dossier par défaut à confirmer avec les devs (question ouverte n°5) ; « Site » validé pour le proto.
export const DEFAULT_FOLDER_ID = 'site';

export const DEFAULT_SORT: SortState = { key: 'date', direction: 'desc' };

export const MAX_CROP_ZOOM = 4;
