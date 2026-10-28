import { THUMBNAIL_RATIO } from '@/lib/mediaLibrary/constants';
import { autoCropArea } from '@/lib/mediaLibrary/crop';
import { SEED_IMAGES } from '@/lib/mediaLibrary/seed';
import type { ContentTemplate, NewsArticle, NewsThumbnail, StructureRow } from '@/types/actualites';

// Vignettes prises dans la médiathèque de démo : « Modifier le cadrage » fonctionne aussi sur les données de départ.
function thumbnailFrom(imageName: string): NewsThumbnail | undefined {
  const image = SEED_IMAGES.find((candidate) => candidate.name === imageName);
  return image ? { url: image.url, crop: autoCropArea(image, THUMBNAIL_RATIO) } : undefined;
}

function textRow(id: string, heading: string, body: string): StructureRow {
  return { id: `${id}-row`, layout: '1', columns: [[{ kind: 'text', id: `${id}-text`, heading, body }]] };
}

export const NEWS_SEED: NewsArticle[] = [
  {
    id: 'travaux-rue-republique',
    title: 'Travaux rue de la République — circulation modifiée',
    lead: 'Du 1er au 15 juillet, la rue de la République passe en sens unique pendant la réfection de la chaussée.',
    favorite: true,
    thumbnail: thumbnailFrom('travaux-route-departementale.jpg'),
    publishedAt: '2026-07-22',
    active: true,
    content: [
      textRow(
        'travaux',
        'Ce qui change',
        '<p>Le stationnement est interdit côté pair pendant toute la durée du chantier. Une déviation est mise en place par l’avenue Jean-Jaurès.</p>',
      ),
    ],
  },
  {
    id: 'inscriptions-scolaires',
    title: 'Inscriptions scolaires 2026-2027 : mode d’emploi',
    lead: 'Les inscriptions en maternelle et en CP se font en mairie jusqu’au 30 septembre.',
    favorite: false,
    thumbnail: thumbnailFrom('rentree-scolaire-cantine.jpg'),
    publishedAt: '2026-09-02',
    active: true,
    content: [textRow('inscriptions', 'Pièces à fournir', '<p>Livret de famille, justificatif de domicile de moins de trois mois et carnet de santé.</p>')],
  },
  {
    id: 'fete-de-la-musique',
    title: 'Fête de la musique — le programme complet',
    lead: 'Concerts sur la place de la mairie et dans les rues du centre-bourg.',
    favorite: true,
    thumbnail: thumbnailFrom('fete-du-village-feu-artifice.jpg'),
    publishedAt: '2026-06-18',
    active: true,
    content: [],
  },
  {
    id: 'newsletter-juin',
    title: 'Newsletter municipale de juin',
    lead: '',
    favorite: false,
    publishedAt: '2026-06-02',
    active: true,
    content: [],
  },
  {
    id: 'canicule-reflexes',
    title: 'Canicule : les bons réflexes à adopter',
    lead: 'Hydratation, volets fermés, registre des personnes fragiles : les gestes qui protègent.',
    favorite: false,
    publishedAt: '2026-07-10',
    active: false,
    content: [],
  },
  {
    id: 'marche-producteurs',
    title: 'Un marché des producteurs chaque samedi matin',
    lead: 'Fruits, légumes, fromages et pain : une vingtaine de producteurs locaux place du Marché.',
    favorite: false,
    thumbnail: thumbnailFrom('brocante-printemps.jpg'),
    publishedAt: '2026-10-05',
    active: true,
    content: [],
  },
  {
    id: 'conseil-municipal-novembre',
    title: 'Conseil municipal du 12 novembre — ordre du jour',
    lead: 'Budget primitif, tarifs de la cantine et rénovation du lavoir.',
    favorite: false,
    publishedAt: '2026-11-12',
    active: true,
    content: [],
  },
  {
    id: 'arrete-arrosage',
    title: 'Restrictions d’arrosage — arrêté municipal',
    lead: '',
    favorite: false,
    publishedAt: '2026-08-18',
    deactivatedAt: '2026-09-30',
    active: false,
    content: [],
  },
];

export const USER_TEMPLATES_SEED: ContentTemplate[] = [
  {
    id: 'user-template-musee',
    label: 'Actualité musée',
    content: [
      { id: 'tpl-musee-row-1', layout: '2-67-33', columns: [[{ kind: 'text', id: 'tpl-musee-text', heading: 'Exposition', body: '' }], [{ kind: 'images', id: 'tpl-musee-img', imageUrls: [] }]] },
    ],
  },
];
