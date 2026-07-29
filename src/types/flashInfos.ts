export type FlashInfoStatus = 'published' | 'draft' | 'archived';

export type FlashInfoUrlTarget = 'interne' | 'nouvelle-page';

export interface FlashInfo {
  id: string;
  name: string;
  publicationDate: string;
  status: FlashInfoStatus;
}

export const FLASH_INFOS_MOCK: FlashInfo[] = [
  { id: 'flash-marche-deplace', name: 'Marché déplacé exceptionnellement au 12 juillet', publicationDate: '2026-07-05', status: 'published' },
  { id: 'flash-fermeture-mairie', name: 'Fermeture de la mairie le 15 août', publicationDate: '2026-07-20', status: 'published' },
  { id: 'flash-collecte-dechets', name: 'Changement des jours de collecte des déchets', publicationDate: '2026-08-10', status: 'published' },
  { id: 'flash-inscription-cantine', name: 'Ouverture des inscriptions à la cantine', publicationDate: '', status: 'draft' },
  { id: 'flash-panne-eclairage', name: "Panne d'éclairage public — rue Victor Hugo", publicationDate: '2025-11-02', status: 'archived' },
];

export interface FlashInfoFormData {
  name: string;
  text: string;
  url: string;
  urlTarget: FlashInfoUrlTarget;
  publicationDate: string;
  deactivationDate: string;
  status: FlashInfoStatus;
}

export const DEFAULT_FLASH_INFO_FORM: FlashInfoFormData = {
  name: '',
  text: '',
  url: '',
  urlTarget: 'interne',
  publicationDate: '',
  deactivationDate: '',
  status: 'draft',
};
