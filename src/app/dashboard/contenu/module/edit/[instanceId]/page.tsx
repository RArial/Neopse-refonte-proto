import type { Metadata } from 'next';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { ModuleEditForm } from '@/components/contenu/module/ModuleEditForm';

export const metadata: Metadata = {
  title: 'Modifier un module',
};

interface EditModulePageProps {
  params: Promise<{ instanceId: string }>;
}

export default async function EditModulePage({ params }: EditModulePageProps) {
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
            Contenu
          </Typography>
        </Link>
        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
          Modifier un module
        </Typography>
      </Breadcrumbs>

      <ModuleEditForm instanceId={instanceId} />
    </Box>
  );
}
