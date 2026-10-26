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

export type EditoStatus = 'published' | 'scheduled' | 'draft' | 'archived';

export interface EditoArticle {
  id: string;
  title: string;
  publicationDate: string;
  scheduledDate: string | null;
  deactivationDate: string | null;
  status: EditoStatus;
  favorite: boolean;
  featuredHome: boolean;
}

export const EDITO_ARTICLES: EditoArticle[] = [
  {
    id: 'mot-du-maire-rentree',
    title: 'Le mot du Maire — rentrée 2026',
    publicationDate: '2026-07-01',
    scheduledDate: null,
    deactivationDate: '2026-09-30',
    status: 'published',
    favorite: true,
    featuredHome: true,
  },
  {
    id: 'tribune-mobilites-douces',
    title: 'Tribune : mobilités douces',
    publicationDate: '2026-06-18',
    scheduledDate: null,
    deactivationDate: null,
    status: 'published',
    favorite: false,
    featuredHome: false,
  },
  {
    id: 'edito-budget-2026',
    title: 'Édito : voter le budget 2026',
    publicationDate: '2026-04-22',
    scheduledDate: null,
    deactivationDate: '2026-05-31',
    status: 'published',
    favorite: true,
    featuredHome: false,
  },
  {
    id: 'edito-voeux-2027',
    title: 'Édito : vœux du Maire pour 2027',
    publicationDate: '2026-04-30',
    scheduledDate: '2026-12-20',
    deactivationDate: null,
    status: 'scheduled',
    favorite: false,
    featuredHome: false,
  },
  {
    id: 'edito-rentree-associative',
    title: 'La rentrée associative en préparation',
    publicationDate: '2026-05-10',
    scheduledDate: null,
    deactivationDate: null,
    status: 'draft',
    favorite: false,
    featuredHome: false,
  },
  {
    id: 'edito-tribune-securite',
    title: 'Tribune de l’opposition : sécurité de proximité',
    publicationDate: '2026-03-02',
    scheduledDate: null,
    deactivationDate: null,
    status: 'draft',
    favorite: false,
    featuredHome: false,
  },
];

export interface ContentTemplate {
  id: string;
  label: string;
  content: StructureRow[];
}

export const EDITO_TEMPLATES: ContentTemplate[] = [
  {
    id: 'template-partage-documents',
    label: 'Édito Partage de documents',
    content: [
      { id: 'template-pd-row-1', layout: '1', columns: [[{ ...createTextBlock(), heading: 'Titre' }]] },
      { id: 'template-pd-row-2', layout: '1', columns: [[createAttachmentsBlock()]] },
    ],
  },
  {
    id: 'template-texte-image-1',
    label: 'Édito Texte + Image (1)',
    content: [{ id: 'template-ti1-row-1', layout: '2-50-50', columns: [[{ ...createTextBlock(), heading: 'Titre' }], [createImagesBlock()]] }],
  },
  {
    id: 'template-texte-image-2',
    label: 'Édito Texte + Image (2)',
    content: [{ id: 'template-ti2-row-1', layout: '2-67-33', columns: [[{ ...createTextBlock(), heading: 'Titre' }], [createImagesBlock()]] }],
  },
  {
    id: 'template-texte-video',
    label: 'Édito Texte + Vidéo',
    content: [{ id: 'template-tv-row-1', layout: '2-50-50', columns: [[{ ...createTextBlock(), heading: 'Titre' }], [createVideoBlock()]] }],
  },
  {
    id: 'template-texte-diaporama',
    label: 'Édito Texte + Diaporama',
    content: [{ id: 'template-td-row-1', layout: '2-50-50', columns: [[{ ...createTextBlock(), heading: 'Titre' }], [createDiaporamaBlock()]] }],
  },
  {
    id: 'template-texte-3-images',
    label: 'Édito Texte + 3 images',
    content: [
      { id: 'template-t3i-row-1', layout: '1', columns: [[{ ...createTextBlock(), heading: 'Titre' }]] },
      { id: 'template-t3i-row-2', layout: '3', columns: [[createImagesBlock()], [createImagesBlock()], [createImagesBlock()]] },
    ],
  },
];

export interface EditoFormData {
  name: string;
  chapo: string;
  thumbnailUrl: string | null;
  /** Recadrage 4:3 en coordonnées sur l'original (la vignette garde l'URL de l'image entière). */
  thumbnailCrop?: CropArea;
  status: EditoStatus;
  publicationDate: string;
  deactivationDate: string;
  featuredHome: boolean;
  content: StructureRow[];
}

export const DEFAULT_EDITO_FORM: EditoFormData = {
  name: '',
  chapo: '',
  thumbnailUrl: null,
  status: 'draft',
  publicationDate: '',
  deactivationDate: '',
  featuredHome: false,
  content: defaultStructureContent(),
};
