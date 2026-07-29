import type { DiaporamaImage, DiaporamaType } from '@/components/pages-modules/DiaporamaField';

export type PhotoDiaporamaStatus = 'published' | 'draft' | 'archived';

export interface PhotoDiaporama {
  id: string;
  name: string;
  publicationDate: string;
  status: PhotoDiaporamaStatus;
}

export const PHOTO_DIAPORAMAS_MOCK: PhotoDiaporama[] = [
  { id: 'diaporama-fete-musique', name: 'Fête de la musique 2026', publicationDate: '2026-06-22', status: 'published' },
  { id: 'diaporama-marche-noel', name: 'Marché de Noël', publicationDate: '2026-05-15', status: 'published' },
  { id: 'diaporama-rentree-scolaire', name: 'Rentrée scolaire 2026', publicationDate: '2026-09-01', status: 'published' },
  { id: 'diaporama-festival-ete', name: "Festival d'été — édition 2026", publicationDate: '2026-08-15', status: 'published' },
  { id: 'diaporama-vide-grenier', name: 'Vide-grenier de printemps', publicationDate: '', status: 'draft' },
  { id: 'diaporama-cross-college', name: 'Cross du collège', publicationDate: '2025-10-03', status: 'archived' },
];

export interface PhotoDiaporamaFormData {
  name: string;
  diaporamaType: DiaporamaType;
  images: DiaporamaImage[];
  description: string;
  publicationDate: string;
  featuredHome: boolean;
  status: PhotoDiaporamaStatus;
}

export const DEFAULT_PHOTO_DIAPORAMA_FORM: PhotoDiaporamaFormData = {
  name: '',
  diaporamaType: 'aucune',
  images: [],
  description: '',
  publicationDate: '',
  featuredHome: false,
  status: 'draft',
};
