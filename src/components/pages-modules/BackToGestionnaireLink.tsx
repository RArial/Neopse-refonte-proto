import Link from 'next/link';
import Box from '@mui/material/Box';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';

/** Fil d'Ariane minimal affiché en tête de chaque page de gestion de module, pour revenir à la
 * structure de navigation du gestionnaire des pages sans dépendre du bouton « Retour » du navigateur. */
export function BackToGestionnaireLink() {
  return (
    <Box
      component={Link}
      href="/dashboard/contenu"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        mb: 1.5,
        fontSize: 13,
        fontWeight: 600,
        color: 'text.secondary',
        textDecoration: 'none',
        '&:hover': { color: 'text.primary', textDecoration: 'underline' },
        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2, borderRadius: 1 },
      }}
    >
      <ArrowBackOutlinedIcon sx={{ fontSize: 15 }} aria-hidden="true" />
      Revenir au gestionnaire des pages
    </Box>
  );
}
