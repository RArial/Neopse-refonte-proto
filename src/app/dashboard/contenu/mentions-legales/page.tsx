import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { LegalPageEditorRoute } from '@/components/contenu/legal/LegalPageEditorRoute';

export const metadata: Metadata = {
  title: 'Mentions légales',
};

export default function MentionsLegalesPage() {
  return (
    <Box
      component="section"
      sx={{
        px: { xs: 2, md: 3.5 },
        py: { xs: 2, md: 2.5 },
        maxWidth: 880,
        width: '100%',
        mx: 'auto',
      }}
    >
      <Breadcrumbs
        separator={<NavigateNextIcon sx={{ fontSize: 16 }} />}
        aria-label="Fil d'Ariane"
        sx={{ mb: 1.5, fontSize: 13 }}
      >
        <Link href="/dashboard/contenu" style={{ textDecoration: 'none' }}>
          <Typography component="span" variant="body2" color="text.secondary" sx={{ '&:hover': { textDecoration: 'underline' } }}>
            Gestionnaire des pages
          </Typography>
        </Link>
        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
          Mentions légales
        </Typography>
      </Breadcrumbs>

      <Suspense fallback={null}>
        <LegalPageEditorRoute templateId="legal" />
      </Suspense>
    </Box>
  );
}
