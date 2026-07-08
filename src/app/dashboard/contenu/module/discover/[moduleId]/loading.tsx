import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export default function DiscoverModuleLoading() {
  return (
    <Box
      aria-busy="true"
      aria-label="Chargement du module…"
      sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 720, width: '100%', mx: 'auto' }}
    >
      <Skeleton variant="text" width={160} height={20} sx={{ mb: 1.5 }} />
      <Skeleton variant="rounded" height={320} sx={{ borderRadius: 3 }} />
      <Stack direction="row" spacing={1.5} sx={{ mt: 2.5, alignItems: 'center' }}>
        <Skeleton variant="rounded" width={56} height={56} />
        <Skeleton variant="text" width={220} height={32} />
      </Stack>
    </Box>
  );
}
