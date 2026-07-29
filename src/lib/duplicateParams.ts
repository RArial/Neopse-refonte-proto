/** Lit le paramètre `copyName` de l'URL courante (posé par les boutons « Dupliquer » des listes),
 * qui porte le nom du nouvel élément à créer (« <nom d'origine> (copie) »).
 *
 * Volontairement lu de façon synchrone via `window.location` plutôt que `useSearchParams` : cet
 * appel n'a de sens que dans l'initialiseur paresseux d'un `useState`, sur les pages de création
 * atteintes par une navigation cliente (bouton Dupliquer) — le rendu s'y fait entièrement côté
 * client, donc `window` y est déjà disponible sans risque de désynchronisation avec le HTML serveur.
 */
export function readCopyNameParam(): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('copyName');
}

/** Variante pour les modules sans champ « nom » simple (ex. covoiturage, dont le titre est composé
 * de deux villes) : ne porte qu'un indicateur booléen « cet élément vient d'une duplication ». */
export function readDuplicateFlag(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('duplicate') === '1';
}
