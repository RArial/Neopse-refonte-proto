/** Source unique des données d'identité de la structure (collectivité), utilisées pour pré-remplir
 * les champs des pages légales obligatoires (`prefillFrom`). Ne pas ressaisir ces informations
 * dans les gabarits légaux — elles se modifient depuis « Infos du projet ». */
export interface StructureData {
  communeName: string;
  address: string;
  phone: string;
  contactEmail: string;
  siteUrl: string;
  publisherName: string;
  hostName: string;
  hostAddress: string;
  dpoEmail: string;
}

export const STRUCTURE_DATA: StructureData = {
  communeName: 'Mairie de Neopse',
  address: '132 rue du faubourg Saint-Denis, 75010 Paris',
  phone: '01 23 45 67 89',
  contactEmail: 'contact@mairie-neopse.fr',
  siteUrl: 'www.mairie-neopse.fr',
  publisherName: 'Le maire de Neopse',
  hostName: '',
  hostAddress: '',
  dpoEmail: '',
};

export function getStructureValue(key: string): string {
  return STRUCTURE_DATA[key as keyof StructureData] ?? '';
}
