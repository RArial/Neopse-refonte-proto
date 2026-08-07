import type { Metadata } from 'next';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { LienEditForm } from '@/components/contenu/lien/LienEditForm';

export const metadata: Metadata = {
  title: 'Modifier un raccourci',
};

interface EditLienPageProps {
  params: Promise<{ instanceId: string }>;
}

export default async function EditLienPage({ params }: EditLienPageProps) {
  const { instanceId } = await params;

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
          Modifier un raccourci
        </Typography>
      </Breadcrumbs>

      <LienEditForm instanceId={instanceId} />
    </Box>
  );
}
