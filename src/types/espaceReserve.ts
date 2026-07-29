import type { Attachment } from '@/components/pages-modules/AttachmentsField';
import type { SimpleContentItem } from '@/components/pages-modules/ContentListPage';
import type { DiaporamaImage, DiaporamaType } from '@/components/pages-modules/DiaporamaField';
import type { Category } from '@/types/pagesModules';

// ─────────────────────────────────────────────────────────────
// Groupes d'accès
// ─────────────────────────────────────────────────────────────

/** Groupe pouvant être coché comme « autorisé » sur un contenu, ou assigné à un membre — même
 * forme que `Category` (id + nom) pour pouvoir être géré via `CategoriesDialog`. */
export type ReservedGroup = Category;

export const RESERVED_GROUPS_SEED: ReservedGroup[] = [
  { id: 'group-elus', name: 'Élus' },
  { id: 'group-agents', name: 'Agents' },
  { id: 'group-associations', name: 'Associations' },
  { id: 'group-tous-inscrits', name: 'Tous les inscrits' },
];

// ─────────────────────────────────────────────────────────────
// Contenus réservés
// ─────────────────────────────────────────────────────────────

export interface ReservedContent extends SimpleContentItem {
  publicationDate: string;
}

export const RESERVED_CONTENTS: ReservedContent[] = [
  { id: 'reserved-1', name: 'Compte-rendu du conseil municipal (élus)', active: true, publicationDate: '2026-06-12' },
];

export interface ReservedContentFormData {
  name: string;
  chapo: string;
  allowedGroupIds: string[];
  text: string;
  thumbnailUrl: string | null;
  diaporamaType: DiaporamaType;
  images: DiaporamaImage[];
  attachments: Attachment[];
  videoUrl: string;
  htmlCode: string;
  publicationDate: string;
  deactivationDate: string;
  active: boolean;
}

export const DEFAULT_RESERVED_CONTENT_FORM: ReservedContentFormData = {
  name: '',
  chapo: '',
  allowedGroupIds: [],
  text: '',
  thumbnailUrl: null,
  diaporamaType: 'aucune',
  images: [],
  attachments: [],
  videoUrl: '',
  htmlCode: '',
  publicationDate: '',
  deactivationDate: '',
  active: false,
};

// ─────────────────────────────────────────────────────────────
// Membres autorisés
// ─────────────────────────────────────────────────────────────

export interface ReservedMember {
  id: string;
  name: string;
  handle: string;
  groupIds: string[];
}

export const RESERVED_MEMBERS_SEED: ReservedMember[] = [
  { id: 'member-1', name: 'Laura Contamine', handle: '@lcontamine', groupIds: ['group-elus'] },
];

export interface ReservedMemberInvite {
  id: string;
  email: string;
  groupIds: string[];
}

// ─────────────────────────────────────────────────────────────
// Réglages de la page « Espace Réservé »
// ─────────────────────────────────────────────────────────────

export interface ReservedPageSettings {
  introText: string;
  accessButtonLabel: string;
  accessDeniedText: string;
}

export const DEFAULT_RESERVED_PAGE_SETTINGS: ReservedPageSettings = {
  introText: '<p>Bienvenue dans cet espace, réservé aux usagers identifiés.</p>',
  accessButtonLabel: 'Connexion Espace Réservé',
  accessDeniedText: "<p>Vous n'avez pas accès à cet espace réservé.</p>",
};
