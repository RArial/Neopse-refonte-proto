'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';
import { VariantCard } from '@/components/personnalisation/hub/VariantCard';
import { NewVariantCard } from '@/components/personnalisation/hub/NewVariantCard';

export function VariantGrid() {
  const { variants } = usePersonnalisation();
  const savedVariants = variants.filter((v) => v.status === 'saved');

  return (
    <Box>
      {savedVariants.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Créez une variante pour préparer des changements sans toucher au site en ligne.
        </Typography>
      )}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 2 }}>
        {savedVariants.map((v) => (
          <VariantCard key={v.id} variant={v} />
        ))}
        <NewVariantCard />
      </Box>
    </Box>
  );
}
