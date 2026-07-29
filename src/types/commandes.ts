export interface CommandeLigne {
  label: string;
  description?: string;
  montantHt: number;
}

export interface CommandeFacturation {
  raisonSociale: string;
  identifiant: string;
  adresse: string[];
  pays: string;
}

export interface CommandeRecord {
  id: string;
  date: string;
  orderNumber: string;
  invoiceUrl: string;
  prestation: string;
  duration: string;
  amountTtc: number;
  tvaRate: number;
  lignes: CommandeLigne[];
  facturation: CommandeFacturation;
  cgvLabel: string;
  cgvUrl: string;
}

const FACTURATION_NEOPSEUX: CommandeFacturation = {
  raisonSociale: 'NeopseUX',
  identifiant: '1996',
  adresse: ['132 rue du faubourg saint denis', "75010 - Paris 10ème"],
  pays: 'FRANCE',
};

export const COMMANDES: CommandeRecord[] = [
  {
    id: 'cmd-622',
    date: '2026-04-09',
    orderNumber: 'RDC-WEB-20260409-622',
    invoiceUrl: 'https://chorus-pro.gouv.fr',
    prestation: 'Outil (Site Internet)',
    duration: '1 an',
    amountTtc: 0,
    tvaRate: 20,
    lignes: [
      {
        label: 'Outil (Site Internet)',
        description:
          "Accès annuel à l'outil de gestion du site Internet : création et administration des pages, modules et contenus publiés.",
        montantHt: 0,
      },
    ],
    facturation: FACTURATION_NEOPSEUX,
    cgvLabel: 'Conditions Générales de Vente Outils-Modules [RDC]_Août 2025.pdf',
    cgvUrl: '/documents/cgv-outils-modules-rdc.pdf',
  },
  {
    id: 'cmd-621',
    date: '2026-04-09',
    orderNumber: 'RDC-WEB-20260409-621',
    invoiceUrl: 'https://chorus-pro.gouv.fr',
    prestation: 'Outil (Site Internet)',
    duration: '1 an',
    amountTtc: 0,
    tvaRate: 20,
    lignes: [
      {
        label: 'Outil (Site Internet)',
        description:
          "Accès annuel à l'outil de gestion du site Internet : création et administration des pages, modules et contenus publiés.",
        montantHt: 0,
      },
    ],
    facturation: FACTURATION_NEOPSEUX,
    cgvLabel: 'Conditions Générales de Vente Outils-Modules [RDC]_Août 2025.pdf',
    cgvUrl: '/documents/cgv-outils-modules-rdc.pdf',
  },
];

export function getCommandeById(id: string): CommandeRecord | undefined {
  return COMMANDES.find((commande) => commande.id === id);
}

export function formatCommandeDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatCommandeAmount(value: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
}
