import type { IconName } from '@/components/ui/Icons';

export interface SidebarPageEntry {
  id: string;
  label: string;
  icon: IconName;
}

/** Catalogue de toutes les pages/modules proposés par Neopse, listés dans le panneau flottant
 * « Pages » de la barre latérale. Purement indicatif pour l'instant : cliquer sur une entrée ne
 * fait rien (voir Sidebar.tsx). Trié alphabétiquement, comme dans le panneau de référence. */
export const SIDEBAR_PAGES_CATALOG: SidebarPageEntry[] = [
  { id: 'quick-access', label: 'Accès directs', icon: 'LayoutGrid' },
  { id: 'news', label: 'Actualités', icon: 'Newspaper' },
  { id: 'agenda', label: 'Agenda', icon: 'Calendar' },
  { id: 'alerts', label: 'Alertes', icon: 'Bell' },
  { id: 'jobs', label: "Annonces d'emploi", icon: 'Briefcase' },
  { id: 'carpooling', label: 'Annonces de covoiturage', icon: 'Circle' },
  { id: 'health', label: 'Annuaire de la santé', icon: 'Circle' },
  { id: 'associations', label: 'Annuaire des associations', icon: 'UserGroup' },
  { id: 'professionals', label: 'Annuaire des professionnels', icon: 'Briefcase' },
  { id: 'tourism', label: 'Annuaire touristique', icon: 'MapPin' },
  { id: 'contacts', label: 'Contacts', icon: 'IdCard' },
  { id: 'steps', label: 'Démarches en ligne', icon: 'FileText' },
  { id: 'editos', label: 'Editos', icon: 'Edit' },
  { id: 'press', label: 'Espace presse', icon: 'Circle' },
  { id: 'reserved', label: 'Espace Réservé', icon: 'Circle' },
  { id: 'flux', label: 'Externalisation des flux', icon: 'Rss' },
  { id: 'faq', label: 'FAQ', icon: 'Question' },
  { id: 'flash', label: 'Flash Infos', icon: 'Zap' },
  { id: 'video-gallery', label: 'Galerie de vidéos', icon: 'Circle' },
  { id: 'photo-gallery', label: 'Galeries de photos', icon: 'Photo' },
  { id: 'files-manager', label: 'Gestionnaire de fichiers', icon: 'Folder' },
  { id: 'forms-manager', label: 'Gestionnaire de formulaires', icon: 'Form' },
  { id: 'media-manager', label: 'Gestionnaire de médias', icon: 'Image' },
  { id: 'twin', label: 'Jumelages', icon: 'Heart' },
  { id: 'labels', label: 'Labels', icon: 'Tag' },
  { id: 'links', label: 'Liens', icon: 'Link' },
  { id: 'newsletters', label: 'Newsletters', icon: 'Mail' },
  { id: 'push', label: 'Notifications push', icon: 'Bell' },
  { id: 'free-pages', label: 'Pages libres', icon: 'FileText' },
  { id: 'social', label: 'Réseaux sociaux', icon: 'AtSign' },
  { id: 'polls', label: 'Sondages', icon: 'Vote' },
  { id: 'widgets', label: 'Widgets personnalisés', icon: 'Sliders' },
];
