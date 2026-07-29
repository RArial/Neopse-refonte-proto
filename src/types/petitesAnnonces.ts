import type { DiaporamaImage, DiaporamaType } from '@/components/pages-modules/DiaporamaField';
import type { Category } from '@/types/pagesModules';

export type AnnonceStatus = 'published' | 'draft' | 'archived';

export type AnnonceType = 'offre' | 'demande';

export const ANNONCE_TYPE_LABELS: Record<AnnonceType, string> = {
  offre: 'Offre',
  demande: 'Demande',
};

export type AnnoncePricing = 'gratuit' | 'tarif-unique' | 'fourchette' | 'non-communique';

export const ANNONCE_PRICING_LABELS: Record<AnnoncePricing, string> = {
  gratuit: 'Gratuit',
  'tarif-unique': 'Tarif unique',
  fourchette: 'Fourchette de prix',
  'non-communique': 'Non communiqués',
};

export interface Annonce {
  id: string;
  name: string;
  annonceType: AnnonceType;
  status: AnnonceStatus;
}

export const ANNONCES_MOCK: Annonce[] = [
  { id: 'annonce-velo-enfant', name: 'Vélo enfant 16 pouces', annonceType: 'offre', status: 'published' },
  { id: 'annonce-cours-soutien', name: 'Recherche cours de soutien scolaire', annonceType: 'demande', status: 'published' },
  { id: 'annonce-canape-3-places', name: 'Canapé 3 places', annonceType: 'offre', status: 'published' },
  { id: 'annonce-garde-animaux', name: "Recherche garde d'animaux pour l'été", annonceType: 'demande', status: 'draft' },
  { id: 'annonce-table-jardin', name: 'Table de jardin en teck', annonceType: 'offre', status: 'draft' },
  { id: 'annonce-materiel-bricolage-2025', name: 'Matériel de bricolage', annonceType: 'offre', status: 'archived' },
];

export type AnnonceCategory = Category;

export const ANNONCE_CATEGORIES_SEED: AnnonceCategory[] = [
  { id: 'cat-mobilier', name: 'Mobilier' },
  { id: 'cat-multimedia', name: 'Multimédia' },
  { id: 'cat-services', name: 'Services' },
  { id: 'cat-vehicules', name: 'Véhicules' },
];

export interface AnnonceFormData {
  name: string;
  annonceType: AnnonceType;
  categoryId: string;
  description: string;
  pricing: AnnoncePricing;
  price: string;
  priceMin: string;
  priceMax: string;
  thumbnailUrl: string | null;
  cityPostalCode: string;
  address: string;
  advertiserName: string;
  advertiserEmail: string;
  advertiserPhoneCountry: string;
  advertiserPhone: string;
  diaporamaType: DiaporamaType;
  images: DiaporamaImage[];
  status: AnnonceStatus;
}

export const DEFAULT_ANNONCE_FORM: AnnonceFormData = {
  name: '',
  annonceType: 'offre',
  categoryId: '',
  description: '',
  pricing: 'gratuit',
  price: '',
  priceMin: '',
  priceMax: '',
  thumbnailUrl: null,
  cityPostalCode: '',
  address: '',
  advertiserName: '',
  advertiserEmail: '',
  advertiserPhoneCountry: 'FR',
  advertiserPhone: '',
  diaporamaType: 'aucune',
  images: [],
  status: 'draft',
};
