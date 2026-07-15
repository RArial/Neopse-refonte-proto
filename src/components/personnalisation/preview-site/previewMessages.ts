/** Protocole postMessage entre l'éditeur (PreviewPane) et l'aperçu embarqué (iframe). */

export const PREVIEW_READY_MESSAGE = 'neopse-preview:ready';
export const PREVIEW_TOKENS_MESSAGE = 'neopse-preview:tokens';

/** Survol d'une ligne de propriété : surbrillance transitoire, sans navigation ni scroll. */
export const PREVIEW_HIGHLIGHT_MESSAGE = 'neopse-preview:highlight';
/** Sortie de survol : efface la surbrillance transitoire (n'affecte jamais une surbrillance
 * persistante déclenchée par `PREVIEW_REVEAL_MESSAGE`). */
export const PREVIEW_CLEAR_HIGHLIGHT_MESSAGE = 'neopse-preview:clear-highlight';
/** Clic sur le bouton œil : scroll doux + surbrillance persistante ~2s. Le gabarit cible a déjà été
 * appliqué côté éditeur avant l'envoi de ce message (voir PreviewPane / PersonnalisationProvider). */
export const PREVIEW_REVEAL_MESSAGE = 'neopse-preview:reveal';
