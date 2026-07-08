import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export default function RubriqueLoading() {
  return (
    <Box
      aria-busy="true"
      aria-label="Chargement du formulaire de rubrique…"
      sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 880, width: '100%', mx: 'auto' }}
    >
      <Skeleton variant="text" width={160} height={20} sx={{ mb: 1.5 }} />
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2.5 }}>
        <Skeleton variant="rounded" width={40} height={40} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width={220} height={32} />
          <Skeleton variant="text" width={320} height={20} />
        </Box>
      </Stack>
      <Skeleton variant="rounded" height={520} />
    </Box>
  );
}
