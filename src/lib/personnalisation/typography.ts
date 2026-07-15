export interface TypographyPairing {
  id: string;
  name: string;
  description: string;
  heading: string;
  body: string;
}

const SANS = 'var(--font-inter), system-ui, sans-serif';
const SERIF = 'Georgia, "Times New Roman", serif';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';

export const TYPOGRAPHY_PAIRINGS: TypographyPairing[] = [
  { id: 'sans-moderne', name: 'Sans moderne', description: 'Inter en titres et en texte courant.', heading: SANS, body: SANS },
  { id: 'serif-institutionnel', name: 'Serif institutionnel', description: 'Titres serif, texte courant en Inter.', heading: SERIF, body: SANS },
  { id: 'mono-technique', name: 'Mono technique', description: 'Titres en monospace, texte courant en Inter.', heading: MONO, body: SANS },
];

export function getTypographyPairing(id: string): TypographyPairing {
  return TYPOGRAPHY_PAIRINGS.find((p) => p.id === id) ?? TYPOGRAPHY_PAIRINGS[0];
}
