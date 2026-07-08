import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export default function ContenuLoading() {
  return (
    <Box
      aria-busy="true"
      aria-label="Chargement du contenu…"
      sx={{ px: { xs: 2, md: 4.5 }, py: { xs: 3, md: 3.5 }, maxWidth: 1560, width: '100%', mx: 'auto' }}
    >
      <Skeleton variant="text" width={160} height={44} />
      <Skeleton variant="text" width={340} height={24} sx={{ mb: 4 }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 380px' }, gap: 3.5 }}>
        <Stack spacing={1.5}>
          <Skeleton variant="rounded" height={64} />
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={56} />
          ))}
        </Stack>
        <Stack spacing={1.5}>
          <Skeleton variant="rounded" height={64} />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={48} />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
