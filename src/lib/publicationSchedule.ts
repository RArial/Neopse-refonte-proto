/**
 * Un élément marqué « publié » dont la date de publication n'est pas encore atteinte doit être
 * traité comme « programmé » plutôt que réellement publié — utilisé par les listes à onglets
 * Publiés / Programmés / Brouillons / Archivés pour classer chaque ligne dans le bon onglet.
 */
export function isScheduledPublication(status: string, publicationDate: string): boolean {
  if (status !== 'published' || !publicationDate) return false;
  return new Date(`${publicationDate}T00:00:00`) > new Date();
}
