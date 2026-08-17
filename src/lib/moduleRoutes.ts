/** Chemin de la page de gestion de contenu associée à chaque module, selon son `catalogModuleId`.
 * Alimente le clic sur « Contenu » dans la structure de navigation : chaque module de la structure
 * (fourni par défaut, ou ajouté depuis le catalogue) doit ouvrir sa propre page de gestion. */
const MODULE_CONTENT_ROUTES: Record<string, string> = {
  // Modules fournis par défaut dans la structure (SEED_MODULES).
  actualites: '/dashboard/actualites',
  agenda: '/dashboard/agenda',
  'flash-infos': '/dashboard/flash-infos',
  covoiturage: '/dashboard/covoiturage',
  contacts: '/dashboard/contacts',
  // Modules du catalogue, ajoutables par l'utilisateur (CATALOG_MODULES).
  jobs: '/dashboard/annonces-emploi',
  health: '/dashboard/annuaire-sante',
  associations: '/dashboard/annuaire-associations',
  professionals: '/dashboard/annuaire-professionnels',
  tourism: '/dashboard/annuaire-tourisme',
  editos: '/dashboard/editos',
  press: '/dashboard/espace-presse',
  faq: '/dashboard/faq',
  newsletters: '/dashboard/newsletters',
  // Modules « à découvrir », débloqués depuis le catalogue (DISCOVER_MODULES).
  polls: '/dashboard/sondages',
  'online-steps': '/dashboard/demarches-en-ligne',
  galleries: '/dashboard/galeries-photos',
  social: '/dashboard/reseaux-sociaux',
};

/** Page de gestion de contenu d'un module : sa page dédiée si elle existe, sinon sa fiche d'infos —
 * pour qu'un module ajouté sans route dédiée (module futur, non encore cablé ci-dessus) reste cliquable. */
export function getModuleContentRoute(catalogModuleId: string, moduleId: string): string {
  return MODULE_CONTENT_ROUTES[catalogModuleId] ?? `/dashboard/contenu/module/edit/${moduleId}`;
}
