import type { SvgIconProps } from '@mui/material/SvgIcon';

export type NavNodeKind = 'tab';

/** Un élément de contenu rattachable à l'arborescence : un module (rubrique comprise), un lien (raccourci), ou une séparation visuelle. */
export type ContentItemKind = 'module' | 'link' | 'separator';

export interface NavChildNode {
  id: string;
  label: string;
  typeLabel: string;
  enabled: boolean;
  kind: ContentItemKind;
  icon?: React.ComponentType<SvgIconProps>;
  /** Modules rattachés à celui-ci via `parentPageId` — un niveau d'arborescence supplémentaire. */
  children?: NavChildNode[];
}

export interface NavTreeNode {
  id: string;
  label: string;
  typeLabel: string;
  kind: NavNodeKind;
  enabled: boolean;
  defaultOpen?: boolean;
  /** Vignette optionnelle illustrant l'onglet thématique. */
  thumbnailUrl?: string;
  children?: NavChildNode[];
}

export interface CatalogModule {
  id: string;
  label: string;
  icon: React.ComponentType<SvgIconProps>;
  description?: string;
}

export type ModuleStatus = 'draft' | 'published' | 'archived';

/** Un raccourci interne pointe vers une page déjà présente dans la structure ; un raccourci externe pointe vers une URL. */
export type LinkType = 'internal' | 'external';

export interface AddedModule {
  id: string;
  catalogModuleId: string;
  label: string;
  typeLabel: string;
  kind: ContentItemKind;
  thematiqueId: string;
  parentPageId: string;
  enabled: boolean;
  status: ModuleStatus;
  icon?: React.ComponentType<SvgIconProps>;
  headerEnabled: boolean;
  headerTitle: string;
  headerDescription: string;
  metaDescription: string;
  metaKeywords: string;
  /** Champs suivants uniquement pertinents pour `kind === 'link'`. */
  linkType?: LinkType;
  /** URL cible pour un raccourci externe. */
  externalUrl?: string;
  /** Id de la page (module) ciblée pour un raccourci interne. */
  internalTargetId?: string;
}

/** Entrée de premier niveau de la structure de navigation : un onglet thématique ou un module rattaché à la racine. */
export type TopLevelItem =
  | { type: 'tab'; node: NavTreeNode }
  | { type: 'module'; node: NavChildNode };

/** Conteneur cible d'un module déplacé par glisser-déposer : la racine du menu, un onglet thématique, ou une page parente. */
export type ModuleDropContainer =
  | { kind: 'root' }
  | { kind: 'tab'; tabId: string }
  | { kind: 'module'; moduleId: string };
