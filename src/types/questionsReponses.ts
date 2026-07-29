import type { Category } from '@/types/pagesModules';

export type QuestionStatus = 'pending' | 'published' | 'refused';

export const QUESTION_STATUS_LABELS: Record<QuestionStatus, string> = {
  pending: 'En attente de traitement',
  published: 'Publiée',
  refused: 'Refusée',
};

export interface Question {
  id: string;
  subject: string;
  categoryId: string;
  message: string;
  participantName: string;
  participantEmail: string;
  createdAt: string;
  status: QuestionStatus;
  publicAnswer: string;
  responderName: string;
  responderFunction: string;
  refusalReason: string;
}

export type QuestionCategory = Category;

export const QUESTION_CATEGORIES_SEED: QuestionCategory[] = [
  { id: 'cat-urbanisme', name: 'Urbanisme' },
  { id: 'cat-voirie', name: 'Voirie' },
  { id: 'cat-vie-scolaire', name: 'Vie scolaire' },
  { id: 'cat-environnement', name: 'Environnement' },
];

export const QUESTIONS_MOCK: Question[] = [
  {
    id: 'question-eclairage-public',
    subject: "Éclairage public rue des Tilleuls",
    categoryId: 'cat-voirie',
    message:
      "Bonjour, plusieurs lampadaires de la rue des Tilleuls ne fonctionnent plus depuis deux semaines. Est-il prévu une intervention prochainement ?",
    participantName: 'Claire Dubosc',
    participantEmail: 'claire.dubosc@example.com',
    createdAt: '2026-07-18',
    status: 'pending',
    publicAnswer: '',
    responderName: '',
    responderFunction: '',
    refusalReason: '',
  },
  {
    id: 'question-permis-construire',
    subject: 'Délai pour un permis de construire',
    categoryId: 'cat-urbanisme',
    message: 'Quel est le délai moyen d’instruction pour un permis de construire concernant une extension de maison ?',
    participantName: 'Marc Ferreira',
    participantEmail: 'marc.ferreira@example.com',
    createdAt: '2026-07-15',
    status: 'published',
    publicAnswer:
      "Le délai d'instruction pour une extension est en général de 2 mois à compter du dépôt d'un dossier complet.",
    responderName: 'Sophie Renaud',
    responderFunction: "Responsable du service urbanisme",
    refusalReason: '',
  },
  {
    id: 'question-rythmes-scolaires',
    subject: 'Changement des rythmes scolaires',
    categoryId: 'cat-vie-scolaire',
    message: "Pourquoi les horaires de sortie de l'école ont-ils changé cette année sans concertation ?",
    participantName: 'Yasmine Berrada',
    participantEmail: 'yasmine.berrada@example.com',
    createdAt: '2026-07-10',
    status: 'refused',
    publicAnswer: '',
    responderName: '',
    responderFunction: '',
    refusalReason: 'Question déjà traitée dans la FAQ « Vie scolaire », renvoi vers cette page.',
  },
  {
    id: 'question-collecte-dechets-verts',
    subject: 'Collecte des déchets verts',
    categoryId: 'cat-environnement',
    message: 'La collecte des déchets verts reprend-elle au printemps ? Si oui, à quelle fréquence ?',
    participantName: 'Julien Adam',
    participantEmail: 'julien.adam@example.com',
    createdAt: '2026-07-20',
    status: 'pending',
    publicAnswer: '',
    responderName: '',
    responderFunction: '',
    refusalReason: '',
  },
];

export interface QuestionsPageSettings {
  introText: string;
  accessButtonLabel: string;
  participationHelp: string;
  validationMessage: string;
  submitButtonLabel: string;
  closeButtonLabel: string;
  categories: QuestionCategory[];
  termsIntroText: string;
  termsText: string;
  notifiedContactIds: string[];
}

export const DEFAULT_QUESTIONS_PAGE_SETTINGS: QuestionsPageSettings = {
  introText:
    '<p>Vous avez une question sur la vie de votre commune ? Posez-la ici, elle sera étudiée par nos services et pourra être publiée avec sa réponse.</p>',
  accessButtonLabel: 'Poser une question',
  participationHelp:
    "Merci de formuler une question claire et respectueuse. Les questions à caractère personnel, injurieux ou hors sujet ne seront pas publiées.",
  validationMessage: 'Votre question a bien été envoyée. Elle sera étudiée avant publication.',
  submitButtonLabel: 'Envoyer ma question',
  closeButtonLabel: 'Fermer',
  categories: QUESTION_CATEGORIES_SEED,
  termsIntroText: "En envoyant votre question, vous acceptez les conditions d'utilisation suivantes :",
  termsText:
    '<p>Les questions envoyées via ce formulaire peuvent faire l’objet d’une publication, accompagnées de leur réponse, sur le site de la collectivité. Les données personnelles collectées (nom, adresse e-mail) ne sont utilisées que pour le traitement de votre demande et ne sont pas publiées.</p>',
  notifiedContactIds: [],
};
