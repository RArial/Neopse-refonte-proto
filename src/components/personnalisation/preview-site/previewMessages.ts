/** Protocole postMessage entre l'éditeur (PreviewPane) et l'aperçu embarqué (iframe). */

export const PREVIEW_READY_MESSAGE = 'neopse-preview:ready';
export const PREVIEW_TOKENS_MESSAGE = 'neopse-preview:tokens';

/** Clic sur le bouton œil : scroll doux + surbrillance persistante ~3s. Le gabarit cible a déjà été
 * appliqué côté éditeur avant l'envoi de ce message (voir PreviewPane / PersonnalisationProvider).
 * C'est le seul déclencheur de surbrillance : le survol seul n'en produit jamais. */
export const PREVIEW_REVEAL_MESSAGE = 'neopse-preview:reveal';
