export type Civilite = 'M' | 'Mme';

export interface PhoneCountry {
  code: string;
  label: string;
  dial: string;
}

export const PHONE_COUNTRIES: PhoneCountry[] = [
  { code: 'FR', label: 'France', dial: '+33' },
  { code: 'BE', label: 'Belgique', dial: '+32' },
  { code: 'CH', label: 'Suisse', dial: '+41' },
  { code: 'LU', label: 'Luxembourg', dial: '+352' },
  { code: 'CA', label: 'Canada', dial: '+1' },
];

export interface ProfileSettings {
  civilite: Civilite;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  city: string;
  phoneCountry: string;
  phoneNumber: string;
  bio: string;
  shareContactInfo: boolean;
  acceptTerms: boolean;
  avatarUrl: string | null;
}

export const DEFAULT_PROFILE: ProfileSettings = {
  civilite: 'M',
  firstName: 'Rémi',
  lastName: 'Arial',
  username: 'remiarial',
  email: 'rarial@inedi.fr',
  city: 'Paris 10ème 75010, France',
  phoneCountry: 'FR',
  phoneNumber: '',
  bio: '',
  shareContactInfo: false,
  acceptTerms: true,
  avatarUrl: null,
};
