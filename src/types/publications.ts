import type { Attachment } from '@/components/pages-modules/AttachmentsField';
import type { Category } from '@/types/pagesModules';

export type PublicationStatus = 'published' | 'draft' | 'archived';

export interface Publication {
  id: string;
  name: string;
  categoryId: string;
  publicationDate: string;
  status: PublicationStatus;
}

export type PublicationCategory = Category;

export const PUBLICATION_CATEGORIES_SEED: PublicationCategory[] = [
  { id: 'cat-bulletin-municipal', name: 'Bulletin municipal' },
  { id: 'cat-rapports', name: 'Rapports et études' },
  { id: 'cat-guides-pratiques', name: 'Guides pratiques' },
];

export const PUBLICATIONS_MOCK: Publication[] = [
  { id: 'pub-bulletin-ete-2026', name: 'Bulletin municipal — été 2026', categoryId: 'cat-bulletin-municipal', publicationDate: '2026-06-15', status: 'published' },
  { id: 'pub-rapport-developpement-durable', name: 'Rapport développement durable 2025', categoryId: 'cat-rapports', publicationDate: '2026-03-01', status: 'published' },
  { id: 'pub-guide-tri-selectif', name: 'Guide pratique du tri sélectif', categoryId: 'cat-guides-pratiques', publicationDate: '2026-08-20', status: 'published' },
  { id: 'pub-bulletin-automne-2026', name: 'Bulletin municipal — automne 2026', categoryId: 'cat-bulletin-municipal', publicationDate: '', status: 'draft' },
  { id: 'pub-rapport-finances', name: 'Rapport financier annuel', categoryId: 'cat-rapports', publicationDate: '', status: 'draft' },
  { id: 'pub-bulletin-hiver-2025', name: 'Bulletin municipal — hiver 2025 (archive)', categoryId: 'cat-bulletin-municipal', publicationDate: '2025-12-01', status: 'archived' },
];

export interface PublicationFormData {
  name: string;
  chapo: string;
  categoryId: string;
  description: string;
  thumbnailUrl: string | null;
  attachments: Attachment[];
  htmlCode: string;
  publicationDate: string;
  featuredHome: boolean;
  status: PublicationStatus;
}

export const DEFAULT_PUBLICATION_FORM: PublicationFormData = {
  name: '',
  chapo: '',
  categoryId: '',
  description: '',
  thumbnailUrl: null,
  attachments: [],
  htmlCode: '',
  publicationDate: '',
  featuredHome: false,
  status: 'draft',
};
