import type { IconName } from '@/components/ui/Icons';

export interface SidebarPageEntry {
  id: string;
  label: string;
  icon: IconName;
  /** Si renseigné, l'entrée est un vrai lien de navigation. Sinon, purement indicative (voir PagesFlyoutPanel). */
  href?: string;
}

/** Catalogue de toutes les pages/modules proposés par Neopse, listés dans le panneau flottant
 * « Modules » de la barre latérale. Trié alphabétiquement, comme dans le panneau de référence. */
export const SIDEBAR_PAGES_CATALOG: SidebarPageEntry[] = [
  { id: 'quick-access', label: 'Accès directs', icon: 'LayoutGrid', href: '/dashboard/acces-directs' },
  { id: 'news', label: 'Actualités', icon: 'Newspaper', href: '/dashboard/actualites' },
  { id: 'agenda', label: 'Agenda', icon: 'Calendar', href: '/dashboard/agenda' },
  { id: 'alerts', label: 'Alertes', icon: 'AlertTriangle', href: '/dashboard/alertes' },
  { id: 'jobs', label: "Annonces d'emploi", icon: 'Megaphone', href: '/dashboard/annonces-emploi' },
  { id: 'carpooling', label: 'Annonces de covoiturage', icon: 'Users', href: '/dashboard/covoiturage' },
  { id: 'health', label: 'Annuaire de la santé', icon: 'Heart', href: '/dashboard/annuaire-sante' },
  { id: 'associations', label: 'Annuaire des associations', icon: 'Share', href: '/dashboard/annuaire-associations' },
  { id: 'professionals', label: 'Annuaire des professionnels', icon: 'Wrench', href: '/dashboard/annuaire-professionnels' },
  { id: 'tourism', label: 'Annuaire touristique', icon: 'MapPin', href: '/dashboard/annuaire-tourisme' },
  { id: 'contacts', label: 'Contacts', icon: 'IdCard', href: '/dashboard/contacts' },
  { id: 'steps', label: 'Démarches en ligne', icon: 'FileText', href: '/dashboard/demarches-en-ligne' },
  { id: 'editos', label: 'Editos', icon: 'Edit', href: '/dashboard/editos' },
  { id: 'press', label: 'Espace presse', icon: 'BookOpen', href: '/dashboard/espace-presse' },
  { id: 'reserved', label: 'Espace Réservé', icon: 'Shield', href: '/dashboard/espace-reserve' },
  { id: 'flux', label: 'Externalisation des flux', icon: 'Rss', href: '/dashboard/flux' },
  { id: 'faq', label: 'FAQ', icon: 'Message', href: '/dashboard/faq' },
  { id: 'flash', label: 'Flash Infos', icon: 'Zap', href: '/dashboard/flash-infos' },
  { id: 'video-gallery', label: 'Galerie de vidéos', icon: 'Play', href: '/dashboard/galerie-videos' },
  { id: 'photo-gallery', label: 'Galeries de photos', icon: 'Photo', href: '/dashboard/galeries-photos' },
  { id: 'forms-manager', label: 'Gestionnaire de formulaires', icon: 'Form', href: '/dashboard/gestionnaire' },
  { id: 'steps-guide', label: 'Guide des démarches', icon: 'Globe2', href: '/dashboard/guide-demarches' },
  { id: 'twin', label: 'Jumelages', icon: 'Languages', href: '/dashboard/jumelages' },
  { id: 'labels', label: 'Labels', icon: 'Tag', href: '/dashboard/labels' },
  { id: 'links', label: 'Liens', icon: 'Link', href: '/dashboard/liens' },
  { id: 'markets', label: 'Marchés', icon: 'Grid', href: '/dashboard/marches' },
  { id: 'public-tenders', label: 'Marchés publics', icon: 'Briefcase', href: '/dashboard/marches-publics' },
  { id: 'module-demo', label: 'Module pas activé', icon: 'Question', href: '/dashboard/module-non-active' },
  { id: 'newsletters', label: 'Newsletters', icon: 'Mail', href: '/dashboard/newsletters' },
  { id: 'push', label: 'Notifications push', icon: 'Smartphone', href: '/dashboard/notifications-push' },
  { id: 'free-pages', label: 'Pages libres', icon: 'Layout', href: '/dashboard/pages-libres' },
  { id: 'online-payment', label: 'Paiement en ligne', icon: 'CreditCard', href: '/dashboard/paiement-en-ligne' },
  { id: 'classified-ads', label: 'Petites annonces', icon: 'Ticket', href: '/dashboard/petites-annonces' },
  { id: 'plan-access', label: 'Plan/Accès', icon: 'MapPin', href: '/dashboard/plan-acces' },
  { id: 'publication', label: 'Publication', icon: 'Layers', href: '/dashboard/publication' },
  { id: 'acts', label: 'Publication des actes', icon: 'FileText', href: '/dashboard/publication-des-actes' },
  { id: 'qa', label: 'Questions/réponses', icon: 'LifeBuoy', href: '/dashboard/questions-reponses' },
  { id: 'social', label: 'Réseaux sociaux', icon: 'AtSign', href: '/dashboard/reseaux-sociaux' },
  { id: 'sve', label: 'Saisine par voie électronique', icon: 'FileText', href: '/dashboard/saisine-voie-electronique' },
  { id: 'polls', label: 'Sondages', icon: 'Vote', href: '/dashboard/sondages' },
  { id: 'trombinoscope', label: 'Trombinoscope', icon: 'Users', href: '/dashboard/trombinoscope' },
  { id: 'unes', label: 'Unes', icon: 'Sparkles', href: '/dashboard/unes' },
  { id: 'widgets', label: 'Widgets personnalisés', icon: 'Sliders', href: '/dashboard/widgets' },
];
