export type NewsStatus = 'published' | 'scheduled' | 'draft' | 'archived';

export type NewsThumbnailColor = 'brown' | 'red' | 'green' | null;

export interface NewsArticle {
  id: string;
  title: string;
  thumbnailColor: NewsThumbnailColor;
  publicationDate: string;
  scheduledDate: string | null;
  status: NewsStatus;
  favorite: boolean;
}

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'travaux-rue-republique',
    title: 'Travaux rue de la République — circulation modifiée',
    thumbnailColor: 'brown',
    publicationDate: '2026-06-28',
    scheduledDate: null,
    status: 'published',
    favorite: true,
  },
  {
    id: 'inscriptions-scolaires',
    title: 'Inscriptions scolaires 2026-2027 : mode d’emploi',
    thumbnailColor: null,
    publicationDate: '2026-06-15',
    scheduledDate: null,
    status: 'published',
    favorite: false,
  },
  {
    id: 'fete-de-la-musique',
    title: 'Fête de la musique — le programme complet',
    thumbnailColor: 'red',
    publicationDate: '2026-06-10',
    scheduledDate: null,
    status: 'published',
    favorite: true,
  },
  {
    id: 'newsletter-juin',
    title: 'Newsletter municipale de juin',
    thumbnailColor: null,
    publicationDate: '2026-06-02',
    scheduledDate: null,
    status: 'published',
    favorite: false,
  },
  {
    id: 'canicule-reflexes',
    title: 'Canicule : les bons réflexes à adopter',
    thumbnailColor: null,
    publicationDate: '2026-05-13',
    scheduledDate: null,
    status: 'draft',
    favorite: false,
  },
  {
    id: 'marche-producteurs',
    title: 'Un marché des producteurs chaque samedi matin',
    thumbnailColor: 'green',
    publicationDate: '2026-05-04',
    scheduledDate: null,
    status: 'published',
    favorite: false,
  },
  {
    id: 'conseil-municipal-avril',
    title: 'Conseil municipal du 28 avril — compte rendu',
    thumbnailColor: null,
    publicationDate: '2026-04-30',
    scheduledDate: '2026-07-15',
    status: 'scheduled',
    favorite: false,
  },
  {
    id: 'arrete-arrosage',
    title: 'Restrictions d’arrosage — arrêté municipal',
    thumbnailColor: null,
    publicationDate: '2026-04-18',
    scheduledDate: null,
    status: 'draft',
    favorite: false,
  },
];

// ─────────────────────────────────────────────────────────────
// Éditeur — contenu structuré en blocs (types génériques partagés)
// ─────────────────────────────────────────────────────────────

export * from '@/types/contentBuilder';

import {
  createAttachmentsBlock,
  createImagesBlock,
  createTextBlock,
  createVideoBlock,
  createDiaporamaBlock,
  defaultStructureContent,
  type StructureRow,
} from '@/types/contentBuilder';
import type { CropArea } from '@/types/mediaLibrary';

export interface ContentTemplate {
  id: string;
  label: string;
  content: StructureRow[];
}

export const NEWS_TEMPLATES: ContentTemplate[] = [
  {
    id: 'template-partage-documents',
    label: 'Actualité Partage de documents',
    content: [
      { id: 'template-pd-row-1', layout: '1', columns: [[{ ...createTextBlock(), heading: 'Titre' }]] },
      { id: 'template-pd-row-2', layout: '1', columns: [[createAttachmentsBlock()]] },
    ],
  },
  {
    id: 'template-texte-image-1',
    label: 'Actualité Texte + Image (1)',
    content: [{ id: 'template-ti1-row-1', layout: '2-50-50', columns: [[{ ...createTextBlock(), heading: 'Titre' }], [createImagesBlock()]] }],
  },
  {
    id: 'template-texte-image-2',
    label: 'Actualité Texte + Image (2)',
    content: [{ id: 'template-ti2-row-1', layout: '2-67-33', columns: [[{ ...createTextBlock(), heading: 'Titre' }], [createImagesBlock()]] }],
  },
  {
    id: 'template-texte-video',
    label: 'Actualité Texte + Vidéo',
    content: [{ id: 'template-tv-row-1', layout: '2-50-50', columns: [[{ ...createTextBlock(), heading: 'Titre' }], [createVideoBlock()]] }],
  },
  {
    id: 'template-texte-diaporama',
    label: 'Actualité Texte + Diaporama',
    content: [{ id: 'template-td-row-1', layout: '2-50-50', columns: [[{ ...createTextBlock(), heading: 'Titre' }], [createDiaporamaBlock()]] }],
  },
  {
    id: 'template-texte-3-images',
    label: 'Actualité Texte + 3 images',
    content: [
      { id: 'template-t3i-row-1', layout: '1', columns: [[{ ...createTextBlock(), heading: 'Titre' }]] },
      { id: 'template-t3i-row-2', layout: '3', columns: [[createImagesBlock()], [createImagesBlock()], [createImagesBlock()]] },
    ],
  },
];

export interface NewsFormData {
  name: string;
  chapo: string;
  thumbnailUrl: string | null;
  /** Recadrage 4:3 en coordonnées sur l'original (la vignette garde l'URL de l'image entière). */
  thumbnailCrop?: CropArea;
  status: NewsStatus;
  publicationDate: string;
  content: StructureRow[];
}

export const DEFAULT_NEWS_FORM: NewsFormData = {
  name: '',
  chapo: '',
  thumbnailUrl: null,
  status: 'draft',
  publicationDate: '',
  content: defaultStructureContent(),
};
