'use client';

import Image from 'next/image';
import Link from 'next/link';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import { ToolLogo } from '@/components/services/ToolLogo';
import { TOOLS, type ToolItem } from '@/lib/tools';

/** Visuellement masqué mais toujours lu par les lecteurs d'écran : sert de nom accessible à la card quand
 * le titre visible est déjà porté par le logo (ex. le bandeau eTicket), pour éviter la redondance visuelle. */
const visuallyHiddenSx = {
  position: 'absolute' as const,
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap' as const,
  border: 0,
};

function ServicesHeader() {
  return (
    <Box sx={{ mb: 3.5 }}>
      <Typography component="h1" variant="h4" sx={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.01em', mb: 0.375 }}>
        Outils
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 14 }}>
        Retrouvez les différents outils proposés par INEDI pour votre projet Mairie de Vercourt.
      </Typography>
    </Box>
  );
}

function ToolCard({ tool }: { tool: ToolItem }) {
  const titleId = `tool-${tool.id}-title`;
  // Seul l'outil actif (Neopse, déjà en service) renvoie quelque part — vers son propre tableau de bord.
  // Les outils non activés (Localiti, eTicket) restent de simples cards de présentation, sans navigation.
  const isClickable = tool.active;

  return (
    <Box
      component={isClickable ? Link : 'article'}
      href={isClickable ? '/dashboard' : undefined}
      aria-labelledby={titleId}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '20px',
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'inherit',
        ...(isClickable && {
          transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease',
          '&:hover': { transform: 'translateY(-4px)', boxShadow: 6, borderColor: tool.accentColor },
          '&:focus-visible': { outline: '2px solid', outlineColor: tool.accentColor, outlineOffset: 2 },
          '&:hover .tool-cta': { transform: 'translateX(4px)' },
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
            '&:hover': { transform: 'none' },
            '&:hover .tool-cta': { transform: 'none' },
          },
        }),
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0, p: { xs: 2.5, md: 3 }, display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1.5 }}>
          <ToolLogo tool={tool} />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography id={titleId} component="h3" sx={tool.logoContainsWordmark ? visuallyHiddenSx : { fontSize: 17, fontWeight: 700 }}>
              {tool.title}
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: 'text.secondary', fontWeight: 600 }}>{tool.tagline}</Typography>
          </Box>
          <Chip
            size="small"
            icon={tool.active ? <CheckCircleOutlineIcon /> : <HighlightOffOutlinedIcon />}
            label={tool.active ? 'Actif' : 'Inactif'}
            color={tool.active ? 'success' : 'default'}
            variant={tool.active ? 'filled' : 'outlined'}
            sx={{
              height: 26,
              fontSize: 12.5,
              fontWeight: 700,
              flexShrink: 0,
              '& .MuiChip-icon': { fontSize: 16, color: tool.active ? 'inherit' : undefined },
            }}
          />
        </Stack>

        <Typography sx={{ fontSize: 13.5, color: 'text.secondary', lineHeight: 1.6, mb: 2 }}>{tool.description}</Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.25, mb: 2 }}>
          {tool.features.map((feature) => {
            const FeatureIcon = feature.icon;
            return (
              <Stack key={feature.label} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <FeatureIcon sx={{ fontSize: 17, color: tool.accentColor, flexShrink: 0 }} />
                <Typography sx={{ fontSize: 13, color: 'text.primary', fontWeight: 500 }}>{feature.label}</Typography>
              </Stack>
            );
          })}
        </Box>

        {isClickable && (
          <Stack
            className="tool-cta"
            direction="row"
            spacing={0.5}
            sx={{
              alignItems: 'center',
              mt: 'auto',
              alignSelf: 'flex-end',
              fontSize: 13,
              fontWeight: 700,
              color: tool.accentColor,
              transition: 'transform 200ms ease',
              '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
            }}
          >
            <span>Gérer</span>
            <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </Stack>
        )}
      </Box>

      <Box
        sx={{
          position: 'relative',
          width: { xs: '100%', md: 320 },
          minHeight: { xs: 200, md: 'auto' },
          flexShrink: 0,
          bgcolor: '#fff',
        }}
      >
        <Image src={tool.mockupSrc} alt={tool.mockupAlt} fill sizes="(max-width: 900px) 100vw, 320px" style={{ objectFit: 'cover' }} />
      </Box>
    </Box>
  );
}

export function ServicesOverview() {
  return (
    <Box sx={{ p: '28px 36px 64px', maxWidth: 1180, width: '100%', mx: 'auto' }}>
      <ServicesHeader />

      <Alert severity="warning" sx={{ mb: 3 }}>
        <AlertTitle>Abonnement bientôt expiré</AlertTitle>
        Votre abonnement à <strong>Neopse — Site internet</strong> arrive à expiration le 15 septembre 2026. Contactez
        INEDI pour le renouveler et éviter toute interruption de service.
      </Alert>

      <Stack component="section" aria-label="Outils disponibles" spacing={2.5}>
        {TOOLS.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </Stack>
    </Box>
  );
}
