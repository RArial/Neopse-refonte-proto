'use client';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import { useContenuStore } from '@/components/contenu/ContenuProvider';
import { LienForm } from '@/components/contenu/lien/LienForm';
import { ModuleNotFoundPanel } from '@/components/contenu/module/ModuleNotFoundPanel';

interface LienEditFormProps {
  instanceId: string;
}

export function LienEditForm({ instanceId }: LienEditFormProps) {
  const { modules } = useContenuStore();
  const existingLink = modules.find((mod) => mod.id === instanceId && mod.kind === 'link');

  if (!existingLink) {
    return (
      <ModuleNotFoundPanel
        title="Raccourci introuvable"
        message="Ce raccourci n'existe plus ou a été retiré de la structure de navigation."
      />
    );
  }

  const Icon = existingLink.icon ?? LinkOutlinedIcon;

  return (
    <>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ alignItems: 'center', mb: 2.5, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Avatar variant="rounded" sx={{ bgcolor: 'action.hover', color: 'text.secondary', width: 40, height: 40 }}>
          <Icon fontSize="small" />
        </Avatar>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Modifier un raccourci
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Modifiez les informations de « {existingLink.label} ».
          </Typography>
        </Box>
      </Stack>

      <LienForm mode="edit" existingLink={existingLink} />
    </>
  );
}
