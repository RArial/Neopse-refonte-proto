export interface ProjectSuggestion {
  id: string;
  title: string;
  subtitle: string | null;
  location: string;
  imageUrl: string | null;
  subscribed: boolean;
}

export const SUGGESTED_LOCATION = '75010 Paris 10ème - France';

export const SUGGESTED_PROJECTS: ProjectSuggestion[] = [
  { id: 'proj-1', title: 'Site de test 112022', subtitle: null, location: '75010 Paris 10ème - France', imageUrl: null, subscribed: false },
  { id: 'proj-2', title: "Mairie d'Asma", subtitle: null, location: '75010 Paris 10ème - France', imageUrl: null, subscribed: false },
  { id: 'proj-3', title: 'Projet pour tester une maquette personnalisée', subtitle: null, location: '75010 Paris 10ème - France', imageUrl: null, subscribed: false },
  { id: 'proj-4', title: "Mairie d'Edmond", subtitle: null, location: '75010 Paris 10ème - France', imageUrl: null, subscribed: true },
  { id: 'proj-5', title: 'Mairie de Leyton', subtitle: null, location: '75010 Paris 10ème - France', imageUrl: null, subscribed: false },
];
