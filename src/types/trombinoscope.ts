import type { Category } from '@/types/pagesModules';

export type MemberStatus = 'published' | 'draft' | 'archived';

export interface Member {
  id: string;
  lastName: string;
  firstName: string;
  status: MemberStatus;
}

export const MEMBERS_MOCK: Member[] = [
  { id: 'member-dupont-marie', lastName: 'Dupont', firstName: 'Marie', status: 'published' },
  { id: 'member-martin-jean', lastName: 'Martin', firstName: 'Jean', status: 'published' },
  { id: 'member-bernard-sophie', lastName: 'Bernard', firstName: 'Sophie', status: 'published' },
  { id: 'member-petit-lucas', lastName: 'Petit', firstName: 'Lucas', status: 'draft' },
  { id: 'member-robert-claire', lastName: 'Robert', firstName: 'Claire', status: 'draft' },
  { id: 'member-moreau-paul', lastName: 'Moreau', firstName: 'Paul', status: 'archived' },
];

export type MemberCategory = Category;

export const MEMBER_CATEGORIES_SEED: MemberCategory[] = [
  { id: 'cat-elus', name: 'Élus' },
  { id: 'cat-services-administratifs', name: 'Services administratifs' },
  { id: 'cat-services-techniques', name: 'Services techniques' },
];

export interface MemberFormData {
  lastName: string;
  firstName: string;
  categoryId: string;
  subCategory: string;
  description: string;
  photoUrl: string | null;
  contactIds: string[];
  formId: string;
  phone1Country: string;
  phone1: string;
  phone2Country: string;
  phone2: string;
  phone3Country: string;
  phone3: string;
  infoTitle: string;
  infoText: string;
  htmlCode: string;
  status: MemberStatus;
}

export const DEFAULT_MEMBER_FORM: MemberFormData = {
  lastName: '',
  firstName: '',
  categoryId: '',
  subCategory: '',
  description: '',
  photoUrl: null,
  contactIds: [],
  formId: '',
  phone1Country: 'FR',
  phone1: '',
  phone2Country: 'FR',
  phone2: '',
  phone3Country: 'FR',
  phone3: '',
  infoTitle: '',
  infoText: '',
  htmlCode: '',
  status: 'draft',
};
