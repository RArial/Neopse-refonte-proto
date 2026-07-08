'use client';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { useContenuStore } from '@/components/contenu/ContenuProvider';
import { ModuleForm } from '@/components/contenu/module/ModuleForm';
import { ModuleNotFoundPanel } from '@/components/contenu/module/ModuleNotFoundPanel';

interface ModuleEditFormProps {
  instanceId: string;
}

export function ModuleEditForm({ instanceId }: ModuleEditFormProps) {
  const { modules } = useContenuStore();
  const existingModule = modules.find((mod) => mod.id === instanceId && mod.kind === 'module');

  if (!existingModule) {
    return (
      <ModuleNotFoundPanel message="Ce module n'existe plus ou a été retiré de la structure de navigation." />
    );
  }

  const Icon = existingModule.icon ?? ArticleOutlinedIcon;

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
            Modifier un module
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Modifiez les informations de « {existingModule.label} ».
          </Typography>
        </Box>
      </Stack>

      <ModuleForm mode="edit" existingModule={existingModule} />
    </>
  );
}
