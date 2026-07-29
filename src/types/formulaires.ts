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
