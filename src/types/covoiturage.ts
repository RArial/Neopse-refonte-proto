export type CarpoolingStatus = 'published' | 'draft' | 'archived';

export type CarpoolingType = 'offre' | 'demande';

export const CARPOOLING_TYPE_LABELS: Record<CarpoolingType, string> = {
  offre: 'Offre',
  demande: 'Demande',
};

export type CarpoolingTripType = 'aller' | 'aller-retour';
export type CarpoolingPricing = 'gratuit' | 'tarif-unique' | 'fourchette' | 'non-communique';
export type CarpoolingGender = 'homme' | 'femme';

export interface Carpooling {
  id: string;
  departureCity: string;
  arrivalCity: string;
  annonceType: CarpoolingType;
  status: CarpoolingStatus;
}

export const CARPOOLING_MOCK: Carpooling[] = [
  { id: 'carpool-mairie-gare', departureCity: 'Mairie', arrivalCity: 'Gare SNCF', annonceType: 'offre', status: 'published' },
  { id: 'carpool-marche-samedi', departureCity: 'Marché du samedi', arrivalCity: 'Centre-ville', annonceType: 'offre', status: 'published' },
  { id: 'carpool-zone-industrielle', departureCity: 'Zone industrielle', arrivalCity: 'Mairie', annonceType: 'demande', status: 'published' },
  { id: 'carpool-piscine', departureCity: 'École primaire', arrivalCity: 'Piscine municipale', annonceType: 'offre', status: 'draft' },
  { id: 'carpool-marche-noel', departureCity: 'Centre-ville', arrivalCity: 'Marché de Noël', annonceType: 'demande', status: 'draft' },
  { id: 'carpool-concert-2025', departureCity: 'Mairie', arrivalCity: 'Salle des fêtes', annonceType: 'offre', status: 'archived' },
];

export const CARPOOLING_SEAT_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export interface CarpoolingFormData {
  type: CarpoolingType;
  departureCity: string;
  arrivalCity: string;
  tripType: CarpoolingTripType;
  departureDate: string;
  returnDate: string;
  pricing: CarpoolingPricing;
  availableSeats: string;
  thumbnailUrl: string | null;
  advertiserName: string;
  contactEmail: string;
  phoneCountry: string;
  phoneNumber: string;
  gender: CarpoolingGender | '';
  age: string;
  advertiserAdditionalInfo: string;
  stepCity1: string;
  stepCity2: string;
  stepCity3: string;
  stepCity4: string;
  stepCity5: string;
  petsAllowed: boolean;
  smokersAllowed: boolean;
  vehicleType: string;
  status: CarpoolingStatus;
}

export const DEFAULT_CARPOOLING_FORM: CarpoolingFormData = {
  type: 'offre',
  departureCity: '',
  arrivalCity: '',
  tripType: 'aller',
  departureDate: '',
  returnDate: '',
  pricing: 'gratuit',
  availableSeats: '',
  thumbnailUrl: null,
  advertiserName: '',
  contactEmail: '',
  phoneCountry: 'FR',
  phoneNumber: '',
  gender: '',
  age: '',
  advertiserAdditionalInfo: '',
  stepCity1: '',
  stepCity2: '',
  stepCity3: '',
  stepCity4: '',
  stepCity5: '',
  petsAllowed: false,
  smokersAllowed: false,
  vehicleType: '',
  status: 'draft',
};
