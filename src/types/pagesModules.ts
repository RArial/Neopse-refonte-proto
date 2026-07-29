import type { Attachment } from '@/components/pages-modules/AttachmentsField';
import type { ArchivableItem, ArchivableStatus } from '@/components/pages-modules/ArchivableListPage';
import type { SimpleContentItem } from '@/components/pages-modules/ContentListPage';
import type { DiaporamaImage, DiaporamaType } from '@/components/pages-modules/DiaporamaField';
import type { IconName } from '@/components/ui/Icons';

/** Catégorie nommée, gérée via `CategoriesDialog` — réutilisée par tout module proposant un
 * classement par catégorie (trombinoscope, publication des actes…). */
export interface Category {
  id: string;
  name: string;
}

// ─────────────────────────────────────────────────────────────
// Annonces d'emploi
// ─────────────────────────────────────────────────────────────

export const JOB_LISTINGS: ArchivableItem[] = [
  { id: 'job-1', name: 'Agent technique polyvalent', status: 'published' },
  { id: 'job-2', name: 'Animateur périscolaire', status: 'published' },
  { id: 'job-3', name: 'Chargé de communication', status: 'draft' },
  { id: 'job-4', name: 'Agent d’entretien des espaces verts', status: 'archived' },
];

export interface JobListingFormData {
  name: string;
  sector: string;
  contractType: string;
  description: string;
  thumbnailUrl: string | null;
  city: string;
  address: string;
  showMap: boolean;
  advertiserName: string;
  contactName: string;
  contactEmail: string;
  phoneCountry: string;
  phoneNumber: string;
  website: string;
  attachments: Attachment[];
  status: ArchivableStatus;
}

export const DEFAULT_JOB_FORM: JobListingFormData = {
  name: '',
  sector: '',
  contractType: '',
  description: '',
  thumbnailUrl: null,
  city: '',
  address: '',
  showMap: false,
  advertiserName: '',
  contactName: '',
  contactEmail: '',
  phoneCountry: 'FR',
  phoneNumber: '',
  website: '',
  attachments: [],
  status: 'draft',
};

export const JOB_SECTORS = ['Administration', 'Animation', 'Espaces verts', 'Petite enfance', 'Technique', 'Autre'];
export const JOB_CONTRACT_TYPES = ['CDI', 'CDD', 'Contractuel', 'Stage', 'Apprentissage', 'Vacation'];

// ─────────────────────────────────────────────────────────────
// Annuaires (santé, professionnels, tourisme) — structure partagée
// ─────────────────────────────────────────────────────────────

export const HEALTH_DIRECTORY_MOCK: ArchivableItem[] = [
  { id: 'health-1', name: 'Cabinet médical du centre-ville', status: 'published' },
  { id: 'health-2', name: 'Pharmacie de la Mairie', status: 'published' },
  { id: 'health-3', name: 'Cabinet de kinésithérapie', status: 'draft' },
  { id: 'health-4', name: 'Ancien cabinet dentaire', status: 'archived' },
];

export const PROFESSIONALS_DIRECTORY_MOCK: ArchivableItem[] = [
  { id: 'pro-1', name: 'Boulangerie Au Bon Pain', status: 'published' },
  { id: 'pro-2', name: 'Garage Dupont Automobiles', status: 'draft' },
  { id: 'pro-3', name: 'Ancien salon de coiffure', status: 'archived' },
];

export const TOURISM_DIRECTORY_MOCK: ArchivableItem[] = [
  { id: 'tourism-1', name: 'Château de la Verrière', status: 'published' },
  { id: 'tourism-2', name: 'Office de tourisme intercommunal', status: 'published' },
  { id: 'tourism-3', name: 'Sentier des vignes', status: 'draft' },
  { id: 'tourism-4', name: 'Ancien gîte municipal', status: 'archived' },
];

export interface DirectoryFormData {
  name: string;
  managerName: string;
  activity: string;
  category: string;
  description: string;
  thumbnailUrl: string | null;
  city: string;
  address: string;
  showMap: boolean;
  phone1Country: string;
  phone1: string;
  phone2Country: string;
  phone2: string;
  phone3Country: string;
  phone3: string;
  contactEmail: string;
  website: string;
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  diaporamaType: DiaporamaType;
  images: DiaporamaImage[];
  status: ArchivableStatus;
}

export const DEFAULT_DIRECTORY_FORM: DirectoryFormData = {
  name: '',
  managerName: '',
  activity: '',
  category: '',
  description: '',
  thumbnailUrl: null,
  city: '',
  address: '',
  showMap: false,
  phone1Country: 'FR',
  phone1: '',
  phone2Country: 'FR',
  phone2: '',
  phone3Country: 'FR',
  phone3: '',
  contactEmail: '',
  website: '',
  facebook: '',
  instagram: '',
  twitter: '',
  youtube: '',
  diaporamaType: 'aucune',
  images: [],
  status: 'draft',
};

export const DEFAULT_DIRECTORY_CATEGORIES = ['Généraliste', 'Spécialiste', 'Artisan', 'Commerce', 'Service'];

// ─────────────────────────────────────────────────────────────
// Annuaire des associations
// ─────────────────────────────────────────────────────────────

export const ASSOCIATIONS_MOCK: ArchivableItem[] = [
  { id: 'asso-1', name: 'Amicale des sapeurs-pompiers', status: 'published' },
  { id: 'asso-2', name: 'Club de football municipal', status: 'published' },
  { id: 'asso-3', name: 'Atelier théâtre associatif', status: 'draft' },
  { id: 'asso-4', name: 'Ancien club de pétanque', status: 'archived' },
];

export interface AssociationFormData {
  name: string;
  purpose: string;
  category: string;
  description: string;
  thumbnailUrl: string | null;
  city: string;
  address: string;
  presidentName: string;
  status: ArchivableStatus;
}

export const DEFAULT_ASSOCIATION_FORM: AssociationFormData = {
  name: '',
  purpose: '',
  category: '',
  description: '',
  thumbnailUrl: null,
  city: '',
  address: '',
  presidentName: '',
  status: 'draft',
};

export const ASSOCIATION_CATEGORIES = ['Sport', 'Culture', 'Solidarité', 'Loisirs', 'Environnement'];

// ─────────────────────────────────────────────────────────────
// Accès directs
// ─────────────────────────────────────────────────────────────

export type ShortcutLinkType = 'internal' | 'external';

export interface Shortcut {
  id: string;
  name: string;
  status: ArchivableStatus;
  linkType: ShortcutLinkType | '';
  externalUrl: string;
  internalTargetId: string;
  icon: IconName | '';
  color: string;
}

export const SHORTCUTS_MOCK: Shortcut[] = [
  {
    id: 'shortcut-1',
    name: 'Payer ma cantine',
    status: 'published',
    linkType: 'external',
    externalUrl: 'https://paiement.exemple.fr/cantine',
    internalTargetId: '',
    icon: 'CreditCard',
    color: '',
  },
  {
    id: 'shortcut-2',
    name: 'Signaler un problème sur la voirie',
    status: 'published',
    linkType: 'external',
    externalUrl: 'https://signalement.exemple.fr',
    internalTargetId: '',
    icon: 'AlertTriangle',
    color: '',
  },
];

export type ShortcutFormData = Omit<Shortcut, 'id'>;

export const DEFAULT_SHORTCUT_FORM: ShortcutFormData = {
  name: '',
  status: 'draft',
  linkType: '',
  externalUrl: '',
  internalTargetId: '',
  icon: '',
  color: '',
};

// ─────────────────────────────────────────────────────────────
// Contacts
// ─────────────────────────────────────────────────────────────

export const CONTACTS_MOCK: SimpleContentItem[] = [
  { id: 'contact-1', name: 'Service état civil', active: true, email: 'etat-civil@mairie.example.com' },
  { id: 'contact-2', name: 'Police municipale', active: true, email: 'police-municipale@mairie.example.com' },
];

export interface ContactFormData {
  name: string;
  email: string;
}

export const DEFAULT_CONTACT_FORM: ContactFormData = {
  name: '',
  email: '',
};

export interface ContactPageSettings {
  siteName: string;
  managerName: string;
  cityPostalCode: string;
  address: string;
  phone1Country: string;
  phone1: string;
  phone2Country: string;
  phone2: string;
  phone3Country: string;
  phone3: string;
  formRecipientContactIds: string[];
  formId: string;
  submitButtonLabel: string;
  pageTitle: string;
  pageText: string;
  footerTitle: string;
  footerText: string;
  htmlCode: string;
}

export const DEFAULT_CONTACT_PAGE_SETTINGS: ContactPageSettings = {
  siteName: '',
  managerName: '',
  cityPostalCode: '',
  address: '',
  phone1Country: 'FR',
  phone1: '',
  phone2Country: 'FR',
  phone2: '',
  phone3Country: 'FR',
  phone3: '',
  formRecipientContactIds: [],
  formId: '',
  submitButtonLabel: 'Envoyer',
  pageTitle: 'Contactez-nous',
  pageText: '',
  footerTitle: '',
  footerText: '',
  htmlCode: '',
};

// ─────────────────────────────────────────────────────────────
// Démarches en ligne
// ─────────────────────────────────────────────────────────────

export const STEPS_MOCK: SimpleContentItem[] = [
  { id: 'step-1', name: 'Demande de carte d’identité', active: true },
  { id: 'step-2', name: 'Inscription scolaire', active: false },
];

export const STEP_CATEGORIES = ['État civil', 'Urbanisme', 'Social', 'Scolaire', 'Autre'];

export interface StepFormData {
  name: string;
  category: string;
  description: string;
  formUrl: string;
  active: boolean;
}

export const DEFAULT_STEP_FORM: StepFormData = {
  name: '',
  category: '',
  description: '',
  formUrl: '',
  active: false,
};

// ─────────────────────────────────────────────────────────────
// Espace presse
// ─────────────────────────────────────────────────────────────

export const PRESS_RELEASES_MOCK: SimpleContentItem[] = [
  { id: 'press-1', name: 'Inauguration de la nouvelle médiathèque', active: true },
];

export interface PressReleaseFormData {
  name: string;
  summary: string;
  thumbnailUrl: string | null;
  publicationDate: string;
  active: boolean;
}

export const DEFAULT_PRESS_RELEASE_FORM: PressReleaseFormData = {
  name: '',
  summary: '',
  thumbnailUrl: null,
  publicationDate: '',
  active: false,
};

// ─────────────────────────────────────────────────────────────
// Externalisation des flux
// ─────────────────────────────────────────────────────────────

export const FEEDS_MOCK: SimpleContentItem[] = [
  { id: 'feed-1', name: 'Flux actualités — partenaire intercommunalité', active: true },
];

export const FEED_CONTENT_TYPES = ['Actualités', 'Agenda', "Annonces d'emploi", 'Alertes'];
export const FEED_FORMATS = ['RSS', 'JSON', 'iCal'];

export interface FeedFormData {
  name: string;
  destinationUrl: string;
  contentType: string;
  format: string;
  active: boolean;
}

export const DEFAULT_FEED_FORM: FeedFormData = {
  name: '',
  destinationUrl: '',
  contentType: '',
  format: '',
  active: false,
};

// ─────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────

export const FAQ_MOCK: SimpleContentItem[] = [
  { id: 'faq-1', name: 'Comment obtenir un acte de naissance ?', active: true },
  { id: 'faq-2', name: 'Quels sont les horaires de la mairie ?', active: true },
];

export const FAQ_CATEGORIES = ['État civil', 'Urbanisme', 'Scolaire', 'Environnement', 'Autre'];

export interface FaqFormData {
  name: string;
  category: string;
  answer: string;
  active: boolean;
}

export const DEFAULT_FAQ_FORM: FaqFormData = {
  name: '',
  category: '',
  answer: '',
  active: false,
};

// ─────────────────────────────────────────────────────────────
// Jumelages
// ─────────────────────────────────────────────────────────────

export const TWIN_TOWNS_MOCK: SimpleContentItem[] = [
  { id: 'twin-1', name: 'Bergheim (Allemagne)', active: true },
];

export interface TwinTownFormData {
  name: string;
  country: string;
  twinningDate: string;
  description: string;
  thumbnailUrl: string | null;
  active: boolean;
}

export const DEFAULT_TWIN_TOWN_FORM: TwinTownFormData = {
  name: '',
  country: '',
  twinningDate: '',
  description: '',
  thumbnailUrl: null,
  active: false,
};

// ─────────────────────────────────────────────────────────────
// Labels
// ─────────────────────────────────────────────────────────────

export const LABELS_MOCK: SimpleContentItem[] = [
  { id: 'label-1', name: 'Ville fleurie — 3 fleurs', active: true },
];

export interface LabelFormData {
  name: string;
  issuer: string;
  description: string;
  thumbnailUrl: string | null;
  active: boolean;
}

export const DEFAULT_LABEL_FORM: LabelFormData = {
  name: '',
  issuer: '',
  description: '',
  thumbnailUrl: null,
  active: false,
};

// ─────────────────────────────────────────────────────────────
// Liens
// ─────────────────────────────────────────────────────────────

export const LINKS_MOCK: SimpleContentItem[] = [
  { id: 'link-1', name: 'Préfecture', active: true },
  { id: 'link-2', name: 'Communauté de communes', active: true },
];

export const LINK_CATEGORIES = ['Administration', 'Partenaires', 'Loisirs', 'Autre'];

export interface LinkFormData {
  name: string;
  url: string;
  category: string;
  description: string;
  active: boolean;
}

export const DEFAULT_LINK_FORM: LinkFormData = {
  name: '',
  url: '',
  category: '',
  description: '',
  active: false,
};

// ─────────────────────────────────────────────────────────────
// Newsletters
// ─────────────────────────────────────────────────────────────

export const NEWSLETTERS_MOCK: SimpleContentItem[] = [
  { id: 'newsletter-1', name: 'La lettre de la Ville — juin 2026', active: true },
];

export interface NewsletterFormData {
  name: string;
  content: string;
  sendDate: string;
  active: boolean;
}

export const DEFAULT_NEWSLETTER_FORM: NewsletterFormData = {
  name: '',
  content: '',
  sendDate: '',
  active: false,
};

// ─────────────────────────────────────────────────────────────
// Notifications push
// ─────────────────────────────────────────────────────────────

export const PUSH_NOTIFICATIONS_MOCK: SimpleContentItem[] = [
  { id: 'push-1', name: 'Alerte météo : vigilance orange orages', active: true },
];

export interface PushNotificationFormData {
  name: string;
  message: string;
  link: string;
  sendDate: string;
  active: boolean;
}

export const DEFAULT_PUSH_NOTIFICATION_FORM: PushNotificationFormData = {
  name: '',
  message: '',
  link: '',
  sendDate: '',
  active: false,
};

// ─────────────────────────────────────────────────────────────
// Pages libres
// ─────────────────────────────────────────────────────────────

export const FREE_PAGES_MOCK: SimpleContentItem[] = [
  { id: 'free-page-1', name: 'Histoire de la commune', active: true },
];

export interface FreePageFormData {
  name: string;
  slug: string;
  content: string;
  active: boolean;
}

export const DEFAULT_FREE_PAGE_FORM: FreePageFormData = {
  name: '',
  slug: '',
  content: '',
  active: false,
};

// ─────────────────────────────────────────────────────────────
// Réseaux sociaux
// ─────────────────────────────────────────────────────────────

export const SOCIAL_ACCOUNTS_MOCK: SimpleContentItem[] = [
  { id: 'social-1', name: 'Facebook — Ville officielle', active: true },
];

export const SOCIAL_NETWORKS = ['Facebook', 'Instagram', 'X', 'LinkedIn', 'YouTube', 'TikTok'];

export interface SocialAccountFormData {
  name: string;
  network: string;
  url: string;
  active: boolean;
}

export const DEFAULT_SOCIAL_ACCOUNT_FORM: SocialAccountFormData = {
  name: '',
  network: '',
  url: '',
  active: false,
};

// ─────────────────────────────────────────────────────────────
// Sondages
// ─────────────────────────────────────────────────────────────

export const POLLS_MOCK: SimpleContentItem[] = [
  { id: 'poll-1', name: 'Quel nom pour le nouveau parc ?', active: true },
];

export interface PollFormData {
  name: string;
  options: string;
  endDate: string;
  active: boolean;
}

export const DEFAULT_POLL_FORM: PollFormData = {
  name: '',
  options: '',
  endDate: '',
  active: false,
};

// ─────────────────────────────────────────────────────────────
// Widgets personnalisés
// ─────────────────────────────────────────────────────────────

export const WIDGETS_MOCK: SimpleContentItem[] = [
  { id: 'widget-1', name: 'Météo — page d’accueil', active: true },
];

export const WIDGET_TYPES = ['Météo', "Horaires d'ouverture", 'Réseaux sociaux', 'Bloc HTML personnalisé'];

export interface WidgetFormData {
  name: string;
  type: string;
  content: string;
  active: boolean;
}

export const DEFAULT_WIDGET_FORM: WidgetFormData = {
  name: '',
  type: '',
  content: '',
  active: false,
};
