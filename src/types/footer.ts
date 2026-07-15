export interface FooterLink {
  id: string;
  label: string;
  url: string;
}

export type SocialNetwork = 'facebook' | 'instagram' | 'twitter' | 'youtube' | 'linkedin';

export const SOCIAL_NETWORK_LABELS: Record<SocialNetwork, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  twitter: 'X (Twitter)',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
};

export const SOCIAL_NETWORKS: SocialNetwork[] = ['facebook', 'instagram', 'twitter', 'youtube', 'linkedin'];

export interface SocialLink {
  id: string;
  network: SocialNetwork;
  url: string;
}

export interface FooterContent {
  title: string;
  text: string;
  links: FooterLink[];
  socialLinks: SocialLink[];
}

export function createFooterId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export const DEFAULT_FOOTER_CONTENT: FooterContent = {
  title: 'Mairie de Neopse',
  text: "Toute l'actualité de votre commune, vos démarches en ligne et les services de proximité.",
  links: [
    { id: 'footer-link-mentions', label: 'Mentions légales', url: '/mentions-legales' },
    { id: 'footer-link-accessibilite', label: 'Accessibilité', url: '/accessibilite' },
  ],
  socialLinks: [{ id: 'footer-social-facebook', network: 'facebook', url: 'https://facebook.com/mairie-neopse' }],
};
