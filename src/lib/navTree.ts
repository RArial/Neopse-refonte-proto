import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import type { AddedModule, NavTreeNode } from '@/types/content';

/** Identifiant virtuel désignant la racine du menu, en dehors de tout onglet thématique. */
export const ROOT_THEMATIQUE_ID = 'root';

/** Identifiant du lien Google fourni par défaut — un élément de contenu comme un autre (cf. SEED_MODULES). */
export const GOOGLE_SHORTCUT_ID = 'google';

export const NAV_TREE: NavTreeNode[] = [
  { id: 'vie-associative', label: 'Vie associative', typeLabel: 'Onglet thématique', kind: 'tab', enabled: true },
  { id: 'actualites', label: 'Actualités', typeLabel: 'Onglet thématique', kind: 'tab', enabled: true },
  { id: 'pratique', label: 'Pratique', typeLabel: 'Onglet thématique', kind: 'tab', enabled: true },
];

const emptyModuleContent = {
  headerEnabled: true,
  headerTitle: '',
  headerDescription: '',
  metaDescription: '',
  metaKeywords: '',
};

/** Modules et liens déjà publiés lors de l'initialisation de la démo. */
export const SEED_MODULES: AddedModule[] = [
  {
    id: 'actualites-haven',
    catalogModuleId: '',
    label: 'Actualités de Haven',
    typeLabel: 'Actualités',
    kind: 'module',
    thematiqueId: 'actualites',
    parentPageId: '',
    enabled: true,
    status: 'published',
    icon: FeedOutlinedIcon,
    ...emptyModuleContent,
  },
  {
    id: 'agenda-haven',
    catalogModuleId: '',
    label: 'Agenda de Haven',
    typeLabel: 'Agenda',
    kind: 'module',
    thematiqueId: 'actualites',
    parentPageId: '',
    enabled: true,
    status: 'published',
    icon: EventOutlinedIcon,
    ...emptyModuleContent,
  },
  {
    id: 'flash-haven',
    catalogModuleId: '',
    label: 'Flash Infos de Haven',
    typeLabel: 'Flash Infos',
    kind: 'module',
    thematiqueId: 'actualites',
    parentPageId: '',
    enabled: true,
    status: 'published',
    icon: BoltOutlinedIcon,
    ...emptyModuleContent,
  },
  {
    id: 'covoiturage',
    catalogModuleId: '',
    label: 'Annonces de covoiturage',
    typeLabel: 'Covoiturage',
    kind: 'module',
    thematiqueId: 'pratique',
    parentPageId: '',
    enabled: true,
    status: 'published',
    icon: DirectionsCarOutlinedIcon,
    ...emptyModuleContent,
  },
  {
    id: 'contacts',
    catalogModuleId: '',
    label: 'Contacts',
    typeLabel: 'Contacts',
    kind: 'module',
    thematiqueId: 'pratique',
    parentPageId: '',
    enabled: true,
    status: 'published',
    icon: ContactsOutlinedIcon,
    ...emptyModuleContent,
  },
  {
    id: GOOGLE_SHORTCUT_ID,
    catalogModuleId: '',
    label: 'Google',
    typeLabel: 'Raccourci',
    kind: 'link',
    thematiqueId: ROOT_THEMATIQUE_ID,
    parentPageId: '',
    enabled: true,
    status: 'published',
    icon: LinkOutlinedIcon,
    linkType: 'external',
    externalUrl: 'https://www.google.com',
    internalTargetId: '',
    ...emptyModuleContent,
  },
];
