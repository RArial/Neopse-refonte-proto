import type { Metadata } from 'next';
import Link from 'next/link';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { RubriqueForm } from '@/components/contenu/rubrique/RubriqueForm';

export const metadata: Metadata = {
  title: 'Ajouter une rubrique',
};

export default function NouvelleRubriquePage() {
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
            Contenu
          </Typography>
        </Link>
        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
          Ajouter une rubrique
        </Typography>
      </Breadcrumbs>

      <Stack
        direction="row"
        spacing={1.5}
        sx={{ alignItems: 'center', mb: 2.5, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Avatar variant="rounded" sx={{ bgcolor: 'action.hover', color: 'text.secondary', width: 40, height: 40 }}>
          <ArticleOutlinedIcon fontSize="small" />
        </Avatar>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Ajouter une rubrique
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Créez une page de contenu libre pour la structure de navigation.
          </Typography>
        </Box>
      </Stack>

      <RubriqueForm />
    </Box>
  );
}
