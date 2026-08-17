import type { Category } from '@/types/pagesModules';

export type MemberStatus = 'published' | 'draft' | 'archived';

export interface Member {
  id: string;
  lastName: string;
  firstName: string;
  status: MemberStatus;
}

export const MEMBERS_MOCK: Member[] = [
  { id: 'member-lachaume-bernard', lastName: 'Lachaume', firstName: 'Bernard', status: 'published' },
  { id: 'member-grandjean-sylvie', lastName: 'Grandjean', firstName: 'Sylvie', status: 'published' },
  { id: 'member-benyahia-karim', lastName: 'Benyahia', firstName: 'Karim', status: 'published' },
  { id: 'member-fontaine-lea', lastName: 'Fontaine', firstName: 'Léa', status: 'draft' },
  { id: 'member-mercier-thierry', lastName: 'Mercier', firstName: 'Thierry', status: 'draft' },
  { id: 'member-vasseur-odile', lastName: 'Vasseur', firstName: 'Odile', status: 'archived' },
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
