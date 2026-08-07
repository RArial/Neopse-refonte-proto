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

export interface NavSectionTitle {
  type: 'section-title';
  id: string;
  label: string;
}

export interface NavDivider {
  type: 'divider';
}

/** Déclenche un panneau flottant distinct (voir `PagesFlyoutPanel`). */
export interface NavFlyout {
  type: 'flyout';
  id: string;
  icon: string;
  label: string;
  /** Désactive temporairement l'entrée sans la supprimer, pour réactivation ultérieure facile. */
  hidden?: boolean;
}

export type NavEntry = NavItem | NavSectionTitle | NavDivider | NavFlyout;
