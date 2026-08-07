import type { IconName } from '@/components/ui/Icons';

export type SidebarPageCategoryId =
  | 'contenus'
  | 'partages'
  | 'demarches'
  | 'annuaires'
  | 'institution'
  | 'economie'
  | 'participation'
  | 'multimedia'
  | 'outils';

export interface SidebarPageCategory {
  id: SidebarPageCategoryId;
  label: string;
}

/** Ordre d'affichage des catégories dans le panneau « Modules » — Contenus toujours en tête. */
export const SIDEBAR_PAGES_CATEGORIES: SidebarPageCategory[] = [
  { id: 'contenus', label: 'Contenus' },
  { id: 'partages', label: 'Partages' },
  { id: 'demarches', label: 'Démarches & services en ligne' },
  { id: 'annuaires', label: 'Annuaires' },
  { id: 'institution', label: 'Vie institutionnelle' },
  { id: 'economie', label: 'Vie économique & annonces' },
  { id: 'participation', label: 'Participation citoyenne' },
  { id: 'multimedia', label: 'Multimédia' },
  { id: 'outils', label: 'Outils & pages' },
];

export interface SidebarPageEntry {
  id: string;
  label: string;
  icon: IconName;
  category: SidebarPageCategoryId;
  /** Si renseigné, l'entrée est un vrai lien de navigation. Sinon, purement indicative (voir PagesFlyoutPanel). */
  href?: string;
}

/** Catalogue de toutes les pages/modules proposés par Neopse, listés dans le panneau flottant
 * « Modules » de la barre latérale. Trié alphabétiquement au sein de chaque catégorie. */
export const SIDEBAR_PAGES_CATALOG: SidebarPageEntry[] = [
  { id: 'quick-access', label: 'Accès directs', icon: 'LayoutGrid', category: 'outils', href: '/dashboard/acces-directs' },
  { id: 'news', label: 'Actualités', icon: 'Newspaper', category: 'contenus', href: '/dashboard/actualites' },
  { id: 'agenda', label: 'Agenda', icon: 'Calendar', category: 'contenus', href: '/dashboard/agenda' },
  { id: 'alerts', label: 'Alertes', icon: 'AlertTriangle', category: 'participation', href: '/dashboard/alertes' },
  { id: 'jobs', label: "Annonces d'emploi", icon: 'Megaphone', category: 'economie', href: '/dashboard/annonces-emploi' },
  { id: 'carpooling', label: 'Annonces de covoiturage', icon: 'Users', category: 'economie', href: '/dashboard/covoiturage' },
  { id: 'health', label: 'Annuaire de la santé', icon: 'Heart', category: 'annuaires', href: '/dashboard/annuaire-sante' },
  { id: 'associations', label: 'Annuaire des associations', icon: 'Share', category: 'annuaires', href: '/dashboard/annuaire-associations' },
  { id: 'professionals', label: 'Annuaire des professionnels', icon: 'Wrench', category: 'annuaires', href: '/dashboard/annuaire-professionnels' },
  { id: 'tourism', label: 'Annuaire touristique', icon: 'MapPin', category: 'annuaires', href: '/dashboard/annuaire-tourisme' },
  { id: 'contacts', label: 'Contacts', icon: 'IdCard', category: 'institution', href: '/dashboard/contacts' },
  { id: 'steps', label: 'Démarches en ligne', icon: 'FileText', category: 'demarches', href: '/dashboard/demarches-en-ligne' },
  { id: 'editos', label: 'Editos', icon: 'Edit', category: 'contenus', href: '/dashboard/editos' },
  { id: 'press', label: 'Espace presse', icon: 'BookOpen', category: 'multimedia', href: '/dashboard/espace-presse' },
  { id: 'reserved', label: 'Espace Réservé', icon: 'Shield', category: 'institution', href: '/dashboard/espace-reserve' },
  { id: 'flux', label: 'Externalisation des flux', icon: 'Rss', category: 'partages', href: '/dashboard/flux' },
  { id: 'faq', label: 'FAQ', icon: 'Message', category: 'demarches', href: '/dashboard/faq' },
  { id: 'flash', label: 'Flash Infos', icon: 'Zap', category: 'contenus', href: '/dashboard/flash-infos' },
  { id: 'video-gallery', label: 'Galerie de vidéos', icon: 'Play', category: 'multimedia', href: '/dashboard/galerie-videos' },
  { id: 'photo-gallery', label: 'Galeries de photos', icon: 'Photo', category: 'multimedia', href: '/dashboard/galeries-photos' },
  { id: 'steps-guide', label: 'Guide des démarches', icon: 'Globe2', category: 'demarches', href: '/dashboard/guide-demarches' },
  { id: 'twin', label: 'Jumelages', icon: 'Languages', category: 'partages', href: '/dashboard/jumelages' },
  { id: 'labels', label: 'Labels', icon: 'Tag', category: 'partages', href: '/dashboard/labels' },
  { id: 'links', label: 'Liens', icon: 'Link', category: 'partages', href: '/dashboard/liens' },
  { id: 'markets', label: 'Marchés', icon: 'Grid', category: 'economie', href: '/dashboard/marches' },
  { id: 'public-tenders', label: 'Marchés publics', icon: 'Briefcase', category: 'institution', href: '/dashboard/marches-publics' },
  { id: 'module-demo', label: 'Module pas activé', icon: 'Question', category: 'outils', href: '/dashboard/module-non-active' },
  { id: 'newsletters', label: 'Newsletters', icon: 'Mail', category: 'partages', href: '/dashboard/newsletters' },
  { id: 'push', label: 'Notifications push', icon: 'Smartphone', category: 'participation', href: '/dashboard/notifications-push' },
  { id: 'free-pages', label: 'Pages libres', icon: 'Layout', category: 'outils', href: '/dashboard/pages-libres' },
  { id: 'online-payment', label: 'Paiement en ligne', icon: 'CreditCard', category: 'demarches', href: '/dashboard/paiement-en-ligne' },
  { id: 'classified-ads', label: 'Petites annonces', icon: 'Ticket', category: 'economie', href: '/dashboard/petites-annonces' },
  { id: 'plan-access', label: 'Plan/Accès', icon: 'MapPin', category: 'institution', href: '/dashboard/plan-acces' },
  { id: 'publication', label: 'Publication', icon: 'Layers', category: 'contenus', href: '/dashboard/publication' },
  { id: 'acts', label: 'Publication des actes', icon: 'FileText', category: 'institution', href: '/dashboard/publication-des-actes' },
  { id: 'qa', label: 'Questions/réponses', icon: 'LifeBuoy', category: 'demarches', href: '/dashboard/questions-reponses' },
  { id: 'social', label: 'Réseaux sociaux', icon: 'AtSign', category: 'partages', href: '/dashboard/reseaux-sociaux' },
  { id: 'sve', label: 'Saisine par voie électronique', icon: 'FileText', category: 'demarches', href: '/dashboard/saisine-voie-electronique' },
  { id: 'polls', label: 'Sondages', icon: 'Vote', category: 'participation', href: '/dashboard/sondages' },
  { id: 'trombinoscope', label: 'Trombinoscope', icon: 'Users', category: 'annuaires', href: '/dashboard/trombinoscope' },
  { id: 'unes', label: 'Unes', icon: 'Sparkles', category: 'contenus', href: '/dashboard/unes' },
  { id: 'widgets', label: 'Widgets personnalisés', icon: 'Sliders', category: 'outils', href: '/dashboard/widgets' },
];
