/** Couleurs proposées dans l'éditeur : ce sont des données de contenu (rendues sur le site), pas des tokens d'interface. */
export const TEXT_COLORS = [
  { label: 'Noir', value: '#1f2228' },
  { label: 'Gris', value: '#5f6368' },
  { label: 'Rouge', value: '#b3261e' },
  { label: 'Orange', value: '#b45309' },
  { label: 'Vert', value: '#1e6b3a' },
  { label: 'Bleu canard', value: '#00696b' },
  { label: 'Bleu', value: '#1d4ed8' },
  { label: 'Violet', value: '#6b21a8' },
] as const;

export const BACKGROUND_COLORS = [
  { label: 'Jaune', value: '#fff3b0' },
  { label: 'Vert clair', value: '#d1f2dc' },
  { label: 'Bleu clair', value: '#d6e8ff' },
  { label: 'Rose', value: '#fde2e4' },
  { label: 'Gris clair', value: '#eceff1' },
] as const;

export const FONT_SIZES = ['12px', '14px', '16px', '18px', '24px', '32px'] as const;

export const BLOCK_FORMATS = [
  { label: 'Paragraphe', level: 0 },
  { label: 'Titre 2', level: 2 },
  { label: 'Titre 3', level: 3 },
  { label: 'Titre 4', level: 4 },
] as const;
