import type { SvgIconProps } from '@mui/material/SvgIcon';
import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined';
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';

export interface ToolFeature {
  icon: React.ComponentType<SvgIconProps>;
  label: string;
}

export interface ToolItem {
  id: string;
  /** Couleur de marque réelle de l'outil présenté (identité propre au produit, distincte de la palette
   * Neopse) — utilisée uniquement sur ces cards de présentation, pour respecter la DA de chaque outil. */
  accentColor: string;
  logoSrc: string;
  logoWidth: number;
  logoHeight: number;
  /** 'framed' : logo en simple trait (transparent) posé sur un badge carré teinté de la couleur de marque.
   * 'plain' : logo déjà autoporteur (fond ou style propre) affiché tel quel, sans cadre additionnel. */
  logoVariant: 'framed' | 'plain';
  /** Le logo contient-il déjà le nom de l'outil stylisé (ex. le bandeau eTicket) ? Si oui, on n'affiche pas
   * de titre texte en doublon à côté. */
  logoContainsWordmark: boolean;
  mockupSrc: string;
  mockupAlt: string;
  title: string;
  tagline: string;
  description: string;
  features: ToolFeature[];
  active: boolean;
}

export const TOOLS: ToolItem[] = [
  {
    id: 'neopse',
    // Reprend exactement l'ambre du thème Neopse (theme.palette.warning.main) : Neopse est l'outil hôte,
    // sa couleur de marque est déjà celle de l'application.
    accentColor: '#ed9c00',
    logoSrc: '/images/tools/neopse/logo.png',
    logoWidth: 200,
    logoHeight: 196,
    logoVariant: 'framed',
    logoContainsWordmark: false,
    mockupSrc: '/images/tools/neopse/mockup.png',
    mockupAlt: 'Aperçu du tableau de bord et de l’éditeur de contenu Neopse',
    title: 'Neopse — Site internet',
    tagline: 'Le CMS collaboratif pour votre collectivité',
    description:
      "Le CMS complet pour gérer le site internet de votre collectivité : contenus, modules, démarches en ligne et bien plus, sans compétence technique.",
    active: true,
    features: [
      { icon: DesignServicesOutlinedIcon, label: 'CMS adapté aux collectivités' },
      { icon: ExtensionOutlinedIcon, label: 'Modules à la carte' },
      { icon: AssignmentTurnedInOutlinedIcon, label: 'Démarches en ligne' },
      { icon: SyncOutlinedIcon, label: 'Synchronisation Localiti' },
    ],
  },
  {
    id: 'localiti',
    accentColor: '#1e4fde',
    logoSrc: '/images/tools/localiti/logo.webp',
    logoWidth: 480,
    logoHeight: 480,
    logoVariant: 'plain',
    logoContainsWordmark: false,
    mockupSrc: '/images/tools/localiti/mockup.png',
    mockupAlt: 'Aperçu de l’application mobile Localiti',
    title: 'Localiti',
    tagline: 'Toute votre commune, en un seul fil',
    description:
      "Recevez les dernières informations et alertes de votre collectivité (mairie, communauté de communes, syndicat…) en temps réel grâce à l'application mobile Localiti.",
    active: false,
    features: [
      { icon: NotificationsActiveOutlinedIcon, label: 'Infos & alertes en temps réel' },
      { icon: EventOutlinedIcon, label: 'Agenda des événements' },
      { icon: LocationOnOutlinedIcon, label: 'Géolocalisé' },
      { icon: FavoriteBorderOutlinedIcon, label: 'Gratuit & sans compte' },
    ],
  },
  {
    id: 'eticket',
    accentColor: '#e4177b',
    logoSrc: '/images/tools/eticket/logo-app.webp',
    logoWidth: 480,
    logoHeight: 480,
    logoVariant: 'plain',
    logoContainsWordmark: false,
    mockupSrc: '/images/tools/eticket/mockup.png',
    mockupAlt: 'Aperçu de l’application mobile eTicket',
    title: 'eTicket',
    tagline: 'Le portail famille 100% mobile',
    description:
      "Le logiciel cantine et périscolarité qui simplifie le quotidien des familles et des collectivités : réservations, paiement et facturation, tout en un.",
    active: false,
    features: [
      { icon: EventAvailableOutlinedIcon, label: 'Réservations faciles' },
      { icon: CreditCardOutlinedIcon, label: 'Paiement en ligne sécurisé' },
      { icon: ReceiptLongOutlinedIcon, label: 'Facturation automatique' },
      { icon: VerifiedUserOutlinedIcon, label: '100% hébergé & RGPD' },
    ],
  },
];
