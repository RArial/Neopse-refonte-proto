/** Données de démo du bloc « Formulaire » (reprises de l'existant Neopse). */
export const NEWS_FORM_OPTIONS = [
  { id: 'form-contact', label: 'Contact' },
  { id: 'form-test', label: 'formulaire test' },
  { id: 'form-test-maj', label: 'TEST' },
  { id: 'form-testtt', label: 'testtt' },
] as const;

export const NEWS_FORM_RECIPIENTS = [
  { email: 'accueil@mairie-vercourt.fr', name: 'Accueil mairie' },
  { email: 'secretariat@mairie-vercourt.fr', name: 'Secrétariat général' },
  { email: 'communication@mairie-vercourt.fr', name: 'Service communication' },
  { email: 'q.garnier@mairie-vercourt.fr', name: 'Quentin Garnier' },
] as const;
