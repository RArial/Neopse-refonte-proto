import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export default function MentionsLegalesLoading() {
  return (
    <Box
      aria-busy="true"
      aria-label="Chargement des mentions légales…"
      sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 880, width: '100%', mx: 'auto' }}
    >
      <Skeleton variant="text" width={160} height={20} sx={{ mb: 1.5 }} />
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2.5 }}>
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width={220} height={32} />
          <Skeleton variant="text" width={320} height={20} />
        </Box>
      </Stack>
      <Skeleton variant="rounded" height={40} sx={{ mb: 3 }} />
      <Skeleton variant="rounded" height={520} />
    </Box>
  );
}
