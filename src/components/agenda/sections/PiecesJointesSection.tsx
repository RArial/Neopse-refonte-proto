'use client';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

interface SectionProps {
  onNotify: (message: string) => void;
}

export function PiecesJointesSection({ onNotify }: SectionProps) {
  return (
    <Stack spacing={2}>
      <Button
        variant="contained"
        color="success"
        startIcon={<AddOutlinedIcon fontSize="small" />}
        onClick={() => onNotify("L'ajout de pièce jointe sera bientôt disponible.")}
        sx={{ alignSelf: 'flex-start' }}
      >
        Ajouter une pièce jointe
      </Button>
    </Stack>
  );
}
