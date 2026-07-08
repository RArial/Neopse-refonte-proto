import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { getDiscoverModule } from '@/lib/catalogModules';
import { UnlockModuleAction } from '@/components/contenu/module/UnlockModuleAction';

interface DiscoverModulePageProps {
  params: Promise<{ moduleId: string }>;
}

export async function generateMetadata({ params }: DiscoverModulePageProps): Promise<Metadata> {
  const { moduleId } = await params;
  const mod = getDiscoverModule(moduleId);
  return { title: mod ? `Découvrir ${mod.label}` : 'Module introuvable' };
}

export default async function DiscoverModulePage({ params }: DiscoverModulePageProps) {
  const { moduleId } = await params;
  const mod = getDiscoverModule(moduleId);

  if (!mod) {
    notFound();
  }

  const Icon = mod.icon;

  return (
    <Box
      component="section"
      sx={{
        px: { xs: 2, md: 3.5 },
        py: { xs: 2, md: 2.5 },
        maxWidth: 720,
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
          Découvrir un module
        </Typography>
      </Breadcrumbs>

      <Paper variant="outlined" sx={{ borderRadius: 3, p: { xs: 3, md: 4 } }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2.5 }}>
          <Avatar variant="rounded" sx={{ bgcolor: 'action.hover', color: 'text.secondary', width: 56, height: 56 }}>
            <Icon sx={{ fontSize: 28 }} />
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
              {mod.label}
            </Typography>
            <Chip
              icon={<LockOutlinedIcon sx={{ fontSize: 14 }} />}
              label="Non inclus dans votre forfait actuel"
              size="small"
              variant="outlined"
              sx={{ mt: 0.75 }}
            />
          </Box>
        </Stack>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3.5, lineHeight: 1.6 }}>
          {mod.description}
        </Typography>

        <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end', pt: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
          <Link href="/dashboard/contenu" style={{ textDecoration: 'none' }}>
            <Button variant="outlined" color="inherit" component="span">
              Annuler
            </Button>
          </Link>
          <UnlockModuleAction moduleId={mod.id} moduleLabel={mod.label} />
        </Stack>
      </Paper>
    </Box>
  );
}
