/** Statut affiché, toujours dérivé (voir `deriveNewsStatus`) : il n'est jamais stocké. */
export type NewsStatus = 'published' | 'scheduled' | 'inactive';

export interface NewsThumbnail {
  url: string;
  /** Recadrage en coordonnées sur l'original (la vignette garde l'URL de l'image entière). */
  crop?: CropArea;
}

export interface NewsArticle {
  id: string;
  /** Requis, 100 caractères max. */
  title: string;
  /** Chapô, 150 caractères max. */
  lead: string;
  /** 5 favoris max par projet. */
  favorite: boolean;
  thumbnail?: NewsThumbnail;
  /** Date ISO (AAAA-MM-JJ). */
  publishedAt: string;
  /** Date ISO, postérieure à `publishedAt`. */
  deactivatedAt?: string;
  /** Toggle « Statut » du formulaire. */
  active: boolean;
  content: StructureRow[];
}

export const MAX_FAVORITE_NEWS = 5;
export const NEWS_TITLE_MAX = 100;
export const NEWS_LEAD_MAX = 150;

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
    label: 'Texte + Image (1)',
    content: [{ id: 'template-ti1-row-1', layout: '2-50-50', columns: [[{ ...createTextBlock(), heading: 'Titre' }], [createImagesBlock()]] }],
  },
  {
    id: 'template-texte-image-2',
    label: 'Texte + Image (2)',
    content: [{ id: 'template-ti2-row-1', layout: '2-67-33', columns: [[{ ...createTextBlock(), heading: 'Titre' }], [createImagesBlock()]] }],
  },
  {
    id: 'template-texte-video',
    label: 'Texte + Vidéo',
    content: [{ id: 'template-tv-row-1', layout: '2-50-50', columns: [[{ ...createTextBlock(), heading: 'Titre' }], [createVideoBlock()]] }],
  },
  {
    id: 'template-texte-diaporama',
    label: 'Texte + Diaporama',
    content: [{ id: 'template-td-row-1', layout: '2-50-50', columns: [[{ ...createTextBlock(), heading: 'Titre' }], [createDiaporamaBlock()]] }],
  },
  {
    id: 'template-texte-3-images',
    label: 'Texte + 3 images',
    content: [
      { id: 'template-t3i-row-1', layout: '1', columns: [[{ ...createTextBlock(), heading: 'Titre' }]] },
      { id: 'template-t3i-row-2', layout: '3', columns: [[createImagesBlock()], [createImagesBlock()], [createImagesBlock()]] },
    ],
  },
];

/** Données éditées dans le formulaire : l'article sans son identifiant. */
export type NewsFormData = Omit<NewsArticle, 'id'>;
