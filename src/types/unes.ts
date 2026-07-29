export type UneStatus = 'published' | 'draft' | 'archived';

export const UNE_LINK_TYPES = ['Page du site', 'Lien externe', 'Aucun lien'];

export interface Une {
  id: string;
  name: string;
  destination: string;
  publicationDate: string;
  status: UneStatus;
}

export const UNES_MOCK: Une[] = [
  { id: 'une-travaux-centre-ville', name: 'Travaux du centre-ville', destination: '/actualites/travaux-centre-ville', publicationDate: '2026-06-01', status: 'published' },
  { id: 'une-inscriptions-scolaires', name: 'Inscriptions scolaires 2026-2027', destination: '/demarches/inscriptions-scolaires', publicationDate: '2026-06-15', status: 'published' },
  { id: 'une-fete-de-la-musique', name: 'Fête de la musique', destination: 'https://fete-musique.exemple.fr', publicationDate: '2026-08-20', status: 'published' },
  { id: 'une-budget-participatif', name: 'Budget participatif — votez !', destination: '/participation/budget-participatif', publicationDate: '', status: 'draft' },
  { id: 'une-recrutement-saisonnier', name: 'Recrutement saisonnier', destination: '/annonces-emploi', publicationDate: '', status: 'draft' },
  { id: 'une-marche-noel-2025', name: 'Marché de Noël 2025', destination: '/agenda/marche-noel-2025', publicationDate: '2025-12-01', status: 'archived' },
];

export interface UneFormData {
  name: string;
  chapo: string;
  linkType: string;
  destination: string;
  thumbnailUrl: string | null;
  publicationDate: string;
  deactivationDate: string;
  status: UneStatus;
}

export const DEFAULT_UNE_FORM: UneFormData = {
  name: '',
  chapo: '',
  linkType: '',
  destination: '',
  thumbnailUrl: null,
  publicationDate: '',
  deactivationDate: '',
  status: 'draft',
};
