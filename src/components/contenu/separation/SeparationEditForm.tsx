'use client';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import HorizontalRuleOutlinedIcon from '@mui/icons-material/HorizontalRuleOutlined';
import { useContenuStore } from '@/components/contenu/ContenuProvider';
import { SeparationForm } from '@/components/contenu/separation/SeparationForm';
import { ModuleNotFoundPanel } from '@/components/contenu/module/ModuleNotFoundPanel';

interface SeparationEditFormProps {
  instanceId: string;
}

export function SeparationEditForm({ instanceId }: SeparationEditFormProps) {
  const { modules } = useContenuStore();
  const existingSeparation = modules.find((mod) => mod.id === instanceId && mod.kind === 'separator');

  if (!existingSeparation) {
    return (
      <ModuleNotFoundPanel
        title="Séparation introuvable"
        message="Cette séparation n'existe plus ou a été retirée de la structure de navigation."
      />
    );
  }

  return (
    <>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ alignItems: 'center', mb: 2.5, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Avatar variant="rounded" sx={{ bgcolor: 'action.hover', color: 'text.secondary', width: 40, height: 40 }}>
          <HorizontalRuleOutlinedIcon fontSize="small" />
        </Avatar>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Modifier une séparation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Modifiez les informations de « {existingSeparation.label} ».
          </Typography>
        </Box>
      </Stack>

      <SeparationForm mode="edit" existingSeparation={existingSeparation} />
    </>
  );
}
