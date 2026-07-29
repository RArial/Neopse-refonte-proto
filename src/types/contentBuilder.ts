import type { IconName } from '@/components/ui/Icons';

// ─────────────────────────────────────────────────────────────
// Éditeur de contenu structuré en blocs — types génériques réutilisés
// par tout module disposant d'un corps de page composable (actualités, editos…).
// ─────────────────────────────────────────────────────────────

export type LayoutKey = '1' | '2-50-50' | '2-33-67' | '2-67-33' | '3';

export interface LayoutOption {
  key: LayoutKey;
  label: string;
  widths: number[];
}

export const LAYOUT_OPTIONS: LayoutOption[] = [
  { key: '1', label: '1 colonne', widths: [1] },
  { key: '2-50-50', label: '2 colonnes (50/50)', widths: [1, 1] },
  { key: '2-33-67', label: '2 colonnes (33/67)', widths: [1, 2] },
  { key: '2-67-33', label: '2 colonnes (67/33)', widths: [2, 1] },
  { key: '3', label: '3 colonnes', widths: [1, 1, 1] },
];

export interface Attachment {
  id: string;
  name: string;
  url: string;
}

export interface TextBlockData {
  kind: 'text';
  id: string;
  heading: string;
  body: string;
}

export interface ImagesBlockData {
  kind: 'images';
  id: string;
  imageUrls: string[];
}

export interface DiaporamaBlockData {
  kind: 'diaporama';
  id: string;
  imageUrls: string[];
}

export interface AttachmentsBlockData {
  kind: 'attachments';
  id: string;
  attachments: Attachment[];
}

export interface VideoBlockData {
  kind: 'video';
  id: string;
  url: string;
}

export interface HtmlBlockData {
  kind: 'html';
  id: string;
  code: string;
}

export interface FormBlockData {
  kind: 'form';
  id: string;
  formId: string;
}

export type ContentBlockData =
  | TextBlockData
  | ImagesBlockData
  | DiaporamaBlockData
  | AttachmentsBlockData
  | VideoBlockData
  | HtmlBlockData
  | FormBlockData;

export type ContentBlockKind = ContentBlockData['kind'];

export interface ContentBlockPatch {
  heading?: string;
  body?: string;
  imageUrls?: string[];
  attachments?: Attachment[];
  url?: string;
  code?: string;
  formId?: string;
}

/** Libellé et icône (voir `src/components/ui/Icons.tsx`) de chaque type de bloc, partagés entre le
 * panneau « Informations » (glisser-déposer / clic pour insérer) et le menu « Ajouter » de chaque
 * colonne, pour garantir un vocabulaire visuel identique aux deux endroits. */
export const CONTENT_BLOCK_META: Record<ContentBlockKind, { label: string; icon: IconName }> = {
  text: { label: 'Bloc de texte', icon: 'FileText' },
  images: { label: 'Images', icon: 'Image' },
  diaporama: { label: 'Diaporama images', icon: 'Layers' },
  attachments: { label: 'Liste de pièces jointes', icon: 'Paperclip' },
  video: { label: 'Vidéo', icon: 'Play' },
  html: { label: 'Code HTML5', icon: 'Code' },
  form: { label: 'Formulaire', icon: 'Form' },
};

export const CONTENT_BLOCK_KINDS: ContentBlockKind[] = ['text', 'images', 'diaporama', 'attachments', 'video', 'html', 'form'];

/** Type MIME utilisé pour transporter le type de bloc glissé depuis le panneau « Informations »
 * jusqu'à la colonne cible via `DataTransfer` (drag-and-drop natif HTML5). */
export const CONTENT_BLOCK_DRAG_MIME = 'application/x-neopse-content-block';

function randomBlockId() {
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createTextBlock(): TextBlockData {
  return { kind: 'text', id: randomBlockId(), heading: '', body: '' };
}

export function createImagesBlock(): ImagesBlockData {
  return { kind: 'images', id: randomBlockId(), imageUrls: [] };
}

export function createDiaporamaBlock(): DiaporamaBlockData {
  return { kind: 'diaporama', id: randomBlockId(), imageUrls: [] };
}

export function createAttachmentsBlock(): AttachmentsBlockData {
  return { kind: 'attachments', id: randomBlockId(), attachments: [] };
}

export function createVideoBlock(): VideoBlockData {
  return { kind: 'video', id: randomBlockId(), url: '' };
}

export function createHtmlBlock(): HtmlBlockData {
  return { kind: 'html', id: randomBlockId(), code: '' };
}

export function createFormBlock(): FormBlockData {
  return { kind: 'form', id: randomBlockId(), formId: '' };
}

export function createBlock(kind: ContentBlockKind): ContentBlockData {
  switch (kind) {
    case 'text':
      return createTextBlock();
    case 'images':
      return createImagesBlock();
    case 'diaporama':
      return createDiaporamaBlock();
    case 'attachments':
      return createAttachmentsBlock();
    case 'video':
      return createVideoBlock();
    case 'html':
      return createHtmlBlock();
    case 'form':
      return createFormBlock();
  }
}

export interface StructureRow {
  id: string;
  layout: LayoutKey;
  columns: ContentBlockData[][];
}

export function createStructureRow(layout: LayoutKey): StructureRow {
  const option = LAYOUT_OPTIONS.find((candidate) => candidate.key === layout) ?? LAYOUT_OPTIONS[0];
  return {
    id: `row-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    layout,
    columns: option.widths.map(() => []),
  };
}

/** Duplique une liste de lignes de structure avec de nouveaux identifiants — utilisé pour appliquer
 * un template NEOPSE sans jamais partager de références avec le préréglage d'origine. */
export function cloneStructureContent(rows: StructureRow[]): StructureRow[] {
  return rows.map((row) => ({
    ...row,
    id: `row-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    columns: row.columns.map((blocks) => blocks.map((block) => ({ ...block, id: randomBlockId() }))),
  }));
}

export function defaultStructureContent(): StructureRow[] {
  return [
    {
      id: 'row-default-1',
      layout: '1',
      columns: [[{ kind: 'text', id: 'block-default-1', heading: 'Introduction', body: '' }]],
    },
    {
      id: 'row-default-2',
      layout: '1',
      columns: [[{ kind: 'images', id: 'block-default-2', imageUrls: [] }]],
    },
  ];
}
