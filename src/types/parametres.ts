export type TraductionMode = 'all' | 'specific';

export type DomainStatus = 'actif' | 'en_attente' | 'expire';

export type DomainPriority = 'principal' | 'redirection';

export type DomainSource = 'neopse' | 'externe';

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
  { code: 'af', label: 'Afrikaans' },
  { code: 'sq', label: 'Albanais' },
  { code: 'de', label: 'Allemand' },
  { code: 'am', label: 'Amharique' },
  { code: 'en', label: 'Anglais' },
  { code: 'ar', label: 'Arabe' },
  { code: 'hy', label: 'Arménien' },
  { code: 'az', label: 'Azéri' },
  { code: 'eu', label: 'Basque' },
  { code: 'bn', label: 'Bengali' },
  { code: 'be', label: 'Biélorusse' },
  { code: 'my', label: 'Birman' },
  { code: 'bs', label: 'Bosniaque' },
  { code: 'bg', label: 'Bulgare' },
  { code: 'ca', label: 'Catalan' },
  { code: 'ceb', label: 'Cebuano' },
  { code: 'zh', label: 'Chinois' },
  { code: 'zh-Hant', label: 'Chinois (traditionnel)' },
  { code: 'si', label: 'Cinghalais' },
  { code: 'ko', label: 'Coréen' },
  { code: 'co', label: 'Corse' },
  { code: 'ht', label: 'Créole haïtien' },
  { code: 'hr', label: 'Croate' },
  { code: 'da', label: 'Danois' },
  { code: 'es', label: 'Espagnol' },
  { code: 'eo', label: 'Espéranto' },
  { code: 'et', label: 'Estonien' },
  { code: 'fil', label: 'Filipino' },
  { code: 'fi', label: 'Finnois' },
  { code: 'fr', label: 'Français' },
  { code: 'fy', label: 'Frison occidental' },
  { code: 'gd', label: 'Gaélique écossais' },
  { code: 'gl', label: 'Galicien' },
  { code: 'cy', label: 'Gallois' },
  { code: 'ka', label: 'Géorgien' },
  { code: 'el', label: 'Grec' },
  { code: 'gu', label: 'Gujarati' },
  { code: 'ha', label: 'Haoussa' },
  { code: 'haw', label: 'Hawaïen' },
  { code: 'he', label: 'Hébreu' },
  { code: 'hi', label: 'Hindi' },
  { code: 'hmn', label: 'Hmong' },
  { code: 'hu', label: 'Hongrois' },
  { code: 'ig', label: 'Igbo' },
  { code: 'id', label: 'Indonésien' },
  { code: 'ga', label: 'Irlandais' },
  { code: 'is', label: 'Islandais' },
  { code: 'it', label: 'Italien' },
  { code: 'ja', label: 'Japonais' },
  { code: 'jv', label: 'Javanais' },
  { code: 'kn', label: 'Kannada' },
  { code: 'kk', label: 'Kazakh' },
  { code: 'km', label: 'Khmer' },
  { code: 'ky', label: 'Kirghize' },
  { code: 'ku', label: 'Kurde' },
  { code: 'lo', label: 'Lao' },
  { code: 'la', label: 'Latin' },
  { code: 'lv', label: 'Letton' },
  { code: 'lt', label: 'Lituanien' },
  { code: 'lb', label: 'Luxembourgeois' },
  { code: 'mk', label: 'Macédonien' },
  { code: 'ms', label: 'Malais' },
  { code: 'ml', label: 'Malayalam' },
  { code: 'mg', label: 'Malgache' },
  { code: 'mt', label: 'Maltais' },
  { code: 'mi', label: 'Maori' },
  { code: 'mr', label: 'Marathe' },
  { code: 'mn', label: 'Mongol' },
  { code: 'nl', label: 'Néerlandais' },
  { code: 'ne', label: 'Népalais' },
  { code: 'no', label: 'Norvégien' },
  { code: 'ny', label: 'Nyanja' },
  { code: 'ur', label: 'Ourdou' },
  { code: 'uz', label: 'Ouzbek' },
  { code: 'ps', label: 'Pachto' },
  { code: 'pa', label: 'Pendjabi' },
  { code: 'fa', label: 'Persan' },
  { code: 'pl', label: 'Polonais' },
  { code: 'pt', label: 'Portugais' },
  { code: 'ro', label: 'Roumain' },
  { code: 'ru', label: 'Russe' },
  { code: 'sm', label: 'Samoan' },
  { code: 'sr', label: 'Serbe' },
  { code: 'sn', label: 'Shona' },
  { code: 'sd', label: 'Sindhi' },
  { code: 'sk', label: 'Slovaque' },
  { code: 'sl', label: 'Slovène' },
  { code: 'so', label: 'Somali' },
  { code: 'su', label: 'Soundanais' },
  { code: 'sv', label: 'Suédois' },
  { code: 'sw', label: 'Swahili' },
  { code: 'tg', label: 'Tadjik' },
  { code: 'ta', label: 'Tamoul' },
  { code: 'cs', label: 'Tchèque' },
  { code: 'te', label: 'Télougou' },
  { code: 'th', label: 'Thaï' },
  { code: 'tr', label: 'Turc' },
  { code: 'uk', label: 'Ukrainien' },
  { code: 'vi', label: 'Vietnamien' },
  { code: 'xh', label: 'Xhosa' },
  { code: 'yi', label: 'Yiddish' },
  { code: 'yo', label: 'Yoruba' },
  { code: 'zu', label: 'Zoulou' },
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
      registrar: 'NEOPSE (Intégré)',
      expiresAt: '2027-03-12',
      status: 'actif',
      priority: 'principal',
    },
  ],
};
