import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export default function NewsPreviewLoading() {
  return (
    <Box aria-busy="true" aria-label="Chargement de l'aperçu…" sx={{ maxWidth: 880, mx: 'auto', p: 4 }}>
      <Skeleton variant="text" height={56} />
      <Skeleton variant="rounded" height={320} />
    </Box>
  );
}
