export interface FooterLinkCategory {
  id: string;
  name: string;
}

export interface FooterLink {
  id: string;
  label: string;
  url: string;
  categoryId: string;
}

export type SocialNetwork =
  | 'facebook'
  | 'x'
  | 'instagram'
  | 'tiktok'
  | 'snapchat'
  | 'youtube'
  | 'dailymotion'
  | 'vimeo'
  | 'soundcloud'
  | 'googlePlus'
  | 'pinterest'
  | 'foursquare'
  | 'linkedin'
  | 'flickr'
  | 'googlePhotos'
  | 'deviantart'
  | 'tumblr'
  | 'reddit'
  | 'askfm';

export const SOCIAL_NETWORK_LABELS: Record<SocialNetwork, string> = {
  facebook: 'Facebook',
  x: 'X',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  snapchat: 'Snapchat',
  youtube: 'YouTube',
  dailymotion: 'Dailymotion',
  vimeo: 'Vimeo',
  soundcloud: 'SoundCloud',
  googlePlus: 'Google Plus',
  pinterest: 'Pinterest',
  foursquare: 'Foursquare',
  linkedin: 'LinkedIn',
  flickr: 'Flickr',
  googlePhotos: 'Google Photos',
  deviantart: 'DeviantArt',
  tumblr: 'Tumblr',
  reddit: 'Reddit',
  askfm: 'Ask.fm',
};

export const SOCIAL_NETWORKS: SocialNetwork[] = [
  'facebook',
  'x',
  'instagram',
  'tiktok',
  'snapchat',
  'youtube',
  'dailymotion',
  'vimeo',
  'soundcloud',
  'googlePlus',
  'pinterest',
  'foursquare',
  'linkedin',
  'flickr',
  'googlePhotos',
  'deviantart',
  'tumblr',
  'reddit',
  'askfm',
];

export interface SocialLink {
  id: string;
  network: SocialNetwork;
  url: string;
}

export interface FooterContent {
  title: string;
  text: string;
  linkCategories: FooterLinkCategory[];
  links: FooterLink[];
  socialLinks: SocialLink[];
}

export function createFooterId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export const DEFAULT_FOOTER_CONTENT: FooterContent = {
  title: 'Mairie de Vercourt',
  text: "Toute l'actualité de votre commune, vos démarches en ligne et les services de proximité.",
  linkCategories: [{ id: 'footer-cat-legal', name: 'Informations légales' }],
  links: [
    { id: 'footer-link-mentions', label: 'Mentions légales', url: '/mentions-legales', categoryId: 'footer-cat-legal' },
    { id: 'footer-link-accessibilite', label: 'Accessibilité', url: '/accessibilite', categoryId: 'footer-cat-legal' },
  ],
  socialLinks: [{ id: 'footer-social-facebook', network: 'facebook', url: 'https://facebook.com/mairie-vercourt' }],
};
