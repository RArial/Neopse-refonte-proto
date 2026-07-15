// ─── Charte graphique (5 couleurs) ──────────────────────────────────────────

export type ColorKey = 'primary' | 'secondary' | 'accent' | 'surfaceLight' | 'surfaceDark';

export const COLOR_KEYS: ColorKey[] = ['primary', 'secondary', 'accent', 'surfaceLight', 'surfaceDark'];

export const COLOR_KEY_LABELS: Record<ColorKey, string> = {
  primary: 'Principale',
  secondary: 'Secondaire',
  accent: 'Accent',
  surfaceLight: 'Fond clair',
  surfaceDark: 'Fond sombre',
};

export const COLOR_KEY_DESCRIPTIONS: Record<ColorKey, string> = {
  primary: 'Actions, liens',
  secondary: 'En-tête, pied de page',
  accent: 'Mises en avant, badges',
  surfaceLight: 'Sections alternées',
  surfaceDark: 'Bandeaux',
};

export interface Palette {
  id: string;
  name: string;
  origin: 'preset' | 'custom';
  /** Id du preset d'origine, uniquement quand origin === 'custom'. */
  basedOn?: string;
  colors: Record<ColorKey, string>;
}

// ─── Rôles (affectations d'une clé de charte à une propriété) ──────────────

export interface RoleValue {
  colorKey: ColorKey;
  alpha: number;
}

export type SectionKey = 'general' | 'header' | 'internalHeader' | 'footer';

export const SECTION_LABELS: Record<SectionKey, string> = {
  general: 'Apparence générale',
  header: 'En-tête et menu de navigation',
  internalHeader: 'En-tête de page interne',
  footer: 'Pied de page',
};

export type ModuleKey = 'news' | 'events' | 'directory' | 'forms' | 'media';

export const MODULE_LABELS: Record<ModuleKey, string> = {
  news: 'Actualités',
  events: 'Agenda',
  directory: 'Annuaire',
  forms: 'Démarches',
  media: 'Médiathèque',
};

export const MODULE_KEYS: ModuleKey[] = ['news', 'events', 'directory', 'forms', 'media'];

export interface ThemeTokens {
  paletteId: string;
  sections: Record<SectionKey, Partial<Record<string, RoleValue>>>;
  /** Surcharges uniquement — un module hérite de `sections.general` pour toute clé absente. */
  modules: Record<ModuleKey, Partial<Record<string, RoleValue>>>;
  typography: { pairingId: string; baseFontSize: number };
}

// ─── Variantes & historique (inchangé dans son principe) ──────────────────

export type EditorStatus = 'idle' | 'dirty' | 'publishing';

export interface Variant {
  id: string;
  name: string;
  templateId: string;
  tokens: ThemeTokens;
  status: 'published' | 'saved';
  previewSlug: string;
  updatedAt: string;
  updatedBy: string;
}

export interface HistoryEntry {
  id: string;
  publishedAt: string;
  publishedBy: string;
  variantName: string;
  templateId: string;
  tokens: ThemeTokens;
}

// ─── Contraste ──────────────────────────────────────────────────────────────

export interface ContrastIssue {
  section: SectionKey | ModuleKey;
  sectionLabel: string;
  propertyKey: string;
  propertyLabel: string;
  ratio: number;
  severity: 'warning' | 'critical';
  /** false pour les propriétés "text-manual" (ex. liens) : elles n'ont pas d'état Auto vers lequel revenir. */
  canResetToAuto: boolean;
}

// ─── Gabarits de page (preview) ────────────────────────────────────────────

export const PAGE_GABARITS: { id: string; label: string; description: string }[] = [
  { id: 'accueil', label: 'Accueil', description: 'Bandeau, modules, blocs colorés' },
  { id: 'page-contenu', label: 'Page de contenu', description: 'Typo longue, liens dans le texte' },
  { id: 'liste', label: "Liste d'actualités", description: 'Cartes, pagination, filtres' },
  { id: 'fiche-detail', label: 'Fiche actualité', description: "Image d'entête, texte sur fond" },
];

export type PageGabaritId = (typeof PAGE_GABARITS)[number]['id'];
