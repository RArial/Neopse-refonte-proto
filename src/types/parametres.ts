export type TraductionMode = 'all' | 'specific';

export type DomainStatus = 'actif' | 'en_attente' | 'expire';

export type DomainPriority = 'principal' | 'redirection';

export interface DomainRecord {
  id: string;
  address: string;
  registrar: string;
  expiresAt: string;
  status: DomainStatus;
  priority: DomainPriority;
}

export interface SiteSettings {
  // Ouverture au public
  publicOpen: boolean;
  closedMessage: string;
  accessPassword: string;

  // Informations du site
  siteTitle: string;
  searchEngineSubtitle: string;
  metaDescription: string;
  metaKeywords: string;
  notFoundPage: string;

  // Icône du site
  faviconUrl: string | null;

  // Suivi de fréquentation
  googleAnalyticsId: string;
  googleSearchConsoleCode: string;

  // Autres types d'affiliation
  headerScript: string;
  footerScript: string;

  // Options de langue
  defaultLanguage: string;
  multilingual: boolean;
  traductionMode: TraductionMode;
  specificLanguages: string[];

  // Nom de domaine
  domains: DomainRecord[];
}

export const LANGUAGE_OPTIONS: { code: string; label: string }[] = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'Anglais' },
  { code: 'de', label: 'Allemand' },
  { code: 'es', label: 'Espagnol' },
  { code: 'it', label: 'Italien' },
  { code: 'nl', label: 'Néerlandais' },
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  publicOpen: true,
  closedMessage: 'Ce site est actuellement en maintenance. Merci de votre compréhension, nous serons bientôt de retour.',
  accessPassword: '',

  siteTitle: 'Mairie de Neopse',
  searchEngineSubtitle: 'Site officiel de la commune',
  metaDescription: '',
  metaKeywords: '',
  notFoundPage: '',

  faviconUrl: null,

  googleAnalyticsId: '',
  googleSearchConsoleCode: '',

  headerScript: '',
  footerScript: '',

  defaultLanguage: 'fr',
  multilingual: false,
  traductionMode: 'all',
  specificLanguages: [],

  domains: [
    {
      id: 'dom-1',
      address: 'www.mairie-neopse.fr',
      registrar: 'OVH',
      expiresAt: '2027-03-12',
      status: 'actif',
      priority: 'principal',
    },
  ],
};
