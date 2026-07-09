export interface NavSubItem {
  id: string;
  icon: string;
  label: string;
  badge?: number;
  href?: string;
}

export interface NavItem {
  type: 'item';
  id: string;
  icon: string;
  label: string;
  href?: string;
  external?: boolean;
  highlight?: boolean;
  /** Accentue le libellé d'un lien pour le distinguer du reste du menu (ex. « Accès au site »). */
  accent?: 'amber';
}

export interface NavGroup {
  type: 'group';
  id: string;
  icon: string;
  label: string;
  items: NavSubItem[];
}

export interface NavSectionTitle {
  type: 'section-title';
  id: string;
  label: string;
}

export interface NavDivider {
  type: 'divider';
}

export type NavEntry = NavItem | NavGroup | NavSectionTitle | NavDivider;
