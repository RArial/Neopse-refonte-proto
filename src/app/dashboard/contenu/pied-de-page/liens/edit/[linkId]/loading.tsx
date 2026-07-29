import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export default function EditLienLoading() {
  return (
    <Box
      aria-busy="true"
      aria-label="Chargement du formulaire de lien…"
      sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 720, width: '100%', mx: 'auto' }}
    >
      <Skeleton variant="text" width={160} height={20} sx={{ mb: 1.5 }} />
      <Skeleton variant="text" width={220} height={32} sx={{ mb: 2.5 }} />
      <Skeleton variant="rounded" height={260} />
    </Box>
  );
}
