import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import PollOutlinedIcon from '@mui/icons-material/PollOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import WorkOutlinedIcon from '@mui/icons-material/WorkOutlined';
import type { CatalogModule } from '@/types/content';

export const CATALOG_MODULES: CatalogModule[] = [
  { id: 'jobs', label: "Annonces d'emploi", icon: WorkOutlinedIcon },
  { id: 'health', label: 'Annuaire de la santé', icon: LocalHospitalOutlinedIcon },
  { id: 'associations', label: 'Annuaire des associations', icon: GroupsOutlinedIcon },
  { id: 'professionals', label: 'Annuaire des professionnels', icon: BusinessCenterOutlinedIcon },
  { id: 'tourism', label: 'Annuaire touristique', icon: PlaceOutlinedIcon },
  { id: 'editos', label: 'Editos', icon: DescriptionOutlinedIcon },
  { id: 'press', label: 'Espace presse', icon: CampaignOutlinedIcon },
  { id: 'faq', label: 'FAQ', icon: HelpOutlineOutlinedIcon },
  { id: 'newsletters', label: 'Newsletters', icon: MailOutlinedIcon },
];

/** Modules proposés par Neopse mais non inclus dans le forfait actuel du client. */
export const DISCOVER_MODULES: CatalogModule[] = [
  {
    id: 'shared-agenda',
    label: 'Agenda partagé',
    icon: EventNoteOutlinedIcon,
    description:
      "Centralisez les événements de vos services et associations dans un agenda commun, avec invitations et réponses intégrées.",
  },
  {
    id: 'polls',
    label: 'Sondages en ligne',
    icon: PollOutlinedIcon,
    description: 'Recueillez l’avis des habitants sur vos projets grâce à des sondages simples à créer et à diffuser.',
  },
  {
    id: 'online-steps',
    label: 'Démarches en ligne',
    icon: HowToRegOutlinedIcon,
    description: 'Dématérialisez les démarches administratives courantes et suivez leur traitement de bout en bout.',
  },
  {
    id: 'galleries',
    label: 'Galeries photos',
    icon: PhotoLibraryOutlinedIcon,
    description: 'Publiez des albums photos de vos événements et lieux, organisés par thème ou par date.',
  },
  {
    id: 'social',
    label: 'Réseaux sociaux',
    icon: ShareOutlinedIcon,
    description: 'Affichez et relayez automatiquement vos publications des réseaux sociaux directement sur votre site.',
  },
];

export function getCatalogModule(id: string): CatalogModule | undefined {
  return CATALOG_MODULES.find((mod) => mod.id === id);
}

export function getDiscoverModule(id: string): CatalogModule | undefined {
  return DISCOVER_MODULES.find((mod) => mod.id === id);
}
