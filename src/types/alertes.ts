export type AlertStatus = 'published' | 'draft' | 'archived';

export const ALERT_LINK_TYPES = ['Aucun lien', 'Page du site', 'Lien externe', 'Document'];

export interface Alert {
  id: string;
  name: string;
  publicationDate: string;
  status: AlertStatus;
}

export const ALERTS_MOCK: Alert[] = [
  { id: 'alert-1', name: 'Coupure d’eau programmée le 20 juillet', publicationDate: '2026-07-10', status: 'published' },
  { id: 'alert-2', name: 'Pic de pollution — recommandations', publicationDate: '2026-07-18', status: 'published' },
  { id: 'alert-3', name: 'Vigilance canicule — semaine du 3 août', publicationDate: '2026-08-01', status: 'published' },
  { id: 'alert-4', name: 'Fermeture exceptionnelle de la mairie', publicationDate: '', status: 'draft' },
  { id: 'alert-5', name: 'Alerte vigilance orange — orages', publicationDate: '2026-05-14', status: 'archived' },
];

export interface AlertFormData {
  name: string;
  text: string;
  linkType: string;
  publicationDate: string;
  deactivationDate: string;
  status: AlertStatus;
}

export const DEFAULT_ALERT_FORM: AlertFormData = {
  name: '',
  text: '',
  linkType: '',
  publicationDate: '',
  deactivationDate: '',
  status: 'draft',
};
