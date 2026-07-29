import type { Category } from '@/types/pagesModules';

export type SaisineStatus = 'nouvelle' | 'en-cours' | 'traitee' | 'refusee';

export const SAISINE_STATUS_LABELS: Record<SaisineStatus, string> = {
  nouvelle: 'Nouvelle demande',
  'en-cours': 'En cours de traitement',
  traitee: 'Traitée',
  refusee: 'Refusée',
};

export type SaisineCategory = Category;

export const SAISINE_CATEGORIES_SEED: SaisineCategory[] = [
  { id: 'cat-etat-civil', name: 'État civil' },
  { id: 'cat-urbanisme', name: 'Urbanisme' },
  { id: 'cat-scolaire', name: 'Affaires scolaires' },
  { id: 'cat-social', name: 'Action sociale' },
];

export interface Saisine {
  id: string;
  subject: string;
  categoryId: string;
  message: string;
  requesterName: string;
  requesterEmail: string;
  aeeDate: string;
  lastActionDate: string;
  status: SaisineStatus;
  responseText: string;
  responderName: string;
  responderFunction: string;
  refusalReason: string;
}

export const SAISINES_MOCK: Saisine[] = [
  {
    id: 'saisine-copie-acte-naissance',
    subject: "Demande de copie intégrale d'acte de naissance",
    categoryId: 'cat-etat-civil',
    message: "Je souhaite obtenir une copie intégrale de mon acte de naissance pour constituer un dossier de mariage.",
    requesterName: 'Nadia Cherif',
    requesterEmail: 'nadia.cherif@example.com',
    aeeDate: '2026-07-19',
    lastActionDate: '2026-07-19',
    status: 'nouvelle',
    responseText: '',
    responderName: '',
    responderFunction: '',
    refusalReason: '',
  },
  {
    id: 'saisine-certificat-urbanisme',
    subject: "Demande de certificat d'urbanisme",
    categoryId: 'cat-urbanisme',
    message: 'Pouvez-vous m’indiquer la procédure pour obtenir un certificat d’urbanisme opérationnel sur ma parcelle ?',
    requesterName: 'Thomas Lenoir',
    requesterEmail: 'thomas.lenoir@example.com',
    aeeDate: '2026-07-16',
    lastActionDate: '2026-07-18',
    status: 'en-cours',
    responseText: '',
    responderName: '',
    responderFunction: '',
    refusalReason: '',
  },
  {
    id: 'saisine-inscription-cantine',
    subject: 'Inscription à la cantine scolaire',
    categoryId: 'cat-scolaire',
    message: "Je souhaite inscrire mon fils à la cantine scolaire pour la rentrée de septembre.",
    requesterName: 'Amélie Rousseau',
    requesterEmail: 'amelie.rousseau@example.com',
    aeeDate: '2026-07-10',
    lastActionDate: '2026-07-14',
    status: 'traitee',
    responseText: "Votre demande d'inscription a bien été enregistrée. Le dossier complet vous a été envoyé par e-mail.",
    responderName: 'Karim Belkacem',
    responderFunction: 'Responsable des affaires scolaires',
    refusalReason: '',
  },
  {
    id: 'saisine-aide-sociale',
    subject: "Demande d'aide sociale exceptionnelle",
    categoryId: 'cat-social',
    message: 'Je rencontre des difficultés financières temporaires et souhaite savoir si une aide exceptionnelle est possible.',
    requesterName: 'Bruno Faure',
    requesterEmail: 'bruno.faure@example.com',
    aeeDate: '2026-07-05',
    lastActionDate: '2026-07-12',
    status: 'refusee',
    responseText: '',
    responderName: '',
    responderFunction: '',
    refusalReason: 'Dossier incomplet : justificatifs de ressources manquants. Le demandeur a été invité à déposer une nouvelle saisine.',
  },
];

export interface SaisinePageFormData {
  introText: string;
  accessButtonLabel: string;
  guideIntroText: string;
  guideText: string;
  widgetThumbnailUrl: string | null;
  widgetButtonActive: boolean;
}

export const DEFAULT_SAISINE_PAGE_FORM: SaisinePageFormData = {
  introText:
    '<p>Effectuez vos démarches administratives en ligne grâce au module de Saisine par Voie Électronique, accessible à tout moment.</p>',
  accessButtonLabel: 'Faire une saisine par voie électronique',
  guideIntroText: 'Notre Structure vous propose ce module de téléservice pour effectuer vos démarches administratives.',
  guideText:
    '<p><strong>Préambule</strong></p>' +
    '<p>Chacun des termes mentionnés ci-dessous aura dans le présent guide explicatif du Module de téléservice (ci-après dénommées «le guide explicatif »), la signification suivante :</p>' +
    '<p>«<strong>Module de téléservice</strong>» désigne le module qui permet de saisir par voie électronique la Structure, dans le cadre de l’ordonnance n°2014-1330 du 6 novembre 2014 relative au droit des usagers de saisir l’administration par voie électronique et du décret n°2016-1411 du 20 octobre 2016 relatif aux modalités de la saisine par voie électronique.</p>' +
    '<p>« <strong>Membre</strong> » désigne toute personne (un particulier, un représentant d’une association ou d’une entreprise) ayant créé un compte via le site https://account.neopse.com et qui utilise le Module de téléservice.</p>',
  widgetThumbnailUrl: null,
  widgetButtonActive: false,
};
