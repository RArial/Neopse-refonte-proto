export type FormElementKind =
  | 'section-title'
  | 'presentation-text'
  | 'short-text'
  | 'long-text'
  | 'checkboxes'
  | 'radio'
  | 'select'
  | 'email'
  | 'date'
  | 'time'
  | 'file';

export interface FormElementOption {
  kind: FormElementKind;
  label: string;
}

export const FORM_ELEMENT_OPTIONS: FormElementOption[] = [
  { kind: 'section-title', label: 'Titre de section' },
  { kind: 'presentation-text', label: 'Texte de présentation' },
  { kind: 'short-text', label: 'Champ texte simple' },
  { kind: 'long-text', label: 'Champ texte long' },
  { kind: 'checkboxes', label: 'Cases à cocher (choix multiples)' },
  { kind: 'radio', label: 'Boutons radio (choix unique)' },
  { kind: 'select', label: 'Menu déroulant (choix unique)' },
  { kind: 'email', label: 'Champ adresse email' },
  { kind: 'date', label: 'Champ date' },
  { kind: 'time', label: 'Champ horaire' },
  { kind: 'file', label: 'Champ envoi de fichiers' },
];

/** Éléments purement informatifs : pas de libellé de champ ni de caractère obligatoire. */
export interface SectionTitleElement {
  kind: 'section-title';
  id: string;
  text: string;
}

export interface PresentationTextElement {
  kind: 'presentation-text';
  id: string;
  text: string;
}

interface FieldElementBase {
  id: string;
  label: string;
  required: boolean;
}

export interface ShortTextFieldElement extends FieldElementBase {
  kind: 'short-text';
}

export interface LongTextFieldElement extends FieldElementBase {
  kind: 'long-text';
}

export interface ChoiceFieldElement extends FieldElementBase {
  kind: 'checkboxes' | 'radio' | 'select';
  options: string[];
}

export interface EmailFieldElement extends FieldElementBase {
  kind: 'email';
}

export interface DateFieldElement extends FieldElementBase {
  kind: 'date';
}

export interface TimeFieldElement extends FieldElementBase {
  kind: 'time';
}

export interface FileFieldElement extends FieldElementBase {
  kind: 'file';
}

export type FormElement =
  | SectionTitleElement
  | PresentationTextElement
  | ShortTextFieldElement
  | LongTextFieldElement
  | ChoiceFieldElement
  | EmailFieldElement
  | DateFieldElement
  | TimeFieldElement
  | FileFieldElement;

export interface FormElementPatch {
  text?: string;
  label?: string;
  required?: boolean;
  options?: string[];
}

function randomId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const DEFAULT_FIELD_LABEL: Record<Exclude<FormElementKind, 'section-title' | 'presentation-text'>, string> = {
  'short-text': 'Champ texte simple',
  'long-text': 'Champ texte long',
  checkboxes: 'Cases à cocher',
  radio: 'Boutons radio',
  select: 'Menu déroulant',
  email: 'Adresse email',
  date: 'Date',
  time: 'Horaire',
  file: 'Pièce jointe',
};

export function createFormElement(kind: FormElementKind): FormElement {
  const id = randomId('field');
  switch (kind) {
    case 'section-title':
      return { kind, id, text: '' };
    case 'presentation-text':
      return { kind, id, text: '' };
    case 'checkboxes':
    case 'radio':
    case 'select':
      return { kind, id, label: DEFAULT_FIELD_LABEL[kind], required: false, options: ['Option 1', 'Option 2'] };
    default:
      return { kind, id, label: DEFAULT_FIELD_LABEL[kind], required: false };
  }
}

export interface FormBuilderData {
  name: string;
  submitButtonText: string;
  confirmationMessage: string;
  elements: FormElement[];
  status: 'draft' | 'published';
}

export const DEFAULT_FORM_BUILDER_DATA: FormBuilderData = {
  name: '',
  submitButtonText: 'Envoyer',
  confirmationMessage: 'Votre formulaire a bien été envoyé, merci.',
  status: 'draft',
  elements: [
    { kind: 'section-title', id: 'field-default-1', text: 'Vos informations' },
    { kind: 'short-text', id: 'field-default-2', label: 'Nom', required: true },
    { kind: 'email', id: 'field-default-3', label: 'Adresse email', required: true },
  ],
};

export interface FormResponse {
  id: string;
  respondentName: string;
  summary: string;
  submittedAt: string;
  isNew: boolean;
}

export interface FormSummary {
  id: string;
  name: string;
  fieldsCount: number;
  status: FormBuilderData['status'];
  dateAdded: string;
  responses: FormResponse[];
}

export const FORMS: FormSummary[] = [
  {
    id: 'form-1',
    name: 'Formulaire de contact',
    fieldsCount: 8,
    status: 'published',
    dateAdded: '2026-01-05',
    responses: [
      { id: 'resp-1-1', respondentName: 'Julie Marchand', summary: 'Demande d’information sur les horaires de la mairie.', submittedAt: '2026-08-05T09:12:00', isNew: true },
      { id: 'resp-1-2', respondentName: 'Karim Belaïd', summary: 'Signalement d’un lampadaire défectueux rue des Tilleuls.', submittedAt: '2026-08-04T16:47:00', isNew: true },
      { id: 'resp-1-3', respondentName: 'Sophie Rambert', summary: 'Question sur la démarche de carte d’identité.', submittedAt: '2026-07-28T11:03:00', isNew: false },
      { id: 'resp-1-4', respondentName: 'Marc Le Goff', summary: 'Remerciements suite à l’intervention des services techniques.', submittedAt: '2026-07-14T08:30:00', isNew: false },
    ],
  },
  {
    id: 'form-2',
    name: 'Inscription newsletter',
    fieldsCount: 3,
    status: 'published',
    dateAdded: '2026-01-20',
    responses: [
      { id: 'resp-2-1', respondentName: 'Anaïs Petit', summary: 'anais.petit@example.com', submittedAt: '2026-08-06T18:02:00', isNew: true },
      { id: 'resp-2-2', respondentName: 'Thomas Nguyen', summary: 'thomas.nguyen@example.com', submittedAt: '2026-06-02T10:15:00', isNew: false },
    ],
  },
  {
    id: 'form-3',
    name: 'Inscription événement',
    fieldsCount: 5,
    status: 'published',
    dateAdded: '2026-04-11',
    responses: [
      { id: 'resp-3-1', respondentName: 'Élise Fontaine', summary: 'Inscription pour 2 personnes à la fête de l’été.', submittedAt: '2026-06-30T14:22:00', isNew: false },
      { id: 'resp-3-2', respondentName: 'Nicolas Aubert', summary: 'Inscription pour 4 personnes, régime végétarien.', submittedAt: '2026-06-25T19:08:00', isNew: false },
      { id: 'resp-3-3', respondentName: 'Camille Dubreuil', summary: 'Inscription pour 1 personne à la fête de l’été.', submittedAt: '2026-06-20T09:55:00', isNew: false },
    ],
  },
  {
    id: 'form-4',
    name: 'Enquête de satisfaction',
    fieldsCount: 10,
    status: 'draft',
    dateAdded: '2026-04-18',
    responses: [],
  },
];
