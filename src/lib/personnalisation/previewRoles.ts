import { PAGE_GABARITS, type ModuleKey, type PageGabaritId, type SectionKey } from '@/types/personnalisation';

/** Identifiant compact d'un rôle de couleur, tel que porté par l'attribut `data-role` dans
 * l'aperçu embarqué : `${owner}:${propertyKey}`. Un même propertyKey existe à la fois au niveau
 * `général` et au niveau d'un module (ex. `bodyBg`) — qualifier par `owner` évite toute collision. */
export function roleId(owner: SectionKey | ModuleKey, propertyKey: string): string {
  return `${owner}:${propertyKey}`;
}

/** Gabarit(s) sur lesquels un rôle de SECTION est réellement rendu dans l'aperçu, dans l'ordre où
 * les vérifier. N'inclut que les rôles ayant un ancrage visuel actuel — les propriétés sans rendu
 * dans le gabarit (ex. menu déroulant, recherche : aucune maquette de menu/recherche dans l'aperçu)
 * sont volontairement absentes : leur survol/aperçu n'a simplement aucun effet visible. */
const SECTION_ROLE_GABARITS: Partial<Record<string, PageGabaritId[]>> = {
  [roleId('general', 'bodyBg')]: ['accueil', 'page-contenu', 'liste', 'fiche-detail'],
  [roleId('general', 'bodyText')]: ['accueil', 'page-contenu', 'liste', 'fiche-detail'],
  [roleId('general', 'linkColor')]: ['page-contenu'],
  [roleId('general', 'buttonBg')]: ['accueil', 'liste', 'fiche-detail'],
  [roleId('header', 'headerBg')]: ['accueil', 'page-contenu', 'liste', 'fiche-detail'],
  [roleId('header', 'navText')]: ['accueil', 'page-contenu', 'liste', 'fiche-detail'],
  [roleId('internalHeader', 'internalHeaderBg')]: ['page-contenu'],
  [roleId('internalHeader', 'internalHeaderTitle')]: ['page-contenu'],
  [roleId('internalHeader', 'internalHeaderText')]: ['page-contenu'],
  [roleId('footer', 'footerBg')]: ['accueil', 'page-contenu', 'liste', 'fiche-detail'],
  [roleId('footer', 'footerTitle')]: ['accueil', 'page-contenu', 'liste', 'fiche-detail'],
  [roleId('footer', 'footerText')]: ['accueil', 'page-contenu', 'liste', 'fiche-detail'],
};

/** Table module → gabarit cible d'aperçu (§4). Facile à étendre : il suffit de changer la valeur
 * d'un module pour le faire pointer vers un gabarit dédié le jour où il en gagnera un. */
const MODULE_REVEAL_GABARIT: Record<ModuleKey, PageGabaritId> = {
  // Les réglages de liste et de fiche ne sont pas (encore) distingués dans les tokens : les deux
  // routent vers « Liste d'actualités ». Le jour où `MODULE_PROPERTIES` distinguera liste/fiche pour
  // ce module, brancher ici sur `propertyKey` pour renvoyer 'fiche-detail' quand pertinent.
  news: 'liste',
  events: 'accueil',
  directory: 'accueil',
  forms: 'accueil',
  // Pas de carte « services » dédiée sur l'accueil pour ce module : on retombe sur une page de contenu.
  media: 'page-contenu',
};

export function isModuleKey(owner: string): owner is ModuleKey {
  return owner in MODULE_REVEAL_GABARIT;
}

export interface RevealTarget {
  pageId: PageGabaritId;
  /** false si le rôle n'a aucun ancrage visuel connu dans l'aperçu actuel (le survol/aperçu n'aura
   * simplement aucun effet visible, sans erreur). */
  hasKnownAnchor: boolean;
}

/** Détermine sur quel gabarit révéler un rôle, en préférant rester sur le gabarit courant quand le
 * rôle y est présent (règle « pas de changement de page si le rôle est déjà visible ici »). */
export function resolveRevealTarget(
  owner: SectionKey | ModuleKey,
  propertyKey: string,
  currentPageId: PageGabaritId,
): RevealTarget {
  if (isModuleKey(owner)) {
    const pageId = MODULE_REVEAL_GABARIT[owner];
    return { pageId, hasKnownAnchor: true };
  }

  const gabarits = SECTION_ROLE_GABARITS[roleId(owner, propertyKey)];
  if (!gabarits || gabarits.length === 0) {
    return { pageId: currentPageId, hasKnownAnchor: false };
  }
  if (gabarits.includes(currentPageId)) {
    return { pageId: currentPageId, hasKnownAnchor: true };
  }
  return { pageId: gabarits[0], hasKnownAnchor: true };
}

export function gabaritLabel(pageId: PageGabaritId): string {
  return PAGE_GABARITS.find((g) => g.id === pageId)?.label ?? pageId;
}
