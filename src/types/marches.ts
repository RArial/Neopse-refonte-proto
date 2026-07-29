import type { Attachment } from '@/components/pages-modules/AttachmentsField';
import type { DiaporamaImage, DiaporamaType } from '@/components/pages-modules/DiaporamaField';

export type MarcheStatus = 'published' | 'draft' | 'archived';

export interface Marche {
  id: string;
  name: string;
  activity: string;
  status: MarcheStatus;
}

export const MARCHES_MOCK: Marche[] = [
  { id: 'marche-centre-ville', name: 'Marché du centre-ville', activity: 'Alimentation générale', status: 'published' },
  { id: 'marche-fleurs-place', name: 'Marché aux fleurs de la Place', activity: 'Fleurs et plantes', status: 'published' },
  { id: 'marche-producteurs', name: 'Marché des producteurs', activity: 'Produits fermiers', status: 'published' },
  { id: 'marche-bio-samedi', name: 'Marché bio du samedi', activity: 'Agriculture biologique', status: 'draft' },
  { id: 'marche-nocturne-ete', name: "Marché nocturne d'été", activity: 'Produits du monde', status: 'draft' },
  { id: 'marche-noel-2025', name: 'Marché de Noël 2025', activity: 'Artisanat et terroir', status: 'archived' },
];

export const STRUCTURE_OPTIONS = [
  'Mairie',
  'Association de commerçants',
  "Chambre de commerce et d'industrie",
  'Régie municipale',
  'Producteurs indépendants',
  'Autre',
];

export const PERIODICITY_OPTIONS = ['Quotidien', 'Hebdomadaire', 'Bimensuel', 'Mensuel', 'Saisonnier', 'Occasionnel'];

export interface ProductType {
  id: string;
  label: string;
}

export const PRODUCT_TYPES: ProductType[] = [
  { id: 'generique', label: 'Marché générique' },
  { id: 'fleurs', label: 'Marché aux fleurs' },
  { id: 'ferme', label: 'Produits de la ferme' },
  { id: 'terroir', label: 'Produits du terroir' },
  { id: 'bio', label: "Produits issus de l'agriculture biologique" },
  { id: 'monde', label: 'Produits du monde' },
];

export interface MarcheFormData {
  name: string;
  activity: string;
  structure: string;
  periodicity: string;
  productTypes: string[];
  description: string;
  thumbnailUrl: string | null;
  cityPostalCode: string;
  address: string;
  showLocationMap: boolean;
  diaporamaType: DiaporamaType;
  images: DiaporamaImage[];
  attachments: Attachment[];
  htmlCode: string;
  status: MarcheStatus;
}

export const DEFAULT_MARCHE_FORM: MarcheFormData = {
  name: '',
  activity: '',
  structure: '',
  periodicity: '',
  productTypes: [],
  description: '',
  thumbnailUrl: null,
  cityPostalCode: '',
  address: '',
  showLocationMap: false,
  diaporamaType: 'aucune',
  images: [],
  attachments: [],
  htmlCode: '',
  status: 'draft',
};
