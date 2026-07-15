'use client';

import { useRouter } from 'next/navigation';
import AddIcon from '@mui/icons-material/Add';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';

export function NewVariantCard() {
  const { createVariant } = usePersonnalisation();
  const router = useRouter();

  function handleCreate() {
    const newId = createVariant();
    router.push(`/dashboard/personnalisation/${newId}`);
  }

  return (
    <ButtonBase
      onClick={handleCreate}
      aria-label="Créer une nouvelle variante"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        aspectRatio: '16 / 10',
        minHeight: 180,
        width: '100%',
        border: '2px dashed',
        borderColor: 'divider',
        borderRadius: '12px',
        color: 'text.secondary',
        '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
      }}
    >
      <AddIcon />
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        Nouvelle variante
      </Typography>
    </ButtonBase>
  );
}
