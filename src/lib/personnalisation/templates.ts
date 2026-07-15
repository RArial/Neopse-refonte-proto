/**
 * Les maquettes ne portent plus aucune couleur : depuis la refonte du panneau Couleurs, la
 * palette et les affectations de rôles sont globales au site (voir colorModel.ts / palettes.ts).
 * Une maquette n'est plus qu'un choix de mise en page — illustré par une vignette réelle
 * (`imageSrc`, servie depuis `public/templates/`) dans l'onglet de sélection des maquettes.
 */
export interface TemplateDefinition {
  id: string;
  name: string;
  imageSrc: string;
  hasFooterBand: boolean;
  hasAccentBadge: boolean;
}

export const TEMPLATES: TemplateDefinition[] = [
  { id: 'template1', name: 'Maquette 1', imageSrc: '/templates/template1-vignette.jpg', hasFooterBand: true, hasAccentBadge: true },
  { id: 'template2', name: 'Maquette 2', imageSrc: '/templates/template2-vignette.jpg', hasFooterBand: true, hasAccentBadge: true },
  { id: 'template3', name: 'Maquette 3', imageSrc: '/templates/template3-vignette.jpg', hasFooterBand: true, hasAccentBadge: true },
  { id: 'template4', name: 'Maquette 4', imageSrc: '/templates/template4-vignette.jpg', hasFooterBand: true, hasAccentBadge: true },
  { id: 'template5', name: 'Maquette 5', imageSrc: '/templates/template5-vignette.jpg', hasFooterBand: true, hasAccentBadge: true },
  { id: 'template6', name: 'Maquette 6', imageSrc: '/templates/template6-vignette.jpg', hasFooterBand: true, hasAccentBadge: true },
  { id: 'template7', name: 'Maquette 7', imageSrc: '/templates/template7-vignette.jpg', hasFooterBand: true, hasAccentBadge: true },
  { id: 'template8', name: 'Maquette 8', imageSrc: '/templates/template8-vignette.jpg', hasFooterBand: true, hasAccentBadge: true },
];

export function getTemplate(id: string): TemplateDefinition {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}
