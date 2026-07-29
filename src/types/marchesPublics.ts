import type { Attachment } from '@/components/pages-modules/AttachmentsField';

export type MarchePublicStatus = 'published' | 'draft' | 'archived';

export interface MarchePublic {
  id: string;
  objet: string;
  domaine: string;
  status: MarchePublicStatus;
}

export const DOMAINE_OPTIONS = ['Travaux', 'Fournitures', 'Services', 'Prestations intellectuelles'];

export const PROCEDURE_OPTIONS = [
  'Procédure adaptée (MAPA)',
  "Appel d'offres ouvert",
  "Appel d'offres restreint",
  'Procédure avec négociation',
  'Dialogue compétitif',
  'Marché négocié sans publicité ni mise en concurrence',
];

export const MARCHES_PUBLICS_MOCK: MarchePublic[] = [
  { id: 'mp-rehabilitation-mediatheque', objet: 'Travaux de réhabilitation de la médiathèque municipale', domaine: 'Travaux', status: 'published' },
  { id: 'mp-materiel-informatique-ecoles', objet: 'Fourniture de matériel informatique pour les écoles', domaine: 'Fournitures', status: 'published' },
  { id: 'mp-nettoyage-batiments', objet: 'Prestations de nettoyage des bâtiments communaux', domaine: 'Services', status: 'published' },
  { id: 'mp-maitrise-oeuvre-gymnase', objet: "Mission de maîtrise d'œuvre — construction d'un gymnase", domaine: 'Prestations intellectuelles', status: 'draft' },
  { id: 'mp-renovation-eclairage', objet: "Rénovation de l'éclairage public", domaine: 'Travaux', status: 'draft' },
  { id: 'mp-restauration-scolaire-2025', objet: 'Marché de restauration scolaire (archive 2025)', domaine: 'Services', status: 'archived' },
];

export interface MarchePublicFormData {
  objet: string;
  domaine: string;
  procedure: string;
  cpvCode: string;
  reference: string;
  destinationUrl: string;
  description: string;
  startDate: string;
  endDate: string;
  contactServiceName: string;
  contactManagerName: string;
  cityPostalCode: string;
  address: string;
  phone1Country: string;
  phone1: string;
  phone2Country: string;
  phone2: string;
  phone3Country: string;
  phone3: string;
  contactIds: string[];
  formId: string;
  attachments: Attachment[];
  status: MarchePublicStatus;
}

export const DEFAULT_MARCHE_PUBLIC_FORM: MarchePublicFormData = {
  objet: '',
  domaine: '',
  procedure: '',
  cpvCode: '',
  reference: '',
  destinationUrl: '',
  description: '',
  startDate: '',
  endDate: '',
  contactServiceName: '',
  contactManagerName: '',
  cityPostalCode: '',
  address: '',
  phone1Country: 'FR',
  phone1: '',
  phone2Country: 'FR',
  phone2: '',
  phone3Country: 'FR',
  phone3: '',
  contactIds: [],
  formId: '',
  attachments: [],
  status: 'draft',
};

// ─────────────────────────────────────────────────────────────
// Réglages de la page « Marchés publics »
// ─────────────────────────────────────────────────────────────

export type MarchePublicInformationDisplay = 'module' | 'html';
export type MarchePublicAwardedListType = 'marches' | 'documents';

export interface MarchePublicPageSettings {
  informationDisplay: MarchePublicInformationDisplay;
  replaceCurrentTendersTable: boolean;
  replaceAwardedTendersTable: boolean;
  htmlCode: string;
  awardedListType: MarchePublicAwardedListType;
  attachments: Attachment[];
}

export const DEFAULT_MARCHE_PUBLIC_PAGE_SETTINGS: MarchePublicPageSettings = {
  informationDisplay: 'module',
  replaceCurrentTendersTable: false,
  replaceAwardedTendersTable: false,
  htmlCode: '',
  awardedListType: 'marches',
  attachments: [],
};
