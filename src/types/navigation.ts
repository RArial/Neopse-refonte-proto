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
}

export interface NavGroup {
  type: 'group';
  id: string;
  icon: string;
  label: string;
  items: NavSubItem[];
}

export interface NavDivider {
  type: 'divider';
}

export type NavEntry = NavItem | NavGroup | NavDivider;
