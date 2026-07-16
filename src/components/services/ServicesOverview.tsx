'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import { Changelog } from '@/components/dashboard/Changelog';
import { Icons, type IconName } from '@/components/ui/Icons';

interface ServiceItem {
  id: string;
  icon: IconName;
  title: string;
  description: string;
  active: boolean;
  actionLabel: string;
  href: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'site-internet',
    icon: 'Globe',
    title: 'Site internet',
    description: 'Construisez votre propre site internet personnalisé.',
    active: true,
    actionLabel: 'Gérer',
    href: '/dashboard',
  },
  {
    id: 'espace-collaboratif',
    icon: 'Briefcase',
    title: 'Espace collaboratif',
    description: 'Échangez des documents de façon sécurisée.',
    active: false,
    actionLabel: 'Découvrir',
    href: '#',
  },
  {
    id: 'billetterie',
    icon: 'Ticket',
    title: 'Billetterie',
    description: 'Pour tous vos événements payants et gratuits.',
    active: false,
    actionLabel: 'Découvrir',
    href: '#',
  },
  {
    id: 'localiti-app',
    icon: 'Smartphone',
    title: 'Localiti app',
    description: 'Une app mobile connectée à votre site Neopse.',
    active: false,
    actionLabel: 'Découvrir',
    href: '#',
  },
  {
    id: 'eticket',
    icon: 'UserGroup',
    title: 'eTicket',
    description: 'Le portail famille pour gérer la cantine, les sorties scolaires etc.',
    active: false,
    actionLabel: 'Découvrir',
    href: '#',
  },
];

interface StatItem {
  id: string;
  icon: IconName;
  label: string;
  value: string;
  href: string;
}

const STATS: StatItem[] = [
  { id: 'admins', icon: 'Shield', label: 'Administrateurs', value: '2', href: '/dashboard/administrateurs' },
  { id: 'affilies', icon: 'UserPlus', label: 'Affiliés validés', value: '10', href: '/dashboard/parrainage' },
  { id: 'points', icon: 'Sparkles', label: 'Points parrainage', value: '0', href: '/dashboard/parrainage' },
];

const PARRAIN_CODE = 'LJKEDQAIE';

function ServicesHeader() {
  return (
    <Box sx={{ mb: 3.5 }}>
      <Typography component="h1" variant="h4" sx={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.01em', mb: 0.375 }}>
        Services du projet
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 14 }}>
        Retrouvez les différents services proposés par INEDI pour votre projet Démo arborescence.
      </Typography>
    </Box>
  );
}

function ServiceCard({ service }: { service: ServiceItem }) {
  const IconEl = Icons[service.icon];
  const titleId = `service-${service.id}-title`;

  return (
    <Box
      component="article"
      aria-labelledby={titleId}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.25,
        p: 1.75,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '12px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <Box
          aria-hidden="true"
          sx={{
            width: 34,
            height: 34,
            borderRadius: '10px',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
            bgcolor: (theme) => (service.active ? alpha(theme.palette.success.main, 0.12) : theme.palette.action.hover),
            color: service.active ? 'success.dark' : 'text.secondary',
          }}
        >
          <IconEl size={17} />
        </Box>
        <Typography id={titleId} component="h3" sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary' }}>
          {service.title}
        </Typography>
      </Box>

      <Typography sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.45 }}>{service.description}</Typography>

      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 'auto', pt: 0.25 }}>
        <Chip
          size="small"
          icon={service.active ? <CheckCircleOutlineIcon /> : <HighlightOffOutlinedIcon />}
          label={service.active ? 'Actif' : 'Inactif'}
          color={service.active ? 'success' : 'default'}
          variant="outlined"
          sx={{ height: 22, fontSize: 11, '& .MuiChip-icon': { fontSize: 14 } }}
        />
        <Button
          component={Link}
          href={service.href}
          size="small"
          variant={service.active ? 'contained' : 'outlined'}
          color={service.active ? 'success' : 'inherit'}
          sx={{ ml: 'auto', minHeight: 28, py: 0.25, fontSize: 12 }}
        >
          {service.actionLabel}
        </Button>
      </Stack>
    </Box>
  );
}

function StatCard({ stat }: { stat: StatItem }) {
  const IconEl = Icons[stat.icon];

  return (
    <Box
      component={Link}
      href={stat.href}
      aria-label={`${stat.label} : ${stat.value}`}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1.75,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '12px',
        textDecoration: 'none',
        transition: 'transform .18s, box-shadow .18s, border-color .18s',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: 2, borderColor: 'grey.300' },
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          width: 34,
          height: 34,
          borderRadius: '10px',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.1),
          color: 'secondary.main',
        }}
      >
        <IconEl size={17} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1, color: 'text.primary' }}>
          {stat.value}
        </Typography>
        <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25 }}>{stat.label}</Typography>
      </Box>
    </Box>
  );
}

function ParrainCodeCard() {
  return (
    <Box
      component={Link}
      href="/dashboard/parrainage"
      aria-label={`Mon code Parrain : ${PARRAIN_CODE}`}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1.75,
        borderRadius: '12px',
        textDecoration: 'none',
        color: 'primary.contrastText',
        background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        transition: 'transform .18s, box-shadow .18s',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 },
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          width: 34,
          height: 34,
          borderRadius: '10px',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          bgcolor: alpha('#ffffff', 0.9),
          color: 'primary.dark',
        }}
      >
        <Icons.Share size={17} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700, letterSpacing: '.03em', lineHeight: 1.2 }}>{PARRAIN_CODE}</Typography>
        <Typography sx={{ fontSize: 12, opacity: 0.9, mt: 0.25 }}>Mon code Parrain</Typography>
      </Box>
    </Box>
  );
}

function ProjectStats() {
  return (
    <Box component="section" aria-labelledby="project-stats-heading" sx={{ mt: 3 }}>
      <Typography
        id="project-stats-heading"
        component="h2"
        sx={{ fontSize: 16, fontWeight: 600, color: 'text.primary', mb: 1.75 }}
      >
        Aperçu du projet
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2 }}>
        {STATS.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
        <ParrainCodeCard />
      </Box>
    </Box>
  );
}

export function ServicesOverview() {
  return (
    <Box
      sx={{
        p: '28px 36px 64px',
        maxWidth: 1560,
        width: '100%',
        mx: 'auto',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 320px' },
        gap: 3.5,
        alignItems: 'start',
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <ServicesHeader />
        <Box
          component="section"
          aria-label="Services disponibles"
          sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 1.5 }}
        >
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </Box>
        <ProjectStats />
      </Box>
      <Changelog />
    </Box>
  );
}
