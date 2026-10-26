import type { CropArea } from '@/types/mediaLibrary';

export type EventStatus = 'published' | 'draft' | 'archived';

export interface AgendaEvent {
  id: string;
  name: string;
  dateStart: string;
  dateEnd?: string;
  publicationDate: string;
  status: EventStatus;
}

export const AGENDA_EVENTS: AgendaEvent[] = [
  { id: 'forum-associations', name: 'Forum des associations', dateStart: '2026-09-24', publicationDate: '2026-07-01', status: 'published' },
  { id: 'exposition-peinture-mediatheque', name: 'Exposition de peinture à la médiathèque', dateStart: '2026-06-29', dateEnd: '2026-07-29', publicationDate: '2026-06-01', status: 'published' },
  { id: 'kermesse-ecole', name: "Kermesse de l'école", dateStart: '2026-06-27', publicationDate: '2026-09-01', status: 'published' },
  { id: 'conseil-municipal-avril', name: 'Conseil municipal — avril', dateStart: '2026-04-22', publicationDate: '', status: 'draft' },
  { id: 'vide-grenier-2025', name: 'Vide-grenier de printemps 2025', dateStart: '2025-04-27', publicationDate: '2025-04-01', status: 'archived' },
];

export type EventCategory = 'culture' | 'sport' | 'reunion' | 'animation' | 'ceremonie' | 'autres';
export type EventPricing = 'gratuit' | 'payant';
export type EventScheduleType = 'ponctuel' | 'recurrent';
export type EventLocationType = 'lieu' | 'adresse';
export type EventDiaporamaType = 'aucune' | 'galerie' | 'diaporama-externe';

export const EVENT_CATEGORY_OPTIONS: { value: EventCategory; label: string }[] = [
  { value: 'culture', label: 'Culture' },
  { value: 'sport', label: 'Sport' },
  { value: 'reunion', label: 'Réunion' },
  { value: 'animation', label: 'Animation' },
  { value: 'ceremonie', label: 'Cérémonie' },
  { value: 'autres', label: 'Autres' },
];

export interface EventFormData {
  // Informations générales
  name: string;
  chapo: string;
  category: EventCategory;
  pricing: EventPricing;
  description: string;

  // Vignette
  thumbnailUrl: string | null;
  /** Recadrage 4:3 en coordonnées sur l'original (la vignette garde l'URL de l'image entière). */
  thumbnailCrop?: CropArea;
  showThumbnailOnWidget: boolean;

  // Dates et horaires
  scheduleType: EventScheduleType;
  dateStart: string;
  timeStart: string;
  dateEnd: string;
  timeEnd: string;

  // Localisation
  city: string;
  locationType: EventLocationType;
  address: string;
  showLocationMap: boolean;

  // Organisateur
  organizerName: string;
  organizerEmail: string;
  organizerPhoneCountry: string;
  organizerPhoneNumber: string;
  organizerWebsite: string;

  // Diaporama d'images
  diaporamaType: EventDiaporamaType;

  // Vidéo
  videoUrl: string;

  // Code HTML
  htmlCode: string;

  // Affichage
  status: EventStatus;
  publicationDate: string;
}

export const DEFAULT_EVENT_FORM: EventFormData = {
  name: '',
  chapo: '',
  category: 'autres',
  pricing: 'gratuit',
  description: '',

  thumbnailUrl: null,
  showThumbnailOnWidget: false,

  scheduleType: 'ponctuel',
  dateStart: '',
  timeStart: '',
  dateEnd: '',
  timeEnd: '',

  city: '',
  locationType: 'adresse',
  address: '',
  showLocationMap: false,

  organizerName: '',
  organizerEmail: '',
  organizerPhoneCountry: 'FR',
  organizerPhoneNumber: '',
  organizerWebsite: '',

  diaporamaType: 'aucune',

  videoUrl: '',

  htmlCode: '',

  status: 'draft',
  publicationDate: '',
};
