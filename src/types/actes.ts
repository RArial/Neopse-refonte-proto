import type { Attachment } from '@/components/pages-modules/AttachmentsField';
import type { Category } from '@/types/pagesModules';

export type ActeStatus = 'published' | 'draft' | 'archived';

export interface Acte {
  id: string;
  name: string;
  categoryId: string;
  publicationDate: string;
  status: ActeStatus;
}

export type ActeCategory = Category;

export const ACTE_CATEGORIES_SEED: ActeCategory[] = [
  { id: 'cat-conseil-municipal', name: 'Conseil municipal' },
  { id: 'cat-arretes', name: 'Arrêtés municipaux' },
  { id: 'cat-deliberations', name: 'Délibérations' },
];

export const ACTES_MOCK: Acte[] = [
  { id: 'acte-cr-conseil-fevrier', name: 'Compte rendu — Conseil municipal du 12 février', categoryId: 'cat-conseil-municipal', publicationDate: '2026-02-13', status: 'published' },
  { id: 'acte-arrete-circulation', name: 'Arrêté de circulation — rue de la République', categoryId: 'cat-arretes', publicationDate: '2026-06-01', status: 'published' },
  { id: 'acte-deliberation-budget-2027', name: 'Délibération — vote du budget 2027', categoryId: 'cat-deliberations', publicationDate: '2026-09-15', status: 'published' },
  { id: 'acte-cr-conseil-avril', name: 'Compte rendu — Conseil municipal du 28 avril', categoryId: 'cat-conseil-municipal', publicationDate: '', status: 'draft' },
  { id: 'acte-arrete-stationnement', name: 'Arrêté de stationnement — marché hebdomadaire', categoryId: 'cat-arretes', publicationDate: '', status: 'draft' },
  { id: 'acte-cr-conseil-2025', name: 'Compte rendu — Conseil municipal (archive 2025)', categoryId: 'cat-conseil-municipal', publicationDate: '2025-11-04', status: 'archived' },
];

export type ActeAttachment = Attachment;

export interface ActeFormData {
  name: string;
  categoryId: string;
  chapo: string;
  description: string;
  attachments: ActeAttachment[];
  htmlCode: string;
  publicationDate: string;
  endDisplayDate: string;
  status: ActeStatus;
}

export const DEFAULT_ACTE_FORM: ActeFormData = {
  name: '',
  categoryId: '',
  chapo: '',
  description: '',
  attachments: [],
  htmlCode: '',
  publicationDate: '',
  endDisplayDate: '',
  status: 'draft',
};
