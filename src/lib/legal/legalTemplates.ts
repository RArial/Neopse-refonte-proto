import type { LegalTemplate, LegalTemplateId } from '@/types/legal';

const communeNameField = {
  key: 'communeName',
  label: 'Nom de la collectivité',
  required: true,
  prefillFrom: 'communeName',
  type: { input: 'text' as const },
};

/** Déclaration d'accessibilité — décomposée à partir du gabarit-type RGAA (article 47 de la loi
 * n° 2005-102 du 11 février 2005), en isolant les variables propres à chaque collectivité. Le
 * texte réglementaire (blocs 'fixed') est conservé tel quel. */
const ACCESSIBILITY_TEMPLATE: LegalTemplate = {
  id: 'accessibility',
  title: 'Accessibilité',
  blocks: [
    { kind: 'fixed', as: 'heading', text: "Déclaration d'accessibilité" },
    { kind: 'field', field: communeNameField },
    {
      kind: 'fixed',
      text: " s'engage à rendre son site internet accessible conformément à l'article 47 de la loi n° 2005-102 du 11 février 2005. À cette fin, elle met en œuvre la stratégie et les actions suivantes. Cette déclaration d'accessibilité s'applique à ",
    },
    {
      kind: 'field',
      field: { key: 'siteUrl', label: 'Adresse du site concerné', required: true, prefillFrom: 'siteUrl', type: { input: 'url' } },
    },
    { kind: 'fixed', text: '.' },

    { kind: 'fixed', as: 'subheading', newParagraph: true, text: 'État de conformité' },
    { kind: 'field', field: communeNameField },
    { kind: 'fixed', text: ' est ' },
    {
      kind: 'field',
      field: {
        key: 'conformityStatus',
        label: "État de conformité",
        required: true,
        type: { input: 'choice', options: ['totalement conforme', 'partiellement conforme', 'non conforme'] },
      },
    },
    {
      kind: 'fixed',
      text: " avec le référentiel général d'amélioration de l'accessibilité (RGAA), version 4.1, en raison des non-conformités et des dérogations énumérées ci-dessous.",
    },

    { kind: 'fixed', as: 'subheading', newParagraph: true, text: 'Résultats des tests' },
    { kind: 'fixed', text: "L'audit de conformité réalisé par " },
    {
      kind: 'field',
      field: { key: 'auditorName', label: "Auditeur ou organisme ayant réalisé l'audit", required: true, type: { input: 'text' } },
    },
    { kind: 'fixed', text: ' révèle que ' },
    {
      kind: 'field',
      field: {
        key: 'conformityRate',
        label: 'Taux de conformité',
        required: true,
        type: { input: 'number', min: 0, max: 100, suffix: '%' },
      },
    },
    { kind: 'fixed', text: " des critères du RGAA version 4.1 sont respectés." },

    { kind: 'fixed', as: 'subheading', newParagraph: true, text: 'Contenus non accessibles' },
    {
      kind: 'fixed',
      text: "Malgré nos efforts pour rendre l'ensemble des contenus accessibles, il est possible que certains contenus présentés ci-après ne soient pas encore entièrement accessibles.",
    },
    {
      kind: 'field',
      field: {
        key: 'nonAccessibleContent',
        label: 'Liste des contenus non accessibles et dérogations',
        help: 'Facultatif si le site est totalement conforme.',
        required: false,
        type: { input: 'richtext' },
      },
    },

    { kind: 'fixed', as: 'subheading', newParagraph: true, text: 'Établissement de cette déclaration' },
    { kind: 'fixed', text: 'Cette déclaration a été établie le ' },
    {
      kind: 'field',
      field: { key: 'declarationDate', label: 'Date d’établissement', help: 'Format JJ/MM/AAAA', required: true, type: { input: 'text' } },
    },
    {
      kind: 'fixed',
      text: '. Technologies utilisées pour la réalisation du site : HTML5, CSS3, JavaScript.',
    },

    { kind: 'fixed', as: 'subheading', newParagraph: true, text: 'Amélioration et contact' },
    {
      kind: 'fixed',
      text: "Si vous n'arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter le responsable du site internet pour être orienté vers une alternative accessible ou obtenir le contenu sous une autre forme, par e-mail à l'adresse ",
    },
    {
      kind: 'field',
      field: { key: 'contactEmail', label: 'E-mail de contact accessibilité', required: true, type: { input: 'email' } },
    },
    { kind: 'fixed', text: '. Nous nous engageons à répondre dans un délai de ' },
    {
      kind: 'field',
      field: { key: 'responseDelay', label: 'Délai de réponse', required: true, type: { input: 'number', min: 1, suffix: 'jours ouvrés' } },
    },
    { kind: 'fixed', text: '.' },

    { kind: 'fixed', as: 'subheading', newParagraph: true, text: 'Voies de recours' },
    {
      kind: 'fixed',
      text: "Si vous constatez un défaut d'accessibilité vous empêchant d'accéder à un contenu ou une fonctionnalité du site, que vous nous le signalez et que vous ne parvenez pas à obtenir une réponse de notre part, vous êtes en droit de faire parvenir vos doléances ou une demande de saisine au Défenseur des droits. Plusieurs moyens sont à votre disposition : écrire un message au Défenseur des droits, contacter le délégué du Défenseur des droits dans votre région, ou envoyer un courrier par la poste (gratuit, ne pas mettre de timbre) à l'adresse suivante : Défenseur des droits — Libre réponse 71120 — 75342 Paris CEDEX 07.",
    },
  ],
};

/** Mentions légales — gabarit-type couvrant éditeur, hébergement, propriété intellectuelle, liens
 * hypertextes et données personnelles. Texte réglementaire conservé tel quel dans les blocs 'fixed'. */
const LEGAL_NOTICE_TEMPLATE: LegalTemplate = {
  id: 'legal',
  title: 'Mentions légales',
  blocks: [
    { kind: 'fixed', as: 'heading', text: 'Mentions légales' },

    { kind: 'fixed', as: 'subheading', text: 'Éditeur du site' },
    { kind: 'fixed', text: 'Le présent site est édité par ' },
    { kind: 'field', field: communeNameField },
    { kind: 'fixed', text: ', dont le siège est situé ' },
    {
      kind: 'field',
      field: { key: 'address', label: 'Adresse du siège', required: true, prefillFrom: 'address', type: { input: 'text' } },
    },
    { kind: 'fixed', text: '. Numéro de téléphone : ' },
    { kind: 'field', field: { key: 'phone', label: 'Téléphone', required: true, prefillFrom: 'phone', type: { input: 'text' } } },
    { kind: 'fixed', text: '. Adresse e-mail : ' },
    {
      kind: 'field',
      field: { key: 'contactEmail', label: 'E-mail de contact', required: true, prefillFrom: 'contactEmail', type: { input: 'email' } },
    },
    { kind: 'fixed', text: '. Directeur de la publication : ' },
    {
      kind: 'field',
      field: {
        key: 'publisherName',
        label: 'Directeur de la publication',
        required: true,
        prefillFrom: 'publisherName',
        type: { input: 'text' },
      },
    },
    { kind: 'fixed', text: '.' },

    { kind: 'fixed', as: 'subheading', newParagraph: true, text: 'Hébergement' },
    { kind: 'fixed', text: 'Le site est hébergé par ' },
    {
      kind: 'field',
      field: { key: 'hostName', label: "Nom de l'hébergeur", required: true, prefillFrom: 'hostName', type: { input: 'text' } },
    },
    { kind: 'fixed', text: ', ' },
    {
      kind: 'field',
      field: { key: 'hostAddress', label: "Adresse de l'hébergeur", required: true, prefillFrom: 'hostAddress', type: { input: 'text' } },
    },
    { kind: 'fixed', text: '.' },

    { kind: 'fixed', as: 'subheading', newParagraph: true, text: 'Propriété intellectuelle' },
    {
      kind: 'fixed',
      text: "L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques. La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.",
    },

    { kind: 'fixed', as: 'subheading', newParagraph: true, text: 'Liens hypertextes' },
    { kind: 'fixed', text: 'Le site peut contenir des liens hypertextes vers d’autres sites. ' },
    { kind: 'field', field: communeNameField },
    { kind: 'fixed', text: " n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu." },

    { kind: 'fixed', as: 'subheading', newParagraph: true, text: 'Données personnelles' },
    {
      kind: 'fixed',
      text: "Les informations recueillies sur ce site font l'objet d'un traitement informatique destiné à la gestion des services proposés par la collectivité. Pour toute question relative à la protection de vos données personnelles, vous pouvez contacter ",
    },
    {
      kind: 'field',
      field: { key: 'dpoEmail', label: 'E-mail du délégué à la protection des données (DPO)', required: true, prefillFrom: 'dpoEmail', type: { input: 'email' } },
    },
    { kind: 'fixed', text: '.' },

    { kind: 'fixed', as: 'subheading', newParagraph: true, text: 'Litiges' },
    {
      kind: 'fixed',
      text: 'Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.',
    },
  ],
};

export const LEGAL_TEMPLATES: LegalTemplate[] = [ACCESSIBILITY_TEMPLATE, LEGAL_NOTICE_TEMPLATE];

const TEMPLATES_BY_ID: Record<LegalTemplateId, LegalTemplate> = {
  accessibility: ACCESSIBILITY_TEMPLATE,
  legal: LEGAL_NOTICE_TEMPLATE,
};

export function getLegalTemplate(id: LegalTemplateId): LegalTemplate {
  return TEMPLATES_BY_ID[id];
}

export const LEGAL_PAGE_ROUTES: Record<LegalTemplateId, string> = {
  accessibility: '/dashboard/contenu/accessibilite',
  legal: '/dashboard/contenu/mentions-legales',
};
